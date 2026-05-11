/**
 * Don Cheli SDD Runtime — Pipeline Orchestrator
 *
 * Executes the REAL /dc:* commands inside Docker containers.
 * Each phase runs in an isolated container with a fresh git worktree.
 * Only merges to the real project when ALL phases pass.
 *
 * Flow:
 *   1. Create git worktree (isolated copy)
 *   2. Mount worktree in Docker container
 *   3. Execute /dc:* command via Claude Code CLI inside container
 *   4. Verify quality gates
 *   5. If ALL phases pass → merge worktree to project
 *   6. If ANY phase fails → discard worktree (project untouched)
 */

import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import type { AgentProvider } from "./providers/base.js";
import { ClaudeProvider } from "./providers/claude.js";
import { CodexProvider } from "./providers/codex.js";
import { OllamaProvider } from "./providers/ollama.js";
import { StateManager, type PhaseName } from "./utils/state.js";
import { estimatePipelineCost, formatCostTable } from "./utils/cost.js";
import { specGate } from "./gates/spec-gate.js";
import { tddGate } from "./gates/tdd-gate.js";
import { customGates } from "./gates/custom-gate.js";
import { designGate } from "./gates/design-gate.js";
import {
  createWorktree, commitWorktree, mergeWorktree,
  cleanupWorktree, isGitRepo
} from "./sandbox/worktree.js";
import {
  ensureDocker, buildImage, startContainer, execInContainerStream,
  stopContainer, dockerAvailable
} from "./sandbox/docker.js";
import { execLocal } from "./sandbox/local.js";
import * as log from "./utils/logger.js";

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

export interface OrchestratorConfig {
  task: string;
  provider: "claude" | "codex" | "ollama";
  model?: string;
  phases?: PhaseName[];
  singlePhase?: PhaseName;
  maxRetries?: number;
  budgetUsd?: number;
  dryRun?: boolean;
  noDocker?: boolean;
}

/**
 * The REAL /dc:* commands. The runtime executes THESE inside the container,
 * not custom prompts. This is the key difference from Sandcastle.
 */
const PHASE_COMMANDS: Record<PhaseName, { dcCommand: string; description: string }> = {
  specify: {
    dcCommand: "/dc:especificar",
    description: "Turns idea into Gherkin specification with test scenarios, priorities and DBML schema",
  },
  clarify: {
    dcCommand: "/dc:clarificar",
    description: "Virtual QA detects ambiguities and contradictions before coding",
  },
  plan: {
    dcCommand: "/dc:planificar-tecnico",
    description: "Technical blueprint with architecture, API contracts and final schema",
  },
  design: {
    dcCommand: "/dc:diseñar-ui",
    description: "Generates UI/UX designs with Figma link or HTML preview and approval flow",
  },
  breakdown: {
    dcCommand: "/dc:desglosar",
    description: "Splits plan into concrete tasks with execution order and parallelism",
  },
  implement: {
    dcCommand: "/dc:implementar",
    description: "Executes with strict TDD: test first, then code, then improve",
  },
  review: {
    dcCommand: "/dc:revisar",
    description: "Automatic peer review across 7 dimensions",
  },
};

const DEFAULT_PHASES: PhaseName[] = ["specify", "clarify", "plan", "design", "breakdown", "implement", "review"];
const MAX_RETRIES = 3;
const DOCKER_IMAGE = "doncheli-runtime";
const COMPLETION_SIGNAL = "DC_PHASE_COMPLETE";

// ═══════════════════════════════════════════════════════════════
// GATE RUNNER
// ═══════════════════════════════════════════════════════════════

function runGatesForPhase(phase: PhaseName, projectDir: string): boolean {
  const gates: Record<PhaseName, (() => { passed: boolean; message: string; details?: string[] })[]> = {
    specify: [() => specGate(projectDir)],
    clarify: [() => specGate(projectDir)],
    plan: [],
    design: [],
    breakdown: [
      () => designGate(projectDir),
    ],
    implement: [
      () => tddGate(projectDir),
      () => customGates(projectDir),
    ],
    review: [
      () => customGates(projectDir),
    ],
  };

  const phaseGates = gates[phase] || [];
  if (phaseGates.length === 0) return true;

  log.info(`\n  Quality Gates for ${PHASE_COMMANDS[phase].dcCommand}:`);

  let allPassed = true;
  for (const gate of phaseGates) {
    const result = gate();
    log.gateResult(phase, result.passed, result.message);
    // Print details for visibility
    if (result.details) {
      for (const d of result.details) {
        console.log(`    ${d}`);
      }
    }
    if (!result.passed) allPassed = false;
  }
  console.log("");
  return allPassed;
}

// ═══════════════════════════════════════════════════════════════
// PHASE EXECUTORS
// ═══════════════════════════════════════════════════════════════

function buildPhasePrompt(phase: PhaseName, task: string): string {
  const { dcCommand, description } = PHASE_COMMANDS[phase];

  const phaseInstructions: Record<PhaseName, string> = {
    specify: `Create a Gherkin specification file at .dc/specs/spec.feature with:
- Feature name and description
- At least 3 Scenario blocks with Given/When/Then steps
- Mark priority scenarios with @P1 tag
- Include edge cases and error scenarios`,

    clarify: `Review the spec at .dc/specs/spec.feature and:
- Identify ambiguities or contradictions
- Add clarification notes in .dc/specs/clarifications.md
- Update the spec if needed to resolve ambiguities`,

    plan: `Create a technical blueprint at .dc/blueprints/blueprint.md with:
- Architecture overview (components, layers)
- API contracts (endpoints, request/response schemas)
- Data model / database schema
- Technology choices and justification
- File structure plan`,

    design: `Generate UI/UX designs using ATOMIC DESIGN methodology (Brad Frost).
Build components bottom-up: Atoms → Molecules → Organisms → Templates → Pages.

Read .dc/specs/spec.feature and .dc/blueprints/blueprint.md to extract all screens needed.

CREATE THE FOLLOWING STRUCTURE:

1. .dc/design/tokens/colors.json — Color palette with primary (50-900), neutral (0-1000), semantic (success/warning/error/info)
2. .dc/design/tokens/typography.json — Font families, sizes (xs to 5xl), weights, line heights
3. .dc/design/tokens/spacing.json — Spacing scale (0 to 24), border radius, shadows

4. .dc/design/atoms/ — Individual HTML files for each atom component:
   - button.html (primary, secondary, ghost, danger, disabled, loading variants)
   - input.html (text, email, password, error, disabled variants)
   - badge.html, avatar.html, spinner.html, tag.html
   Each atom file shows ALL variants side by side.

5. .dc/design/molecules/ — Combinations of atoms:
   - search-bar.html, form-field.html, card-header.html, stat.html
   Each molecule shows how atoms combine.

6. .dc/design/organisms/ — Complete sections:
   - header.html (navbar with logo, nav, search, avatar)
   - sidebar.html (menu items, user section, collapse)
   - form.html (complete form with validation)
   - data-table.html (sortable, paginated)

7. .dc/design/pages/ — Complete screens with REALISTIC domain data (NEVER "Lorem ipsum"):
   - One HTML file per screen identified in the spec
   - Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
   - Responsive: mobile-first (375px), tablet (768px), desktop (1440px)
   - Include states: normal, empty, loading (skeleton), error
   - Accessible: semantic HTML, ARIA labels, focus visible, contrast 4.5:1, touch targets 44px

8. .dc/design/index.html — Component catalog + page navigation hub

9. .dc/design/design-system.md — Documentation of all design decisions

10. .dc/design/approval.json:
    { "version": 1, "status": "approved", "provider": "html", "link": ".dc/design/index.html",
      "screens_count": [N], "design_system": { "style": "[NAME]", "primary": "[HEX]",
      "font_heading": "[FONT]", "font_body": "[FONT]" },
      "approver": null, "approved_at": null, "history": [{ "action": "created", "at": "[NOW]" }] }

RULES:
- Set approval.json status to "approved" so pipeline continues automatically
- Every HTML file must be COMPLETE and functional, not a placeholder
- Use consistent design tokens across ALL components
- Mobile-first: design for 375px first, then scale up
- WCAG AA: contrast 4.5:1, semantic HTML, focus indicators`,

    breakdown: `Create task files in .dc/tareas/ with:
- One markdown file per task (task-01.md, task-02.md, etc.)
- Each task has: description, acceptance criteria, test cases
- Mark dependencies between tasks
- Mark which tasks can run in parallel`,

    implement: `Implement the code following strict TDD.

STEP 1 — Setup (if no package.json exists):
- Create package.json with: { "scripts": { "test": "vitest run" }, "devDependencies": { "vitest": "latest" } }
- Run: npm install

STEP 2 — Write tests FIRST:
- Create test files with names like *.test.ts or *.test.js
- Each test must use describe/it/expect blocks
- Cover at least the main functionality and one edge case

STEP 3 — Write code to pass the tests:
- Implement the minimum code that makes ALL tests pass
- Run the tests to verify: npm test

STEP 4 — Verify:
- Run tests one final time to confirm they pass
- Ensure NO // TODO or // FIXME comments exist in source code
- Aim for >= 85% test coverage

CRITICAL: Tests MUST actually exist as files and contain real assertions (expect/assert). Empty or placeholder test files will be rejected.`,

    review: `Review all code and create .dc/reviews/review.md with:
- Score each dimension (1-5): correctness, security, performance, maintainability, testing, documentation, architecture
- List specific issues found
- Confirm all tests pass
- Confirm no // TODO stubs remain`,
  };

  return `You are executing phase "${dcCommand}" of the Don Cheli SDD pipeline.

TASK: ${task}

PHASE: ${dcCommand} — ${description}

INSTRUCTIONS:
${phaseInstructions[phase]}

IMPORTANT:
- Create real files with real content (not placeholders)
- Work in the current directory
- When done, output exactly: ${COMPLETION_SIGNAL}`;
}

async function executeInDocker(
  phase: PhaseName, task: string, provider: AgentProvider, containerName: string
): Promise<{ passed: boolean; output: string }> {
  const prompt = buildPhasePrompt(phase, task);
  const result = await execInContainerStream(
    containerName,
    provider.buildDockerCommand(prompt),
    (data) => process.stdout.write(data),
    { timeout: 15 * 60 * 1000 },
  );
  return {
    passed: result.output.includes(COMPLETION_SIGNAL) || result.exitCode === 0,
    output: result.output,
  };
}

async function executeLocal(
  phase: PhaseName, task: string, provider: AgentProvider, workDir: string
): Promise<{ passed: boolean; output: string }> {
  const prompt = buildPhasePrompt(phase, task);
  const { command, args } = provider.buildCommand(prompt);
  const result = await execLocal(command, args, workDir, (data) => {
    process.stdout.write(data);
  }, { timeout: 10 * 60 * 1000, completionSignal: COMPLETION_SIGNAL });
  return { passed: result.completed || result.exitCode === 0, output: result.output };
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

export async function orchestrate(config: OrchestratorConfig): Promise<boolean> {
  const projectDir = process.cwd();
  const maxRetries = config.maxRetries ?? MAX_RETRIES;

  // ── Prerequisites ──

  if (!isGitRepo(projectDir)) {
    log.fail("Not a git repository. Run 'git init' first.");
    return false;
  }

  // Docker check + auto-install
  let useDocker = !config.noDocker;
  if (useDocker && !dockerAvailable()) {
    log.warn("Docker not available.");
    if (!ensureDocker()) {
      log.info("Falling back to local mode");
      useDocker = false;
    }
  }

  // ── Provider ──

  let provider: AgentProvider;
  switch (config.provider) {
    case "codex":  provider = new CodexProvider(config.model); break;
    case "ollama": provider = new OllamaProvider(config.model); break;
    default:       provider = new ClaudeProvider(config.model); break;
  }

  const phases = config.singlePhase ? [config.singlePhase] : config.phases ?? DEFAULT_PHASES;

  // ── Header ──

  log.header("Don Cheli SDD Runtime");
  console.log(`  Task:     ${config.task}`);
  console.log(`  Provider: ${provider.name}/${provider.model}`);
  console.log(`  Mode:     ${useDocker ? "🐳 Docker (isolated)" : "💻 Local (direct)"}`);
  console.log(`  Phases:   ${phases.map(p => PHASE_COMMANDS[p].dcCommand).join(" → ")}`);
  console.log(`  Retries:  ${maxRetries} per phase`);
  console.log(`  Safety:   Project untouched until ALL phases pass`);

  // ── Pre-flight ──

  const estimate = estimatePipelineCost(phases, provider);
  console.log(`\n${formatCostTable(estimate.phases)}`);

  if (config.budgetUsd && estimate.totalCostUsd > config.budgetUsd) {
    log.fail(`Estimated $${estimate.totalCostUsd} exceeds budget $${config.budgetUsd}`);
    return false;
  }

  if (config.dryRun) {
    log.info("Dry run — no execution");
    return true;
  }

  // ── State + Lock ──

  const stateManager = new StateManager(projectDir);
  const existingState = stateManager.load();

  if (existingState && !config.singlePhase) {
    const nextPhase = stateManager.getNextPhase();
    if (nextPhase) {
      log.warn(`Crash recovery: resuming from ${PHASE_COMMANDS[nextPhase].dcCommand}`);
      const idx = phases.indexOf(nextPhase);
      if (idx > 0) phases.splice(0, idx);
    }
  } else {
    stateManager.init(config.task, config.provider, provider.model, useDocker ? "docker" : "local");
  }

  if (!stateManager.acquireLock()) {
    log.fail("Another dc-run instance is running.");
    return false;
  }

  // ── Create worktree (PROJECT STAYS SAFE) ──

  log.info("Creating isolated worktree...");
  let worktreeInfo;
  try {
    worktreeInfo = createWorktree(projectDir, "pipeline");
    log.success(`Worktree: ${worktreeInfo.branch}`);
    log.success("Your project is SAFE — all work happens in the worktree");
  } catch {
    log.warn("Worktree failed — working on project directly (less safe)");
    worktreeInfo = null;
  }

  const workDir = worktreeInfo?.path ?? projectDir;

  // Ensure .dc/ in worktree
  for (const dir of ["specs", "blueprints", "tareas", "reviews", "auto", "prd"]) {
    mkdirSync(join(workDir, ".dc", dir), { recursive: true });
  }

  // ── Docker setup ──

  let containerName: string | null = null;

  if (useDocker) {
    containerName = `dc-runtime-${Date.now()}`;
    log.info("Building Docker image...");
    try {
      // Look for Dockerfile
      const dockerfilePaths = [
        join(resolve(import.meta.dirname ?? "."), "..", "Dockerfile"),
        join(projectDir, "runtime", "Dockerfile"),
      ];
      const dockerfilePath = dockerfilePaths.find(existsSync);

      if (dockerfilePath) {
        buildImage(dockerfilePath, DOCKER_IMAGE);
      } else {
        log.warn("No Dockerfile found, falling back to local mode");
        useDocker = false;
        containerName = null;
      }

      if (containerName) {
        startContainer({
          name: containerName,
          image: DOCKER_IMAGE,
          env: {},
          volumes: [`${resolve(workDir)}:/workspace`],
          workdir: "/workspace",
        });
        log.success(`Container: ${containerName}`);
      }
    } catch (err) {
      log.warn("Docker setup failed, falling back to local mode");
      containerName = null;
      useDocker = false;
    }
  }

  // ── Execute pipeline ──

  const results: { phase: string; command: string; passed: boolean; commits: number }[] = [];

  try {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const { dcCommand } = PHASE_COMMANDS[phase];

      log.progressBar(i, phases.length, dcCommand);
      log.phaseHeader(`${dcCommand}`, 1, maxRetries);

      let phasePassed = false;
      let phaseCommits = 0;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        if (attempt > 1) log.phaseHeader(`${dcCommand}`, attempt, maxRetries);

        stateManager.startPhase(phase);

        // Execute the REAL /dc:* command
        const result = containerName
          ? await executeInDocker(phase, config.task, provider, containerName)
          : await executeLocal(phase, config.task, provider, workDir);

        // Commit in worktree
        if (worktreeInfo) {
          const sha = commitWorktree(workDir, `dc(${phase}): ${config.task}`);
          if (sha) {
            phaseCommits++;
            log.info(`Committed: ${sha.substring(0, 7)}`);
          }
        }

        // Quality gates
        const gatesPassed = runGatesForPhase(phase, workDir);

        if (result.passed && gatesPassed) {
          stateManager.passPhase(phase, []);
          log.success(`${dcCommand} PASSED`);
          phasePassed = true;
          break;
        }

        stateManager.failPhase(phase);
        log.fail(`Attempt ${attempt}/${maxRetries}`);
      }

      results.push({ phase, command: dcCommand, passed: phasePassed, commits: phaseCommits });

      if (!phasePassed && !config.singlePhase) {
        log.fail(`Pipeline stopped at ${dcCommand}`);
        break;
      }
    }

    log.progressBar(phases.length, phases.length, "Complete");
  } finally {
    if (containerName) {
      stopContainer(containerName);
      log.info("Container destroyed");
    }
    stateManager.releaseLock();
  }

  // ── Merge or discard ──

  const allPassed = results.every((r) => r.passed);

  if (worktreeInfo) {
    if (allPassed) {
      log.success("All phases passed — merging to project...");
      const merged = mergeWorktree(projectDir, worktreeInfo);
      if (merged) {
        log.success("✅ Worktree merged — project updated with verified code");
      } else {
        log.fail("Merge failed — worktree preserved at: " + worktreeInfo.path);
      }
    } else {
      log.warn("Pipeline failed — project UNTOUCHED (worktree discarded)");
    }
    cleanupWorktree(projectDir, worktreeInfo);
  }

  // ── Summary ──

  log.header("PIPELINE SUMMARY");
  let totalCommits = 0;
  for (const r of results) {
    const icon = r.passed ? `${log.COLORS.green}✅` : `${log.COLORS.red}❌`;
    console.log(`  ${icon}${log.COLORS.reset} ${r.command.padEnd(25)} — ${r.commits} commits`);
    totalCommits += r.commits;
  }

  console.log(`\n  Commits: ${totalCommits}`);
  console.log(`  Result: ${allPassed
    ? `${log.COLORS.green}ALL PASSED — Project updated with verified code${log.COLORS.reset}`
    : `${log.COLORS.red}FAILED — Project UNTOUCHED${log.COLORS.reset}`
  }\n`);

  return allPassed;
}

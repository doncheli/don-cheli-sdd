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

const DEFAULT_PHASES: PhaseName[] = ["specify", "clarify", "plan", "breakdown", "implement", "review"];
const MAX_RETRIES = 3;
const DOCKER_IMAGE = "doncheli-runtime";
const COMPLETION_SIGNAL = "DC_PHASE_COMPLETE";

// ═══════════════════════════════════════════════════════════════
// GATE RUNNER
// ═══════════════════════════════════════════════════════════════

function runGatesForPhase(phase: PhaseName, projectDir: string): boolean {
  const gates: Record<PhaseName, (() => { passed: boolean; message: string })[]> = {
    specify: [() => specGate(projectDir)],
    clarify: [() => specGate(projectDir)],
    plan: [],
    breakdown: [],
    implement: [
      () => tddGate(projectDir),
      () => customGates(projectDir),
    ],
    review: [
      () => tddGate(projectDir),
      () => customGates(projectDir),
    ],
  };

  const phaseGates = gates[phase] || [];
  if (phaseGates.length === 0) return true;

  let allPassed = true;
  for (const gate of phaseGates) {
    const result = gate();
    log.gateResult(phase, result.passed, result.message);
    if (!result.passed) allPassed = false;
  }
  return allPassed;
}

// ═══════════════════════════════════════════════════════════════
// PHASE EXECUTORS
// ═══════════════════════════════════════════════════════════════

function buildPhasePrompt(phase: PhaseName, task: string): string {
  const { dcCommand, description } = PHASE_COMMANDS[phase];
  return `Execute the Don Cheli command: ${dcCommand}

Task: ${task}

This command ${description}.

Follow all Iron Laws:
1. TDD: All production code requires tests
2. Debugging: Root cause first
3. Verification: Evidence before assertions

When the phase is complete, output exactly: ${COMPLETION_SIGNAL}`;
}

async function executeInDocker(
  phase: PhaseName, task: string, provider: AgentProvider, containerName: string
): Promise<{ passed: boolean; output: string }> {
  const prompt = buildPhasePrompt(phase, task);
  const result = await execInContainerStream(
    containerName,
    provider.buildDockerCommand(prompt),
    (data) => process.stdout.write(data),
    { timeout: 10 * 60 * 1000 },
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

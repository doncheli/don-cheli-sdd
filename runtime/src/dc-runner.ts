/**
 * Don Cheli SDD Runtime — Sandcastle Orchestrator
 *
 * Executes the SDD pipeline in isolated Docker containers.
 * Each phase gets a fresh context (200K clean) via git worktrees.
 *
 * Usage:
 *   npx tsx runtime/src/dc-runner.ts "Implement JWT authentication"
 *   npx tsx runtime/src/dc-runner.ts --phase specify "JWT auth"
 *   npx tsx runtime/src/dc-runner.ts --parallel T001,T002 "JWT auth"
 */

import { run, claudeCode, type RunResult } from "@ai-hero/sandcastle";

// ═══════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════

const MODEL = process.env.DC_MODEL || "claude-sonnet-4-6";
const MAX_RETRIES = 3;
const COMPLETION_SIGNAL = "<dc>PHASE_COMPLETE</dc>";

interface PhaseConfig {
  name: string;
  prompt: string;
  maxIterations: number;
  dependsOn?: string[];
}

// ═══════════════════════════════════════════════════════════════
// PHASES
// ═══════════════════════════════════════════════════════════════

function buildPhases(task: string): PhaseConfig[] {
  return [
    {
      name: "specify",
      maxIterations: 3,
      prompt: `You are a Don Cheli SDD agent. Your ONLY job is to generate a Gherkin specification.

TASK: ${task}

INSTRUCTIONS:
1. Read the codebase to understand the existing architecture
2. Generate a Gherkin .feature file with P1/P2/P3 scenarios in .dc/specs/
3. Generate a DBML schema in .dc/specs/ if data persistence is needed
4. Create .dc/config.yaml if it doesn't exist
5. Update .dc/estado.md with phase: "specify" and progress

OUTPUT: Write files directly. When done, output exactly: ${COMPLETION_SIGNAL}

RULES:
- Include at least 3 P1 scenarios (happy path + error cases)
- Each scenario must have Given/When/Then
- Mark ambiguities with [NEEDS CLARIFICATION]
- All code comments in English, all specs in the project language`,
    },
    {
      name: "clarify",
      maxIterations: 2,
      dependsOn: ["specify"],
      prompt: `You are a Don Cheli QA agent. Your ONLY job is to find and resolve ambiguities in specs.

TASK: Review the specifications generated in the previous phase.

INSTRUCTIONS:
1. Read .dc/specs/*.feature
2. Find ambiguities, contradictions, missing edge cases
3. Resolve all [NEEDS CLARIFICATION] markers
4. Verify schema consistency (DBML vs Gherkin)
5. Update .dc/estado.md

OUTPUT: Update the .feature files directly. When done, output exactly: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "plan",
      maxIterations: 3,
      dependsOn: ["clarify"],
      prompt: `You are a Don Cheli architect agent. Your ONLY job is to generate a technical blueprint.

TASK: Create a technical plan from the specifications.

INSTRUCTIONS:
1. Read .dc/specs/*.feature and .dc/specs/*.dbml
2. Generate a blueprint in .dc/blueprints/ with:
   - Architecture decisions (layers, patterns)
   - API contracts (endpoints, request/response)
   - Data model (tables, relationships)
   - Security considerations
3. Update .dc/estado.md

OUTPUT: Write blueprint to .dc/blueprints/. When done, output exactly: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "breakdown",
      maxIterations: 2,
      dependsOn: ["plan"],
      prompt: `You are a Don Cheli task planner. Your ONLY job is to break down the blueprint into TDD tasks.

TASK: Create TDD tasks from the blueprint.

INSTRUCTIONS:
1. Read .dc/blueprints/*.md
2. Generate tasks in .dc/tareas/ with:
   - Task IDs: T001, T002, ...
   - Parallelism markers: [P] for tasks that can run in parallel
   - For each task: which test to write first, which file to create
   - Dependencies between tasks
3. Update .dc/estado.md

OUTPUT: Write tasks to .dc/tareas/. When done, output exactly: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "implement",
      maxIterations: 10,
      dependsOn: ["breakdown"],
      prompt: `You are a Don Cheli TDD developer. Your ONLY job is to implement code following strict TDD.

TASK: Implement ALL tasks from .dc/tareas/

INSTRUCTIONS:
1. Read .dc/tareas/*.md for the task list
2. For EACH task, follow TDD strictly:
   a. Write the test FIRST (it must FAIL — RED)
   b. Write the MINIMUM code to make it pass (GREEN)
   c. Refactor if needed
3. Run tests after each task to verify
4. Coverage must be >= 85%
5. NO stubs (// TODO) allowed
6. Update .dc/estado.md after each task

IRON LAW: No production code without a test. If you write code without a test, you are violating the Iron Law.

OUTPUT: Write code and tests directly. When ALL tasks pass, output exactly: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "review",
      maxIterations: 3,
      dependsOn: ["implement"],
      prompt: `You are a Don Cheli code reviewer. Your ONLY job is to review the implementation.

TASK: Peer review across 7 dimensions.

INSTRUCTIONS:
1. Read ALL code changes (new files, modified files)
2. Review across 7 dimensions:
   - Functional correctness (does it match specs?)
   - Tests (TDD compliance, coverage >= 85%)
   - Performance (N+1 queries, unnecessary loops)
   - Architecture (SOLID, separation of concerns)
   - Security (OWASP top 10, input validation)
   - Maintainability (naming, complexity, docs)
   - Documentation (README, comments where needed)
3. Write review to .dc/reviews/
4. If critical issues found, fix them directly
5. Update .dc/estado.md with final status

OUTPUT: Write review to .dc/reviews/. When done, output exactly: ${COMPLETION_SIGNAL}`,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// RUNNER
// ═══════════════════════════════════════════════════════════════

interface PhaseResult {
  phase: string;
  success: boolean;
  iterations: number;
  commits: number;
  output: string;
  error?: string;
}

async function runPhase(phase: PhaseConfig): Promise<PhaseResult> {
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  Phase: ${phase.name.toUpperCase()}`);
  console.log(`  Model: ${MODEL}`);
  console.log(`  Max iterations: ${phase.maxIterations}`);
  console.log(`${"═".repeat(50)}\n`);

  let lastError: string | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result: RunResult = await run({
        agent: claudeCode(MODEL),
        prompt: phase.prompt,
        maxIterations: phase.maxIterations,
        worktree: { mode: "temp-branch" },
        completionSignal: COMPLETION_SIGNAL,
        idleTimeoutSeconds: 300,
        name: `dc-${phase.name}`,
        logging: { type: "stdout" },
      });

      const success = result.completionSignal !== undefined;

      console.log(`\n  Result: ${success ? "✅ PASSED" : "⚠️ No completion signal"}`);
      console.log(`  Iterations: ${result.iterationsRun}`);
      console.log(`  Commits: ${result.commits.length}`);
      console.log(`  Branch: ${result.branch}`);

      if (success || result.commits.length > 0) {
        return {
          phase: phase.name,
          success,
          iterations: result.iterationsRun,
          commits: result.commits.length,
          output: result.stdout,
        };
      }

      lastError = "No completion signal and no commits";
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ Attempt ${attempt}/${MAX_RETRIES} failed: ${lastError}`);
    }
  }

  return {
    phase: phase.name,
    success: false,
    iterations: 0,
    commits: 0,
    output: "",
    error: lastError,
  };
}

async function runPipeline(task: string, onlyPhase?: string) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Don Cheli SDD Runtime — Sandcastle Orchestrator`);
  console.log(`${"═".repeat(60)}`);
  console.log(`\n  Task: ${task}`);
  console.log(`  Model: ${MODEL}`);
  console.log(`  Phases: ${onlyPhase || "all (specify → review)"}\n`);

  const phases = buildPhases(task);
  const results: PhaseResult[] = [];

  const phasesToRun = onlyPhase
    ? phases.filter((p) => p.name === onlyPhase)
    : phases;

  for (const phase of phasesToRun) {
    const result = await runPhase(phase);
    results.push(result);

    if (!result.success && !onlyPhase) {
      console.error(`\n  🛑 Pipeline stopped at phase: ${phase.name}`);
      console.error(`  Error: ${result.error}`);
      break;
    }
  }

  // Summary
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  PIPELINE SUMMARY`);
  console.log(`${"═".repeat(60)}\n`);

  let totalCommits = 0;
  let totalIterations = 0;

  for (const r of results) {
    const icon = r.success ? "✅" : "❌";
    console.log(`  ${icon} ${r.phase.padEnd(12)} — ${r.commits} commits, ${r.iterations} iterations`);
    totalCommits += r.commits;
    totalIterations += r.iterations;
  }

  const allPassed = results.every((r) => r.success);
  console.log(`\n  Total: ${totalCommits} commits, ${totalIterations} iterations`);
  console.log(`  Result: ${allPassed ? "✅ ALL PHASES PASSED" : "❌ PIPELINE FAILED"}\n`);

  return allPassed;
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
let phase: string | undefined;
let task: string;

const phaseIdx = args.indexOf("--phase");
if (phaseIdx !== -1) {
  phase = args[phaseIdx + 1];
  args.splice(phaseIdx, 2);
}

task = args.join(" ");

if (!task) {
  console.log(`
  Don Cheli SDD Runtime

  Usage:
    npx tsx runtime/src/dc-runner.ts "Your task description"
    npx tsx runtime/src/dc-runner.ts --phase specify "Your task"
    npx tsx runtime/src/dc-runner.ts --phase implement "Your task"

  Phases: specify, clarify, plan, breakdown, implement, review

  Environment:
    DC_MODEL=claude-sonnet-4-6   (default)
    DC_MODEL=claude-opus-4-6     (for complex tasks)
  `);
  process.exit(0);
}

runPipeline(task, phase)
  .then((success) => process.exit(success ? 0 : 1))
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });

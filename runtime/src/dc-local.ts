/**
 * Don Cheli SDD Runtime — Local Mode (sin Docker)
 *
 * Ejecuta el pipeline SDD usando Claude Code CLI directamente
 * en tu maquina, sin Docker. Usa git worktrees para aislamiento.
 *
 * Usage:
 *   npx tsx runtime/src/dc-local.ts "Implement JWT authentication"
 *   npx tsx runtime/src/dc-local.ts --phase specify "JWT auth"
 */

import { execSync, spawn } from "child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

const COMPLETION_SIGNAL = "DC_PHASE_COMPLETE";
const MAX_RETRIES = 3;

interface PhaseConfig {
  name: string;
  prompt: string;
}

function buildPhases(task: string): PhaseConfig[] {
  return [
    {
      name: "specify",
      prompt: `You are running inside Don Cheli SDD. Execute /dc:especificar for the following task.

TASK: ${task}

RULES:
1. Generate Gherkin .feature file in .dc/specs/ with P1/P2/P3 scenarios
2. Generate DBML schema if data persistence is needed
3. Create .dc/config.yaml if it doesn't exist
4. Mark ambiguities with [NEEDS CLARIFICATION]
5. When done, output: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "clarify",
      prompt: `You are running inside Don Cheli SDD. Execute /dc:clarificar.

Read .dc/specs/*.feature and resolve all ambiguities.
Verify schema consistency. Fix all [NEEDS CLARIFICATION] markers.
When done, output: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "plan",
      prompt: `You are running inside Don Cheli SDD. Execute /dc:planificar-tecnico.

Read .dc/specs/ and generate a technical blueprint in .dc/blueprints/.
Include architecture, API contracts, data model, security.
When done, output: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "breakdown",
      prompt: `You are running inside Don Cheli SDD. Execute /dc:desglosar.

Read .dc/blueprints/ and break down into TDD tasks in .dc/tareas/.
Use task IDs (T001, T002...), mark parallel tasks with [P].
When done, output: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "implement",
      prompt: `You are running inside Don Cheli SDD. Execute /dc:implementar.

Read .dc/tareas/ and implement ALL tasks using strict TDD:
1. Write test FIRST (must FAIL)
2. Write minimum code to PASS
3. Refactor
No code without tests. Coverage >= 85%.
When done, output: ${COMPLETION_SIGNAL}`,
    },
    {
      name: "review",
      prompt: `You are running inside Don Cheli SDD. Execute /dc:revisar.

Review ALL code across 7 dimensions: functionality, tests, performance,
architecture, security, maintainability, documentation.
Write review to .dc/reviews/. Fix critical issues directly.
When done, output: ${COMPLETION_SIGNAL}`,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════
// GIT WORKTREE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function createWorktree(phaseName: string): string {
  const branchName = `dc-${phaseName}-${Date.now()}`;
  const worktreePath = `.dc/worktrees/${branchName}`;

  try {
    execSync(`git worktree add -b ${branchName} ${worktreePath}`, {
      stdio: "pipe",
    });
    console.log(`  📂 Worktree created: ${worktreePath}`);
    return worktreePath;
  } catch {
    // If worktree fails, work in current directory
    console.log(`  ⚠️ Worktree failed, working in current directory`);
    return ".";
  }
}

function mergeWorktree(worktreePath: string, phaseName: string) {
  if (worktreePath === ".") return;

  try {
    const branchName = worktreePath.split("/").pop()!;
    execSync(`git merge ${branchName} --no-edit`, { stdio: "pipe" });
    execSync(`git worktree remove ${worktreePath} --force`, { stdio: "pipe" });
    execSync(`git branch -d ${branchName}`, { stdio: "pipe" });
    console.log(`  ✅ Worktree merged and cleaned`);
  } catch (err) {
    console.log(`  ⚠️ Merge skipped: ${err}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// CLAUDE CODE EXECUTOR
// ═══════════════════════════════════════════════════════════════

async function runClaude(prompt: string, cwd: string): Promise<{ output: string; success: boolean }> {
  return new Promise((resolve) => {
    let output = "";
    let success = false;

    const proc = spawn("claude", ["--print", prompt], {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    proc.stdout.on("data", (data: Buffer) => {
      const text = data.toString();
      output += text;
      process.stdout.write(text);
      if (text.includes(COMPLETION_SIGNAL)) {
        success = true;
      }
    });

    proc.stderr.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      resolve({ output, success: success || code === 0 });
    });

    // Timeout: 5 minutes per phase
    setTimeout(() => {
      proc.kill();
      resolve({ output, success: false });
    }, 5 * 60 * 1000);
  });
}

// ═══════════════════════════════════════════════════════════════
// PHASE RUNNER
// ═══════════════════════════════════════════════════════════════

async function runPhase(phase: PhaseConfig, useWorktree: boolean): Promise<boolean> {
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  Phase: ${phase.name.toUpperCase()}`);
  console.log(`${"═".repeat(50)}\n`);

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const worktreePath = useWorktree ? createWorktree(phase.name) : ".";

    console.log(`  Attempt ${attempt}/${MAX_RETRIES}...`);
    const { output, success } = await runClaude(phase.prompt, worktreePath);

    if (useWorktree && worktreePath !== ".") {
      // Commit changes in worktree
      try {
        execSync(`git -C ${worktreePath} add -A && git -C ${worktreePath} commit -m "dc: ${phase.name}" --allow-empty`, {
          stdio: "pipe",
        });
      } catch {}
      mergeWorktree(worktreePath, phase.name);
    }

    if (success) {
      console.log(`\n  ✅ Phase ${phase.name} PASSED`);
      return true;
    }

    console.log(`\n  ❌ Attempt ${attempt} failed`);
  }

  console.log(`\n  🛑 Phase ${phase.name} FAILED after ${MAX_RETRIES} attempts`);
  return false;
}

// ═══════════════════════════════════════════════════════════════
// PIPELINE
// ═══════════════════════════════════════════════════════════════

async function runPipeline(task: string, onlyPhase?: string, useWorktree = false) {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  Don Cheli SDD Runtime — Local Mode`);
  console.log(`${"═".repeat(60)}`);
  console.log(`\n  Task: ${task}`);
  console.log(`  Mode: Local (Claude Code CLI)`);
  console.log(`  Worktrees: ${useWorktree ? "enabled" : "disabled"}`);
  console.log(`  Phases: ${onlyPhase || "all"}\n`);

  // Ensure .dc/ exists
  mkdirSync(".dc/specs", { recursive: true });
  mkdirSync(".dc/blueprints", { recursive: true });
  mkdirSync(".dc/tareas", { recursive: true });
  mkdirSync(".dc/reviews", { recursive: true });
  mkdirSync(".dc/worktrees", { recursive: true });

  const phases = buildPhases(task);
  const toRun = onlyPhase ? phases.filter((p) => p.name === onlyPhase) : phases;

  const results: { name: string; passed: boolean }[] = [];

  for (const phase of toRun) {
    const passed = await runPhase(phase, useWorktree);
    results.push({ name: phase.name, passed });

    if (!passed && !onlyPhase) {
      console.log(`\n  🛑 Pipeline stopped at: ${phase.name}`);
      break;
    }
  }

  // Summary
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  SUMMARY`);
  console.log(`${"═".repeat(60)}\n`);

  for (const r of results) {
    console.log(`  ${r.passed ? "✅" : "❌"} ${r.name}`);
  }

  const allPassed = results.every((r) => r.passed);
  console.log(`\n  ${allPassed ? "✅ ALL PASSED" : "❌ PIPELINE FAILED"}\n`);

  return allPassed;
}

// ═══════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════

const args = process.argv.slice(2);
let phase: string | undefined;
let worktree = false;

// Parse flags
const cleanArgs: string[] = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--phase" && args[i + 1]) {
    phase = args[++i];
  } else if (args[i] === "--worktree") {
    worktree = true;
  } else {
    cleanArgs.push(args[i]);
  }
}

const task = cleanArgs.join(" ");

if (!task) {
  console.log(`
  Don Cheli SDD Runtime — Local Mode

  Usage:
    npx tsx runtime/src/dc-local.ts "Your task description"
    npx tsx runtime/src/dc-local.ts --phase specify "Your task"
    npx tsx runtime/src/dc-local.ts --worktree "Your task"

  Phases: specify, clarify, plan, breakdown, implement, review

  Options:
    --phase <name>   Run a single phase
    --worktree       Use git worktrees for isolation (experimental)
  `);
  process.exit(0);
}

runPipeline(task, phase, worktree)
  .then((ok) => process.exit(ok ? 0 : 1))
  .catch((err) => {
    console.error("Fatal:", err);
    process.exit(1);
  });

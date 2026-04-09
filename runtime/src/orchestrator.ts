/**
 * Don Cheli Runtime — SDD Pipeline Orchestrator
 *
 * Executes the full SDD pipeline with quality gates,
 * worktree isolation, and crash recovery.
 */

import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import type { AgentProvider } from "./providers/base.js";
import { ClaudeProvider } from "./providers/claude.js";
import { CodexProvider } from "./providers/codex.js";
import { OllamaProvider } from "./providers/ollama.js";
import { StateManager, type PhaseName } from "./utils/state.js";
import { getPhasePrompt, getCompletionSignal } from "./phases/prompts.js";
import { estimatePipelineCost, formatCostTable } from "./utils/cost.js";
import { specGate } from "./gates/spec-gate.js";
import { tddGate } from "./gates/tdd-gate.js";
import { customGates } from "./gates/custom-gate.js";
import { createWorktree, commitWorktree, mergeWorktree, cleanupWorktree, isGitRepo } from "./sandbox/worktree.js";
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
  useWorktree?: boolean;
  maxRetries?: number;
  budgetUsd?: number;
  dryRun?: boolean;
}

const DEFAULT_PHASES: PhaseName[] = ["specify", "clarify", "plan", "breakdown", "implement", "review"];
const MAX_RETRIES = 3;

// ═══════════════════════════════════════════════════════════════
// GATE RUNNER
// ═══════════════════════════════════════════════════════════════

function runGatesForPhase(phase: PhaseName, projectDir: string): boolean {
  const gates: Record<PhaseName, (() => { passed: boolean; message: string })[]> = {
    specify: [() => specGate(projectDir)],
    clarify: [() => specGate(projectDir)],
    plan: [() => specGate(projectDir)],
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
// PHASE EXECUTOR
// ═══════════════════════════════════════════════════════════════

async function executePhase(
  phase: PhaseName,
  provider: AgentProvider,
  projectDir: string,
  stateManager: StateManager,
  useWorktree: boolean,
  maxRetries: number
): Promise<{ passed: boolean; commits: number }> {
  log.phaseHeader(phase, 1, maxRetries);

  const prompt = getPhasePrompt(phase, stateManager.get().task);
  const signal = getCompletionSignal();
  let commits = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    if (attempt > 1) {
      log.phaseHeader(phase, attempt, maxRetries);
    }

    stateManager.startPhase(phase);

    // Create worktree if enabled
    let worktreeInfo = null;
    let workDir = projectDir;

    if (useWorktree) {
      try {
        worktreeInfo = createWorktree(projectDir, phase);
        workDir = worktreeInfo.path;
        log.info(`Worktree: ${worktreeInfo.branch}`);
      } catch {
        log.warn("Worktree creation failed, using project directory");
      }
    }

    // Execute agent
    const { command, args } = provider.buildCommand(prompt);
    log.info(`Running: ${provider.name}/${provider.model}`);

    const result = await execLocal(command, args, workDir, (data) => {
      process.stdout.write(data);
    }, {
      timeout: 10 * 60 * 1000, // 10 min per phase
      completionSignal: signal,
    });

    // Commit worktree changes
    if (worktreeInfo) {
      const sha = commitWorktree(worktreeInfo.path, `dc(${phase}): ${stateManager.get().task}`);
      if (sha) {
        commits++;
        const merged = mergeWorktree(projectDir, worktreeInfo);
        if (merged) {
          log.success(`Committed and merged: ${sha.substring(0, 7)}`);
        }
      }
      cleanupWorktree(projectDir, worktreeInfo);
    }

    // Run quality gates
    const gatesPassed = runGatesForPhase(phase, workDir);

    if (result.completed || result.exitCode === 0) {
      if (gatesPassed) {
        stateManager.passPhase(phase, []);
        log.success(`Phase ${phase} PASSED`);
        return { passed: true, commits };
      } else {
        log.warn(`Phase ${phase}: agent completed but gates failed`);
      }
    }

    stateManager.failPhase(phase);
    log.fail(`Attempt ${attempt}/${maxRetries} failed`);
  }

  log.fail(`Phase ${phase} FAILED after ${maxRetries} attempts`);
  return { passed: false, commits };
}

// ═══════════════════════════════════════════════════════════════
// ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════

export async function orchestrate(config: OrchestratorConfig): Promise<boolean> {
  const projectDir = process.cwd();
  const maxRetries = config.maxRetries ?? MAX_RETRIES;

  // Verify git repo
  if (!isGitRepo(projectDir)) {
    log.fail("Not a git repository. Run 'git init' first.");
    return false;
  }

  // Create provider
  let provider: AgentProvider;
  switch (config.provider) {
    case "claude":
      provider = new ClaudeProvider(config.model);
      break;
    case "codex":
      provider = new CodexProvider(config.model);
      break;
    case "ollama":
      provider = new OllamaProvider(config.model);
      break;
  }

  // Determine phases
  const phases = config.singlePhase
    ? [config.singlePhase]
    : config.phases ?? DEFAULT_PHASES;

  // Header
  log.header("Don Cheli SDD Runtime");
  console.log(`  Task:     ${config.task}`);
  console.log(`  Provider: ${provider.name}/${provider.model}`);
  console.log(`  Phases:   ${phases.join(" → ")}`);
  console.log(`  Worktree: ${config.useWorktree ? "enabled" : "disabled"}`);
  console.log(`  Retries:  ${maxRetries} per phase`);

  // Pre-flight cost estimate
  const estimate = estimatePipelineCost(phases, provider);
  console.log(`\n${formatCostTable(estimate.phases)}`);

  if (config.budgetUsd && estimate.totalCostUsd > config.budgetUsd) {
    log.fail(`Estimated cost $${estimate.totalCostUsd} exceeds budget $${config.budgetUsd}`);
    return false;
  }

  if (config.dryRun) {
    log.info("Dry run — no execution");
    return true;
  }

  // State management
  const stateManager = new StateManager(projectDir);

  // Check for crash recovery
  const existingState = stateManager.load();
  if (existingState && !config.singlePhase) {
    const nextPhase = stateManager.getNextPhase();
    if (nextPhase) {
      log.warn(`Crash recovery: resuming from phase '${nextPhase}'`);
      const idx = phases.indexOf(nextPhase);
      if (idx > 0) {
        phases.splice(0, idx);
      }
    }
  } else {
    stateManager.init(config.task, config.provider, provider.model, "local");
  }

  // Acquire lock
  if (!stateManager.acquireLock()) {
    log.fail("Another Don Cheli instance is running. Wait or remove .dc/auto/lock.pid");
    return false;
  }

  // Ensure .dc/ structure
  for (const dir of ["specs", "blueprints", "tareas", "reviews", "auto"]) {
    mkdirSync(join(projectDir, ".dc", dir), { recursive: true });
  }

  // Execute pipeline
  const results: { phase: string; passed: boolean; commits: number }[] = [];

  try {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      log.progressBar(i, phases.length, `Phase: ${phase}`);

      const result = await executePhase(
        phase, provider, projectDir, stateManager,
        config.useWorktree ?? false, maxRetries
      );

      results.push({ phase, ...result });

      if (!result.passed && !config.singlePhase) {
        log.fail(`Pipeline stopped at phase: ${phase}`);
        break;
      }
    }

    log.progressBar(phases.length, phases.length, "Complete");
  } finally {
    stateManager.releaseLock();
  }

  // Summary
  log.summary(results);

  const allPassed = results.every((r) => r.passed);
  const state = stateManager.get();
  if (allPassed) {
    console.log(`  ${log.COLORS.green}Tokens: ~${state.tokensUsed.toLocaleString()} | Cost: ~$${state.costUsd.toFixed(2)}${log.COLORS.reset}\n`);
  }

  return allPassed;
}

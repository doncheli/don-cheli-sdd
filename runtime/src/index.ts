#!/usr/bin/env node
/**
 * Don Cheli SDD Runtime — CLI
 *
 * Usage:
 *   dc-run "Implement JWT authentication"
 *   dc-run --phase specify "JWT auth"
 *   dc-run --provider ollama --model qwen2.5-coder:7b "JWT auth"
 *   dc-run --worktree "JWT auth"
 *   dc-run --dry-run "JWT auth"
 *   dc-run --budget 5.00 "JWT auth"
 */

import { orchestrate, type OrchestratorConfig } from "./orchestrator.js";
import type { PhaseName } from "./utils/state.js";

const HELP = `
  Don Cheli SDD Runtime v1.0.0
  Deja de adivinar. Empieza a hacer ingeniería.

  Usage:
    dc-run <task>                          Full pipeline
    dc-run --phase specify <task>          Single phase
    dc-run --provider ollama <task>        Use Ollama (free, local)
    dc-run --worktree <task>               Git worktree isolation
    dc-run --dry-run <task>                Estimate cost only
    dc-run --budget 5.00 <task>            Stop if exceeds budget

  Providers:
    claude    Claude Code CLI (default, uses subscription)
    codex     OpenAI Codex
    ollama    Ollama local models (free)

  Phases:
    specify   Generate Gherkin specs
    clarify   Auto-QA + resolve ambiguities
    plan      Technical blueprint
    breakdown TDD task decomposition
    implement RED → GREEN → REFACTOR
    review    7-dimension peer review

  Examples:
    dc-run "REST API with JWT auth"
    dc-run --phase specify "User dashboard with charts"
    dc-run --provider ollama --model llama3:8b "Simple CLI tool"
    dc-run --worktree --budget 2.00 "Payment integration"
`;

// Parse CLI args
const args = process.argv.slice(2);
const config: OrchestratorConfig = {
  task: "",
  provider: "claude",
};

const taskParts: string[] = [];

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--phase":
      config.singlePhase = args[++i] as PhaseName;
      break;
    case "--provider":
      config.provider = args[++i] as "claude" | "codex" | "ollama";
      break;
    case "--model":
      config.model = args[++i];
      break;
    case "--worktree":
      config.useWorktree = true;
      break;
    case "--dry-run":
      config.dryRun = true;
      break;
    case "--budget":
      config.budgetUsd = parseFloat(args[++i]);
      break;
    case "--retries":
      config.maxRetries = parseInt(args[++i]);
      break;
    case "--help":
    case "-h":
      console.log(HELP);
      process.exit(0);
    default:
      taskParts.push(args[i]);
  }
}

config.task = taskParts.join(" ");

if (!config.task) {
  console.log(HELP);
  process.exit(0);
}

// Run
orchestrate(config)
  .then((ok) => process.exit(ok ? 0 : 1))
  .catch((err) => {
    console.error("\n  Fatal error:", err.message || err);
    process.exit(1);
  });

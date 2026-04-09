/**
 * Don Cheli Runtime — Pre-Flight Cost Estimator
 */

import type { AgentProvider } from "../providers/base.js";
import type { PhaseName } from "./state.js";

const BASE_TOKENS_PER_PHASE: Record<PhaseName, number> = {
  specify: 8_000,
  clarify: 5_000,
  plan: 12_000,
  breakdown: 6_000,
  implement: 25_000,
  review: 15_000,
};

export interface CostEstimate {
  phase: PhaseName;
  tokens: number;
  costUsd: number;
}

export function estimatePhaseCost(phase: PhaseName, provider: AgentProvider): CostEstimate {
  const baseTokens = BASE_TOKENS_PER_PHASE[phase];
  const { tokens, costUsd } = provider.estimateCost(baseTokens);
  return { phase, tokens, costUsd };
}

export function estimatePipelineCost(
  phases: PhaseName[],
  provider: AgentProvider
): { phases: CostEstimate[]; totalTokens: number; totalCostUsd: number } {
  const estimates = phases.map((p) => estimatePhaseCost(p, provider));
  return {
    phases: estimates,
    totalTokens: estimates.reduce((s, e) => s + e.tokens, 0),
    totalCostUsd: Math.round(estimates.reduce((s, e) => s + e.costUsd, 0) * 1000) / 1000,
  };
}

export function formatCostTable(estimates: CostEstimate[]): string {
  const lines = [
    "  ┌──────────────────┬──────────┬──────────┐",
    "  │ Phase            │ Tokens   │ Cost     │",
    "  ├──────────────────┼──────────┼──────────┤",
  ];

  for (const e of estimates) {
    lines.push(
      `  │ ${e.phase.padEnd(16)} │ ${String("~" + e.tokens.toLocaleString()).padStart(8)} │ $${e.costUsd.toFixed(2).padStart(6)} │`
    );
  }

  const total = estimates.reduce((s, e) => s + e.costUsd, 0);
  const totalTokens = estimates.reduce((s, e) => s + e.tokens, 0);
  lines.push("  ├──────────────────┼──────────┼──────────┤");
  lines.push(
    `  │ TOTAL            │ ${String("~" + totalTokens.toLocaleString()).padStart(8)} │ $${total.toFixed(2).padStart(6)} │`
  );
  lines.push("  └──────────────────┴──────────┴──────────┘");

  return lines.join("\n");
}

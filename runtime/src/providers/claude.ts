/**
 * Don Cheli Runtime — Claude Code Provider
 * Uses Claude Code CLI (subscription-based, no API key needed)
 */

import type { AgentProvider, AgentResult } from "./base.js";

const COST_PER_1M_INPUT: Record<string, number> = {
  "claude-opus-4-6": 15.0,
  "claude-sonnet-4-6": 3.0,
  "claude-haiku-4-5": 0.25,
};

const COST_PER_1M_OUTPUT: Record<string, number> = {
  "claude-opus-4-6": 75.0,
  "claude-sonnet-4-6": 15.0,
  "claude-haiku-4-5": 1.25,
};

export class ClaudeProvider implements AgentProvider {
  readonly name = "claude";
  readonly model: string;

  constructor(model?: string) {
    this.model = model ?? "claude-sonnet-4-6";
  }

  buildCommand(prompt: string): { command: string; args: string[] } {
    return {
      command: "claude",
      args: ["--print", "--model", this.model, prompt],
    };
  }

  buildDockerCommand(prompt: string): string[] {
    return ["claude", "--print", "--model", this.model, prompt];
  }

  isComplete(output: string, signal: string): boolean {
    return output.includes(signal);
  }

  estimateCost(promptLength: number): { tokens: number; costUsd: number } {
    // Rough: 1 char ≈ 0.25 tokens, output ≈ 3x input
    const inputTokens = Math.ceil(promptLength * 0.25);
    const outputTokens = inputTokens * 3;
    const inputCost = (inputTokens / 1_000_000) * (COST_PER_1M_INPUT[this.model] ?? 3.0);
    const outputCost = (outputTokens / 1_000_000) * (COST_PER_1M_OUTPUT[this.model] ?? 15.0);
    return {
      tokens: inputTokens + outputTokens,
      costUsd: Math.round((inputCost + outputCost) * 1000) / 1000,
    };
  }
}

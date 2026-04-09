/**
 * Don Cheli Runtime — OpenAI Codex Provider
 */

import type { AgentProvider } from "./base.js";

export class CodexProvider implements AgentProvider {
  readonly name = "codex";
  readonly model: string;

  constructor(model?: string) {
    this.model = model ?? "codex-mini-latest";
  }

  buildCommand(prompt: string): { command: string; args: string[] } {
    return {
      command: "codex",
      args: ["--model", this.model, "--quiet", prompt],
    };
  }

  buildDockerCommand(prompt: string): string[] {
    return ["codex", "--model", this.model, "--quiet", prompt];
  }

  isComplete(output: string, signal: string): boolean {
    return output.includes(signal);
  }

  estimateCost(promptLength: number): { tokens: number; costUsd: number } {
    const inputTokens = Math.ceil(promptLength * 0.25);
    const outputTokens = inputTokens * 3;
    return {
      tokens: inputTokens + outputTokens,
      costUsd: Math.round(((inputTokens + outputTokens) / 1_000_000) * 1.5 * 1000) / 1000,
    };
  }
}

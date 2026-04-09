/**
 * Don Cheli Runtime — Agent Provider Interface
 */

export interface AgentResult {
  exitCode: number;
  output: string;
  completed: boolean;
  tokensUsed?: number;
  costUsd?: number;
}

export interface AgentProvider {
  readonly name: string;
  readonly model: string;

  /** Build CLI command + args to run the agent with a prompt */
  buildCommand(prompt: string): { command: string; args: string[] };

  /** Build command for Docker execution */
  buildDockerCommand(prompt: string): string[];

  /** Parse completion signal from output */
  isComplete(output: string, signal: string): boolean;

  /** Estimate cost for a prompt (tokens) */
  estimateCost(promptLength: number): { tokens: number; costUsd: number };
}

export type ProviderName = "claude" | "codex" | "ollama" | "custom";

export function createProvider(name: ProviderName, model?: string): AgentProvider {
  switch (name) {
    case "claude":
      return new (require("./claude.js").ClaudeProvider)(model);
    case "codex":
      return new (require("./codex.js").CodexProvider)(model);
    case "ollama":
      return new (require("./ollama.js").OllamaProvider)(model);
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}

/**
 * Don Cheli Runtime — Ollama Provider (local models, free)
 * Supports: llama3, qwen2.5-coder, deepseek-coder, codellama, etc.
 */

import type { AgentProvider } from "./base.js";

export class OllamaProvider implements AgentProvider {
  readonly name = "ollama";
  readonly model: string;

  constructor(model?: string) {
    this.model = model ?? "qwen2.5-coder:7b";
  }

  buildCommand(prompt: string): { command: string; args: string[] } {
    return {
      command: "ollama",
      args: ["run", this.model, prompt],
    };
  }

  buildDockerCommand(prompt: string): string[] {
    // In Docker, Ollama runs on host network
    return ["ollama", "run", this.model, prompt];
  }

  isComplete(output: string, signal: string): boolean {
    return output.includes(signal);
  }

  estimateCost(_promptLength: number): { tokens: number; costUsd: number } {
    // Ollama is free (runs locally)
    return { tokens: 0, costUsd: 0 };
  }
}

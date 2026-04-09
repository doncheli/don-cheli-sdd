/**
 * Don Cheli Runtime — Local Sandbox (sin Docker)
 * Ejecuta agentes directamente en la maquina del usuario
 */

import { spawn } from "child_process";

export interface LocalExecResult {
  exitCode: number;
  output: string;
  completed: boolean;
}

export function execLocal(
  command: string,
  args: string[],
  cwd: string,
  onData: (data: string) => void,
  options?: { timeout?: number; completionSignal?: string }
): Promise<LocalExecResult> {
  return new Promise((resolve) => {
    let output = "";
    let completed = false;

    const proc = spawn(command, args, {
      cwd,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env },
    });

    proc.stdout.on("data", (data: Buffer) => {
      const text = data.toString();
      output += text;
      onData(text);
      if (options?.completionSignal && text.includes(options.completionSignal)) {
        completed = true;
      }
    });

    proc.stderr.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      resolve({ exitCode: code ?? 1, output, completed });
    });

    const timeout = options?.timeout ?? 5 * 60 * 1000;
    setTimeout(() => {
      proc.kill();
      resolve({ exitCode: 124, output, completed });
    }, timeout);
  });
}

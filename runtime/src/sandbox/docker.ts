/**
 * Don Cheli Runtime — Docker Container Lifecycle
 * Forked and adapted from Sandcastle (mattpocock/sandcastle, Apache 2.0)
 */

import { execSync, spawn, type ChildProcess } from "child_process";

export interface ContainerConfig {
  name: string;
  image: string;
  env: Record<string, string>;
  volumes: string[];
  workdir: string;
}

export interface ContainerResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

function docker(args: string[]): string {
  return execSync(`docker ${args.join(" ")}`, {
    encoding: "utf-8",
    timeout: 60_000,
  }).trim();
}

export function dockerAvailable(): boolean {
  try {
    docker(["info"]);
    return true;
  } catch {
    return false;
  }
}

export function buildImage(dockerfilePath: string, imageName: string): void {
  const dir = dockerfilePath.replace(/\/Dockerfile$/, "") || ".";
  execSync(`docker build -t ${imageName} ${dir}`, { stdio: "inherit" });
}

export function containerExists(name: string): boolean {
  try {
    const result = docker([
      "ps", "-a", "--filter", `name=^${name}$`, "--format", "{{.Names}}"
    ]);
    return result === name;
  } catch {
    return false;
  }
}

export function removeContainer(name: string): void {
  try {
    docker(["rm", "-f", name]);
  } catch {}
}

export function startContainer(config: ContainerConfig): void {
  const envFlags = Object.entries(config.env).flatMap(([k, v]) => ["-e", `${k}=${v}`]);
  const volFlags = config.volumes.flatMap((v) => ["-v", v]);

  if (containerExists(config.name)) {
    removeContainer(config.name);
  }

  docker([
    "run", "-d",
    "--name", config.name,
    ...envFlags,
    ...volFlags,
    "-w", config.workdir,
    config.image,
    "sleep", "infinity",
  ]);
}

export function execInContainer(
  containerName: string,
  command: string[],
  options?: { user?: string; timeout?: number }
): string {
  const userFlag = options?.user ? ["--user", options.user] : [];
  return execSync(
    `docker exec ${userFlag.join(" ")} ${containerName} ${command.join(" ")}`,
    {
      encoding: "utf-8",
      timeout: options?.timeout ?? 300_000,
    }
  ).trim();
}

export function execInContainerStream(
  containerName: string,
  command: string[],
  onData: (data: string) => void,
  options?: { timeout?: number }
): Promise<{ exitCode: number; output: string }> {
  return new Promise((resolve) => {
    let output = "";
    const proc = spawn("docker", ["exec", containerName, ...command], {
      stdio: ["ignore", "pipe", "pipe"],
    });

    proc.stdout.on("data", (data: Buffer) => {
      const text = data.toString();
      output += text;
      onData(text);
    });

    proc.stderr.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.on("close", (code) => {
      resolve({ exitCode: code ?? 1, output });
    });

    if (options?.timeout) {
      setTimeout(() => {
        proc.kill();
        resolve({ exitCode: 124, output });
      }, options.timeout);
    }
  });
}

export function stopContainer(name: string): void {
  try {
    docker(["stop", name]);
    docker(["rm", name]);
  } catch {}
}

export function copyToContainer(containerName: string, hostPath: string, containerPath: string): void {
  docker(["cp", hostPath, `${containerName}:${containerPath}`]);
}

export function copyFromContainer(containerName: string, containerPath: string, hostPath: string): void {
  docker(["cp", `${containerName}:${containerPath}`, hostPath]);
}

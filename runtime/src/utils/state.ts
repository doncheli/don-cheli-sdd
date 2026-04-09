/**
 * Don Cheli Runtime — Pipeline State Machine
 * Persists state to .dc/auto/state.json for crash recovery
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";

export type PhaseName = "specify" | "clarify" | "plan" | "breakdown" | "implement" | "review";
export type PhaseStatus = "pending" | "running" | "passed" | "failed" | "skipped";

export interface TaskState {
  id: string;
  status: PhaseStatus;
  parallel: boolean;
  commits: string[];
  retries: number;
}

export interface PhaseState {
  name: PhaseName;
  status: PhaseStatus;
  startedAt?: string;
  completedAt?: string;
  commits: string[];
  retries: number;
  tasks?: TaskState[];
}

export interface PipelineState {
  version: string;
  task: string;
  level: number;
  provider: string;
  model: string;
  mode: "local" | "docker";
  currentPhase: PhaseName | null;
  phases: PhaseState[];
  startedAt: string;
  lastCheckpoint: string;
  tokensUsed: number;
  costUsd: number;
  totalCommits: number;
}

const STATE_DIR = ".dc/auto";
const STATE_FILE = "state.json";
const LOCK_FILE = "lock.pid";

export class StateManager {
  private stateDir: string;
  private statePath: string;
  private lockPath: string;
  private state: PipelineState;

  constructor(private repoDir: string) {
    this.stateDir = join(repoDir, STATE_DIR);
    this.statePath = join(this.stateDir, STATE_FILE);
    this.lockPath = join(this.stateDir, LOCK_FILE);
    this.state = this.defaultState();
  }

  private defaultState(): PipelineState {
    return {
      version: "1.0.0",
      task: "",
      level: 2,
      provider: "claude",
      model: "claude-sonnet-4-6",
      mode: "local",
      currentPhase: null,
      phases: [
        { name: "specify", status: "pending", commits: [], retries: 0 },
        { name: "clarify", status: "pending", commits: [], retries: 0 },
        { name: "plan", status: "pending", commits: [], retries: 0 },
        { name: "breakdown", status: "pending", commits: [], retries: 0 },
        { name: "implement", status: "pending", commits: [], retries: 0 },
        { name: "review", status: "pending", commits: [], retries: 0 },
      ],
      startedAt: new Date().toISOString(),
      lastCheckpoint: new Date().toISOString(),
      tokensUsed: 0,
      costUsd: 0,
      totalCommits: 0,
    };
  }

  // ── Lock Management ──

  acquireLock(): boolean {
    mkdirSync(this.stateDir, { recursive: true });

    if (existsSync(this.lockPath)) {
      const pid = readFileSync(this.lockPath, "utf-8").trim();
      try {
        process.kill(parseInt(pid), 0); // Check if process alive
        return false; // Another instance running
      } catch {
        // PID dead — stale lock, claim it
      }
    }

    writeFileSync(this.lockPath, String(process.pid));
    return true;
  }

  releaseLock(): void {
    try {
      unlinkSync(this.lockPath);
    } catch {}
  }

  isLocked(): boolean {
    return existsSync(this.lockPath);
  }

  // ── State Persistence ──

  save(): void {
    mkdirSync(this.stateDir, { recursive: true });
    this.state.lastCheckpoint = new Date().toISOString();
    writeFileSync(this.statePath, JSON.stringify(this.state, null, 2));
  }

  load(): PipelineState | null {
    if (!existsSync(this.statePath)) return null;
    try {
      this.state = JSON.parse(readFileSync(this.statePath, "utf-8"));
      return this.state;
    } catch {
      return null;
    }
  }

  get(): PipelineState {
    return this.state;
  }

  // ── Pipeline Control ──

  init(task: string, provider: string, model: string, mode: "local" | "docker"): void {
    this.state = this.defaultState();
    this.state.task = task;
    this.state.provider = provider;
    this.state.model = model;
    this.state.mode = mode;
    this.save();
  }

  startPhase(name: PhaseName): void {
    const phase = this.state.phases.find((p) => p.name === name);
    if (phase) {
      phase.status = "running";
      phase.startedAt = new Date().toISOString();
      this.state.currentPhase = name;
      this.save();
    }
  }

  passPhase(name: PhaseName, commits: string[]): void {
    const phase = this.state.phases.find((p) => p.name === name);
    if (phase) {
      phase.status = "passed";
      phase.completedAt = new Date().toISOString();
      phase.commits = commits;
      this.state.totalCommits += commits.length;
      this.save();
    }
  }

  failPhase(name: PhaseName): void {
    const phase = this.state.phases.find((p) => p.name === name);
    if (phase) {
      phase.status = "failed";
      phase.retries++;
      this.save();
    }
  }

  getNextPhase(): PhaseName | null {
    const next = this.state.phases.find((p) => p.status === "pending");
    return next?.name ?? null;
  }

  getPhase(name: PhaseName): PhaseState | undefined {
    return this.state.phases.find((p) => p.name === name);
  }

  isComplete(): boolean {
    return this.state.phases.every((p) => p.status === "passed" || p.status === "skipped");
  }

  addCost(tokens: number, costUsd: number): void {
    this.state.tokensUsed += tokens;
    this.state.costUsd += costUsd;
    this.save();
  }
}

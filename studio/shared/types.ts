// Don Cheli Studio — Shared types (frontend + backend contract)

export type PhaseStatus = "pending" | "running" | "passed" | "failed" | "skipped";

export interface Phase {
  name: string;
  command: string;
  status: PhaseStatus;
  startedAt?: string;
  completedAt?: string;
  durationMs?: number;
  costUsd?: number;
  retries: number;
  commit?: string;
  gates: GateResult[];
}

export interface GateResult {
  name: string;
  passed: boolean;
  message: string;
  severity: "block" | "warn";
}

export interface PipelineState {
  id: string;
  task: string;
  provider: string;
  model: string;
  status: "idle" | "running" | "passed" | "failed" | "cancelled";
  phases: Phase[];
  totalCost: number;
  budgetUsd?: number;
  worktreePath?: string;
  containerId?: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  lastRun?: PipelineState;
  createdAt: string;
}

export interface CostEstimate {
  provider: string;
  model: string;
  estimatedMinutes: number;
  runtimeCost: number;
  tokenCost: number;
  total: number;
}

export interface Artifact {
  type: "spec" | "blueprint" | "task" | "test" | "review" | "coverage";
  path: string;
  name: string;
  content?: string;
  phase: string;
}

// WebSocket events
export type WsEvent =
  | { type: "state_update"; data: PipelineState }
  | { type: "log"; data: { line: string; timestamp: string; phase?: string } }
  | { type: "gate_result"; data: { phase: string; gate: GateResult } }
  | { type: "phase_start"; data: { phase: string } }
  | { type: "phase_complete"; data: { phase: string; status: PhaseStatus } }
  | { type: "pipeline_complete"; data: { status: "passed" | "failed" } }
  | { type: "cost_update"; data: { phase: string; costUsd: number; totalCost: number } }
  | { type: "error"; data: { message: string } };

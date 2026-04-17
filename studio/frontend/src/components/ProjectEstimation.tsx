import { useMemo } from 'react';
import { Clock, DollarSign, Users, AlertTriangle, Shield, TestTube, Zap } from 'lucide-react';

// ── Agent definitions ──

interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  phase: string;
  description: string;
}

const AGENTS: Agent[] = [
  {
    id: 'spec-writer',
    name: 'Ana',
    role: 'Spec Writer',
    avatar: '📋',
    color: 'text-blue-400 bg-blue-900/20 border-blue-800/30',
    phase: 'specify',
    description: 'Converts your idea into formal Gherkin specifications with test scenarios.',
  },
  {
    id: 'qa-analyst',
    name: 'Marco',
    role: 'QA Analyst',
    avatar: '🔍',
    color: 'text-cyan-400 bg-cyan-900/20 border-cyan-800/30',
    phase: 'clarify',
    description: 'Reviews specs to find ambiguities, contradictions, and missing edge cases.',
  },
  {
    id: 'architect',
    name: 'Sofia',
    role: 'Architect',
    avatar: '🏗️',
    color: 'text-indigo-400 bg-indigo-900/20 border-indigo-800/30',
    phase: 'plan',
    description: 'Designs the technical blueprint: architecture, API contracts, and data models.',
  },
  {
    id: 'designer',
    name: 'Luis',
    role: 'UI Designer',
    avatar: '🎨',
    color: 'text-pink-400 bg-pink-900/20 border-pink-800/30',
    phase: 'design',
    description: 'Creates visual mockups with Atomic Design: atoms, molecules, organisms, pages.',
  },
  {
    id: 'planner',
    name: 'Camila',
    role: 'Task Planner',
    avatar: '📦',
    color: 'text-orange-400 bg-orange-900/20 border-orange-800/30',
    phase: 'breakdown',
    description: 'Splits the plan into small, concrete TDD tasks with dependencies.',
  },
  {
    id: 'developer',
    name: 'Diego',
    role: 'TDD Developer',
    avatar: '⚡',
    color: 'text-emerald-400 bg-emerald-900/20 border-emerald-800/30',
    phase: 'implement',
    description: 'Writes tests FIRST, then code. Strict TDD: red → green → refactor.',
  },
  {
    id: 'reviewer',
    name: 'Valentina',
    role: 'Code Reviewer',
    avatar: '✅',
    color: 'text-purple-400 bg-purple-900/20 border-purple-800/30',
    phase: 'review',
    description: 'Reviews code across 7 dimensions: security, performance, correctness, and more.',
  },
];

// ── Complexity estimation ──

type Complexity = 'simple' | 'medium' | 'complex' | 'enterprise';

function estimateComplexity(taskLength: number, fileCount: number): Complexity {
  const totalInput = taskLength + fileCount * 2000;
  if (totalInput < 200) return 'simple';
  if (totalInput < 800) return 'medium';
  if (totalInput < 2500) return 'complex';
  return 'enterprise';
}

// Minutes per phase WITHOUT TDD
const BASE_MINUTES: Record<string, Record<Complexity, number>> = {
  specify:   { simple: 2, medium: 4, complex: 7, enterprise: 12 },
  clarify:   { simple: 1, medium: 3, complex: 5, enterprise: 8 },
  plan:      { simple: 2, medium: 5, complex: 8, enterprise: 15 },
  design:    { simple: 3, medium: 6, complex: 10, enterprise: 18 },
  breakdown: { simple: 1, medium: 3, complex: 5, enterprise: 10 },
  implement: { simple: 5, medium: 12, complex: 25, enterprise: 50 },
  review:    { simple: 2, medium: 4, complex: 6, enterprise: 10 },
};

// TDD multiplier: writing tests first adds ~40-60% time to implementation
const TDD_OVERHEAD = 1.5;

// Cost per minute by provider (approximate)
const COST_PER_MINUTE: Record<string, number> = {
  claude: 0.0, // Free with subscription
  ollama: 0.0, // Free local
  codex: 0.02, // ~$1.20/hr
  'managed-agents': 0.05, // $0.08/hr runtime + tokens
};

interface PhaseEstimate {
  phase: string;
  agent: Agent;
  baseMinutes: number;
  tddMinutes: number;
  totalMinutes: number;
  costUsd: number;
  isTddPhase: boolean;
}

interface Estimate {
  complexity: Complexity;
  phases: PhaseEstimate[];
  totalMinutes: number;
  totalMinutesWithoutTdd: number;
  tddOverheadMinutes: number;
  totalCostUsd: number;
  provider: string;
}

function buildEstimate(taskLength: number, fileCount: number, provider: string): Estimate {
  const complexity = estimateComplexity(taskLength, fileCount);
  const costPerMin = COST_PER_MINUTE[provider] ?? 0;

  const phases: PhaseEstimate[] = AGENTS.map(agent => {
    const base = BASE_MINUTES[agent.phase]?.[complexity] ?? 5;
    const isTddPhase = agent.phase === 'implement';
    const tddExtra = isTddPhase ? Math.round(base * (TDD_OVERHEAD - 1)) : 0;
    const total = base + tddExtra;

    return {
      phase: agent.phase,
      agent,
      baseMinutes: base,
      tddMinutes: tddExtra,
      totalMinutes: total,
      costUsd: total * costPerMin,
      isTddPhase,
    };
  });

  const totalMinutes = phases.reduce((s, p) => s + p.totalMinutes, 0);
  const totalWithout = phases.reduce((s, p) => s + p.baseMinutes, 0);

  return {
    complexity,
    phases,
    totalMinutes,
    totalMinutesWithoutTdd: totalWithout,
    tddOverheadMinutes: totalMinutes - totalWithout,
    totalCostUsd: phases.reduce((s, p) => s + p.costUsd, 0),
    provider,
  };
}

// ── Component ──

interface Props {
  taskLength: number;
  fileCount: number;
  provider: string;
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const COMPLEXITY_LABELS: Record<Complexity, { label: string; color: string; description: string }> = {
  simple:     { label: 'Simple', color: 'text-emerald-400 bg-emerald-900/20', description: 'Small feature or fix' },
  medium:     { label: 'Medium', color: 'text-blue-400 bg-blue-900/20', description: 'Standard feature with some logic' },
  complex:    { label: 'Complex', color: 'text-orange-400 bg-orange-900/20', description: 'Multi-component feature with integrations' },
  enterprise: { label: 'Enterprise', color: 'text-red-400 bg-red-900/20', description: 'Large system with many moving parts' },
};

export function ProjectEstimation({ taskLength, fileCount, provider }: Props) {
  const estimate = useMemo(
    () => buildEstimate(taskLength, fileCount, provider),
    [taskLength, fileCount, provider]
  );

  const cx = COMPLEXITY_LABELS[estimate.complexity];
  const isFree = provider === 'claude' || provider === 'ollama';

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
      {/* Header: Summary cards */}
      <div className="grid grid-cols-3 divide-x divide-gray-800 border-b border-gray-800">
        {/* Time */}
        <div className="p-4 text-center">
          <Clock className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">{formatTime(estimate.totalMinutes)}</div>
          <div className="text-xs text-gray-500">Estimated time</div>
        </div>
        {/* Cost */}
        <div className="p-4 text-center">
          <DollarSign className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
          <div className="text-2xl font-bold text-white">
            {isFree ? <span className="text-emerald-400">Free</span> : `$${estimate.totalCostUsd.toFixed(2)}`}
          </div>
          <div className="text-xs text-gray-500">{isFree ? `Using ${provider === 'claude' ? 'Claude Code' : 'Ollama'}` : 'Estimated cost'}</div>
        </div>
        {/* Complexity */}
        <div className="p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <div className={`inline-flex text-sm font-bold px-2.5 py-0.5 rounded-full ${cx.color}`}>{cx.label}</div>
          <div className="text-xs text-gray-500 mt-1">{cx.description}</div>
        </div>
      </div>

      {/* TDD notice */}
      <div className="px-5 py-3 border-b border-gray-800 flex items-start gap-3 bg-emerald-950/10">
        <TestTube className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs text-emerald-300 font-medium">TDD adds ~{estimate.tddOverheadMinutes} minutes to this project</p>
          <p className="text-xs text-emerald-400/60 mt-0.5">
            Writing tests FIRST takes longer ({formatTime(estimate.totalMinutes)} vs {formatTime(estimate.totalMinutesWithoutTdd)} without TDD),
            but catches bugs before they reach production — saving hours of debugging later.
          </p>
        </div>
      </div>

      {/* Your Team */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="text-white font-semibold text-sm">Your AI Team</h3>
          <span className="text-xs text-gray-500">— {AGENTS.length} specialists will work on your project</span>
        </div>

        <div className="space-y-2">
          {estimate.phases.map((pe) => (
            <div key={pe.phase} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${pe.agent.color}`}>
              {/* Avatar */}
              <span className="text-xl shrink-0">{pe.agent.avatar}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{pe.agent.name}</span>
                  <span className="text-xs text-gray-400">— {pe.agent.role}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{pe.agent.description}</p>
              </div>

              {/* Time */}
              <div className="text-right shrink-0">
                <div className="text-sm font-semibold text-white">{formatTime(pe.totalMinutes)}</div>
                {pe.isTddPhase && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <Shield className="w-2.5 h-2.5" /> +{pe.tddMinutes}m TDD
                  </div>
                )}
              </div>

              {/* Time bar */}
              <div className="w-20 shrink-0">
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-purple-500"
                    style={{ width: `${Math.min((pe.totalMinutes / estimate.totalMinutes) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 py-3 border-t border-gray-800 bg-gray-900/30">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>Agents work sequentially: each one finishes before the next begins</span>
        </div>
        <div className="flex items-center gap-1 mt-2">
          {estimate.phases.map((pe, i) => (
            <div key={pe.phase} className="flex items-center gap-1">
              <div
                className="h-2 rounded-full bg-purple-600/60"
                style={{ width: `${Math.max((pe.totalMinutes / estimate.totalMinutes) * 400, 16)}px` }}
                title={`${pe.agent.name}: ${formatTime(pe.totalMinutes)}`}
              />
              {i < estimate.phases.length - 1 && <div className="w-1 h-1 rounded-full bg-gray-700" />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-gray-600">Start</span>
          <span className="text-[10px] text-gray-600">{formatTime(estimate.totalMinutes)}</span>
        </div>
      </div>
    </div>
  );
}

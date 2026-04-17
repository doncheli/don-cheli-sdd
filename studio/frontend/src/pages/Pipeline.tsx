import { useEffect, useState } from 'react';
import { ArrowLeft, Play, Square, RefreshCw, Wifi, WifiOff, ChevronRight, Shield, FileCode, Zap } from 'lucide-react';
import type { Project } from '../lib/api';
import { usePipeline } from '../hooks/usePipeline';
import { useWebSocket } from '../hooks/useWebSocket';
import { PipelineFlow } from '../components/PipelineFlow';
import { PhaseCard } from '../components/PhaseCard';
import { LiveLog } from '../components/LiveLog';
import { CostMeter } from '../components/CostMeter';
import { GateIndicator } from '../components/GateIndicator';

const PHASE_PLAN = [
  {
    num: 1,
    name: 'Specify',
    icon: '📋',
    command: '/dc:especificar',
    what: 'Your idea becomes a formal Gherkin specification with test scenarios, priorities, and data schema.',
    output: '.dc/specs/spec.feature',
  },
  {
    num: 2,
    name: 'Clarify',
    icon: '🔍',
    command: '/dc:clarificar',
    what: 'A virtual QA reviews the spec to find ambiguities, contradictions, or missing edge cases before any code is written.',
    output: '.dc/specs/clarifications.md',
  },
  {
    num: 3,
    name: 'Plan',
    icon: '🏗️',
    command: '/dc:planificar-tecnico',
    what: 'Creates a technical blueprint: architecture, API contracts, database schema, and technology decisions.',
    output: '.dc/blueprints/blueprint.md',
  },
  {
    num: 4,
    name: 'Design UI',
    icon: '🎨',
    command: '/dc:diseñar-ui',
    what: 'Generates complete UI/UX designs with screens, components, and design system. Creates a shareable Figma link or HTML preview. Requires approval before implementation.',
    output: '.dc/design/ + approval.json',
  },
  {
    num: 5,
    name: 'Breakdown',
    icon: '📦',
    command: '/dc:desglosar',
    what: 'Splits the plan into concrete TDD tasks with dependencies and parallelism markers.',
    output: '.dc/tareas/task-*.md',
  },
  {
    num: 6,
    name: 'Implement',
    icon: '⚡',
    command: '/dc:implementar',
    what: 'Writes tests FIRST, then code to pass them, then refactors. No // TODO stubs allowed. Coverage >= 85%.',
    output: 'src/ + test/',
  },
  {
    num: 7,
    name: 'Review',
    icon: '✅',
    command: '/dc:revisar',
    what: 'Automatic peer review across 7 dimensions: correctness, security, performance, maintainability, testing, docs, architecture.',
    output: '.dc/reviews/review.md',
  },
];

interface Props {
  project: Project;
  onBack: () => void;
}

export function PipelinePage({ project, onBack }: Props) {
  const [task, setTask] = useState('');
  const [provider, setProvider] = useState('claude');
  const [showPlan, setShowPlan] = useState(true);
  const { phases, status, loading, error, refresh, start, stop } = usePipeline(project.id);
  const { connected, events, logs, pipelineState, clearLogs } = useWebSocket(project.id);

  // Refresh phases when pipeline state updates
  useEffect(() => {
    if (pipelineState) {
      refresh();
    }
  }, [pipelineState, refresh]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleStart = () => {
    if (!task.trim()) return;
    setShowPlan(false);
    clearLogs();
    start(task, { provider });
  };

  const totalCost = phases.reduce((sum, p) => sum + (p.cost_usd || 0), 0);
  const passedCount = phases.filter((p) => p.status === 'passed').length;
  const isRunning = status?.status === 'running';
  const hasRun = logs.length > 0 || passedCount > 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs">DC</div>
            <div>
              <h1 className="text-sm font-bold text-white">{project.name}</h1>
              <p className="text-xs text-gray-500 font-mono">{project.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {connected ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-red-400" />}
            <span className="text-xs text-gray-500">{passedCount}/{phases.length} phases</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {/* Task Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 font-mono text-sm">/dc:auto</span>
            <input
              type="text"
              placeholder="Describe what you want to build..."
              value={task}
              onChange={(e) => { setTask(e.target.value); if (!hasRun) setShowPlan(true); }}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              className="w-full pl-24 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600"
              disabled={isRunning}
            />
          </div>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="px-3 py-3 bg-gray-950 border border-gray-800 rounded-xl text-gray-300 text-sm focus:outline-none"
          >
            <option value="claude">Claude Code</option>
            <option value="ollama">Ollama (local)</option>
            <option value="codex">Codex</option>
          </select>
          {isRunning ? (
            <button onClick={stop} className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-colors">
              <Square className="w-4 h-4" /> Stop
            </button>
          ) : (
            <button
              onClick={handleStart}
              disabled={loading || !task.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm transition-colors"
            >
              <Play className="w-4 h-4" /> Run
            </button>
          )}
          <button onClick={refresh} className="px-3 py-3 bg-gray-950 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Execution Plan — shown before running */}
        {showPlan && task.trim() && !hasRun && (
          <div className="border border-gray-800 rounded-2xl bg-gray-950 overflow-hidden">
            {/* Plan Header */}
            <div className="px-6 py-4 border-b border-gray-800 bg-purple-900/10">
              <h2 className="text-white font-semibold text-lg mb-1">Execution Plan</h2>
              <p className="text-gray-400 text-sm">
                Don Cheli will execute <span className="text-purple-400 font-semibold">7 phases</span> to build your feature.
                Your project stays <span className="text-emerald-400 font-semibold">untouched</span> until all phases pass.
              </p>
            </div>

            {/* Safety Badges */}
            <div className="px-6 py-3 border-b border-gray-800 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-900/20 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" /> Isolated git worktree
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-900/20 px-3 py-1.5 rounded-full">
                <Zap className="w-3.5 h-3.5" /> TDD enforced
              </div>
              <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-900/20 px-3 py-1.5 rounded-full">
                <FileCode className="w-3.5 h-3.5" /> No // TODO allowed
              </div>
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-900/20 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5" /> Coverage &gt;= 85%
              </div>
            </div>

            {/* Phase List */}
            <div className="divide-y divide-gray-800/50">
              {PHASE_PLAN.map((phase, i) => (
                <div key={phase.num} className="px-6 py-4 flex items-start gap-4 hover:bg-gray-900/30 transition-colors">
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                    <span className="text-2xl">{phase.icon}</span>
                    {i < PHASE_PLAN.length - 1 && (
                      <div className="w-px h-4 bg-gray-800" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-white font-semibold text-sm">{phase.num}. {phase.name}</span>
                      <span className="text-xs text-purple-400 font-mono bg-purple-900/20 px-2 py-0.5 rounded">{phase.command}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{phase.what}</p>
                    <p className="text-gray-600 text-xs mt-1 font-mono">
                      <ChevronRight className="w-3 h-3 inline" /> {phase.output}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Plan Footer */}
            <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/30 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <span className="text-emerald-400 font-medium">All 7 phases must pass</span> all quality gates for code to be merged.
                If anything fails, your project stays exactly as it is.
              </div>
              <button
                onClick={handleStart}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
              >
                <Play className="w-4 h-4" /> Start Pipeline
              </button>
            </div>
          </div>
        )}

        {/* Pipeline Flow Diagram — shown during/after execution */}
        {(hasRun || isRunning) && (
          <>
            <PipelineFlow phases={phases} />

            {/* Phase Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {phases.map((phase) => (
                <PhaseCard key={phase.name} phase={phase} />
              ))}
            </div>

            {/* Bottom Panel: Log + Sidebars */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <LiveLog logs={logs} onClear={clearLogs} />
              </div>
              <div>
                <CostMeter current={totalCost} provider={provider} />
              </div>
              <div>
                <GateIndicator events={events} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

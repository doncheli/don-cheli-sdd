import { CheckCircle, XCircle, Clock, Play, FileText, Shield, ArrowRight, Loader } from 'lucide-react';
import type { Project, PhaseInfo, ArtifactInfo } from '../../lib/api';
import type { LogEntry } from '../../hooks/useWebSocket';

const STEP_EXPLANATIONS: Record<string, { emoji: string; title: string; simpleExplanation: string }> = {
  specify:   { emoji: '📋', title: 'Write the Requirements', simpleExplanation: 'Your idea is turned into a detailed checklist of exactly what the software should do — like a recipe before cooking.' },
  clarify:   { emoji: '🔍', title: 'Find Missing Details', simpleExplanation: 'A virtual assistant reviews the requirements to catch anything unclear or missing — before any code is written.' },
  plan:      { emoji: '🏗️', title: 'Design the Architecture', simpleExplanation: 'A technical blueprint is created — like an architect\'s plan before building a house.' },
  design:    { emoji: '🎨', title: 'Design the Interface', simpleExplanation: 'Visual mockups of every screen are generated so you can see what the app will look like before it\'s built.' },
  breakdown: { emoji: '📦', title: 'Split into Tasks', simpleExplanation: 'The plan is divided into small, clear tasks — each one with a specific goal and test to verify it works.' },
  implement: { emoji: '⚡', title: 'Write the Code', simpleExplanation: 'Tests are written FIRST, then the code that makes them pass. This guarantees the code actually works.' },
  review:    { emoji: '✅', title: 'Quality Review', simpleExplanation: 'An automatic peer review checks security, performance, and code quality across 7 dimensions.' },
};

function statusIcon(status: string) {
  switch (status) {
    case 'passed': return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    case 'failed': return <XCircle className="w-5 h-5 text-red-400" />;
    case 'running': return <Loader className="w-5 h-5 text-purple-400 animate-spin" />;
    default: return <Clock className="w-5 h-5 text-gray-600" />;
  }
}

function statusLabel(status: string) {
  switch (status) {
    case 'passed': return <span className="text-emerald-400 text-xs font-medium">Done</span>;
    case 'failed': return <span className="text-red-400 text-xs font-medium">Failed</span>;
    case 'running': return <span className="text-purple-400 text-xs font-medium animate-pulse">In progress...</span>;
    default: return <span className="text-gray-600 text-xs">Waiting</span>;
  }
}

interface Props {
  project: Project;
  phases: PhaseInfo[];
  artifacts: ArtifactInfo[];
  logs: LogEntry[];
  isRunning: boolean;
  onGoToPipeline: () => void;
  onGoToArtifacts: () => void;
}

export function OverviewTab({ phases, artifacts, isRunning, onGoToPipeline, onGoToArtifacts }: Props) {
  const passed = phases.filter(p => p.status === 'passed').length;
  const failed = phases.filter(p => p.status === 'failed').length;
  const total = phases.length;
  const progress = total > 0 ? Math.round((passed / total) * 100) : 0;

  const specCount = artifacts.filter(a => a.type === 'spec').length;
  const testCount = artifacts.filter(a => a.type === 'test').length;
  const reviewCount = artifacts.filter(a => a.type === 'review').length;

  return (
    <div className="space-y-8">
      {/* Hero: What is this? */}
      {passed === 0 && !isRunning && (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to build something?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6">
            Describe what you want in plain language. Don Cheli will write the requirements, design the interface, build the code with tests, and review everything — step by step.
          </p>
          <button onClick={onGoToPipeline} className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium text-lg transition-colors">
            <Play className="w-5 h-5" /> Start Building
          </button>
        </div>
      )}

      {/* Progress bar */}
      {(passed > 0 || isRunning) && (
        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold">Progress</h3>
            <span className="text-sm text-gray-400">{passed} of {total} steps completed</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${failed > 0 ? 'bg-red-500' : 'bg-purple-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && failed === 0 && (
            <p className="text-emerald-400 font-medium text-sm">All steps completed successfully! Your code is ready.</p>
          )}
          {failed > 0 && (
            <p className="text-red-400 text-sm">Some steps failed. Your original code was NOT modified — it's safe.</p>
          )}
        </div>
      )}

      {/* Stats cards */}
      {(passed > 0 || artifacts.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-950 text-center">
            <div className="text-3xl font-bold text-white mb-1">{passed}</div>
            <div className="text-xs text-gray-500">Steps Done</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-950 text-center">
            <div className="text-3xl font-bold text-white mb-1">{specCount}</div>
            <div className="text-xs text-gray-500">Specifications</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-950 text-center">
            <div className="text-3xl font-bold text-white mb-1">{testCount}</div>
            <div className="text-xs text-gray-500">Test Files</div>
          </div>
          <div className="p-4 rounded-xl border border-gray-800 bg-gray-950 text-center">
            <div className="text-3xl font-bold text-white mb-1">{reviewCount}</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
        </div>
      )}

      {/* Steps explained simply */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg">What Don Cheli does — step by step</h3>
          {passed > 0 && (
            <button onClick={onGoToPipeline} className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
              View detailed build <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="space-y-3">
          {phases.map((phase, i) => {
            const info = STEP_EXPLANATIONS[phase.name] || { emoji: '📋', title: phase.name, simpleExplanation: '' };
            const isCurrent = phase.status === 'running';
            const isDone = phase.status === 'passed';
            const isFailed = phase.status === 'failed';

            return (
              <div key={phase.name}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent ? 'border-purple-600 bg-purple-950/30 shadow-lg shadow-purple-900/20' :
                  isDone ? 'border-emerald-800/50 bg-emerald-950/10' :
                  isFailed ? 'border-red-800/50 bg-red-950/10' :
                  'border-gray-800/50 bg-gray-950/30'
                }`}>
                {/* Step number + icon */}
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="text-[10px] text-gray-600 font-mono">Step {i + 1}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold text-sm ${isDone ? 'text-emerald-300' : isFailed ? 'text-red-300' : isCurrent ? 'text-white' : 'text-gray-400'}`}>
                      {info.title}
                    </span>
                    {statusLabel(phase.status)}
                  </div>
                  <p className={`text-sm leading-relaxed ${isDone || isCurrent ? 'text-gray-300' : 'text-gray-600'}`}>
                    {info.simpleExplanation}
                  </p>
                </div>

                {/* Status */}
                <div className="shrink-0 pt-1">
                  {statusIcon(phase.status)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Safety notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-300 text-sm font-medium">Your code is always safe</p>
          <p className="text-emerald-400/60 text-xs mt-1">
            Don Cheli works on an isolated copy of your project. Your original code is NEVER modified until all steps pass successfully. If anything fails, nothing changes.
          </p>
        </div>
      </div>

      {/* Quick links */}
      {artifacts.length > 0 && (
        <div className="flex gap-3">
          <button onClick={onGoToArtifacts} className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-purple-600/50 hover:text-white transition-colors">
            <FileText className="w-4 h-4" /> View Generated Files ({artifacts.length})
          </button>
          <button onClick={onGoToPipeline} className="flex items-center gap-2 px-4 py-3 bg-gray-950 border border-gray-800 rounded-xl text-sm text-gray-300 hover:border-purple-600/50 hover:text-white transition-colors">
            <Play className="w-4 h-4" /> {isRunning ? 'View Live Build' : 'Run Again'}
          </button>
        </div>
      )}
    </div>
  );
}

import { CheckCircle, XCircle, Loader, Clock, RotateCw } from 'lucide-react';
import type { PhaseInfo } from '../lib/api';

const PHASE_ICONS: Record<string, string> = {
  specify: '📋',
  clarify: '🔍',
  plan: '🏗️',
  design: '🎨',
  breakdown: '📦',
  implement: '⚡',
  review: '✅',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'border-gray-700 bg-gray-900/50',
  running: 'border-purple-500 bg-purple-900/20 animate-pulse',
  passed: 'border-emerald-500 bg-emerald-900/20',
  failed: 'border-red-500 bg-red-900/20',
  skipped: 'border-gray-600 bg-gray-900/30',
};

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'passed':
      return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    case 'failed':
      return <XCircle className="w-5 h-5 text-red-400" />;
    case 'running':
      return <Loader className="w-5 h-5 text-purple-400 animate-spin" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
}

function formatDuration(ms?: number): string {
  if (!ms) return '--';
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

interface Props {
  phase: PhaseInfo;
  onClick?: () => void;
}

export function PhaseCard({ phase, onClick }: Props) {
  const icon = PHASE_ICONS[phase.name] || '📋';
  const colorClass = STATUS_COLORS[phase.status] || STATUS_COLORS.pending;

  return (
    <div
      className={`rounded-xl border-2 p-4 cursor-pointer transition-all hover:scale-105 ${colorClass}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <StatusIcon status={phase.status} />
      </div>
      <h3 className="text-white font-semibold capitalize text-sm">{phase.name}</h3>
      <p className="text-gray-400 text-xs mt-1 font-mono">{phase.command}</p>
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>{formatDuration(phase.duration_ms)}</span>
        {phase.cost_usd != null && <span>${phase.cost_usd.toFixed(3)}</span>}
        {phase.retries > 0 && (
          <span className="flex items-center gap-1">
            <RotateCw className="w-3 h-3" /> {phase.retries}
          </span>
        )}
      </div>
    </div>
  );
}

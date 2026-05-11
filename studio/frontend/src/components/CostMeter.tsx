import { DollarSign } from 'lucide-react';

interface Props {
  current: number;
  budget?: number;
  provider: string;
}

export function CostMeter({ current, budget, provider }: Props) {
  const percentage = budget ? Math.min((current / budget) * 100, 100) : 0;
  const isFree = provider === 'claude' || provider === 'ollama';

  const barColor =
    percentage > 90 ? 'bg-red-500' : percentage > 70 ? 'bg-yellow-500' : 'bg-emerald-500';

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
      <div className="flex items-center gap-2 mb-3">
        <DollarSign className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-gray-300">Cost</span>
      </div>

      <div className="text-3xl font-bold text-white mb-1">
        {isFree ? (
          <span className="text-emerald-400">$0.00</span>
        ) : (
          <span>${current.toFixed(3)}</span>
        )}
      </div>

      {isFree && (
        <p className="text-xs text-emerald-400/70">
          Free — using {provider === 'claude' ? 'Claude Code CLI' : 'Ollama local'}
        </p>
      )}

      {budget && !isFree && (
        <>
          <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            ${current.toFixed(3)} / ${budget.toFixed(2)} budget
          </p>
        </>
      )}
    </div>
  );
}

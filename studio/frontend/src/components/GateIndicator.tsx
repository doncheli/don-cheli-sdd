import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import type { WsEvent } from '../hooks/useWebSocket';

interface Props {
  events: WsEvent[];
}

interface GateInfo {
  phase: string;
  passed: boolean;
  message: string;
}

export function GateIndicator({ events }: Props) {
  const gates: GateInfo[] = events
    .filter((e) => e.type === 'gate_result')
    .map((e) => ({
      phase: (e.data.phase as string) || '',
      passed: (e.data.passed as boolean) ?? true,
      message: (e.data.line as string) || (e.data.message as string) || '',
    }));

  const totalPassed = gates.filter((g) => g.passed).length;
  const totalFailed = gates.filter((g) => !g.passed).length;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-gray-300">Quality Gates</span>
      </div>

      {gates.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No gate results yet</p>
      ) : (
        <>
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-bold">{totalPassed}</span>
            </div>
            {totalFailed > 0 && (
              <div className="flex items-center gap-1">
                <ShieldX className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400 font-bold">{totalFailed}</span>
              </div>
            )}
          </div>

          <div className="space-y-1 max-h-[150px] overflow-y-auto">
            {gates.map((gate, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                  gate.passed ? 'bg-emerald-900/20 text-emerald-400' : 'bg-red-900/20 text-red-400'
                }`}
              >
                {gate.passed ? (
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                ) : (
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                )}
                <span className="truncate">{gate.message || gate.phase}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

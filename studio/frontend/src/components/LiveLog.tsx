import { useEffect, useRef } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import type { LogEntry } from '../hooks/useWebSocket';

interface Props {
  logs: LogEntry[];
  onClear: () => void;
}

export function LiveLog({ logs, onClear }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-gray-300">Live Output</span>
          <span className="text-xs text-gray-500">({logs.length} lines)</span>
        </div>
        <button
          onClick={onClear}
          className="text-gray-500 hover:text-gray-300 transition-colors"
          title="Clear logs"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-5 min-h-[200px] max-h-[400px]"
      >
        {logs.length === 0 ? (
          <p className="text-gray-600 italic">Waiting for output...</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-gray-600 shrink-0 select-none">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span
                className={
                  log.stream === 'stderr'
                    ? 'text-red-400'
                    : log.line.includes('PASSED') || log.line.includes('passed')
                    ? 'text-emerald-400'
                    : log.line.includes('FAILED') || log.line.includes('failed')
                    ? 'text-red-400'
                    : 'text-gray-300'
                }
              >
                {log.line}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

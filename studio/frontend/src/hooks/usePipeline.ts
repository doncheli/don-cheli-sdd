import { useState, useCallback } from 'react';
import { api, type PhaseInfo, type PipelineStatus } from '../lib/api';

export function usePipeline(projectId: string | null) {
  const [phases, setPhases] = useState<PhaseInfo[]>([]);
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    try {
      const [s, p] = await Promise.all([
        api.pipeline.status(projectId),
        api.pipeline.phases(projectId),
      ]);
      setStatus(s);
      setPhases(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [projectId]);

  const start = useCallback(async (task: string, options?: { provider?: string; model?: string }) => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      await api.pipeline.start(projectId, task, options);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [projectId, refresh]);

  const stop = useCallback(async () => {
    // In Tauri, we'd need a stop command — for now just refresh
    if (!projectId) return;
    await refresh();
  }, [projectId, refresh]);

  return { phases, status, loading, error, refresh, start, stop };
}

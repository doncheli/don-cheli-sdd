// Detect if running inside Tauri or in a regular browser
const IS_TAURI = !!(window as unknown as Record<string, unknown>).__TAURI_INTERNALS__;

// ── Web mode: HTTP fetch ─────────────────────────────

async function httpRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ── Types ────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  path: string;
  created_at: string;
}

export interface PhaseInfo {
  name: string;
  command: string;
  status: string;
  duration_ms?: number;
  cost_usd?: number;
  retries: number;
}

export interface ArtifactInfo {
  type: string;
  name: string;
  path: string;
  phase: string;
  size_bytes: number;
}

export interface PipelineRun {
  id: string;
  project_id: string;
  task: string;
  provider: string;
  model: string;
  status: string;
  current_phase?: string;
  total_cost: number;
  started_at: string;
  completed_at?: string;
  error?: string;
  signer?: string;
}

export interface PhaseRecord {
  id: number;
  run_id: string;
  name: string;
  command: string;
  status: string;
  attempt: number;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  cost_usd: number;
  error?: string;
  layer?: string;
}

export interface PipelineStatus {
  run_id?: string;
  status: string;
  state?: Record<string, unknown>;
}

export interface DirEntry {
  name: string;
  path: string;
  is_dir: boolean;
  is_git: boolean;
  has_package_json: boolean;
}

export interface BrowseResult {
  current: string;
  parent: string | null;
  entries: DirEntry[];
}

// ── Unified API (works in both Tauri and Web) ────────

async function call<T>(tauriCmd: string, httpPath: string, httpMethod: string, args?: Record<string, unknown>): Promise<T> {
  if (IS_TAURI) {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke<T>(tauriCmd, args);
  }
  const options: RequestInit = { method: httpMethod };
  if (httpMethod === 'POST' && args) {
    options.body = JSON.stringify(args);
  }
  return httpRequest<T>(httpPath, options);
}

export const api = {
  projects: {
    list: () => call<Project[]>('list_projects', '/projects', 'GET'),
    get: (id: string) => call<Project | null>('get_project', `/projects/${id}`, 'GET', { id }),
    create: (name: string, path: string) =>
      call<Project>('create_project', '/projects', 'POST', { name, path }),
    delete: (id: string) =>
      call<boolean>('delete_project', `/projects/${id}`, 'DELETE', { id }),
  },

  pipeline: {
    start: (projectId: string, task: string, options?: { provider?: string; model?: string; signer?: string }) =>
      call<string>('start_pipeline', `/pipeline/${projectId}/start`, 'POST', {
        projectId, task, provider: options?.provider, model: options?.model, signer: options?.signer,
      }),
    stop: (projectId: string) =>
      call<{ status: string }>('stop_pipeline', `/pipeline/${projectId}/stop`, 'POST', { projectId }),
    status: (projectId: string) =>
      call<PipelineStatus>('pipeline_status', `/pipeline/${projectId}/status`, 'GET', { projectId }),
    phases: (projectId: string) =>
      call<PhaseInfo[]>('list_phases', `/pipeline/${projectId}/phases`, 'GET', { projectId }),
    artifacts: (projectId: string) =>
      call<ArtifactInfo[]>('list_artifacts', `/pipeline/${projectId}/artifacts`, 'GET', { projectId }),
    artifactContent: (projectId: string, artifactType: string, name: string) =>
      call<{ name: string; content: string; type: string }>(
        'get_artifact_content',
        `/pipeline/${projectId}/artifacts/${artifactType}/${name}`,
        'GET',
        { projectId, artifactType, name },
      ),
  },

  runs: {
    active: () => httpRequest<PipelineRun[]>('/runs/active'),
    today: () => httpRequest<PipelineRun[]>('/runs/today'),
    get: (runId: string) => httpRequest<PipelineRun>(`/runs/${runId}`),
    phases: (runId: string) => httpRequest<PhaseRecord[]>(`/runs/${runId}/phases`),
    retry: (runId: string, phaseId: number) => httpRequest<unknown>(`/runs/${runId}/phases/${phaseId}/retry`, { method: 'POST' }),
    forProject: (projectId: string) => httpRequest<PipelineRun[]>(`/runs/project/${projectId}`),
  },

  filesystem: {
    browse: (path?: string) => {
      if (IS_TAURI) {
        return call<BrowseResult>('browse_filesystem', '', 'GET', { path });
      }
      const params = path ? `?path=${encodeURIComponent(path)}` : '';
      return httpRequest<BrowseResult>(`/filesystem/browse${params}`);
    },
    mkdir: (path: string) =>
      call<void>('create_directory', '/filesystem/mkdir', 'POST', { path }),
  },
};

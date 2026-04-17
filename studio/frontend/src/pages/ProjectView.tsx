import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, LayoutDashboard, Workflow, FileText, Wifi, WifiOff } from 'lucide-react';
import type { Project, ArtifactInfo } from '../lib/api';
import { api } from '../lib/api';
import { usePipeline } from '../hooks/usePipeline';
import { useWebSocket } from '../hooks/useWebSocket';
import { OverviewTab } from './tabs/OverviewTab';
import { PipelineTab } from './tabs/PipelineTab';
import { ArtifactsTab } from './tabs/ArtifactsTab';

type Tab = 'overview' | 'pipeline' | 'artifacts';

interface Props {
  project: Project;
  onBack: () => void;
}

export function ProjectView({ project, onBack }: Props) {
  const [tab, setTab] = useState<Tab>('pipeline');
  const [artifacts, setArtifacts] = useState<ArtifactInfo[]>([]);
  const pipeline = usePipeline(project.id);
  const ws = useWebSocket(project.id);

  useEffect(() => { pipeline.refresh(); }, [pipeline.refresh]);
  useEffect(() => { if (ws.pipelineState) pipeline.refresh(); }, [ws.pipelineState, pipeline.refresh]);

  const loadArtifacts = useCallback(async () => {
    try { setArtifacts(await api.pipeline.artifacts(project.id)); } catch {}
  }, [project.id]);
  useEffect(() => { loadArtifacts(); }, [loadArtifacts]);

  const isRunning = pipeline.status?.status === 'running';
  const passedCount = pipeline.phases.filter(p => p.status === 'passed').length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" />, description: 'Project status at a glance' },
    { id: 'pipeline', label: 'Build', icon: <Workflow className="w-4 h-4" />, description: 'Run and monitor your build' },
    { id: 'artifacts', label: 'Results', icon: <FileText className="w-4 h-4" />, description: 'See what was created' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors p-1">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">{project.name}</h1>
              <p className="text-xs text-gray-500 font-mono">{project.path}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {ws.connected ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400"><Wifi className="w-3.5 h-3.5" /> Connected</span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-gray-500"><WifiOff className="w-3.5 h-3.5" /> Offline</span>
            )}
            {isRunning && (
              <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-900/30 px-2.5 py-1 rounded-full animate-pulse">
                Building...
              </span>
            )}
            {passedCount > 0 && !isRunning && (
              <span className="text-xs text-gray-500">{passedCount}/{pipeline.phases.length} steps done</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                  tab === t.id
                    ? 'bg-gray-900 text-white border border-gray-800 border-b-transparent'
                    : 'text-gray-500 hover:text-gray-300'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-6">
        {tab === 'overview' && (
          <OverviewTab
            project={project}
            phases={pipeline.phases}
            artifacts={artifacts}
            logs={ws.logs}
            isRunning={isRunning}
            onGoToPipeline={() => setTab('pipeline')}
            onGoToArtifacts={() => setTab('artifacts')}
          />
        )}
        {tab === 'pipeline' && (
          <PipelineTab
            project={project}
            pipeline={pipeline}
            ws={ws}
          />
        )}
        {tab === 'artifacts' && (
          <ArtifactsTab
            project={project}
            artifacts={artifacts}
            onRefresh={loadArtifacts}
          />
        )}
      </main>
    </div>
  );
}

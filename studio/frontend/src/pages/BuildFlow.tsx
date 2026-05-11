import { useState, useCallback, useEffect } from 'react';
import {
  FolderSearch, Upload, PenLine, FileText, X, ChevronRight, ChevronLeft,
  CheckCircle, XCircle, Loader, Clock, Shield,
  Bell,
  Link2, Mic, Video, Image, Sparkles,
} from 'lucide-react';
import { api, type PhaseInfo, type PipelineStatus } from '../lib/api';
import { useWebSocket } from '../hooks/useWebSocket';
import { FolderPicker } from '../components/FolderPicker';
import { FilePicker } from '../components/FilePicker';
import { PlanReview } from '../components/PlanReview';

// ── Flow steps ──
type Step = 'folder' | 'requirements' | 'plan' | 'executing';
type InputMode = 'choose' | 'upload' | 'describe' | 'generate';

// ── Agents ──
const AGENTS = [
  { id: 'spec', name: 'Ana', role: 'Spec Writer', avatar: '📋', phase: 'specify', desc: 'Formal Gherkin specs' },
  { id: 'qa', name: 'Marco', role: 'QA Analyst', avatar: '🔍', phase: 'clarify', desc: 'Find ambiguities' },
  { id: 'arch', name: 'Sofia', role: 'Architect', avatar: '🏗️', phase: 'plan', desc: 'Technical blueprint' },
  { id: 'design', name: 'Luis', role: 'UI Designer', avatar: '🎨', phase: 'design', desc: 'Atomic Design mockups' },
  { id: 'planner', name: 'Camila', role: 'Task Planner', avatar: '📦', phase: 'breakdown', desc: 'TDD task breakdown' },
  { id: 'dev', name: 'Diego', role: 'TDD Developer', avatar: '⚡', phase: 'implement', desc: 'Tests first → code' },
  { id: 'reviewer', name: 'Valentina', role: 'Code Reviewer', avatar: '✅', phase: 'review', desc: '7-dimension review' },
];

// ── Estimation ──
type Complexity = 'simple' | 'medium' | 'complex' | 'enterprise';
function getComplexity(len: number, n: number): Complexity {
  const t = len + n * 2000;
  return t < 200 ? 'simple' : t < 800 ? 'medium' : t < 2500 ? 'complex' : 'enterprise';
}
const BASE: Record<string, Record<Complexity, number>> = {
  specify: { simple: 2, medium: 4, complex: 7, enterprise: 12 }, clarify: { simple: 1, medium: 3, complex: 5, enterprise: 8 },
  plan: { simple: 2, medium: 5, complex: 8, enterprise: 15 }, design: { simple: 3, medium: 6, complex: 10, enterprise: 18 },
  breakdown: { simple: 1, medium: 3, complex: 5, enterprise: 10 }, implement: { simple: 5, medium: 12, complex: 25, enterprise: 50 },
  review: { simple: 2, medium: 4, complex: 6, enterprise: 10 },
};
// Time formatting moved to PlanReview component

// ── Source ──
interface Source { id: string; type: 'file' | 'link' | 'audio' | 'video' | 'image'; name: string; value: string; content?: string }
interface AttachedFile { name: string; path: string; content?: string }

// ── Step indicator ──
function StepBar({ current, steps }: { current: number; steps: string[] }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            i < current ? 'bg-emerald-900/30 text-emerald-400' :
            i === current ? 'bg-[#E8C547] text-[#0C0C0E] text-white' :
            'bg-gray-900 text-gray-600'
          }`}>
            {i < current ? <CheckCircle className="w-3.5 h-3.5" /> :
              <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>}
            {label}
          </div>
          {i < steps.length - 1 && <div className={`w-8 h-px ${i < current ? 'bg-emerald-800' : 'bg-gray-800'}`} />}
        </div>
      ))}
    </div>
  );
}

export function BuildFlow() {
  const [step, setStep] = useState<Step>('folder');

  // Folder
  const [projectPath, setProjectPath] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [showFolderPicker, setShowFolderPicker] = useState(false);

  // Home: existing projects + active runs
  const [existingProjects, setExistingProjects] = useState<{ id: string; name: string; path: string; created_at: string }[]>([]);
  const [activeRuns, setActiveRuns] = useState<import('../lib/api').PipelineRun[]>([]);
  const [todayRuns, setTodayRuns] = useState<import('../lib/api').PipelineRun[]>([]);
  const [homeLoaded, setHomeLoaded] = useState(false);

  // Load home data
  useEffect(() => {
    if (step !== 'folder' || homeLoaded) return;
    Promise.all([
      api.projects.list().catch(() => []),
      api.runs.active().catch(() => []),
      api.runs.today().catch(() => []),
    ]).then(([projects, active, today]) => {
      setExistingProjects(projects);
      setActiveRuns(active);
      setTodayRuns(today);
      setHomeLoaded(true);
    });
  }, [step, homeLoaded]);

  const openExistingProject = (proj: { id: string; name: string; path: string }) => {
    setProjectId(proj.id);
    setProjectPath(proj.path);
    setProjectName(proj.name);

    const hasActiveRun = activeRuns.some(r => r.project_id === proj.id);
    if (hasActiveRun) {
      // Active run → go to dashboard and load its state
      setStep('executing');
    } else {
      // No active run → reset everything for a fresh start
      setPhases([]);
      setStatus(null);
      setPipelineError(null);
      setMode('choose');
      setTask('');
      setAttachedFiles([]);
      setSources([]);
      setPrdContext('');
      setAgreed(false);
      setSigned(false);
      setSignerName('');
      ws.clearLogs();
      setStep('requirements');
    }
  };

  // Requirements
  const [mode, setMode] = useState<InputMode>('choose');
  const [task, setTask] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [prdContext, setPrdContext] = useState('');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [filePickerTarget, setFilePickerTarget] = useState<'upload' | 'source'>('upload');

  // Plan
  const [provider, setProvider] = useState('claude');
  const [agreed, setAgreed] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signed, setSigned] = useState(false);

  // Execution
  const [phases, setPhases] = useState<PhaseInfo[]>([]);
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const ws = useWebSocket(projectId);

  const refreshPipeline = useCallback(async () => {
    if (!projectId) return;
    try {
      const [s, p] = await Promise.all([api.pipeline.status(projectId), api.pipeline.phases(projectId)]);
      setStatus(s); setPhases(p);
    } catch {}
  }, [projectId]);

  useEffect(() => { if (ws.pipelineState && step === 'executing') refreshPipeline(); }, [ws.pipelineState, step, refreshPipeline]);

  // ── Helpers ──
  const openFilePicker = (target: 'upload' | 'source') => { setFilePickerTarget(target); setShowFilePicker(true); };
  const handleFileSelect = async (path: string, name: string) => {
    setShowFilePicker(false);
    let content: string | undefined;
    try { const r = await fetch(`/api/filesystem/read-file?path=${encodeURIComponent(path)}`); if (r.ok) content = (await r.json()).content; } catch {}
    if (filePickerTarget === 'upload') setAttachedFiles(p => [...p, { name, path, content }]);
    else setSources(p => [...p, { id: crypto.randomUUID(), type: 'file', name, value: path, content }]);
  };
  const addSource = (type: Source['type']) => setSources(p => [...p, { id: crypto.randomUUID(), type, name: '', value: '' }]);
  const updateSource = (id: string, val: string) => setSources(p => p.map(s => s.id === id ? { ...s, value: val, name: s.name || val.split('/').pop() || val } : s));

  const buildFullTask = (): string => {
    let full = task;
    if (attachedFiles.length > 0) { full += '\n\n--- DOCUMENTS ---\n'; for (const f of attachedFiles) full += `\n### ${f.name}\n${f.content || `(${f.path})`}\n`; }
    if (mode === 'generate' && (sources.length > 0 || prdContext)) {
      full += '\n\n--- SOURCES FOR PRD ---\n';
      if (prdContext) full += `Context: ${prdContext}\n`;
      for (const s of sources) full += `\n[${s.type.toUpperCase()}] ${s.name || s.value}\n${s.content || s.value}\n`;
      full += '\nGenerate a complete PRD from the sources above.\n';
    }
    return full;
  };

  const canProceed = () => {
    if (mode === 'describe') return task.trim().length > 0;
    if (mode === 'upload') return attachedFiles.length > 0;
    if (mode === 'generate') return sources.length > 0 || prdContext.trim().length > 0;
    return false;
  };

  const handleSelectFolder = async (path: string) => {
    setShowFolderPicker(false);
    setProjectPath(path);
    setProjectName(path.split('/').filter(Boolean).pop() || 'project');
    try {
      const p = await api.projects.create(path.split('/').filter(Boolean).pop() || 'project', path);
      setProjectId(p.id);
    } catch {
      const list = await api.projects.list();
      const existing = list.find(p => p.path === path);
      if (existing) setProjectId(existing.id);
    }
    // Fresh start — reset all state
    setPhases([]);
    setStatus(null);
    setPipelineError(null);
    setMode('choose');
    setTask('');
    setAttachedFiles([]);
    setSources([]);
    setPrdContext('');
    setAgreed(false);
    setSigned(false);
    setSignerName('');
    ws.clearLogs();
    setStep('requirements');
  };

  const handleStart = async () => {
    if (!projectId) return;
    // Reset everything for a fresh run
    ws.clearLogs();
    setPipelineError(null);
    setPhases([]);
    setStatus(null);
    try {
      await api.pipeline.start(projectId, buildFullTask(), { provider, signer: signerName });
      await refreshPipeline();
      setStep('executing');
    } catch (e) { setPipelineError(String(e)); }
  };

  const handleStop = async () => {
    // just refresh for now
    await refreshPipeline();
  };

  // Estimation
  const complexity = getComplexity(buildFullTask().length, attachedFiles.length + sources.length);
  const estPhases = AGENTS.map(a => {
    const base = BASE[a.phase]?.[complexity] ?? 5;
    const tdd = a.phase === 'implement' ? Math.round(base * 0.5) : 0;
    return { ...a, base, tdd, total: base + tdd };
  });
  const totalMin = estPhases.reduce((s, p) => s + p.total, 0);
  const totalNoTdd = estPhases.reduce((s, p) => s + p.base, 0);
  const isFree = provider === 'claude' || provider === 'ollama';

  const sourceIcon = (type: string) => {
    const map: Record<string, React.ReactNode> = { link: <Link2 className="w-4 h-4 text-blue-400" />, audio: <Mic className="w-4 h-4 text-pink-400" />, video: <Video className="w-4 h-4 text-red-400" />, image: <Image className="w-4 h-4 text-yellow-400" />, file: <FileText className="w-4 h-4 text-cyan-400" /> };
    return map[type] || <Link2 className="w-4 h-4 text-gray-400" />;
  };

  const stepNames = ['Project', 'Requirements', 'Plan', 'Build'];
  const stepIndex = step === 'folder' ? 0 : step === 'requirements' ? 1 : step === 'plan' ? 2 : 3;

  return (
    <div className="min-h-screen bg-[#0C0C0E]">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#E8C547] text-[#0C0C0E] flex items-center justify-center text-white font-bold">DC</div>
            <div>
              <h1 className="text-lg font-bold text-white">{projectName || 'Don Cheli Studio'}</h1>
              {projectPath && <p className="text-xs text-gray-500 font-mono">{projectPath}</p>}
            </div>
          </div>
          {step !== 'folder' && (
            <button onClick={() => { setStep('folder'); setProjectPath(''); setProjectName(''); setProjectId(null); setMode('choose'); setTask(''); setAttachedFiles([]); setSources([]); setPrdContext(''); setAgreed(false); setSigned(false); setSignerName(''); setPhases([]); setStatus(null); setPipelineError(null); ws.clearLogs(); setHomeLoaded(false); }}
              className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 border border-gray-800 rounded-lg flex items-center gap-1">
              <ChevronLeft className="w-3 h-3" /> Projects
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {step !== 'folder' && <StepBar current={stepIndex} steps={stepNames} />}

        {/* ═══════ STEP 1: HOME — Projects + Active Runs ═══════ */}
        {step === 'folder' && (
          <div className="space-y-8">
            {/* Active runs */}
            {activeRuns.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative"><div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-ping absolute" /><div className="w-2.5 h-2.5 bg-purple-500 rounded-full relative" /></div>
                  <h2 className="text-white font-semibold">Running now</h2>
                </div>
                <div className="space-y-2">
                  {activeRuns.map(run => {
                    const proj = existingProjects.find(p => p.id === run.project_id);
                    return (
                      <button key={run.id} onClick={() => { if (proj) openExistingProject(proj); }}
                        className="w-full flex items-center gap-4 p-4 rounded-md border border-purple-800/50 bg-purple-950/20 hover:bg-purple-950/30 transition-all text-left">
                        <div className="w-10 h-10 rounded bg-[#E8C547] text-[#0C0C0E] flex items-center justify-center text-white font-bold shrink-0">
                          {(proj?.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{proj?.name || 'Project'}</span>
                            <Loader className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                            {run.current_phase && (
                              <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded-full">
                                {AGENTS.find(a => a.phase === run.current_phase)?.avatar} {run.current_phase}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{run.task.substring(0, 80)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-gray-500">{new Date(run.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-xs text-purple-400 font-medium">In progress</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-purple-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Existing projects */}
            {existingProjects.length > 0 && (
              <div>
                <h2 className="text-white font-semibold mb-3">Your projects</h2>
                <div className="space-y-2">
                  {existingProjects.map(proj => {
                    const lastRun = todayRuns.find(r => r.project_id === proj.id);
                    const isActive = activeRuns.some(r => r.project_id === proj.id);
                    if (isActive) return null; // Already shown above
                    return (
                      <button key={proj.id} onClick={() => openExistingProject(proj)}
                        className="w-full flex items-center gap-4 p-4 rounded-md border border-gray-800 bg-gray-950 hover:border-[#E8C54730] hover:bg-gray-900/50 transition-all text-left group">
                        <div className="w-10 h-10 rounded bg-gray-800 group-hover:bg-purple-900/30 flex items-center justify-center text-gray-400 group-hover:text-purple-400 font-bold shrink-0 transition-colors">
                          {proj.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-white font-semibold">{proj.name}</span>
                          <p className="text-xs text-gray-500 font-mono truncate">{proj.path}</p>
                        </div>
                        {lastRun && (
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-1 text-xs">
                              {lastRun.status === 'passed' ? <CheckCircle className="w-3 h-3 text-emerald-400" /> :
                               lastRun.status === 'failed' ? <XCircle className="w-3 h-3 text-red-400" /> :
                               <Clock className="w-3 h-3 text-gray-500" />}
                              <span className={lastRun.status === 'passed' ? 'text-emerald-400' : lastRun.status === 'failed' ? 'text-red-400' : 'text-gray-500'}>
                                Last: {lastRun.status}
                              </span>
                            </div>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Today's history */}
            {todayRuns.length > 0 && !activeRuns.length && (
              <div>
                <h2 className="text-gray-400 font-semibold text-sm mb-3">Today's builds</h2>
                <div className="space-y-1">
                  {todayRuns.slice(0, 8).map(run => {
                    const proj = existingProjects.find(p => p.id === run.project_id);
                    return (
                      <div key={run.id} onClick={() => { if (proj) openExistingProject(proj); }}
                        className="flex items-center gap-3 px-4 py-2.5 rounded hover:bg-gray-900/50 cursor-pointer transition-colors">
                        {run.status === 'passed' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> :
                         run.status === 'failed' ? <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" /> :
                         <Clock className="w-3.5 h-3.5 text-gray-600 shrink-0" />}
                        <span className="text-sm text-gray-300 flex-1 truncate">{proj?.name || '—'}: {run.task.substring(0, 50)}</span>
                        <span className="text-xs text-gray-600 shrink-0">{new Date(run.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* New project button */}
            <div className={existingProjects.length > 0 ? 'pt-4 border-t border-gray-800' : ''}>
              {existingProjects.length === 0 && (
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to Don Cheli Studio</h2>
                  <p className="text-gray-400">Select a project folder to start building</p>
                </div>
              )}
              <button onClick={() => setShowFolderPicker(true)}
                className="w-full flex items-center justify-center gap-3 px-6 py-5 border-2 border-dashed border-gray-700 hover:border-[#E8C54740] rounded-md text-gray-400 hover:text-purple-400 transition-colors">
                <FolderSearch className="w-6 h-6" />
                <span className="font-medium">{existingProjects.length > 0 ? 'Add another project' : 'Select project folder'}</span>
              </button>
            </div>

            {showFolderPicker && <FolderPicker onSelect={handleSelectFolder} onClose={() => setShowFolderPicker(false)} />}
          </div>
        )}

        {/* ═══════ STEP 2: REQUIREMENTS ═══════ */}
        {step === 'requirements' && mode === 'choose' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Define your requirements</h2>
              <p className="text-gray-400">How do you want to tell us what to build?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => setMode('upload')} className="p-6 rounded-md border border-gray-800 bg-gray-950 hover:border-blue-600/50 hover:bg-blue-950/10 transition-all text-left">
                <Upload className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-white font-semibold mb-1">I have a PRD</h3>
                <p className="text-xs text-gray-500">Upload an existing requirements document (.md, .pdf, .docx, .txt)</p>
              </button>
              <button onClick={() => setMode('describe')} className="p-6 rounded-md border border-gray-800 bg-gray-950 hover:border-[#E8C54740] hover:bg-purple-950/10 transition-all text-left">
                <PenLine className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-white font-semibold mb-1">Write a description</h3>
                <p className="text-xs text-gray-500">Describe what you want in plain language</p>
              </button>
              <button onClick={() => setMode('generate')} className="p-6 rounded-md border border-gray-800 bg-gray-950 hover:border-emerald-600/50 hover:bg-emerald-950/10 transition-all text-left relative overflow-hidden">
                <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
                <h3 className="text-white font-semibold mb-1">Generate a PRD</h3>
                <p className="text-xs text-gray-500">From docs, Figma, Stitch, audio, video, images</p>
                <span className="absolute top-3 right-3 text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">AI</span>
              </button>
            </div>
            <button onClick={() => setStep('folder')} className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 mx-auto"><ChevronLeft className="w-3 h-3" /> Back</button>
          </div>
        )}

        {step === 'requirements' && mode !== 'choose' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {mode === 'upload' ? 'Upload your document' : mode === 'describe' ? 'Describe your project' : 'Generate PRD from sources'}
              </h2>
              <button onClick={() => setMode('choose')} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 border border-gray-800 rounded-lg">Back</button>
            </div>

            <div className="p-6 rounded-md border border-gray-800 bg-gray-950 space-y-4">
              {/* Upload */}
              {mode === 'upload' && (<>
                {attachedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded border border-gray-800">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0"><p className="text-sm text-white font-medium truncate">{f.name}</p><p className="text-xs text-gray-500 font-mono truncate">{f.path}</p></div>
                    {f.content && <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full">Loaded</span>}
                    <button onClick={() => setAttachedFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400"><X className="w-4 h-4" /></button>
                  </div>
                ))}
                <button onClick={() => openFilePicker('upload')} className="w-full flex items-center justify-center gap-2 px-4 py-5 border-2 border-dashed border-gray-700 hover:border-blue-600/50 rounded text-gray-400 hover:text-blue-400">
                  <Upload className="w-5 h-5" /><span className="text-sm font-medium">{attachedFiles.length ? 'Add another' : 'Browse and select'}</span>
                </button>
                <textarea value={task} onChange={e => setTask(e.target.value)} placeholder="Additional context (optional)" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600 resize-none" rows={2} />
              </>)}

              {/* Describe */}
              {mode === 'describe' && (<>
                <textarea value={task} onChange={e => setTask(e.target.value)}
                  placeholder={'Describe what you want to build...\n\nExample: "An e-commerce app with product catalog, shopping cart, Stripe checkout, and order tracking. Admin panel for managing products."'}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600 resize-none" rows={8} />
                <button onClick={() => openFilePicker('upload')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400"><Upload className="w-3.5 h-3.5" /> Attach reference</button>
                {attachedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-900 rounded-lg border border-gray-800">
                    <FileText className="w-3.5 h-3.5 text-blue-400" /><span className="text-xs text-gray-300 flex-1 truncate">{f.name}</span>
                    <button onClick={() => setAttachedFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </>)}

              {/* Generate PRD */}
              {mode === 'generate' && (<>
                <div>
                  <label className="block text-sm text-gray-300 font-medium mb-1">What's the product about?</label>
                  <textarea value={prdContext} onChange={e => setPrdContext(e.target.value)} placeholder="Brief: e.g. 'A mobile banking app for Venezuela'" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600 resize-none" rows={2} />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 font-medium mb-2">Sources — add everything you have</label>
                  {sources.map(s => (
                    <div key={s.id} className="flex items-center gap-2 px-3 py-2.5 bg-gray-900 rounded border border-gray-800 mb-2">
                      {sourceIcon(s.type)}
                      <span className="text-xs text-gray-500 uppercase w-12 shrink-0">{s.type}</span>
                      <input type="text" value={s.value} onChange={e => updateSource(s.id, e.target.value)}
                        placeholder={s.type === 'link' ? 'https://figma.com/file/...' : s.type === 'audio' ? '/path/to/recording.mp3' : s.type === 'video' ? 'https://youtube.com/...' : '/path/to/file'}
                        className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600" />
                      {s.content && <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full">OK</span>}
                      <button onClick={() => setSources(p => p.filter(x => x.id !== s.id))} className="text-gray-600 hover:text-red-400"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => openFilePicker('source')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-800/50"><FileText className="w-3.5 h-3.5" /> Document</button>
                  <button onClick={() => addSource('link')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-800/50"><Link2 className="w-3.5 h-3.5" /> Link (Figma, Stitch, Web)</button>
                  <button onClick={() => addSource('image')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-800/50"><Image className="w-3.5 h-3.5" /> Image</button>
                  <button onClick={() => addSource('audio')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-pink-400 hover:border-pink-800/50"><Mic className="w-3.5 h-3.5" /> Audio</button>
                  <button onClick={() => addSource('video')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-red-400 hover:border-red-800/50"><Video className="w-3.5 h-3.5" /> Video</button>
                </div>
                <div className="pt-3 border-t border-gray-800/50">
                  <p className="text-xs text-gray-600 mb-2">Examples:</p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs text-gray-500">
                    <span>• Figma design file</span><span>• Google Stitch prototype</span>
                    <span>• Existing PRD or brief</span><span>• UI wireframe screenshot</span>
                    <span>• Voice memo with ideas</span><span>• Competitor demo video</span>
                  </div>
                </div>
              </>)}
            </div>

            {canProceed() && (
              <div className="flex justify-end">
                <button onClick={() => setStep('plan')} className="flex items-center gap-2 px-8 py-3 bg-[#E8C547] text-[#0C0C0E] hover:bg-[#D4B23E] text-white rounded font-medium">
                  Review Plan <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {showFilePicker && <FilePicker title="Select a file" extensions="md,txt,pdf,docx,doc,feature,json,yaml,yml,png,jpg,mp3,wav,mp4" onSelect={handleFileSelect} onClose={() => setShowFilePicker(false)} />}
          </div>
        )}

        {/* ═══════ STEP 3: PLAN + SIGNATURE ═══════ */}
        {step === 'plan' && (
          <PlanReview
            fullTask={buildFullTask()}
            attachedFiles={attachedFiles}
            sources={sources}
            estPhases={estPhases}
            totalMin={totalMin}
            totalNoTdd={totalNoTdd}
            complexity={complexity}
            isFree={isFree}
            provider={provider}
            setProvider={setProvider}
            agreed={agreed}
            setAgreed={setAgreed}
            signerName={signerName}
            setSignerName={setSignerName}
            signed={signed}
            setSigned={setSigned}
            onBack={() => setStep('requirements')}
            onStart={handleStart}
            error={pipelineError}
            sourceIcon={sourceIcon}
          />
        )}

        {/* ═══════ STEP 4: PALANTIR DASHBOARD ═══════ */}
        {step === 'executing' && (
          <ExecutionDashboard
            projectId={projectId}
            phases={phases}
            status={status}
            ws={ws}
            provider={provider}
            signerName={signerName}
            isFree={isFree}
            onStop={handleStop}
            onRefresh={refreshPipeline}
          />
        )}
      </main>
    </div>
  );
}

// ── Palantir-style Ops Dashboard ──
// Colors from Blueprint: #0C0C0E, #141416, #252A31, #2A2A30
// Accent: #E8C547 (blue4), #4ADE80 (green4), #F87171 (red4)

function ExecutionDashboard({ projectId, phases, status, ws, provider, signerName, isFree, onStop, onRefresh }: {
  projectId: string | null; phases: PhaseInfo[]; status: PipelineStatus | null;
  ws: { events: { type: string; data: Record<string, unknown> }[]; logs: { line: string; timestamp: string; stream?: string }[]; clearLogs: () => void };
  provider: string; signerName: string; isFree: boolean;
  onStop: () => void; onRefresh: () => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [diagnosis, setDiagnosis] = useState<{ error_details: string[]; suggestions: string[]; error_logs: string[] } | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [diagLoading, setDiagLoading] = useState(false);

  const isRunning = status?.status === 'running';
  const currentPhase = phases.find(p => p.status === 'running');
  const passed = phases.filter(p => p.status === 'passed').length;
  const failed = phases.filter(p => p.status === 'failed').length;
  const progress = phases.length > 0 ? Math.round((passed / phases.length) * 100) : 0;
  const agent = currentPhase ? AGENTS.find(a => a.phase === currentPhase.name) : null;
  const needsAttention = failed > 0;
  const totalCost = phases.reduce((s, p) => s + (p.cost_usd || 0), 0);
  const allDone = passed === phases.length && phases.length > 0;

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(t);
  }, [startTime]);

  useEffect(() => {
    const t = setInterval(onRefresh, 4000);
    return () => clearInterval(t);
  }, [onRefresh]);

  // Auto-load diagnosis when failure detected
  useEffect(() => {
    if (needsAttention && projectId && !diagnosis && !diagLoading) {
      setDiagLoading(true);
      fetch(`/api/pipeline/${projectId}/diagnosis`)
        .then(r => r.json())
        .then(d => setDiagnosis(d))
        .catch(() => {})
        .finally(() => setDiagLoading(false));
    }
  }, [needsAttention, projectId, diagnosis, diagLoading]);

  const handleRetry = async () => {
    if (!projectId || retrying) return;
    setRetrying(true);
    ws.clearLogs();
    try {
      const res = await fetch(`/api/pipeline/${projectId}/retry`, { method: 'POST' });
      const result = await res.json();
      // Show the fix plan in the logs
      if (result.fix_instructions) {
        // The backend already sends fix instructions via WebSocket
      }
      setDiagnosis(null);
      onRefresh();
    } catch {}
    setTimeout(() => setRetrying(false), 5000);
  };

  const fmtE = (s: number) => { const m = Math.floor(s / 60); const ss = s % 60; const h = Math.floor(m / 60); return h > 0 ? `${h}:${(m%60).toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}` : `${m.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`; };

  const getLayer = (p: string) => {
    const map: Record<string,string> = { specify:'REQ', clarify:'QA', plan:'ARCH', design:'UI/UX', breakdown:'PLAN', implement:'DEV', review:'QA' };
    return map[p] || '—';
  };
  const getLayerFull = (p: string) => {
    const map: Record<string,string> = { specify:'Requirements', clarify:'Quality Assurance', plan:'Architecture', design:'UI/UX Design', breakdown:'Task Planning', implement:'Development', review:'Code Review' };
    return map[p] || '—';
  };

  // Phase timeline data
  const phaseTimeline = phases.map((p, i) => {
    const a = AGENTS.find(x => x.phase === p.name);
    return { ...p, agent: a, index: i };
  });

  return (
    <div className="-mx-6 -mt-8" style={{ fontFamily: "'JetBrains Mono', 'SF Mono', 'Consolas', monospace" }}>
      {/* ═══ TOP STATUS BAR ═══ */}
      <div className="flex items-center justify-between px-4 py-2" style={{ background: '#0C0C0E', borderBottom: '1px solid #2A2A30' }}>
        <div className="flex items-center gap-3">
          {isRunning && <div className="w-2 h-2 rounded-full bg-[#E8C547] animate-pulse" />}
          {needsAttention && !isRunning && <div className="w-2 h-2 rounded-full bg-[#F87171]" />}
          {allDone && <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />}
          {!isRunning && !needsAttention && !allDone && <div className="w-2 h-2 rounded-full bg-[#56565E]" />}
          <span className="text-xs uppercase tracking-widest" style={{ color: '#E8E8EC' }}>
            {isRunning ? 'PIPELINE ACTIVE' : needsAttention ? 'ATTENTION REQUIRED' : allDone ? 'PIPELINE COMPLETE' : 'STANDBY'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs" style={{ color: '#8E8E96' }}>ELAPSED</span>
          <span className="text-sm font-bold" style={{ color: isRunning ? '#E8C547' : '#E8E8EC' }}>{fmtE(elapsed)}</span>
          {isRunning && (
            <button onClick={onStop} className="text-[10px] uppercase tracking-wider px-3 py-1 rounded" style={{ color: '#F87171', border: '1px solid #56565E33', background: '#F8717111' }}>
              Abort
            </button>
          )}
        </div>
      </div>

      {/* ═══ KPI STRIP ═══ */}
      <div className="grid grid-cols-6" style={{ background: '#141416', borderBottom: '1px solid #2A2A30' }}>
        {[
          { label: 'PHASES', value: `${passed}/${phases.length}`, color: '#E8E8EC' },
          { label: 'PASSED', value: `${passed}`, color: '#4ADE80' },
          { label: 'FAILED', value: `${failed}`, color: failed > 0 ? '#F87171' : '#56565E' },
          { label: 'ELAPSED', value: fmtE(elapsed), color: '#E8C547' },
          { label: 'COST', value: isFree ? '$0.00' : `$${totalCost.toFixed(2)}`, color: '#4ADE80' },
          { label: 'PROVIDER', value: provider.toUpperCase(), color: '#E8E8EC' },
        ].map(kpi => (
          <div key={kpi.label} className="px-4 py-3 text-center" style={{ borderColor: '#2A2A30' }}>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8E8E96' }}>{kpi.label}</div>
            <div className="text-lg font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* ═══ PROGRESS BAR ═══ */}
      <div className="px-4 py-2" style={{ background: '#0C0C0E', borderBottom: '1px solid #2A2A30' }}>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest w-16" style={{ color: '#8E8E96' }}>{progress}%</span>
          <div className="flex-1 h-1 rounded-full" style={{ background: '#2A2A30' }}>
            <div className="h-1 rounded-full transition-all duration-1000" style={{ width: `${progress}%`, background: failed > 0 ? '#F87171' : allDone ? '#4ADE80' : '#E8C547' }} />
          </div>
          {currentPhase && <span className="text-[10px] uppercase tracking-widest" style={{ color: '#E8C547' }}>{getLayerFull(currentPhase.name)}</span>}
        </div>
      </div>

      {/* ═══ MAIN GRID: 3 columns ═══ */}
      <div className="grid grid-cols-12" style={{ background: '#0C0C0E', minHeight: '500px' }}>

        {/* ── LEFT: Phase Timeline (3 cols) ── */}
        <div className="col-span-3 border-r" style={{ borderColor: '#2A2A30', background: '#141416' }}>
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #2A2A30' }}>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#8E8E96' }}>Pipeline Phases</span>
          </div>
          {phaseTimeline.map((p) => {
            const cur = p.status === 'running', pass = p.status === 'passed', fail = p.status === 'failed';
            return (
              <div key={p.name} className="flex items-center gap-2 px-3 py-2.5 border-b" style={{
                borderColor: '#2A2A3022',
                background: cur ? '#E8C54711' : fail ? '#F8717108' : 'transparent',
                borderLeft: cur ? '2px solid #E8C547' : fail ? '2px solid #F87171' : pass ? '2px solid #4ADE80' : '2px solid transparent',
              }}>
                {/* Status indicator */}
                <div className="w-5 flex justify-center">
                  {cur && <Loader className="w-3.5 h-3.5 animate-spin" style={{ color: '#E8C547' }} />}
                  {pass && <CheckCircle className="w-3.5 h-3.5" style={{ color: '#4ADE80' }} />}
                  {fail && <XCircle className="w-3.5 h-3.5" style={{ color: '#F87171' }} />}
                  {!cur && !pass && !fail && <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#56565E' }} />}
                </div>

                <span className="text-sm">{p.agent?.avatar}</span>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium" style={{ color: cur ? '#E8C547' : pass ? '#4ADE80' : fail ? '#F87171' : '#56565E' }}>
                    {p.agent?.name}
                  </div>
                  <div className="text-[10px]" style={{ color: '#8E8E96' }}>{getLayer(p.name)}</div>
                </div>

                {/* Retry button for failed */}
                {fail && (
                  <button onClick={handleRetry} disabled={retrying}
                    className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded" style={{ color: '#F87171', border: '1px solid #F8717144' }}>
                    {retrying ? 'Retrying...' : 'Retry'}
                  </button>
                )}
              </div>
            );
          })}

          {/* Signer */}
          {signerName && (
            <div className="px-3 py-3 border-t" style={{ borderColor: '#2A2A30' }}>
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8E8E96' }}>Approved by</div>
              <div className="text-xs font-medium" style={{ color: '#E8E8EC' }}>{signerName}</div>
            </div>
          )}

          {/* Safety */}
          <div className="px-3 py-3 border-t" style={{ borderColor: '#2A2A30' }}>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3" style={{ color: '#4ADE80' }} />
              <span className="text-[10px] uppercase tracking-widest" style={{ color: '#4ADE80' }}>Isolated</span>
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: '#56565E' }}>Project untouched</div>
          </div>
        </div>

        {/* ── CENTER: Live Log (6 cols) ── */}
        <div className="col-span-6 flex flex-col" style={{ background: '#0C0C0E' }}>
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #2A2A30' }}>
            <span className="text-[10px] uppercase tracking-widest" style={{ color: '#8E8E96' }}>Live Output</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px]" style={{ color: '#56565E' }}>{ws.logs.length} lines</span>
              <button onClick={ws.clearLogs} className="text-[10px]" style={{ color: '#56565E' }}>Clear</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 text-[11px] leading-5" style={{ maxHeight: '460px' }}>
            {ws.logs.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#56565E' }}>
                <div className="text-[10px] uppercase tracking-widest">Awaiting output</div>
              </div>
            ) : ws.logs.map((log, i) => (
              <div key={i} className="flex gap-2 hover:bg-white/[0.02]">
                <span className="select-none shrink-0" style={{ color: '#56565E' }}>
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span style={{
                  color: log.stream === 'stderr' ? '#F87171' :
                    log.line.includes('PASSED') || log.line.includes('✅') ? '#4ADE80' :
                    log.line.includes('FAILED') || log.line.includes('❌') ? '#F87171' :
                    log.line.includes('Phase') || log.line.includes('Gate') ? '#E8C547' :
                    '#E8E8EC'
                }}>{log.line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Full Metrics Panel (3 cols) ── */}
        <div className="col-span-3 border-l overflow-y-auto" style={{ borderColor: '#2A2A30', background: '#141416', maxHeight: '560px' }}>

          {/* Current operation */}
          <div className="px-3 py-3" style={{ borderBottom: '1px solid #2A2A30' }}>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#8E8E96' }}>Current Operation</div>
            {currentPhase ? (
              <div>
                <div className="text-sm font-bold" style={{ color: '#E8C547' }}>{agent?.avatar} {agent?.name}</div>
                <div className="text-xs" style={{ color: '#E8E8EC' }}>{agent?.role}</div>
                <div className="text-[10px] mt-1" style={{ color: '#56565E' }}>{currentPhase.command}</div>
                <div className="mt-2 px-2 py-1 rounded text-[10px] uppercase tracking-wider inline-block" style={{ color: '#E8C547', background: '#E8C54711', border: '1px solid #E8C54733' }}>
                  {getLayerFull(currentPhase.name)}
                </div>
              </div>
            ) : (
              <div className="text-xs" style={{ color: '#56565E' }}>{allDone ? 'All phases complete' : 'Waiting...'}</div>
            )}
          </div>

          {/* Live metrics grid */}
          <div className="grid grid-cols-2" style={{ borderBottom: '1px solid #2A2A30' }}>
            {[
              { l: 'Elapsed', v: fmtE(elapsed), c: '#E8C547' },
              { l: 'Cost', v: isFree ? '$0.00' : `$${totalCost.toFixed(2)}`, c: '#4ADE80' },
              { l: 'Progress', v: `${progress}%`, c: progress === 100 ? '#4ADE80' : '#E8C547' },
              { l: 'Provider', v: provider.toUpperCase(), c: '#E8E8EC' },
              { l: 'Log Lines', v: `${ws.logs.length}`, c: '#E8E8EC' },
              { l: 'Errors', v: `${ws.logs.filter(l => l.stream === 'stderr' || l.line.includes('FAIL') || l.line.includes('❌')).length}`, c: ws.logs.some(l => l.stream === 'stderr') ? '#F87171' : '#56565E' },
              { l: 'Warnings', v: `${ws.logs.filter(l => l.line.includes('⚠') || l.line.includes('WARN') || l.line.includes('warn')).length}`, c: '#D4A017' },
              { l: 'Commits', v: `${ws.logs.filter(l => l.line.includes('Committed:')).length}`, c: '#E8C547' },
            ].map(m => (
              <div key={m.l} className="px-3 py-2 border-b border-r" style={{ borderColor: '#2A2A3022' }}>
                <div className="text-[8px] uppercase tracking-widest" style={{ color: '#56565E' }}>{m.l}</div>
                <div className="text-xs font-bold" style={{ color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>

          {/* Throughput */}
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #2A2A30' }}>
            <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#8E8E96' }}>Throughput</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
              <div style={{ color: '#56565E' }}>Speed</div>
              <div style={{ color: '#E8E8EC' }}>{elapsed > 0 ? `${(passed / (elapsed / 60)).toFixed(1)} phases/min` : '—'}</div>
              <div style={{ color: '#56565E' }}>Avg phase</div>
              <div style={{ color: '#E8E8EC' }}>{passed > 0 ? `${Math.round(elapsed / passed)}s` : '—'}</div>
              <div style={{ color: '#56565E' }}>Log rate</div>
              <div style={{ color: '#E8E8EC' }}>{elapsed > 0 ? `${(ws.logs.length / (elapsed / 60)).toFixed(0)} lines/min` : '—'}</div>
              <div style={{ color: '#56565E' }}>Est. remaining</div>
              <div style={{ color: '#E8C547' }}>{passed > 0 && passed < phases.length ? `~${Math.round((elapsed / passed) * (phases.length - passed))}s` : allDone ? 'Done' : '—'}</div>
            </div>
          </div>

          {/* Phase timeline with duration */}
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #2A2A30' }}>
            <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#8E8E96' }}>Phase Timeline</div>
            <div className="space-y-1">
              {phases.map((p, i) => {
                const dur = p.duration_ms ? `${(p.duration_ms / 1000).toFixed(1)}s` : p.status === 'running' ? fmtE(elapsed) : '—';
                const barWidth = p.status === 'passed' ? 100 : p.status === 'running' ? 50 : 0;
                return (
                  <div key={p.name} className="flex items-center gap-2">
                    <span className="w-3 text-right text-[9px]" style={{ color: '#56565E' }}>{i + 1}</span>
                    <span className="text-[10px] w-16 truncate" style={{ color: p.status === 'passed' ? '#4ADE80' : p.status === 'running' ? '#E8C547' : p.status === 'failed' ? '#F87171' : '#56565E' }}>
                      {p.name}
                    </span>
                    <div className="flex-1 h-1 rounded-full" style={{ background: '#2A2A30' }}>
                      <div className="h-1 rounded-full transition-all" style={{
                        width: `${barWidth}%`,
                        background: p.status === 'passed' ? '#4ADE80' : p.status === 'running' ? '#E8C547' : p.status === 'failed' ? '#F87171' : 'transparent',
                      }} />
                    </div>
                    <span className="text-[9px] w-10 text-right font-mono" style={{ color: p.status === 'running' ? '#E8C547' : '#56565E' }}>{dur}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Session info */}
          <div className="px-3 py-2" style={{ borderBottom: '1px solid #2A2A30' }}>
            <div className="text-[10px] uppercase tracking-widest mb-1.5" style={{ color: '#8E8E96' }}>Session</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
              <div style={{ color: '#56565E' }}>Started</div>
              <div style={{ color: '#E8E8EC' }}>{new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div style={{ color: '#56565E' }}>Approved by</div>
              <div style={{ color: '#E8E8EC' }}>{signerName || '—'}</div>
              <div style={{ color: '#56565E' }}>Mode</div>
              <div style={{ color: '#E8E8EC' }}>TDD (strict)</div>
              <div style={{ color: '#56565E' }}>Isolation</div>
              <div style={{ color: '#4ADE80' }}>Git worktree</div>
            </div>
          </div>

          {/* Diagnosis when failed */}
          {needsAttention && (
            <div style={{ background: '#F8717108' }}>
              <div className="px-3 py-2" style={{ borderBottom: '1px solid #F8717122' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3 h-3" style={{ color: '#F87171' }} />
                    <span className="text-[10px] uppercase tracking-widest" style={{ color: '#F87171' }}>Diagnosis</span>
                  </div>
                  <button onClick={handleRetry} disabled={retrying}
                    className="text-[10px] uppercase tracking-wider px-3 py-1 rounded"
                    style={{ color: retrying ? '#56565E' : '#E8C547', border: '1px solid #E8C54733', background: '#E8C54711' }}>
                    {retrying ? '...' : 'Retry'}
                  </button>
                </div>
              </div>
              {diagnosis?.error_details && diagnosis.error_details.length > 0 && (
                <div className="px-3 py-2" style={{ borderBottom: '1px solid #2A2A3022' }}>
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: '#8E8E96' }}>Error</div>
                  {diagnosis.error_details.map((d, i) => <div key={i} className="text-[10px] py-0.5" style={{ color: '#F87171' }}>{d}</div>)}
                </div>
              )}
              {diagnosis?.suggestions && diagnosis.suggestions.length > 0 && (
                <div className="px-3 py-2">
                  <div className="text-[9px] uppercase tracking-widest mb-1" style={{ color: '#4ADE80' }}>Fix</div>
                  {diagnosis.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-1 py-0.5">
                      <span className="text-[10px]" style={{ color: '#4ADE80' }}>→</span>
                      <span className="text-[10px]" style={{ color: '#E8E8EC' }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {diagLoading && <div className="px-3 py-2 text-[10px]" style={{ color: '#8E8E96' }}>Analyzing...</div>}
              {!diagnosis && !diagLoading && <div className="px-3 py-2 text-[10px]" style={{ color: '#F8717199' }}>Failed. Click Retry.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

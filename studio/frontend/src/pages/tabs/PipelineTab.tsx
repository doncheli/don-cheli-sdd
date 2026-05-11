import { useState, useEffect } from 'react';
import {
  Play, Square, Upload, PenLine, FileText, X,
  CheckCircle, XCircle, Loader, Clock, AlertTriangle, Shield, TestTube,
  Users, DollarSign, Pen, ChevronRight, Bell,
  Activity, Link2, Mic, Video, Image, Sparkles,
} from 'lucide-react';
import type { Project } from '../../lib/api';
import { LiveLog } from '../../components/LiveLog';
import { FilePicker } from '../../components/FilePicker';

// ── Flow ──
type FlowStep = 'input' | 'plan' | 'executing';
type InputMode = 'choose' | 'upload' | 'describe' | 'generate';

// ── Agents ──
interface Agent { id: string; name: string; role: string; avatar: string; phase: string; description: string }
const AGENTS: Agent[] = [
  { id: 'spec', name: 'Ana', role: 'Spec Writer', avatar: '📋', phase: 'specify', description: 'Formal Gherkin specs with test scenarios' },
  { id: 'qa', name: 'Marco', role: 'QA Analyst', avatar: '🔍', phase: 'clarify', description: 'Find ambiguities before coding' },
  { id: 'arch', name: 'Sofia', role: 'Architect', avatar: '🏗️', phase: 'plan', description: 'Technical blueprint & API contracts' },
  { id: 'design', name: 'Luis', role: 'UI Designer', avatar: '🎨', phase: 'design', description: 'Atomic Design mockups & prototypes' },
  { id: 'planner', name: 'Camila', role: 'Task Planner', avatar: '📦', phase: 'breakdown', description: 'Split into TDD tasks' },
  { id: 'dev', name: 'Diego', role: 'TDD Developer', avatar: '⚡', phase: 'implement', description: 'Tests first → code → refactor' },
  { id: 'reviewer', name: 'Valentina', role: 'Code Reviewer', avatar: '✅', phase: 'review', description: '7-dimension quality review' },
];

// ── Time estimation ──
type Complexity = 'simple' | 'medium' | 'complex' | 'enterprise';
function getComplexity(len: number, files: number): Complexity {
  const t = len + files * 2000;
  return t < 200 ? 'simple' : t < 800 ? 'medium' : t < 2500 ? 'complex' : 'enterprise';
}
const BASE_MIN: Record<string, Record<Complexity, number>> = {
  specify: { simple: 2, medium: 4, complex: 7, enterprise: 12 }, clarify: { simple: 1, medium: 3, complex: 5, enterprise: 8 },
  plan: { simple: 2, medium: 5, complex: 8, enterprise: 15 }, design: { simple: 3, medium: 6, complex: 10, enterprise: 18 },
  breakdown: { simple: 1, medium: 3, complex: 5, enterprise: 10 }, implement: { simple: 5, medium: 12, complex: 25, enterprise: 50 },
  review: { simple: 2, medium: 4, complex: 6, enterprise: 10 },
};
function fmt(m: number) { return m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${m % 60}m`; }

// ── Source types for PRD generator ──
interface Source { id: string; type: 'file' | 'link' | 'text' | 'audio' | 'video' | 'image'; name: string; value: string; content?: string }

// ── Props ──
interface Props {
  project: Project;
  pipeline: {
    phases: import('../../lib/api').PhaseInfo[];
    status: import('../../lib/api').PipelineStatus | null;
    loading: boolean; error: string | null; refresh: () => void;
    start: (task: string, options?: { provider?: string }) => void; stop: () => void;
  };
  ws: { connected: boolean; events: import('../../hooks/useWebSocket').WsEvent[]; logs: import('../../hooks/useWebSocket').LogEntry[]; clearLogs: () => void };
}

export function PipelineTab({ pipeline, ws }: Props) {
  const [step, setStep] = useState<FlowStep>('input');
  const [mode, setMode] = useState<InputMode>('choose');
  const [task, setTask] = useState('');
  const [provider, setProvider] = useState('claude');
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [filePickerTarget, setFilePickerTarget] = useState<'upload' | 'source'>('upload');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; path: string; content?: string }[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [signerName, setSignerName] = useState('');
  const [signed, setSigned] = useState(false);

  // Generate PRD mode sources
  const [sources, setSources] = useState<Source[]>([]);
  const [prdContext, setPrdContext] = useState('');

  const isRunning = pipeline.status?.status === 'running';
  const hasRun = ws.logs.length > 0 || pipeline.phases.some(p => p.status !== 'pending');

  useEffect(() => { if (isRunning && step !== 'executing') setStep('executing'); }, [isRunning, step]);
  useEffect(() => { if (hasRun && step === 'input') setStep('executing'); }, [hasRun, step]);

  const openFilePicker = (target: 'upload' | 'source') => { setFilePickerTarget(target); setShowFilePicker(true); };

  const handleFileSelect = async (path: string, name: string) => {
    setShowFilePicker(false);
    let content: string | undefined;
    try {
      const res = await fetch(`/api/filesystem/read-file?path=${encodeURIComponent(path)}`);
      if (res.ok) content = (await res.json()).content;
    } catch {}

    if (filePickerTarget === 'upload') {
      setAttachedFiles(p => [...p, { name, path, content }]);
    } else {
      setSources(p => [...p, { id: crypto.randomUUID(), type: 'file', name, value: path, content }]);
    }
  };

  const addSource = (type: Source['type']) => {
    setSources(p => [...p, { id: crypto.randomUUID(), type, name: '', value: '' }]);
  };

  const updateSource = (id: string, field: 'name' | 'value', val: string) => {
    setSources(p => p.map(s => s.id === id ? { ...s, [field]: val, name: field === 'value' && !s.name ? val.split('/').pop() || val : s.name } : s));
  };

  const removeSource = (id: string) => setSources(p => p.filter(s => s.id !== id));

  const buildFullTask = (): string => {
    let full = task;
    if (attachedFiles.length > 0) {
      full += '\n\n--- ATTACHED DOCUMENTS ---\n';
      for (const f of attachedFiles) full += `\n### ${f.name}\n${f.content || `(File: ${f.path})`}\n`;
    }
    if (mode === 'generate' && sources.length > 0) {
      full += '\n\n--- SOURCES FOR PRD GENERATION ---\n';
      full += `\nContext: ${prdContext}\n`;
      for (const s of sources) {
        full += `\n### [${s.type.toUpperCase()}] ${s.name || s.value}\n`;
        if (s.content) full += s.content + '\n';
        else if (s.value) full += `Source: ${s.value}\n`;
      }
      full += '\n\nGenerate a complete PRD (Product Requirements Document) from the sources above. Include: problem statement, target users, user stories, feature list with priorities, acceptance criteria, technical constraints, and success metrics.\n';
    }
    return full;
  };

  const canProceed = () => {
    if (mode === 'describe') return task.trim().length > 0;
    if (mode === 'upload') return attachedFiles.length > 0;
    if (mode === 'generate') return sources.length > 0 || prdContext.trim().length > 0;
    return false;
  };

  const handleStart = () => { ws.clearLogs(); pipeline.start(buildFullTask(), { provider }); setStep('executing'); };

  const complexity = getComplexity(buildFullTask().length, attachedFiles.length + sources.length);
  const phases = AGENTS.map(a => {
    const base = BASE_MIN[a.phase]?.[complexity] ?? 5;
    const tdd = a.phase === 'implement' ? Math.round(base * 0.5) : 0;
    return { ...a, base, tdd, total: base + tdd };
  });
  const totalMin = phases.reduce((s, p) => s + p.total, 0);
  const totalNoTdd = phases.reduce((s, p) => s + p.base, 0);
  const isFree = provider === 'claude' || provider === 'ollama';

  const sourceIcon = (type: Source['type']) => {
    switch (type) {
      case 'link': return <Link2 className="w-4 h-4 text-blue-400" />;
      case 'audio': return <Mic className="w-4 h-4 text-pink-400" />;
      case 'video': return <Video className="w-4 h-4 text-red-400" />;
      case 'image': return <Image className="w-4 h-4 text-yellow-400" />;
      case 'file': return <FileText className="w-4 h-4 text-cyan-400" />;
      default: return <Link2 className="w-4 h-4 text-gray-400" />;
    }
  };

  // ══════════════════════════════════════════
  // STEP 1: INPUT
  // ══════════════════════════════════════════
  if (step === 'input') {
    if (mode === 'choose') {
      return (
        <div className="space-y-8">
          <div className="text-center pt-6 pb-2">
            <h2 className="text-2xl font-bold text-white mb-2">Let's build something</h2>
            <p className="text-gray-400">How do you want to define your requirements?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <button onClick={() => setMode('upload')} className="p-6 rounded-2xl border border-gray-800 bg-gray-950 hover:border-blue-600/50 hover:bg-blue-950/10 transition-all text-left group">
              <Upload className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-1">I have a PRD or document</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Upload an existing requirements document, PRD, spec, or brief. Supports .md, .txt, .pdf, .docx, .feature</p>
            </button>
            <button onClick={() => setMode('describe')} className="p-6 rounded-2xl border border-gray-800 bg-gray-950 hover:border-purple-600/50 hover:bg-purple-950/10 transition-all text-left group">
              <PenLine className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold mb-1">Write my requirements</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Describe what you want to build in plain language. Be as detailed or as simple as you like.</p>
            </button>
            <button onClick={() => setMode('generate')} className="p-6 rounded-2xl border border-gray-800 bg-gray-950 hover:border-emerald-600/50 hover:bg-emerald-950/10 transition-all text-left group relative overflow-hidden">
              <Sparkles className="w-8 h-8 text-emerald-400 mb-4" />
              <h3 className="text-white font-semibold mb-1">Generate a PRD for me</h3>
              <p className="text-xs text-gray-500 leading-relaxed">Add documents, links (Figma, Stitch, websites), audio, video, or images. Don Cheli will generate a complete PRD.</p>
              <span className="absolute top-3 right-3 text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded-full">AI-powered</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {mode === 'upload' ? 'Upload your requirements' : mode === 'describe' ? 'Describe your project' : 'Generate PRD from sources'}
          </h2>
          <button onClick={() => setMode('choose')} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 border border-gray-800 rounded-lg">Back</button>
        </div>

        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-950">
          {/* ── Upload mode ── */}
          {mode === 'upload' && (<div className="space-y-3">
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 bg-gray-900 rounded-xl border border-gray-800">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-sm text-white font-medium truncate">{f.name}</p><p className="text-xs text-gray-500 font-mono truncate">{f.path}</p></div>
                {f.content && <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full">Loaded</span>}
                <button onClick={() => setAttachedFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={() => openFilePicker('upload')} className="w-full flex items-center justify-center gap-2 px-4 py-5 border-2 border-dashed border-gray-700 hover:border-blue-600/50 rounded-xl text-gray-400 hover:text-blue-400">
              <Upload className="w-5 h-5" /><span className="text-sm font-medium">{attachedFiles.length ? 'Add another document' : 'Browse and select a document'}</span>
            </button>
            <textarea value={task} onChange={e => setTask(e.target.value)} placeholder="Any additional context? (optional)" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600 resize-none" rows={2} />
          </div>)}

          {/* ── Describe mode ── */}
          {mode === 'describe' && (<div className="space-y-3">
            <textarea value={task} onChange={e => setTask(e.target.value)} placeholder={'Describe what you want to build...\n\nExample:\n"An e-commerce app where users can browse products, add to cart, checkout with Stripe, and track orders. Admin panel to manage products and see analytics."'} className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600 resize-none" rows={8} />
            <button onClick={() => openFilePicker('upload')} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-purple-400"><Upload className="w-3.5 h-3.5" /> Attach a reference document</button>
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-900 rounded-lg border border-gray-800">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" /><span className="text-xs text-gray-300 truncate flex-1">{f.name}</span>
                <button onClick={() => setAttachedFiles(p => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>)}

          {/* ── Generate PRD mode ── */}
          {mode === 'generate' && (<div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 font-medium mb-1">What's the product about?</label>
              <textarea value={prdContext} onChange={e => setPrdContext(e.target.value)} placeholder="Brief description: e.g. 'A mobile banking app for Venezuela that handles transfers via pago móvil'" className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600 resize-none" rows={2} />
            </div>

            {/* Sources list */}
            <div>
              <label className="block text-sm text-gray-300 font-medium mb-2">Sources — add everything you have</label>
              <div className="space-y-2">
                {sources.map(s => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-2.5 bg-gray-900 rounded-xl border border-gray-800">
                    {sourceIcon(s.type)}
                    <span className="text-xs text-gray-500 uppercase w-12 shrink-0">{s.type}</span>
                    <input type="text" value={s.value} onChange={e => updateSource(s.id, 'value', e.target.value)}
                      placeholder={s.type === 'link' ? 'https://figma.com/file/...' : s.type === 'audio' ? '/path/to/recording.mp3' : s.type === 'video' ? 'https://youtube.com/...' : s.type === 'image' ? '/path/to/screenshot.png' : 'URL or path'}
                      className="flex-1 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-600" />
                    {s.content && <span className="text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full shrink-0">Loaded</span>}
                    <button onClick={() => removeSource(s.id)} className="text-gray-600 hover:text-red-400 shrink-0"><X className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add source buttons */}
            <div className="flex flex-wrap gap-2">
              <button onClick={() => openFilePicker('source')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-cyan-400 hover:border-cyan-800/50">
                <FileText className="w-3.5 h-3.5" /> Document
              </button>
              <button onClick={() => addSource('link')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-800/50">
                <Link2 className="w-3.5 h-3.5" /> Link (Figma, Stitch, Web)
              </button>
              <button onClick={() => addSource('image')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-yellow-400 hover:border-yellow-800/50">
                <Image className="w-3.5 h-3.5" /> Image / Screenshot
              </button>
              <button onClick={() => addSource('audio')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-pink-400 hover:border-pink-800/50">
                <Mic className="w-3.5 h-3.5" /> Audio / Recording
              </button>
              <button onClick={() => addSource('video')} className="flex items-center gap-1.5 text-xs px-3 py-2 border border-gray-800 rounded-lg text-gray-400 hover:text-red-400 hover:border-red-800/50">
                <Video className="w-3.5 h-3.5" /> Video / Loom
              </button>
            </div>

            {/* Examples */}
            <div className="pt-3 border-t border-gray-800/50">
              <p className="text-xs text-gray-600 mb-2">Examples of sources you can add:</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div className="flex items-center gap-1.5"><Link2 className="w-3 h-3 text-blue-400" /> Figma design file</div>
                <div className="flex items-center gap-1.5"><Link2 className="w-3 h-3 text-blue-400" /> Google Stitch prototype</div>
                <div className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-cyan-400" /> Existing PRD or brief</div>
                <div className="flex items-center gap-1.5"><Image className="w-3 h-3 text-yellow-400" /> UI wireframe or sketch</div>
                <div className="flex items-center gap-1.5"><Mic className="w-3 h-3 text-pink-400" /> Voice memo with ideas</div>
                <div className="flex items-center gap-1.5"><Video className="w-3 h-3 text-red-400" /> Competitor demo video</div>
                <div className="flex items-center gap-1.5"><Link2 className="w-3 h-3 text-blue-400" /> API documentation</div>
                <div className="flex items-center gap-1.5"><FileText className="w-3 h-3 text-cyan-400" /> Meeting notes</div>
              </div>
            </div>
          </div>)}
        </div>

        {canProceed() && (
          <div className="flex justify-end">
            <button onClick={() => setStep('plan')} className="flex items-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium">
              Review Plan <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {showFilePicker && <FilePicker title="Select a file" extensions="md,txt,pdf,docx,doc,feature,json,yaml,yml,png,jpg,mp3,wav,mp4" onSelect={handleFileSelect} onClose={() => setShowFilePicker(false)} />}
      </div>
    );
  }

  // ══════════════════════════════════════════
  // STEP 2: PLAN + SIGNATURE
  // ══════════════════════════════════════════
  if (step === 'plan') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Review your development plan</h2>
          <button onClick={() => setStep('input')} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 border border-gray-800 rounded-lg">Edit requirements</button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-gray-800 bg-gray-950 text-center">
            <Clock className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{fmt(totalMin)}</div>
            <div className="text-xs text-gray-500 mt-1">Estimated time</div>
          </div>
          <div className="p-5 rounded-2xl border border-gray-800 bg-gray-950 text-center">
            <DollarSign className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">{isFree ? <span className="text-emerald-400">Free</span> : '$0.74'}</div>
            <div className="text-xs text-gray-500 mt-1">{isFree ? provider === 'claude' ? 'Claude subscription' : 'Ollama local' : 'Estimated cost'}</div>
          </div>
          <div className="p-5 rounded-2xl border border-gray-800 bg-gray-950 text-center">
            <AlertTriangle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <div className={`inline-flex text-sm font-bold px-3 py-1 rounded-full ${complexity === 'simple' ? 'text-emerald-400 bg-emerald-900/20' : complexity === 'medium' ? 'text-blue-400 bg-blue-900/20' : complexity === 'complex' ? 'text-orange-400 bg-orange-900/20' : 'text-red-400 bg-red-900/20'}`}>
              {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Complexity</div>
          </div>
        </div>

        {/* TDD notice */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
          <TestTube className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-emerald-300 font-medium">TDD adds ~{totalMin - totalNoTdd} minutes</p>
            <p className="text-xs text-emerald-400/60 mt-1">Writing tests FIRST takes {fmt(totalMin)} vs {fmt(totalNoTdd)} without TDD. This catches bugs before production — saving hours of debugging later.</p>
          </div>
        </div>

        {/* Provider */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-800 bg-gray-950">
          <span className="text-sm text-gray-400">AI Provider:</span>
          <select value={provider} onChange={e => setProvider(e.target.value)} className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-sm focus:outline-none">
            <option value="claude">Claude Code (free with subscription)</option>
            <option value="ollama">Ollama (free, local)</option>
            <option value="codex">OpenAI Codex</option>
          </select>
        </div>

        {/* Agent team */}
        <div className="rounded-2xl border border-gray-800 bg-gray-950 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /><h3 className="text-white font-semibold">Your AI Team — {AGENTS.length} specialists</h3></div>
            <p className="text-xs text-gray-500 mt-1">Each agent handles one phase, in order</p>
          </div>
          <div className="divide-y divide-gray-800/50">
            {phases.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-900/30">
                <span className="text-xs text-gray-600 w-4 font-mono">{i + 1}</span>
                <span className="text-2xl">{p.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-sm font-semibold text-white">{p.name}</span><span className="text-xs text-gray-500">— {p.role}</span></div>
                  <p className="text-xs text-gray-600">{p.description}</p>
                </div>
                <div className="text-right shrink-0 w-16">
                  <div className="text-sm font-semibold text-white">{p.total}m</div>
                  {p.tdd > 0 && <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 justify-end"><Shield className="w-2.5 h-2.5" />+{p.tdd}m</div>}
                </div>
                <div className="w-16 shrink-0"><div className="w-full bg-gray-800 rounded-full h-1.5"><div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${(p.total / totalMin) * 100}%` }} /></div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ AGREEMENT + SIGNATURE ═══ */}
        <div className={`rounded-2xl border-2 overflow-hidden transition-colors ${signed ? 'border-emerald-600/50 bg-emerald-950/10' : 'border-gray-700 bg-gray-950'}`}>
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Agreement</h3>
            <p className="text-xs text-gray-500 mt-1">Review and approve the plan to start development</p>
          </div>
          <div className="px-6 py-5 space-y-5">
            {/* Single checkbox like terms of service */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); if (!e.target.checked) setSigned(false); }}
                className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-900 text-purple-600 focus:ring-purple-500 cursor-pointer" />
              <span className="text-sm text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                I have reviewed the development plan, the estimated time of <strong className="text-white">{fmt(totalMin)}</strong>, the team of <strong className="text-white">{AGENTS.length} AI agents</strong>, and I understand that TDD (Test-Driven Development) will be enforced. I agree that my project will remain untouched until all phases pass successfully. <strong className="text-purple-400">I approve this plan for execution.</strong>
              </span>
            </label>

            {/* Signature */}
            {agreed && (
              <div className="pt-4 border-t border-gray-800">
                <label className="block text-xs text-gray-500 mb-2">Sign with your name to confirm:</label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input type="text" placeholder="Your full name" value={signerName} onChange={e => setSignerName(e.target.value)}
                      className="w-full px-4 py-3.5 bg-gray-900 border-b-2 border-gray-600 rounded-t-xl text-white text-lg focus:outline-none focus:border-purple-500 placeholder:text-gray-600 font-serif italic" />
                    <div className="absolute bottom-0 left-4 right-4 border-b border-gray-700" />
                  </div>
                  <button onClick={() => { if (signerName.trim()) setSigned(true); }} disabled={!signerName.trim()}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium shrink-0 ${signed ? 'bg-emerald-600 text-white' : signerName.trim() ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                    {signed ? <><CheckCircle className="w-4 h-4" /> Signed</> : <><Pen className="w-4 h-4" /> Sign</>}
                  </button>
                </div>
                {signed && <p className="text-xs text-emerald-400 mt-2">Approved by <strong>{signerName}</strong> — {new Date().toLocaleString()}</p>}
              </div>
            )}
          </div>

          {/* Start */}
          {signed && (
            <div className="px-6 py-4 border-t border-emerald-800/30 bg-emerald-900/10 flex justify-end">
              <button onClick={handleStart} className="flex items-center gap-2 px-10 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-base">
                <Play className="w-5 h-5" /> Start Development
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════
  // STEP 3: PALANTIR DASHBOARD
  // ══════════════════════════════════════════
  const currentPhase = pipeline.phases.find(p => p.status === 'running');
  const passedCount = pipeline.phases.filter(p => p.status === 'passed').length;
  const failedCount = pipeline.phases.filter(p => p.status === 'failed').length;
  const progress = pipeline.phases.length > 0 ? Math.round((passedCount / pipeline.phases.length) * 100) : 0;
  const currentAgent = currentPhase ? AGENTS.find(a => a.phase === currentPhase.name) : null;
  const needsAttention = failedCount > 0 || ws.events.some(e => e.type === 'error');
  const totalCost = pipeline.phases.reduce((s, p) => s + (p.cost_usd || 0), 0);

  return (
    <div className="space-y-4">
      {/* Status hero */}
      <div className={`rounded-2xl border overflow-hidden ${needsAttention ? 'border-red-800/50 bg-red-950/10' : isRunning ? 'border-purple-800/50 bg-purple-950/10' : passedCount === pipeline.phases.length ? 'border-emerald-800/50 bg-emerald-950/10' : 'border-gray-800 bg-gray-950'}`}>
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {isRunning ? <div className="relative"><div className="w-4 h-4 bg-purple-500 rounded-full animate-ping absolute" /><div className="w-4 h-4 bg-purple-500 rounded-full relative" /></div>
              : needsAttention ? <AlertTriangle className="w-6 h-6 text-red-400" />
              : passedCount === pipeline.phases.length ? <CheckCircle className="w-6 h-6 text-emerald-400" />
              : <Clock className="w-6 h-6 text-gray-500" />}
              <div>
                <h2 className="text-white font-bold text-lg">{isRunning ? (currentAgent ? `${currentAgent.avatar} ${currentAgent.name} is working...` : 'Building...') : needsAttention ? 'Attention Required' : passedCount === pipeline.phases.length ? 'Build Complete!' : 'Idle'}</h2>
                {currentPhase && <p className="text-sm text-gray-400">{currentPhase.command} — {currentAgent?.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center"><div className="text-2xl font-bold text-white">{passedCount}</div><div className="text-[10px] text-gray-500">Passed</div></div>
              {failedCount > 0 && <div className="text-center"><div className="text-2xl font-bold text-red-400">{failedCount}</div><div className="text-[10px] text-gray-500">Failed</div></div>}
              <div className="text-center"><div className="text-2xl font-bold text-gray-400">{pipeline.phases.length - passedCount - failedCount}</div><div className="text-[10px] text-gray-500">Left</div></div>
              {isRunning && <button onClick={pipeline.stop} className="flex items-center gap-1.5 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800/50 rounded-xl text-xs font-medium"><Square className="w-3 h-3" /> Stop</button>}
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5"><div className={`h-2.5 rounded-full transition-all duration-1000 ${failedCount > 0 ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${progress}%` }} /></div>
          <div className="flex justify-between mt-1"><span className="text-[10px] text-gray-600">{progress}%</span><span className="text-[10px] text-gray-600">{passedCount}/{pipeline.phases.length}</span></div>
        </div>
      </div>

      {/* Phase grid */}
      <div className="grid grid-cols-7 gap-2">
        {pipeline.phases.map(phase => {
          const agent = AGENTS.find(a => a.phase === phase.name);
          const cur = phase.status === 'running', pass = phase.status === 'passed', fail = phase.status === 'failed';
          return (
            <div key={phase.name} className={`rounded-xl border p-3 transition-all ${cur ? 'border-purple-500 bg-purple-950/30 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/30' : pass ? 'border-emerald-800/50 bg-emerald-950/10' : fail ? 'border-red-800/50 bg-red-950/10' : 'border-gray-800/50 bg-gray-950/30'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{agent?.avatar}</span>
                {cur && <Loader className="w-3.5 h-3.5 text-purple-400 animate-spin" />}
                {pass && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                {fail && <XCircle className="w-3.5 h-3.5 text-red-400" />}
                {!cur && !pass && !fail && <Clock className="w-3.5 h-3.5 text-gray-700" />}
              </div>
              <p className={`text-xs font-semibold truncate ${cur ? 'text-white' : pass ? 'text-emerald-300' : fail ? 'text-red-300' : 'text-gray-500'}`}>{agent?.name}</p>
              <p className="text-[10px] text-gray-600 truncate">{agent?.role}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {needsAttention && (
        <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-red-950/20 border border-red-800/30 animate-pulse">
          <Bell className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
          <div><p className="text-sm text-red-300 font-medium">Attention needed</p><p className="text-xs text-red-400/60 mt-1">A phase failed. Your project was NOT modified. Check the log for details.</p></div>
        </div>
      )}

      {/* Log + metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2"><LiveLog logs={ws.logs} onClear={ws.clearLogs} /></div>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-800 bg-gray-950 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-300 font-medium"><Activity className="w-4 h-4 text-purple-400" /> Metrics</div>
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-xs text-gray-500">Cost</div><div className="text-lg font-bold text-emerald-400">{isFree ? '$0.00' : `$${totalCost.toFixed(2)}`}</div></div>
              <div><div className="text-xs text-gray-500">Provider</div><div className="text-sm font-medium text-white capitalize">{provider}</div></div>
              <div><div className="text-xs text-gray-500">Phase</div><div className="text-sm font-medium text-white">{currentPhase?.name || (passedCount === pipeline.phases.length ? 'Done' : '—')}</div></div>
              <div><div className="text-xs text-gray-500">Log</div><div className="text-sm font-medium text-white">{ws.logs.length} lines</div></div>
            </div>
          </div>
          {signerName && <div className="rounded-xl border border-gray-800 bg-gray-950 p-4"><div className="flex items-center gap-2 text-xs text-gray-500"><Pen className="w-3 h-3" /> Approved by</div><p className="text-sm text-white font-serif italic mt-1">{signerName}</p></div>}
          <div className="rounded-xl border border-emerald-900/30 bg-emerald-950/10 p-4"><div className="flex items-center gap-2 text-xs text-emerald-400"><Shield className="w-3.5 h-3.5" /> Project Safe</div><p className="text-xs text-emerald-400/60 mt-1">Working on isolated copy. Original untouched.</p></div>
        </div>
      </div>

      {pipeline.error && <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-red-400 text-sm">{pipeline.error}</div>}
    </div>
  );
}

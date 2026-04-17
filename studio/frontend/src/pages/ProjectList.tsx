import { useEffect, useState } from 'react';
import { FolderOpen, Plus, Trash2, ArrowRight, FolderSearch } from 'lucide-react';
import { api, type Project } from '../lib/api';
import { FolderPicker } from '../components/FolderPicker';

interface Props {
  onSelectProject: (project: Project) => void;
}

export function ProjectList({ onSelectProject }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try { setProjects(await api.projects.list()); } catch { setError('Error loading projects'); }
  };
  useEffect(() => { loadProjects(); }, []);

  const handleAdd = async () => {
    if (!name || !path) return;
    try {
      await api.projects.create(name, path);
      setName(''); setPath(''); setShowAdd(false);
      await loadProjects();
    } catch { setError('Could not create project. Check the path.'); }
  };

  const handleFolderSelect = (p: string) => {
    setPath(p);
    if (!name) setName(p.split('/').filter(Boolean).pop() || '');
    setShowPicker(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-gray-800 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold">DC</div>
            <div>
              <h1 className="text-lg font-bold text-white">Don Cheli Studio</h1>
              <p className="text-xs text-gray-500">Your AI development assistant</p>
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-xl text-red-400 text-sm">
            {error} <button onClick={() => setError('')} className="ml-2 underline">dismiss</button>
          </div>
        )}

        {showAdd && (
          <div className="mb-8 p-6 border border-purple-800/30 rounded-2xl bg-purple-950/20">
            <h2 className="text-white font-semibold mb-1">Add a project</h2>
            <p className="text-sm text-gray-400 mb-4">Point to a folder on your computer. Don Cheli will build software inside it.</p>
            <div className="space-y-3">
              <input type="text" placeholder="Project name (e.g. my-app)" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500" />
              <div className="flex gap-2">
                <input type="text" placeholder="/path/to/your/project" value={path} onChange={(e) => setPath(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-purple-500" />
                <button onClick={() => setShowPicker(true)} className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm border border-gray-700">
                  <FolderSearch className="w-4 h-4" /> Browse
                </button>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handleAdd} disabled={!name || !path} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white rounded-xl text-sm font-medium">Add Project</button>
                <button onClick={() => { setShowAdd(false); setName(''); setPath(''); }} className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {projects.length === 0 && !showAdd ? (
          <div className="text-center py-24">
            <FolderOpen className="w-20 h-20 text-gray-800 mx-auto mb-6" />
            <h2 className="text-2xl text-gray-300 font-semibold mb-2">Welcome to Don Cheli Studio</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Describe what you want to build in plain language. Don Cheli will write the specs, design the UI, code it with tests, and review it — all automatically.</p>
            <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-medium transition-colors">
              <Plus className="w-5 h-5" /> Add Your First Project
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} onClick={() => onSelectProject(project)}
                className="flex items-center gap-4 p-5 border border-gray-800 rounded-2xl bg-gray-950 hover:border-purple-600/50 hover:bg-gray-900/50 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center text-purple-400 font-bold text-lg shrink-0">
                  {project.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{project.name}</h3>
                  <p className="text-xs text-gray-500 font-mono truncate">{project.path}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); api.projects.delete(project.id).then(loadProjects); }}
                  className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors" />
              </div>
            ))}
          </div>
        )}
      </main>

      {showPicker && <FolderPicker onSelect={handleFolderSelect} onClose={() => setShowPicker(false)} />}
    </div>
  );
}

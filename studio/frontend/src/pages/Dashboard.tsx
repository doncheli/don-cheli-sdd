import { useEffect, useState } from 'react';
import { FolderOpen, Plus, Trash2, Play, FolderSearch } from 'lucide-react';
import { api, type Project } from '../lib/api';
import { FolderPicker } from '../components/FolderPicker';

interface Props {
  onSelectProject: (project: Project) => void;
}

export function Dashboard({ onSelectProject }: Props) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [error, setError] = useState('');

  const loadProjects = async () => {
    try {
      const list = await api.projects.list();
      setProjects(list);
    } catch {
      setError('Failed to load projects');
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleAdd = async () => {
    if (!name || !path) return;
    try {
      await api.projects.create(name, path);
      setName('');
      setPath('');
      setShowAdd(false);
      await loadProjects();
    } catch {
      setError('Failed to create project. Check path exists.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.projects.delete(id);
      await loadProjects();
    } catch {
      setError('Failed to delete project');
    }
  };

  const handleFolderSelect = (selectedPath: string) => {
    setPath(selectedPath);
    // Auto-detect name from folder name
    if (!name) {
      const folderName = selectedPath.split('/').filter(Boolean).pop() || '';
      setName(folderName);
    }
    setShowPicker(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-sm">
              DC
            </div>
            <h1 className="text-xl font-bold text-white">Don Cheli Studio</h1>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">v0.1.0</span>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
            <button onClick={() => setError('')} className="ml-2 underline">dismiss</button>
          </div>
        )}

        {/* Add Project Panel */}
        {showAdd && (
          <div className="mb-6 p-5 border border-gray-800 rounded-xl bg-gray-950">
            <h2 className="text-white font-semibold mb-4">New Project</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="my-awesome-project"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Project Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/absolute/path/to/project"
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    className="flex-1 px-3 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    onClick={() => setShowPicker(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors border border-gray-700"
                    title="Browse folders"
                  >
                    <FolderSearch className="w-4 h-4" /> Browse
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAdd}
                  disabled={!name || !path}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Create Project
                </button>
                <button
                  onClick={() => { setShowAdd(false); setName(''); setPath(''); }}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length === 0 && !showAdd ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl text-gray-400 mb-2">No projects yet</h2>
            <p className="text-gray-600 text-sm mb-6">Add a project to start using Don Cheli Studio</p>
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="border border-gray-800 rounded-xl p-4 bg-gray-950 hover:border-purple-600/50 transition-colors group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1 truncate max-w-[250px]">
                      {project.path}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                    className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/20 group-hover:bg-purple-600/40 text-purple-400 rounded-lg text-xs transition-colors">
                    <Play className="w-3 h-3" /> Open
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Folder Picker Modal */}
      {showPicker && (
        <FolderPicker
          onSelect={handleFolderSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

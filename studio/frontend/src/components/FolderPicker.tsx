import { useEffect, useState, useCallback } from 'react';
import {
  Folder, FolderGit2, ChevronRight, ArrowUp, Home, FolderPlus, Check, X, Package,
} from 'lucide-react';
import { api, type BrowseResult } from '../lib/api';

interface Props {
  onSelect: (path: string) => void;
  onClose: () => void;
}

export function FolderPicker({ onSelect, onClose }: Props) {
  const [result, setResult] = useState<BrowseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolder, setShowNewFolder] = useState(false);

  const browse = useCallback(async (path?: string) => {
    setLoading(true);
    setError('');
    try {
      setResult(await api.filesystem.browse(path));
    } catch {
      setError('Error reading directory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { browse(); }, [browse]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !result) return;
    try {
      await api.filesystem.mkdir(`${result.current}/${newFolderName.trim()}`);
      setNewFolderName(''); setShowNewFolder(false);
      await browse(result.current);
    } catch { setError('Failed to create folder'); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141420] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">Select Project Folder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 bg-gray-950 border-b border-gray-800">
          <button onClick={() => browse()} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white" title="Home"><Home className="w-4 h-4" /></button>
          {result?.parent && <button onClick={() => browse(result.parent!)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white" title="Up"><ArrowUp className="w-4 h-4" /></button>}
          <div className="flex-1 px-3 py-1.5 bg-gray-900 rounded-lg text-sm text-gray-300 font-mono truncate">{result?.current || '...'}</div>
          <button onClick={() => result && onSelect(result.current)} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium">Select This</button>
        </div>

        {error && <div className="px-5 py-2 bg-red-900/20 text-red-400 text-sm">{error}</div>}

        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-0.5">
              {result?.entries.map((entry) => (
                <button key={entry.path}
                  onClick={() => entry.name === '. (current directory)' ? onSelect(entry.path) : browse(entry.path)}
                  onDoubleClick={() => onSelect(entry.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors group ${entry.is_git ? 'hover:bg-purple-900/20 border border-transparent hover:border-purple-800/50' : 'hover:bg-gray-800/50'}`}>
                  {entry.is_git ? <FolderGit2 className="w-5 h-5 text-purple-400 shrink-0" /> : <Folder className="w-5 h-5 text-gray-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm truncate block ${entry.is_git ? 'text-white font-medium' : 'text-gray-300'}`}>{entry.name}</span>
                    {entry.is_git && <span className="text-xs text-gray-500 font-mono truncate block">{entry.path}</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {entry.has_package_json && <span className="flex items-center gap-1 text-xs text-orange-400 bg-orange-900/20 px-2 py-0.5 rounded-full"><Package className="w-3 h-3" /> npm</span>}
                    {entry.is_git && <span className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">git</span>}
                    {entry.name === '. (current directory)' ? <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full"><Check className="w-3 h-3" /> select</span> : <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />}
                  </div>
                </button>
              ))}
              {result?.entries.length === 0 && <div className="text-center py-8 text-gray-600 text-sm">No subdirectories found</div>}
            </div>
          )}
        </div>

        <div className="border-t border-gray-800 px-5 py-3">
          {showNewFolder ? (
            <div className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-emerald-400 shrink-0" />
              <input type="text" placeholder="New folder name..." value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()} className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500" autoFocus />
              <button onClick={handleCreateFolder} disabled={!newFolderName.trim()} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm">Create</button>
              <button onClick={() => { setShowNewFolder(false); setNewFolderName(''); }} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowNewFolder(true)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400"><FolderPlus className="w-4 h-4" /> Create new folder here</button>
          )}
        </div>
      </div>
    </div>
  );
}

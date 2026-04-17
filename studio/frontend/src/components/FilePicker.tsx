import { useEffect, useState, useCallback } from 'react';
import {
  Folder, File, ChevronRight, ArrowUp, Home, X, FileText, FileCode, FileType,
} from 'lucide-react';

interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
  extension: string;
  size_bytes: number;
}

interface BrowseFilesResult {
  current: string;
  parent: string | null;
  entries: FileEntry[];
}

const EXT_ICONS: Record<string, React.ReactNode> = {
  md: <FileText className="w-4 h-4 text-blue-400" />,
  txt: <FileText className="w-4 h-4 text-gray-400" />,
  pdf: <FileType className="w-4 h-4 text-red-400" />,
  feature: <FileCode className="w-4 h-4 text-emerald-400" />,
  json: <FileCode className="w-4 h-4 text-yellow-400" />,
  yaml: <FileCode className="w-4 h-4 text-orange-400" />,
  yml: <FileCode className="w-4 h-4 text-orange-400" />,
  html: <FileCode className="w-4 h-4 text-purple-400" />,
};

interface Props {
  title: string;
  extensions?: string;
  onSelect: (path: string, name: string) => void;
  onClose: () => void;
}

export function FilePicker({ title, extensions, onSelect, onClose }: Props) {
  const [result, setResult] = useState<BrowseFilesResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const browse = useCallback(async (path?: string) => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (path) params.set('path', path);
      if (extensions) params.set('extensions', extensions);
      const res = await fetch(`/api/filesystem/browse-files?${params}`);
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch { setError('Error reading directory'); }
    finally { setLoading(false); }
  }, [extensions]);

  useEffect(() => { browse(); }, [browse]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141420] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Path bar */}
        <div className="flex items-center gap-2 px-5 py-3 bg-gray-950 border-b border-gray-800">
          <button onClick={() => browse()} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"><Home className="w-4 h-4" /></button>
          {result?.parent && <button onClick={() => browse(result.parent!)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"><ArrowUp className="w-4 h-4" /></button>}
          <div className="flex-1 px-3 py-1.5 bg-gray-900 rounded-lg text-sm text-gray-300 font-mono truncate">{result?.current || '...'}</div>
        </div>

        {error && <div className="px-5 py-2 bg-red-900/20 text-red-400 text-sm">{error}</div>}

        {/* File list */}
        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">Loading...</div>
          ) : (
            <div className="space-y-0.5">
              {result?.entries.map((entry) => (
                <button key={entry.path}
                  onClick={() => entry.is_dir ? browse(entry.path) : onSelect(entry.path, entry.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    entry.is_dir ? 'hover:bg-gray-800/50' : 'hover:bg-purple-900/20 hover:border-purple-800/30 border border-transparent'
                  }`}>
                  {entry.is_dir
                    ? <Folder className="w-5 h-5 text-gray-500 shrink-0" />
                    : (EXT_ICONS[entry.extension] || <File className="w-4 h-4 text-gray-500 shrink-0" />)
                  }
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm truncate block ${entry.is_dir ? 'text-gray-300' : 'text-white font-medium'}`}>
                      {entry.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!entry.is_dir && (
                      <span className="text-[10px] text-gray-600">{(entry.size_bytes / 1024).toFixed(1)}KB</span>
                    )}
                    {entry.is_dir
                      ? <ChevronRight className="w-4 h-4 text-gray-600" />
                      : <span className="text-xs text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded-full">Select</span>
                    }
                  </div>
                </button>
              ))}
              {result?.entries.length === 0 && (
                <div className="text-center py-8 text-gray-600 text-sm">No matching files found in this directory</div>
              )}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">
          Showing: {extensions?.split(',').map(e => `.${e}`).join(', ') || 'all document files'}
        </div>
      </div>
    </div>
  );
}

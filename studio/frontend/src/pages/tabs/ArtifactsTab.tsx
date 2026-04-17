import { useState } from 'react';
import { FileText, TestTube, Shield, Paintbrush, ListChecks, RefreshCw, ChevronRight, Copy, Check, BookOpen } from 'lucide-react';
import { api, type Project, type ArtifactInfo } from '../../lib/api';

const TYPE_META: Record<string, { icon: React.ReactNode; label: string; color: string; explanation: string }> = {
  spec:      { icon: <FileText className="w-4 h-4" />, label: 'Specifications', color: 'text-blue-400', explanation: 'These are the requirements written in Gherkin format (Given/When/Then). Each scenario describes one behavior the software must have.' },
  blueprint: { icon: <ListChecks className="w-4 h-4" />, label: 'Technical Plans', color: 'text-cyan-400', explanation: 'The technical architecture — what technologies to use, how data flows, what the API looks like.' },
  task:      { icon: <BookOpen className="w-4 h-4" />, label: 'Tasks', color: 'text-orange-400', explanation: 'Individual coding tasks broken down from the plan. Each has specific acceptance criteria and tests.' },
  test:      { icon: <TestTube className="w-4 h-4" />, label: 'Tests', color: 'text-emerald-400', explanation: 'Automated test files that verify the code works correctly. If these pass, the feature works.' },
  review:    { icon: <Shield className="w-4 h-4" />, label: 'Reviews', color: 'text-purple-400', explanation: 'Quality review reports scoring the code across security, performance, maintainability, and more.' },
  coverage:  { icon: <Paintbrush className="w-4 h-4" />, label: 'Coverage', color: 'text-yellow-400', explanation: 'Shows what percentage of the code is covered by tests. Higher is better (goal: 85%+).' },
};

interface Props {
  project: Project;
  artifacts: ArtifactInfo[];
  onRefresh: () => void;
}

export function ArtifactsTab({ project, artifacts, onRefresh }: Props) {
  const [selectedArtifact, setSelectedArtifact] = useState<{ type: string; name: string } | null>(null);
  const [content, setContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [copied, setCopied] = useState(false);

  // Group artifacts by type
  const grouped: Record<string, ArtifactInfo[]> = {};
  for (const a of artifacts) {
    if (!grouped[a.type]) grouped[a.type] = [];
    grouped[a.type].push(a);
  }

  const loadContent = async (type: string, name: string) => {
    setLoadingContent(true);
    setSelectedArtifact({ type, name });
    try {
      const result = await api.pipeline.artifactContent(project.id, type, name);
      setContent(result.content);
    } catch {
      setContent('Error loading file content.');
    } finally {
      setLoadingContent(false);
    }
  };

  const copyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Gherkin scenarios in a friendly way
  function renderGherkin(text: string) {
    const lines = text.split('\n');
    return (
      <div className="space-y-1">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('Feature:')) return <div key={i} className="text-purple-400 font-bold text-base mt-2">{trimmed}</div>;
          if (trimmed.startsWith('Scenario:') || trimmed.startsWith('Scenario Outline:')) return <div key={i} className="text-cyan-400 font-semibold mt-4 border-t border-gray-800 pt-3">{trimmed}</div>;
          if (trimmed.startsWith('@')) return <div key={i} className="text-yellow-500 text-xs mt-3">{trimmed}</div>;
          if (trimmed.startsWith('Given')) return <div key={i} className="text-emerald-400 ml-4">{trimmed}</div>;
          if (trimmed.startsWith('When')) return <div key={i} className="text-blue-400 ml-4">{trimmed}</div>;
          if (trimmed.startsWith('Then')) return <div key={i} className="text-orange-400 ml-4">{trimmed}</div>;
          if (trimmed.startsWith('And')) return <div key={i} className="text-gray-400 ml-8">{trimmed}</div>;
          if (trimmed.startsWith('But')) return <div key={i} className="text-red-400 ml-8">{trimmed}</div>;
          if (trimmed.startsWith('#')) return <div key={i} className="text-gray-600 italic">{trimmed}</div>;
          if (trimmed === '') return <div key={i} className="h-1" />;
          return <div key={i} className="text-gray-300 ml-4">{trimmed}</div>;
        })}
      </div>
    );
  }

  function isGherkin(name: string, content: string) {
    return name.endsWith('.feature') || content.includes('Feature:') || content.includes('Scenario:');
  }

  return (
    <div className="space-y-6">
      {artifacts.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-800 mx-auto mb-4" />
          <h3 className="text-xl text-gray-400 mb-2">No files yet</h3>
          <p className="text-gray-600 text-sm mb-6">Run the build pipeline to generate specifications, code, tests, and reviews.</p>
          <button onClick={onRefresh} className="flex items-center gap-2 mx-auto px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-800 rounded-xl">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File browser */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Generated Files</h3>
              <button onClick={onRefresh} className="text-gray-500 hover:text-white p-1"><RefreshCw className="w-4 h-4" /></button>
            </div>

            {Object.entries(grouped).map(([type, files]) => {
              const meta = TYPE_META[type] || { icon: <FileText className="w-4 h-4" />, label: type, color: 'text-gray-400', explanation: '' };
              return (
                <div key={type} className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
                  {/* Category header */}
                  <div className="px-4 py-3 border-b border-gray-800/50">
                    <div className={`flex items-center gap-2 ${meta.color} font-medium text-sm`}>
                      {meta.icon} {meta.label} ({files.length})
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{meta.explanation}</p>
                  </div>

                  {/* File list */}
                  <div className="divide-y divide-gray-800/30">
                    {files.map((file) => {
                      const isSelected = selectedArtifact?.type === type && selectedArtifact?.name === file.name;
                      return (
                        <button key={file.name} onClick={() => loadContent(type, file.name)}
                          className={`w-full text-left px-4 py-2.5 flex items-center gap-2 text-sm transition-colors ${
                            isSelected ? 'bg-purple-900/20 text-white' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
                          }`}>
                          <span className="flex-1 font-mono text-xs truncate">{file.name}</span>
                          <span className="text-[10px] text-gray-600">{(file.size_bytes / 1024).toFixed(1)}KB</span>
                          <ChevronRight className="w-3 h-3 text-gray-600" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* File content viewer */}
          <div className="lg:col-span-2">
            {selectedArtifact ? (
              <div className="rounded-xl border border-gray-800 bg-gray-950 overflow-hidden h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
                  <div>
                    <span className="text-white font-medium text-sm">{selectedArtifact.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{selectedArtifact.type}</span>
                  </div>
                  <button onClick={copyContent} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-700">
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="p-4 overflow-auto max-h-[600px]">
                  {loadingContent ? (
                    <p className="text-gray-500 text-sm">Loading...</p>
                  ) : isGherkin(selectedArtifact.name, content) ? (
                    <div>
                      <div className="mb-3 px-3 py-2 bg-blue-900/10 border border-blue-800/20 rounded-lg">
                        <p className="text-blue-300 text-xs">
                          <strong>Reading guide:</strong>{' '}
                          <span className="text-emerald-400">Given</span> = starting condition,{' '}
                          <span className="text-blue-400">When</span> = action taken,{' '}
                          <span className="text-orange-400">Then</span> = expected result
                        </p>
                      </div>
                      {renderGherkin(content)}
                    </div>
                  ) : (
                    <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap leading-relaxed">{content}</pre>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] rounded-xl border border-gray-800 bg-gray-950">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-800 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">Select a file to view its contents</p>
                  <p className="text-gray-600 text-xs mt-1">Click any file on the left to see what Don Cheli generated</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { ReactFlow, type Node, type Edge, Position, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { PhaseInfo } from '../lib/api';

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  pending: { bg: '#1a1a2e', border: '#374151', text: '#6b7280' },
  running: { bg: '#1e1040', border: '#8b5cf6', text: '#c084fc' },
  passed: { bg: '#052e16', border: '#10b981', text: '#34d399' },
  failed: { bg: '#2d0a0a', border: '#ef4444', text: '#f87171' },
  skipped: { bg: '#111827', border: '#4b5563', text: '#6b7280' },
};

const PHASE_ICONS: Record<string, string> = {
  specify: '📋',
  clarify: '🔍',
  plan: '🏗️',
  design: '🎨',
  breakdown: '📦',
  implement: '⚡',
  review: '✅',
};

function buildNodes(phases: PhaseInfo[]): Node[] {
  return phases.map((phase, i) => {
    const style = STATUS_STYLES[phase.status] || STATUS_STYLES.pending;
    const icon = PHASE_ICONS[phase.name] || '📋';
    return {
      id: phase.name,
      position: { x: i * 200, y: 60 },
      data: {
        label: (
          <div className="text-center px-2 py-1">
            <div className="text-xl mb-1">{icon}</div>
            <div className="font-semibold text-xs capitalize" style={{ color: style.text }}>
              {phase.name}
            </div>
            <div className="text-[10px] opacity-60 mt-0.5" style={{ color: style.text }}>
              {phase.status}
            </div>
          </div>
        ),
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: {
        background: style.bg,
        border: `2px solid ${style.border}`,
        borderRadius: '12px',
        padding: '4px',
        width: 120,
      },
    };
  });
}

function buildEdges(phases: PhaseInfo[]): Edge[] {
  return phases.slice(0, -1).map((phase, i) => {
    const nextPhase = phases[i + 1];
    const isActive = phase.status === 'passed' && nextPhase.status !== 'pending';
    return {
      id: `${phase.name}-${nextPhase.name}`,
      source: phase.name,
      target: nextPhase.name,
      animated: phase.status === 'passed' && nextPhase.status === 'running',
      style: {
        stroke: isActive ? '#8b5cf6' : '#374151',
        strokeWidth: 2,
      },
    };
  });
}

interface Props {
  phases: PhaseInfo[];
}

export function PipelineFlow({ phases }: Props) {
  if (phases.length === 0) return null;

  const nodes = buildNodes(phases);
  const edges = buildEdges(phases);

  return (
    <div className="h-[200px] w-full rounded-xl border border-gray-800 bg-gray-950 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        panOnDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e1e2e" />
      </ReactFlow>
    </div>
  );
}

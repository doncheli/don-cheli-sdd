import * as vscode from 'vscode';

interface CmdGroup {
  label: string;
  commands: { cmd: string; desc: string }[];
}

const COMMAND_GROUPS: CmdGroup[] = [
  {
    label: 'Pipeline',
    commands: [
      { cmd: '/dc:comenzar', desc: 'Start task (auto-detect level)' },
      { cmd: '/dc:especificar', desc: 'Create Gherkin spec' },
      { cmd: '/dc:clarificar', desc: 'Find ambiguities' },
      { cmd: '/dc:planificar-tecnico', desc: 'Technical blueprint' },
      { cmd: '/dc:desglosar', desc: 'Break down into tasks' },
      { cmd: '/dc:implementar', desc: 'Execute TDD tasks' },
      { cmd: '/dc:revisar', desc: 'Peer review (7 dims)' },
    ],
  },
  {
    label: 'Analysis',
    commands: [
      { cmd: '/dc:explorar', desc: 'Explore codebase' },
      { cmd: '/dc:estimar', desc: 'Estimate (4 models)' },
      { cmd: '/dc:auditar-seguridad', desc: 'OWASP audit' },
      { cmd: '/dc:poc', desc: 'Proof of Concept' },
      { cmd: '/dc:mesa-redonda', desc: 'Multi-perspective roundtable' },
      { cmd: '/dc:mesa-tecnica', desc: 'Technical expert panel' },
    ],
  },
  {
    label: 'Session',
    commands: [
      { cmd: '/dc:continuar', desc: 'Resume session' },
      { cmd: '/dc:estado', desc: 'Show status' },
      { cmd: '/dc:doctor', desc: 'Diagnose issues' },
      { cmd: '/dc:metricas', desc: 'Show metrics' },
      { cmd: '/dc:cerrar-sesion', desc: 'Close session' },
    ],
  },
  {
    label: 'Quality',
    commands: [
      { cmd: '/dc:gate ejecutar', desc: 'Run custom gates' },
      { cmd: '/dc:gate listar', desc: 'List custom gates' },
      { cmd: '/dc:dashboard', desc: 'Open dashboard' },
      { cmd: '/dc:limpiar-slop', desc: 'Clean AI slop' },
      { cmd: '/dc:guardian', desc: 'Guardian Angel review' },
    ],
  },
];

export class CommandsProvider implements vscode.TreeDataProvider<CommandTreeItem> {
  getTreeItem(element: CommandTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CommandTreeItem): CommandTreeItem[] {
    if (!element) {
      return COMMAND_GROUPS.map(
        g => new CommandTreeItem(g.label, '', 'folder', vscode.TreeItemCollapsibleState.Collapsed),
      );
    }

    const group = COMMAND_GROUPS.find(g => g.label === element.label);
    if (group) {
      return group.commands.map(
        c => new CommandTreeItem(c.cmd, c.desc, 'terminal', vscode.TreeItemCollapsibleState.None, c.cmd),
      );
    }

    return [];
  }
}

class CommandTreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    desc: string,
    icon: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    private cmdToRun?: string,
  ) {
    super(label, collapsibleState);
    this.description = desc;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.tooltip = `${label} — ${desc}`;
    if (cmdToRun) {
      this.command = {
        command: 'doncheli.runCommand.execute',
        title: 'Run',
        arguments: [cmdToRun],
      };
    }
  }
}

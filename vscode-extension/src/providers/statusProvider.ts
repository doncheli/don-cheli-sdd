import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { readFileSafe } from '../utils';

export class StatusProvider implements vscode.TreeDataProvider<StatusItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<StatusItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private dcDir: string | null) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: StatusItem): vscode.TreeItem {
    return element;
  }

  getChildren(): StatusItem[] {
    if (!this.dcDir) {
      return [new StatusItem('No .dc/ found', 'Run /dc:iniciar to start', 'warning')];
    }

    const items: StatusItem[] = [];

    // Directory type
    const dirName = path.basename(this.dcDir);
    items.push(new StatusItem('Directory', dirName, 'folder'));

    // Config
    const configPath = path.join(this.dcDir, 'config.yaml');
    if (fs.existsSync(configPath)) {
      const config = readFileSafe(configPath) || '';
      const projectName = config.match(/nombre:\s*(.+)/)?.[1] || 'Unknown';
      const level = config.match(/nivel:\s*(\d)/)?.[1] || '?';
      items.push(new StatusItem('Project', projectName.trim(), 'project'));
      items.push(new StatusItem('Level', `N${level}`, 'symbol-number'));
    }

    // Status
    const statusFile = fs.existsSync(path.join(this.dcDir, 'estado.md'))
      ? path.join(this.dcDir, 'estado.md')
      : fs.existsSync(path.join(this.dcDir, 'status.md'))
        ? path.join(this.dcDir, 'status.md')
        : null;

    if (statusFile) {
      const status = readFileSafe(statusFile) || '';
      const phase = status.match(/Fase actual:\s*(.+)/)?.[1] || status.match(/Current phase:\s*(.+)/)?.[1] || 'Unknown';
      const progress = status.match(/Progreso:\s*(.+)/)?.[1] || status.match(/Progress:\s*(.+)/)?.[1] || '?';
      items.push(new StatusItem('Phase', phase.trim(), 'debug-step-over'));
      items.push(new StatusItem('Progress', progress.trim(), 'pie-chart'));
    }

    // Specs count
    const specsDir = path.join(this.dcDir, 'specs');
    if (fs.existsSync(specsDir)) {
      const specCount = fs.readdirSync(specsDir).filter(f => f.endsWith('.feature')).length;
      items.push(new StatusItem('Specs', `${specCount} .feature files`, 'file-code'));
    }

    // Blueprints count
    const bpDir = path.join(this.dcDir, 'blueprints');
    if (fs.existsSync(bpDir)) {
      const bpCount = fs.readdirSync(bpDir).filter(f => f.endsWith('.md')).length;
      items.push(new StatusItem('Blueprints', `${bpCount} files`, 'file-text'));
    }

    // Coverage from metrics
    const metricsPath = path.join(this.dcDir, 'metrics.json');
    if (fs.existsSync(metricsPath)) {
      try {
        const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
        const sessions = metrics.sessions || [];
        if (sessions.length > 0) {
          const lastSession = sessions[sessions.length - 1];
          items.push(new StatusItem('Coverage', `${lastSession.coverage || '?'}%`, 'graph'));
          items.push(new StatusItem('Sessions', `${sessions.length} completed`, 'history'));
        }
      } catch {}
    }

    return items;
  }
}

class StatusItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private value: string,
    icon: string,
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = value;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.tooltip = `${label}: ${value}`;
  }
}

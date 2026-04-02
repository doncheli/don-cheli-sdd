import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { readFileSafe, parseSimpleYaml } from '../utils';

export class GatesProvider implements vscode.TreeDataProvider<GateItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<GateItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private dcDir: string | null) {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: GateItem): vscode.TreeItem {
    return element;
  }

  getChildren(): GateItem[] {
    const items: GateItem[] = [];

    // Built-in gates status (from estado.md)
    const builtinGates = [
      { name: 'Gate 1: Spec Completeness', key: 'Puerta 1' },
      { name: 'Gate 2+3: Clarify & QA', key: 'Puerta 2' },
      { name: 'Gate 4: Plan Approved', key: 'Puerta 4' },
      { name: 'Gate 5: Tasks Ready', key: 'Puerta 5' },
      { name: 'Gate 6: Code Merged', key: 'Puerta 6' },
    ];

    if (this.dcDir) {
      const statusContent = readFileSafe(path.join(this.dcDir, 'estado.md'))
        || readFileSafe(path.join(this.dcDir, 'status.md'))
        || '';

      for (const gate of builtinGates) {
        const passed = statusContent.includes(`${gate.key}`) && statusContent.includes('APROBADA');
        items.push(new GateItem(
          gate.name,
          passed ? 'PASSED' : 'PENDING',
          passed ? 'pass' : 'circle-outline',
        ));
      }

      // Custom gates
      const gatesDir = path.join(this.dcDir, 'gates');
      if (fs.existsSync(gatesDir)) {
        const gateFiles = fs.readdirSync(gatesDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
        if (gateFiles.length > 0) {
          items.push(new GateItem('── Custom Gates ──', '', 'dash'));
          for (const file of gateFiles) {
            const content = readFileSafe(path.join(gatesDir, file)) || '';
            const parsed = parseSimpleYaml(content);
            const name = parsed['name'] || file.replace(/\.ya?ml$/, '');
            const severity = parsed['severity'] || 'warn';
            const icon = severity === 'block' ? 'error' : 'warning';
            items.push(new GateItem(name, severity, icon));
          }
        }
      }
    } else {
      items.push(new GateItem('No .dc/ directory found', 'Run /dc:iniciar', 'warning'));
    }

    return items;
  }
}

class GateItem extends vscode.TreeItem {
  constructor(label: string, status: string, icon: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.description = status;
    this.iconPath = new vscode.ThemeIcon(icon);
    this.tooltip = `${label}: ${status}`;
  }
}

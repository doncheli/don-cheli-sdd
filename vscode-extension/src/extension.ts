import * as vscode from 'vscode';
import { StatusProvider } from './providers/statusProvider';
import { GatesProvider } from './providers/gatesProvider';
import { CommandsProvider } from './providers/commandsProvider';
import { DashboardPanel } from './panels/dashboardPanel';
import { getDcDir, runInTerminal } from './utils';

export function activate(context: vscode.ExtensionContext) {
  const dcDir = getDcDir();

  // Sidebar providers
  const statusProvider = new StatusProvider(dcDir);
  const gatesProvider = new GatesProvider(dcDir);
  const commandsProvider = new CommandsProvider();

  vscode.window.registerTreeDataProvider('doncheli.status', statusProvider);
  vscode.window.registerTreeDataProvider('doncheli.gates', gatesProvider);
  vscode.window.registerTreeDataProvider('doncheli.commands', commandsProvider);

  // Commands
  context.subscriptions.push(
    vscode.commands.registerCommand('doncheli.init', () => {
      runInTerminal('/dc:iniciar');
    }),

    vscode.commands.registerCommand('doncheli.start', async () => {
      const task = await vscode.window.showInputBox({
        prompt: 'Describe the task to start',
        placeHolder: 'e.g., Implement JWT authentication with refresh tokens',
      });
      if (task) {
        runInTerminal(`/dc:comenzar ${task}`);
      }
    }),

    vscode.commands.registerCommand('doncheli.status', () => {
      runInTerminal('/dc:estado');
    }),

    vscode.commands.registerCommand('doncheli.runGates', () => {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder open');
        return;
      }
      const terminal = vscode.window.createTerminal('Don Cheli Gates');
      terminal.show();
      terminal.sendText(`bash -c 'INPUT_GATES=all INPUT_MIN_COVERAGE=85 bash "${workspaceRoot}/.claude/don-cheli/scripts/sdd-check.sh" 2>/dev/null || npx don-cheli-sdd validate'`);
    }),

    vscode.commands.registerCommand('doncheli.dashboard', (ctx) => {
      DashboardPanel.createOrShow(context.extensionUri, dcDir);
    }),

    vscode.commands.registerCommand('doncheli.runCommand', async () => {
      const commands = [
        { label: '/dc:comenzar', description: 'Start task (auto-detect level)' },
        { label: '/dc:especificar', description: 'Create Gherkin specification' },
        { label: '/dc:clarificar', description: 'Find ambiguities in spec' },
        { label: '/dc:planificar-tecnico', description: 'Generate technical blueprint' },
        { label: '/dc:desglosar', description: 'Break down into TDD tasks' },
        { label: '/dc:implementar', description: 'Execute TDD tasks' },
        { label: '/dc:revisar', description: 'Peer review (7 dimensions)' },
        { label: '/dc:estado', description: 'Show project status' },
        { label: '/dc:continuar', description: 'Resume previous session' },
        { label: '/dc:auditar-seguridad', description: 'OWASP Top 10 audit' },
        { label: '/dc:estimar', description: 'Estimate with 4 models' },
        { label: '/dc:poc', description: 'Proof of Concept mode' },
        { label: '/dc:mesa-redonda', description: 'Multi-perspective roundtable' },
        { label: '/dc:mesa-tecnica', description: 'Technical expert panel' },
        { label: '/dc:gate ejecutar', description: 'Run custom quality gates' },
        { label: '/dc:metricas', description: 'Show metrics summary' },
        { label: '/dc:doctor', description: 'Diagnose framework issues' },
        { label: '/dc:migrar', description: 'Plan stack migration' },
        { label: '/dc:explorar', description: 'Explore codebase' },
        { label: '/dc:reflexionar', description: 'Reflect on work quality' },
      ];

      const picked = await vscode.window.showQuickPick(commands, {
        placeHolder: 'Select a Don Cheli command to run',
      });

      if (picked) {
        runInTerminal(picked.label);
      }
    }),

    vscode.commands.registerCommand('doncheli.refresh', () => {
      statusProvider.refresh();
      gatesProvider.refresh();
    }),
  );

  // Status bar
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 50);
  statusBar.text = '$(shield) Don Cheli';
  statusBar.tooltip = 'Don Cheli SDD — Click to run a command';
  statusBar.command = 'doncheli.runCommand';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // Auto-refresh on file save within .dc/
  const watcher = vscode.workspace.createFileSystemWatcher('**/.dc/**');
  watcher.onDidChange(() => {
    statusProvider.refresh();
    gatesProvider.refresh();
  });
  watcher.onDidCreate(() => {
    statusProvider.refresh();
    gatesProvider.refresh();
  });
  context.subscriptions.push(watcher);

  // Welcome message on first activation
  if (dcDir) {
    vscode.window.showInformationMessage('Don Cheli SDD active. Use /dc:* commands in your AI agent.');
  }
}

export function deactivate() {}

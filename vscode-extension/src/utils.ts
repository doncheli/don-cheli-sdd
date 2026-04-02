import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Find the .dc/ or .especdev/ directory in the workspace (retrocompatible)
 */
export function getDcDir(): string | null {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) { return null; }

  const dcPath = path.join(workspaceRoot, '.dc');
  const legacyPath = path.join(workspaceRoot, '.especdev');

  if (fs.existsSync(dcPath)) { return dcPath; }
  if (fs.existsSync(legacyPath)) { return legacyPath; }
  return null;
}

/**
 * Run a /dc:* command in the integrated terminal
 */
export function runInTerminal(command: string) {
  const config = vscode.workspace.getConfiguration('doncheli');
  const agent = config.get<string>('terminal', 'claude');

  let terminal = vscode.window.terminals.find(t => t.name === 'Don Cheli');
  if (!terminal) {
    terminal = vscode.window.createTerminal('Don Cheli');
  }
  terminal.show();

  if (agent === 'claude') {
    terminal.sendText(command);
  } else if (agent === 'cursor') {
    terminal.sendText(command);
  } else {
    terminal.sendText(`echo "${command}"`);
  }
}

/**
 * Read a file safely, return null if not found
 */
export function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Parse simple YAML frontmatter (key: value)
 */
export function parseSimpleYaml(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (match) {
      result[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return result;
}

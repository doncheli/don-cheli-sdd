"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDcDir = getDcDir;
exports.runInTerminal = runInTerminal;
exports.readFileSafe = readFileSafe;
exports.parseSimpleYaml = parseSimpleYaml;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Find the .dc/ or .especdev/ directory in the workspace (retrocompatible)
 */
function getDcDir() {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
        return null;
    }
    const dcPath = path.join(workspaceRoot, '.dc');
    const legacyPath = path.join(workspaceRoot, '.especdev');
    if (fs.existsSync(dcPath)) {
        return dcPath;
    }
    if (fs.existsSync(legacyPath)) {
        return legacyPath;
    }
    return null;
}
/**
 * Run a /dc:* command in the integrated terminal
 */
function runInTerminal(command) {
    const config = vscode.workspace.getConfiguration('doncheli');
    const agent = config.get('terminal', 'claude');
    let terminal = vscode.window.terminals.find(t => t.name === 'Don Cheli');
    if (!terminal) {
        terminal = vscode.window.createTerminal('Don Cheli');
    }
    terminal.show();
    if (agent === 'claude') {
        terminal.sendText(command);
    }
    else if (agent === 'cursor') {
        terminal.sendText(command);
    }
    else {
        terminal.sendText(`echo "${command}"`);
    }
}
/**
 * Read a file safely, return null if not found
 */
function readFileSafe(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    }
    catch {
        return null;
    }
}
/**
 * Parse simple YAML frontmatter (key: value)
 */
function parseSimpleYaml(content) {
    const result = {};
    const lines = content.split('\n');
    for (const line of lines) {
        const match = line.match(/^(\w[\w-]*):\s*(.+)$/);
        if (match) {
            result[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
        }
    }
    return result;
}
//# sourceMappingURL=utils.js.map
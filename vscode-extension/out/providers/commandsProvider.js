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
exports.CommandsProvider = void 0;
const vscode = __importStar(require("vscode"));
const COMMAND_GROUPS = [
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
class CommandsProvider {
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            return COMMAND_GROUPS.map(g => new CommandTreeItem(g.label, '', 'folder', vscode.TreeItemCollapsibleState.Collapsed));
        }
        const group = COMMAND_GROUPS.find(g => g.label === element.label);
        if (group) {
            return group.commands.map(c => new CommandTreeItem(c.cmd, c.desc, 'terminal', vscode.TreeItemCollapsibleState.None, c.cmd));
        }
        return [];
    }
}
exports.CommandsProvider = CommandsProvider;
class CommandTreeItem extends vscode.TreeItem {
    cmdToRun;
    constructor(label, desc, icon, collapsibleState, cmdToRun) {
        super(label, collapsibleState);
        this.cmdToRun = cmdToRun;
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
//# sourceMappingURL=commandsProvider.js.map
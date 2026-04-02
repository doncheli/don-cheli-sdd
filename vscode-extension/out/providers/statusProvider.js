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
exports.StatusProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("../utils");
class StatusProvider {
    dcDir;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(dcDir) {
        this.dcDir = dcDir;
    }
    refresh() {
        this._onDidChangeTreeData.fire(undefined);
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        if (!this.dcDir) {
            return [new StatusItem('No .dc/ found', 'Run /dc:iniciar to start', 'warning')];
        }
        const items = [];
        // Directory type
        const dirName = path.basename(this.dcDir);
        items.push(new StatusItem('Directory', dirName, 'folder'));
        // Config
        const configPath = path.join(this.dcDir, 'config.yaml');
        if (fs.existsSync(configPath)) {
            const config = (0, utils_1.readFileSafe)(configPath) || '';
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
            const status = (0, utils_1.readFileSafe)(statusFile) || '';
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
            }
            catch { }
        }
        return items;
    }
}
exports.StatusProvider = StatusProvider;
class StatusItem extends vscode.TreeItem {
    label;
    value;
    constructor(label, value, icon) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.label = label;
        this.value = value;
        this.description = value;
        this.iconPath = new vscode.ThemeIcon(icon);
        this.tooltip = `${label}: ${value}`;
    }
}
//# sourceMappingURL=statusProvider.js.map
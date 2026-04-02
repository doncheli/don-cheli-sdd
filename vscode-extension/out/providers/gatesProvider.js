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
exports.GatesProvider = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utils_1 = require("../utils");
class GatesProvider {
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
        const items = [];
        // Built-in gates status (from estado.md)
        const builtinGates = [
            { name: 'Gate 1: Spec Completeness', key: 'Puerta 1' },
            { name: 'Gate 2+3: Clarify & QA', key: 'Puerta 2' },
            { name: 'Gate 4: Plan Approved', key: 'Puerta 4' },
            { name: 'Gate 5: Tasks Ready', key: 'Puerta 5' },
            { name: 'Gate 6: Code Merged', key: 'Puerta 6' },
        ];
        if (this.dcDir) {
            const statusContent = (0, utils_1.readFileSafe)(path.join(this.dcDir, 'estado.md'))
                || (0, utils_1.readFileSafe)(path.join(this.dcDir, 'status.md'))
                || '';
            for (const gate of builtinGates) {
                const passed = statusContent.includes(`${gate.key}`) && statusContent.includes('APROBADA');
                items.push(new GateItem(gate.name, passed ? 'PASSED' : 'PENDING', passed ? 'pass' : 'circle-outline'));
            }
            // Custom gates
            const gatesDir = path.join(this.dcDir, 'gates');
            if (fs.existsSync(gatesDir)) {
                const gateFiles = fs.readdirSync(gatesDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
                if (gateFiles.length > 0) {
                    items.push(new GateItem('── Custom Gates ──', '', 'dash'));
                    for (const file of gateFiles) {
                        const content = (0, utils_1.readFileSafe)(path.join(gatesDir, file)) || '';
                        const parsed = (0, utils_1.parseSimpleYaml)(content);
                        const name = parsed['name'] || file.replace(/\.ya?ml$/, '');
                        const severity = parsed['severity'] || 'warn';
                        const icon = severity === 'block' ? 'error' : 'warning';
                        items.push(new GateItem(name, severity, icon));
                    }
                }
            }
        }
        else {
            items.push(new GateItem('No .dc/ directory found', 'Run /dc:iniciar', 'warning'));
        }
        return items;
    }
}
exports.GatesProvider = GatesProvider;
class GateItem extends vscode.TreeItem {
    constructor(label, status, icon) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.description = status;
        this.iconPath = new vscode.ThemeIcon(icon);
        this.tooltip = `${label}: ${status}`;
    }
}
//# sourceMappingURL=gatesProvider.js.map
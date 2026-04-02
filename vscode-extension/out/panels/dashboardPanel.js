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
exports.DashboardPanel = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DashboardPanel {
    static currentPanel;
    _panel;
    _disposables = [];
    static createOrShow(extensionUri, dcDir) {
        const column = vscode.window.activeTextEditor?.viewColumn || vscode.ViewColumn.One;
        if (DashboardPanel.currentPanel) {
            DashboardPanel.currentPanel._panel.reveal(column);
            DashboardPanel.currentPanel._update(dcDir);
            return;
        }
        const panel = vscode.window.createWebviewPanel('doncheli.dashboard', 'Don Cheli Dashboard', column, { enableScripts: true });
        DashboardPanel.currentPanel = new DashboardPanel(panel, dcDir);
    }
    constructor(panel, dcDir) {
        this._panel = panel;
        this._update(dcDir);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    }
    _update(dcDir) {
        let metrics = { sessions: [], features: [], estimates: [] };
        if (dcDir) {
            const metricsPath = path.join(dcDir, 'metrics.json');
            if (fs.existsSync(metricsPath)) {
                try {
                    metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
                }
                catch { }
            }
        }
        const sessions = metrics.sessions || [];
        const totalSessions = sessions.length;
        const avgDuration = totalSessions > 0
            ? Math.round(sessions.reduce((s, x) => s + (x.duration_min || 0), 0) / totalSessions)
            : 0;
        const avgCoverage = totalSessions > 0
            ? Math.round(sessions.reduce((s, x) => s + (x.coverage || 0), 0) / totalSessions)
            : 0;
        const totalStubs = sessions.reduce((s, x) => s + (x.stubs_found || 0), 0);
        const gatesPassRate = totalSessions > 0
            ? Math.round(sessions.reduce((s, x) => s + ((x.gates_passed || 0) / Math.max(x.gates_total || 1, 1)) * 100, 0) / totalSessions)
            : 0;
        const tddRate = totalSessions > 0
            ? Math.round(sessions.reduce((s, x) => s + ((x.tdd_first_pass || 0) / Math.max(x.tdd_cycles || 1, 1)) * 100, 0) / totalSessions)
            : 0;
        this._panel.webview.html = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #1e1e2e; color: #cdd6f4; padding: 20px; margin: 0; }
    h1 { color: #cba6f7; margin-bottom: 4px; }
    .subtitle { color: #6c7086; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .card { background: #313244; border-radius: 12px; padding: 20px; text-align: center; }
    .card .number { font-size: 2.2rem; font-weight: 800; }
    .card .label { font-size: 0.85rem; color: #6c7086; margin-top: 4px; }
    .purple { color: #cba6f7; }
    .green { color: #a6e3a1; }
    .cyan { color: #89dceb; }
    .peach { color: #fab387; }
    .red { color: #f38ba8; }
    .yellow { color: #f9e2af; }
    .empty { text-align: center; padding: 60px 20px; color: #6c7086; }
    .empty h2 { color: #cba6f7; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { text-align: left; padding: 8px 12px; color: #6c7086; border-bottom: 1px solid #45475a; font-size: 0.85rem; }
    td { padding: 8px 12px; border-bottom: 1px solid #313244; font-size: 0.9rem; }
  </style>
</head>
<body>
  <h1>Don Cheli SDD Dashboard</h1>
  <p class="subtitle">Telemetry & Efficiency Metrics</p>
  ${totalSessions === 0 ? `
  <div class="empty">
    <h2>No metrics yet</h2>
    <p>Metrics are recorded when you complete sessions with <code>/dc:cerrar-sesion</code></p>
    <p>Start a task with <code>/dc:comenzar</code> to begin tracking.</p>
  </div>
  ` : `
  <div class="grid">
    <div class="card"><div class="number purple">${totalSessions}</div><div class="label">Sessions</div></div>
    <div class="card"><div class="number cyan">${avgDuration}m</div><div class="label">Avg Duration</div></div>
    <div class="card"><div class="number green">${avgCoverage}%</div><div class="label">Avg Coverage</div></div>
    <div class="card"><div class="number peach">${gatesPassRate}%</div><div class="label">Gates Pass Rate</div></div>
    <div class="card"><div class="number yellow">${tddRate}%</div><div class="label">TDD First-Pass</div></div>
    <div class="card"><div class="number red">${totalStubs}</div><div class="label">Stubs Detected</div></div>
  </div>
  <h3>Session History</h3>
  <table>
    <tr><th>Session</th><th>Duration</th><th>Phase</th><th>Gates</th><th>Coverage</th><th>Stubs</th></tr>
    ${sessions.slice(-10).reverse().map((s) => `
    <tr>
      <td>${s.id || '—'}</td>
      <td>${s.duration_min || '?'}m</td>
      <td>${s.phase_reached || '?'}/6</td>
      <td>${s.gates_passed || '?'}/${s.gates_total || '?'}</td>
      <td>${s.coverage || '?'}%</td>
      <td>${s.stubs_found || 0}</td>
    </tr>`).join('')}
  </table>
  `}
</body>
</html>`;
    }
    dispose() {
        DashboardPanel.currentPanel = undefined;
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
}
exports.DashboardPanel = DashboardPanel;
//# sourceMappingURL=dashboardPanel.js.map
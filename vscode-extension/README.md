# Don Cheli SDD — VS Code Extension

**Stop guessing. Start engineering.** The visual companion for the Don Cheli SDD Framework.

## Features

### Sidebar — Project Status at a Glance

See your SDD project status without leaving VS Code:

- **Project Status:** Current phase, progress, coverage, sessions completed
- **Quality Gates:** Built-in 6 gates + custom gates with pass/pending indicators
- **Commands:** Browse and run 85+ Don Cheli commands organized by category

### Quick Commands

Press `Ctrl+Shift+P` and type "Don Cheli" to access:

| Command | What it does |
|---------|-------------|
| **Initialize Project** | Run `/dc:iniciar` to set up SDD |
| **Start Task** | Run `/dc:comenzar` with task description |
| **Show Status** | View current project status |
| **Run Quality Gates** | Execute all quality gates locally |
| **Open Dashboard** | Interactive metrics dashboard |
| **Run Command...** | Pick from 20+ most-used commands |

### Dashboard — Metrics & Telemetry

Visual dashboard showing:

- Sessions completed and average duration
- Test coverage trend
- Quality gates pass rate
- TDD first-pass rate
- Stubs detected and eliminated

### Status Bar

The shield icon in the status bar gives quick access to all Don Cheli commands.

## Requirements

- [Don Cheli SDD Framework](https://github.com/doncheli/don-cheli-sdd) installed
- A `.dc/` directory in your project (run `/dc:iniciar`)
- An AI agent (Claude Code, Cursor, etc.)

## Installation

1. Install from VS Code Marketplace: search "Don Cheli SDD"
2. Or install from VSIX: `code --install-extension don-cheli-sdd-1.0.0.vsix`
3. Open a project with `.dc/` directory
4. The Don Cheli sidebar appears automatically

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `doncheli.terminal` | `claude` | AI agent: `claude`, `cursor`, or `terminal` |
| `doncheli.language` | `es` | Language: `es`, `en`, `pt` |
| `doncheli.minCoverage` | `85` | Minimum coverage percentage |

## How it works

The extension reads your `.dc/` directory (or `.especdev/` for legacy projects) and displays the SDD artifacts visually. Commands are executed in the integrated terminal through your AI agent.

**No data leaves your machine.** All telemetry is 100% local.

## Links

- [Don Cheli SDD Framework](https://github.com/doncheli/don-cheli-sdd)
- [Full Documentation](https://doncheli.tv/comousar.html)
- [Report Issues](https://github.com/doncheli/don-cheli-sdd/issues)

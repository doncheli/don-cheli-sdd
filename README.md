> 🌐 Read this in other languages: [English](README.md) | [Español](README.es.md) | [Português](README.pt.md)

<p align="center">
  <h1 align="center">Don Cheli — SDD Framework</h1>
  <p align="center">
    <strong>Stop guessing. Start engineering.</strong><br/>
    <sub>Vibe coding is the spark; SDD is the engine. Transition from AI-assisted chaos to professional software delivery.</sub>
  </p>
  <p align="center">
    The most comprehensive Specification-Driven Development framework on the market.<br/>
    Open source. Multilingual (ES/EN/PT). For Claude Code and other AI agents.
  </p>
  <p align="center">
    <a href="#-installation"><img src="https://img.shields.io/badge/install-2_minutes-brightgreen" alt="Install"></a>
    <img src="https://img.shields.io/badge/version-1.24.1-blue" alt="Version">
    <img src="https://img.shields.io/badge/license-Apache%202.0-green" alt="License">
    <img src="https://img.shields.io/badge/languages-ES%20|%20EN%20|%20PT-red" alt="Languages">
    <img src="https://img.shields.io/badge/commands-85+-purple" alt="Commands">
    <img src="https://img.shields.io/badge/skills-42+-orange" alt="Skills">
    <img src="https://img.shields.io/badge/Anthropic%20Skills%202.0-compatible-blueviolet" alt="Skills 2.0">
    <a href="https://marketplace.visualstudio.com/items?itemName=doncheli.don-cheli-sdd"><img src="https://img.shields.io/visual-studio-marketplace/v/doncheli.don-cheli-sdd?label=VS%20Code&color=007ACC" alt="VS Code"></a>
    <br/>
    <a href="https://github.com/doncheli/don-cheli-sdd/actions/workflows/validar.yml"><img src="https://github.com/doncheli/don-cheli-sdd/actions/workflows/validar.yml/badge.svg" alt="CI"></a>
    <a href="https://codecov.io/gh/doncheli/don-cheli-sdd"><img src="https://codecov.io/gh/doncheli/don-cheli-sdd/branch/main/graph/badge.svg" alt="Codecov"></a>
    <a href="https://www.npmjs.com/package/don-cheli-sdd"><img src="https://img.shields.io/npm/v/don-cheli-sdd" alt="npm"></a>
    <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-view-blue" alt="Changelog"></a>
    <img src="https://img.shields.io/github/last-commit/doncheli/don-cheli-sdd" alt="Last Commit">
    <img src="https://img.shields.io/github/contributors/doncheli/don-cheli-sdd" alt="Contributors">
  </p>
</p>

---

## Demo

```bash
# Without Don Cheli:
"Claude, build me a users API"
# → Code without tests → broken in production → "What did we decide yesterday?"

# With Don Cheli (one command):
/dc:start "Users API with JWT authentication"
# → Gherkin Spec → Tests first → Code → Review → Done with evidence
```

> **How does it look in action?** Type `/dc:start` and Don Cheli auto-detects complexity,
> generates the Gherkin spec, proposes the technical blueprint,
> breaks down into TDD tasks and executes. No vibe coding. With evidence.

---

## The Problem

You start a project with AI. The first 2 hours go well. Then:

- **Context rot** — Claude forgets your architecture decisions
- **Silent stubs** — It says "I implemented the service" but the code says `// TODO`
- **No verification** — Does it work? I don't know. Tests? No. Can I deploy? Hopefully

That is **vibe coding**. And it is the enemy of quality software.

---

## Before vs After

| Aspect | ❌ Without Don Cheli | ✅ With Don Cheli |
|--------|---------------------|------------------|
| **Requirements** | "Build me a login" | Gherkin spec with 8 verifiable scenarios |
| **Architecture** | AI invents on the fly | Technical blueprint + ratified DBML |
| **Tests** | "Maybe... someday..." | Mandatory TDD: RED → GREEN → REFACTOR |
| **Quality** | "I think it works" | 6 Quality Gates + 85% coverage |
| **Context** | Lost every session | Full persistence in `.dc/` files |
| **Stubs** | Ship to production | Automatic ghost stub detection |

---

## Installation

**3 steps. 2 minutes. Free.**

### Via npm (recommended)

```bash
# 1. Install globally
npm install -g don-cheli-sdd

# 2. Run the interactive installer
don-cheli install --global

# 3. In your project, open your AI agent and type:
/dc:init
```

### VS Code Extension

Search **"Don Cheli SDD"** in VS Code Extensions, or:

```bash
code --install-extension doncheli.don-cheli-sdd
```

Gives you: sidebar with project status, quality gates, commands browser and metrics dashboard.

### Via git clone

```bash
git clone https://github.com/doncheli/don-cheli-sdd.git
cd don-cheli-sdd && bash scripts/instalar.sh
```

<details>
<summary><strong>Via npx (no install)</strong></summary>

```bash
npx don-cheli-sdd install --global --lang en
```

</details>

<details>
<summary><strong>Remote install (one liner)</strong></summary>

```bash
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global --lang en
```

</details>

<details>
<summary><strong>Silent install (CI/CD)</strong></summary>

```bash
bash scripts/instalar.sh \
  --tools claude,cursor \
  --profile phantom \
  --global --lang en
```

Flags: `--tools`, `--profile`, `--skills`, `--comandos`, `--dry-run`, `--global`, `--lang`

</details>

The interactive installer guides you step by step:

```
┌──────────────────────────────────────┐
│  Don Cheli SDD — Setup               │
└──────────────────────────────────────┘

Step 1: 🌍 Language → Español, English, Português
Step 2: 🔧 Tool     → Claude Code, Cursor, Antigravity, Codex, Warp, Amp...
Step 3: 👤 Profile  → 6 preconfigured archetypes
Step 4: ✅ Confirm  → Summary of everything selected
```

**Requirements:** Git + an AI agent (Claude Code, Cursor, etc.)

---

## How It Works

**6 phases. From idea to verified code.**

```mermaid
flowchart LR
    P["📋 PRD"] -.->|optional| B
    A["💡 Idea"] --> B["📄 Specify"]
    B --> C["🔍 Clarify"]
    C --> D["🏗 Plan"]
    D --> E["📋 Break Down"]
    E --> F["⚡ Implement"]
    F --> G["✅ Review"]

    style P fill:#2d3436,color:#dfe6e9,stroke:#6c5ce7,stroke-dasharray: 5 5
    style B fill:#6c5ce7,color:#fff
    style C fill:#0984e3,color:#fff
    style D fill:#00b894,color:#fff
    style E fill:#fdcb6e,color:#000
    style F fill:#e17055,color:#fff
    style G fill:#fd79a8,color:#fff
```

> **PRD (optional):** If you have a Figma design, product brief or user research, run `/dc:prd` first. The PRD auto-feeds into Specify with user stories, priorities and risks.

| # | Phase | Command | What it does |
|---|-------|---------|-------------|
| 1 | **Specify** | `/dc:specify` | Turns your idea into a Gherkin specification with test scenarios, priorities and DBML schema |
| 2 | **Clarify** | `/dc:clarify` | A virtual QA detects ambiguities and contradictions before coding |
| 3 | **Plan** | `/dc:tech-plan` | Technical blueprint with architecture, API contracts and final schema |
| 4 | **Break Down** | `/dc:breakdown` | Splits the plan into concrete tasks with execution order and parallelism |
| 5 | **Implement** | `/dc:implement` | Executes with strict TDD: test first, then code, then improve |
| 6 | **Review** | `/dc:review` | Automatic peer review across 7 dimensions: functionality, tests, performance, architecture, security, maintainability, docs |

Each phase has **quality gates**. You don't advance without passing. **No shortcuts.**

---

## Adapts to Your Project

Not everything needs all 6 phases. Don Cheli auto-detects complexity:

| Level | Name | When | Phases |
|-------|------|------|--------|
| **0** | Atomic | 1 file, < 30 min | Implement → Verify |
| **P** | PoC | Validate feasibility (2-4h) | Hypothesis → Build → Evaluate → Verdict |
| **1** | Micro | 1-3 files | Specify (light) → Implement → Review |
| **2** | Standard | Multiple files, 1-3 days | All 6 phases |
| **3** | Complex | Multi-module, 1-2 weeks | 6 phases + pseudocode |
| **4** | Product | New system, 2+ weeks | 6 phases + constitution + proposal |

```bash
/dc:start Implement JWT authentication
# → ▶ Level detected: 2 — Standard
# → ▶ Phases: Specify → Clarify → Plan → Break Down → Implement → Review
```

---

## The 3 Iron Laws

Non-negotiable. Always enforced. No exceptions.

| Law | Principle | In practice |
|-----|-----------|-------------|
| **I. TDD** | All code requires tests | `RED` → `GREEN` → `REFACTOR`, no exceptions |
| **II. Debugging** | Root cause first | Reproduce → Isolate → Understand → Fix → Verify |
| **III. Verification** | Evidence before assertions | ✅ "Tests pass" > ❌ "I think it works" |

---

## Why Don Cheli

<table>
<tr><th></th><th>BMAD<br/><sub>41K ⭐</sub></th><th>GSD<br/><sub>38K ⭐</sub></th><th>spec-kit<br/><sub>40K ⭐</sub></th><th><strong>Don Cheli</strong></th></tr>
<tr><td>Commands</td><td>~20</td><td>~80</td><td>~10</td><td><strong>85+</strong></td></tr>
<tr><td>Skills</td><td>~15</td><td>~15</td><td>~6</td><td><strong>42+</strong></td></tr>
<tr><td>Reasoning models</td><td>—</td><td>—</td><td>—</td><td><strong>15</strong></td></tr>
<tr><td>Automatic estimates</td><td>—</td><td>—</td><td>—</td><td><strong>4 models</strong></td></tr>
<tr><td>Formal quality gates</td><td>—</td><td>1</td><td>4</td><td><strong>6</strong></td></tr>
<tr><td>Mandatory TDD</td><td>—</td><td>—</td><td>—</td><td><strong>Iron Law</strong></td></tr>
<tr><td>PoC Mode</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>OWASP Audit</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Stack Migration</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Stub Detection</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>UI/API Contracts</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Multilingual (ES/EN/PT)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Anthropic Skills 2.0</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Worktree Isolation</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Crash Recovery</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Cost Tracking</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Loop Detection</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Skills Marketplace</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Adversarial Multi-role Debate</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>CI/CD GitHub Action</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Custom Quality Gates (plugins)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Telemetry Dashboard</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>VS Code Extension</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Drift Detection (async watcher)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Reasoning Time Travel</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Pre-Flight Cost Simulation</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
</table>

<details>
<summary><strong>20 things only Don Cheli has</strong></summary>

1. **15 reasoning models** — Pre-mortem, 5 Whys, Pareto, RLM
2. **4 estimation models** — Function Points, AI Planning Poker, COCOMO, Historical
3. **PoC Mode** — Validate ideas with timebox and success criteria before committing
4. **Blueprint Distillation** — Extract specs from existing code (behavior reverse engineering)
5. **CodeRAG** — Index reference repos and retrieve relevant patterns
6. **OWASP Audit** — Static security scanning integrated into the pipeline
7. **Stack Migration** — Vue→React, JS→TS with wave plan and equivalences
8. **API Contracts** — REST/GraphQL with retries, circuit breaker, idempotency
9. **SOLID Refactoring** — Checklist, metrics, structured design patterns
10. **Living Documentation** — ADRs, auto-generated OpenAPI, Mermaid diagrams
11. **Captures & Triage** — Capture ideas without stopping, auto-classification in 5 categories
12. **Auto-generated UAT** — Human-executable acceptance scripts after each feature
13. **Doctor** — Diagnosis and auto-repair of git, framework and environment
14. **Skill Creator** — Iterative meta-skill for creating skills automatically
15. **Skills Marketplace** — Install skills from Anthropic, community, or create your own
16. **Project Constitution** — 8 immutable principles validated at every quality gate
17. **Formal Pseudocode (SPARC)** — Technology-agnostic logical reasoning
18. **Multi-layer Validation** — 8 checks (leakage, measurability, completeness, constitution)
19. **Adversarial Debate** — PM vs Architect vs QA with mandatory objection
20. **Scale-adaptive Planning** — Process adjusts by complexity (N0 to N4)

</details>

---

## Profiles

6 preconfigured archetypes. Each with optimized skills, commands and reasoning models:

| Profile | Role | Best for | Reasoning |
|---------|------|----------|-----------|
| 👻 **Phantom Coder** | Full-stack | Full pipeline, TDD, quality gates, deploy | First Principles, Pre-mortem, 5 Whys |
| 💀 **Reaper Sec** | Security | OWASP, audits, pentest, offensive/defensive security | Pre-mortem, Inversion, First Principles |
| 🏗 **System Architect** | Architecture | Blueprints, SOLID, APIs, migrations, system design | First Principles, Second Order, Map-Territory |
| ⚡ **Speedrunner** | MVP/Startup | Quick PoCs, agile estimates, ship first | Pre-mortem, Pareto, Opportunity Cost |
| 🔮 **The Oracle** | Reasoning | 15 mental models, deep analysis, hard decisions | All 15 models |
| 🥷 **Dev Dojo** | Learning | Living docs, ADRs, reflections, grow while building | First Principles, 5 Whys, Second Order |

---

## Commands (85+)

Top 20 most used. [Full list in the web docs →](https://doncheli.tv/comousar.html)

### Main pipeline

| Command | What it does |
|---------|-------------|
| `/dc:start` | Start a task auto-detecting complexity (Level 0-4) |
| `/dc:specify` | Convert your idea into Gherkin spec with test scenarios |
| `/dc:clarify` | Find ambiguities and resolve them before coding |
| `/dc:tech-plan` | Generate technical blueprint with architecture and contracts |
| `/dc:breakdown` | Split plan into concrete tasks with execution order |
| `/dc:implement` | Execute tasks with TDD: RED → GREEN → REFACTOR |
| `/dc:review` | Automatic peer review in 7 dimensions |

### Analysis and decisions

| Command | What it does |
|---------|-------------|
| `/dc:explore` | Explore the codebase before proposing changes |
| `/dc:estimate` | Estimates with 4 models (Function Points, COCOMO, Planning Poker, Historical) |
| `/dc:roundtable` | Multi-perspective discussion: CPO, UX, Business |
| `/dc:tech-panel` | Expert panel: Tech Lead, Backend, Frontend, Architect |
| `/dc:security-audit` | Static OWASP Top 10 audit |
| `/dc:poc` | Proof of Concept with timebox and clear criteria |

### Session and context

| Command | What it does |
|---------|-------------|
| `/dc:continue` | Recover your previous session without losing context |
| `/dc:status` | Show current project status |
| `/dc:doctor` | Diagnose and repair framework issues |
| `/dc:capture` | Capture ideas without interrupting your flow |
| `/dc:migrate` | Plan migration between stacks (Vue→React, JS→TS...) |
| `/dc:update` | Update Don Cheli to the latest version |

<details>
<summary><strong>Reasoning models (15)</strong></summary>

| Command | What it does |
|---------|-------------|
| `/razonar:primeros-principios` | Decompose to fundamental truths |
| `/razonar:5-porques` | Iterative root cause analysis |
| `/razonar:pareto` | 80/20 focus |
| `/razonar:inversion` | Solve in reverse: how do I guarantee failure? |
| `/razonar:segundo-orden` | Consequences of consequences |
| `/razonar:pre-mortem` | Anticipate failures before they happen |
| `/razonar:minimizar-arrepentimiento` | Jeff Bezos framework |
| `/razonar:costo-oportunidad` | Evaluate sacrificed alternatives |
| `/razonar:circulo-competencia` | Know the limits of knowledge |
| `/razonar:mapa-territorio` | Model vs reality |
| `/razonar:probabilistico` | Reason in probabilities, not certainties |
| `/razonar:reversibilidad` | Can this decision be undone? |
| `/razonar:rlm-verificacion` | Verification with fresh sub-LLMs |
| `/razonar:rlm-cadena-pensamiento` | Multi-step Context Folding |
| `/razonar:rlm-descomposicion` | Divide and conquer with subagents |

</details>

> **📖 Want to see all commands in action with interactive examples?**
> Visit the full guide: **[doncheli.tv/comousar.html](https://doncheli.tv/comousar.html)**

---

## Killer Features

### Drift Detection — Architecture Watchdog

Detects when code diverges from specifications. If code changes but specs don't, you get an immediate alert:

```
⚠️ DRIFT ALERT: Architecture Compromised
  File changed:   src/services/auth.ts (line 45-67)
  Spec affected:  specs/auth/login.feature:23
  Scenario:       "Login with MFA via TOTP"
  Drift:          MFA logic removed, spec still requires it
  Severity:       🔴 CRITICAL
```

```bash
/dc:drift                    # Full project scan
/dc:drift --watch            # Activate async watcher
```

### Time Travel — Reasoning Debugger

See **why** the framework chose each model, skill and decision. Navigate the reasoning history like a timeline:

```
10:15 ─── /dc:start ──────────────────
│  D001: Level detected → 2 (Standard)
│  Model: sonnet (confidence: 85%)
│  Discarded: N1 (>3 files), N3 (1 module)
│
10:22 ─── /dc:specify ────────────────
│  D003: Reasoning → /razonar:pre-mortem
│  Reason: Payment feature (high risk)
│  Model: sonnet → opus (escalated by complexity)
```

```bash
/dc:time-travel              # Full session timeline
/dc:time-travel --adjust     # Tune model thresholds dynamically
```

### Pre-Flight — Cost Simulator

Know **exactly** how much a phase will cost BEFORE executing:

```
┌──────────────────────────────────────────────────┐
│  Fase            │ Tokens   │ Model   │ Cost     │
├──────────────────┼──────────┼─────────┼──────────┤
│  Implement       │ ~45,000  │ sonnet  │ $0.27    │
│  Review          │ ~18,000  │ opus    │ $0.54    │
│  TOTAL           │ ~63,000  │ mixed   │ $0.81    │
└──────────────────┴──────────┴─────────┴──────────┘
✅ Within budget ($0.81 < $5.00)
```

```bash
/dc:preflight                # Estimate pending phases
/dc:preflight --budget 5.00  # Alert if exceeds $5
```

---

## Multi-platform

Don Cheli is not a program. It's Markdown files that any AI agent can interpret.

| Platform | Support | Instruction file |
|----------|---------|------------------|
| **Claude Code** | Full native | `CLAUDE.md` |
| **Google Antigravity** | Native with 5 skills + 4 workflows | `GEMINI.md` |
| **Cursor** | Via universal contract | `AGENTS.md` |
| **Codex** | Via universal contract | `AGENTS.md` |
| **Warp** | Compatible | `CLAUDE.md` |
| **Amp** | Compatible | `prompt.md` |
| **Continue.dev** | Compatible | `AGENTS.md` |
| **OpenCode** | Compatible | `AGENTS.md` |

---

## CI/CD Integration

Enforce quality gates on every Pull Request with one line:

```yaml
# .github/workflows/sdd-check.yml
- uses: doncheli/don-cheli-sdd@main
  with:
    gates: all          # spec, tdd, coverage, owasp, custom
    min-coverage: 85
    comment-pr: true    # posts results as PR comment
```

The action verifies `.dc/` artifacts, TDD compliance, coverage, OWASP and custom gates. [Full CI/CD docs →](docs/ci-cd.md) | [GitLab CI template →](examples/ci/gitlab-ci.yml)

---

## Custom Quality Gates

Define your own rules in `.dc/gates/` as simple YAML files:

```yaml
# .dc/gates/no-console-log.yml
name: No console.log in production
type: grep
pattern: "console\\.log"
files: "src/**/*.ts"
severity: block
```

5 gates included out of the box. Create your own with `/dc:gate create`. [Custom Gates docs →](docs/custom-gates.md)

---

## Telemetry & Dashboard

100% local metrics. No data leaves your machine.

```bash
/dc:metrics             # Summary in terminal
/dc:dashboard           # Interactive HTML dashboard
/dc:dashboard --csv     # Export for corporate reporting
```

Tracks: TDD success rate, coverage trend, quality gates pass rate, estimation accuracy, stubs detected, OWASP findings. [Telemetry docs →](docs/telemetry.md)

---

## SDD Certification

Show that your project was built with engineering discipline. Add these badges to your README:

```markdown
[![SDD Certified](https://img.shields.io/badge/SDD_Certified-Don_Cheli-6c5ce7?style=for-the-badge)](https://github.com/doncheli/don-cheli-sdd)
[![TDD](https://img.shields.io/badge/TDD-Iron_Law_Enforced-00cec9?style=for-the-badge)](https://github.com/doncheli/don-cheli-sdd)
[![OWASP](https://img.shields.io/badge/OWASP-Audited_by_Don_Cheli-e17055?style=for-the-badge)](https://github.com/doncheli/don-cheli-sdd)
```

[![SDD Certified](https://img.shields.io/badge/SDD_Certified-Don_Cheli-6c5ce7?style=for-the-badge)](https://github.com/doncheli/don-cheli-sdd) [![TDD](https://img.shields.io/badge/TDD-Iron_Law_Enforced-00cec9?style=for-the-badge)](https://github.com/doncheli/don-cheli-sdd) [![OWASP](https://img.shields.io/badge/OWASP-Audited_by_Don_Cheli-e17055?style=for-the-badge)](https://github.com/doncheli/don-cheli-sdd)

[Full certification criteria →](docs/certification.md)

---

## Philosophy

> **"Context Window = RAM, File System = Disk"**

1. **Persistence over conversation** — Write it down, don't just say it
2. **Structure over chaos** — Clear files, clear roles
3. **Recovery over restart** — Never lose progress
4. **Evidence over assertions** — Show, don't tell
5. **Simplicity over complexity** — Everything in your language

---

## Community & Support

- [GitHub Discussions](https://github.com/doncheli/don-cheli-sdd/discussions) — Questions and proposals
- [GitHub Issues](https://github.com/doncheli/don-cheli-sdd/issues) — Bugs and feature requests
- [YouTube @doncheli](https://youtube.com/@doncheli) — Tutorials and demos
- [Instagram @doncheli.tv](https://instagram.com/doncheli.tv) — News
- [doncheli.tv](https://doncheli.tv) — Full web documentation

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

---

## License

[Apache 2.0](LICENSE) — Copyright 2026 Jose Luis Oronoz Troconis (@DonCheli)

---

<p align="center">
  <strong>Stop guessing. Start engineering.</strong><br/><br/>
  <a href="https://doncheli.tv/comousar.html"><img src="https://img.shields.io/badge/📖_Full_Guide-doncheli.tv-6c5ce7?style=for-the-badge" alt="Guide"></a>
  <a href="https://github.com/doncheli/don-cheli-sdd"><img src="https://img.shields.io/badge/⭐_Star_on-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub"></a>
  <br/><br/>
  <sub>Made with ❤️ in Latin America — Don Cheli SDD Framework</sub>
</p>

> 🌐 Read this in other languages: [English](README.md) | [Español](README.es.md) | [Português](README.pt.md)

<p align="center">
  <h1 align="center">Don Cheli — SDD Framework</h1>
  <p align="center">
    <strong>Stop guessing. Start Engineering.</strong><br/>
    <sub>Vibe coding is the spark; SDD is the engine. Transition from AI-assisted chaos to professional software delivery.</sub>
  </p>
  <p align="center">
    The first AI-assisted development framework made in and for Latin America.<br/>
    The most comprehensive SDD framework on the market. Open source. Multilingual (ES/EN/PT).
  </p>
  <p align="center">
    <a href="#-installation"><img src="https://img.shields.io/badge/install-1_minute-brightgreen" alt="Install"></a>
    <img src="https://img.shields.io/badge/version-1.14.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/license-Apache%202.0-green" alt="License">
    <img src="https://img.shields.io/badge/languages-ES%20|%20EN%20|%20PT-red" alt="Languages">
    <img src="https://img.shields.io/badge/commands-85+-purple" alt="Commands">
    <img src="https://img.shields.io/badge/skills-43+-orange" alt="Skills">
    <img src="https://img.shields.io/badge/Anthropic%20Skills%202.0-compatible-blueviolet" alt="Skills 2.0">
    <br/>
    <a href="https://github.com/doncheli/don-cheli-sdd/actions/workflows/validar.yml"><img src="https://github.com/doncheli/don-cheli-sdd/actions/workflows/validar.yml/badge.svg" alt="CI"></a>
    <a href="https://www.npmjs.com/package/don-cheli-sdd"><img src="https://img.shields.io/npm/v/don-cheli-sdd" alt="npm"></a>
    <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-view-blue" alt="Changelog"></a>
    <img src="https://img.shields.io/github/last-commit/doncheli/don-cheli-sdd" alt="Last Commit">
    <img src="https://img.shields.io/github/contributors/doncheli/don-cheli-sdd" alt="Contributors">
  </p>
</p>

---

## Quick Demo

<p align="center">
  <img src="demo.gif" alt="Don Cheli Demo" width="800"/>
</p>

> **How does Don Cheli look in action?**
>
> Start a task with automatic complexity detection:
> ```
> /dc:start Implement JWT authentication with refresh tokens
> ```
> Don Cheli detects **Level 2 (Standard)**, generates the Gherkin spec,
> proposes the technical blueprint, breaks down into TDD tasks and executes in Docker.
> No vibe coding. With evidence.

---

## In Action

```bash
# Without Don Cheli:
"Claude, build me a users API"
# → Code without tests → broken in production

# With Don Cheli (one command):
/dc:start "Users API with JWT auth"
# → Spec → Tests first → Code → Review → Done with evidence
```

---

## The Problem

You start a project with AI. The first 2 hours go well. Then:

- **Context rot** — Claude forgets your architecture decisions
- **Silent stubs** — It says "I implemented the service" but the code says `// TODO`
- **No verification** — Does it work? I don't know. Tests? No. Can I deploy? Hopefully

That is **vibe coding**. And it is the enemy of quality software.

## The Solution

**Don Cheli** transforms chaos into a structured process:

```
Specify → Clarify → Plan → Break Down → Implement → Review
```

Each step has **quality gates**. You don't advance without meeting them. Code is generated with **mandatory TDD**, **stub detection**, and **7-dimension peer review**.

---

## Why Don Cheli

<table>
<tr><th></th><th><a href="https://github.com/bmad-code-org/BMAD-METHOD">BMAD</a><br/><sub>42K ⭐</sub></th><th><a href="https://github.com/gsd-build/get-shit-done">GSD</a><br/><sub>39K ⭐</sub></th><th><a href="https://github.com/gsd-build/gsd-2">GSD-2</a><br/><sub>3K ⭐</sub></th><th><a href="https://github.com/github/spec-kit">spec-kit</a><br/><sub>82K ⭐</sub></th><th><strong>✨ Don Cheli</strong></th></tr>
<tr><td>Commands</td><td>~20</td><td>~80</td><td>~40</td><td>~10</td><td><strong>85+</strong></td></tr>
<tr><td>Skills</td><td>~15</td><td>~15</td><td>~10</td><td>~6</td><td><strong>43</strong></td></tr>
<tr><td>Reasoning models</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>15</strong></td></tr>
<tr><td>Automatic estimates</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>4 models</strong></td></tr>
<tr><td>Formal quality gates</td><td>—</td><td>1</td><td>2</td><td>4</td><td><strong>6</strong></td></tr>
<tr><td>Mandatory TDD</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>Iron Law</strong></td></tr>
<tr><td>PoC Mode</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>OWASP Audit</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Stack Migration</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Worktree isolation</td><td>—</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Crash recovery</td><td>—</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Cost tracking</td><td>—</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Stuck detection</td><td>—</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Stub detection</td><td>—</td><td>✅</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>UI Contracts</td><td>—</td><td>✅</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Nyquist Validation</td><td>—</td><td>✅</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Multilingual (ES/EN/PT)</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Anthropic Skills 2.0</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅ Compatible</strong></td></tr>
<tr><td>Skill Creator (meta-skill)</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Skills Marketplace</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Multi-platform (Cursor, Antigravity)</td><td>—</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
</table>

<sub>Data verified on 2026-03-27. Star counts are approximate.</sub>

### 20 things only Don Cheli has

1. **15 reasoning models** — Pre-mortem, 5 Whys, Pareto, RLM
2. **4 estimation models** — Function Points, AI Planning Poker, COCOMO, Historical
3. **PoC Mode** — Validate ideas with timebox and success criteria before committing
4. **Blueprint Distillation** — Extract specs from existing code (behavioral reverse engineering)
5. **CodeRAG** — Index reference repos and retrieve relevant patterns
6. **OWASP Audit** — Static security scanning integrated into the pipeline
7. **Stack Migration** — Vue→React, JS→TS with wave plan and equivalences
8. **API Contracts** — REST/GraphQL with retries, circuit breaker, idempotency
9. **SOLID Refactoring** — Checklist, metrics, structured design patterns
10. **Living Documentation** — ADRs, auto-generated OpenAPI, Mermaid diagrams
11. **Captures & Triage** — Annotate ideas without pausing work, automatic classification into 5 categories
12. **Auto-generated UAT** — Human-executable acceptance scripts after each feature
13. **Doctor** — Diagnosis and auto-repair of git, framework, and environment
14. **Skill Creator** — Iterative meta-skill: generate → test → evaluate → improve skills automatically
15. **Skills Marketplace** — Install skills from official Anthropic, community, or create your own
16. **Project Constitution** — Immutable pre-spec principles validated at every quality gate
17. **Formal Pseudocode** — Technology-agnostic logic reasoning phase between spec and plan (SPARC)
18. **Multi-layer Spec Validation** — 8 checks (implementation leakage, measurability, completeness, constitution adherence)
19. **Adversarial Multi-role Debate** — PM vs Architect vs QA with explicit tensions and mandatory objections
20. **Scale-adaptive Planning** — Planning level adjusts to complexity (same process for 1 file ≠ 100 files)

---

## Use Cases

| Project type | Recommended level | Impact |
|---|---|---|
| REST API with auth | Level 2 | ~40% fewer bugs on first delivery |
| Vue→React migration | `/dc:migrate` | Automatic plan in 10 min |
| Startup PoC | PoC Mode | Validated in 2-4h with clear criteria |
| Security audit | `/dc:security-audit` | OWASP Top 10 in < 5 min |
| Legacy refactoring | SOLID + Blueprint Distillation | Spec from code with no documentation |
| Weekly team planning | `/dc:planning` | RFCs + WSJF + squad assignment |

---

## Visual Pipeline

```mermaid
flowchart LR
    A["📋 SPECIFY\nGherkin + DBML"] -->|Gate 1| B["🔍 CLARIFY\nAuto-QA"]
    B -->|Gates 2+3| C["🏗️ PLAN\nBlueprint"]
    C -->|Gate 4| D["📦 BREAKDOWN\nTDD Tasks"]
    D -->|Gate 5| E["⚙️ IMPLEMENT\nRED→GREEN→REFACTOR"]
    E -->|Gate 6| F["✅ REVIEW\n7 dimensions"]
    F -->|Fail| E

    style A fill:#4A90D9,color:#fff
    style B fill:#7B68EE,color:#fff
    style C fill:#50C878,color:#fff
    style D fill:#FF8C00,color:#fff
    style E fill:#DC143C,color:#fff
    style F fill:#228B22,color:#fff
```

---

## Installation

```bash
# 1. Clone
git clone https://github.com/doncheli/don-cheli-sdd.git

# 2. Install globally
cd don-cheli-sdd && bash scripts/instalar.sh --global

# 3. In any project, initialize
/dc:init
```

### Language Selection

The **first** thing you see after installing is the language selector:

```
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║           🏗️  Don Cheli — SDD Framework                   ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝

  🌍 Selecciona tu idioma / Select your language / Selecione seu idioma

     1)  🇪🇸  Español
     2)  🇬🇧  English
     3)  🇧🇷  Português

  ▸ _
```

Once selected, **the entire framework adapts to the chosen language**: folders, files, templates, messages, and Claude's communication.

### Structure by Language

The installation creates folders with names in the selected language:

<table>
<tr><th>Content</th><th>🇪🇸 Español</th><th>🇬🇧 English</th><th>🇧🇷 Português</th></tr>
<tr><td>Skills</td><td><code>habilidades/</code></td><td><code>skills/</code></td><td><code>habilidades/</code></td></tr>
<tr><td>Rules</td><td><code>reglas/</code></td><td><code>rules/</code></td><td><code>regras/</code></td></tr>
<tr><td>Templates</td><td><code>plantillas/</code></td><td><code>templates/</code></td><td><code>modelos/</code></td></tr>
<tr><td>Hooks</td><td><code>ganchos/</code></td><td><code>hooks/</code></td><td><code>ganchos/</code></td></tr>
<tr><td>Agents</td><td><code>agentes/</code></td><td><code>agents/</code></td><td><code>agentes/</code></td></tr>
</table>

Project files (`.especdev/`) are also created in the configured language:

<table>
<tr><th>File</th><th>🇪🇸 Español</th><th>🇬🇧 English</th><th>🇧🇷 Português</th></tr>
<tr><td>Status</td><td><code>estado.md</code></td><td><code>status.md</code></td><td><code>estado.md</code></td></tr>
<tr><td>Findings</td><td><code>hallazgos.md</code></td><td><code>findings.md</code></td><td><code>descobertas.md</code></td></tr>
<tr><td>Plan</td><td><code>plan.md</code></td><td><code>plan.md</code></td><td><code>plano.md</code></td></tr>
<tr><td>Progress</td><td><code>progreso.md</code></td><td><code>progress.md</code></td><td><code>progresso.md</code></td></tr>
<tr><td>Proposal</td><td><code>propuesta.md</code></td><td><code>proposal.md</code></td><td><code>proposta.md</code></td></tr>
</table>

The language is persisted in `locale` and `folder-map.json` so Claude knows exactly which files to look for. To change language, simply reinstall:

```bash
bash scripts/instalar.sh --global
```

<details>
<summary>Remote installation (without cloning)</summary>

The installer automatically downloads the repository when run via pipe:

```bash
# Interactive (prompts for language)
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global

# Non-interactive (set language directly)
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global --lang en
```

Available languages: `es` (Español), `en` (English), `pt` (Português)

### Via npx

```bash
npx don-cheli-sdd init
```

### Verified installation (recommended for security)

```bash
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh \
  -o instalar.sh
cat instalar.sh  # Review before executing
bash instalar.sh --global
```
</details>

**Requirements:** Claude Code (or compatible AI agent) + Git

---

## Quick Start — Zero to productive in 2 minutes

**Step 1:** Install (1 min)
```bash
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global --lang en
```

**Step 2:** Use (1 command)

**You only need one command to start:**

```bash
/dc:start "Implement JWT authentication"
```

That's it. Don Cheli will:
1. Auto-detect the complexity level of your task
2. Generate a Gherkin spec with acceptance criteria
3. Write tests BEFORE the code (TDD iron law)
4. Implement the minimum code to pass
5. Run a 7-dimension peer review

You don't need to memorize 72 commands. Just `/dc:start` and follow the prompts.

<details>
<summary>Want more control? Use individual pipeline commands</summary>

```bash
/dc:specify    # Gherkin spec + DBML schema
/dc:clarify    # Auto-QA + resolve ambiguities
/dc:tech-plan  # Blueprint + constitution check
/dc:breakdown  # TDD tasks with parallelism
/dc:implement  # RED → GREEN → REFACTOR
/dc:review     # 7-dimension peer review
```

</details>

<details>
<summary>Complexity levels (auto-detected, no action needed)</summary>

| Level | Name | When |
|-------|------|------|
| **0** | Atomic | 1 file, < 30 min |
| **P** | PoC | Validate viability (2-4h timebox) |
| **1** | Micro | 1-3 files, known solution |
| **2** | Standard | Multiple files, 1-3 days |
| **3** | Complex | Multi-module, 1-2 weeks |
| **4** | Product | New system, 2+ weeks |

</details>

---

## The 3 Iron Laws

Non-negotiable. Always applied.

| Law | Principle | In practice |
|-----|-----------|-------------|
| **TDD** | All code requires tests | RED → GREEN → REFACTOR, no exceptions |
| **Debugging** | Root cause first | Reproduce → Isolate → Understand → Fix → Verify |
| **Verification** | Evidence before assertions | "Tests pass" > "I think it works" |

---

## Anthropic Skills 2.0

Don Cheli is **100% compatible** with the [Anthropic Skills](https://github.com/anthropics/skills) ecosystem. It supports both skill formats:

| Format | File | Usage |
|--------|------|-------|
| **Anthropic** | `SKILL.md` | Compatible with the official marketplace |
| **Don Cheli** | `HABILIDAD.md` | Extended format with version, tags, freedom degree |

### Skill Creator

Create skills without writing a single line of YAML:

```bash
/dc:create-skill "Weekly team report generator"
```

5 iterative phases: **Discover** → **Generate** SKILL.md → **Test** with real prompt → **Evaluate** quality → **Iterate** until optimal.

### Skills Marketplace

Install skills from the official Anthropic marketplace or from the community:

```bash
/dc:marketplace --install document-skills --source anthropic
/dc:marketplace --search "weekly report"
```

Supported sources: [Anthropic Official](https://github.com/anthropics/skills) • [skillsmp.com](https://skillsmp.com/) • [aitmpl.com](https://www.aitmpl.com/skills) • Don Cheli built-in (42 skills)

### Progressive Disclosure

Skills use a 3-layer design for maximum token efficiency:

```
Layer 1: Metadata (YAML)     → ~20 tokens per skill, always in context
Layer 2: Body (Markdown)     → Loaded only when the skill is activated
Layer 3: File References     → Loaded on demand within the body
```

This allows having dozens of skills without impacting the context window.

---

## Commands (85+)

> **Backward compatible:** All `/dc:*` commands are also available as `/especdev:*` for backward compatibility.

<details>
<summary><strong>Main (32)</strong></summary>

| Command | Description |
|---------|-------------|
| `/dc:init` | Initialize in a project |
| `/dc:start` | Start task (auto-detects level) |
| `/dc:quick` | Fast mode (Level 1) |
| `/dc:poc` | Proof of Concept with timebox |
| `/dc:full` | Full mode (Level 3) |
| `/dc:status` | Current status |
| `/dc:diagnostic` | Setup health check |
| `/dc:doctor` | Diagnosis and auto-repair of git, framework, and environment |
| `/dc:continue` | Recover previous session |
| `/dc:reflect` | Self-reflection (+8-21% quality) |
| `/dc:capture` | Fire-and-forget ideas with automatic triage |
| `/dc:uat` | Auto-generated acceptance scripts per feature |
| `/dc:agent` | Load specialized agent |
| `/dc:roundtable` | Multi-perspective discussion (CPO, UX, Business) |
| `/dc:tech-panel` | Senior dev experts table (Tech Lead, Backend, Frontend, Architect, DevOps) |
| `/dc:planning` | Weekly team planning: RFC review, WSJF prioritization, pair/squad assignment |
| `/dc:estimate` | Development estimates |
| `/dc:distill` | Extract specs from code |
| `/dc:mine-refs` | Search reference repos |
| `/dc:ui-contract` | UI design contracts |
| `/dc:api-contract` | API/webhook contracts |
| `/dc:security-audit` | OWASP Top 10 audit |
| `/dc:migrate` | Stack migration |
| `/dc:reverse` | Architecture reverse engineering |
| `/dc:explore` | Explore codebase (assumptions mode) |
| `/dc:propose` | Change proposal |
| `/dc:analyze-sessions` | Usage pattern analysis |
| `/dc:present` | Generate interactive HTML presentation |
| `/dc:create-skill` | Create skills iteratively (Anthropic Skills 2.0 compatible) |
| `/dc:marketplace` | Install skills from Anthropic, community, or built-in |
| `/dc:pseudocode` | Technology-agnostic logic between spec and plan (SPARC) |
| `/dc:validate-spec` | Multi-layer spec validation (8 checks, BMAD-inspired) |
| `/dc:debate` | Adversarial multi-role deliberation (PM vs Architect vs QA) |
| `/dc:update` | Detect and apply framework updates |
</details>

<details>
<summary><strong>Gherkin Pipeline (5)</strong></summary>

| Command | Description |
|---------|-------------|
| `/dc:specify` | Gherkin spec with P1/P2/P3+ priorities |
| `/dc:clarify` | Auto-QA + schema-spec verification |
| `/dc:tech-plan` | Blueprint + constitution check |
| `/dc:breakdown` | TDD tasks with `[P]` markers |
| `/dc:review` | 7-dimension peer review |
</details>

<details>
<summary><strong>Reasoning (15)</strong></summary>

| Command | What it does |
|---------|-------------|
| `/razonar:first-principles` | Decompose to fundamentals |
| `/razonar:5-whys` | Root cause analysis |
| `/razonar:pareto` | 80/20 focus |
| `/razonar:inversion` | Solve in reverse |
| `/razonar:second-order` | Consequences of consequences |
| `/razonar:pre-mortem` | Anticipate failures |
| `/razonar:minimize-regret` | Long-term decisions |
| `/razonar:opportunity-cost` | Evaluate alternatives |
| `/razonar:circle-of-competence` | Know your limits |
| `/razonar:map-territory` | Model vs reality |
| `/razonar:probabilistic` | Reason in probabilities |
| `/razonar:reversibility` | Can it be undone? |
| `/razonar:rlm-verification` | Verification with sub-LLMs |
| `/razonar:rlm-chain-of-thought` | Multi-step reasoning |
| `/razonar:rlm-decomposition` | Divide and conquer |
</details>

---

## Skills (42)

| Category | Skills |
|----------|--------|
| **Quality** | Iron Laws, Nyquist Validation, Stub detection, Loop detection, Quality gates, Proof of work, Progressive rigor |
| **Context** | Context engineering, Context optimizer, Persistent memory (Engram), CodeRAG + LightRAG, Code reference mining |
| **Reasoning** | 12 mental models, 3 RLM models (PrimeIntellect) |
| **Architecture** | Living architectural map, SOLID Refactoring, DBML Schemas |
| **Design** | UI/UX Design System (67 styles, 161 palettes), UI Contracts, HTML Presentations |
| **Documentation** | Living documentation (ADRs, OpenAPI), DevLog, Traceability, Delta specs, Obsidian |
| **Autonomy** | Autonomous orchestration, Auto-correction, Session recovery |
| **Discovery** | Structured brainstorming, Git Worktrees |
| **Efficiency** | Token optimization, Token accounting, Subagent development, **Dynamic model routing**, **Cost projections** |
| **Observability** | **Skill health** (success rate and consumption telemetry per skill) |
| **Security** | Permissions and security, OWASP Audit |
| **Integration** | MCP servers, Extensions and presets |

---

Each gate blocks progress if criteria are not met. **No shortcuts.**

---

## 7 specialized agents

| Agent | Model | Role |
|-------|-------|------|
| `planner` | opus | Decomposition and planning |
| `architect` | opus | System design |
| `executor` | sonnet | Code implementation |
| `reviewer` | opus | Architectural code review |
| `tester` | sonnet | Testing and QA |
| `documenter` | haiku | Documentation |
| `estimator` | opus | Effort estimates |

```bash
/dc:agent planner
/dc:roundtable "Monolith or microservices?"
/dc:tech-panel "Redis or Memcached for session caching?"
/dc:planning --team "Ana,Carlos,Luis" --week "2026-03-24"
```

---

## PoC Mode

Validate ideas before committing to implementation:

```bash
/dc:poc --hypothesis "SQLite is sufficient for the MVP"
```

| Phase | What |
|-------|------|
| **Hypothesis** | Define what to validate and success/failure criteria |
| **Build** | Throwaway code, relaxed rules, no TDD |
| **Evaluate** | Results vs criteria with evidence |
| **Verdict** | VIABLE / WITH RESERVATIONS / NOT VIABLE / INCONCLUSIVE |

If viable → `/dc:poc --graduate` → full pipeline.

---

## Automatic Estimates

```bash
/dc:estimate docs/prd.md
```

4 complementary models:

| Model | Technique |
|-------|-----------|
| **Function Points** | Functional complexity |
| **AI Planning Poker** | 3 agents estimate independently |
| **COCOMO** | Estimated LOC → effort |
| **Historical** | Comparison with similar tasks |

Output: optimistic, expected, and pessimistic estimate with breakdown by feature.

---

## Security Audit

```bash
/dc:security-audit
```

Scans all 10 OWASP categories:

- **A01** Broken Access Control — endpoints without auth, IDOR, CORS
- **A02** Cryptographic Failures — passwords in plaintext, JWT without expiration
- **A03** Injection — SQL, XSS, command injection
- **A04-A10** — Configuration, vulnerable components, logging

Each finding includes severity, file, line, and suggested fix.

---

## Stack Migration

```bash
/dc:migrate --from "Vue 3" --to "React 19"
```

6 phases: Inventory → Equivalences → Strategy → Plan → Execution → Verification

Supports: framework (Vue→React), version (Next 14→15), language (JS→TS), paradigm (REST→GraphQL).

---

## Supported Platforms

Don Cheli works natively with multiple AI agents and IDEs. All content adapts to the installed language (ES/EN/PT).

<details>
<summary><strong>Claude Code — Full support (85+ commands, 43 skills)</strong></summary>

### What you get
- `CLAUDE.md` — Framework instructions (translated to installed language)
- 85+ slash commands via `/dc:*` (translated names per locale)
- `/especdev:*` — Backward-compatible alias
- `/razonar:*` — 15 reasoning models
- 43 modular skills in `habilidades/` (or `skills/` in EN)
- 7 specialized agents (planner, architect, executor, reviewer, tester, documenter, estimator)
- Full i18n: folder names, file content, rules, commands — all in your language

### Commands
```bash
/dc:start "Implement JWT auth"       # Start task (auto-detect complexity)
/dc:specify                           # Gherkin spec + DBML
/dc:implement                         # TDD: RED → GREEN → REFACTOR
/dc:debate "Monolith vs microservices" # Adversarial multi-role debate
/dc:estimate docs/prd.md             # 4 estimation models
/razonar:pre-mortem                   # Anticipate failures
```

### Limitations
None. Claude Code is the primary platform with full feature access.

</details>

<details>
<summary><strong>Google Antigravity (Gemini 3.1) — 14 skills, 9 workflows</strong></summary>

### What you get
- `GEMINI.md` — Adapted instructions with Gemini model routing (Flash/Pro) — translated to installed language
- 14 skills in `.agent/skills/` loaded via semantic matching
- 9 workflows in `.agent/workflows/` as slash commands
- `doncheli-skills` meta-router for access to all 43 habilidades
- Model routing: Gemini 3 Flash (default) → Gemini 3.1 Pro (complex tasks)

### Skills (14)
| Skill | What it does |
|-------|-------------|
| `@doncheli-spec` | Gherkin BDD specifications |
| `@doncheli-plan` | Technical blueprint |
| `@doncheli-implement` | TDD execution (RED-GREEN-REFACTOR) |
| `@doncheli-review` | 7-dimension peer review |
| `@doncheli-security` | OWASP Top 10 audit |
| `@doncheli-estimate` | 4 estimation models |
| `@doncheli-debate` | Adversarial multi-role debate |
| `@doncheli-reasoning` | 15 reasoning models |
| `@doncheli-migrate` | Stack migration with wave plan |
| `@doncheli-distill` | Blueprint Distillation |
| `@doncheli-planning` | Weekly team planning |
| `@doncheli-tech-panel` | Senior dev expert table |
| `@doncheli-api-contract` | API/webhook contract design |
| `@doncheli-skills` | Router to all 43 habilidades |

### Workflows
```bash
/doncheli-start          # Init or start task
/doncheli-pipeline       # Full spec→review pipeline
/doncheli-estimate       # Run 4 estimation models
/doncheli-debate         # Launch adversarial debate
/doncheli-reasoning      # Apply reasoning model
/doncheli-migrate        # Plan stack migration
/doncheli-planning       # Weekly team planning
/doncheli-review         # Standalone review
/doncheli-security       # Standalone security audit
```

### Limitations
- No direct access to `/dc:*` slash commands (use workflows and `@skills` instead)
- Skills are invoked via semantic matching, not explicit command names
- Some advanced features (doctor, capture, guardian) require using the `@doncheli-skills` router

</details>

<details>
<summary><strong>Cursor IDE — Full command reference (.cursorrules)</strong></summary>

### What you get
- `.cursorrules` — Comprehensive instructions (115 lines) — translated to installed language
- All `/dc:*` commands documented with descriptions
- All `/razonar:*` reasoning models documented
- 6 quality gates, complexity levels, pipeline reference
- Iron laws enforced

### How to use
Commands work as prompts in Cursor's AI chat:
```
/dc:start "Implement JWT auth"
/dc:specify
/dc:implement
/razonar:pre-mortem "What could go wrong with this migration?"
```

### Limitations
- Commands are prompt-based (not native slash commands like in Claude Code)
- No `.agent/skills/` semantic matching (Cursor doesn't support Antigravity's skill format)
- No specialized agents (planner, architect, etc.) — Cursor uses a single model
- Skills/habilidades must be referenced manually, not auto-loaded

</details>

<details>
<summary><strong>Other agents (Codex, Amp, etc.)</strong></summary>

### What you get
- `AGENTS.md` — Cross-tool instructions
- `prompt.md` — Minimal generic instructions for any AI agent
- All rules and habilidades are standard Markdown — any agent can read them

### How to use
Point your agent to read `CLAUDE.md` or `prompt.md` at the start of a session. The framework's files are standard Markdown, so any agent that can read files can use Don Cheli.

### Limitations
- No native slash command integration
- No semantic skill matching
- Manual workflow — you need to tell the agent which files to read
- No model routing optimization

</details>

---

## Project Structure

```
don-cheli/
├── comandos/
│   ├── especdev/          # 53 /dc:* commands
│   └── razonar/           # 15 /razonar:* commands
├── habilidades/           # 42 modular skills
├── reglas/
│   ├── constitucion.md    # 8 governing principles
│   ├── leyes-hierro.md    # 3 non-negotiable laws
│   ├── puertas-calidad.md # 6 quality gates
│   ├── i18n.md            # Internationalization rules
│   ├── skills-best-practices.md  # Anthropic Skills 2.0 best practices
│   └── reglas-trabajo-globales.md
├── locales/               # 🌍 i18n strings
│   ├── es.json            # Spanish (158 strings)
│   ├── en.json            # English (158 strings)
│   └── pt.json            # Portuguese (158 strings)
├── plantillas/
│   └── especdev/
│       ├── es/            # Templates in Spanish
│       ├── en/            # Templates in English
│       └── pt/            # Templates in Portuguese
├── agentes/               # 7 specialized agents
├── ganchos/               # Pre/Post tool + Stop hooks
├── scripts/               # instalar.sh, bucle.sh, validar.sh
├── .agent/                # 🔮 Antigravity/Gemini compatibility
│   ├── skills/            # 14 skills (spec, plan, implement, review, security, estimate, debate, reasoning, migrate, distill, planning, tech-panel, api-contract, skills-router)
│   └── workflows/         # 9 workflows (start, pipeline, review, security, estimate, debate, reasoning, migrate, planning)
├── CLAUDE.md              # Instructions for Claude Code
├── GEMINI.md              # Instructions for Google Antigravity
├── AGENTS.md              # Cross-tool instructions (Cursor, Codex)
├── prompt.md              # Instructions for Amp
├── NOTICE                 # Attributions
└── LICENCIA               # Apache 2.0
```

After installing with a language, the installed structure uses localized names:

```
~/.claude/don-cheli/          # Global installation
├── skills/                   # (or habilidades/ in ES, habilidades/ in PT)
├── rules/                    # (or reglas/ in ES, regras/ in PT)
├── templates/                # (or plantillas/ in ES, modelos/ in PT)
├── hooks/                    # (or ganchos/ in ES/PT)
├── agents/                   # (or agentes/ in ES/PT)
├── locales/                  # es.json, en.json, pt.json
├── locale                    # 2-letter file: "es", "en" or "pt"
├── folder-map.json           # Name mapping for Claude
├── CLAUDE.md
└── VERSION
```

---

## Philosophy

> **"Context Window = RAM, File System = Disk"**

1. **Persistence over conversation** — Write it down, don't just say it
2. **Structure over chaos** — Clear files, clear roles
3. **Recovery over restart** — Never lose progress
4. **Evidence over assertions** — Show, don't tell
5. **Simplicity over complexity** — Everything in your language

---

## Contributing

See [CONTRIBUTING](CONTRIBUIR.md) for the complete guide.

```bash
# Fork → Clone → Branch → Changes → PR
git checkout -b feature/my-improvement
```

---

## Community & Support

| Channel | Purpose |
|---|---|
| [GitHub Discussions](https://github.com/doncheli/don-cheli-sdd/discussions) | Questions, ideas, show & tell |
| [GitHub Issues](https://github.com/doncheli/don-cheli-sdd/issues) | Bugs and feature requests |
| [YouTube @doncheli](https://youtube.com/@doncheli) | Tutorials and video demos |
| [Instagram @doncheli.tv](https://instagram.com/doncheli.tv) | Updates and quick tips |

### Found a bug?
1. Search [existing issues](https://github.com/doncheli/don-cheli-sdd/issues)
2. If it doesn't exist, open one with the bug report template
3. Include: framework version, AI agent, and steps to reproduce

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full history of changes.

---

## License

[Apache 2.0](LICENCIA) — Copyright 2026 Jose Luis Oronoz Troconis (@DonCheli)

You may use, modify, and distribute Don Cheli freely. You must maintain attribution to the original author and indicate any changes made.

---

<p align="center">
  <strong>Stop guessing. Start Engineering.</strong><br/>
    <sub>Vibe coding is the spark; SDD is the engine. Transition from AI-assisted chaos to professional software delivery.</sub><br/>
  <sub>Don Cheli — SDD Framework</sub>
</p>

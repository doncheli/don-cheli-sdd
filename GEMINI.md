# Don Cheli — Instructions for Google Antigravity

## Identity

You are a development assistant operating under the Don Cheli framework (Specification-Driven Development). All your work follows the lifecycle phases and iron laws of the framework.

## Context Files

On startup, read these files in order:
1. `.especdev/config.yaml` — Project configuration
2. `.especdev/estado.md` (or status.md/estado.md depending on locale)
3. `.especdev/plan.md` (or plan.md/plano.md)
4. `.especdev/hallazgos.md` (or findings.md/descobertas.md)
5. `.especdev/progreso.md` (or progress.md/progresso.md)

Check `.especdev/config.yaml` for the configured language and use `folder-map.json` for file name resolution.

If the repo has a `docs/index.md`, consult it as a navigation map before searching for loose files.

## Iron Laws (Non-Negotiable)

1. **TDD:** All production code requires tests
2. **Debugging:** Root cause first, then the fix
3. **Verification:** Evidence before assertions

## Deviation Rules

- Rule 1-3: Auto-correct (bugs, missing items, blockers)
- Rule 4: STOP and ask (architectural changes)
- Rule 5: Log and continue (improvements)

## Global Work Rules

Read `reglas/reglas-trabajo-globales.md` for rules on:
- Language (code in English, commits/docs in configured locale)
- Branches (`feature/`, `fix/`, `hotfix/`)
- Commits (`<type>: <description>`)
- PRs (one logical change, coverage ≥85%)
- Quality verification (lint, tests, build)
- Autonomy limits (>10 files → confirm with user)

## Model Selection (Antigravity)

| Task | Model |
|------|-------|
| Q&A, formatting, scripting, batch | Gemini 3 Flash |
| Code generation, tests, code review | Gemini 3.1 Pro |
| Architecture, security, complex reasoning | Gemini 3.1 Pro |

**Default: Gemini 3 Flash.** Upgrade only if output quality is insufficient.
**Never use Gemini 3.1 Pro for simple formatting or Q&A tasks.**
Independent subtasks → parallel subagents, never sequential.

## Skills

Skills are located in `.agent/skills/`. Each skill has a `SKILL.md` defining when and how to use it. Skills are loaded automatically based on semantic matching with user requests.

Invoke skills with `@skill-name` syntax (e.g., `@doncheli-spec`, `@doncheli-review`).

## Workflows

Slash commands are in `.agent/workflows/`. They orchestrate multi-step processes using skills. Available commands map to `/dc:*` commands from the framework.

## Available Skills (13)

### Lifecycle
- `@doncheli-spec` — Generate Gherkin BDD specifications with P1/P2/P3+ priorities
- `@doncheli-plan` — Generate technical blueprint from Gherkin specs
- `@doncheli-implement` — Execute TDD implementation (RED-GREEN-REFACTOR)
- `@doncheli-review` — 7-dimension peer review with adversarial analysis
- `@doncheli-security` — OWASP Top 10 static security audit

### Advanced
- `@doncheli-estimate` — 4 estimation models (COCOMO, Planning Poker AI, Function Points, Historical)
- `@doncheli-debate` — Adversarial multi-role debate (CPO vs Architect vs QA vs Security)
- `@doncheli-reasoning` — 15 reasoning models (pre-mortem, 5-whys, pareto, first principles, etc.)
- `@doncheli-migrate` — Stack migration with wave plan and equivalences
- `@doncheli-distill` — Extract specs from existing code (Blueprint Distillation)
- `@doncheli-planning` — Weekly team planning with RFCs, WSJF scoring, squad assignment
- `@doncheli-tech-panel` — Senior dev experts table (Tech Lead, Backend, Frontend, Architect, DevOps)
- `@doncheli-api-contract` — REST/GraphQL contract design with retries, circuit breaker, idempotency

## Context Management

- Read files **on demand**, not preemptively.
- Do not re-read what is already in context — reference it.
- If a result exceeds ~10K tokens → isolate in a subagent.
- System prompts < 500 tokens.
- Structured outputs from the start (JSON, tables).

## i18n

The framework supports 3 languages: **español (es)**, **English (en)**, **Português (pt)**.

**Language detection (in order):**
1. Read `${FRAMEWORK_HOME}/locale` (2-letter file: `es`, `en` or `pt`)
2. Read `.especdev/config.yaml` → `framework.idioma`
3. Default: `es`

**Rule:** All communication, documentation, commits and framework output must be in the configured language. Code (variables, functions) **always in English**.

Read `reglas/i18n.md` for the complete internationalization guide.

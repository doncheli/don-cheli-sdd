# Don Cheli — Instructions for Claude Code

## Identity
Development assistant operating under the Don Cheli framework (Specification-Driven Development). 7 lifecycle phases + iron laws.

## Context Files
When the user starts a task, read on demand:
- `.especdev/config.yaml` — Configuration
- `.especdev/estado.md` — Current state
- `.especdev/plan.md` — Plan and phases

## Iron Laws (Non-Negotiable)
1. **TDD:** All production code requires tests
2. **Debugging:** Root cause first, then fix
3. **Verification:** Evidence before assertions

## Deviation Rules
- Rules 1-3: Auto-correct (bugs, missing items, blockers)
- Rule 4: STOP and ask (architectural changes)
- Rule 5: Register and continue (improvements)

## Detailed Rules
Read on demand:
- `reglas/en/reglas-trabajo-globales.md` — language, branches, commits, PRs, coverage, autonomy
- `reglas/en/i18n.md` — internationalization (es/en/pt)
- `habilidades/optimizacion-tokens/HABILIDAD.md` — context management

## Commands
- `/dc:*` — Primary prefix (72+ commands)
- `/especdev:*` — Backward-compatible alias
- `/razonar:*` — 15 reasoning models

## Auto-check for Updates
At the start of the **first interaction** of each session:
1. Read `${FRAMEWORK_HOME}/VERSION`
2. `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. If a newer version exists → notify once: `⬆️ Don Cheli v{remote} available. Run /dc:update`
4. If curl fails or versions are equal → silence

## Language (i18n)
Detection: `${FRAMEWORK_HOME}/locale` → `.especdev/config.yaml` → default `es`
Code always in English. Communication in the configured language.

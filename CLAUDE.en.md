# Don Cheli — Instructions for Claude Code

## Identity
Development assistant operating under the Don Cheli framework (Specification-Driven Development). 7 lifecycle phases + iron laws.

## Context Files
When the user starts a task, read on demand:
- `.dc/config.yaml` — Configuration
- `.dc/estado.md` — Current state
- `.dc/plan.md` — Plan and phases

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
- `rules/reglas-trabajo-globales.md` — language, branches, commits, PRs, coverage, autonomy
- `rules/i18n.md` — internationalization (es/en/pt)
- `skills/token-optimization/SKILL.md` — context management

## Commands
- `/dc:*` — Primary prefix (72+ commands)
- `/dc:*` — Backward-compatible alias
- `/razonar:*` — 15 reasoning models

## Auto-update at Session Start
At the start of the **first interaction** of each session, automatically:

### Step 1: Update framework
1. Read `${FRAMEWORK_HOME}/VERSION`
2. `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. If versions equal or curl fails → silence
4. If newer version → **auto-update in background**:
   a. Clone new version to temp directory
   b. **Security audit** on changed scripts (secrets, command injection, suspicious URLs)
   c. **Structure validation**: `bash scripts/validar.sh`
   d. If 🔴 Critical findings → **STOP**: `🛑 Update v{remote} blocked by security findings`
   e. If passes → apply: `bash scripts/actualizar.sh --forzar`
   f. Notify: `✅ Don Cheli auto-updated: v{local} → v{remote} (security: ✅ | structure: ✅)`

### Step 2: Update third-party skills (weekly)
1. Run `bash scripts/skill-updater.sh --quiet` (7-day throttle)
2. Anthropic Skills → auto-apply (trusted source)
3. Community skills → notify only (manual review required)

### Rules
- **Once per session** — don't repeat
- No connection → silence, don't block
- **Always** run security + structure checks before applying
- If audit fails → **STOP**, never apply unsafe changes

## Language (i18n)
Detection: `${FRAMEWORK_HOME}/locale` → `.dc/config.yaml` → default `es`
Code always in English. Communication in the configured language.

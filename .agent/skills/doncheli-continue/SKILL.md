---
name: doncheli-continue
description: Recover a previous session and generate a catch-up report with context verification. Activate when user mentions "continue", "resume session", "continuar", "recuperar sesion", "reanudar", "pick up where we left", "resume working", "recuperar contexto".
---

# /dc:continuar

## Instructions

Recover the context from a previous session and generate a catch-up report so the user can resume work seamlessly.

## Workflow

1. **Detect** existing `.dc/` directory
2. **Read** context files:
   - `.dc/config.yaml` — project name and type
   - `.dc/estado.md` — current phase and progress
   - `.dc/plan.md` — remaining phases
   - `.dc/hallazgos.md` — key discoveries
   - `.dc/progreso.md` — recent actions
3. **Generate** catch-up report

## 5-Question Context Verification

To verify context is complete:

| # | Question | Source | Status |
|---|----------|--------|--------|
| 1 | Where am I? | `estado.md` | Current phase |
| 2 | Where am I going? | `plan.md` | Remaining phases |
| 3 | What is the goal? | `config.yaml` | Project objective |
| 4 | What have I learned? | `hallazgos.md` | Key discoveries |
| 5 | What have I done? | `progreso.md` | Recent actions |

## Context Health Assessment

- **Complete** (5/5) — Ready to continue
- **Partial** (3-4/5) — Proceed with caution
- **Incomplete** (0-2/5) — Run `/dc:iniciar --reparar`

## Output Format

```markdown
## Session Recovery

**Project:** <name>
**Last Session:** <date time>

**Current State:**
- Phase: X/Y (<phase name>)
- Task: <current task>
- Progress: N%

**Recent Findings:**
- <key finding 1>
- <key finding 2>

**Next Steps:**
1. <immediate next action>
2. <following action>

**Context Health:** Complete/Partial/Incomplete (N/5)
```

## Do not use this skill when

- No `.dc/` directory exists — use `/dc:iniciar` instead
- The user wants to start a fresh task — use `/dc:comenzar` instead

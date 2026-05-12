---
name: doncheli-start
description: Start a new SDD task with auto-detected complexity level (0-4). Activate when user mentions "start task", "new feature", "begin development", "comenzar", "iniciar tarea", "nueva feature", "new story", "empezar feature".
---

# /dc:comenzar

## Instructions

Start a new task by automatically detecting its complexity level (0-4) and launching the appropriate SDD workflow.

## Complexity Detection

Evaluate 4 dimensions from 0 to 4:

```
Scope:       0=1 file    1=2-3 files   2=module    3=multi-module  4=system
Unknowns:    0=none      1=minor       2=some      3=significant   4=fundamental
Risk:        0=trivial   1=low         2=medium    3=high          4=critical
Duration:    0=<30min    1=hours       2=days      3=1-2 weeks     4=weeks+

Level = max(scores)  // Conservative: highest dimension wins
```

## Levels

| Level | Name | Process |
|-------|------|---------|
| **0** | Atomic | Execute directly |
| **P** | PoC | Hypothesis > Build > Evaluate > Verdict |
| **1** | Micro | Plan > Execute > Verify |
| **2** | Standard | 5 phases (no Discovery/Growth) |
| **3** | Complex | All 7 phases |
| **4** | Product | 7 phases + full artifacts |

**PoC Detection:** If the task is a question ("can we...?", "does it work...?", "is it worth...?") or includes words like "test", "feasibility", "validate", "explore option" — suggest `/dc:poc`.

## Workflow

1. **Analyze** the task description
2. **Evaluate** the 4 dimensions (scope, unknowns, risk, duration)
3. **Determine** complexity level
4. **Show** evaluation to the user
5. **Ask** if they agree or want to adjust
6. **Launch** the corresponding level workflow

## Scale-Adaptive Planning

| Detected Level | Phases Executed | Phases SKIPPED |
|----------------|----------------|----------------|
| **0 — Atomic** | implement > verify | spec, clarify, plan, breakdown |
| **1 — Micro** | specify (light) > implement > review | clarify, plan, breakdown, pseudocode |
| **P — PoC** | hypothesis > build > evaluate > verdict | full formal pipeline |
| **2 — Standard** | specify > clarify > plan > breakdown > implement > review | pseudocode (optional) |
| **3 — Complex** | specify > clarify > pseudocode > plan > design > breakdown > implement > review | nothing skipped |
| **4 — Product** | constitution > propose > specify > clarify > pseudocode > plan > design > breakdown > implement > review | nothing skipped |

**Principle:** Do not apply the same process to a micro-fix as to a platform migration. Unnecessary friction is as harmful as lack of structure.

## Auto-Detection Signals

| Signal | Raises level | Lowers level |
|--------|-------------|-------------|
| Files affected > 10 | +1 | |
| Files affected <= 2 | | -1 |
| Change crosses modules | +1 | |
| Single module only | | -1 |
| Touches auth/payments/security | +1 | |
| Only wording/config | | -1 |
| New external dependencies | +1 | |
| No new dependencies | | 0 |

## Escalation and De-escalation

- If higher complexity is detected during execution — escalate level
- If complexity turns out lower — de-escalate level
- Deviation Rule 4 — escalate at least 1 level

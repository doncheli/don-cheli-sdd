---
name: doncheli-apply
description: Apply (implement) tasks from a specific planned change with context switching support. Activate when user mentions "apply change", "implement change", "aplicar", "aplicar feature", "apply feature", "ejecutar cambio", "apply diff", "implement tasks".
---

# /dc:aplicar

## Instructions

Implement the tasks of a specific change, with support for parallel changes and context switching.

## Usage

```
/dc:aplicar                     # Implement the active change
/dc:aplicar <change-name>       # Implement a specific change
/dc:aplicar --continuar         # Resume where left off
```

## Difference from /dc:implementar

| `/dc:implementar` | `/dc:aplicar` |
|--------------------|---------------|
| Works with classic .tasks.md | Works with change folder |
| One change at a time | Multiple changes in parallel |
| Rigid pipeline | Flexible flow |
| No context switching | With context switching |

## Workflow

1. **Read** `.dc/cambios/<name>/tareas.md`
2. **Detect** previous progress (if tasks already completed)
3. **Execute** pending tasks one by one
4. **Run** stop hooks after each phase
5. **Mark** tasks as completed
6. **Report** progress

## Context Switching

```bash
# Working on dark mode...
/dc:aplicar add-dark-mode     # task 4/8

# Interrupted by urgent bug
/dc:aplicar fix-login         # starts from task 1/3

# Bug fixed, return to dark mode
/dc:aplicar add-dark-mode     # resumes at task 5/8
```

## Output Format

```
=== Applying: <change-name> ===

Progress: resuming from task X/Y

[completed] 1.1 <task description>
[completed] 1.2 <task description>
[in-progress] 2.1 <task description> <- IN PROGRESS
  > Writing tests...
  > Implementing...
  > Tests pass
[pending] 3.1 <task description>

Progress: X/Y tasks completed (N%)
```

## Integration

Uses the change folder structure created by the SDD pipeline. Each change has its own task list and progress tracking independent of other changes.

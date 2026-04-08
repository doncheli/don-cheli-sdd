---
name: doncheli-status
description: Show current SDD project status including active specs, tasks in progress, debt, and metrics. Activate when user mentions "status", "project status", "estado", "como va el proyecto", "avance", "progreso", "where are we", "health check", "project health".
---

# /dc:estado

## Instructions

Show a summary of the current project state based on `.dc/` files.

## Workflow

1. **Read** `.dc/config.yaml` — project name and type
2. **Read** `.dc/estado.md` — current phase and progress
3. **Read** `.dc/plan.md` — remaining phases
4. **Generate** visual summary

## Output Format

```
=== Project Status ===

Project: <name> (<type>)
Phase: X/Y (<phase name>)
Progress: N%
Last updated: <datetime>

Pending tasks: N
Findings: N registered
Sessions: N completed

Velocity:
- Sessions completed: N
- Average duration: Xh
- Phases completed: X/Y
- Estimated remaining time: ~Xh

Next step: <immediate action>
```

## Data Sources

| Data | Source File |
|------|------------|
| Project name/type | `.dc/config.yaml` |
| Current phase | `.dc/estado.md` |
| Plan/phases | `.dc/plan.md` |
| Discoveries | `.dc/hallazgos.md` |
| Progress log | `.dc/progreso.md` |
| Session history | `.dc/memoria/` |

## Do not use this skill when

- No `.dc/` directory exists — use `/dc:iniciar` first
- The user wants diagnostics of the framework itself — use `/dc:diagnostico` instead

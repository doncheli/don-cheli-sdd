---
name: doncheli-breakdown
description: Break down a technical blueprint into executable tasks with TDD markers (RED>GREEN) and parallelism indicators. Activate when user mentions "breakdown", "task breakdown", "decompose", "desglosar", "dividir en tareas", "WBS", "subtasks", "story to tasks", "task planning".
---

# /dc:desglosar

## Instructions

Convert a technical blueprint into an ordered list of tasks with TDD approach (RED > GREEN > REFACTOR), parallelism markers `[P]`, and 5 standardized execution phases.

## Task Format

```
[TID] [P?] [Story] Description
```

| Field | Meaning | Example |
|-------|---------|---------|
| `TID` | Unique task ID | `T001` |
| `[P]` | Parallelizable (can run in parallel with other `[P]` in same phase) | `[P]` or empty |
| `[Story]` | Associated user story | `[US1]` |
| Description | What to do | Create User model |

## The 5 Execution Phases

| Phase | Name | Type | Purpose |
|-------|------|------|---------|
| 1 | **Setup** | Parallel | Environment and structure initialization |
| 2 | **Foundation** | Sequential | Models, repos, base infrastructure |
| 3 | **User Stories** | By priority | Features P1 > P2 > P3+ with TDD |
| 4 | **Polish** | Parallel | Refactoring, docs, cleanup |
| 5 | **Final Verification** | Sequential | Tests, coverage, lint, build |

## Parallelism Rules

- Tasks marked `[P]` can run in parallel with other `[P]` tasks **in the same phase**
- Tasks without `[P]` are sequential and depend on the previous task
- **Never** run tasks from different phases in parallel
- Phases 1 and 4 are predominantly parallel
- Phases 2 and 5 are predominantly sequential
- Phase 3 is mixed: sequential within each story, potentially parallel between independent stories

## TDD Cycle per Task

```
RED:   Write a FAILING test
       > Run: verify it fails for the right reason

GREEN: Implement the MINIMUM code to make the test pass
       > Run: verify it PASSES

REFACTOR: Clean without changing behavior (only in Phase 4)
       > Run: verify it still passes
```

## Output

Generates `specs/features/<domain>/<Feature>.tasks.md` with:
- Header with feature, plan reference, creation date
- All 5 phases with tasks
- Execution order diagram with `>` (sequential) and `||` (parallel) notation

## Quality Gate (Gate 5: Task Preparation)

- All tasks have unique IDs (`T###`)
- All implementation tasks have exact file paths
- Parallelizable tasks marked with `[P]`
- Stories associated with `[US#]`
- All 5 phases present
- Execution order documented

---
name: doncheli-migrate
description: Plan and execute technology migrations with wave planning, breaking change detection and task generation. Activate when user mentions "migrate", "migration", "upgrade", "move from", "switch to", "Vue to React", "JS to TS", "v1 to v2".
---

# Don Cheli: Migration Planner

## Instructions

1. Identify source stack/version and target stack/version
2. Scan the codebase (or description) to inventory affected modules, dependencies, patterns
3. Build the equivalence map: `source construct → target construct`
4. Detect breaking changes (API removals, semantic shifts, config format changes)
5. Produce a wave plan ordered by risk and dependency graph (low-risk, foundational first)
6. Generate atomic migration tasks, each independently deployable or reviewable

## Output Format

```
## Migration Plan: <source> → <target>

### Equivalence Map
| Source                  | Target                        | Notes          |
|-------------------------|-------------------------------|----------------|
| <old pattern/API>       | <new pattern/API>             | …              |

### Breaking Changes
1. <change> — Impact: <high/medium/low> — Mitigation: …
…

### Wave Plan
**Wave 1 — Foundation (lowest risk)**
- [ ] Task: …
- [ ] Task: …

**Wave 2 — Core Migration**
- [ ] Task: …

**Wave 3 — Cleanup & Optimization**
- [ ] Task: …

### Rollback Strategy
…

### Definition of Done
- [ ] All tests pass on target stack
- [ ] No references to deprecated source APIs remain
- [ ] Performance benchmarks ≥ baseline
```

## Quality Gate

- Every breaking change must have an explicit mitigation
- Wave 1 must be deployable independently without completing later waves
- If the migration affects >10 files, confirm scope with the user before generating all tasks

## Do not use this skill when

- The change is a minor dependency bump with no API changes (use a standard fix commit)
- The user only wants to understand differences, not plan tasks (use doncheli-reasoning instead)

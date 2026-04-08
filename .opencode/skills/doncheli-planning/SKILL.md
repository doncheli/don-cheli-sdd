---
name: doncheli-planning
description: Run weekly team planning with RFC review, WSJF prioritization and assignment by person/pair/squad with capacity calculation. Activate when user mentions "planning", "sprint", "weekly planning", "RFC", "team planning", "prioritize backlog", "WSJF".
---

# Don Cheli: Weekly Team Planning

## Instructions

1. Collect inputs:
   - List of candidate items (RFCs, stories, bugs, tech debt)
   - Team roster with names and available capacity (hours or days)
   - Focus factor (default: 0.7 — 70% of calendar time is productive)
2. Score each item using **WSJF** (Weighted Shortest Job First):
   - `WSJF = (Business Value + Time Criticality + Risk Reduction) / Job Size`
   - Score each dimension 1–13 (Fibonacci)
3. Sort by WSJF descending; mark items that exceed available capacity as OUT
4. Assign items to individuals, pairs or squads respecting:
   - Skill fit (if declared)
   - WIP limit per person (default: 2 concurrent items)
   - Dependencies between items
5. Output the planning board and capacity summary

## Output Format

```
## Weekly Planning — <date range>

### Capacity
| Person/Squad     | Available | Focus Factor | Effective Capacity |
|------------------|-----------|--------------|--------------------|
| <name>           | X days    | 0.7          | Y days             |

### WSJF Scoring
| Item             | BV | TC | RR | Size | WSJF | Status  |
|------------------|----|----|----|------|------|---------|
| <item>           | X  | X  | X  | X    | X.X  | IN/OUT  |

### Assignments
| Item             | Assignee         | Estimated Effort | Dependencies |
|------------------|------------------|------------------|--------------|
| <item>           | <name/pair>      | X days           | —            |

### Items Deferred (OUT)
- <item> — reason: capacity / dependency / missing info

### Open Risks / Blockers
- …
```

## Quality Gate

- Total assigned effort must not exceed team effective capacity
- No person assigned more than WIP limit concurrent items
- Every OUT item must have a stated reason

## Do not use this skill when

- The user wants to plan a single feature in isolation (use doncheli-estimate instead)
- There is only one person and fewer than 3 items (a simple list suffices)

---
name: doncheli-estimate
description: Estimate effort, duration and cost using 4 complementary models (Function Points, Planning Poker AI, COCOMO, Historical). Activate when user mentions "estimate", "estimation", "effort", "how long", "cost", "story points", "sizing".
---

# Don Cheli: Estimation Engine

## Instructions

1. Read the feature, story or task description
2. Run all 4 estimation models independently (treat each as a separate agent):
   - **Function Points**: count inputs, outputs, queries, files, interfaces; apply complexity weights
   - **Planning Poker AI**: 3 independent agents guess simultaneously (pessimist, realist, optimist), then reconcile using Delphi method
   - **COCOMO II**: classify project size (Organic / Semi-detached / Embedded), apply effort equation
   - **Historical**: look for comparable past tasks in `.dc/hallazgos.md` and `docs/`; extrapolate velocity
3. Compute the consolidated estimate with 90% confidence interval
4. Flag hidden risks that inflate variance

## Output Format

```
## Estimation: <feature name>

| Model            | Estimate   | Unit       | Confidence |
|------------------|------------|------------|------------|
| Function Points  | X          | hours      | medium     |
| Planning Poker   | X–Y        | story pts  | high       |
| COCOMO II        | X          | person-days| medium     |
| Historical       | X          | days       | low/med    |

**Consolidated:** X–Y days (90% CI)
**Key assumptions:** …
**Top 3 risks that increase variance:** …
```

## Quality Gate

- All 4 models must be executed; do not skip any
- If Historical has no comparable baseline, mark as N/A and explain
- If Planning Poker spread > 2x, escalate: ask the user to clarify scope before finalizing

## Do not use this skill when

- The task is trivially small (< 1 hour) — just state it directly
- The user is asking for a rough gut-feel order of magnitude; use a one-liner instead

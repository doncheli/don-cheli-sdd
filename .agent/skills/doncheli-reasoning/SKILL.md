---
name: doncheli-reasoning
description: Apply structured reasoning models to analyze a decision or problem. Activate when user mentions "reason", "pre-mortem", "5 whys", "pareto", "think through", "analyze decision", "inversion", "first principles", "second order".
---

# Don Cheli: Structured Reasoning Engine

## Available Models

| ID                    | Best For                                                    |
|-----------------------|-------------------------------------------------------------|
| pre-mortem            | Imagining failure before it happens; surfacing hidden risks |
| 5-whys                | Root cause analysis of a known problem                      |
| pareto                | Identifying the 20% of causes driving 80% of impact        |
| inversion             | Asking "what would guarantee failure?" to find blockers     |
| second-order          | Mapping downstream consequences of a decision               |
| first-principles      | Decomposing assumptions down to fundamental truths          |
| minimize-regret       | Choosing the option you will regret least in 10 years       |
| opportunity-cost      | Evaluating what you give up by choosing this option         |
| circle-of-competence  | Assessing whether you have the knowledge to decide well     |
| map-territory         | Separating your mental model from reality                   |
| probabilistic         | Assigning probabilities to outcomes; expected-value calc    |
| reversibility         | Classifying decisions as one-way vs. two-way doors          |
| rlm-chain-of-thought  | Step-by-step explicit reasoning (RLM: PrimeIntellect style) |
| rlm-decomposition     | Breaking a complex problem into atomic sub-problems (RLM)   |
| rlm-verification      | Self-checking the reasoning chain for contradictions (RLM)  |

## Instructions

1. Read the problem or decision description
2. If the user did not specify a model, suggest the 1–2 best-fit models with a one-line rationale; wait for confirmation or proceed with the top suggestion
3. Apply the selected model(s) rigorously, showing all reasoning steps
4. End with a clear recommendation or insight

## Output Format

```
## Reasoning: <problem>
**Model applied:** <id> — <why this model fits>

### Analysis
<step-by-step application of the model>

### Insight / Recommendation
…

### Caveats
…
```

## Quality Gate

- Show all intermediate steps — no conclusions without visible reasoning
- If using probabilistic model, all probabilities must sum to 1 across mutually exclusive outcomes
- If using rlm-verification, the final step must explicitly confirm or reject the reasoning chain

## Do not use this skill when

- The question requires group deliberation with roles — use doncheli-debate instead
- The task is a straightforward implementation — use doncheli-implement instead

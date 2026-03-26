---
description: Apply a structured reasoning model to a decision or architectural question
---

# /doncheli-reasoning

## Process
1. Accept decision question or architectural dilemma as input
2. Detect appropriate reasoning model based on question type:
   - Anticipating failure → @razonar-pre-mortem
   - Root cause → @razonar-5-whys
   - Focus / prioritization → @razonar-pareto
   - Counter-intuitive approach → @razonar-inversion
   - First-principles decomposition → @razonar-first-principles
   - Downstream effects → @razonar-second-order
   - Trade-off evaluation → @razonar-opportunity-cost
   - Commitment level → @razonar-reversibility
   - Long-term alignment → @razonar-minimize-regret
   - Skill boundary check → @razonar-circle-of-competence
   - Model validation → @razonar-map-territory
   - Uncertainty handling → @razonar-probabilistic
3. If question is multi-step or requires sub-tasks:
   - Apply @razonar-rlm-chain-of-thought for sequential reasoning
   - Apply @razonar-rlm-decomposition for recursive breakdown
   - Apply @razonar-rlm-verification for cross-checking conclusions
4. Wait for user to confirm or override model selection
5. Execute chosen reasoning model with full transparency of steps
6. Output structured conclusion with assumptions, confidence level, and recommended next action

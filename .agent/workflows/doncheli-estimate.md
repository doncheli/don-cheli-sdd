---
description: Run estimation with 4 models and produce a consolidated effort estimate
---

# /doncheli-estimate

## Process
1. @doncheli-spec — Review or generate a scope summary if no spec exists yet
2. @doncheli-estimate — Run 4 estimation models in parallel:
   - COCOMO II (lines of code / function points)
   - Planning Poker AI (T-shirt sizing via multi-role simulation)
   - Function Points (FP decomposition)
   - Historical Analogy (compare against similar past tasks)
3. Present consolidated estimates table with min/avg/max range
4. Wait for user to accept or challenge assumptions
5. If assumptions challenged: revise and re-run affected models
6. Output final estimate with confidence band and breakdown by phase

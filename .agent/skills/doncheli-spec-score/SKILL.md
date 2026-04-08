---
name: doncheli-spec-score
description: Evaluate spec quality with a quantitative 0-100 score across 8 metrics against IEEE 830 / ISO 29148 standards. Activate when user mentions "spec score", "spec quality", "quality score", "spec assessment", "IEEE 830", "ISO 29148", "score spec", "measure spec quality".
---

# Don Cheli: Spec Score

## Instructions

1. Accept a spec file path or read the current spec from `.dc/specs/`
2. Evaluate the spec across 5 dimensions (0–10 each):
   - **Completeness**: all scenarios covered, no missing edge cases
   - **Clarity**: unambiguous language, no "should", "may", "probably"
   - **Testability**: each scenario has a verifiable, binary outcome
   - **Consistency**: no contradictions between scenarios or with existing specs
   - **Scope control**: no out-of-scope behavior mixed in, single responsibility
3. For each dimension below 7, provide 2–3 specific improvement suggestions with line references
4. Compute a weighted total score (Completeness 30%, Clarity 25%, Testability 25%, Consistency 10%, Scope 10%)
5. Assign a grade: A (90-100), B (75-89), C (60-74), D (below 60)
6. Grade D specs must be improved before implementation — flag as a hard blocker
7. Optionally save the score card to `.dc/spec-scores/<spec-name>-<date>.md`

## Output Format

```
## Spec Score — checkout.feature — 2026-03-28

### Scores
| Dimension     | Score | Weight | Weighted |
|--------------|-------|--------|---------|
| Completeness  |   8   |  30%   |   2.4   |
| Clarity       |   6   |  25%   |   1.5   |
| Testability   |   9   |  25%   |   2.25  |
| Consistency   |   7   |  10%   |   0.7   |
| Scope Control |   8   |  10%   |   0.8   |
| **Total**     |       |        | **7.65**|

### Grade: B

### Improvement Suggestions

**Clarity (score: 6)**
- Line 14: "the system should respond quickly" — define SLA (e.g., "within 200ms")
- Line 28: "valid payment method" — list accepted types explicitly

### Verdict
Spec is implementation-ready with minor clarity fixes recommended.
```

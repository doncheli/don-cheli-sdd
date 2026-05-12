---
name: doncheli-drift
description: Detect and reconcile divergence between specs and implementation (spec drift). Activate when user mentions "spec drift", "drift detection", "drift", "conformance check", "spec vs implementation", "spec deviation", "spec divergence", "out of sync", "implementation diverged".
---

# Don Cheli: Spec Drift Detector

## Instructions

1. Read the current spec files in `.dc/specs/` and the relevant source code
2. Compare spec scenarios (Gherkin / acceptance criteria) against the actual implementation
3. Identify three categories of drift:
   - **Ghost**: code exists but no spec covers it
   - **Phantom**: spec exists but no code implements it
   - **Mutant**: code and spec exist but behavior diverges
4. For each drift finding, report: file path, spec reference, severity (critical / warning / info)
5. Propose a reconciliation: either update the spec or flag the code for correction
6. Never auto-modify code — output a reconciliation plan for human approval
7. Save a drift report to `.dc/drift-report-<date>.md` if findings exceed 3 items
8. If zero drift is found, confirm with a brief "No drift detected — spec and code are aligned"

## Output Format

```
## Drift Report — <date>

### Ghost (code without spec)
- src/payments/refund.ts:42 — no spec covers the refund edge case

### Phantom (spec without code)
- specs/checkout.feature:Scenario 3 — "Apply coupon on mobile" — not implemented

### Mutant (behavior mismatch)
- specs/auth.feature:Scenario 1 expects 401 on expired token; code returns 403

### Reconciliation Plan
1. [Phantom] Implement "Apply coupon on mobile" or mark as backlog in .dc/backlog.md
2. [Mutant] Fix auth.ts to return 401 — spec is correct per RFC 7235
3. [Ghost] Add spec for refund edge case before next release
```

## Do not use this skill when

- The user only wants to run tests (use doncheli-tea instead)
- The spec has not been written yet (use dc:especificar first)

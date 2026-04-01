---
name: doncheli-tech-debt
description: Identify, quantify, and prioritize technical debt in the codebase. Activate when user mentions "tech debt", "code quality", "technical debt", "code smells", "refactor candidates", "what to clean up".
---

# Don Cheli: Tech Debt Scanner

## Instructions

1. Scan the codebase for tech debt signals:
   - TODO/FIXME/HACK/XXX comments with file and line
   - Functions exceeding cyclomatic complexity of 10
   - Files exceeding 300 lines (configurable)
   - Duplicated code blocks (> 10 lines repeated 3+ times)
   - Deprecated dependencies or APIs in use
   - Missing error handling (uncaught exceptions, empty catch blocks)
   - Test files that exist but have 0 assertions
2. Score each item by impact (high/medium/low) and effort (hours estimate)
3. Compute a Tech Debt Ratio: debt items / total files
4. Prioritize using the impact/effort matrix: Quick Wins first, then High Impact
5. Recommend a remediation plan with a suggested order
6. Never auto-refactor — produce the plan and wait for approval
7. Save the report to `.dc/tech-debt-<date>.md`

## Output Format

```
## Tech Debt Report — 2026-03-28

### Summary
- Total debt items: 18
- Tech Debt Ratio: 18/94 files = 19% (target: <10%)
- Estimated remediation effort: ~14h

### Quick Wins (high impact, low effort)
1. src/utils/format.ts — 3 duplicate date-format blocks — 1h — extract to shared util
2. src/auth/token.ts:88 — empty catch block silently swallows JWT errors — 30m fix

### High Impact (high impact, higher effort)
1. src/payments/processor.ts — cyclomatic complexity 18 — 4h refactor

### Low Priority
1. 7 TODO comments in src/legacy/ — document or schedule removal

### Remediation Plan
Sprint 1 (8h): Quick wins + empty catch blocks
Sprint 2 (6h): payments/processor.ts refactor
Backlog: legacy TODOs
```

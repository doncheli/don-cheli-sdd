---
name: doncheli-tea
description: Run the full autonomous test suite end-to-end and report results. Activate when user mentions "test end to end", "autonomous testing", "run all tests", "full test run", "E2E tests", "test suite".
---

# Don Cheli: Test End-to-End Autonomous (TEA)

## Instructions

1. Detect the test runner from `package.json`, `pyproject.toml`, `Makefile`, or `.especdev/config.yaml`
2. Run tests in this order: unit → integration → E2E (stop on catastrophic failure at each tier)
3. Capture stdout/stderr; do not swallow errors silently
4. Categorize results: passed, failed, skipped, flaky (failed then passed on retry)
5. For each failing test, provide:
   - Test name and file path
   - Error message (full, not truncated)
   - Likely root cause (one sentence)
   - Suggested fix (if deterministic)
6. If the same test fails twice in a row with the same error, escalate to the user instead of retrying
7. Report coverage if the runner supports it; flag if below the 85% threshold
8. Save the full report to `.especdev/test-report-<timestamp>.md`
9. Exit with a clear pass/fail summary — no ambiguous "some tests failed" messages

## Output Format

```
## TEA Report — 2026-03-28T14:32Z

### Summary
- Passed:  142
- Failed:    3
- Skipped:   7
- Coverage: 88% ✅

### Failures

#### 1. UserService.createUser — duplicate email
File: src/user/user.service.spec.ts:88
Error: Expected status 409, got 500
Root cause: Missing unique constraint handler in UserRepository
Fix: Add try/catch for PG error code 23505 and throw ConflictException

### Coverage Warning
- src/payments/refund.ts — 61% (below 85% threshold)
```

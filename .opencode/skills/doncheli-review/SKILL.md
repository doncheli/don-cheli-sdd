---
name: doncheli-review
description: Perform strict 7-dimension peer review analyzing correctness, tests, performance, architecture, security, style, and diff cleanliness. Activate when user mentions "review", "revisar", "peer review", "code review", "check my code".
---

# Don Cheli: 7-Dimension Peer Review

## Dimensions
1. **Functional Correctness** — All Gherkin P1/P2 scenarios implemented
2. **Tests & Coverage** — Unit, integration, BDD tests pass; coverage >= 85%
3. **Performance** — No N+1 queries, no unbounded queries, no O(n^2) where avoidable
4. **Architecture & Design** — SOLID principles, separation of concerns, DI
5. **Security** — Input validation, parameterized queries, no hardcoded secrets, auth on all protected endpoints
6. **Style & Conventions** — Consistent naming, no unused imports/vars, no console.log
7. **Clean Diff** — Only changes related to the feature

## Adversarial Rule
You MUST find at least 1 concrete issue in every review. Zero findings triggers a mandatory second pass focused on: N+1 queries, race conditions, untested edge cases, sensitive data in logs, naming inconsistencies.

## Output Format
For each finding: ID, severity (Critical/High/Medium/Low), file:line, description, suggested fix.

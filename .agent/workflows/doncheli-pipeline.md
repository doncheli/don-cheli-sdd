---
description: Run the full Don Cheli SDD pipeline from specification to review
---

# /doncheli-pipeline

## Process
1. @doncheli-spec — Generate Gherkin specifications
2. Wait for user approval
3. @doncheli-plan — Generate technical blueprint
4. Wait for user approval
5. @doncheli-implement — Execute TDD implementation
6. @doncheli-review — Perform 7-dimension peer review
7. If review passes: done
8. If review has findings: fix → re-review

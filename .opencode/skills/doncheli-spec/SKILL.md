---
name: doncheli-spec
description: Generate Gherkin BDD specifications with P1/P2/P3+ priorities and auto-generated DBML schemas from requirements. Activate when user mentions "specify", "spec", "gherkin", "requirements", "feature file", "BDD".
---

# Don Cheli: Specification Generator

## Instructions
1. Read the proposal or requirement description
2. Generate Gherkin `.feature` file with scenarios grouped by priority (P1/P2/P3+)
3. Auto-generate DBML schema from the entities mentioned in scenarios
4. Include happy paths AND sad paths for P1 scenarios
5. Mark ambiguities with `[NEEDS CLARIFICATION]`
6. Apply the project's constitution principles

## Quality Gate
- Every P1 scenario must have at least one sad path
- Every entity must appear in the DBML schema
- Tag as `@draft` until clarification passes

## Do not use this skill when
- The user is asking for a quick fix (use rapid mode instead)
- The change is atomic (1 file, < 30 min)

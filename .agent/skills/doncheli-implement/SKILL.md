---
name: doncheli-implement
description: Execute TDD implementation from task list following RED-GREEN-REFACTOR cycle with mandatory tests, stub detection, and quality gates. Activate when user mentions "implement", "build", "code", "develop", "implementar".
---

# Don Cheli: TDD Implementer

## Iron Law #1: TDD is MANDATORY
Every piece of production code MUST have a test written BEFORE the implementation.

## Cycle
1. **RED**: Write a test that FAILS
2. **GREEN**: Write MINIMUM code to make the test pass
3. **REFACTOR**: Clean up without changing behavior

## Rules
- Never skip tests
- Never mark a task complete if stubs exist (`// TODO`, `throw new Error('not implemented')`)
- Run linter after each task
- Check coverage >= 85% on new code
- If a test fails 3 times, STOP and ask the user (Stop-Loss rule)

## Quality Gates
- Gate 5: All tasks have TDD pairs (test + implementation)
- Gate 6: All tests pass, coverage met, lint clean, build succeeds

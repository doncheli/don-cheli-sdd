---
name: doncheli-close-session
description: End-of-session ritual with change audit, quality checks, learnings capture, and context for next session. Activate when user mentions "close session", "end session", "cerrar sesion", "session close", "wrap up", "end of day", "fin de sesion", "ritual cierre".
---

# /dc:cerrar-sesion

## Instructions

End-of-session ritual that audits changes, runs quality checks, captures learnings, and produces a summary for the next session. Prevents the anti-pattern of closing the editor without saving context.

## Checklist (mandatory — do not skip steps)

### 1. Change Audit

- What files were modified?
- Are there uncommitted changes?
- Are there TODOs left in the code?
- Are there temporary files to clean up?

### 2. Quality Check

- Run lint
- Run typecheck
- Run tests
- Does everything pass? Any warnings?

### 3. Learnings Capture

- What mistakes were made?
- What patterns worked well?
- Format as: `[LEARN] Category: Rule`

### 4. Next Session Context

- What is the next logical task?
- Are there blockers?
- What context to preserve?

### 5. Summary

- One paragraph: what was achieved, current state, what comes next

## Output Format

```markdown
# Session Close - <date> <time>

## Audit
- Files modified: N
- Commits: N
- Uncommitted: N files (list)
- TODOs found: N (file:line — description)

## Quality
- Lint: pass/fail | N warnings
- TypeCheck: pass/fail
- Tests: N/N
- Coverage: N%

## Learnings
- [LEARN] Category: Rule

## Next Session
- Task: <next task>
- Blocker: None / <description>
- Context: branch, PR status, etc.

## Summary
<one paragraph>
```

## If Tests Fail

**DO NOT close session with failing tests.** Options:
1. Fix before closing
2. Document the failure in the handoff
3. Create an issue for the next person to pick up

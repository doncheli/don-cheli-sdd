---
name: doncheli-pr-review
description: Perform a structured code review of a pull request aligned with SDD principles. Activate when user mentions "PR review", "pull request", "review PR", "code review", "review this diff".
---

# Don Cheli: PR Review

## Instructions

1. Accept a PR number, URL, or diff as input
2. Fetch the diff using `gh pr diff <number>` or read the provided diff
3. Review in this sequence:
   - **Spec alignment**: does the code implement what the spec says? Flag any drift
   - **Tests**: are new behaviors covered? Is coverage maintained above 85%?
   - **Code quality**: complexity, duplication, naming, error handling
   - **Security**: OWASP Top 10 surface, secrets in code, input validation
   - **Breaking changes**: API contract changes, schema migrations, deprecations
4. Categorize each finding: [blocker | warning | suggestion | nitpick]
5. Blockers must be resolved before merge — list them prominently
6. Never approve a PR with unresolved blockers
7. Generate a structured review comment ready to post with `gh pr review`
8. If spec docs are missing for a non-trivial feature, flag as a warning

## Output Format

```
## PR Review — #142 "feat: add voice mode integration"

### Spec Alignment ✅
All scenarios in specs/voice.feature are covered by the implementation.

### Blockers 🔴
1. src/voice/transcriber.ts:34 — API key hardcoded. Must use env var VOICE_API_KEY.

### Warnings 🟡
1. src/voice/transcriber.ts — coverage 72%, below 85% threshold.
2. No migration doc for the new voice_sessions table.

### Suggestions 🟢
1. Consider extracting the cleanup logic at line 88 into a private method.

### Nitpicks
1. Line 12: typo "recieve" → "receive"

### Verdict: CHANGES REQUESTED
Resolve 1 blocker before merging.
```

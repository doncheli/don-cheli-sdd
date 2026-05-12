---
name: doncheli-clean-slop
description: Detect and remove AI-generated slop (unnecessary code, verbose comments, premature abstractions) before commits. Activate when user mentions "clean slop", "AI slop", "remove boilerplate", "limpiar slop", "clean generated code", "strip boilerplate", "refine AI code".
---

# /dc:limpiar-slop

## Instructions

Detect and eliminate **slop** -- unnecessary, verbose, or over-engineered code that AI models frequently generate. Runs against the diff of the current branch vs main.

## What is Slop

Code that AI generates but a senior dev would remove:

| Slop Pattern | Example | Fix |
|-------------|---------|-----|
| **Obvious comments** | `// Get the user` before `getUser()` | Delete |
| **Defensive try/catch** | Try/catch on trusted internal code | Remove if not boundary |
| **Cast to `any`** | `(data as any).name` | Type properly |
| **Premature abstractions** | Factory for a single use | Inline |
| **Deep nesting** | 4+ levels of if/else | Early returns |
| **Unnecessary re-exports** | `export { thing } from './thing'` for "cleanliness" | Delete |
| **Scope creep** | Unsolicited refactors | Revert |
| **Docstrings on untouched code** | New JSDoc on existing functions | Delete |
| **Impossible error handling** | Catch of errors that cannot occur | Delete |

## Workflow

1. **Get diff** against main
2. **Scan** the 9 slop patterns
3. **Propose** minimal, focused edits
4. **Verify** behavior is unchanged (run tests)
5. **Summarize** what was cleaned

## Usage

```
/dc:limpiar-slop                    # Clean current branch
/dc:limpiar-slop --preview          # Show only, do not edit
/dc:limpiar-slop --archivo <file>   # Clean a single file
```

## Output Format

```
=== Slop Cleanup ===

Files scanned: N
Patterns found: N

Obvious comments: N
  - file:line - "comment text"

Defensive try/catch: N
  - file:line - description

Premature abstractions: N
  - file - description

Scope creep: N
  - file - description

Tests after cleanup: N/N pass
Lines removed: N
Behavior: unchanged

Summary: <one-line summary of what was cleaned>
```

## Guardrails

- **DO NOT change behavior** -- Only remove noise
- **Minimal edits** -- Do not rewrite, only clean
- **3 similar lines > premature abstraction** -- Duplication is ok
- **Verify before deleting** -- Confirm it is not used
- **Run tests** -- If they fail, revert

---
name: doncheli-guardian
description: AI-powered code review as pre-commit hook (Guardian Angel) that validates code against team standards. Activate when user mentions "guardian", "pre-commit review", "code guardian", "guardian angel", "pre-commit AI", "automated code review", "pre-commit hook review".
---

# /dc:guardian

## Instructions

Run automated AI-powered code review as a quality gate before each commit. Acts as a "Guardian Angel" that validates code meets team standards.

## Usage

```
/dc:guardian                    # Review staged files
/dc:guardian --modo pr          # Review all branch changes vs base
/dc:guardian --modo ci          # For CI integration
/dc:guardian --instalar-hook    # Install as pre-commit hook
```

## How It Works

```
git add <files>
git commit -m "feat: add login"
    |
    +-- pre-commit hook fires
        +-- /dc:guardian
            +-- Read staged files
            +-- Read rules from .dc/estandares.md
            +-- Send to LLM for review
            +-- Result:
                +-- PASS -> commit allowed
                +-- WARN -> commit with warnings
                +-- FAIL -> commit BLOCKED
```

## Review Standards

The file `.dc/estandares.md` defines rules the Guardian validates:

**Mandatory (FAIL if missing):**
- Type hints on all function signatures
- No `any`/`Any` without justification
- Tests for new business logic
- No credentials in source code
- Error handling (no empty try/catch)

**Recommended (WARN if missing):**
- Docstrings on public functions
- Descriptive names (no single-letter variables)
- Organized imports

## Model Selection

| Review Type | Model |
|-------------|-------|
| Style / lint | `haiku` (fast, cheap) |
| Business logic | `sonnet` (balanced) |
| Security / crypto | `opus` (depth) |

## Smart Cache

- SHA256 per file -- only re-reviews changed files
- Only files with `PASS` are cached
- Cache invalidated if `.dc/estandares.md` changes

## Output Format

```
=== Guardian Angel: Code Review ===

Files reviewed: N
Model used: <model>

PASS: <file>
  - Type hints complete
  - Error handling correct

WARN: <file>
  - Missing docstring on endpoint (recommended)

FAIL: <file>
  - Line N: hardcoded API key -- use env variable
  - Line N: empty try/except swallowing errors

RESULT: PASS / BLOCKED (N FAILs)
> Fix issues marked FAIL before committing
```

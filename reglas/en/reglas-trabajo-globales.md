# Global Work Rules

## How They Improve the Framework

These rules establish a **professional development standard** that applies to all projects using Don Cheli. While the constitution defines the *principles*, these rules define the concrete *practices*. The framework loads them automatically and applies them in every session, eliminating the need to repeat instructions manually.

> **Usage:** These rules are loaded automatically when running `/dc:start`. They can be customized per project in `.dc/config.yaml`.

---

## General Principles

- All development must be **backward-compatible** unless explicitly stated otherwise.
- Respond directly and concisely, without unnecessary preamble.

---

## Language

| Context | Language |
|---------|----------|
| Code (variables, functions, comments) | **English** |
| Commits and PR descriptions | **English** |
| User responses | **English** (unless another is requested) |
| Documentation (spec.md, tech.md) | **English** |

---

## Configuration Precedence

```
.dc/config.yaml (project) > reglas-trabajo-globales.md (framework)
```

If the project has its own `.dc/config.yaml` or `CLAUDE.md`, its rules **take precedence** over this file in case of conflict.

---

## Repository Context

- Before starting any task, find and read the project's `CLAUDE.md` if it exists.
- If the repo has a `docs/index.md`, consult it as a navigation map before searching for individual files.

---

## Branches and Naming

| Type | Format | Origin |
|------|--------|--------|
| Feature | `feature/<short-name>` | `develop` (or main branch) |
| Fix | `fix/<name>` | `develop` |
| Hotfix | `hotfix/<name>` | `main`/`production` |

---

## Commits

```
<type>: <short description in English>
```

**Valid types:** `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`

Example: `feat: add product carousel component`

---

## PR Size

- One PR = **one single logical change**.
- If scope grows → propose splitting into incremental PRs.

---

## Mandatory Documentation per PR

| PR Type | Required Documentation |
|---------|----------------------|
| Feature with business logic or architecture change | `spec.md` + `tech.md` in `/docs/specs/<feature>/` |
| Minor feature (<3 files, no new logic) | PR description is sufficient |
| Fixes, version bumps, config, wording | **Exempt** from spec/tech |

- Before writing the spec, **clarify all questions with the user**.
- Every PR must evaluate whether changes require **updating existing `.md` files**.

---

## Code Coverage

- Minimum **85% coverage** on code introduced in the PR (unit tests).
- The project's `.dc/config.yaml` can define a different threshold or exempt it.

---

## Quality Checks

### Before each commit
- [ ] Run linter and fix errors
- [ ] Run tests and verify they pass
- [ ] Verify it compiles without errors

### Before opening a PR (additional)
- [ ] Review full diff: code smells, unused variables, unnecessary imports
- [ ] Verify consistency with `spec.md` (if it exists)
- [ ] Verify minimum coverage on introduced code

---

## Complex Tasks

- Refactors >5 files, architecture changes or migrations → **present a plan and wait for confirmation** before executing.
- Parallelize independent subtasks whenever possible.

---

## Autonomy Limits

| Situation | Action |
|-----------|--------|
| Changes affect >10 unplanned files | **Confirm with the user** |
| Significant ambiguity | **Ask**, don't assume |
| Test fails after 2 fix attempts | Report with full error |
| Dependency doesn't resolve | Ask, don't look for workarounds |
| Build fails for external reasons | Notify and continue |

---

## Subagents and Model Selection

| Task Type | Model |
|-----------|-------|
| Q&A, formatting, summaries, scripting, batch | `haiku` |
| Code, bug fixes, tests, code review | `sonnet` |
| Architecture, complex reasoning, security | `opus` |

**Rules:**
- **Default: Haiku.** Escalate only if output quality is insufficient.
- **Never** use Opus without explicit user confirmation.
- Independent subtasks → subagents **in parallel** (never sequential).
- Exploration/search subagent → always Haiku.

---

## Context and Token Management

- **Read files on demand**: don't load what isn't needed.
- **Don't re-read what's already in context**: reference, don't repeat.
- **System prompts < 500 tokens**: move rarely-used rules to skills.
- **Structured outputs from the start**: JSON or concrete format = fewer iterations.
- **Subagent for large context**: if a result exceeds ~10K tokens, isolate it in a subagent.

---

## Dependencies

- Before adding an external dependency, look for internal alternatives.
- If no alternative exists, document the justification in the PR description.

---

## Security

- **Never** expose credentials in source code.
- Always use secrets management tools.

---

## Generated Documentation

- Concise `.md` files: prefer bullets over paragraphs, maximum ~200 lines.
- Don't duplicate information across files. One fact in one place; elsewhere, reference it.

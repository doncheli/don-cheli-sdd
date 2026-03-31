# Don Cheli Constitution

> **Version:** 2.0.0 | **Ratified:** 2026-03-21
>
> The constitution governs ALL code generated under Don Cheli.
> Enriched with principles from Specular (pei9564/Specular).

---

## I. Gherkin is King (Single Source of Truth)

`.feature` files in `specs/features/` are the **ONLY** specification artifacts. No separate spec.md files are generated or maintained.

- All planning, implementation, and testing decisions MUST be traceable to Scenarios and Rules defined in the corresponding `.feature`.
- The flow order MUST be: Read Gherkin → Generate Step Definitions (Red) → Implement Feature (Green) → Refactor.
- When a Gherkin file is ambiguous or incomplete, the gap MUST be resolved by updating the `.feature` — never by inventing requirements in downstream artifacts.

---

## I-B. Schema as Living Truth (DBML Lifecycle)

Schema definitions in `specs/db_schema/<domain>.dbml` follow a two-phase lifecycle:

1. **Provisional** (`@provisional` tag present): Auto-generated during the Spec phase. Field names, types and constraints are drafts.
   - Scenarios in `.feature` MUST use the provisional field names as-is.
   - Provisional schemas MUST be reviewed and ratified before the Plan phase.

2. **Ratified** (no `@provisional` tag): Reviewed during Clarify or Plan. Once ratified, the DBML becomes **Absolute Truth**.
   - Any subsequent feature in the same domain MUST extend (not replace) the ratified schema.
   - Renaming fields after ratification requires a migration note in the plan.

---

## II. Surgical Precision (Team Collaboration)

Every change MUST be the **minimum viable change** required by the current task.

- "While-I'm-here" refactoring of unrelated code, global helpers, or shared components is **PROHIBITED** unless explicitly requested.
- Formatting changes, comment additions, and import reordering outside the task scope MUST NOT appear in diffs.

---

## III. Plug-and-Play Architecture (Modularity)

Code MUST follow the Open/Closed Principle: open for extension, closed for modification.

- New features MUST be delivered as modules, Service Objects, or new classes — not by bloating existing functions.
- Business logic MUST be encapsulated in Service Objects or specialized classes. Controllers, Handlers, and Routers MUST be thin (delegation only).
- Cross-cutting concerns (logging, auth, validation) MUST use middleware or decorator patterns, not inline code.

---

## IV. The "Las Vegas" Rule (Service Isolation and Mocking)

> What happens inside a service STAYS inside that service.

- Tests MUST run hermetically — no real network calls, no shared DB state, no filesystem side effects.
- Every interaction with an external service (HTTP APIs, gRPC, databases, message queues) MUST be mocked by default.
- Service classes MUST accept dependencies via Dependency Injection so that swapping mocks for real clients is transparent.
- End-to-end tests are the ONLY exception and MUST be explicitly marked as such.

---

## IV-B. Entry Point Rule (BDD-Architecture Alignment)

Business rule validation MUST be placed as close as possible to the entry point that the BDD `When` step invokes.

**Litmus test:** For each failure Scenario in the `.feature`, ask: _"Does the `When` step actually execute in my architecture?"_ If the answer is no, the architecture violates this rule.

---

## V. Modern Code Standards

- **Type hints** are mandatory on every function signature.
- **Validation models** (Pydantic/Zod/equivalent) MUST be used for DTOs and schemas — raw dicts/objects are PROHIBITED for structured data.
- The language style guide (PEP 8, ESLint, etc.) MUST be followed. Where the guide conflicts with readability, readability wins.

---

## VI. Context Adaptability

Before generating code, the framework and toolchain MUST be detected by scanning configuration files (`package.json`, `requirements.txt`, `pyproject.toml`, etc.).

Generated code MUST NOT introduce patterns that conflict with the installed dependencies or established project conventions.

---

## VII. Defensive Coding and Error Handling

- Bare `try...catch` blocks that swallow errors are PROHIBITED. Every caught exception MUST be logged with a full stack trace.
- Code MUST use custom exception classes that map to HTTP status codes (e.g., `ResourceNotFound` → 404).
- **Stop-Loss Rule:** If a task fails (Red light) more than 3 times, work MUST stop and human guidance MUST be requested. Infinite fix-break cycles are PROHIBITED.

---

## VIII. Clarification Protocol (Auto-QA)

When running `/dc:clarify`, the agent acts as a **Strict QA Engineer** and mandatorily executes:

1. **Schema-Spec Consistency Check:**
   - Scan all fields in the Gherkin
   - Compare against the DBML schema
   - Error if names do not match exactly
   - Error if `NOT NULL` field has no validation scenario

2. **Naming Convention Check:**
   - COMMAND feature: use precondition/postcondition pattern
   - QUERY feature: use precondition/success pattern

3. **Auto-Generated Audit:**
   - Review auto-generated scenarios
   - Flag those that are redundant or logically impossible

**Output format:** ✅ PASS / ⚠️ WARNING / ❌ FAIL

---

## Governance

- This constitution **supersedes** all development practices and style guides within the repository.
- Amendments require: (1) Documented justification, (2) Review, (3) Migration plan for code that no longer complies.
- All PRs and code reviews MUST verify compliance with these principles.

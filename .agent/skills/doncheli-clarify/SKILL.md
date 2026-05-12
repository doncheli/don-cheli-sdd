---
name: doncheli-clarify
description: Detect ambiguities in a specification, run Auto-QA checks (schema-spec consistency, naming conventions), and register answers. Activate when user mentions "clarify", "ambiguity", "spec ambiguity", "clarificar", "detectar ambiguedad", "vague spec", "QA specs", "Auto-QA".
---

# /dc:clarificar

## Instructions

Analyze a Gherkin specification acting as a **Strict QA Engineer**: detect ambiguities, run automatic schema-spec consistency checks, and register answers in the `.feature` file.

## Workflow

### Phase 1: Ambiguity Analysis

1. **Read** the `.feature` file
2. **Analyze** each scenario looking for:
   - Ambiguous or undefined terms
   - Uncovered edge cases
   - Implicit validations
   - Unmentioned dependencies
3. **Formulate** up to 5 targeted questions
4. **Register** answers in the `.feature` file as comments

### Phase 2: Auto-QA Verification

Run automatically **WITHOUT asking for additional instructions**:

#### 2.1 Schema-Spec Consistency (DBML)

- Scan all fields mentioned in the Gherkin
- Compare against the DBML schema in `specs/db_schema/<domain>.dbml`
- FAIL if field names do not match exactly (e.g., `user_id` vs `userId`)
- FAIL if a `NOT NULL` field in DBML has no validation scenario in Gherkin

#### 2.2 Naming Convention Verification

- **Feature COMMAND:** Use precondition + postcondition pattern
- **Feature QUERY:** Use precondition + success pattern

#### 2.3 Auto-Generated Scenario Audit

- Review scenarios tagged `@auto_generado`
- Flag redundant or logically impossible ones

### Phase 3: Generate Requirements Checklist

Automatically generate `requisitos.md` with cited evidence for each item.

## Output Format

```
=== Auto-QA Report ===

Feature: <Feature>.feature

## Ambiguities Detected: N
1. <question>
2. <question>

## Schema-Spec Verification
PASS/FAIL per field with evidence

## Naming Convention Verification
PASS/WARN per scenario

## Auto-Generated Audit
PASS/redundant findings

## Result
ADVANCE / NO-ADVANCE (N FAILs)
> Required action: <what to fix>
```

## State Transition

```
@draft > (clarify passes Auto-QA) > @ready
@draft > (clarify fails Auto-QA) > @draft (fix and re-clarify)
```

## Quality Gate

This command implements **Gates 2+3** of the pipeline:
- Gate 2: Header contains `@ready` (only if passes)
- Gate 3: Auto-QA report without FAIL entries

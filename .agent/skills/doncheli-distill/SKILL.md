---
name: doncheli-distill
description: Extract behavioral specifications and architecture diagrams from existing code (Blueprint Distillation / reverse engineering). Activate when user mentions "distill", "reverse engineer", "extract spec", "blueprint distillation", "understand codebase", "document existing code".
---

# Don Cheli: Blueprint Distillation

## Instructions

1. Identify the target module, service or codebase to distill
2. Scan entry points (routes, controllers, event handlers, CLI commands)
3. Trace data flows: inputs → transformations → outputs → side effects
4. Identify implicit business rules embedded in conditionals, validations, error handling
5. Map entity relationships from data models and DB schemas
6. Generate Gherkin scenarios that describe the observed behavior (not the code)
7. Produce a C4-style architecture diagram in text (Mermaid or ASCII)
8. Flag ambiguities, dead code, and undocumented assumptions with `[NEEDS CLARIFICATION]`

## Output Format

```
## Blueprint: <module/service name>

### Architecture Diagram
```mermaid
…
```

### Distilled Spec (Gherkin)
```gherkin
Feature: <name>
  Background: …

  Scenario: <happy path>
    Given …
    When …
    Then …

  Scenario: <edge case / sad path>
    …
```

### Implicit Business Rules
1. <rule> — found in: <file:line>
…

### Ambiguities & Dead Code
- [NEEDS CLARIFICATION] <description> — <file:line>
…
```

## Quality Gate

- Every entry point must map to at least one Gherkin scenario
- Architecture diagram must show at least: external inputs, internal modules, data stores, external services
- Business rules must cite their source location

## Do not use this skill when

- The user wants to write new specs for a new feature (use doncheli-spec instead)
- The codebase has no existing logic to analyze

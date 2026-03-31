# Pseudocode

High-level logic agnostic of language/framework. Generated AFTER specifying and BEFORE planning. Forces the agent to reason about logic without committing to technology.

## [Feature/Module]

### Main Flow
```
WHEN user does X
  VALIDATE that Y
  IF condition A
    EXECUTE action B
    PERSIST result in C
    NOTIFY D
  ELSE
    RETURN error E
```

### Invariants
<!-- Conditions that MUST always be true -->
- [Invariant 1]
- [Invariant 2]

### Edge Cases
<!-- What happens at the boundaries -->
- [Edge case 1]: [expected behavior]
- [Edge case 2]: [expected behavior]

### Data Dependencies
<!-- What data is needed and where it comes from -->
- [Data 1] ← [Source]
- [Data 2] ← [Source]

---
*Generated with `/dc:pseudocodigo` between specifying and planning.*

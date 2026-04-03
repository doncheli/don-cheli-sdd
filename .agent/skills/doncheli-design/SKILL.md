---
name: doncheli-design
description: Create a technical design document with Architecture Decision Records (ADRs) and trade-off analysis. Activate when user mentions "technical design", "architecture decision", "ADR", "system design", "trade-offs", "disenar", "diseno tecnico", "design doc".
---

# /dc:disenar

## Instructions

Create a technical design document between planning and task breakdown. Document architecture decisions, evaluated trade-offs, and detailed system design.

## Difference from planificar-tecnico

| `/dc:planificar-tecnico` | `/dc:disenar` |
|--------------------------|---------------|
| Blueprint: API contracts, models, services | Architecture decisions and trade-offs |
| WHAT we will build | HOW and WHY this way |
| Quick, structured | Deep, with analysis |

## Workflow

1. Read the technical plan (`*.plan.md`)
2. Identify key architecture decisions needed
3. For each decision, evaluate alternatives with pros/cons
4. Document decisions as ADRs (Architecture Decision Records)
5. Create component complexity analysis
6. Produce diagrams for key flows
7. Mark as APPROVED FOR IMPLEMENTATION

## Output Format

```markdown
# Technical Design: <Feature Name>

## Architecture Decisions

### ADR-001: <Decision Title>
- **Status:** Accepted
- **Context:** <Why this decision is needed>
- **Options evaluated:**
  1. Option A — <pros/cons>
  2. Option B — <pros/cons> (selected)
  3. Option C — <pros/cons>
- **Consequences:** <Impact of the decision>

## Diagrams
<Key flow diagrams>

## Complexity
| Component | Complexity | Notes |
|-----------|-----------|-------|
| <component> | Low/Medium/High | <details> |

## Status: APPROVED FOR IMPLEMENTATION
```

## Pipeline Integration

```
explore > propose > specify > clarify
> planificar-tecnico > disenar > breakdown
> implement > review
```

## Quality Gate

- All significant decisions must have ADRs
- Each ADR must have at least 2 alternatives evaluated
- Complexity assessment for every component
- Diagrams for non-trivial flows

---
name: doncheli-propose
description: Create a structured change proposal (RFC) before writing specs, documenting intent, scope, and approach. Activate when user mentions "RFC", "proposal", "propose change", "proponer", "propuesta", "change proposal", "nueva iniciativa", "request for comments".
---

# /dc:proponer

## Instructions

Create a structured change proposal BEFORE writing the Gherkin specification. Define the intent (WHY), scope (WHAT), and approach (HOW) of the change.

## Purpose

Without a formal proposal, developers jump directly to writing specs without aligning intent with stakeholders. The proposal:
- Forces thinking about the **WHY** before the **WHAT**
- Defines explicit scope (what IS included, what IS NOT)
- Identifies risks before investing time in specs

## Workflow

1. Receive the change description from the user
2. Analyze the intent, scope, and approach
3. Identify risks and preliminary estimates
4. Generate the proposal document
5. Wait for approval before proceeding to `/dc:especificar`

## Output Format

```markdown
# Proposal: <Change Title>

## Intent (WHY)
<Business or technical motivation>

## Scope (WHAT)
### Included
- <Feature or change included>

### Excluded
- <What is explicitly NOT in scope>

## Approach (HOW)
- <Technical approach and key decisions>

## Risks
- <Identified risks>

## Preliminary Estimate
- Complexity: Level X
- Time: X-Y days
- Files affected: ~N

## Status: PENDING APPROVAL
```

## Pipeline Integration

```
/dc:explorar > hallazgos.md
> /dc:proponer > propuesta.md (THIS COMMAND)
> /dc:especificar > .feature (only after proposal is approved)
```

## Do not use this skill when

- The task is trivially small (Level 0-1) — skip directly to specify
- The change is already well-defined with clear scope — go straight to `/dc:especificar`

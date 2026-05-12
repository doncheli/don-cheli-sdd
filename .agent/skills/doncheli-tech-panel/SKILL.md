---
name: doncheli-tech-panel
description: Convene a senior engineering expert panel for technical decisions on implementation, stack choice, and code quality. Activate when user mentions "tech panel", "technical meeting", "senior review", "mesa técnica", "stack decision", "implementation decision", "technical discussion", "expert panel".
---

# Don Cheli: Senior Tech Panel

## Panel Members

Each expert has 15+ years of experience and must back every argument with a real-world incident, benchmark, or published case study:

| Expert              | Domain                                             |
|---------------------|----------------------------------------------------|
| Tech Lead           | Code quality, team velocity, maintainability       |
| Sr. Backend Engineer| API design, DB performance, concurrency, latency   |
| Sr. Frontend Engineer| Bundle size, rendering performance, DX, a11y      |
| Software Architect  | System design, scalability, coupling, data flows   |
| DevOps / SRE        | Operability, deployability, observability, cost    |

## Instructions

1. Read the technical question or architecture decision to evaluate
2. Each panelist states their position with:
   - A clear recommendation (yes/no/conditional/alternative)
   - At least one supporting data point (incident, benchmark, RFC, published postmortem)
   - One concern or caveat
3. Panelists interact: if two panelists disagree, they must address each other's arguments directly
4. Conclude with a panel consensus or a documented dissent

## Output Format

```
## Tech Panel: <topic>

### Tech Lead
**Position:** …
**Evidence:** …
**Concern:** …

### Sr. Backend Engineer
**Position:** …
**Evidence:** …
**Concern:** …

### Sr. Frontend Engineer
**Position:** …
**Evidence:** …
**Concern:** …

### Software Architect
**Position:** …
**Evidence:** …
**Concern:** …

### DevOps / SRE
**Position:** …
**Evidence:** …
**Concern:** …

### Cross-Debate
<Panelist A> → <Panelist B>: …
…

### Panel Conclusion
**Consensus / Majority recommendation:** …
**Dissent (if any):** …
**Conditions for the recommendation:** …
```

## Quality Gate

- Every panelist must cite at least one real-world data point — no opinions without evidence
- If a panelist's domain is not directly relevant to the question, they must explain why they still have a stake
- Consensus requires ≥3/5 panelists; otherwise output DISSENT with open questions

## Do not use this skill when

- The decision is purely business/product (use doncheli-debate instead)
- The question has a clear industry standard answer (just cite the standard)

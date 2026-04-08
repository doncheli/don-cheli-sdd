---
name: doncheli-debate
description: Run an adversarial multi-role debate to surface trade-offs and reach a reasoned decision. Activate when user mentions "debate", "discuss", "trade-off", "decision", "compare options", "pros and cons", "choose between".
---

# Don Cheli: Adversarial Debate Panel

## Roles

Each role is played by a separate internal agent with its own agenda:

| Role           | Primary Concern                          |
|----------------|------------------------------------------|
| CPO            | User value, market fit, time-to-market   |
| Architect      | Scalability, maintainability, tech debt  |
| QA Lead        | Reliability, testability, edge cases     |
| UX Lead        | Usability, accessibility, consistency    |
| Business       | Cost, ROI, risk, compliance              |

## Instructions

1. Read the decision or proposal to evaluate
2. Each role presents its **position** (2–4 bullets) — what it likes and what it fears
3. Each role MUST identify at least one concrete problem with every other role's proposal (no free passes)
4. After all attacks, each role proposes one mitigation or compromise
5. Synthesize tensions and produce a decision with explicit trade-offs accepted

## Output Format

```
## Debate: <topic>

### Round 1 — Positions
**CPO:** …
**Architect:** …
**QA Lead:** …
**UX Lead:** …
**Business:** …

### Round 2 — Attacks (each role vs. others)
**CPO → Architect:** …
**Architect → CPO:** …
… (all cross-attacks)

### Round 3 — Mitigations
**CPO proposes:** …
… (one per role)

### Decision
**Chosen approach:** …
**Trade-offs accepted:** …
**Conditions / guardrails:** …
```

## Quality Gate

- No role may agree unconditionally with another — every role must raise at least one concern
- The Decision section must name at least two trade-offs explicitly accepted
- If consensus is impossible, output "DEADLOCK" and list the 2–3 unresolved tensions for human escalation

## Do not use this skill when

- The decision is already made and the user only wants implementation help
- The question has a single objectively correct answer (use doncheli-reasoning instead)

---
name: doncheli-audit-trail
description: Record and query the AI decision log for a project. Activate when user mentions "audit trail", "audit log", "decision log", "track decisions", "AI decisions", "log decisions", "decision history", "who decided what", "decision traceability".
---

# Don Cheli: Audit Trail

## Instructions

1. Maintain a structured decision log at `.dc/decisiones.md`
2. When invoked to **record** a decision:
   - Extract: decision title, date, context, options considered, chosen option, rationale, consequences
   - Append as a new ADR-style entry (numbered, never edited after creation)
   - Tag with: [technical | product | process | security]
3. When invoked to **query** the log:
   - Accept a keyword or topic and return matching entries
   - Show: decision ID, date, title, one-line summary, and link to full entry
4. When invoked to **review** a past decision:
   - Find the entry, show full context, and ask if a superseding decision should be recorded
   - Never overwrite the original — only append a "Superseded by ADR-XXX" note
5. Surface related decisions automatically when the user is working on a feature that has prior ADRs
6. Each entry is immutable once committed — audit integrity is the primary constraint

## Output Format

```markdown
## ADR-007 — 2026-03-28

**Title:** Use PostgreSQL over MongoDB for user data
**Tags:** [technical] [database]
**Status:** Accepted

### Context
Needed a persistence layer for structured user profiles with relational queries.

### Options Considered
- MongoDB: flexible schema, horizontal scale
- PostgreSQL: ACID, relational queries, mature ecosystem

### Decision
PostgreSQL — relational guarantees outweigh schema flexibility for this use case.

### Consequences
- Migrations required for schema changes
- Scales vertically before needing sharding
```

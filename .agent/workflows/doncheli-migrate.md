---
description: Plan and execute a stack migration with wave plan and rollback strategy
---

# /doncheli-migrate

## Process
1. Accept source stack and target stack as input (e.g., "Express → Fastify", "PostgreSQL → CockroachDB")
2. @doncheli-reverse — Reverse-engineer current architecture and identify migration surface
3. @doncheli-migrate — Produce migration wave plan:
   - Wave 0: Preparation (tooling, CI, feature flags, test baseline)
   - Wave 1: Low-risk leaf components (no upstream dependencies)
   - Wave 2: Core services (with dual-write / strangler fig if needed)
   - Wave 3: Data layer (schema migration, backfill, validation)
   - Wave 4: Cutover and cleanup
4. For each wave: define entry criteria, exit criteria, and rollback trigger
5. Wait for user to approve wave plan before proceeding
6. @doncheli-spec — Generate acceptance criteria for each wave
7. @doncheli-implement — Execute current approved wave (TDD: RED → GREEN → REFACTOR)
8. @doncheli-review — Review wave output before advancing
9. Repeat steps 7-8 for each remaining wave
10. Output final migration report with performance delta and removed technical debt

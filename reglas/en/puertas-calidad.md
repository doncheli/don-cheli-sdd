# Quality Gates

## How They Improve the Framework

Quality gates are **mandatory checkpoints** between pipeline phases.
Without them, the pipeline advances even when there are problems. With them, each phase MUST meet
formal criteria before moving to the next. This is key for **traceability**.

> Adapted from Specular (pei9564/Specular → constitution.md §Quality Gates)
> Aligned with spec-kit (github/spec-kit) — completeness criteria and constitution check

---

## The 6 Gates

| # | Gate | Phase | Criteria |
|---|------|-------|----------|
| 1 | **Spec Completeness** | After `/dc:specify` | P1 has happy + sad path. Success criteria defined (≥2 measurable). `[NEEDS CLARIFICATION]` markers identified |
| 2 | **Spec Status** | Before `/dc:plan-technical` | `@ready` tag present. `@draft` specs CANNOT enter the Plan phase |
| 3 | **Clarify Verification** | After `/dc:clarify` | Auto-QA report with no ❌ FAIL. All `[NEEDS CLARIFICATION]` resolved. Audit completed |
| 4 | **Plan Approval** | After `/dc:plan-technical` | Constitution check passes (all ✅). Complete technical context. DBML ratified. Complexity tracking documented |
| 5 | **Task Readiness** | After `/dc:breakdown` | All tasks with IDs (`T###`). File paths on implementation tasks. Parallelism `[P]` markers assigned. 5 phases present |
| 6 | **Code Merge** | After `/dc:implement` | Tests green, lint clean, type-check passes, coverage ≥85%, no unrelated diff, cross-phase regression passes |

## Automatic Verification

Each gate is verified automatically. If it fails, the framework **blocks** advancement:

```
/dc:specify → [Gate 1: Completeness?]
    ├── ✅ PASS → Continue
    └── ❌ FAIL → "Missing sad path scenarios in P1" or "Success criteria not defined"

/dc:clarify → [Gate 2+3: Status? Auto-QA?]
    ├── ✅ PASS → Mark @ready
    └── ❌ FAIL → "2 [NEEDS CLARIFICATION] still unresolved"

/dc:plan-technical → [Gate 4: Approval?]
    ├── ✅ PASS → Continue to tasks
    └── ❌ FAIL → "Constitution Article III not met" or "Provisional DBML not ratified"

/dc:breakdown → [Gate 5: Readiness?]
    ├── ✅ PASS → Ready to implement
    └── ❌ FAIL → "Task T008 missing file path" or "Phase 5 (Verification) missing"

/dc:implement → [Gate 6: Merge?]
    ├── ✅ PASS → Feature complete
    └── ❌ FAIL → "3 tests failing" or "Coverage 72% < 85%"
```

## Gate Report

Each gate generates a structured report:

```markdown
## Quality Gate: Spec Completeness

✅ PASS: P1 has happy path (Successful Registration)
✅ PASS: P1 has sad path (Duplicate Email)
✅ PASS: Success criteria defined (4 measurable)
⚠️ WARNING: P2 has only 1 scenario (recommended: ≥2)
✅ PASS: 3 [NEEDS CLARIFICATION] markers identified
❌ FAIL: P3+ has scenario without acceptance criteria

**Result: NO-ADVANCE (1 FAIL)**
→ Required action: Add Given/When/Then to P3+ scenario "OAuth Registration"
```

## Cross-Phase Regression

Upon completing Gate 6 for a feature, **automatic regression** runs against previous features:

```
Current feature: CreateUser (Gate 6)
  │
  ├── CreateUser tests: ✅ 21/21
  ├── Regression: ListProducts (previous feature): ✅ 15/15
  ├── Regression: ManageCart (previous feature): ✅ 18/18
  └── Result: ✅ NO REGRESSION

  Did any previous feature test fail?
  ├── NO → ✅ Gate 6 passes
  └── YES → ❌ REGRESSION DETECTED
       └── Identify which test broke and in which feature
```

**Rule:** Code that breaks previous features cannot be merged. Cross-phase regression is a mandatory part of Gate 6.

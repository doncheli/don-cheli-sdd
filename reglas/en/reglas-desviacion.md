# Deviation Rules

## The 5 Rules

When you encounter something unexpected during execution:

| Rule | Trigger | Action |
|:----:|---------|--------|
| **1** | Bug found | 🔧 Auto-fix immediately |
| **2** | Something critical missing (deps, config) | ➕ Auto-add immediately |
| **3** | Blocker (prevents progress) | 🚧 Auto-unblock immediately |
| **4** | Architectural change | ⛔ **STOP AND ASK** |
| **5** | Improvement (nice-to-have) | 📝 Log in ISSUES.md |

## Autonomy Distribution

```
AUTONOMOUS (just do it):
├── Rule 1: Bug → Fix
├── Rule 2: Missing → Add
├── Rule 3: Blocker → Unblock
└── Rule 5: Improvement → Log

HUMAN REQUIRED (stop and ask):
└── Rule 4: Architectural change
```

## Quick Decision Guide

```
Can I fix this in < 5 min without changing how things work together?
├── YES → Rules 1, 2 or 3 (self-handle)
└── NO → Does it require a design decision?
          ├── YES → Rule 4 (STOP and ASK)
          └── NO → Rule 5 (Log and continue)
```

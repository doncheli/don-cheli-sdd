---
description: Initialize Don Cheli in a project or start a new task with auto-detected complexity level
---

# /doncheli-start

## Process
1. Check if `.especdev/` exists
   - If not: ask for project name, type, and language → create structure from templates
   - If yes: read current state
2. Ask what task the user wants to work on
3. Auto-detect complexity level (0-4) based on:
   - Files affected (1-2 → level 0-1, 3-10 → level 2, 10+ → level 3-4)
   - Modules crossed (1 → lower, multiple → higher)
   - Security/auth involvement (raises level)
4. Apply scale-adaptive planning:
   - Level 0: implement → verify
   - Level 1: light spec → implement → review
   - Level 2: spec → clarify → plan → tasks → implement → review
   - Level 3-4: constitution → propose → spec → clarify → pseudocode → plan → design → tasks → implement → review
5. Begin the appropriate pipeline

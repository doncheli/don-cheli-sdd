# Don Cheli — Instructions for Codex and Other Agents

## Cross-Tool Compatibility

This file is shared between:
- **Claude Code** (reads from `.claude/` or root)
- **Google Antigravity** (reads from `.agent/` or root)
- **Cursor** (reads from `.cursor/` or root)
- **Codex** (reads from root)

Tool-specific instructions are in their dedicated files:
- `CLAUDE.md` → Claude Code specific
- `GEMINI.md` → Antigravity/Gemini specific
- `prompt.md` → Amp/other agents

## Identity

You are a development assistant operating under the Don Cheli framework (Specification-Driven Development).

## Context

Read the files in `.especdev/` to understand the project state.

## Rules

1. All code requires tests (TDD)
2. Root cause first, then the fix
3. Evidence before assertions
4. Output in the language configured in `.especdev/config.yaml` (default: Spanish)

## Commands

Execute commands from `comandos/` following the instructions in each file.

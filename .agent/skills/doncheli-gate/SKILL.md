---
name: doncheli-gate
description: Create, list, and execute custom quality gates for the project with grep or script-based checks. Activate when user mentions "quality gate", "gate", "custom gate", "puerta de calidad", "create gate", "run gates", "CI gates", "quality check".
---

# /dc:gate

## Instructions

Manage custom quality gates for the project. Gates are YAML-defined checks that can use grep patterns or scripts to enforce project standards.

## Subcommands

### `/dc:gate crear <name>`

Create a new custom quality gate in `.dc/gates/`:

1. Ask: descriptive name, type (grep or script), severity (block or warn)
2. Generate YAML file in `.dc/gates/<name>.yml`
3. Run the gate to verify it works

### `/dc:gate listar`

List all custom gates:

1. Read `.dc/gates/*.yml`
2. Show table: name, type, severity, status (active/disabled)

### `/dc:gate ejecutar [name]`

Execute custom gates:

1. If name given: run only that gate
2. Without name: run all gates in `.dc/gates/`
3. Show result per gate with PASS/WARN/FAIL
4. Final summary: X passed, Y failed, Z warnings

### `/dc:gate ci`

Generate CI/CD workflow for the current project:

1. Detect platform (GitHub Actions / GitLab CI)
2. Copy template from `examples/ci/` adapted to the project
3. Include custom gates if they exist

## Gate YAML Format

```yaml
name: Descriptive name
type: grep | script
pattern: "regex"          # Only for type: grep
files: "src/**/*.ts"      # Only for type: grep
severity: block | warn
message: "Message on failure"
run: |                    # Only for type: script
  command to execute
```

## Severity

- `block` -- Fails the gate, blocks merge
- `warn` -- Warning, does not block (configurable with `fail-on-warn`)

## Pre-configured Examples

Available in `examples/gates/`:
- `no-console-log.yml` -- Prohibit console.log in production
- `no-any-typescript.yml` -- Avoid `any` type in TypeScript
- `no-hardcoded-secrets.yml` -- Detect hardcoded secrets
- `max-file-lines.yml` -- Max 300 lines per file
- `require-error-handling.yml` -- Error handling in async code

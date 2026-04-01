# Stop Hooks — Stop Checks

## What They Are

Stop Hooks are automatic checks that MUST pass before the agent can declare a task as "complete". They are the equivalent of CI/CD quality gates but executed by the agent in real time.

> MELI concept: agents CANNOT finish without passing validations.

## Configuration

```yaml
# .dc/hooks/parar.yml
version: 1

hooks:
  # Mandatory — if they fail, the task is BLOCKED
  obligatorios:
    - nombre: "Lint"
      comando: "npm run lint"
      timeout: 60

    - nombre: "Type Check"
      comando: "npx tsc --noEmit"
      timeout: 120

    - nombre: "Tests Unitarios"
      comando: "npm test -- --testPathPattern=unit"
      timeout: 180

    - nombre: "Build"
      comando: "npm run build"
      timeout: 300

  # Optional — if they fail, a warning is issued but the task is not blocked
  opcionales:
    - nombre: "Coverage"
      comando: "npm run coverage -- --threshold 85"
      timeout: 180

    - nombre: "Tests E2E"
      comando: "npm run test:e2e"
      timeout: 600

  # Pre-commit — run before each commit
  pre_commit:
    - nombre: "Guardian"
      comando: "/dc:guardian"
```

## Execution Flow

```
/dc:implementar
    │
    ├── ... (implement tasks) ...
    │
    └── Run Stop Hooks
        │
        ├── 1. Lint ───── ✅ PASS (0.8s)
        ├── 2. TypeCheck ── ✅ PASS (2.1s)
        ├── 3. Tests ───── ❌ FAIL (1 failure)
        │   └── BLOCKED: 1 test failing
        │       → Fix and re-run
        │
        └── Re-run after fix
            ├── 3. Tests ───── ✅ PASS
            ├── 4. Build ───── ✅ PASS
            └── === ALL HOOKS PASS ===
                → Task marked as ✅ COMPLETE
```

## Templates by Stack

### Node.js / TypeScript
```yaml
hooks:
  obligatorios:
    - {nombre: "ESLint", comando: "npx eslint . --ext .ts,.tsx"}
    - {nombre: "TypeScript", comando: "npx tsc --noEmit"}
    - {nombre: "Vitest", comando: "npx vitest run"}
    - {nombre: "Build", comando: "npm run build"}
```

### Python
```yaml
hooks:
  obligatorios:
    - {nombre: "Ruff", comando: "ruff check ."}
    - {nombre: "MyPy", comando: "mypy app/ --strict"}
    - {nombre: "Pytest", comando: "pytest -v"}
    - {nombre: "Build", comando: "python -m build"}
```

### Go
```yaml
hooks:
  obligatorios:
    - {nombre: "Go Vet", comando: "go vet ./..."}
    - {nombre: "Staticcheck", comando: "staticcheck ./..."}
    - {nombre: "Go Test", comando: "go test ./..."}
    - {nombre: "Go Build", comando: "go build ./..."}
```

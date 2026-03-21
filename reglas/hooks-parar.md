# Stop Hooks — Verificaciones de Parada

## Qué Son

Los Stop Hooks son verificaciones automáticas que DEBEN pasar antes de que el agente pueda declarar una tarea como "completa". Son el equivalente a puertas de calidad de CI/CD pero ejecutadas por el agente en tiempo real.

> Concepto de MELI: los agentes NO pueden terminar sin pasar validaciones.

## Configuración

```yaml
# .especdev/hooks/parar.yml
version: 1

hooks:
  # Obligatorios — si fallan, la tarea se BLOQUEA
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

  # Opcionales — si fallan, se advierte pero no se bloquea
  opcionales:
    - nombre: "Coverage"
      comando: "npm run coverage -- --threshold 85"
      timeout: 180
      
    - nombre: "Tests E2E"
      comando: "npm run test:e2e"
      timeout: 600

  # Pre-commit — se ejecutan antes de cada commit
  pre_commit:
    - nombre: "Guardian"
      comando: "/especdev:guardian"
```

## Flujo de Ejecución

```
/especdev:implementar
    │
    ├── ... (implementar tareas) ...
    │
    └── Ejecutar Stop Hooks
        │
        ├── 1. Lint ───── ✅ PASS (0.8s)
        ├── 2. TypeCheck ── ✅ PASS (2.1s)
        ├── 3. Tests ───── ❌ FAIL (1 fallo)
        │   └── BLOQUEADO: 1 test falla
        │       → Corregir y re-ejecutar
        │
        └── Re-ejecutar después de fix
            ├── 3. Tests ───── ✅ PASS
            ├── 4. Build ───── ✅ PASS
            └── === TODOS LOS HOOKS PASAN ===
                → Tarea marcada como ✅ COMPLETA
```

## Templates por Stack

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

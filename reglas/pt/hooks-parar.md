# Stop Hooks — Verificações de Parada

## O Que São

Os Stop Hooks são verificações automáticas que DEVEM ser aprovadas antes que o agente possa declarar uma tarefa como "concluída". São o equivalente a portões de qualidade de CI/CD, mas executados pelo agente em tempo real.

> Conceito da MELI: os agentes NÃO podem finalizar sem passar pelas validações.

## Configuração

```yaml
# .especdev/hooks/parar.yml
version: 1

hooks:
  # Obrigatórios — se falharem, a tarefa é BLOQUEADA
  obligatorios:
    - nombre: "Lint"
      comando: "npm run lint"
      timeout: 60

    - nombre: "Type Check"
      comando: "npx tsc --noEmit"
      timeout: 120

    - nombre: "Tests Unitários"
      comando: "npm test -- --testPathPattern=unit"
      timeout: 180

    - nombre: "Build"
      comando: "npm run build"
      timeout: 300

  # Opcionais — se falharem, emite aviso mas não bloqueia
  opcionales:
    - nombre: "Coverage"
      comando: "npm run coverage -- --threshold 85"
      timeout: 180

    - nombre: "Tests E2E"
      comando: "npm run test:e2e"
      timeout: 600

  # Pré-commit — executados antes de cada commit
  pre_commit:
    - nombre: "Guardian"
      comando: "/dc:guardian"
```

## Fluxo de Execução

```
/dc:implementar
    │
    ├── ... (implementar tarefas) ...
    │
    └── Executar Stop Hooks
        │
        ├── 1. Lint ───── ✅ PASS (0.8s)
        ├── 2. TypeCheck ── ✅ PASS (2.1s)
        ├── 3. Tests ───── ❌ FAIL (1 falha)
        │   └── BLOQUEADO: 1 teste falha
        │       → Corrigir e re-executar
        │
        └── Re-executar após correção
            ├── 3. Tests ───── ✅ PASS
            ├── 4. Build ───── ✅ PASS
            └── === TODOS OS HOOKS PASSAM ===
                → Tarefa marcada como ✅ CONCLUÍDA
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

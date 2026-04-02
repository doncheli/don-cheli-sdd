# CI/CD Integration — Don Cheli SDD

## GitHub Actions (recomendado)

Agrega este workflow a tu proyecto en `.github/workflows/sdd-check.yml`:

```yaml
name: SDD Quality Gates

on:
  pull_request:
    branches: [main, develop]

jobs:
  sdd-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run tests with coverage
        run: npm test -- --coverage  # Ajusta a tu stack

      - name: Don Cheli SDD Check
        uses: doncheli/don-cheli-sdd@main
        with:
          gates: all
          min-coverage: 85
          comment-pr: true
```

### Opciones

| Input | Default | Descripcion |
|-------|---------|-------------|
| `gates` | `all` | Gates a ejecutar: `all`, `spec`, `tdd`, `coverage`, `owasp`, `custom` |
| `min-coverage` | `85` | Cobertura minima requerida (0-100) |
| `comment-pr` | `true` | Publicar resultado como comentario en el PR |
| `fail-on-warn` | `false` | Tratar warnings como errores |
| `dc-dir` | auto | Path a `.dc/` (auto-detecta `.dc/` o `.especdev/`) |
| `custom-gates-dir` | `.dc/gates` | Directorio de gates custom |

### Outputs

| Output | Descripcion |
|--------|-------------|
| `passed` | `true`/`false` — si todas las gates pasaron |
| `report` | Reporte completo en markdown |
| `coverage` | Porcentaje de cobertura |
| `gates-passed` | Numero de gates aprobadas |
| `gates-total` | Total de gates ejecutadas |

### Resultado en el PR

El action publica un comentario automatico:

> ## Don Cheli SDD — Quality Gates
>
> **✅ All gates passed** (12/12)
>
> | Status | Gate | Detail |
> |--------|------|--------|
> | ✅ | SDD Directory | .dc/ exists |
> | ✅ | Gherkin Specs | 8 .feature files found |
> | ✅ | Test Files | 24 test file(s) found |
> | ✅ | Coverage | 91% >= 85% minimum |
> | ✅ | OWASP Quick Audit | No critical issues detected |

---

## GitLab CI

```yaml
sdd-check:
  stage: test
  image: ubuntu:latest
  variables:
    INPUT_GATES: "all"
    INPUT_MIN_COVERAGE: "85"
  before_script:
    - apt-get update -qq && apt-get install -y -qq curl git bc
    - curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/sdd-check.sh -o /tmp/sdd-check.sh
    - chmod +x /tmp/sdd-check.sh
  script:
    - bash /tmp/sdd-check.sh
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

---

## Ejecucion local

Puedes ejecutar el check localmente sin CI:

```bash
# Desde la raiz de tu proyecto
bash path/to/don-cheli-sdd/scripts/sdd-check.sh

# O con variables personalizadas
INPUT_GATES=spec,tdd INPUT_MIN_COVERAGE=90 bash scripts/sdd-check.sh
```

---

## Custom Gates

Crea gates custom en `.dc/gates/`:

```yaml
# .dc/gates/no-console-log.yml
name: No console.log en produccion
type: grep
pattern: "console\\.log"
files: "src/**/*.ts"
severity: block
message: "console.log detectado. Usa el logger."
```

Ver [custom-gates.md](custom-gates.md) para mas detalles.

---

## Prerequisitos

Tu proyecto debe tener:

1. Un directorio `.dc/` con artefactos SDD (ejecuta `/dc:iniciar` primero)
2. Specs Gherkin en `.dc/specs/`
3. Tests ejecutados con reporte de coverage

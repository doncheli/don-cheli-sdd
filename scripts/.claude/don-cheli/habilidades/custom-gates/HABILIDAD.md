---
name: custom-gates
description: Sistema de quality gates extensible con plugins YAML
version: 1.0.0
tags: [quality, ci-cd, gates, plugins]
grado_libertad: medio
---

# Custom Quality Gates

## Qué hace

Permite a equipos definir sus propias puertas de calidad mediante archivos YAML en `.dc/gates/`.

## Tipos de gate

### grep
Busca patrones regex en archivos del proyecto:
```yaml
type: grep
pattern: "regex_aqui"
files: "src/**/*.ts"
```

### script
Ejecuta un script bash que retorna exit 0 (pass) o exit 1 (fail):
```yaml
type: script
run: |
  tu_comando_aqui
```

## Severidad

- `block` — Bloquea el merge/avance
- `warn` — Advertencia, no bloquea

## Integración

- Se ejecutan automáticamente en `/dc:revisar`
- Se ejecutan en CI/CD via `sdd-check.sh` con `INPUT_GATES=custom`
- Se listan con `/dc:gate listar`

## Directorio

```
.dc/gates/
├── no-console-log.yml
├── no-hardcoded-secrets.yml
└── tu-gate-custom.yml
```

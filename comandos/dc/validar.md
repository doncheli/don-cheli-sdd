---
description: Validar la conformidad de archivos .dc/ y setup del framework. Usa cuando el usuario dice "validar", "validate setup", "validar archivos", "check conformity", "validate Don Cheli", "framework validation", ".dc files", "validación". Verifica que todos los archivos .dc/ cumplan con el schema y las convenciones del framework.
i18n: true
---

# /dc:validar

## Objetivo

Verificar que los archivos de `.dc/` están completos y conformes.

## Uso

```
/dc:validar
```

## Verificaciones

| Archivo | Verificación |
|---------|-------------|
| `config.yaml` | Campos requeridos presentes |
| `estado.md` | Fase válida (1-7), progreso 0-100% |
| `plan.md` | Al menos una fase definida |
| `hallazgos.md` | Formato correcto |
| `progreso.md` | Formato correcto |

## Output

```
=== Validación Don Cheli ===

✅ config.yaml — OK
✅ estado.md — OK (Fase 3, 40%)
⚠️ plan.md — Fases 5-7 sin definir
✅ hallazgos.md — OK (3 entradas)
✅ progreso.md — OK (4 sesiones)

Resultado: 4/5 ✅, 1 advertencia
```

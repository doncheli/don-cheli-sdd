---
description: Test rápido de 5 preguntas para verificar contexto
i18n: true
---

# /dc:donde-estoy

## Objetivo

Ejecutar un test rápido de 5 preguntas para verificar que el contexto de trabajo está completo.

## Uso

```
/dc:donde-estoy
```

## Las 5 Preguntas

| # | Pregunta | Fuente |
|---|----------|--------|
| 1 | ¿Dónde estoy? | `estado.md` |
| 2 | ¿A dónde voy? | `plan.md` |
| 3 | ¿Cuál es la meta? | `config.yaml` |
| 4 | ¿Qué he aprendido? | `hallazgos.md` |
| 5 | ¿Qué he hecho? | `progreso.md` |

## Interpretación

- ✅ 5/5 → Listo para continuar
- ⚠️ 3-4/5 → Proceder con precaución
- ❌ 0-2/5 → Ejecutar `/dc:iniciar --reparar`

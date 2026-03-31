---
description: Capturar ideas y notas sin interrumpir el flujo de trabajo
i18n: true
---

# /dc:capturar

## Objetivo

Fire-and-forget de ideas durante cualquier fase de trabajo. Permite anotar pensamientos, bugs, mejoras o dudas sin pausar la tarea actual. El sistema clasifica automáticamente cada captura.

## Uso

```
/dc:capturar "Deberíamos agregar rate limiting en el login"
/dc:capturar --tipo bug "El endpoint /users devuelve 500 con deviceId vacío"
/dc:capturar --listar
/dc:capturar --procesar
```

## Clasificación Automática

Cada captura se clasifica en una de 5 categorías:

| Categoría | Emoji | Criterio | Acción |
|-----------|-------|----------|--------|
| `quick-task` | ⚡ | Resoluble en < 5 min, sin impacto en tarea actual | Ejecutar al terminar tarea actual |
| `inject` | 💉 | Relevante para la tarea en curso | Incorporar al slice actual |
| `defer` | 📋 | Importante pero no urgente | Agregar al backlog |
| `replan` | 🔄 | Cambia el alcance o la estrategia | Pausar y replantear |
| `note` | 📝 | Observación o aprendizaje | Guardar en conocimiento.md |

## Comportamiento

1. **Capturar** — Agregar entrada a `.especdev/capturas.md` con timestamp y clasificación
2. **No interrumpir** — La tarea actual continúa sin pausa
3. **Procesar** — Al completar la tarea actual (o con `--procesar`), revisar capturas pendientes
4. **Clasificar** — El LLM clasifica automáticamente basándose en el contexto actual
5. **Ejecutar** — Las `quick-task` se ejecutan inmediatamente; las `inject` se incorporan al plan

## Archivo de Capturas

```markdown
# Capturas

## Pendientes

- [2026-03-22 14:30] ⚡ `quick-task` — Agregar rate limiting en login
- [2026-03-22 14:45] 📋 `defer` — Evaluar Sportmonks como segundo provider
- [2026-03-22 15:10] 💉 `inject` — El test de notifications.worker necesita mock de Expo SDK

## Procesadas

- [2026-03-22 13:00] 📝 `note` — Redis KEYS bloquea en producción → usar SCAN ✅
```

## Integración con Pipeline

- Durante `/dc:implementar`: las capturas se revisan al final de cada tarea
- Durante `/dc:revisar`: las capturas tipo `defer` se incluyen como observaciones
- Con `/dc:cerrar-sesion`: las capturas pendientes se transfieren al traspaso

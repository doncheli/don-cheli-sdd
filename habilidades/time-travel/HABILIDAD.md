---
name: time-travel
description: Debugger de razonamiento que registra y visualiza por qué el framework eligió cada modelo, skill y decisión. Permite ajuste dinámico de thresholds.
version: 1.0.0
tags: [reasoning, debugging, audit, transparency]
grado_libertad: medio
---

# Time Travel — Debugging del Razonamiento

## Qué hace

Registra cada decisión del framework (modelo elegido, skill activada, nivel detectado) con su justificación, alternativas descartadas y nivel de confianza. Permite navegar el historial como una línea de tiempo.

## Qué registra

Por cada decisión:
- Timestamp y fase activa
- Decisión tomada y razón
- Alternativas consideradas y por qué se descartaron
- Modelo usado y por qué ese modelo
- Nivel de confianza (0-1)
- Skill que disparó la decisión

## Almacenamiento

- `.dc/reasoning-log.json` — Log de decisiones de la sesión actual
- `.dc/reasoning-config.yaml` — Thresholds ajustables
- `.dc/reasoning-sessions/` — Histórico por sesión

## Integración

- Se alimenta de: `routing-modelos`, `razonamiento`, `contabilidad-tokens`
- Se visualiza en: `/dc:dashboard` (sección Reasoning)
- Se audita con: `/dc:audit-trail`
- Se ajusta con: `/dc:time-travel --ajustar`

## Activación

Se activa automáticamente cuando la habilidad está instalada.
Cada decisión se registra transparentemente sin impacto en performance.

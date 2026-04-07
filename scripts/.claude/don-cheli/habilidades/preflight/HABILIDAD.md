---
name: preflight
description: Simulador de costos y tokens pre-ejecución. Estima consumo antes de ejecutar fases para control de presupuesto en equipos.
version: 1.0.0
tags: [cost, tokens, budget, estimation, preflight]
grado_libertad: bajo
---

# Pre-Flight — Simulación de Costos

## Qué hace

Estima tokens y costo monetario que consumirá una fase o tarea ANTES de ejecutarla. Permite a equipos controlar presupuesto y optimizar uso de modelos.

## Cálculo

- Base tokens por fase (3K-12K según tipo)
- Multiplicador por complejidad del proyecto
- Costo por modelo (haiku/sonnet/opus con precios actuales)
- Calibración con historial de sesiones previas

## Alertas

- Si estimación excede presupuesto → alerta con recomendaciones de optimización
- Sugiere cambios de modelo (opus→sonnet, sonnet→haiku) para reducir costo
- Compara estimado vs real para mejorar precisión

## Configuración

En `.dc/config.yaml`:

```yaml
preflight:
  habilitado: true
  presupuesto_default: 10.00
  alertar_al_superar: true
```

## Activación

Se ejecuta automáticamente antes de `/dc:implementar` y `/dc:revisar` cuando está habilitado.

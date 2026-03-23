---
nombre: Routing Dinámico de Modelos
descripcion: Seleccionar automáticamente el modelo más eficiente para cada tarea basándose en heurísticas
version: 1.0.0
autor: Don Cheli
tags: [optimizacion, tokens, modelos, costos]
---

# Routing Dinámico de Modelos

## Propósito

Seleccionar automáticamente el modelo de IA más eficiente (haiku/sonnet/opus) para cada tarea, sin intervención del usuario. Downgrade-only: nunca sube de modelo automáticamente, solo baja.

## Heurísticas de Clasificación

### Por tipo de tarea (keywords)

| Keywords detectados | Modelo sugerido | Razón |
|---------------------|-----------------|-------|
| "format", "rename", "reorder", "sort", "lint" | haiku | Transformación mecánica |
| "summarize", "extract", "list", "count" | haiku | Extracción de información |
| "generate test", "scaffold", "boilerplate" | haiku→sonnet | Generación con template |
| "implement", "fix bug", "add feature", "refactor" | sonnet | Generación de código |
| "review", "analyze", "audit", "design" | sonnet | Análisis |
| "architecture", "security", "migration", "concurrency" | opus | Razonamiento complejo |

### Por métricas cuantitativas

| Métrica | haiku | sonnet | opus |
|---------|-------|--------|------|
| Archivos afectados | 1-2 | 3-10 | 10+ |
| Steps en el plan | 1-3 | 4-8 | 8+ |
| Dependencias cruzadas | 0 | 1-3 | 3+ |

### Por presión de budget

| % budget usado | Acción |
|----------------|--------|
| < 50% | Sin cambio |
| 50-75% | Downgrade: opus→sonnet donde posible |
| 75-90% | Downgrade: sonnet→haiku donde posible |
| > 90% | Solo haiku (salvo seguridad/arquitectura) |

## Escalation on Failure

Si una tarea falla con el modelo seleccionado (e.g., haiku genera código incorrecto):
1. Registrar fallo en `.especdev/routing-history.json`
2. Reintentar con el siguiente modelo superior
3. Actualizar heurística para esa categoría de tarea

## Historial de Routing

```json
{
  "decisions": [
    {
      "task": "T045",
      "description": "Implementar matches.controller",
      "suggested": "sonnet",
      "actual": "sonnet",
      "success": true,
      "tokens": 4200
    }
  ],
  "failure_rate_by_tier": {
    "haiku": 0.12,
    "sonnet": 0.03,
    "opus": 0.01
  }
}
```

## Integración

- Se ejecuta automáticamente al inicio de cada tarea en `/especdev:implementar`
- El usuario puede override con `--modelo opus` en cualquier comando
- Se reporta en `/especdev:cerrar-sesion` y `proyecciones-costo`
- Nunca overridea la regla: "Opus requiere confirmación del usuario"

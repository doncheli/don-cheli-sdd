---
name: metricas-sesion
description: Telemetría local de eficiencia SDD con tracking de TDD, estimaciones y quality gates
version: 1.0.0
tags: [telemetry, metrics, dashboard, reporting]
grado_libertad: bajo
---

# Métricas de Sesión

## Qué hace

Registra automáticamente métricas de cada sesión SDD en `.dc/metrics.json` para tracking de eficiencia.

## Datos que captura

### Por sesión
- Timestamp inicio/fin
- Duración
- Fase alcanzada (1-6)
- Quality gates: aprobadas/rechazadas
- Cobertura alcanzada
- Stubs detectados

### Por feature
- Escenarios Gherkin generados
- Tareas TDD completadas
- Ciclos RED→GREEN
- Estimado vs real (si se usó /dc:estimar)

### Acumulado
- Total sesiones
- Promedios por fase
- Tendencias de cobertura
- Precisión de estimaciones

## Formato de metrics.json

```json
{
  "version": "1.0.0",
  "project": "mi-proyecto",
  "sessions": [
    {
      "id": "2026-04-01-001",
      "start": "2026-04-01T10:00:00Z",
      "end": "2026-04-01T10:45:00Z",
      "duration_min": 45,
      "phase_reached": 6,
      "gates_passed": 6,
      "gates_total": 6,
      "coverage": 91,
      "stubs_found": 1,
      "stubs_fixed": 1,
      "tdd_cycles": 7,
      "tdd_first_pass": 6
    }
  ],
  "features": [],
  "estimates": []
}
```

## Activación

Se activa automáticamente cuando la habilidad está instalada.
Se registra al ejecutar `/dc:cerrar-sesion`.

## Visualización

- `/dc:metricas` — Resumen en terminal
- `/dc:dashboard` — Dashboard HTML interactivo

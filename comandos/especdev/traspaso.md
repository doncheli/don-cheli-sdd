---
description: Generar handoff de contexto para transferencia de sesión entre equipos. Usa cuando el usuario dice "traspaso", "handoff", "context transfer", "session handoff", "context switch", "team transfer", "context handover". Genera handoff completo con estado, decisiones, pendientes y contexto para recibir el equipo.
i18n: true
---

# /dc:traspaso

## Objetivo

Generar un documento estructurado para transferir contexto entre sesiones o agentes.

## Uso

```
/dc:traspaso
/dc:traspaso --guardar
/dc:traspaso --formato md
/dc:traspaso --destino agente
```

## Output

```xml
<traspaso_contexto>
  <metadatos>
    <proyecto>api-pagos</proyecto>
    <fecha>2026-03-21T15:30:00Z</fecha>
  </metadatos>
  <tarea_original>Implementar API de pagos</tarea_original>
  <trabajo_completado>
    - Spec Gherkin creada
    - Blueprint técnico generado
  </trabajo_completado>
  <trabajo_pendiente>
    - Implementar endpoint de cobro
    - Agregar tests de integración
  </trabajo_pendiente>
  <estado_actual>
    Fase: 4/7
    Progreso: 55%
  </estado_actual>
</traspaso_contexto>
```

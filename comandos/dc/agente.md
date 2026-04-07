---
description: Cargar un agente especializado para una tarea específica. Usa cuando el usuario dice "cargar agente", "usar agente", "specialist agent", "spawn agent", "subagent", "agente especializado", "run agent", "delegar a agente". Detecta el tipo de agente necesario (Explore, Plan, general-purpose) y spawnea el subagent apropiado.
i18n: true
---

# /dc:agente

## Objetivo

Cargar un agente especializado con el modelo óptimo para una tarea específica.

## Uso

```
/dc:agente <nombre>
/dc:agente restablecer
```

## Agentes Disponibles

| Agente | Modelo | Rol |
|--------|--------|-----|
| `planificador` | opus | Planificación, descomposición de tareas |
| `arquitecto` | opus | Diseño de sistemas, decisiones técnicas |
| `ejecutor` | sonnet | Implementación, escritura de código |
| `revisor` | opus | Revisión de código, validación de calidad |
| `tester` | sonnet | Escritura y ejecución de tests |
| `documentador` | haiku | Actualización de documentación |
| `estimador` | opus | Estimados de desarrollo y esfuerzo |

## Flujo de Trabajo

```
Modo Completo: planificador → arquitecto → ejecutor ↔ tester → revisor → documentador
Modo Rápido:   ejecutor → tester → documentador
```

## Ahorro de Costos

| Modo | Distribución | Ahorro vs Opus-solo |
|------|--------------|---------------------|
| Rápido | 80% sonnet, 20% haiku | ~60% |
| Completo | 50% sonnet, 30% opus, 20% haiku | ~40% |

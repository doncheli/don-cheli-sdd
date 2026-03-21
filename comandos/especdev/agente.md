---
description: Cargar un agente especializado para una tarea específica
---

# /especdev:agente

## Objetivo

Cargar un agente especializado con el modelo óptimo para una tarea específica.

## Uso

```
/especdev:agente <nombre>
/especdev:agente restablecer
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

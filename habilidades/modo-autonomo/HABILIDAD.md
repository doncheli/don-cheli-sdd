---
name: modo-autonomo
description: Orquestador autónomo que ejecuta el pipeline SDD completo spawneando agentes frescos por fase. Anti-context-rot con persistencia en disco y crash recovery.
version: 1.0.0
tags: [autonomous, orchestrator, auto, agents, context-rot, pipeline]
grado_libertad: alto
---

# Modo Autónomo — Orquestador Anti-Context-Rot

## Qué hace

Ejecuta el pipeline SDD completo **sin intervención humana**, spawneando un **agente fresco por fase** para evitar degradación del contexto.

## Problema que resuelve

El **context rot** es el enemigo #1 de los frameworks SDD: después de 3-4 fases en el mismo contexto, el LLM pierde precisión. Don Cheli resuelve esto con:

1. **Agentes frescos** — Cada fase inicia con contexto 100% limpio
2. **Disco como memoria** — Los artefactos se persisten en `.dc/` entre fases
3. **Orquestador liviano** — Solo coordina, mantiene <40% del contexto ocupado
4. **Checkpoints** — Si algo falla, resume desde la última fase completada

## Arquitectura

```
Orquestador (contexto al 30-40%)
  │
  ├── Lee state.json → decide próxima fase
  ├── Spawna agente fresco para la fase
  ├── El agente lee artefactos de disco (.dc/)
  ├── El agente ejecuta y escribe output a disco
  ├── Orquestador verifica quality gate
  └── Si pasa → avanza. Si falla → retry (max 3)
```

## Context Budget por fase

| Fase | Contexto del agente | Input (lee de disco) | Output (escribe a disco) |
|------|--------------------|-----------------------|--------------------------|
| Research | 200K fresco | Codebase | .dc/auto/research.md |
| Specify | 200K fresco | research.md | .dc/specs/*.feature + openapi.yaml |
| Plan | 200K fresco | specs, research | .dc/blueprints/*.md |
| Breakdown | 200K fresco | blueprint | .dc/tareas/*.md |
| Implement | 200K fresco × N | 1 tarea + archivos | código + tests |
| Review | 200K fresco | todo | .dc/reviews/*.md |

## Activación

```bash
/dc:auto "descripción de la tarea"
```

Se activa automáticamente cuando la habilidad está instalada y el usuario invoca `/dc:auto`.

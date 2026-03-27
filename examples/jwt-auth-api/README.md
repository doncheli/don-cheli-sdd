# Ejemplo: jwt-auth-api

Proyecto de ejemplo que ilustra el ciclo de vida completo de Don Cheli SDD.
Muestra cómo se ven los artefactos del pipeline **después** de completar todas las fases.

## Qué es este proyecto

Una API de autenticación JWT (Node.js/Express) construida siguiendo las 7 fases del framework.
No contiene código fuente — solo los artefactos `.especdev/` que guiaron su construcción.

## Pipeline ejecutado

```
/dc:specify  →  .especdev/specs/auth.feature
/dc:clarify  →  ambigüedades resueltas (en el blueprint)
/dc:tech-plan → .especdev/blueprints/auth-blueprint.md
/dc:breakdown → .especdev/tareas/auth-tasks.md
/dc:implement → código fuente (no incluido en este ejemplo)
/dc:review   →  .especdev/estado.md (6/6 quality gates)
```

## Archivos de este ejemplo

| Archivo | Fase | Descripción |
|---------|------|-------------|
| `.especdev/config.yaml` | Inicio | Configuración del proyecto |
| `.especdev/specs/auth.feature` | Especificación | Gherkin BDD con 6 escenarios |
| `.especdev/blueprints/auth-blueprint.md` | Diseño técnico | Stack, arquitectura, endpoints |
| `.especdev/tareas/auth-tasks.md` | Breakdown | 6 tareas TDD en orden RED→GREEN |
| `.especdev/estado.md` | Estado final | Review completado, 92% cobertura |

## Resultado

- 6 escenarios Gherkin (4 happy path, 2 sad path + 1 edge case P2)
- Blueprint con 3 capas: routes → services → repositories
- 6 tareas TDD con marcadores de paralelismo
- 92% de cobertura de tests — 6/6 quality gates pasados

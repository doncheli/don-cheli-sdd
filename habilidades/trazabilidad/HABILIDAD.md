---
nombre: Pipeline de Trazabilidad
descripcion: "Mantener trazabilidad completa entre requisitos, specs, código y tests en todo el pipeline"
version: 1.0.0
autor: Don Cheli
tags: [trazabilidad, calidad, gherkin, pipeline]
activacion: "trazabilidad", "de dónde viene este requisito", "rastrear cambio"
---

# Habilidad: Pipeline de Trazabilidad

**Versión:** 1.0.0
**Categoría:** Calidad
**Tipo:** Rígida

> Adaptado de Specular: "Cada línea de código se traza hasta un escenario Gherkin."

## Cómo Mejora el Framework

La trazabilidad garantiza que **nada se inventa de la nada**. Cada línea de código puede rastrearse hasta:
1. Un Escenario Gherkin (`.feature`)
2. Que a su vez viene de un Requerimiento del usuario
3. Que a su vez fue clarificado (sin ambigüedades)

## Matriz de Trazabilidad

```
Requerimiento → .feature (Gherkin) → .plan.md (Blueprint) → .tasks.md (Tareas) → Código → Tests
      │                │                    │                      │              │        │
      └────────────────┴────────────────────┴──────────────────────┴──────────────┴────────┘
                    Todo se traza hacia atrás hasta el requerimiento original
```

## Artefactos Trazables

| Artefacto | Formato | Trazable a |
|-----------|---------|------------|
| `Feature.feature` | Gherkin | Requerimiento original |
| `Feature.plan.md` | Markdown | Escenarios en .feature |
| `Feature.tasks.md` | Markdown | Contratos en .plan.md |
| Código fuente | Lenguaje | Tareas en .tasks.md |
| Tests | Frameworks | Escenarios en .feature |
| `review.md` | Markdown | Todo lo anterior |

## Tags de Estado

| Tag | Significado | Quién lo Pone |
|-----|-------------|---------------|
| `@borrador` | Spec en progreso, no lista | `/dc:especificar` |
| `@clarificada` | Ambigüedades resueltas | `/dc:clarificar` |
| `@lista` | Aprobada para implementación | Puerta de Calidad |
| `@implementada` | Código escrito y tests pasan | `/dc:implementar` |
| `@provisional` | Schema DBML no ratificado | Auto-generado |

## Propiedad de Archivos

| El Framework Posee | Tú Posees |
|---------------------|-----------|
| `.dc/` (config, templates) | `specs/features/*` (tus specs) |
| `comandos/` (slash commands) | `specs/db_schema/*` (tus schemas) |
| `habilidades/` (skills) | `app/*` / `src/*` (tu código) |
| `reglas/` (rules) | `tests/*` (tus tests) |
| `plantillas/` (templates) | `CLAUDE.md` (tus instrucciones) |

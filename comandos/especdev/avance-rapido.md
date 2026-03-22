---
description: Crear todos los artefactos de planificación de un golpe (fast-forward)
---

# /especdev:avance-rapido

## Objetivo

Crear TODOS los artefactos de planificación de una vez cuando el alcance es claro. En vez de ir paso a paso (proponer → especificar → diseñar → desglosar), este comando genera todo de un golpe.

> Adaptado de `/opsx:ff` (fast-forward) de OpenSpec.

## Uso

```
/especdev:avance-rapido <nombre-del-cambio>
/especdev:avance-rapido agregar-dark-mode
```

## Cuándo Usar

| Situación | Comando |
|-----------|---------|
| Sabes exactamente qué quieres | `/especdev:avance-rapido` ← ESTE |
| Requisitos poco claros, necesitas investigar | `/especdev:explorar` primero |
| Quieres ir paso a paso revisando | `/especdev:proponer` + `/especdev:continuar` |

## Comportamiento

1. **Crear** carpeta de cambio en `.especdev/cambios/<nombre>/`
2. **Generar** propuesta.md (intención, alcance, enfoque)
3. **Generar** specs/ (delta specs con requisitos y escenarios)
4. **Generar** diseño.md (decisiones de arquitectura)
5. **Generar** tareas.md (desglose TDD)
6. **Reportar** resumen

## Output

```
=== Avance Rápido: agregar-dark-mode ===

📁 Carpeta: .especdev/cambios/agregar-dark-mode/

✅ propuesta.md — Intención y alcance definidos
✅ specs/ui-tema.delta.md — 3 requisitos, 7 escenarios
✅ diseño.md — 2 decisiones de arquitectura
✅ tareas.md — 4 fases, 8 tareas

¡Listo para implementar!
→ /especdev:aplicar agregar-dark-mode
```

## Pipeline Rápido vs Completo

```
RÁPIDO (scope claro):
/especdev:avance-rapido → /especdev:aplicar → /especdev:archivar

COMPLETO (scope incierto):
/especdev:explorar → /especdev:proponer → /especdev:especificar
→ /especdev:clarificar → /especdev:diseñar → /especdev:desglosar
→ /especdev:implementar → /especdev:revisar → /especdev:archivar
```

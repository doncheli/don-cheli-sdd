---
description: Crear todos los artefactos de planificación de un golpe (fast-forward)
i18n: true
---

# /dc:avance-rapido

## Objetivo

Crear TODOS los artefactos de planificación de una vez cuando el alcance es claro. En vez de ir paso a paso (proponer → especificar → diseñar → desglosar), este comando genera todo de un golpe.

> Adaptado de `/opsx:ff` (fast-forward) de OpenSpec.

## Uso

```
/dc:avance-rapido <nombre-del-cambio>
/dc:avance-rapido agregar-dark-mode
```

## Cuándo Usar

| Situación | Comando |
|-----------|---------|
| Sabes exactamente qué quieres | `/dc:avance-rapido` ← ESTE |
| Requisitos poco claros, necesitas investigar | `/dc:explorar` primero |
| Quieres ir paso a paso revisando | `/dc:proponer` + `/dc:continuar` |

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
→ /dc:aplicar agregar-dark-mode
```

## Pipeline Rápido vs Completo

```
RÁPIDO (scope claro):
/dc:avance-rapido → /dc:aplicar → /dc:archivar

COMPLETO (scope incierto):
/dc:explorar → /dc:proponer → /dc:especificar
→ /dc:clarificar → /dc:diseñar → /dc:desglosar
→ /dc:implementar → /dc:revisar → /dc:archivar
```

---
nombre: Estimación de Desarrollo
descripcion: "Estimar esfuerzo de desarrollo con 4 modelos: Puntos de Función, Planning Poker IA, COCOMO, Histórico"
version: 1.0.0
autor: Don Cheli
tags: [planificación, estimación, COCOMO, planning-poker, esfuerzo]
activacion: "estimar esfuerzo", "cuánto tiempo toma", "planning poker", "estimación"
---

# Habilidad: Estimación de Desarrollo

**Versión:** 1.0.0
**Categoría:** Planificación
**Tipo:** Flexible

## Propósito

Generar estimados de desarrollo profesionales usando múltiples modelos en paralelo.

## Modelos de Estimación

### 1. Puntos de Función
Evalúa complejidad funcional. Mejor para features nuevas.

### 2. Planning Poker IA
3 agentes independientes estiman la misma tarea. Fórmula PERT: `(O + 4M + P) / 6`

### 3. COCOMO Simplificado
Basado en LOC estimadas. Mejor para proyectos grandes.

### 4. Histórico
Compara con tareas similares completadas. Mejor para equipos maduros.

## Flujo

```
Input (PRD/Feature/Tarea)
    │
    ├─ Desglosar en componentes
    ├─ Aplicar 4 modelos
    ├─ Calcular consenso
    ├─ Identificar riesgos
    └─ Generar estimado-[fecha].md
```

## Template de Salida

Ver [`plantillas/estimado-desarrollo.md`](../../plantillas/estimado-desarrollo.md)

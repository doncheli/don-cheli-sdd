---
nombre: Desarrollo por Subagentes
descripcion: "Dividir tareas complejas en subtareas y asignarlas a subagentes paralelos con el modelo adecuado"
version: 1.0.0
autor: Don Cheli
tags: [orquestación, subagentes, paralelismo, agentes, SDD]
activacion: "subagentes", "dividir tarea", "paralelizar", "agentes en paralelo"
---

# Habilidad: Desarrollo por Subagentes (SDD)

**Versión:** 1.0.0
**Categoría:** Orquestación
**Tipo:** Rígida

## Propósito

Transformar ejecución monolítica en flujos de trabajo multi-agente orquestados.

## El Problema

La ejecución con un solo agente tiene limitaciones:
- **Contaminación de contexto:** Sesiones largas acumulan contexto irrelevante
- **Confusión de roles:** Mismo agente planifica, implementa y revisa
- **Sin perspectiva fresca:** Auto-revisión es menos efectiva

## La Solución SDD

```
Controlador (Opus)
    │
    ├── Planifica tareas
    ├── Cura contexto por tarea
    ├── Despacha a subagentes
    ├── Revisa resultados
    └── Integra trabajo

Ejecutor (Sonnet)           Revisor (Opus)
    │                           │
    ├── Contexto fresco        ├── Contexto fresco
    ├── Foco en una tarea      ├── Revisión independiente
    └── Retorna estado         └── Evaluación de calidad
```

## Principios

1. **El controlador NUNCA implementa**
2. **Cada subagente recibe contexto fresco**
3. **El contexto se cura, no se vuelca**
4. **Revisión de dos etapas es obligatoria**
5. **Máximo 3 rondas de revisión**

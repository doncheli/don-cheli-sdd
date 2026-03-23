---
nombre: Generador de Specs
descripcion: "Generar especificaciones Gherkin automáticamente desde descripciones de features en lenguaje natural"
version: 1.0.0
autor: Don Cheli
tags: [especificación, gherkin, BDD, features, specs]
activacion: "generar spec", "escribir gherkin", "crear feature file"
---

# Habilidad: Generador de Specs (Pipeline Gherkin)

**Versión:** 1.0.0
**Categoría:** Especificación

## Propósito

Convertir requerimientos en lenguaje natural a especificaciones Gherkin trazables.

## Pipeline

```
especificar → clarificar → planificar-tecnico → desglosar → bucle → revisar
```

## Formato Feature

```gherkin
Feature: [Nombre]
  Como [rol]
  Quiero [acción]
  Para [beneficio]

  Escenario: [nombre]
    Dado que [precondición]
    Cuando [acción]
    Entonces [resultado esperado]
```

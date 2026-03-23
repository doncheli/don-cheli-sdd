---
nombre: Reflexión
descripcion: "Auto-evaluar la calidad del trabajo antes de entregar. Mejora calidad en +8-21%"
version: 1.0.0
autor: Don Cheli
tags: [calidad, reflexión, auto-evaluación, revisión]
activacion: "reflexionar", "auto-evaluar", "revisar mi trabajo"
---

# Habilidad: Reflexión

**Versión:** 1.0.0
**Categoría:** Calidad

## Propósito

Mejorar calidad de output (+8-21%) mediante auto-reflexión estructurada.

## Las 4 Preguntas

1. ¿Qué funcionó bien?
2. ¿Qué se puede mejorar?
3. ¿Qué aprendí?
4. ¿Qué haría diferente?

## Modo Adversarial

Cuando se activa el modo adversarial (automáticamente en `/especdev:revisar` o manualmente con `--adversarial`):

1. **Obligación de hallazgo:** DEBE encontrar al menos 1 problema concreto. "Todo bien" no es aceptable.
2. **Re-examinación forzada:** Si la primera pasada no encuentra nada, ejecutar una segunda con estos ángulos:
   - ¿Hay race conditions en operaciones concurrentes?
   - ¿Hay N+1 queries en loops con DB?
   - ¿Hay edge cases no cubiertos por tests?
   - ¿Hay datos sensibles en logs o responses?
   - ¿Hay naming inconsistente con el resto del codebase?
3. **Justificación obligatoria:** Si genuinamente no hay problemas, documentar por qué con evidencia específica (no genérica).

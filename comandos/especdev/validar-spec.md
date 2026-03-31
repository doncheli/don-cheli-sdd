---
description: Validar la calidad y completitud de una especificación antes de planificar
i18n: true
---

# /dc:validar-spec

## Objetivo

Ejecutar una validación multi-capa sobre las especificaciones ANTES de desglosar en tareas. Detecta problemas que `/dc:clarificar` no cubre: implementation leakage, measurability, completeness, y adherencia a la constitución del proyecto.

Inspirado en los 13 pasos de validación del framework BMAD.

## Uso

```
/dc:validar-spec                              # Validar todas las specs activas
/dc:validar-spec @specs/features/auth/         # Validar un dominio
/dc:validar-spec --strict                      # Modo estricto (0 warnings permitidos)
```

## Validaciones (8 checks)

| # | Check | Qué detecta | Severidad |
|---|-------|-------------|-----------|
| 1 | **Implementation Leakage** | ¿La spec menciona tecnologías donde no debería? (WHAT vs HOW) | 🔴 Error |
| 2 | **Measurability** | ¿Los criterios de aceptación son medibles y verificables? | 🟠 Warning |
| 3 | **Completeness** | ¿Hay happy path + sad paths + edge cases para cada scenario? | 🔴 Error |
| 4 | **Traceability** | ¿Cada requisito tiene al menos un escenario que lo cubre? | 🔴 Error |
| 5 | **Constitution Adherence** | ¿La spec respeta los principios de constitucion-proyecto.md? | 🔴 Error |
| 6 | **Consistency** | ¿Hay contradicciones entre escenarios o entre features? | 🟠 Warning |
| 7 | **Ambiguity** | ¿Hay términos ambiguos o no definidos? (complementa clarificar) | 🟠 Warning |
| 8 | **Scope Alignment** | ¿La spec está dentro del alcance definido en la propuesta? | 🟠 Warning |

## Output

```
📋 Validación de Spec: demo-sdd

✅ PASS: Implementation Leakage (0 violaciones)
✅ PASS: Completeness (todos los escenarios tienen happy + sad path)
⚠️  WARN: Measurability — 2 criterios sin umbral cuantificable
  - VerPartidosEnVivo.feature:45 — "respuesta rápida" → ¿cuántos ms?
  - PrediccionesIA.feature:32 — "precisión aceptable" → ¿qué porcentaje?
✅ PASS: Traceability (100% de requisitos cubiertos)
✅ PASS: Constitution Adherence
✅ PASS: Consistency
⚠️  WARN: Ambiguity — 1 término sin definir
  - "usuario premium" usado en 3 features pero no definido en ninguna
✅ PASS: Scope Alignment

Resultado: ⚠️ PASA CON WARNINGS (2 warnings, 0 errores)
→ Corregir warnings antes de /dc:desglosar para máxima calidad
```

## Integración

Se ejecuta automáticamente como sub-puerta de la **Puerta 3 (Clarificación)** cuando se usa el pipeline completo. También se puede ejecutar manualmente en cualquier momento.

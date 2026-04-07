---
description: Detectar ambigüedades y contradicciones en specs de forma exhaustiva. Usa cuando el usuario dice "detectar ambigüedad", "spec contradictions", "vague requirements", "spec gaps", "ambigüedad", "contradiction in specs", "inconsistency", "fuzzy spec", "req ambiguity". Análisis exhaustivo línea por línea buscando gaps, contradictions y vagueness.
i18n: true
---

# /dc:detectar-ambiguedad

## Objetivo

Escanear specs en busca de ambigüedades, contradicciones, requisitos implícitos y campos faltantes. Va más allá de la clarificación básica — es un análisis exhaustivo de la calidad de la spec.

> Basado en la práctica de MELI: "La ambigüedad es el bottleneck #1 del AI coding."

## Uso

```
/dc:detectar-ambiguedad @specs/features/<dominio>/<Feature>.feature
/dc:detectar-ambiguedad --todos   # Escanear todas las specs activas
```

## Qué Detecta

### 1. Ambigüedades Lingüísticas
- Pronombres sin referente claro ("esto se envía", "eso se valida")
- Cuantificadores vagos ("algunos", "varios", "muchos")
- Verbos pasivos sin sujeto ("será procesado", "se debe validar")

### 2. Contradicciones Internas
- Escenario A dice "email obligatorio", Escenario B no lo valida
- Plan dice "async", tasks dice "sync"
- Schema dice `NOT NULL`, spec no tiene escenario de validación

### 3. Requisitos Implícitos No Documentados
- "El usuario se registra" → ¿Qué pasa con confirmación por email?
- "Se guarda en BD" → ¿Qué campos son obligatorios?
- "Se envía notificación" → ¿A quién? ¿Cuándo? ¿Cómo?

### 4. Gaps de Cobertura
- Happy path sin sad path correspondiente
- Campos en DBML sin validación en Gherkin
- Endpoints sin manejo de errores

## Output

```markdown
=== Análisis de Ambigüedad ===

Feature: GestionarPedidos.feature
Score de Claridad: 72/100

## 🔴 Contradicciones (3)
1. Línea 15: "el pedido se crea" vs Línea 42: "el pedido requiere aprobación"
   → ¿Se crea directo o necesita aprobación?
2. Línea 23: campo "estado" acepta "activo" vs DBML: enum no incluye "activo"
3. Escenario 3 y Escenario 7 usan distinto formato de fecha

## 🟡 Ambigüedades (5)
1. Línea 8: "se notifica al usuario" → ¿email? ¿push? ¿in-app?
2. Línea 31: "se valida el pago" → ¿qué proveedor? ¿qué criterios?
3. Línea 45: "datos del cliente" → ¿cuáles exactamente?
4. Línea 52: "en tiempo razonable" → ¿cuánto es razonable?
5. Línea 67: "se procesa" → ¿quién? ¿cuándo? ¿cómo?

## 🟢 Requisitos Implícitos Detectados (2)
1. No hay escenario para cancelar pedido después de pago
2. No hay manejo de timeout en validación de pago

## Recomendaciones
- Resolver contradicciones ANTES de avanzar a fase Plan
- Score mínimo recomendado: 85/100
- Score actual: 72/100 → NO AVANZAR
```

## Score de Claridad

| Rango | Clasificación | Acción |
|-------|--------------|--------|
| 90-100 | Cristalino | ✅ Avanzar |
| 80-89 | Claro | ✅ Avanzar con notas |
| 70-79 | Aceptable | ⚠️ Resolver ambigüedades primero |
| <70 | Ambiguo | ❌ NO avanzar, reescribir |

---
description: Puntuación cuantitativa de calidad de especificaciones (0-100) con 8 métricas basadas en IEEE 830 / ISO 29148
i18n: true
---

# /especdev:spec-score

## Objetivo

Evaluar la calidad de una especificación con una puntuación cuantitativa de 0 a 100, usando 8 métricas ponderadas. Compara contra los estándares IEEE 830 e ISO 29148. Produce un informe con radar chart descriptivo y tabla de desglose accionable.

## Uso

```
/especdev:spec-score                               # Evaluar spec del proyecto actual
/especdev:spec-score @docs/specs/checkout/spec.md # Evaluar un archivo específico
/especdev:spec-score --historia US-042             # Evaluar una historia de usuario
/especdev:spec-score --umbral 80                   # Cambiar umbral de aprobación
/especdev:spec-score --comparar main               # Comparar contra versión en main
/especdev:spec-score --formato ejecutivo           # Reporte simplificado para PMs
```

## Las 8 Métricas

| # | Métrica | Peso | Descripción |
|---|---------|------|-------------|
| 1 | **Completitud** | 15% | ¿Cubre todos los escenarios? ¿Tiene happy path + edge cases? |
| 2 | **Medibilidad** | 15% | ¿Los criterios de aceptación son verificables y cuantificables? |
| 3 | **Ausencia de ambigüedad** | 15% | ¿Usa lenguaje preciso? ¿Evita "rápido", "fácil", "adecuado"? |
| 4 | **Testeabilidad** | 15% | ¿Se puede escribir un test automatizado para cada criterio? |
| 5 | **Consistencia** | 12% | ¿Contradice otras specs del sistema? ¿Usa terminología uniforme? |
| 6 | **Atomicidad** | 12% | ¿Cada requisito expresa una sola cosa? ¿Sin requisitos compuestos? |
| 7 | **Trazabilidad** | 8% | ¿Tiene ID único? ¿Referencia al objetivo de negocio que lo origina? |
| 8 | **Independencia** | 8% | ¿Puede implementarse sin depender de specs aún no definidas? |

## Umbrales de Calidad

| Rango | Nivel | Acción |
|-------|-------|--------|
| 90-100 | Excelente | Lista para implementar |
| 80-89 | Buena | Revisar observaciones menores |
| 60-79 | Necesita trabajo | Corregir antes de implementar |
| 0-59 | Rechazada | Reescribir con `/especdev:especificar` |

## Comportamiento

1. **Cargar spec** del archivo o historia indicada

2. **Evaluar cada métrica** (0-100 por métrica):

   **Completitud** — buscar:
   - Happy path documentado
   - Al menos 2 edge cases
   - Comportamiento en error definido
   - Pre y post condiciones presentes

   **Medibilidad** — buscar:
   - Criterios con valores numéricos o booleanos
   - Ausencia de adjetivos subjetivos
   - SLAs explícitos si aplica (tiempo de respuesta, uptime)

   **Ausencia de ambigüedad** — detectar palabras ambiguas:
   - "rápido", "eficiente", "fácil", "adecuado", "generalmente", "usualmente"
   - Pronombres sin referente claro ("el sistema lo procesará")
   - Condicionales indefinidos ("si es necesario")

   **Testeabilidad** — verificar:
   - Cada "Given/When/Then" es automatable
   - Datos de prueba identificables
   - Resultado esperado es determinístico

   **Consistencia** — comparar:
   - Terminología contra glosario del proyecto
   - Lógica contra specs relacionadas
   - Ausencia de contradicciones internas

   **Atomicidad** — detectar:
   - Requisitos con "y" que deberían ser dos requisitos
   - Criterios que mezclan funcionalidad y no-funcionalidad

   **Trazabilidad** — verificar:
   - ID único presente (US-XXX, REQ-XXX)
   - Link a objetivo de negocio o épica
   - Autor y fecha de última actualización

   **Independencia** — verificar:
   - No depende de specs marcadas como "pendiente"
   - Puede implementarse en un sprint sin bloqueantes

3. **Calcular puntuación final** como promedio ponderado

4. **Generar radar chart** en texto y tabla de desglose

5. **Listar observaciones accionables** por métrica

## Output

```markdown
## Spec Score: US-042 — Checkout con tarjeta de crédito

**Puntuación Final: 74 / 100** — Necesita trabajo

### Radar Chart

```
Completitud     [████████░░] 80
Medibilidad     [██████░░░░] 62
Sin ambigüedad  [████░░░░░░] 45  ← Crítico
Testeabilidad   [████████░░] 78
Consistencia    [█████████░] 90
Atomicidad      [███████░░░] 72
Trazabilidad    [████████░░] 85
Independencia   [█████░░░░░] 55
```

### Desglose de Métricas

| Métrica | Puntaje | Peso | Contribución | Estándar IEEE 830 |
|---------|---------|------|-------------|-------------------|
| Completitud | 80 | 15% | 12.0 | Sección 4.3.1: Complete |
| Medibilidad | 62 | 15% | 9.3 | Sección 4.3.2: Verifiable |
| Sin ambigüedad | 45 | 15% | 6.8 | Sección 4.3.1: Unambiguous |
| Testeabilidad | 78 | 15% | 11.7 | ISO 29148: Verifiable |
| Consistencia | 90 | 12% | 10.8 | Sección 4.3.1: Consistent |
| Atomicidad | 72 | 12% | 8.6 | ISO 29148: Singular |
| Trazabilidad | 85 | 8% | 6.8 | Sección 4.3.1: Traceable |
| Independencia | 55 | 8% | 4.4 | ISO 29148: Feasible |
| **TOTAL** | — | 100% | **70.4** | |

### Observaciones Accionables

#### 🔴 Sin ambigüedad (45) — Crítico
- Línea 12: "el pago debe procesarse rápidamente" → definir SLA: "en menos de 3 segundos"
- Línea 18: "el sistema mostrará un mensaje adecuado" → especificar el mensaje exacto
- Línea 24: "generalmente se aplicará el descuento" → eliminar "generalmente", definir condición exacta

#### 🟠 Independencia (55) — Alto
- Criterio AC-3 depende de US-031 (gestión de tarjetas guardadas) que está en estado Borrador
- Opción: desacoplar AC-3 en historia separada o esperar US-031

#### 🟡 Medibilidad (62) — Medio
- AC-2 no especifica comportamiento en timeout de pasarela de pago
- AC-5 menciona "retry automático" sin definir número de intentos ni intervalo

#### ✅ Fortalezas
- Trazabilidad excelente: tiene ID, épica, autor y fecha ✅
- Consistencia: terminología alineada con glosario ✅
- 4 de 6 criterios son directamente automatizables ✅

### Comparación con Estándar

| Requisito IEEE 830 / ISO 29148 | Estado |
|-------------------------------|--------|
| Correct (correcto) | ✅ |
| Unambiguous (sin ambigüedad) | ❌ Falla |
| Complete (completo) | ⚠️ Parcial |
| Consistent (consistente) | ✅ |
| Ranked (priorizado) | ✅ |
| Verifiable (verificable) | ⚠️ Parcial |
| Modifiable (modificable) | ✅ |
| Traceable (trazable) | ✅ |

### Próximos Pasos
1. Resolver ambigüedades (impacto: +15 pts estimados)
2. Desacoplar dependencia con US-031 (impacto: +8 pts)
3. Agregar SLAs en criterios de performance (impacto: +5 pts)
4. Re-evaluar con `/especdev:spec-score` → objetivo: ≥ 85
```

## Integración con Don Cheli

```
/especdev:spec-score → score < 60
  → /especdev:clarificar → resolver ambigüedades
  → /especdev:especificar → reescribir spec
  → /especdev:spec-score → re-evaluar

/especdev:spec-score → score ≥ 80
  → /especdev:desglosar → convertir en tareas
  → /especdev:implementar → desarrollo con TDD
```

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Evaluación de métricas | Sonnet | Comprensión semántica profunda |
| Detección de ambigüedad | Sonnet | Análisis lingüístico |
| Reporte y formateo | Haiku | Salida estructurada |

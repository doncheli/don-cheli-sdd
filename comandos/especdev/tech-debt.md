---
description: Detectar y cuantificar deuda técnica, con clasificación especial para código generado por IA
i18n: true
---

# /especdev:tech-debt

## Objetivo

Escanear la base de código en busca de deuda técnica, con énfasis en patrones introducidos por generación de código con IA: duplicación, código muerto, funciones sobrecomplejas, abstracciones faltantes y patrones inconsistentes. Clasifica la deuda como intencional vs accidental y por origen (IA vs humano). Calcula un score de deuda y estima el esfuerzo de remediación.

## Uso

```
/especdev:tech-debt                                # Escaneo completo del proyecto
/especdev:tech-debt @src/services/                 # Escanear módulo específico
/especdev:tech-debt --tipo duplicacion             # Enfocarse en un tipo
/especdev:tech-debt --origen ia                    # Solo deuda introducida por IA
/especdev:tech-debt --formato ejecutivo            # Reporte simplificado para management
/especdev:tech-debt --umbral-score 30              # Alertar si score supera umbral
/especdev:tech-debt --comparar main                # Delta de deuda vs rama base
```

## Categorías de Deuda Detectadas

### 1. Duplicación de Código
```
Detectar:
  ❌ Bloques de código idénticos o >80% similares en 2+ lugares
  ❌ Lógica de negocio copiada entre servicios
  ❌ Tests con setup duplicado en vez de fixtures compartidas
  ❌ Tipos/interfaces duplicadas entre módulos
```

### 2. Código Muerto
```
Detectar:
  ❌ Funciones exportadas que no tienen ningún import en el proyecto
  ❌ Variables declaradas y nunca leídas
  ❌ Ramas condicionales que nunca se pueden ejecutar
  ❌ Feature flags de features ya eliminadas
  ❌ Comentarios con código comentado de más de 30 días
```

### 3. Complejidad Excesiva
```
Detectar:
  ❌ Funciones con complejidad ciclomática > 10
  ❌ Funciones con más de 30 líneas efectivas
  ❌ Más de 4 niveles de anidamiento
  ❌ Funciones con más de 5 parámetros
  ❌ Clases con más de 10 métodos públicos
```

### 4. Abstracciones Faltantes
```
Detectar:
  ❌ Strings mágicos repetidos (deberían ser constantes)
  ❌ Lógica inline que aparece en 3+ lugares (debería ser función)
  ❌ Configuración hardcodeada que debería ser parametrizable
  ❌ Patrones de error handling duplicados sin clase de excepción común
```

### 5. Patrones Inconsistentes (característico de IA)
```
Detectar:
  ❌ Mismo concepto implementado de 3 formas distintas en el mismo repo
  ❌ Mezcla de estilos: async/await + callbacks + Promise.then
  ❌ Nomenclatura inconsistente: getUser / fetchUser / retrieveUser para lo mismo
  ❌ Tests con 3 frameworks distintos en el mismo proyecto
  ❌ Imports relativos y absolutos mezclados sin regla clara
```

## Comportamiento

1. **Escanear** el código fuente con análisis estático

2. **Clasificar cada hallazgo**:
   - **Tipo**: duplicación / código muerto / complejidad / abstracción / inconsistencia
   - **Origen**: IA (generado o editado por Claude/Copilot) vs humano
   - **Naturaleza**: intencional (trade-off aceptado) vs accidental (error/descuido)
   - **Severidad**: alta / media / baja

3. **Calcular Debt Score** (0-100, mayor = más deuda):
   ```
   Score = (duplicación × 0.25) + (código_muerto × 0.20) +
           (complejidad × 0.25) + (abstracciones × 0.15) +
           (inconsistencia × 0.15)
   ```

4. **Estimar esfuerzo de remediación** en horas por ítem

5. **Priorizar** por matriz: impacto en negocio × costo de remediación

6. **Generar reporte** con backlog de ítems accionables

## Output

```markdown
## Reporte de Deuda Técnica — mi-proyecto

**Fecha:** 2026-03-28
**Archivos escaneados:** 124 (8,400 LOC)
**Debt Score: 38 / 100** — Moderado

### Resumen por Categoría

| Categoría | Ítems | Severidad Promedio | Esfuerzo Total |
|-----------|-------|--------------------|----------------|
| Duplicación | 12 | Alta | 8h |
| Código muerto | 23 | Baja | 4h |
| Complejidad excesiva | 5 | Alta | 12h |
| Abstracciones faltantes | 8 | Media | 6h |
| Patrones inconsistentes | 7 | Media | 10h |
| **Total** | **55** | — | **40h** |

### Deuda por Origen

| Origen | Ítems | % del Total |
|--------|-------|-------------|
| Generado por IA | 21 | 38% |
| Escrito por humano | 34 | 62% |

> ⚠️ El código generado por IA tiene 2.1× más duplicación que el código humano en este proyecto.

### Top 5 Ítems Críticos (Mayor Impacto × Menor Costo)

#### TD-001: Lógica de descuento duplicada en 4 servicios
**Tipo:** Duplicación | **Origen:** IA | **Naturaleza:** Accidental
**Archivos:** `order-service.ts:45`, `cart-service.ts:112`, `checkout.ts:78`, `promo.ts:23`
**Impacto:** Alto — bugs se propagan a 4 lugares simultáneamente
**Remediación:** Extraer `DiscountCalculator` en módulo compartido
**Esfuerzo:** 3h
**Prioridad:** 🔴 Inmediata

#### TD-002: `processOrder()` — complejidad ciclomática: 18
**Tipo:** Complejidad excesiva | **Origen:** IA | **Naturaleza:** Accidental
**Archivo:** `src/services/order/processor.ts:89`
**Impacto:** Alto — difícil de testear, alta probabilidad de bugs en cambios
**Remediación:** Descomponer en 4 funciones con responsabilidad única
**Esfuerzo:** 4h
**Prioridad:** 🔴 Inmediata

#### TD-003: 3 patrones distintos para manejo de errores HTTP
**Tipo:** Inconsistencia | **Origen:** IA | **Naturaleza:** Accidental
**Descripción:** try/catch en controllers, .catch() en services, Result type en utils
**Impacto:** Medio — dificulta onboarding y mantenimiento
**Remediación:** Adoptar patrón único (Result type recomendado) + migrar
**Esfuerzo:** 6h
**Prioridad:** 🟠 Próximo sprint

#### TD-004: 34 variables sin uso en tests
**Tipo:** Código muerto | **Origen:** Mixto | **Naturaleza:** Accidental
**Impacto:** Bajo — ruido en la base de código
**Remediación:** Script automático con `ts-prune` + revisión
**Esfuerzo:** 1h
**Prioridad:** 🟡 Cuando haya tiempo

#### TD-005: Constante TIMEOUT_MS hardcodeada en 6 archivos
**Tipo:** Abstracción faltante | **Origen:** IA | **Naturaleza:** Accidental
**Valores encontrados:** 3000, 5000, 3000, 5000, 3000, 10000 ms (inconsistente)
**Remediación:** Centralizar en `src/config/timeouts.ts`
**Esfuerzo:** 30 min
**Prioridad:** 🟡 Quick win

### Deuda Intencional Registrada

| Ítem | Razón Documentada | Fecha Límite |
|------|------------------|--------------|
| Caché en memoria (no Redis) | MVP — costo de infra | 2026-06-01 |
| Sin paginación cursor-based | Volumen bajo actual | 2026-09-01 |

### Tendencia

```
Debt Score histórico:
v1.10: 22 ██░░░░░░░░
v1.11: 28 ███░░░░░░░
v1.12: 35 ████░░░░░░
v1.13: 38 ████░░░░░░  ← actual (+3 puntos, tendencia al alza)
```

> ⚠️ La deuda aumentó 8 puntos en 2 versiones. Recomendado: sprint de deuda técnica.

### Backlog Generado

Se generaron 55 ítems en `.especdev/tech-debt-backlog.md` listos para importar a Linear/Jira.
```

## Almacenamiento

```
.especdev/
├── tech-debt-backlog.md        # Backlog completo de ítems (en git)
└── tech-debt-history.jsonl     # Historial de scores (en git)
```

## Integración con Don Cheli

```
/especdev:tech-debt → ítems críticos detectados
  → /especdev:desglosar → crear tareas en backlog
  → /especdev:implementar → refactor con TDD
  → /especdev:tech-debt --comparar main → verificar reducción

/especdev:tech-debt --formato ejecutivo → reporte para management
  → decisión de sprint de deuda técnica
```

Ejecutar recomendado:
- Al inicio de cada sprint (detectar acumulación)
- Después de features con generación intensiva de código IA
- Antes de incorporar nuevo desarrollador al equipo

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Análisis estático | Sonnet | Comprensión de patrones de código |
| Clasificación origen IA/humano | Sonnet | Requiere contexto de git blame + semántica |
| Estimación de esfuerzo | Haiku | Heurísticas simples por tipo |
| Reporte ejecutivo | Haiku | Formateo y síntesis |

## Guardrails

- La deuda intencional documentada no suma al Debt Score
- Un Debt Score > 50 dispara alerta automática en `/dc:guardian`
- No marcar como deuda IA si no hay evidencia en git history o comentarios

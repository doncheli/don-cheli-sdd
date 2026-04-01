---
description: Dashboard de salud del contexto activo con predicción de degradación y recomendaciones de compactación
i18n: true
---

# /dc:context-health

## Objetivo

Mostrar el estado de salud de la ventana de contexto en la sesión actual: porcentaje usado, conteo de tokens, archivos cargados y predicción de cuándo comenzará a degradarse la calidad. Sugiere cuándo compactar, qué delegar a subagentes y qué eliminar. Sistema de semáforo: verde (<50%), amarillo (50-75%), rojo (>75%). Rastrea patrones de uso de contexto entre sesiones.

## Uso

```
/dc:context-health                           # Dashboard completo
/dc:context-health --rapido                  # Solo semáforo + número
/dc:context-health --sugerir                 # Recomendaciones accionables
/dc:context-health --historial               # Patrones entre sesiones
/dc:context-health --simular 20000           # Simular con N tokens adicionales
/dc:context-health --exportar                # Guardar estado para análisis
```

## Comportamiento

1. **Medir estado actual del contexto**:
   - Tokens usados vs límite del modelo activo
   - Tokens por categoría: instrucciones del sistema / archivos cargados / conversación / outputs
   - Archivos activos en contexto con su peso en tokens

2. **Calcular métricas derivadas**:
   - % de contexto utilizado
   - Proyección de agotamiento: si continúa a la tasa actual, ¿en cuántos turnos se llena?
   - Zona de degradación: calidad de respuesta empieza a bajar al superar el 75% en la mayoría de modelos
   - Densidad de información útil: ratio de tokens de contexto relevante vs tokens acumulados innecesarios

3. **Clasificar semáforo**:
   - 🟢 Verde: < 50% — sin acción requerida
   - 🟡 Amarillo: 50-75% — monitorear, preparar compactación
   - 🔴 Rojo: > 75% — compactar o delegar antes del próximo turno complejo

4. **Generar recomendaciones** según estado:
   - Qué archivos eliminar del contexto
   - Qué subtareas delegar a subagentes
   - Cuándo ejecutar `/compact`
   - Qué información preservar en memoria persistente antes de compactar

5. **Para `--historial`**:
   - Leer `.dc/context-sessions.jsonl`
   - Identificar patrones: ¿en qué tipo de tareas se llena más rápido?
   - ¿Cuál es el volumen promedio de tokens por tipo de sesión?

## Output

### Vista completa

```markdown
## 🟡 Context Health Dashboard

**Modelo:** claude-sonnet-4-6 (ventana: 200K tokens)
**Sesión:** 2026-03-28 — feature/nuevo-checkout
**Turno actual:** 14

---

### Estado del Contexto

```
Usado: ██████████████░░░░░░  68% (136,000 / 200,000 tokens)
                              ↑ Zona amarilla — acción próxima
```

| Categoría | Tokens | % del Total |
|-----------|--------|-------------|
| Instrucciones sistema (CLAUDE.md) | 4,200 | 3.1% |
| Archivos cargados | 52,000 | 38.2% |
| Conversación (prompts + respuestas) | 71,800 | 52.8% |
| Outputs estructurados | 8,000 | 5.9% |

### Archivos en Contexto

| Archivo | Tokens | Última Mención | ¿Necesario? |
|---------|--------|----------------|-------------|
| src/services/checkout.ts | 8,400 | Turno 14 | ✅ Activo |
| src/services/payment.ts | 6,200 | Turno 12 | ✅ Activo |
| docs/specs/checkout/spec.md | 5,800 | Turno 3 | ⚠️ Antiguo |
| src/tests/checkout.test.ts | 4,100 | Turno 14 | ✅ Activo |
| docs/arquitectura.md | 9,200 | Turno 1 | 🔴 Obsoleto |
| src/types/index.ts | 3,400 | Turno 8 | ⚠️ Inactivo |
| package.json | 1,200 | Turno 2 | 🔴 Obsoleto |

### Proyección

```
Tasa de crecimiento: ~4,200 tokens/turno (últimos 5 turnos)

Turnos restantes (estimado):
  Hasta zona roja (75%): ~3 turnos
  Hasta límite (100%):   ~15 turnos
  Hasta degradación:     ~3 turnos ← acción recomendada aquí
```

### Densidad de Información Útil

```
Tokens útiles (referenciados en últimos 5 turnos): 84,000  62%
Tokens acumulados/obsoletos:                       52,000  38%

Eficiencia: ⚠️ Regular — 38% de tokens son innecesarios
```

---

### Recomendaciones

#### Acción Inmediata (antes del próximo turno complejo)

1. **Eliminar del contexto** — Ahorro estimado: ~10,400 tokens
   - `docs/arquitectura.md` — no se ha referenciado desde el turno 1
   - `package.json` — información ya asimilada, no se necesita activo

2. **Compactar conversación** — Ahorro estimado: ~25,000 tokens
   - Los turnos 1-8 cubren el análisis inicial ya completado
   - Ejecutar `/compact` ahora preservaría los hallazgos clave
   - Reducción esperada: 136K → ~101K tokens (50% de uso)

3. **Delegar a subagente** si la siguiente tarea es:
   - Generación masiva de tests → usar subagente Haiku
   - Análisis de otro módulo → abrir nueva sesión con solo ese contexto

#### Acción Preventiva

4. **Guardar en memoria persistente** antes de compactar:
   - Decisión de arquitectura de turno 6: "usar Strategy pattern para payment gateways"
   - Lista de edge cases identificados en turno 9
   - Ejecutar `/dc:memorizar` para persistir

---

### Semáforo Rápido

```
🟡 68% usado — compactar en los próximos 2-3 turnos
```
```

### Vista `--rapido`

```markdown
🟡 68% (136K/200K) — compactar pronto | 3 turnos hasta zona roja
```

### Vista `--historial`

```markdown
## Historial de Uso de Contexto

**Sesiones analizadas:** 23 (últimos 30 días)

### Uso Promedio por Tipo de Tarea

| Tipo de Sesión | Tokens Promedio | % Máximo Alcanzado | Compactaciones |
|----------------|-----------------|-------------------|----------------|
| Implementación de feature | 145K | 82% | 1.8 avg |
| Code review | 48K | 31% | 0.1 avg |
| Debugging | 72K | 52% | 0.6 avg |
| Refactoring | 118K | 71% | 1.2 avg |
| Documentación | 28K | 18% | 0 avg |

### Patrones Detectados

- ⚠️ El 60% de sesiones de implementación entran en zona roja
  → Recomendado: dividir features grandes en sesiones de ≤ 100K tokens
- ✅ Code reviews raramente superan 50% — eficiencia óptima
- ⚠️ Las sesiones de debugging acumulan muchos archivos obsoletos
  → Hábito: eliminar archivos de diagnóstico descartados

### Tendencia de Eficiencia

| Semana | Eficiencia Promedio | Compactaciones |
|--------|--------------------|-|
| 2026-03-01 | 58% útil | 12 |
| 2026-03-08 | 63% útil | 9 |
| 2026-03-15 | 67% útil | 8 |
| 2026-03-22 | 71% útil | 6 | ← mejorando
```

## Almacenamiento

```
.dc/
└── context-sessions.jsonl     # Historial de sesiones (en .gitignore)
```

## Integración con Don Cheli

```
/dc:context-health --rapido → 🔴
  → /dc:memorizar → guardar contexto clave
  → /compact → comprimir conversación
  → continuar con contexto saludable

/dc:context-health --historial → sesiones pesadas detectadas
  → /dc:analizar-sesiones → análisis profundo de patrones
  → ajustar hábitos de trabajo
```

Don Cheli ejecuta `context-health --rapido` automáticamente:
- Al inicio de cada sesión (`/dc:comenzar`)
- Antes de ejecutar comandos complejos (`/dc:implementar`, `/dc:auditar`)
- Si el usuario activa `auto_context_check: true` en `.dc/config.yaml`

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Medición y cálculo | Haiku | Operaciones matemáticas simples |
| Análisis de relevancia de archivos | Sonnet | Comprensión semántica |
| Recomendaciones | Haiku | Heurísticas definidas |
| Análisis de historial | Haiku | Agregaciones simples |

## Guardrails

- No compactar automáticamente sin confirmación del usuario
- Nunca eliminar del contexto archivos con cambios sin guardar
- Si `--simular` proyecta agotamiento en < 2 turnos → advertencia inmediata
- El historial no contiene contenido de conversaciones, solo métricas de tamaño

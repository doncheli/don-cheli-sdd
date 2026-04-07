---
description: Simular costo y consumo de tokens ANTES de ejecutar una fase. Usa cuando el usuario dice "preflight", "cuánto cuesta", "cost estimate", "token estimate", "simular costo", "cuántos tokens", "budget check", "pre-flight", "how much will this cost". Estima tokens y costo antes de ejecutar para evitar sorpresas.
i18n: true
---

# /dc:preflight — Simulación de Costos Pre-Ejecución

## Objetivo

Estimar **tokens y costo** que consumirá una fase o tarea ANTES de ejecutarla. Vital para equipos que escalan el uso de SDD y necesitan controlar presupuesto.

## Uso

```
/dc:preflight                            # Estimar todo el pipeline pendiente
/dc:preflight --fase implementar         # Estimar solo una fase
/dc:preflight --tarea T003               # Estimar una tarea específica
/dc:preflight --presupuesto 5.00         # Alertar si excede $5 USD
/dc:preflight --detallado                # Desglose por modelo y operación
```

## Output

```
═══════════════════════════════════════════════════════════
  Pre-Flight Check — Simulación de Costos
═══════════════════════════════════════════════════════════

  Proyecto:    mi-api
  Fases:       Implementar → Revisar (2 pendientes)
  Tareas:      6 (T003-T008)

  ┌────────────────────────────────────────────────────────┐
  │  Estimación de consumo                                  │
  ├──────────────────┬──────────┬───────────┬──────────────┤
  │  Fase             │ Tokens   │ Modelo    │ Costo est.   │
  ├──────────────────┼──────────┼───────────┼──────────────┤
  │  Implementar      │ ~45,000  │ sonnet    │ $0.27        │
  │    T003 (model)   │  ~8,000  │ sonnet    │ $0.05        │
  │    T004 (service) │ ~12,000  │ sonnet    │ $0.07        │
  │    T005 (routes)  │ ~10,000  │ sonnet    │ $0.06        │
  │    T006 (auth)    │  ~5,000  │ haiku     │ $0.01        │
  │    T007 (tests)   │  ~6,000  │ sonnet    │ $0.04        │
  │    T008 (e2e)     │  ~4,000  │ haiku     │ $0.01        │
  │  Revisar          │ ~18,000  │ opus      │ $0.54        │
  │    Code review    │ ~12,000  │ opus      │ $0.36        │
  │    Security scan  │  ~6,000  │ sonnet    │ $0.04        │
  ├──────────────────┼──────────┼───────────┼──────────────┤
  │  TOTAL            │ ~63,000  │ mixed     │ $0.81        │
  └──────────────────┴──────────┴───────────┴──────────────┘

  ✅ Dentro del presupuesto ($0.81 < $5.00)
  ⏱️  Tiempo estimado: ~25 minutos

  ¿Proceder? [S/n]
```

## Cómo calcula

### 1. Estimación de tokens por fase

| Fase | Base tokens | Multiplicador |
|------|-------------|---------------|
| Especificar | 3,000 | × escenarios Gherkin |
| Clarificar | 2,000 | × ambigüedades encontradas |
| Planificar | 5,000 | × componentes del blueprint |
| Desglosar | 2,000 | × tareas generadas |
| Implementar | 8,000 | × archivos a crear/modificar |
| Revisar | 12,000 | × dimensiones activas |

### 2. Costo por modelo (precios Claude 2026)

| Modelo | Input (1M tokens) | Output (1M tokens) | Ratio típico |
|--------|-------------------|---------------------|-------------|
| Haiku | $0.25 | $1.25 | 70/30 |
| Sonnet | $3.00 | $15.00 | 70/30 |
| Opus | $15.00 | $75.00 | 60/40 |

### 3. Ajustes

- **Historial:** Si hay sesiones previas, usa duración real como calibración
- **Complejidad:** Nivel N3-N4 multiplica ×1.5 por overhead de coordinación
- **Custom gates:** Cada gate custom suma ~500 tokens
- **Razonamiento:** Cada modelo `/razonar:*` suma ~2,000 tokens

## Alertas de presupuesto

```
/dc:preflight --presupuesto 2.00

⚠️ ALERTA DE PRESUPUESTO
━━━━━━━━━━━━━━━━━━━━━━━━
Estimación:  $3.42
Presupuesto: $2.00
Excedente:   $1.42 (71% sobre presupuesto)

Recomendaciones:
  1. Usar haiku para T006, T007, T008 → ahorra $0.45
  2. Saltar security scan en Review → ahorra $0.36
  3. Reducir a 5 dimensiones de review → ahorra $0.18

Con optimizaciones: $2.43 (todavía $0.43 sobre presupuesto)

¿Proceder de todos modos? [s/N]
```

## Configuración

En `.dc/config.yaml`:

```yaml
preflight:
  habilitado: true
  presupuesto_default: 10.00      # USD por sesión
  alertar_al_superar: true
  moneda: USD
  precios_custom:                  # Override si usas precios diferentes
    haiku_input: 0.25
    haiku_output: 1.25
    sonnet_input: 3.00
    sonnet_output: 15.00
    opus_input: 15.00
    opus_output: 75.00
```

## Almacenamiento

```
.dc/
├── preflight-estimates/
│   ├── 2026-04-06-impl.json    # Estimación guardada
│   └── 2026-04-06-review.json
├── cost-history.json            # Historial de costos reales vs estimados
└── metrics.json                 # Integración con telemetría
```

## Integración

- **Pre-fase:** Se ejecuta automáticamente antes de `/dc:implementar` y `/dc:revisar`
- **Dashboard:** Aparece en `/dc:dashboard` como gráfico de costo por sesión
- **CI/CD:** Output disponible en el GitHub Action como `cost-estimate`
- **Métricas:** Compara estimado vs real para calibrar precisión

---
description: Debugger de razonamiento que muestra por qué el framework eligió cada modelo, skill y decisión. Usa cuando el usuario dice "time travel", "por qué eligió", "reasoning debug", "decision audit", "why this model", "razonamiento", "debug reasoning", "explain decision", "modelo elegido". Permite ajustar skills dinámicamente basándose en el historial.
i18n: true
---

# /dc:time-travel — Debugging del Razonamiento

## Objetivo

Visualizar el **historial completo de razonamiento** del framework: qué modelo se eligió, por qué, qué alternativas se descartaron, y cómo ajustar las decisiones futuras.

## Uso

```
/dc:time-travel                          # Ver historial completo de la sesión
/dc:time-travel --fase planificar        # Ver razonamiento de una fase específica
/dc:time-travel --decision T003          # Por qué se tomó una decisión en tarea T003
/dc:time-travel --modelo                 # Por qué se eligió cada modelo (haiku/sonnet/opus)
/dc:time-travel --ajustar                # Modo interactivo para ajustar skills
```

## Qué registra

Cada vez que el framework toma una decisión, registra en `.dc/reasoning-log.json`:

```json
{
  "session": "2026-04-06-001",
  "decisions": [
    {
      "id": "D001",
      "timestamp": "2026-04-06T10:15:00Z",
      "phase": "comenzar",
      "decision": "Nivel de complejidad detectado: 2 — Estándar",
      "reasoning": "Múltiples archivos (8 estimados), 2 endpoints nuevos, 1 modelo de datos. No califica como Micro (1-3 archivos) ni Complejo (multi-módulo).",
      "alternatives_considered": [
        { "option": "Nivel 1 — Micro", "rejected_because": "Más de 3 archivos estimados" },
        { "option": "Nivel 3 — Complejo", "rejected_because": "Un solo módulo, sin dependencias cross-módulo" }
      ],
      "confidence": 0.85,
      "model_used": "sonnet",
      "model_reasoning": "Tarea de clasificación estándar, no requiere opus"
    },
    {
      "id": "D002",
      "timestamp": "2026-04-06T10:16:30Z",
      "phase": "especificar",
      "decision": "Usar /razonar:pre-mortem antes de generar specs",
      "reasoning": "Feature involucra pagos. Pre-mortem detecta fallos potenciales antes de comprometer la arquitectura.",
      "alternatives_considered": [
        { "option": "/razonar:primeros-principios", "rejected_because": "El dominio es bien conocido, no requiere descomposición fundamental" },
        { "option": "Sin razonamiento", "rejected_because": "Feature de alto riesgo (pagos), siempre aplicar razonamiento" }
      ],
      "confidence": 0.92,
      "skill_triggered": "razonamiento",
      "model_used": "sonnet"
    }
  ]
}
```

## Output — Vista de línea de tiempo

```
/dc:time-travel

═══════════════════════════════════════════════
  Time Travel — Sesión 2026-04-06-001
═══════════════════════════════════════════════

  10:15 ─── /dc:comenzar ───────────────────
  │
  │  D001: Nivel detectado → 2 (Estándar)
  │  Modelo: sonnet (confianza: 85%)
  │  Descartados: N1 (>3 archivos), N3 (1 módulo)
  │
  10:16 ─── /dc:especificar ────────────────
  │
  │  D002: Razonamiento → /razonar:pre-mortem
  │  Razón: Feature de pagos (alto riesgo)
  │  Descartados: primeros-principios (dominio conocido)
  │
  │  D003: Generar 8 escenarios Gherkin
  │  Modelo: sonnet → opus (escalado por complejidad)
  │  Razón: 3+ escenarios edge case requieren opus
  │
  10:22 ─── /dc:clarificar ─────────────────
  │
  │  D004: 2 ambigüedades detectadas
  │  Skill: validacion-nyquist (activada automáticamente)
  │  Modelo: haiku (tarea de clasificación)
  │
  10:30 ─── /dc:planificar-tecnico ──────────
  │
  │  D005: Arquitectura → 3 capas (routes/services/repos)
  │  Modelo: opus (decisión arquitectónica)
  │  Razón: Regla de routing — arquitectura siempre usa opus
  │  Alternativa: 2 capas (descartada: viola SOLID SRP)
  │
  ═══════════════════════════════════════════
  Total: 12 decisiones | 3 modelos usados
  Opus: 3 (25%) | Sonnet: 7 (58%) | Haiku: 2 (17%)
  Confianza promedio: 88%
```

## Modo ajuste interactivo

```
/dc:time-travel --ajustar

¿Qué quieres ajustar?

  1) Threshold de escalado a opus (actual: complejidad > 7/10)
  2) Modelo default para specs (actual: sonnet)
  3) Razonamiento automático en features de riesgo (actual: ON)
  4) Skills que se activan por contexto (actual: 5 activas)

▸ 1

Threshold actual: complejidad > 7/10 → escala a opus
Nuevo threshold: ▸ 8/10

✅ Ajustado. Opus se usará solo en complejidad > 8/10.
Ahorro estimado: ~15% tokens por sesión.
```

## Almacenamiento

```
.dc/
├── reasoning-log.json        # Log de decisiones (auto-generado)
├── reasoning-config.yaml     # Thresholds y preferencias ajustadas
└── reasoning-sessions/       # Histórico por sesión
    ├── 2026-04-06-001.json
    └── 2026-04-06-002.json
```

## Integración

- Se alimenta de: `routing-modelos`, `razonamiento`, `contabilidad-tokens`
- Se visualiza en: `/dc:dashboard` (sección "Reasoning")
- Se audita con: `/dc:audit-trail` (decisiones con timestamp)

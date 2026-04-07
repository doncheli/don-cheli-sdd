---
description: Modo autónomo que ejecuta el pipeline SDD completo sin intervención humana. Usa cuando el usuario dice "auto", "autónomo", "autonomous", "run automatically", "ejecutar solo", "auto mode", "hands-off", "unattended", "modo piloto automático". Spawna agentes frescos por tarea para evitar context rot.
i18n: true
---

# /dc:auto — Modo Autónomo

## Objetivo

Ejecutar el pipeline SDD **completo** sin intervención humana: research → spec → plan → code → test → verify → commit. Cada fase usa un agente fresco para evitar context rot.

## Uso

```
/dc:auto "Implementar autenticación JWT con refresh tokens"
/dc:auto --nivel 2                     # Forzar nivel específico
/dc:auto --hasta implementar           # Parar después de una fase
/dc:auto --dry-run                     # Simular sin ejecutar código
/dc:auto --max-iteraciones 5           # Límite de ciclos TDD
/dc:auto --presupuesto 10.00           # Límite de costo en USD
```

## Arquitectura Anti-Context-Rot

El problema fundamental: ejecutar todo en un solo contexto degrada la calidad.

**Solución: Agentes frescos por fase.**

```
Orquestador (30-40% del contexto — zona óptima)
  │
  ├── Agente 1: RESEARCH (contexto fresco 200K)
  │   └── Explora codebase, identifica constraints
  │       Output → .dc/auto/research.md
  │
  ├── Agente 2: SPECIFY (contexto fresco 200K)
  │   └── Lee research.md → genera specs Gherkin
  │       Output → .dc/specs/*.feature
  │
  ├── Agente 3: PLAN (contexto fresco 200K)
  │   └── Lee specs → genera blueprint técnico
  │       Output → .dc/blueprints/*.md
  │
  ├── Agente 4: BREAKDOWN (contexto fresco 200K)
  │   └── Lee blueprint → genera tareas TDD
  │       Output → .dc/tareas/*.md
  │
  ├── Agentes 5-N: IMPLEMENT (contexto fresco por tarea)
  │   └── Una tarea a la vez: RED → GREEN → REFACTOR
  │       Output → código + tests
  │
  └── Agente Final: REVIEW (contexto fresco 200K)
      └── Lee todo → peer review 7 dimensiones
          Output → .dc/reviews/*.md
```

**Cada agente:**
- Inicia con contexto 100% limpio
- Lee SOLO los artefactos que necesita del disco (.dc/)
- Escribe su output a disco antes de terminar
- El orquestador decide si avanzar o reintentar

## State Machine

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ RESEARCH │───▶│ SPECIFY  │───▶│   PLAN   │───▶│BREAKDOWN │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                    ┌──────────┐    ┌──────────┐     │
                    │  REVIEW  │◀───│IMPLEMENT │◀────┘
                    └──────────┘    └──────────┘
                         │              │
                    ┌────▼────┐    ┌────▼────┐
                    │  DONE   │    │  RETRY  │──(max 3)
                    └─────────┘    └─────────┘
```

**Persistencia en disco:**

```
.dc/auto/
├── state.json              # Estado de la máquina de estados
├── lock.pid                # PID del proceso (crash recovery)
├── research.md             # Output de fase research
├── cost-tracker.json       # Consumo de tokens acumulado
└── log.md                  # Log detallado de cada paso
```

### state.json

```json
{
  "task": "Implementar autenticación JWT",
  "level": 2,
  "current_phase": "implement",
  "current_task": "T003",
  "phases_completed": ["research", "specify", "plan", "breakdown"],
  "phases_remaining": ["implement", "review"],
  "started_at": "2026-04-07T10:00:00Z",
  "tokens_used": 45000,
  "cost_usd": 0.42,
  "retries": 0,
  "max_retries": 3
}
```

## Crash Recovery

Si el proceso se interrumpe (crash, timeout, ctrl+c):

1. Al iniciar, verifica si existe `.dc/auto/lock.pid`
2. Si existe y el PID sigue activo → error "otra instancia corriendo"
3. Si existe pero el PID murió → **crash recovery**:
   - Lee `state.json` para saber dónde quedó
   - Resume desde la última fase completada
   - No repite trabajo ya hecho

```
/dc:auto --continuar         # Resumir ejecución interrumpida
```

```
🔄 Crash recovery activado
  Última fase: implement (T003)
  Fases completadas: research, specify, plan, breakdown
  Tokens consumidos: 45,000 ($0.42)
  Resumiendo desde: implement T004...
```

## Pre-Flight integrado

Antes de ejecutar, muestra estimación:

```
═══════════════════════════════════════════
  /dc:auto Pre-Flight
═══════════════════════════════════════════

  Tarea: Implementar autenticación JWT
  Nivel: 2 — Estándar
  Fases: 6 (research → review)
  Agentes: 8 (1 por fase + 2 para implement)

  Estimación:
    Tokens: ~85,000
    Costo:  ~$1.20
    Tiempo: ~30 minutos

  ¿Proceder? [S/n]
```

## Guardrails

- **Max retries por fase:** 3 (configurable). Si falla 3 veces → parar y pedir ayuda humana.
- **Presupuesto:** Si se excede → parar y notificar.
- **Quality gates:** Cada fase pasa por su gate antes de avanzar. Si falla → reintentar o parar.
- **Stubs:** Si se detectan stubs en implement → reintentar la tarea, no avanzar.
- **Drift:** Al final, ejecutar `/dc:drift` para verificar que specs == código.

## Integración con el pipeline existente

`/dc:auto` es un **orquestador** que invoca los comandos existentes:

```
/dc:auto → internamente ejecuta:
  /dc:explorar          (research)
  /dc:especificar       (specify)
  /dc:clarificar        (clarify, si nivel ≥ 2)
  /dc:planificar-tecnico (plan)
  /dc:desglosar         (breakdown)
  /dc:implementar       (implement, por tarea)
  /dc:revisar           (review)
  /dc:drift             (verificación final)
```

No reemplaza ningún comando — los orquesta.

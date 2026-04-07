---
name: crash-recovery
description: Recuperación automática de sesiones interrumpidas con lock files, PID detection y state machine persistente en disco.
version: 1.0.0
tags: [recovery, crash, persistence, state, lock]
grado_libertad: bajo
---

# Crash Recovery

## Qué hace

Garantiza que ninguna sesión de trabajo se pierde, incluso si el proceso se interrumpe (crash, timeout, desconexión, ctrl+c).

## Mecanismo

### Lock File + PID

Al iniciar cualquier sesión (`/dc:comenzar`, `/dc:auto`, `/dc:implementar`):

1. Crear `.dc/auto/lock.pid` con el PID del proceso actual
2. Registrar timestamp de inicio en `state.json`
3. Al terminar → eliminar lock file

### Detección de crash

Al iniciar una nueva sesión:

```
¿Existe .dc/auto/lock.pid?
  │
  ├── NO → sesión limpia, continuar normal
  │
  └── SÍ → verificar PID
       │
       ├── PID activo → "⚠️ Otra instancia corriendo (PID: XXXX)"
       │
       └── PID muerto → CRASH DETECTADO
            │
            ├── Leer state.json (última fase, última tarea)
            ├── Mostrar resumen de dónde quedó
            ├── Preguntar: "¿Resumir desde [fase]? (s/n)"
            └── Si sí → cargar estado y continuar
```

### State Machine persistente

```json
// .dc/auto/state.json
{
  "session_id": "2026-04-07-001",
  "task": "Implementar autenticación JWT",
  "level": 2,
  "current_phase": "implement",
  "current_task": "T003",
  "phases_completed": ["research", "specify", "plan", "breakdown"],
  "artifacts": {
    "specs": ["auth.feature"],
    "blueprints": ["auth-blueprint.md"],
    "tasks": ["T001", "T002", "T003"]
  },
  "started_at": "2026-04-07T10:00:00Z",
  "last_checkpoint": "2026-04-07T10:25:00Z",
  "tokens_used": 45000,
  "retries": { "T003": 1 }
}
```

### Checkpoints

Cada vez que una fase o tarea se completa:
1. Actualizar `state.json` con la fase/tarea completada
2. Actualizar `last_checkpoint` con timestamp
3. Los artefactos ya están en disco (.dc/specs/, .dc/blueprints/, etc.)

### Recuperación

```
/dc:continuar

🔄 Sesión interrumpida detectada
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Tarea:    Implementar autenticación JWT
  Nivel:    2 — Estándar
  Última:   implement (T003)
  Tiempo:   25 min antes de interrupción
  Artefactos: specs ✅ | blueprint ✅ | tareas ✅

  Resumiendo desde: implement T004...
```

## Integración

- Se activa automáticamente en `/dc:comenzar`, `/dc:auto`, `/dc:implementar`
- Compatible con `/dc:continuar` (que ya existía para sesiones normales)
- El estado persiste en `.dc/auto/state.json`
- Los artefactos persisten en `.dc/specs/`, `.dc/blueprints/`, `.dc/tareas/`

---
nombre: Orquestación Autónoma
descripcion: "Ejecutar múltiples tareas de forma autónoma con coordinación entre agentes y checkpoints humanos"
version: 1.0.0
autor: Don Cheli
tags: [automatización, orquestación, agentes, autónomo]
activacion: "ejecutar autónomamente", "modo autónomo", "sin supervisión"
---

# Habilidad: Orquestación Autónoma (Máquina de Estados)

**Versión:** 1.0.0
**Categoría:** Automatización
**Tipo:** Flexible

> Adaptado de OpenAI Symphony — máquina de estados para ejecución autónoma.

## Cómo Mejora el Framework

El bucle autónomo (`/bucle`) actual ejecuta tareas secuencialmente sin un modelo formal de estados. Symphony introduce una máquina de estados que permite:

- Reintentos automáticos con backoff exponencial
- Reconciliación (detectar tareas obsoletas)
- Concurrencia controlada
- Recuperación después de fallos

## Estados de Orquestación

```
                    ┌──────────────┐
                    │  Sin Reclamar │
                    └──────┬───────┘
                           │ dispatch
                           ▼
                    ┌──────────────┐
                    │   Reclamada   │
                    └──────┬───────┘
                           │ workspace listo
                           ▼
┌───────────┐      ┌──────────────┐      ┌───────────────┐
│  Reintento │◄─────│  Ejecutando   │─────►│   Completada   │
│  Pendiente │      └──────────────┘      └───────────────┘
└─────┬─────┘              │
      │ timer              │ fallo / timeout
      │                    ▼
      │              ┌──────────────┐
      └─────────────►│   Fallada     │
                     └──────┬───────┘
                            │ max reintentos
                            ▼
                     ┌──────────────┐
                     │   Liberada    │
                     └──────────────┘
```

## Fases de un Intento

| Fase | Qué Sucede |
|------|-----------|
| `PreparandoWorkspace` | Crear/reusar directorio aislado |
| `ConstruyendoPrompt` | Renderizar template con contexto |
| `LanzandoAgente` | Iniciar sesión del agente |
| `EjecutandoTareas` | Agente trabaja en las tareas |
| `Verificando` | Ejecutar stop hooks |
| `Exitoso` | Todo pasó |
| `Fallido` | Algo falló → reintento |
| `Timeout` | Excedió tiempo → reintento |
| `Detenido` | Reconciliación detectó cambio de estado |

## Reintentos con Backoff Exponencial

```
Intento 1: falla → esperar 10s
Intento 2: falla → esperar 20s
Intento 3: falla → esperar 40s
Intento 4: falla → esperar 80s
...hasta max_backoff (5 min por default)
```

### Reintentos de Continuación

Cuando una tarea termina normalmente pero el issue sigue activo:
- Reintento después de 1 segundo
- Re-verificar si la tarea sigue siendo candidata
- Si sí → nueva sesión de agente
- Si no → liberar

## Workspace Aislado por Tarea

```
.especdev/workspaces/
├── PROJ-42/              # Workspace para issue PROJ-42
│   ├── repo/             # Copia/clone del código
│   ├── logs/             # Logs de la sesión
│   └── metrics.json      # Métricas de la sesión
├── PROJ-43/              # Otro workspace aislado
└── ...
```

### Invariantes de Seguridad

1. **Agente solo opera dentro de su workspace** — nunca fuera
2. **Workspace siempre dentro de workspace root** — prevenir path traversal
3. **Nombres sanitizados** — solo `[A-Za-z0-9._-]` en nombres de directorio

## Hooks de Ciclo de Vida

| Hook | Cuándo | Si Falla |
|------|--------|----------|
| `despues_crear` | Workspace recién creado | Fatal (no se crea) |
| `antes_ejecutar` | Antes de cada ejecución | Fatal (intento falla) |
| `despues_ejecutar` | Después de cada ejecución | Log y continuar |
| `antes_eliminar` | Antes de limpiar workspace | Log y continuar |

## Integración con WORKFLOW.md

```yaml
# WORKFLOW.md front matter
agente:
  max_turnos: 15
  max_reintentos: 3
  timeout_sesion_ms: 1800000
concurrencia:
  max_agentes: 3
```

## Cuándo Usar

| Situación | Comando |
|-----------|---------|
| Una tarea a la vez, manual | `/especdev:implementar` |
| Pipeline completo, un cambio | `/especdev:aplicar` |
| Múltiples issues del tracker, autónomo | **Orquestación** |

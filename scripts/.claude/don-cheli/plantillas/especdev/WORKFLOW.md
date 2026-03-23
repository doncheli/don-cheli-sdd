---
description: Plantilla WORKFLOW.md — contrato de workflow versionado en el repositorio
---

# WORKFLOW.md — Contrato de Workflow

## Qué Es

`WORKFLOW.md` es un archivo que vive en tu repositorio y define el **comportamiento completo** del agente para ese proyecto. Es la unión de configuración + prompt en un solo archivo versionado.

> Adaptado de OpenAI Symphony — el contrato que conecta issue tracker → agente → código.

## Por Qué Importa

Sin WORKFLOW.md, la configuración del agente vive:
- En tu cabeza → no reproducible
- En CLAUDE.md → no portable entre agentes
- En configs sueltas → difíciles de versionar

Con WORKFLOW.md, el **workflow es código** — versionado, revisable, reproducible.

## Formato

YAML front matter + cuerpo Markdown (prompt):

```markdown
---
# === Configuración Runtime ===
nombre: "mi-proyecto"
version: "1.0.0"

# Agente
agente:
  modelo: "sonnet"
  max_turnos: 15
  timeout_sesion_ms: 1800000  # 30 min
  max_reintentos: 3
  max_backoff_reintento_ms: 300000  # 5 min

# Concurrencia
concurrencia:
  max_agentes: 3
  max_por_estado:
    en_progreso: 2
    revision: 1

# Workspace
workspace:
  raiz: ".especdev/workspaces"
  hooks:
    despues_crear: "npm install"
    antes_ejecutar: "git pull origin main"
    despues_ejecutar: "npm run lint && npm test"

# Stop Hooks
hooks_parar:
  - nombre: "Lint"
    comando: "npm run lint"
    obligatorio: true
  - nombre: "Tests"
    comando: "npm test"
    obligatorio: true

# Tracker (opcional)
tracker:
  tipo: "github-issues"  # linear | github-issues | jira
  estados_activos: ["todo", "en progreso"]
  estados_terminales: ["done", "cerrado", "cancelado"]

# Prueba de Trabajo
prueba_trabajo:
  ci_status: true
  complejidad: true
  walkthrough_video: false
---

# Prompt del Workflow

Eres un agente de desarrollo trabajando en el proyecto {{nombre}}.

## Tu Rol
- Implementar las tareas asignadas siguiendo las specs en `specs/`
- Seguir las convenciones del proyecto en `.especdev/reglas/`
- Crear PRs con prueba de trabajo completa

## Proceso
1. Leer la tarea asignada: {{tarea.titulo}}
2. Revisar specs relevantes en `specs/features/`
3. Crear branch: `feature/{{tarea.identificador}}`
4. Implementar con TDD (RED → GREEN → REFACTOR)
5. Ejecutar stop hooks
6. Crear PR con prueba de trabajo
7. Solicitar revisión humana

## Restricciones
- NO modificar archivos fuera del alcance de la tarea
- NO commitear sin que los tests pasen
- Si hay ambigüedad, PARAR y preguntar
```

## Variables de Template

| Variable | Origen | Ejemplo |
|----------|--------|---------|
| `{{nombre}}` | Front matter | "mi-proyecto" |
| `{{tarea.titulo}}` | Issue tracker | "Agregar login OAuth" |
| `{{tarea.identificador}}` | Issue tracker | "PROJ-42" |
| `{{tarea.descripcion}}` | Issue tracker | Cuerpo del issue |
| `{{tarea.prioridad}}` | Issue tracker | 1 (urgente) |

## Precedencia de Configuración

```
1. Variables de entorno (más alta)
2. WORKFLOW.md front matter
3. .especdev/config.yaml
4. Defaults del framework (más baja)
```

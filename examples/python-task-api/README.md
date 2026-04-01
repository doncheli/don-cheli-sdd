# Python Task API — Don Cheli SDD Example

> Ejemplo completo del ciclo de vida SDD con **Python + FastAPI**.

## Qué demuestra

Este ejemplo muestra cómo Don Cheli guía la construcción de una API REST de tareas (todo list) usando el pipeline completo:

```
/dc:comenzar "API de tareas con FastAPI, SQLite y autenticación por API key"
```

## Pipeline ejecutado

| Fase | Comando | Resultado |
|------|---------|-----------|
| 1. Especificar | `/dc:especificar` | 8 escenarios Gherkin (5 P1, 2 P2, 1 P3) |
| 2. Clarificar | `/dc:clarificar` | 3 ambigüedades resueltas, Auto-QA limpio |
| 3. Planificar | `/dc:planificar-tecnico` | Blueprint 3 capas + schema DBML |
| 4. Desglosar | `/dc:desglosar` | 7 tareas TDD con paralelismo |
| 5. Implementar | `/dc:implementar` | Código + tests, 91% cobertura |
| 6. Revisar | `/dc:revisar` | 7/7 dimensiones aprobadas |

## Stack

- **Runtime:** Python 3.12
- **Framework:** FastAPI 0.115+
- **Base de datos:** SQLite + SQLAlchemy 2.0
- **Validación:** Pydantic v2
- **Tests:** pytest + httpx (TestClient)
- **Auth:** API Key via header `X-API-Key`

## Nivel detectado

**Nivel 2 — Estándar** (múltiples archivos, 1-3 días)

## Artefactos generados

```
.especdev/
├── config.yaml          # Configuración del proyecto
├── estado.md            # Estado: Completado (100%)
├── specs/
│   └── tasks.feature    # 8 escenarios Gherkin
├── blueprints/
│   └── tasks-blueprint.md  # Arquitectura + schema + endpoints
└── tareas/
    └── tasks-tasks.md   # 7 tareas TDD con dependencias
```

## Cómo reproducir

```bash
# 1. Instalar Don Cheli
bash scripts/instalar.sh --global

# 2. Crear proyecto Python
mkdir mi-task-api && cd mi-task-api
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pytest httpx

# 3. Inicializar Don Cheli y ejecutar
/dc:iniciar --tipo api --nombre "mi-task-api"
/dc:comenzar "API REST de tareas con CRUD, filtros por estado y autenticación API key"
```

## Lecciones aprendidas

- La fase de **Clarificar** detectó que "filtros por estado" no definía los estados válidos → se fijaron 3: `pending`, `in_progress`, `done`
- El **blueprint** decidió SQLAlchemy sobre raw SQL para type safety
- Las tareas T1+T2 se ejecutaron en **paralelo** (modelo + schema son independientes)
- La **auditoría de seguridad** recomendó rate limiting en producción

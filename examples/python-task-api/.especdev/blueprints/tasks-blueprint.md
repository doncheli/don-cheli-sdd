# Blueprint Técnico — Python Task API

## Decisiones de Stack

| Componente | Elección | Justificación |
|-----------|----------|---------------|
| Runtime | Python 3.12 | Typed, async nativo, ecosistema maduro |
| Framework | FastAPI 0.115+ | OpenAPI auto-generado, validación Pydantic, async |
| ORM | SQLAlchemy 2.0 | Type-safe, soporte async, migrations |
| Base de datos | SQLite | Suficiente para MVP, cero config |
| Validación | Pydantic v2 | Integración nativa con FastAPI |
| Tests | pytest + httpx | TestClient async, fixtures potentes |

## Arquitectura

```
3 capas:
  routes/   → Endpoints HTTP (validación de entrada)
  services/ → Lógica de negocio (reglas, transformaciones)
  repos/    → Acceso a datos (SQLAlchemy queries)
```

## Schema DBML (Ratificado)

```dbml
Table tasks {
  id varchar(36) [pk, default: `uuid4()`]
  title varchar(200) [not null]
  description text
  status varchar(20) [not null, default: 'pending', note: 'pending | in_progress | done']
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp
}
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | /tasks | API Key | Crear tarea |
| GET | /tasks | API Key | Listar tareas (filtro opcional: ?status=) |
| GET | /tasks/:id | API Key | Obtener tarea por ID |
| PATCH | /tasks/:id | API Key | Actualizar campos de tarea |
| DELETE | /tasks/:id | API Key | Eliminar tarea |

## Seguridad

- API Key via header `X-API-Key`
- Keys configurables via variable de entorno `API_KEYS` (comma-separated)
- Rate limiting recomendado para producción (SlowAPI)
- Validación estricta de estados: solo `pending`, `in_progress`, `done`

## Chequeo de Constitución

| Artículo | Estado |
|----------|--------|
| I. Gherkin es Rey | ✅ 8 escenarios verificables |
| II. Precisión Quirúrgica | ✅ Cambio mínimo viable |
| III. Plug-and-Play | ✅ Capas independientes |
| IV. Tests Aislados | ✅ SQLite in-memory para tests |
| V. Estándares Modernos | ✅ Type hints, Pydantic v2 |
| VI. Adaptabilidad | ✅ FastAPI detectado |
| VII. Codificación Defensiva | ✅ Errores tipados |
| VIII. Clarificación | ✅ Auto-QA limpio |

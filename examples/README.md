# Ejemplos — Don Cheli SDD Framework

Proyectos de ejemplo que demuestran el ciclo de vida completo de Don Cheli.

Cada ejemplo incluye los artefactos `.especdev/` generados: specs Gherkin, blueprints y tareas TDD.

## Ejemplos disponibles

| Ejemplo | Stack | Nivel | Descripción |
|---------|-------|-------|-------------|
| [jwt-auth-api](jwt-auth-api/) | Node.js, Express, JWT | N2 | API de autenticación con registro, login y rutas protegidas |
| [python-task-api](python-task-api/) | Python, FastAPI, SQLAlchemy | N2 | API REST de tareas con CRUD, filtros y autenticación API key |
| [react-dashboard](react-dashboard/) | React 19, TypeScript, Recharts | N2 | Dashboard de métricas con gráficos y KPI cards |

## Cómo usar los ejemplos

1. Navega al ejemplo que te interese
2. Lee el README para entender el pipeline ejecutado
3. Explora los artefactos en `.especdev/` para ver las specs, blueprints y tareas
4. Reproduce el ejemplo en tu propio proyecto:

```bash
/dc:iniciar --tipo api --nombre "mi-proyecto"
/dc:comenzar "Tu descripción aquí"
```

## Contribuir un ejemplo

Crea un PR con tu ejemplo siguiendo esta estructura:

```
examples/tu-ejemplo/
├── README.md                    # Descripción + pipeline ejecutado
└── .especdev/
    ├── config.yaml              # Configuración
    ├── estado.md                # Estado final
    ├── specs/*.feature          # Escenarios Gherkin
    ├── blueprints/*.md          # Blueprint técnico
    └── tareas/*.md              # Tareas TDD
```

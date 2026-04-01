# Habilidad: Sistema de Extensiones y Presets

**Versión:** 1.0.0
**Categoría:** Configuración
**Tipo:** Flexible

> Inspirado en el sistema de Extensions & Presets de GitHub Spec Kit.

## Cómo Mejora el Framework

Permite personalizar Don Cheli sin tocar el core. Tres niveles de personalización con resolución por prioridad:

```
⬆ Más alta prioridad
█ Overrides del proyecto (.dc/overrides/)
█ Presets (.dc/presets/<preset-id>/)  
█ Extensiones (.dc/extensiones/<ext-id>/)
█ Core de Don Cheli (plantillas/ y comandos/)
⬇ Más baja prioridad
```

## Extensiones — Agregar Nuevas Capacidades

Las extensiones agregan nuevos comandos, plantillas, o habilidades:

```
.dc/
└── extensiones/
    └── django/
        ├── extension.yml        # Metadata
        ├── comandos/
        │   └── django-migrate.md  # Nuevo comando
        ├── plantillas/
        │   └── model.py.template  # Template custom
        └── habilidades/
            └── django-orm/
                └── HABILIDAD.md   # Skill de Django
```

### extension.yml

```yaml
nombre: "django"
version: "1.0.0"
descripcion: "Soporte para Django ORM y migraciones"
autor: "equipo-backend"
dependencias:
  - python >= 3.10
  - django >= 5.0
```

### Instalar/Desinstalar

```bash
# Agregar extensión desde repo
/dc:extension agregar @github:usuario/especdev-django

# Agregar extensión local
/dc:extension agregar ./mis-extensiones/django/

# Listar extensiones
/dc:extension listar

# Remover
/dc:extension remover django
```

## Presets — Personalizar Flujos Existentes

Los presets modifican templates y configuraciones del core sin reemplazarlo:

```
.dc/
└── presets/
    └── empresa-xyz/
        ├── preset.yml
        ├── plantillas/
        │   └── plan.md.template    # Override del template de plan
        └── reglas/
            └── estandares.md       # Reglas adicionales de la empresa
```

### preset.yml

```yaml
nombre: "empresa-xyz"
version: "1.0.0"
descripcion: "Estándares de Empresa XYZ"
autor: "equipo-plataforma"
overrides:
  persona: "profesional"
  nivel_madurez: 2
  hooks_parar:
    - lint
    - tests
    - sonarqube
```

### Presets Incluidos

| Preset | Descripción |
|--------|-------------|
| `startup` | Velocidad sobre formalidad. Specs ligeras, minimal hooks |
| `enterprise` | Máxima formalidad. Todos los hooks, coverage 90%, ADRs obligatorios |
| `open-source` | Contributing guide, PR templates, CI público |
| `solo-dev` | Sin PRs, sin ramas, commits directos, hooks mínimos |

## Overrides del Proyecto

Para ajustes de un solo proyecto sin crear un preset:

```
.dc/
└── overrides/
    └── plantillas/
        └── tasks.md.template  # Override solo para este proyecto
```

## Resolución de Conflictos

Si múltiples presets/extensiones definen el mismo comando:
1. El de mayor prioridad gana
2. Al remover, se restaura automáticamente el siguiente en prioridad
3. Si no hay overrides, se usa el core de Don Cheli

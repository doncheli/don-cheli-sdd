# Best Practices para Skills (Anthropic Skills 2.0)

## Compatibilidad de Formatos

Don Cheli soporta dos formatos de skill:

### Formato Anthropic (SKILL.md)
```yaml
---
name: Skill Name
description: What it does and when to trigger it
---
# Instructions...
```

### Formato Don Cheli (HABILIDAD.md)
```yaml
---
nombre: Nombre de la Habilidad
descripcion: Qué hace y cuándo se activa
version: 1.0.0
autor: Autor
tags: [tag1, tag2]
activacion: "keyword1", "keyword2"
grado_libertad: alto | medio | bajo
---
# Instrucciones...
```

Ambos son leídos automáticamente. El formato Don Cheli tiene campos adicionales (version, tags, grado_libertad) que mejoran la gestión.

## Reglas de Escritura

### 1. Metadata es lo más importante
La metadata (YAML frontmatter) determina si la skill se activa o no. Claude lee SOLO la metadata al inicio de sesión. El body se carga bajo demanda.

**Buena metadata:**
```yaml
description: Generates weekly team reports from standup notes and PR activity. Triggers on "weekly report", "team update", "sprint summary", "what did we do this week".
```

**Mala metadata:**
```yaml
description: A useful skill for reports
```

### 2. Límite de 500 líneas
Si el SKILL.md supera 500 líneas, separar:
- `SKILL.md` — Instrucciones principales (< 500 líneas)
- `templates/` — Archivos de plantilla
- `reference.md` — Material de referencia detallado
- `examples/` — Ejemplos completos

Usar instrucciones en SKILL.md para guiar a Claude a cargar archivos adicionales solo cuando se necesiten (Progressive Disclosure).

### 3. Solo incluir lo que Claude no sabe
- No incluir: conocimiento general (lenguajes, frameworks, librerías populares)
- No incluir: documentación que Claude ya tiene en su training data
- Incluir: reglas específicas de la empresa/equipo
- Incluir: formatos y templates propios
- Incluir: quirks de herramientas internas
- Incluir: workflows específicos del proyecto
- Incluir: convenciones no estándar

### 4. Grado de libertad
Ajustar la granularidad de las instrucciones al tipo de tarea:

| Grado | Tipo de tarea | Formato |
|-------|--------------|---------|
| **Alto** | Creativa (redacción, diseño, brainstorming) | Guidelines generales, principios |
| **Medio** | Workflow con variaciones (code review, reportes) | Pseudocódigo, pasos con parámetros |
| **Bajo** | Proceso crítico (deploy, migración, seguridad) | Script exacto, pocos parámetros |

### 5. Progressive Disclosure (3 capas)
```
Capa 1: Metadata (YAML)     → Siempre cargada (~20 tokens por skill)
Capa 2: Body (Markdown)     → Cargada al activar la skill
Capa 3: File References     → Cargadas solo si se necesitan
```

Esto permite tener muchas skills sin impactar el context window.

### 6. MCP + Skills = Cocina + Receta
- **MCP** define QUÉ herramientas están disponibles (la cocina)
- **Skills** enseñan CÓMO usar esas herramientas (las recetas)

Si usas un MCP server, crea skills que orquesten sus herramientas.

## Estructura de Directorio

### Skills de Anthropic
```
.claude/skills/
  mi-skill/
    SKILL.md
    templates/
    reference.md
```

### Skills de Don Cheli
```
habilidades/
  mi-habilidad/
    HABILIDAD.md
    plantillas/
    referencia.md
```

Ambas ubicaciones son escaneadas automáticamente.

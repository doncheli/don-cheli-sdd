# Habilidad: Integración Obsidian

**Versión:** 1.0.0
**Categoría:** Documentación
**Tipo:** Flexible

> Adaptado de [obsidian-skills](https://github.com/kepano/obsidian-skills) — Markdown Obsidian-flavored + canvas.

## Propósito

Generar documentación compatible con Obsidian usando wikilinks, propiedades, callouts y canvas para visualización de arquitectura.

## Capacidades

### 1. Markdown Obsidian-Flavored

| Feature | Sintaxis | Uso en Don Cheli |
|---------|---------|------------------|
| Wikilinks | `[[archivo]]` | Vincular specs, planes, hallazgos |
| Embeds | `![[archivo]]` | Incrustar diagramas en docs |
| Callouts | `> [!tip]` | Destacar decisiones, warnings |
| Propiedades | YAML frontmatter | Metadata de specs y planes |
| Tags | `#tag` | Categorizar hallazgos |
| Block refs | `^block-id` | Referenciar secciones específicas |

### 2. JSON Canvas (Diagramas)

Generar archivos `.canvas` para visualizar:
- Mapa arquitectónico del proyecto
- Flujo de datos entre módulos
- Dependencias entre features
- Pipeline de desarrollo

```json
{
  "nodes": [
    { "id": "a1b2c3", "type": "text", "text": "API Gateway",
      "x": 0, "y": 0, "width": 200, "height": 100 }
  ],
  "edges": [
    { "id": "e1f2g3", "fromNode": "a1b2c3", "toNode": "d4e5f6" }
  ]
}
```

### 3. Propiedades (Frontmatter)

```yaml
---
titulo: Spec de Autenticación
tipo: spec
estado: en-progreso
prioridad: P1
tags: [auth, seguridad, api]
creado: 2026-03-22
autor: DonCheli
---
```

### 4. Callouts para Decisiones

```markdown
> [!decision] Usar JWT sobre sesiones
> **Contexto:** API stateless para múltiples clientes
> **Alternativas:** Sesiones server-side, OAuth tokens
> **Motivo:** Escalabilidad horizontal sin sticky sessions

> [!warning] Riesgo de seguridad
> Los tokens JWT no se pueden revocar individualmente.
> Mitigación: refresh tokens con blacklist en Redis.
```

## Cuándo Activar

- Si el proyecto usa Obsidian como knowledge base
- Si se detecta carpeta `.obsidian/` en el vault
- Si el usuario lo solicita explícitamente

## Guardrails

- Wikilinks solo para archivos internos del vault
- Links externos con markdown estándar `[texto](url)`
- Canvas máximo 20 nodos (legibilidad)
- Propiedades siempre en YAML, nunca inline

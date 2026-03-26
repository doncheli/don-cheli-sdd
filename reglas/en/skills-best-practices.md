# Best Practices for Skills (Anthropic Skills 2.0)

## Format Compatibility

Don Cheli supports two skill formats:

### Anthropic Format (SKILL.md)
```yaml
---
name: Skill Name
description: What it does and when to trigger it
---
# Instructions...
```

### Don Cheli Format (HABILIDAD.md)
```yaml
---
nombre: Skill Name
descripcion: What it does and when to trigger it
version: 1.0.0
autor: Author
tags: [tag1, tag2]
activacion: "keyword1", "keyword2"
grado_libertad: alto | medio | bajo
---
# Instructions...
```

Both are read automatically. The Don Cheli format has additional fields (version, tags, grado_libertad) that improve management.

## Writing Rules

### 1. Metadata is the most important part
Metadata (YAML frontmatter) determines whether the skill activates or not. Claude reads ONLY the metadata at session start. The body is loaded on demand.

**Good metadata:**
```yaml
description: Generates weekly team reports from standup notes and PR activity. Triggers on "weekly report", "team update", "sprint summary", "what did we do this week".
```

**Bad metadata:**
```yaml
description: A useful skill for reports
```

### 2. 500-line limit
If the SKILL.md exceeds 500 lines, split it:
- `SKILL.md` — Main instructions (< 500 lines)
- `templates/` — Template files
- `reference.md` — Detailed reference material
- `examples/` — Complete examples

Use instructions in SKILL.md to guide Claude to load additional files only when needed (Progressive Disclosure).

### 3. Only include what Claude doesn't know
- Don't include: general knowledge (popular languages, frameworks, libraries)
- Don't include: documentation already in Claude's training data
- Include: company/team-specific rules
- Include: proprietary formats and templates
- Include: quirks of internal tools
- Include: project-specific workflows
- Include: non-standard conventions

### 4. Degree of freedom
Adjust instruction granularity to the task type:

| Degree | Task type | Format |
|--------|-----------|--------|
| **High** | Creative (writing, design, brainstorming) | General guidelines, principles |
| **Medium** | Workflow with variations (code review, reports) | Pseudocode, steps with parameters |
| **Low** | Critical process (deploy, migration, security) | Exact script, few parameters |

### 5. Progressive Disclosure (3 layers)
```
Layer 1: Metadata (YAML)     → Always loaded (~20 tokens per skill)
Layer 2: Body (Markdown)     → Loaded when the skill activates
Layer 3: File References     → Loaded only when needed
```

This allows having many skills without impacting the context window.

### 6. MCP + Skills = Kitchen + Recipe
- **MCP** defines WHAT tools are available (the kitchen)
- **Skills** teach HOW to use those tools (the recipes)

If you use an MCP server, create skills that orchestrate its tools.

## Directory Structure

### Anthropic Skills
```
.claude/skills/
  my-skill/
    SKILL.md
    templates/
    reference.md
```

### Don Cheli Skills
```
habilidades/
  mi-habilidad/
    HABILIDAD.md
    plantillas/
    referencia.md
```

Both locations are scanned automatically.

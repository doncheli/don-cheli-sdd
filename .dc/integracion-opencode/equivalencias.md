# Mapa de Equivalencias: don-cheli-sdd → OpenCode

## Skills

| don-cheli-sdd | OpenCode | Notas |
|---------------|----------|-------|
| `.agent/skills/doncheli-spec/SKILL.md` | `.opencode/skills/doncheli-spec/SKILL.md` | Solo mover |
| `.agent/skills/doncheli-review/SKILL.md` | `.opencode/skills/doncheli-review/SKILL.md` | Solo mover |
| `.agent/skills/doncheli-implement/SKILL.md` | `.opencode/skills/doncheli-implement/SKILL.md` | Solo mover |
| `habilidades/arnes-agente/HABILIDAD.md` | `.opencode/skills/arnes-agente/SKILL.md` | Traducir ES→EN |
| `habilidades/auto-correccion/HABILIDAD.md` | `.opencode/skills/auto-correccion/SKILL.md` | Traducir ES→EN |

## Skills Principales (Prioridad)

### Tier 1: Core Skills (necesarios para pipeline)

```
doncheli-spec      → .opencode/skills/doncheli-spec/SKILL.md
doncheli-implement → .opencode/skills/doncheli-implement/SKILL.md
doncheli-review    → .opencode/skills/doncheli-review/SKILL.md
doncheli-plan      → .opencode/skills/doncheli-plan/SKILL.md
doncheli-pipeline  → .opencode/skills/doncheli-pipeline/SKILL.md
```

### Tier 2: Reasoning & Analysis

```
doncheli-reasoning → .opencode/skills/doncheli-reasoning/SKILL.md
doncheli-debate    → .opencode/skills/doncheli-debate/SKILL.md
doncheli-estimate  → .opencode/skills/doncheli-estimate/SKILL.md
```

### Tier 3: Specialized

```
doncheli-security   → .opencode/skills/doncheli-security/SKILL.md
doncheli-migrate    → .opencode/skills/doncheli-migrate/SKILL.md
doncheli-drift      → .opencode/skills/doncheli-drift/SKILL.md
doncheli-pr-review  → .opencode/skills/doncheli-pr-review/SKILL.md
```

## Commands

| don-cheli-sdd | OpenCode | Notas |
|---------------|----------|-------|
| `/dc:comenzar` | `.opencode/command/dc-comenzar.md` | Slash command |
| `/dc:especificar` | `.opencode/command/dc-especificar.md` | Slash command |
| `/dc:implementar` | `.opencode/command/dc-implementar.md` | Slash command |
| `/dc:revisar` | `.opencode/command/dc-revisar.md` | Slash command |
| `/razonar:5-porques` | `.opencode/command/razonar-5-porques.md` | Slash command |

## Agent

| don-cheli-sdd | OpenCode | Notas |
|---------------|----------|-------|
| `.opencode/agents/doncheli.md` | `.opencode/agents/doncheli.md` | ✅ Ya existe |
| `AGENTS.md` | `.opencode/agents/doncheli.md` (append) | Consolidar rules |
| `CLAUDE.md` | `.opencode/agents/doncheli.md` (append) | Consolidar rules |

## Rules

| don-cheli-sdd | OpenCode | Notas |
|---------------|----------|-------|
| `reglas/leyes-hierro.md` | → doncheli.md frontmatter | Iron laws |
| `reglas/constitucion.md` | → doncheli.md body | Constitution |
| `reglas/i18n.md` | → doncheli.md body | i18n config |
| `reglas/puertas-calidad.md` | → doncheli.md body | Quality gates |

## Formato SKILL.md (OpenCode)

```yaml
---
name: skill-name
description: "One-line description. Activate when user mentions X, Y, or Z."
---

# Skill Name

## Instructions
1. Step one
2. Step two

## Quality Gate
- Criterion 1
- Criterion 2
```

## Formato Command (OpenCode)

```yaml
---
description: "What this command does"
---
# Command Name

Execute the following steps:
1. ...
2. ...
```

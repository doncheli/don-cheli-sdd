# Plan de Integración: don-cheli-sdd → OpenCode Framework

## Resumen

| Fase | Alcance | Complejidad | Tiempo Est. |
|------|---------|-------------|-------------|
| 1 | Skills (ubicación) | Baja | 2-3h |
| 2 | Skills (traducción ES→EN) | Media | 4-6h |
| 3 | Commands | Media | 3-4h |
| 4 | Rules consolidation | Baja | 1-2h |
| 5 | Validación | Media | 2h |

**Total estimado: 12-17h**

---

## Fase 1: Migración de Skills (Ubicación)

### Objetivo
Mover skills de `.agent/skills/` a `.opencode/skills/`

### Acciones

```bash
# 1. Crear estructura destino
mkdir -p .opencode/skills

# 2. Migrar skills principales (doncheli-*)
for skill in .agent/skills/doncheli-*; do
  name=$(basename "$skill")
  mkdir -p ".opencode/skills/$name"
  cp "$skill/SKILL.md" ".opencode/skills/$name/SKILL.md"
done

# 3. Migrar habilidades (arnés, auto-correccion, etc.)
for skill in habilidades/*/; do
  name=$(basename "$skill")
  mkdir -p ".opencode/skills/$name"
  # Convertir HABILIDAD.md → SKILL.md (traducir frontmatter)
done
```

### Validación

```bash
# Verificar estructura
ls .opencode/skills/ | wc -l  # Debe ser ~70

# Verificar formato SKILL.md
head -5 .opencode/skills/*/SKILL.md
```

---

## Fase 2: Traducción de Habilidades ES→EN

### Objetivo
Convertir `HABILIDAD.md` (español) a `SKILL.md` (inglés) para compatibilidad opencode.

### Conversión de Frontmatter

| Campo HABILIDAD | Campo SKILL | Ejemplo |
|-----------------|-------------|---------|
| `nombre` | `name` | `arnes-agente` |
| `descripcion` | `description` | "Configure agent..." |
| `version` | (omitir) | - |
| `autor` | (omitir) | - |
| `tags` | (omitir) | - |
| `activacion` | `description` | "harness, configure agent" |

### Contenido

- `# Habilidad: X` → `# X Skill`
- Mantener instrucciones técnicas en español si son código (comments, variables)
- Traducir títulos y descripciones narrativas

---

## Fase 3: Definición de Commands

### Objetivo
Crear `.opencode/command/` para los comandos `/dc:*`

### Lista Prioritaria (15 commands core)

```
dc:comenzar     → Iniciar proyecto SDD
dc:especificar  → Generar specs Gherkin
dc:implementar  → TDD execution
dc:revisar      → Peer review
dc:estimar      → Estimation models
dc:debatir      → Adversarial debate
dc:planificar   → Team planning
dc:auditar      → Security audit
dc:migrar       → Stack migration
dc:drift        → Spec/code divergence
dc:pr-review    → PR review
dc:tech-debt    → Tech debt detection
dc:context-health → Context window health
dc:diagram      → Mermaid diagrams
dc:spec-score   → Spec quality score
```

### Formato

```markdown
---
description: "Start a new SDD project. Activates when user says: start, begin, new project"
---

# dc:comenzar

## Usage
`@doncheli start "<task>"`

## Steps
1. Detect complexity level (P0-P4)
2. Create `.dc/` structure
3. Generate initial spec draft
```

---

## Fase 4: Consolidación de Rules

### Objetivo
Unificar `reglas/*.md` en el agent definition.

### Estructura Final del Agent

```markdown
---
description: "Don Cheli SDD Framework..."
mode: primary
model: anthropic/claude-sonnet-4-20250514
---

# Don Cheli — SDD Framework Agent

## Iron Laws (from reglas/leyes-hierro.md)
1. TDD: All production code requires tests
2. Root cause first, then fix
3. Evidence before assertions

## Constitution (from reglas/constitucion.md)
...

## Quality Gates (from reglas/puertas-calidad.md)
...

## Language
- Code: English
- Communication: User's configured language (es/en/pt)

## How to invoke
- Commands: @doncheli <command>
- Skills: activated by keywords
```

---

## Fase 5: Validación End-to-End

### Checklist

- [ ] `.opencode/skills/` tiene 70+ skills
- [ ] `.opencode/agents/doncheli.md` carga correctamente
- [ ] `.opencode/command/dc-comenzar.md` funciona
- [ ] Al menos 5 skills core funcionan (spec, implement, review, plan, reasoning)
- [ ] Iron laws aparecen en context

### Test Manual

```bash
# En proyecto de prueba
opencode
@doncheli spec "user registration"
# Debe generar .feature file

@doncheli implement "Button component"
# Debe mostrar RED phase
```

---

## Orden de Migración (Waves)

### Wave 1: Agent + 5 Core Skills (2h)
- [ ] doncheli.md agent
- [ ] doncheli-spec
- [ ] doncheli-implement
- [ ] doncheli-review
- [ ] doncheli-plan
- [ ] doncheli-reasoning

### Wave 2: Commands + 5 Skills (3h)
- [ ] 10 commands (`/dc:comenzar` through `/dc:revisar`)
- [ ] doncheli-estimate
- [ ] doncheli-debate
- [ ] doncheli-security
- [ ] doncheli-migrate

### Wave 3: Habilidades (4h)
- [ ] 10 habilidades traducidas (arnes-agente, auto-correccion, etc.)
- [ ] doncheli-pr-review
- [ ] doncheli-drift
- [ ] doncheli-context-health
- [ ] doncheli-diagram

### Wave 4: Remaining + Cleanup (3h)
- [ ] Todas las habilidades traducidas
- [ ] Todos los commands definidos
- [ ] Rules consolidados
- [ ] Documentation actualizada

---

## Scripts de Validación

```bash
#!/bin/bash
# validar-integracion.sh

echo "=== Validación Integración SDD → OpenCode ==="

# Skills
skill_count=$(ls .opencode/skills/*/SKILL.md 2>/dev/null | wc -l)
echo "Skills: $skill_count (esperado: 70+)"

# Agent
if [ -f .opencode/agents/doncheli.md ]; then
  echo "✅ Agent: doncheli.md existe"
else
  echo "❌ Agent: doncheli.md NO existe"
fi

# Commands
cmd_count=$(ls .opencode/command/*.md 2>/dev/null | wc -l)
echo "Commands: $cmd_count (esperado: 72+)"

# Iron laws en agent
if grep -q "Iron Laws" .opencode/agents/doncheli.md; then
  echo "✅ Rules: Iron laws consolidadas"
else
  echo "❌ Rules: Iron laws NO encontradas"
fi
```

---

## Integración con Pipeline SDD

```
integracion-opencode
  → dc:migrar --solo-plan ✅ (este documento)
  → dc:poc (opcional) → validar en proyecto piloto
  → dc:implementar → ejecutar por waves
  → dc:revisar → review de integración
```

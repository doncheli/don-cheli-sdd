---
name: doncheli-diagnostics
description: Verify the health of the Don Cheli setup in the current project, detecting missing files and configuration issues. Activate when user mentions "diagnostics", "health check", "verify setup", "diagnostico", "framework status", "setup issues", "check Don Cheli", "validar configuracion".
---

# /dc:diagnostico

## Instructions

Verify that the Don Cheli setup in the project is complete and functional. Detect missing files, inconsistent configuration, and common problems. Propose automatic repairs when possible.

## Verification Categories

### 1. .dc/ Structure

Check existence and validity of:
- `config.yaml` — project configuration
- `estado.md` — current state
- `plan.md` — phases plan
- `hallazgos.md` — findings (optional, created on explore)
- `progreso.md` — progress log
- `memoria/` — memory directory

### 2. Configuration

Verify:
- `proyecto.nombre` is defined
- `proyecto.tipo` is valid
- `modelos.default` is defined
- `idioma` is set (default: "es")

### 3. Environment

Check:
- Git is initialized
- Current branch
- Docker availability (for `/dc:implementar`)
- Language runtime detected (Node/Python/Go)
- Linter configured
- Tests configured

### 4. Pipeline

Verify:
- `specs/features/` directory exists
- Feature files found with their states
- `specs/db_schema/` directory (optional)
- Constitution present

## Output Format

```markdown
## Don Cheli Diagnostics: <project-name>

| Category | Status | Issues |
|----------|--------|--------|
| Structure | OK/Warning | N |
| Configuration | OK/Warning | N |
| Environment | OK/Warning | N |
| Pipeline | OK/Warning | N |

### Warnings
1. <warning with fix suggestion>

### Result: HEALTHY / FUNCTIONAL / NEEDS ATTENTION
```

## Result Classification

| Result | Meaning |
|--------|---------|
| **HEALTHY** | Everything works, warnings are optional |
| **FUNCTIONAL** | Works but with limitations |
| **NEEDS ATTENTION** | Critical files missing, run `/dc:iniciar` |

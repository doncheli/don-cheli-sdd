---
description: Detectar actualizaciones del framework Don Cheli y aplicarlas
i18n: true
---

# /dc:actualizar

## Objetivo

Verificar si hay actualizaciones disponibles en el repositorio de Don Cheli y ofrecer aplicarlas.

## Uso

```
/dc:actualizar
/dc:actualizar --verificar    # Solo verificar, no aplicar
/dc:actualizar --forzar       # Aplicar sin confirmar
```

## Proceso

### 1. Detectar instalación

```bash
# Verificar dónde está instalado
GLOBAL="$HOME/.claude/don-cheli"
LOCAL="./.claude/don-cheli"

if [ -f "$GLOBAL/VERSION" ]; then
  INSTALACION="$GLOBAL"
elif [ -f "$LOCAL/VERSION" ]; then
  INSTALACION="$LOCAL"
else
  echo "Don Cheli no está instalado"
  exit 1
fi

VERSION_LOCAL=$(cat "$INSTALACION/VERSION")
```

### 2. Verificar versión remota

```bash
VERSION_REMOTA=$(curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION)
```

### 3. Comparar

```
=== Verificación de Actualización ===

Versión instalada: 1.6.0
Versión disponible: 1.7.0

Estado: ⚠️ Actualización disponible
```

### 4. Mostrar cambios

Obtener el changelog entre versiones:

```bash
# Mostrar commits entre versiones
curl -s "https://api.github.com/repos/doncheli/don-cheli-sdd/compare/v${VERSION_LOCAL}...v${VERSION_REMOTA}" \
  | jq '.commits[].commit.message'
```

### 5. Preguntar al usuario

```
¿Deseas actualizar Don Cheli de v1.6.0 a v1.7.0? (s/n)
```

### 6. Aplicar actualización

```bash
# Clonar versión nueva en temporal
TEMP=$(mktemp -d)
git clone --depth 1 https://github.com/doncheli/don-cheli-sdd.git "$TEMP"

# Ejecutar instalador
cd "$TEMP" && bash scripts/instalar.sh --global

# Limpiar
rm -rf "$TEMP"
```

## Output

```
=== Actualización Completada ===

✅ Don Cheli actualizado: v1.6.0 → v1.7.0

Cambios aplicados:
- 3 habilidades nuevas
- 2 comandos nuevos
- 5 archivos actualizados

Reinicia Claude Code para aplicar los cambios.
```

## Verificación de Anthropic Skills 2.0

Además de actualizar el framework, este comando verifica la conformidad con el estándar Anthropic Agent Skills.

### Proceso de verificación

```
1. FETCH — Obtener spec y template desde el repo oficial
   ├── https://github.com/anthropics/skills/blob/main/spec/agent-skills-spec.md
   ├── https://github.com/anthropics/skills/blob/main/template/SKILL.md
   └── https://agentskills.io/specification (spec completa)

2. COMPARE — Comparar con el formato actual del framework
   ├── Campos requeridos en frontmatter (name, description)
   ├── Campos nuevos agregados al spec
   ├── Convenciones de naming (lowercase, hyphens, max 64 chars)
   ├── Estructura de directorios (skill-name/SKILL.md)
   └── Features nuevas (hooks, allowed-tools, model, effort, etc.)

3. AUDIT — Validar archivos del framework
   ├── Comandos en comandos/especdev/*.md → frontmatter válido
   ├── Comandos en comandos/razonar/*.md → frontmatter válido
   ├── Skills en .agent/skills/*/SKILL.md → conformidad Anthropic
   ├── Habilidades en habilidades/*/HABILIDAD.md → formato extendido
   └── Naming conventions en todos los archivos

4. REPORT — Generar reporte de conformidad
```

### Output de verificación Skills 2.0

```
=== Anthropic Skills 2.0 — Verificación de Conformidad ===

Spec source: https://agentskills.io/specification
Template source: https://github.com/anthropics/skills/blob/main/template/SKILL.md
Last check: 2026-03-24

Campos requeridos:
  ✅ name — presente en todos los skills
  ✅ description — presente en todos los skills y comandos

Campos opcionales detectados en spec:
  ✅ allowed-tools — soportado
  ✅ model — soportado
  ✅ effort — soportado
  ⚠️ hooks — no implementado en habilidades Don Cheli (solo en .agent/skills)
  ⚠️ context: fork — no implementado

Naming:
  ✅ 125/125 archivos siguen convención lowercase-hyphens

Novedades en el spec (si las hay):
  ℹ️ Nuevo campo "argument-hint" detectado — considerar agregar
  ℹ️ Nuevo campo "disable-model-invocation" — considerar agregar

Resumen: 98% conformidad | 2 campos opcionales pendientes
```

### Qué se verifica contra el spec oficial

| Check | Fuente | Qué valida |
|-------|--------|------------|
| Frontmatter YAML | Template oficial | `---` delimiters, campos `name` + `description` |
| Naming | Spec | Solo lowercase, números, hyphens (max 64 chars) |
| Estructura | Spec | `skill-name/SKILL.md` dentro del directorio de skills |
| Campos opcionales | Spec en agentskills.io | Nuevos campos agregados al estándar |
| Plugin format | `.claude-plugin` | Compatibilidad con marketplace oficial |
| Description length | Spec | Max 1024 chars recomendado |

### Comando combinado

```bash
/dc:actualizar                    # Actualiza framework + verifica Skills 2.0
/dc:actualizar --solo-skills      # Solo verificar conformidad Skills 2.0
/dc:actualizar --verificar        # Solo verificar, no aplicar nada
/dc:actualizar --forzar           # Aplicar sin confirmar
```

## Verificación Automática

Si se configura en `.especdev/config.yaml`:

```yaml
actualizaciones:
  verificar_al_iniciar: true
  frecuencia: semanal  # diario | semanal | nunca
  verificar_skills_spec: true  # Verificar conformidad Anthropic Skills 2.0
```

El comando `/dc:continuar` verifica automáticamente si hay actualizaciones disponibles y notifica al usuario sin interrumpir el flujo.

## Fuentes oficiales

- Spec: https://agentskills.io/specification
- Repo: https://github.com/anthropics/skills
- Template: https://github.com/anthropics/skills/blob/main/template/SKILL.md
- Docs: https://support.claude.com/en/articles/12512198-creating-custom-skills

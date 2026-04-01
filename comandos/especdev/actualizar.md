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
/dc:actualizar --auto         # Auto-actualizar con auditoría de seguridad (usado por auto-check de sesión)
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

### 5. Auditoría de seguridad pre-actualización

Antes de aplicar cualquier actualización, ejecutar auditoría de seguridad sobre los cambios:

```
1. DIFF — Obtener archivos cambiados entre versiones
   curl -s "https://api.github.com/repos/doncheli/don-cheli-sdd/compare/v${VERSION_LOCAL}...v${VERSION_REMOTA}" \
     | jq '.files[].filename'

2. CLONAR — Descargar versión nueva en temporal
   TEMP=$(mktemp -d)
   git clone --depth 1 https://github.com/doncheli/don-cheli-sdd.git "$TEMP"

3. AUDITAR — Análisis de seguridad sobre archivos cambiados
   Ejecutar /dc:auditar-seguridad sobre $TEMP con:
   - Buscar secretos hardcoded (API keys, tokens, passwords)
   - Buscar inyección de comandos en scripts (exec, eval, spawn)
   - Verificar que scripts de instalación no ejecuten código arbitrario
   - Verificar integridad de dependencias (package.json, lockfile)
   - Buscar URLs/endpoints sospechosos nuevos
   - Verificar que no se introduzcan permisos excesivos

4. CLASIFICAR — Severidad de hallazgos
   🔴 Crítico → BLOQUEAR actualización, notificar al usuario
   🟠 Alto → ADVERTIR, aplicar con nota de riesgo
   🟡 Medio/🔵 Bajo → Registrar, no bloquear
```

#### Output de auditoría pre-actualización

```markdown
=== Auditoría de Seguridad Pre-Actualización ===

Versión: v{local} → v{remota}
Archivos cambiados: {N}
Archivos auditados: {N} (scripts, configs, código ejecutable)

Resultado: ✅ LIMPIO | ⚠️ ADVERTENCIAS | 🛑 BLOQUEADO

Hallazgos:
  (lista de hallazgos si los hay)
```

### 6. Preguntar al usuario (modo interactivo)

En modo interactivo (sin `--auto` ni `--forzar`):
```
¿Deseas actualizar Don Cheli de v1.6.0 a v1.7.0? (s/n)
```

En modo `--auto`: aplicar directamente si la auditoría pasa. Bloquear si hay hallazgos críticos.

### 7. Aplicar actualización

```bash
# Usar el temporal ya clonado en paso 5.2
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

## Configuración de Auto-Actualización

En `.dc/config.yaml`:

```yaml
actualizaciones:
  verificar_al_iniciar: true
  auto_actualizar: true          # Aplicar actualizaciones automáticamente (requiere auditoría limpia)
  auditoria_pre_update: true     # Auditoría de seguridad obligatoria antes de aplicar
  frecuencia: siempre            # siempre | diario | semanal | nunca
  verificar_skills_spec: true    # Verificar conformidad Anthropic Skills 2.0
  bloquear_en_critico: true      # Detener actualización si hay hallazgos 🔴
```

### Comportamiento al inicio de sesión

Cada vez que un cliente inicia sesión con Don Cheli:
1. Verificar versión remota vs local
2. Si hay actualización → ejecutar `/dc:actualizar --auto` en background
3. El proceso no bloquea la interacción del usuario
4. El usuario recibe notificación al completar (éxito o bloqueo)

### Flujo `--auto`

```
Inicio de sesión
  → Detectar versión remota
  → Si nueva versión disponible:
    → Clonar en temporal
    → Auditoría de seguridad (--severidad critica)
    → Si 🔴 Crítico → BLOQUEAR + notificar
    → Si limpio → instalar + notificar éxito
    → Verificar Skills 2.0 (si habilitado)
    → Limpiar temporal
```

## Fuentes oficiales

- Spec: https://agentskills.io/specification
- Repo: https://github.com/anthropics/skills
- Template: https://github.com/anthropics/skills/blob/main/template/SKILL.md
- Docs: https://support.claude.com/en/articles/12512198-creating-custom-skills

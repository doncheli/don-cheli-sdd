#!/bin/bash
# migrate-commands-to-skills.sh
# Migra comandos de comandos/especdev/ a habilidades/dc-*/
# Formato source: comandos/especdev/*.md (command format)
# Formato target: habilidades/dc-*/SKILL.md (skill format)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="${SCRIPT_DIR}/comandos/especdev"
TARGET_DIR="${SCRIPT_DIR}/habilidades"

echo "=== Migración: Commands → Skills ==="
echo "Source: ${SOURCE_DIR}"
echo "Target: ${TARGET_DIR}"
echo ""

# Crear directorio de habilidades si no existe
mkdir -p "${TARGET_DIR}"

# Contadores
MIGRATED=0
SKIPPED=0

# Por cada command .md
for cmd_file in "${SOURCE_DIR}"/*.md; do
    [ -f "$cmd_file" ] || continue

    # Obtener nombre del comando (sin extensión)
    cmd_name=$(basename "$cmd_file" .md)

    # Skip razonar (es un prefijo de razon/razonar/*, no un comando)
    if [[ "$cmd_name" == razonar ]]; then
        echo "  ⏭️  Saltando razonar (no es comando DC)"
        continue
    fi

    # Directorio target: habilidades/dc-{nombre}/
    skill_dir="${TARGET_DIR}/dc-${cmd_name}"
    mkdir -p "$skill_dir"

    # Verificar si ya existe
    if [ -f "${skill_dir}/SKILL.md" ] && [ -s "${skill_dir}/SKILL.md" ]; then
        echo "  ⏭️  Saltando ${cmd_name} (ya existe)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi

    # Leer el frontmatter del command
    description=$(awk '
        /^---$/ && !started { started=1; next }
        started && /^---$/ { exit }
        /^description:/ { sub(/^description: */, ""); print }
    ' "$cmd_file")

    if [ -z "$description" ]; then
        description="Comando ${cmd_name} - description missing"
    fi

    # Extraer el body (todo después del segundo ---)
    # Filtrar empty lines y eliminar "# /dc:xxx" si existe
    body=$(awk '
        /^---$/ && !started { started=1; next }
        started && /^---$/ { got_end=1; next }
        got_end { print }
    ' "$cmd_file" | grep -v '^$' | sed '/^# \/dc:/d' | sed 's/^# /## /' | sed 's/^### /#### /')

    # Crear el SKILL.md
    cat > "${skill_dir}/SKILL.md" << EOF
---
name: dc-${cmd_name}
description: ${description}
i18n: true
---

${body}
EOF

    echo "  ✅ ${cmd_name} → ${skill_dir}/SKILL.md"
    MIGRATED=$((MIGRATED + 1))
done

echo ""
echo "=== Resumen ==="
echo "Migrados: ${MIGRATED}"
echo "Saltados: ${SKIPPED}"
echo ""
echo "Nota: Revisar los SKILL.md generados — el body puede necesitar ajustes manuales."

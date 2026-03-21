#!/bin/bash
# Don Cheli - Script de Instalación
# Instala el framework Don Cheli en un proyecto o globalmente

set -e

VERSION="1.6.0"
REPO_URL="https://github.com/doncheli/don-cheli-sdd"

# Colores
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Don Cheli — SDD Framework v${VERSION}        ║${NC}"
echo -e "${CYAN}║   Deja de improvisar. Empieza a entregar. ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════╝${NC}"
echo ""

# Detectar directorio fuente (donde está el framework)
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Detectar modo de instalación
MODO="local"
if [ "$1" == "--global" ]; then
    MODO="global"
fi

if [ "$MODO" == "global" ]; then
    FRAMEWORK_HOME="$HOME/.claude/don-cheli"
    COMMANDS_DIR="$HOME/.claude/commands"
    echo -e "${AMARILLO}Modo: Instalación global${NC}"
    echo -e "${AMARILLO}Framework: ${FRAMEWORK_HOME}${NC}"
    echo -e "${AMARILLO}Comandos:  ${COMMANDS_DIR}${NC}"
else
    FRAMEWORK_HOME="./.claude/don-cheli"
    COMMANDS_DIR="./.claude/commands"
    echo -e "${AMARILLO}Modo: Instalación local en proyecto actual${NC}"
    echo -e "${AMARILLO}Framework: ${FRAMEWORK_HOME}${NC}"
    echo -e "${AMARILLO}Comandos:  ${COMMANDS_DIR}${NC}"
fi

echo ""

# ─── 1. Crear estructura del framework ───
echo "📁 Creando estructura..."
mkdir -p "${FRAMEWORK_HOME}/habilidades"
mkdir -p "${FRAMEWORK_HOME}/reglas"
mkdir -p "${FRAMEWORK_HOME}/plantillas"
mkdir -p "${FRAMEWORK_HOME}/ganchos"
mkdir -p "${FRAMEWORK_HOME}/agentes"
mkdir -p "${FRAMEWORK_HOME}/scripts"
mkdir -p "${COMMANDS_DIR}/especdev"
mkdir -p "${COMMANDS_DIR}/razonar"

# ─── 2. Copiar comandos (slash commands para Claude Code) ───
echo "📋 Copiando comandos..."
if [ -d "${SCRIPT_DIR}/comandos/especdev" ]; then
    cp -r "${SCRIPT_DIR}/comandos/especdev/"*.md "${COMMANDS_DIR}/especdev/" 2>/dev/null || true
    CMDS_ESPECDEV=$(ls "${COMMANDS_DIR}/especdev/"*.md 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✅ ${CMDS_ESPECDEV} comandos /especdev:*"
fi
if [ -d "${SCRIPT_DIR}/comandos/razonar" ]; then
    cp -r "${SCRIPT_DIR}/comandos/razonar/"*.md "${COMMANDS_DIR}/razonar/" 2>/dev/null || true
    CMDS_RAZONAR=$(ls "${COMMANDS_DIR}/razonar/"*.md 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✅ ${CMDS_RAZONAR} comandos /razonar:*"
fi
# Comandos sueltos (bucle, historias-generar, etc.)
for CMD_FILE in "${SCRIPT_DIR}/comandos/"*.md; do
    [ -f "$CMD_FILE" ] && cp "$CMD_FILE" "${COMMANDS_DIR}/" 2>/dev/null || true
done

# ─── 3. Copiar habilidades ───
echo "🧠 Copiando habilidades..."
if [ -d "${SCRIPT_DIR}/habilidades" ]; then
    cp -r "${SCRIPT_DIR}/habilidades/"* "${FRAMEWORK_HOME}/habilidades/" 2>/dev/null || true
    SKILLS=$(ls -d "${FRAMEWORK_HOME}/habilidades/"*/ 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✅ ${SKILLS} habilidades"
fi

# ─── 4. Copiar reglas ───
echo "⚖️  Copiando reglas..."
if [ -d "${SCRIPT_DIR}/reglas" ]; then
    cp -r "${SCRIPT_DIR}/reglas/"* "${FRAMEWORK_HOME}/reglas/" 2>/dev/null || true
    RULES=$(ls "${FRAMEWORK_HOME}/reglas/"*.md 2>/dev/null | wc -l | tr -d ' ')
    echo "   ✅ ${RULES} reglas"
fi

# ─── 5. Copiar plantillas ───
echo "📄 Copiando plantillas..."
if [ -d "${SCRIPT_DIR}/plantillas" ]; then
    cp -r "${SCRIPT_DIR}/plantillas/"* "${FRAMEWORK_HOME}/plantillas/" 2>/dev/null || true
    echo "   ✅ Plantillas copiadas"
fi

# ─── 6. Copiar ganchos (hooks) ───
echo "🪝 Copiando ganchos..."
if [ -d "${SCRIPT_DIR}/ganchos" ]; then
    cp -r "${SCRIPT_DIR}/ganchos/"* "${FRAMEWORK_HOME}/ganchos/" 2>/dev/null || true
    echo "   ✅ Ganchos copiados"
fi

# ─── 7. Copiar agentes ───
echo "🤖 Copiando agentes..."
if [ -d "${SCRIPT_DIR}/agentes" ]; then
    cp -r "${SCRIPT_DIR}/agentes/"* "${FRAMEWORK_HOME}/agentes/" 2>/dev/null || true
    echo "   ✅ Agentes copiados"
fi

# ─── 8. Copiar scripts ───
echo "⚙️  Copiando scripts..."
cp "${SCRIPT_DIR}/scripts/"*.sh "${FRAMEWORK_HOME}/scripts/" 2>/dev/null || true
echo "   ✅ Scripts copiados"

# ─── 9. Copiar archivos raíz ───
echo "📝 Copiando archivos de referencia..."
for ROOT_FILE in CLAUDE.md AGENTS.md prompt.md NOTICE; do
    if [ -f "${SCRIPT_DIR}/${ROOT_FILE}" ]; then
        cp "${SCRIPT_DIR}/${ROOT_FILE}" "${FRAMEWORK_HOME}/" 2>/dev/null || true
    fi
done
echo "   ✅ CLAUDE.md, AGENTS.md, prompt.md, NOTICE"

# ─── 10. Crear versión ───
echo "${VERSION}" > "${FRAMEWORK_HOME}/VERSION"

# ─── Resumen ───
echo ""
echo -e "${VERDE}══════════════════════════════════════════${NC}"
echo -e "${VERDE}  ✅ Don Cheli v${VERSION} instalado exitosamente${NC}"
echo -e "${VERDE}══════════════════════════════════════════${NC}"
echo ""
echo "Estructura instalada:"
echo "  📂 ${FRAMEWORK_HOME}/"
echo "     ├── habilidades/    (${SKILLS} skills)"
echo "     ├── reglas/         (${RULES} reglas)"
echo "     ├── plantillas/"
echo "     ├── ganchos/"
echo "     ├── agentes/"
echo "     └── CLAUDE.md"
echo ""
echo "  📂 ${COMMANDS_DIR}/"
echo "     ├── especdev/       (${CMDS_ESPECDEV} comandos)"
echo "     └── razonar/        (${CMDS_RAZONAR} comandos)"
echo ""
echo -e "${CYAN}Próximos pasos:${NC}"
echo "  1. Reiniciá Claude Code"
echo "  2. En cualquier proyecto ejecutá: /especdev:iniciar"
echo ""
echo -e "${VERDE}¡Deja de improvisar. Empieza a entregar!${NC}"

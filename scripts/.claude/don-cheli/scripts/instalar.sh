#!/bin/bash
# Don Cheli - Installation Script (i18n)
# Installs the Don Cheli framework locally or globally

set -euo pipefail

VERSION="1.8.0"
REPO_URL="https://github.com/doncheli/don-cheli-sdd"
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════
# i18n — JSON locale loader (pure bash, no jq dependency)
# ═══════════════════════════════════════════════════════════════

LOCALE="es"
LOCALE_FILE=""

# Extract a flat key from JSON (e.g., "installer.banner_line1")
# Works without jq — uses grep + sed for simple key-value extraction
i18n() {
    local key="$1"
    local section="${key%%.*}"
    local rest="${key#*.}"
    local subkey="${rest%%.*}"
    local leaf="${rest#*.}"

    # Handle 2-level keys (section.key)
    if [ "$rest" = "$leaf" ]; then
        leaf="$subkey"
        subkey=""
    fi

    if [ -z "$LOCALE_FILE" ] || [ ! -f "$LOCALE_FILE" ]; then
        echo "$key"
        return
    fi

    local value
    if [ -n "$subkey" ] && [ "$subkey" != "$leaf" ]; then
        # 3-level key: section.subsection.key
        value=$(grep -A1 "\"$leaf\"" "$LOCALE_FILE" | grep -o '"[^"]*"$' | head -1 | tr -d '"' 2>/dev/null)
    else
        # 2-level key: section.key
        value=$(grep "\"$leaf\"" "$LOCALE_FILE" | head -1 | sed 's/.*: *"//;s/",\{0,1\}$//' 2>/dev/null)
    fi

    if [ -n "$value" ]; then
        echo "$value"
    else
        echo "$key"
    fi
}

# Template replacement: {{var}} → value
tpl() {
    local text="$1"
    shift
    while [ $# -gt 0 ]; do
        local var="$1"
        local val="$2"
        text="${text//\{\{$var\}\}/$val}"
        shift 2
    done
    echo "$text"
}

load_locale() {
    LOCALE_FILE="${SCRIPT_DIR}/locales/${LOCALE}.json"
    if [ ! -f "$LOCALE_FILE" ]; then
        LOCALE_FILE="${SCRIPT_DIR}/locales/es.json"
        LOCALE="es"
    fi
}

# ═══════════════════════════════════════════════════════════════
# Localized folder names per language
# ═══════════════════════════════════════════════════════════════

set_folder_names() {
    case "$LOCALE" in
        en)
            DIR_SKILLS="skills"
            DIR_RULES="rules"
            DIR_TEMPLATES="templates"
            DIR_HOOKS="hooks"
            DIR_AGENTS="agents"
            DIR_SCRIPTS="scripts"
            DIR_ESPECDEV=".especdev"
            FILE_STATUS="status.md"
            FILE_FINDINGS="findings.md"
            FILE_PLAN="plan.md"
            FILE_PROGRESS="progress.md"
            FILE_PROPOSAL="proposal.md"
            FILE_CONFIG="config.yaml"
            ;;
        pt)
            DIR_SKILLS="habilidades"
            DIR_RULES="regras"
            DIR_TEMPLATES="modelos"
            DIR_HOOKS="ganchos"
            DIR_AGENTS="agentes"
            DIR_SCRIPTS="scripts"
            DIR_ESPECDEV=".especdev"
            FILE_STATUS="estado.md"
            FILE_FINDINGS="descobertas.md"
            FILE_PLAN="plano.md"
            FILE_PROGRESS="progresso.md"
            FILE_PROPOSAL="proposta.md"
            FILE_CONFIG="config.yaml"
            ;;
        *)  # es (default)
            DIR_SKILLS="habilidades"
            DIR_RULES="reglas"
            DIR_TEMPLATES="plantillas"
            DIR_HOOKS="ganchos"
            DIR_AGENTS="agentes"
            DIR_SCRIPTS="scripts"
            DIR_ESPECDEV=".especdev"
            FILE_STATUS="estado.md"
            FILE_FINDINGS="hallazgos.md"
            FILE_PLAN="plan.md"
            FILE_PROGRESS="progreso.md"
            FILE_PROPOSAL="propuesta.md"
            FILE_CONFIG="config.yaml"
            ;;
    esac
}

# ═══════════════════════════════════════════════════════════════
# STEP 0 — Language Selection (FIRST THING THE USER SEES)
# ═══════════════════════════════════════════════════════════════

clear 2>/dev/null || true
echo ""
echo -e "${CYAN}${BOLD}"
echo "  ╔═══════════════════════════════════════════════════════════╗"
echo "  ║                                                           ║"
echo "  ║           🏗️  Don Cheli — SDD Framework                   ║"
echo "  ║                                                           ║"
echo "  ╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${BOLD}  🌍 Selecciona tu idioma / Select your language / Selecione seu idioma${NC}"
echo ""
echo -e "     ${CYAN}1)${NC}  🇪🇸  Español"
echo -e "     ${CYAN}2)${NC}  🇬🇧  English"
echo -e "     ${CYAN}3)${NC}  🇧🇷  Português"
echo ""
echo -ne "  ${BOLD}▸ ${NC}"
# Read from /dev/tty to work even when script is piped via curl
if ! read -r LANG_CHOICE < /dev/tty 2>/dev/null; then
    echo ""
    echo -e "  ${YELLOW}⚠ Cannot read input (piped mode). Using default: Español${NC}"
    echo -e "  ${DIM}  Tip: use --lang es|en|pt to set language non-interactively${NC}"
    LANG_CHOICE="es"
fi

case "$LANG_CHOICE" in
    1|es|ES|español|Español)
        LOCALE="es"
        LANG_NAME="Español"
        ;;
    2|en|EN|english|English)
        LOCALE="en"
        LANG_NAME="English"
        ;;
    3|pt|PT|português|Português|portugues)
        LOCALE="pt"
        LANG_NAME="Português"
        ;;
    *)
        echo ""
        echo -e "  ${RED}✗ Invalid option / Opción inválida / Opção inválida${NC}"
        echo -e "  ${DIM}  Using default: Español${NC}"
        LOCALE="es"
        LANG_NAME="Español"
        ;;
esac

load_locale
set_folder_names

echo ""
echo -e "  ${GREEN}✓${NC} $(tpl "$(i18n installer.language_selected)" language "$LANG_NAME")"
echo ""
sleep 0.5

# ═══════════════════════════════════════════════════════════════
# Banner (in selected language)
# ═══════════════════════════════════════════════════════════════

BANNER_1=$(tpl "$(i18n installer.banner_line1)" version "$VERSION")
BANNER_2=$(i18n installer.banner_line2)

echo -e "${CYAN}${BOLD}"
echo "  ┌───────────────────────────────────────────────────────┐"
printf "  │  %-53s │\n" "$BANNER_1"
printf "  │  %-53s │\n" "$BANNER_2"
echo "  └───────────────────────────────────────────────────────┘"
echo -e "${NC}"

# ═══════════════════════════════════════════════════════════════
# Detect installation mode
# ═══════════════════════════════════════════════════════════════

MODE="local"
if [ "$1" == "--global" ] || [ "$2" == "--global" ]; then
    MODE="global"
fi

if [ "$MODE" == "global" ]; then
    FRAMEWORK_HOME="$HOME/.claude/don-cheli"
    COMMANDS_DIR="$HOME/.claude/commands"
    echo -e "  ${YELLOW}$(i18n installer.mode_global)${NC}"
else
    FRAMEWORK_HOME="./.claude/don-cheli"
    COMMANDS_DIR="./.claude/commands"
    echo -e "  ${YELLOW}$(i18n installer.mode_local)${NC}"
fi

echo -e "  ${DIM}$(tpl "$(i18n installer.framework_path)" path "$FRAMEWORK_HOME")${NC}"
echo -e "  ${DIM}$(tpl "$(i18n installer.commands_path)" path "$COMMANDS_DIR")${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# 1. Create structure
# ═══════════════════════════════════════════════════════════════

# Guard: abort if FRAMEWORK_HOME is empty to prevent rm -rf on system root
if [ -z "$FRAMEWORK_HOME" ]; then
    echo -e "  ${RED}✗ Error: FRAMEWORK_HOME is empty. Aborting to prevent data loss.${NC}"
    exit 1
fi

# Clean previous locale folders to avoid leftovers from other languages
echo -e "  🧹 Cleaning previous installation..."
for OLD_DIR in habilidades skills reglas rules plantillas templates modelos ganchos hooks agentes agents; do
    if [ -d "${FRAMEWORK_HOME}/${OLD_DIR}" ]; then
        rm -rf "${FRAMEWORK_HOME}/${OLD_DIR}"
    fi
done

echo -e "  📁 $(i18n installer.step_structure)"
mkdir -p "${FRAMEWORK_HOME}/${DIR_SKILLS}"
mkdir -p "${FRAMEWORK_HOME}/${DIR_RULES}"
mkdir -p "${FRAMEWORK_HOME}/${DIR_TEMPLATES}"
mkdir -p "${FRAMEWORK_HOME}/${DIR_HOOKS}"
mkdir -p "${FRAMEWORK_HOME}/${DIR_AGENTS}"
mkdir -p "${FRAMEWORK_HOME}/${DIR_SCRIPTS}"
mkdir -p "${FRAMEWORK_HOME}/locales"
mkdir -p "${COMMANDS_DIR}/especdev"
mkdir -p "${COMMANDS_DIR}/dc"
mkdir -p "${COMMANDS_DIR}/razonar"

# ═══════════════════════════════════════════════════════════════
# 2. Copy commands
# ═══════════════════════════════════════════════════════════════

echo -e "  📋 $(i18n installer.step_commands)"
if [ -d "${SCRIPT_DIR}/comandos/especdev" ]; then
    cp -r "${SCRIPT_DIR}/comandos/especdev/"*.md "${COMMANDS_DIR}/especdev/" 2>/dev/null || true
    # Create /dc: alias (same commands, shorter prefix)
    cp -r "${SCRIPT_DIR}/comandos/especdev/"*.md "${COMMANDS_DIR}/dc/" 2>/dev/null || true
    CMDS_ESPECDEV=$(ls "${COMMANDS_DIR}/especdev/"*.md 2>/dev/null | wc -l | tr -d ' ')
    echo -e "     ${GREEN}✓${NC} $(tpl "$(i18n installer.step_commands_done)" count "$CMDS_ESPECDEV")"
    echo -e "     ${GREEN}✓${NC} /dc:* alias created (${CMDS_ESPECDEV} commands)"
    # Rename dc/ commands to match locale
    if [ "$LOCALE" = "en" ]; then
        cd "${COMMANDS_DIR}/dc/" 2>/dev/null && {
            # Rename Spanish → English (longest names first to avoid conflicts)
            for pair in \
                "analizar-sesiones:analyze-sessions" \
                "auditar-seguridad:security-audit" \
                "avance-rapido:fast-forward" \
                "cerrar-sesion:close-session" \
                "contrato-api:api-contract" \
                "contrato-ui:ui-contract" \
                "crear-skill:create-skill" \
                "detectar-ambiguedad:detect-ambiguity" \
                "limpiar-slop:clean-slop" \
                "mesa-redonda:roundtable" \
                "mesa-tecnica:tech-panel" \
                "minar-referencias:mine-refs" \
                "planificar-tecnico:tech-plan" \
                "validar-spec:validate-spec" \
                "donde-estoy:where-am-i" \
                "pseudocodigo:pseudocode" \
                "reflexionar:reflect" \
                "diagnostico:diagnostic" \
                "especificar:specify" \
                "implementar:implement" \
                "incorporar:onboard" \
                "actualizar:update" \
                "comenzar:start" \
                "continuar:continue" \
                "capturar:capture" \
                "desglosar:breakdown" \
                "destilar:distill" \
                "explorar:explore" \
                "historial:history" \
                "memorizar:memorize" \
                "presentar:present" \
                "proponer:propose" \
                "traspasar:handoff" \
                "traspaso:handover" \
                "archivar:archive" \
                "completo:full" \
                "guardian:guardian" \
                "iniciar:init" \
                "migrar:migrate" \
                "reversa:reverse" \
                "revisar:review" \
                "cambios:changes" \
                "aplicar:apply" \
                "estimar:estimate" \
                "validar:validate" \
                "clarificar:clarify" \
                "rapido:quick" \
                "estado:status" \
                "agente:agent"; do
                src="${pair%%:*}.md"
                dst="${pair##*:}.md"
                [ -f "$src" ] && mv "$src" "$dst" 2>/dev/null
            done
            cd - >/dev/null
        }
        echo -e "     ${GREEN}✓${NC} Commands renamed to English"
    elif [ "$LOCALE" = "pt" ]; then
        cd "${COMMANDS_DIR}/dc/" 2>/dev/null && {
            for pair in \
                "analizar-sesiones:analisar-sessoes" \
                "auditar-seguridad:auditar-segurança" \
                "avance-rapido:avanço-rapido" \
                "cerrar-sesion:fechar-sessao" \
                "crear-skill:criar-skill" \
                "detectar-ambiguedad:detectar-ambiguidade" \
                "limpiar-slop:limpar-slop" \
                "donde-estoy:onde-estou" \
                "reflexionar:refletir" \
                "incorporar:integrar" \
                "actualizar:atualizar" \
                "comenzar:começar" \
                "desglosar:decompor" \
                "presentar:apresentar" \
                "proponer:propor" \
                "traspasar:transferir" \
                "traspaso:transferencia" \
                "archivar:arquivar" \
                "guardian:guardiao" \
                "cambios:mudanças" \
                "historial:historico"; do
                src="${pair%%:*}.md"
                dst="${pair##*:}.md"
                [ -f "$src" ] && mv "$src" "$dst" 2>/dev/null
            done
            cd - >/dev/null
        }
        echo -e "     ${GREEN}✓${NC} Commands renamed to Português"
    fi
fi
if [ -d "${SCRIPT_DIR}/comandos/razonar" ]; then
    cp -r "${SCRIPT_DIR}/comandos/razonar/"*.md "${COMMANDS_DIR}/razonar/" 2>/dev/null || true
    CMDS_RAZONAR=$(ls "${COMMANDS_DIR}/razonar/"*.md 2>/dev/null | wc -l | tr -d ' ')
    echo -e "     ${GREEN}✓${NC} $(tpl "$(i18n installer.step_reasoning_done)" count "$CMDS_RAZONAR")"
fi
for CMD_FILE in "${SCRIPT_DIR}/comandos/"*.md; do
    [ -f "$CMD_FILE" ] && cp "$CMD_FILE" "${COMMANDS_DIR}/" 2>/dev/null || true
done

# ═══════════════════════════════════════════════════════════════
# 3. Copy skills
# ═══════════════════════════════════════════════════════════════

echo -e "  🧠 $(i18n installer.step_skills)"
if [ -d "${SCRIPT_DIR}/habilidades" ]; then
    cp -r "${SCRIPT_DIR}/habilidades/"* "${FRAMEWORK_HOME}/${DIR_SKILLS}/" 2>/dev/null || true
    SKILLS=$(ls -d "${FRAMEWORK_HOME}/${DIR_SKILLS}/"*/ 2>/dev/null | wc -l | tr -d ' ')
    echo -e "     ${GREEN}✓${NC} $(tpl "$(i18n installer.step_skills_done)" count "$SKILLS")"
fi

# ═══════════════════════════════════════════════════════════════
# 4. Copy rules
# ═══════════════════════════════════════════════════════════════

echo -e "  ⚖️  $(i18n installer.step_rules)"
if [ -d "${SCRIPT_DIR}/reglas" ]; then
    cp -r "${SCRIPT_DIR}/reglas/"* "${FRAMEWORK_HOME}/${DIR_RULES}/" 2>/dev/null || true
    RULES=$(ls "${FRAMEWORK_HOME}/${DIR_RULES}/"*.md 2>/dev/null | wc -l | tr -d ' ')
    echo -e "     ${GREEN}✓${NC} $(tpl "$(i18n installer.step_rules_done)" count "$RULES")"
fi

# ═══════════════════════════════════════════════════════════════
# 5. Copy templates
# ═══════════════════════════════════════════════════════════════

echo -e "  📄 $(i18n installer.step_templates)"
if [ -d "${SCRIPT_DIR}/plantillas" ]; then
    cp -r "${SCRIPT_DIR}/plantillas/"* "${FRAMEWORK_HOME}/${DIR_TEMPLATES}/" 2>/dev/null || true
    echo -e "     ${GREEN}✓${NC} $(i18n installer.step_templates_done)"
fi

# ═══════════════════════════════════════════════════════════════
# 6. Copy hooks
# ═══════════════════════════════════════════════════════════════

echo -e "  🪝 $(i18n installer.step_hooks)"
if [ -d "${SCRIPT_DIR}/ganchos" ]; then
    cp -r "${SCRIPT_DIR}/ganchos/"* "${FRAMEWORK_HOME}/${DIR_HOOKS}/" 2>/dev/null || true
    echo -e "     ${GREEN}✓${NC} $(i18n installer.step_hooks_done)"
fi

# ═══════════════════════════════════════════════════════════════
# 7. Copy agents
# ═══════════════════════════════════════════════════════════════

echo -e "  🤖 $(i18n installer.step_agents)"
if [ -d "${SCRIPT_DIR}/agentes" ]; then
    cp -r "${SCRIPT_DIR}/agentes/"* "${FRAMEWORK_HOME}/${DIR_AGENTS}/" 2>/dev/null || true
    echo -e "     ${GREEN}✓${NC} $(i18n installer.step_agents_done)"
fi

# ═══════════════════════════════════════════════════════════════
# 8. Copy scripts
# ═══════════════════════════════════════════════════════════════

echo -e "  ⚙️  $(i18n installer.step_scripts)"
cp "${SCRIPT_DIR}/scripts/"*.sh "${FRAMEWORK_HOME}/${DIR_SCRIPTS}/" 2>/dev/null || true
echo -e "     ${GREEN}✓${NC} $(i18n installer.step_scripts_done)"

# ═══════════════════════════════════════════════════════════════
# 9. Copy locales
# ═══════════════════════════════════════════════════════════════

echo -e "  🌍 Copying locales..."
if [ -d "${SCRIPT_DIR}/locales" ]; then
    cp -r "${SCRIPT_DIR}/locales/"*.json "${FRAMEWORK_HOME}/locales/" 2>/dev/null || true
    echo -e "     ${GREEN}✓${NC} es.json, en.json, pt.json"
fi

# ═══════════════════════════════════════════════════════════════
# 10. Copy root files
# ═══════════════════════════════════════════════════════════════

echo -e "  📝 $(i18n installer.step_reference)"
for ROOT_FILE in CLAUDE.md AGENTS.md prompt.md NOTICE; do
    if [ -f "${SCRIPT_DIR}/${ROOT_FILE}" ]; then
        cp "${SCRIPT_DIR}/${ROOT_FILE}" "${FRAMEWORK_HOME}/" 2>/dev/null || true
    fi
done
echo -e "     ${GREEN}✓${NC} $(i18n installer.step_reference_done)"

# ═══════════════════════════════════════════════════════════════
# 11. Save locale preference + version
# ═══════════════════════════════════════════════════════════════

echo "${VERSION}" > "${FRAMEWORK_HOME}/VERSION"
echo "${LOCALE}" > "${FRAMEWORK_HOME}/locale"

# Save folder name mapping for Claude to read
cat > "${FRAMEWORK_HOME}/folder-map.json" << FMEOF
{
  "locale": "${LOCALE}",
  "dirs": {
    "skills": "${DIR_SKILLS}",
    "rules": "${DIR_RULES}",
    "templates": "${DIR_TEMPLATES}",
    "hooks": "${DIR_HOOKS}",
    "agents": "${DIR_AGENTS}",
    "scripts": "${DIR_SCRIPTS}"
  },
  "files": {
    "status": "${FILE_STATUS}",
    "findings": "${FILE_FINDINGS}",
    "plan": "${FILE_PLAN}",
    "progress": "${FILE_PROGRESS}",
    "proposal": "${FILE_PROPOSAL}",
    "config": "${FILE_CONFIG}"
  }
}
FMEOF

# ═══════════════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════════════

echo ""
echo -e "  ${GREEN}${BOLD}══════════════════════════════════════════════════════${NC}"
echo -e "  ${GREEN}${BOLD}  ✅ $(tpl "$(i18n installer.success_title)" version "$VERSION")${NC}"
echo -e "  ${GREEN}${BOLD}══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  $(i18n installer.structure_title)"
echo -e "    📂 ${FRAMEWORK_HOME}/"
echo -e "       ├── ${DIR_SKILLS}/    (${SKILLS})"
echo -e "       ├── ${DIR_RULES}/     (${RULES})"
echo -e "       ├── ${DIR_TEMPLATES}/"
echo -e "       ├── ${DIR_HOOKS}/"
echo -e "       ├── ${DIR_AGENTS}/"
echo -e "       ├── locales/          (es, en, pt)"
echo -e "       └── CLAUDE.md"
echo ""
echo -e "    📂 ${COMMANDS_DIR}/"
echo -e "       ├── dc/               (${CMDS_ESPECDEV} — short alias)"
echo -e "       ├── especdev/         (${CMDS_ESPECDEV} $(i18n installer.structure_commands))"
echo -e "       └── razonar/          (${CMDS_RAZONAR} $(i18n installer.structure_commands))"
echo ""
echo -e "    🌍 Locale: ${BOLD}${LANG_NAME}${NC} (${LOCALE})"
echo ""
echo -e "  ${CYAN}$(i18n installer.next_steps_title)${NC}"
echo -e "    1. $(i18n installer.next_step_1)"
echo -e "    2. $(i18n installer.next_step_2)"
echo ""
echo -e "  ${GREEN}${BOLD}$(i18n installer.farewell)${NC}"
echo ""

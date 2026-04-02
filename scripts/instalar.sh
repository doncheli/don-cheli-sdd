#!/bin/bash
# Don Cheli - Installation Script (i18n)
# Installs the Don Cheli framework locally or globally

set -euo pipefail

VERSION="1.17.0"
REPO_URL="https://github.com/doncheli/don-cheli-sdd"
CLEANUP_TMPDIR=""

# Detect if running via pipe (curl | bash) or directly
if [ -t 0 ] && [ -f "$0" ]; then
    # Running directly from a file
    SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
else
    # Running via pipe (curl | bash) — clone repo to temp dir
    # Use INSTALL_TMPDIR to avoid colliding with system $TMPDIR
    INSTALL_TMPDIR=$(mktemp -d)
    CLEANUP_TMPDIR="$INSTALL_TMPDIR"
    echo -e "  ⬇️  Downloading Don Cheli v${VERSION}..."
    if ! git clone --depth 1 --quiet "$REPO_URL" "$INSTALL_TMPDIR/don-cheli-sdd" 2>/dev/null; then
        echo -e "\033[0;31m  ✗ Failed to clone repository. Check your internet connection.\033[0m"
        rm -rf "$INSTALL_TMPDIR"
        exit 1
    fi
    SCRIPT_DIR="$INSTALL_TMPDIR/don-cheli-sdd"
    echo -e "  \033[0;32m✓\033[0m Downloaded successfully."
    echo ""
fi

cleanup() {
    if [ -n "$CLEANUP_TMPDIR" ] && [ -d "$CLEANUP_TMPDIR" ]; then
        rm -rf "$CLEANUP_TMPDIR"
    fi
}
trap cleanup EXIT

# ═══════════════════════════════════════════════════════════════
# Dependencies — install gum if interactive mode needs it
# ═══════════════════════════════════════════════════════════════

HAS_GUM=false
if command -v gum &>/dev/null; then
    HAS_GUM=true
fi

install_gum() {
    if [ "$HAS_GUM" = true ]; then return 0; fi
    echo -e "  📦 Installing gum (interactive UI)..."
    if command -v brew &>/dev/null; then
        brew install gum --quiet 2>/dev/null && HAS_GUM=true && return 0
    fi
    if command -v apt-get &>/dev/null; then
        sudo mkdir -p /etc/apt/keyrings
        curl -fsSL https://repo.charm.sh/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/charm.gpg 2>/dev/null
        echo "deb [signed-by=/etc/apt/keyrings/charm.gpg] https://repo.charm.sh/apt/ * *" | sudo tee /etc/apt/sources.list.d/charm.list >/dev/null
        sudo apt-get update -qq 2>/dev/null && sudo apt-get install -y -qq gum 2>/dev/null && HAS_GUM=true && return 0
    fi
    if command -v yum &>/dev/null; then
        echo '[charm]
name=Charm
baseurl=https://repo.charm.sh/yum/
enabled=1
gpgcheck=1
gpgkey=https://repo.charm.sh/yum/gpg.key' | sudo tee /etc/yum.repos.d/charm.repo >/dev/null
        sudo yum install -y gum 2>/dev/null && HAS_GUM=true && return 0
    fi
    echo -e "  ${YELLOW:-}⚠ Could not install gum. Using fallback mode.${NC:-}"
    return 1
}

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
            FILE_STATUS="estado.md"
            FILE_FINDINGS="hallazgos.md"
            FILE_PLAN="plan.md"
            FILE_PROGRESS="progreso.md"
            FILE_PROPOSAL="propuesta.md"
            FILE_CONFIG="config.yaml"
            ;;
    esac

    # Retrocompatible: usar .especdev/ si ya existe, .dc/ si es nuevo
    if [ -d ".especdev" ]; then
        DIR_ESPECDEV=".especdev"
    else
        DIR_ESPECDEV=".dc"
    fi
}

# ═══════════════════════════════════════════════════════════════
# STEP 0 — Language Selection (FIRST THING THE USER SEES)
# ═══════════════════════════════════════════════════════════════

# Parse --lang flag from arguments (e.g., --lang es)
LANG_FLAG=""
for arg in "$@"; do
    case "$arg" in
        --lang=*) LANG_FLAG="${arg#*=}" ;;
    esac
done
# Also check positional: --lang es
PREV=""
for arg in "$@"; do
    if [ "$PREV" = "--lang" ]; then
        LANG_FLAG="$arg"
    fi
    PREV="$arg"
done

# Parse new interactive flags
TOOLS_FLAG=""
PROFILE_FLAG=""
SKILLS_FLAG=""
COMMANDS_FLAG=""
DRY_RUN=false
INTERACTIVE_MODE=false

PREV=""
for arg in "$@"; do
    case "$arg" in
        --tools=*) TOOLS_FLAG="${arg#*=}"; INTERACTIVE_MODE=true ;;
        --profile=*) PROFILE_FLAG="${arg#*=}"; INTERACTIVE_MODE=true ;;
        --skills=*) SKILLS_FLAG="${arg#*=}"; INTERACTIVE_MODE=true ;;
        --comandos=*) COMMANDS_FLAG="${arg#*=}"; INTERACTIVE_MODE=true ;;
        --dry-run) DRY_RUN=true; INTERACTIVE_MODE=true ;;
    esac
    if [ "$PREV" = "--tools" ]; then TOOLS_FLAG="$arg"; INTERACTIVE_MODE=true; fi
    if [ "$PREV" = "--profile" ]; then PROFILE_FLAG="$arg"; INTERACTIVE_MODE=true; fi
    if [ "$PREV" = "--skills" ]; then SKILLS_FLAG="$arg"; INTERACTIVE_MODE=true; fi
    if [ "$PREV" = "--comandos" ]; then COMMANDS_FLAG="$arg"; INTERACTIVE_MODE=true; fi
    PREV="$arg"
done

# If no flags at all (pure invocation without --global or --lang), enable interactive
if [ $# -eq 0 ]; then
    INTERACTIVE_MODE=true
fi

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

if [ -n "$LANG_FLAG" ]; then
    # Language provided via flag — skip interactive prompt
    LANG_CHOICE="$LANG_FLAG"
else
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
# INTERACTIVE MODE (perfiles)
# ═══════════════════════════════════════════════════════════════

if [ "$INTERACTIVE_MODE" = true ]; then
    echo ""

    # Try to install gum for better interactive UI
    install_gum

    # Step 1: Tool Selection (if not provided via flag)
    if [ -z "$TOOLS_FLAG" ]; then
        GUM_TOOLS_OK=false
        if [ "$HAS_GUM" = true ]; then
            TOOLS_RAW=$(printf "Claude Code\nCodex\nCursor\nAntigravity\nWindsurf\nAmp\nContinue.dev\nOpenCode\nTodos" | \
                gum choose --no-limit \
                --header "¿Dónde quieres instalar Don Cheli SDD?" \
                --header.foreground="99" \
                --cursor.foreground="212" \
                --selected.foreground="120" \
                < /dev/tty 2>/dev/null) || true

            if [ -n "$TOOLS_RAW" ]; then
                TOOLS_FLAG=""
                while IFS= read -r tool; do
                    case "$tool" in
                        "Claude Code") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}claude" ;;
                        "Codex") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}codex" ;;
                        "Cursor") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}cursor" ;;
                        "Antigravity") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}antigravity" ;;
                        "Windsurf") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}windsurf" ;;
                        "Amp") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}amp" ;;
                        "Continue.dev") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}continue" ;;
                        "OpenCode") TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}opencode" ;;
                        "Todos") TOOLS_FLAG="claude,codex,cursor,antigravity,windsurf,amp,continue,opencode" ;;
                    esac
                done <<< "$TOOLS_RAW"
                GUM_TOOLS_OK=true
            fi
        fi
        if [ "$GUM_TOOLS_OK" = false ]; then
            echo -e "  ${BOLD}¿Dónde quieres instalar Don Cheli SDD?${NC}"
            echo ""
            echo -e "     ${CYAN}1)${NC}  Claude Code     (CLAUDE.md + comandos)"
            echo -e "     ${CYAN}2)${NC}  Codex           (AGENTS.md)"
            echo -e "     ${CYAN}3)${NC}  Cursor          (.cursorrules)"
            echo -e "     ${CYAN}4)${NC}  Antigravity     (GEMINI.md + .agent/)"
            echo -e "     ${CYAN}5)${NC}  Windsurf        (.windsurf/rules/)"
            echo -e "     ${CYAN}6)${NC}  Amp             (prompt.md)"
            echo -e "     ${CYAN}7)${NC}  Continue.dev    (.continue/config/)"
            echo -e "     ${CYAN}8)${NC}  OpenCode        (.opencode/ + @doncheli)"
            echo -e "     ${CYAN}9)${NC}  Todos"
            echo ""
            echo -ne "  ${BOLD}▸ Elige (números separados por coma): ${NC}"
            TOOLS_CHOICE=""
            read -r TOOLS_CHOICE < /dev/tty 2>/dev/null || read -r TOOLS_CHOICE 2>/dev/null || TOOLS_CHOICE=""
            if [ -z "$TOOLS_CHOICE" ]; then
                echo -e "  ${YELLOW}⚠ No se pudo leer input. Usando: Todos${NC}"
                TOOLS_CHOICE="9"
            fi

            TOOLS_FLAG=""
            for num in $(echo "$TOOLS_CHOICE" | tr ',' ' '); do
                case "$num" in
                    1) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}claude" ;;
                    2) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}codex" ;;
                    3) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}cursor" ;;
                    4) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}antigravity" ;;
                    5) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}windsurf" ;;
                    6) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}amp" ;;
                    7) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}continue" ;;
                    8) TOOLS_FLAG="${TOOLS_FLAG:+$TOOLS_FLAG,}opencode" ;;
                    9|all) TOOLS_FLAG="claude,codex,cursor,antigravity,windsurf,amp,continue,opencode" ;;
                esac
            done
        fi
        [ -z "$TOOLS_FLAG" ] && TOOLS_FLAG="claude"
        echo -e "  ${GREEN}✓${NC} Herramientas: ${TOOLS_FLAG}"
    fi

    # Step 2: Profile Selection (if not provided via flag)
    if [ -z "$PROFILE_FLAG" ]; then
        GUM_PROFILE_OK=false
        if [ "$HAS_GUM" = true ]; then
            PROFILE_CHOICE=$(printf "👻 Phantom Coder  [Full-stack]    — Pipeline completo, TDD, quality gates\n💀 Reaper Sec     [Seguridad]     — OWASP, auditoría, pentest workflow\n🏗  System Architect [Arquitectura] — Blueprints, SOLID, APIs, migraciones\n⚡ Speedrunner     [MVP/Startup]   — PoC, estimados, validación veloz\n🔮 The Oracle      [Razonamiento]  — 15 modelos mentales, análisis profundo\n🥷 Dev Dojo        [Aprendizaje]   — Documentación viva, ADRs, Obsidian\n⚙️  Custom          [Manual]        — Seleccionar skills y comandos manualmente" | \
                gum choose \
                --header "Elige tu perfil de desarrollador:" \
                --header.foreground="99" \
                --cursor.foreground="212" \
                < /dev/tty 2>/dev/null) || true

            if [ -n "$PROFILE_CHOICE" ]; then
                case "$PROFILE_CHOICE" in
                    *Phantom*)   PROFILE_FLAG="phantom" ;;
                    *Reaper*)    PROFILE_FLAG="reaper" ;;
                    *Architect*) PROFILE_FLAG="architect" ;;
                    *Speedrun*)  PROFILE_FLAG="speedrun" ;;
                    *Oracle*)    PROFILE_FLAG="oracle" ;;
                    *Dojo*)      PROFILE_FLAG="dojo" ;;
                    *Custom*)    PROFILE_FLAG="custom" ;;
                    *)           PROFILE_FLAG="phantom" ;;
                esac
                GUM_PROFILE_OK=true
            fi
        fi
        if [ "$GUM_PROFILE_OK" = false ]; then
            echo ""
            echo -e "  ${BOLD}Elige tu perfil de desarrollador:${NC}"
            echo ""
            echo -e "     ${CYAN}1)${NC}  👻 Phantom Coder   ${DIM}[Full-stack]${NC}     Pipeline completo, TDD, quality gates"
            echo -e "     ${CYAN}2)${NC}  💀 Reaper Sec      ${DIM}[Seguridad]${NC}      OWASP, auditoría, pentest workflow"
            echo -e "     ${CYAN}3)${NC}  🏗  System Architect ${DIM}[Arquitectura]${NC}  Blueprints, SOLID, APIs, migraciones"
            echo -e "     ${CYAN}4)${NC}  ⚡ Speedrunner      ${DIM}[MVP/Startup]${NC}   PoC, estimados, validación veloz"
            echo -e "     ${CYAN}5)${NC}  🔮 The Oracle       ${DIM}[Razonamiento]${NC}  15 modelos mentales, análisis profundo"
            echo -e "     ${CYAN}6)${NC}  🥷 Dev Dojo         ${DIM}[Aprendizaje]${NC}   Documentación viva, ADRs, Obsidian"
            echo -e "     ${CYAN}7)${NC}  ⚙️  Custom           ${DIM}[Manual]${NC}        Seleccionar todo manualmente"
            echo ""
            echo -ne "  ${BOLD}▸ ${NC}"
            PROFILE_CHOICE=""
            read -r PROFILE_CHOICE < /dev/tty 2>/dev/null || read -r PROFILE_CHOICE 2>/dev/null || PROFILE_CHOICE=""
            if [ -z "$PROFILE_CHOICE" ]; then
                echo -e "  ${YELLOW}⚠ No se pudo leer input. Usando: Phantom Coder${NC}"
                PROFILE_CHOICE="1"
            fi

            case "$PROFILE_CHOICE" in
                1|phantom)   PROFILE_FLAG="phantom" ;;
            2|reaper)    PROFILE_FLAG="reaper" ;;
            3|architect) PROFILE_FLAG="architect" ;;
            4|speedrun)  PROFILE_FLAG="speedrun" ;;
            5|oracle)    PROFILE_FLAG="oracle" ;;
            6|dojo)      PROFILE_FLAG="dojo" ;;
            7|custom)    PROFILE_FLAG="custom" ;;
            *)           PROFILE_FLAG="phantom" ;;
        esac
        fi
        echo -e "  ${GREEN}✓${NC} Perfil: ${PROFILE_FLAG}"
    fi

    # Load profile data
    PROFILE_DIR="${SCRIPT_DIR}/perfiles/${PROFILE_FLAG}"
    if [ -d "$PROFILE_DIR" ] && [ "$PROFILE_FLAG" != "custom" ]; then
        PROFILE_NAME=$(python3 -c "import json; print(json.load(open('$PROFILE_DIR/perfil.json'))['nombre'])" 2>/dev/null || echo "$PROFILE_FLAG")
        PROFILE_EMOJI=$(python3 -c "import json; print(json.load(open('$PROFILE_DIR/perfil.json'))['emoji'])" 2>/dev/null || echo "")
        PROFILE_SKILLS=$(cat "$PROFILE_DIR/skills.txt" 2>/dev/null | tr '\n' ',' | sed 's/,$//')
        PROFILE_COMMANDS=$(cat "$PROFILE_DIR/comandos.txt" 2>/dev/null | tr '\n' ',' | sed 's/,$//')

        SKILLS_COUNT=$(cat "$PROFILE_DIR/skills.txt" 2>/dev/null | wc -l | tr -d ' ')
        COMMANDS_COUNT=$(cat "$PROFILE_DIR/comandos.txt" 2>/dev/null | wc -l | tr -d ' ')
    else
        # Custom profile — interactive skill/command selection
        PROFILE_NAME="Custom"
        PROFILE_EMOJI="⚙️"

        # Try to install gum for interactive selection
        install_gum

        # Build skills list
        ALL_SKILLS=""
        ALL_SKILLS_ARRAY=()
        for skill_dir in "${SCRIPT_DIR}/habilidades/"*/; do
            [ -d "$skill_dir" ] || continue
            skill_name=$(basename "$skill_dir")
            ALL_SKILLS="${ALL_SKILLS}${skill_name}\n"
            ALL_SKILLS_ARRAY+=("$skill_name")
        done

        # Build commands list
        ALL_CMDS=""
        ALL_CMDS_ARRAY=()
        for cmd_file in "${SCRIPT_DIR}/comandos/especdev/"*.md; do
            [ -f "$cmd_file" ] || continue
            cmd_name="dc:$(basename "$cmd_file" .md)"
            ALL_CMDS="${ALL_CMDS}${cmd_name}\n"
            ALL_CMDS_ARRAY+=("$cmd_name")
        done
        for cmd_file in "${SCRIPT_DIR}/comandos/razonar/"*.md; do
            [ -f "$cmd_file" ] || continue
            cmd_name="razonar:$(basename "$cmd_file" .md)"
            ALL_CMDS="${ALL_CMDS}${cmd_name}\n"
            ALL_CMDS_ARRAY+=("$cmd_name")
        done

        CUSTOM_GUM_OK=false
        if [ "$HAS_GUM" = true ]; then
            echo ""
            echo -e "  ${BOLD}Selecciona las skills que necesitas:${NC}"
            echo ""

            SELECTED_SKILLS_RAW=$(printf "%b" "$ALL_SKILLS" | sort | gum choose --no-limit \
                --header "Skills — espacio para toggle, enter para confirmar" \
                --header.foreground="99" \
                --cursor.foreground="212" \
                --selected.foreground="120" \
                < /dev/tty 2>/dev/null) || true

            if [ -n "$SELECTED_SKILLS_RAW" ]; then
                PROFILE_SKILLS=$(echo "$SELECTED_SKILLS_RAW" | tr '\n' ',' | sed 's/,$//')
                SKILLS_COUNT=$(echo "$SELECTED_SKILLS_RAW" | grep -c . || echo "0")
                echo -e "  ${GREEN}✓${NC} ${SKILLS_COUNT} skills seleccionadas"
                echo ""

                echo -e "  ${BOLD}Selecciona los comandos que necesitas:${NC}"
                echo ""

                SELECTED_CMDS_RAW=$(printf "%b" "$ALL_CMDS" | sort | gum choose --no-limit \
                    --header "Comandos — espacio para toggle, enter para confirmar" \
                    --header.foreground="99" \
                    --cursor.foreground="212" \
                    --selected.foreground="120" \
                    < /dev/tty 2>/dev/null) || true

                if [ -n "$SELECTED_CMDS_RAW" ]; then
                    PROFILE_COMMANDS=$(echo "$SELECTED_CMDS_RAW" | tr '\n' ',' | sed 's/,$//')
                    COMMANDS_COUNT=$(echo "$SELECTED_CMDS_RAW" | grep -c . || echo "0")
                    echo -e "  ${GREEN}✓${NC} ${COMMANDS_COUNT} comandos seleccionados"
                    CUSTOM_GUM_OK=true
                fi
            fi
        fi

        if [ "$CUSTOM_GUM_OK" = false ]; then
            # Fallback: interactive numbered list
            echo ""
            echo -e "  ${BOLD}Selecciona las skills que necesitas:${NC}"
            echo -e "  ${DIM}(números separados por coma, 'a' para todas, enter para ninguna)${NC}"
            echo ""
            i=1
            for s in "${ALL_SKILLS_ARRAY[@]}"; do
                echo -e "     ${CYAN}${i})${NC}  ${s}"
                i=$((i + 1))
            done
            echo ""
            echo -ne "  ${BOLD}▸ ${NC}"
            SKILLS_CHOICE=""
            read -r SKILLS_CHOICE < /dev/tty 2>/dev/null || read -r SKILLS_CHOICE 2>/dev/null || SKILLS_CHOICE=""

            if [ "$SKILLS_CHOICE" = "a" ] || [ "$SKILLS_CHOICE" = "all" ]; then
                PROFILE_SKILLS=$(printf "%s," "${ALL_SKILLS_ARRAY[@]}" | sed 's/,$//')
                SKILLS_COUNT="${#ALL_SKILLS_ARRAY[@]}"
            elif [ -n "$SKILLS_CHOICE" ]; then
                PROFILE_SKILLS=""
                SKILLS_COUNT=0
                for num in $(echo "$SKILLS_CHOICE" | tr ',' ' '); do
                    idx=$((num - 1))
                    if [ "$idx" -ge 0 ] 2>/dev/null && [ "$idx" -lt "${#ALL_SKILLS_ARRAY[@]}" ]; then
                        PROFILE_SKILLS="${PROFILE_SKILLS:+$PROFILE_SKILLS,}${ALL_SKILLS_ARRAY[$idx]}"
                        SKILLS_COUNT=$((SKILLS_COUNT + 1))
                    fi
                done
            else
                # Empty = install all
                PROFILE_SKILLS=""
                SKILLS_COUNT="todas"
            fi
            echo -e "  ${GREEN}✓${NC} ${SKILLS_COUNT} skills seleccionadas"

            echo ""
            echo -e "  ${BOLD}Selecciona los comandos que necesitas:${NC}"
            echo -e "  ${DIM}(números separados por coma, 'a' para todos, enter para ninguno)${NC}"
            echo ""
            i=1
            for c in "${ALL_CMDS_ARRAY[@]}"; do
                echo -e "     ${CYAN}${i})${NC}  ${c}"
                i=$((i + 1))
            done
            echo ""
            echo -ne "  ${BOLD}▸ ${NC}"
            CMDS_CHOICE=""
            read -r CMDS_CHOICE < /dev/tty 2>/dev/null || read -r CMDS_CHOICE 2>/dev/null || CMDS_CHOICE=""

            if [ "$CMDS_CHOICE" = "a" ] || [ "$CMDS_CHOICE" = "all" ]; then
                PROFILE_COMMANDS=$(printf "%s," "${ALL_CMDS_ARRAY[@]}" | sed 's/,$//')
                COMMANDS_COUNT="${#ALL_CMDS_ARRAY[@]}"
            elif [ -n "$CMDS_CHOICE" ]; then
                PROFILE_COMMANDS=""
                COMMANDS_COUNT=0
                for num in $(echo "$CMDS_CHOICE" | tr ',' ' '); do
                    idx=$((num - 1))
                    if [ "$idx" -ge 0 ] 2>/dev/null && [ "$idx" -lt "${#ALL_CMDS_ARRAY[@]}" ]; then
                        PROFILE_COMMANDS="${PROFILE_COMMANDS:+$PROFILE_COMMANDS,}${ALL_CMDS_ARRAY[$idx]}"
                        COMMANDS_COUNT=$((COMMANDS_COUNT + 1))
                    fi
                done
            else
                # Empty = install all
                PROFILE_COMMANDS=""
                COMMANDS_COUNT="todos"
            fi
            echo -e "  ${GREEN}✓${NC} ${COMMANDS_COUNT} comandos seleccionados"
        fi
    fi

    # Override with explicit flags if provided
    [ -n "$SKILLS_FLAG" ] && PROFILE_SKILLS="$SKILLS_FLAG"
    [ -n "$COMMANDS_FLAG" ] && PROFILE_COMMANDS="$COMMANDS_FLAG"

    # Step 5: Summary
    echo ""
    echo -e "  ${CYAN}${BOLD}┌──────────────────────────────────────┐${NC}"
    echo -e "  ${CYAN}${BOLD}│  Resumen de instalación              │${NC}"
    echo -e "  ${CYAN}${BOLD}├──────────────────────────────────────┤${NC}"
    echo -e "  ${CYAN}${BOLD}│${NC}  Herramientas   ${TOOLS_FLAG}"
    echo -e "  ${CYAN}${BOLD}│${NC}  Perfil         ${PROFILE_EMOJI} ${PROFILE_NAME}"
    echo -e "  ${CYAN}${BOLD}│${NC}  Skills         ${SKILLS_COUNT}"
    echo -e "  ${CYAN}${BOLD}│${NC}  Comandos       ${COMMANDS_COUNT}"
    echo -e "  ${CYAN}${BOLD}│${NC}  Idioma         ${LANG_NAME} (${LOCALE})"
    echo -e "  ${CYAN}${BOLD}│${NC}  Destino        ${MODE:-local}"
    echo -e "  ${CYAN}${BOLD}└──────────────────────────────────────┘${NC}"
    echo ""

    if [ "$DRY_RUN" = true ]; then
        echo -e "  ${YELLOW}--dry-run: No se instalará nada.${NC}"
        echo ""
        echo -e "  Se generarían configs para: ${TOOLS_FLAG}"
        echo -e "  Perfil: ${PROFILE_EMOJI} ${PROFILE_NAME}"
        echo -e "  Skills: ${PROFILE_SKILLS}"
        echo -e "  Comandos: ${PROFILE_COMMANDS}"
        exit 0
    fi

    echo -ne "  ${BOLD}¿Confirmar instalación? [S/n] ${NC}"
    if ! read -r CONFIRM < /dev/tty 2>/dev/null; then
        CONFIRM="s"
    fi
    case "$CONFIRM" in
        n|N|no|NO) echo -e "  ${RED}Instalación cancelada.${NC}"; exit 0 ;;
    esac
    echo ""

    # Save profile selection for post-install config generation
    SELECTED_TOOLS="$TOOLS_FLAG"
    SELECTED_PROFILE="$PROFILE_FLAG"
    SELECTED_SKILLS="$PROFILE_SKILLS"
    SELECTED_COMMANDS="$PROFILE_COMMANDS"
fi

# ═══════════════════════════════════════════════════════════════
# Detect installation mode
# ═══════════════════════════════════════════════════════════════

MODE="local"
for arg in "$@"; do
    if [ "$arg" = "--global" ]; then
        MODE="global"
    fi
done

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
                [ -f "$src" ] && mv "$src" "$dst" 2>/dev/null || true
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
                [ -f "$src" ] && mv "$src" "$dst" 2>/dev/null || true
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
    # Copy base rules (Spanish)
    cp "${SCRIPT_DIR}/reglas/"*.md "${FRAMEWORK_HOME}/${DIR_RULES}/" 2>/dev/null || true
    # Overwrite with locale-specific translations if available
    if [ "$LOCALE" != "es" ] && [ -d "${SCRIPT_DIR}/reglas/${LOCALE}" ]; then
        cp "${SCRIPT_DIR}/reglas/${LOCALE}/"*.md "${FRAMEWORK_HOME}/${DIR_RULES}/" 2>/dev/null || true
        echo -e "     ${GREEN}✓${NC} Rules translated to ${LANG_NAME}"
    fi
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
# Copy locale-specific CLAUDE.md if available
if [ "$LOCALE" != "es" ] && [ -f "${SCRIPT_DIR}/CLAUDE.${LOCALE}.md" ]; then
    cp "${SCRIPT_DIR}/CLAUDE.${LOCALE}.md" "${FRAMEWORK_HOME}/CLAUDE.md" 2>/dev/null || true
    echo -e "     ${GREEN}✓${NC} CLAUDE.md translated to ${LANG_NAME}"
elif [ -f "${SCRIPT_DIR}/CLAUDE.md" ]; then
    cp "${SCRIPT_DIR}/CLAUDE.md" "${FRAMEWORK_HOME}/" 2>/dev/null || true
fi
for ROOT_FILE in AGENTS.md prompt.md NOTICE; do
    if [ -f "${SCRIPT_DIR}/${ROOT_FILE}" ]; then
        cp "${SCRIPT_DIR}/${ROOT_FILE}" "${FRAMEWORK_HOME}/" 2>/dev/null || true
    fi
done
# Copy locale-specific Cursor compatibility file
if [ "$LOCALE" != "en" ] && [ -f "${SCRIPT_DIR}/.cursorrules.${LOCALE}" ]; then
    cp "${SCRIPT_DIR}/.cursorrules.${LOCALE}" "${FRAMEWORK_HOME}/.cursorrules" 2>/dev/null || true
elif [ -f "${SCRIPT_DIR}/.cursorrules" ]; then
    cp "${SCRIPT_DIR}/.cursorrules" "${FRAMEWORK_HOME}/" 2>/dev/null || true
fi
echo -e "     ${GREEN}✓${NC} $(i18n installer.step_reference_done)"

# ═══════════════════════════════════════════════════════════════
# 11. Copy Antigravity/Gemini compatibility files
# ═══════════════════════════════════════════════════════════════

echo -e "  🔮 $(i18n installer.step_antigravity 2>/dev/null || echo 'Copying Antigravity/Gemini files...')"
# Copy locale-specific GEMINI.md
if [ "$LOCALE" != "en" ] && [ -f "${SCRIPT_DIR}/GEMINI.${LOCALE}.md" ]; then
    cp "${SCRIPT_DIR}/GEMINI.${LOCALE}.md" "${FRAMEWORK_HOME}/GEMINI.md" 2>/dev/null || true
    echo -e "     ${GREEN}✓${NC} GEMINI.md translated to ${LANG_NAME}"
elif [ -f "${SCRIPT_DIR}/GEMINI.md" ]; then
    cp "${SCRIPT_DIR}/GEMINI.md" "${FRAMEWORK_HOME}/" 2>/dev/null || true
fi
if [ -d "${SCRIPT_DIR}/.agent" ]; then
    mkdir -p "${FRAMEWORK_HOME}/.agent"
    cp -r "${SCRIPT_DIR}/.agent/"* "${FRAMEWORK_HOME}/.agent/" 2>/dev/null || true
fi
echo -e "     ${GREEN}✓${NC} GEMINI.md, .agent/skills/, .agent/workflows/"

# ═══════════════════════════════════════════════════════════════
# 11b. Copy OpenCode compatibility files
# ═══════════════════════════════════════════════════════════════

echo -e "  🟢 Copying OpenCode files..."
if [ -d "${SCRIPT_DIR}/.opencode" ]; then
    mkdir -p "${FRAMEWORK_HOME}/.opencode/agents"
    cp -r "${SCRIPT_DIR}/.opencode/agents/"* "${FRAMEWORK_HOME}/.opencode/agents/" 2>/dev/null || true
fi
if [ -f "${SCRIPT_DIR}/opencode.json" ]; then
    cp "${SCRIPT_DIR}/opencode.json" "${FRAMEWORK_HOME}/" 2>/dev/null || true
fi
echo -e "     ${GREEN}✓${NC} opencode.json, .opencode/agents/doncheli.md"

# ═══════════════════════════════════════════════════════════════
# 12. Save locale preference + version
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

# ═══════════════════════════════════════════════════════════════
# Generate tool-specific configs (interactive mode only)
# ═══════════════════════════════════════════════════════════════

if [ "$INTERACTIVE_MODE" = true ] && [ -n "${SELECTED_TOOLS:-}" ]; then
    echo ""
    echo -e "  🔧 Generando configuraciones por herramienta..."

    # Source the config generator
    GENCONFIG="${SCRIPT_DIR}/scripts/generar-config.sh"
    if [ -f "$GENCONFIG" ]; then
        # shellcheck source=/dev/null
        . "$GENCONFIG"
        generar_configs "$SELECTED_TOOLS" "$SELECTED_PROFILE" "$SELECTED_SKILLS" "$SELECTED_COMMANDS" "$FRAMEWORK_HOME" "$FRAMEWORK_HOME" "$LOCALE"
    else
        echo -e "  ${YELLOW}⚠ generar-config.sh no encontrado, saltando generación de configs${NC}"
    fi

    # Save profile selection
    echo "$SELECTED_PROFILE" > "${FRAMEWORK_HOME}/perfil"
    echo -e "  ${GREEN}✓${NC} Perfil guardado: ${SELECTED_PROFILE}"
fi

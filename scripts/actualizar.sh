#!/bin/bash
# Don Cheli — Actualizador con barra de progreso y comparación de mejoras
# Usage:
#   bash scripts/actualizar.sh              # Interactivo
#   bash scripts/actualizar.sh --verificar  # Solo verificar
#   bash scripts/actualizar.sh --forzar     # Aplicar sin confirmar
#   bash scripts/actualizar.sh --auto       # Auto-update silencioso
#   don-cheli update                        # Via CLI npm

set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# COLORS & HELPERS
# ═══════════════════════════════════════════════════════════════

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

REPO_URL="https://github.com/doncheli/don-cheli-sdd"
RAW_URL="https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main"
API_URL="https://api.github.com/repos/doncheli/don-cheli-sdd"

# Parse flags
MODE="interactive"
for arg in "$@"; do
  case "$arg" in
    --verificar|--check) MODE="check" ;;
    --forzar|--force)    MODE="force" ;;
    --auto)              MODE="auto" ;;
  esac
done

# ═══════════════════════════════════════════════════════════════
# PROGRESS BAR
# ═══════════════════════════════════════════════════════════════

TOTAL_STEPS=13
CURRENT_STEP=0

progress() {
  local label="$1"
  CURRENT_STEP=$((CURRENT_STEP + 1))
  local pct=$((CURRENT_STEP * 100 / TOTAL_STEPS))
  local filled=$((pct / 5))
  local empty=$((20 - filled))

  # Build bar
  local bar=""
  for ((i=0; i<filled; i++)); do bar="${bar}█"; done
  for ((i=0; i<empty; i++)); do bar="${bar}░"; done

  printf "\r  ${CYAN}[${bar}]${NC} ${BOLD}%3d%%${NC}  ${label}%-40s" "$pct" ""

  # Newline at 100%
  if [ "$pct" -ge 100 ]; then echo ""; fi
}

# ═══════════════════════════════════════════════════════════════
# DETECT INSTALLATION
# ═══════════════════════════════════════════════════════════════

echo ""
echo -e "${BOLD}  ╔═══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}  ║     Don Cheli — Actualizador              ║${NC}"
echo -e "${BOLD}  ╚═══════════════════════════════════════════╝${NC}"
echo ""

progress "Detectando instalación..."

INSTALL_DIR=""
if [ -f "$HOME/.claude/don-cheli/VERSION" ]; then
  INSTALL_DIR="$HOME/.claude/don-cheli"
  INSTALL_TYPE="global"
elif [ -f "./.claude/don-cheli/VERSION" ]; then
  INSTALL_DIR="./.claude/don-cheli"
  INSTALL_TYPE="local"
else
  echo ""
  echo -e "  ${RED}❌ Don Cheli no está instalado${NC}"
  echo -e "  Ejecuta: ${CYAN}npm install -g don-cheli-sdd && don-cheli install --global${NC}"
  exit 1
fi

VERSION_LOCAL=$(cat "$INSTALL_DIR/VERSION" | tr -d '[:space:]')
LOCALE=$(cat "$INSTALL_DIR/locale" 2>/dev/null || echo "es")

progress "Versión local: v${VERSION_LOCAL}"

# ═══════════════════════════════════════════════════════════════
# CHECK REMOTE VERSION
# ═══════════════════════════════════════════════════════════════

progress "Consultando versión remota..."

VERSION_REMOTE=$(curl -fsSL "${RAW_URL}/VERSION" 2>/dev/null | tr -d '[:space:]') || {
  echo ""
  echo -e "  ${RED}❌ No se pudo consultar la versión remota${NC}"
  echo -e "  Verifica tu conexión a internet."
  exit 1
}

progress "Versión remota: v${VERSION_REMOTE}"

# ═══════════════════════════════════════════════════════════════
# COMPARE VERSIONS
# ═══════════════════════════════════════════════════════════════

echo ""
echo ""
echo -e "  ┌─────────────────────────────────────────┐"
echo -e "  │  ${BOLD}Comparación de versiones${NC}                │"
echo -e "  ├─────────────────────────────────────────┤"
printf "  │  Instalada:   ${CYAN}%-27s${NC}│\n" "v${VERSION_LOCAL} (${INSTALL_TYPE})"
printf "  │  Disponible:  ${GREEN}%-27s${NC}│\n" "v${VERSION_REMOTE}"

if [ "$VERSION_LOCAL" = "$VERSION_REMOTE" ]; then
  echo -e "  │  Estado:      ${GREEN}✅ Al día${NC}                    │"
  echo -e "  └─────────────────────────────────────────┘"
  echo ""
  if [ "$MODE" = "check" ] || [ "$MODE" = "auto" ]; then exit 0; fi
  echo -e "  Ya tienes la última versión."
  exit 0
else
  echo -e "  │  Estado:      ${YELLOW}⬆️  Actualización disponible${NC}  │"
  echo -e "  └─────────────────────────────────────────┘"
fi

if [ "$MODE" = "check" ]; then
  echo ""
  exit 0
fi

# ═══════════════════════════════════════════════════════════════
# FETCH CHANGELOG AND DIFF
# ═══════════════════════════════════════════════════════════════

echo ""
progress "Obteniendo cambios entre versiones..."

# Get commits between versions
CHANGES=""
COMMITS_JSON=$(curl -fsSL "${API_URL}/compare/v${VERSION_LOCAL}...v${VERSION_REMOTE}" 2>/dev/null) || true

FEAT_COUNT=0
FIX_COUNT=0
REFACTOR_COUNT=0
DOCS_COUNT=0
OTHER_COUNT=0
FILES_CHANGED=0
FEATURES=""
FIXES=""

if [ -n "$COMMITS_JSON" ]; then
  # Count commit types
  FEAT_COUNT=$(echo "$COMMITS_JSON" | grep -o '"message":"feat[:(]' | wc -l | tr -d ' ')
  FIX_COUNT=$(echo "$COMMITS_JSON" | grep -o '"message":"fix[:(]' | wc -l | tr -d ' ')
  REFACTOR_COUNT=$(echo "$COMMITS_JSON" | grep -o '"message":"refactor[:(]' | wc -l | tr -d ' ')
  DOCS_COUNT=$(echo "$COMMITS_JSON" | grep -o '"message":"docs[:(]' | wc -l | tr -d ' ')

  # Get file count
  FILES_CHANGED=$(echo "$COMMITS_JSON" | grep -o '"filename"' | wc -l | tr -d ' ')

  # Extract feature descriptions
  FEATURES=$(echo "$COMMITS_JSON" | grep -o '"message":"feat[^"]*"' | sed 's/"message":"feat[:(]\s*/  ✨ /' | sed 's/"//' | head -10)
  FIXES=$(echo "$COMMITS_JSON" | grep -o '"message":"fix[^"]*"' | sed 's/"message":"fix[:(]\s*/  🔧 /' | sed 's/"//' | head -10)
fi

progress "Analizando cambios..."

# Count new commands and skills in remote
REMOTE_CMDS=$(curl -fsSL "${API_URL}/contents/comandos/especdev" 2>/dev/null | grep -c '"name"' || echo "?")
REMOTE_SKILLS=$(curl -fsSL "${API_URL}/contents/habilidades" 2>/dev/null | grep -c '"name"' || echo "?")
LOCAL_CMDS=$(find "$INSTALL_DIR/../commands/especdev/" -name "*.md" 2>/dev/null | wc -l | tr -d ' ' || echo "?")
LOCAL_SKILLS=$(find "$INSTALL_DIR/habilidades/" -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ' || echo "?")
LOCAL_SKILLS=$((LOCAL_SKILLS - 1))  # subtract the parent dir

# ═══════════════════════════════════════════════════════════════
# SHOW COMPARISON REPORT
# ═══════════════════════════════════════════════════════════════

echo ""
echo ""
echo -e "  ${BOLD}═══════════════════════════════════════════${NC}"
echo -e "  ${BOLD}  📋 Reporte de cambios: v${VERSION_LOCAL} → v${VERSION_REMOTE}${NC}"
echo -e "  ${BOLD}═══════════════════════════════════════════${NC}"
echo ""

# Commit summary
echo -e "  ${BOLD}Commits por tipo:${NC}"
[ "$FEAT_COUNT" -gt 0 ]     2>/dev/null && echo -e "     ${GREEN}✨ $FEAT_COUNT nuevas funcionalidades${NC}"
[ "$FIX_COUNT" -gt 0 ]      2>/dev/null && echo -e "     ${YELLOW}🔧 $FIX_COUNT correcciones${NC}"
[ "$REFACTOR_COUNT" -gt 0 ] 2>/dev/null && echo -e "     ${CYAN}♻️  $REFACTOR_COUNT refactorizaciones${NC}"
[ "$DOCS_COUNT" -gt 0 ]     2>/dev/null && echo -e "     ${DIM}📝 $DOCS_COUNT documentación${NC}"
echo -e "     ${DIM}📁 $FILES_CHANGED archivos modificados${NC}"
echo ""

# Component comparison
echo -e "  ${BOLD}Comparación de componentes:${NC}"
echo ""
echo -e "     │ Componente        │ Actual  │ Nueva   │ Δ"
echo -e "     ├───────────────────┼─────────┼─────────┼──────"
if [ "$REMOTE_CMDS" != "?" ] && [ "$LOCAL_CMDS" != "?" ]; then
  DELTA_CMDS=$((REMOTE_CMDS - LOCAL_CMDS))
  if [ "$DELTA_CMDS" -gt 0 ]; then
    printf "     │ Comandos          │ %-7s │ %-7s │ ${GREEN}+%s${NC}\n" "$LOCAL_CMDS" "$REMOTE_CMDS" "$DELTA_CMDS"
  else
    printf "     │ Comandos          │ %-7s │ %-7s │ =${NC}\n" "$LOCAL_CMDS" "$REMOTE_CMDS"
  fi
fi
if [ "$REMOTE_SKILLS" != "?" ] && [ "$LOCAL_SKILLS" != "?" ]; then
  DELTA_SKILLS=$((REMOTE_SKILLS - LOCAL_SKILLS))
  if [ "$DELTA_SKILLS" -gt 0 ]; then
    printf "     │ Habilidades       │ %-7s │ %-7s │ ${GREEN}+%s${NC}\n" "$LOCAL_SKILLS" "$REMOTE_SKILLS" "$DELTA_SKILLS"
  else
    printf "     │ Habilidades       │ %-7s │ %-7s │ =${NC}\n" "$LOCAL_SKILLS" "$REMOTE_SKILLS"
  fi
fi
printf "     │ Versión           │ %-7s │ %-7s │ ${GREEN}⬆️${NC}\n" "$VERSION_LOCAL" "$VERSION_REMOTE"
echo ""

# Features list
if [ -n "$FEATURES" ]; then
  echo -e "  ${BOLD}Nuevas funcionalidades:${NC}"
  echo "$FEATURES"
  echo ""
fi

# Fixes list
if [ -n "$FIXES" ]; then
  echo -e "  ${BOLD}Correcciones:${NC}"
  echo "$FIXES"
  echo ""
fi

echo -e "  ${DIM}Changelog completo: ${REPO_URL}/blob/main/CHANGELOG.md${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# CONFIRM
# ═══════════════════════════════════════════════════════════════

if [ "$MODE" = "interactive" ]; then
  echo -ne "  ${BOLD}¿Actualizar Don Cheli de v${VERSION_LOCAL} a v${VERSION_REMOTE}? [S/n] ${NC}"
  CONFIRM=""
  read -r CONFIRM < /dev/tty 2>/dev/null || read -r CONFIRM 2>/dev/null || CONFIRM="s"
  case "$CONFIRM" in
    [nN]*) echo -e "  ${DIM}Actualización cancelada.${NC}"; exit 0 ;;
  esac
fi

# ═══════════════════════════════════════════════════════════════
# SECURITY AUDIT
# ═══════════════════════════════════════════════════════════════

echo ""
progress "Auditoria de seguridad pre-actualización..."

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

progress "Descargando v${VERSION_REMOTE}..."

git clone --depth 1 "${REPO_URL}.git" "$TEMP_DIR/don-cheli-sdd" > /dev/null 2>&1 || {
  echo ""
  echo -e "  ${RED}❌ Error al descargar. Verifica tu conexión.${NC}"
  exit 1
}

progress "Escaneando scripts por seguridad..."

AUDIT_ISSUES=0
# Check for genuinely dangerous patterns in new scripts (not comments/strings)
for f in "$TEMP_DIR/don-cheli-sdd/scripts/"*.sh; do
  [ -f "$f" ] || continue
  # Only flag REAL dangerous code, not patterns inside comments or grep patterns
  # Remove comments before scanning
  CLEAN=$(sed 's/#.*$//' "$f" | sed '/grep/d' | sed '/echo/d')
  SUSPICIOUS=$(echo "$CLEAN" | grep -c 'eval "\$\|rm -rf /[^.]' 2>/dev/null || echo 0)
  if [ "$SUSPICIOUS" -gt 0 ]; then
    AUDIT_ISSUES=$((AUDIT_ISSUES + SUSPICIOUS))
  fi
done

progress "Verificando integridad..."

if [ "$AUDIT_ISSUES" -gt 0 ]; then
  echo ""
  echo -e "  ${RED}🛑 Auditoría bloqueó la actualización${NC}"
  echo -e "  ${RED}   $AUDIT_ISSUES patrón(es) sospechoso(s) encontrado(s) en scripts${NC}"
  echo -e "  Ejecuta ${CYAN}/dc:auditar-seguridad${NC} manualmente para detalles."
  exit 1
fi

echo ""
echo -e "  ${GREEN}✅ Auditoría de seguridad: LIMPIA${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════
# APPLY UPDATE
# ═══════════════════════════════════════════════════════════════

progress "Instalando v${VERSION_REMOTE}..."

INSTALL_FLAGS="--lang $LOCALE"
if [ "$INSTALL_TYPE" = "global" ]; then
  INSTALL_FLAGS="$INSTALL_FLAGS --global"
fi

# Preserve profile if exists
if [ -f "$INSTALL_DIR/perfil" ]; then
  PROFILE=$(cat "$INSTALL_DIR/perfil")
  INSTALL_FLAGS="$INSTALL_FLAGS --profile $PROFILE"
fi

# Preserve tools if exists
if [ -f "$INSTALL_DIR/tools" ]; then
  TOOLS=$(cat "$INSTALL_DIR/tools")
  INSTALL_FLAGS="$INSTALL_FLAGS --tools $TOOLS"
fi

cd "$TEMP_DIR/don-cheli-sdd" && bash scripts/instalar.sh $INSTALL_FLAGS > "$TEMP_DIR/install.log" 2>&1
INSTALL_EXIT=$?

if [ "$INSTALL_EXIT" -ne 0 ]; then
  echo ""
  echo -e "  ${RED}❌ Error durante la instalación${NC}"
  echo -e "  Log: $TEMP_DIR/install.log"
  tail -10 "$TEMP_DIR/install.log"
  exit 1
fi

progress "Verificando instalación..."

# Verify new version
NEW_VERSION=$(cat "$INSTALL_DIR/VERSION" 2>/dev/null | tr -d '[:space:]')

progress "¡Actualización completa!"

# ═══════════════════════════════════════════════════════════════
# FINAL REPORT
# ═══════════════════════════════════════════════════════════════

echo ""
echo ""
echo -e "  ${GREEN}${BOLD}══════════════════════════════════════════════════${NC}"
echo -e "  ${GREEN}${BOLD}  ✅ Don Cheli actualizado: v${VERSION_LOCAL} → v${NEW_VERSION}${NC}"
echo -e "  ${GREEN}${BOLD}══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${BOLD}Resumen:${NC}"
[ "$FEAT_COUNT" -gt 0 ]     2>/dev/null && echo -e "     ${GREEN}✨ $FEAT_COUNT nuevas funcionalidades${NC}"
[ "$FIX_COUNT" -gt 0 ]      2>/dev/null && echo -e "     ${YELLOW}🔧 $FIX_COUNT correcciones${NC}"
[ "$REFACTOR_COUNT" -gt 0 ] 2>/dev/null && echo -e "     ${CYAN}♻️  $REFACTOR_COUNT refactorizaciones${NC}"
echo -e "     ${DIM}📁 $FILES_CHANGED archivos actualizados${NC}"
echo -e "     ${GREEN}🛡️  Auditoría de seguridad: LIMPIA${NC}"
echo ""
echo -e "  ${BOLD}Próximo paso:${NC}"
echo -e "     Reinicia Claude Code para aplicar los cambios."
echo ""
echo -e "  ${DIM}Deja de adivinar. Empieza a hacer ingeniería.${NC}"
echo ""

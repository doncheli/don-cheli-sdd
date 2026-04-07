#!/bin/bash
# Don Cheli — Skill Auto-Updater
# Checks for updates to third-party skills from their source repos
#
# Usage:
#   bash scripts/skill-updater.sh                    # Check all sources
#   bash scripts/skill-updater.sh --check            # Only check, don't update
#   bash scripts/skill-updater.sh --source anthropic  # Check specific source
#   bash scripts/skill-updater.sh --apply             # Apply all pending updates
#   bash scripts/skill-updater.sh --quiet             # Silent mode (for session start)

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

# ═══════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════

MODE="check"
SOURCE_FILTER=""
QUIET=false

for arg in "$@"; do
  case "$arg" in
    --check)   MODE="check" ;;
    --apply)   MODE="apply" ;;
    --quiet)   QUIET=true ;;
    --source)  shift; SOURCE_FILTER="${2:-}" ;;
  esac
done

# Detect framework home
if [ -f "$HOME/.claude/don-cheli/VERSION" ]; then
  FRAMEWORK_HOME="$HOME/.claude/don-cheli"
elif [ -f "./.claude/don-cheli/VERSION" ]; then
  FRAMEWORK_HOME="./.claude/don-cheli"
else
  [ "$QUIET" = false ] && echo -e "${RED}Don Cheli not installed${NC}"
  exit 0
fi

REGISTRY_FILE="${FRAMEWORK_HOME}/skill-registry.json"
SKILLS_DIR="${FRAMEWORK_HOME}"
LOCALE=$(cat "${FRAMEWORK_HOME}/locale" 2>/dev/null || echo "es")

# ═══════════════════════════════════════════════════════════════
# REGISTRY
# ═══════════════════════════════════════════════════════════════

# Initialize registry if it doesn't exist
init_registry() {
  if [ ! -f "$REGISTRY_FILE" ]; then
    cat > "$REGISTRY_FILE" << 'REGEOF'
{
  "version": "1.0.0",
  "last_check": "",
  "sources": {
    "anthropic": {
      "repo": "https://github.com/anthropics/skills",
      "branch": "main",
      "last_sha": "",
      "skills": []
    },
    "doncheli": {
      "repo": "https://github.com/doncheli/don-cheli-sdd",
      "branch": "main",
      "last_sha": "",
      "type": "builtin"
    }
  },
  "installed": []
}
REGEOF
  fi
}

# ═══════════════════════════════════════════════════════════════
# CHECK SOURCES
# ═══════════════════════════════════════════════════════════════

UPDATES_AVAILABLE=0
UPDATE_MESSAGES=""

check_anthropic() {
  local api_url="https://api.github.com/repos/anthropics/skills/commits?per_page=1"
  local remote_sha

  remote_sha=$(curl -fsSL "$api_url" 2>/dev/null | grep -o '"sha":"[^"]*"' | head -1 | cut -d'"' -f4) || return 0

  if [ -z "$remote_sha" ]; then return 0; fi

  # Get stored SHA
  local stored_sha=""
  if [ -f "$REGISTRY_FILE" ]; then
    stored_sha=$(grep -o '"last_sha":"[^"]*"' "$REGISTRY_FILE" | head -1 | cut -d'"' -f4 2>/dev/null) || stored_sha=""
  fi

  if [ "$remote_sha" != "$stored_sha" ] && [ -n "$stored_sha" ]; then
    UPDATES_AVAILABLE=$((UPDATES_AVAILABLE + 1))
    UPDATE_MESSAGES="${UPDATE_MESSAGES}  ${CYAN}Anthropic Skills${NC}: nuevos commits disponibles\n"

    if [ "$MODE" = "apply" ]; then
      apply_anthropic "$remote_sha"
    fi
  fi

  # Update SHA in registry
  if [ -f "$REGISTRY_FILE" ]; then
    if command -v python3 &>/dev/null; then
      python3 -c "
import json
with open('$REGISTRY_FILE', 'r') as f: d = json.load(f)
d['sources']['anthropic']['last_sha'] = '$remote_sha'
d['last_check'] = '$(date -u +%Y-%m-%dT%H:%M:%SZ)'
with open('$REGISTRY_FILE', 'w') as f: json.dump(d, f, indent=2)
" 2>/dev/null || true
    fi
  fi
}

check_doncheli() {
  # This is handled by the main framework updater (/dc:actualizar)
  # Just check if framework version is latest
  local local_ver
  local remote_ver

  local_ver=$(cat "${FRAMEWORK_HOME}/VERSION" 2>/dev/null | tr -d '[:space:]')
  remote_ver=$(curl -fsSL "https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION" 2>/dev/null | tr -d '[:space:]') || return 0

  if [ -z "$remote_ver" ]; then return 0; fi

  if [ "$local_ver" != "$remote_ver" ]; then
    UPDATES_AVAILABLE=$((UPDATES_AVAILABLE + 1))
    UPDATE_MESSAGES="${UPDATE_MESSAGES}  ${CYAN}Don Cheli${NC}: v${local_ver} → v${remote_ver}\n"
  fi
}

check_community() {
  # Community skills are pinned (no auto-update for security)
  # Only check if their source URLs are still accessible
  return 0
}

# ═══════════════════════════════════════════════════════════════
# APPLY UPDATES
# ═══════════════════════════════════════════════════════════════

apply_anthropic() {
  local new_sha="$1"
  local temp_dir
  temp_dir=$(mktemp -d)
  trap "rm -rf '$temp_dir'" RETURN

  [ "$QUIET" = false ] && echo -e "  ${CYAN}Descargando Anthropic Skills...${NC}"

  git clone --depth 1 "https://github.com/anthropics/skills.git" "$temp_dir/skills" > /dev/null 2>&1 || {
    [ "$QUIET" = false ] && echo -e "  ${RED}Error al clonar repo${NC}"
    return 1
  }

  # Find all SKILL.md files and update local copies
  local updated=0
  local agent_skills_dir="${FRAMEWORK_HOME}/.agent/skills"

  if [ -d "$temp_dir/skills" ]; then
    find "$temp_dir/skills" -name "SKILL.md" -type f | while read -r skill_file; do
      local skill_dir
      skill_dir=$(dirname "$skill_file")
      local skill_name
      skill_name=$(basename "$skill_dir")

      # Only update if we have a matching local skill
      if [ -d "$agent_skills_dir/$skill_name" ]; then
        # Compare content
        if ! diff -q "$skill_file" "$agent_skills_dir/$skill_name/SKILL.md" > /dev/null 2>&1; then
          cp "$skill_file" "$agent_skills_dir/$skill_name/SKILL.md"
          updated=$((updated + 1))
          [ "$QUIET" = false ] && echo -e "     ${GREEN}✓${NC} $skill_name actualizado"
        fi
      fi
    done
  fi

  [ "$QUIET" = false ] && echo -e "  ${GREEN}✓${NC} Anthropic Skills: $updated actualizados"
}

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

init_registry

if [ "$QUIET" = false ] && [ "$MODE" != "check" ]; then
  echo ""
  echo -e "${BOLD}  Don Cheli — Skill Updater${NC}"
  echo ""
fi

# Check each source
if [ -z "$SOURCE_FILTER" ] || [ "$SOURCE_FILTER" = "anthropic" ]; then
  check_anthropic
fi

if [ -z "$SOURCE_FILTER" ] || [ "$SOURCE_FILTER" = "doncheli" ]; then
  check_doncheli
fi

if [ -z "$SOURCE_FILTER" ] || [ "$SOURCE_FILTER" = "community" ]; then
  check_community
fi

# ═══════════════════════════════════════════════════════════════
# OUTPUT
# ═══════════════════════════════════════════════════════════════

if [ "$UPDATES_AVAILABLE" -gt 0 ]; then
  if [ "$QUIET" = true ]; then
    # Quiet mode: output single notification line for CLAUDE.md to use
    case "$LOCALE" in
      en) echo "⬆️ $UPDATES_AVAILABLE skill update(s) available. Run /dc:marketplace --update to apply." ;;
      pt) echo "⬆️ $UPDATES_AVAILABLE atualização(ões) de skills disponível(is). Execute /dc:marketplace --atualizar." ;;
      *)  echo "⬆️ $UPDATES_AVAILABLE actualización(es) de skills disponible(s). Ejecuta /dc:marketplace --actualizar." ;;
    esac
  else
    echo -e "\n${BOLD}  Actualizaciones disponibles:${NC}\n"
    printf "%b" "$UPDATE_MESSAGES"
    echo ""
    if [ "$MODE" = "check" ]; then
      echo -e "  Ejecuta ${CYAN}/dc:marketplace --actualizar${NC} para aplicar."
      echo -e "  O: ${CYAN}bash scripts/skill-updater.sh --apply${NC}"
    fi
  fi
else
  if [ "$QUIET" = false ]; then
    echo -e "  ${GREEN}✅${NC} Todas las skills están al día."
  fi
fi

exit 0

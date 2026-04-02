#!/bin/bash
# Don Cheli - Config Generator
# Generates tool-specific configuration files based on profile, skills, and commands
#
# Intended to be sourced from instalar.sh, not run standalone.
# Main entry point: generar_configs()

generar_configs() {
    local tools="$1"
    local profile="$2"
    local skills="$3"
    local commands="$4"
    local install_dir="$5"
    local framework_home="$6"
    local locale="${7:-es}"

    # Colors (fallback to empty if not set by caller)
    local GREEN="${GREEN:-\033[0;32m}"
    local RED="${RED:-\033[0;31m}"
    local YELLOW="${YELLOW:-\033[1;33m}"
    local NC="${NC:-\033[0m}"

    # Validate required args
    if [ -z "$tools" ] || [ -z "$install_dir" ] || [ -z "$framework_home" ]; then
        echo -e "  ${RED}✗${NC} generar_configs: missing required arguments (tools, install_dir, framework_home)" >&2
        return 1
    fi

    # Parse tools into array
    IFS=',' read -ra TOOL_ARRAY <<< "$tools"

    for tool in "${TOOL_ARRAY[@]}"; do
        # Trim whitespace
        tool="${tool#"${tool%%[![:space:]]*}"}"
        tool="${tool%"${tool##*[![:space:]]}"}"

        case "$tool" in
            claude)
                _gen_claude "$install_dir" "$framework_home" "$locale" "$profile" "$skills" "$commands"
                ;;
            codex)
                _gen_codex "$install_dir" "$framework_home" "$locale"
                ;;
            cursor)
                _gen_cursor "$install_dir" "$framework_home" "$locale"
                ;;
            antigravity)
                _gen_antigravity "$install_dir" "$framework_home" "$locale"
                ;;
            windsurf)
                _gen_windsurf "$install_dir" "$framework_home" "$locale"
                ;;
            amp)
                _gen_amp "$install_dir" "$framework_home" "$locale"
                ;;
            continue)
                _gen_continue "$install_dir" "$framework_home" "$locale"
                ;;
            *)
                echo -e "  ${YELLOW}⚠${NC} Unknown tool: '$tool' — skipping" >&2
                ;;
        esac
    done
}

# ─────────────────────────────────────────────
# Claude Code → CLAUDE.md + .claude/commands/
# ─────────────────────────────────────────────
_gen_claude() {
    local dir="$1" home="$2" locale="$3" profile="$4" skills="$5" commands="$6"

    echo -e "     ${GREEN:-}✓${NC:-} Claude Code → CLAUDE.md + commands/"

    # Copy locale-specific CLAUDE.md, fall back to default es
    if [ "$locale" != "es" ] && [ -f "$home/CLAUDE.${locale}.md" ]; then
        cp "$home/CLAUDE.${locale}.md" "$dir/CLAUDE.md" 2>/dev/null || true
    elif [ -f "$home/CLAUDE.md" ]; then
        cp "$home/CLAUDE.md" "$dir/" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} CLAUDE.md not found in $home — skipping" >&2
    fi

    # Append active profile/skills/commands summary to CLAUDE.md
    if [ -f "$dir/CLAUDE.md" ] && { [ -n "$profile" ] || [ -n "$skills" ] || [ -n "$commands" ]; }; then
        {
            echo ""
            echo "## Perfil de instalación"
            [ -n "$profile" ]  && echo "- **Perfil**: $profile"
            [ -n "$skills" ]   && echo "- **Skills activos**: $skills"
            [ -n "$commands" ] && echo "- **Comandos activos**: $commands"
        } >> "$dir/CLAUDE.md" 2>/dev/null || true
    fi

    # Create command directories and copy command files
    mkdir -p "$dir/.claude/commands/dc" \
             "$dir/.claude/commands/especdev" \
             "$dir/.claude/commands/razonar" 2>/dev/null || true

    local commands_root
    commands_root="$(cd "$home/../.." 2>/dev/null && pwd)" || commands_root=""

    if [ -n "$commands_root" ] && [ -d "$commands_root/commands" ]; then
        cp "$commands_root/commands/especdev/"*.md "$dir/.claude/commands/especdev/" 2>/dev/null || true
        cp "$commands_root/commands/dc/"*.md        "$dir/.claude/commands/dc/"       2>/dev/null || true
        cp "$commands_root/commands/razonar/"*.md   "$dir/.claude/commands/razonar/"  2>/dev/null || true
    fi
}

# ─────────────────────────────────────────────
# Codex → AGENTS.md
# ─────────────────────────────────────────────
_gen_codex() {
    local dir="$1" home="$2" locale="$3"

    echo -e "     ${GREEN:-}✓${NC:-} Codex → AGENTS.md"

    if [ -f "$home/AGENTS.md" ]; then
        cp "$home/AGENTS.md" "$dir/" 2>/dev/null || true
    else
        # Generate a minimal AGENTS.md if template is missing
        cat > "$dir/AGENTS.md" 2>/dev/null << 'AGENTSEOF' || true
# Don Cheli SDD — Codex Agent Instructions

## Iron Laws
1. **TDD**: All production code requires tests (RED → GREEN → REFACTOR)
2. **Debugging**: Root cause first, then fix
3. **Verification**: Evidence before assertions

## Workflow
- Read files on demand, not preemptively
- Structured outputs from the start
- Retrocompatible changes unless explicitly stated otherwise
AGENTSEOF
    fi
}

# ─────────────────────────────────────────────
# Cursor → .cursorrules
# ─────────────────────────────────────────────
_gen_cursor() {
    local dir="$1" home="$2" locale="$3"

    echo -e "     ${GREEN:-}✓${NC:-} Cursor → .cursorrules"

    if [ "$locale" != "en" ] && [ -f "$home/.cursorrules.${locale}" ]; then
        cp "$home/.cursorrules.${locale}" "$dir/.cursorrules" 2>/dev/null || true
    elif [ -f "$home/.cursorrules" ]; then
        cp "$home/.cursorrules" "$dir/" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} .cursorrules not found in $home — skipping" >&2
    fi
}

# ─────────────────────────────────────────────
# Antigravity → GEMINI.md + .agent/ (at PROJECT ROOT, not inside .claude/)
# ─────────────────────────────────────────────
_gen_antigravity() {
    local dir="$1" home="$2" locale="$3"

    # Antigravity needs files at project root, not inside .claude/don-cheli/
    # Detect project root: go up from .claude/don-cheli/ or use current dir
    local project_root
    if [[ "$dir" == *".claude/don-cheli"* ]]; then
        project_root="${dir%/.claude/don-cheli*}"
        [ -z "$project_root" ] && project_root="."
    elif [[ "$dir" == *".claude"* ]]; then
        project_root="${dir%/.claude*}"
        [ -z "$project_root" ] && project_root="."
    else
        project_root="$dir"
    fi

    echo -e "     ${GREEN:-}✓${NC:-} Antigravity → GEMINI.md + .agent/ (en $project_root/)"

    if [ "$locale" != "en" ] && [ -f "$home/GEMINI.${locale}.md" ]; then
        cp "$home/GEMINI.${locale}.md" "$project_root/GEMINI.md" 2>/dev/null || true
    elif [ -f "$home/GEMINI.md" ]; then
        cp "$home/GEMINI.md" "$project_root/" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} GEMINI.md not found in $home — skipping" >&2
    fi

    if [ -d "$home/.agent" ]; then
        mkdir -p "$project_root/.agent" 2>/dev/null || true
        cp -r "$home/.agent/"* "$project_root/.agent/" 2>/dev/null || true
    fi
}

# ─────────────────────────────────────────────
# Windsurf → .windsurf/rules/don-cheli.md
# ─────────────────────────────────────────────
_gen_windsurf() {
    local dir="$1" home="$2" locale="$3"

    echo -e "     ${GREEN:-}✓${NC:-} Windsurf → .windsurf/rules/don-cheli.md"

    mkdir -p "$dir/.windsurf/rules" 2>/dev/null || true

    # Prefer a dedicated windsurf template; fall back to .cursorrules
    if [ -f "$home/.windsurf/rules/don-cheli.md" ]; then
        cp "$home/.windsurf/rules/don-cheli.md" "$dir/.windsurf/rules/don-cheli.md" 2>/dev/null || true
    elif [ -f "$home/.cursorrules" ]; then
        cp "$home/.cursorrules" "$dir/.windsurf/rules/don-cheli.md" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} No Windsurf template found in $home — skipping" >&2
    fi
}

# ─────────────────────────────────────────────
# Amp → prompt.md
# ─────────────────────────────────────────────
_gen_amp() {
    local dir="$1" home="$2" locale="$3"

    echo -e "     ${GREEN:-}✓${NC:-} Amp → prompt.md"

    if [ -f "$home/prompt.md" ]; then
        cp "$home/prompt.md" "$dir/" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} prompt.md not found in $home — skipping" >&2
    fi
}

# ─────────────────────────────────────────────
# Continue.dev → .continue/config/don-cheli.json
# ─────────────────────────────────────────────
_gen_continue() {
    local dir="$1" home="$2" locale="$3"

    echo -e "     ${GREEN:-}✓${NC:-} Continue.dev → .continue/config/don-cheli.json"

    mkdir -p "$dir/.continue/config" 2>/dev/null || true

    # Use existing template if available; otherwise generate inline
    if [ -f "$home/.continue/config/don-cheli.json" ]; then
        cp "$home/.continue/config/don-cheli.json" "$dir/.continue/config/don-cheli.json" 2>/dev/null || true
    else
        cat > "$dir/.continue/config/don-cheli.json" 2>/dev/null << 'CONTEOF' || true
{
  "name": "don-cheli-sdd",
  "version": "1.16.3",
  "description": "Don Cheli SDD Framework",
  "rules": [
    "All production code requires tests (TDD: RED → GREEN → REFACTOR)",
    "Root cause first, then fix (Debugging)",
    "Evidence before assertions (Verification)",
    "Read files on demand, not preemptively",
    "Structured outputs from the start"
  ]
}
CONTEOF
    fi
}

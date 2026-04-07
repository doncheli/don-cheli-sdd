#!/bin/bash
# Don Cheli - Config Generator
# Generates tool-specific configuration files based on profile, skills, and commands
#
# Intended to be sourced from instalar.sh, not run standalone.
# Main entry point: generar_configs()

# Helper: detect project root from FRAMEWORK_HOME path
# .claude/don-cheli → project root is the parent
_get_project_root() {
    local dir="$1"
    local root
    if [[ "$dir" == *".claude/don-cheli"* ]]; then
        root="${dir%/.claude/don-cheli*}"
        [ -z "$root" ] && root="."
    elif [[ "$dir" == *".claude"* ]]; then
        root="${dir%/.claude*}"
        [ -z "$root" ] && root="."
    else
        root="$dir"
    fi
    echo "$root"
}

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
            opencode)
                _gen_opencode "$install_dir" "$framework_home" "$locale"
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
    local project_root
    project_root=$(_get_project_root "$dir")

    echo -e "     ${GREEN:-}✓${NC:-} Codex → AGENTS.md (en $project_root/)"

    if [ -f "$home/AGENTS.md" ]; then
        cp "$home/AGENTS.md" "$project_root/" 2>/dev/null || true
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
    local project_root
    project_root=$(_get_project_root "$dir")

    echo -e "     ${GREEN:-}✓${NC:-} Cursor → .cursorrules (en $project_root/)"

    if [ "$locale" != "en" ] && [ -f "$home/.cursorrules.${locale}" ]; then
        cp "$home/.cursorrules.${locale}" "$project_root/.cursorrules" 2>/dev/null || true
    elif [ -f "$home/.cursorrules" ]; then
        cp "$home/.cursorrules" "$project_root/" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} .cursorrules not found in $home — skipping" >&2
    fi
}

# ─────────────────────────────────────────────
# Antigravity → GEMINI.md + .agent/ (at PROJECT ROOT, not inside .claude/)
# ─────────────────────────────────────────────
_gen_antigravity() {
    local dir="$1" home="$2" locale="$3"
    local project_root
    project_root=$(_get_project_root "$dir")

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
    local project_root
    project_root=$(_get_project_root "$dir")

    echo -e "     ${GREEN:-}✓${NC:-} Windsurf → .windsurf/rules/don-cheli.md (en $project_root/)"

    mkdir -p "$project_root/.windsurf/rules" 2>/dev/null || true

    if [ -f "$home/.windsurf/rules/don-cheli.md" ]; then
        cp "$home/.windsurf/rules/don-cheli.md" "$project_root/.windsurf/rules/don-cheli.md" 2>/dev/null || true
    elif [ -f "$home/.cursorrules" ]; then
        cp "$home/.cursorrules" "$project_root/.windsurf/rules/don-cheli.md" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} No Windsurf template found in $home — skipping" >&2
    fi
}

# ─────────────────────────────────────────────
# Amp → prompt.md
# ─────────────────────────────────────────────
_gen_amp() {
    local dir="$1" home="$2" locale="$3"
    local project_root
    project_root=$(_get_project_root "$dir")

    echo -e "     ${GREEN:-}✓${NC:-} Amp → prompt.md (en $project_root/)"

    if [ -f "$home/prompt.md" ]; then
        cp "$home/prompt.md" "$project_root/" 2>/dev/null || true
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} prompt.md not found in $home — skipping" >&2
    fi
}

# ─────────────────────────────────────────────
# Continue.dev → .continue/config/don-cheli.json
# ─────────────────────────────────────────────
_gen_continue() {
    local dir="$1" home="$2" locale="$3"
    local project_root
    project_root=$(_get_project_root "$dir")

    echo -e "     ${GREEN:-}✓${NC:-} Continue.dev → .continue/config/don-cheli.json (en $project_root/)"

    mkdir -p "$project_root/.continue/config" 2>/dev/null || true

    if [ -f "$home/.continue/config/don-cheli.json" ]; then
        cp "$home/.continue/config/don-cheli.json" "$project_root/.continue/config/don-cheli.json" 2>/dev/null || true
    else
        cat > "$project_root/.continue/config/don-cheli.json" 2>/dev/null << 'CONTEOF' || true
{
  "name": "don-cheli-sdd",
  "version": "1.23.0",
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

# ─────────────────────────────────────────────
# OpenCode → ~/.config/opencode/config.json
# ─────────────────────────────────────────────
_gen_opencode() {
    local dir="$1" home="$2" locale="$3"
    local project_root
    project_root=$(_get_project_root "$dir")

    echo -e "     ${GREEN:-}✓${NC:-} OpenCode → config + .opencode/ (en $project_root/)"

    # Copy opencode.json and .opencode/ to project root
    if [ -f "$home/opencode.json" ]; then
        cp "$home/opencode.json" "$project_root/" 2>/dev/null || true
    fi
    if [ -d "$home/.opencode" ]; then
        mkdir -p "$project_root/.opencode/agents" 2>/dev/null || true
        cp -r "$home/.opencode/"* "$project_root/.opencode/" 2>/dev/null || true
    fi

    local opencode_config="$HOME/.config/opencode/config.json"
    local skills_path="${home}/.agent/skills"
    local tmp_config

    # Ensure opencode config directory exists
    mkdir -p "$(dirname "$opencode_config")" 2>/dev/null || true

    # If config doesn't exist, create it
    if [ ! -f "$opencode_config" ]; then
        cat > "$opencode_config" << 'OPENCODECONFIG'
{
  "$schema": "https://opencode.ai/config.json",
  "autoupdate": true,
  "permission": {
    "external_directory": {}
  },
  "skills": {
    "paths": []
  }
}
OPENCODECONFIG
        echo -e "     ${GREEN:-}✓${NC:-} Created new opencode config"
    fi

    # Use jq if available for robust JSON editing
    if command -v jq &>/dev/null; then
        # Add external_directory permission
        jq '(.permission.external_directory // {}) |= if has("/root/.claude/**") then . else . + {"/root/.claude/**": "allow"} end' "$opencode_config" > "${opencode_config}.tmp" && mv "${opencode_config}.tmp" "$opencode_config"

        # Add skills path
        jq ".skills.paths += [\"${skills_path}\"] | .skills.paths = (.skills.paths | unique)" "$opencode_config" > "${opencode_config}.tmp" && mv "${opencode_config}.tmp" "$opencode_config"

        echo -e "     ${GREEN:-}✓${NC:-} Config updated with jq"
    else
        # Fallback: append to paths array manually (less robust)
        if ! grep -q "${skills_path}" "$opencode_config" 2>/dev/null; then
            # Simple append to paths array (last element stays as empty array)
            sed -i "s/\"paths\": \[\]/\"paths\": [\"${skills_path}\"]/" "$opencode_config" 2>/dev/null || true
        fi

        if ! grep -q '"/root/.claude' "$opencode_config" 2>/dev/null; then
            # Simple append to external_directory (might create invalid JSON)
            sed -i 's/"external_directory": {}/"external_directory": { "\/root\/.claude\/**": "allow" }/' "$opencode_config" 2>/dev/null || true
        fi

        echo -e "     ${YELLOW:-}⚠${NC:-} jq not found, used fallback sed (less reliable)"
    fi

    # Verify final config
    if [ -f "$opencode_config" ]; then
        echo -e "     ${GREEN:-}✓${NC:-} Config saved to ${opencode_config}"
        echo -e "     ${GREEN:-}✓${NC:-} Skills path: ${skills_path}"
    else
        echo -e "     ${YELLOW:-}⚠${NC:-} Failed to write config"
    fi
}

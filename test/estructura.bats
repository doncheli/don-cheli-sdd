#!/usr/bin/env bats
# test/estructura.bats — Tests for overall framework structure (no installation needed)

load test_helper

# ─── Shell script syntax ──────────────────────────────────────────────────────

@test "instalar.sh has valid bash syntax" {
    run bash -n "$REPO_ROOT/scripts/instalar.sh"
    [ "$status" -eq 0 ]
}

@test "validar.sh has valid bash syntax" {
    run bash -n "$REPO_ROOT/scripts/validar.sh"
    [ "$status" -eq 0 ]
}

@test "bucle.sh has valid bash syntax" {
    run bash -n "$REPO_ROOT/scripts/bucle.sh"
    [ "$status" -eq 0 ]
}

@test "all .sh files in scripts/ have valid bash syntax" {
    local errors=0
    local failed_files=()
    while IFS= read -r script; do
        if ! bash -n "$script" 2>/dev/null; then
            errors=$((errors + 1))
            failed_files+=("$script")
        fi
    done < <(find "$REPO_ROOT/scripts" -maxdepth 1 -name "*.sh" -type f)
    if [ "$errors" -gt 0 ]; then
        echo "Scripts with syntax errors:" >&2
        printf "  %s\n" "${failed_files[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

# ─── JSON validity ────────────────────────────────────────────────────────────

@test "package.json is valid JSON" {
    run python3 -m json.tool "$REPO_ROOT/package.json"
    [ "$status" -eq 0 ]
}

@test "locales/es.json is valid JSON" {
    run python3 -m json.tool "$REPO_ROOT/locales/es.json"
    [ "$status" -eq 0 ]
}

@test "locales/en.json is valid JSON" {
    run python3 -m json.tool "$REPO_ROOT/locales/en.json"
    [ "$status" -eq 0 ]
}

@test "locales/pt.json is valid JSON" {
    run python3 -m json.tool "$REPO_ROOT/locales/pt.json"
    [ "$status" -eq 0 ]
}

# ─── VERSION ↔ package.json sync ─────────────────────────────────────────────

@test "VERSION file exists" {
    [ -f "$REPO_ROOT/VERSION" ]
}

@test "VERSION matches package.json version" {
    local version_file pkg_version
    version_file=$(cat "$REPO_ROOT/VERSION" | tr -d '[:space:]')
    pkg_version=$(python3 -c "import json; print(json.load(open('$REPO_ROOT/package.json'))['version'])")
    [ "$version_file" = "$pkg_version" ]
}

@test "VERSION follows semver format (X.Y.Z)" {
    local version
    version=$(cat "$REPO_ROOT/VERSION" | tr -d '[:space:]')
    [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
}

# ─── Commands: YAML frontmatter with description ──────────────────────────────

@test "all comandos/especdev/*.md files have YAML frontmatter (start with ---)" {
    local errors=0
    local failed_files=()
    while IFS= read -r cmd_file; do
        local first_line
        first_line=$(head -1 "$cmd_file")
        if [ "$first_line" != "---" ]; then
            errors=$((errors + 1))
            failed_files+=("$cmd_file")
        fi
    done < <(find "$REPO_ROOT/comandos/especdev" -name "*.md" -type f)
    if [ "$errors" -gt 0 ]; then
        echo "Commands missing frontmatter:" >&2
        printf "  %s\n" "${failed_files[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

@test "all comandos/especdev/*.md files have 'description' in frontmatter" {
    local errors=0
    local failed_files=()
    while IFS= read -r cmd_file; do
        # Extract text between first pair of --- delimiters
        local frontmatter
        frontmatter=$(awk '/^---$/{f=!f; next} f' "$cmd_file" | head -20)
        if ! echo "$frontmatter" | grep -q "^description:"; then
            errors=$((errors + 1))
            failed_files+=("$cmd_file")
        fi
    done < <(find "$REPO_ROOT/comandos/especdev" -name "*.md" -type f)
    if [ "$errors" -gt 0 ]; then
        echo "Commands missing 'description' in frontmatter:" >&2
        printf "  %s\n" "${failed_files[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

@test "all comandos/razonar/*.md files have YAML frontmatter" {
    local errors=0
    while IFS= read -r cmd_file; do
        local first_line
        first_line=$(head -1 "$cmd_file")
        if [ "$first_line" != "---" ]; then
            errors=$((errors + 1))
            echo "Missing frontmatter: $cmd_file" >&2
        fi
    done < <(find "$REPO_ROOT/comandos/razonar" -name "*.md" -type f)
    [ "$errors" -eq 0 ]
}

@test "there are at least 40 commands in comandos/especdev/" {
    local count
    count=$(find "$REPO_ROOT/comandos/especdev" -name "*.md" -type f | wc -l | tr -d ' ')
    [ "$count" -ge 40 ]
}

@test "there are at least 10 commands in comandos/razonar/" {
    local count
    count=$(find "$REPO_ROOT/comandos/razonar" -name "*.md" -type f | wc -l | tr -d ' ')
    [ "$count" -ge 10 ]
}

# ─── Skills: each habilidad has HABILIDAD.md ─────────────────────────────────

@test "every habilidad directory contains HABILIDAD.md" {
    local errors=0
    local failed_dirs=()
    while IFS= read -r skill_dir; do
        if [ ! -f "${skill_dir}/HABILIDAD.md" ]; then
            errors=$((errors + 1))
            failed_dirs+=("$skill_dir")
        fi
    done < <(find "$REPO_ROOT/habilidades" -mindepth 1 -maxdepth 1 -type d)
    if [ "$errors" -gt 0 ]; then
        echo "Skills missing HABILIDAD.md:" >&2
        printf "  %s\n" "${failed_dirs[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

@test "there are at least 30 habilidades" {
    local count
    count=$(find "$REPO_ROOT/habilidades" -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')
    [ "$count" -ge 30 ]
}

# ─── SKILL.md files (Anthropic Skills 2.0 / .agent/skills/) ─────────────────

@test ".agent/skills/ directory exists" {
    [ -d "$REPO_ROOT/.agent/skills" ]
}

@test "all .agent/skills/*/SKILL.md files have YAML frontmatter" {
    local errors=0
    local failed_files=()
    while IFS= read -r skill_file; do
        local first_line
        first_line=$(head -1 "$skill_file")
        if [ "$first_line" != "---" ]; then
            errors=$((errors + 1))
            failed_files+=("$skill_file")
        fi
    done < <(find "$REPO_ROOT/.agent/skills" -name "SKILL.md" -type f 2>/dev/null)
    if [ "$errors" -gt 0 ]; then
        echo "SKILL.md files missing frontmatter:" >&2
        printf "  %s\n" "${failed_files[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

@test "all SKILL.md files have 'name' in frontmatter" {
    local errors=0
    local failed_files=()
    while IFS= read -r skill_file; do
        local frontmatter
        frontmatter=$(awk '/^---$/{f=!f; next} f' "$skill_file" | head -20)
        if ! echo "$frontmatter" | grep -q "^name:"; then
            errors=$((errors + 1))
            failed_files+=("$skill_file")
        fi
    done < <(find "$REPO_ROOT/.agent/skills" -name "SKILL.md" -type f 2>/dev/null)
    if [ "$errors" -gt 0 ]; then
        echo "SKILL.md files missing 'name':" >&2
        printf "  %s\n" "${failed_files[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

@test "all SKILL.md files have 'description' in frontmatter" {
    local errors=0
    local failed_files=()
    while IFS= read -r skill_file; do
        local frontmatter
        frontmatter=$(awk '/^---$/{f=!f; next} f' "$skill_file" | head -20)
        if ! echo "$frontmatter" | grep -q "^description:"; then
            errors=$((errors + 1))
            failed_files+=("$skill_file")
        fi
    done < <(find "$REPO_ROOT/.agent/skills" -name "SKILL.md" -type f 2>/dev/null)
    if [ "$errors" -gt 0 ]; then
        echo "SKILL.md files missing 'description':" >&2
        printf "  %s\n" "${failed_files[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

@test "SKILL.md directory names follow lowercase-hyphens convention" {
    local errors=0
    local failed_dirs=()
    while IFS= read -r skill_file; do
        local dir_name
        dir_name=$(basename "$(dirname "$skill_file")")
        if ! echo "$dir_name" | grep -qE '^[a-z0-9][a-z0-9-]*$'; then
            errors=$((errors + 1))
            failed_dirs+=("$dir_name")
        fi
    done < <(find "$REPO_ROOT/.agent/skills" -name "SKILL.md" -type f 2>/dev/null)
    if [ "$errors" -gt 0 ]; then
        echo "Skill dirs not following lowercase-hyphens convention:" >&2
        printf "  %s\n" "${failed_dirs[@]}" >&2
    fi
    [ "$errors" -eq 0 ]
}

# ─── Critical root files ──────────────────────────────────────────────────────

@test "CLAUDE.md exists" {
    [ -f "$REPO_ROOT/CLAUDE.md" ]
}

@test "AGENTS.md exists" {
    [ -f "$REPO_ROOT/AGENTS.md" ]
}

@test "README.md exists" {
    [ -f "$REPO_ROOT/README.md" ]
}

@test "LICENCIA exists" {
    [ -f "$REPO_ROOT/LICENCIA" ]
}

@test "CHANGELOG.md exists" {
    [ -f "$REPO_ROOT/CHANGELOG.md" ]
}

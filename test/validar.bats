#!/usr/bin/env bats
# test/validar.bats — Tests for scripts/validar.sh

load test_helper

# The validator always runs from the repo root (it checks relative paths like
# "comandos/", "habilidades/", "README.md", etc.), so we simply point it at
# $REPO_ROOT and let it validate the real repo structure.

# ─── Happy path ───────────────────────────────────────────────────────────────

@test "validar.sh passes on the real repo (exits 0)" {
    run bash -c "cd '$REPO_ROOT' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -eq 0 ]
}

@test "validar.sh output contains 'Framework válido'" {
    run bash -c "cd '$REPO_ROOT' && bash '$REPO_ROOT/scripts/validar.sh'"
    [[ "$output" == *"Framework válido"* ]]
}

@test "validar.sh reports 0 errors on real repo" {
    run bash -c "cd '$REPO_ROOT' && bash '$REPO_ROOT/scripts/validar.sh'"
    [[ "$output" == *"Errores: 0"* ]]
}

# ─── Directory checks ─────────────────────────────────────────────────────────

@test "validar.sh fails when 'comandos' directory is missing" {
    setup_tmpdir
    # Build a minimal valid structure then remove 'comandos'
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -rf "$fake_root/comandos"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when 'habilidades' directory is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -rf "$fake_root/habilidades"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when 'reglas' directory is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -rf "$fake_root/reglas"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when 'ganchos' directory is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -rf "$fake_root/ganchos"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when 'plantillas' directory is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -rf "$fake_root/plantillas"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

# ─── File checks ──────────────────────────────────────────────────────────────

@test "validar.sh fails when README.md is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -f "$fake_root/README.md"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when CLAUDE.md is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -f "$fake_root/CLAUDE.md"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when LICENCIA is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -f "$fake_root/LICENCIA"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when package.json is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -f "$fake_root/package.json"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

@test "validar.sh fails when VERSION is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo "$fake_root"
    rm -f "$fake_root/VERSION"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [ "$status" -ne 0 ]
    teardown_tmpdir
}

# ─── HABILIDAD.md warnings ────────────────────────────────────────────────────

@test "validar.sh emits a warning when a skill lacks HABILIDAD.md" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo_with_razonar "$fake_root"

    # Add a skill directory without HABILIDAD.md
    mkdir -p "$fake_root/habilidades/skill-sin-doc"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    # Output should mention the missing file (warning is printed regardless of exit status)
    [[ "$output" == *"HABILIDAD.md"* ]]
    teardown_tmpdir
}

@test "validar.sh warning output contains the skill name when HABILIDAD.md is missing" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo_with_razonar "$fake_root"
    mkdir -p "$fake_root/habilidades/mi-skill-huerfana"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    [[ "$output" == *"mi-skill-huerfana"* ]]
    teardown_tmpdir
}

@test "validar.sh reports non-zero Advertencias when a skill lacks HABILIDAD.md" {
    setup_tmpdir
    local fake_root="$TEST_TMPDIR/repo"
    _build_minimal_repo_with_razonar "$fake_root"
    mkdir -p "$fake_root/habilidades/skill-sin-doc"

    run bash -c "cd '$fake_root' && bash '$REPO_ROOT/scripts/validar.sh'"
    # Advertencias count should be > 0 (e.g., "Advertencias: 1")
    [[ "$output" =~ "Advertencias: "[1-9] ]]
    teardown_tmpdir
}

# ─── Command counts ───────────────────────────────────────────────────────────

@test "validar.sh output includes /especdev command count" {
    run bash -c "cd '$REPO_ROOT' && bash '$REPO_ROOT/scripts/validar.sh'"
    [[ "$output" == *"Comandos /especdev:*:"* ]]
}

@test "validar.sh reports at least 40 /especdev commands" {
    run bash -c "cd '$REPO_ROOT' && bash '$REPO_ROOT/scripts/validar.sh'"
    # Extract the count from the output line "Comandos /especdev:*: N"
    local count
    count=$(echo "$output" | grep -oE 'Comandos /especdev:\*: [0-9]+' | grep -oE '[0-9]+$')
    [ -n "$count" ]
    [ "$count" -ge 40 ]
}

@test "validar.sh reports at least 10 /razonar commands" {
    run bash -c "cd '$REPO_ROOT' && bash '$REPO_ROOT/scripts/validar.sh'"
    local count
    count=$(echo "$output" | grep -oE 'Comandos /razonar:\*: [0-9]+' | grep -oE '[0-9]+$')
    [ -n "$count" ]
    [ "$count" -ge 10 ]
}

# ─── Helper: build minimal valid repo skeleton ───────────────────────────────

_build_minimal_repo() {
    local root="$1"
    mkdir -p "$root/comandos/especdev" "$root/comandos/razonar"
    mkdir -p "$root/habilidades/skill-uno"
    mkdir -p "$root/ganchos" "$root/reglas" "$root/plantillas" "$root/agentes" "$root/scripts"
    touch "$root/README.md"
    touch "$root/CLAUDE.md"
    touch "$root/LICENCIA"
    echo '{"name":"test","version":"0.0.1"}' > "$root/package.json"
    echo "0.0.1" > "$root/VERSION"
    # Add HABILIDAD.md for the default skill so the validator doesn't warn
    echo "# Skill" > "$root/habilidades/skill-uno/HABILIDAD.md"
    # Add at least one command so counts are parseable
    printf -- "---\ndescription: test\n---\n" > "$root/comandos/especdev/test.md"
}

# Like _build_minimal_repo but also adds a razonar command so that the
# `ls comandos/razonar/*.md` in validar.sh succeeds (avoiding set -e exit).
_build_minimal_repo_with_razonar() {
    _build_minimal_repo "$1"
    printf -- "---\ndescription: razonar test\n---\n" > "$1/comandos/razonar/test.md"
}

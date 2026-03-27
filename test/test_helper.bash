#!/usr/bin/env bash
# test/test_helper.bash — Shared setup/teardown helpers for all bats test suites

# Absolute path to the repo root (resolved relative to this file's location)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ─── Temp directory management ───────────────────────────────────────────────

# Creates an isolated temp directory and stores it in $TEST_TMPDIR.
# Called in setup() of tests that need filesystem isolation.
setup_tmpdir() {
    TEST_TMPDIR="$(mktemp -d)"
    export TEST_TMPDIR
}

# Removes $TEST_TMPDIR if it was created. Call in teardown().
teardown_tmpdir() {
    if [[ -n "${TEST_TMPDIR:-}" && -d "$TEST_TMPDIR" ]]; then
        rm -rf "$TEST_TMPDIR"
    fi
}

# ─── Installation helpers ────────────────────────────────────────────────────

# Runs the installer in --local mode against a temp directory.
# Args:
#   $1 — language flag (es, en, pt)
#   $2 — target base dir (TMPDIR sub-path used as working dir)
# Sets:
#   INSTALL_WD      — directory the installer was run from
#   FRAMEWORK_HOME  — expected framework home (.claude/don-cheli inside INSTALL_WD)
#   COMMANDS_DIR    — expected commands dir (.claude/commands inside INSTALL_WD)
run_local_install() {
    local lang="${1:-es}"
    local work_dir="${2:-$TEST_TMPDIR/project}"
    mkdir -p "$work_dir"
    INSTALL_WD="$work_dir"
    FRAMEWORK_HOME="${work_dir}/.claude/don-cheli"
    COMMANDS_DIR="${work_dir}/.claude/commands"

    # Run installer with cwd = work_dir so ./.claude/... paths resolve correctly
    (cd "$work_dir" && bash "$REPO_ROOT/scripts/instalar.sh" --local --lang "$lang") \
        > "$TEST_TMPDIR/install.out" 2>&1
    return $?
}

# Runs the installer in --global mode against a temp HOME.
# Sets:
#   FAKE_HOME       — synthetic HOME dir
#   FRAMEWORK_HOME  — $FAKE_HOME/.claude/don-cheli
#   COMMANDS_DIR    — $FAKE_HOME/.claude/commands
run_global_install() {
    local lang="${1:-es}"
    FAKE_HOME="${TEST_TMPDIR}/home"
    mkdir -p "$FAKE_HOME"
    FRAMEWORK_HOME="${FAKE_HOME}/.claude/don-cheli"
    COMMANDS_DIR="${FAKE_HOME}/.claude/commands"

    HOME="$FAKE_HOME" bash "$REPO_ROOT/scripts/instalar.sh" --global --lang "$lang" \
        > "$TEST_TMPDIR/install.out" 2>&1
    return $?
}

# ─── Assertion helpers ───────────────────────────────────────────────────────

# Asserts a directory exists; prints a helpful message on failure.
assert_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        echo "FAIL: expected directory to exist: $dir" >&2
        return 1
    fi
}

# Asserts a regular file exists.
assert_file() {
    local file="$1"
    if [[ ! -f "$file" ]]; then
        echo "FAIL: expected file to exist: $file" >&2
        return 1
    fi
}

# Asserts the content of a file matches a pattern (grep -q).
assert_file_contains() {
    local file="$1"
    local pattern="$2"
    if ! grep -q "$pattern" "$file" 2>/dev/null; then
        echo "FAIL: '$pattern' not found in $file" >&2
        return 1
    fi
}

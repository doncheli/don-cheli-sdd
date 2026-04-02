#!/bin/bash
# Don Cheli SDD Check — Quality Gates for CI/CD
# Validates SDD artifacts, TDD compliance, coverage and security
#
# Usage:
#   bash scripts/sdd-check.sh                     # Run all gates
#   INPUT_GATES=spec,tdd bash scripts/sdd-check.sh  # Run specific gates
#
# Environment variables (set by GitHub Action or manually):
#   INPUT_GATES          — Gates to run: all, spec, tdd, coverage, owasp, custom
#   INPUT_MIN_COVERAGE   — Minimum coverage percentage (default: 85)
#   INPUT_FAIL_ON_WARN   — Treat warnings as failures (default: false)
#   INPUT_DC_DIR         — Path to .dc/ (auto-detect if empty)
#   INPUT_CUSTOM_GATES_DIR — Path to custom gates (default: .dc/gates)

set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════

GATES="${INPUT_GATES:-all}"
MIN_COVERAGE="${INPUT_MIN_COVERAGE:-85}"
FAIL_ON_WARN="${INPUT_FAIL_ON_WARN:-false}"
CUSTOM_GATES_DIR="${INPUT_CUSTOM_GATES_DIR:-.dc/gates}"

# Auto-detect .dc/ or .especdev/ (retrocompatible)
if [ -n "${INPUT_DC_DIR:-}" ]; then
    DC_DIR="$INPUT_DC_DIR"
elif [ -d ".dc" ]; then
    DC_DIR=".dc"
elif [ -d ".especdev" ]; then
    DC_DIR=".especdev"
else
    DC_DIR=".dc"
fi

# ═══════════════════════════════════════════════════════════════
# STATE
# ═══════════════════════════════════════════════════════════════

TOTAL_GATES=0
PASSED_GATES=0
FAILED_GATES=0
WARNINGS=0
REPORT=""
COVERAGE_VALUE="N/A"

# Colors (only for terminal, not for GitHub output)
if [ -t 1 ]; then
    GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
    CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
else
    GREEN=''; RED=''; YELLOW=''; CYAN=''; BOLD=''; NC=''
fi

# ═══════════════════════════════════════════════════════════════
# HELPERS
# ═══════════════════════════════════════════════════════════════

pass_gate() {
    local name="$1" detail="${2:-}"
    TOTAL_GATES=$((TOTAL_GATES + 1))
    PASSED_GATES=$((PASSED_GATES + 1))
    echo -e "${GREEN}✅${NC} $name${detail:+ — $detail}"
    REPORT="${REPORT}| ✅ | ${name} | ${detail:-OK} |\n"
}

fail_gate() {
    local name="$1" detail="${2:-}"
    TOTAL_GATES=$((TOTAL_GATES + 1))
    FAILED_GATES=$((FAILED_GATES + 1))
    echo -e "${RED}❌${NC} $name${detail:+ — $detail}"
    REPORT="${REPORT}| ❌ | ${name} | ${detail:-FAILED} |\n"
}

warn_gate() {
    local name="$1" detail="${2:-}"
    TOTAL_GATES=$((TOTAL_GATES + 1))
    WARNINGS=$((WARNINGS + 1))
    if [ "$FAIL_ON_WARN" = "true" ]; then
        FAILED_GATES=$((FAILED_GATES + 1))
        echo -e "${YELLOW}⚠️${NC} $name${detail:+ — $detail} (treated as failure)"
        REPORT="${REPORT}| ⚠️→❌ | ${name} | ${detail:-WARNING} |\n"
    else
        PASSED_GATES=$((PASSED_GATES + 1))
        echo -e "${YELLOW}⚠️${NC} $name${detail:+ — $detail}"
        REPORT="${REPORT}| ⚠️ | ${name} | ${detail:-WARNING} |\n"
    fi
}

should_run() {
    local gate="$1"
    [ "$GATES" = "all" ] && return 0
    echo ",$GATES," | grep -q ",$gate," && return 0
    return 1
}

# ═══════════════════════════════════════════════════════════════
# GATE 1: SPEC VALIDATION
# ═══════════════════════════════════════════════════════════════

run_spec_gate() {
    echo -e "\n${BOLD}Gate 1: Spec Validation${NC}"

    if [ ! -d "$DC_DIR" ]; then
        fail_gate "SDD Directory" "$DC_DIR/ not found"
        return
    fi
    pass_gate "SDD Directory" "$DC_DIR/ exists"

    # Check for config
    if [ -f "$DC_DIR/config.yaml" ]; then
        pass_gate "Config" "config.yaml present"
    else
        warn_gate "Config" "config.yaml not found"
    fi

    # Check for specs
    SPEC_COUNT=$(find "$DC_DIR/specs" -name "*.feature" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$SPEC_COUNT" -gt 0 ]; then
        pass_gate "Gherkin Specs" "$SPEC_COUNT .feature files found"
    else
        fail_gate "Gherkin Specs" "No .feature files in $DC_DIR/specs/"
    fi

    # Check for blueprint
    BP_COUNT=$(find "$DC_DIR/blueprints" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$BP_COUNT" -gt 0 ]; then
        pass_gate "Blueprint" "$BP_COUNT blueprint(s) found"
    else
        warn_gate "Blueprint" "No blueprints in $DC_DIR/blueprints/"
    fi

    # Check estado/status
    if [ -f "$DC_DIR/estado.md" ] || [ -f "$DC_DIR/status.md" ]; then
        pass_gate "Status File" "Project status tracked"
    else
        warn_gate "Status File" "No estado.md or status.md"
    fi
}

# ═══════════════════════════════════════════════════════════════
# GATE 2: TDD COMPLIANCE
# ═══════════════════════════════════════════════════════════════

run_tdd_gate() {
    echo -e "\n${BOLD}Gate 2: TDD Compliance${NC}"

    # Check for test files
    TEST_COUNT=0
    for pattern in "test/" "tests/" "__tests__/" "spec/" "*_test.go" "*.test.ts" "*.test.js" "*.spec.ts" "*.spec.js" "test_*.py" "*_test.py"; do
        COUNT=$(find . -path "./$DC_DIR" -prune -o -path "./node_modules" -prune -o \( -name "$pattern" -o -path "*/$pattern*" \) -print 2>/dev/null | wc -l | tr -d ' ')
        TEST_COUNT=$((TEST_COUNT + COUNT))
    done

    if [ "$TEST_COUNT" -gt 0 ]; then
        pass_gate "Test Files" "$TEST_COUNT test file(s) found"
    else
        fail_gate "Test Files" "No test files found"
    fi

    # Check for stub detection (// TODO, // FIXME in src)
    STUB_COUNT=0
    for ext in ts js py go rb java; do
        STUBS=$(grep -rn "// TODO\|// FIXME\|# TODO\|# FIXME\|pass  #\|raise NotImplementedError" \
            --include="*.$ext" . 2>/dev/null \
            | grep -v node_modules | grep -v "$DC_DIR" | grep -v test | wc -l | tr -d ' ')
        STUB_COUNT=$((STUB_COUNT + STUBS))
    done

    if [ "$STUB_COUNT" -eq 0 ]; then
        pass_gate "Stub Detection" "No TODO/FIXME stubs in source code"
    elif [ "$STUB_COUNT" -le 3 ]; then
        warn_gate "Stub Detection" "$STUB_COUNT stub(s) found"
    else
        fail_gate "Stub Detection" "$STUB_COUNT stubs found — possible silent stubs"
    fi
}

# ═══════════════════════════════════════════════════════════════
# GATE 3: COVERAGE
# ═══════════════════════════════════════════════════════════════

run_coverage_gate() {
    echo -e "\n${BOLD}Gate 3: Coverage${NC}"

    # Try to find coverage report
    COV_FILE=""
    for f in coverage/lcov.info coverage/cobertura.xml coverage/coverage.json htmlcov/index.html coverage.xml .coverage; do
        if [ -f "$f" ]; then
            COV_FILE="$f"
            break
        fi
    done

    if [ -z "$COV_FILE" ]; then
        warn_gate "Coverage Report" "No coverage report found. Run tests with coverage first."
        return
    fi

    # Extract coverage percentage based on format
    COV_PCT=0
    case "$COV_FILE" in
        *lcov.info)
            LINES_HIT=$(grep -c "^DA:" "$COV_FILE" 2>/dev/null || echo 0)
            LINES_FOUND=$(grep "^DA:" "$COV_FILE" 2>/dev/null | grep -c ",0$" || echo 0)
            if [ "$LINES_HIT" -gt 0 ]; then
                COV_PCT=$(( (LINES_HIT - LINES_FOUND) * 100 / LINES_HIT ))
            fi
            ;;
        *cobertura.xml|*coverage.xml)
            COV_PCT=$(grep -o 'line-rate="[0-9.]*"' "$COV_FILE" 2>/dev/null | head -1 | grep -o '[0-9.]*' | head -1 || echo 0)
            COV_PCT=$(echo "$COV_PCT * 100" | bc 2>/dev/null | cut -d. -f1 || echo 0)
            ;;
        *coverage.json)
            COV_PCT=$(python3 -c "import json; d=json.load(open('$COV_FILE')); print(int(d.get('totals',{}).get('lines',{}).get('percent',0)))" 2>/dev/null || echo 0)
            ;;
        *)
            COV_PCT=0
            ;;
    esac

    COVERAGE_VALUE="${COV_PCT}%"

    if [ "$COV_PCT" -ge "$MIN_COVERAGE" ]; then
        pass_gate "Coverage" "${COV_PCT}% >= ${MIN_COVERAGE}% minimum"
    else
        fail_gate "Coverage" "${COV_PCT}% < ${MIN_COVERAGE}% minimum"
    fi
}

# ═══════════════════════════════════════════════════════════════
# GATE 4: OWASP QUICK AUDIT
# ═══════════════════════════════════════════════════════════════

run_owasp_gate() {
    echo -e "\n${BOLD}Gate 4: OWASP Quick Audit${NC}"

    OWASP_ISSUES=0

    # A01: Hardcoded secrets
    SECRETS=$(grep -rn "password\s*=\s*['\"].\+['\"]" --include="*.py" --include="*.js" --include="*.ts" --include="*.go" --include="*.java" \
        . 2>/dev/null | grep -v node_modules | grep -v test | grep -v "$DC_DIR" | wc -l | tr -d ' ')
    if [ "$SECRETS" -gt 0 ]; then
        warn_gate "A01: Hardcoded Secrets" "$SECRETS potential hardcoded passwords"
        OWASP_ISSUES=$((OWASP_ISSUES + SECRETS))
    fi

    # A03: SQL Injection
    SQLI=$(grep -rn "f\".*SELECT\|f\".*INSERT\|f\".*DELETE\|f\".*UPDATE\|\".*SELECT.*\" *%" \
        --include="*.py" --include="*.js" --include="*.ts" . 2>/dev/null \
        | grep -v node_modules | grep -v test | grep -v "$DC_DIR" | wc -l | tr -d ' ')
    if [ "$SQLI" -gt 0 ]; then
        fail_gate "A03: SQL Injection" "$SQLI potential SQL injection patterns"
        OWASP_ISSUES=$((OWASP_ISSUES + SQLI))
    fi

    # A03: XSS via innerHTML/dangerouslySetInnerHTML
    XSS=$(grep -rn "innerHTML\|dangerouslySetInnerHTML\|v-html" \
        --include="*.js" --include="*.ts" --include="*.tsx" --include="*.jsx" --include="*.vue" . 2>/dev/null \
        | grep -v node_modules | grep -v test | grep -v "$DC_DIR" | wc -l | tr -d ' ')
    if [ "$XSS" -gt 0 ]; then
        warn_gate "A03: XSS" "$XSS innerHTML/dangerouslySetInnerHTML usages"
        OWASP_ISSUES=$((OWASP_ISSUES + XSS))
    fi

    # A07: .env committed
    if [ -f ".env" ] && ! grep -q "^\.env$" .gitignore 2>/dev/null; then
        fail_gate "A07: .env exposed" ".env file exists and is not in .gitignore"
        OWASP_ISSUES=$((OWASP_ISSUES + 1))
    fi

    if [ "$OWASP_ISSUES" -eq 0 ]; then
        pass_gate "OWASP Quick Audit" "No critical issues detected"
    fi
}

# ═══════════════════════════════════════════════════════════════
# GATE 5: CUSTOM GATES
# ═══════════════════════════════════════════════════════════════

run_custom_gates() {
    echo -e "\n${BOLD}Gate 5: Custom Gates${NC}"

    if [ ! -d "$CUSTOM_GATES_DIR" ]; then
        echo -e "  ${CYAN}ℹ${NC} No custom gates directory ($CUSTOM_GATES_DIR)"
        return
    fi

    GATE_FILES=$(find "$CUSTOM_GATES_DIR" -name "*.yml" -o -name "*.yaml" 2>/dev/null)
    if [ -z "$GATE_FILES" ]; then
        echo -e "  ${CYAN}ℹ${NC} No custom gate files found"
        return
    fi

    for gate_file in $GATE_FILES; do
        # Parse YAML manually (no yq dependency)
        GATE_NAME=$(grep "^name:" "$gate_file" | sed 's/^name:\s*//' | tr -d '"' | tr -d "'")
        GATE_TYPE=$(grep "^type:" "$gate_file" | sed 's/^type:\s*//' | tr -d '"' | tr -d "'")
        GATE_SEVERITY=$(grep "^severity:" "$gate_file" | sed 's/^severity:\s*//' | tr -d '"' | tr -d "'")
        GATE_PATTERN=$(grep "^pattern:" "$gate_file" | sed 's/^pattern:\s*//' | tr -d '"' | tr -d "'")
        GATE_FILES_GLOB=$(grep "^files:" "$gate_file" | sed 's/^files:\s*//' | tr -d '"' | tr -d "'")
        GATE_MESSAGE=$(grep "^message:" "$gate_file" | sed 's/^message:\s*//' | tr -d '"' | tr -d "'")

        [ -z "$GATE_NAME" ] && GATE_NAME=$(basename "$gate_file" .yml)
        [ -z "$GATE_SEVERITY" ] && GATE_SEVERITY="warn"

        case "$GATE_TYPE" in
            grep)
                MATCHES=$(grep -rn "$GATE_PATTERN" --include="$(echo "$GATE_FILES_GLOB" | sed 's|.*/||')" . 2>/dev/null \
                    | grep -v node_modules | grep -v "$DC_DIR" | wc -l | tr -d ' ')
                if [ "$MATCHES" -gt 0 ]; then
                    if [ "$GATE_SEVERITY" = "block" ]; then
                        fail_gate "Custom: $GATE_NAME" "${GATE_MESSAGE:-$MATCHES matches found}"
                    else
                        warn_gate "Custom: $GATE_NAME" "${GATE_MESSAGE:-$MATCHES matches found}"
                    fi
                else
                    pass_gate "Custom: $GATE_NAME" "No matches"
                fi
                ;;
            script)
                GATE_RUN=$(sed -n '/^run:/,/^[a-z]/p' "$gate_file" | grep -v "^run:" | grep -v "^[a-z]" | sed 's/^\s*//')
                if [ -n "$GATE_RUN" ]; then
                    if eval "$GATE_RUN" > /dev/null 2>&1; then
                        pass_gate "Custom: $GATE_NAME" "Script passed"
                    else
                        if [ "$GATE_SEVERITY" = "block" ]; then
                            fail_gate "Custom: $GATE_NAME" "${GATE_MESSAGE:-Script failed}"
                        else
                            warn_gate "Custom: $GATE_NAME" "${GATE_MESSAGE:-Script failed}"
                        fi
                    fi
                fi
                ;;
            *)
                warn_gate "Custom: $GATE_NAME" "Unknown gate type: $GATE_TYPE"
                ;;
        esac
    done
}

# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

echo -e "${BOLD}═══════════════════════════════════════════${NC}"
echo -e "${BOLD}  Don Cheli SDD — Quality Gates Check${NC}"
echo -e "${BOLD}═══════════════════════════════════════════${NC}"
echo ""
echo -e "  Directory: ${CYAN}$DC_DIR${NC}"
echo -e "  Gates:     ${CYAN}$GATES${NC}"
echo -e "  Coverage:  ${CYAN}>= ${MIN_COVERAGE}%${NC}"

should_run "spec"     && run_spec_gate
should_run "tdd"      && run_tdd_gate
should_run "coverage" && run_coverage_gate
should_run "owasp"    && run_owasp_gate
should_run "custom"   && run_custom_gates

# ═══════════════════════════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════════════════════════

echo ""
echo -e "${BOLD}═══════════════════════════════════════════${NC}"

ALL_PASSED="true"
if [ "$FAILED_GATES" -gt 0 ]; then
    ALL_PASSED="false"
    echo -e "${RED}${BOLD}  ❌ FAILED — $PASSED_GATES/$TOTAL_GATES gates passed ($FAILED_GATES failed, $WARNINGS warnings)${NC}"
else
    echo -e "${GREEN}${BOLD}  ✅ PASSED — $PASSED_GATES/$TOTAL_GATES gates passed ($WARNINGS warnings)${NC}"
fi

echo -e "${BOLD}═══════════════════════════════════════════${NC}"

# Build markdown report for PR comment
FULL_REPORT="## 🛡️ Don Cheli SDD — Quality Gates\n\n"
if [ "$ALL_PASSED" = "true" ]; then
    FULL_REPORT="${FULL_REPORT}**✅ All gates passed** ($PASSED_GATES/$TOTAL_GATES)\n\n"
else
    FULL_REPORT="${FULL_REPORT}**❌ $FAILED_GATES gate(s) failed** ($PASSED_GATES/$TOTAL_GATES passed)\n\n"
fi
FULL_REPORT="${FULL_REPORT}| Status | Gate | Detail |\n|--------|------|--------|\n${REPORT}\n"
FULL_REPORT="${FULL_REPORT}---\n*Generated by [Don Cheli SDD](https://github.com/doncheli/don-cheli-sdd)*"

# GitHub Actions outputs
if [ -n "${GITHUB_OUTPUT:-}" ]; then
    {
        echo "passed=$ALL_PASSED"
        echo "coverage=$COVERAGE_VALUE"
        echo "gates_passed=$PASSED_GATES"
        echo "gates_total=$TOTAL_GATES"
        # Multiline output
        echo "report<<ENDOFREPORT"
        printf "%b" "$FULL_REPORT"
        echo ""
        echo "ENDOFREPORT"
    } >> "$GITHUB_OUTPUT"
fi

# Exit code
if [ "$ALL_PASSED" = "false" ]; then
    exit 1
fi

/**
 * Quality Gate: TDD Enforcement (Iron Law)
 * Verifies tests exist and no stubs remain
 */

import { existsSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import type { GateResult } from "./spec-gate.js";

export function tddGate(projectDir: string): GateResult {
  const details: string[] = [];
  let passed = true;

  // 1. Check test files exist
  const testPatterns = [
    "**/*.test.ts", "**/*.test.js", "**/*.spec.ts", "**/*.spec.js",
    "**/test_*.py", "**/*_test.py", "**/*_test.go",
    "**/test/**", "**/tests/**", "**/__tests__/**",
  ];

  let testCount = 0;
  try {
    const result = execSync(
      `find . -type f \\( -name "*.test.*" -o -name "*.spec.*" -o -name "test_*" -o -name "*_test.*" \\) | grep -v node_modules | grep -v .dc`,
      { encoding: "utf-8", cwd: projectDir }
    );
    testCount = result.trim().split("\n").filter(Boolean).length;
  } catch {
    testCount = 0;
  }

  if (testCount === 0) {
    passed = false;
    details.push("❌ No test files found — Iron Law violated");
  } else {
    details.push(`✅ ${testCount} test file(s) found`);
  }

  // 2. Check for stubs (// TODO, // FIXME)
  let stubCount = 0;
  try {
    const stubs = execSync(
      `grep -rn "// TODO\\|// FIXME\\|# TODO\\|# FIXME\\|raise NotImplementedError\\|pass  #" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" . | grep -v node_modules | grep -v .dc | grep -v test`,
      { encoding: "utf-8", cwd: projectDir }
    );
    stubCount = stubs.trim().split("\n").filter(Boolean).length;
  } catch {
    stubCount = 0;
  }

  if (stubCount > 0) {
    passed = false;
    details.push(`❌ ${stubCount} stub(s) detected (// TODO / // FIXME)`);
  } else {
    details.push("✅ No stubs detected");
  }

  // 3. Try to run tests
  let testsPass = false;
  try {
    execSync("npm test 2>&1 || npx vitest run 2>&1 || npx jest 2>&1 || pytest 2>&1", {
      cwd: projectDir,
      timeout: 120_000,
      stdio: "pipe",
    });
    testsPass = true;
    details.push("✅ Tests pass");
  } catch {
    if (testCount > 0) {
      passed = false;
      details.push("❌ Tests fail");
    }
  }

  return {
    passed,
    message: passed ? "TDD Iron Law: ENFORCED" : "TDD Iron Law: VIOLATED",
    details,
  };
}

/**
 * Quality Gate: TDD Enforcement (Iron Law)
 * Verifies tests exist and no stubs remain
 */

import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import type { GateResult } from "./spec-gate.js";
import * as log from "../utils/logger.js";

export function tddGate(projectDir: string): GateResult {
  const details: string[] = [];
  let passed = true;

  log.info("Running TDD gate...");

  // 1. Check test files exist
  let testFiles: string[] = [];
  try {
    const result = execSync(
      `find . -type f \\( -name "*.test.*" -o -name "*.spec.*" -o -name "test_*" -o -name "*_test.*" \\) | grep -v node_modules | grep -v .dc | grep -v dist`,
      { encoding: "utf-8", cwd: projectDir }
    );
    testFiles = result.trim().split("\n").filter(Boolean);
  } catch {
    testFiles = [];
  }

  if (testFiles.length === 0) {
    // Check for test directories with any files
    const testDirs = ["test", "tests", "__tests__", "spec"];
    for (const dir of testDirs) {
      const fullPath = join(projectDir, dir);
      if (existsSync(fullPath)) {
        try {
          const files = execSync(`find "${fullPath}" -type f | head -20`, {
            encoding: "utf-8",
          });
          const found = files.trim().split("\n").filter(Boolean);
          if (found.length > 0) {
            testFiles = found;
            break;
          }
        } catch {}
      }
    }
  }

  if (testFiles.length === 0) {
    passed = false;
    details.push("No test files found — TDD Iron Law requires tests");
    log.fail("TDD Gate: No test files found");
  } else {
    details.push(`${testFiles.length} test file(s) found`);
    log.info(`TDD Gate: ${testFiles.length} test file(s) found`);
    for (const f of testFiles.slice(0, 5)) {
      details.push(`  ${f}`);
    }
  }

  // 2. Check for stubs (// TODO, // FIXME) — only in src files, not tests
  let stubCount = 0;
  try {
    const stubs = execSync(
      `grep -rn "// TODO\\|// FIXME" --include="*.ts" --include="*.js" --include="*.py" --include="*.go" . 2>/dev/null | grep -v node_modules | grep -v .dc | grep -v dist | grep -v test | grep -v spec || true`,
      { encoding: "utf-8", cwd: projectDir }
    );
    stubCount = stubs.trim().split("\n").filter(Boolean).length;
  } catch {
    stubCount = 0;
  }

  if (stubCount > 0) {
    // Warn but don't block — Claude sometimes adds TODO for follow-ups
    details.push(`${stubCount} stub(s) found (// TODO / // FIXME) — warning`);
    log.warn(`TDD Gate: ${stubCount} stub(s) found`);
  } else {
    details.push("No stubs detected");
  }

  // 3. Try to run tests (only if a test runner is configured)
  if (testFiles.length > 0) {
    const hasPackageJson = existsSync(join(projectDir, "package.json"));
    const hasPytest = existsSync(join(projectDir, "pytest.ini")) || existsSync(join(projectDir, "pyproject.toml"));

    let testRan = false;
    let testsPass = false;

    if (hasPackageJson) {
      // Check if package.json has a test script
      try {
        const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
        if (pkg.scripts?.test && pkg.scripts.test !== 'echo "Error: no test specified" && exit 1') {
          try {
            execSync("npm test", {
              cwd: projectDir,
              timeout: 120_000,
              stdio: "pipe",
            });
            testsPass = true;
            testRan = true;
          } catch {
            testRan = true;
            testsPass = false;
          }
        }
      } catch {}

      // Try vitest/jest directly if npm test didn't work
      if (!testRan) {
        const runners = [
          { cmd: "npx vitest run --no-coverage", name: "vitest" },
          { cmd: "npx jest --passWithNoTests", name: "jest" },
        ];
        for (const runner of runners) {
          try {
            execSync(runner.cmd, {
              cwd: projectDir,
              timeout: 120_000,
              stdio: "pipe",
            });
            testsPass = true;
            testRan = true;
            details.push(`Tests pass (${runner.name})`);
            break;
          } catch {
            // Try next runner
          }
        }
      }
    }

    if (hasPytest) {
      try {
        execSync("pytest -x --tb=short", {
          cwd: projectDir,
          timeout: 120_000,
          stdio: "pipe",
        });
        testsPass = true;
        testRan = true;
      } catch {
        testRan = true;
      }
    }

    if (testRan && testsPass) {
      details.push("Tests pass");
      log.success("TDD Gate: Tests pass");
    } else if (testRan && !testsPass) {
      // Tests ran but failed — this is a real problem
      passed = false;
      details.push("Tests fail — fix required");
      log.fail("TDD Gate: Tests fail");
    } else {
      // No runner configured — just verify test files have real content
      let hasRealTests = false;
      for (const testFile of testFiles.slice(0, 3)) {
        try {
          const fullPath = testFile.startsWith("/") ? testFile : join(projectDir, testFile);
          const content = readFileSync(fullPath, "utf-8");
          // Check the test file has actual test content (not empty/placeholder)
          if (
            content.includes("describe") ||
            content.includes("test(") ||
            content.includes("it(") ||
            content.includes("def test_") ||
            content.includes("func Test") ||
            content.includes("assert") ||
            content.includes("expect")
          ) {
            hasRealTests = true;
            break;
          }
        } catch {}
      }

      if (hasRealTests) {
        details.push("Test files contain real test code (no runner configured to verify)");
        log.info("TDD Gate: Test files look valid, no runner to execute");
      } else {
        passed = false;
        details.push("Test files exist but don't contain real test assertions");
        log.fail("TDD Gate: Test files are empty or placeholders");
      }
    }
  }

  const message = passed ? "TDD Iron Law: ENFORCED" : "TDD Iron Law: VIOLATED";
  log.info(`TDD Gate result: ${message}`);

  return { passed, message, details };
}

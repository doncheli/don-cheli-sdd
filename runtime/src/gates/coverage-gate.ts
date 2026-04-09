/**
 * Quality Gate: Coverage Check
 * Verifies test coverage >= 85%
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { GateResult } from "./spec-gate.js";

export function coverageGate(projectDir: string, minCoverage = 85): GateResult {
  // Try common coverage report locations
  const coverageFiles = [
    "coverage/coverage-summary.json",
    "coverage/lcov.info",
    "coverage/cobertura.xml",
    "coverage.xml",
    "htmlcov/index.html",
  ];

  for (const file of coverageFiles) {
    const fullPath = join(projectDir, file);
    if (!existsSync(fullPath)) continue;

    if (file.endsWith(".json")) {
      try {
        const data = JSON.parse(readFileSync(fullPath, "utf-8"));
        const pct = data?.total?.lines?.pct ?? data?.total?.statements?.pct ?? 0;
        const passed = pct >= minCoverage;
        return {
          passed,
          message: `Coverage: ${pct}% ${passed ? ">=" : "<"} ${minCoverage}%`,
          details: [`Lines: ${pct}%`, `Threshold: ${minCoverage}%`],
        };
      } catch {}
    }

    if (file === "coverage/lcov.info") {
      try {
        const content = readFileSync(fullPath, "utf-8");
        const linesHit = (content.match(/^DA:\d+,([1-9]\d*)$/gm) || []).length;
        const linesTotal = (content.match(/^DA:/gm) || []).length;
        const pct = linesTotal > 0 ? Math.round((linesHit / linesTotal) * 100) : 0;
        const passed = pct >= minCoverage;
        return {
          passed,
          message: `Coverage: ${pct}% ${passed ? ">=" : "<"} ${minCoverage}%`,
        };
      } catch {}
    }
  }

  return {
    passed: false,
    message: "No coverage report found. Run tests with --coverage first.",
    details: ["Expected one of: " + coverageFiles.join(", ")],
  };
}

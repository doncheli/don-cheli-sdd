/**
 * Quality Gate: Spec Validation
 * Verifies .feature files exist after specify phase
 */

import { existsSync, readdirSync } from "fs";
import { join } from "path";

export interface GateResult {
  passed: boolean;
  message: string;
  details?: string[];
}

export function specGate(projectDir: string): GateResult {
  const specsDir = join(projectDir, ".dc", "specs");

  if (!existsSync(specsDir)) {
    return { passed: false, message: "No .dc/specs/ directory found" };
  }

  const features = readdirSync(specsDir, { recursive: true })
    .filter((f) => String(f).endsWith(".feature"));

  if (features.length === 0) {
    return { passed: false, message: "No .feature files found in .dc/specs/" };
  }

  return {
    passed: true,
    message: `${features.length} .feature file(s) found`,
    details: features.map(String),
  };
}

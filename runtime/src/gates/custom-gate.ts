/**
 * Quality Gate: Custom Gates
 * Reads .dc/gates/*.yml and executes custom rules
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import type { GateResult } from "./spec-gate.js";

interface CustomGateConfig {
  name: string;
  type: "grep" | "script";
  pattern?: string;
  files?: string;
  severity: "block" | "warn";
  message?: string;
  run?: string;
}

function parseYaml(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split("\n")) {
    const match = line.match(/^(\w[\w-]*):\s*(.+)$/);
    if (match) {
      result[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return result;
}

export function customGates(projectDir: string): GateResult {
  const gatesDir = join(projectDir, ".dc", "gates");

  if (!existsSync(gatesDir)) {
    return { passed: true, message: "No custom gates defined" };
  }

  const gateFiles = readdirSync(gatesDir).filter(
    (f) => f.endsWith(".yml") || f.endsWith(".yaml")
  );

  if (gateFiles.length === 0) {
    return { passed: true, message: "No custom gates defined" };
  }

  const details: string[] = [];
  let blockers = 0;
  let warnings = 0;

  for (const file of gateFiles) {
    const content = readFileSync(join(gatesDir, file), "utf-8");
    const config = parseYaml(content) as unknown as CustomGateConfig;
    const name = config.name || file.replace(/\.ya?ml$/, "");
    const severity = config.severity || "warn";

    let gatePassed = true;

    if (config.type === "grep" && config.pattern) {
      try {
        const matches = execSync(
          `grep -rn "${config.pattern}" --include="${config.files || "*"}" . 2>/dev/null | grep -v node_modules | grep -v .dc | wc -l`,
          { encoding: "utf-8", cwd: projectDir }
        ).trim();
        if (parseInt(matches) > 0) {
          gatePassed = false;
        }
      } catch {}
    }

    if (config.type === "script" && config.run) {
      try {
        execSync(config.run, { cwd: projectDir, timeout: 30_000, stdio: "pipe" });
      } catch {
        gatePassed = false;
      }
    }

    if (!gatePassed) {
      if (severity === "block") {
        blockers++;
        details.push(`❌ [BLOCK] ${name}: ${config.message || "Failed"}`);
      } else {
        warnings++;
        details.push(`⚠️ [WARN] ${name}: ${config.message || "Warning"}`);
      }
    } else {
      details.push(`✅ ${name}`);
    }
  }

  return {
    passed: blockers === 0,
    message: `Custom gates: ${gateFiles.length} checked, ${blockers} blocked, ${warnings} warnings`,
    details,
  };
}

/**
 * Quality Gate: Design Approval
 * Verifies UI design has been approved before implementation
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { GateResult } from "./spec-gate.js";

export function designGate(projectDir: string): GateResult {
  const approvalPath = join(projectDir, ".dc", "design", "approval.json");

  // No design file = warning only (design is optional)
  if (!existsSync(approvalPath)) {
    return {
      passed: true,
      message: "No UI design found — implementing without design spec",
      details: ["No .dc/design/approval.json — design phase was skipped"],
    };
  }

  try {
    const content = readFileSync(approvalPath, "utf-8");
    const approval = JSON.parse(content);

    const status = approval.status || "unknown";
    const link = approval.link || "no link";
    const screens = approval.screens_count || 0;

    switch (status) {
      case "approved":
        return {
          passed: true,
          message: `Design APPROVED (${screens} screens)`,
          details: [
            `Status: ${status}`,
            `Link: ${link}`,
            `Screens: ${screens}`,
            `Approved by: ${approval.approver || "unknown"}`,
            `Approved at: ${approval.approved_at || "unknown"}`,
          ],
        };

      case "rejected":
        return {
          passed: false,
          message: "Design REJECTED — cannot implement",
          details: [
            `Status: ${status}`,
            "The UI design was rejected. Review the specifications and generate a new design.",
            `Link: ${link}`,
          ],
        };

      case "changes_requested":
        return {
          passed: false,
          message: "Design has PENDING CHANGES — apply changes before implementing",
          details: [
            `Status: ${status}`,
            `Link: ${link}`,
            "Apply the requested changes and get approval before continuing.",
          ],
        };

      case "in_review":
        return {
          passed: false,
          message: "Design is IN REVIEW — waiting for approval",
          details: [
            `Status: ${status}`,
            `Link: ${link}`,
            "The design is being reviewed. Wait for approval before implementing.",
          ],
        };

      default:
        return {
          passed: false,
          message: `Design status unknown: ${status}`,
          details: [`Unexpected status in approval.json: ${status}`],
        };
    }
  } catch (e) {
    return {
      passed: true,
      message: "Could not read approval.json — skipping design gate",
      details: [`Error: ${e}`],
    };
  }
}

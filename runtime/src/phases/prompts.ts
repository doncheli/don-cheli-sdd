/**
 * Don Cheli Runtime — Phase Prompts
 * Each prompt is designed for a fresh-context agent
 */

import type { PhaseName } from "../utils/state.js";

const SIGNAL = "DC_PHASE_COMPLETE";

export function getCompletionSignal(): string {
  return SIGNAL;
}

export function getPhasePrompt(phase: PhaseName, task: string, context?: string): string {
  const base = `You are a Don Cheli SDD agent. Follow the 3 Iron Laws:
1. TDD: All production code requires tests (RED → GREEN → REFACTOR)
2. Debugging: Root cause first, then fix
3. Verification: Evidence before assertions

When you complete this phase, output exactly: ${SIGNAL}
`;

  const prompts: Record<PhaseName, string> = {
    specify: `${base}
PHASE: SPECIFY
TASK: ${task}
${context ? `CONTEXT:\n${context}\n` : ""}
YOUR JOB: Generate a Gherkin specification.

STEPS:
1. Read the codebase to understand existing architecture
2. Create .dc/specs/ directory if needed
3. Generate .feature file with:
   - At least 3 P1 scenarios (happy path + errors)
   - P2 scenarios for edge cases
   - Given/When/Then for each scenario
   - [NEEDS CLARIFICATION] for ambiguous requirements
4. Generate DBML schema in .dc/specs/ if persistence needed
5. Create/update .dc/config.yaml with project info

Write files directly. When done, output: ${SIGNAL}`,

    clarify: `${base}
PHASE: CLARIFY
TASK: Review and resolve ambiguities in specifications.
${context ? `CONTEXT:\n${context}\n` : ""}
YOUR JOB: QA the specifications.

STEPS:
1. Read ALL .dc/specs/*.feature files
2. Find: ambiguities, contradictions, missing edge cases
3. Resolve ALL [NEEDS CLARIFICATION] markers
4. Verify DBML schema matches Gherkin scenarios
5. Ensure each scenario has clear, testable criteria

Update .feature files directly. When done, output: ${SIGNAL}`,

    plan: `${base}
PHASE: PLAN (Technical Blueprint)
TASK: Create a technical plan from specifications.
${context ? `CONTEXT:\n${context}\n` : ""}
YOUR JOB: Generate the technical blueprint.

STEPS:
1. Read .dc/specs/*.feature and *.dbml
2. Create .dc/blueprints/ directory
3. Generate blueprint with:
   - Architecture decisions (layers, patterns, SOLID)
   - API contracts (endpoints, request/response schemas)
   - Data model (from DBML, relationships)
   - Security considerations (auth, validation, OWASP)
   - Technology choices with justification
4. Verify blueprint covers ALL P1 scenarios

Write blueprint to .dc/blueprints/. When done, output: ${SIGNAL}`,

    breakdown: `${base}
PHASE: BREAKDOWN (TDD Task Decomposition)
TASK: Break the blueprint into TDD tasks.
${context ? `CONTEXT:\n${context}\n` : ""}
YOUR JOB: Create executable TDD tasks.

STEPS:
1. Read .dc/blueprints/*.md
2. Create .dc/tareas/ directory
3. Generate tasks with:
   - Task IDs: T001, T002, T003...
   - [P] marker for tasks that can run in parallel
   - For each task: which TEST to write first, which FILE to create
   - Dependencies between tasks
   - 5 execution phases: setup → models → services → routes → integration
4. Each task must be completable in a single TDD cycle

Write tasks to .dc/tareas/. When done, output: ${SIGNAL}`,

    implement: `${base}
PHASE: IMPLEMENT (TDD Execution)
TASK: Implement ALL tasks using strict TDD.
${context ? `CONTEXT:\n${context}\n` : ""}
YOUR JOB: Write code following TDD strictly.

IRON LAW — NO EXCEPTIONS:
For EACH task in .dc/tareas/:
  1. RED:   Write the test FIRST. It MUST fail.
  2. GREEN: Write the MINIMUM code to make it pass.
  3. REFACTOR: Improve without changing behavior.

RULES:
- Run tests after each task
- NO stubs (// TODO, // FIXME) in production code
- Coverage must be >= 85% on new code
- Type hints/annotations required
- Follow the project's code style

Write code and tests directly. When ALL tasks are done, output: ${SIGNAL}`,

    review: `${base}
PHASE: REVIEW (7-Dimension Peer Review)
TASK: Review ALL implementation across 7 dimensions.
${context ? `CONTEXT:\n${context}\n` : ""}
YOUR JOB: Comprehensive code review.

REVIEW DIMENSIONS:
1. FUNCTIONAL: Does code match ALL Gherkin scenarios?
2. TESTS: TDD compliance, coverage >= 85%, no fragile tests
3. PERFORMANCE: N+1 queries, unnecessary loops, indexing
4. ARCHITECTURE: SOLID, separation of concerns, coupling
5. SECURITY: OWASP top 10, input validation, auth
6. MAINTAINABILITY: naming, complexity, documentation
7. DOCUMENTATION: README updates, inline comments where needed

STEPS:
1. Read ALL changed files
2. Compare against .dc/specs/*.feature
3. Write review to .dc/reviews/
4. FIX any critical issues directly (don't just report)
5. Generate summary with pass/fail per dimension

Write review to .dc/reviews/. When done, output: ${SIGNAL}`,
  };

  return prompts[phase];
}

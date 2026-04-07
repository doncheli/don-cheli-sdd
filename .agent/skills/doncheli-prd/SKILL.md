---
name: doncheli-prd
description: Generate professional Product Requirement Documents (PRD) from multiple sources — Figma designs, briefs, user research, existing code. Includes risk analysis, RICE prioritization, Gherkin stories and launch plan. Activate when user mentions "PRD", "product requirements", "requirement document", "product spec", "figma to PRD", "generate PRD".
---

# Don Cheli: PRD Generator

## Instructions

1. **Discover sources** — Identify all available inputs:
   - Figma links: analyze screens, flows, components, missing states
   - Brief documents: extract objectives, audience, problems
   - User research: identify personas, JTBD, pain points
   - Existing code: detect technical constraints
   - Conversation context: extract requirements mentioned by the user

2. **Analyze Figma** (if provided):
   - Count screens/frames and map navigation flow
   - Extract texts, labels, form fields, interactions
   - Detect missing UI states: loading, empty, error, success, offline
   - Identify gaps: flows not designed, edge cases missing
   - Convert each screen → user stories → acceptance criteria

3. **Risk analysis** — For each feature, evaluate 7 risk categories:
   - Technical (complexity, integrations, tech debt)
   - Product (market fit, adoption, competition)
   - UX (usability, accessibility, learning curve)
   - Business (revenue, cost, time-to-market)
   - Legal (GDPR, compliance, ToS)
   - Security (OWASP, sensitive data, auth)
   - Operational (support, scalability, monitoring)
   - Assign probability (Low/Medium/High) and impact (Low/Medium/High/Critical)
   - Propose mitigation for each risk

4. **Prioritize features** using MoSCoW + RICE:
   - MoSCoW: Must / Should / Could / Won't
   - RICE: (Reach × Impact × Confidence) / Effort
   - Rank features by RICE score

5. **Generate PRD** with 13 sections:
   1. Executive Summary
   2. Problem (context, pain points, evidence)
   3. Objectives & Success Metrics (KPIs, North Star)
   4. Target Audience (personas, JTBD, user journey)
   5. Proposed Solution (overview, main flow, features by priority)
   6. Detailed Requirements (functional with Gherkin, non-functional, integrations, data model)
   7. Design & UX (Figma analysis, UI states, responsive, accessibility)
   8. Risk Analysis (matrix, mitigations, dependencies)
   9. Scope (in scope, out of scope, future iterations)
   10. Timeline & Milestones
   11. Competitive Analysis
   12. Launch Plan (rollout, monitoring, rollback)
   13. Appendices (glossary, references, change history)

6. **Validate PRD quality**:
   - Every requirement must be verifiable/testable
   - Success metrics must be defined with baseline and target
   - Every risk must have a mitigation
   - Scope must be realistic for the timeline
   - Anti-scope (out of scope) must be explicit

## Output Format

```markdown
# PRD: [Product/Feature Name]

## Metadata
| Field | Value |
|-------|-------|
| Version | 1.0 |
| Author | [name] |
| Status | Draft / In Review / Approved |
| Date | [date] |

## 1. Executive Summary
...
(continue with all 13 sections)
```

Save output to:
- `.dc/prd/prd-v1.0.md` — Full PRD
- `.dc/prd/prd-risks.md` — Expanded risk matrix
- `.dc/prd/prd-figma-analysis.md` — Figma analysis (if applicable)

## Integration with SDD Pipeline

After generating the PRD, suggest:
```
/dc:specify    → Convert user stories into Gherkin specs
/dc:tech-plan  → Generate blueprint from the PRD
/dc:breakdown  → Create TDD tasks from the stories
```

## Templates

Select based on product type:
- `saas` — B2B platforms, dashboards, multi-tenant
- `mobile` — Native iOS/Android, PWA
- `ecommerce` — Online stores, marketplaces
- `api` — Public APIs, SDKs, developer platforms
- `internal` — Internal team tools
- `landing` — Landing pages, conversion funnels

## Quality Gate

- Never generate a PRD without at least 1 verifiable success metric
- Never omit the risk section — if no risks are visible, dig deeper
- Never leave scope ambiguous — mark unclear items as `[NEEDS CLARIFICATION]`
- Always include explicit anti-scope (what will NOT be built)
- Always generate user stories in Gherkin format for SDD integration
- Always version the PRD (v1.0, v1.1) with change history

## Do not use this skill when

- The task is a simple bug fix or hotfix — use `/dc:quick` instead
- The user only needs technical specs — use `/dc:specify` directly
- The requirement is already well-defined in Gherkin — skip PRD, go to plan

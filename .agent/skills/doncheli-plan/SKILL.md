---
name: doncheli-plan
description: Generate technical blueprint from Gherkin specs including API contracts, service design, database schema, and WebSocket events. Activate when user mentions "plan", "blueprint", "technical design", "architecture", "planificar".
---

# Don Cheli: Technical Planner

## Instructions
1. Read the Gherkin specs and DBML schemas
2. Define API contracts (REST endpoints with request/response schemas)
3. Design service layer (modules, repositories, services)
4. Define WebSocket events (if real-time features exist)
5. Map database schema from DBML to ORM
6. Check constitution adherence
7. Output as `blueprint.plan.md`

## Quality Gate
- Every Gherkin scenario must map to at least one API endpoint or service method
- All DBML tables must have corresponding ORM models in the plan

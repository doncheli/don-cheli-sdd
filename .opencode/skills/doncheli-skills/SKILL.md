---
name: doncheli-skills
description: Router to all 43 Don Cheli skills (habilidades). Activate when the user asks about any capability not covered by the specific doncheli-* skills, including: token optimization, code-rag, SOLID refactoring, living documentation, captures, stub detection, loop detection, Nyquist validation, session recovery, context engineering, DBML schemas, brainstorming, UI/UX design, worktrees, presentations, persona, obsidian integration, model routing, progressive rigor, auto-correction, cost projections, skill health, persistent memory, traceability, estimation models, reflection, subagent development, or any other framework capability.
---

# Don Cheli: Skills Router (43 Habilidades)

## Instructions

When a user request matches a Don Cheli capability not covered by the specific `@doncheli-*` skills, route to the appropriate habilidad file.

## How to use

1. Read `folder-map.json` to determine the skills directory name for the current locale
2. Look for the matching skill in the skills directory (e.g., `skills/token-optimization/SKILL.md` for English installs, `habilidades/optimizacion-tokens/HABILIDAD.md` for Spanish)
3. Read the HABILIDAD.md/SKILL.md file for the matched capability
4. Follow its instructions

## Available Skills (43)

### Architecture & Design
- `mapa-arquitectonico` / `architectural-map` — Visualize system architecture
- `esquemas-dbml` / `dbml-schemas` — Database schema modeling
- `ui-ux-design` — UI/UX design patterns and guidelines
- `refactorizacion-solid` / `solid-refactoring` — SOLID principles refactoring

### Quality & Validation
- `deteccion-stubs` / `stub-detection` — Detect silent stubs (// TODO, placeholder code)
- `deteccion-loops` / `loop-detection` — Detect infinite loops and circular dependencies
- `validacion-nyquist` / `nyquist-validation` — Spec completeness validation
- `salud-habilidades` / `skill-health` — Framework skill health check

### Token & Context Optimization
- `optimizacion-tokens` / `token-optimization` — Minimize token usage
- `contabilidad-tokens` / `token-accounting` — Track token consumption
- `optimizador-contexto` / `context-optimizer` — Optimize context window usage
- `ingenieria-contexto` / `context-engineering` — Advanced context management

### Code Generation & Analysis
- `code-rag` — Index reference repos and retrieve patterns
- `generador-specs` / `spec-generator` — Generate specifications
- `delta-specs` / `delta-specs` — Incremental spec updates
- `auto-correccion` / `auto-correction` — Self-correction patterns

### Documentation & Knowledge
- `documentacion-viva` / `living-documentation` — ADRs, auto-generated docs
- `devlog` — Development log management
- `memoria-persistente` / `persistent-memory` — Cross-session memory
- `trazabilidad` / `traceability` — Requirement traceability
- `recuperacion-sesion` / `session-recovery` — Recover from interrupted sessions

### Reasoning & Planning
- `razonamiento` / `reasoning` — Structured reasoning models
- `estimacion` / `estimation` — Effort estimation models
- `reflexion` / `reflection` — Post-task reflection for quality improvement
- `proyecciones-costo` / `cost-projections` — Cost projections and forecasts

### Integration & Extensibility
- `integracion-mcp` / `mcp-integration` — MCP server integration
- `extensiones-presets` / `preset-extensions` — Extension presets
- `routing-modelos` / `model-routing` — Model selection routing
- `rlm` — Reinforcement Learning from LLM Models
- `arnes-agente` / `agent-harness` — Agent harness configuration

### Operations
- `orquestacion-autonoma` / `autonomous-orchestration` — Autonomous task orchestration
- `cambio-carpeta` / `folder-change` — Multi-directory project management
- `brainstorming` — Idea generation sessions
- `prueba-trabajo` / `proof-of-work` — Verifiable work evidence
- `permisos-seguridad` / `security-permissions` — Permission management
- `obsidian` — Obsidian vault integration
- `presentaciones` / `presentations` — Generate interactive presentations
- `desarrollo-subagentes` / `subagent-development` — Subagent development patterns
- `persona` — Persona/role configuration
- `leyes-hierro` / `iron-laws` — Iron law enforcement
- `worktrees` — Git worktree management
- `rigor-progresivo` / `progressive-rigor` — Progressive rigor scaling

## Do not use this skill when
- A specific `@doncheli-*` skill already covers the request (use that instead)
- The user is asking a general question not related to Don Cheli capabilities

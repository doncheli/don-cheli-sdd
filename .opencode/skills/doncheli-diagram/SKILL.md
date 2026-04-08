---
name: doncheli-diagram
description: Auto-generate Mermaid or C4 diagrams from code analysis. Activate when user mentions "diagram", "mermaid", "architecture diagram", "C4", "class diagram", "sequence diagram", "ERD", "flowchart", "visualize code".
---

# Don Cheli: Diagram Generator

## Instructions

1. Determine the diagram type from the request or flag: class, sequence, architecture, erd, flowchart
2. Identify the scope: specific file, module, feature, or full project
3. Analyze the relevant source files:
   - **class**: parse class/interface definitions, inheritance, and composition
   - **sequence**: trace function calls, async flows, and inter-module communication
   - **architecture**: identify top-level modules, external services, and data flows (C4 Context/Container)
   - **erd**: parse ORM models, entity fields, and relationships
   - **flowchart**: follow conditional logic for a specific feature or endpoint
4. Build the Mermaid diagram — validate syntax mentally before outputting
5. Keep diagrams readable: maximum 20 nodes, split into subdiagrams if larger
6. Never invent relationships not present in the code
7. Add a generation timestamp as a Mermaid comment
8. Offer to embed the diagram in the target file (README, spec doc, ADR)

## Supported Outputs

- Inline Mermaid code blocks (default) — renders in GitHub, GitLab, Notion
- C4 PlantUML (with `--format c4`) for advanced architecture docs
- Save to file with `--output <path>`

## Quality Gate

- If the analyzed scope yields fewer than 3 nodes, warn the user the diagram may not be useful
- If source files are not readable (permissions, binary), skip and report which files were skipped
- Do not use this skill to generate diagrams from memory — always analyze actual source files

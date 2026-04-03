---
name: doncheli-explore
description: Explore and investigate the codebase before proposing changes, with interactive or assumptions mode. Activate when user mentions "explore codebase", "investigate code", "understand codebase", "explorar", "investigar codigo", "code investigation", "dependency analysis".
---

# /dc:explorar

## Instructions

Investigate the existing codebase before committing to a change. Understand architecture, patterns, conventions, and dependencies BEFORE modifying anything.

## Usage

```
/dc:explorar <area or concept to investigate>
/dc:explorar --profundidad <shallow|medium|deep>
/dc:explorar --modo supuestos                      # Assumptions mode
```

## Two Exploration Modes

### Interactive Mode (default)

The agent investigates and asks the user questions.

**Flow:** Scan > Ask > Document > Repeat (15-20 typical interactions)

### Assumptions Mode

The agent analyzes the codebase, forms **assumptions with evidence**, and the user only confirms or corrects.

**Flow:** Analyze > Present assumptions > User confirms/corrects (2-4 typical interactions)

**When to use each:**

| Situation | Recommended mode |
|-----------|-----------------|
| New project without code | Interactive |
| Existing codebase with >10 files | **Assumptions** |
| User knows the project well | **Assumptions** |
| Complex or unknown domain | Interactive |
| Want to finish quickly | **Assumptions** |

## Interactive Mode Workflow

1. **Scan** project structure (directories, key files)
2. **Identify** tech stack (package.json, requirements.txt, etc.)
3. **Map** existing patterns (naming, structure, imports)
4. **Detect** conventions (code style, test format)
5. **Document** findings in `.dc/hallazgos.md`

## Assumptions Mode Workflow

### Step 1: Silent Analysis

Analyze 5-15 relevant files **without asking anything**.

### Step 2: Present Assumptions

Each assumption includes **evidence** and **confidence level**:

- **HIGH** confidence: Consistent pattern in 3+ files
- **MEDIUM** confidence: Pattern in 1-2 files or with exceptions
- **LOW** confidence: Inference without direct evidence (discard or convert to open questions)

Only present assumptions with MEDIUM or HIGH confidence.

### Step 3: Confirm/Correct

User responds with "yes", "no", or "nuance: ..." for each assumption.

### Step 4: Generate Findings

Confirmed assumptions are documented in `.dc/hallazgos.md`.

## Output Format

```markdown
## Exploration: <Module Name>

### Detected Stack
- Framework, ORM, Auth, Tests

### Structure
<directory tree with file sizes>

### Conventions Found
- Patterns, naming, test organization

### Confirmed Assumptions (Assumptions Mode)
- S1, S2, S3... with pass/fail

### Notes
- Warnings, gaps, missing coverage
```

## Pipeline Integration

```
/dc:explorar > hallazgos.md
> /dc:proponer > change proposal
> /dc:especificar > .feature
> ... (normal pipeline)
```

---
name: doncheli-roundtable
description: Multi-perspective exploratory discussion with senior roles (CPO, Architect, UX, Business, QA, Security, DevOps). Activate when user mentions "roundtable", "mesa redonda", "multi-perspective", "senior discussion", "brainstorming group", "discussion panel", "debate abierto".
---

# /dc:mesa-redonda

## Instructions

Launch an exploratory multi-perspective discussion where senior roles share their vision on a topic. Unlike `/dc:debate` (which seeks adversarial tension), the roundtable aims to **explore options** and build on each other's ideas.

## Usage

```
/dc:mesa-redonda "<topic>"
/dc:mesa-redonda --roles "CPO,Architect,Business" "<topic>"
```

## Available Roles

| Role | Perspective | Focus |
|------|------------|-------|
| **CPO** | Product vision | Roadmap, prioritization, adoption metrics |
| **Architect** | System and scalability | Performance, maintainability, tech debt |
| **UX Lead** | User experience | Usability, accessibility, research, conversion |
| **Business** | Commercial viability | ROI, unit economics, competitive advantage |
| **QA Lead** | Quality and testing | Testability, edge cases, automation |
| **Security** | Protection and compliance | OWASP, regulations, sensitive data |
| **DevOps** | Operations | Observability, CI/CD, infrastructure costs |

Default roles: CPO, Architect, UX Lead, Business.

## Workflow

1. Receive the topic from the user
2. Select roles (default or user-specified)
3. Each role presents their perspective independently
4. Identify convergence points and divergences
5. Synthesize a consensus or list of options with trade-offs

## Output Format

```
=== Roundtable ===
Topic: <topic>

<Role Emoji> <Role Name>: <perspective paragraph>

<Role Emoji> <Role Name>: <perspective paragraph>

...

=== Consensus ===
<Summary of agreements, divergences, and recommended path forward>
```

## Difference from /dc:debate

| `/dc:debate` | `/dc:mesa-redonda` |
|---------------|-------------------|
| Adversarial tension | Exploratory collaboration |
| 2-3 opposing roles | 4-7 complementary roles |
| Seeks the best decision | Seeks understanding and options |
| Structured conflict resolution | Build on ideas |

## When to use

- Early-stage exploration before committing to a direction
- Complex topics that benefit from multiple viewpoints
- When you want options laid out, not a single answer
- Strategic decisions that cross technical and business domains

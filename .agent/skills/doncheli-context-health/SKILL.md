---
name: doncheli-context-health
description: Report the current state of the context window and recommend compression or cleanup actions. Activate when user mentions "context health", "context window", "how much context", "context full", "running out of context", "compress context".
---

# Don Cheli: Context Health Monitor

## Instructions

1. Estimate the current context window usage based on:
   - Files loaded in the current session
   - Conversation length (turns × average tokens)
   - Any large outputs already in context
2. Report usage as a percentage of the model's context limit
3. Apply thresholds from the global rules:
   - > 50K tokens in a result → recommend isolating in subagent
   - > 200K session tokens → recommend summarizing and compressing context
4. Identify the highest-cost items in the current context:
   - Large file reads
   - Repeated content
   - Verbose tool outputs that could be summarized
5. Recommend specific actions:
   - Which files can be evicted (already processed)
   - Which outputs should be summarized
   - Whether a subagent should handle the next task
6. If context is healthy (< 40% used), confirm and suggest no action
7. Never truncate or discard context without explicit user confirmation

## Output Format

```
## Context Health — 2026-03-28T16:00Z

### Usage Estimate
- Current session: ~85K tokens
- Model limit: 200K tokens
- Usage: 42% ✅ (healthy)

### Largest Items
1. src/payments/processor.ts full read — ~8K tokens (can evict — already analyzed)
2. Test run output from 14:32 — ~12K tokens (can summarize — report saved)
3. Conversation history — ~18K tokens (normal)

### Recommendations
- No immediate action required
- If you add 3+ more large files, consider /dc:destilar to compress session notes
- Next heavy task: use a subagent to isolate output

### Warning Threshold
Will warn again at 70% usage (~140K tokens)
```

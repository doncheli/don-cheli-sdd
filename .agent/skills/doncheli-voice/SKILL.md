---
name: doncheli-voice
description: Convert voice dictation into structured specs, review comments, or brainstorming notes. Activate when user mentions "voice", "dictate", "speak", "voice mode", "I'll dictate", "voice input".
---

# Don Cheli: Voice Mode Integration

## Instructions

1. Prompt the user to activate Claude Code Voice Mode if not already active
2. Accept transcribed voice input as raw text
3. Detect the intended mode from context or user flag:
   - `spec` — convert to Gherkin Feature/Scenario format
   - `review` — convert to numbered review comments with severity
   - `brainstorm` — organize ideas into grouped bullet points
4. Clean the transcription: remove filler words, fix punctuation, resolve run-on sentences
5. Structure the output according to the detected mode
6. Mark genuinely ambiguous segments with `[unclear: original text]` — do not invent content
7. Present the structured output and ask for confirmation before saving
8. On confirmation, save to the appropriate location:
   - spec → `.especdev/specs/<feature>.feature`
   - review → `.especdev/reviews/<date>-review.md`
   - brainstorm → `.especdev/notas/<date>-brainstorm.md`
9. Suggest relevant follow-up commands: `/dc:validar-spec`, `/dc:debate`, `/dc:clarificar`

## Quality Gate

- Never save without user confirmation
- If the transcription is shorter than 3 meaningful sentences, ask if the user wants to continue dictating
- Preserve technical terms exactly as dictated — do not paraphrase class names, endpoints, or identifiers

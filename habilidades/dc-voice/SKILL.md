---
name: dc-voice
description: Integrar con Claude Code Voice Mode para dictar specs y requirements por voz. Usa cuando el usuario dice "voice", "dictar", "dictate specs", "voice mode", "dictar requerimientos", "speech to text", "voice input", "hablar specs", "dictate", "voice integration". Configura Voice Mode para dictar specs y requirements sin typing.
i18n: true
---

## Objetivo
Capturar input de voz del usuario y convertirlo en specs estructuradas en formato Gherkin, notas de revisión o ideas de brainstorming. Reduce la fricción de escritura al permitir dictar en lenguaje natural y recibir output listo para el flujo SDD.
## Uso
```
/dc:voice spec
/dc:voice review
/dc:voice brainstorm
/dc:voice --lang en
```
## Comportamiento
1. **Detectar modo**: spec, review o brainstorm (default: spec)
2. **Indicar al usuario** que active Voice Mode en Claude Code (Ctrl+Shift+V o equivalente)
3. **Transcribir** el input de voz recibido
4. **Limpiar** muletillas, repeticiones y fragmentos incompletos
5. **Estructurar** según el modo seleccionado:
   - `spec` → Gherkin (Feature / Scenario / Given-When-Then)
   - `review` → lista de comentarios numerados con severidad [blocker|suggestion|nitpick]
   - `brainstorm` → ideas en bullets organizados por tema
6. **Confirmar** con el usuario antes de guardar en `.dc/`
#### Modos
| Modo | Input esperado | Output |
|------|---------------|--------|
| `spec` | Descripción funcional en lenguaje natural | Feature file `.feature` o bloque Gherkin |
| `review` | Comentarios sobre código o spec | Lista de revisión estructurada |
| `brainstorm` | Ideas libres, lluvia de ideas | Bullets agrupados por tema |
#### Reglas de Transcripción
- Preservar la intención, no las palabras exactas
- Inferir el idioma configurado en `.dc/config.yaml`
- Marcar con `[inaudible]` segmentos no interpretables
- No inventar detalles que no se dictaron — preguntar si hay ambigüedad
## Output
```gherkin
## Generado por /dc:voice — 2026-03-28
Feature: <nombre inferido del dictado>
  Scenario: <escenario 1>
    Given <precondición>
    When <acción>
    Then <resultado esperado>
  # [inaudible en 0:42 — revisar]
```
> Para brainstorm y review, el output es Markdown en `/tmp/voice-capture-<timestamp>.md` con opción de mover a `.dc/`.

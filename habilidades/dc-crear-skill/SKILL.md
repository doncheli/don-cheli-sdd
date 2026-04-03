---
name: dc-crear-skill
description: Crear, probar y mejorar skills de forma iterativa. Usa cuando el usuario dice "crear skill", "crear habilidad", "build skill", "create a skill", "skill development", "desarrollar skill", "nueva habilidad". Usa el workflow: draft → test → review → improve → repeat con evaluación cuantitativa y qualitative review.
i18n: true
---

## Objetivo
Meta-skill que permite crear nuevas habilidades para Don Cheli de forma iterativa. Genera el SKILL.md, lo prueba con un prompt de test, evalúa el resultado, y propone mejoras — repitiendo el ciclo hasta lograr calidad óptima.
Compatible con el formato oficial de Anthropic Skills y con el formato HABILIDAD.md de Don Cheli.
## Uso
```
/dc:crear-skill "Generador de reportes semanales del equipo"
/dc:crear-skill --desde-patron           # Detectar tarea repetitiva y convertirla en skill
/dc:crear-skill --formato anthropic       # Generar solo SKILL.md (formato Anthropic)
/dc:crear-skill --formato doncheli        # Generar HABILIDAD.md (formato Don Cheli, default)
/dc:crear-skill --formato dual            # Generar ambos formatos
```
## Proceso (5 fases iterativas)
#### Fase 1: Descubrimiento (1 min)
Preguntar al usuario:
1. **¿Qué tarea quieres automatizar?** — Descripción en lenguaje natural
2. **¿Con qué frecuencia la haces?** — Diaria, semanal, por PR, etc.
3. **¿Qué inputs necesita?** — Archivos, datos, contexto
4. **¿Qué output esperas?** — Formato, estructura, destino
5. **¿Qué grado de libertad tiene?** — Alto (texto libre), medio (pseudocódigo), bajo (script exacto)
#### Fase 2: Generación del Draft (2 min)
Generar automáticamente:
- Metadata YAML (name, description) — **optimizada para matching** (esto es lo más importante)
- Instrucciones paso a paso en el body
- Ejemplos concretos con inputs/outputs reales
- Referencias a archivos adicionales si > 500 líneas
**Principio clave:** Solo incluir lo que Claude NO sabe. Omitir conocimiento general, lenguajes, librerías comunes. Enfocarse en reglas específicas del proyecto/empresa.
#### Fase 3: Test con Prompt Real (1 min)
- Ejecutar la skill con un prompt de prueba proporcionado por el usuario
- Capturar el output completo
- Medir: tokens consumidos, tiempo de ejecución, calidad del resultado
#### Fase 4: Evaluación (1 min)
Evaluar contra criterios:
| Criterio | Peso | Cómo se mide |
|----------|------|-------------|
| Accuracy | 40% | ¿El output es correcto y completo? |
| Token efficiency | 20% | ¿Cuántos tokens consumió? ¿Hay contenido innecesario? |
| Consistency | 20% | ¿Produce resultados consistentes con diferentes inputs? |
| Metadata match | 20% | ¿Se activa con los prompts correctos? ¿Falsos positivos? |
#### Fase 5: Iteración (repetir hasta satisfactorio)
- Proponer mejoras específicas al SKILL.md
- Aplicar cambios
- Re-testear
- **Máximo 3 iteraciones** — si no converge, pedir feedback del usuario
## Formato de Salida — SKILL.md (Anthropic Compatible)
```yaml
name: Weekly Team Report Generator
description: Generates a structured weekly team report from standup notes and PR activity. Activate when user mentions "weekly report", "team update", or "sprint summary".
```
```markdown
## Weekly Team Report Generator
## Instructions
1. Gather standup notes from the current week
2. Pull PR merge activity from git log
3. Structure the report in three sections:
   - Accomplishments (from merged PRs + standup highlights)
   - Blockers (from standup blockers + open issues)
   - Next Week (from upcoming sprint items)
4. Apply the team's formatting template
## Examples
#### Input
"Generate this week's team report"
#### Output
[Structured report following the template]
## References
- See `templates/weekly-report.md` for the formatting template
- See `reference.md` for the team's style guide
```
## Formato de Salida — HABILIDAD.md (Don Cheli)
```yaml
nombre: Generador de Reportes Semanales
descripcion: Genera reportes semanales del equipo desde notas de standup y actividad de PRs
version: 1.0.0
autor: [usuario]
tags: [reportes, equipo, productividad]
activacion: "reporte semanal", "actualización del equipo", "resumen de sprint"
grado_libertad: medio
```
## Best Practices (del post de Anthropic)
#### Progressive Disclosure
La skill usa 3 capas de información:
1. **Metadata (YAML)** — Siempre cargada al inicio (pocos tokens). Define CUÁNDO activar.
2. **Body (Markdown)** — Cargada bajo demanda cuando se activa. Define QUÉ hacer.
3. **File References** — Cargadas solo si se necesitan. Detalles adicionales.
#### Límite de 500 líneas
Si el SKILL.md supera 500 líneas, separar material de referencia:
```
.claude/skills/
  mi-skill/
    SKILL.md          ← Instrucciones principales (< 500 líneas)
    templates/        ← Archivos de plantilla
    reference.md      ← Material de referencia detallado
```
#### Solo incluir lo que Claude no sabe
- ❌ No explicar cómo funciona JavaScript/Python/etc.
- ❌ No incluir documentación de librerías comunes
- ✅ Incluir reglas específicas de la empresa
- ✅ Incluir formatos y templates propios
- ✅ Incluir quirks de herramientas internas
- ✅ Incluir workflow steps específicos del equipo
#### Grado de libertad
| Grado | Cuándo | Formato de instrucciones |
|-------|--------|-------------------------|
| **Alto** | Tareas creativas (redacción, diseño) | Texto libre con guidelines |
| **Medio** | Workflows con variaciones | Pseudocódigo con parámetros |
| **Bajo** | Procesos críticos sin margen de error | Scripts exactos, pocos parámetros |
## Integración
- Las skills creadas se guardan en `.claude/skills/` (formato Anthropic) o en `habilidades/` (formato Don Cheli)
- Compatible con el marketplace oficial de Anthropic: `https://github.com/anthropics/skills`
- Se pueden compartir vía `/dc:archivar` o exportar como ZIP

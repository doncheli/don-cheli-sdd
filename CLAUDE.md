# Don Cheli — Instrucciones para Claude Code

## Identidad

Eres un asistente de desarrollo que opera bajo el framework Don Cheli (Desarrollo Dirigido por Especificaciones). Todo tu trabajo sigue las 7 fases del ciclo de vida y las leyes de hierro del framework.

## Archivos de Contexto

Al iniciar, lee estos archivos en orden:
1. `.especdev/config.yaml` — Configuración del proyecto
2. `.especdev/estado.md` — Estado actual
3. `.especdev/plan.md` — Plan y fases
4. `.especdev/hallazgos.md` — Descubrimientos
5. `.especdev/progreso.md` — Log de sesión

Si el repo tiene un `docs/index.md`, consultarlo como mapa de navegación.

## Leyes de Hierro (No Negociable)

1. **TDD:** Todo código de producción requiere tests
2. **Debugging:** Primero la causa raíz, luego la corrección
3. **Verificación:** Evidencia antes de afirmaciones

## Reglas de Desviación

- Regla 1-3: Auto-corregir (bugs, faltantes, bloqueadores)
- Regla 4: PARAR y preguntar (cambios arquitectónicos)
- Regla 5: Registrar y continuar (mejoras)

## Reglas de Trabajo Globales

Lee `reglas/reglas-trabajo-globales.md` para reglas de:
- Idioma (código en inglés, commits/docs en español)
- Branches (`feature/`, `fix/`, `hotfix/`)
- Commits (`<type>: <descripción>`)
- PRs (un cambio lógico, coverage ≥85%)
- Documentación obligatoria por tipo de PR
- Verificaciones de calidad (lint, tests, build)
- Límites de autonomía (>10 archivos → confirmar)

## Selección de Modelos (Optimización de Tokens)

| Tarea | Modelo |
|-------|--------|
| Q&A, formateo, scripting, batch | `haiku` |
| Código, tests, code review | `sonnet` |
| Arquitectura, seguridad, razonamiento complejo | `opus` |

**Default: Haiku.** Subir solo si la calidad es insuficiente.
**Nunca usar Opus sin confirmación del usuario.**
Subtareas independientes → subagentes en paralelo.

Lee `habilidades/optimizacion-tokens/HABILIDAD.md` para la guía completa.

## Comandos Disponibles

- `/especdev:*` — Comandos del framework (iniciar, comenzar, estimar, presentar, etc.)
- `/especdev:analizar-sesiones` — Analizar patrones de uso y generar recomendaciones
- `/especdev:destilar` — Extraer specs compactas desde código existente (Blueprint Distillation)
- `/especdev:minar-referencias` — Buscar repos open-source relevantes como referencia
- `/especdev:contrato-ui` — Bloquear estándares visuales antes de codear frontend
- `/especdev:poc` — Prueba de Concepto con timebox y veredicto (reglas relajadas)
- `/especdev:contrato-api` — Diseñar contratos de API, webhooks e integraciones
- `/especdev:auditar-seguridad` — Auditoría de seguridad estática (OWASP Top 10)
- `/especdev:migrar` — Migración entre stacks tecnológicos o versiones mayores
- `/especdev:actualizar` — Detectar y aplicar actualizaciones del framework
- `/razonar:*` — 12 modelos de razonamiento + 3 modelos RLM (PrimeIntellect)
- `/bucle` — Bucle autónomo
- `/historias-generar` — Generar prd.json

## Gestión de Contexto

- Leer archivos **bajo demanda**, no preventivamente.
- No re-leer lo que ya está en contexto — referenciar.
- Si un resultado supera ~10K tokens → aislarlo en subagente.
- System prompts < 500 tokens.
- Outputs estructurados desde el inicio (JSON, tablas).

## Idioma (i18n)

El framework soporta 3 idiomas: **español (es)**, **English (en)**, **Português (pt)**.

**Detección de idioma (en orden):**
1. Leer `${FRAMEWORK_HOME}/locale` (archivo de 2 letras: `es`, `en` o `pt`)
2. Leer `.especdev/config.yaml` → `framework.idioma`
3. Default: `es`

**Regla:** Toda comunicación, documentación, commits y output del framework debe ser en el idioma configurado. Código (variables, funciones) **siempre en inglés**.

Lee `reglas/i18n.md` para la guía completa de internacionalización.

# Don Cheli — Instrucciones para Claude Code

## Identidad

Eres un asistente de desarrollo que opera bajo el framework Don Cheli (Desarrollo Dirigido por Especificaciones). Todo tu trabajo sigue las 7 fases del ciclo de vida y las leyes de hierro del framework.

## Archivos de Contexto

Al iniciar, lee estos archivos en orden:
1. `.dc/config.yaml` — Configuración del proyecto
2. `.dc/estado.md` — Estado actual
3. `.dc/plan.md` — Plan y fases
4. `.dc/hallazgos.md` — Descubrimientos
5. `.dc/progreso.md` — Log de sesión

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

**Prefijo corto:** `/dc:*` (alias de `/dc:*` — ambos funcionan)

- `/dc:*` o `/dc:*` — Comandos del framework (iniciar, comenzar, estimar, presentar, etc.)
- `/dc:planning` — Planning semanal de equipo con RFCs, priorización WSJF y asignación
- `/dc:mesa-tecnica` — Mesa de expertos senior de desarrollo
- `/dc:analizar-sesiones` — Analizar patrones de uso y generar recomendaciones
- `/dc:destilar` — Extraer specs compactas desde código existente (Blueprint Distillation)
- `/dc:minar-referencias` — Buscar repos open-source relevantes como referencia
- `/dc:contrato-ui` — Bloquear estándares visuales antes de codear frontend
- `/dc:poc` — Prueba de Concepto con timebox y veredicto (reglas relajadas)
- `/dc:contrato-api` — Diseñar contratos de API, webhooks e integraciones
- `/dc:auditar-seguridad` — Auditoría de seguridad estática (OWASP Top 10)
- `/dc:migrar` — Migración entre stacks tecnológicos o versiones mayores
- `/dc:actualizar` — Detectar y aplicar actualizaciones del framework
- `/razonar:*` — 12 modelos de razonamiento + 3 modelos RLM (PrimeIntellect)
- `/bucle` — Bucle autónomo
- `/historias-generar` — Generar prd.json

## Verificación de Actualizaciones (Auto-check)

Al inicio de la **primera interacción** de cada sesión, verificar silenciosamente si hay actualizaciones disponibles:

1. Leer `${FRAMEWORK_HOME}/VERSION` para obtener la versión instalada
2. Obtener la versión remota: `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. Si la versión remota es mayor, notificar al usuario con un mensaje breve:

**Formato de notificación (según idioma configurado):**

- **es:** `⬆️ Don Cheli v{remota} disponible (instalada: v{local}). Ejecuta /dc:actualizar para actualizar.`
- **en:** `⬆️ Don Cheli v{remote} available (installed: v{local}). Run /dc:update to upgrade.`
- **pt:** `⬆️ Don Cheli v{remota} disponível (instalada: v{local}). Execute /dc:atualizar para atualizar.`

**Reglas:**
- Solo notificar **una vez por sesión** (no repetir en cada mensaje)
- Si no hay conexión o falla el curl, continuar sin notificar (no bloquear)
- Si las versiones son iguales, no mostrar nada
- Usar el nombre del comando en el idioma configurado (`/dc:actualizar`, `/dc:update`, `/dc:atualizar`)

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
2. Leer `.dc/config.yaml` → `framework.idioma`
3. Default: `es`

**Regla:** Toda comunicación, documentación, commits y output del framework debe ser en el idioma configurado. Código (variables, funciones) **siempre en inglés**.

Lee `reglas/i18n.md` para la guía completa de internacionalización.

# Don Cheli — Instrucciones para Claude Code

## Identidad
Asistente de desarrollo bajo el framework Don Cheli (Desarrollo Dirigido por Especificaciones). 7 fases del ciclo de vida + leyes de hierro.

## Archivos de Contexto
Cuando el usuario inicie una tarea, leer según necesidad:
- `.dc/config.yaml` — Configuración
- `.dc/estado.md` — Estado actual
- `.dc/plan.md` — Plan y fases

## Leyes de Hierro (No Negociable)
1. **TDD:** Todo código de producción requiere tests
2. **Debugging:** Primero la causa raíz, luego la corrección
3. **Verificación:** Evidencia antes de afirmaciones

## Reglas de Desviación
- Regla 1-3: Auto-corregir (bugs, faltantes, bloqueadores)
- Regla 4: PARAR y preguntar (cambios arquitectónicos)
- Regla 5: Registrar y continuar (mejoras)

## Reglas detalladas
Lee bajo demanda:
- `reglas/reglas-trabajo-globales.md` — idioma, branches, commits, PRs, coverage, autonomía
- `reglas/i18n.md` — internacionalización (es/en/pt)
- `habilidades/optimizacion-tokens/HABILIDAD.md` — gestión de contexto

## Comandos
- `/dc:*` — Prefijo principal (72+ comandos)
- `/dc:*` — Alias retrocompatible
- `/razonar:*` — 15 modelos de razonamiento

## Auto-actualización al inicio de sesión
Al inicio de la **primera interacción** de cada sesión:
1. Leer `${FRAMEWORK_HOME}/VERSION` para obtener la versión local
2. Ejecutar `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION` para obtener la versión remota
3. Si versiones iguales o falla el curl → silencio, no mostrar nada
4. Si hay versión mayor → **notificar** al usuario (NO auto-aplicar):

**Formato de notificación (según idioma configurado):**
- **es:** `⬆️ Don Cheli v{remota} disponible (instalada: v{local}). Ejecuta /dc:actualizar para actualizar.`
- **en:** `⬆️ Don Cheli v{remote} available (installed: v{local}). Run /dc:update to upgrade.`
- **pt:** `⬆️ Don Cheli v{remota} disponível (instalada: v{local}). Execute /dc:atualizar para atualizar.`

**Alternativa rápida vía terminal:**
- `don-cheli update` (si instaló via npm)
- `bash scripts/actualizar.sh` (si instaló via git clone)

**Reglas:**
- Solo notificar **una vez por sesión** (no repetir en cada mensaje)
- Si no hay conexión o falla el curl → continuar sin notificar (no bloquear)
- **Nunca** auto-aplicar actualizaciones sin confirmación del usuario
5. El proceso NO debe bloquear la interacción del usuario

## Idioma (i18n)
Detección: `${FRAMEWORK_HOME}/locale` → `.dc/config.yaml` → default `es`
Código siempre en inglés. Comunicación en el idioma configurado.

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
Al inicio de la **primera interacción** de cada sesión, ejecutar automáticamente:

### Paso 1: Actualizar framework
1. Leer `${FRAMEWORK_HOME}/VERSION` para obtener la versión local
2. Ejecutar `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. Si versiones iguales o falla el curl → silencio
4. Si hay versión mayor → **auto-actualizar en background**:
   a. Clonar versión nueva en directorio temporal
   b. Ejecutar auditoría de seguridad sobre los scripts cambiados:
      - Buscar secretos hardcoded, inyección de comandos, URLs sospechosas
      - Verificar que scripts no ejecuten código arbitrario
   c. Ejecutar validación de estructura: `bash scripts/validar.sh`
   d. Si auditoría tiene hallazgos 🔴 Críticos → **DETENER**, notificar:
      `🛑 Actualización v{remota} bloqueada por hallazgos de seguridad. Revisar con /dc:auditar-seguridad`
   e. Si pasa auditoría y estructura → aplicar: `bash scripts/actualizar.sh --forzar`
   f. Notificar: `✅ Don Cheli auto-actualizado: v{local} → v{remota} (seguridad: ✅ | estructura: ✅)`

### Paso 2: Actualizar skills de terceros (semanal)
1. Ejecutar `bash scripts/skill-updater.sh --quiet`
2. El script tiene throttle de 7 días — solo verifica una vez por semana
3. Si hay updates de Anthropic Skills → aplicar automáticamente
4. Si hay updates de comunidad → solo notificar (no auto-aplicar)
5. Notificar si hubo cambios: `✅ Skills actualizadas: {N} de Anthropic`

### Reglas
- **Una vez por sesión** — no repetir checks en cada mensaje
- Si no hay conexión → silencio, no bloquear la interacción
- El proceso NO debe bloquear la interacción del usuario
- Siempre ejecutar checks de seguridad y estructura antes de aplicar
- Si la auditoría falla → DETENER y notificar, nunca aplicar cambios inseguros

## Idioma (i18n)
Detección: `${FRAMEWORK_HOME}/locale` → `.dc/config.yaml` → default `es`
Código siempre en inglés. Comunicación en el idioma configurado.

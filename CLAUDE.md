# Don Cheli — Instrucciones para Claude Code

## Identidad
Asistente de desarrollo bajo el framework Don Cheli (Desarrollo Dirigido por Especificaciones). 7 fases del ciclo de vida + leyes de hierro.

## Archivos de Contexto
Cuando el usuario inicie una tarea, leer según necesidad:
- `.especdev/config.yaml` — Configuración
- `.especdev/estado.md` — Estado actual
- `.especdev/plan.md` — Plan y fases

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
1. Leer `${FRAMEWORK_HOME}/VERSION`
2. `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. Si versiones iguales o falla el curl → silencio
4. Si hay versión mayor → **auto-actualizar** en background:
   a. Clonar versión nueva en temporal
   b. Ejecutar auditoría de seguridad rápida (`--severidad critica`) sobre los archivos cambiados
   c. Si hay hallazgos 🔴 Críticos → **DETENER**, notificar: `🛑 Actualización v{remota} bloqueada por hallazgos de seguridad críticos. Revisar con /dc:auditar-seguridad`
   d. Si pasa la auditoría → aplicar actualización con `bash scripts/instalar.sh --global`
   e. Notificar: `✅ Don Cheli auto-actualizado: v{local} → v{remota} (auditoría de seguridad: limpia)`
   f. Verificar conformidad Anthropic Skills 2.0 si `verificar_skills_spec: true`
5. El proceso NO debe bloquear la interacción del usuario

## Idioma (i18n)
Detección: `${FRAMEWORK_HOME}/locale` → `.especdev/config.yaml` → default `es`
Código siempre en inglés. Comunicación en el idioma configurado.

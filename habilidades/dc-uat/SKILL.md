---
name: dc-uat
description: Generar scripts de User Acceptance Testing (UAT) para validación humana. Usa cuando el usuario dice "UAT", "user acceptance testing", "pruebas de aceptación", "acceptance tests", "UAT scripts", "validación usuario", "QA testing", "sprint review", "acceptance criteria", "validar con usuario". Genera scripts ejecutables con steps, datos de prueba y expected results.
i18n: true
---

## Objetivo
Generar automáticamente un script de pruebas de aceptación (UAT) ejecutable por un humano después de completar un slice o feature. El script describe paso a paso qué verificar, qué resultado esperar, y cómo reportar fallos.
## Uso
```
/dc:uat                           # Genera UAT para el slice actual
/dc:uat @specs/features/auth/     # Genera UAT para un dominio específico
/dc:uat --formato checklist       # Solo checklist sin narrativa
```
## Comportamiento
1. **Leer** las specs Gherkin del slice/feature
2. **Extraer** los escenarios P1 y P2
3. **Generar** pasos de prueba ejecutables por un humano
4. **Incluir** datos de prueba concretos (no genéricos)
5. **Guardar** en `.dc/uat/<feature>.uat.md`
## Output
```markdown
## UAT: Notificaciones Push
**Feature:** notificaciones/NotificacionesPush
**Generado:** 2026-03-22
**Tiempo estimado:** 15 minutos
## Pre-requisitos
- [ ] App instalada en dispositivo físico (no simulador)
- [ ] Permisos de notificación otorgados
- [ ] Liga "La Liga" marcada como favorita
- [ ] Al menos un partido de La Liga en vivo o programado hoy
## Pruebas
#### UAT-001: Recibir notificación de gol ⭐ P1
**Pasos:**
1. Abrir la app y verificar que muestra partidos en vivo
2. Minimizar la app (dejar en background)
3. Esperar a que ocurra un gol en un partido de La Liga
   - *Alternativa: usar endpoint de test `POST /api/test/simulate-goal`*
**Resultado esperado:**
- [ ] Notificación push recibida en < 10 segundos
- [ ] Título contiene "⚽ ¡GOL!" + marcador actualizado
- [ ] Cuerpo contiene nombre del goleador y minuto
- [ ] Al tocar la notificación, abre el detalle del partido
**Si falla:** Reportar captura de pantalla + modelo de dispositivo + versión OS
#### UAT-002: Sin permisos no llegan notificaciones ⭐ P1
**Pasos:**
1. Revocar permisos de notificación en Ajustes del dispositivo
2. Abrir la app
3. Esperar evento de gol
**Resultado esperado:**
- [ ] NO llega notificación push
- [ ] Al abrir la app, el evento es visible en el timeline del partido
## Resumen
| ID | Descripción | Resultado | Notas |
|----|-------------|-----------|-------|
| UAT-001 | Notificación de gol | ⬜ | |
| UAT-002 | Sin permisos | ⬜ | |
**Firma del tester:** _______________
**Fecha:** _______________
```
## Integración
- Se genera automáticamente al completar `/dc:implementar` para cada feature
- Se incluye en la descripción del PR como evidencia de testing manual
- Se archiva con `/dc:archivar`

---
name: dc-webhook
description: Configurar triggers externos (GitHub, Slack, Linear, PagerDuty) para automatizar comandos Don Cheli. Usa cuando el usuario dice "webhook", "triggers", "GitHub webhook", "Slack integration", "automation", "automate Don Cheli", "trigger automation", "CI/CD webhook", "external triggers", "webhook config". Configura webhooks para que eventos externos invoquen comandos Don Cheli automáticamente.
i18n: true
---

## Objetivo
Integrar Don Cheli con sistemas externos a través de webhooks y eventos. Configurar reacciones automáticas: al abrir un PR en GitHub ejecutar `/dc:revisar`, al crear un issue en Linear ejecutar `/dc:comenzar`, al recibir alerta en PagerDuty ejecutar diagnóstico. La configuración se almacena en `.dc/webhooks.yaml`.
## Uso
```
/dc:webhook --listar                          # Ver todos los webhooks configurados
/dc:webhook --agregar github:pr_opened        # Configurar nuevo evento
/dc:webhook --eliminar wh-003                 # Eliminar configuración por ID
/dc:webhook --probar wh-001                   # Enviar evento de prueba
/dc:webhook --log                             # Ver log de eventos recibidos
/dc:webhook --estado                          # Dashboard de salud de webhooks
/dc:webhook --exportar                        # Exportar config para compartir con equipo
```
## Fuentes de Eventos Soportadas
| Fuente | Eventos Disponibles |
|--------|---------------------|
| **GitHub** | `pr_opened`, `pr_merged`, `pr_review_requested`, `push`, `issue_created`, `issue_closed`, `ci_failed` |
| **Slack** | `slash_command`, `mention`, `reaction_added`, `message_in_channel` |
| **Linear** | `issue_created`, `issue_updated`, `issue_assigned`, `cycle_started` |
| **PagerDuty** | `incident_triggered`, `incident_resolved`, `alert_fired` |
| **HTTP custom** | `POST /webhook/<id>` — payload arbitrario |
## Comportamiento
1. **Cargar configuración** desde `.dc/webhooks.yaml`
2. **Para `--agregar`**:
   - Solicitar fuente, evento, filtros opcionales y comando a ejecutar
   - Generar ID único (`wh-XXX`)
   - Generar URL del endpoint si aplica
   - Mostrar instrucciones de configuración en la fuente externa
   - Guardar en `.dc/webhooks.yaml`
3. **Para `--probar`**:
   - Enviar payload de prueba al handler del webhook
   - Ejecutar comando configurado en modo dry-run
   - Reportar resultado y tiempo de ejecución
4. **Para `--log`**:
   - Leer `.dc/webhook-log.jsonl`
   - Mostrar últimos 50 eventos con estado (procesado/fallido/ignorado)
5. **Para `--estado`**:
   - Verificar conectividad con cada fuente
   - Mostrar estadísticas: eventos recibidos, tasa de éxito, último evento
## Configuración
```yaml
## .dc/webhooks.yaml
version: "1.0"
servidor:
  puerto: 9876
  url_base: https://mi-proyecto.ngrok.io  # o localhost para desarrollo
webhooks:
  - id: wh-001
    nombre: PR Review Automático
    fuente: github
    evento: pr_opened
    filtros:
      rama_destino: main
      etiquetas_excluir: [wip, draft]
    comando: /dc:revisar
    args: "--foco seguridad,performance"
    activo: true
  - id: wh-002
    nombre: Inicio de Historia desde Linear
    fuente: linear
    evento: issue_assigned
    filtros:
      asignado_a: mi-usuario@empresa.com
      estado: "In Progress"
    comando: /dc:comenzar
    args: "--historia {{issue.identifier}}"
    activo: true
  - id: wh-003
    nombre: Diagnóstico en Incidente PagerDuty
    fuente: pagerduty
    evento: incident_triggered
    filtros:
      severidad: [P1, P2]
      servicio: mi-api-produccion
    comando: /dc:diagnostico
    args: "--urgente --servicio {{incident.service}}"
    activo: true
  - id: wh-004
    nombre: Deploy Check en Push a Main
    fuente: github
    evento: push
    filtros:
      rama: main
    comando: /dc:auditar
    args: "--rapido"
    activo: false  # deshabilitado temporalmente
```
## Output
#### Vista de `--listar`
```markdown
## Webhooks Configurados — mi-proyecto
| ID | Nombre | Fuente | Evento | Comando | Estado |
|----|--------|--------|--------|---------|--------|
| wh-001 | PR Review Automático | GitHub | pr_opened → main | /dc:revisar | ✅ Activo |
| wh-002 | Inicio desde Linear | Linear | issue_assigned | /dc:comenzar | ✅ Activo |
| wh-003 | Diagnóstico PagerDuty | PagerDuty | incident_triggered P1/P2 | /dc:diagnostico | ✅ Activo |
| wh-004 | Deploy Check | GitHub | push → main | /dc:auditar | ⏸️ Inactivo |
**Servidor:** localhost:9876 (desarrollo)
**Eventos procesados hoy:** 12 | **Tasa de éxito:** 100%
```
#### Vista de `--log`
```markdown
## Log de Eventos — Últimas 24h
| Timestamp | Fuente | Evento | Payload | Comando | Estado | Duración |
|-----------|--------|--------|---------|---------|--------|----------|
| 14:32:01 | GitHub | pr_opened #142 | feat/nuevo-checkout | /dc:revisar | ✅ OK | 45s |
| 11:15:22 | Linear | issue_assigned ENG-234 | Auth bug P1 | /dc:comenzar | ✅ OK | 8s |
| 09:44:10 | PagerDuty | incident_triggered | API latency P2 | /dc:diagnostico | ✅ OK | 120s |
| 08:30:00 | GitHub | pr_opened #141 | [wip] experimento | /dc:revisar | ⏭️ Ignorado (filtro: etiqueta wip) | — |
```
#### Vista de `--agregar` (interactiva)
```markdown
## Configurar Nuevo Webhook
Fuente: GitHub
Evento: ci_failed
Filtros opcionales:
  - Rama: main
  - Workflow: test
Comando a ejecutar: /dc:diagnostico
Args: --contexto ci --urgente
ID asignado: wh-005
URL generada: https://mi-proyecto.ngrok.io/webhook/wh-005
#### Configurar en GitHub:
1. Ir a Settings → Webhooks → Add webhook
2. Payload URL: https://mi-proyecto.ngrok.io/webhook/wh-005
3. Content type: application/json
4. Events: Workflow runs (ci_failed)
5. Clave secreta: ••••••••  (guardada en .dc/secrets)
✅ Webhook wh-005 guardado en .dc/webhooks.yaml
```
## Almacenamiento
```
.dc/
├── webhooks.yaml              # Configuración (en git)
├── webhook-log.jsonl          # Log de eventos (en .gitignore)
└── secrets/
    └── webhook-secrets.env    # Claves de validación (en .gitignore)
```
## Seguridad
- Las claves de validación (HMAC secrets) se almacenan en `.dc/secrets/` — nunca en `webhooks.yaml`
- Cada evento entrante se valida con HMAC-SHA256 antes de procesarse
- Los payloads se sanitizan antes de interpolarse en argumentos de comandos
## Integración con Don Cheli
```
GitHub pr_opened  → /dc:revisar  → comentario en PR
Linear issue_assigned → /dc:comenzar → sesión de desarrollo iniciada
PagerDuty incident → /dc:diagnostico → root cause report
CI failed → /dc:diagnostico → contexto: error de integración
```
## Modelo Recomendado
| Paso | Modelo | Razón |
|------|--------|-------|
| Procesamiento de eventos | Haiku | Ruteo simple |
| Ejecución del comando destino | Según comando | Hereda modelo del comando |
| Generación de config YAML | Haiku | Formateo estructurado |

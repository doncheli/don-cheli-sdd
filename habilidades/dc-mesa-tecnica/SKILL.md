---
name: dc-mesa-tecnica
description: Mesa técnica de expertos senior de desarrollo para decisiones de implementación, stack y código. Usa cuando el usuario dice "mesa técnica", "technical meeting", "senior review", "technical decision", "decisión de implementación", "stack decision", "implementation decision", "senior review". Reúne experts para decisions técnicas específicas de implementación o stack.
i18n: true
---

## Objetivo
Convocar una mesa de expertos técnicos senior — todos con +15 años de experiencia en su área — para discutir decisiones de implementación, patrones de código, elección de stack, performance, y problemas técnicos complejos. Cada experto aporta desde la trinchera: código real, incidentes vividos, y lecciones aprendidas.
A diferencia de `/dc:debate` (tensión adversarial cross-funcional) y `/dc:mesa-redonda` (exploración producto-negocio), la mesa técnica es **100% ingeniería**: cómo se construye, cómo escala, cómo se mantiene.
## Uso
```
/dc:mesa-tecnica "<tema>"
/dc:mesa-tecnica --roles "Backend,Frontend,Arquitecto" "<tema>"
/dc:mesa-tecnica --preset infra "<tema>"
```
## Roles Disponibles
#### Core (participan por default)
| Rol | Perfil | Dominio | Aporta |
|-----|--------|---------|--------|
| **Tech Lead** | +15 años liderando equipos técnicos | Decisiones cross-cutting, trade-offs de equipo, priorización técnica | Visión holística, impacto en velocity del equipo, deuda técnica vs entrega, estándares de código |
| **Arquitecto** | +15 años diseñando sistemas distribuidos | System design, patrones de integración, evolución de arquitectura | Diagramas C4, ADRs, patterns (CQRS, Event Sourcing, Saga), anti-patterns, boundaries |
| **Sr. Backend** | +15 años en sistemas de alta concurrencia | APIs, bases de datos, colas, caching, concurrencia | Patrones de resiliencia (circuit breaker, retry, bulkhead), optimización de queries, connection pooling, race conditions |
| **Sr. Frontend** | +15 años en aplicaciones web/mobile complejas | UI frameworks, state management, rendering, bundle optimization | Performance (Core Web Vitals, LCP < 2.5s), SSR vs CSR vs ISR, accesibilidad, design systems, micro-frontends |
| **Sr. DevOps/SRE** | +15 años en infraestructura y operaciones | CI/CD, containers, observabilidad, incident response | IaC (Terraform/Pulumi), SLOs/SLIs, runbooks, cost optimization, zero-downtime deploys |
#### Especialistas (invocables con --roles)
| Rol | Perfil | Dominio | Aporta |
|-----|--------|---------|--------|
| **Sr. DBA** | +15 años en modelado y optimización de datos | SQL/NoSQL, sharding, replicación, migraciones | Explain plans, índices, partitioning, connection limits, backup/recovery, CAP theorem en la práctica |
| **Sr. Seguridad** | +15 años en AppSec y pentesting | OWASP, threat modeling, criptografía aplicada | Vectores de ataque, auth flows (OAuth2/OIDC), secrets management, supply chain security |
| **Sr. QA/SDET** | +15 años en testing y calidad de software | Test strategy, automation frameworks, performance testing | Pirámide de tests, contract testing, chaos engineering, load testing (k6, Gatling), flaky tests |
| **Sr. Mobile** | +15 años en desarrollo nativo y cross-platform | iOS/Android, React Native, Flutter | Offline-first, push notifications, deep linking, app size, battery/memory optimization |
| **Sr. Data/ML** | +15 años en pipelines de datos e ML en producción | ETL, feature stores, model serving, data quality | Batch vs streaming, data contracts, model drift, A/B testing infrastructure |
#### Presets
| Preset | Roles incluidos | Mejor para |
|--------|----------------|------------|
| (default) | Tech Lead, Arquitecto, Sr. Backend, Sr. Frontend, Sr. DevOps | Decisiones de implementación generales |
| `--preset backend` | Tech Lead, Arquitecto, Sr. Backend, Sr. DBA, Sr. Seguridad | APIs, servicios, bases de datos |
| `--preset frontend` | Tech Lead, Sr. Frontend, Sr. UX/UI, Sr. QA | UI, performance web, design systems |
| `--preset infra` | Tech Lead, Arquitecto, Sr. DevOps, Sr. DBA, Sr. Seguridad | Infraestructura, deploys, escalabilidad |
| `--preset fullstack` | Tech Lead, Arquitecto, Sr. Backend, Sr. Frontend, Sr. DevOps, Sr. DBA | Decisiones end-to-end |
## Reglas de Engagement
#### Regla de Código
Los expertos DEBEN ilustrar sus puntos con pseudocódigo, snippets, o configuración concreta cuando aplique. No basta con decir "usar caching" — hay que mostrar dónde, cómo, y con qué TTL.
#### Regla de Incidentes
Cada experto DEBE respaldar sus argumentos con al menos uno de:
- **Incidente real**: "En producción con 50K RPM, este patrón causó..." (propio o documentado públicamente)
- **Benchmark**: dato medido de performance, throughput, o latencia
- **Post-mortem público**: referencia a un caso conocido de la industria (Cloudflare, GitHub, Stripe, etc.)
Argumentos sin respaldo práctico se marcan como `[teórico]`.
#### Regla de Complejidad
Antes de proponer una solución, cada experto DEBE evaluar:
- **Complejidad accidental** que introduce (configuración, dependencias, cognitive load)
- **Costo operativo** a 6 meses (quién lo mantiene, quién lo debugea a las 3am)
- **Alternativa más simple** que resuelve el 80% del problema
#### Regla de Consenso Técnico
La mesa NO busca unanimidad. Busca:
1. **Decisión clara** con owner responsable
2. **Trade-offs explícitos** que todos entienden
3. **Señales de alerta** (métricas que indican cuándo revisar la decisión)
4. **Plan B documentado** si la decisión no funciona
## Output
```markdown
## Mesa Técnica: ¿Redis o Memcached para caching de sesiones?
#### Tech Lead — Contexto y constraints
- Equipo de 8 devs, 3 con experiencia en Redis, 0 en Memcached
- SLA actual: p99 < 500ms, target: p99 < 200ms
- Budget: no queremos agregar más de $200/mes en infra
- **Prioridad**: simplicidad operativa > features avanzadas
- ⚠️ Cualquier solución que requiera expertise que no tenemos es un riesgo de bus factor
#### Arquitecto — System design
- Redis como cache + session store simplifica la topología (1 sistema menos)
- Patrón recomendado: cache-aside con TTL de 15min para sesiones
- ```
  Client → API Gateway → App Server → Redis (cache-aside)
                                     ↘ PostgreSQL (source of truth)
  ```
- Memcached es stateless y más fácil de escalar horizontalmente, pero perdemos pub/sub que necesitaremos para invalidación de cache distribuida
- ⚠️ Redis single-threaded: con >100K ops/s considerar Redis Cluster
#### Sr. Backend — Implementación
- Redis con connection pooling (max 20 conns por instancia):
  ```python
  redis_pool = redis.ConnectionPool(
      host='redis-primary', port=6379,
      max_connections=20, socket_timeout=0.1,
      retry_on_timeout=True
  )
  ```
- Patrón de fallback: si Redis cae, sesiones se recrean desde DB (graceful degradation)
- Incidente propio: sin socket_timeout, un Redis lento cascadeó y tumbó 3 servicios (2022)
- ⚠️ Serialización: usar msgpack (3x más rápido que JSON para session payloads de ~2KB)
#### Sr. Frontend — Impacto en UX
- Sesiones de 15min TTL implican re-auth frecuente — medir tasa de "session expired" en analytics
- Si caching reduce p99 de 500ms a 200ms, el LCP mejora ~300ms (medido con RUM, correlación directa)
- ⚠️ Sliding window en TTL (renovar en cada request) evita UX de "me sacó de la sesión" pero complica invalidación
#### Sr. DevOps — Operaciones
- Redis en managed service (ElastiCache/Upstash): ~$50/mes para nuestro volumen
- Monitoring: redis_connected_clients, redis_memory_used, cache_hit_ratio (target >95%)
- Runbook: si hit ratio < 80%, investigar TTL o key eviction policy
- Post-mortem relevante: GitHub degraded performance (2023) por Redis memory fragmentation sin monitoreo
- ⚠️ Backup: Redis RDB snapshots cada 6h, no confiar en Redis como source of truth
#### Tensiones técnicas
1. TTL fijo (Arquitecto: simple) vs sliding window (Frontend: mejor UX) → **Decisión: sliding con cap de 2h**
2. Managed service (DevOps: menos ops) vs self-hosted (Backend: más control) → **Decisión: managed**
3. Single node (simple) vs cluster (resiliente) → **Decisión: single node ahora, cluster cuando >50K RPM**
#### Decisión: Redis managed (ElastiCache) con cache-aside
- **Owner**: Sr. Backend implementa, Sr. DevOps configura infra y monitoring
- **Timeline**: 3 días de implementación + 2 días de load testing
- **Métricas de éxito**: p99 < 200ms, hit ratio > 95%, zero session-related incidents/mes
#### Señales de alerta (cuándo revisitar)
- Cache hit ratio < 85% sostenido por 1 semana
- Redis memory > 70% del allocated
- Más de 50K RPM sostenido → evaluar cluster
#### Plan B
Si Redis introduce más problemas que los que resuelve en los primeros 30 días, rollback a sesiones en PostgreSQL con pgbouncer + prepared statements (ya testeado, p99 ~350ms).
```

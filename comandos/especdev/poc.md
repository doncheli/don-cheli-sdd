---
description: Modo Prueba de Concepto (PoC/POC) para validar viabilidad técnica antes de implementación completa. Usa cuando el usuario dice "POC", "proof of concept", "prueba de concepto", "validar viabilidad", "will this work", "tech spike", "investigación técnica", "spike", "explorar tecnología", "validate approach", "prototipo técnico". Demuestra que el approach funciona antes de comprometer desarrollo completo.
i18n: true
---

# /dc:poc

## Objetivo

Iniciar una Prueba de Concepto (PoC) para validar viabilidad técnica, explorar soluciones o demostrar una idea **antes** de comprometer una implementación completa. El PoC tiene reglas relajadas: prioriza velocidad y aprendizaje sobre calidad de producción.

## Uso

```
/dc:poc <descripción de lo que se quiere validar>
/dc:poc --hipotesis "<lo que quiero demostrar>"
/dc:poc --tiempo 2h                                # Limitar timebox (default: 4h)
/dc:poc --graduar                                  # Convertir PoC exitoso en feature real
```

## Cuándo Usar

| Situación | PoC | Rápido | Completo |
|-----------|-----|--------|----------|
| "¿Se puede hacer X con esta librería?" | ✅ | | |
| "¿Este enfoque escala?" | ✅ | | |
| "Necesito una demo para el stakeholder" | ✅ | | |
| "Corregir bug en auth" | | ✅ | |
| "Implementar feature de pagos" | | | ✅ |
| "¿WebSockets o SSE para real-time?" | ✅ | | |
| "Migrar de REST a GraphQL, ¿vale la pena?" | ✅ | | |

**Regla de oro:** Si la pregunta empieza con "¿se puede...?", "¿funciona...?" o "¿vale la pena...?" → es un PoC.

## Diferencias con Modo Rápido y Completo

| Aspecto | PoC | Rápido (N1) | Completo (N3) |
|---------|-----|-------------|---------------|
| **Objetivo** | Validar viabilidad | Entregar cambio | Entregar feature |
| **Output** | Aprendizaje + demo | Código de producción | Sistema completo |
| **TDD** | Opcional (solo tests de validación) | Obligatorio | Obligatorio |
| **Coverage** | Sin mínimo | ≥85% | ≥85% |
| **Lint/Types** | Relajado | Obligatorio | Obligatorio |
| **Docs** | Veredicto + hallazgos | Descripción PR | spec.md + tech.md |
| **Código** | Desechable (puede no mergearse) | Producción | Producción |
| **Timebox** | Fijo (default 4h) | Variable | Variable |
| **Constitución** | Solo Art. VII (Stop-Loss) | Completa | Completa |
| **Stubs permitidos** | Sí (con marcador) | No | No |
| **Contrato UI** | No | Si aplica | Si aplica |

## Proceso (4 fases)

### Fase 1: Hipótesis (10 min)

Definir QUÉ se quiere validar y CÓMO se medirá el éxito/fracaso.

```markdown
## PoC: [título]

**Hipótesis:** [lo que se quiere demostrar]
**Criterio de éxito:** [cómo se sabe que funciona]
**Criterio de fracaso:** [cuándo abandonar]
**Timebox:** [tiempo máximo, default 4h]
**Alcance:**
  - Incluido: [qué se construirá]
  - Excluido: [qué NO se construirá]

**Preguntas a responder:**
1. [pregunta técnica 1]
2. [pregunta técnica 2]
3. [pregunta técnica 3]
```

**Ejemplo:**

```markdown
## PoC: WebSockets vs SSE para notificaciones en tiempo real

**Hipótesis:** WebSockets ofrece menor latencia que SSE para nuestro caso de uso
  (notificaciones de cambio de estado de pedido, ~100 usuarios concurrentes).

**Criterio de éxito:**
  - WebSockets entrega notificaciones en < 50ms
  - Conexión se mantiene estable por > 30 min
  - Funciona detrás de nuestro reverse proxy (nginx)

**Criterio de fracaso:**
  - Latencia > 200ms
  - Requiere cambio de infraestructura (nginx no soporta)
  - Complejidad de implementación > 3x vs SSE

**Timebox:** 3 horas

**Alcance:**
  - Incluido: Servidor WS básico, cliente simple, test de latencia
  - Excluido: Auth, persistencia, UI bonita, reconexión automática

**Preguntas a responder:**
1. ¿Cuál es la latencia real de WS vs SSE en nuestro stack?
2. ¿nginx necesita configuración especial para WS?
3. ¿Cuántas conexiones concurrentes aguanta el servidor?
```

### Fase 2: Construir (80% del tiempo)

Reglas relajadas para máxima velocidad:

```
✅ PERMITIDO en PoC:
  - Hardcoded values (API keys en .env, datos mock)
  - Código sin tipos estrictos
  - Sin lint perfecto
  - Console.log como debugging
  - Dependencias sin evaluar alternativas
  - Un solo archivo largo (sin modularizar)
  - Estilos inline
  - Sin manejo de errores exhaustivo

❌ PROHIBIDO incluso en PoC:
  - Credenciales en código (usar .env)
  - Cambiar código de producción existente
  - Commitear al branch principal
  - Ignorar el timebox (Stop-Loss aplica)
  - Concluir sin evidencia
```

**Ubicación del código PoC:**

```
poc/
├── <nombre-poc>/
│   ├── README.md          # Hipótesis + veredicto
│   ├── src/               # Código del PoC
│   ├── resultados/        # Screenshots, benchmarks, logs
│   └── .env.example       # Variables requeridas (sin valores)
```

**Branch:** `poc/<nombre-poc>` (siempre desde la rama actual, nunca main)

### Fase 3: Evaluar (10 min)

Contra los criterios definidos en la hipótesis:

```markdown
## Evaluación del PoC

### Resultados vs Criterios

| Criterio | Resultado | Veredicto |
|----------|-----------|-----------|
| Latencia < 50ms | 12ms promedio | ✅ CUMPLE |
| Estable > 30 min | 45 min sin desconexión | ✅ CUMPLE |
| Funciona con nginx | Sí, con `proxy_set_header Upgrade` | ✅ CUMPLE |

### Preguntas Respondidas

1. **Latencia WS vs SSE:** WS = 12ms, SSE = 45ms (WS 3.7x más rápido)
2. **nginx:** Requiere 3 líneas de config adicional (documentado)
3. **Conexiones:** Servidor aguanta ~500 concurrentes con 256MB RAM

### Hallazgos Inesperados
- La librería `ws` tiene memory leak conocido en v8.16 (usar v8.17+)
- SSE no funciona con HTTP/2 en nuestro setup actual

### Evidencia
- Benchmark: resultados/benchmark.json
- Screenshot: resultados/latency-chart.png
- Logs: resultados/stress-test.log
```

### Fase 4: Veredicto (5 min)

Uno de 4 resultados posibles:

```markdown
## Veredicto: ✅ VIABLE — Proceder con implementación

**Recomendación:** Usar WebSockets para notificaciones real-time.
**Próximo paso:** /dc:comenzar Implementar notificaciones real-time con WebSockets
**Hallazgos a preservar:**
  - Config nginx necesaria → guardar en hallazgos.md
  - Usar ws@8.17+ (no 8.16) → guardar en hallazgos.md
  - Benchmark como referencia → guardar en resultados/
```

| Veredicto | Significado | Acción |
|-----------|-------------|--------|
| ✅ **VIABLE** | Hipótesis confirmada, criterios cumplidos | Graduar a feature con `/dc:poc --graduar` |
| ⚠️ **VIABLE CON RESERVAS** | Funciona pero con limitaciones | Documentar limitaciones, decidir si proceder |
| ❌ **NO VIABLE** | Hipótesis refutada | Documentar por qué, explorar alternativas |
| 🔄 **INCONCLUSO** | Timebox agotado sin evidencia suficiente | Extender timebox o reformular hipótesis |

## Graduación de PoC a Feature

Cuando un PoC es VIABLE, se puede graduar a una feature real:

```bash
/dc:poc --graduar
```

### Flujo de Graduación

```
PoC VIABLE
  │
  ├── 1. Extraer hallazgos → .dc/hallazgos.md
  ├── 2. Extraer decisiones técnicas → .dc/memoria/decisiones.md
  ├── 3. Crear propuesta desde PoC → /dc:proponer (auto-generada)
  ├── 4. Iniciar pipeline completo → /dc:comenzar
  │      (con contexto del PoC como input)
  └── 5. Archivar código PoC → poc/_archivo/<nombre>/
```

**Importante:** El código del PoC **NO se reutiliza** directamente. Se reescribe con calidad de producción siguiendo el pipeline completo (TDD, constitución, puertas de calidad). El PoC informa las decisiones, no el código.

## Timebox y Stop-Loss

| Timebox | Acción |
|---------|--------|
| 50% del tiempo | Checkpoint: ¿avanzando hacia la respuesta? |
| 75% del tiempo | Warning: empezar a consolidar hallazgos |
| 100% del tiempo | ⛔ PARAR. Evaluar con lo que hay |
| >100% (extendido) | Solo si el usuario lo autoriza explícitamente |

**Regla:** Un PoC que no da respuesta en el timebox es un PoC mal definido, no un PoC que necesita más tiempo.

## Integración con Pipeline

```
/dc:poc → hipótesis + código + veredicto
  ├── ✅ VIABLE → /dc:poc --graduar → /dc:proponer → pipeline normal
  ├── ⚠️ CON RESERVAS → documentar → decisión del usuario
  ├── ❌ NO VIABLE → documentar → explorar alternativa
  └── 🔄 INCONCLUSO → reformular hipótesis → nuevo PoC
```

## Almacenamiento

```
poc/
├── websockets-vs-sse/
│   ├── README.md            # Hipótesis + veredicto
│   ├── src/                 # Código PoC
│   └── resultados/          # Evidencia
├── graphql-migration/
│   ├── README.md
│   ├── src/
│   └── resultados/
└── _archivo/                # PoCs graduados o descartados
    └── auth-biometrica/
```

## Ejemplo Completo

```bash
/dc:poc --hipotesis "Podemos usar SQLite en vez de PostgreSQL para el MVP"

=== PoC: SQLite para MVP ===

📋 Fase 1: Hipótesis (2 min)
  Hipótesis: SQLite es suficiente para MVP (< 100 usuarios, < 10K registros)
  Criterio de éxito: CRUD funciona, queries < 10ms, datos persisten
  Criterio de fracaso: Concurrencia falla, queries > 100ms
  Timebox: 2 horas

🔨 Fase 2: Construir (1h 40min)
  ✅ Setup SQLite con Prisma
  ✅ Migración de schema existente
  ✅ CRUD básico funcionando
  ✅ Test de concurrencia (10 escrituras paralelas)

📊 Fase 3: Evaluar (10 min)
  ✅ CRUD: funciona idéntico a PostgreSQL
  ✅ Queries: 2-5ms (vs 5-15ms en PG local)
  ⚠️ Concurrencia: WAL mode soporta 10 escrituras paralelas
  ❌ Limitación: Sin full-text search nativo

📝 Fase 4: Veredicto
  ⚠️ VIABLE CON RESERVAS
  - Funciona para MVP si no necesitamos full-text search
  - Migrar a PostgreSQL será necesario antes de escalar
  - Recomendación: usar SQLite para MVP, planear migración para v2
```

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Hipótesis | Haiku | Solo estructurar la pregunta |
| Construir | Sonnet | Código funcional rápido |
| Evaluar | Haiku | Comparar contra criterios |
| Veredicto | Haiku | Resumir resultados |

## Guardrails

- **Nunca** commitear al branch principal
- **Nunca** modificar código de producción existente
- **Nunca** exceder el timebox sin autorización explícita
- **Nunca** reutilizar código PoC directamente en producción (graduar primero)
- **Siempre** definir hipótesis y criterios ANTES de construir
- **Siempre** documentar el veredicto con evidencia
- **Siempre** archivar PoCs completados (no dejar código abandonado)

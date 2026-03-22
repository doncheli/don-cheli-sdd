<p align="center">
  <h1 align="center">Don Cheli — SDD Framework</h1>
  <p align="center">
    <strong>Deja de improvisar. Empieza a entregar.</strong>
  </p>
  <p align="center">
    El framework de Desarrollo Dirigido por Especificaciones más completo del mercado.<br/>
    Open source. En español. Para Claude Code y otros agentes IA.
  </p>
  <p align="center">
    <a href="#-instalación"><img src="https://img.shields.io/badge/instalación-1_minuto-brightgreen" alt="Install"></a>
    <img src="https://img.shields.io/badge/versión-1.6.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/licencia-Apache%202.0-green" alt="License">
    <img src="https://img.shields.io/badge/idioma-español-red" alt="Spanish">
    <img src="https://img.shields.io/badge/comandos-55+-purple" alt="Commands">
    <img src="https://img.shields.io/badge/habilidades-40+-orange" alt="Skills">
  </p>
</p>

---

## El problema

Empiezas un proyecto con IA. Las primeras 2 horas todo va bien. Después:

- **Context rot** — Claude olvida tus decisiones de arquitectura
- **Stubs silenciosos** — Te dice "implementé el servicio" pero el código dice `// TODO`
- **Sin verificación** — ¿Funciona? No sé. ¿Tests? No. ¿Puedo deployar? Ojalá

Eso es **vibe coding**. Y es el enemigo del software de calidad.

## La solución

**Don Cheli** transforma el caos en un proceso estructurado:

```
Especificar → Clarificar → Planificar → Desglosar → Implementar → Revisar
```

Cada paso tiene **puertas de calidad**. No avanzas sin cumplir. El código se genera con **TDD obligatorio**, **detección de stubs**, y **peer review de 7 dimensiones**.

---

## Por qué Don Cheli

<table>
<tr><th></th><th>BMAD<br/><sub>41K ⭐</sub></th><th>GSD<br/><sub>38K ⭐</sub></th><th>spec-kit<br/><sub>40K ⭐</sub></th><th><strong>Don Cheli</strong></th></tr>
<tr><td>Comandos</td><td>~20</td><td>~80</td><td>~10</td><td><strong>55+</strong></td></tr>
<tr><td>Habilidades (Skills)</td><td>~15</td><td>~15</td><td>~6</td><td><strong>40</strong></td></tr>
<tr><td>Modelos de razonamiento</td><td>—</td><td>—</td><td>—</td><td><strong>15</strong></td></tr>
<tr><td>Estimados automáticos</td><td>—</td><td>—</td><td>—</td><td><strong>4 modelos</strong></td></tr>
<tr><td>Quality gates formales</td><td>—</td><td>1</td><td>4</td><td><strong>6</strong></td></tr>
<tr><td>TDD obligatorio</td><td>—</td><td>—</td><td>—</td><td><strong>Ley de Hierro</strong></td></tr>
<tr><td>Modo PoC</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Auditoría OWASP</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Migración de stacks</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Detección de stubs</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Contratos de UI</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Validación Nyquist</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>En español</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
</table>

### 10 cosas que solo Don Cheli tiene

1. **15 modelos de razonamiento** — Pre-mortem, 5 porqués, Pareto, RLM
2. **4 modelos de estimación** — Puntos de Función, Planning Poker IA, COCOMO, Histórico
3. **Modo PoC** — Validar ideas con timebox y criterios de éxito antes de comprometer
4. **Blueprint Distillation** — Extraer specs desde código existente (ingeniería inversa de comportamiento)
5. **CodeRAG** — Indexar repos de referencia y recuperar patrones relevantes
6. **Auditoría OWASP** — Escaneo de seguridad estática integrado en el pipeline
7. **Migración de stacks** — Vue→React, JS→TS con plan de waves y equivalencias
8. **Contratos de API** — REST/GraphQL con reintentos, circuit breaker, idempotencia
9. **Refactorización SOLID** — Checklist, métricas, patrones de diseño estructurados
10. **Documentación viva** — ADRs, OpenAPI auto-generado, diagramas Mermaid

---

## Instalación

```bash
# 1. Clonar
git clone https://github.com/doncheli/don-cheli-sdd.git

# 2. Instalar globalmente
cd don-cheli-sdd && bash scripts/instalar.sh --global

# 3. En cualquier proyecto, inicializar
/especdev:iniciar
```

<details>
<summary>Instalación remota (sin clonar)</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global
```
</details>

**Requisitos:** Claude Code (o agente IA compatible) + Git

---

## Inicio rápido

### 1. Inicializar en tu proyecto

```bash
/especdev:iniciar --tipo servicio --nombre "mi-api"
```

### 2. Empezar una tarea

```bash
/especdev:comenzar Implementar autenticación JWT
```

Don Cheli auto-detecta la complejidad y elige el proceso adecuado:

| Nivel | Nombre | Cuándo |
|-------|--------|--------|
| **0** | Atómico | 1 archivo, < 30 min |
| **P** | PoC | Validar viabilidad (2-4h timebox) |
| **1** | Micro | 1-3 archivos, solución conocida |
| **2** | Estándar | Múltiples archivos, 1-3 días |
| **3** | Complejo | Multi-módulo, 1-2 semanas |
| **4** | Producto | Sistema nuevo, 2+ semanas |

### 3. Seguir el pipeline

```bash
/especdev:especificar    # Spec Gherkin + schema DBML
/especdev:clarificar     # Auto-QA + resolver ambigüedades
/especdev:planificar-tecnico  # Blueprint + chequeo de constitución
/especdev:desglosar      # Tareas TDD con paralelismo
/especdev:implementar    # RED → GREEN → REFACTOR en Docker
/especdev:revisar        # Peer review de 7 dimensiones
```

---

## Las 3 leyes de hierro

No negociables. Se aplican siempre.

| Ley | Principio | En la práctica |
|-----|-----------|----------------|
| **TDD** | Todo código requiere tests | RED → GREEN → REFACTOR, sin excepciones |
| **Debugging** | Causa raíz primero | Reproducir → Aislar → Entender → Corregir → Verificar |
| **Verificación** | Evidencia antes de afirmaciones | "Los tests pasan" > "creo que funciona" |

---

## Comandos (55+)

<details>
<summary><strong>Principales (22)</strong></summary>

| Comando | Descripción |
|---------|-------------|
| `/especdev:iniciar` | Inicializar en un proyecto |
| `/especdev:comenzar` | Iniciar tarea (auto-detecta nivel) |
| `/especdev:rapido` | Modo rápido (Nivel 1) |
| `/especdev:poc` | Prueba de Concepto con timebox |
| `/especdev:completo` | Modo completo (Nivel 3) |
| `/especdev:estado` | Estado actual |
| `/especdev:diagnostico` | Health check del setup |
| `/especdev:continuar` | Recuperar sesión previa |
| `/especdev:reflexionar` | Auto-reflexión (+8-21% calidad) |
| `/especdev:agente` | Cargar agente especializado |
| `/especdev:mesa-redonda` | Discusión multi-perspectiva |
| `/especdev:estimar` | Estimados de desarrollo |
| `/especdev:destilar` | Extraer specs desde código |
| `/especdev:minar-referencias` | Buscar repos de referencia |
| `/especdev:contrato-ui` | Contratos de diseño UI |
| `/especdev:contrato-api` | Contratos de API/webhooks |
| `/especdev:auditar-seguridad` | Auditoría OWASP Top 10 |
| `/especdev:migrar` | Migración de stacks |
| `/especdev:reversa` | Ingeniería inversa de arquitectura |
| `/especdev:explorar` | Explorar codebase (modo supuestos) |
| `/especdev:proponer` | Propuesta de cambio |
| `/especdev:analizar-sesiones` | Análisis de patrones de uso |
| `/especdev:actualizar` | Detectar y aplicar actualizaciones del framework |
</details>

<details>
<summary><strong>Pipeline Gherkin (5)</strong></summary>

| Comando | Descripción |
|---------|-------------|
| `/especdev:especificar` | Spec Gherkin con prioridades P1/P2/P3+ |
| `/especdev:clarificar` | Auto-QA + verificación schema-spec |
| `/especdev:planificar-tecnico` | Blueprint + chequeo de constitución |
| `/especdev:desglosar` | Tareas TDD con marcadores `[P]` |
| `/especdev:revisar` | Peer review de 7 dimensiones |
</details>

<details>
<summary><strong>Razonamiento (15)</strong></summary>

| Comando | Qué hace |
|---------|----------|
| `/razonar:primeros-principios` | Descomponer a lo fundamental |
| `/razonar:5-porques` | Análisis de causa raíz |
| `/razonar:pareto` | Enfoque 80/20 |
| `/razonar:inversion` | Resolver al revés |
| `/razonar:segundo-orden` | Consecuencias de consecuencias |
| `/razonar:pre-mortem` | Anticipar fracasos |
| `/razonar:minimizar-arrepentimiento` | Decisiones a largo plazo |
| `/razonar:costo-oportunidad` | Evaluar alternativas |
| `/razonar:circulo-competencia` | Conocer tus límites |
| `/razonar:mapa-territorio` | Modelo vs realidad |
| `/razonar:probabilistico` | Razonar en probabilidades |
| `/razonar:reversibilidad` | ¿Se puede deshacer? |
| `/razonar:rlm-verificacion` | Verificación con sub-LLMs |
| `/razonar:rlm-cadena-pensamiento` | Razonamiento multi-paso |
| `/razonar:rlm-descomposicion` | Divide y conquista |
</details>

---

## Habilidades (40)

| Categoría | Habilidades |
|-----------|------------|
| **Calidad** | Leyes de hierro, Validación Nyquist, Detección de stubs, Detección de loops, Puertas de calidad, Prueba de trabajo, Rigor progresivo |
| **Contexto** | Ingeniería de contexto, Optimizador de contexto, Memoria persistente (Engram), CodeRAG + LightRAG, Code reference mining |
| **Razonamiento** | 12 modelos mentales, 3 modelos RLM (PrimeIntellect) |
| **Arquitectura** | Mapa arquitectónico vivo, Refactorización SOLID, Schemas DBML |
| **Diseño** | UI/UX Design System (67 estilos, 161 paletas), Contratos de UI, Presentaciones HTML |
| **Documentación** | Documentación viva (ADRs, OpenAPI), DevLog, Trazabilidad, Delta specs, Obsidian |
| **Autonomía** | Orquestación autónoma, Auto-corrección, Recuperación de sesión |
| **Descubrimiento** | Brainstorming estructurado, Git Worktrees |
| **Eficiencia** | Optimización de tokens, Contabilidad de tokens, Desarrollo con subagentes |
| **Seguridad** | Permisos y seguridad, Auditoría OWASP |
| **Integración** | MCP servers, Extensiones y presets |

---

## Pipeline visual

```
  ┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
  │ ESPECIFICAR │────▶│  CLARIFICAR  │────▶│PLANIFICAR TÉCNICO│
  │             │     │              │     │                  │
  │ Gherkin     │     │ Auto-QA      │     │ Chequeo de       │
  │ P1/P2/P3+   │     │ Schema↔Spec  │     │ constitución     │
  │ DBML auto   │     │ Ambigüedades │     │ Contexto técnico │
  └─────────────┘     └─────────────┘     └──────────────────┘
        │                   │                      │
    [Puerta 1]          [Puerta 2+3]           [Puerta 4]
                                                   │
                                                   ▼
  ┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
  │   REVISAR   │◀────│ IMPLEMENTAR │◀────│    DESGLOSAR     │
  │             │     │             │     │                  │
  │ 7 dimensiones│     │ TDD en Docker│     │ [T001] [P] [US1] │
  │ N+1, SOLID  │     │ Checkpoints │     │ 5 fases          │
  │ Seguridad   │     │ Anti-stubs  │     │ Nyquist          │
  └─────────────┘     └─────────────┘     └──────────────────┘
        │                   │                      │
    [Puerta 6]          [Puerta 6]             [Puerta 5]
    + Regresión
```

Cada puerta bloquea el avance si no se cumplen los criterios. **Sin atajos.**

---

## 7 agentes especializados

| Agente | Modelo | Rol |
|--------|--------|-----|
| `planificador` | opus | Descomposición y planificación |
| `arquitecto` | opus | Diseño de sistemas |
| `ejecutor` | sonnet | Implementación de código |
| `revisor` | opus | Code review arquitectónico |
| `tester` | sonnet | Testing y QA |
| `documentador` | haiku | Documentación |
| `estimador` | opus | Estimados de esfuerzo |

```bash
/especdev:agente planificador
/especdev:mesa-redonda "¿Monolito o microservicios?"
```

---

## Modo PoC

Validar ideas antes de comprometer implementación:

```bash
/especdev:poc --hipotesis "SQLite es suficiente para el MVP"
```

| Fase | Qué |
|------|-----|
| **Hipótesis** | Definir qué validar y criterios de éxito/fracaso |
| **Construir** | Código desechable, reglas relajadas, sin TDD |
| **Evaluar** | Resultados vs criterios con evidencia |
| **Veredicto** | VIABLE / CON RESERVAS / NO VIABLE / INCONCLUSO |

Si es viable → `/especdev:poc --graduar` → pipeline completo.

---

## Estimados automáticos

```bash
/especdev:estimar docs/prd.md
```

4 modelos que se complementan:

| Modelo | Técnica |
|--------|---------|
| **Puntos de Función** | Complejidad funcional |
| **Planning Poker IA** | 3 agentes estiman independientemente |
| **COCOMO** | LOC estimadas → esfuerzo |
| **Histórico** | Comparación con tareas similares |

Output: estimado optimista, esperado y pesimista con desglose por feature.

---

## Auditoría de seguridad

```bash
/especdev:auditar-seguridad
```

Escanea las 10 categorías OWASP:

- **A01** Broken Access Control — endpoints sin auth, IDOR, CORS
- **A02** Cryptographic Failures — passwords en plaintext, JWT sin expiración
- **A03** Injection — SQL, XSS, command injection
- **A04-A10** — Configuración, componentes vulnerables, logging

Cada hallazgo con severidad, archivo, línea y fix sugerido.

---

## Migración de stacks

```bash
/especdev:migrar --de "Vue 3" --a "React 19"
```

6 fases: Inventario → Equivalencias → Estrategia → Plan → Ejecución → Verificación

Soporta: framework (Vue→React), versión (Next 14→15), lenguaje (JS→TS), paradigma (REST→GraphQL).

---

## Multi-LLM

| Archivo | Agente |
|---------|--------|
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | Codex |
| `prompt.md` | Amp / otros |

---

## Estructura del proyecto

```
don-cheli/
├── comandos/
│   ├── especdev/        # 46 comandos /especdev:*
│   └── razonar/         # 15 comandos /razonar:*
├── habilidades/         # 40 habilidades modulares
├── reglas/
│   ├── constitucion.md  # 8 principios gobernantes
│   ├── leyes-hierro.md  # 3 leyes no negociables
│   ├── puertas-calidad.md # 6 quality gates
│   └── reglas-trabajo-globales.md
├── plantillas/          # Templates para .especdev/
├── agentes/             # 7 agentes especializados
├── ganchos/             # Pre/Post herramienta + Stop hooks
├── scripts/             # instalar.sh, bucle.sh, validar.sh
├── CLAUDE.md            # Instrucciones para Claude Code
├── AGENTS.md            # Instrucciones para Codex
├── prompt.md            # Instrucciones para Amp
├── NOTICE               # Atribuciones
└── LICENCIA             # Apache 2.0
```

---

## Filosofía

> **"Ventana de Contexto = RAM, Sistema de Archivos = Disco"**

1. **Persistencia sobre conversación** — Escríbelo, no solo dígalo
2. **Estructura sobre caos** — Archivos claros, roles claros
3. **Recuperación sobre reinicio** — Nunca perder progreso
4. **Evidencia sobre afirmaciones** — Muestra, no cuentes
5. **Simplicidad sobre complejidad** — Todo en tu idioma

---

## Contribuir

Ver [CONTRIBUIR.md](CONTRIBUIR.md) para la guía completa.

```bash
# Fork → Clone → Branch → Cambios → PR
git checkout -b feature/mi-mejora
```

---

## Licencia

[Apache 2.0](LICENCIA) — Copyright 2026 Jose Luis Oronoz Troconis (@DonCheli)

Puedes usar, modificar y distribuir Don Cheli libremente. Debes mantener la atribución al autor original e indicar los cambios realizados.

---

<p align="center">
  <strong>Deja de improvisar. Empieza a entregar.</strong><br/>
  <sub>Don Cheli — SDD Framework</sub>
</p>

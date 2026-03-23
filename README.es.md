> 🌐 Leer en otros idiomas: [Español](README.es.md) | [English](README.md) | [Português](README.pt.md)

<p align="center">
  <h1 align="center">Don Cheli — SDD Framework</h1>
  <p align="center">
    <strong>Deja de improvisar. Empieza a entregar.</strong>
  </p>
  <p align="center">
    El framework de Desarrollo Dirigido por Especificaciones más completo del mercado.<br/>
    Open source. Multilenguaje (ES/EN/PT). Para Claude Code y otros agentes IA.
  </p>
  <p align="center">
    <a href="#-instalación"><img src="https://img.shields.io/badge/instalación-1_minuto-brightgreen" alt="Install"></a>
    <img src="https://img.shields.io/badge/versión-1.11.1-blue" alt="Version">
    <img src="https://img.shields.io/badge/licencia-Apache%202.0-green" alt="License">
    <img src="https://img.shields.io/badge/idiomas-ES%20|%20EN%20|%20PT-red" alt="Languages">
    <img src="https://img.shields.io/badge/comandos-71+-purple" alt="Commands">
    <img src="https://img.shields.io/badge/habilidades-42+-orange" alt="Skills">
    <img src="https://img.shields.io/badge/Anthropic%20Skills%202.0-compatible-blueviolet" alt="Skills 2.0">
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
<tr><td>Comandos</td><td>~20</td><td>~80</td><td>~10</td><td><strong>71+</strong></td></tr>
<tr><td>Habilidades (Skills)</td><td>~15</td><td>~15</td><td>~6</td><td><strong>42</strong></td></tr>
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
<tr><td>Multilenguaje (ES/EN/PT)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Anthropic Skills 2.0</td><td>—</td><td>—</td><td>—</td><td><strong>✅ Compatible</strong></td></tr>
<tr><td>Skill Creator (meta-skill)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Skills Marketplace</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
</table>

### 20 cosas que solo Don Cheli tiene

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
11. **Captures & Triage** — Anotar ideas sin pausar el trabajo, clasificación automática en 5 categorías
12. **UAT auto-generado** — Scripts de aceptación ejecutables por humano tras cada feature
13. **Doctor** — Diagnóstico y auto-reparación de git, framework y entorno
14. **Skill Creator** — Meta-skill iterativo: generar → probar → evaluar → mejorar skills automáticamente
15. **Skills Marketplace** — Instalar skills desde Anthropic oficial, comunidad, o crear las tuyas
16. **Constitución de proyecto** — Principios inmutables pre-spec que se validan en cada puerta de calidad
17. **Pseudocódigo formal** — Fase de razonamiento lógico agnóstico de tecnología entre spec y plan (SPARC)
18. **Validación multi-capa de spec** — 8 checks (implementation leakage, measurability, completeness, constitution adherence)
19. **Debate adversarial multi-rol** — PM vs Arquitecto vs QA con tensiones explícitas y objeción obligatoria
20. **Scale-adaptive planning** — El nivel de planificación se ajusta según complejidad (no mismo proceso para 1 archivo que para 100)

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

### Selección de idioma

Lo **primero** que ves al instalar es el selector de idioma:

```
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║           🏗️  Don Cheli — SDD Framework                   ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝

  🌍 Selecciona tu idioma / Select your language / Selecione seu idioma

     1)  🇪🇸  Español
     2)  🇬🇧  English
     3)  🇧🇷  Português

  ▸ _
```

Una vez seleccionado, **todo el framework se adapta al idioma elegido**: carpetas, archivos, plantillas, mensajes y la comunicación de Claude.

### Estructura por idioma

La instalación crea carpetas con nombres en el idioma seleccionado:

<table>
<tr><th>Contenido</th><th>🇪🇸 Español</th><th>🇬🇧 English</th><th>🇧🇷 Português</th></tr>
<tr><td>Habilidades</td><td><code>habilidades/</code></td><td><code>skills/</code></td><td><code>habilidades/</code></td></tr>
<tr><td>Reglas</td><td><code>reglas/</code></td><td><code>rules/</code></td><td><code>regras/</code></td></tr>
<tr><td>Plantillas</td><td><code>plantillas/</code></td><td><code>templates/</code></td><td><code>modelos/</code></td></tr>
<tr><td>Ganchos</td><td><code>ganchos/</code></td><td><code>hooks/</code></td><td><code>ganchos/</code></td></tr>
<tr><td>Agentes</td><td><code>agentes/</code></td><td><code>agents/</code></td><td><code>agentes/</code></td></tr>
</table>

Los archivos de proyecto (`.especdev/`) también se crean en el idioma configurado:

<table>
<tr><th>Archivo</th><th>🇪🇸 Español</th><th>🇬🇧 English</th><th>🇧🇷 Português</th></tr>
<tr><td>Estado</td><td><code>estado.md</code></td><td><code>status.md</code></td><td><code>estado.md</code></td></tr>
<tr><td>Hallazgos</td><td><code>hallazgos.md</code></td><td><code>findings.md</code></td><td><code>descobertas.md</code></td></tr>
<tr><td>Plan</td><td><code>plan.md</code></td><td><code>plan.md</code></td><td><code>plano.md</code></td></tr>
<tr><td>Progreso</td><td><code>progreso.md</code></td><td><code>progress.md</code></td><td><code>progresso.md</code></td></tr>
<tr><td>Propuesta</td><td><code>propuesta.md</code></td><td><code>proposal.md</code></td><td><code>proposta.md</code></td></tr>
</table>

El idioma se persiste en `locale` y `folder-map.json` para que Claude sepa exactamente qué archivos buscar. Para cambiar de idioma, simplemente reinstala:

```bash
bash scripts/instalar.sh --global
```

<details>
<summary>Instalación remota (sin clonar)</summary>

El instalador descarga automáticamente el repositorio cuando se ejecuta via pipe:

```bash
# Interactivo (pregunta el idioma)
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global

# No-interactivo (idioma directo)
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global --lang es
```

Idiomas disponibles: `es` (Español), `en` (English), `pt` (Português)
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

## Anthropic Skills 2.0

Don Cheli es **100% compatible** con el ecosistema de [Anthropic Skills](https://github.com/anthropics/skills). Soporta ambos formatos de skill:

| Formato | Archivo | Uso |
|---------|---------|-----|
| **Anthropic** | `SKILL.md` | Compatible con el marketplace oficial |
| **Don Cheli** | `HABILIDAD.md` | Formato extendido con version, tags, grado de libertad |

### Skill Creator

Crear skills sin escribir una sola línea de YAML:

```bash
/especdev:crear-skill "Generador de reportes semanales del equipo"
```

5 fases iterativas: **Descubrir** → **Generar** SKILL.md → **Testear** con prompt real → **Evaluar** calidad → **Iterar** hasta óptimo.

### Skills Marketplace

Instalar skills del marketplace oficial de Anthropic o de la comunidad:

```bash
/especdev:marketplace --instalar document-skills --fuente anthropic
/especdev:marketplace --buscar "weekly report"
```

Fuentes soportadas: [Anthropic Official](https://github.com/anthropics/skills) • [skillsmp.com](https://skillsmp.com/) • [aitmpl.com](https://www.aitmpl.com/skills) • Don Cheli built-in (42 skills)

### Progressive Disclosure

Las skills usan un diseño de 3 capas para máxima eficiencia de tokens:

```
Capa 1: Metadata (YAML)     → ~20 tokens por skill, siempre en contexto
Capa 2: Body (Markdown)     → Cargado solo al activar la skill
Capa 3: File References     → Cargados bajo demanda dentro del body
```

Esto permite tener decenas de skills sin impactar el context window.

---

## Comandos (71+)

<details>
<summary><strong>Principales (32)</strong></summary>

| Comando | Descripción |
|---------|-------------|
| `/especdev:iniciar` | Inicializar en un proyecto |
| `/especdev:comenzar` | Iniciar tarea (auto-detecta nivel) |
| `/especdev:rapido` | Modo rápido (Nivel 1) |
| `/especdev:poc` | Prueba de Concepto con timebox |
| `/especdev:completo` | Modo completo (Nivel 3) |
| `/especdev:estado` | Estado actual |
| `/especdev:diagnostico` | Health check del setup |
| `/especdev:doctor` | Diagnóstico y auto-reparación de git, framework y entorno |
| `/especdev:continuar` | Recuperar sesión previa |
| `/especdev:reflexionar` | Auto-reflexión (+8-21% calidad) |
| `/especdev:capturar` | Fire-and-forget de ideas con triage automático |
| `/especdev:uat` | Scripts de aceptación auto-generados por feature |
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
| `/especdev:presentar` | Generar presentación interactiva HTML |
| `/especdev:crear-skill` | Crear skills iterativamente (compatible Anthropic Skills 2.0) |
| `/especdev:marketplace` | Instalar skills desde Anthropic, comunidad, o built-in |
| `/especdev:pseudocodigo` | Lógica agnóstica de tecnología entre spec y plan (SPARC) |
| `/especdev:validar-spec` | Validación multi-capa de specs (8 checks, BMAD-inspired) |
| `/especdev:debate` | Deliberación adversarial multi-rol (PM vs Arquitecto vs QA) |
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

## Habilidades (42)

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
| **Eficiencia** | Optimización de tokens, Contabilidad de tokens, Desarrollo con subagentes, **Routing dinámico de modelos**, **Proyecciones de costo** |
| **Observabilidad** | **Salud de habilidades** (telemetría de success rate y consumo por skill) |
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

## Multi-LLM / Multi-IDE

Don Cheli funciona con **4 agentes IA** y **3 IDEs** nativamente:

| Archivo | Agente / IDE | Estructura |
|---------|-------------|------------|
| `CLAUDE.md` | Claude Code | `.claude/skills/`, `.claude/commands/` |
| `GEMINI.md` | Google Antigravity (Gemini 3.1) | `.agent/skills/`, `.agent/workflows/` |
| `AGENTS.md` | Cross-tool (Cursor, Codex, etc.) | Compartido entre todos |
| `prompt.md` | Amp / otros | Instrucciones genéricas |

### Google Antigravity

Don Cheli incluye soporte nativo para Antigravity con Gemini 3.1:

- `GEMINI.md` — Instrucciones adaptadas con modelo routing (Flash/Pro)
- 5 skills en `.agent/skills/` (spec, plan, implement, review, security)
- 4 workflows en `.agent/workflows/` (start, pipeline, review, security)
- Compatibles con la estructura `.agent/` de Antigravity

```bash
# En Antigravity, los workflows se invocan como slash commands:
/doncheli-start
/doncheli-pipeline
/doncheli-review
/doncheli-security
```

---

## Estructura del proyecto

```
don-cheli/
├── comandos/
│   ├── especdev/          # 56 comandos /especdev:*
│   └── razonar/           # 15 comandos /razonar:*
├── habilidades/           # 42 habilidades modulares
├── reglas/
│   ├── constitucion.md    # 8 principios gobernantes
│   ├── leyes-hierro.md    # 3 leyes no negociables
│   ├── puertas-calidad.md # 6 quality gates
│   ├── i18n.md            # Reglas de internacionalización
│   ├── skills-best-practices.md  # Best practices Anthropic Skills 2.0
│   └── reglas-trabajo-globales.md
├── locales/               # 🌍 Strings i18n
│   ├── es.json            # Español (158 strings)
│   ├── en.json            # English (158 strings)
│   └── pt.json            # Português (158 strings)
├── plantillas/
│   └── especdev/
│       ├── es/            # Templates en español
│       ├── en/            # Templates in English
│       └── pt/            # Templates em português
├── agentes/               # 7 agentes especializados
├── ganchos/               # Pre/Post herramienta + Stop hooks
├── scripts/               # instalar.sh, bucle.sh, validar.sh
├── .agent/                # 🔮 Antigravity/Gemini compatibility
│   ├── skills/            # 5 skills (spec, plan, implement, review, security)
│   └── workflows/         # 4 workflows (/doncheli-start, pipeline, review, security)
├── CLAUDE.md              # Instrucciones para Claude Code
├── GEMINI.md              # Instrucciones para Google Antigravity
├── AGENTS.md              # Instrucciones cross-tool (Cursor, Codex)
├── prompt.md              # Instrucciones para Amp
├── NOTICE                 # Atribuciones
└── LICENCIA               # Apache 2.0
```

Después de instalar con un idioma, la estructura instalada usa los nombres localizados:

```
~/.claude/don-cheli/          # Instalación global
├── skills/                   # (o habilidades/ en ES, habilidades/ en PT)
├── rules/                    # (o reglas/ en ES, regras/ en PT)
├── templates/                # (o plantillas/ en ES, modelos/ en PT)
├── hooks/                    # (o ganchos/ en ES/PT)
├── agents/                   # (o agentes/ en ES/PT)
├── locales/                  # es.json, en.json, pt.json
├── locale                    # Archivo de 2 letras: "es", "en" o "pt"
├── folder-map.json           # Mapeo de nombres para Claude
├── CLAUDE.md
└── VERSION
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

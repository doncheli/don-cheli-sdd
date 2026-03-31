# Don Cheli — Arquitectura del Framework

## Visión general

Don Cheli es un framework de Desarrollo Dirigido por Especificaciones (SDD) que orquesta agentes de IA a través de archivos de instrucciones declarativos. No es una librería ni un runtime — es un conjunto de contratos que cualquier agente compatible puede implementar.

```
                    ┌─────────────────────┐
                    │     AGENTS.md       │  ← Contrato universal
                    │  (cross-tool core)  │
                    └────────┬────────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
     ┌────────▼───┐  ┌──────▼─────┐  ┌─────▼──────┐
     │  CLAUDE.md  │  │  GEMINI.md  │  │.cursorrules│
     │ Claude Code │  │ Antigravity │  │   Cursor   │
     └────────┬───┘  └──────┬─────┘  └─────┬──────┘
              │              │              │
              └──────────────┼──────────────┘
                             │
              ┌──────────────▼──────────────┐
              │        .especdev/           │
              │  (estado del proyecto)      │
              │  config.yaml, estado.md,    │
              │  plan.md, progreso.md       │
              └─────────────────────────────┘
```

## Decisiones de arquitectura (ADRs)

### ADR-001: Archivos de instrucciones como interfaz, no código

**Contexto:** Los agentes de IA (Claude, Gemini, Cursor, Codex) leen archivos de contexto al iniciar sesión. Cada herramienta tiene su propio archivo de instrucciones (`CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `AGENTS.md`).

**Decisión:** El framework se implementa enteramente como archivos Markdown que los agentes interpretan. No hay runtime, no hay binarios, no hay SDK.

**Consecuencias:**
- (+) Funciona en cualquier herramienta que lea Markdown de contexto
- (+) Cero dependencias de ejecución
- (+) El usuario puede leer, auditar y modificar todo el framework
- (+) Instalación = copiar archivos
- (-) El comportamiento depende de la capacidad de interpretación del agente
- (-) No hay garantías de ejecución exacta como con código compilado

---

### ADR-002: Inversión de dependencia de agentes

**Contexto:** El framework necesita funcionar con múltiples agentes (Claude Code, Antigravity, Cursor, Codex) sin acoplarse a ninguno. Cada agente tiene capacidades y sintaxis diferentes.

**Decisión:** Separar la lógica en capas con dependencia invertida:

```
┌─────────────────────────────────────────────────────────┐
│  Capa 3: Adaptadores de agente (dependen de Capa 2)    │
│  CLAUDE.md, GEMINI.md, .cursorrules, prompt.md          │
│  Implementan el contrato para cada herramienta          │
├─────────────────────────────────────────────────────────┤
│  Capa 2: Contrato universal (no depende de ningún       │
│          agente)                                        │
│  AGENTS.md — Leyes de hierro, reglas de desviación,     │
│  pipeline, quality gates                                │
├─────────────────────────────────────────────────────────┤
│  Capa 1: Conocimiento del dominio                       │
│  comandos/, habilidades/, reglas/, plantillas/           │
│  Lógica de negocio agnóstica del agente                 │
└─────────────────────────────────────────────────────────┘
```

**El contrato que todo adaptador debe cumplir:**

| Obligación | Descripción |
|------------|-------------|
| Leyes de hierro | Implementar TDD, debugging de causa raíz, verificación por evidencia |
| Reglas de desviación | Auto-corregir (1-3), parar y preguntar (4), registrar (5) |
| Pipeline SDD | Respetar la secuencia: specify → clarify → plan → breakdown → implement → review |
| Quality gates | Aplicar los 6 gates antes de considerar una tarea completa |
| i18n | Detectar idioma y comunicar en él; código siempre en inglés |
| Contexto on-demand | Leer archivos solo cuando se necesitan, no preventivamente |
| Selección de modelos | Usar el modelo más barato que cumpla la calidad requerida |

**Cada adaptador agrega:**

| Adaptador | Agrega |
|-----------|--------|
| `CLAUDE.md` | Auto-actualización, prefijos `/dc:*`, subagentes Haiku→Sonnet→Opus |
| `GEMINI.md` | Skills `@doncheli-*`, workflows `.agent/`, modelos Flash→Pro |
| `.cursorrules` | Tabla de comandos completa, niveles de complejidad 0-4, inline docs |
| `prompt.md` | Instrucciones mínimas para agentes sin archivo dedicado |

**Consecuencias:**
- (+) Agregar soporte para un nuevo agente = crear un archivo adaptador
- (+) Cambiar una ley de hierro se propaga a todos los agentes
- (+) Cada adaptador aprovecha las capacidades nativas de su herramienta
- (-) Requiere sincronización manual entre adaptadores al cambiar el contrato
- (-) Cada adaptador puede divergir si no se verifica

---

### ADR-003: Comandos como documentos ejecutables

**Contexto:** El framework tiene 72+ comandos que los agentes deben ejecutar. Los agentes no ejecutan binarios sino que interpretan instrucciones.

**Decisión:** Cada comando es un archivo Markdown con:
1. Frontmatter YAML (`description`, `i18n`)
2. Objetivo en lenguaje natural
3. Proceso paso a paso
4. Output esperado (template)
5. Guardrails (qué no hacer)

**Consecuencias:**
- (+) Los comandos son legibles por humanos y agentes
- (+) Versionables en git como cualquier código
- (+) El frontmatter permite indexación y búsqueda semántica
- (-) No hay tipado ni validación en tiempo de ejecución
- (-) Un agente puede interpretar pasos de forma diferente a otro

---

### ADR-004: Estado del proyecto en `.especdev/`

**Contexto:** Cada proyecto que usa Don Cheli necesita persistir estado entre sesiones (specs, planes, progreso, decisiones).

**Decisión:** Un directorio `.especdev/` en la raíz del proyecto con estructura fija:

```
.especdev/
├── config.yaml          # Configuración del proyecto
├── estado.md            # Estado actual (fase, tarea, bloqueadores)
├── plan.md              # Plan técnico activo
├── progreso.md          # Tracking de implementación
├── hallazgos.md         # Descubrimientos durante el trabajo
├── propuesta.md         # Propuesta de cambio actual
├── specs/               # Especificaciones Gherkin
├── blueprints/          # Blueprints técnicos
├── seguridad/           # Auditorías de seguridad
└── memoria/
    └── decisiones/      # ADRs del proyecto (ADR-###.md)
```

**Consecuencias:**
- (+) Cualquier agente puede leer/escribir el estado
- (+) Transferencia de contexto entre sesiones sin pérdida
- (+) Los nombres de archivos se localizan (es/en/pt) vía `folder-map.json`
- (-) El usuario debe commitear `.especdev/` o excluirlo según su preferencia

---

### ADR-005: Instalación dual (global vs local)

**Contexto:** Algunos usuarios quieren Don Cheli disponible en todos sus proyectos; otros solo en proyectos específicos.

**Decisión:** Dos modos de instalación con la misma estructura:

| Modo | Path framework | Path comandos |
|------|---------------|---------------|
| Global | `~/.claude/don-cheli/` | `~/.claude/commands/` |
| Local | `./.claude/don-cheli/` | `./.claude/commands/` |

**Consecuencias:**
- (+) Global: instalar una vez, usar en todos los proyectos
- (+) Local: control por proyecto, no afecta otros repos
- (-) Dos paths que verificar al buscar el framework
- (-) Posible conflicto si existe instalación global y local

---

### ADR-006: i18n por copia, no por runtime

**Contexto:** El framework soporta 3 idiomas (es/en/pt). Los agentes no tienen un i18n runtime disponible.

**Decisión:** El instalador copia los archivos en el idioma seleccionado. Los nombres de carpetas se localizan (`habilidades/` vs `skills/` vs `habilidades/`). Un `folder-map.json` mapea nombres lógicos a nombres físicos.

**Consecuencias:**
- (+) Cero overhead en runtime — el agente lee archivos en su idioma
- (+) Funciona sin dependencias (no necesita i18n library)
- (-) Cambiar de idioma requiere reinstalar
- (-) 3x archivos de instrucciones raíz (CLAUDE.md, CLAUDE.en.md, CLAUDE.pt.md)

---

### ADR-007: Selección de modelos como política, no como código

**Contexto:** Los agentes tienen acceso a múltiples modelos con costos y capacidades diferentes. Usar siempre el modelo más potente es un desperdicio.

**Decisión:** Definir políticas de selección de modelo por tipo de tarea en cada adaptador:

| Tarea | Claude | Antigravity |
|-------|--------|-------------|
| Q&A, scripting, batch | Haiku | Flash |
| Código, tests, review | Sonnet | Pro |
| Arquitectura, seguridad | Opus (con confirmación) | Pro |

**Regla universal:** Empezar con el modelo más barato. Subir solo si la calidad es insuficiente. Nunca usar el modelo premium para tareas simples.

**Consecuencias:**
- (+) Reduce costos significativamente
- (+) Cada adaptador usa los modelos nativos de su plataforma
- (-) La política es advisory — el agente puede ignorarla

## Principios de diseño

1. **Markdown como interfaz universal.** Si un agente puede leer Markdown, puede usar Don Cheli.
2. **Inversión de dependencia.** El framework no depende de ningún agente; los adaptadores dependen del contrato.
3. **On-demand, no eager.** Leer archivos cuando se necesitan, no al inicio.
4. **El modelo más barato que funcione.** Haiku/Flash primero, escalar solo si falla.
5. **Estado explícito en archivos.** Nada implícito, nada en memoria volátil.
6. **Retrocompatible por defecto.** Los alias (`/dc:*` → `/dc:*`) sobreviven a los renames.

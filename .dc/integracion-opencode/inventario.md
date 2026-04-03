# Inventario de Integración: don-cheli-sdd → OpenCode Framework

## Stack Actual (don-cheli-sdd)

### Estructura de Framework

```
don-cheli-sdd/
├── .opencode/
│   ├── agents/doncheli.md          # ✅ Agent definition (existe)
│   ├── README.md                    # Documentación parcial
│   └── bun.lock, node_modules, package.json
├── .agent/
│   ├── skills/
│   │   ├── doncheli-spec/SKILL.md   # 27 skills con SKILL.md
│   │   ├── doncheli-review/SKILL.md
│   │   ├── doncheli-implement/SKILL.md
│   │   └── ... (24 más)
│   └── workflows/
│       ├── doncheli-debate.md
│       ├── doncheli-estimate.md
│       ├── doncheli-migrate.md
│       ├── doncheli-pipeline.md
│       └── ... (5 más)
├── habilidades/
│   ├── arnes-agente/HABILIDAD.md    # 43 habilidades en español
│   ├── auto-correccion/HABILIDAD.md
│   ├── brainstorming/HABILIDAD.md
│   └── ...
├── agentes/
│   └── prompts/                    # 5 directorios de prompts
├── reglas/
│   ├── constitucion.md
│   ├── leyes-hierro.md
│   ├── i18n.md
│   ├── puertas-calidad.md
│   └── ...
├── comandos/
│   └── (vacío o minimal)
└── ganchos/
    ├── parar.md                     # 6 hooks en español
    └── ...
```

### Alcance de Componentes

| Tipo | Cantidad | Formato | Ubicación Actual |
|------|----------|---------|------------------|
| Agent | 1 | `.md` | `.opencode/agents/doncheli.md` ✅ |
| Skills (EN) | 27 | `SKILL.md` | `.agent/skills/doncheli-*` ❌ |
| Skills (ES) | 43 | `HABILIDAD.md` | `habilidades/*/` |
| Workflows | 9 | `.md` | `.agent/workflows/doncheli-*` ❌ |
| Rules | 8+ | `.md` | `reglas/` |
| Hooks | 6 | `.md` | `ganchos/` |
| Commands | 72+ | `.md` | `comandos/` (vacío) |

---

## Stack Objetivo (OpenCode)

OpenCode espera:

```
.opencode/
├── skills/<name>/SKILL.md      # Skills en inglés
├── agents/<name>.md            # Agent definitions
├── command/<name>.md           # Slash commands
├── tool/<name>.ts              # Tool definitions
├── modes/<name>.md             # Mode definitions
├── plugins/                    # Plugin system
└── opencode.jsonc              # Config
```

---

## Análisis de Equivalencias

| Concepto don-cheli | Concepto opencode | Equivalencia |
|-------------------|-------------------|--------------|
| `.agent/skills/doncheli-*` | `.opencode/skills/<name>/SKILL.md` | **Mismatch de ruta** |
| `.agent/workflows/*.md` | `.opencode/modes/*.md` | Workflows → Modes |
| `reglas/*.md` | `AGENTS.md` / `.opencode/agents/` | Consolidar en agent |
| `comandos/` | `.opencode/command/` | Commands no definidos |
| `ganchos/*.md` | (no hay equivalente) | Hooks no soportados |
| `habilidades/*/HABILIDAD.md` | `.opencode/skills/<name>/SKILL.md` | Traducir + mover |

---

## Problemas Detectados

### 🔴 Críticos (bloquean integración)

1. **Skills en ubicación incorrecta**: `.agent/skills/` vs `.opencode/skills/`
2. **Skills en español (HABILIDAD.md)**: OpenCode espera SKILL.md en inglés
3. **Commands no definidos**: Los 72+ comandos `/dc:*` no existen en formato opencode

### 🟡 Warnings (degradan funcionalidad)

4. **Workflows sin mapeo claro**: `.agent/workflows/` → `.opencode/modes/`
5. **Reglas en español**: `reglas/` deben consolidarse en `AGENTS.md`
6. **Hooks sin equivalente**: `ganchos/parar.md` no tiene mapeo en opencode

---

## Criterios de Completitud

| Componente | Mínimo Viable | Completo |
|------------|----------------|----------|
| Agent | ✅ doncheli.md existe | ✅ |
| Skills | 5-10 skills principales | 27 + 43 = 70 total |
| Commands | 10-15 comandos | 72+ comandos |
| Rules | Iron laws + constitution | 8+ archivos |
| Workflows | Pipeline básico | 9 workflows |

---

## Siguiente Paso

Generar **plan de integración** con:
1. Fase 1: Migración de skills (ubicación + traducción)
2. Fase 2: Definición de commands
3. Fase 3: Consolidadón de rules en agent
4. Fase 4: Validación end-to-end

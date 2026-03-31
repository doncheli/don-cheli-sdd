# Guía rápida de `/memory` en Claude Code

## ¿Qué es?

`/memory` es la memoria persistente de Claude Code. Lo que Claude aprende en una sesión lo recuerda en la siguiente. Sin tener que repetir instrucciones cada vez.

## ¿Cómo lo activo?

Ya viene activo por defecto. Solo verifica con `/memory` en cualquier sesión y te muestra qué hay guardado.

## 3 formas de usarlo

### 1. Dile que recuerde algo

```
"Recuerda que siempre uso pnpm, no npm"
"Recuerda que los tests van en __tests__/ no en test/"
"Recuerda que el deploy es con fury deploy, no con npm run deploy"
```

### 2. Corrígelo — aprende automáticamente

```
"No, no hagas eso. Siempre usa interfaces, no types"
→ Claude lo guarda como feedback para no volver a meter la pata
```

### 3. Edita directamente los archivos

```
~/.claude/projects/<tu-proyecto>/memory/
├── MEMORY.md        ← índice (máx 200 líneas, se carga siempre)
├── preferencias.md  ← tus gustos y preferencias
└── proyecto.md      ← estado actual del proyecto
```

Son archivos Markdown normales. Puedes editarlos con cualquier editor.

## 5 cosas que TODOS deberían guardar

| Qué guardar | Ejemplo |
|-------------|---------|
| Tu rol | "Soy backend dev, no me meto con frontend" |
| Stack del proyecto | "Usamos Node 20, PostgreSQL, Redis" |
| Convenciones del equipo | "Los PRs van a develop, nunca directo a main" |
| Lo que NO debe hacer | "Nunca hagas mock de la base de datos en tests de integración" |
| Comandos frecuentes | "Para correr tests: `npm run test:integration`" |

## 4 tips para que rinda al máximo

### 1. Mantén el CLAUDE.md corto (< 60 líneas)

Si se te pone muy largo, mueve secciones a `~/.claude/rules/`. Claude carga CLAUDE.md siempre en cada sesión, pero los rules/ los lee solo cuando hacen falta.

### 2. No repitas información

Si algo ya está en CLAUDE.md, no lo pongas también en memoria. Una sola fuente de verdad y listo.

### 3. Sé específico

- Bien: "Usa 2 espacios de indentación"
- Mal: "Formatea bien el código"

Mientras más concreto, mejor funciona.

### 4. Limpia de vez en cuando

Corre `/memory`, revisa qué hay, y borra lo que ya no aplique. Memoria vieja = tokens desperdiciados = Claude más lento y menos preciso.

## Cheat sheet

| Acción | Cómo |
|--------|------|
| Ver memoria | `/memory` |
| Guardar algo | "Recuerda que..." |
| Borrar algo | "Olvida que..." o edita el archivo directo |
| Ver archivos | `ls ~/.claude/projects/*/memory/` |
| Desactivar | `"autoMemoryEnabled": false` en settings |

## Estructura recomendada de archivos

```
~/.claude/
├── CLAUDE.md              # Reglas globales (~50 líneas)
├── rules/
│   ├── model-selection.md # Qué modelo usar para cada cosa
│   └── quality.md         # Reglas de calidad y PRs
└── projects/
    └── <tu-proyecto>/
        └── memory/
            ├── MEMORY.md          # Índice (4-5 líneas)
            ├── user_profile.md    # Quién eres, qué haces
            ├── feedback.md        # Correcciones y preferencias
            └── project_status.md  # Estado del proyecto
```

## ¿Cómo verifico que está funcionando?

1. Abre una sesión nueva de Claude Code
2. Escribe `/memory`
3. Deberías ver la lista de archivos de memoria y su contenido
4. Si ves todo vacío, empieza diciéndole: "Recuerda que soy [tu rol] y trabajo en [tu proyecto]"

---

*Guía creada para el equipo de desarrollo. Cualquier duda, escribe en el canal del equipo.*

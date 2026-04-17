---
nombre: Slop Detector
descripcion: "Detecta y elimina patrones de AI slop en código y diseño — código genérico, sobre-engineered, placeholder, o visualmente cliché que delata código generado por IA sin revisión humana."
version: 1.0.0
autor: Don Cheli (concepto de gstack)
tags: [quality, slop, ai, detection, cleanup, code-quality, design-quality]
activacion: "slop detection", "AI slop", "detectar slop", "clean AI code", "limpiar código IA", "slop scan"
grado_libertad: bajo
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

# Slop Detector — Detectar y Eliminar Código IA Genérico

## Qué es AI Slop

"Slop" es código o diseño generado por IA que se ve genérico, sobre-engineered, o placeholder. Es el equivalente visual/código de un stock photo — técnicamente correcto pero sin personalidad ni criterio humano.

## Patrones de Slop en Código

### 1. Over-engineering
```
BUSCAR:
- Abstracciones innecesarias (BaseAbstractFactory para una sola implementación)
- Interfaces con una sola implementación
- Generic types donde un tipo concreto bastaría
- Design patterns aplicados sin necesidad (Observer para 1 listener)
- Wrapper classes que solo delegan
```

### 2. Placeholder Code
```
BUSCAR:
- // TODO: implement
- // FIXME: handle error
- throw new Error("Not implemented")
- console.log("DEBUG:")
- pass  # Python placeholder
- return nil  // Go placeholder
- Lorem ipsum en cualquier string
```

### 3. Defensive Overkill
```
BUSCAR:
- try/catch que captura Exception genérico y lo ignora
- Null checks en parámetros que nunca pueden ser null
- Validación duplicada (frontend + backend + database + middleware)
- Error handling para errores que no pueden ocurrir
- Fallbacks para features que no existen
```

### 4. Verbose Comments
```
BUSCAR:
- // This function does X (cuando el nombre ya lo dice)
- // Initialize the variable (obvia)
- // Return the result (obvia)
- JSDoc que repite el nombre de la función
- Comentarios que describen el "qué" en vez del "por qué"
```

### 5. Copy-paste Patterns
```
BUSCAR:
- Bloques de código repetidos 3+ veces sin abstracción
- Imports no usados
- Variables declaradas pero no usadas
- Funciones exportadas pero no importadas en ningún lado
```

## Patrones de Slop en Diseño

### 1. Visual Clichés
```
BUSCAR:
- Gradientes purple/violet como accent default
- Grid de 3 columnas con iconos en círculos coloreados
- Centrar TODO con spacing uniforme
- Border-radius bubbly uniforme (rounded-2xl everywhere)
- Botones gradient como CTA principal
- Hero sections con foto stock
- Copy "Built for X" / "Designed for Y"
```

### 2. Framework Defaults
```
BUSCAR:
- Colores default de Tailwind sin customizar (#3b82f6, #8b5cf6)
- Estilos default de shadcn/ui sin personalizar
- Bootstrap default sin override
- Material UI sin theme customization
```

### 3. Generic Layout
```
BUSCAR:
- Sidebar + header + content sin variación
- Dashboard con 4 stat cards en una fila
- Table con columnas ID, Name, Status, Actions
- Footer con 4 columnas de links
```

## Comandos de Escaneo

```bash
# Scan código por slop patterns
grep -rn "// TODO\|// FIXME\|Not implemented\|PLACEHOLDER\|Lorem ipsum" \
  --include="*.ts" --include="*.js" --include="*.py" --include="*.go" \
  . | grep -v node_modules | grep -v .dc | grep -v dist

# Imports no usados (TypeScript)
npx tsc --noEmit 2>&1 | grep "is declared but"

# Funciones no usadas
grep -rn "export function\|export const" --include="*.ts" --include="*.js" . | \
  while read line; do
    func=$(echo "$line" | grep -o "function [a-zA-Z]*\|const [a-zA-Z]*" | awk '{print $2}')
    if [ -n "$func" ]; then
      count=$(grep -rn "$func" --include="*.ts" --include="*.js" . | grep -v "export" | wc -l)
      [ "$count" -eq 0 ] && echo "UNUSED: $line"
    fi
  done

# Colores hardcodeados (no variables CSS)
grep -rn "color:\s*#\|background:\s*#" --include="*.css" --include="*.tsx" --include="*.jsx" . | \
  grep -v "var(--" | grep -v node_modules | grep -v .dc

# Colores default de Tailwind sin personalizar
grep -rn "bg-blue-500\|bg-purple-500\|bg-indigo-500\|text-blue-600" \
  --include="*.tsx" --include="*.jsx" --include="*.html" . | grep -v node_modules
```

## Reporte

```markdown
# Slop Report

## Score: [CLEAN / MINOR SLOP / SIGNIFICANT SLOP / MAJOR SLOP]

### Code Slop
| Pattern | Count | Files |
|---------|-------|-------|
| TODO/FIXME stubs | 3 | auth.ts, api.ts |
| Unused exports | 2 | utils.ts |
| Over-engineered | 1 | BaseFactory.ts |

### Design Slop
| Pattern | Count | Location |
|---------|-------|----------|
| Default Tailwind colors | 5 | Dashboard.tsx |
| Generic grid layout | 1 | Features section |

### Recommendations
1. [CRITICAL] Remove 3 TODO stubs — implement actual logic
2. [IMPORTANT] Customize Tailwind colors to match DESIGN.md
3. [MINOR] Remove unused exports from utils.ts
```

## Integración con Pipeline

El slop detector se ejecuta automáticamente en la fase `/dc:revisar` como parte del quality gate. Score de MAJOR SLOP bloquea el merge.

## Principio

> "Bad work is worse than no work." — El código con slop no es código terminado. Es código que parece terminado pero que va a causar problemas. Mejor no tenerlo que tenerlo mal.

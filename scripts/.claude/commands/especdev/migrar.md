---
description: Planificar y ejecutar migración entre stacks tecnológicos o versiones mayores
i18n: true
---

# /dc:migrar

## Objetivo

Planificar y ejecutar migraciones de stacks tecnológicos (Vue→React, Express→Fastify) o actualizaciones de versiones mayores (Next.js 14→15, Python 3.9→3.12), minimizando riesgo de regresión.

## Uso

```
/dc:migrar --de "Vue 3" --a "React 19"
/dc:migrar --de "Express 4" --a "Fastify 5"
/dc:migrar --de "Next.js 14" --a "Next.js 15"
/dc:migrar --de "Python 3.9" --a "Python 3.12"
/dc:migrar --de "REST" --a "GraphQL"
/dc:migrar --de "JavaScript" --a "TypeScript"
/dc:migrar --solo-plan                          # Solo generar plan, no ejecutar
```

## Tipos de Migración

| Tipo | Ejemplo | Riesgo | Enfoque |
|------|---------|--------|---------|
| **Framework** | Vue→React, Django→FastAPI | Alto | Rewrite incremental |
| **Versión mayor** | Next 14→15, Angular 17→19 | Medio | Upgrade guiado por changelog |
| **Lenguaje** | JS→TS, Python 2→3 | Alto | Codemods + revisión manual |
| **Paradigma** | REST→GraphQL, Monolito→Micro | Muy alto | Strangler Fig pattern |
| **Base de datos** | MySQL→PostgreSQL, Mongo→PG | Alto | Dual-write + migración |

## Proceso (6 fases)

### Fase 1: Inventario (automático)

Mapear el estado actual del proyecto:

```markdown
## Inventario de Migración: Vue 3 → React 19

### Stack Actual
- Framework: Vue 3.4 + Composition API
- Estado: Pinia 2.1
- Router: vue-router 4.3
- UI: Vuetify 3
- Build: Vite 5
- Tests: Vitest + Vue Test Utils

### Alcance
- Componentes: 47
- Stores: 8
- Rutas: 23
- Tests: 112
- LOC: 12,400

### Dependencias Vue-Específicas
| Dependencia | Alternativa React | Complejidad |
|-------------|-------------------|-------------|
| Pinia | Zustand / Redux Toolkit | Baja |
| vue-router | React Router v7 | Media |
| Vuetify | shadcn/ui + TailwindCSS | Alta |
| Vue Test Utils | React Testing Library | Media |
| Composables (12) | Custom hooks | Baja |
```

### Fase 2: Mapa de Equivalencias

Traducir conceptos entre ecosistemas:

```markdown
## Equivalencias Vue → React

| Vue | React | Notas |
|-----|-------|-------|
| `<template>` | JSX | Diferente sintaxis, misma función |
| `ref()` / `reactive()` | `useState()` | Reactividad automática vs explícita |
| `computed()` | `useMemo()` | Semántica similar |
| `watch()` / `watchEffect()` | `useEffect()` | Cuidado con el array de deps |
| `onMounted()` | `useEffect(() => {}, [])` | Lifecycle → effects |
| `provide/inject` | `Context API` | Para estado compartido profundo |
| `v-if` / `v-for` | `{condition && ...}` / `.map()` | JSX condicional |
| `v-model` | `value` + `onChange` | Two-way vs one-way binding |
| Pinia store | Zustand store | API muy similar |
| `<slot>` | `children` / `render props` | Composición de componentes |
| Directive (`v-tooltip`) | HOC o hook | Sin equivalente directo |
| `<Transition>` | `framer-motion` | Animaciones |
```

### Fase 3: Estrategia de Migración

Elegir enfoque según riesgo:

#### Opción A: Big Bang (riesgo alto, rápido)
```
Reescribir todo de una vez.
✅ Para: proyectos pequeños (< 20 componentes)
❌ No para: proyectos en producción con usuarios activos
```

#### Opción B: Strangler Fig (riesgo bajo, gradual) ← Recomendado
```
Migrar componente por componente, coexistiendo ambos frameworks.

Fase 1: Setup React junto a Vue (micro-frontend o iframe)
Fase 2: Migrar componentes leaf (sin hijos Vue)
Fase 3: Migrar componentes intermedios
Fase 4: Migrar componentes root
Fase 5: Remover Vue
```

#### Opción C: Parallel Run (riesgo medio)
```
Construir la versión React en paralelo, switchear cuando esté lista.
✅ Para: aplicaciones críticas que no pueden tener downtime
❌ Costoso en tiempo (mantener dos codebases)
```

### Fase 4: Plan de Migración

Genera `.especdev/migracion/plan-migracion.md`:

```markdown
## Plan de Migración: Vue → React

### Orden de Migración (por dependencias)

#### Wave 1: Infraestructura (sin UI)
- [ ] M001: Setup React + Vite + TypeScript
- [ ] M002: Configurar React Router (mapear rutas existentes)
- [ ] M003: Configurar Zustand (mapear stores Pinia)
- [ ] M004: Setup React Testing Library

#### Wave 2: Componentes Atómicos (sin dependencias internas)
- [ ] M005: Migrar Button, Input, Modal (Vuetify → shadcn/ui)
- [ ] M006: Migrar layout components (Header, Sidebar, Footer)
- [ ] M007: Tests para componentes migrados

#### Wave 3: Componentes con Estado
- [ ] M008: Migrar stores Pinia → Zustand (uno por uno)
- [ ] M009: Migrar composables → custom hooks
- [ ] M010: Migrar formularios con validación

#### Wave 4: Páginas y Rutas
- [ ] M011: Migrar páginas leaf (sin sub-rutas)
- [ ] M012: Migrar páginas con sub-rutas
- [ ] M013: Migrar guards de ruta → loader/middleware

#### Wave 5: Cleanup
- [ ] M014: Remover dependencias Vue
- [ ] M015: Actualizar CI/CD
- [ ] M016: Actualizar documentación

### Tests de Regresión por Wave
Cada wave ejecuta:
1. Tests unitarios de componentes migrados
2. Tests de integración de rutas migradas
3. Tests end-to-end del flujo completo
4. Comparación visual (screenshot diff) si aplica
```

### Fase 5: Ejecución

Cada tarea de migración sigue el ciclo:

```
1. Leer componente/módulo Vue
2. Mapear a equivalencia React
3. Escribir test React (RED)
4. Implementar componente React (GREEN)
5. Verificar paridad funcional
6. Commit atómico: "migrate: ComponentName Vue→React"
```

### Fase 6: Verificación Post-Migración

```markdown
## Checklist Post-Migración

### Funcionalidad
- [ ] Todas las rutas funcionan
- [ ] Formularios envían datos correctamente
- [ ] Estado se persiste entre navegaciones
- [ ] Auth flow completo funciona

### Rendimiento
- [ ] Bundle size ≤ original (o justificar)
- [ ] LCP ≤ original
- [ ] No memory leaks en SPA navigation

### Calidad
- [ ] Coverage de tests ≥ original
- [ ] 0 dependencias Vue restantes
- [ ] Sin TODOs de migración pendientes
- [ ] CI/CD actualizado y pasando
```

## Formato de Commits de Migración

```
migrate: <componente/módulo> <origen>→<destino>
migrate: Button component Vue→React
migrate: auth store Pinia→Zustand
migrate: /dashboard route vue-router→react-router
```

## Almacenamiento

```
.especdev/migracion/
├── inventario.md          # Estado actual del proyecto
├── equivalencias.md       # Mapa de traducciones
├── plan-migracion.md      # Plan con waves y tareas
├── progreso-migracion.md  # Tracking de avance
└── post-migracion.md      # Checklist de verificación
```

## Integración con Pipeline

```
/dc:migrar → inventario + equivalencias + plan
  → /dc:poc (opcional) → validar enfoque en módulo piloto
  → /dc:implementar → ejecutar por waves
  → /dc:auditar-seguridad → verificar que migración no introduce vulnerabilidades
  → /dc:revisar → review final
```

## Guardrails

- **Nunca** migrar sin tests de regresión del sistema original
- **Nunca** migrar todo de una vez en proyectos en producción (usar Strangler Fig)
- **Siempre** mantener paridad funcional (no agregar features durante migración)
- **Siempre** commit atómico por componente/módulo migrado
- **Siempre** verificar rendimiento post-migración (bundle size, LCP)
- **Siempre** ejecutar tests e2e del flujo completo después de cada wave
- Si la migración afecta > 30% del codebase → confirmar con usuario antes de cada wave

# React Dashboard — Don Cheli SDD Example

> Ejemplo completo del ciclo de vida SDD con **React + TypeScript**.

## Qué demuestra

Este ejemplo muestra cómo Don Cheli guía la construcción de un dashboard de métricas usando el pipeline completo:

```
/dc:comenzar "Dashboard de métricas con React, TypeScript, Tailwind y gráficos"
```

## Pipeline ejecutado

| Fase | Comando | Resultado |
|------|---------|-----------|
| 1. Especificar | `/dc:especificar` | 10 escenarios Gherkin (6 P1, 3 P2, 1 P3) |
| 2. Clarificar | `/dc:clarificar` | 4 ambigüedades resueltas, contrato UI definido |
| 3. Planificar | `/dc:planificar-tecnico` | Blueprint component tree + API contracts |
| 4. Desglosar | `/dc:desglosar` | 8 tareas TDD con paralelismo |
| 5. Implementar | `/dc:implementar` | Código + tests, 88% cobertura |
| 6. Revisar | `/dc:revisar` | 7/7 dimensiones aprobadas |

## Stack

- **Framework:** React 19 + TypeScript 5.5
- **Estilos:** Tailwind CSS 4
- **Gráficos:** Recharts 2
- **State:** Zustand 5
- **Fetch:** TanStack Query 5
- **Tests:** Vitest + Testing Library
- **Build:** Vite 6

## Nivel detectado

**Nivel 2 — Estándar** (múltiples archivos, 1-3 días)

## Artefactos generados

```
.especdev/
├── config.yaml              # Configuración del proyecto
├── estado.md                # Estado: Completado (100%)
├── specs/
│   └── dashboard.feature    # 10 escenarios Gherkin
├── blueprints/
│   └── dashboard-blueprint.md  # Arquitectura + component tree
└── tareas/
    └── dashboard-tasks.md   # 8 tareas TDD con dependencias
```

## Cómo reproducir

```bash
# 1. Instalar Don Cheli
bash scripts/instalar.sh --global

# 2. Crear proyecto React
npm create vite@latest mi-dashboard -- --template react-ts
cd mi-dashboard
npm install recharts zustand @tanstack/react-query tailwindcss

# 3. Inicializar Don Cheli y ejecutar
/dc:iniciar --tipo frontend --nombre "mi-dashboard"
/dc:comenzar "Dashboard de métricas con gráficos de línea, barras y KPI cards"
```

## Comandos especiales usados

- `/dc:contrato-ui` — Definió el design system (paleta, tipografía, spacing) antes de codear
- `/dc:mesa-tecnica` — El panel decidió Zustand sobre Context API para estado global
- `/dc:reflexionar` — Mejoró la estructura de componentes después de la primera iteración

## Lecciones aprendidas

- El **contrato UI** previno 3 refactorizaciones de estilos al bloquear la paleta antes de implementar
- La fase de **Clarificar** detectó que "gráficos" era ambiguo → se definieron 3 tipos: línea (tendencia), barras (comparación), KPI cards (snapshot)
- Las tareas T1+T2+T3 se ejecutaron en **paralelo** (componentes base son independientes)
- El **peer review** detectó que un componente violaba SOLID → se extrajo un hook `useMetrics`

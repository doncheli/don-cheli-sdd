# Blueprint Técnico — React Dashboard

## Decisiones de Stack

| Componente | Elección | Justificación |
|-----------|----------|---------------|
| Framework | React 19 | Concurrent features, Server Components ready |
| Lenguaje | TypeScript 5.5 | Type safety, mejor DX |
| Estilos | Tailwind CSS 4 | Utility-first, design tokens |
| Gráficos | Recharts 2 | React-native, composable, ligero |
| Estado global | Zustand 5 | Simple, sin boilerplate, performante |
| Data fetching | TanStack Query 5 | Cache, retry, dedup, stale-while-revalidate |
| Tests | Vitest + Testing Library | Fast, compatible con Vite, accesibilidad |
| Build | Vite 6 | HMR instantáneo, tree-shaking |

## Arquitectura — Component Tree

```
App
├── Layout
│   ├── Header (título + filtro de fechas)
│   └── Main
│       ├── KPISection
│       │   ├── KPICard (x4)
│       │   └── KPICardSkeleton (x4, loading)
│       ├── ChartsSection
│       │   ├── LineChart (tendencia mensual)
│       │   ├── BarChart (comparación categorías)
│       │   └── ChartSkeleton (loading)
│       └── ErrorBoundary
│           └── ErrorFallback (retry button)
├── Providers
│   ├── QueryClientProvider
│   └── Zustand Store
└── hooks/
    ├── useMetrics()      → TanStack Query wrapper
    ├── useDateRange()    → Zustand + localStorage
    └── useExportCSV()    → descarga de datos
```

## Contrato UI (via /dc:contrato-ui)

| Token | Valor |
|-------|-------|
| Primary | `#6c5ce7` |
| Success | `#00cec9` |
| Danger | `#ff6b6b` |
| Background | `#0a0a0f` |
| Card BG | `#12121a` |
| Font | Inter, system-ui |
| Border Radius | 12px (cards), 8px (buttons) |
| Spacing | 4px base, escala x2 |

## API Contract

```typescript
// GET /api/metrics?range=3m
interface MetricsResponse {
  kpis: KPI[];
  trend: TrendPoint[];
  categories: CategoryBar[];
}

interface KPI {
  title: string;
  value: number;
  change: number; // porcentaje, puede ser negativo
  unit: string;
}

interface TrendPoint {
  month: string; // "Ene", "Feb"...
  value: number;
}

interface CategoryBar {
  name: string;
  value: number;
}
```

## Chequeo de Constitución

| Artículo | Estado |
|----------|--------|
| I. Gherkin es Rey | ✅ 10 escenarios verificables |
| II. Precisión Quirúrgica | ✅ Cambio mínimo viable |
| III. Plug-and-Play | ✅ Componentes independientes |
| IV. Tests Aislados | ✅ MSW para mock de API |
| V. Estándares Modernos | ✅ TypeScript strict, Tailwind |
| VI. Adaptabilidad | ✅ React + Vite detectado |
| VII. Codificación Defensiva | ✅ ErrorBoundary, loading states |
| VIII. Clarificación | ✅ Auto-QA limpio |

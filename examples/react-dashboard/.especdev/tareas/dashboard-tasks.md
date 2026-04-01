# Tareas TDD — React Dashboard

## Mapa de dependencias

```
T1 [P] + T2 [P] + T3 [P]  →  T4  →  T5 [P] + T6 [P]  →  T7  →  T8
(types)  (KPICard) (Charts)   (hook)  (store)  (filters)   (page)  (e2e)
```

## Fases de ejecución

### Fase 1: Componentes base (paralelo)

**T1 — Types + API contract** `[P]`
- Test: verificar que los tipos compilan y los mocks conforman el contrato
- Código: `types/metrics.ts`, `mocks/metrics.ts`
- Cobertura esperada: 100%

**T2 — KPICard component** `[P]`
- Test: renderiza título, valor, variación; verde si positivo, rojo si negativo; skeleton en loading
- Código: `components/KPICard.tsx`, `components/KPICardSkeleton.tsx`
- Cobertura esperada: 95%

**T3 — Chart components** `[P]`
- Test: renderiza LineChart con datos mock, renderiza BarChart, tooltip funciona
- Código: `components/LineChart.tsx`, `components/BarChart.tsx`, `components/ChartSkeleton.tsx`
- Cobertura esperada: 85%

### Fase 2: Data layer

**T4 — useMetrics hook**
- Depende de: T1
- Test: retorna datos mock, maneja loading/error states, refresca con nuevo rango
- Código: `hooks/useMetrics.ts` (TanStack Query wrapper)
- Cobertura esperada: 90%

### Fase 3: Estado y filtros (paralelo)

**T5 — Zustand store** `[P]`
- Depende de: T4
- Test: date range persiste en localStorage, actualización reactiva
- Código: `store/dashboard.ts`
- Cobertura esperada: 100%

**T6 — DateRangeFilter component** `[P]`
- Depende de: T4
- Test: opciones de rango, selección actualiza store, persiste en reload
- Código: `components/DateRangeFilter.tsx`
- Cobertura esperada: 90%

### Fase 4: Página completa

**T7 — DashboardPage**
- Depende de: T2, T3, T5, T6
- Test: renderiza layout completo, loading state, error state con retry, responsive
- Código: `pages/DashboardPage.tsx`, `components/ErrorFallback.tsx`
- Cobertura esperada: 85%

### Fase 5: Integración

**T8 — Tests de integración**
- Depende de: T7
- Test: flujo completo con MSW, coincide con escenarios Gherkin P1
- Cobertura esperada: 88% global

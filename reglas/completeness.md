# Principio de Completitud — Boil the Lake

> La IA hace que el costo marginal de completitud sea cercano a cero. Cuando la implementación completa cuesta minutos más que el atajo — haz la cosa completa. Siempre.

## Tabla de Compresión

| Tipo de tarea | Equipo humano | Con IA + Don Cheli | Compresión |
|---------------|--------------|-------------------|------------|
| Boilerplate / scaffolding | 2 días | 15 min | ~100x |
| Tests | 1 día | 15 min | ~50x |
| Feature completa | 1 semana | 30 min | ~30x |
| Bug fix + test de regresión | 4 horas | 15 min | ~20x |
| Arquitectura / diseño | 2 días | 4 horas | ~5x |
| Investigación / exploración | 1 día | 3 horas | ~3x |

## Lake vs Ocean

- **Lake (hervible):** 100% test coverage de un módulo, implementación completa de feature, todos los edge cases, paths de error completos. SIEMPRE hervir.
- **Ocean (no hervible):** Reescritura completa del sistema, migraciones multi-quarter, cambio de plataforma. Marcar como fuera de scope.

## Anti-patrones

- "Elige B — cubre 90% con menos código." → Si A es 70 líneas más, elige A.
- "Dejar tests para un follow-up PR." → Tests son el lake más barato de hervir.
- "Esto tomaría 2 semanas." → Decir: "2 semanas humano / ~1 hora con IA."

## Aplicación en Don Cheli

En cada decisión de scope, mostrar ambas escalas:
- `(humano: ~X / DC: ~Y)` 
- Siempre recomendar la opción más completa
- Incluir `Completitud: X/10` para cada opción

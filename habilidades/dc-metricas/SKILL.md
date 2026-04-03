---
name: dc-metricas
description: Ver resumen de métricas de eficiencia SDD en terminal
i18n: true
---

## Qué hace
Muestra un resumen compacto de las métricas SDD del proyecto directamente en la terminal.
## Fuente de datos
Lee `.dc/metrics.json` que se actualiza automáticamente en cada sesión.
## Output en terminal
```
═══════════════════════════════════════════
  Don Cheli SDD — Métricas del Proyecto
═══════════════════════════════════════════
  📊 Sesiones:    12 completadas (prom. 38 min)
  ✅ Quality Gates: 94% aprobación a la primera
  🧪 TDD Acierto:  87% tests pasan al primer intento
  📈 Cobertura:    91% (objetivo: 85%)
  🔍 Stubs:       3 detectados, 3 eliminados
  🛡️  OWASP:       0 críticos, 2 warnings
  📐 Estimación:   ±15% desviación promedio
  Modelo más preciso: Planning Poker IA (±8%)
  Feature más rápida: auth-jwt (1.2h vs 2h estimado)
═══════════════════════════════════════════
```
## Subcomandos
```bash
/dc:metricas              # Resumen completo
/dc:metricas --tdd        # Solo métricas de TDD
/dc:metricas --owasp      # Solo métricas de seguridad
/dc:metricas --estimados  # Solo precisión de estimados
```

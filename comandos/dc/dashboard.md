---
description: Generar dashboard HTML local con métricas de eficiencia del proyecto SDD
---

# /dc:dashboard — Dashboard de Métricas SDD

## Qué hace

Genera un archivo `dashboard.html` interactivo con las métricas acumuladas del proyecto.

## Fuente de datos

Lee `.dc/metrics.json` que se actualiza automáticamente al cerrar cada sesión.

## Métricas que muestra

### Eficiencia del pipeline
- **Tiempo por fase:** Promedio de duración de cada fase (Especificar → Revisar)
- **Quality Gates:** Tasa de aprobación (primera vez vs reintentos)
- **Stubs detectados:** Cuántos stubs fantasma se encontraron y eliminaron

### TDD
- **Tasa de acierto:** Tests que pasaron al primer intento vs reintentos
- **Cobertura por feature:** Evolución de cobertura por sesión
- **RED→GREEN ratio:** Cuántos ciclos TDD se completaron

### Estimaciones
- **Precisión:** Estimado vs real por feature (desviación %)
- **Modelo más preciso:** Cuál de los 4 modelos acertó más

### Seguridad
- **Hallazgos OWASP:** Por categoría y severidad
- **Tendencia:** Hallazgos por sesión (debería decrecer)

### Sesiones
- **Total de sesiones:** Completadas y promedio de duración
- **Productividad:** Features completadas por sesión

## Output

```
.dc/dashboard.html  — Dashboard HTML standalone (abrir en navegador)
.dc/metrics.csv     — Export CSV para reporting corporativo
```

## Ejecución

```bash
/dc:dashboard               # Genera dashboard.html
/dc:dashboard --abrir       # Genera y abre en navegador
/dc:dashboard --csv          # Solo exporta CSV
```

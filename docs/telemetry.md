# Telemetria y Metricas — Don Cheli SDD

## Que es

Un sistema de telemetria **100% local** que registra metricas de cada sesion SDD para medir eficiencia, justificar inversion y mejorar procesos.

**Privacidad:** Ningun dato sale de tu maquina. Todo se almacena en `.dc/metrics.json`.

## Metricas disponibles

### Eficiencia del Pipeline

| Metrica | Que mide | Por que importa |
|---------|----------|-----------------|
| Tiempo por fase | Duracion promedio de cada fase | Identifica cuellos de botella |
| Quality Gates first-pass | % de gates aprobadas al primer intento | Mide madurez del equipo |
| Stubs detectados | Cuantos `// TODO` se encontraron | Cuantifica el "vibe coding" evitado |

### TDD

| Metrica | Que mide | Por que importa |
|---------|----------|-----------------|
| Tasa de acierto | Tests que pasan al primer RED→GREEN | Eficiencia del ciclo TDD |
| Cobertura por feature | Evolucion de coverage | Tendencia de calidad |
| Ciclos TDD | Cuantos RED→GREEN se completaron | Volumen de trabajo verificado |

### Estimaciones

| Metrica | Que mide | Por que importa |
|---------|----------|-----------------|
| Desviacion % | Estimado vs real por feature | Precision del equipo |
| Modelo mas preciso | Cual de los 4 modelos acerto mas | Optimizar futuras estimaciones |

### Seguridad

| Metrica | Que mide | Por que importa |
|---------|----------|-----------------|
| Hallazgos OWASP | Por categoria y severidad | Postura de seguridad |
| Tendencia | Hallazgos por sesion | Deberia decrecer con el tiempo |

## Comandos

```bash
/dc:metricas              # Resumen en terminal
/dc:metricas --tdd        # Solo TDD
/dc:metricas --owasp      # Solo seguridad
/dc:metricas --estimados  # Solo precision de estimados
/dc:dashboard             # Genera dashboard.html
/dc:dashboard --abrir     # Genera y abre en navegador
/dc:dashboard --csv       # Solo exporta CSV
```

## Dashboard HTML

El comando `/dc:dashboard` genera un archivo HTML standalone con graficos interactivos:

- Grafico de linea: cobertura por sesion
- Grafico de barras: tiempo por fase
- Tabla: quality gates pass rate
- Indicadores: TDD acierto, stubs eliminados, OWASP score

Se abre directamente en el navegador, sin servidor.

## Export CSV

Para reporting corporativo:

```bash
/dc:dashboard --csv
# Genera: .dc/metrics.csv
```

Columnas: session_id, date, duration_min, phase_reached, gates_passed, coverage, stubs_found, tdd_cycles, tdd_first_pass

## Donde se almacena

```
.dc/
├── metrics.json      # Datos acumulados (auto-generado)
├── dashboard.html    # Dashboard visual (generado con /dc:dashboard)
└── metrics.csv       # Export CSV (generado con /dc:dashboard --csv)
```

## Cuando se registra

Las metricas se registran automaticamente:
- Al ejecutar `/dc:cerrar-sesion`
- Al completar `/dc:implementar`
- Al ejecutar `/dc:revisar`

## Para CTOs y Tech Leads

Estas metricas responden preguntas clave:

- **"¿Cuanto ahorro genera Don Cheli?"** → Compara stubs detectados vs no detectados
- **"¿Son precisas las estimaciones?"** → Desviacion % promedio
- **"¿Mejora la calidad con el tiempo?"** → Tendencia de cobertura y gates
- **"¿El TDD ralentiza al equipo?"** → Tiempo por fase + tasa de acierto

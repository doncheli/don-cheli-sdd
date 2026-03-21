# Habilidad: Razonamiento (15 modelos + RLM)

**Versión:** 1.0.0
**Categoría:** Decisiones
**Tipo:** Flexible

## Modelos Disponibles

### Modelos de Análisis (Entender)
| # | Modelo | Comando | Uso |
|---|--------|---------|-----|
| 1 | Primeros Principios | `/razonar:primeros-principios` | Innovación |
| 2 | 5 Porqués | `/razonar:5-porques` | Causa raíz |
| 3 | Mapa vs Territorio | `/razonar:mapa-territorio` | Validar suposiciones |

### Modelos de Decisión (Elegir)
| # | Modelo | Comando | Uso |
|---|--------|---------|-----|
| 4 | Pareto | `/razonar:pareto` | Priorización |
| 5 | Costo de Oportunidad | `/razonar:costo-oportunidad` | Trade-offs |
| 6 | Reversibilidad | `/razonar:reversibilidad` | Compromiso |
| 7 | Minimizar Arrepentimiento | `/razonar:minimizar-arrepentimiento` | Largo plazo |
| 8 | Probabilístico | `/razonar:probabilistico` | Incertidumbre |

### Modelos de Perspectiva (Pensar)
| # | Modelo | Comando | Uso |
|---|--------|---------|-----|
| 9 | Inversión | `/razonar:inversion` | Pensar al revés |
| 10 | Segundo Orden | `/razonar:segundo-orden` | Pensar adelante |
| 11 | Pre-Mortem | `/razonar:pre-mortem` | Pensar fracaso |
| 12 | Círculo de Competencia | `/razonar:circulo-competencia` | Pensar límites |

### 🧠 Modelos RLM (Modelo de Lenguaje Recursivo — PrimeIntellect)
| # | Modelo | Comando | Uso |
|---|--------|---------|-----|
| 13 | Verificación con Sub-LLMs | `/razonar:rlm-verificacion` | Verificar código contra specs |
| 14 | Cadena + Context Folding | `/razonar:rlm-cadena-pensamiento` | Razonamiento multi-paso sin context rot |
| 15 | Descomposición Recursiva | `/razonar:rlm-descomposicion` | Inputs masivos, codebases grandes |

## Árbol de Decisión

```
¿Qué tipo de problema tengo?
├── No entiendo el problema → Análisis
│   ├── Suposiciones → primeros-principios
│   ├── Bug/Error → 5-porques
│   └── Datos confusos → mapa-territorio
├── Necesito elegir → Decisión
│   ├── Qué priorizar → pareto
│   ├── Qué compromiso → reversibilidad / probabilístico
│   └── Largo plazo → minimizar-arrepentimiento
├── Necesito perspectiva → Perspectiva
│   ├── Evitar fracaso → pre-mortem / inversión
│   ├── Ver más allá → segundo-orden
│   └── ¿Sé lo suficiente? → circulo-competencia
└── Necesito manejar contexto largo / input masivo → RLM
    ├── Verificar contra specs → rlm-verificacion
    ├── Razonamiento multi-paso → rlm-cadena-pensamiento
    └── Codebase grande / datos masivos → rlm-descomposicion
```

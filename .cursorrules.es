# Don Cheli — Framework SDD para Cursor

## Identidad
Asistente de desarrollo bajo Don Cheli (Desarrollo Dirigido por Especificaciones). 7 fases del ciclo de vida + 3 leyes de hierro.

## Leyes de Hierro (No Negociable)
1. **TDD:** Todo código de producción requiere tests — ROJO → VERDE → REFACTORIZAR, sin excepciones
2. **Debugging:** Primero la causa raíz, luego el fix — Reproducir → Aislar → Entender → Corregir → Verificar
3. **Verificación:** Evidencia antes de afirmaciones — "Los tests pasan" > "Creo que funciona"

## Reglas de Desviación
- Reglas 1-3: Auto-corregir (bugs, faltantes, bloqueadores)
- Regla 4: PARAR y preguntar (cambios arquitectónicos)
- Regla 5: Registrar y continuar (mejoras)

## Comandos Disponibles
Todos los comandos funcionan con el prefijo `/dc:`. Comandos clave:

### Ciclo de Vida
- `/dc:iniciar` — Inicializar proyecto
- `/dc:comenzar` — Comenzar tarea con detección automática de complejidad (Nivel 0-4)
- `/dc:especificar` — Generar spec Gherkin + esquema DBML
- `/dc:aclarar` — Auto-QA + resolver ambigüedades
- `/dc:plan-tecnico` — Blueprint técnico
- `/dc:desglosar` — Desglose de tareas TDD con marcadores de paralelismo
- `/dc:implementar` — Ejecución TDD: ROJO → VERDE → REFACTORIZAR
- `/dc:revisar` — Revisión entre pares de 7 dimensiones

### Razonamiento (15 modelos)
- `/razonar:pre-mortem` — Anticipar fallos antes de que sucedan
- `/razonar:5-porques` — Análisis de causa raíz
- `/razonar:pareto` — Enfoque 80/20
- `/razonar:inversion` — Resolver pensando al revés
- `/razonar:primeros-principios` — Descomponer hasta los fundamentos
- `/razonar:segundo-orden` — Consecuencias de las consecuencias
- `/razonar:costo-oportunidad` — Evaluar lo que NO estás eligiendo
- `/razonar:reversibilidad` — Calibrar el nivel de compromiso
- `/razonar:minimizar-arrepentimiento` — Toma de decisiones a largo plazo
- `/razonar:circulo-de-competencia` — Conocer tus límites
- `/razonar:mapa-territorio` — Modelo vs realidad
- `/razonar:probabilistico` — Razonar en probabilidades
- `/razonar:rlm-cadena-de-pensamiento` — Razonamiento multi-paso con context folding
- `/razonar:rlm-descomposicion` — Descomposición recursiva con sub-LLMs
- `/razonar:rlm-verificacion` — Verificación con sub-LLMs

### Avanzados
- `/dc:estimar` — 4 modelos de estimación (COCOMO, Planning Poker AI, Function Points, Histórico)
- `/dc:debate` — Debate adversarial multi-rol (CPO vs Arquitecto vs QA)
- `/dc:mesa-tecnica` — Mesa de expertos senior (Tech Lead, Backend, Frontend, Arquitecto, DevOps)
- `/dc:mesa-redonda` — Discusión exploratoria multi-perspectiva
- `/dc:planning` — Planning semanal de equipo con RFCs, WSJF, asignación de squad
- `/dc:auditar-seguridad` — Auditoría de seguridad estática OWASP Top 10
- `/dc:migrar` — Migración de stack con plan por olas
- `/dc:contrato-api` — Diseño de contrato REST/GraphQL con reintentos, circuit breaker
- `/dc:contrato-ui` — Contrato de diseño UI antes de codear frontend
- `/dc:destilar` — Extraer specs desde código existente (Destilación de Blueprint)
- `/dc:reversa` — Ingeniería inversa de arquitectura desde el codebase
- `/dc:poc` — Prueba de Concepto con timebox y criterios de éxito
- `/dc:doctor` — Diagnosticar y reparar framework/git/entorno

### Calidad y Colaboración
- `/dc:capturar` — Captura de ideas fire-and-forget
- `/dc:uat` — Scripts de pruebas de aceptación auto-generados
- `/dc:guardian` — Revisión de código AI como pre-commit hook
- `/dc:limpiar-slop` — Eliminar código slop generado por IA antes de commits
- `/dc:incorporar` — Incorporar nuevo desarrollador con contexto completo
- `/dc:traspaso` — Generar documento de traspaso estructurado

## Pipeline (Estándar — Nivel 2)
```
/dc:especificar  → Spec Gherkin + esquema DBML
/dc:aclarar      → Auto-QA + resolver ambigüedades
/dc:plan-tecnico → Blueprint + verificación de constitución
/dc:desglosar    → Tareas TDD con paralelismo
/dc:implementar  → ROJO → VERDE → REFACTORIZAR
/dc:revisar      → Revisión entre pares de 7 dimensiones
```

## 6 Puertas de Calidad
1. Completitud de spec (todos los escenarios P1 tienen caminos tristes)
2. Medibilidad de spec (criterios de aceptación son testeables)
3. Adherencia a la constitución (principios respetados)
4. Cobertura de implementación (≥85% en código nuevo)
5. Sin fugas de implementación en specs
6. Revisión supera las 7 dimensiones

## Niveles de Complejidad (Auto-detectados)
| Nivel | Nombre | Cuándo | Proceso |
|-------|--------|--------|---------|
| 0 | Atómico | 1 archivo, < 30 min | implementar → verificar |
| P | PoC | Validar viabilidad | timebox 2-4h, reglas relajadas |
| 1 | Micro | 1-3 archivos | spec ligera → implementar → revisar |
| 2 | Estándar | Múltiples archivos, 1-3 días | pipeline completo |
| 3 | Complejo | Multi-módulo, 1-2 semanas | constitución → pipeline completo |
| 4 | Producto | Sistema nuevo, 2+ semanas | propuesta → constitución → pipeline completo |

## Reglas de Contexto
- Leer archivos bajo demanda, no preventivamente
- No re-leer lo que ya está en contexto
- Outputs estructurados desde el inicio (JSON, tablas)
- Si resultado > 10K tokens → aislar en subtarea

## Idioma
- Código (variables, funciones): siempre inglés
- Comunicación: seguir el idioma configurado
- Detección: leer archivo locale → .especdev/config.yaml → default: es
- Soportados: es (Español), en (English), pt (Português)

## Reglas
Leer desde el directorio `reglas/` (el contenido está en el idioma instalado):
- Reglas de trabajo globales (branches, commits, PRs, coverage, límites de autonomía)
- Aplicación de leyes de hierro
- Criterios de puertas de calidad
- Guías i18n
- Buenas prácticas de habilidades

---
description: Analizar sesiones de Claude en el equipo para extraer patrones de uso y generar recomendaciones de habilidades, plugins, agentes y reglas
i18n: true
---

# /dc:analizar-sesiones

## Objetivo

Escanear todas las sesiones de Claude en el equipo local, analizar patrones de uso, y generar recomendaciones concretas sobre qué debería convertirse en habilidades reutilizables, plugins, agentes autónomos o instrucciones de proyecto.

## Uso

```
/dc:analizar-sesiones
/dc:analizar-sesiones --periodo <dias>
/dc:analizar-sesiones --formato <resumen|detallado|ejecutivo>
```

## Comportamiento

1. **Escanear** todas las sesiones de Claude en el equipo
   - Ubicación típica: `~/.claude/projects/` y sesiones en ficheros JSONL
   - Incluye: prompts del usuario, respuestas del agente, herramientas usadas, archivos editados

2. **Clasificar** cada interacción por tipo:
   - Generación de código
   - Debugging / corrección de bugs
   - Refactoring
   - Code review
   - Documentación
   - Pregunta / Q&A
   - Configuración / DevOps
   - Diseño / Arquitectura
   - Testing
   - Scripting / Automatización

3. **Analizar** patrones de frecuencia:
   - ¿Qué tipo de tareas se repiten más?
   - ¿Qué archivos se editan con más frecuencia?
   - ¿Qué comandos/herramientas se usan más?
   - ¿Qué patrones de prompt se repiten?
   - ¿Cuántos tokens se consumen por tipo de tarea?

4. **Generar** recomendaciones en 5 categorías

## Output

```markdown
# Análisis de Sesiones de Claude

## 📊 Resumen de Uso

| Métrica | Valor |
|---------|-------|
| Sesiones analizadas | 47 |
| Período | Últimos 30 días |
| Tokens consumidos | ~2.4M |
| Tipo más frecuente | Generación de código (38%) |

## 🔁 Lo que Hago Más Frecuentemente

| # | Actividad | Frecuencia | Tokens/Sesión |
|---|----------|------------|---------------|
| 1 | Crear componentes React | 23 veces | ~8K |
| 2 | Corregir tests fallidos | 18 veces | ~5K |
| 3 | Escribir endpoints API | 15 veces | ~12K |
| 4 | Refactorizar funciones | 12 veces | ~6K |
| 5 | Generar documentación | 9 veces | ~3K |

## 🧠 Debería Convertirse en HABILIDAD (Skill)

Flujos de trabajo reutilizables que repito constantemente:

| Skill Propuesta | Basada en | Ahorro Estimado |
|----------------|-----------|-----------------|
| `crear-componente-react` | 23 sesiones de creación de componentes | ~40% tokens |
| `fix-test-pattern` | 18 sesiones de debugging de tests | ~30% tokens |
| `api-endpoint-scaffold` | 15 sesiones de creación de APIs | ~50% tokens |

**Formato de skill:**
```yaml
# habilidades/crear-componente-react/HABILIDAD.md
Patrón detectado: El usuario siempre pide...
1. Crear componente funcional con TypeScript
2. Agregar tests unitarios con testing-library
3. Agregar storybook story
4. Exportar desde index.ts
```

## 🔌 Debería Convertirse en PLUGIN (Herramienta Standalone)

Herramientas que uso repetidamente que podrían automatizarse:

| Plugin Propuesto | Basado en | Tipo |
|-----------------|-----------|------|
| `scaffold-feature` | Creación repetitiva de estructura feature/ | CLI tool |
| `test-coverage-checker` | Verificación manual de cobertura | Script |
| `pr-description-gen` | Redacción manual de descripciones de PR | Automatización |

## 🤖 Debería Convertirse en AGENTE (Subagente Autónomo)

Tareas que delego completas y que podrían ejecutarse autónomamente:

| Agente Propuesto | Basado en | Modelo Recomendado |
|-----------------|-----------|-------------------|
| `code-reviewer` | Revisiones de código frecuentes | Sonnet |
| `test-generator` | Generación repetitiva de tests | Haiku |
| `doc-updater` | Actualización de docs tras cambios | Haiku |

## 📋 Debería Ir en CLAUDE.md (Instrucciones de Proyecto)

Reglas que repito en cada sesión y deberían ser instrucciones permanentes:

| Regla | Veces Repetida |
|-------|---------------|
| "Usa TypeScript estricto" | 34 veces |
| "Tests con testing-library, no enzyme" | 22 veces |
| "No uses any" | 19 veces |
| "Imports ordenados: react primero" | 15 veces |

**CLAUDE.md sugerido:**
```markdown
## Convenciones
- TypeScript estricto (no `any`)
- Tests con @testing-library/react
- Imports: React > libs externas > internos > tipos
- Componentes funcionales, no clases
```

## 💡 Recomendaciones de Optimización

1. **Tokenización:** ~40% de tus tokens se gastan en repetir contexto
   → Crear skills reduciría consumo en ~35%
2. **Modelo:** Usas Opus para tareas que Haiku podría resolver
   → Usar la matriz de selección de modelos ahorraría ~60% costo
3. **Sesiones largas:** El 30% de tus sesiones exceden 50K tokens
   → Implementar context folding (RLM) mejoraría calidad
```

## Cómo Mejora el Framework

| Aspecto | Sin Análisis | Con Análisis |
|---------|-------------|-------------|
| **Skills** | Genéricas, predefinidas | Personalizadas según tu uso real |
| **Plugins** | No existen | Auto-generados desde patrones |
| **Agentes** | Configuración manual | Asignación automática por patrón |
| **CLAUDE.md** | Escribir manualmente | Auto-generado desde repeticiones |
| **Costos** | Sin control | Optimizado por matriz de modelos |

## Integración con Don Cheli

Este comando se integra con:
- `/dc:iniciar` → Las skills detectadas se sugieren al crear un proyecto nuevo
- `/dc:agente` → Los agentes detectados se agregan al sistema de agentes
- `/dc:estimar` → Los datos históricos alimentan estimados más precisos
- **Reglas de Trabajo Globales** → Las reglas detectadas se incorporan automáticamente
- **Optimización de Tokens** → Los patrones de consumo optimizan uso de modelos

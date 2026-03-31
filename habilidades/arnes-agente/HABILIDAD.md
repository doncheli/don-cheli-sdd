---
nombre: Arnés del Agente
descripcion: "Configurar y ejecutar agentes especializados con restricciones, timeouts y recuperación de errores"
version: 1.0.0
autor: Don Cheli
tags: [configuración, agente, harness, arnés]
activacion: "configurar agente", "arnés", "harness", "ejecutar agente"
---

# Habilidad: Arnés del Agente (Agent Harness)

**Versión:** 1.0.0
**Categoría:** Configuración
**Tipo:** Rígida

> Basado en las prácticas de MELI para 20,000 developers y GitHub Spec Kit.

## Cómo Mejora el Framework

El "arnés del agente" es el conjunto de configuraciones que controla el comportamiento de la IA. Sin un arnés bien diseñado, el agente pierde efectividad a medida que el contexto crece.

### El Problema: Context Rot

> La precisión del agente cae cuando la ventana de contexto supera ~60% de utilización.
> — Julian de Angelis, MELI

Un CLAUDE.md monolítico de 2,000 líneas **contamina** el contexto. La solución de MELI: **reglas modulares**.

## Las 4 Palancas del Arnés

### 1. Reglas Modulares (Custom Rules)

En vez de un archivo gigante, divide las reglas por concern:

```
.especdev/
├── reglas/
│   ├── arquitectura.md     # Patrones, capas, inyección de deps
│   ├── testing.md          # Cobertura, mocking, fixtures
│   ├── seguridad.md        # .env, secrets, OWASP
│   ├── ui.md               # Componentes, estilos, accesibilidad
│   ├── bd.md               # Queries, migraciones, transacciones
│   └── api.md              # REST, versionado, paginación
```

**Regla de oro:** Cada archivo de reglas < **500 líneas**.

El framework carga SOLO las reglas relevantes para la tarea actual:
- Si trabajas en UI → carga `ui.md` + `testing.md`
- Si trabajas en BD → carga `bd.md` + `seguridad.md`
- Si trabajas en API → carga `api.md` + `testing.md` + `seguridad.md`

### 2. Servidores MCP

Puente entre conocimiento organizacional y el agente:
- Schemas de BD → via MCP, no pegados en el prompt
- Docs internos → via MCP, no copy-paste
- APIs internas → contratos via MCP

### 3. Skills Bajo Demanda

Habilidades que se cargan SOLO cuando son relevantes:
- No cargar TODAS las habilidades al inicio
- Usar subagentes aislados para tareas pesadas
- El contexto principal se mantiene limpio

### 4. Stop Hooks (Verificaciones de Parada)

Puertas de validación automáticas que DEBEN pasar antes de que el agente pueda marcar una tarea como "completa":

```yaml
# .especdev/hooks/parar.yml
hooks_parar:
  - nombre: "Lint"
    comando: "npm run lint"
    obligatorio: true
    
  - nombre: "Type Check"
    comando: "npx tsc --noEmit"
    obligatorio: true
    
  - nombre: "Tests"
    comando: "npm test"
    obligatorio: true
    
  - nombre: "Coverage"
    comando: "npm run coverage"
    umbral: 85
    obligatorio: false
    
  - nombre: "Build"
    comando: "npm run build"
    obligatorio: true
```

**Flujo:**
```
Implementar → ¿Todos los stop hooks pasan?
├── ✅ SÍ → Tarea marcada como completa
└── ❌ NO → Tarea BLOQUEADA, mostrar qué falló
```

## Niveles de Madurez de Specs

MELI define 3 niveles de madurez en el uso de specs:

### Nivel 1: Spec-First (Básico)
- La spec se escribe como input
- Se descarta después de implementar
- El código es la única fuente de verdad
- **⚠️ Problema:** La spec se desincroniza

### Nivel 2: Spec-Anchored (Intermedio) ← **Recomendado**
- La spec vive en el repositorio
- Se actualiza cuando el código cambia
- Es documentación viva
- **✅ Beneficio:** Spec y código siempre alineados

### Nivel 3: Spec-as-Source (Avanzado)
- La spec ES la fuente primaria
- Editar la spec regenera el código
- La spec es ejecutable
- **🚀 Beneficio:** Cambios desde la spec, no el código

### Cómo Alcanzar Cada Nivel en Don Cheli

| Nivel | Comando | Acción |
|-------|---------|--------|
| 1 | `/dc:especificar` → `/dc:implementar` | Spec → código (spec se archiva) |
| 2 | Agregar regla en hooks/parar.yml | Verificar que spec se actualiza con cada cambio |
| 3 | `/dc:implementar --desde-spec` | Re-generar código desde spec actualizada |

## Prevención de Context Rot

### Regla del 60%

> Si la ventana de contexto está >60% llena, la precisión cae significativamente.

**Estrategias de prevención:**

1. **Cargar reglas bajo demanda** — No todo de golpe
2. **Subagentes para tareas pesadas** — Mantener contexto principal limpio
3. **System prompts < 500 tokens** — Conciso y enfocado
4. **Outputs estructurados** — JSON/tablas desde el inicio
5. **No re-leer archivos en contexto** — Referenciar, no duplicar

## Integración con Don Cheli

```yaml
# .especdev/config.yaml
arnes:
  reglas_modulares: true
  max_lineas_por_regla: 500
  hooks_parar:
    - lint
    - tests
    - types
    - build
  nivel_madurez: 2  # spec-anchored
  prevencion_context_rot:
    umbral_contexto: 60
    subagentes_para_tareas_pesadas: true
    carga_bajo_demanda: true
```

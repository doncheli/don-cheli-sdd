---
nombre: Optimizador de Contexto
descripcion: "Comprimir y priorizar el contexto del conversation window para máxima eficiencia de tokens"
version: 1.0.0
autor: Don Cheli
tags: [contexto, tokens, rendimiento, optimizacion]
activacion: "optimizar contexto", "comprimir conversación", "context window lleno"
---

# Habilidad: Optimizador de Contexto

**Versión:** 1.0.0
**Categoría:** Rendimiento
**Tipo:** Rígida

> Adaptado de `context-optimizer` de Pro-Workflow.

## Cómo Mejora el Framework

El contexto del agente es un recurso finito. Sin gestión activa:
- A 70% → la calidad empieza a degradarse
- A 90% → entra en la "zona muda" — respuestas genéricas
- A 100% → errores y hallucinations

## Diagnóstico Rápido

| Uso de Contexto | Estado | Acción |
|-----------------|--------|--------|
| < 50% | 🟢 Óptimo | Seguir normal |
| 50-70% | 🟡 Aceptable | Planificar compactación |
| 70-90% | 🟠 Degradado | **Compactar AHORA** |
| > 90% | 🔴 Zona muda | **Sesión nueva inmediatamente** |

## Estrategias de Optimización

### Inmediatas

| Acción | Ahorro | Cuándo |
|--------|--------|--------|
| Compactar contexto | 30-50% | Al cambiar de tarea |
| Desactivar MCPs no usados | ~5% por MCP | Al cambiar de dominio |
| Delegar a subagentes | Mantiene contexto limpio | Tareas pesadas de lectura |
| Sesión nueva con traspaso | 100% reset | Trabajo no relacionado |

### Prompts Eficientes en Tokens

- ❌ "Arreglá el código" (obliga al agente a leer todo)
- ✅ "En src/auth/, corregir el bug de login" (scope acotado)
- ✅ "No modificar el middleware" (restricción explícita)
- ✅ "Debe retornar 429 después de 5 intentos" (criterio de aceptación)

### Delegación a Subagentes

Operaciones que generan mucho output van a subagentes:
- Ejecución de suite de tests completa → subagente
- Exploración de archivos grandes → subagente
- Generación de documentación → subagente
- Análisis de logs → subagente

El contexto principal se mantiene limpio.

### Presupuesto de Contexto por Fase

| Fase | Uso Target | Si Se Excede |
|------|-----------|--------------|
| Planificación | < 20% | Mantener planes concisos |
| Implementación | < 60% | Compactar entre archivos |
| Testing | < 80% | Delegar a subagente |
| Revisión | < 90% | Sesión nueva |

## Optimización del System Prompt

- System prompt principal: **< 60 líneas** ideal, **< 150** máx
- Mover info por paquete a system prompts por módulo
- Mover preferencias personales a archivo local
- Eliminar info obvia o que cambia rápidamente

## Auditoría de MCPs

> Mantener < 10 MCPs activos, < 80 herramientas totales.
> Cada MCP agrega overhead a cada request.

## Señales de Contexto Degradado

- El agente se repite o olvida contexto previo
- Respuestas genéricas sin conocimiento del proyecto
- Tool calls que fallan por razones que antes funcionaban
- "¿Me puedes repetir qué estamos haciendo?"

### Solución

1. Compactar manualmente
2. Si persiste → sesión nueva con `/dc:traspasar`
3. Si es recurrente → reducir system prompt, desactivar MCPs

## Integración con Don Cheli

```yaml
# .dc/config.yaml
contexto:
  umbral_compactar: 70       # % para auto-compactar
  umbral_zona_muda: 90       # % para forzar sesión nueva
  max_mcps_activos: 10
  max_herramientas: 80
  subagentes_para_output_pesado: true
```

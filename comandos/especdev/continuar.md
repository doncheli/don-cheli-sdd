---
description: Recuperar sesión previa y generar reporte de puesta al día
---

# /especdev:continuar

## Objetivo

Recuperar el contexto de una sesión previa y generar un reporte de puesta al día.

## Uso

```
/especdev:continuar
```

## Comportamiento

1. **Detectar** directorio `.especdev/` existente
2. **Leer** archivos de contexto
3. **Generar** Reporte de Puesta al Día:

```markdown
## 🔄 Recuperación de Sesión

**Proyecto:** api-pagos
**Última Sesión:** 2026-03-21 15:30

**Estado Actual:**
- Fase: 3/7 (Diseño)
- Tarea: Diseñar esquema de base de datos
- Progreso: 40%

**Hallazgos Recientes:**
- JWT preferido sobre sesiones
- La API legacy tiene vulnerabilidades

**Próximos Pasos:**
1. Completar esquema de base de datos
2. Agregar reset de contraseña
```

## Test de 5 Preguntas

Para verificar que el contexto está completo:

| # | Pregunta | Fuente | Estado |
|---|----------|--------|--------|
| 1 | ¿Dónde estoy? | `estado.md` | Fase actual |
| 2 | ¿A dónde voy? | `plan.md` | Fases restantes |
| 3 | ¿Cuál es la meta? | `config.yaml` | Objetivo del proyecto |
| 4 | ¿Qué he aprendido? | `hallazgos.md` | Descubrimientos clave |
| 5 | ¿Qué he hecho? | `progreso.md` | Acciones recientes |

**Estado del Contexto:**
- ✅ Completo (5/5) → Listo para continuar
- ⚠️ Parcial (3-4/5) → Proceder con precaución
- ❌ Incompleto (0-2/5) → Ejecutar `/especdev:iniciar --reparar`

# Habilidad: Engram — Memoria Persistente Cross-Sesión

**Versión:** 1.0.0
**Categoría:** Contexto
**Tipo:** Rígida

> Inspirado en Engram de Gentleman-Programming/gentle-ai

## Cómo Mejora el Framework

Sin Engram, cada sesión de IA empieza de cero. El agente "olvida" decisiones, bugs, convenciones y preferencias. Con Engram:

- ⏳ **Persistencia cross-sesión**: las decisiones y convenciones sobreviven al reinicio
- 🧠 **Memoria semántica**: "¿De qué hablamos la vez pasada?"
- 📝 **Contexto acumulativo**: cada sesión BUILD sobre las anteriores
- 0️⃣ **Zero re-explicación**: no repetir instrucciones que ya se dieron

## Cómo Funciona en Don Cheli

### Archivos de Memoria

```
.dc/
├── memoria/
│   ├── decisiones.md        # Decisiones arquitectónicas registradas
│   ├── convenciones.md      # Convenciones del proyecto
│   ├── errores-conocidos.md # Bugs y soluciones encontradas
│   ├── preferencias.md      # Preferencias del usuario
│   └── sesiones/
│       ├── 2026-03-21.md    # Log de sesión
│       └── ...
```

### Auto-Registro

En cada sesión, Don Cheli automáticamente:

1. **Lee** los archivos de memoria al comenzar (`/dc:continuar`)
2. **Registra** nuevas decisiones cuando se toman
3. **Actualiza** convenciones cuando se establecen
4. **Guarda** log de sesión al completar

### Comandos de Memoria

| Comando | Qué Hace |
|---------|----------|
| `/dc:memorizar <insight>` | Guardar un insight manualmente |
| `/dc:continuar` | Cargar memoria y contexto de sesión previa |
| `/dc:donde-estoy` | Test rápido de 5 preguntas para verificar contexto |
| `/dc:traspaso` | Generar handoff completo de contexto |

### Ejemplo de Uso

```markdown
# .dc/memoria/decisiones.md

## Decisiones Arquitectónicas

### 2026-03-21: Usar Repository Pattern
- **Contexto:** Se necesita abstraer la capa de datos
- **Decisión:** Repository Pattern con inyección de dependencias
- **Razón:** Facilita testing y cambio de BD
- **Registrado por:** /dc:memorizar

### 2026-03-20: No usar ORM
- **Contexto:** El equipo prefiere SQL directo
- **Decisión:** Usar query builder en vez de ORM
- **Razón:** Más control sobre queries, mejor rendimiento
```

## Integración con el Pipeline

```
sesión nueva → leer memoria/ → cargar contexto
    ↓
trabajar → registrar decisiones automáticamente
    ↓
fin sesión → guardar log en sesiones/ → actualizar memoria
```

## Diferencia con Engram de Gentle-AI

| Aspecto | Engram (Gentle-AI) | Memoria Don Cheli |
|---------|-------------------|-----------------|
| **Implem.** | Binary Go separado (puerto 7437) | Archivos markdown (sistema de archivos) |
| **Ventaja** | Búsqueda semántica en memoria | Sin dependencias externas, portable |
| **Datos** | BD vectorial | Markdown legible por humanos |
| **Cross-agente** | Sí (vía MCP) | Sí (cualquier agente lee markdown) |

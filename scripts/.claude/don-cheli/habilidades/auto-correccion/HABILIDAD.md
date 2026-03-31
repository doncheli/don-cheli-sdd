# Habilidad: Bucle de Auto-Corrección

**Versión:** 1.0.0
**Categoría:** Aprendizaje
**Tipo:** Rígida

> Adaptado de `learn-rule` de Pro-Workflow — "Las correcciones se acumulan."

## Cómo Mejora el Framework

> "Después de 50 sesiones, el agente casi no necesita corrección."
> — Pro-Workflow

Cada error del agente se convierte en una **regla persistente** que previene futuros errores. Las correcciones se acumulan multiplicativamente.

## El Concepto

```
Sesión 1: Agente comete 10 errores
Sesión 2: 8 errores (2 ya son reglas)
Sesión 5: 4 errores
Sesión 10: 2 errores
Sesión 50: ~0 errores — el agente aprendió
```

## Formato de Regla

```
[APRENDER] Categoría: Regla de una línea
Error: Qué salió mal
Corrección: Cómo se corrigió
```

### Ejemplo Real

```
[APRENDER] Navegación: Confirmar ruta completa cuando hay archivos con nombre igual.
Error: Editó src/utils.ts en vez de src/auth/utils.ts
Corrección: Siempre verificar la ruta absoluta antes de editar
```

## Categorías

| Categoría | Ejemplos |
|-----------|----------|
| **Navegación** | Rutas incorrectas, archivo equivocado |
| **Edición** | Enfoque erróneo, patrón incorrecto |
| **Testing** | Cobertura faltante, tests frágiles |
| **Git** | Commits, branches, conflictos |
| **Calidad** | Lint, tipos, estilo |
| **Contexto** | Requisitos faltantes, ambigüedad |
| **Arquitectura** | Abstracción incorrecta, acoplamiento |
| **Performance** | O(n²), memoria, queries N+1 |

## Activación

El agente detecta automáticamente cuándo aprender:
- Usuario dice "recuerda esto", "no hagas eso", "aprende de esto"
- Se identifica un error y su corrección
- El wrap-up captura learnings

### Flujo

```
1. Detectar error o corrección
2. Formatear como regla de una línea
3. PROPONER al usuario (nunca auto-guardar)
4. Si aprueba → persistir en memoria
5. Próxima sesión → cargar reglas
```

## Almacenamiento

Las reglas se guardan en `.especdev/memoria/aprendizajes.md`:

```markdown
# Aprendizajes Acumulados

## Navegación (3 reglas)
- Confirmar ruta completa cuando hay archivos con nombre igual
- Usar `find` antes de editar archivos en monorepos
- Las rutas de tests siguen la misma estructura que src/

## Testing (2 reglas)
- Siempre mockear servicios externos en unit tests
- No usar `any` en mocks — define tipos parciales

## Arquitectura (1 regla)
- Servicios de pago van en su propio módulo, no en utils/
```

## Búsqueda de Reglas

```
/dc:buscar-regla testing           # Reglas de testing
/dc:buscar-regla "rutas archivos"  # Búsqueda exacta
/dc:buscar-regla --todas           # Listar todas
```

## Guardrails

- **Siempre esperar aprobación** — No auto-guardar
- **Una línea, específica y accionable** — No "escribir buen código"
- **Incluir contexto del error** — Para que la regla tenga sentido después
- **Evitar duplicados** — Verificar si ya existe una regla similar

# Habilidad: Delta Specs — Specs Incrementales

**Versión:** 1.0.0
**Categoría:** Especificación
**Tipo:** Rígida

> Adaptado de OpenSpec (Fission-AI/OpenSpec) — concepto clave para desarrollo brownfield.

## Cómo Mejora el Framework

Sin delta specs, cada cambio requiere reescribir la spec completa. Esto es:
- Costoso en tokens
- Propenso a errores (se puede borrar algo sin querer)
- Inviable en proyectos grandes con muchas specs

Con delta specs, describes **QUÉ CAMBIA** — no reestas todo.

## Qué es un Delta Spec

Un delta spec describe la **diferencia** entre el estado actual y el estado deseado de una spec:

```markdown
# Delta Spec: Agregar OAuth a Autenticación

## Spec Base
specs/auth/spec.md

## Cambios

### Nuevo Requisito: Login Social
El sistema DEBE permitir autenticación via Google y GitHub OAuth2.

#### Escenario: Login con Google exitoso
- DADO un usuario con cuenta de Google
- CUANDO selecciona "Entrar con Google"
- ENTONCES recibe un JWT token válido
- Y su perfil se completa con datos de Google

#### Escenario: Vincular OAuth a cuenta existente
- DADO un usuario registrado con email
- CUANDO intenta login con Google usando el mismo email
- ENTONCES se vincula la cuenta OAuth a la existente
- Y puede usar ambos métodos de login

### Requisito Modificado: Session Expiration
- ANTES: "Las sesiones expiran después de 30 minutos"
- AHORA: "Las sesiones expiran después de 30 minutos para login local, 
          y según configuración del provider para OAuth"

### Requisito Sin Cambios
- User Authentication (sin cambios)
- Password Reset (sin cambios)
```

## Por Qué Deltas en Vez de Specs Completas

| Aspecto | Spec Completa | Delta Spec |
|---------|--------------|------------|
| **Tokens** | Reescribir TODO (~2000 tokens) | Solo lo nuevo (~500 tokens) |
| **Riesgo** | Borrar algo sin querer | Solo se toca lo que cambia |
| **Revisión** | Comparar todo el doc | Ver solo los cambios |
| **Merge** | Reemplazar | Aplicar incrementalmente |
| **Brownfield** | Difícil con specs grandes | Natural y escalable |

## El Ciclo Virtuoso

```
1. Specs describen comportamiento actual
2. Delta specs proponen modificaciones
3. Implementación hace los cambios reales
4. /dc:archivar merge deltas en specs principales
5. Specs ahora describen el nuevo comportamiento
6. Siguiente cambio se basa en specs actualizadas
```

## Secciones de un Delta Spec

| Sección | Contenido |
|---------|-----------|
| `## Spec Base` | Referencia a la spec que se modifica |
| `### Nuevo Requisito:` | Requisitos completamente nuevos |
| `### Requisito Modificado:` | Requisitos existentes que cambian (ANTES/AHORA) |
| `### Requisito Eliminado:` | Requisitos que se retiran |
| `### Sin Cambios` | Requisitos que permanecen igual (para contexto) |

## Integración con el Pipeline

```
/dc:proponer → propuesta.md
→ /dc:especificar → delta-spec.md (NO spec completa)
→ /dc:implementar → código
→ /dc:archivar → merge delta en spec principal
```

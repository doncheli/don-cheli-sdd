# Habilidad: Detección de Loops en Auto-Corrección

**Versión:** 1.0.0
**Categoría:** Calidad
**Tipo:** Rígida

> Adaptado de DeepCode (HKUDS/DeepCode) — Loop Detection & Error Correction.

## Cómo Mejora el Framework

Don Cheli ya tiene auto-corrección (aprendizajes acumulados), pero carece de un **guard contra ciclos infinitos de fix**. Cuando el agente intenta corregir un error y la corrección genera otro error similar, puede entrar en un loop destructivo que consume tokens sin avanzar.

Esta habilidad detecta y rompe esos ciclos automáticamente.

## El Problema

```
Intento 1: Fix A → genera Error B
Intento 2: Fix B → genera Error A (¡loop!)
Intento 3: Fix A → genera Error B
... (infinito, consumiendo tokens)
```

## Mecanismo de Detección

### 1. Registro de Intentos

Cada corrección se registra con su firma:

```
[INTENTO] #N | Error: <firma> | Archivo: <ruta> | Fix: <descripción>
```

La **firma del error** es un hash del tipo + mensaje + ubicación:

```
firma = hash(tipo_error + mensaje_normalizado + archivo + línea)
```

### 2. Detección de Patrones

El sistema detecta loops cuando:

| Patrón | Condición | Ejemplo |
|--------|-----------|---------|
| **Loop directo** | Misma firma aparece 2+ veces | Error A → Fix → Error A |
| **Loop ping-pong** | Dos firmas alternan | Error A → Error B → Error A |
| **Loop espiral** | 3+ firmas en ciclo | A → B → C → A |
| **Estancamiento** | 3+ intentos sin progreso medible | Fix no cambia resultado de tests |

### 3. Umbrales

| Umbral | Valor | Acción |
|--------|-------|--------|
| **Max intentos por error** | 3 | Escalar después del 3er intento |
| **Max intentos totales por tarea** | 8 | Stop-loss de la tarea |
| **Ventana de detección** | Últimos 10 intentos | Firmas se comparan en ventana deslizante |
| **Timeout por intento** | 60 segundos | Prevenir fixes que cuelgan |

## Flujo de Corrección con Guard

```
1. Detectar error
2. ¿Firma ya vista en ventana?
   ├── NO → Intentar fix, registrar intento
   │   └── ¿Fix exitoso?
   │       ├── SÍ → Limpiar registro, continuar
   │       └── NO → Volver a paso 2
   │
   └── SÍ → ¿Cuántas veces?
       ├── 2 veces → Cambiar estrategia de fix
       ├── 3 veces → ⛔ PARAR, reportar al usuario
       └── Escalar con contexto completo
```

## Estrategias de Escape

Cuando se detecta un loop, antes de escalar al usuario se intentan **estrategias alternativas** (en orden):

### Nivel 1: Cambiar Estrategia (automático)
```
1. Si el fix fue en el mismo archivo → intentar fix en archivo diferente
2. Si el fix fue sintáctico → intentar fix semántico
3. Si el fix fue local → intentar fix en dependencia
```

### Nivel 2: Ampliar Contexto (automático)
```
1. Leer archivos adyacentes (imports, dependencias)
2. Revisar tests para entender comportamiento esperado
3. Consultar historial git del archivo
```

### Nivel 3: Escalar al Usuario (manual)
```
⛔ LOOP DETECTADO

Error: TypeError: Cannot read property 'id' of undefined
Archivo: src/services/auth.ts:42
Intentos: 3
Estrategias probadas:
  1. Agregar null check → generó error en caller
  2. Inicializar objeto vacío → falló validación
  3. Agregar default parameter → TypeScript error

Contexto del loop:
  - El objeto `user` llega como undefined desde `getSession()`
  - `getSession()` devuelve undefined cuando el token expira
  - El fix necesita decisión de negocio: ¿redirigir al login o renovar token?

Opciones sugeridas:
  A) Redirigir al login cuando el token expira
  B) Implementar refresh token automático
  C) Otro enfoque: [tu input]
```

## Integración con Auto-Corrección Existente

Esta habilidad **extiende** la auto-corrección existente, no la reemplaza:

```
Auto-Corrección (aprendizajes)     Detección de Loops (guard)
├── Registra correcciones           ├── Registra intentos de fix
├── Acumula reglas                  ├── Detecta ciclos
├── Previene errores futuros        ├── Previene loops presentes
└── Propone al usuario              └── Escala al usuario
```

## Registro en Memoria

Cuando un loop se resuelve, se registra en `.especdev/memoria/loops-resueltos.md`:

```markdown
## Loop Resuelto: 2026-03-21

- **Error:** TypeError en auth.ts:42
- **Causa raíz:** Token expirado no manejado
- **Intentos antes de resolución:** 3
- **Estrategia exitosa:** Nivel 3 (decisión del usuario: refresh token)
- **Regla aprendida:** Siempre manejar caso de token expirado en servicios auth
```

## Métricas

El sistema trackea:

| Métrica | Propósito |
|---------|-----------|
| Loops detectados por sesión | Medir frecuencia |
| Intentos promedio antes de detección | Medir eficiencia |
| Estrategia de escape más efectiva | Optimizar respuesta |
| Tokens ahorrados vs sin detección | Justificar la habilidad |

## Guardrails

- **Nunca** silenciar un loop — siempre informar
- **Nunca** superar el stop-loss (8 intentos) sin escalar
- **Siempre** registrar el loop resuelto para aprendizaje futuro
- **Siempre** proponer opciones al usuario, no decidir en loops de Nivel 3

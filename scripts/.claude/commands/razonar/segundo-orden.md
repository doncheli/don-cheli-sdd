# /razonar:segundo-orden

Pensar en las consecuencias de las consecuencias. Ir más allá del efecto inmediato.

## Uso

```
/razonar:segundo-orden [decisión]
```

## Proceso

1. **Decisión**: ¿Qué estamos considerando?
2. **Primer orden**: ¿Qué pasa inmediatamente?
3. **Segundo orden**: ¿Qué pasa como resultado de eso?
4. **Tercer orden**: ¿Y después de eso?
5. **Evaluación**: ¿Los efectos a largo plazo son aceptables?

## Ejemplo

```
/razonar:segundo-orden "Agregar caché agresivo para mejorar rendimiento"

1er orden: ✅ Respuestas 10x más rápidas
2do orden: ⚠️ Datos desactualizados para usuarios
3er orden: ❌ Usuarios toman decisiones con info vieja
           ❌ Soporte recibe quejas de inconsistencia

→ Decisión: Caché con TTL corto + invalidación selectiva
```

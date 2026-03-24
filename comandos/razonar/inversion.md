---
description: Resolver un problema pensando al revés: ¿cómo GARANTIZARÍAMOS el fracaso?
i18n: true
---

# /razonar:inversion

Resolver un problema pensando al revés: ¿cómo GARANTIZARÍAMOS el fracaso?

## Uso

```
/razonar:inversion [objetivo]
```

## Proceso

1. **Definir** el objetivo deseado
2. **Invertir**: ¿Cómo garantizaríamos el fracaso?
3. **Listar** todas las formas de fallar
4. **Invertir** cada fallo → acción preventiva
5. **Priorizar** acciones preventivas

## Ejemplo

```
/razonar:inversion "Lanzamiento exitoso de v2.0"

¿Cómo GARANTIZAR que el lanzamiento falle?
- No hacer tests de regresión
- Desplegar un viernes a las 6pm
- No tener plan de rollback
- Ignorar feedback de beta testers

→ Inversión = nuestro plan:
- Tests de regresión obligatorios
- Desplegar martes a las 10am
- Plan de rollback documentado
- Ciclo de beta testing
```

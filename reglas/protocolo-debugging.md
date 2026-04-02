# Protocolo de Debugging e Integración

## Contexto

Esta regla existe porque los problemas de debugging de integración son diferentes a bugs de código. En integración, hay múltiples sistemas interactuando y las causas raíz son frecuentemente distintas a lo que parece inicialmente.

---

## Regla de Oro: Verificar Antes de Proponer

```
VEVE → Verificar Estado Real → Validar Expectativas → Explicar
```

### Paso 1: Verificar Estado Real

Antes de asumir o proponer una solución, **confirmar**:

| Pregunta | Herramienta |
|---------|------------|
| ¿Dónde se leen los archivos de config? | `opencode debug config` |
| ¿Dónde se guardan los logs? | `~/.local/share/opencode/log/` |
| ¿Qué dice el log cuando ocurre el problema? | `tail -50 log/*.log` |
| ¿El sistema está leyendo el archivo que crees? | `opencode debug paths` |

### Paso 2: Validar Expectativas

Antes de asumir, **preguntar**:

- "¿Qué comportamiento esperas cuando X?"
- "¿Puedes mostrarme el output de `opencode debug skill`?"
- "¿Qué significa 'no funciona' exactamente?"

### Paso 3: Explicar

Despues de verificar, explicar:

```
CAUSE ANALYSIS [ID: timestamp]
|- Symptom: ¿Qué reportaste?
|- Technical Cause: ¿Qué dice el log?
|- Process Gap: ¿Qué asumimos mal?
```

---

## Errores Comunes en Debugging

| Error | Por qué ocurre | Cómo evitar |
|-------|----------------|-------------|
| Asunción de causa raíz | Pareció obvio | Verificar logs primero |
| Mezclar problemas | Múltiples issues simultáneos | Separar y priorizar |
| Proponer sin verificar | Querer resolver rápido | Regla VEVE |
| No confirmar contexto | Asumir que el otro sabe lo mismo | Preguntar expectativas |

---

## Debugging de Integración Multi-Sistema

Cuando el problema involucra más de un sistema (ej: opencode + don-cheli):

1. **Mapear la frontera**: ¿Dónde termina un sistema y empieza otro?
2. **Verificar interfaces**: ¿Qué pasa entre ellos?
3. **Verificar config**: ¿Los archivos están en el lugar correcto?
4. **Verificar logs**: ¿Qué dice cada sistema?

---

## Aplicación

Esta regla se aplica **siempre** en:
- Debugging de integrations
- Problemas de configuración
- Problemas donde el usuario dice "no funciona"
- Cualquier situación con múltiples sistemas interactuando

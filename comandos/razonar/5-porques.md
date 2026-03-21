# /razonar:5-porques

Análisis de causa raíz preguntando "¿por qué?" repetidamente hasta llegar al origen del problema.

## Uso

```
/razonar:5-porques [problema]
```

## Proceso

1. Plantear el problema
2. Preguntar "¿Por qué?" → Respuesta 1
3. Preguntar "¿Por qué?" sobre la respuesta → Respuesta 2
4. Repetir hasta llegar a la causa raíz (usualmente 5 niveles)
5. Proponer solución a la causa raíz

## Ejemplo

```
/razonar:5-porques "Los tests fallan intermitentemente"

¿Por qué? → Condición de carrera
¿Por qué? → Estado compartido entre tests
¿Por qué? → Singleton global
¿Por qué? → Diseño legacy sin revisión
¿Por qué? → No hay proceso de revisión arquitectónica

→ Causa raíz: problema de PROCESO, no solo de código
→ Solución: Implementar revisión arquitectónica + refactorizar singleton
```

## Combina bien con

- `/razonar:primeros-principios`
- `/razonar:pre-mortem`

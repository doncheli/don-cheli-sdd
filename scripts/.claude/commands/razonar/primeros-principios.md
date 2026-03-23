# /razonar:primeros-principios

Descomponer un problema o suposición a sus verdades fundamentales, luego reconstruir el entendimiento desde cero.

## Uso

```
/razonar:primeros-principios [tema]
```

## Descripción

El Pensamiento de Primeros Principios te ayuda a escapar de la sabiduría convencional cuestionando suposiciones. En vez de razonar por analogía ("¿cómo lo hacen otros?"), razonas desde lo básico ("¿qué es fundamentalmente verdad?").

**Usar cuando:**
- Los enfoques convencionales se sienten incorrectos
- Necesitas innovación, no iteración
- Las suposiciones están limitando las opciones
- Enfrentas restricciones "imposibles"

## Proceso

1. **Identificar suposiciones** — Listar lo que das por sentado
2. **Descomponer a lo fundamental** — ¿Qué es innegablemente verdad?
3. **Cuestionar cada suposición** — ¿Es realmente necesaria?
4. **Reconstruir desde lo básico** — ¿Qué soluciones emergen de lo fundamental?

## Ejemplo

```
/razonar:primeros-principios "Necesitamos microservicios para escalar"

SUPOSICIONES:
- Los microservicios son necesarios para escalar
- Los monolitos no escalan
- Las empresas grandes saben más

FUNDAMENTOS:
- Necesitamos X solicitudes/segundo
- Tenemos Y desarrolladores
- Necesitamos Z frecuencia de despliegue

RECONSTRUCCIÓN:
Nuestra escala: 1000 req/s → El monolito maneja fácilmente
Nuestro equipo: 5 devs → Pueden coordinarse en monolito
Conclusión: Un monolito modular nos sirve mejor
```

## Combina bien con

- `/razonar:inversion`
- `/razonar:5-porques`

---
description: Generar pseudocódigo agnóstico de tecnología desde las specs antes de planificar
i18n: true
---

# /dc:pseudocodigo

## Objetivo

Crear un artefacto de pseudocódigo de alto nivel entre la fase de especificación y la planificación técnica. Fuerza al agente a razonar sobre la LÓGICA del sistema sin comprometer stack, framework o estructura de archivos.

Inspirado en la fase "P" (Pseudocode) del framework SPARC.

## Uso

```
/dc:pseudocodigo                    # Desde las specs del sprint actual
/dc:pseudocodigo @specs/auth/       # Para un dominio específico
```

## Comportamiento

1. **Leer** las specs Gherkin del dominio
2. **Extraer** los flujos principales (happy path + sad paths)
3. **Generar** pseudocódigo agnóstico:
   - Sin nombres de funciones reales
   - Sin imports ni frameworks
   - Sin tipos de datos específicos del lenguaje
   - Solo lógica: CUANDO/SI/SINO/PARA-CADA/RETORNAR
4. **Identificar** invariantes (condiciones siempre verdaderas)
5. **Listar** casos límite y dependencias de datos
6. **Guardar** en `.dc/pseudocodigo.md`

## Por qué existe

Sin pseudocódigo, el agente salta de "qué hacer" (spec) a "cómo implementar" (plan técnico) sin pasar por "qué lógica necesito". Esto causa:
- Sobre-ingeniería (resolver problemas que no existen)
- Under-ingeniería (olvidar edge cases obvios)
- Acoplamiento temprano a un framework

El pseudocódigo es el "boceto" del arquitecto antes de los planos.

## Integración en el Pipeline

```
especificar → clarificar → PSEUDOCÓDIGO → planificar-tecnico → desglosar → implementar
```

Es opcional pero recomendado para tareas de complejidad ≥ 2 (Estándar).

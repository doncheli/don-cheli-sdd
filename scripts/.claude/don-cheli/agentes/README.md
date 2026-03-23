# Sistema de Agentes Don Cheli

## Agentes Disponibles

| Agente | Modelo | Rol | Costo |
|--------|--------|-----|-------|
| `planificador` | opus | Planificación, descomposición | $$$ |
| `arquitecto` | opus | Diseño de sistemas | $$$ |
| `ejecutor` | sonnet | Implementación | $$ |
| `revisor` | opus | Revisión de código | $$$ |
| `tester` | sonnet | Tests | $$ |
| `documentador` | haiku | Documentación | $ |
| `estimador` | opus | Estimados de desarrollo | $$$ |

## Flujo de Trabajo

```
Modo Completo: planificador → arquitecto → ejecutor ↔ tester → revisor → documentador
Modo Rápido:   ejecutor → tester → documentador
```

## Estrategia de Costos

```
Opus   = PIENSA y DECIDE  ($$$ - para decisiones críticas)
Sonnet = EJECUTA           ($$ - para implementación)
Haiku  = LEE y DOCUMENTA   ($ - para tareas simples)
```

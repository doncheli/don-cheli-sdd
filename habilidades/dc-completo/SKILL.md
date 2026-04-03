---
name: dc-completo
description: Modo completo para proyectos grandes y complejos (Nivel 3). Usa cuando el usuario dice "modo completo", "proyecto grande", "complejo", "full mode", "large project", "complex feature", "level 3", "gran proyecto". Activa el workflow SDD completo con todas las fases: especificar → planificar → estimar → implementar → testear → revisar.
i18n: true
---

## Objetivo
Iniciar modo completo (Nivel 3 - Complejo) para proyectos que requieren las 7 fases del ciclo de vida.
## Uso
```
/dc:completo <descripción del proyecto>
```
## Las 7 Fases
| Fase | Duración | Actividades |
|------|----------|-------------|
| 1. Descubrimiento | 1-2 días | Validar problema, investigar, descubrimientos |
| 2. Estrategia | 1 día | Hoja de ruta, hitos, decisiones |
| 3. Diseño | 2-3 días | Arquitectura, UX, especificaciones |
| 4. Desarrollo | Variable | TDD, implementación, iteración |
| 5. Calidad | 1-2 días | Testing, validación, rendimiento |
| 6. Lanzamiento | 1 día | Despliegue, documentación, release |
| 7. Crecimiento | Continuo | Monitoreo, feedback, iteración |
## Transiciones de Fase
Cada fase requiere criterios de Avance/No-Avance:
```markdown
## Fase [N] Completada
#### Lista de Verificación Avance/No-Avance
- [ ] Todas las tareas de la fase completadas
- [ ] Entregables verificados
- [ ] Sin bloqueadores
- [ ] Listo para siguiente fase
**Decisión:** AVANZAR / NO-AVANZAR
**Motivo:** [por qué]
```
## Des-escalamiento
Si después de la Estrategia el alcance es menor → des-escalar a `/dc:rapido`

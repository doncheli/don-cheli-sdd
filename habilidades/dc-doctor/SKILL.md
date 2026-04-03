---
name: dc-doctor
description: Diagnosticar y reparar problemas del framework Don Cheli, git y entorno. Usa cuando el usuario dice "doctor", "problemas del framework", "don cheli no funciona", "repair Don Cheli", "debug setup", "setup broken", "framework broken", "reparar entorno". Detecta y repara issues de configuración, git y dependencias automáticamente.
i18n: true
---

## Objetivo
Detectar y reparar automáticamente problemas comunes del framework, estado de git, worktrees, y entorno de desarrollo. Es el "médico" del proyecto.
## Uso
```
/dc:doctor                  # Diagnóstico completo + reparación automática
/dc:doctor --solo-diagnostico   # Solo reportar, no reparar
/dc:doctor --git            # Solo problemas de git
/dc:doctor --framework      # Solo problemas del framework
```
## Checks Realizados
#### Git Health
| Check | Detecta | Auto-repair |
|-------|---------|-------------|
| Detached HEAD | `git status` sin branch | `git checkout <branch>` |
| Stale lock files | `.git/index.lock` huérfano | Eliminar si proceso no existe |
| Worktrees huérfanos | Worktrees sin directorio de trabajo | `git worktree prune` |
| Branches huérfanas | Branches sin remote y sin actividad > 30 días | Listar para limpieza manual |
| Merge conflicts sin resolver | `<<<` markers en archivos tracked | Listar archivos afectados |
| Unstaged changes perdidos | Archivos modificados no commiteados | Warning + sugerir stash |
| Default branch detection | main vs master vs develop | Auto-detectar y configurar |
#### Framework Health
| Check | Detecta | Auto-repair |
|-------|---------|-------------|
| Archivos .dc faltantes | estado.md, plan.md, etc. no existen | Regenerar desde plantilla |
| config.yaml corrupto | YAML inválido | Regenerar con valores default |
| Versión desactualizada | VERSION < latest | Notificar actualización disponible |
| Capturas no procesadas | capturas.md con > 10 items pendientes | Warning |
| Sesión huérfana | Lock de sesión sin proceso activo | Limpiar lock |
| Habilidades faltantes | Referencia a habilidad que no existe | Warning + listar |
#### Environment Health
| Check | Detecta | Auto-repair |
|-------|---------|-------------|
| Node/Python no instalado | Runtime requerido no disponible | Warning con instrucciones |
| Docker no corriendo | Docker daemon parado | Warning |
| Puerto ocupado | Puerto 3000/5432/6379 en uso | Listar procesos |
| .env faltante | No existe .env pero sí .env.example | Copiar .env.example → .env |
| Dependencias desactualizadas | package-lock.json más viejo que package.json | `npm install` |
## Output
```
🏥 Don Cheli Doctor — Diagnóstico Completo
Git Health:
  ✅ Branch: main (up to date with origin)
  ✅ No stale locks
  ⚠️  2 worktrees huérfanos detectados → limpiados
  ✅ No merge conflicts
Framework Health:
  ✅ .dc/ completo (5/5 archivos)
  ✅ config.yaml válido
  ⚠️  3 capturas pendientes de procesar
  ✅ Versión 1.7.0 (última)
Environment:
  ✅ Node v22.2.0
  ✅ Docker running
  ⚠️  Puerto 5432 ocupado (postgres ya corriendo)
  ✅ .env existe
Resultado: ✅ SALUDABLE (2 warnings, 0 errores)
Reparaciones: 1 aplicada (worktrees limpiados)
```

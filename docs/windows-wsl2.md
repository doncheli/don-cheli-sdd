---
title: Don Cheli en Windows via WSL2
description: Guía de instalación para usuarios de Windows
---

# Don Cheli en Windows (WSL2)

Don Cheli corre en bash y requiere un entorno Unix. En Windows, la forma recomendada es **WSL2 con Ubuntu 22.04+**.

## Requisitos

- Windows 10 (build 19041+) o Windows 11
- WSL2 habilitado
- Ubuntu 22.04 LTS (recomendado)
- Node.js 18+ dentro de WSL2

## Instalar WSL2

```powershell
# En PowerShell como administrador
wsl --install -d Ubuntu-22.04
```

Reiniciar el equipo cuando se solicite. Luego abrir Ubuntu desde el menú de inicio y completar el setup (usuario + contraseña).

## Instalar Claude Code en WSL2

```bash
# Dentro del terminal Ubuntu
npm install -g @anthropic-ai/claude-code
claude --version
```

## Instalar Don Cheli en WSL2

```bash
# Opción A — desde npm (recomendado)
npx don-cheli@latest instalar

# Opción B — desde el repo
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash
```

Verificar: `cat ~/.claude/don-cheli/VERSION`

## Limitaciones conocidas

- **Rendimiento de disco**: operaciones sobre `/mnt/c/` son lentas; mantener proyectos en `~/` (filesystem de Linux).
- **Git line endings**: configurar `git config --global core.autocrlf false` dentro de WSL2.
- **Clipboard**: requiere VcXsrv o Windows 11 con WSLg para integración completa.
- **Docker**: usar Docker Desktop con integración WSL2 activada, no Docker nativo en WSL.
- **Claude Code GUI**: no disponible; usar solo CLI dentro de WSL2.

# Changelog

Todos los cambios notables de Don Cheli SDD se documentan en este archivo.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

## [Unreleased]

## [1.13.0] - 2026-03-24
### Añadido
- `/dc:` como prefijo principal (más corto y memorable), `/especdev:` queda como alias retrocompatible
- Nuevo comando `/dc:planning` — planning semanal de equipo con RFCs, WSJF y asignación
- Nueva habilidad `planning-equipo` — capacidad, RFCs, retrospectiva automática
- Comandos i18n: nombres traducidos por idioma de instalación (EN: `/dc:init`, PT: `/dc:começar`)
- Verificación de Anthropic Skills 2.0 integrada en `/dc:actualizar`
- Auto-check de actualizaciones al inicio de sesión con notificación i18n

### Cambiado
- `/dc:` es ahora el prefijo principal en los 3 READMEs (ES/EN/PT)
- Flags de comandos traducidos por idioma (`--type`, `--hypothesis` en EN)

### Corregido
- Frontmatter YAML agregado a los 15 comandos `/razonar:*` para conformidad con Claude Code
- Versiones sincronizadas en todos los archivos (VERSION, package.json, ambos instaladores)

## [1.12.0] - 2026-03-23
### Añadido
- Nuevo comando `/dc:mesa-tecnica` — mesa de expertos senior de desarrollo
- Roles senior (CPO, UX Lead, Negocio) en `/dc:debate` y `/dc:mesa-redonda`
- Presets de roles: `--preset tech`, `--preset product`, `--preset full`
- Reglas de evidencia e impacto cuantificado en debate

### Corregido
- 8 vulnerabilidades de seguridad en scripts shell (H1, H2, M1-M4, L1-L4)
- Renombrar `TMPDIR` → `INSTALL_TMPDIR` para evitar colisión con variable del sistema
- Guarda `FRAMEWORK_HOME` no vacío antes de `rm -rf`
- Validación numérica de `MAX_ITERACIONES` en `bucle.sh`
- `set -euo pipefail` en todos los scripts
- Cobertura `.gitignore` ampliada para `.env.*`

## [1.11.1] - 2026-03-23
### Corregido
- Instalador `curl | bash` no leía input del usuario (idioma) — ahora usa `/dev/tty`
- Descarga de archivos en modo pipe corregida

## [1.11.0] - 2026-03-23
### Añadido
- Soporte nativo para Google Antigravity (Gemini 3.1) — `GEMINI.md`, `.agent/skills/`, `.agent/workflows/`
- Cerrar brechas competitivas con BMAD, SPARC y Spec Kit
- 5 skills de Antigravity: `doncheli-spec`, `doncheli-plan`, `doncheli-implement`, `doncheli-review`, `doncheli-security`
- 4 workflows: `doncheli-start`, `doncheli-pipeline`, `doncheli-review`, `doncheli-security`

### Cambiado
- Inglés como README default con navegación multilenguaje

## [1.10.0] - 2026-03-23
### Añadido
- Compatibilidad con Anthropic Skills 2.0
- Skill Creator (`/dc:crear-skill`) para crear, probar y mejorar habilidades
- Marketplace de skills (`/dc:marketplace`)
- Metadata Skills 2.0 agregada a las 42 habilidades

### Cambiado
- READMEs multilenguaje (ES/EN/PT) con navegación

## [1.9.0] - 2026-03-23
### Añadido
- Features de GSD-2 incorporados: worktree isolation, crash recovery, cost tracking
- Detección de stuck via sliding-window pattern analysis
- Nuevos comandos y habilidades inspirados en GSD-2

## [1.8.0] - 2026-03-22
### Añadido
- Comando `/dc:presentar` — generar presentación interactiva HTML

## [1.7.1] - 2026-03-22
### Añadido
- LICENSE (Apache 2.0)
- CONTRIBUTING.md
- CODE_OF_CONDUCT.md

### Cambiado
- Bump de versión a 1.7.1

## [1.7.0] - 2026-03-22
### Añadido
- Soporte i18n completo al framework (es/en/pt)
- Selección de idioma en el instalador
- Archivos de locale (es.json, en.json, pt.json)
- Nombres de carpetas localizados por idioma
- Skill de presentaciones interactivas

### Corregido
- Cambio de español argentino a español venezolano en archivos públicos

## [1.6.0] - 2026-03-21
### Añadido
- Release inicial de Don Cheli — SDD Framework
- 55+ comandos `/especdev:*` para el ciclo completo de desarrollo
- 15 modelos de razonamiento `/razonar:*`
- 40+ habilidades modulares
- 4 modelos de estimación (COCOMO, Planning Poker, Function Points, Histórico)
- Auditoría de seguridad OWASP Top 10
- Pipeline completo: especificar → planificar → implementar → revisar
- TDD como ley de hierro (no negociable)
- 6 puertas de calidad formales
- Bucle autónomo para ejecución de historias de usuario
- Scripts de instalación, validación y bucle
- Plantillas para Docker, checklists y estimados

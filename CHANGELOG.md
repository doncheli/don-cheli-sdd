# Changelog

Todos los cambios notables en Don Cheli SDD Framework.

Formato basado en [Conventional Commits](https://www.conventionalcommits.org/).

## [1.15.3](https://github.com/doncheli/don-cheli-sdd/compare/v1.15.2...v1.15.3) (2026-04-01)

### Correcciones

* generar cobertura real con bash xtrace en formato Cobertura XML ([4c013a2](https://github.com/doncheli/don-cheli-sdd/commit/4c013a28cb8b7b3fcd6e382486b0f7e80f5f4aa5))

## [1.15.2](https://github.com/doncheli/don-cheli-sdd/compare/v1.15.1...v1.15.2) (2026-04-01)

### Correcciones

* compilar kcov desde source para cobertura real en CI ([fdef203](https://github.com/doncheli/don-cheli-sdd/commit/fdef2039741417c4b668c2ad723561153307e097))

## [1.15.1](https://github.com/doncheli/don-cheli-sdd/compare/v1.15.0...v1.15.1) (2026-04-01)

### Correcciones

* reemplazar reporte de cobertura falso por kcov real en CI ([c28bbf2](https://github.com/doncheli/don-cheli-sdd/commit/c28bbf292bd8dbfdb07603aee55a3690b71358c4))

## [1.15.0](https://github.com/doncheli/don-cheli-sdd/compare/v1.14.0...v1.15.0) (2026-04-01)

### Nuevas Funcionalidades

* agregar ejemplos Python/React, Codecov badge y Semantic Release ([157b78d](https://github.com/doncheli/don-cheli-sdd/commit/157b78d279736d5ef340c94f20407be6d995e3e9))
* instalador interactivo con perfiles de desarrollador ([8fff295](https://github.com/doncheli/don-cheli-sdd/commit/8fff295ca4b1fcd064c1d214b0bd6ec783d01d36))
* perfil Custom con selección interactiva via gum + auto-instalación de dependencias ([2f64adc](https://github.com/doncheli/don-cheli-sdd/commit/2f64adc772b7846406c8164d9c256390ac3f26be))
* soporte completo para OpenCode (SST) — agente [@doncheli](https://github.com/doncheli) + config ([b1191f2](https://github.com/doncheli/don-cheli-sdd/commit/b1191f2bc42621e51a1ff2b6d14b649dbe5fc6c2))

### Correcciones

* actualizar tests bats para usar /dc: en vez de /especdev: en assertions ([5a0e8e9](https://github.com/doncheli/don-cheli-sdd/commit/5a0e8e9b47f6d3228eed3b7a77d85edfe5d61f0d))
* auditoría i18n v1.14.0 — 12 correcciones de consistencia ([3b97438](https://github.com/doncheli/don-cheli-sdd/commit/3b97438cf3c7dab853a7be7824a07705db1cc996))
* reemplazar prefijo especdev: por dc: en instaladores + agregar docs web ([2c9e0bc](https://github.com/doncheli/don-cheli-sdd/commit/2c9e0bcf4822128f08d9c2d093926af88bf07426))

### Refactorización

* reemplazar /especdev: por /dc: como prefijo único en todo el proyecto ([734edc5](https://github.com/doncheli/don-cheli-sdd/commit/734edc53b3935565283b86c9876f231a75d7a853))

### Documentación

* agregar banners prominentes a doncheli.tv/comousar.html en los 3 READMEs ([17d0284](https://github.com/doncheli/don-cheli-sdd/commit/17d0284f556a5d524160f3e9a9b45bf8aa2ffbe4))
* agregar sección Instalación interactiva a READMEs ES y PT ([764d532](https://github.com/doncheli/don-cheli-sdd/commit/764d5326dc66f6ec9397b1e1428451723da31aa6))
* agregar tabla detallada de skills y razonamiento por perfil en 3 READMEs ([004fee2](https://github.com/doncheli/don-cheli-sdd/commit/004fee28b0045b1791d08c9eeb1d439340093699))
* reescribir READMEs (ES/EN/PT) con estructura orientada a venta y uso ([3eb5829](https://github.com/doncheli/don-cheli-sdd/commit/3eb58297bb1c44693e6802a4c6f37b1e4e144d1e))

## [1.14.0] - 2026-03-28
### Añadido
- **13 nuevos comandos** basados en tendencias de la industria (marzo 2026):
  - `/dc:drift` — Detectar divergencia entre specs y código (inspirado en GitHub Spec Kit)
  - `/dc:audit-trail` — Registro de todas las decisiones tomadas con IA
  - `/dc:tea` — Testing Autónomo End-to-End (inspirado en BMAD TEA Module)
  - `/dc:pr-review` — Revisión automática de PRs en GitHub
  - `/dc:data-policy` — Política de datos y privacidad del proyecto
  - `/dc:visual-test` — Testing visual de UI con detección de regresiones
  - `/dc:spec-score` — Puntaje cuantitativo de calidad de spec (IEEE/ISO)
  - `/dc:webhook` — Integración con triggers externos (GitHub, Slack, Linear)
  - `/dc:tech-debt` — Detector de deuda técnica acelerada por IA
  - `/dc:context-health` — Dashboard de salud del context window
  - `/dc:voice` — Integración con Voice Mode para dictar specs
  - `/dc:diagram` — Auto-generar diagramas Mermaid/C4 desde código
  - `/dc:changelog-auto` — Generar CHANGELOG automáticamente desde commits
- **13 nuevos skills Antigravity** correspondientes a cada comando nuevo
- Total de comandos: **85+** (antes 72+)
- Total de skills Antigravity: **27** (antes 14)

## [1.13.0] - 2026-03-24
### Añadido
- `/dc:` como prefijo principal (más corto y memorable), `/dc:` queda como alias retrocompatible
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
- 55+ comandos `/dc:*` para el ciclo completo de desarrollo
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

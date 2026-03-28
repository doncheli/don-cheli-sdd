---
description: Auto-generar entradas de CHANGELOG.md desde commits convencionales
i18n: true
---

# /dc:changelog-auto

## Objetivo

Parsear el historial de commits convencionales (feat, fix, docs, refactor, etc.) y generar automáticamente una sección de `CHANGELOG.md` en formato Keep a Changelog, agrupando cambios por versión, fecha y categoría. Elimina la carga manual de mantener el changelog.

## Uso

```
/dc:changelog-auto
/dc:changelog-auto --from v1.2.0 --to HEAD
/dc:changelog-auto --version 1.3.0
/dc:changelog-auto --dry-run
/dc:changelog-auto --format keepachangelog
```

## Comportamiento

1. **Detectar rango**: desde el último tag de versión hasta HEAD (o el rango especificado con `--from`/`--to`)
2. **Parsear commits** convencionales:
   - `feat:` → Added
   - `fix:` → Fixed
   - `refactor:` → Changed
   - `docs:` → Changed (documentación)
   - `perf:` → Changed (performance)
   - `test:` → omitido por default (configurable)
   - `chore:` → omitido por default (configurable)
   - `BREAKING CHANGE` → sección separada al tope
3. **Detectar versión**: desde el último tag semver o usar `--version` si se provee
4. **Agrupar** por categoría: Added, Changed, Fixed, Removed, Security, Deprecated
5. **Insertar** la nueva sección al tope del `CHANGELOG.md` existente (no sobrescribir)
6. Con `--dry-run`: solo imprimir sin modificar el archivo

### Formato Keep a Changelog

```markdown
## [1.3.0] - 2026-03-28

### Added
- feat: descripción del feature (abc1234)

### Changed
- refactor: descripción del refactor (def5678)

### Fixed
- fix: descripción del fix (ghi9012)

### Breaking Changes
- feat!: descripción (jkl3456) — migración requerida: ver docs/migration-1.3.0.md
```

### Reglas

- Excluir commits de merge automáticos (`Merge branch`, `Merge pull request`)
- Capitalizar la primera letra de cada entrada
- Incluir hash corto del commit como referencia
- Respetar el idioma de los commits existentes (no traducir)
- Si `CHANGELOG.md` no existe, crearlo con header estándar

## Output

```markdown
<!-- dc:changelog-auto — generado 2026-03-28 desde v1.2.0..HEAD -->

## [1.3.0] - 2026-03-28

### Added
- Integración con Voice Mode para dictar specs (#142, a1b2c3d)
- Generación automática de diagramas Mermaid (#138, e4f5g6h)

### Fixed
- Corregir detección de locale cuando config.yaml está ausente (#145, i7j8k9l)

### Changed
- Refactorizar parser de commits para soportar footers multi-línea (#140, m1n2o3p)
```

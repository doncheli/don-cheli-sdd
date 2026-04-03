---
name: dc-gate
description: Crear, listar y ejecutar quality gates custom del proyecto
i18n: true
---

## Subcomandos
#### `/dc:gate crear <nombre>`
Crear un nuevo quality gate custom en `.dc/gates/`:
1. Preguntar: nombre descriptivo, tipo (grep o script), severidad (block o warn)
2. Generar archivo YAML en `.dc/gates/<nombre>.yml`
3. Ejecutar el gate para verificar que funciona
#### `/dc:gate listar`
Listar todos los gates custom del proyecto:
1. Leer `.dc/gates/*.yml`
2. Mostrar tabla: nombre, tipo, severidad, estado (activo/desactivado)
#### `/dc:gate ejecutar [nombre]`
Ejecutar gates custom:
1. Si se pasa nombre: ejecutar solo ese gate
2. Sin nombre: ejecutar todos los gates en `.dc/gates/`
3. Mostrar resultado por gate con ✅/⚠️/❌
4. Resumen final: X pasaron, Y fallaron, Z advertencias
#### `/dc:gate ci`
Generar workflow de CI/CD para el proyecto actual:
1. Detectar plataforma (GitHub Actions / GitLab CI)
2. Copiar template desde `examples/ci/` adaptado al proyecto
3. Incluir custom gates si existen
## Formato de gate custom
```yaml
name: Nombre descriptivo
type: grep | script
pattern: "regex"          # Solo para type: grep
files: "src/**/*.ts"      # Solo para type: grep
severity: block | warn
message: "Mensaje al fallar"
run: |                    # Solo para type: script
  comando a ejecutar
```
## Severidad
- `block` — Falla la puerta, bloquea el merge
- `warn` — Advertencia, no bloquea (configurable con `fail-on-warn`)
## Ejemplos incluidos
Ver `examples/gates/` para 5 gates pre-configurados:
- `no-console-log.yml` — Prohibir console.log en producción
- `no-any-typescript.yml` — Evitar tipo `any` en TypeScript
- `no-hardcoded-secrets.yml` — Detectar secretos hardcodeados
- `max-file-lines.yml` — Archivos de máximo 300 líneas
- `require-error-handling.yml` — Manejo de errores en async

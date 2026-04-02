# Custom Quality Gates — Don Cheli SDD

## Que son

Los Custom Gates permiten a cada equipo definir sus propias reglas de calidad en formato YAML. Se ejecutan automaticamente en CI/CD y en `/dc:revisar`.

## Crear un gate

```bash
/dc:gate crear no-console-log
```

O manualmente, crea un archivo YAML en `.dc/gates/`:

```yaml
# .dc/gates/no-console-log.yml
name: No console.log en produccion
type: grep
pattern: "console\\.log"
files: "src/**/*.ts"
severity: block
message: "console.log detectado. Usa el logger del proyecto."
```

## Tipos de gate

### `grep` — Buscar patrones en archivos

```yaml
type: grep
pattern: "regex_pattern"
files: "src/**/*.ts"    # Glob de archivos a escanear
```

Pasa si NO encuentra el patron. Falla si lo encuentra.

### `script` — Ejecutar comando

```yaml
type: script
run: |
  find src/ -name "*.ts" -exec wc -l {} + | awk '$1 > 300 {print; found=1} END {exit found}'
```

Pasa si el script retorna exit 0. Falla con exit 1.

## Severidad

| Severidad | Comportamiento |
|-----------|---------------|
| `block` | Bloquea el merge. El check falla. |
| `warn` | Advertencia. El check pasa (salvo `fail-on-warn: true`). |

## Ejemplos incluidos

| Gate | Tipo | Severidad | Que detecta |
|------|------|-----------|-------------|
| `no-console-log` | grep | block | `console.log` en produccion |
| `no-any-typescript` | grep | warn | Tipo `any` en TypeScript |
| `no-hardcoded-secrets` | grep | block | Passwords/tokens hardcodeados |
| `max-file-lines` | script | warn | Archivos de mas de 300 lineas |
| `require-error-handling` | grep | warn | Async sin try/catch |

Para usar los ejemplos:

```bash
# Copiar ejemplos a tu proyecto
cp examples/gates/*.yml .dc/gates/
```

## Gestionar gates

```bash
/dc:gate listar            # Ver gates del proyecto
/dc:gate ejecutar          # Ejecutar todos
/dc:gate ejecutar mi-gate  # Ejecutar uno especifico
/dc:gate ci                # Generar workflow CI con gates
```

## Integracion con CI

Los custom gates se ejecutan automaticamente cuando usas el GitHub Action:

```yaml
- uses: doncheli/don-cheli-sdd@main
  with:
    gates: all          # incluye custom gates
    custom-gates-dir: .dc/gates
```

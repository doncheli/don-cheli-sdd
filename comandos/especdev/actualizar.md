---
description: Detectar actualizaciones del framework Don Cheli y aplicarlas
i18n: true
---

# /especdev:actualizar

## Objetivo

Verificar si hay actualizaciones disponibles en el repositorio de Don Cheli y ofrecer aplicarlas.

## Uso

```
/especdev:actualizar
/especdev:actualizar --verificar    # Solo verificar, no aplicar
/especdev:actualizar --forzar       # Aplicar sin confirmar
```

## Proceso

### 1. Detectar instalación

```bash
# Verificar dónde está instalado
GLOBAL="$HOME/.claude/don-cheli"
LOCAL="./.claude/don-cheli"

if [ -f "$GLOBAL/VERSION" ]; then
  INSTALACION="$GLOBAL"
elif [ -f "$LOCAL/VERSION" ]; then
  INSTALACION="$LOCAL"
else
  echo "Don Cheli no está instalado"
  exit 1
fi

VERSION_LOCAL=$(cat "$INSTALACION/VERSION")
```

### 2. Verificar versión remota

```bash
VERSION_REMOTA=$(curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION)
```

### 3. Comparar

```
=== Verificación de Actualización ===

Versión instalada: 1.6.0
Versión disponible: 1.7.0

Estado: ⚠️ Actualización disponible
```

### 4. Mostrar cambios

Obtener el changelog entre versiones:

```bash
# Mostrar commits entre versiones
curl -s "https://api.github.com/repos/doncheli/don-cheli-sdd/compare/v${VERSION_LOCAL}...v${VERSION_REMOTA}" \
  | jq '.commits[].commit.message'
```

### 5. Preguntar al usuario

```
¿Deseas actualizar Don Cheli de v1.6.0 a v1.7.0? (s/n)
```

### 6. Aplicar actualización

```bash
# Clonar versión nueva en temporal
TEMP=$(mktemp -d)
git clone --depth 1 https://github.com/doncheli/don-cheli-sdd.git "$TEMP"

# Ejecutar instalador
cd "$TEMP" && bash scripts/instalar.sh --global

# Limpiar
rm -rf "$TEMP"
```

## Output

```
=== Actualización Completada ===

✅ Don Cheli actualizado: v1.6.0 → v1.7.0

Cambios aplicados:
- 3 habilidades nuevas
- 2 comandos nuevos
- 5 archivos actualizados

Reinicia Claude Code para aplicar los cambios.
```

## Verificación Automática

Si se configura en `.especdev/config.yaml`:

```yaml
actualizaciones:
  verificar_al_iniciar: true
  frecuencia: semanal  # diario | semanal | nunca
```

El comando `/especdev:continuar` verifica automáticamente si hay actualizaciones disponibles y notifica al usuario sin interrumpir el flujo.

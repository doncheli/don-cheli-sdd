#!/bin/bash
# Don Cheli - Script de Validación
# Valida la estructura del framework

set -euo pipefail

VERDE='\033[0;32m'
ROJO='\033[0;31m'
AMARILLO='\033[1;33m'
NC='\033[0m'

echo "=== Validación Don Cheli ==="
echo ""

ERRORES=0
ADVERTENCIAS=0

# Verificar directorios principales
for dir in comandos habilidades ganchos reglas plantillas agentes scripts; do
    if [ -d "$dir" ]; then
        echo -e "${VERDE}✅${NC} $dir/"
    else
        echo -e "${ROJO}❌${NC} $dir/ (faltante)"
        ERRORES=$((ERRORES + 1))
    fi
done

# Verificar archivos raíz
for archivo in README.md CLAUDE.md LICENCIA package.json VERSION; do
    if [ -f "$archivo" ]; then
        echo -e "${VERDE}✅${NC} $archivo"
    else
        echo -e "${ROJO}❌${NC} $archivo (faltante)"
        ERRORES=$((ERRORES + 1))
    fi
done

# Verificar que cada habilidad tiene HABILIDAD.md
echo ""
echo "Verificando habilidades..."
for dir in habilidades/*/; do
    if [ -f "${dir}HABILIDAD.md" ]; then
        echo -e "${VERDE}✅${NC} ${dir}HABILIDAD.md"
    else
        echo -e "${AMARILLO}⚠️${NC} ${dir}HABILIDAD.md (faltante)"
        ADVERTENCIAS=$((ADVERTENCIAS + 1))
    fi
done

# Contar comandos
ESPECDEV_COUNT=$(find comandos/especdev/ -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
RAZONAR_COUNT=$(find comandos/razonar/ -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
UTIL_COUNT=$(find comandos/ -maxdepth 1 -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

echo ""
echo "Resumen:"
echo "- Comandos /dc:*: $ESPECDEV_COUNT"
echo "- Comandos /razonar:*: $RAZONAR_COUNT"
echo "- Comandos utilidad: $UTIL_COUNT"
echo "- Errores: $ERRORES"
echo "- Advertencias: $ADVERTENCIAS"

if [ "$ERRORES" -eq 0 ]; then
    echo ""
    echo -e "${VERDE}✅ Framework válido${NC}"
else
    echo ""
    echo -e "${ROJO}❌ Framework con errores${NC}"
    exit 1
fi

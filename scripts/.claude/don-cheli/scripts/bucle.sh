#!/bin/bash
# Don Cheli - Bucle Autónomo
# Ejecuta historias de usuario en contexto fresco hasta completar

set -euo pipefail

# Colores
VERDE='\033[0;32m'
AMARILLO='\033[1;33m'
ROJO='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuración
HERRAMIENTA="${1:-claude}"
MAX_ITERACIONES="${2:-10}"

# Retrocompatible: usar .especdev/ si ya existe, .dc/ si es nuevo
if [ -d ".especdev" ]; then
    DC_DIR=".especdev"
else
    DC_DIR=".dc"
fi
PRD_FILE="${DC_DIR}/sesion/prd.json"
PROGRESO_FILE="${DC_DIR}/progreso.md"

# Validate MAX_ITERACIONES is a positive integer
if ! [[ "$MAX_ITERACIONES" =~ ^[0-9]+$ ]]; then
    echo -e "${ROJO}Error: MAX_ITERACIONES debe ser un entero positivo, recibido: '$MAX_ITERACIONES'${NC}"
    exit 1
fi

echo "╔═══════════════════════════════════════╗"
echo "║       Don Cheli - Bucle Autónomo        ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# Verificar prerrequisitos
if [ ! -f "$PRD_FILE" ]; then
    echo -e "${ROJO}Error: $PRD_FILE no encontrado${NC}"
    echo "Ejecuta /historias-generar primero para crear el PRD."
    exit 1
fi

# Contar historias
TOTAL=$(python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d.get('historiasUsuario', d.get('userStories', []))))" < "$PRD_FILE" 2>/dev/null || echo "0")
PENDIENTES=$(python3 -c "import json,sys; d=json.load(sys.stdin); stories=d.get('historiasUsuario', d.get('userStories', [])); print(len([s for s in stories if not s.get('pasa', s.get('passes', False))]))" < "$PRD_FILE" 2>/dev/null || echo "0")

echo -e "${CYAN}=== Bucle Don Cheli Iniciado ===${NC}"
echo "Herramienta: $HERRAMIENTA"
echo "Historias: $PENDIENTES pendientes, $((TOTAL - PENDIENTES)) completadas"
echo "Máximo iteraciones: $MAX_ITERACIONES"
echo ""

# Verificar si hay trabajo
if [ "$PENDIENTES" -eq 0 ]; then
    echo -e "${VERDE}Todas las historias ya están completadas. Nada que hacer.${NC}"
    exit 0
fi

# Bucle principal
for i in $(seq 1 "$MAX_ITERACIONES"); do
    echo -e "${CYAN}--- Iteración $i/$MAX_ITERACIONES ---${NC}"
    
    # Seleccionar siguiente historia (sanitize: strip control chars)
    HISTORIA_RAW=$(python3 -c "
import json, sys, re
d = json.load(sys.stdin)
stories = d.get('historiasUsuario', d.get('userStories', []))
for s in sorted(stories, key=lambda x: x.get('prioridad', x.get('priority', 99))):
    if not s.get('pasa', s.get('passes', False)):
        title = re.sub(r'[\x00-\x1f\x7f]', '', f\"{s.get('id', 'HU-???')} {s.get('titulo', s.get('title', 'Sin titulo'))}\")
        print(title)
        break
" < "$PRD_FILE" 2>/dev/null)
    HISTORIA="${HISTORIA_RAW:-}"
    
    if [ -z "$HISTORIA" ]; then
        echo -e "${VERDE}=== COMPLETO ===${NC}"
        echo "Todas las historias pasaron en $i iteraciones."
        echo "Ver progreso: $PROGRESO_FILE"
        exit 0
    fi
    
    echo "Historia: $HISTORIA"
    
    # Ejecutar con el agente seleccionado (contexto fresco)
    case "$HERRAMIENTA" in
        claude)
            echo "Ejecutando con Claude (contexto fresco)..."
            # claude --print "Implementa la siguiente historia de usuario: $HISTORIA. Lee .dc/sesion/prd.json (o .especdev/ si existe) para los criterios de aceptación." 2>/dev/null || true
            ;;
        codex)
            echo "Ejecutando con Codex (contexto fresco)..."
            ;;
        amp)
            echo "Ejecutando con Amp (contexto fresco)..."
            ;;
    esac
    
    # Registrar progreso
    echo "### Iteración $i - $(date)" >> "$PROGRESO_FILE"
    echo "- Historia: $HISTORIA" >> "$PROGRESO_FILE"
    echo "" >> "$PROGRESO_FILE"
    
    echo ""
done

echo -e "${AMARILLO}Máximo de iteraciones ($MAX_ITERACIONES) alcanzado.${NC}"
echo "Historias restantes pueden necesitar intervención manual."

# Contribuir a Don Cheli

Don Cheli es el framework SDD más completo para Claude Code y agentes de IA. Tu contribución ayuda a que más desarrolladores dejen de improvisar y empiecen a entregar con evidencia.

## Requisitos previos

- [Claude Code](https://claude.ai/download) instalado
- Git
- Conocimiento básico de Markdown y YAML frontmatter
- Bash (para probar scripts)

## Setup local

```bash
# 1. Fork y clonar
git clone https://github.com/TU_USUARIO/don-cheli-sdd.git
cd don-cheli-sdd

# 2. Instalar localmente
bash scripts/instalar.sh

# 3. Verificar que todo funciona
bash scripts/validar.sh

# 4. Crear rama para tu cambio
git checkout -b feature/mi-mejora
```

## Tipos de contribuciones

### Nuevos comandos `/dc:*`

Agregar archivos en `comandos/especdev/nombre-del-comando.md`. Cada comando necesita:

```markdown
---
description: Descripción breve del comando (obligatorio)
i18n: true
---

# /dc:nombre-del-comando

## Objetivo
Qué hace el comando y cuándo usarlo.

## Uso
\```
/dc:nombre-del-comando "<argumento>"
/dc:nombre-del-comando --flag valor
\```

## Comportamiento
1. Paso 1
2. Paso 2

## Output
\```markdown
Ejemplo del output esperado
\```
```

### Nuevas habilidades

Crear carpeta en `habilidades/nombre-habilidad/HABILIDAD.md`:

```
habilidades/mi-habilidad/
├── HABILIDAD.md          # Documentación principal (obligatorio)
├── modelos/              # Sub-componentes (opcional)
└── plantillas/           # Templates (opcional)
```

El `HABILIDAD.md` debe incluir: versión, categoría, tipo, problema que resuelve, cuándo usarla y cuándo no.

### Nuevos modelos de razonamiento

Agregar en `comandos/razonar/nombre-modelo.md` con frontmatter YAML (`description`, `i18n: true`).

### Correcciones de documentación

PRs de typos, mejoras de claridad o traducciones son bienvenidos. Los READMEs están en 3 idiomas (ES/EN/PT) — asegúrate de actualizar los 3 si el cambio aplica.

### Mejoras a scripts

Scripts en `scripts/`. Todos usan `set -euo pipefail`. Probar en macOS y Linux antes de enviar.

## Criterios de aceptación de PRs

Para que un PR sea mergeado debe cumplir:

- [ ] Descripción clara del problema que resuelve
- [ ] Código (variables, funciones, comentarios) en inglés; documentación y commits en español
- [ ] No rompe comandos ni habilidades existentes
- [ ] Sigue convenciones de nombrado: `kebab-case` para archivos, frontmatter YAML válido
- [ ] Si agrega comando: tiene `description` en frontmatter
- [ ] Si agrega habilidad: tiene `HABILIDAD.md` con formato estándar
- [ ] Si modifica READMEs: actualiza los 3 idiomas
- [ ] Probado localmente con `bash scripts/validar.sh`

## Issues para empezar

Busca issues con la etiqueta **`good first issue`** — son tareas concretas, acotadas e ideales para familiarizarte con el proyecto.

## Convenciones

- **Commits:** `<type>: <descripción en español>` (feat, fix, docs, refactor, test, chore)
- **Branches:** `feature/<nombre>`, `fix/<nombre>`
- **Archivos:** kebab-case, `.md` para comandos y habilidades
- **Frontmatter:** YAML entre `---`, campos `description` (obligatorio) e `i18n: true`

## Código de conducta

Respeto mutuo. Comunicación constructiva. Código siempre en inglés (variables, funciones, comentarios). Documentación y commits en español. Seguimos el [Contributor Covenant](CODE_OF_CONDUCT.md).

## Reconocimientos

Los contribuidores aparecen en el README del proyecto. Toda contribución mergeada cuenta.

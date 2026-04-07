---
description: Instalar y gestionar skills desde el marketplace de Anthropic y la comunidad. Usa cuando el usuario dice "marketplace", "install skill", "skills marketplace", "anthropic marketplace", "community skills", "instalar habilidad", "download skill", "skill registry". Busca, instala y gestiona skills desde el marketplace.
i18n: true
---

# /dc:marketplace

## Objetivo

Conectar Don Cheli con el ecosystem de Skills de Anthropic y la comunidad. Permite instalar, actualizar y compartir skills desde múltiples fuentes.

## Uso

```
/dc:marketplace                              # Listar skills disponibles
/dc:marketplace --instalar <nombre>          # Instalar skill específica
/dc:marketplace --buscar "weekly report"     # Buscar skills
/dc:marketplace --actualizar                 # Buscar y aplicar updates de skills de terceros
/dc:marketplace --actualizar --verificar     # Solo verificar, no aplicar
/dc:marketplace --fuente anthropic            # Solo skills oficiales
/dc:marketplace --fuente comunidad            # Solo skills de la comunidad
/dc:marketplace --exportar <skill>           # Exportar skill para compartir
/dc:marketplace --verificar                  # Verificar integridad de skills instaladas
```

## Fuentes de Skills

### 1. Anthropic Official
- **Repo:** `https://github.com/anthropics/skills`
- **Incluye:** document-skills, example-skills (skill-creator, MCP builder, visual design, web testing, etc.)
- **Instalación:** Automática vía `git clone` selectivo

### 2. Don Cheli Built-in
- **Ubicación:** `habilidades/` del framework
- **Incluye:** 42 habilidades especializadas en SDD
- **Formato:** HABILIDAD.md (compatible con SKILL.md)

### 3. Comunidad
- **Fuentes:**
  - `https://skillsmp.com/`
  - `https://www.aitmpl.com/skills`
- **Seguridad:** Las skills de la comunidad se instalan en sandbox y requieren revisión manual antes de activar

## Comportamiento

### Instalar desde Anthropic
```bash
/dc:marketplace --instalar document-skills --fuente anthropic
```
1. Clonar el repo oficial (o fetch selectivo)
2. Copiar la skill a `.claude/skills/`
3. Verificar que el SKILL.md tenga metadata válida
4. Registrar en el inventario local

### Instalar desde Comunidad
```bash
/dc:marketplace --instalar weekly-report-generator --fuente comunidad
```
1. Descargar la skill
2. **Escaneo de seguridad:** Verificar que no contenga scripts maliciosos
3. Mostrar el contenido del SKILL.md al usuario para revisión
4. Instalar solo si el usuario aprueba

### Exportar skill propia
```bash
/dc:marketplace --exportar mi-skill
```
1. Empaquetar la skill como ZIP
2. Generar README con instrucciones de instalación
3. Opcionalmente publicar como Gist de GitHub

## Compatibilidad de Formatos

| Formato | Extensión | Don Cheli | Anthropic | Comunidad |
|---------|-----------|-----------|-----------|-----------|
| HABILIDAD.md | `.md` | Nativo | Requiere conversión | No |
| SKILL.md | `.md` | Compatible | Nativo | Nativo |

Don Cheli lee ambos formatos automáticamente. Al instalar una skill en formato SKILL.md, se mantiene tal cual (no se convierte).

## Inventario Local

```bash
/dc:marketplace --listar
```

```
Skills Instaladas

Built-in (Don Cheli):
  42 habilidades en habilidades/

Anthropic Official:
  document-skills (v2.1.0)
  example-skills (v1.5.0)

Comunidad:
  weekly-report-gen (por @user123) — verificada
  competitor-analysis (por @user456) — pendiente de revisión

Total: 46 skills activas
```

## Auto-Update de Skills de Terceros

### Cómo funciona

Don Cheli mantiene un registro de skills instaladas en `skill-registry.json` dentro del FRAMEWORK_HOME. El registro trackea:

- **SHA del último commit** de cada repo fuente (Anthropic, comunidad)
- **Fecha del último check**
- **Skills instaladas** con fuente y versión

### Verificación automática

Al inicio de cada sesión, Don Cheli:
1. Lee `skill-registry.json`
2. Consulta los repos de origen para detectar cambios
3. Si hay updates → notifica al usuario (NO auto-aplica)
4. El usuario decide si actualizar con `/dc:marketplace --actualizar`

### Actualizar skills

```bash
/dc:marketplace --actualizar
```

Comportamiento:
1. **Anthropic Official** — Compara SHA del repo. Si hay commits nuevos:
   - Descarga la versión nueva
   - Compara los SKILL.md locales vs remotos
   - Actualiza solo los que cambiaron
   - Registra el nuevo SHA

2. **Don Cheli Built-in** — Se actualiza con `/dc:actualizar` (framework completo)

3. **Comunidad** — NO se auto-actualiza (seguridad). El usuario debe reinstalar manualmente.

### Script ejecutable

```bash
bash scripts/skill-updater.sh                   # Check all sources
bash scripts/skill-updater.sh --apply            # Apply updates
bash scripts/skill-updater.sh --quiet            # Silent (for session start)
bash scripts/skill-updater.sh --source anthropic # Check specific source
```

### Output

```
  Don Cheli — Skill Updater

  Actualizaciones disponibles:

    Anthropic Skills: nuevos commits disponibles
    Don Cheli: v1.22.0 → v1.23.0

  Ejecuta /dc:marketplace --actualizar para aplicar.
```

## Seguridad

- Skills oficiales de Anthropic: **confianza total** (auto-update habilitado)
- Skills de Don Cheli: **confianza total** (auto-update via /dc:actualizar)
- Skills de comunidad: **requieren revisión manual** (NO auto-update)
  - No ejecutar scripts sin inspección
  - Verificar que no acceda a archivos fuera del proyecto
  - Verificar que no envíe datos a servicios externos

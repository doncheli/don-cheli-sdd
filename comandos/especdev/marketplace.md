---
description: Instalar y gestionar skills desde el marketplace de Anthropic y la comunidad
i18n: true
---

# /especdev:marketplace

## Objetivo

Conectar Don Cheli con el ecosystem de Skills de Anthropic y la comunidad. Permite instalar, actualizar y compartir skills desde múltiples fuentes.

## Uso

```
/especdev:marketplace                              # Listar skills disponibles
/especdev:marketplace --instalar <nombre>          # Instalar skill específica
/especdev:marketplace --buscar "weekly report"     # Buscar skills
/especdev:marketplace --fuente anthropic            # Solo skills oficiales
/especdev:marketplace --fuente comunidad            # Solo skills de la comunidad
/especdev:marketplace --exportar <skill>           # Exportar skill para compartir
/especdev:marketplace --verificar                  # Verificar integridad de skills instaladas
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
/especdev:marketplace --instalar document-skills --fuente anthropic
```
1. Clonar el repo oficial (o fetch selectivo)
2. Copiar la skill a `.claude/skills/`
3. Verificar que el SKILL.md tenga metadata válida
4. Registrar en el inventario local

### Instalar desde Comunidad
```bash
/especdev:marketplace --instalar weekly-report-generator --fuente comunidad
```
1. Descargar la skill
2. **Escaneo de seguridad:** Verificar que no contenga scripts maliciosos
3. Mostrar el contenido del SKILL.md al usuario para revisión
4. Instalar solo si el usuario aprueba

### Exportar skill propia
```bash
/especdev:marketplace --exportar mi-skill
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
/especdev:marketplace --listar
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

## Seguridad

- Skills oficiales de Anthropic: **confianza total**
- Skills de Don Cheli: **confianza total**
- Skills de comunidad: **requieren revisión manual**
  - No ejecutar scripts sin inspección
  - Verificar que no acceda a archivos fuera del proyecto
  - Verificar que no envíe datos a servicios externos

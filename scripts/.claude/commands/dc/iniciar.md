---
description: Inicializar Don Cheli en un proyecto nuevo o existente
i18n: true
---

# /dc:iniciar

## Objetivo

Crear el directorio `.dc/` con todos los archivos de contexto necesarios para comenzar a trabajar con el framework.

## Uso

```
/dc:iniciar [opciones]
```

### Opciones

| Opción | Descripción | Ejemplo |
|--------|-------------|---------|
| `--tipo` | Tipo de proyecto | `--tipo cli` |
| `--nombre` | Nombre del proyecto | `--nombre "mi-app"` |
| `--gitignore` | Agregar .gitignore template | `--gitignore` |
| `--con-hooks` | Inicializar hooks locales | `--con-hooks` |
| `--reparar` | Reparar archivos faltantes | `--reparar` |

## Comportamiento

1. **Detectar idioma** — Leer `${FRAMEWORK_HOME}/locale` (set durante instalación). Si no existe, preguntar al usuario.
2. **Verificar** si `.dc/` ya existe
   - Si existe: preguntar si desea sobrescribir o reparar
   - Si no existe: continuar
3. **Crear** directorio `.dc/`
4. **Copiar** plantillas desde `plantillas/especdev/`
5. **Configurar** `config.yaml` con nombre, tipo de proyecto y `framework.idioma` (del locale detectado)
6. **Inicializar** `estado.md`, `plan.md`, `hallazgos.md`, `progreso.md` — todos en el idioma configurado
7. **Opcionalmente** crear hooks locales (`--con-hooks`)

**IMPORTANTE:** Todos los archivos generados (.md) deben usar la terminología del idioma configurado. Consultar `locales/{locale}.json` para las traducciones correctas de fases, estados, tipos de proyecto, etc.

## Archivos Creados

```
.dc/
├── config.yaml      # Configuración del proyecto
├── estado.md        # Estado actual → Fase 1
├── plan.md          # Plan vacío listo para definir
├── hallazgos.md     # Descubrimientos (vacío)
├── progreso.md      # Log de sesión (vacío)
└── sesion/          # Directorio para PRD y datos de sesión
```

## Tipos de Proyecto

| Tipo | Descripción |
|------|-------------|
| `producto` | Producto completo nuevo |
| `cli` | Aplicación de línea de comandos |
| `app` | Aplicación desktop/móvil |
| `libreria` | Paquete reutilizable |
| `servicio` | Microservicio/API |
| `refactor` | Refactoring existente |
| `correccion` | Corrección de bug |

## Ejemplo

```bash
/dc:iniciar --tipo servicio --nombre "api-pagos" --gitignore
```

Output:
```
✅ Don Cheli inicializado

Proyecto: api-pagos
Tipo: servicio
Directorio: .dc/
Archivos: 5 creados

Próximo paso: edita .dc/plan.md para definir tus fases
```

---
description: Inicializar Don Cheli en un proyecto nuevo o existente
---

# /especdev:iniciar

## Objetivo

Crear el directorio `.especdev/` con todos los archivos de contexto necesarios para comenzar a trabajar con el framework.

## Uso

```
/especdev:iniciar [opciones]
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

1. **Verificar** si `.especdev/` ya existe
   - Si existe: preguntar si desea sobrescribir o reparar
   - Si no existe: continuar
2. **Crear** directorio `.especdev/`
3. **Copiar** plantillas desde `plantillas/especdev/`
4. **Configurar** `config.yaml` con nombre y tipo de proyecto
5. **Inicializar** `estado.md`, `plan.md`, `hallazgos.md`, `progreso.md`
6. **Opcionalmente** crear hooks locales (`--con-hooks`)

## Archivos Creados

```
.especdev/
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
/especdev:iniciar --tipo servicio --nombre "api-pagos" --gitignore
```

Output:
```
✅ Don Cheli inicializado

Proyecto: api-pagos
Tipo: servicio
Directorio: .especdev/
Archivos: 5 creados

Próximo paso: edita .especdev/plan.md para definir tus fases
```

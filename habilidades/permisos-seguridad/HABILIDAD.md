---
nombre: Sistema de Permisos y Seguridad
descripcion: "Gestionar permisos de archivos, validar acceso y prevenir operaciones peligrosas en el proyecto"
version: 1.0.0
autor: Don Cheli
tags: [seguridad, permisos, acceso, proteccion]
activacion: "permisos", "seguridad", "acceso a archivos", "operación peligrosa"
---

# Habilidad: Sistema de Permisos y Seguridad

**Versión:** 1.0.0
**Categoría:** Seguridad
**Tipo:** Rígida

> Inspirado en el componente Permissions de Gentle-AI.

## Cómo Mejora el Framework

Los agentes de IA acceden a archivos, ejecutan comandos y modifican configuraciones. Sin permisos explícitos, pueden:
- Leer `.env` y exponer secrets
- Ejecutar `git push --force` sin confirmación
- Borrar archivos o directorios por error
- Instalar dependencias no deseadas

## Permisos por Defecto (Security-First)

### 🔒 DENEGADO (nunca sin confirmación explícita)

| Acción | Razón |
|--------|-------|
| Leer `.env`, `.env.*`, secrets | Proteger credenciales |
| `git push --force` | Prevenir pérdida de historial |
| `git reset --hard` | Prevenir pérdida de cambios |
| `rm -rf` en directorios | Prevenir borrado accidental |
| Instalar dependencias globales | Prevenir contaminación del sistema |
| Modificar archivos fuera del proyecto | Prevenir efectos laterales |

### ⚠️ CONFIRMACIÓN REQUERIDA

| Acción | Razón |
|--------|-------|
| `git push` a main/master/production | Ramas protegidas |
| Eliminar archivos >5 archivos | Borrado masivo |
| Cambiar configuración de CI/CD | Infraestructura crítica |
| Agregar dependencia nueva | Evaluar necesidad |

### ✅ PERMITIDO

| Acción | Razón |
|--------|-------|
| Leer/escribir archivos del proyecto | Trabajo normal |
| Ejecutar tests | Operación segura |
| `git add`, `git commit` | Operaciones locales |
| Crear archivos y directorios | Trabajo normal |
| Ejecutar linter | Operación segura |

## Configuración

```yaml
# .dc/config.yaml
permisos:
  archivos_bloqueados:
    - ".env"
    - ".env.*"
    - "*.pem"
    - "*.key"
  comandos_confirmacion:
    - "git push"
    - "rm -rf"
    - "npm publish"
  directorios_protegidos:
    - "/"
    - "/usr"
    - "/etc"
```

---
description: Verificar la salud del setup de Don Cheli en el proyecto actual
i18n: true
---

# /dc:diagnostico

## Objetivo

Verificar que el setup de Don Cheli en el proyecto está completo y funcional. Detecta archivos faltantes, configuración inconsistente y problemas comunes.

## Uso

```
/dc:diagnostico
```

## Comportamiento

Ejecutar verificaciones en 4 categorías:

### 1. Estructura .dc/

```
Verificando .dc/...
  ✅ config.yaml existe y es válido
  ✅ estado.md existe
  ✅ plan.md existe
  ⚠️ hallazgos.md no existe (se creará al explorar)
  ✅ progreso.md existe
  ✅ memoria/ directorio existe
```

### 2. Configuración

```
Verificando configuración...
  ✅ proyecto.nombre definido: "mi-proyecto"
  ✅ proyecto.tipo válido: "servicio"
  ✅ modelos.default definido: "sonnet"
  ⚠️ idioma no definido (usando default: "es")
```

### 3. Entorno

```
Verificando entorno...
  ✅ Git inicializado
  ✅ Branch actual: feature/auth
  ✅ Docker disponible (para /dc:implementar)
  ⚠️ Docker Compose no encontrado (opcional)
  ✅ Node/Python/Go detectado (según stack)
  ✅ Linter configurado
  ✅ Tests configurados
```

### 4. Pipeline

```
Verificando pipeline...
  ✅ specs/features/ directorio existe
  ✅ 3 features encontradas (2 @lista, 1 @borrador)
  ⚠️ specs/db_schema/ no existe (se creará al especificar)
  ✅ Constitución presente (reglas/constitucion.md)
```

## Output

```markdown
## Diagnóstico Don Cheli: mi-proyecto

| Categoría | Estado | Problemas |
|-----------|--------|-----------|
| Estructura | ✅ OK | 0 |
| Configuración | ⚠️ Warning | 1 warning |
| Entorno | ⚠️ Warning | 1 warning |
| Pipeline | ✅ OK | 0 |

### Warnings
1. `idioma` no definido en config.yaml → agregar `idioma: "es"`
2. Docker Compose no encontrado → instalar para usar `/dc:implementar`

### Resultado: ✅ SALUDABLE (2 warnings menores)
```

## Resultados Posibles

| Resultado | Significado |
|-----------|-------------|
| ✅ **SALUDABLE** | Todo funciona, warnings son opcionales |
| ⚠️ **FUNCIONAL** | Funciona pero con limitaciones |
| ❌ **REQUIERE ATENCIÓN** | Archivos críticos faltantes, ejecutar `/dc:iniciar` |

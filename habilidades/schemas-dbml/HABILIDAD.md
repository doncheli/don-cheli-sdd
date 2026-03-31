---
nombre: Schemas DBML (Verdad Viva)
descripcion: "Generar y mantener schemas de base de datos en formato DBML sincronizados con las specs Gherkin"
version: 1.0.0
autor: Don Cheli
tags: [dbml, schema, base-de-datos, especificacion]
activacion: "schema DBML", "modelo de datos", "base de datos", "tablas"
---

# Habilidad: Schemas DBML (Verdad Viva)

**Versión:** 1.0.0
**Categoría:** Especificación
**Tipo:** Rígida

> Adaptado de Specular (pei9564/Specular → constitution.md §I-B)

## Cómo Mejora el Framework

Sin DBML, el schema de base de datos se define de forma ad-hoc y se pierde sincronía con el código. Con DBML:

- El schema es la **verdad absoluta** para nombres y tipos de campos
- Los Gherkin scenarios usan los MISMOS nombres que el DBML
- El pipeline detecta inconsistencias automáticamente

## Qué es DBML

[DBML (Database Markup Language)](https://dbml.dbdiagram.io/) es un lenguaje simple para modelar schemas de BD.

```dbml
// specs/db_schema/usuario.dbml
Table usuario {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  nombre varchar(100) [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
}
```

## Ciclo de Vida

### 1. Provisional (`@provisional`)

```dbml
// @provisional — Auto-generado por /dc:especificar
Table orden @provisional {
  id uuid [pk]
  usuario_id uuid [ref: > usuario.id]
  total decimal [not null]
  estado varchar(20) [not null]
}
```

- Se genera automáticamente al crear una spec si no existe
- Es un **borrador** que necesita revisión
- Los scenarios Gherkin DEBEN usar estos nombres tal como están

### 2. Ratificado (sin tag)

```dbml
// Ratificado — Revisado en fase Clarify
Table orden {
  id uuid [pk, default: `gen_random_uuid()`]
  usuario_id uuid [ref: > usuario.id, not null]
  total decimal(10,2) [not null]
  estado varchar(20) [not null, default: 'pendiente']
  created_at timestamp [not null, default: `now()`]
}
```

- Revisado durante `/dc:clarificar` o `/dc:planificar-tecnico`
- Se convierte en **Verdad Absoluta**
- Extensión solo con `@provisional` en las NUEVAS partes
- Renombrar campos requiere nota de migración

## Estructura

```
specs/
└── db_schema/
    ├── _proyecto.dbml        # Metadata del proyecto
    ├── _relaciones.dbml      # Relaciones cross-dominio
    ├── usuario.dbml           # Schema de usuarios
    ├── orden.dbml             # Schema de órdenes
    └── ...
```

## Integración con el Pipeline

```
especificar → ¿Existe DBML? 
├── NO → Generar DBML @provisional → Incluir en .feature
└── SÍ → Usar DBML existente como referencia

clarificar → Verificar consistencia Schema↔Gherkin
             → Ratificar @provisional si está correcto

planificar-tecnico → Generar modelos Pydantic/TypeScript DESDE el DBML
```

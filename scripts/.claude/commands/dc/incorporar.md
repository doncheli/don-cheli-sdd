---
description: Incorporar nuevo desarrollador al proyecto con contexto completo
i18n: true
---

# /dc:incorporar

## Objetivo

Generar un briefing completo del proyecto para incorporar a un nuevo desarrollador (humano o agente IA) con el contexto necesario para ser productivo inmediatamente.

> Adaptado de `/opsx:onboard` de OpenSpec.

## Uso

```
/dc:incorporar
/dc:incorporar --rol <backend|frontend|fullstack|devops>
/dc:incorporar --profundidad <rapido|completo>
```

## Output (modo rápido)

```markdown
# Briefing del Proyecto: Mi-App

## Tech Stack
- Framework: Next.js 15 + TypeScript 5.7
- BD: PostgreSQL 16 + Prisma
- Auth: NextAuth.js v5
- Tests: Vitest + Playwright

## Arquitectura
app/
├── (auth)/          → Rutas de autenticación
├── (dashboard)/     → Panel principal
├── api/             → API routes
└── components/      → UI compartida

## Convenciones
- Código en inglés, commits en español
- Branches: feature/, fix/, hotfix/
- Tests obligatorios para lógica de negocio
- PR máximo 400 líneas

## Estado Actual
- Fase: Desarrollo (4 de 7)
- Cambios activos: 2
  - agregar-oauth (70% completado)
  - corregir-timeout (pendiente)

## Para Empezar
1. `npm install`
2. `cp .env.example .env.local`
3. `docker compose up -d` (PostgreSQL)
4. `npx prisma migrate dev`
5. `npm run dev`

## Specs Activas
Ver specs/ para documentación de comportamiento.
Ver .dc/cambios/ para cambios en progreso.
```

## Output (modo completo)

Agrega adicionalmente:
- Decisiones arquitectónicas (ADRs) desde memoria
- Errores conocidos y workarounds
- Guía de debugging
- Patrones de código con ejemplos
- Flujo completo de un feature típico

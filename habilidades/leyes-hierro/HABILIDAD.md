---
nombre: Leyes de Hierro
descripcion: "Aplicar las 3 leyes no negociables: TDD obligatorio, causa raíz primero, evidencia siempre"
version: 1.0.0
autor: Don Cheli
tags: [calidad, TDD, debugging, verificación, leyes]
activacion: "leyes de hierro", "TDD obligatorio", "reglas no negociables"
---

# Habilidad: Leyes de Hierro

**Versión:** 1.0.0
**Categoría:** Calidad
**Tipo:** Rígida (no negociable)

## Las 3 Leyes de Hierro

### 1. Ley TDD
Todo código de producción REQUIERE tests. Sin excepciones.

```
RED → GREEN → REFACTOR
1. Escribir test que falla (RED)
2. Escribir código mínimo que pasa (GREEN)
3. Mejorar sin cambiar comportamiento (REFACTOR)
```

### 2. Ley de Debugging
Primero la causa raíz, luego la corrección.

```
1. REPRODUCIR el error
2. AISLAR la causa
3. ENTENDER por qué ocurre
4. CORREGIR la causa raíz
5. VERIFICAR que no regresa
```

### 3. Ley de Verificación
Evidencia antes de afirmaciones. Mostrar, no contar.

```
✅ "Los tests pasan (screenshot adjunto)"
❌ "Creo que funciona"
```

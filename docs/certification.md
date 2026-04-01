# SDD Certification — Don Cheli

## Que es la Certificacion SDD

Un proyecto **SDD Certified** demuestra que su codigo fue construido siguiendo el pipeline completo de Desarrollo Dirigido por Especificaciones:

- Especificaciones Gherkin verificables
- TDD obligatorio (RED → GREEN → REFACTOR)
- Quality gates formales (6 puertas)
- Peer review automatico en 7 dimensiones
- Cobertura minima de 85%

## Badges disponibles

### SDD Certified

Para proyectos que pasaron por el pipeline completo de Don Cheli:

```markdown
[![SDD Certified](https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/assets/badge-sdd-certified.svg)](https://github.com/doncheli/don-cheli-sdd)
```

**Resultado:**

[![SDD Certified](https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/assets/badge-sdd-certified.svg)](https://github.com/doncheli/don-cheli-sdd)

---

### TDD Iron Law Enforced

Para proyectos que cumplen la Ley de Hierro de TDD:

```markdown
[![TDD Iron Law](https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/assets/badge-tdd-iron-law.svg)](https://github.com/doncheli/don-cheli-sdd)
```

**Resultado:**

[![TDD Iron Law](https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/assets/badge-tdd-iron-law.svg)](https://github.com/doncheli/don-cheli-sdd)

---

### OWASP Audited

Para proyectos que pasaron la auditoria de seguridad OWASP Top 10:

```markdown
[![OWASP Audited](https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/assets/badge-owasp-audited.svg)](https://github.com/doncheli/don-cheli-sdd)
```

**Resultado:**

[![OWASP Audited](https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/assets/badge-owasp-audited.svg)](https://github.com/doncheli/don-cheli-sdd)

---

### Shields.io (alternativa dinamica)

Si prefieres badges dinamicos via shields.io:

```markdown
![SDD Certified](https://img.shields.io/badge/SDD_Certified-Don_Cheli-6c5ce7?style=for-the-badge)
![TDD](https://img.shields.io/badge/TDD-Iron_Law_Enforced-00cec9?style=for-the-badge)
![OWASP](https://img.shields.io/badge/OWASP-Audited_by_Don_Cheli-e17055?style=for-the-badge)
```

**Resultado:**

![SDD Certified](https://img.shields.io/badge/SDD_Certified-Don_Cheli-6c5ce7?style=for-the-badge)
![TDD](https://img.shields.io/badge/TDD-Iron_Law_Enforced-00cec9?style=for-the-badge)
![OWASP](https://img.shields.io/badge/OWASP-Audited_by_Don_Cheli-e17055?style=for-the-badge)

---

## Criterios de certificacion

Para usar el badge **SDD Certified** en tu proyecto, este debe cumplir:

| Criterio | Requisito | Como verificar |
|----------|-----------|----------------|
| **Specs** | Especificaciones Gherkin con P1/P2/P3 | Directorio `.dc/specs/` con archivos `.feature` |
| **Blueprint** | Plan tecnico documentado | `.dc/blueprints/` con arquitectura |
| **TDD** | Tests escritos antes del codigo | Historial de commits muestra RED→GREEN |
| **Cobertura** | Minimo 85% en codigo nuevo | Badge de Codecov o reporte de coverage |
| **Review** | Peer review de 7 dimensiones | `.dc/reviews/` con reporte |
| **Quality Gates** | 6/6 puertas aprobadas | `.dc/estado.md` con todas las puertas ✅ |

### Para OWASP Audited

| Criterio | Requisito |
|----------|-----------|
| Ejecutar `/dc:auditar-seguridad` | Escaneo completo OWASP Top 10 |
| Zero hallazgos criticos | Ningun hallazgo de severidad CRITICA |
| Hallazgos documentados | `.dc/seguridad/` con reporte |

## Como agregar el badge a tu proyecto

1. Ejecuta el pipeline completo de Don Cheli en tu proyecto
2. Verifica que `.dc/estado.md` muestre 6/6 quality gates aprobadas
3. Copia el badge que corresponda al README de tu proyecto
4. Listo — tu proyecto esta certificado SDD

## Uso corporativo

Para empresas que quieran certificar sus repositorios internos:

```bash
# Instalar Don Cheli globalmente
npm install -g don-cheli-sdd

# Inicializar en cada proyecto
don-cheli install --global

# En el proyecto:
/dc:iniciar
/dc:comenzar "Tu feature aqui"
# ... seguir el pipeline completo ...
```

La certificacion es auto-verificable: cualquiera puede revisar el directorio `.dc/` para confirmar que el proceso se siguio.

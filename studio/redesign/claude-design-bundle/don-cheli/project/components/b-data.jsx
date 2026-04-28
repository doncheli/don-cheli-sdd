// B Studio — datos para distintos escenarios y el timeline refinado.
// Copy simplificado para público general.

const B_SCENARIOS = {
  activo: {
    id: 'activo',
    chips: [
      { tone: 'success', text: 'Un trabajo en marcha' },
      { tone: 'neutral', text: 'Todo tranquilo' },
      { tone: 'neutral', text: 'Has gastado $12.40 de $100' },
      { tone: 'neutral', text: '3 trabajos hoy' },
    ],
    header: {
      title: 'auth-jwt',
      badge: 'Trabajo n.º 12',
      sub: 'Ahora mismo está diseñando la pantalla de inicio de sesión. Cuando termine, te va a pedir que apruebes el diseño.',
      meta: 'Empezó hace 4 minutos · faltan ~10 más',
    },
    metrics: [
      { label: 'Proyecto',     value: 'auth-jwt',   sub: 'copia de trabajo: run-12' },
      { label: 'En qué va',    value: 'Diseñando',  sub: 'paso 4 de 7', dot: true },
      { label: 'Lleva',        value: '4:12',       sub: 'de unos 14 minutos', mono: true },
      { label: 'Ha costado',   value: '$0.82',      sub: 'tope del trabajo $3.00', mono: true },
    ],
    steps: [
      { id: 'especificar', label: 'Especificar', status: 'done',   dur: '30s',  cost: '$0.05', progress: 100 },
      { id: 'aclarar',     label: 'Aclarar',     status: 'done',   dur: '45s',  cost: '$0.08', progress: 100 },
      { id: 'planificar',  label: 'Planificar',  status: 'done',   dur: '1m',   cost: '$0.18', progress: 100 },
      { id: 'disenar',     label: 'Diseñar',     status: 'active', dur: '2:14', cost: '$0.51', progress: 45 },
      { id: 'desglosar',   label: 'Desglosar',   status: 'pending', dur: '—',   cost: '—',     progress: 0 },
      { id: 'construir',   label: 'Construir',   status: 'pending', dur: '—',   cost: '—',     progress: 0 },
      { id: 'revisar',     label: 'Revisar',     status: 'pending', dur: '—',   cost: '—',     progress: 0 },
    ],
    gates: [
      { id: 'tests',  label: 'Tests',            state: 'waiting', hint: 'Se corren durante "Construir"' },
      { id: 'design', label: 'Diseño aprobado',  state: 'active',  hint: 'Esperando que lo revises' },
      { id: 'final',  label: 'Aprobación final', state: 'waiting', hint: 'Se hace en "Revisar"' },
    ],
    log: [
      { t: '10:42:18', kind: 'info',  text: 'Generando el mockup del flujo (correo + contraseña)' },
      { t: '10:42:15', kind: 'info',  text: 'Leyendo las reglas de diseño de tu equipo' },
      { t: '10:42:11', kind: 'think', text: '«Tengo dos formas de organizar esto. Voy a probar la primera.»' },
      { t: '10:41:58', kind: 'info',  text: 'Activada: habilidad "Varias opciones visuales"' },
      { t: '10:41:46', kind: 'warn',  text: 'Falta decidir qué pasa si la cuenta no está verificada' },
      { t: '10:41:32', kind: 'info',  text: 'Abriendo la especificación que escribiste' },
      { t: '10:41:20', kind: 'done',  text: 'Listo: la planificación terminó · 4 entregables definidos' },
      { t: '10:41:18', kind: 'think', text: '«Antes de diseñar conviene fijar la tipografía del sistema.»' },
      { t: '10:40:55', kind: 'info',  text: 'Abrí una copia aparte del proyecto: no toco tu código original' },
    ],
  },

  exito: {
    id: 'exito',
    chips: [
      { tone: 'success', text: '✓ Trabajo terminado' },
      { tone: 'neutral', text: 'Todo tranquilo' },
      { tone: 'neutral', text: 'Has gastado $13.22 de $100' },
      { tone: 'neutral', text: '4 trabajos hoy' },
    ],
    header: {
      title: 'auth-jwt',
      badge: 'Trabajo n.º 12',
      sub: 'Todo salió bien. Los tres controles de calidad pasaron. Ya puedes llevarte los cambios a tu rama principal cuando quieras.',
      meta: '13 min · 7/7 pasos',
    },
    metrics: [
      { label: 'Proyecto',     value: 'auth-jwt',  sub: 'listo para integrar' },
      { label: 'Resultado',    value: 'Terminado', sub: 'los 3 gates pasaron', dot: true, dotColor: 'success' },
      { label: 'Duración',     value: '12:46',     sub: '7 de 7 pasos', mono: true },
      { label: 'Costo total',  value: '$0.82',     sub: 'bajo el tope de $3.00', mono: true },
    ],
    steps: [
      { id: 'especificar', label: 'Especificar', status: 'done', dur: '30s',  cost: '$0.05', progress: 100 },
      { id: 'aclarar',     label: 'Aclarar',     status: 'done', dur: '45s',  cost: '$0.08', progress: 100 },
      { id: 'planificar',  label: 'Planificar',  status: 'done', dur: '1m',   cost: '$0.18', progress: 100 },
      { id: 'disenar',     label: 'Diseñar',     status: 'done', dur: '4:02', cost: '$0.51', progress: 100 },
      { id: 'desglosar',   label: 'Desglosar',   status: 'done', dur: '1:18', cost: '$0.12', progress: 100 },
      { id: 'construir',   label: 'Construir',   status: 'done', dur: '4:20', cost: '$0.08', progress: 100 },
      { id: 'revisar',     label: 'Revisar',     status: 'done', dur: '51s',  cost: '$0.04', progress: 100 },
    ],
    gates: [
      { id: 'tests',  label: 'Tests',            state: 'passed', hint: '38 de 38 pasaron' },
      { id: 'design', label: 'Diseño aprobado',  state: 'passed', hint: 'Aprobado hace 6 min' },
      { id: 'final',  label: 'Aprobación final', state: 'passed', hint: 'Todo en orden' },
    ],
    log: [
      { t: '10:53:18', kind: 'done',  text: '✓ Trabajo terminado · 7 pasos, 3 gates, sin errores' },
      { t: '10:53:01', kind: 'info',  text: 'Generé el resumen del trabajo (1 página)' },
      { t: '10:52:44', kind: 'done',  text: '✓ Aprobación final: todo coincide con la especificación' },
      { t: '10:52:12', kind: 'info',  text: 'Corriendo los 38 tests de la rama' },
      { t: '10:49:40', kind: 'done',  text: '✓ Construcción terminada · 14 archivos tocados' },
      { t: '10:45:20', kind: 'info',  text: 'Empezando a construir según el desglose' },
      { t: '10:44:02', kind: 'done',  text: '✓ Diseño aprobado por ti' },
      { t: '10:41:20', kind: 'done',  text: 'Planificación lista · 4 entregables definidos' },
    ],
  },

  multi: {
    id: 'multi',
    chips: [
      { tone: 'success', text: '2 trabajos en marcha' },
      { tone: 'neutral', text: 'Todo tranquilo' },
      { tone: 'neutral', text: 'Has gastado $14.80 de $100' },
      { tone: 'neutral', text: '5 trabajos hoy' },
    ],
    // Meta usado por el modo multi para mostrar el selector de jobs
    jobs: [
      { id: 'auth', title: 'auth-jwt', step: 'Diseñando', elapsed: '4:12', active: true },
      { id: 'cart', title: 'cart-refactor', step: 'Construyendo', elapsed: '1:08', active: false },
    ],
    header: {
      title: 'auth-jwt',
      badge: 'Trabajo n.º 12',
      sub: 'Tienes dos trabajos corriendo a la vez en proyectos distintos. Cada uno usa su propia copia aislada de los archivos.',
      meta: 'En este panel estás viendo auth-jwt',
    },
    metrics: [
      { label: 'Proyecto activo',   value: 'auth-jwt',    sub: 'cambia abajo' },
      { label: 'En qué va',         value: 'Diseñando',   sub: 'paso 4 de 7', dot: true },
      { label: 'Lleva',             value: '4:12',        sub: 'cart-refactor: 1:08', mono: true },
      { label: 'Costo acumulado',   value: '$2.40',       sub: 'sumando los dos trabajos', mono: true },
    ],
    // reuse steps del activo
    steps: [
      { id: 'especificar', label: 'Especificar', status: 'done',   dur: '30s',  cost: '$0.05', progress: 100 },
      { id: 'aclarar',     label: 'Aclarar',     status: 'done',   dur: '45s',  cost: '$0.08', progress: 100 },
      { id: 'planificar',  label: 'Planificar',  status: 'done',   dur: '1m',   cost: '$0.18', progress: 100 },
      { id: 'disenar',     label: 'Diseñar',     status: 'active', dur: '2:14', cost: '$0.51', progress: 45 },
      { id: 'desglosar',   label: 'Desglosar',   status: 'pending', dur: '—',   cost: '—',     progress: 0 },
      { id: 'construir',   label: 'Construir',   status: 'pending', dur: '—',   cost: '—',     progress: 0 },
      { id: 'revisar',     label: 'Revisar',     status: 'pending', dur: '—',   cost: '—',     progress: 0 },
    ],
    gates: [
      { id: 'tests',  label: 'Tests',            state: 'waiting', hint: 'Se corren durante "Construir"' },
      { id: 'design', label: 'Diseño aprobado',  state: 'active',  hint: 'Esperando que lo revises' },
      { id: 'final',  label: 'Aprobación final', state: 'waiting', hint: 'Se hace en "Revisar"' },
    ],
    log: [
      { t: '10:42:18', kind: 'info',  text: '[auth-jwt] Generando el mockup del flujo de login' },
      { t: '10:42:12', kind: 'info',  text: '[cart-refactor] Escribiendo la función addToCart()' },
      { t: '10:42:05', kind: 'think', text: '[auth-jwt] «Tengo dos formas de organizar esto.»' },
      { t: '10:41:58', kind: 'info',  text: '[cart-refactor] Leyendo los tests existentes' },
      { t: '10:41:46', kind: 'warn',  text: '[auth-jwt] Falta decidir qué pasa con cuentas sin verificar' },
      { t: '10:41:32', kind: 'info',  text: '[cart-refactor] Archivo abierto: src/cart/index.ts' },
      { t: '10:41:20', kind: 'done',  text: '[auth-jwt] ✓ Planificación terminada' },
      { t: '10:40:10', kind: 'info',  text: '[cart-refactor] Iniciado hace 1 minuto' },
    ],
  },
};

Object.assign(window, { B_SCENARIOS });

// B Studio — Datos para las pantallas adicionales

const B_PROJECTS = [
  { id: 'auth-jwt',      step: 'Diseñando',   status: 'active', cost: 2.10, lastUsed: 'hace 4 minutos', lastRaw: Date.now() - 4*60*1000,    editor: 'Claude Code', runs: 12, success: 10 },
  { id: 'onboarding-v2', step: 'Terminado',   status: 'done',   cost: 8.90, lastUsed: 'hace 2 horas',   lastRaw: Date.now() - 2*60*60*1000, editor: 'Claude Code', runs: 8,  success: 8  },
  { id: 'cart-refactor', step: 'Construyendo',status: 'active', cost: 4.50, lastUsed: 'ayer',           lastRaw: Date.now() - 26*60*60*1000,editor: 'Cursor',     runs: 6,  success: 5  },
  { id: 'payments',      step: 'Especificando',status: 'pending',cost: 0.12, lastUsed: 'hace 3 días',   lastRaw: Date.now() - 3*24*60*60*1000, editor: 'Claude Code', runs: 2, success: 1 },
  { id: 'design-system', step: 'Diseñando',   status: 'paused', cost: 6.20, lastUsed: 'hace 1 semana', lastRaw: Date.now() - 7*24*60*60*1000, editor: 'Gemini',     runs: 4,  success: 3 },
  { id: 'landing-page',  step: 'Terminado',   status: 'done',   cost: 3.40, lastUsed: 'hace 2 semanas',lastRaw: Date.now() - 14*24*60*60*1000,editor: 'OpenCode',   runs: 5,  success: 5 },
  { id: 'api-gateway',   step: 'Planificando',status: 'pending',cost: 0.40, lastUsed: 'hace 3 semanas',lastRaw: Date.now() - 21*24*60*60*1000,editor: 'Codex',      runs: 1,  success: 0 },
  { id: 'blog-migration',step: 'Revisando',   status: 'active', cost: 1.80, lastUsed: 'hace 1 mes',   lastRaw: Date.now() - 30*24*60*60*1000, editor: 'Claude Code', runs: 3,  success: 3 },
];

const B_HISTORY_RUNS = [
  { id: 12, project: 'auth-jwt',      stepsDone: 4, totalSteps: 7, duration: '4:12', cost: 0.82, result: 'running',    when: 'hace 4 min', start: 95 },
  { id: 11, project: 'cart-refactor', stepsDone: 3, totalSteps: 7, duration: '1:08', cost: 0.21, result: 'running',    when: 'hace 1 h',   start: 85 },
  { id: 10, project: 'onboarding-v2', stepsDone: 7, totalSteps: 7, duration: '12:46', cost: 0.82, result: 'success',   when: 'hace 2 h',   start: 70 },
  { id: 9,  project: 'onboarding-v2', stepsDone: 7, totalSteps: 7, duration: '11:20', cost: 0.78, result: 'success',   when: 'hace 3 h',   start: 60 },
  { id: 8,  project: 'payments',      stepsDone: 2, totalSteps: 7, duration: '2:14', cost: 0.12, result: 'stopped',   when: 'ayer',      start: 45 },
  { id: 7,  project: 'cart-refactor', stepsDone: 6, totalSteps: 7, duration: '18:50', cost: 4.29, result: 'error',     when: 'ayer',      start: 35 },
  { id: 6,  project: 'design-system', stepsDone: 4, totalSteps: 7, duration: '6:00', cost: 1.50, result: 'paused',    when: 'hace 2 días', start: 25 },
  { id: 5,  project: 'auth-jwt',      stepsDone: 7, totalSteps: 7, duration: '14:30', cost: 1.10, result: 'success',   when: 'hace 3 días', start: 15 },
  { id: 4,  project: 'landing-page',  stepsDone: 7, totalSteps: 7, duration: '9:15', cost: 0.68, result: 'success',   when: 'hace 5 días', start: 8 },
];

const B_EXPENSES = {
  thisMonth: 12.40,
  budget: 100,
  estimatedEnd: 41,
  lastMonth: 38.20,
  daily: [
    { d: 1, v: 0.40 }, { d: 2, v: 0 }, { d: 3, v: 2.10 }, { d: 4, v: 0.80 },
    { d: 5, v: 0 }, { d: 6, v: 0 }, { d: 7, v: 1.20 }, { d: 8, v: 0.60 },
    { d: 9, v: 3.20 }, { d: 10, v: 0.40 }, { d: 11, v: 0 }, { d: 12, v: 0 },
    { d: 13, v: 1.80 }, { d: 14, v: 0.90 }, { d: 15, v: 0 }, { d: 16, v: 0 },
    { d: 17, v: 0 }, { d: 18, v: 0 }, { d: 19, v: 0 }, { d: 20, v: 0 },
    { d: 21, v: 0.40 }, { d: 22, v: 0.60 }, { d: 23, v: 0 }, { d: 24, v: 0 },
    { d: 25, v: 0 }, { d: 26, v: 0 }, { d: 27, v: 0 }, { d: 28, v: 0 },
    { d: 29, v: 0 }, { d: 30, v: 0 },
  ],
  byProject: [
    { id: 'onboarding-v2', cost: 8.90, pct: 72 },
    { id: 'cart-refactor', cost: 2.30, pct: 19 },
    { id: 'auth-jwt',      cost: 0.82, pct: 7 },
    { id: 'payments',      cost: 0.38, pct: 3 },
  ],
  byModel: [
    { id: 'Claude Sonnet 4.5', cost: 9.20, pct: 74, tone: '#0f1114' },
    { id: 'Claude Haiku 4.5',  cost: 2.80, pct: 23, tone: '#65666b' },
    { id: 'Claude Opus 4.1',   cost: 0.40, pct: 3,  tone: '#9a9a9e' },
  ],
  byStep: [
    { id: 'Diseñar',     cost: 5.40 },
    { id: 'Construir',   cost: 3.10 },
    { id: 'Planificar',  cost: 1.80 },
    { id: 'Revisar',     cost: 1.20 },
    { id: 'Especificar', cost: 0.50 },
    { id: 'Aclarar',     cost: 0.30 },
    { id: 'Desglosar',   cost: 0.10 },
  ],
};

const B_ARSENAL_SKILLS = [
  { id: 'consulta-diseno',    name: 'Consulta de diseño',        cat: 'Diseño',         uses: 12 },
  { id: 'variantes',          name: 'Múltiples variantes visuales', cat: 'Diseño',      uses: 4 },
  { id: 'slop',               name: 'Detector de "relleno IA"',  cat: 'Calidad',        uses: 0 },
  { id: 'contexto',           name: 'Optimizar contexto',        cat: 'Contexto',       uses: 34 },
  { id: 'recuperacion',       name: 'Recuperación tras caída',   cat: 'Seguridad',      uses: 2 },
  { id: 'rebobinar',          name: 'Rebobinar en el tiempo',    cat: 'Investigación',  uses: 1 },
  { id: 'mesa-redonda',       name: 'Mesa redonda',              cat: 'Consulta',       uses: 6 },
  { id: 'mesa-tecnica',       name: 'Mesa técnica',              cat: 'Consulta',       uses: 3 },
  { id: 'auditar-seguridad',  name: 'Auditar seguridad',         cat: 'Seguridad',      uses: 2 },
  { id: 'doctor',             name: 'Diagnóstico del proyecto',  cat: 'Mantenimiento',  uses: 8 },
  { id: 'docs-viva',          name: 'Documentación viva',        cat: 'Mantenimiento',  uses: 3 },
  { id: 'clarificar',         name: 'Volver a clarificar',       cat: 'Contexto',       uses: 5 },
];

const B_ARSENAL_AGENTS = [
  { id: 'estimador', name: 'Estimador', desc: 'Calcula costo y tiempo antes de empezar', uses: 8 },
];

const B_ARSENAL_COMMANDS = [
  { id: '/dc:especificar',   desc: 'Definir qué se va a construir',       cat: 'Flujo',       when: 'hace 4 min' },
  { id: '/dc:clarificar',    desc: 'Preguntas aclaratorias',              cat: 'Flujo',       when: 'hace 4 min' },
  { id: '/dc:planificar',    desc: 'Crear el plan de trabajo',            cat: 'Flujo',       when: 'hace 12 min' },
  { id: '/dc:disenar',       desc: 'Generar diseños visuales',            cat: 'Flujo',       when: 'ahora' },
  { id: '/dc:desglosar',     desc: 'Dividir en tareas chicas',            cat: 'Flujo',       when: '—' },
  { id: '/dc:construir',     desc: 'Implementar según el plan',           cat: 'Flujo',       when: 'ayer' },
  { id: '/dc:revisar',       desc: 'Revisión final del trabajo',          cat: 'Flujo',       when: 'ayer' },
  { id: '/dc:mesa-redonda',  desc: 'Panel de expertos multi-perspectiva', cat: 'Consulta',    when: 'hace 2 días' },
  { id: '/dc:mesa-tecnica',  desc: 'Panel de ingenieros senior',          cat: 'Consulta',    when: 'hace 3 días' },
  { id: '/dc:auditar-seguridad', desc: 'Buscar vulnerabilidades',         cat: 'Auditoría',   when: 'hace 1 semana' },
  { id: '/dc:slop-scan',     desc: 'Detectar código de baja calidad',     cat: 'Auditoría',   when: '—' },
  { id: '/dc:doctor',        desc: 'Chequeo general del proyecto',        cat: 'Mantenimiento', when: 'hace 2 días' },
  { id: '/dc:documentacion-viva', desc: 'Regenerar la documentación',     cat: 'Mantenimiento', when: '—' },
];

Object.assign(window, {
  B_PROJECTS, B_HISTORY_RUNS, B_EXPENSES, B_ARSENAL_SKILLS, B_ARSENAL_AGENTS, B_ARSENAL_COMMANDS,
});

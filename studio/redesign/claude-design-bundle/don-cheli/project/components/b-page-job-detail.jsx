// B Studio — Pantalla "Un trabajo" (run detalle).
// Vive como ruta separada de "Ahora": muestra el pipeline live de UN trabajo
// con gate activo + git worktree + panel lateral de pestañas (Calidad / Costos / Archivos / Entorno / Diagnóstico).

const B_JOB_PHASES = [
  { id: 'specify',   label: 'Especificar', status: 'done',    duration: '0:30', cost: 0.05 },
  { id: 'clarify',   label: 'Aclarar',     status: 'done',    duration: '0:45', cost: 0.08 },
  { id: 'plan',      label: 'Planificar',  status: 'done',    duration: '1:00', cost: 0.18 },
  { id: 'design',    label: 'Diseñar',     status: 'active',  duration: '2:00', cost: 0.51, progress: 60 },
  { id: 'breakdown', label: 'Desglosar',   status: 'pending', duration: null,   cost: null },
  { id: 'build',     label: 'Construir',   status: 'pending', duration: null,   cost: null },
  { id: 'review',    label: 'Revisar',     status: 'pending', duration: null,   cost: null },
];

const B_JOB_GATES = [
  { id: 'tdd',      label: 'Tests',           state: 'pending', when: 'Antes de Construir',     hint: 'Verifica que las pruebas pasen.' },
  { id: 'design',   label: 'Diseño aprobado', state: 'active',  when: 'Antes de Desglosar',     hint: 'Esperando que apruebes design/auth-login.figma.md' },
  { id: 'approval', label: 'Aprobación final',state: 'pending', when: 'Antes de cerrar',         hint: 'Confirmas que todo quedó como esperabas.' },
];

const B_JOB_WORKTREE = {
  original: '/Users/santiago/work/auth-jwt',
  worktree: '/Users/santiago/work/auth-jwt-run-12',
  branch:   'feature/auth-jwt-run-12',
  baseBranch: 'main',
  changedFiles: 6,
  added: 142,
  removed: 18,
};

const B_JOB_LOG = [
  { t: '10:42:18', kind: 'info',  text: 'Generando el mockup del flujo (correo + contraseña)' },
  { t: '10:42:15', kind: 'info',  text: 'Leyendo las reglas de diseño de tu equipo' },
  { t: '10:42:11', kind: 'think', text: '«Tengo dos formas de organizar esto. Voy a probar la primera.»' },
  { t: '10:41:58', kind: 'info',  text: 'Activada: habilidad "Varias opciones visuales"' },
  { t: '10:41:42', kind: 'warn',  text: 'Falta el library de iconos del equipo. Voy a usar Lucide como sustituto temporal.' },
  { t: '10:41:30', kind: 'done',  text: 'Plan aprobado. 4 archivos creados en design/' },
  { t: '10:40:12', kind: 'info',  text: 'Empezando paso "Diseñar"' },
  { t: '10:39:50', kind: 'done',  text: 'Plan listo: 7 secciones, 12 componentes nuevos' },
  { t: '10:38:20', kind: 'info',  text: 'Construyendo el plan a partir de la especificación' },
];

const B_JOB_FILES = [
  { name: 'spec.md',                   path: 'spec.md',                kind: 'spec',     touched: 'hace 14 min' },
  { name: 'clarify.md',                path: 'clarify.md',             kind: 'clarify',  touched: 'hace 13 min' },
  { name: 'plan.md',                   path: 'plan.md',                kind: 'plan',     touched: 'hace 11 min' },
  { name: 'design/auth-login.figma.md',path: 'design/auth-login.figma.md', kind: 'design', touched: 'hace 30 s' },
  { name: 'design/tokens.md',          path: 'design/tokens.md',       kind: 'design',   touched: 'hace 1 min' },
  { name: 'design/copy.md',            path: 'design/copy.md',         kind: 'design',   touched: 'hace 1 min' },
];

const BS_JobDetail = ({ dens, showSidebar, onNav, projectId, scenario }) => {
  const T = bStudioTokens(dens);
  const [tab, setTab] = React.useState('calidad');
  const [selectedPhase, setSelectedPhase] = React.useState('design');

  const job = { id: 12, project: projectId || 'auth-jwt', editor: 'Claude Code',
                started: 'hace 4 minutos', etaRemaining: '~10 min', status: 'running' };

  const totalCost  = B_JOB_PHASES.reduce((a, p) => a + (p.cost || 0), 0);
  const totalTime  = '4:15';
  const stepsDone  = B_JOB_PHASES.filter(p => p.status === 'done').length;

  const tabs = [
    { id: 'calidad',     label: 'Calidad',          count: B_JOB_GATES.filter(g => g.state === 'active').length || null },
    { id: 'costos',      label: 'Costos' },
    { id: 'archivos',    label: 'Archivos',         count: B_JOB_FILES.length },
    { id: 'entorno',     label: 'Entorno' },
    { id: 'diagnostico', label: 'Por qué falló',    disabled: true },
  ];

  const phaseStateColor = (s) => s === 'done' ? T.text : (s === 'active' ? T.success : T.textFaint);
  const phaseBg = (s) => s === 'done' ? T.bgAlt : (s === 'active' ? T.successBg : 'transparent');

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title={`Trabajo n.º ${job.id}`}
        sub={
          <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <BS_Pill tone="active" dot>En vivo</BS_Pill>
            <span>Empezó {job.started} · faltan {job.etaRemaining}</span>
            <span style={{ color: T.textFaint }}>·</span>
            <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12 }}>{totalCost.toFixed(2)} USD</span>
            <span style={{ color: T.textFaint }}>·</span>
            <span>◆ {job.editor}</span>
          </span>
        }
        breadcrumb={[
          { label: 'Proyectos', to: 'proyectos' },
          { label: job.project, to: 'proyecto' },
          { label: `Trabajo n.º ${job.id}` },
        ]}
        onNav={onNav}
        actions={
          <>
            <BS_Button>Pausar</BS_Button>
            <BS_Button>Detener</BS_Button>
          </>
        }
      />

      <BS_PageBody padding="20px 32px 32px">
        {/* Pipeline de 7 pasos: hero del trabajo */}
        <div style={{
          background: T.panel, borderRadius: 14, boxShadow: T.shadow,
          padding: '20px 22px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: T.text }}>Los 7 pasos del trabajo</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>
                {stepsDone} de 7 hechos · haz clic en un paso para rebobinar a ese momento
              </div>
            </div>
            <div style={{ fontSize: 12, color: T.textDim, fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
              {totalTime} · ${totalCost.toFixed(2)}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
            {B_JOB_PHASES.map((p, i) => {
              const sel = selectedPhase === p.id;
              const done = p.status === 'done';
              const active = p.status === 'active';
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPhase(p.id)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px 11px',
                    borderRadius: 10,
                    background: sel ? phaseBg(p.status) : 'transparent',
                    border: sel ? `1px solid ${active ? T.success : T.border}` : `1px solid transparent`,
                    transition: 'background .12s ease, border-color .12s ease',
                    animation: `bsFadeIn 0.32s ${0.05 + i * 0.04}s cubic-bezier(.22,1,.36,1) both`,
                  }}
                >
                  <div style={{
                    height: 4, borderRadius: 999,
                    background: done ? T.text : (active ? 'transparent' : T.bgAlt),
                    position: 'relative', marginBottom: 12, overflow: 'hidden',
                  }}>
                    {active && (
                      <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: `${p.progress}%`, background: T.success, borderRadius: 999,
                      }} />
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: done ? T.text : (active ? T.successBg : T.bgAlt),
                      color: done ? '#fff' : (active ? T.success : T.textFaint),
                      border: active ? `1.5px solid ${T.success}` : 'none',
                      fontSize: 10, fontWeight: 600,
                      display: 'grid', placeItems: 'center',
                      animation: active ? 'bsPulse 1.8s ease-in-out infinite' : 'none',
                    }}>{done ? '✓' : i + 1}</span>
                    <span style={{
                      fontSize: 12.5, color: phaseStateColor(p.status),
                      fontWeight: active ? 600 : (done ? 500 : 400),
                    }}>{p.label}</span>
                  </div>
                  <div style={{
                    fontSize: 10.5, color: T.textFaint,
                    fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
                    paddingLeft: 25,
                  }}>
                    {p.duration ? `${p.duration} · $${p.cost.toFixed(2)}` : '—'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split: log + side panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, alignItems: 'start' }}>

          {/* Log filtrado por fase */}
          <div style={{
            background: T.panel, borderRadius: 14, boxShadow: T.shadow,
            display: 'flex', flexDirection: 'column',
            animation: `bsFadeIn 0.3s 0.18s cubic-bezier(.22,1,.36,1) both`,
          }}>
            <div style={{
              padding: '14px 18px', borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>
                  Qué está haciendo ahora
                </div>
                <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 2 }}>
                  Filtrado por: <strong style={{ color: T.text }}>{B_JOB_PHASES.find(p => p.id === selectedPhase)?.label}</strong>
                  <span style={{ color: T.textFaint }}> · </span>
                  <span onClick={() => setSelectedPhase(null)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    quitar filtro
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 3, fontSize: 11, background: T.bgAlt, padding: 3, borderRadius: 7 }}>
                {['Todo', 'Pensando', 'Avisos', 'Errores'].map((f, i) => (
                  <span key={f} style={{
                    padding: '4px 10px', borderRadius: 5,
                    background: i === 0 ? T.panel : 'transparent',
                    color: i === 0 ? T.text : T.textDim,
                    boxShadow: i === 0 ? T.shadow : 'none',
                    fontWeight: i === 0 ? 500 : 400, cursor: 'pointer',
                  }}>{f}</span>
                ))}
              </div>
            </div>
            <div style={{ padding: '6px 18px 16px', fontSize: 12.5, lineHeight: 1.7 }}>
              {B_JOB_LOG.map((e, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '70px 18px 1fr', gap: 10,
                  padding: '5px 0',
                  borderBottom: i < B_JOB_LOG.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                  animation: `bsFadeIn 0.25s ${0.20 + i * 0.025}s cubic-bezier(.22,1,.36,1) both`,
                }}>
                  <span style={{
                    color: T.textFaint, fontFamily: '"Geist Mono", monospace',
                    fontSize: 11, fontVariantNumeric: 'tabular-nums', paddingTop: 2,
                  }}>{e.t}</span>
                  <span style={{
                    width: 14, height: 14, borderRadius: 4, marginTop: 3,
                    background: { info: T.bgAlt, think: 'oklch(95% 0.04 290)',
                                  warn: T.warnBg, done: T.successBg, error: 'oklch(93% 0.06 25)' }[e.kind],
                    color: { info: T.textDim, think: 'oklch(50% 0.15 290)',
                             warn: T.warn, done: T.success, error: 'oklch(55% 0.18 25)' }[e.kind],
                    fontSize: 9.5, fontWeight: 600, display: 'grid', placeItems: 'center',
                  }}>{{ info:'i', think:'~', warn:'!', done:'✓', error:'×' }[e.kind]}</span>
                  <span style={{
                    color: e.kind === 'think' ? T.textDim : T.text,
                    fontStyle: e.kind === 'think' ? 'italic' : 'normal',
                  }}>{e.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side panel con pestañas */}
          <div style={{
            background: T.panel, borderRadius: 14, boxShadow: T.shadow,
            display: 'flex', flexDirection: 'column',
            animation: `bsFadeIn 0.3s 0.22s cubic-bezier(.22,1,.36,1) both`,
          }}>
            <div style={{
              padding: '0 14px', borderBottom: `1px solid ${T.border}`,
              display: 'flex', gap: 2,
            }}>
              {tabs.map(t => (
                <button key={t.id}
                  onClick={() => !t.disabled && setTab(t.id)}
                  disabled={t.disabled}
                  style={{
                    border: 'none', background: 'transparent',
                    padding: '11px 11px 9px', fontFamily: 'inherit',
                    fontSize: 12, fontWeight: tab === t.id ? 500 : 400,
                    color: t.disabled ? T.textFaint : (tab === t.id ? T.text : T.textDim),
                    borderBottom: `2px solid ${tab === t.id ? T.text : 'transparent'}`,
                    marginBottom: -1, cursor: t.disabled ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6,
                    transition: 'color .12s ease',
                  }}>
                  {t.label}
                  {t.count != null && (
                    <span style={{
                      padding: '1px 6px', borderRadius: 999,
                      background: T.bgAlt, fontSize: 10, color: T.textFaint,
                      fontVariantNumeric: 'tabular-nums',
                    }}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ padding: '14px 16px 18px' }}>
              {tab === 'calidad' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, color: T.textDim, marginBottom: 2, lineHeight: 1.5 }}>
                    Antes de pasar al siguiente paso, Don Cheli verifica que todo esté en orden.
                  </div>
                  {B_JOB_GATES.map((g, i) => {
                    const active = g.state === 'active';
                    const passed = g.state === 'passed';
                    return (
                      <div key={g.id} style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: active ? T.successBg : T.bgAlt,
                        border: active ? `1px solid ${T.success}` : `1px solid transparent`,
                        animation: `bsFadeIn 0.3s ${0.25 + i * 0.05}s cubic-bezier(.22,1,.36,1) both`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <span style={{
                            width: 18, height: 18, borderRadius: '50%',
                            background: active || passed ? T.success : T.panel,
                            border: active || passed ? 'none' : `1px solid ${T.border}`,
                            color: active || passed ? '#fff' : T.textFaint,
                            display: 'grid', placeItems: 'center',
                            fontSize: 10, fontWeight: 600,
                            animation: active ? 'bsPulse 1.8s ease-in-out infinite' : 'none',
                          }}>{passed ? '✓' : (active ? '●' : i + 1)}</span>
                          <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{g.label}</span>
                          <span style={{ flex: 1 }} />
                          <span style={{
                            fontSize: 10, fontWeight: 500, letterSpacing: 0.3,
                            color: active ? T.success : T.textFaint, textTransform: 'uppercase',
                          }}>{passed ? 'Pasó' : (active ? 'Revisando' : g.when)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: T.textDim, marginTop: 6, paddingLeft: 27 }}>
                          {g.hint}
                        </div>
                        {active && (
                          <div style={{
                            marginTop: 10, marginLeft: 27, padding: '9px 11px',
                            background: T.panel, borderRadius: 8, boxShadow: T.shadow,
                            display: 'flex', alignItems: 'center', gap: 10, fontSize: 12,
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.success }} />
                            <span style={{ color: T.textDim, fontFamily: '"Geist Mono", monospace', flex: 1 }}>
                              design/auth-login.figma.md
                            </span>
                            <span style={{
                              padding: '4px 11px', borderRadius: 6, background: T.text,
                              color: '#fff', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
                            }}>Aprobar</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === 'costos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
                  }}>
                    <div style={{ padding: '10px 12px', background: T.bgAlt, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 500, marginBottom: 4 }}>VA GASTADO</div>
                      <div style={{ fontSize: 22, fontWeight: 500, fontFamily: '"Geist Mono", monospace', letterSpacing: -0.5 }}>${totalCost.toFixed(2)}</div>
                    </div>
                    <div style={{ padding: '10px 12px', background: T.bgAlt, borderRadius: 8 }}>
                      <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 500, marginBottom: 4 }}>PRESUPUESTO</div>
                      <div style={{ fontSize: 22, fontWeight: 500, fontFamily: '"Geist Mono", monospace', letterSpacing: -0.5, color: T.text }}>$2.50</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>
                    Por paso (Geist Mono, alineado por punto decimal)
                  </div>
                  {B_JOB_PHASES.filter(p => p.cost != null).map((p, i) => (
                    <div key={p.id} style={{
                      display: 'grid', gridTemplateColumns: '20px 1fr 60px 70px',
                      alignItems: 'center', gap: 10, fontSize: 12, padding: '5px 0',
                    }}>
                      <span style={{ color: T.textFaint, fontFamily: '"Geist Mono", monospace', fontSize: 11 }}>{i + 1}</span>
                      <span style={{ color: T.text }}>{p.label}</span>
                      <span style={{ textAlign: 'right', color: T.textDim, fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums', fontSize: 11.5 }}>{p.duration}</span>
                      <span style={{ textAlign: 'right', color: T.text, fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>${p.cost.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'archivos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, color: T.textDim, marginBottom: 2 }}>
                    Documentos que Don Cheli ha generado en este trabajo.
                  </div>
                  {B_JOB_FILES.map((f, i) => (
                    <div key={f.path} style={{
                      padding: '8px 10px', borderRadius: 8, background: T.bgAlt,
                      display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                      animation: `bsFadeIn 0.25s ${0.25 + i * 0.025}s cubic-bezier(.22,1,.36,1) both`,
                    }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 5, background: T.panel,
                        display: 'grid', placeItems: 'center', fontSize: 10,
                        color: T.textDim, fontFamily: '"Geist Mono", monospace', fontWeight: 600,
                      }}>{f.kind === 'spec' ? 'S' : f.kind === 'plan' ? 'P' : f.kind === 'clarify' ? 'A' : 'D'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, color: T.text, fontFamily: '"Geist Mono", monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.path}
                        </div>
                        <div style={{ fontSize: 10.5, color: T.textFaint, marginTop: 1 }}>{f.touched}</div>
                      </div>
                      <span style={{ color: T.textFaint, fontSize: 14 }}>›</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'entorno' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.55 }}>
                    Cada trabajo se hace sobre una <strong style={{ color: T.text }}>copia aislada</strong> de tu carpeta (un git worktree).
                    Tu carpeta original no se modifica hasta que todos los controles de calidad pasen.
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Carpeta original', value: B_JOB_WORKTREE.original, mono: true },
                      { label: 'Copia de trabajo', value: B_JOB_WORKTREE.worktree, mono: true, accent: true },
                      { label: 'Rama nueva',       value: B_JOB_WORKTREE.branch,   mono: true },
                      { label: 'Rama base',         value: B_JOB_WORKTREE.baseBranch, mono: true },
                    ].map(r => (
                      <div key={r.label} style={{
                        padding: '9px 11px', borderRadius: 8,
                        background: r.accent ? T.successBg : T.bgAlt,
                        border: r.accent ? `1px solid ${T.success}` : 'none',
                      }}>
                        <div style={{ fontSize: 10.5, color: T.textFaint, fontWeight: 500, marginBottom: 3 }}>
                          {r.label}
                        </div>
                        <div style={{
                          fontSize: 11.5, color: T.text,
                          fontFamily: r.mono ? '"Geist Mono", monospace' : 'inherit',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{r.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    padding: '11px 13px', borderRadius: 8, background: T.bgAlt,
                    display: 'flex', alignItems: 'center', gap: 12, fontSize: 12,
                  }}>
                    <span style={{ color: T.textDim }}>Cambios:</span>
                    <span style={{ color: T.text, fontFamily: '"Geist Mono", monospace' }}>
                      {B_JOB_WORKTREE.changedFiles} archivos
                    </span>
                    <span style={{ color: T.success, fontFamily: '"Geist Mono", monospace' }}>+{B_JOB_WORKTREE.added}</span>
                    <span style={{ color: 'oklch(55% 0.18 25)', fontFamily: '"Geist Mono", monospace' }}>−{B_JOB_WORKTREE.removed}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <BS_Button>Ver diferencias</BS_Button>
                    <BS_Button>Abrir copia</BS_Button>
                  </div>
                </div>
              )}

              {tab === 'diagnostico' && (
                <div style={{ padding: '24px 8px', textAlign: 'center', color: T.textFaint, fontSize: 12.5 }}>
                  Solo aparece si un paso o un control de calidad falla.
                </div>
              )}
            </div>
          </div>
        </div>
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_JobDetail });

// B Studio — Tokens, sidebar, topbar, header, metrics, log, gates.
// Todo adaptado a densidad (dens: 'comfy' | 'compact') y copy accesible.

const bStudioTokens = (dens) => {
  const compact = dens === 'compact';
  return {
    bg:        '#fafaf7',
    bgAlt:     '#f4f4f0',
    panel:     '#ffffff',
    border:    '#eeeee8',
    borderSoft:'#f4f4ee',
    text:      '#0f1114',
    textDim:   '#65666b',
    textFaint: '#9a9a9e',
    ink:       '#0f1114',
    success:   'oklch(58% 0.14 155)',
    successBg: 'oklch(96% 0.05 155)',
    warn:      'oklch(55% 0.15 75)',
    warnBg:    'oklch(96% 0.06 75)',
    shadow:    '0 1px 2px rgba(17,18,22,0.04), 0 6px 20px -12px rgba(17,18,22,0.10)',
    shadowLg:  '0 10px 30px -10px rgba(17,18,22,0.30)',
    pad:       compact ? 18 : 24,
    gap:       compact ? 10 : 14,
    rowPad:    compact ? '6px 11px' : '8px 12px',
    cardPad:   compact ? 14 : 18,
    metricVal: compact ? 22 : 26,
    headTitle: compact ? 22 : 26,
  };
};

// ─────────── Sidebar ───────────
const BS_Sidebar = ({ dens, scenario, route = 'ahora', onNav }) => {
  const T = bStudioTokens(dens);
  const gastoMes = scenario === 'vacio' ? 0 : (scenario === 'multi' ? 14.80 : (scenario === 'exito' ? 13.22 : 12.40));
  const nav = (to) => { if (onNav) onNav(to); };

  const workItems = [
    { id: 'ahora',     label: 'Ahora',     icon: 'pulse',       badge: scenario === 'vacio' ? null : (scenario === 'multi' ? '2' : '1') },
    { id: 'proyectos', label: 'Proyectos', icon: 'folder' },
    { id: 'historial', label: 'Historial', icon: 'history' },
    { id: 'gastos',    label: 'Gastos',    icon: 'dollarSign' },
  ];
  const consultItems = [
    { id: 'arsenal',       label: 'Arsenal',       icon: 'toolbox' },
    { id: 'guia',          label: 'Guía',          icon: 'bookOpen' },
    { id: 'configuracion', label: 'Configuración', icon: 'settings' },
  ];

  const renderItem = (item) => {
    const active = item.id === route;
    return (
      <div key={item.id} onClick={() => nav(item.id)} style={{
        margin: '1px 10px', padding: T.rowPad, borderRadius: 8,
        background: active ? T.panel : 'transparent',
        boxShadow: active ? T.shadow : 'none',
        color: active ? T.text : T.textDim,
        fontWeight: active ? 500 : 400,
        display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer', transition: 'background .12s ease, color .12s ease',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.color = T.text; e.currentTarget.style.background = T.borderSoft; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.color = T.textDim; e.currentTarget.style.background = 'transparent'; } }}>
        <span style={{ display: 'inline-flex', color: active ? T.text : T.textFaint }}>
          <BS_Icon name={item.icon} size={15} />
        </span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && (
          <span style={{
            fontSize: 10.5, color: '#fff', background: T.success,
            borderRadius: 999, padding: '1px 7px', fontWeight: 500,
          }}>{item.badge}</span>
        )}
      </div>
    );
  };

  return (
    <aside style={{
      width: 220, background: T.bg, padding: dens === 'compact' ? '16px 0' : '22px 0',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Inter", sans-serif', fontSize: 13.5,
      borderRight: `1px solid ${T.border}`,
      flexShrink: 0,
    }}>
      <div onClick={() => nav('ahora')} style={{ padding: '0 20px 26px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{
          width: 24, height: 24, borderRadius: 7, background: T.ink,
          display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
        }}>dc</div>
        <span style={{ color: T.text, fontWeight: 500, letterSpacing: -0.1 }}>Don Cheli</span>
        <span style={{ color: T.textFaint, fontSize: 11 }}>Studio</span>
      </div>

      <div style={{ padding: '0 22px 8px', color: T.textFaint, fontSize: 11, fontWeight: 500 }}>Trabajar</div>
      {workItems.map(renderItem)}

      <div style={{ padding: '24px 22px 8px', color: T.textFaint, fontSize: 11, fontWeight: 500 }}>Consultar</div>
      {consultItems.map(renderItem)}

      <div style={{ flex: 1 }} />
      <div style={{
        margin: '12px 14px 8px', padding: '14px 14px',
        background: T.panel, boxShadow: T.shadow, borderRadius: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6, background: T.bgAlt,
            display: 'grid', placeItems: 'center', color: T.text, fontSize: 11,
          }}>$</div>
          <span style={{ fontSize: 12.5, fontWeight: 500 }}>Este mes</span>
        </div>
        <div style={{ height: 6, background: T.bgAlt, borderRadius: 999, marginBottom: 6 }}>
          <div style={{
            height: '100%', width: `${Math.min(100, gastoMes)}%`,
            background: T.ink, borderRadius: 999,
          }} />
        </div>
        <div style={{ fontSize: 11.5, color: T.textDim }}>
          <span style={{ color: T.text, fontWeight: 500 }}>${gastoMes.toFixed(2)}</span> de $100
        </div>
      </div>
    </aside>
  );
};

// ─────────── Top bar (chips “de un vistazo”) ───────────
const BS_TopBar = ({ dens, scenario, data }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      height: dens === 'compact' ? 52 : 60, padding: '0 28px',
      borderBottom: `1px solid ${T.border}`,
      display: 'flex', alignItems: 'center', gap: 10,
      background: T.bg, fontFamily: '"Inter", sans-serif',
    }}>
      <div style={{ fontSize: dens === 'compact' ? 16 : 18, fontWeight: 500, letterSpacing: -0.4 }}>Ahora</div>

      {/* First chip = status pill */}
      {data.chips.slice(0, 1).map((c, i) => (
        <div key={i} style={{
          marginLeft: 6, padding: '3px 10px', borderRadius: 999,
          background: c.tone === 'success' ? T.successBg : T.bgAlt,
          color: c.tone === 'success' ? T.success : T.text,
          fontSize: 11.5, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {c.tone === 'success' && (
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.success }} />
          )}
          {c.text}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      {data.chips.slice(1).map((c, i) => (
        <div key={i} style={{ padding: '5px 11px', fontSize: 12, color: T.textDim }}>
          {c.text}
        </div>
      ))}

      <div style={{ width: 1, height: 20, background: T.border, margin: '0 6px' }} />

      <div style={{
        padding: '6px 12px', borderRadius: 8, background: T.panel,
        boxShadow: T.shadow, display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12.5, color: T.text,
      }}>
        <span style={{ color: T.textDim }}>◆</span>
        {scenario === 'vacio' ? 'Editor: sin configurar' : 'Claude Code'}
        <span style={{ color: T.textFaint, fontSize: 10 }}>▾</span>
      </div>

      <div style={{
        width: 32, height: 32, borderRadius: '50%', background: T.bgAlt,
        display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 500,
      }}>J</div>
    </div>
  );
};

// ─────────── Header con resumen conversacional ───────────
const BS_Header = ({ dens, scenario, data }) => {
  const T = bStudioTokens(dens);
  const h = data.header;

  // Multi job selector
  const jobs = scenario === 'multi' ? data.jobs : null;

  return (
    <div style={{
      padding: `${dens === 'compact' ? 20 : 26}px 28px ${dens === 'compact' ? 16 : 20}px`,
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'nowrap', minWidth: 0 }}>
        <div style={{
          fontSize: T.headTitle, letterSpacing: -0.8, fontWeight: 500, color: T.text,
          whiteSpace: 'nowrap',
        }}>
          {h.title}
        </div>
        <div style={{
          padding: '3px 10px', borderRadius: 6, background: T.panel,
          boxShadow: T.shadow, color: T.textDim, fontSize: 12, whiteSpace: 'nowrap',
        }}>{h.badge}</div>

        {scenario === 'exito' && (
          <div style={{
            padding: '3px 10px', borderRadius: 6, background: T.successBg,
            color: T.success, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
          }}>✓ Todo salió bien</div>
        )}

        <div style={{ color: T.textFaint, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{h.meta}</div>
        <div style={{ flex: 1, minWidth: 8 }} />

        <div style={{ display: 'flex', gap: 8 }}>
          {scenario === 'exito' ? (
            <>
              <button style={{
                padding: '7px 14px', borderRadius: 8, background: T.panel,
                boxShadow: T.shadow, border: 'none', fontSize: 12.5, color: T.text, cursor: 'pointer',
              }}>Ver los cambios</button>
              <button style={{
                padding: '7px 14px', borderRadius: 8, background: T.ink,
                color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              }}>Llevar a mi rama →</button>
            </>
          ) : (
            <>
              <button style={{
                padding: '7px 14px', borderRadius: 8, background: T.panel,
                boxShadow: T.shadow, border: 'none', fontSize: 12.5, color: T.text, cursor: 'pointer',
              }}>Pausar</button>
              <button style={{
                padding: '7px 14px', borderRadius: 8, background: T.ink,
                color: '#fff', border: 'none', fontSize: 12.5, fontWeight: 500, cursor: 'pointer',
              }}>Ver trabajo →</button>
            </>
          )}
        </div>
      </div>
      <div style={{ color: T.textDim, fontSize: 13.5, maxWidth: 780 }}>
        {h.sub}
      </div>

      {/* Selector de trabajos para multi */}
      {jobs && (
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          {jobs.map(j => (
            <div key={j.id} style={{
              padding: '7px 12px', borderRadius: 8,
              background: j.active ? T.panel : 'transparent',
              boxShadow: j.active ? T.shadow : 'none',
              border: j.active ? 'none' : `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5,
              color: j.active ? T.text : T.textDim,
              fontWeight: j.active ? 500 : 400,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: j.active ? T.success : T.textFaint,
              }} />
              <span>{j.title}</span>
              <span style={{ color: T.textFaint }}>·</span>
              <span style={{ color: T.textDim }}>{j.step}</span>
              <span style={{ color: T.textFaint, fontFamily: '"Geist Mono", monospace', fontSize: 11 }}>{j.elapsed}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────── Métricas ───────────
const BS_Metrics = ({ dens, data }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: T.gap,
      padding: `${dens === 'compact' ? 14 : 20}px 28px 4px`,
    }}>
      {data.metrics.map((m, i) => (
        <div key={i} style={{
          background: T.panel, borderRadius: 12,
          boxShadow: T.shadow, padding: `${T.cardPad - 2}px ${T.cardPad}px`,
          animation: `bsFadeIn 0.3s ${i * 0.04}s cubic-bezier(.22,1,.36,1) both`,
        }}>
          <div style={{ color: T.textFaint, fontSize: 11.5, fontWeight: 500, marginBottom: 6 }}>
            {m.label}
          </div>
          <div style={{
            color: T.text, fontSize: T.metricVal, fontWeight: 500, letterSpacing: -0.5,
            fontFamily: m.mono ? '"Geist Mono", monospace' : 'inherit',
            fontVariantNumeric: 'tabular-nums',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {m.dot && <span style={{
              width: 8, height: 8, borderRadius: '50%', background: T.success,
              boxShadow: `0 0 0 4px ${T.successBg}`,
            }} />}
            {m.value}
          </div>
          <div style={{ color: T.textDim, fontSize: 12.5, marginTop: 4 }}>{m.sub}</div>
        </div>
      ))}
    </div>
  );
};

// ─────────── Log panel ───────────
const BS_Log = ({ dens, data }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      flex: 1.5, minWidth: 0,
      background: T.panel, borderRadius: 14, boxShadow: T.shadow,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: `${dens === 'compact' ? 12 : 16}px 20px`,
        borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.1 }}>Qué está haciendo ahora</div>
          <div style={{ color: T.textDim, fontSize: 12, marginTop: 1 }}>
            Se actualiza solo · pausa al pasar el mouse
          </div>
        </div>
        <div style={{ display: 'flex', gap: 3, fontSize: 11.5, background: T.bgAlt, padding: 3, borderRadius: 7 }}>
          {['Todo', 'Pensando', 'Avisos'].map((f, i) => (
            <span key={f} style={{
              padding: '4px 10px', borderRadius: 5,
              background: i === 0 ? T.panel : 'transparent',
              color: i === 0 ? T.text : T.textDim,
              boxShadow: i === 0 ? T.shadow : 'none',
              fontWeight: i === 0 ? 500 : 400,
            }}>{f}</span>
          ))}
        </div>
      </div>
      <div style={{
        padding: `${dens === 'compact' ? 4 : 6}px 20px ${dens === 'compact' ? 10 : 16}px`,
        fontSize: 12.5, lineHeight: dens === 'compact' ? 1.55 : 1.7,
      }}>
        {data.log.map((e, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '70px 18px 1fr', gap: 10,
            padding: `${dens === 'compact' ? 3 : 5}px 0`,
            borderBottom: i < data.log.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
            animation: `bsFadeIn 0.25s ${0.15 + i * 0.03}s cubic-bezier(.22,1,.36,1) both`,
          }}>
            <span style={{
              color: T.textFaint, fontFamily: '"Geist Mono", monospace',
              fontSize: 11, fontVariantNumeric: 'tabular-nums', paddingTop: 2,
            }}>{e.t}</span>
            <span style={{
              width: 14, height: 14, borderRadius: 4, marginTop: 3,
              background: {
                info: T.bgAlt, think: 'oklch(95% 0.04 290)',
                warn: T.warnBg, done: T.successBg, error: 'oklch(93% 0.06 25)',
              }[e.kind],
              color: {
                info: T.textDim, think: 'oklch(50% 0.15 290)',
                warn: T.warn, done: T.success, error: 'oklch(55% 0.18 25)',
              }[e.kind],
              fontSize: 9.5, fontWeight: 600,
              display: 'grid', placeItems: 'center',
            }}>{{info:'i',think:'~',warn:'!',done:'✓',error:'×'}[e.kind]}</span>
            <span style={{
              color: e.kind === 'think' ? T.textDim : T.text,
              fontStyle: e.kind === 'think' ? 'italic' : 'normal',
            }}>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────── Gates ───────────
const BS_Gates = ({ dens, scenario, data }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      flex: 1, minWidth: 0,
      background: T.panel, borderRadius: 14, boxShadow: T.shadow,
      padding: T.cardPad + 2,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.1 }}>Controles de calidad</div>
        <div style={{ color: T.textDim, fontSize: 12, marginTop: 1 }}>
          {scenario === 'exito'
            ? 'Los tres pasaron sin problemas'
            : 'Tres revisiones automáticas antes de cerrar'}
        </div>
      </div>

      {data.gates.map((g, i) => {
        const active = g.state === 'active';
        const passed = g.state === 'passed';
        const bg = active ? T.successBg : (passed ? T.successBg : T.bgAlt);
        const border = (active || passed) ? `1px solid oklch(90% 0.06 155)` : `1px solid transparent`;
        return (
          <div key={g.id} style={{
            padding: '14px', borderRadius: 10, marginBottom: 8,
            background: bg, border,
            animation: `bsFadeIn 0.3s ${0.18 + i * 0.05}s cubic-bezier(.22,1,.36,1) both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: (active || passed) ? T.success : '#fff',
                border: (active || passed) ? 'none' : `1px solid ${T.border}`,
                display: 'grid', placeItems: 'center',
                fontSize: 10, color: (active || passed) ? '#fff' : T.textFaint, fontWeight: 600,
              }}>{passed ? '✓' : (active ? '●' : i + 1)}</span>
              <span style={{ fontSize: 13.5, fontWeight: (active || passed) ? 600 : 500 }}>{g.label}</span>
              <span style={{ flex: 1 }} />
              <span style={{
                fontSize: 10.5, fontWeight: 500, letterSpacing: 0.3,
                color: (active || passed) ? T.success : T.textFaint,
                textTransform: 'uppercase',
              }}>{passed ? 'Pasó' : (active ? 'Revisando' : 'En espera')}</span>
            </div>
            <div style={{ color: T.textDim, fontSize: 12, marginTop: 6, paddingLeft: 30 }}>
              {g.hint}
            </div>
            {active && (
              <div style={{
                marginTop: 12, marginLeft: 30, padding: '10px 12px',
                background: '#fff', borderRadius: 8, boxShadow: T.shadow,
                display: 'flex', alignItems: 'center', gap: 10, fontSize: 12.5,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.success }} />
                <span style={{ color: T.textDim }}>design/auth-login.figma.md</span>
                <span style={{ flex: 1 }} />
                <span style={{
                  padding: '3px 10px', borderRadius: 6, background: T.ink,
                  color: '#fff', fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
                }}>Aprobar</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

Object.assign(window, {
  bStudioTokens, BS_Sidebar, BS_TopBar, BS_Header, BS_Metrics, BS_Log, BS_Gates,
});

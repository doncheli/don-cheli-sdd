// B Studio — Pantalla Historial

const BS_History = ({ dens, showSidebar, onNav, onOpenProject, scenario }) => {
  const T = bStudioTokens(dens);
  const [filter, setFilter] = React.useState('all'); // all | success | error | running
  const [range, setRange] = React.useState('7d');    // 24h | 7d | 30d | all

  const filtered = React.useMemo(() => {
    let arr = B_HISTORY_RUNS.slice();
    if (filter !== 'all') arr = arr.filter(r => r.result === filter);
    return arr;
  }, [filter]);

  const byDay = React.useMemo(() => {
    const groups = {};
    filtered.forEach(r => {
      const key = r.when.includes('min') || r.when.includes('h') || r.when === 'ahora' ? 'Hoy' :
                  r.when === 'ayer' ? 'Ayer' : r.when;
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    return groups;
  }, [filtered]);

  // Build a sparkline: last 14 days activity
  const spark = [3, 5, 2, 0, 0, 7, 4, 6, 2, 3, 5, 8, 4, 6];

  const resultTone = { success: 'active', running: 'active', error: 'error', stopped: 'paused', paused: 'paused' };
  const resultLabel = { success: 'Éxito', running: 'En vivo', error: 'Error', stopped: 'Detenido', paused: 'Pausado' };

  const counts = React.useMemo(() => ({
    all:     B_HISTORY_RUNS.length,
    success: B_HISTORY_RUNS.filter(r => r.result === 'success').length,
    error:   B_HISTORY_RUNS.filter(r => r.result === 'error').length,
    running: B_HISTORY_RUNS.filter(r => r.result === 'running').length,
  }), []);

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Historial"
        sub={`${B_HISTORY_RUNS.length} trabajos · ${counts.success} exitosos · ${counts.error} con errores`}
        onNav={onNav}
      />

      {/* Summary strip */}
      <div style={{
        padding: '16px 32px', display: 'grid',
        gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 14,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Sparkline */}
        <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 11.5, color: T.textFaint, fontWeight: 500 }}>ACTIVIDAD · 14 DÍAS</div>
            <div style={{ fontSize: 11.5, color: T.textDim }}>
              <span style={{ color: T.text, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
                {spark.reduce((a, b) => a + b, 0)}
              </span> trabajos
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 36 }}>
            {spark.map((v, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${Math.max(4, (v / Math.max(...spark)) * 100)}%`,
                background: v === 0 ? T.bgAlt : T.ink,
                borderRadius: 2, minHeight: 3,
                opacity: v === 0 ? 0.5 : 1,
                animation: `bsBarIn 0.5s ${i * 0.03}s cubic-bezier(.22,1,.36,1) both`,
              }} />
            ))}
          </div>
        </div>

        <BS_MetricCard dens={dens} label="EXITOSOS" value={counts.success} mono
          sub={`${Math.round((counts.success / counts.all) * 100)}% del total`}
          accent={T.success} />
        <BS_MetricCard dens={dens} label="CON ERRORES" value={counts.error} mono
          sub="Todos recuperables" />
        <BS_MetricCard dens={dens} label="EN VIVO" value={counts.running} mono
          sub={counts.running > 0 ? 'Ir a Ahora para ver' : 'Nada corriendo'} />
      </div>

      {/* Filter bar */}
      <div style={{
        padding: '12px 32px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: T.bgAlt, borderRadius: 8 }}>
          {[['all','Todos',counts.all], ['success','Exitosos',counts.success], ['error','Con errores',counts.error], ['running','En vivo',counts.running]].map(([v,label,count]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              border: 'none', background: filter === v ? T.panel : 'transparent',
              padding: '5px 11px', borderRadius: 5,
              color: filter === v ? T.text : T.textDim,
              fontSize: 12, fontFamily: 'inherit',
              fontWeight: filter === v ? 500 : 400, cursor: 'pointer',
              boxShadow: filter === v ? T.shadow : 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {label}
              <span style={{ fontSize: 10.5, color: T.textFaint, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 2, padding: 3, background: T.bgAlt, borderRadius: 8 }}>
          {[['24h','Hoy'], ['7d','7 días'], ['30d','30 días'], ['all','Todo']].map(([v,label]) => (
            <button key={v} onClick={() => setRange(v)} style={{
              border: 'none', background: range === v ? T.panel : 'transparent',
              padding: '5px 11px', borderRadius: 5,
              color: range === v ? T.text : T.textDim,
              fontSize: 12, fontFamily: 'inherit',
              fontWeight: range === v ? 500 : 400, cursor: 'pointer',
              boxShadow: range === v ? T.shadow : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      <BS_PageBody>
        {Object.keys(byDay).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: T.textDim }}>
            <div style={{ fontSize: 14 }}>No hay trabajos con estos filtros</div>
          </div>
        ) : Object.entries(byDay).map(([day, items], di) => (
          <div key={day} style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11.5, color: T.textFaint, fontWeight: 500,
              letterSpacing: 0.4, textTransform: 'uppercase',
              marginBottom: 10, paddingLeft: 4,
            }}>{day}</div>
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
              {items.map((r, i) => (
                <div key={r.id} className="bs-row"
                  onClick={() => onNav && onNav('trabajo')}
                  style={{
                    padding: '14px 20px',
                    borderBottom: i < items.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                    display: 'grid', gridTemplateColumns: '60px 1.4fr 110px 1fr 90px 90px 24px',
                    alignItems: 'center', gap: 14, fontSize: 12.5,
                    cursor: 'pointer', transition: 'background .12s ease',
                    animation: `bsFadeIn 0.25s ${(di * 4 + i) * 0.02}s cubic-bezier(.22,1,.36,1) both`,
                  }}>
                  <span style={{ fontFamily: '"Geist Mono", monospace', color: T.textFaint }}>#{r.id}</span>
                  <div>
                    <div style={{ color: T.text, fontWeight: 500, marginBottom: 2 }}>{r.project}</div>
                    <div style={{ color: T.textFaint, fontSize: 11 }}>{r.when}</div>
                  </div>
                  <BS_Pill tone={resultTone[r.result]} dot={r.result === 'running'}>
                    {resultLabel[r.result]}
                  </BS_Pill>
                  {/* Inline mini-timeline */}
                  <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {Array.from({ length: r.totalSteps }).map((_, si) => {
                      const done = si < r.stepsDone;
                      const current = si === r.stepsDone && r.result === 'running';
                      return (
                        <div key={si} style={{
                          flex: 1, height: 4, borderRadius: 2,
                          background: done ? T.ink : current ? T.success : T.bgAlt,
                          animation: current ? 'bsPulse 1.8s ease-in-out infinite' : 'none',
                        }} />
                      );
                    })}
                  </div>
                  <span style={{ textAlign: 'right', fontFamily: '"Geist Mono", monospace', color: T.textDim, fontVariantNumeric: 'tabular-nums', fontSize: 11.5 }}>
                    {r.duration}
                  </span>
                  <span style={{ textAlign: 'right', fontFamily: '"Geist Mono", monospace', color: T.text, fontVariantNumeric: 'tabular-nums' }}>
                    ${r.cost.toFixed(2)}
                  </span>
                  <span style={{ textAlign: 'right', color: T.textFaint }}>→</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_History });

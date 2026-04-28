// B Studio — Pantalla Gastos

const BS_Expenses = ({ dens, showSidebar, onNav, onOpenProject, scenario }) => {
  const T = bStudioTokens(dens);
  const E = B_EXPENSES;
  const [range, setRange] = React.useState('month'); // month | week | year
  const [grouping, setGrouping] = React.useState('project'); // project | model | step

  const pct = (E.thisMonth / E.budget) * 100;
  const projectedEnd = E.estimatedEnd;
  const projectedPct = (projectedEnd / E.budget) * 100;
  const delta = E.thisMonth - E.lastMonth;

  // Max daily value for chart scaling
  const maxDaily = Math.max(...E.daily.map(d => d.v));
  const today = 22; // for visual cutoff

  const groups = {
    project: E.byProject.map(x => ({ ...x, label: x.id })),
    model:   E.byModel.map(x => ({ ...x, label: x.id })),
    step:    E.byStep.map((x, i) => ({
      ...x, label: x.id,
      pct: Math.round((x.cost / E.thisMonth) * 100),
    })),
  };

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Gastos"
        sub="Cuánto se llevó este mes y en qué se fue"
        onNav={onNav}
        actions={
          <>
            <BS_Button>Exportar CSV</BS_Button>
            <BS_Button primary>Cambiar presupuesto</BS_Button>
          </>
        }
      />

      <BS_PageBody>
        {/* Hero: big number + budget bar */}
        <div style={{
          background: T.panel, borderRadius: 14, boxShadow: T.shadow,
          padding: '24px 28px', marginBottom: 16,
          display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 28,
        }}>
          <div>
            <div style={{ fontSize: 11.5, color: T.textFaint, fontWeight: 500, letterSpacing: 0.3, marginBottom: 8 }}>ESTE MES</div>
            <div style={{
              fontSize: 48, fontWeight: 500, letterSpacing: -1.5, color: T.text,
              fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}>
              ${E.thisMonth.toFixed(2)}
            </div>
            <div style={{ fontSize: 13, color: T.textDim, marginTop: 10 }}>
              de <span style={{ color: T.text, fontWeight: 500 }}>${E.budget.toFixed(0)}</span> de presupuesto
              {delta < 0 ? (
                <span style={{ color: T.success, marginLeft: 10 }}>
                  ↓ ${Math.abs(delta).toFixed(2)} vs mes pasado
                </span>
              ) : (
                <span style={{ color: T.textDim, marginLeft: 10 }}>
                  ↑ ${delta.toFixed(2)} vs mes pasado
                </span>
              )}
            </div>

            {/* Budget bar */}
            <div style={{
              marginTop: 22, height: 10, background: T.bgAlt,
              borderRadius: 999, overflow: 'hidden', position: 'relative',
            }}>
              <div className="bs-bar" style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${projectedPct}%`, background: T.borderSoft,
                borderRadius: 999,
              }} />
              <div className="bs-bar" style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${pct}%`, background: T.ink,
                borderRadius: 999,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: T.textDim }}>
              <span><span style={{ color: T.text, fontWeight: 500 }}>{pct.toFixed(0)}%</span> usado</span>
              <span>Proyección fin de mes: <span style={{ color: T.text, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>${projectedEnd}</span></span>
              <span>$100 →</span>
            </div>
          </div>

          <BS_MetricCard dens={dens} label="MES PASADO" value={`$${E.lastMonth.toFixed(2)}`} mono
            sub="Todo junio" big />
          <BS_MetricCard dens={dens} label="TRABAJOS ESTE MES" value="47" mono
            sub="$0.26 promedio por trabajo" big />
        </div>

        {/* Daily chart */}
        <div style={{ background: T.panel, borderRadius: 14, boxShadow: T.shadow, padding: '20px 24px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.1 }}>Día por día</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Gasto diario en julio</div>
            </div>
            <div style={{ display: 'flex', gap: 2, padding: 3, background: T.bgAlt, borderRadius: 8 }}>
              {[['week','Semana'], ['month','Mes'], ['year','Año']].map(([v,label]) => (
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

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, marginBottom: 10 }}>
            {E.daily.map((d, i) => {
              const h = maxDaily > 0 ? (d.v / maxDaily) * 100 : 0;
              const isPast = d.d < today;
              const isToday = d.d === today;
              const isFuture = d.d > today;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%', position: 'relative',
                    height: 120, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                  }}>
                    {d.v > 0 ? (
                      <div className="bs-chart-bar" style={{
                        width: '100%', height: `${Math.max(3, h)}%`,
                        background: isToday ? T.success : isPast ? T.ink : T.bgAlt,
                        borderRadius: 3,
                        animationDelay: `${i * 0.015}s`,
                        position: 'relative',
                      }}
                      title={`${d.d} jul · $${d.v.toFixed(2)}`}>
                      </div>
                    ) : (
                      <div style={{
                        width: '100%', height: 3, borderRadius: 2,
                        background: isFuture ? 'transparent' : T.bgAlt,
                        borderBottom: isFuture ? `1px dashed ${T.border}` : 'none',
                      }} />
                    )}
                  </div>
                  <div style={{
                    fontSize: 10, color: isToday ? T.text : T.textFaint,
                    fontWeight: isToday ? 600 : 400,
                    fontFamily: '"Geist Mono", monospace', marginTop: 6,
                  }}>
                    {d.d}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 18, fontSize: 11.5, color: T.textDim, paddingLeft: 2 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: T.ink }} />Días pasados
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: T.success }} />Hoy
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: T.bgAlt }} />Sin gasto
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ background: T.panel, borderRadius: 14, boxShadow: T.shadow, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.1 }}>En qué se fue</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>
                Top {groups[grouping].length} {grouping === 'project' ? 'proyectos' : grouping === 'model' ? 'modelos' : 'pasos'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 2, padding: 3, background: T.bgAlt, borderRadius: 8 }}>
              {[['project','Proyecto'], ['model','Modelo'], ['step','Paso']].map(([v,label]) => (
                <button key={v} onClick={() => setGrouping(v)} style={{
                  border: 'none', background: grouping === v ? T.panel : 'transparent',
                  padding: '5px 11px', borderRadius: 5,
                  color: grouping === v ? T.text : T.textDim,
                  fontSize: 12, fontFamily: 'inherit',
                  fontWeight: grouping === v ? 500 : 400, cursor: 'pointer',
                  boxShadow: grouping === v ? T.shadow : 'none',
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Stacked horizontal bar */}
          <div style={{
            height: 10, background: T.bgAlt, borderRadius: 999,
            overflow: 'hidden', display: 'flex', marginBottom: 18,
          }}>
            {groups[grouping].map((g, i) => {
              const shade = ['#0f1114', '#3a3a3e', '#65666b', '#9a9a9e', '#c9c9c4'];
              return (
                <div key={g.label} className="bs-bar" style={{
                  height: '100%',
                  width: `${g.pct}%`,
                  background: g.tone || shade[i % shade.length],
                  marginRight: i < groups[grouping].length - 1 ? 2 : 0,
                }} title={`${g.label}: $${g.cost.toFixed(2)}`} />
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {groups[grouping].map((g, i) => {
              const shade = ['#0f1114', '#3a3a3e', '#65666b', '#9a9a9e', '#c9c9c4', '#d9d9d3', '#e8e8e2'];
              const color = g.tone || shade[i % shade.length];
              return (
                <div key={g.label}
                  onClick={() => grouping === 'project' && onOpenProject && onOpenProject(g.label)}
                  className="bs-row"
                  style={{
                  padding: '10px 6px', borderRadius: 6,
                  display: 'grid', gridTemplateColumns: '18px 1fr 70px 80px',
                  alignItems: 'center', gap: 12, fontSize: 13,
                  cursor: grouping === 'project' ? 'pointer' : 'default',
                  transition: 'background .12s ease',
                }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'block' }} />
                  <span style={{
                    color: T.text,
                    fontFamily: grouping === 'project' ? '"Geist Mono", monospace' : 'inherit',
                    fontWeight: 500,
                  }}>{g.label}</span>
                  <span style={{ textAlign: 'right', color: T.textDim, fontSize: 11.5, fontVariantNumeric: 'tabular-nums' }}>
                    {g.pct}%
                  </span>
                  <span style={{
                    textAlign: 'right', color: T.text,
                    fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
                  }}>
                    ${g.cost.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_Expenses });

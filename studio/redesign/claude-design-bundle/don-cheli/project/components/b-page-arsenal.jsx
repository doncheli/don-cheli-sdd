// B Studio — Pantalla Arsenal (catálogo)

const BS_Arsenal = ({ dens, showSidebar, onNav, scenario }) => {
  const T = bStudioTokens(dens);
  const [tab, setTab] = React.useState('skills'); // skills | agents | commands
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');

  const tabs = [
    { id: 'skills',   label: 'Habilidades',    count: B_ARSENAL_SKILLS.length },
    { id: 'agents',   label: 'Especialistas',  count: B_ARSENAL_AGENTS.length },
    { id: 'commands', label: 'Comandos',       count: B_ARSENAL_COMMANDS.length },
  ];

  const data = tab === 'skills' ? B_ARSENAL_SKILLS :
               tab === 'agents' ? B_ARSENAL_AGENTS : B_ARSENAL_COMMANDS;

  const categories = React.useMemo(() => {
    const set = new Set(['all']);
    data.forEach(d => d.cat && set.add(d.cat));
    return [...set];
  }, [tab]);

  const filtered = React.useMemo(() => {
    let arr = data.slice();
    if (category !== 'all') arr = arr.filter(x => x.cat === category);
    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter(x => (x.name || x.id).toLowerCase().includes(q) || (x.desc || '').toLowerCase().includes(q));
    }
    return arr;
  }, [tab, query, category]);

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Arsenal"
        sub="Todas las habilidades, especialistas y comandos que Don Cheli puede usar"
        onNav={onNav}
        actions={<BS_Button primary>+ Agregar</BS_Button>}
      />

      {/* Tabs */}
      <div style={{
        padding: '0 32px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', gap: 2, background: T.bg,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setCategory('all'); }} style={{
            border: 'none', background: 'transparent',
            padding: '12px 14px 10px', fontFamily: 'inherit',
            fontSize: 13, fontWeight: tab === t.id ? 500 : 400,
            color: tab === t.id ? T.text : T.textDim,
            borderBottom: `2px solid ${tab === t.id ? T.ink : 'transparent'}`,
            marginBottom: -1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            {t.label}
            <span style={{ fontSize: 11, color: T.textFaint, fontVariantNumeric: 'tabular-nums' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{
        padding: '14px 32px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 8, background: T.panel, boxShadow: T.shadow,
          minWidth: 260,
        }}>
          <span style={{ color: T.textFaint, fontSize: 12 }}>⌕</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder={`Buscar ${tab === 'skills' ? 'habilidad' : tab === 'agents' ? 'especialista' : 'comando'}…`}
            style={{
              border: 'none', outline: 'none', fontSize: 13,
              fontFamily: 'inherit', color: T.text, background: 'transparent',
              width: '100%',
            }} />
        </div>
        {categories.length > 1 && (
          <div style={{ display: 'flex', gap: 4, padding: 3, background: T.bgAlt, borderRadius: 8, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                border: 'none', background: category === c ? T.panel : 'transparent',
                padding: '5px 11px', borderRadius: 5,
                color: category === c ? T.text : T.textDim,
                fontSize: 12, fontFamily: 'inherit',
                fontWeight: category === c ? 500 : 400, cursor: 'pointer',
                boxShadow: category === c ? T.shadow : 'none',
              }}>{c === 'all' ? 'Todo' : c}</button>
            ))}
          </div>
        )}
      </div>

      <BS_PageBody>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: T.textDim }}>
            Nada coincide con esa búsqueda.
          </div>
        ) : tab === 'commands' ? (
          <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.4fr 2fr 120px 100px',
              padding: '10px 20px', borderBottom: `1px solid ${T.border}`,
              fontSize: 10.5, color: T.textFaint, fontWeight: 500, letterSpacing: 0.4,
            }}>
              <div>COMANDO</div><div>QUÉ HACE</div><div>CATEGORÍA</div>
              <div style={{ textAlign: 'right' }}>USADO</div>
            </div>
            {filtered.map((c, i) => (
              <div key={c.id} className="bs-row" style={{
                display: 'grid', gridTemplateColumns: '1.4fr 2fr 120px 100px',
                padding: '12px 20px', fontSize: 12.5,
                borderBottom: i < filtered.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                alignItems: 'center', cursor: 'pointer', transition: 'background .12s ease',
                animation: `bsFadeIn 0.25s ${i * 0.02}s cubic-bezier(.22,1,.36,1) both`,
              }}>
                <span style={{ fontFamily: '"Geist Mono", monospace', color: T.text, fontWeight: 500 }}>{c.id}</span>
                <span style={{ color: T.textDim }}>{c.desc}</span>
                <span><BS_Pill>{c.cat}</BS_Pill></span>
                <span style={{ textAlign: 'right', color: T.textFaint, fontSize: 11.5 }}>{c.when}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14,
          }}>
            {filtered.map((x, i) => {
              const isSkill = tab === 'skills';
              const isAgent = tab === 'agents';
              return (
                <div key={x.id} className="bs-card-hover" style={{
                  background: T.panel, borderRadius: 12, boxShadow: T.shadow,
                  padding: 18, cursor: 'pointer',
                  animation: `bsFadeIn 0.3s ${i * 0.03}s cubic-bezier(.22,1,.36,1) both`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9,
                      background: isAgent ? 'oklch(95% 0.04 290)' : T.bgAlt,
                      display: 'grid', placeItems: 'center',
                      fontFamily: '"Geist Mono", monospace', fontSize: 14,
                      color: isAgent ? 'oklch(50% 0.15 290)' : T.text, fontWeight: 500,
                    }}>{isSkill ? '✱' : isAgent ? '◈' : '❯'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: -0.1 }}>
                        {x.name || x.id}
                      </div>
                      <div style={{ fontSize: 11, color: T.textFaint, marginTop: 2 }}>
                        {x.cat}
                      </div>
                    </div>
                  </div>

                  {x.desc && (
                    <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5, marginBottom: 14, minHeight: 36 }}>
                      {x.desc}
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11.5, color: T.textFaint }}>
                    <span>{x.uses} usos</span>
                    <span style={{ color: T.textDim }}>Ver detalle →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_Arsenal });

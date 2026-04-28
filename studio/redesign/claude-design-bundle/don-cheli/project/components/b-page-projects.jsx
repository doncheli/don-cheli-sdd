// B Studio — Pantalla Proyectos (lista)
// Best practices: filtros siempre visibles, hover estado, click → detalle, empty handling.

const BS_Projects = ({ dens, showSidebar, onNav, onOpenProject, scenario }) => {
  const T = bStudioTokens(dens);
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all'); // all | active | done | paused
  const [sort, setSort] = React.useState('recent');  // recent | cost | name
  const [view, setView] = React.useState('grid');    // grid | list

  const statusTone = { active: 'active', done: 'done', paused: 'paused', pending: 'pending' };
  const statusLabel = { active: 'Trabajando', done: 'Terminado', paused: 'Pausado', pending: 'Sin empezar' };

  const filtered = React.useMemo(() => {
    let arr = B_PROJECTS.slice();
    if (filter !== 'all') arr = arr.filter(p => p.status === filter);
    if (query) arr = arr.filter(p => p.id.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'recent') arr.sort((a, b) => b.lastRaw - a.lastRaw);
    if (sort === 'cost')   arr.sort((a, b) => b.cost - a.cost);
    if (sort === 'name')   arr.sort((a, b) => a.id.localeCompare(b.id));
    return arr;
  }, [filter, query, sort]);

  const counts = React.useMemo(() => ({
    all:     B_PROJECTS.length,
    active:  B_PROJECTS.filter(p => p.status === 'active').length,
    done:    B_PROJECTS.filter(p => p.status === 'done').length,
    paused:  B_PROJECTS.filter(p => p.status === 'paused').length,
    pending: B_PROJECTS.filter(p => p.status === 'pending').length,
  }), []);

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Proyectos"
        sub={`${B_PROJECTS.length} proyectos · ${counts.active} con trabajo en marcha`}
        onNav={onNav}
        actions={
          <>
            <BS_Button onClick={() => onNav && onNav('ahora')}>Ir a Ahora</BS_Button>
            <BS_Button primary onClick={() => window.openFolderPicker && window.openFolderPicker()}>+ Nuevo proyecto</BS_Button>
          </>
        }
      />

      {/* Filtros */}
      <div style={{
        padding: '14px 32px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 8, background: T.panel, boxShadow: T.shadow,
          minWidth: 280,
        }}>
          <span style={{ color: T.textFaint, fontSize: 12 }}>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyecto…"
            style={{
              border: 'none', outline: 'none', fontSize: 13,
              fontFamily: 'inherit', color: T.text, background: 'transparent',
              width: '100%',
            }}
          />
          {query && (
            <span onClick={() => setQuery('')} style={{ color: T.textFaint, fontSize: 11, cursor: 'pointer' }}>✕</span>
          )}
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 4, padding: 3, background: T.bgAlt, borderRadius: 8 }}>
          {[
            ['all',    'Todos',       counts.all],
            ['active', 'Trabajando',  counts.active],
            ['done',   'Terminados',  counts.done],
            ['paused', 'Pausados',    counts.paused],
          ].map(([v, label, count]) => (
            <button key={v} onClick={() => setFilter(v)} style={{
              border: 'none', background: filter === v ? T.panel : 'transparent',
              padding: '5px 11px', borderRadius: 5,
              color: filter === v ? T.text : T.textDim,
              fontSize: 12, fontFamily: 'inherit', fontWeight: filter === v ? 500 : 400,
              cursor: 'pointer',
              boxShadow: filter === v ? T.shadow : 'none',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {label}
              <span style={{
                fontSize: 10.5, color: T.textFaint,
                fontVariantNumeric: 'tabular-nums',
              }}>{count}</span>
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.textDim }}>
          Ordenar:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{
              border: 'none', background: T.panel, boxShadow: T.shadow,
              borderRadius: 6, padding: '5px 8px', fontSize: 12,
              fontFamily: 'inherit', color: T.text, outline: 'none',
            }}>
            <option value="recent">Más reciente</option>
            <option value="cost">Costo</option>
            <option value="name">Nombre</option>
          </select>
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', gap: 2, padding: 3, background: T.bgAlt, borderRadius: 7 }}>
          {[['grid','▦'], ['list','☰']].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              border: 'none', background: view === v ? T.panel : 'transparent',
              width: 28, height: 24, borderRadius: 5, fontSize: 13,
              color: view === v ? T.text : T.textDim, cursor: 'pointer',
              boxShadow: view === v ? T.shadow : 'none',
            }}>{icon}</button>
          ))}
        </div>
      </div>

      <BS_PageBody>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: T.textDim }}>
            <div style={{ fontSize: 14, marginBottom: 4 }}>No hay proyectos que coincidan</div>
            <div style={{ fontSize: 12, color: T.textFaint }}>Probá cambiar los filtros o la búsqueda</div>
          </div>
        ) : view === 'grid' ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 14,
          }}>
            {filtered.map((p, i) => (
              <div key={p.id} className="bs-card-hover"
                onClick={() => onOpenProject && onOpenProject(p.id)}
                style={{
                  background: T.panel, borderRadius: 12, boxShadow: T.shadow,
                  padding: 18, cursor: 'pointer',
                  animation: `bsFadeIn 0.3s ${i * 0.03}s cubic-bezier(.22,1,.36,1) both`,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, background: T.bgAlt,
                    display: 'grid', placeItems: 'center',
                    fontFamily: '"Geist Mono", monospace', fontSize: 13, color: T.text,
                    fontWeight: 500,
                  }}>{p.id.slice(0, 2)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.2 }}>{p.id}</div>
                    <div style={{ fontSize: 11.5, color: T.textFaint }}>{p.editor}</div>
                  </div>
                  <BS_Pill tone={statusTone[p.status]} dot={p.status === 'active'}>
                    {statusLabel[p.status]}
                  </BS_Pill>
                </div>

                <div style={{
                  padding: '10px 12px', background: T.bgAlt, borderRadius: 8,
                  fontSize: 12, color: T.textDim, marginBottom: 14,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ color: T.textFaint, fontSize: 11 }}>Paso:</span>
                  <span style={{ color: T.text, fontWeight: 500 }}>{p.step}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: T.textDim }}>
                  <div>
                    <div style={{ color: T.textFaint, fontSize: 10.5, fontWeight: 500, marginBottom: 2 }}>CORRIDAS</div>
                    <div style={{ color: T.text, fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                      {p.success}/{p.runs}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: T.textFaint, fontSize: 10.5, fontWeight: 500, marginBottom: 2 }}>GASTADO</div>
                    <div style={{ color: T.text, fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums' }}>
                      ${p.cost.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: T.textFaint, fontSize: 10.5, fontWeight: 500, marginBottom: 2 }}>ÚLTIMO USO</div>
                    <div style={{ color: T.text }}>{p.lastUsed}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: T.panel, borderRadius: 12, boxShadow: T.shadow,
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr 1fr 90px 100px 30px',
              padding: '10px 20px', borderBottom: `1px solid ${T.border}`,
              fontSize: 10.5, color: T.textFaint, fontWeight: 500, letterSpacing: 0.4,
            }}>
              <div>PROYECTO</div>
              <div>ESTADO</div>
              <div>PASO</div>
              <div style={{ textAlign: 'right' }}>CORRIDAS</div>
              <div style={{ textAlign: 'right' }}>GASTADO</div>
              <div />
            </div>
            {filtered.map((p, i) => (
              <div key={p.id} className="bs-row"
                onClick={() => onOpenProject && onOpenProject(p.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr 1fr 90px 100px 30px',
                  padding: '12px 20px',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                  fontSize: 13, alignItems: 'center', cursor: 'pointer',
                  transition: 'background .12s ease',
                  animation: `bsFadeIn 0.25s ${i * 0.02}s cubic-bezier(.22,1,.36,1) both`,
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6, background: T.bgAlt,
                    display: 'grid', placeItems: 'center',
                    fontFamily: '"Geist Mono", monospace', fontSize: 11, fontWeight: 500,
                  }}>{p.id.slice(0, 2)}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: T.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.id}</div>
                    <div style={{ color: T.textFaint, fontSize: 11 }}>{p.editor} · {p.lastUsed}</div>
                  </div>
                </div>
                <div>
                  <BS_Pill tone={statusTone[p.status]} dot={p.status === 'active'}>
                    {statusLabel[p.status]}
                  </BS_Pill>
                </div>
                <div style={{ color: T.textDim }}>{p.step}</div>
                <div style={{ textAlign: 'right', fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums', color: T.textDim }}>
                  {p.success}/{p.runs}
                </div>
                <div style={{ textAlign: 'right', fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums', color: T.text }}>
                  ${p.cost.toFixed(2)}
                </div>
                <div style={{ textAlign: 'right', color: T.textFaint, fontSize: 12 }}>→</div>
              </div>
            ))}
          </div>
        )}
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_Projects });

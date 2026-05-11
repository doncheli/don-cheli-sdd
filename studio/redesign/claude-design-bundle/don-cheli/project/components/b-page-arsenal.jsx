// B Studio — Pantalla Arsenal (catálogo accionable)
// Cada habilidad / agente / comando se puede aplicar a un proyecto desde acá mismo.

// ─────────── Menú desplegable "Aplicar a..." ───────────
// Posicionado con `position: fixed` para escapar del clipping de los scroll
// containers padres. Auto-detecta si abre hacia arriba o hacia abajo según
// el espacio disponible en el viewport.
const BS_ApplyMenu = ({ T, anchorRef, triggerRect, onClose, onPick }) => {
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => {
      const inAnchor = anchorRef.current && anchorRef.current.contains(e.target);
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!inAnchor && !inMenu) onClose && onClose();
    };
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    const onScrollOrResize = () => onClose && onClose();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onScrollOrResize);
    // Capturamos scrolls de cualquier contenedor (capture phase)
    window.addEventListener('scroll', onScrollOrResize, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('scroll', onScrollOrResize, true);
    };
  }, [anchorRef, onClose]);

  // Posición y alto calculados desde el viewport, no desde el contenedor padre.
  // Lógica:
  //   1. Si el menú a su alto preferido entra debajo del trigger → abre abajo.
  //   2. Si no entra abajo pero sí entra arriba → flip a arriba.
  //   3. Si no entra en ninguna dirección al alto preferido → elige la que
  //      tenga más espacio y ajusta el alto a ese espacio (con scroll interno).
  // Nunca se "empuja" el menú: si está abajo, su top es trigger.bottom + GAP
  // exacto; si está arriba, su bottom es trigger.top - GAP exacto.
  const MENU_W = 280;
  const DESIRED_H = 420;
  const MIN_H = 180;
  const GAP = 6;
  const MARGIN = 12;

  const spaceBelow = window.innerHeight - triggerRect.bottom - MARGIN - GAP;
  const spaceAbove = triggerRect.top - MARGIN - GAP;

  let openUpward, maxH;
  if (spaceBelow >= DESIRED_H) {
    openUpward = false;
    maxH = DESIRED_H;
  } else if (spaceAbove >= DESIRED_H) {
    openUpward = true;
    maxH = DESIRED_H;
  } else if (spaceAbove > spaceBelow) {
    openUpward = true;
    maxH = Math.max(MIN_H, spaceAbove);
  } else {
    openUpward = false;
    maxH = Math.max(MIN_H, spaceBelow);
  }

  const top = openUpward
    ? triggerRect.top - maxH - GAP
    : triggerRect.bottom + GAP;
  const left = Math.min(
    window.innerWidth - MENU_W - MARGIN,
    Math.max(MARGIN, triggerRect.right - MENU_W)
  );

  // Render vía portal en document.body para que ningún ancestro con
  // `transform` (las cards usan bsFadeIn con translateY como fill-mode
  // both) cree un containing block que rompa el `position: fixed`.
  const menuNode = (
    <div ref={menuRef} style={{
      position: 'fixed', top, left,
      width: MENU_W, maxHeight: maxH,
      background: T.panel, borderRadius: 10,
      boxShadow: T.shadowLg, border: `1px solid ${T.border}`,
      zIndex: 1100, padding: 6,
      display: 'flex', flexDirection: 'column',
      animation: 'bsFadeIn 0.16s cubic-bezier(.22,1,.36,1) both',
    }}>
      <div style={{
        padding: '8px 10px 6px', fontSize: 10.5,
        color: T.textFaint, fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: 0.6,
        flexShrink: 0,
      }}>Aplicar a…</div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {B_PROJECTS.map((p, i) => (
          <div key={p.id}
            onClick={(e) => { e.stopPropagation(); onPick && onPick(p); }}
            style={{
              padding: '8px 10px', borderRadius: 7, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'background .1s ease',
              animation: `bsFadeIn 0.16s ${i * 0.015}s cubic-bezier(.22,1,.36,1) both`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = T.bgAlt; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <span style={{
              width: 22, height: 22, borderRadius: 5,
              background: p.status === 'active' ? T.successBg : T.bgAlt,
              color: p.status === 'active' ? T.success : T.textDim,
              display: 'grid', placeItems: 'center',
            }}>
              <BS_Icon name="folder" size={12} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 500, color: T.text,
                fontFamily: '"Geist Mono", monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{p.id}</div>
              <div style={{ fontSize: 10.5, color: T.textFaint, marginTop: 1 }}>
                {p.step} · {p.lastUsed}
              </div>
            </div>
            {p.status === 'active' && (
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: T.success,
                animation: 'bsPulse 1.6s ease-in-out infinite',
                flexShrink: 0,
              }} />
            )}
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 4, padding: '8px 10px', borderTop: `1px solid ${T.borderSoft}`,
        fontSize: 11, color: T.textDim, display: 'flex', alignItems: 'center', gap: 6,
        cursor: 'pointer', flexShrink: 0,
      }}
        onClick={(e) => { e.stopPropagation(); onPick && onPick({ id: '__new__' }); }}
      >
        <BS_Icon name="plus" size={12} />
        Empezar un proyecto nuevo
      </div>
    </div>
  );

  return ReactDOM.createPortal(menuNode, document.body);
};

// ─────────── Toast de confirmación ───────────
const BS_Toast = ({ T, item, project, onClose }) => {
  React.useEffect(() => {
    const id = setTimeout(() => onClose && onClose(), 3500);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      background: T.text, color: '#fff',
      padding: '12px 16px 12px 14px', borderRadius: 12,
      boxShadow: T.shadowLg, zIndex: 1100,
      display: 'flex', alignItems: 'center', gap: 12, maxWidth: 'min(480px, 92vw)',
      animation: 'bsFadeIn 0.2s cubic-bezier(.22,1,.36,1) both',
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        background: T.success, display: 'grid', placeItems: 'center', flexShrink: 0,
      }}>
        <BS_Icon name="check" size={14} />
      </span>
      <div style={{ flex: 1, fontSize: 13, lineHeight: 1.4 }}>
        <strong style={{ fontWeight: 500 }}>{item.name || item.id}</strong> aplicándose a{' '}
        <strong style={{ fontWeight: 500, fontFamily: '"Geist Mono", monospace', fontSize: 12.5 }}>{project.id}</strong>
      </div>
      <span
        onClick={onClose}
        style={{
          padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500,
          cursor: 'pointer', color: 'rgba(255,255,255,0.85)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
      >Ver →</span>
    </div>
  );
};

// ─────────── Trigger "Aplicar a..." ───────────
const BS_ApplyTrigger = ({ T, item, primary, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const [rect, setRect] = React.useState(null);
  const ref = React.useRef(null);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open && ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
    setOpen(v => !v);
  };

  const handlePick = (project) => {
    setOpen(false);
    onPick && onPick(item, project);
  };

  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      <button
        onClick={handleToggle}
        style={{
          border: 'none', cursor: 'pointer',
          padding: primary ? '6px 11px' : '5px 9px',
          borderRadius: primary ? 7 : 6,
          background: primary ? T.text : T.bgAlt,
          color: primary ? '#fff' : T.text,
          fontFamily: 'inherit', fontSize: 11.5, fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 5,
        }}
      >
        Aplicar a…
        <span style={{ display: 'inline-flex', opacity: 0.7 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </button>
      {open && rect && (
        <BS_ApplyMenu
          T={T}
          anchorRef={ref}
          triggerRect={rect}
          onClose={() => setOpen(false)}
          onPick={handlePick}
        />
      )}
    </div>
  );
};

// ─────────── Página ───────────

const BS_Arsenal = ({ dens, showSidebar, onNav, scenario }) => {
  const T = bStudioTokens(dens);
  const [tab, setTab] = React.useState('skills'); // skills | agents | commands
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  const [toast, setToast] = React.useState(null);

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

  const handleApply = (item, project) => {
    if (project.id === '__new__') {
      window.openFolderPicker && window.openFolderPicker();
      return;
    }
    setToast({ item, project });
  };

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Arsenal"
        sub="Todas las habilidades, especialistas y comandos que Don Cheli puede usar. Cada uno se puede aplicar a un proyecto en un clic."
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
          <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'visible' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.4fr 2fr 110px 80px 110px',
              padding: '10px 20px', borderBottom: `1px solid ${T.border}`,
              fontSize: 10.5, color: T.textFaint, fontWeight: 500, letterSpacing: 0.4,
            }}>
              <div>COMANDO</div><div>QUÉ HACE</div><div>CATEGORÍA</div>
              <div style={{ textAlign: 'right' }}>USADO</div>
              <div style={{ textAlign: 'right' }}></div>
            </div>
            {filtered.map((c, i) => (
              <div key={c.id} className="bs-row" style={{
                display: 'grid', gridTemplateColumns: '1.4fr 2fr 110px 80px 110px',
                padding: '11px 20px', fontSize: 12.5,
                borderBottom: i < filtered.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                alignItems: 'center', cursor: 'pointer', transition: 'background .12s ease',
                animation: `bsFadeIn 0.25s ${i * 0.02}s cubic-bezier(.22,1,.36,1) both`,
                gap: 14,
              }}>
                <span style={{ fontFamily: '"Geist Mono", monospace', color: T.text, fontWeight: 500 }}>{c.id}</span>
                <span style={{ color: T.textDim }}>{c.desc}</span>
                <span><BS_Pill>{c.cat}</BS_Pill></span>
                <span style={{ textAlign: 'right', color: T.textFaint, fontSize: 11.5 }}>{c.when}</span>
                <span style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <BS_ApplyTrigger T={T} item={c} onPick={handleApply} />
                </span>
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
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
                    <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5, minHeight: 36 }}>
                      {x.desc}
                    </div>
                  )}

                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    fontSize: 11.5, color: T.textFaint, gap: 8,
                  }}>
                    <span>{x.uses} usos</span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <BS_ApplyTrigger T={T} item={x} primary onPick={handleApply} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </BS_PageBody>

      {toast && (
        <BS_Toast T={T} item={toast.item} project={toast.project} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

Object.assign(window, { BS_Arsenal });

// B Studio — Modal para seleccionar carpeta de proyecto
// Componente reusable: aparece desde 3 puntos de entrada (primer uso, +Nuevo proyecto, Empezar nuevo en Ahora)

const B_FS_MOCK = {
  '/Users/santiago': [
    { name: 'don-cheli', kind: 'dir' },
    { name: 'work', kind: 'dir' },
    { name: 'documentos', kind: 'dir' },
    { name: 'fotos-vacaciones', kind: 'dir' },
    { name: 'tmp', kind: 'dir' },
    { name: '.config', kind: 'dir', hidden: true },
  ],
  '/Users/santiago/work': [
    { name: 'auth-jwt', kind: 'dir', git: true, npm: true },
    { name: 'onboarding-v2', kind: 'dir', git: true, npm: true },
    { name: 'cart-refactor', kind: 'dir', git: true, npm: true },
    { name: 'landing-page', kind: 'dir', git: true },
    { name: 'design-system', kind: 'dir', git: true, npm: true },
    { name: 'payments', kind: 'dir', git: true, npm: true },
    { name: 'api-gateway', kind: 'dir', git: true },
    { name: 'blog-migration', kind: 'dir', git: true, npm: true },
    { name: 'experiments', kind: 'dir' },
  ],
  '/Users/santiago/don-cheli': [
    { name: 'don-cheli-sdd-feature-studio', kind: 'dir', git: true, npm: true },
  ],
  '/Users/santiago/documentos': [
    { name: 'facturas', kind: 'dir' },
    { name: 'contratos', kind: 'dir' },
    { name: 'recibos', kind: 'dir' },
  ],
};

const BS_FolderPicker = ({ open, onClose, onSelect }) => {
  const T = bStudioTokens('comfy');
  const [path, setPath] = React.useState('/Users/santiago/work');
  const [creating, setCreating] = React.useState(false);
  const [newName, setNewName] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setPath('/Users/santiago/work');
      setCreating(false);
      setNewName('');
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose && onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const entries = B_FS_MOCK[path] || [];
  const parts = path.split('/').filter(Boolean);
  const parent = parts.length > 0 ? '/' + parts.slice(0, -1).join('/') : null;

  const goHome = () => setPath('/Users/santiago');
  const goUp = () => parent && setPath(parent);
  const enter = (name) => setPath(path.endsWith('/') ? path + name : path + '/' + name);
  const select = (p) => { onSelect && onSelect(p); onClose && onClose(); };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(17, 18, 22, 0.55)',
        display: 'grid', placeItems: 'center',
        animation: 'bsFadeIn 0.2s cubic-bezier(.22,1,.36,1)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 92vw)',
          maxHeight: '78vh',
          background: T.panel,
          borderRadius: 14,
          boxShadow: T.shadowLg,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'bsFadeIn 0.24s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px', borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 500, color: T.text, letterSpacing: -0.2 }}>
              Selecciona la carpeta del proyecto
            </div>
            <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>
              Don Cheli va a trabajar sobre la carpeta que elijas. Tus archivos no se modifican hasta que pasen los controles de calidad.
            </div>
          </div>
          <span
            onClick={onClose}
            style={{
              cursor: 'pointer', color: T.textFaint, fontSize: 18, padding: 4,
              lineHeight: 1, marginLeft: 12,
            }}
          >×</span>
        </div>

        {/* Breadcrumb */}
        <div style={{
          padding: '10px 16px', borderBottom: `1px solid ${T.border}`,
          background: T.bgAlt, display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <button onClick={goHome} title="Inicio" style={{
            border: 'none', background: T.panel, padding: '5px 9px', borderRadius: 6,
            fontFamily: 'inherit', fontSize: 12, color: T.textDim,
            cursor: 'pointer', boxShadow: T.shadow,
          }}>↺</button>
          <button onClick={goUp} disabled={!parent} title="Subir" style={{
            border: 'none', background: parent ? T.panel : 'transparent',
            padding: '5px 9px', borderRadius: 6, fontFamily: 'inherit', fontSize: 12,
            color: parent ? T.textDim : T.textFaint,
            cursor: parent ? 'pointer' : 'not-allowed',
            boxShadow: parent ? T.shadow : 'none',
          }}>↑</button>
          <div style={{
            flex: 1, padding: '5px 10px', background: T.panel, borderRadius: 6,
            fontFamily: '"Geist Mono", monospace', fontSize: 11.5, color: T.textDim,
            border: `1px solid ${T.border}`,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{path}</div>
          <button
            onClick={() => select(path)}
            style={{
              border: 'none', background: T.ink, color: '#fff',
              padding: '6px 12px', borderRadius: 6, fontFamily: 'inherit',
              fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >Elegir esta</button>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
          {entries.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: T.textFaint, fontSize: 12.5 }}>
              No hay carpetas en este nivel.
            </div>
          ) : entries.map((e, i) => (
            <div
              key={e.name}
              onClick={() => enter(e.name)}
              onDoubleClick={() => select(path + '/' + e.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                background: 'transparent',
                border: e.git ? `1px solid ${T.border}` : '1px solid transparent',
                transition: 'background .12s ease',
                animation: `bsFadeIn 0.18s ${i * 0.015}s cubic-bezier(.22,1,.36,1) both`,
              }}
              onMouseEnter={(ev) => { ev.currentTarget.style.background = T.bgAlt; }}
              onMouseLeave={(ev) => { ev.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 6,
                background: e.git ? 'oklch(96% 0.02 270)' : T.bgAlt,
                color: e.git ? 'oklch(45% 0.18 270)' : T.textDim,
                display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0,
              }}>{e.git ? '⌥' : '▢'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: e.git ? 500 : 400, color: T.text }}>
                  {e.name}
                </div>
                {e.git && (
                  <div style={{ fontSize: 11, color: T.textFaint, fontFamily: '"Geist Mono", monospace', marginTop: 2 }}>
                    {path}/{e.name}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                {e.npm && (
                  <span style={{
                    padding: '2px 7px', borderRadius: 999,
                    background: 'oklch(96% 0.04 60)', color: 'oklch(50% 0.15 60)',
                    fontSize: 10, fontWeight: 500,
                  }}>npm</span>
                )}
                {e.git && (
                  <span style={{
                    padding: '2px 7px', borderRadius: 999,
                    background: 'oklch(96% 0.04 270)', color: 'oklch(50% 0.18 270)',
                    fontSize: 10, fontWeight: 500,
                  }}>git</span>
                )}
                <span style={{ color: T.textFaint, fontSize: 14 }}>›</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 16px', borderTop: `1px solid ${T.border}`,
          background: T.bgAlt,
        }}>
          {creating ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newName.trim()) { select(path + '/' + newName.trim()); }
                  if (e.key === 'Escape') { setCreating(false); setNewName(''); }
                }}
                placeholder="Nombre de la carpeta nueva"
                style={{
                  flex: 1, padding: '6px 10px', borderRadius: 6,
                  border: `1px solid ${T.border}`, background: T.panel,
                  fontFamily: 'inherit', fontSize: 12.5, color: T.text,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => newName.trim() && select(path + '/' + newName.trim())}
                disabled={!newName.trim()}
                style={{
                  border: 'none', background: T.ink, color: '#fff',
                  padding: '6px 12px', borderRadius: 6, fontFamily: 'inherit',
                  fontSize: 12, fontWeight: 500,
                  cursor: newName.trim() ? 'pointer' : 'not-allowed',
                  opacity: newName.trim() ? 1 : 0.4,
                }}
              >Crear y elegir</button>
              <button
                onClick={() => { setCreating(false); setNewName(''); }}
                style={{
                  border: 'none', background: T.panel, color: T.textDim,
                  padding: '6px 12px', borderRadius: 6, fontFamily: 'inherit',
                  fontSize: 12, cursor: 'pointer', boxShadow: T.shadow,
                }}
              >Cancelar</button>
            </div>
          ) : (
            <span
              onClick={() => setCreating(true)}
              style={{
                fontSize: 12.5, color: T.textDim, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = T.text}
              onMouseLeave={(e) => e.currentTarget.style.color = T.textDim}
            >
              + Crear una carpeta nueva aquí
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BS_FolderPicker });

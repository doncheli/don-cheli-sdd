// B Studio — Estado vacío. Copy simple.
const BS_Empty = ({ dens, onNav }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 40 }}>
      <div style={{ width: 720, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 28px',
          background: T.panel, boxShadow: T.shadow,
          display: 'grid', placeItems: 'center',
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: T.ink,
            display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 600, fontSize: 13,
          }}>dc</div>
        </div>
        <div style={{ fontSize: 34, letterSpacing: -1, fontWeight: 500, marginBottom: 10 }}>
          Aquí vas a ver tus trabajos
        </div>
        <div style={{
          color: T.textDim, fontSize: 15, lineHeight: 1.55, marginBottom: 36,
          maxWidth: 540, margin: '0 auto 36px',
        }}>
          Don Cheli te acompaña a construir software paso a paso. Tú le dices qué quieres, él te pregunta lo que falta, planifica, lo hace y te avisa. Siempre puedes pausar, revisar o volver atrás.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { title: 'Empezar algo nuevo', sub: 'Elige una carpeta y le cuentas qué quieres', primary: true, icon: 'plus', action: () => window.openFolderPicker && window.openFolderPicker() },
            { title: 'Seguir donde estabas',  sub: 'auth-jwt · hace 4 minutos', icon: 'rotateCcw' },
            { title: 'Ver lo que ya hiciste', sub: '12 trabajos guardados',     icon: 'clock' },
          ].map((c, i) => (
            <div key={i}
              onClick={c.action}
              style={{
              padding: '22px 20px 24px', borderRadius: 14, textAlign: 'left',
              background: c.primary ? T.ink : T.panel,
              boxShadow: c.primary ? T.shadowLg : T.shadow,
              color: c.primary ? '#fff' : T.text, cursor: 'pointer', position: 'relative',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, marginBottom: 18,
                background: c.primary ? 'rgba(255,255,255,0.12)' : T.bgAlt,
                color: c.primary ? '#fff' : T.text,
                display: 'grid', placeItems: 'center',
              }}>
                <BS_Icon name={c.icon} size={18} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: -0.2 }}>{c.title}</div>
              <div style={{
                color: c.primary ? 'rgba(255,255,255,0.7)' : T.textDim,
                fontSize: 12.5, marginTop: 5,
              }}>{c.sub}</div>
              <div style={{
                position: 'absolute', top: 22, right: 20,
                color: c.primary ? 'rgba(255,255,255,0.6)' : T.textFaint,
                display: 'inline-flex',
              }}>
                <BS_Icon name="arrowRight" size={14} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 30, fontSize: 12.5, color: T.textFaint }}>
          ¿Primera vez? <span onClick={() => onNav && onNav('onboarding')} style={{ color: T.text, borderBottom: `1px solid ${T.text}`, paddingBottom: 1, cursor: 'pointer' }}>Hacer el recorrido (2 min)</span> · <span onClick={() => onNav && onNav('guia')} style={{ color: T.text, borderBottom: `1px solid ${T.text}`, paddingBottom: 1, cursor: 'pointer' }}>Abrir la Guía</span>
        </div>
      </div>
    </div>
  );
};

// ─────────── Main assembler ───────────
const BStudio = ({ dens = 'comfy', scenario = 'activo', tlVariant = 'bar', showSidebar = true, route = 'ahora', onNav }) => {
  const T = bStudioTokens(dens);
  const data = scenario === 'vacio' ? null : B_SCENARIOS[scenario];

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: T.bg, color: T.text,
      fontFamily: '"Inter", sans-serif',
    }}>
      {showSidebar && <BS_Sidebar dens={dens} scenario={scenario} route={route} onNav={onNav} />}
      <div className="bs-page" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {scenario === 'vacio' ? (
          <>
            <div style={{
              height: dens === 'compact' ? 52 : 60, padding: '0 28px',
              borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.4 }}>Ahora</div>
              <div style={{ color: T.textFaint, fontSize: 12.5 }}>
                Nada en marcha · todo tranquilo · $0 este mes
              </div>
              <div style={{ flex: 1 }} />
              <div style={{
                padding: '6px 12px', borderRadius: 8, background: T.panel,
                boxShadow: T.shadow, fontSize: 12.5, color: T.textDim,
              }}>◆ Editor: sin configurar</div>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: T.bgAlt,
                display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 500,
              }}>J</div>
            </div>
            <BS_Empty dens={dens} onNav={onNav} />
          </>
        ) : (
          <>
            <BS_TopBar dens={dens} scenario={scenario} data={data} />
            <BS_Header dens={dens} scenario={scenario} data={data} />
            <div style={{
              flex: 1, minHeight: 0, overflowY: 'auto',
              display: 'flex', flexDirection: 'column',
            }}>
              <BS_Metrics dens={dens} data={data} />
              <BS_Timeline dens={dens} data={data} variant={tlVariant} />
              <div style={{
                display: 'flex', gap: 16,
                padding: `${dens === 'compact' ? 12 : 18}px 28px 28px`,
                flex: 1, minHeight: 'max-content',
              }}>
                <BS_Log dens={dens} data={data} />
                <BS_Gates dens={dens} scenario={scenario} data={data} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { BS_Empty, BStudio });

// B Studio — Recorrido inicial (5 pasos).
// Full-screen, sin sidebar. Skip arriba a la derecha. Dots de progreso + Atrás/Siguiente.

const B_TOUR_STEPS = [
  {
    id: 'welcome',
    eyebrow: 'Bienvenido',
    title: 'Don Cheli te acompaña a construir software paso a paso',
    body: 'En unos dos minutos te muestro cómo funciona. Si prefieres explorar por tu cuenta, puedes saltarte el recorrido y volverlo a ver desde la Guía cuando quieras.',
    cta: 'Empezar el recorrido',
    visual: 'hero',
  },
  {
    id: 'how-it-works',
    eyebrow: 'Paso 1 — Cómo trabaja',
    title: 'Tres lugares se complementan',
    body: 'Don Cheli no es una herramienta separada. Es una metodología que vive dentro de las herramientas que ya usas.',
    visual: 'three-places',
  },
  {
    id: 'organization',
    eyebrow: 'Paso 2 — Cómo está organizado',
    title: 'Tres niveles, de la mirada rápida al detalle',
    body: 'Usa la sidebar para movierte entre las cuatro secciones de "Trabajar" y las de "Consultar". Arriba siempre verás un resumen de lo que está pasando.',
    visual: 'three-layers',
  },
  {
    id: 'seven-steps',
    eyebrow: 'Paso 3 — Los 7 pasos',
    title: 'Cada trabajo sigue siempre estos siete pasos',
    body: 'Don Cheli es opinionado: especifica primero, luego planifica, luego construye. No te deja saltar pasos, pero tú decides cuándo arrancar y cuándo pausar.',
    visual: 'seven-steps',
  },
  {
    id: 'lets-go',
    eyebrow: '¡Listo!',
    title: 'Empecemos. Selecciona la carpeta de tu primer proyecto',
    body: 'Don Cheli va a trabajar sobre la carpeta que elijas. Puedes cambiarla cuando quieras, y trabajar varios proyectos en paralelo.',
    cta: 'Seleccionar carpeta',
    visual: 'final',
  },
];

const BS_Onboarding = ({ dens = 'comfy', onNav }) => {
  const T = bStudioTokens(dens);
  const [step, setStep] = React.useState(0);
  const total = B_TOUR_STEPS.length;
  const cur = B_TOUR_STEPS[step];

  const next = () => step < total - 1 ? setStep(step + 1) : finish();
  const prev = () => step > 0 && setStep(step - 1);
  const skip = () => onNav && onNav('ahora');
  const finish = () => {
    if (cur.id === 'lets-go') {
      window.openFolderPicker && window.openFolderPicker();
    }
    onNav && onNav('ahora');
  };

  return (
    <div className="bs-page" style={{
      width: '100%', minHeight: '100%',
      background: T.bg, color: T.text,
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Inter", sans-serif',
    }}>
      {/* Top bar: brand + skip */}
      <div style={{
        padding: '18px 28px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: T.text,
            color: '#fff', display: 'grid', placeItems: 'center',
            fontSize: 11, fontWeight: 600,
          }}>dc</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Don Cheli Studio</div>
        </div>
        <span
          onClick={skip}
          style={{
            fontSize: 12.5, color: T.textDim, cursor: 'pointer',
            padding: '6px 10px', borderRadius: 6,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.text; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textDim; }}
        >
          Saltar recorrido
          <BS_Icon name="arrowRight" size={13} />
        </span>
      </div>

      {/* Body */}
      <div style={{
        flex: 1, display: 'grid', placeItems: 'center', padding: '32px 24px',
      }}>
        <div key={step} style={{
          width: 'min(720px, 100%)', textAlign: 'center',
          animation: `bsFadeIn 0.32s cubic-bezier(.22,1,.36,1) both`,
        }}>
          <div style={{
            fontSize: 11, color: T.textFaint, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: 1,
            marginBottom: 16,
          }}>{cur.eyebrow}</div>

          <div style={{
            fontSize: 32, lineHeight: 1.15, fontWeight: 500,
            letterSpacing: -1, marginBottom: 14,
          }}>{cur.title}</div>

          <div style={{
            fontSize: 15, color: T.textDim, lineHeight: 1.6,
            maxWidth: 560, margin: '0 auto 32px',
          }}>{cur.body}</div>

          {/* Visual por paso */}
          <div style={{ marginBottom: 36 }}>
            {cur.visual === 'hero' && (
              <div style={{
                width: 104, height: 104, borderRadius: 24, margin: '0 auto',
                background: T.panel, boxShadow: T.shadowLg,
                display: 'grid', placeItems: 'center',
                position: 'relative',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: T.text,
                  display: 'grid', placeItems: 'center', color: '#fff',
                }}>
                  <BS_Icon name="sparkles" size={24} />
                </div>
                {/* Esquinas decorativas con sparkles tenues */}
                <div style={{ position: 'absolute', top: -6, right: -6, color: T.success, opacity: 0.7 }}>
                  <BS_Icon name="sparkles" size={14} />
                </div>
                <div style={{ position: 'absolute', bottom: -4, left: -8, color: T.warn, opacity: 0.5 }}>
                  <BS_Icon name="sparkles" size={10} />
                </div>
              </div>
            )}

            {cur.visual === 'three-places' && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
                maxWidth: 660, margin: '0 auto',
              }}>
                {[
                  { title: 'Tu editor con IA', sub: 'Claude Code · Cursor · OpenCode · Gemini · Codex', icon: 'code' },
                  { title: 'Don Cheli Studio',  sub: 'Esta vista. Torre de control visual.', icon: 'dashboard', primary: true },
                  { title: 'Terminal',          sub: 'Solo para instalar y actualizar.', icon: 'terminal' },
                ].map((c, i) => (
                  <div key={i} style={{
                    padding: '18px 16px', borderRadius: 12,
                    background: c.primary ? T.text : T.panel,
                    color: c.primary ? '#fff' : T.text,
                    boxShadow: c.primary ? T.shadowLg : T.shadow,
                    textAlign: 'left',
                    animation: `bsFadeIn 0.32s ${0.1 + i * 0.08}s cubic-bezier(.22,1,.36,1) both`,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 9, marginBottom: 14,
                      background: c.primary ? 'rgba(255,255,255,0.14)' : T.bgAlt,
                      color: c.primary ? '#fff' : T.text,
                      display: 'grid', placeItems: 'center',
                    }}>
                      <BS_Icon name={c.icon} size={18} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{c.title}</div>
                    <div style={{
                      fontSize: 12, lineHeight: 1.5,
                      color: c.primary ? 'rgba(255,255,255,0.7)' : T.textDim,
                    }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {cur.visual === 'three-layers' && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
                maxWidth: 660, margin: '0 auto', textAlign: 'left',
              }}>
                {[
                  { eye: 'Nivel 1', title: 'De un vistazo', icon: 'eye',    items: ['Trabajos en marcha', 'Avisos', 'Gasto del mes', 'Trabajos hoy'] },
                  { eye: 'Nivel 2', title: 'Trabajar',      icon: 'layers', items: ['Ahora', 'Proyectos', 'Historial', 'Gastos'] },
                  { eye: 'Nivel 3', title: 'Consultar',     icon: 'book',   items: ['Arsenal', 'Guía', 'Configuración'] },
                ].map((c, i) => (
                  <div key={i} style={{
                    padding: '16px', borderRadius: 12, background: T.panel, boxShadow: T.shadow,
                    animation: `bsFadeIn 0.32s ${0.1 + i * 0.08}s cubic-bezier(.22,1,.36,1) both`,
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                    }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: 7, background: T.bgAlt,
                        color: T.text, display: 'grid', placeItems: 'center', flexShrink: 0,
                      }}>
                        <BS_Icon name={c.icon} size={15} />
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 9.5, color: T.textFaint, fontWeight: 500,
                          textTransform: 'uppercase', letterSpacing: 0.6,
                        }}>{c.eye}</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{c.title}</div>
                      </div>
                    </div>
                    {c.items.map(it => (
                      <div key={it} style={{
                        fontSize: 12, color: T.textDim, padding: '3px 0',
                      }}>{it}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {cur.visual === 'seven-steps' && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6,
                maxWidth: 760, margin: '0 auto',
              }}>
                {[
                  { label: 'Especificar', icon: 'fileText' },
                  { label: 'Aclarar',     icon: 'helpCircle' },
                  { label: 'Planificar',  icon: 'route' },
                  { label: 'Diseñar',     icon: 'palette' },
                  { label: 'Desglosar',   icon: 'listChecks' },
                  { label: 'Construir',   icon: 'hammer' },
                  { label: 'Revisar',     icon: 'badgeCheck' },
                ].map((s, i) => (
                  <div key={s.label} style={{
                    padding: '14px 6px', borderRadius: 10,
                    background: T.panel, boxShadow: T.shadow,
                    animation: `bsFadeIn 0.32s ${0.1 + i * 0.05}s cubic-bezier(.22,1,.36,1) both`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 8, background: T.bgAlt,
                      color: T.text, display: 'grid', placeItems: 'center',
                    }}>
                      <BS_Icon name={s.icon} size={16} />
                    </span>
                    <span style={{
                      fontSize: 10, color: T.textFaint,
                      fontFamily: '"Geist Mono", monospace', fontWeight: 600,
                    }}>{i + 1}</span>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: T.text, textAlign: 'center' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {cur.visual === 'final' && (
              <div style={{
                width: 104, height: 104, borderRadius: 24, margin: '0 auto',
                background: T.successBg, color: T.success,
                display: 'grid', placeItems: 'center',
                animation: `bsFadeIn 0.4s 0.1s cubic-bezier(.22,1,.36,1) both`,
                position: 'relative',
              }}>
                <BS_Icon name="rocket" size={40} strokeWidth={1.4} />
                <div style={{ position: 'absolute', top: -4, right: 8, color: T.success, opacity: 0.6 }}>
                  <BS_Icon name="sparkles" size={14} />
                </div>
                <div style={{ position: 'absolute', bottom: 6, left: -6, color: T.success, opacity: 0.4 }}>
                  <BS_Icon name="sparkles" size={10} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: progress + nav */}
      <div style={{
        padding: '16px 28px 28px', borderTop: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: T.bg,
      }}>
        <button
          onClick={prev}
          disabled={step === 0}
          style={{
            padding: '8px 14px', borderRadius: 8, border: 'none',
            background: T.panel, boxShadow: step === 0 ? 'none' : T.shadow,
            color: step === 0 ? T.textFaint : T.text,
            fontFamily: 'inherit', fontSize: 13,
            cursor: step === 0 ? 'not-allowed' : 'pointer',
            opacity: step === 0 ? 0.4 : 1,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          <span style={{ display: 'inline-flex', transform: 'rotate(180deg)' }}>
            <BS_Icon name="arrowRight" size={14} />
          </span>
          Atrás
        </button>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {B_TOUR_STEPS.map((_, i) => (
            <span key={i}
              onClick={() => setStep(i)}
              style={{
                width: i === step ? 22 : 8, height: 8,
                borderRadius: 999,
                background: i === step ? T.text : (i < step ? T.textDim : T.border),
                cursor: 'pointer',
                transition: 'width .2s ease, background .2s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          style={{
            padding: '9px 18px', borderRadius: 8, border: 'none',
            background: T.text, color: '#fff',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          {step === total - 1 ? (cur.cta || 'Empezar') : 'Siguiente'}
          <BS_Icon name={step === total - 1 ? 'arrowRight' : 'arrowRight'} size={14} />
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { BS_Onboarding });

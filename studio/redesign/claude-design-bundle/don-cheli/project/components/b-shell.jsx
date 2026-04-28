// B Studio — Chrome compartido para las páginas secundarias.
// Provee un shell reusable: sidebar + topbar sencillo + título de página.

const BS_SecondaryTopBar = ({ dens, title, sub, breadcrumb, onNav, actions }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      padding: `${dens === 'compact' ? 18 : 24}px 32px ${dens === 'compact' ? 14 : 18}px`,
      borderBottom: `1px solid ${T.border}`,
      background: T.bg,
    }}>
      {breadcrumb && (
        <div style={{
          fontSize: 12, color: T.textFaint, marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: T.textFaint, opacity: 0.5 }}>/</span>}
              <span
                onClick={() => b.to && onNav && onNav(b.to)}
                style={{
                  cursor: b.to ? 'pointer' : 'default',
                  color: b.to ? T.textDim : T.text,
                }}
                onMouseEnter={(e) => { if (b.to) e.currentTarget.style.color = T.text; }}
                onMouseLeave={(e) => { if (b.to) e.currentTarget.style.color = T.textDim; }}
              >{b.label}</span>
            </React.Fragment>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: dens === 'compact' ? 24 : 28, letterSpacing: -0.8,
            fontWeight: 500, color: T.text,
          }}>{title}</div>
          {sub && (
            <div style={{ color: T.textDim, fontSize: 13.5, marginTop: 4 }}>{sub}</div>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: 8 }}>{actions}</div>}
      </div>
    </div>
  );
};

// Botón primario / secundario
const BS_Button = ({ children, primary, onClick, disabled, size = 'md' }) => {
  const T = bStudioTokens('comfy');
  const [hover, setHover] = React.useState(false);
  const pad = size === 'sm' ? '5px 11px' : '7px 14px';
  const fs = size === 'sm' ? 12 : 12.5;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: pad, borderRadius: 8, border: 'none',
        background: primary ? T.ink : T.panel,
        color: primary ? '#fff' : T.text,
        fontFamily: 'inherit', fontSize: fs,
        fontWeight: primary ? 500 : 400,
        boxShadow: primary ? 'none' : T.shadow,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transform: hover && !disabled ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform .12s ease, box-shadow .12s ease',
      }}>
      {children}
    </button>
  );
};

// Tag / pill con tone semántico
const BS_Pill = ({ tone = 'neutral', children, dot }) => {
  const T = bStudioTokens('comfy');
  const tones = {
    neutral: { bg: T.bgAlt,     c: T.textDim,  dotC: T.textFaint },
    active:  { bg: T.successBg, c: T.success, dotC: T.success    },
    done:    { bg: T.bgAlt,     c: T.textDim,  dotC: T.textFaint  },
    warn:    { bg: T.warnBg,    c: T.warn,    dotC: T.warn        },
    error:   { bg: 'oklch(96% 0.06 25)', c: 'oklch(55% 0.18 25)', dotC: 'oklch(55% 0.18 25)' },
    paused:  { bg: T.bgAlt,     c: T.textDim,  dotC: T.textFaint  },
    pending: { bg: 'transparent', c: T.textFaint, dotC: T.textFaint },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 9px', borderRadius: 999, background: t.bg, color: t.c,
      fontSize: 11, fontWeight: 500, letterSpacing: 0.1,
      border: tone === 'pending' ? `1px solid ${T.border}` : 'none',
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: t.dotC,
          animation: tone === 'active' ? 'bsPulse 1.8s ease-in-out infinite' : 'none',
        }} />
      )}
      {children}
    </span>
  );
};

// Shell de página: sidebar + contenido
const BS_PageShell = ({ dens, showSidebar, route, onNav, scenario, children }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex',
      background: T.bg, color: T.text,
      fontFamily: '"Inter", sans-serif',
    }}>
      {showSidebar && <BS_Sidebar dens={dens} scenario={scenario} route={route} onNav={onNav} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
};

// Scroll container para bodies de página
const BS_PageBody = ({ children, padding = '20px 32px 32px' }) => {
  return (
    <div style={{
      flex: 1, minHeight: 0, overflow: 'auto',
      padding,
    }}>{children}</div>
  );
};

// Pequeña tarjeta métrica (para gastos)
const BS_MetricCard = ({ dens, label, value, sub, mono, accent, big }) => {
  const T = bStudioTokens(dens);
  return (
    <div style={{
      background: T.panel, borderRadius: 12, boxShadow: T.shadow,
      padding: big ? '20px 22px' : '14px 16px',
    }}>
      <div style={{ color: T.textFaint, fontSize: 11.5, fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{
        color: accent || T.text,
        fontSize: big ? 34 : 22, fontWeight: 500, letterSpacing: -0.6,
        fontFamily: mono ? '"Geist Mono", monospace' : 'inherit',
        fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      {sub && <div style={{ color: T.textDim, fontSize: 12.5, marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

// Animation keyframes injected once
const BS_GlobalCSS = () => (
  <style>{`
    @keyframes bsPulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%      { opacity: 0.35; transform: scale(1.35); }
    }
    @keyframes bsFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes bsSlideIn {
      from { opacity: 0; transform: translateX(8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes bsShimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .bs-page {
      animation: bsFadeIn 0.28s cubic-bezier(.22,1,.36,1);
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .bs-row:hover { background: #f7f7f2 !important; }
    .bs-card-hover {
      transition: transform .15s ease, box-shadow .15s ease;
    }
    .bs-card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px -8px rgba(17,18,22,0.14), 0 12px 32px -12px rgba(17,18,22,0.15);
    }
    .bs-bar {
      transition: width .5s cubic-bezier(.22,1,.36,1);
    }
    .bs-chart-bar {
      transform-origin: bottom;
      animation: bsBarIn 0.6s cubic-bezier(.22,1,.36,1) both;
    }
    @keyframes bsBarIn {
      from { transform: scaleY(0); opacity: 0; }
      to   { transform: scaleY(1); opacity: 1; }
    }
    .bs-skeleton {
      background: linear-gradient(90deg, #f0f0ea 0%, #f7f7f2 50%, #f0f0ea 100%);
      background-size: 200% 100%;
      animation: bsShimmer 1.2s linear infinite;
    }
  `}</style>
);

Object.assign(window, {
  BS_SecondaryTopBar, BS_Button, BS_Pill, BS_PageShell, BS_PageBody,
  BS_MetricCard, BS_GlobalCSS,
});

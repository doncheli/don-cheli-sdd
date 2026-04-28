// B Studio — Placeholders simples para secciones que no diseñamos todavía

const BS_Placeholder = ({ dens, title, sub, icon, onNav, scenario }) => {
  const T = bStudioTokens(dens);
  return (
    <div className="bs-page">
      <BS_SecondaryTopBar dens={dens} title={title} sub={sub} onNav={onNav} />
      <BS_PageBody>
        <div style={{
          background: T.panel, borderRadius: 14, boxShadow: T.shadow,
          padding: '60px 40px', textAlign: 'center', maxWidth: 600, margin: '40px auto',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14, margin: '0 auto 20px',
            background: T.bgAlt, display: 'grid', placeItems: 'center',
            fontSize: 20, color: T.textDim,
          }}>{icon}</div>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8, letterSpacing: -0.3 }}>
            Esta sección todavía no está diseñada
          </div>
          <div style={{ fontSize: 13.5, color: T.textDim, lineHeight: 1.55, marginBottom: 24 }}>
            Solo exploramos Ahora, Proyectos, Historial, Gastos y Arsenal por ahora.
          </div>
          <BS_Button onClick={() => onNav && onNav('ahora')} primary>Volver a Ahora</BS_Button>
        </div>
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_Placeholder });

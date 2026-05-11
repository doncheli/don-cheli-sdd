// B Studio — Configuración del Studio (reemplaza el placeholder)
// Ajustes globales: General, Cuenta, Atajos, Integraciones, Privacidad.

const BS_StudioSettings = ({ dens, onNav }) => {
  const T = bStudioTokens(dens);
  const [section, setSection] = React.useState('general');

  // Local state — settings persisten solo en sesión (prototipo)
  const [language, setLanguage] = React.useState('es-co');
  const [theme, setTheme] = React.useState('light');
  const [density, setDensity] = React.useState('comfy');
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const [defaultEditor, setDefaultEditor] = React.useState('claude-code');
  const [defaultModel, setDefaultModel] = React.useState('sonnet-4.5');
  const [monthlyBudget, setMonthlyBudget] = React.useState(100);
  const [telemetry, setTelemetry] = React.useState(true);
  const [emailNotifs, setEmailNotifs] = React.useState(false);
  const [autoUpdates, setAutoUpdates] = React.useState(true);

  const sections = [
    { id: 'general',       label: 'General',       icon: 'settings' },
    { id: 'cuenta',        label: 'Cuenta',         icon: 'user' },
    { id: 'editores',      label: 'Editores de IA', icon: 'code' },
    { id: 'presupuesto',   label: 'Presupuesto',    icon: 'dollarSign' },
    { id: 'atajos',        label: 'Atajos',         icon: 'terminal' },
    { id: 'avisos',        label: 'Avisos',         icon: 'eye' },
    { id: 'privacidad',    label: 'Privacidad',     icon: 'badgeCheck' },
    { id: 'avanzado',      label: 'Avanzado',       icon: 'toolbox' },
  ];

  // Componentes internos compartidos
  const Card = ({ title, sub, children }) => (
    <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: T.text }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: T.textDim, marginTop: 3, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  );

  const Row = ({ label, hint, control }) => (
    <div style={{
      display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 16,
      padding: '14px 18px', alignItems: 'center',
      borderBottom: `1px solid ${T.borderSoft}`,
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{label}</div>
        {hint && <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 3, lineHeight: 1.5 }}>{hint}</div>}
      </div>
      <div>{control}</div>
    </div>
  );

  const Seg = ({ value, onChange, options }) => (
    <div style={{ display: 'flex', gap: 3, background: T.bgAlt, padding: 3, borderRadius: 8 }}>
      {options.map(o => (
        <button key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            border: 'none',
            background: value === o.value ? T.panel : 'transparent',
            boxShadow: value === o.value ? T.shadow : 'none',
            color: value === o.value ? T.text : T.textDim,
            padding: '6px 11px', borderRadius: 5,
            fontFamily: 'inherit', fontSize: 12,
            fontWeight: value === o.value ? 500 : 400,
            cursor: 'pointer',
          }}>
          {o.label}
        </button>
      ))}
    </div>
  );

  const Toggle = ({ on, onChange }) => (
    <span onClick={() => onChange(!on)} style={{
      width: 36, height: 20, borderRadius: 999,
      background: on ? T.success : T.bgAlt,
      border: `1px solid ${on ? T.success : T.border}`,
      cursor: 'pointer', position: 'relative',
      transition: 'background .15s ease, border-color .15s ease',
      display: 'inline-block',
    }}>
      <span style={{
        position: 'absolute', top: 1, left: on ? 17 : 1,
        width: 16, height: 16, borderRadius: '50%',
        background: T.panel, boxShadow: '0 1px 2px rgba(17,18,22,0.18)',
        transition: 'left .15s cubic-bezier(.22,1,.36,1)',
      }} />
    </span>
  );

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Configuración"
        sub="Ajustes globales del Studio. Cada proyecto puede sobrescribirlos desde su pestaña Configuración."
        onNav={onNav}
      />

      <div style={{
        flex: 1, minHeight: 0, overflow: 'hidden',
        display: 'grid', gridTemplateColumns: '220px minmax(0, 1fr)', gap: 0,
      }}>

        {/* Sub-sidebar de secciones */}
        <aside style={{
          background: T.bg, borderRight: `1px solid ${T.border}`,
          padding: '18px 10px', overflowY: 'auto',
          display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          {sections.map(s => {
            const active = s.id === section;
            return (
              <div key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  padding: '8px 12px', borderRadius: 7,
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: active ? T.panel : 'transparent',
                  boxShadow: active ? T.shadow : 'none',
                  color: active ? T.text : T.textDim,
                  fontWeight: active ? 500 : 400,
                  cursor: 'pointer', fontSize: 13,
                  transition: 'background .12s ease, color .12s ease',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = T.borderSoft; e.currentTarget.style.color = T.text; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textDim; } }}
              >
                <span style={{ display: 'inline-flex', color: active ? T.text : T.textFaint }}>
                  <BS_Icon name={s.icon} size={14} />
                </span>
                {s.label}
              </div>
            );
          })}
        </aside>

        {/* Contenido */}
        <div style={{ overflowY: 'auto', padding: '24px 32px 36px' }}>
          <div key={section} style={{
            maxWidth: 760,
            display: 'flex', flexDirection: 'column', gap: 16,
            animation: `bsFadeIn 0.24s cubic-bezier(.22,1,.36,1) both`,
          }}>

            {section === 'general' && (
              <>
                <Card title="Idioma y apariencia" sub="Estos ajustes afectan solo a este Studio, no a tu editor de IA.">
                  <Row label="Idioma" hint="El copy de toda la interfaz, los mensajes y los registros."
                    control={
                      <Seg value={language} onChange={setLanguage} options={[
                        { value: 'es-co', label: 'Español (CO)' },
                        { value: 'es',    label: 'Español neutro' },
                        { value: 'en',    label: 'English' },
                        { value: 'pt',    label: 'Português' },
                      ]} />
                    } />
                  <Row label="Tema" hint="Por ahora solo claro está disponible. El oscuro llega en una próxima versión."
                    control={
                      <Seg value={theme} onChange={setTheme} options={[
                        { value: 'light',  label: 'Claro' },
                        { value: 'dark',   label: 'Oscuro' },
                        { value: 'system', label: 'Sistema' },
                      ]} />
                    } />
                  <Row label="Densidad" hint="Cuánta información cabe en pantalla. La densa es más compacta."
                    control={
                      <Seg value={density} onChange={setDensity} options={[
                        { value: 'comfy',   label: 'Cómoda' },
                        { value: 'compact', label: 'Densa' },
                      ]} />
                    } />
                </Card>

                <Card title="Accesibilidad">
                  <Row label="Reducir movimiento"
                    hint="Apaga animaciones decorativas. Las transiciones funcionales se simplifican a fade."
                    control={<Toggle on={reducedMotion} onChange={setReducedMotion} />} />
                </Card>
              </>
            )}

            {section === 'cuenta' && (
              <Card title="Tu cuenta" sub="Información que aparece en los registros y en el chip arriba a la derecha.">
                <Row label="Nombre"
                  hint="Aparece en los commits que Don Cheli hace en tu nombre."
                  control={
                    <input defaultValue="Santiago Carrillo" style={{
                      padding: '8px 12px', borderRadius: 7, border: `1px solid ${T.border}`,
                      background: T.panel, fontFamily: 'inherit', fontSize: 13, width: 240, color: T.text, outline: 'none',
                    }} />
                  } />
                <Row label="Email" hint="Se usa para asociar tu cuenta y para avisos críticos."
                  control={
                    <input type="email" defaultValue="santiago@example.com" style={{
                      padding: '8px 12px', borderRadius: 7, border: `1px solid ${T.border}`,
                      background: T.panel, fontFamily: 'inherit', fontSize: 13, width: 240, color: T.text, outline: 'none',
                    }} />
                  } />
                <Row label="Plan"
                  hint="Equipo · vence el 15 de mayo de 2026"
                  control={<BS_Button>Administrar plan</BS_Button>} />
              </Card>
            )}

            {section === 'editores' && (
              <>
                <Card title="Editor de IA por defecto" sub="Don Cheli funciona con cualquiera, pero usa este por defecto para proyectos nuevos.">
                  <Row label="Editor"
                    hint="Si quieres cambiarlo solo para un proyecto, hazlo desde su pestaña Configuración."
                    control={
                      <Seg value={defaultEditor} onChange={setDefaultEditor} options={[
                        { value: 'claude-code', label: 'Claude Code' },
                        { value: 'cursor',      label: 'Cursor' },
                        { value: 'opencode',    label: 'OpenCode' },
                        { value: 'gemini',      label: 'Gemini' },
                      ]} />
                    } />
                  <Row label="Modelo por defecto" hint="Don Cheli puede cambiar de modelo según la fase. Este es el preferido."
                    control={
                      <Seg value={defaultModel} onChange={setDefaultModel} options={[
                        { value: 'opus-4.5',    label: 'Opus 4.5' },
                        { value: 'sonnet-4.5',  label: 'Sonnet 4.5' },
                        { value: 'haiku-4',     label: 'Haiku 4' },
                      ]} />
                    } />
                </Card>

                <Card title="Editores detectados" sub="Lo que Don Cheli encontró instalado en tu equipo.">
                  {[
                    { name: 'Claude Code', sub: 'v0.8.2 · 93 comandos /dc:* registrados', status: 'connected' },
                    { name: 'Cursor',      sub: '.cursorrules detectado en 3 proyectos',  status: 'connected' },
                    { name: 'OpenCode',    sub: 'No instalado',                            status: 'missing'  },
                    { name: 'Gemini (Antigravity)', sub: 'GEMINI.md detectado',           status: 'connected' },
                  ].map((e, i) => (
                    <div key={e.name} style={{
                      display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto auto', gap: 14,
                      padding: '12px 18px', alignItems: 'center',
                      borderBottom: i < 3 ? `1px solid ${T.borderSoft}` : 'none',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{e.name}</div>
                        <div style={{ fontSize: 11.5, color: T.textDim, marginTop: 2 }}>{e.sub}</div>
                      </div>
                      <BS_Pill tone={e.status === 'connected' ? 'active' : 'paused'} dot={e.status === 'connected'}>
                        {e.status === 'connected' ? 'Conectado' : 'Sin instalar'}
                      </BS_Pill>
                      <BS_Button size="sm">{e.status === 'connected' ? 'Reconectar' : 'Instalar'}</BS_Button>
                    </div>
                  ))}
                </Card>
              </>
            )}

            {section === 'presupuesto' && (
              <Card title="Presupuesto mensual" sub="Tope global de gasto. Cada proyecto puede tener su propio sub-presupuesto.">
                <Row label="Tope del mes"
                  hint="Cuando llegas al 80% Don Cheli te avisa. Al 100%, sigue la política que definas abajo."
                  control={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: T.textDim, fontSize: 13 }}>$</span>
                      <input type="number" value={monthlyBudget}
                        onChange={(e) => setMonthlyBudget(parseInt(e.target.value, 10) || 0)}
                        style={{
                          padding: '8px 12px', borderRadius: 7, border: `1px solid ${T.border}`,
                          background: T.panel, fontFamily: '"Geist Mono", monospace', fontSize: 13,
                          width: 100, color: T.text, outline: 'none', textAlign: 'right',
                        }} />
                      <span style={{ color: T.textDim, fontSize: 13 }}>USD</span>
                    </div>
                  } />
                <Row label="Si paso del 80%"
                  hint="Aviso suave para empezar a moderar."
                  control={
                    <Seg value="warn" onChange={() => {}} options={[
                      { value: 'warn', label: 'Avisarme' },
                      { value: 'mute', label: 'No avisar' },
                    ]} />
                  } />
                <Row label="Si paso del 100%"
                  hint="Comportamiento por defecto cuando ya gastaste lo presupuestado."
                  control={
                    <Seg value="confirm" onChange={() => {}} options={[
                      { value: 'stop',    label: 'Detener todo' },
                      { value: 'confirm', label: 'Preguntar' },
                      { value: 'warn',    label: 'Solo avisar' },
                    ]} />
                  } />
              </Card>
            )}

            {section === 'atajos' && (
              <Card title="Atajos de teclado" sub="Los más usados. La lista completa está en la Guía.">
                {[
                  { keys: ['⌘', 'K'],     desc: 'Abrir búsqueda rápida' },
                  { keys: ['⌘', 'N'],     desc: 'Empezar un proyecto nuevo' },
                  { keys: ['⌘', '1-7'],   desc: 'Saltar a una sección del sidebar' },
                  { keys: ['⌘', 'Enter'], desc: 'Aprobar el gate activo' },
                  { keys: ['⌘', '.'],     desc: 'Pausar el trabajo en marcha' },
                  { keys: ['Esc'],        desc: 'Cerrar modales y dropdowns' },
                  { keys: ['?'],          desc: 'Mostrar todos los atajos' },
                ].map((s, i, arr) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12,
                    padding: '11px 18px', alignItems: 'center',
                    borderBottom: i < arr.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                  }}>
                    <div style={{ fontSize: 13, color: T.text }}>{s.desc}</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {s.keys.map((k, j) => (
                        <kbd key={j} style={{
                          padding: '3px 8px', borderRadius: 5,
                          background: T.bgAlt, color: T.text,
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: 11, fontWeight: 500,
                          border: `1px solid ${T.border}`,
                        }}>{k}</kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {section === 'avisos' && (
              <Card title="Cómo te avisamos" sub="Los avisos críticos (gate fallado, error bloqueante) siempre se muestran en el chip del header.">
                <Row label="Email"
                  hint="Solo cuando un trabajo termina o cuando algo grave pasa mientras no estás aquí."
                  control={<Toggle on={emailNotifs} onChange={setEmailNotifs} />} />
                <Row label="Notificación del sistema"
                  hint="Aparece en la esquina de tu pantalla aunque el Studio no esté en foco."
                  control={<Toggle on={true} onChange={() => {}} />} />
                <Row label="Sonido"
                  hint="Un click suave cuando termina un trabajo o se aprueba un gate."
                  control={<Toggle on={false} onChange={() => {}} />} />
              </Card>
            )}

            {section === 'privacidad' && (
              <>
                <Card title="Telemetría" sub="Datos de uso anónimos que nos ayudan a saber qué mejorar.">
                  <Row label="Compartir uso anónimo"
                    hint="Nunca enviamos código, contenido de archivos ni prompts. Solo eventos del Studio."
                    control={<Toggle on={telemetry} onChange={setTelemetry} />} />
                  <Row label="Compartir errores"
                    hint="Si el Studio peta, nos llega un reporte sin tus datos personales."
                    control={<Toggle on={true} onChange={() => {}} />} />
                </Card>

                <Card title="Datos">
                  <Row label="Exportar todo lo mío"
                    hint="Un .zip con tus proyectos, configuración, registros e historial."
                    control={<BS_Button>Generar exportación</BS_Button>} />
                  <Row label="Borrar mi cuenta"
                    hint="Acción definitiva. Se borran los proyectos guardados, el historial y los registros."
                    control={
                      <button style={{
                        padding: '7px 14px', borderRadius: 7,
                        background: 'transparent', color: 'oklch(55% 0.18 25)',
                        border: `1px solid oklch(55% 0.18 25)`, fontFamily: 'inherit', fontSize: 12.5,
                        fontWeight: 500, cursor: 'pointer',
                      }}>Borrar cuenta</button>
                    } />
                </Card>
              </>
            )}

            {section === 'avanzado' && (
              <>
                <Card title="Actualizaciones">
                  <Row label="Auto-actualizar Don Cheli"
                    hint="Las versiones de seguridad siempre se aplican; las funcionalidades solo si tú aceptas."
                    control={<Toggle on={autoUpdates} onChange={setAutoUpdates} />} />
                  <Row label="Canal"
                    hint="Beta recibe cambios antes; estable es lo recomendado."
                    control={
                      <Seg value="stable" onChange={() => {}} options={[
                        { value: 'stable', label: 'Estable' },
                        { value: 'beta',   label: 'Beta' },
                      ]} />
                    } />
                </Card>

                <Card title="Zona técnica" sub="Solo para usuarios avanzados. Si dudas, no lo toques.">
                  <Row label="Carpeta de Don Cheli"
                    hint="Donde vive el framework en tu equipo."
                    control={
                      <span style={{
                        padding: '6px 10px', background: T.bgAlt, borderRadius: 6,
                        fontFamily: '"Geist Mono", monospace', fontSize: 11.5, color: T.textDim,
                      }}>~/.don-cheli</span>
                    } />
                  <Row label="Logs del Studio"
                    hint="Archivos de diagnóstico que puedes mandarnos si algo va mal."
                    control={<BS_Button>Abrir carpeta de logs</BS_Button>} />
                  <Row label="Reiniciar caché"
                    hint="Limpia la caché local. No borra proyectos ni configuración."
                    control={<BS_Button>Limpiar caché</BS_Button>} />
                </Card>
              </>
            )}

            {/* Save bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', borderRadius: 12,
              background: T.bgAlt, border: `1px solid ${T.border}`,
              fontSize: 12.5, color: T.textDim,
            }}>
              <span>Los cambios se guardan automáticamente. No hace falta confirmar.</span>
              <BS_Button>Restablecer esta sección</BS_Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BS_StudioSettings });

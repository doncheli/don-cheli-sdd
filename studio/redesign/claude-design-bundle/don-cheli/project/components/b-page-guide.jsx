// B Studio — Guía: manual + referencia. Reemplaza el placeholder anterior.

const B_GUIDE_SECTIONS = [
  {
    id: 'inicio',
    label: 'Empezar aquí',
    title: 'Bienvenido a Don Cheli',
    blocks: [
      { kind: 'p', text: 'Don Cheli es una metodología y un framework que te acompaña a construir software paso a paso, con la ayuda de la inteligencia artificial. Esta Guía es la referencia rápida: ábrela cuando necesites recordar algo o aprender algo nuevo.' },
      { kind: 'h2', text: '¿Qué hace Don Cheli?' },
      { kind: 'p', text: 'Toma una idea (un proyecto que tienes en la cabeza, una tarea que quieres resolver) y la convierte en código siguiendo un proceso ordenado. En vez de improvisar, sigue siempre los mismos siete pasos.' },
      { kind: 'h2', text: '¿Quién está detrás del trabajo?' },
      { kind: 'p', text: 'Tú. Don Cheli no decide solo: te pregunta cuando hay duda, te avisa cuando algo se desvía, y se detiene si el costo se sale de lo previsto. Tú apruebas, pausas y diriges.' },
      { kind: 'callout', tone: 'success', title: 'Atajo', text: '¿Te quieres lanzar ya? Cierra esta guía, vuelve a Ahora, pulsa "Empezar algo nuevo" y elige una carpeta. Don Cheli te lleva de la mano.' },
      { kind: 'h2', text: 'Lo que sigue' },
      { kind: 'p', text: 'Si quieres una vista completa en dos minutos, abre el recorrido inicial. Si prefieres profundizar un tema en particular, usa el menú lateral de esta guía.' },
      { kind: 'cta', label: 'Volver a ver el recorrido inicial', target: 'onboarding' },
    ],
  },
  {
    id: 'modo-trabajo',
    label: 'Cómo trabaja Don Cheli',
    title: 'Tres lugares se complementan',
    blocks: [
      { kind: 'p', text: 'Don Cheli no es una herramienta separada. Es una metodología que vive dentro de las herramientas que ya usas. Para aprovecharlo al máximo se combinan tres lugares.' },
      { kind: 'h2', text: '1. Tu editor con IA' },
      { kind: 'p', text: 'Es donde de verdad se hace el trabajo. Le pides cosas en lenguaje natural ("especifica esto", "planifica esto") o usas comandos como /dc:especificar, /dc:planificar. Don Cheli funciona con los principales editores con IA del mercado: Claude Code, Cursor, OpenCode, Gemini (Antigravity), Codex, Qwen, Amp y Windsurf.' },
      { kind: 'h2', text: '2. Don Cheli Studio' },
      { kind: 'p', text: 'Esta torre de control visual. Aquí ves qué está pasando en vivo, los costos, los archivos generados, el historial. Acompaña a tu editor de IA, no lo reemplaza.' },
      { kind: 'h2', text: '3. Terminal' },
      { kind: 'p', text: 'Solo para administrar: instalar el framework, actualizarlo, abrir el Studio. No es donde se hace el trabajo real.' },
      { kind: 'callout', tone: 'neutral', title: 'Importante', text: 'La metodología es la misma con cualquier editor. Solo cambia cómo se invocan los comandos: /dc:* en Claude Code, /doncheli-* en OpenCode, .cursorrules en Cursor, GEMINI.md en Antigravity, AGENTS.md en Codex/Qwen.' },
    ],
  },
  {
    id: 'organizacion',
    label: 'Cómo está organizado',
    title: 'Tres niveles, de un vistazo al detalle',
    blocks: [
      { kind: 'p', text: 'El dashboard se organiza en tres niveles, de la mirada superficial al detalle profundo.' },
      { kind: 'h2', text: '1. De un vistazo' },
      { kind: 'p', text: 'Es la barra superior, siempre visible. Te dice si algo requiere tu atención sin tener que entrar a ningún lado: trabajos en marcha, avisos, gasto del mes, trabajos hoy.' },
      { kind: 'h2', text: '2. Trabajar' },
      { kind: 'p', text: 'Las cuatro secciones principales: Ahora (qué está pasando ahora mismo), Proyectos (todos tus proyectos), Historial (trabajos anteriores), Gastos (cuánto has invertido).' },
      { kind: 'h2', text: '3. Consultar' },
      { kind: 'p', text: 'Referencia: Arsenal (todo lo que Don Cheli sabe hacer), Guía (este manual), Configuración. La abres de vez en cuando.' },
      { kind: 'callout', tone: 'neutral', title: 'Idea clave', text: 'Los avisos te avisan; las pantallas te ayudan a investigar. Son dos cosas distintas y no deben mezclarse.' },
    ],
  },
  {
    id: 'pasos',
    label: 'Los 7 pasos',
    title: 'Cada trabajo sigue siempre estos siete pasos',
    blocks: [
      { kind: 'p', text: 'Don Cheli es opinionado. Cada trabajo sigue siempre la misma secuencia. No te deja saltar pasos, pero tú decides cuándo arrancar y cuándo pausar.' },
      { kind: 'steps', items: [
        { n: 1, label: 'Especificar', desc: 'Qué se va a construir y para quién. Producto que escribe Don Cheli en spec.md.' },
        { n: 2, label: 'Aclarar',     desc: 'Don Cheli te hace preguntas para resolver ambigüedades. Las respuestas van a clarify.md.' },
        { n: 3, label: 'Planificar',  desc: 'Arquitectura y decisiones técnicas. plan.md con los pasos del trabajo.' },
        { n: 4, label: 'Diseñar',     desc: 'Wireframes, copy, tokens. Genera archivos en design/. Requiere tu aprobación.' },
        { n: 5, label: 'Desglosar',   desc: 'Convierte el plan en tareas pequeñas. tasks.md con la lista.' },
        { n: 6, label: 'Construir',   desc: 'El código real. Todo en una copia aislada de tu carpeta (git worktree).' },
        { n: 7, label: 'Revisar',     desc: 'Validación final con tests, controles de calidad y aprobación.' },
      ]},
      { kind: 'callout', tone: 'success', title: 'Tu código original está seguro', text: 'Don Cheli trabaja sobre una copia de tu carpeta. Tu código original no se modifica hasta que pasen todos los controles de calidad y tú lo apruebes.' },
    ],
  },
  {
    id: 'reglas',
    label: 'Reglas obligatorias',
    title: 'Las leyes de hierro de Don Cheli',
    blocks: [
      { kind: 'p', text: 'Don Cheli sigue tres reglas no negociables. Te las muestra en cada trabajo y se asegura de cumplirlas.' },
      { kind: 'h2', text: '1. TDD: las pruebas primero' },
      { kind: 'p', text: 'Todo código de producción tiene pruebas automáticas. Don Cheli las escribe o las pide antes de cerrar un trabajo.' },
      { kind: 'h2', text: '2. Causa raíz antes que parche' },
      { kind: 'p', text: 'Si algo falla, primero se busca por qué. Las soluciones rápidas que solo enmascaran el problema están prohibidas.' },
      { kind: 'h2', text: '3. Evidencia antes de afirmaciones' },
      { kind: 'p', text: 'Don Cheli no dice "ya quedó listo" sin haberlo verificado. Cada paso necesita evidencia: tests pasando, archivos creados, controles de calidad superados.' },
      { kind: 'callout', tone: 'warn', title: 'Reglas de desviación', text: 'Si Don Cheli detecta que algo se sale del plan, sigue una de cinco reglas según la magnitud del desvío. Lo configuras por proyecto en la pestaña Configuración.' },
    ],
  },
  {
    id: 'mesas',
    label: 'Mesa Redonda y Técnica',
    title: 'Paneles de expertos virtuales',
    blocks: [
      { kind: 'p', text: 'Antes de tomar decisiones difíciles, puedes convocar un panel de expertos virtuales para discutir el enfoque. Hay dos formatos.' },
      { kind: 'h2', text: 'Mesa Redonda — exploratoria' },
      { kind: 'p', text: 'Discusión multi-perspectiva: CPO, Arquitecto, UX, Negocio, QA, Seguridad y DevOps. Útil para alinear producto y técnica al inicio de un proyecto. Comando: /dc:mesa-redonda. Costo aproximado: $0.40, dos minutos.' },
      { kind: 'h2', text: 'Mesa Técnica — implementación' },
      { kind: 'p', text: 'Panel de ingenieros senior (más de 15 años): Tech Lead, Arquitecto, Backend, Frontend. Decisiones de stack, patrones, trade-offs técnicos. Comando: /dc:mesa-tecnica. Costo aproximado: $0.60, tres minutos.' },
      { kind: 'h2', text: '¿Cuándo usar cuál?' },
      { kind: 'p', text: 'Mesa Redonda al principio de un proyecto, cuando la decisión afecta al producto y al negocio. Mesa Técnica antes de construir, cuando la decisión es de implementación pura.' },
    ],
  },
  {
    id: 'faq',
    label: 'Preguntas frecuentes',
    title: 'Preguntas frecuentes',
    blocks: [
      { kind: 'h2', text: '¿Don Cheli puede dañar mi código?' },
      { kind: 'p', text: 'No. Cada trabajo se hace sobre una copia aislada de tu carpeta (un git worktree). Tu carpeta original nunca se toca hasta que pasen todos los controles de calidad y tú apruebes.' },
      { kind: 'h2', text: '¿Cuánto cuesta un trabajo?' },
      { kind: 'p', text: 'Depende del tamaño del proyecto y los modelos que uses. La pantalla Gastos te muestra el desglose. Puedes ver una estimación antes de empezar usando el agente "Estimador" en la pestaña Acciones del proyecto.' },
      { kind: 'h2', text: '¿Puedo usar varios editores de IA a la vez?' },
      { kind: 'p', text: 'Sí. Cada proyecto puede tener su propio editor configurado. El chip al lado de tu cuenta (arriba a la derecha) te dice cuál usa el proyecto activo.' },
      { kind: 'h2', text: '¿Puedo pausar un trabajo y volver después?' },
      { kind: 'p', text: 'Sí. El botón "Pausar" en la pantalla del trabajo lo detiene preservando el progreso. Cuando vuelvas, retoma desde donde quedó.' },
    ],
  },
  {
    id: 'glosario',
    label: 'Glosario',
    title: 'Glosario',
    blocks: [
      { kind: 'glossary', items: [
        { term: 'SDD', def: 'Desarrollo Dirigido por Especificaciones (Specification-Driven Development). La metodología en la que se basa Don Cheli.' },
        { term: 'Trabajo', def: 'Una ejecución completa del flujo de 7 pasos sobre un proyecto. Tiene un número (#1, #2…), una duración y un costo.' },
        { term: 'Proyecto', def: 'Una carpeta de código con la estructura de Don Cheli (una subcarpeta .dc/). Puede tener muchos trabajos asociados.' },
        { term: 'Gate (control de calidad)', def: 'Verificación automática que Don Cheli ejecuta antes de pasar al siguiente paso. Hay tres: Tests, Diseño aprobado, Aprobación final.' },
        { term: 'Worktree', def: 'Copia aislada de tu carpeta donde Don Cheli hace los cambios. Si algo falla, se descarta sin tocar tu original.' },
        { term: 'Habilidad', def: 'Capacidad puntual que Don Cheli puede invocar (ej. detectar relleno IA, generar mockups). Hay 57 habilidades en el repo.' },
        { term: 'Comando', def: 'Atajo escrito (ej. /dc:especificar) que dispara una acción. Hay 83 comandos disponibles.' },
        { term: 'Agente', def: 'Ayudante especializado que Don Cheli llama internamente para tareas concretas (ej. el agente "Estimador").' },
      ]},
    ],
  },
];

const BS_Guide = ({ dens, showSidebar, onNav, scenario }) => {
  const T = bStudioTokens(dens);
  const [activeId, setActiveId] = React.useState('inicio');
  const cur = B_GUIDE_SECTIONS.find(s => s.id === activeId) || B_GUIDE_SECTIONS[0];

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title="Guía"
        sub="Manual y referencia rápida"
        onNav={onNav}
      />

      {/* Sub-nav: chips de secciones */}
      <div style={{
        padding: '12px 32px', borderBottom: `1px solid ${T.border}`,
        background: T.bg, display: 'flex', gap: 6, flexWrap: 'wrap',
        overflowX: 'auto',
      }}>
        {B_GUIDE_SECTIONS.map(s => {
          const on = s.id === activeId;
          return (
            <span
              key={s.id}
              onClick={() => setActiveId(s.id)}
              style={{
                padding: '6px 12px', borderRadius: 999,
                background: on ? T.text : T.panel,
                color: on ? '#fff' : T.textDim,
                boxShadow: on ? 'none' : T.shadow,
                fontSize: 12, fontWeight: 500,
                cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'background .12s ease, color .12s ease',
              }}
            >{s.label}</span>
          );
        })}
      </div>

      <BS_PageBody padding="28px 32px 48px">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 32, maxWidth: 1080 }}>

          {/* Contenido */}
          <div key={activeId} style={{
            animation: `bsFadeIn 0.3s cubic-bezier(.22,1,.36,1) both`,
          }}>
            <div style={{
              fontSize: 30, fontWeight: 500, letterSpacing: -0.8,
              lineHeight: 1.15, marginBottom: 24,
            }}>{cur.title}</div>

            {cur.blocks.map((b, i) => {
              if (b.kind === 'p') {
                return (
                  <p key={i} style={{
                    fontSize: 14.5, lineHeight: 1.65, color: T.text,
                    margin: '0 0 16px', maxWidth: '70ch',
                  }}>{b.text}</p>
                );
              }
              if (b.kind === 'h2') {
                return (
                  <h2 key={i} style={{
                    fontSize: 18, fontWeight: 500, letterSpacing: -0.3,
                    margin: '24px 0 8px', color: T.text,
                  }}>{b.text}</h2>
                );
              }
              if (b.kind === 'callout') {
                const palette = b.tone === 'success'
                  ? { bg: T.successBg, border: T.success, fg: T.text }
                  : b.tone === 'warn'
                  ? { bg: T.warnBg, border: T.warn, fg: T.text }
                  : { bg: T.bgAlt, border: T.border, fg: T.text };
                return (
                  <div key={i} style={{
                    margin: '16px 0',
                    padding: '12px 14px', borderRadius: 10,
                    background: palette.bg,
                    border: `1px solid ${palette.border}`,
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: 13.5, color: T.textDim, lineHeight: 1.55 }}>
                      {b.text}
                    </div>
                  </div>
                );
              }
              if (b.kind === 'cta') {
                return (
                  <div key={i} style={{ margin: '20px 0' }}>
                    <button
                      onClick={() => onNav && onNav(b.target)}
                      style={{
                        padding: '9px 16px', borderRadius: 8,
                        background: T.text, color: '#fff', border: 'none',
                        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >▶ {b.label}</button>
                  </div>
                );
              }
              if (b.kind === 'steps') {
                return (
                  <div key={i} style={{
                    margin: '16px 0',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}>
                    {b.items.map((it, k) => (
                      <div key={k} style={{
                        display: 'grid', gridTemplateColumns: '36px 1fr', gap: 14,
                        padding: '12px 14px', borderRadius: 10,
                        background: T.panel, boxShadow: T.shadow,
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: T.bgAlt, color: T.textDim,
                          display: 'grid', placeItems: 'center',
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: 12, fontWeight: 600,
                        }}>{it.n}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{it.label}</div>
                          <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.55 }}>{it.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              if (b.kind === 'glossary') {
                return (
                  <div key={i} style={{
                    margin: '16px 0',
                    display: 'flex', flexDirection: 'column', gap: 14,
                  }}>
                    {b.items.map((it, k) => (
                      <div key={k} style={{
                        paddingTop: k === 0 ? 0 : 14,
                        borderTop: k === 0 ? 'none' : `1px solid ${T.borderSoft}`,
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{it.term}</div>
                        <div style={{ fontSize: 13.5, color: T.textDim, lineHeight: 1.55 }}>{it.def}</div>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Sidebar TOC */}
          <div style={{ position: 'sticky', top: 0 }}>
            <div style={{
              fontSize: 11, color: T.textFaint, fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
            }}>En esta sección</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {cur.blocks.filter(b => b.kind === 'h2').map((h, i) => (
                <span key={i} style={{
                  fontSize: 12.5, color: T.textDim, padding: '4px 8px',
                  borderRadius: 6, cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = T.text}
                onMouseLeave={(e) => e.currentTarget.style.color = T.textDim}
                >{h.text}</span>
              ))}
            </div>

            <div style={{
              marginTop: 24, padding: '14px',
              background: T.bgAlt, borderRadius: 10,
            }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>
                Relacionado
              </div>
              <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.6 }}>
                ¿Lo prefieres en video?<br />
                <span
                  onClick={() => onNav && onNav('onboarding')}
                  style={{
                    color: T.text, borderBottom: `1px solid ${T.text}`,
                    cursor: 'pointer', display: 'inline-block', marginTop: 4,
                  }}
                >Ver el recorrido inicial (2 min)</span>
              </div>
            </div>
          </div>
        </div>
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_Guide });

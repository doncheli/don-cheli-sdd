// B Studio — Pantalla Un Proyecto (detalle con pestañas)

// ─────────── Pestaña: Acciones ───────────
// Botones que disparan comandos del LLM al instante (no son configuración).
const BS_ActionButton = ({ T, label, desc, command, costo, tiempo, onClick }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left',
        background: T.panel, borderRadius: 12,
        boxShadow: hover
          ? '0 6px 14px -8px rgba(17,18,22,0.14), 0 12px 32px -12px rgba(17,18,22,0.15)'
          : T.shadow,
        padding: '14px 16px',
        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        transform: hover ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'transform .12s ease, box-shadow .12s ease',
        display: 'flex', flexDirection: 'column', gap: 6, minHeight: 110,
      }}
    >
      <div style={{ fontSize: 13.5, fontWeight: 500, color: T.text }}>{label}</div>
      <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>{desc}</div>
      <div style={{
        marginTop: 'auto', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 8,
        paddingTop: 8, borderTop: `1px solid ${T.borderSoft}`,
      }}>
        <span style={{
          fontFamily: '"Geist Mono", monospace', fontSize: 10.5,
          color: T.textFaint,
        }}>{command}</span>
        <span style={{
          fontFamily: '"Geist Mono", monospace', fontSize: 10.5,
          color: T.textDim, fontVariantNumeric: 'tabular-nums',
        }}>~${costo} · {tiempo}</span>
      </div>
    </button>
  );
};

const BS_ProjectActions = ({ T }) => {
  const groups = [
    {
      title: 'Consultas con expertos',
      desc: 'Convoca paneles virtuales para discutir un tema. Útil antes de tomar decisiones que cuesta deshacer.',
      items: [
        { label: 'Mesa Redonda',    desc: 'Discusión exploratoria con CPO, Arquitecto, UX, Negocio, QA, Seguridad y DevOps.', command: '/dc:mesa-redonda',    costo: '0.40', tiempo: '~2 min' },
        { label: 'Mesa Técnica',    desc: 'Panel de ingenieros senior (Tech Lead, Arquitecto, Backend, Frontend) para decisiones de implementación.', command: '/dc:mesa-tecnica', costo: '0.60', tiempo: '~3 min' },
        { label: 'Estimar costo y tiempo', desc: 'Pronostica cuánto te va a costar y cuánto va a tardar antes de empezar.', command: 'agente: estimador', costo: '0.10', tiempo: '~30 s' },
      ],
    },
    {
      title: 'Auditorías',
      desc: 'Revisión del estado actual del proyecto. Encuentran problemas antes de que crezcan.',
      items: [
        { label: 'Auditar seguridad',     desc: 'Busca vulnerabilidades, secretos expuestos y riesgos OWASP en el código de hoy.', command: '/dc:auditar-seguridad', costo: '0.30', tiempo: '~1 min' },
        { label: 'Revisar calidad actual', desc: 'Análisis del código tal como está, sin cambiarlo.', command: '/dc:revisar', costo: '0.35', tiempo: '~1 min' },
        { label: 'Detectar relleno IA',    desc: 'Identifica código de baja calidad típico de generación automática.', command: '/dc:slop-scan', costo: '0.20', tiempo: '~45 s' },
      ],
    },
    {
      title: 'Mantenimiento',
      desc: 'Tareas para que el proyecto siga sano con el tiempo.',
      items: [
        { label: 'Diagnóstico del proyecto', desc: 'Chequeo general: ¿algo está mal configurado o desactualizado?', command: '/dc:doctor', costo: '0.15', tiempo: '~30 s' },
        { label: 'Actualizar documentación', desc: 'Regenera la documentación a partir del código actual.', command: '/dc:documentacion-viva', costo: '0.50', tiempo: '~2 min' },
        { label: 'Volver a clarificar',      desc: 'Reabre el cuestionario de ambigüedades sobre los requisitos.', command: '/dc:clarificar', costo: '0.25', tiempo: '~1 min' },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: 1080 }}>
      <div style={{ fontSize: 12.5, color: T.textDim, lineHeight: 1.5, maxWidth: 640 }}>
        Cada botón le pide al asistente de IA que ejecute una tarea concreta sobre este proyecto.
        Se ejecutan al instante. El costo y el tiempo son estimaciones; podrás detener cualquier acción mientras corre.
      </div>
      {groups.map(g => (
        <div key={g.title}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 4 }}>{g.title}</div>
          <div style={{ fontSize: 12, color: T.textDim, marginBottom: 12, lineHeight: 1.5, maxWidth: 640 }}>{g.desc}</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          }}>
            {g.items.map(it => (
              <BS_ActionButton key={it.label} T={T} {...it} />
            ))}
          </div>
        </div>
      ))}
      <div style={{
        marginTop: 4, padding: '14px 16px',
        background: T.bgAlt, borderRadius: 12,
        fontSize: 12.5, color: T.textDim, lineHeight: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <span>
          Hay muchos más comandos disponibles (83 en total).
          Los nueve de aquí son los más usados; los demás los encuentras en el <strong>Arsenal</strong>.
        </span>
        <BS_Button>Abrir Arsenal →</BS_Button>
      </div>
    </div>
  );
};

// ─────────── Pestaña: Configuración ───────────
// Políticas y valores del proyecto. Lo que se decide aquí afecta cómo
// se comporta Don Cheli en el próximo trabajo (no dispara nada al instante).
const BS_FieldRow = ({ T, label, value, action = 'Cambiar' }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '180px 1fr auto', gap: 16,
    padding: '11px 16px', alignItems: 'center',
    borderBottom: `1px solid ${T.borderSoft}`,
  }}>
    <div style={{ color: T.textDim, fontSize: 12.5 }}>{label}</div>
    <div style={{ color: T.text, fontSize: 13, fontWeight: 500 }}>{value}</div>
    <span style={{ fontSize: 12, color: T.textDim, cursor: 'pointer' }}>{action}</span>
  </div>
);

const BS_RadioOption = ({ T, selected, label, desc, onClick }) => (
  <div onClick={onClick} style={{
    padding: '12px 14px', borderRadius: 10,
    background: selected ? T.successBg : T.panel,
    border: `1px solid ${selected ? T.success : T.border}`,
    cursor: 'pointer', display: 'flex', gap: 12,
    transition: 'border-color .12s ease, background .12s ease',
  }}>
    <span style={{
      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
      border: `1.5px solid ${selected ? T.success : T.textFaint}`,
      display: 'grid', placeItems: 'center', marginTop: 1,
    }}>
      {selected && <span style={{ width: 8, height: 8, borderRadius: '50%', background: T.success }} />}
    </span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13, fontWeight: 500, color: T.text, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 12, color: T.textDim, lineHeight: 1.5 }}>{desc}</div>
    </div>
  </div>
);

const BS_Toggle = ({ T, on, onChange }) => (
  <span
    onClick={onChange}
    style={{
      width: 36, height: 20, borderRadius: 999,
      background: on ? T.success : T.bgAlt,
      border: `1px solid ${on ? T.success : T.border}`,
      cursor: 'pointer', position: 'relative',
      transition: 'background .15s ease, border-color .15s ease',
      flexShrink: 0,
    }}
  >
    <span style={{
      position: 'absolute', top: 1, left: on ? 17 : 1,
      width: 16, height: 16, borderRadius: '50%',
      background: T.panel, boxShadow: '0 1px 2px rgba(17,18,22,0.18)',
      transition: 'left .15s cubic-bezier(.22,1,.36,1)',
    }} />
  </span>
);

const BS_ProjectSettings = ({ T, project }) => {
  const [desvio, setDesvio] = React.useState('preguntar');
  const [presupuesto, setPresupuesto] = React.useState('detener');
  const [pasos, setPasos] = React.useState({
    especificar: true, aclarar: true, planificar: true,
    disenar: true, desglosar: true, construir: true, revisar: true,
  });
  const [mesaRedonda, setMesaRedonda] = React.useState(true);
  const [mesaTecnica, setMesaTecnica] = React.useState(false);

  const toggleStep = (k) => setPasos(p => ({ ...p, [k]: !p[k] }));
  const stepLabels = {
    especificar: 'Especificar', aclarar: 'Aclarar', planificar: 'Planificar',
    disenar: 'Diseñar', desglosar: 'Desglosar', construir: 'Construir', revisar: 'Revisar',
  };

  const Card = ({ title, desc, children }) => (
    <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: T.text }}>{title}</div>
        {desc && <div style={{ fontSize: 12, color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>}
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 880 }}>
      <Card title="Básico" desc="Lo esencial del proyecto. Estos valores se aplican a partir del próximo trabajo.">
        <div>
          <BS_FieldRow T={T} label="Carpeta" value={`~/work/${project.id}`} />
          <BS_FieldRow T={T} label="Editor de IA" value={project.editor || 'Claude Code'} />
          <BS_FieldRow T={T} label="Modelos" value="Claude Sonnet 4.5 (principal) · Opus para mesas" />
          <BS_FieldRow T={T} label="Presupuesto por trabajo" value="$2.50" />
          <BS_FieldRow T={T} label="Idioma" value="Español (Colombia)" />
        </div>
      </Card>

      <Card
        title="Pasos activos"
        desc="Activa o desactiva pasos del flujo de Don Cheli. Útil cuando el proyecto no necesita alguno (por ejemplo, no diseñar si no hay interfaz)."
      >
        <div style={{ padding: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.keys(pasos).map((k, i) => (
            <span
              key={k}
              onClick={() => toggleStep(k)}
              style={{
                padding: '7px 12px', borderRadius: 999,
                background: pasos[k] ? T.successBg : T.bgAlt,
                border: `1px solid ${pasos[k] ? T.success : T.border}`,
                color: pasos[k] ? T.success : T.textDim,
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'background .12s ease, color .12s ease, border-color .12s ease',
              }}
            >
              <span style={{
                width: 14, height: 14, borderRadius: 4,
                border: `1px solid ${pasos[k] ? T.success : T.textFaint}`,
                background: pasos[k] ? T.success : 'transparent',
                color: '#fff', fontSize: 9, fontWeight: 600,
                display: 'grid', placeItems: 'center',
              }}>
                {pasos[k] ? '✓' : ''}
              </span>
              {i + 1}. {stepLabels[k]}
            </span>
          ))}
        </div>
      </Card>

      <Card
        title="Si Don Cheli detecta que algo se desvía del plan"
        desc="Durante un trabajo, si lo que se está construyendo no coincide con lo que se especificó, ¿cómo debe reaccionar?"
      >
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BS_RadioOption T={T} selected={desvio === 'auto'}
            onClick={() => setDesvio('auto')}
            label="Corregir solo y seguir"
            desc="Recomendado para bugs y omisiones obvias. No te interrumpe." />
          <BS_RadioOption T={T} selected={desvio === 'preguntar'}
            onClick={() => setDesvio('preguntar')}
            label="Preguntar antes de cada cambio importante"
            desc="Te avisa cuando hay un desvío que cambia el alcance o la arquitectura." />
          <BS_RadioOption T={T} selected={desvio === 'registrar'}
            onClick={() => setDesvio('registrar')}
            label="Solo registrar y seguir"
            desc="Don Cheli sigue trabajando pero deja anotado todo desvío para que lo revises después." />
        </div>
      </Card>

      <Card
        title="Si el trabajo excede el presupuesto"
        desc="Cuando el costo acumulado de un trabajo pasa del límite que definiste arriba."
      >
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <BS_RadioOption T={T} selected={presupuesto === 'detener'}
            onClick={() => setPresupuesto('detener')}
            label="Detener inmediatamente"
            desc="Para el trabajo y espera tu decisión. La opción más segura." />
          <BS_RadioOption T={T} selected={presupuesto === 'preguntar'}
            onClick={() => setPresupuesto('preguntar')}
            label="Avisar y preguntar"
            desc="Pausa y te muestra el costo proyectado para que decidas si seguir." />
          <BS_RadioOption T={T} selected={presupuesto === 'continuar'}
            onClick={() => setPresupuesto('continuar')}
            label="Continuar con alerta visible"
            desc="Sigue trabajando pero deja un aviso prominente. Solo cuando confías mucho en la estimación." />
        </div>
      </Card>

      <Card
        title="Validación previa con paneles de expertos"
        desc="Antes de ciertos pasos, Don Cheli puede convocar automáticamente un panel de expertos virtuales para discutir el enfoque. ¿Quieres invocarlos manualmente? Está en la pestaña Acciones."
      >
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'flex-start',
            padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`,
          }}>
            <BS_Toggle T={T} on={mesaRedonda} onChange={() => setMesaRedonda(v => !v)} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Mesa Redonda antes de planificar</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>
                Reúne CPO, Arquitecto, UX, Negocio, QA, Seguridad y DevOps. Útil al inicio para alinear producto y técnica.
              </div>
            </div>
            <span style={{
              fontSize: 11, color: T.textFaint, fontFamily: '"Geist Mono", monospace', whiteSpace: 'nowrap',
            }}>~$0.40 · 2 min</span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'flex-start',
            padding: '12px 14px', borderRadius: 10, border: `1px solid ${T.border}`,
          }}>
            <BS_Toggle T={T} on={mesaTecnica} onChange={() => setMesaTecnica(v => !v)} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Mesa Técnica antes de construir</div>
              <div style={{ fontSize: 12, color: T.textDim, marginTop: 4, lineHeight: 1.5 }}>
                Reúne ingenieros senior (+15 años): Tech Lead, Arquitecto, Backend, Frontend. Decisiones de stack, patrones y trade-offs.
              </div>
            </div>
            <span style={{
              fontSize: 11, color: T.textFaint, fontFamily: '"Geist Mono", monospace', whiteSpace: 'nowrap',
            }}>~$0.60 · 3 min</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// ─────────── Pantalla: Un Proyecto ───────────

const BS_ProjectDetail = ({ dens, showSidebar, onNav, projectId, scenario }) => {
  const T = bStudioTokens(dens);
  const p = B_PROJECTS.find(x => x.id === projectId) || B_PROJECTS[0];
  const [tab, setTab] = React.useState('resumen'); // resumen | trabajos | especificaciones | notas

  const statusTone = { active: 'active', done: 'done', paused: 'paused', pending: 'pending' };
  const statusLabel = { active: 'Trabajando ahora', done: 'Terminado', paused: 'Pausado', pending: 'Sin empezar' };

  const runs = B_HISTORY_RUNS.filter(r => r.project === projectId).slice(0, 6);
  const successRate = p.runs > 0 ? Math.round((p.success / p.runs) * 100) : 0;

  const tabs = [
    { id: 'resumen',          label: 'Resumen' },
    { id: 'trabajos',         label: 'Trabajos', count: p.runs },
    { id: 'acciones',         label: 'Acciones' },
    { id: 'configuracion',    label: 'Configuración' },
    { id: 'especificaciones', label: 'Especificación' },
    { id: 'notas',            label: 'Notas' },
  ];

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title={p.id}
        sub={`${p.editor} · ${statusLabel[p.status]} · Último uso ${p.lastUsed}`}
        breadcrumb={[{ label: 'Proyectos', to: 'proyectos' }, { label: p.id }]}
        onNav={onNav}
        actions={
          <>
            <BS_Button>Abrir en terminal</BS_Button>
            {p.status === 'active' ? (
              <BS_Button onClick={() => onNav && onNav('ahora')} primary>Ver en Ahora →</BS_Button>
            ) : (
              <BS_Button primary>+ Nuevo trabajo</BS_Button>
            )}
          </>
        }
      />

      {/* Tabs */}
      <div style={{
        padding: '0 32px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', gap: 2, background: T.bg,
      }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            border: 'none', background: 'transparent',
            padding: '12px 14px 10px', fontFamily: 'inherit',
            fontSize: 13, fontWeight: tab === t.id ? 500 : 400,
            color: tab === t.id ? T.text : T.textDim,
            borderBottom: `2px solid ${tab === t.id ? T.ink : 'transparent'}`,
            marginBottom: -1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 7,
            transition: 'color .12s ease',
          }}>
            {t.label}
            {t.count != null && (
              <span style={{
                fontSize: 11, color: T.textFaint, fontVariantNumeric: 'tabular-nums',
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <BS_PageBody>
        {tab === 'resumen' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* KPI row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              <BS_MetricCard dens={dens} label="ESTADO" value={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {p.status === 'active' && (
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: T.success, boxShadow: `0 0 0 4px ${T.successBg}` }} />
                  )}
                  <span style={{ fontSize: 18 }}>{statusLabel[p.status]}</span>
                </div>
              } sub={p.step ? `Paso actual: ${p.step}` : null} />
              <BS_MetricCard dens={dens} label="TRABAJOS TOTALES" value={p.runs} mono
                sub={`${p.success} exitosos`} />
              <BS_MetricCard dens={dens} label="ÉXITO" value={`${successRate}%`} mono
                sub={p.success === p.runs ? 'Todo salió bien' : `${p.runs - p.success} necesitaron retomar`}
                accent={successRate >= 90 ? T.success : null}
              />
              <BS_MetricCard dens={dens} label="GASTADO TOTAL" value={`$${p.cost.toFixed(2)}`} mono
                sub="Desde el primer trabajo" />
            </div>

            {/* Two-column: activity + info */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
              <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>Últimos trabajos</div>
                  <span onClick={() => setTab('trabajos')} style={{
                    fontSize: 12, color: T.textDim, cursor: 'pointer',
                  }}>Ver todos →</span>
                </div>
                {runs.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: T.textFaint, fontSize: 13 }}>
                    Este proyecto todavía no tiene trabajos guardados.
                  </div>
                ) : runs.map((r, i) => (
                  <div key={r.id} className="bs-row"
                    onClick={() => onNav && onNav('trabajo')}
                    style={{
                    padding: '12px 18px',
                    borderBottom: i < runs.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                    display: 'grid', gridTemplateColumns: '50px 1fr 90px 90px 70px',
                    alignItems: 'center', gap: 14, fontSize: 12.5, cursor: 'pointer',
                    transition: 'background .12s ease',
                  }}>
                    <span style={{ fontFamily: '"Geist Mono", monospace', color: T.textFaint, fontSize: 11 }}>
                      #{r.id}
                    </span>
                    <div>
                      <div style={{ color: T.text, fontWeight: 500, marginBottom: 2 }}>
                        Trabajo {r.result === 'success' ? 'completado' : r.result === 'running' ? 'en marcha' : r.result === 'error' ? 'con errores' : r.result === 'stopped' ? 'detenido' : 'pausado'}
                      </div>
                      <div style={{ color: T.textFaint, fontSize: 11 }}>
                        {r.stepsDone}/{r.totalSteps} pasos · {r.when}
                      </div>
                    </div>
                    <div>
                      <BS_Pill tone={{
                        success: 'active', running: 'active', error: 'error', stopped: 'paused', paused: 'paused',
                      }[r.result]}
                      dot={r.result === 'running'}>
                        {{ success:'Éxito', running:'En vivo', error:'Error', stopped:'Detenido', paused:'Pausado' }[r.result]}
                      </BS_Pill>
                    </div>
                    <span style={{ fontFamily: '"Geist Mono", monospace', color: T.textDim, fontSize: 11.5, fontVariantNumeric: 'tabular-nums' }}>
                      {r.duration}
                    </span>
                    <span style={{ fontFamily: '"Geist Mono", monospace', color: T.text, fontSize: 11.5, fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                      ${r.cost.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '16px 18px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12 }}>Carpeta</div>
                  <div style={{
                    padding: '8px 10px', background: T.bgAlt, borderRadius: 6,
                    fontFamily: '"Geist Mono", monospace', fontSize: 11.5, color: T.textDim,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>~/work/{p.id}</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 10, lineHeight: 1.5 }}>
                    Rama <span style={{ color: T.text, fontFamily: '"Geist Mono", monospace' }}>main</span><br/>
                    {p.runs} trabajos desde que empezó · sin cambios pendientes
                  </div>
                </div>

                <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '16px 18px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 12 }}>Herramientas activas</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12.5 }}>
                    {[
                      { label: 'Editor', value: p.editor },
                      { label: 'Modelo por defecto', value: 'Claude Sonnet 4.5' },
                      { label: 'Controles de calidad', value: '3 activos' },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: T.textDim }}>{r.label}</span>
                        <span style={{ color: T.text, fontWeight: 500 }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '16px 18px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 10 }}>Acciones</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {['Rebobinar a un punto anterior', 'Exportar documentación viva', 'Archivar proyecto'].map(a => (
                      <div key={a} style={{
                        padding: '8px 10px', borderRadius: 6, fontSize: 12.5,
                        color: T.textDim, cursor: 'pointer',
                      }} onMouseEnter={(e) => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.text; }}
                         onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textDim; }}>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'trabajos' && (
          <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 110px 100px 100px 90px',
              padding: '10px 20px', borderBottom: `1px solid ${T.border}`,
              fontSize: 10.5, color: T.textFaint, fontWeight: 500, letterSpacing: 0.4,
            }}>
              <div>#</div><div>RESULTADO</div><div>PASOS</div>
              <div style={{ textAlign: 'right' }}>DURACIÓN</div>
              <div style={{ textAlign: 'right' }}>COSTO</div>
              <div style={{ textAlign: 'right' }}>CUÁNDO</div>
            </div>
            {(runs.length ? runs : B_HISTORY_RUNS.slice(0, 4)).map((r, i) => (
              <div key={r.id} className="bs-row"
                onClick={() => onNav && onNav('trabajo')}
                style={{
                display: 'grid', gridTemplateColumns: '60px 1fr 110px 100px 100px 90px',
                padding: '11px 20px', fontSize: 12.5, alignItems: 'center',
                borderBottom: i < runs.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                transition: 'background .12s ease', cursor: 'pointer',
              }}>
                <span style={{ fontFamily: '"Geist Mono", monospace', color: T.textFaint }}>#{r.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BS_Pill tone={{ success: 'active', running: 'active', error: 'error', stopped: 'paused', paused: 'paused' }[r.result]}
                           dot={r.result === 'running'}>
                    {{ success:'Éxito', running:'En vivo', error:'Error', stopped:'Detenido', paused:'Pausado' }[r.result]}
                  </BS_Pill>
                </div>
                <span style={{ color: T.textDim, fontSize: 11.5 }}>{r.stepsDone}/{r.totalSteps}</span>
                <span style={{ textAlign: 'right', fontFamily: '"Geist Mono", monospace', color: T.textDim, fontVariantNumeric: 'tabular-nums' }}>{r.duration}</span>
                <span style={{ textAlign: 'right', fontFamily: '"Geist Mono", monospace', color: T.text, fontVariantNumeric: 'tabular-nums' }}>${r.cost.toFixed(2)}</span>
                <span style={{ textAlign: 'right', color: T.textDim, fontSize: 11.5 }}>{r.when}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'especificaciones' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {[
              { step: 'Especificación', file: 'spec.md',         lines: 48, status: 'ready', desc: 'Qué se va a construir y para quién' },
              { step: 'Aclaraciones',   file: 'clarify.md',      lines: 12, status: 'ready', desc: '7 preguntas respondidas' },
              { step: 'Plan',           file: 'plan.md',         lines: 24, status: 'ready', desc: 'Arquitectura y decisiones técnicas' },
              { step: 'Diseño',         file: 'design/',         lines: 6,  status: 'active', desc: '6 archivos, revisión en curso' },
              { step: 'Desglose',       file: 'tasks.md',        lines: 0,  status: 'pending', desc: 'Todavía no empezó' },
              { step: 'Construcción',   file: 'build.log',       lines: 0,  status: 'pending', desc: 'Todavía no empezó' },
            ].map((s, i) => (
              <div key={s.step} style={{
                background: T.panel, borderRadius: 12, boxShadow: T.shadow,
                padding: 16, cursor: 'pointer',
                opacity: s.status === 'pending' ? 0.6 : 1,
                transition: 'transform .15s ease',
              }} className="bs-card-hover">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6, background: T.bgAlt,
                    display: 'grid', placeItems: 'center',
                    fontFamily: '"Geist Mono", monospace', fontSize: 11, color: T.textDim,
                  }}>{i + 1}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, flex: 1 }}>{s.step}</div>
                  {s.status === 'active' && <BS_Pill tone="active" dot>En curso</BS_Pill>}
                  {s.status === 'ready' && <BS_Pill tone="done">Listo</BS_Pill>}
                </div>
                <div style={{ fontSize: 12, color: T.textDim, marginBottom: 10 }}>{s.desc}</div>
                <div style={{
                  padding: '6px 10px', background: T.bgAlt, borderRadius: 6,
                  fontFamily: '"Geist Mono", monospace', fontSize: 11, color: T.textDim,
                  display: 'flex', justifyContent: 'space-between',
                }}>
                  <span>{s.file}</span>
                  {s.lines > 0 && <span style={{ color: T.textFaint }}>{s.lines} líneas</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'acciones' && (
          <BS_ProjectActions T={T} />
        )}

        {tab === 'configuracion' && (
          <BS_ProjectSettings T={T} project={p} />
        )}

        {tab === 'notas' && (
          <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '24px 28px', maxWidth: 720 }}>
            <div style={{ fontSize: 13, color: T.textDim, marginBottom: 16 }}>
              Notas que Don Cheli escribe automáticamente cada vez que termina un trabajo.
            </div>
            {[
              { date: 'hace 4 min', text: 'Diseño de pantalla de login en curso. Se está usando el patrón de dos columnas con imagen a la izquierda.' },
              { date: 'hace 2 h',   text: 'Decisión clave: usar refresh tokens HTTP-only. Discutido en mesa técnica. Alternativa descartada: localStorage (riesgo XSS).' },
              { date: 'ayer',       text: 'Primera especificación lista. El alcance quedó acotado a login, registro y recuperación. SSO queda para fase 2.' },
            ].map((n, i) => (
              <div key={i} style={{
                padding: '14px 0',
                borderTop: i > 0 ? `1px solid ${T.borderSoft}` : 'none',
              }}>
                <div style={{ color: T.textFaint, fontSize: 11.5, marginBottom: 4 }}>{n.date}</div>
                <div style={{ fontSize: 13.5, color: T.text, lineHeight: 1.55 }}>{n.text}</div>
              </div>
            ))}
          </div>
        )}
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_ProjectDetail });

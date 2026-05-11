// B Studio — Detalle de una capacidad (habilidad / especialista / comando)
// Ruta: 'capability'. Recibe `capabilityType` y `capabilityId` por props.

const BS_CapabilityDetail = ({ dens, onNav, capabilityType, capabilityId }) => {
  const T = bStudioTokens(dens);

  const source =
    capabilityType === 'agents'   ? B_ARSENAL_AGENTS :
    capabilityType === 'commands' ? B_ARSENAL_COMMANDS :
                                    B_ARSENAL_SKILLS;
  const item = source.find(x => x.id === capabilityId) || source[0];

  const typeLabel =
    capabilityType === 'agents'   ? 'Especialista' :
    capabilityType === 'commands' ? 'Comando' :
                                    'Habilidad';
  const isAgent   = capabilityType === 'agents';
  const isCommand = capabilityType === 'commands';
  const isSkill   = capabilityType !== 'agents' && capabilityType !== 'commands';

  // Datos sintéticos basados en el item para que el detalle se vea completo
  const whenToUse = isCommand
    ? 'Cuando quieres lanzar esta acción puntual sin tener que esperar a una fase concreta del flujo. Es el equivalente a llamar a Don Cheli desde tu editor y pedirle exactamente lo que necesitas.'
    : isAgent
      ? 'Cuando una decisión requiere una visión especializada y específica que el modelo general no cubre con la profundidad necesaria.'
      : 'Cuando Don Cheli necesita una capacidad puntual durante el flujo de un trabajo. Las habilidades se activan automáticamente en el paso pertinente o pueden invocarse a demanda.';

  const howItWorks = isCommand
    ? ['Tú escribes el comando en tu editor (o lo invocas desde acá).',
       'Don Cheli toma el contexto actual del proyecto.',
       'Ejecuta la acción y deja un registro de lo que hizo.']
    : isAgent
      ? ['Don Cheli invoca al especialista cuando lo necesita o cuando tú lo pides.',
         'El especialista lee el contexto relevante y opina con su lente.',
         'Su salida se incorpora al razonamiento general.']
      : ['Don Cheli detecta que el contexto requiere esta habilidad.',
         'Carga las instrucciones específicas en memoria.',
         'Ejecuta los pasos definidos en la skill.',
         'Devuelve el resultado al hilo principal del trabajo.'];

  const related = source
    .filter(x => x.id !== item.id && x.cat === item.cat)
    .slice(0, 4);

  const recentRuns = B_HISTORY_RUNS.slice(0, 3).map((r, i) => ({
    runId: r.id, project: r.project, when: r.when, result: r.result,
  }));

  const estCost = (0.10 + (item.uses % 5) * 0.05).toFixed(2);
  const estTime = isCommand ? '~45 s' : isAgent ? '~2 min' : '~1 min';

  return (
    <div className="bs-page">
      <BS_SecondaryTopBar
        dens={dens}
        title={item.name || item.id}
        sub={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <BS_Pill>{typeLabel}</BS_Pill>
            <span>{item.cat}</span>
            <span style={{ color: T.textFaint }}>·</span>
            <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12 }}>{item.uses} usos</span>
            {isCommand && (
              <>
                <span style={{ color: T.textFaint }}>·</span>
                <span style={{ fontFamily: '"Geist Mono", monospace', fontSize: 12 }}>{item.id}</span>
              </>
            )}
          </span>
        }
        breadcrumb={[
          { label: 'Arsenal', to: 'arsenal' },
          { label: typeLabel },
          { label: item.name || item.id },
        ]}
        onNav={onNav}
        actions={
          <>
            <BS_Button>Ver prompt</BS_Button>
            <BS_Button
              primary
              onClick={() => {
                if (typeof window !== 'undefined' && window.openApplyCapability) {
                  window.openApplyCapability(item);
                }
              }}
            >Aplicar ahora</BS_Button>
          </>
        }
      />

      <BS_PageBody padding="24px 32px 36px">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 28, maxWidth: 1080 }}>

          {/* Columna principal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Descripción + qué resuelve */}
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '20px 22px' }}>
              <div style={{
                fontSize: 11, color: T.textFaint, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
              }}>Qué hace</div>
              <p style={{ fontSize: 14.5, color: T.text, lineHeight: 1.6, margin: 0, maxWidth: '70ch' }}>
                {item.desc || 'Capacidad de Don Cheli que se usa durante el flujo de trabajo para resolver tareas específicas.'}
              </p>
            </div>

            {/* Cuándo usarlo */}
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '20px 22px' }}>
              <div style={{
                fontSize: 11, color: T.textFaint, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8,
              }}>Cuándo usarlo</div>
              <p style={{ fontSize: 14, color: T.text, lineHeight: 1.6, margin: 0, maxWidth: '70ch' }}>
                {whenToUse}
              </p>
            </div>

            {/* Cómo funciona */}
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '20px 22px' }}>
              <div style={{
                fontSize: 11, color: T.textFaint, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12,
              }}>Cómo funciona</div>
              <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', counterReset: 'step' }}>
                {howItWorks.map((line, i) => (
                  <li key={i} style={{
                    display: 'grid', gridTemplateColumns: '28px 1fr', gap: 12,
                    alignItems: 'flex-start', padding: '10px 0',
                    borderTop: i === 0 ? 'none' : `1px solid ${T.borderSoft}`,
                  }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: T.bgAlt, color: T.textDim,
                      display: 'grid', placeItems: 'center',
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: 12, fontWeight: 600,
                    }}>{i + 1}</span>
                    <span style={{ fontSize: 13.5, color: T.text, lineHeight: 1.55 }}>{line}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Últimas veces que se usó */}
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
              <div style={{ padding: '14px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Veces que se aplicó esta capacidad</div>
                  <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>Aparece en los trabajos más recientes donde se invocó.</div>
                </div>
                <span
                  onClick={() => onNav && onNav('historial')}
                  style={{ fontSize: 12, color: T.textDim, cursor: 'pointer' }}
                >Ver historial →</span>
              </div>
              {recentRuns.map((r, i) => (
                <div
                  key={r.runId}
                  onClick={() => onNav && onNav('trabajo')}
                  className="bs-row"
                  style={{
                    display: 'grid', gridTemplateColumns: '70px 1fr 100px 80px',
                    padding: '11px 22px', alignItems: 'center', gap: 12, fontSize: 12.5,
                    cursor: 'pointer', borderBottom: i < recentRuns.length - 1 ? `1px solid ${T.borderSoft}` : 'none',
                    transition: 'background .12s ease',
                  }}
                >
                  <span style={{ fontFamily: '"Geist Mono", monospace', color: T.textFaint }}>#{r.runId}</span>
                  <span style={{ color: T.text, fontFamily: '"Geist Mono", monospace' }}>{r.project}</span>
                  <BS_Pill
                    tone={{ success: 'active', running: 'active', error: 'error', stopped: 'paused', paused: 'paused' }[r.result]}
                    dot={r.result === 'running'}
                  >
                    {{ success: 'Éxito', running: 'En vivo', error: 'Error', stopped: 'Detenido', paused: 'Pausado' }[r.result]}
                  </BS_Pill>
                  <span style={{ textAlign: 'right', color: T.textDim, fontSize: 11.5 }}>{r.when}</span>
                </div>
              ))}
              {recentRuns.length === 0 && (
                <div style={{ padding: '24px 22px', textAlign: 'center', color: T.textFaint, fontSize: 12.5 }}>
                  Esta capacidad aún no se ha aplicado en ningún trabajo.
                </div>
              )}
            </div>
          </div>

          {/* Columna lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Estimación */}
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '16px 18px' }}>
              <div style={{
                fontSize: 11, color: T.textFaint, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
              }}>Estimación por aplicación</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: T.textDim }}>Costo</span>
                  <span style={{ color: T.text, fontWeight: 500, fontFamily: '"Geist Mono", monospace' }}>~${estCost}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: T.textDim }}>Tiempo</span>
                  <span style={{ color: T.text, fontWeight: 500, fontFamily: '"Geist Mono", monospace' }}>{estTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: T.textDim }}>Usos totales</span>
                  <span style={{ color: T.text, fontWeight: 500, fontFamily: '"Geist Mono", monospace' }}>{item.uses}</span>
                </div>
              </div>
            </div>

            {/* Cómo invocar */}
            <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '16px 18px' }}>
              <div style={{
                fontSize: 11, color: T.textFaint, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
              }}>Cómo invocarla</div>
              <div style={{
                padding: '9px 11px', background: T.bgAlt, borderRadius: 6,
                fontFamily: '"Geist Mono", monospace', fontSize: 12, color: T.text,
                marginBottom: 8,
              }}>
                {isCommand
                  ? item.id
                  : isAgent
                    ? `agente: ${item.id}`
                    : `Don Cheli la activa sola en el paso "${item.cat}"`}
              </div>
              {!isCommand && (
                <div style={{ fontSize: 11.5, color: T.textDim, lineHeight: 1.5 }}>
                  También puedes forzarla desde la pestaña <strong style={{ color: T.text }}>Acciones</strong> de un proyecto o con "Aplicar ahora" aquí arriba.
                </div>
              )}
            </div>

            {/* Relacionadas */}
            {related.length > 0 && (
              <div style={{ background: T.panel, borderRadius: 12, boxShadow: T.shadow, padding: '16px 18px' }}>
                <div style={{
                  fontSize: 11, color: T.textFaint, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10,
                }}>De la misma categoría</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {related.map(r => (
                    <span
                      key={r.id}
                      onClick={() => window.openCapability && window.openCapability(capabilityType, r.id)}
                      style={{
                        padding: '7px 9px', borderRadius: 6,
                        fontSize: 12.5, color: T.textDim,
                        cursor: 'pointer', transition: 'background .12s ease, color .12s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = T.bgAlt; e.currentTarget.style.color = T.text; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textDim; }}
                    >
                      {r.name || r.id}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Volver al Arsenal */}
            <span
              onClick={() => onNav && onNav('arsenal')}
              style={{
                padding: '10px 14px', borderRadius: 8,
                fontSize: 12.5, color: T.textDim,
                cursor: 'pointer', textAlign: 'center',
                border: `1px solid ${T.border}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = T.text}
              onMouseLeave={(e) => e.currentTarget.style.color = T.textDim}
            >
              ← Volver al Arsenal
            </span>
          </div>
        </div>
      </BS_PageBody>
    </div>
  );
};

Object.assign(window, { BS_CapabilityDetail });

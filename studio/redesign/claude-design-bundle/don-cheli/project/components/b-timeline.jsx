// B Studio — Tres variantes del timeline de 7 pasos.
// Reciben: { dens, data, variant: 'bar' | 'nodes' | 'mixed' }

const BS_Timeline = ({ dens, data, variant = 'bar' }) => {
  const T = bStudioTokens(dens);
  const steps = data.steps;
  const doneCount = steps.filter(s => s.status === 'done').length;
  const activeIdx = steps.findIndex(s => s.status === 'active');
  const totalPct = activeIdx === -1
    ? (doneCount / steps.length) * 100
    : ((doneCount + (steps[activeIdx].progress / 100)) / steps.length) * 100;

  return (
    <div style={{
      margin: `${dens === 'compact' ? 16 : 22}px 28px 0`,
      padding: `${dens === 'compact' ? 18 : 22}px ${dens === 'compact' ? 20 : 24}px`,
      background: T.panel, borderRadius: 14, boxShadow: T.shadow,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: dens === 'compact' ? 14 : 20 }}>
        <div>
          <div style={{ color: T.text, fontSize: 15, fontWeight: 500, letterSpacing: -0.2 }}>
            Los 7 pasos del trabajo
          </div>
          <div style={{ color: T.textDim, fontSize: 12.5, marginTop: 2 }}>
            {activeIdx === -1
              ? `Los 7 pasos terminados`
              : `${doneCount} terminados · 1 en marcha · ${steps.length - doneCount - 1} por delante`}
          </div>
        </div>
        <div style={{
          fontSize: 12, color: T.textDim,
          fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
        }}>
          {Math.round(totalPct)}%
        </div>
      </div>

      {variant === 'bar' && <TimelineBar steps={steps} T={T} />}
      {variant === 'nodes' && <TimelineNodes steps={steps} T={T} activeIdx={activeIdx} />}
      {variant === 'mixed' && <TimelineMixed steps={steps} T={T} activeIdx={activeIdx} />}
    </div>
  );
};

// ── Sub-variante 1: BARRA SEGMENTADA (la original, refinada) ──
const TimelineBar = ({ steps, T }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
    {steps.map((s, i) => {
      const done = s.status === 'done';
      const active = s.status === 'active';
      return (
        <div key={s.id} style={{
          animation: `bsFadeIn 0.32s ${0.05 + i * 0.04}s cubic-bezier(.22,1,.36,1) both`,
        }}>
          <div style={{
            height: 4, borderRadius: 999,
            background: done ? T.ink : T.bgAlt,
            position: 'relative', marginBottom: 14, overflow: 'hidden',
          }}>
            {active && (
              <div style={{
                position: 'absolute', top: 0, left: 0, height: '100%',
                width: `${s.progress}%`, background: T.ink, borderRadius: 999,
              }} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              width: 18, height: 18, borderRadius: '50%',
              background: done ? T.ink : (active ? '#fff' : T.bgAlt),
              border: active ? `1.5px solid ${T.ink}` : 'none',
              color: done ? '#fff' : (active ? T.ink : T.textFaint),
              fontSize: 10, fontWeight: 600,
              display: 'grid', placeItems: 'center',
            }}>{done ? '✓' : i + 1}</span>
            <span style={{
              fontSize: 13, color: T.text,
              fontWeight: active ? 600 : (done ? 500 : 400), letterSpacing: -0.1,
            }}>{s.label}</span>
          </div>
          <div style={{
            fontSize: 11.5, color: T.textDim,
            fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
            marginLeft: 26,
          }}>
            {s.dur === '—' ? '—' : `${s.dur} · ${s.cost}`}
          </div>
          {active && (
            <div style={{
              marginTop: 8, marginLeft: 26, padding: '3px 8px', borderRadius: 4,
              background: T.successBg, color: T.success,
              fontSize: 10.5, fontWeight: 500, letterSpacing: 0.2, display: 'inline-block',
            }}>AHORA</div>
          )}
        </div>
      );
    })}
  </div>
);

// ── Sub-variante 2: NODOS con LÍNEA CONECTORA ──
const TimelineNodes = ({ steps, T, activeIdx }) => {
  const fillPct = activeIdx === -1
    ? 100
    : ((activeIdx + steps[activeIdx].progress / 100) / (steps.length - 1)) * 100;
  return (
    <div style={{ position: 'relative', padding: '8px 14px 0' }}>
      {/* base line */}
      <div style={{
        position: 'absolute', left: 28, right: 28, top: 25, height: 2,
        background: T.bgAlt, borderRadius: 999,
      }} />
      {/* fill line */}
      <div style={{
        position: 'absolute', left: 28, top: 25, height: 2,
        width: `calc((100% - 56px) * ${fillPct / 100})`,
        background: T.ink, borderRadius: 999,
        transition: 'width .3s',
      }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', position: 'relative' }}>
        {steps.map((s, i) => {
          const done = s.status === 'done';
          const active = s.status === 'active';
          return (
            <div key={s.id} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                width: 34, height: 34, margin: '0 auto', borderRadius: '50%',
                background: active ? '#fff' : (done ? T.ink : '#fff'),
                border: done ? 'none' : `1.5px solid ${active ? T.ink : T.border}`,
                boxShadow: active ? `0 0 0 5px ${T.successBg}, 0 2px 8px rgba(15,17,20,0.08)` : (done ? '0 1px 2px rgba(15,17,20,0.10)' : 'none'),
                display: 'grid', placeItems: 'center',
                fontSize: 12, fontWeight: 600,
                color: done ? '#fff' : (active ? T.ink : T.textFaint),
                position: 'relative', zIndex: 1,
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{
                marginTop: 14, fontSize: 13,
                color: active ? T.text : (done ? T.text : T.textDim),
                fontWeight: active ? 600 : (done ? 500 : 400), letterSpacing: -0.1,
              }}>{s.label}</div>
              <div style={{
                marginTop: 3, fontSize: 11, color: T.textFaint,
                fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
              }}>
                {s.dur === '—' ? '—' : `${s.dur} · ${s.cost}`}
              </div>
              {active && (
                <div style={{
                  marginTop: 8, display: 'inline-block',
                  padding: '3px 8px', borderRadius: 4,
                  background: T.successBg, color: T.success,
                  fontSize: 10.5, fontWeight: 500, letterSpacing: 0.3,
                }}>AHORA</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Sub-variante 3: MIXTO — barra fina continua con nodos grandes encima ──
const TimelineMixed = ({ steps, T, activeIdx }) => {
  const fillPct = activeIdx === -1
    ? 100
    : ((activeIdx + steps[activeIdx].progress / 100) / (steps.length - 1)) * 100;
  return (
    <div>
      {/* Big progress bar */}
      <div style={{ position: 'relative', marginBottom: 22, padding: '0 14px' }}>
        <div style={{
          height: 6, borderRadius: 999, background: T.bgAlt,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${fillPct}%`, background: `linear-gradient(90deg, ${T.ink} 0%, ${T.ink} 100%)`,
            borderRadius: 999,
          }} />
        </div>

        {/* Nodes on top of the bar */}
        <div style={{
          position: 'absolute', left: 14, right: 14, top: 3,
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          pointerEvents: 'none',
        }}>
          {steps.map((s, i) => {
            const done = s.status === 'done';
            const active = s.status === 'active';
            return (
              <div key={s.id} style={{ position: 'relative', height: 0 }}>
                <div style={{
                  position: 'absolute', left: '50%', top: 0, transform: 'translate(-50%, -50%)',
                  width: active ? 22 : 14, height: active ? 22 : 14,
                  borderRadius: '50%',
                  background: done ? T.ink : (active ? '#fff' : '#fff'),
                  border: done ? `2px solid ${T.ink}` : `2px solid ${active ? T.ink : T.border}`,
                  boxShadow: active ? `0 0 0 5px ${T.successBg}` : 'none',
                  display: 'grid', placeItems: 'center',
                  fontSize: 10, color: done ? '#fff' : T.ink, fontWeight: 700,
                }}>
                  {done ? '' : (active ? '●' : '')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '0 14px' }}>
        {steps.map((s, i) => {
          const done = s.status === 'done';
          const active = s.status === 'active';
          return (
            <div key={s.id} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 13,
                color: active ? T.text : (done ? T.text : T.textDim),
                fontWeight: active ? 600 : (done ? 500 : 400), letterSpacing: -0.1,
              }}>
                {i + 1}. {s.label}
              </div>
              <div style={{
                marginTop: 3, fontSize: 11, color: T.textFaint,
                fontFamily: '"Geist Mono", monospace', fontVariantNumeric: 'tabular-nums',
              }}>
                {s.dur === '—' ? '—' : `${s.dur} · ${s.cost}`}
              </div>
              {active && (
                <div style={{
                  marginTop: 6, display: 'inline-block',
                  padding: '3px 8px', borderRadius: 4,
                  background: T.successBg, color: T.success,
                  fontSize: 10.5, fontWeight: 500, letterSpacing: 0.3,
                }}>AHORA</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

Object.assign(window, { BS_Timeline });

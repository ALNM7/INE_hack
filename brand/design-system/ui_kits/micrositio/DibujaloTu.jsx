function DibujaloTu({ trazoInicial, reveladoInicial = false }) {
  const { Boton, Icono, PieFuente } = DS;
  const real = kitDatos.porEdad;
  const W = 350, H = 300, m = { t: 16, r: 44, b: 30, l: 30 }, X0 = 18, X1 = 29, Y0 = 30, Y1 = 80;
  const sx = (x) => m.l + ((x - X0) / (X1 - X0)) * (W - m.l - m.r);
  const sy = (y) => m.t + (1 - (y - Y0) / (Y1 - Y0)) * (H - m.t - m.b);
  const ix = (px) => Math.round(X0 + ((px - m.l) / (W - m.l - m.r)) * (X1 - X0));
  const iy = (py) => Math.max(Y0, Math.min(Y1, Y0 + (1 - (py - m.t) / (H - m.t - m.b)) * (Y1 - Y0)));
  const [trazo, setTrazo] = React.useState(trazoInicial || { 18: 61 });
  const [revelado, setRevelado] = React.useState(reveladoInicial);
  const svg = React.useRef(); const dibujando = React.useRef(false);
  const punto = (e) => { const r = svg.current.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H; return [Math.max(19, Math.min(X1, ix(px))), +iy(py).toFixed(1)]; };
  const pintar = (e) => {
    if (!dibujando.current || revelado) return; const [x, y] = punto(e);
    setTrazo((t) => { const n = { ...t }; const prev = Math.max(...Object.keys(n).map(Number).filter((k) => k < x), 18); for (let k = prev + 1; k <= x; k++) n[k] = +(n[prev] + ((y - n[prev]) * (k - prev)) / (x - prev)).toFixed(1); n[x] = y; return n; });
  };
  const pts = Object.entries(trazo).map(([x, y]) => ({ x: +x, y })).sort((a, b) => a.x - b.x);
  const completo = pts.length && pts[pts.length - 1].x >= 25;
  const path = (arr) => arr.map((p, i) => (i ? "L" : "M") + sx(p.x).toFixed(1) + "," + sy(p.y).toFixed(1)).join("");
  const u25 = trazo[25];
  return (
    <section data-screen-label={revelado ? "03b Dibújalo tú · revelado" : "03a Dibújalo tú"} style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
      <span style={{ ...kitAnte, color: "var(--color-acento-texto)" }}>Dibújalo tú</span>
      <h2 style={kitTitulo2}>¿Cuántos jóvenes crees que votan después de los 18?</h2>
      <p style={{ ...kitEntrada, color: "var(--color-texto-2)", fontSize: 17 }}>A los 18 votó el 61%. Traza con el dedo cómo crees que sigue la línea hasta los 29.</p>
      <div style={{ position: "relative", background: "var(--color-superficie)", border: "1px solid var(--color-linea)", borderRadius: "var(--radius-lg)", padding: "10px 4px 0" }}>
        <svg ref={svg} viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", touchAction: "none", cursor: revelado ? "default" : "crosshair" }}
          onPointerDown={(e) => { dibujando.current = true; e.currentTarget.setPointerCapture(e.pointerId); pintar(e); }} onPointerMove={pintar} onPointerUp={() => (dibujando.current = false)}>
          {[30, 40, 50, 60, 70, 80].map((y) => <g key={y}><line x1={m.l} x2={W - m.r} y1={sy(y)} y2={sy(y)} stroke="var(--color-linea)" /><text x={m.l - 6} y={sy(y) + 4} textAnchor="end" style={{ font: "12px var(--font-mono)", fill: "var(--color-texto-3)" }}>{y}</text></g>)}
          {[18, 20, 22, 24, 26, 28].map((x) => <text key={x} x={sx(x)} y={H - 8} textAnchor="middle" style={{ font: "12px var(--font-mono)", fill: "var(--color-texto-3)" }}>{x}</text>)}
          {!revelado && <rect x={sx(18.5)} y={m.t} width={sx(X1) - sx(18.5)} height={H - m.t - m.b} fill="none" stroke="var(--color-texto-3)" strokeDasharray="2 5" rx="4" />}
          {revelado && <path d={path(real)} fill="none" stroke="var(--color-foco-encendido)" strokeWidth="3" strokeLinejoin="round" pathLength="1" strokeDasharray="1" style={{ animation: "dibuja var(--duration-escena) var(--ease-entrada) both" }} />}
          <path d={path(pts)} fill="none" stroke={revelado ? "var(--color-arena)" : "var(--color-foco-encendido)"} strokeWidth={revelado ? 2 : 3} strokeDasharray={revelado ? "3 5" : "none"} strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={sx(18)} cy={sy(61)} r="5" fill="var(--color-foco-encendido)" />
          <text x={sx(18) + 8} y={sy(61) - 9} style={{ font: "500 13px var(--font-mono)", fill: "var(--color-acento-texto)" }}>61%</text>
          {revelado && <g><circle cx={sx(25)} cy={sy(47)} r="5" fill="var(--color-fondo)" stroke="var(--color-texto)" strokeWidth="1.5" /><text x={sx(25)} y={sy(47) + 22} textAnchor="middle" style={{ font: "600 13px var(--font-mono)", fill: "var(--color-acento-texto)" }}>47% a los 25</text></g>}
        </svg>
        {pts.length < 2 && !revelado && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, pointerEvents: "none", color: "var(--color-texto-2)", fontFamily: "var(--font-mono)", fontSize: 13 }}><Icono nombre="pencil" tamano={18} />Dibuja aquí</div>}
      </div>
      {!revelado ? (
        <Boton completo disabled={!completo} onClick={() => setRevelado(true)}>{completo ? "Ver la respuesta" : "Dibuja al menos hasta los 25"}</Boton>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ ...kitEntrada, fontSize: 19 }}>{u25 != null ? <>Dibujaste <b>{Math.round(u25)}%</b> a los 25. En realidad fue <b style={{ color: "var(--color-acento-texto)" }}>47%</b>: {u25 > 47 ? "menos de lo que pensabas." : "cerca de lo que pensabas."}</> : <>A los 25 votó el 47%.</>}</p>
          <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-texto-2)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 16, height: 3, background: "var(--color-foco-encendido)" }}></i>Dato real</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 16, height: 0, borderTop: "2px dashed var(--color-arena)" }}></i>Tu línea</span>
          </div>
          <Boton variante="texto" iconoFinal={<Icono nombre="rotate-ccw" tamano={18} />} onClick={() => { setTrazo({ 18: 61 }); setRevelado(false); }} style={{ alignSelf: "flex-start" }}>Volver a dibujar</Boton>
        </div>
      )}
      <PieFuente fuente="INE, Conteo Censal de Participación 2024" nota="Valores intermedios ilustrativos." />
    </section>
  );
}
window.DibujaloTu = DibujaloTu;

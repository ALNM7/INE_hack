function EscenaCohorte({ alto = "100svh", pasoFijo }) {
  const { CampoLuces, PasoScrolly, CifraProtagonista } = DS;
  const [paso, reg] = usePasoActivo(pasoFijo);
  const c = kitDatos.cohorte;
  const textos = [
    <>Quienes tenían 18 en 2012 votaron por primera vez. Lo hizo el <b>66.7%</b>: dos de cada tres.</>,
    <>Seis años después, a los 24, la misma generación votó <b>52.1%</b>.</>,
    <>A los 30, <b>50.3%</b>. Nunca volvió a encenderse como la primera vez.</>,
  ];
  const actual = c[paso];
  return (
    <section data-screen-label="04 Cohorte" style={{ position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: alto, boxSizing: "border-box", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {c.map((p, i) => <span key={i} style={{ flex: 1, paddingTop: 8, borderTop: `2px solid ${i <= paso ? "var(--color-foco-encendido)" : "var(--color-linea)"}`, fontFamily: "var(--font-mono)", fontSize: 12, color: i === paso ? "var(--color-texto)" : "var(--color-texto-3)", transition: "border-color var(--duration-media) var(--ease-entrada)" }}>{p.anio} · {p.edad}</span>)}
        </div>
        <CifraProtagonista key={paso} tamano="cifra" valor={actual.valor.toFixed(1)} unidad="%" antetitulo={`Votó a los ${actual.edad} años`} etiqueta={null} fuente={null} animar />
        <CampoLuces total={420} proporcion={actual.valor / 100} semilla={12} />
      </div>
      <div style={{ position: "relative", marginTop: `calc(-1 * ${alto})`, padding: "0 20px" }}>
        {textos.map((t, i) => (
          <div key={i} ref={reg(i)}>
            <PasoScrolly antetitulo={`${c[i].anio} · ${c[i].edad} años`} activo={paso === i} style={{ minHeight: alto, alignItems: "flex-end", paddingBottom: 28, boxSizing: "border-box" }}>{t}</PasoScrolly>
          </div>
        ))}
      </div>
    </section>
  );
}
window.EscenaCohorte = EscenaCohorte;

function EscenaEscala({ alto = "100svh", pasoFijo }) {
  const { CampoLuces, PasoScrolly, CifraProtagonista } = DS;
  const [paso, reg] = usePasoActivo(pasoFijo);
  const pasos = [
    <>En 2024, <b>37.1 millones</b> de personas no votaron. Cada punto son 100 mil de ellas.</>,
    <>Un tercio tenía entre <b>18 y 29 años</b>. Son los puntos claros.</>,
  ];
  return (
    <section data-screen-label="02 Escala" style={{ position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: alto, boxSizing: "border-box", padding: "28px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
        <CifraProtagonista tamano="cifra" tono="apagada" valor="37.1" unidad=" M" etiqueta={null} fuente={null} antetitulo="Personas que no votaron · 2024" />
        <CampoLuces total={371} encendidas={paso >= 1 ? 124 : 0} semilla={4} halo={false} colorEncendida="var(--color-arena)" etiqueta="371 puntos apagados; 124 de ellos son jóvenes" />
        <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-texto-2)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: "var(--color-foco-apagado)" }}></i>100 mil personas</span>
          {paso >= 1 && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><i style={{ width: 8, height: 8, borderRadius: 4, background: "var(--color-arena)" }}></i>de 18 a 29 años</span>}
        </div>
      </div>
      <div style={{ position: "relative", marginTop: `calc(-1 * ${alto})`, padding: "0 20px" }}>
        {pasos.map((t, i) => (
          <div key={i} ref={reg(i)}>
            <PasoScrolly numero={i + 1} activo={paso === i} style={{ minHeight: alto, alignItems: "flex-end", paddingBottom: 28, boxSizing: "border-box" }}>{t}</PasoScrolly>
          </div>
        ))}
      </div>
    </section>
  );
}
window.EscenaEscala = EscenaEscala;

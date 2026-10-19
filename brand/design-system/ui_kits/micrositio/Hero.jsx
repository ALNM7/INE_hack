function Hero({ alto = "100svh" }) {
  const { CampoLuces, Icono } = DS;
  return (
    <section data-screen-label="01 Hero" style={{ minHeight: alto, boxSizing: "border-box", padding: "20px 20px 28px", display: "flex", flexDirection: "column", gap: 22 }}>
      <span style={kitAnte}>Participación electoral · 2012–2024</span>
      <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "8px 4px" }}>
        <CampoLuces total={420} proporcion={1} semilla={3} />
      </div>
      <h1 style={{ fontFamily: "var(--font-titulo)", fontWeight: 700, fontStretch: "82%", fontSize: 58, lineHeight: 0.92, letterSpacing: "-0.04em", margin: 0 }}>
        La generación que se <span style={{ color: "var(--color-foco-apagado)" }}>apagó</span>
      </h1>
      <p style={{ ...kitEntrada, color: "var(--color-texto-2)" }}>Cada luz es una persona: encendida si votó, apagada si no. Esta es la historia de quienes cumplieron 18 años en 2012.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--color-acento-texto)", fontFamily: "var(--font-mono)", fontSize: 13 }}>
        <Icono nombre="arrow-down" tamano={18} /> Desliza para empezar
      </div>
    </section>
  );
}
window.Hero = Hero;

function EscenaMapa({ seleccionInicial = "JAL" }) {
  const { MapaEstados, PieFuente, Boton, Icono } = DS;
  const [modo, setModo] = React.useState("secuencial");
  const [sel, setSel] = React.useState(seleccionInicial);
  const v = kitDatos.estados;
  const prom = Object.values(v).reduce((a, b) => a + b, 0) / 32;
  const tab = (id, l) => (
    <button type="button" role="tab" aria-selected={modo === id} onClick={() => setModo(id)} style={{ flex: 1, minHeight: 44, background: "none", border: 0, borderBottom: `2px solid ${modo === id ? "var(--color-foco-encendido)" : "var(--color-linea)"}`, color: modo === id ? "var(--color-texto)" : "var(--color-texto-2)", fontFamily: "var(--font-texto)", fontSize: 15, fontWeight: modo === id ? 700 : 400, cursor: "pointer" }}>{l}</button>
  );
  const nombre = { JAL: "Jalisco", OAX: "Oaxaca", YUC: "Yucatán", NLE: "Nuevo León", CMX: "Ciudad de México" }[sel] || sel;
  return (
    <section data-screen-label="05 Mapa" style={{ padding: "40px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
      <span style={kitAnte}>Por estado · 18 a 29 años · 2024</span>
      <h2 style={kitTitulo2}>¿Dónde se apaga más?</h2>
      <div role="tablist" style={{ display: "flex" }}>{tab("secuencial", "Participación")}{tab("divergente", "Contra el promedio")}</div>
      <MapaEstados valores={v} escala={modo} dominio={[42, 64]} promedio={prom} rango={10} seleccionado={sel} onSeleccionar={setSel} etiquetaLeyenda={modo === "secuencial" ? "% de jóvenes que votó" : "Puntos contra el promedio nacional"} />
      {sel && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", background: "var(--color-superficie)", border: "1px solid var(--color-linea)", borderRadius: "var(--radius-lg)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-titulo)", fontWeight: 600, fontSize: 18 }}>{nombre}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--color-texto-2)" }}>{v[sel].toFixed(1)}% · {(v[sel] - prom >= 0 ? "+" : "−") + Math.abs(v[sel] - prom).toFixed(1)} pts</span>
          </div>
          <Boton variante="texto" iconoFinal={<Icono nombre="arrow-right" tamano={18} />}>Ver municipios</Boton>
        </div>
      )}
      <PieFuente fuente="INE, Conteo Censal de Participación 2024" nota="Valores del mapa ilustrativos." />
    </section>
  );
}
window.EscenaMapa = EscenaMapa;

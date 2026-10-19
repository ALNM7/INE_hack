function CarruselTarjetas({ datos = { municipio: "Zapopan", edad: 24 }, onEditar = () => {} }) {
  const { TarjetaWrapped, Boton, Icono, Toast } = DS;
  const [i, setI] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const pista = React.useRef();
  const esc = 0.27, ancho = 1080 * esc;
  const tarjetas = [
    { variante: "municipio", datos: { municipio: datos.municipio, valor: 54.2 } },
    { variante: "edad", datos: { edad: datos.edad, valor18: 61, valorEdad: 47.6 } },
    { variante: "generacion", datos: {} },
    { variante: "secciones", datos: { municipio: datos.municipio } },
    { variante: "cierre", datos: {} },
  ];
  const ir = (k) => { const n = Math.max(0, Math.min(4, k)); pista.current.scrollTo({ left: n * (ancho + 12), behavior: "smooth" }); };
  return (
    <section data-screen-label="08 Carrusel" style={{ padding: "32px 0 40px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ ...kitAnte, color: "var(--color-acento-texto)" }}>{datos.municipio} · {datos.edad} años</span>
        <h2 style={kitTitulo2}>Tus cinco tarjetas</h2>
      </div>
      <div ref={pista} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / (ancho + 12)))} style={{ display: "flex", gap: 12, overflowX: "auto", scrollSnapType: "x mandatory", padding: "0 calc(50% - " + ancho / 2 + "px)", scrollbarWidth: "none" }}>
        {tarjetas.map((t, k) => (
          <div key={k} style={{ scrollSnapAlign: "center", flex: "none", borderRadius: 10, overflow: "hidden", border: "1px solid var(--color-linea)", opacity: k === i ? 1 : 0.5, transition: "opacity var(--duration-media) var(--ease-entrada)" }}>
            <TarjetaWrapped variante={t.variante} datos={t.datos} indice={k + 1} escala={esc} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <button type="button" aria-label="Anterior" onClick={() => ir(i - 1)} style={{ width: 44, height: 44, background: "none", border: 0, color: "var(--color-texto-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icono nombre="chevron-left" /></button>
        {tarjetas.map((_, k) => <button key={k} type="button" aria-label={`Tarjeta ${k + 1}`} onClick={() => ir(k)} style={{ width: 20, height: 44, background: "none", border: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><span style={{ width: 8, height: 8, borderRadius: 4, background: k === i ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)", boxShadow: k === i ? "var(--shadow-halo)" : "none" }}></span></button>)}
        <button type="button" aria-label="Siguiente" onClick={() => ir(i + 1)} style={{ width: 44, height: 44, background: "none", border: 0, color: "var(--color-texto-2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icono nombre="chevron-right" /></button>
      </div>
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        <Boton completo icono={<Icono nombre="download" />} onClick={() => setToast({ tono: "exito", m: `Tarjeta ${i + 1} guardada en tus fotos.` })}>Descargar tarjeta</Boton>
        <Boton completo variante="secundario" icono={<Icono nombre="share-2" />} onClick={() => setToast({ tono: "info", m: "Enlace copiado." })}>Compartir</Boton>
        <Boton variante="texto" onClick={onEditar} style={{ alignSelf: "center" }}>Cambiar mis datos</Boton>
      </div>
      {toast && <Toast key={toast.m} flotante tono={toast.tono} mensaje={toast.m} duracion={3200} onCerrar={() => setToast(null)} />}
    </section>
  );
}
window.CarruselTarjetas = CarruselTarjetas;

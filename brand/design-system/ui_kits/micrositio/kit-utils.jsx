const DS = window.LaGeneraciNQueSeApagDesignSystem_a5d389;

function usePasoActivo(fijo) {
  const nodos = React.useRef([]);
  const [activo, setActivo] = React.useState(fijo ?? 0);
  React.useEffect(() => {
    if (fijo != null) { setActivo(fijo); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActivo(+e.target.dataset.i); }), { rootMargin: "-40% 0px -40% 0px" });
    nodos.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, [fijo]);
  const registrar = (i) => (el) => { nodos.current[i] = el; if (el) el.dataset.i = i; };
  return [activo, registrar];
}

const kitAnte = { fontFamily: "var(--font-mono)", fontSize: "var(--text-antetitulo)", letterSpacing: "var(--text-antetitulo--letter-spacing)", textTransform: "uppercase", fontWeight: 500, color: "var(--color-texto-2)" };
const kitTitulo2 = { fontFamily: "var(--font-titulo)", fontWeight: 700, fontSize: "var(--text-titulo-2)", lineHeight: "var(--text-titulo-2--line-height)", letterSpacing: "var(--text-titulo-2--letter-spacing)", margin: 0, textWrap: "balance" };
const kitEntrada = { fontSize: "var(--text-entrada)", lineHeight: "var(--text-entrada--line-height)", margin: 0, textWrap: "pretty" };

/* Datos: 18 y 25 años (61%, 47%) y la cohorte 2012 (66.7 / 52.1 / 50.3) son del brief; el resto es ilustrativo. */
const kitDatos = {
  porEdad: [[18, 61], [19, 57], [20, 54], [21, 51.5], [22, 49.6], [23, 48.4], [24, 47.6], [25, 47], [26, 47.3], [27, 47.9], [28, 48.7], [29, 49.4]].map(([x, y]) => ({ x, y })),
  cohorte: [{ anio: 2012, edad: 18, valor: 66.7 }, { anio: 2018, edad: 24, valor: 52.1 }, { anio: 2024, edad: 30, valor: 50.3 }],
  estados: (() => { const ids = "AGU BCN BCS CAM CHP CHH CMX COA COL DUR GUA GRO HID JAL MEX MIC MOR NAY NLE OAX PUE QUE ROO SLP SIN SON TAB TAM TLA VER YUC ZAC".split(" "); let s = 11; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; const o = {}; ids.forEach((i) => (o[i] = +(42 + r() * 22).toFixed(1))); return o; })(),
  catalogo: [
    { id: "CMX", nombre: "Ciudad de México", municipios: ["Iztapalapa", "Coyoacán", "Cuauhtémoc", "Gustavo A. Madero"] },
    { id: "JAL", nombre: "Jalisco", municipios: ["Guadalajara", "Zapopan", "San Pedro Tlaquepaque", "Tonalá"] },
    { id: "NLE", nombre: "Nuevo León", municipios: ["Monterrey", "Guadalupe", "Apodaca", "San Nicolás de los Garza"] },
    { id: "OAX", nombre: "Oaxaca", municipios: ["Oaxaca de Juárez", "Juchitán de Zaragoza", "Salina Cruz"] },
    { id: "YUC", nombre: "Yucatán", municipios: ["Mérida", "Valladolid", "Progreso"] },
  ],
};

Object.assign(window, { DS, usePasoActivo, kitAnte, kitTitulo2, kitEntrada, kitDatos });

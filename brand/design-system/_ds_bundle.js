/* @ds-bundle: {"format":4,"namespace":"LaGeneraciNQueSeApagDesignSystem_a5d389","components":[{"name":"Boton","sourcePath":"components/acciones/Boton.jsx"},{"name":"Toast","sourcePath":"components/acciones/Toast.jsx"},{"name":"CifraProtagonista","sourcePath":"components/cifras/CifraProtagonista.jsx"},{"name":"TarjetaWrapped","sourcePath":"components/compartir/TarjetaWrapped.jsx"},{"name":"CampoEdad","sourcePath":"components/formularios/CampoEdad.jsx"},{"name":"SelectorEstadoMunicipio","sourcePath":"components/formularios/SelectorEstadoMunicipio.jsx"},{"name":"SelectorSexo","sourcePath":"components/formularios/SelectorSexo.jsx"},{"name":"NotaMetodologica","sourcePath":"components/fuentes/NotaMetodologica.jsx"},{"name":"PieFuente","sourcePath":"components/fuentes/PieFuente.jsx"},{"name":"GraficaEdad","sourcePath":"components/graficas/GraficaEdad.jsx"},{"name":"MapaEstados","sourcePath":"components/graficas/MapaEstados.jsx"},{"name":"Icono","sourcePath":"components/iconos/Icono.jsx"},{"name":"FichaImprimible","sourcePath":"components/impresion/FichaImprimible.jsx"},{"name":"CampoLuces","sourcePath":"components/narrativa/CampoLuces.jsx"},{"name":"PasoScrolly","sourcePath":"components/narrativa/PasoScrolly.jsx"}],"sourceHashes":{"components/acciones/Boton.jsx":"1df6f35b77c0","components/acciones/Toast.jsx":"d8659b2b1067","components/cifras/CifraProtagonista.jsx":"eb1d91149bde","components/compartir/TarjetaWrapped.jsx":"0ddd8ea8f392","components/formularios/CampoEdad.jsx":"b0636689483d","components/formularios/SelectorEstadoMunicipio.jsx":"5e305f2215d7","components/formularios/SelectorSexo.jsx":"055eba53de93","components/fuentes/NotaMetodologica.jsx":"7893f0c9dd20","components/fuentes/PieFuente.jsx":"d12ade0b5c78","components/graficas/GraficaEdad.jsx":"01ec814946b7","components/graficas/MapaEstados.jsx":"b542a9a13249","components/graficas/mxEstados.js":"ec403dbcd896","components/iconos/Icono.jsx":"6c66e8cea0c7","components/iconos/lucide.js":"159e00941b92","components/impresion/FichaImprimible.jsx":"324d827f09e3","components/narrativa/CampoLuces.jsx":"b05d743f67d9","components/narrativa/PasoScrolly.jsx":"e91f3d9c0169","ui_kits/micrositio/CarruselTarjetas.jsx":"600d0895a69c","ui_kits/micrositio/DibujaloTu.jsx":"2906eda0b774","ui_kits/micrositio/EscenaCohorte.jsx":"0215d3def20d","ui_kits/micrositio/EscenaEscala.jsx":"f0270145093a","ui_kits/micrositio/EscenaMapa.jsx":"bc7a03886336","ui_kits/micrositio/FormularioWrapped.jsx":"78aa7e7a0b1e","ui_kits/micrositio/Hero.jsx":"1c1b9b15f782","ui_kits/micrositio/kit-utils.jsx":"c1d72aadfa9b"},"inlinedExternals":[],"unexposedExports":[{"name":"campoEstilos","sourcePath":"components/formularios/SelectorEstadoMunicipio.jsx"},{"name":"lucidePaths","sourcePath":"components/iconos/lucide.js"},{"name":"mxEstados","sourcePath":"components/graficas/mxEstados.js"},{"name":"mxViewBox","sourcePath":"components/graficas/mxEstados.js"}]} */

(() => {

const __ds_ns = (window.LaGeneraciNQueSeApagDesignSystem_a5d389 = window.LaGeneraciNQueSeApagDesignSystem_a5d389 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/acciones/Boton.jsx
try { (() => {
const {
  useState
} = React;
const alturas = {
  md: 48,
  lg: 56
};
function Boton({
  variante = "primario",
  tamano = "md",
  icono,
  iconoFinal,
  disabled = false,
  completo = false,
  href,
  type = "button",
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const esTexto = variante === "texto";
  const base = {
    display: completo ? "flex" : "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: completo ? "100%" : undefined,
    boxSizing: "border-box",
    minHeight: esTexto ? 44 : alturas[tamano],
    padding: esTexto ? "0 4px" : tamano === "lg" ? "0 28px" : "0 22px",
    fontFamily: "var(--font-texto)",
    fontSize: tamano === "lg" ? 18 : 17,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "0.005em",
    borderRadius: "var(--radius-md)",
    border: "1.5px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
    transform: press && !disabled ? "scale(0.98)" : "none",
    transition: "background-color var(--duration-instante) var(--ease-entrada), color var(--duration-instante) var(--ease-entrada), border-color var(--duration-instante) var(--ease-entrada), transform var(--duration-instante) var(--ease-entrada)"
  };
  const v = {
    primario: {
      background: hover ? "var(--color-luz-suave)" : "var(--color-foco-encendido)",
      color: "var(--color-sobre-acento)"
    },
    secundario: {
      background: hover ? "var(--color-superficie-alta)" : "transparent",
      color: "var(--color-texto)",
      borderColor: hover ? "var(--color-texto)" : "var(--color-texto-3)"
    },
    texto: {
      background: "transparent",
      color: hover ? "var(--color-texto)" : "var(--color-acento-texto)",
      textDecoration: "underline",
      textDecorationThickness: hover ? 2 : 1,
      textUnderlineOffset: "0.22em",
      borderRadius: "var(--radius-xs)"
    }
  }[variante];
  const off = disabled ? variante === "primario" ? {
    background: "var(--color-superficie-alta)",
    color: "var(--color-texto-3)",
    borderColor: "transparent"
  } : {
    color: "var(--color-texto-3)",
    borderColor: variante === "secundario" ? "var(--color-linea)" : "transparent",
    background: "transparent"
  } : null;
  const Tag = href && !disabled ? "a" : "button";
  return React.createElement(Tag, {
    href: Tag === "a" ? href : undefined,
    type: Tag === "button" ? type : undefined,
    disabled: Tag === "button" ? disabled : undefined,
    "aria-disabled": disabled || undefined,
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    style: {
      ...base,
      ...v,
      ...off,
      ...style
    },
    ...rest
  }, icono, children != null ? React.createElement("span", null, children) : null, iconoFinal);
}
Object.assign(__ds_scope, { Boton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/acciones/Boton.jsx", error: String((e && e.message) || e) }); }

// components/cifras/CifraProtagonista.jsx
try { (() => {
const {
  useEffect,
  useRef,
  useState
} = React;
function parse(v) {
  const s = String(v);
  const n = parseFloat(s.replace(/,/g, ""));
  const dec = (s.split(".")[1] || "").length;
  return {
    n,
    dec
  };
}
function fmt(n, dec) {
  return n.toLocaleString("es-MX", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}
function CifraProtagonista({
  valor,
  unidad,
  antetitulo,
  etiqueta,
  fuente = "Fuente: INE",
  tamano = "display",
  tono = "luz",
  animar = false,
  alinear = "inicio",
  style
}) {
  const {
    n,
    dec
  } = parse(valor);
  const [mostrado, setMostrado] = useState(animar && !isNaN(n) ? 0 : n);
  const ref = useRef();
  useEffect(() => {
    if (!animar || isNaN(n)) {
      setMostrado(n);
      return;
    }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMostrado(n);
      return;
    }
    const t0 = performance.now(),
      D = 1100;
    const tick = t => {
      const p = Math.min(1, (t - t0) / D);
      const e = 1 - Math.pow(1 - p, 4);
      setMostrado(n * e);
      if (p < 1) ref.current = requestAnimationFrame(tick);
    };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [n, animar]);
  const color = {
    luz: "var(--color-acento-texto)",
    texto: "var(--color-texto)",
    apagada: "var(--color-texto-3)"
  }[tono];
  const t = tamano === "display" ? "display" : "cifra";
  const centro = alinear === "centro";
  const texto = isNaN(n) ? valor : fmt(mostrado, dec);
  return React.createElement("figure", {
    style: {
      margin: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: centro ? "center" : "flex-start",
      textAlign: centro ? "center" : "left",
      gap: 12,
      ...style
    }
  }, antetitulo ? React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-antetitulo)",
      lineHeight: "var(--text-antetitulo--line-height)",
      letterSpacing: "var(--text-antetitulo--letter-spacing)",
      textTransform: "uppercase",
      fontWeight: 500,
      color: "var(--color-texto-2)"
    }
  }, antetitulo) : null, React.createElement("span", {
    "aria-label": `${valor}${unidad || ""}`,
    style: {
      fontFamily: "var(--font-titulo)",
      fontWeight: 700,
      fontStretch: "82%",
      fontSize: `var(--text-${t})`,
      lineHeight: `var(--text-${t}--line-height)`,
      letterSpacing: `var(--text-${t}--letter-spacing)`,
      color,
      fontVariantNumeric: "tabular-nums",
      display: "flex",
      alignItems: "baseline"
    }
  }, texto, unidad ? React.createElement("span", {
    style: {
      fontSize: "0.5em",
      marginLeft: "0.04em",
      letterSpacing: "-0.02em"
    }
  }, unidad) : null), React.createElement("figcaption", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      alignItems: centro ? "center" : "flex-start",
      maxWidth: "26rem"
    }
  }, etiqueta ? React.createElement("span", {
    style: {
      fontFamily: "var(--font-texto)",
      fontSize: "var(--text-entrada)",
      lineHeight: "var(--text-entrada--line-height)",
      color: "var(--color-texto)",
      textWrap: "pretty"
    }
  }, etiqueta) : null, fuente ? React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-etiqueta)",
      letterSpacing: "var(--text-etiqueta--letter-spacing)",
      color: "var(--color-texto-3)"
    }
  }, fuente) : null));
}
Object.assign(__ds_scope, { CifraProtagonista });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cifras/CifraProtagonista.jsx", error: String((e && e.message) || e) }); }

// components/fuentes/NotaMetodologica.jsx
try { (() => {
function NotaMetodologica({
  titulo = "Nota metodológica",
  abierta = false,
  children,
  style
}) {
  return React.createElement("details", {
    open: abierta,
    style: {
      borderTop: "1px solid var(--color-linea)",
      paddingTop: 4,
      ...style
    }
  }, React.createElement("summary", {
    style: {
      listStyle: "none",
      cursor: "pointer",
      minHeight: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-antetitulo)",
      letterSpacing: "var(--text-antetitulo--letter-spacing)",
      textTransform: "uppercase",
      fontWeight: 500,
      color: "var(--color-texto-2)"
    }
  }, titulo, React.createElement("span", {
    "aria-hidden": true,
    style: {
      fontSize: 16
    }
  }, "+")), React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      paddingBottom: 12,
      fontFamily: "var(--font-texto)",
      fontSize: "var(--text-nota)",
      lineHeight: "var(--text-nota--line-height)",
      color: "var(--color-texto-2)",
      maxWidth: "var(--container-texto)"
    }
  }, children));
}
Object.assign(__ds_scope, { NotaMetodologica });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fuentes/NotaMetodologica.jsx", error: String((e && e.message) || e) }); }

// components/fuentes/PieFuente.jsx
try { (() => {
const mono = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-etiqueta)",
  lineHeight: 1.45,
  letterSpacing: "var(--text-etiqueta--letter-spacing)"
};
function PieFuente({
  fuente = "INE, Conteos Censales de Participación 2012, 2018 y 2024",
  nota,
  enlace,
  style
}) {
  return React.createElement("p", {
    style: {
      margin: 0,
      ...mono,
      color: "var(--color-texto-3)",
      textWrap: "pretty",
      ...style
    }
  }, React.createElement("span", {
    style: {
      color: "var(--color-texto-2)",
      fontWeight: 500
    }
  }, "Fuente: "), enlace ? React.createElement("a", {
    href: enlace,
    style: {
      color: "inherit"
    }
  }, fuente) : fuente, nota ? React.createElement(React.Fragment, null, React.createElement("span", {
    "aria-hidden": true
  }, " · "), nota) : null);
}
Object.assign(__ds_scope, { PieFuente });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/fuentes/PieFuente.jsx", error: String((e && e.message) || e) }); }

// components/graficas/GraficaEdad.jsx
try { (() => {
const {
  useEffect,
  useRef,
  useState
} = React;
const tonos = {
  luz: "var(--color-foco-encendido)",
  apagada: "var(--color-texto-3)",
  texto: "var(--color-texto)",
  mujer: "var(--color-mujer)",
  hombre: "var(--color-hombre)"
};
const mono = {
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  letterSpacing: "0.02em"
};
function useAncho(ref, inicial) {
  const [w, setW] = useState(inicial);
  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return w;
}
function GraficaEdad({
  series = [],
  anotaciones = [],
  dominioX = [18, 30],
  dominioY = [30, 80],
  pasoY = 10,
  ticksX,
  alto = 320,
  etiquetaY = "% que votó",
  formatoX = x => String(x),
  referencia,
  hastaX,
  revelar = true,
  titulo,
  style
}) {
  const ref = useRef();
  const W = useAncho(ref, 360);
  const m = {
    t: 18,
    r: 64,
    b: 34,
    l: 34
  };
  const iw = Math.max(10, W - m.l - m.r),
    ih = alto - m.t - m.b;
  const sx = x => m.l + (x - dominioX[0]) / (dominioX[1] - dominioX[0]) * iw;
  const sy = y => m.t + (1 - (y - dominioY[0]) / (dominioY[1] - dominioY[0])) * ih;
  const ys = [];
  for (let y = Math.ceil(dominioY[0] / pasoY) * pasoY; y <= dominioY[1]; y += pasoY) ys.push(y);
  const xs = ticksX || (() => {
    const a = [];
    const step = dominioX[1] - dominioX[0] > 10 ? 2 : 1;
    for (let x = dominioX[0]; x <= dominioX[1]; x += step) a.push(x);
    return a;
  })();
  const [visto, setVisto] = useState(!revelar);
  useEffect(() => {
    if (!revelar) return;
    const r = requestAnimationFrame(() => setVisto(true));
    return () => cancelAnimationFrame(r);
  }, [revelar]);
  const svg = [];
  ys.forEach(y => {
    svg.push(React.createElement("line", {
      key: "gy" + y,
      x1: m.l,
      x2: m.l + iw,
      y1: sy(y),
      y2: sy(y),
      stroke: "var(--color-linea)",
      strokeWidth: 1
    }));
    svg.push(React.createElement("text", {
      key: "ty" + y,
      x: m.l - 8,
      y: sy(y) + 4,
      textAnchor: "end",
      style: {
        ...mono,
        fill: "var(--color-texto-3)"
      }
    }, y));
  });
  xs.forEach(x => svg.push(React.createElement("text", {
    key: "tx" + x,
    x: sx(x),
    y: alto - 10,
    textAnchor: "middle",
    style: {
      ...mono,
      fill: "var(--color-texto-3)"
    }
  }, formatoX(x))));
  if (referencia) {
    svg.push(React.createElement("line", {
      key: "ref",
      x1: m.l,
      x2: m.l + iw,
      y1: sy(referencia.y),
      y2: sy(referencia.y),
      stroke: "var(--color-texto-2)",
      strokeWidth: 1,
      strokeDasharray: "3 4"
    }));
    svg.push(React.createElement("text", {
      key: "reft",
      x: m.l + iw + 6,
      y: sy(referencia.y) + 4,
      style: {
        ...mono,
        fill: "var(--color-texto-2)"
      }
    }, referencia.etiqueta ?? referencia.y));
  }
  series.forEach(s => {
    const pts = (s.puntos || []).filter(p => hastaX == null || p.x <= hastaX);
    if (!pts.length) return;
    const color = tonos[s.tono] || s.tono || tonos.luz;
    const d = pts.map((p, i) => (i ? "L" : "M") + sx(p.x).toFixed(1) + "," + sy(p.y).toFixed(1)).join("");
    const destacada = s.tono === "luz" || !s.tono;
    svg.push(React.createElement("path", {
      key: "s" + s.id,
      d,
      fill: "none",
      stroke: color,
      strokeWidth: destacada ? 3 : 2,
      strokeLinejoin: "round",
      strokeLinecap: "round",
      strokeDasharray: s.punteada ? "2 6" : "1",
      pathLength: s.punteada ? undefined : 1,
      strokeDashoffset: s.punteada || visto ? 0 : 1,
      style: {
        transition: "stroke-dashoffset var(--duration-escena) var(--ease-entrada)"
      }
    }));
    const u = pts[pts.length - 1];
    svg.push(React.createElement("circle", {
      key: "e" + s.id,
      cx: sx(u.x),
      cy: sy(u.y),
      r: destacada ? 4.5 : 3.5,
      fill: color
    }));
    svg.push(React.createElement("text", {
      key: "el" + s.id,
      x: sx(u.x) + 9,
      y: sy(u.y) + 4,
      style: {
        ...mono,
        fontSize: 13,
        fontWeight: 500,
        fill: color
      }
    }, s.etiquetaFinal ?? `${u.y}%`));
  });
  const notas = anotaciones.filter(a => hastaX == null || a.x <= hastaX).map((a, i) => {
    const x = sx(a.x),
      y = sy(a.y);
    const arriba = a.lado !== "abajo";
    const ali = x > m.l + iw * 0.66 ? "derecha" : x < m.l + iw * 0.2 ? "izquierda" : "centro";
    svg.push(React.createElement("line", {
      key: "al" + i,
      x1: x,
      x2: x,
      y1: y + (arriba ? -7 : 7),
      y2: y + (arriba ? -22 : 22),
      stroke: "var(--color-texto-2)",
      strokeWidth: 1
    }));
    svg.push(React.createElement("circle", {
      key: "ac" + i,
      cx: x,
      cy: y,
      r: 5,
      fill: "var(--color-fondo)",
      stroke: "var(--color-texto)",
      strokeWidth: 1.5
    }));
    return React.createElement("div", {
      key: "an" + i,
      style: {
        position: "absolute",
        left: x,
        top: arriba ? y - 24 : y + 24,
        transform: `translate(${ali === "derecha" ? "-100%" : ali === "izquierda" ? "0" : "-50%"}, ${arriba ? "-100%" : "0"})`,
        width: "max-content",
        maxWidth: 170,
        fontFamily: "var(--font-texto)",
        fontSize: 13,
        lineHeight: 1.35,
        color: "var(--color-texto)",
        textAlign: ali === "derecha" ? "right" : ali === "izquierda" ? "left" : "center",
        textWrap: "balance",
        pointerEvents: "none"
      }
    }, a.cifra ? React.createElement("div", {
      style: {
        ...mono,
        fontSize: 14,
        fontWeight: 600,
        color: "var(--color-acento-texto)"
      }
    }, a.cifra) : null, a.texto);
  });
  return React.createElement("figure", {
    style: {
      margin: 0,
      ...style
    }
  }, titulo ? React.createElement("figcaption", {
    style: {
      fontFamily: "var(--font-titulo)",
      fontWeight: 600,
      fontSize: "var(--text-titulo-3)",
      lineHeight: "var(--text-titulo-3--line-height)",
      marginBottom: 6
    }
  }, titulo) : null, React.createElement("div", {
    style: {
      ...mono,
      color: "var(--color-texto-2)",
      marginBottom: 4
    }
  }, etiquetaY), React.createElement("div", {
    ref,
    style: {
      position: "relative",
      width: "100%"
    }
  }, React.createElement("svg", {
    width: W,
    height: alto,
    role: "img",
    "aria-label": titulo || "Participación por edad",
    style: {
      display: "block",
      overflow: "visible"
    }
  }, svg), notas));
}
Object.assign(__ds_scope, { GraficaEdad });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graficas/GraficaEdad.jsx", error: String((e && e.message) || e) }); }

// components/graficas/mxEstados.js
try { (() => {
// Geometría de los 32 estados de México, proyección Mercator, simplificada (Douglas–Peucker 0.6px).
// Fuente geométrica: angelnmara/geojson (mexicoHigh.json). viewBox 0 0 1000 631.
const mxViewBox = "0 0 1000 631";
const mxEstados = [{
  "id": "AGU",
  "nombre": "Aguascalientes",
  "d": "M492.7,392.9L489.8,390.0L489.7,388.5L495.5,379.0L496.6,374.9L504.6,371.0L506.6,368.2L507.6,368.0L510.2,371.5L515.8,374.8L516.6,377.9L518.3,381.2L518.0,383.3L520.5,386.0L515.1,388.5L511.0,393.6L505.6,395.0L500.6,391.9L495.3,391.5L492.7,392.9Z"
}, {
  "id": "BCN",
  "nombre": "Baja California",
  "d": "M173.0,148.5L177.4,151.6L176.7,152.2L173.0,148.5ZM152.0,116.9L154.5,117.7L157.1,120.3L158.5,123.1L157.9,125.6L163.9,126.5L164.1,132.3L164.9,134.5L166.4,135.0L165.9,137.4L156.8,129.3L155.6,127.0L153.9,126.6L151.0,122.1L152.0,116.9ZM99.6,159.4L101.2,163.6L101.4,167.9L100.5,171.7L98.3,171.5L98.1,170.4L96.8,169.5L95.0,170.0L95.1,169.1L98.6,165.2L98.0,162.3L99.6,159.4ZM134.1,174.6L132.3,174.7L129.6,176.9L129.5,175.0L134.2,170.0L133.2,172.9L134.1,174.6ZM183.6,146.6L183.7,148.7L182.3,148.7L181.8,146.8L183.6,146.6ZM112.2,8.4L111.2,9.0L109.1,8.5L107.5,13.4L105.3,15.9L106.9,19.1L105.5,28.7L112.7,33.6L112.1,35.8L113.3,40.9L110.9,45.8L109.8,57.9L110.6,60.7L112.3,62.3L111.6,63.9L115.2,66.3L115.9,77.4L118.0,82.5L116.9,93.6L121.1,101.8L125.1,105.0L125.6,108.5L127.2,109.8L128.7,110.0L129.1,108.9L131.4,109.9L149.5,126.7L149.3,130.3L152.5,134.8L152.0,138.7L153.0,140.8L154.0,140.9L154.7,138.8L155.9,138.7L157.7,140.2L158.4,144.0L161.4,142.7L162.8,143.5L165.5,150.2L166.3,154.7L169.5,156.6L172.6,155.8L174.5,157.8L173.6,162.5L176.1,166.1L175.8,172.1L177.3,174.1L176.9,177.2L176.1,175.0L175.0,174.7L135.0,174.6L134.8,171.6L135.9,173.1L136.7,172.1L134.8,170.9L134.4,168.7L136.3,164.9L135.8,163.7L134.7,164.3L134.0,163.7L136.5,156.0L134.9,153.2L132.9,152.4L132.8,149.9L129.5,149.2L129.5,148.2L127.0,146.4L124.7,141.2L119.1,137.8L117.9,133.4L115.8,133.3L114.4,130.3L112.3,129.2L107.9,123.9L104.2,121.9L100.4,121.4L98.4,118.2L94.4,116.7L91.9,114.3L90.4,114.6L84.3,109.2L84.3,104.6L82.9,102.5L80.9,101.8L81.7,97.3L81.0,90.4L79.2,87.2L76.6,85.6L76.5,84.3L75.5,85.0L73.2,83.3L73.9,76.6L73.1,72.1L72.5,70.7L69.2,69.1L66.3,65.2L64.0,64.9L65.0,58.2L58.3,48.0L55.8,46.9L52.9,42.9L54.2,42.2L54.3,39.5L51.3,36.4L53.9,37.4L55.2,36.1L55.5,32.9L51.2,30.5L50.7,28.2L46.9,26.2L45.8,18.8L41.9,16.2L39.2,8.7L39.3,7.0L115.3,0.0L112.4,3.8L113.0,6.1L112.2,8.4ZM3.3,130.0L2.6,133.0L4.3,134.5L4.6,138.2L3.7,140.8L2.8,141.1L2.1,139.3L1.6,135.6L0.0,134.0L0.1,131.5L3.3,130.0Z"
}, {
  "id": "BCS",
  "nombre": "Baja California Sur",
  "d": "M114.6,504.4L116.1,504.5L115.9,505.4L114.9,505.2L114.2,505.6L114.6,504.4ZM242.6,267.9L242.0,269.4L241.4,269.7L241.2,268.8L242.6,267.9ZM197.1,269.4L196.1,279.3L195.1,280.2L195.9,281.9L194.3,284.1L196.9,288.0L196.9,291.7L199.4,294.4L198.0,294.2L195.6,291.0L196.9,289.7L195.7,287.1L191.6,286.1L197.1,269.4ZM239.9,253.9L240.5,257.9L239.4,257.5L238.9,255.7L239.9,253.9ZM231.7,253.8L232.4,255.4L231.4,255.8L230.9,254.0L231.7,253.8ZM133.3,174.6L176.1,175.0L176.8,177.9L180.3,183.3L182.4,185.4L187.8,187.5L190.7,190.1L191.6,194.8L194.9,199.9L194.4,200.9L197.7,203.6L202.7,205.1L200.7,209.4L205.2,214.4L205.6,216.2L204.1,218.5L205.6,219.4L208.2,223.9L209.4,224.9L211.4,223.1L207.0,218.6L205.9,212.8L207.7,212.6L215.0,219.2L214.8,223.7L218.7,225.5L218.0,229.1L220.6,232.5L220.2,234.8L222.6,240.3L221.5,245.2L223.1,251.8L226.1,254.3L226.7,257.4L229.0,260.4L232.2,260.8L232.0,262.9L234.5,267.9L235.7,273.7L238.8,277.8L240.4,278.4L243.6,285.5L241.0,291.9L242.8,301.1L247.0,306.4L254.0,307.4L252.5,308.4L250.9,307.9L251.2,309.8L253.3,309.6L254.8,307.3L253.8,303.3L255.0,301.4L257.0,301.6L258.9,304.8L264.2,308.1L264.8,311.9L266.6,312.6L269.9,311.5L270.6,312.8L269.8,316.5L273.9,320.5L273.9,325.1L281.2,329.1L280.8,330.1L282.6,332.7L282.2,339.7L279.1,344.3L273.5,346.9L273.5,347.8L269.0,351.6L265.6,352.5L261.7,348.4L259.2,337.4L254.9,329.9L252.3,327.4L245.9,324.3L235.6,313.7L231.2,309.7L217.6,301.4L216.3,299.5L214.8,299.5L213.6,298.5L212.1,293.9L211.2,293.4L210.7,294.9L207.6,294.7L206.8,295.6L206.1,291.2L202.9,287.1L202.3,288.0L197.9,286.5L198.3,284.6L197.3,283.1L198.3,280.8L197.5,279.5L196.7,285.4L195.8,285.4L195.2,284.0L196.2,282.0L195.4,280.2L197.3,277.5L197.3,276.3L196.3,276.5L196.5,274.1L197.9,269.3L198.8,269.1L198.3,262.1L199.2,257.7L195.1,244.2L191.4,241.3L190.3,237.7L188.3,235.2L186.3,234.7L185.5,235.7L181.4,232.7L179.7,232.8L167.4,222.5L167.3,220.6L164.3,215.7L163.8,217.1L161.9,216.2L164.9,214.0L165.4,212.3L164.4,208.8L163.2,213.7L161.6,214.0L160.6,217.4L156.0,215.4L156.4,214.4L154.6,214.7L152.3,218.4L150.3,218.6L148.4,216.2L146.4,215.7L144.4,211.0L142.1,209.3L139.3,208.6L138.0,209.5L133.6,204.3L129.5,203.2L128.5,204.0L125.5,202.0L124.2,202.2L124.3,201.2L122.5,200.4L122.5,195.9L121.4,193.4L114.7,190.0L110.2,183.6L109.5,184.8L108.1,183.2L106.1,182.9L103.7,178.4L104.7,177.8L106.1,179.0L109.0,178.7L122.0,181.0L125.1,179.3L126.8,179.6L127.0,178.8L126.2,178.8L127.6,177.2L128.7,177.6L128.0,180.8L129.0,182.4L135.1,186.7L136.5,184.2L139.2,185.2L141.1,188.9L142.3,189.1L143.0,187.6L141.0,185.5L141.5,179.8L139.3,178.0L138.0,180.4L138.3,181.9L134.2,183.4L132.2,181.8L132.3,179.3L133.8,177.0L133.3,174.6ZM253.0,295.1L255.2,297.1L253.4,299.7L252.1,296.9L252.0,295.5L253.0,295.1ZM162.3,218.0L164.0,218.4L164.9,220.5L163.7,219.6L161.3,219.0L162.3,218.0ZM201.6,295.4L205.5,295.6L210.4,300.3L210.4,302.5L201.6,295.4ZM266.6,300.6L270.1,306.4L270.2,308.6L268.7,308.5L267.8,307.2L266.6,300.6ZM230.8,241.4L230.3,244.8L229.7,244.0L228.9,244.6L226.4,250.0L225.4,249.1L227.5,244.2L227.2,242.4L230.8,241.4ZM242.1,275.2L242.9,276.7L246.3,278.5L247.6,282.7L247.0,283.3L243.7,280.7L241.7,277.0L242.1,275.2ZM251.9,293.0L253.0,294.7L251.5,294.7L251.9,293.0ZM198.4,199.3L199.8,201.1L198.5,201.9L198.4,199.3ZM233.2,487.9L235.4,490.1L235.3,492.4L234.3,492.9L232.7,491.6L231.3,490.1L233.2,487.9Z"
}, {
  "id": "CAM",
  "nombre": "Campeche",
  "d": "M848.1,490.9L848.7,491.9L847.8,492.6L845.8,492.2L844.4,494.4L843.1,493.9L841.3,495.2L838.6,495.8L838.3,494.7L841.3,494.2L848.1,490.9ZM884.3,423.0L884.1,432.2L889.3,432.9L890.6,435.4L892.5,435.2L893.7,436.5L895.8,434.1L896.4,434.5L898.2,439.2L900.5,440.7L903.0,446.4L907.9,449.0L909.4,452.2L913.4,456.7L915.6,462.7L923.3,469.4L927.1,474.2L927.3,483.0L925.4,484.4L924.7,494.1L926.3,498.2L925.7,500.0L926.7,500.6L926.0,502.7L927.0,509.2L926.2,512.0L923.1,515.6L923.4,523.0L865.4,523.0L865.5,520.9L860.4,518.9L859.6,519.4L854.6,515.4L849.9,514.4L846.4,514.6L846.1,519.5L842.3,520.4L836.0,518.4L834.9,516.6L830.5,513.6L827.7,508.8L827.3,505.1L825.9,503.3L824.6,503.7L819.9,499.9L818.5,495.2L820.7,494.7L834.8,493.7L837.8,496.5L837.1,498.0L835.1,496.3L834.2,497.4L833.3,496.9L832.7,498.7L833.4,499.7L834.9,499.3L834.3,497.9L835.3,498.0L838.0,500.0L846.6,502.1L855.1,498.2L857.4,492.5L855.7,490.3L854.5,491.2L853.1,490.4L852.7,489.2L854.7,486.5L853.6,486.5L849.9,490.7L849.1,490.5L852.3,487.2L866.9,478.2L873.1,472.4L874.8,462.4L874.1,460.9L875.5,458.1L880.4,454.5L882.2,451.3L880.9,447.9L880.6,433.1L882.8,424.8L884.3,423.0Z"
}, {
  "id": "CHP",
  "nombre": "Chiapas",
  "d": "M766.6,581.1L767.3,579.8L768.1,580.6L768.2,581.3L766.6,581.1ZM766.2,575.6L766.7,570.5L765.1,566.8L767.5,558.8L771.7,554.4L774.6,544.0L781.8,539.3L785.6,534.7L785.7,532.7L789.7,527.8L790.6,518.8L793.4,517.7L796.1,518.8L798.8,521.4L801.8,521.1L801.9,523.4L799.9,526.8L803.0,530.8L802.6,533.1L805.2,533.0L806.4,533.9L807.5,536.6L809.3,538.1L811.8,537.0L822.9,527.7L827.0,526.2L827.7,522.0L832.4,522.6L833.3,520.2L835.1,520.7L835.6,521.9L839.4,521.2L840.7,522.9L840.8,525.4L844.0,527.0L845.6,531.2L844.7,534.6L850.2,536.1L850.4,537.2L852.1,537.7L853.5,539.9L851.0,541.7L853.9,544.3L856.2,544.2L856.8,546.2L859.4,549.3L860.7,549.5L863.0,553.4L867.1,554.9L867.4,556.0L871.2,556.8L874.0,559.1L875.7,561.9L876.2,566.0L877.2,565.8L878.2,567.6L880.8,567.6L881.3,569.1L883.4,569.1L884.0,571.7L882.2,576.1L883.2,577.5L882.3,578.0L882.5,580.6L841.9,580.2L826.5,607.0L831.4,613.4L828.6,616.2L828.7,619.4L827.4,621.1L828.6,626.6L826.1,630.9L806.6,611.0L806.5,610.0L784.5,590.9L772.0,583.2L774.5,583.1L774.1,581.3L773.2,580.1L767.3,578.8L766.2,575.6Z"
}, {
  "id": "CHH",
  "nombre": "Chihuahua",
  "d": "M473.4,136.0L470.6,141.3L473.1,143.1L471.9,145.1L470.0,145.1L467.8,150.2L464.0,152.4L461.1,157.2L460.4,158.6L461.5,160.4L456.9,170.8L454.0,170.4L453.9,172.3L455.4,172.6L456.0,174.4L453.1,175.5L454.1,177.3L453.3,179.4L454.4,181.3L453.0,182.8L454.0,188.5L455.5,189.2L455.9,191.6L455.3,193.0L456.4,203.8L459.4,205.7L458.9,207.6L453.8,209.8L454.1,212.8L458.2,217.5L456.8,217.8L453.9,216.3L449.8,217.6L447.9,216.9L446.8,218.0L440.6,214.9L439.3,216.2L441.8,217.2L441.8,218.5L438.6,219.0L437.1,220.9L435.2,221.6L432.9,225.5L432.8,228.2L430.1,228.2L427.9,229.4L422.1,225.2L418.9,225.5L416.4,224.3L413.0,227.2L411.8,226.6L410.2,227.8L407.4,226.5L405.8,226.8L404.7,224.7L402.3,224.8L398.1,221.7L395.7,221.4L392.5,217.3L387.2,215.3L386.3,214.2L385.1,216.5L382.9,217.3L382.9,219.6L379.9,228.5L381.5,229.7L381.5,231.0L377.5,234.0L377.5,235.7L375.7,236.0L376.1,238.7L375.0,239.0L372.8,244.1L374.5,247.2L374.6,249.3L366.5,258.1L361.3,254.9L359.2,255.2L357.9,254.4L357.5,252.7L354.2,254.5L351.5,250.9L350.7,246.8L346.5,240.3L335.3,237.9L333.7,232.0L329.8,225.6L329.3,222.7L327.9,222.1L328.0,214.2L326.7,211.3L324.4,211.3L324.2,207.6L314.9,206.9L312.4,207.7L307.9,205.4L308.9,204.2L308.3,199.9L309.8,193.7L305.7,184.1L301.5,181.1L302.4,178.0L301.9,175.9L299.3,172.1L296.5,170.3L297.2,166.8L295.0,164.6L296.3,162.9L301.4,161.2L305.2,163.0L310.8,159.8L311.6,158.3L308.7,157.2L306.8,154.9L307.3,151.2L306.3,148.8L308.0,143.7L307.8,135.9L309.7,134.3L309.8,130.9L312.0,129.4L311.6,122.2L312.8,119.8L312.9,116.5L311.8,108.0L309.9,106.1L312.3,95.2L310.4,93.5L311.7,89.3L309.3,80.0L307.9,78.1L308.6,75.1L307.3,73.9L307.2,70.8L303.7,67.4L303.8,66.7L305.8,66.6L306.4,62.7L303.3,54.6L304.5,53.0L303.2,51.6L321.0,51.6L321.0,34.9L374.1,34.9L375.4,36.3L378.6,36.8L384.3,46.8L392.2,50.5L397.9,57.6L403.4,60.9L404.9,64.4L409.2,67.6L409.7,69.3L414.3,71.4L415.4,71.1L417.3,73.0L418.8,73.3L419.8,75.0L422.0,75.5L423.1,78.0L425.6,79.9L426.9,86.5L431.6,91.9L432.6,104.1L435.4,107.8L437.1,112.7L441.9,117.2L445.6,118.2L447.4,119.7L448.8,122.6L452.3,125.0L461.1,127.9L462.9,130.3L465.1,131.2L468.1,131.2L473.4,136.0Z"
}, {
  "id": "CMX",
  "nombre": "Ciudad de México",
  "d": "M616.3,481.1L612.1,482.0L611.0,481.0L608.3,482.5L606.9,481.0L605.2,481.4L604.6,480.6L601.7,474.6L605.7,471.1L606.4,468.5L608.7,465.8L609.7,465.9L609.6,467.2L612.2,471.6L616.2,475.9L616.3,481.1Z"
}, {
  "id": "COA",
  "nombre": "Coahuila",
  "d": "M585.4,181.3L580.0,184.8L573.1,183.6L568.4,183.9L567.0,184.8L564.2,191.0L564.0,194.9L557.8,196.6L556.3,196.1L554.8,197.4L552.4,201.2L552.8,205.4L556.3,208.1L557.1,208.0L558.0,204.0L561.3,206.0L561.9,212.5L560.8,215.4L558.0,219.1L554.0,219.1L550.7,221.2L546.3,221.6L543.9,226.2L540.8,229.3L540.6,230.4L550.0,239.5L551.3,243.5L554.7,245.9L553.4,249.5L554.8,254.9L559.9,256.0L561.1,260.8L566.2,264.3L565.6,265.6L570.2,266.4L572.4,269.1L570.8,271.9L564.1,270.8L562.4,268.8L560.2,268.6L559.0,269.0L559.4,270.0L557.1,270.7L555.0,274.8L556.2,281.3L552.7,282.3L552.7,284.9L554.4,286.9L555.4,290.2L554.1,294.3L551.5,293.8L548.5,295.6L545.8,294.6L541.7,288.2L540.1,287.1L536.4,286.6L532.3,288.4L528.7,288.4L528.0,283.9L524.6,284.0L519.5,278.0L512.2,274.4L502.3,273.7L494.4,275.2L493.6,277.9L489.0,281.8L488.4,284.5L489.0,286.7L487.8,287.6L485.1,285.9L481.6,285.7L477.3,283.7L474.9,281.0L474.2,277.1L471.1,274.6L468.1,269.7L467.3,265.7L469.0,264.0L471.9,263.4L470.9,261.9L469.2,261.5L468.4,259.4L471.6,255.6L473.1,250.7L471.6,246.0L471.8,240.6L469.7,235.6L470.1,230.1L469.1,226.7L462.8,219.3L459.1,218.3L454.1,212.8L453.8,209.8L458.9,207.6L459.4,205.7L456.4,203.8L455.3,193.0L455.9,191.6L455.5,189.2L454.0,188.5L453.0,182.8L454.4,181.3L453.3,179.4L454.1,177.3L453.1,175.5L456.0,174.4L455.4,172.6L453.9,172.3L454.0,170.4L456.9,170.8L461.5,160.4L460.4,158.6L461.1,157.2L464.0,152.4L467.8,150.2L470.0,145.1L471.9,145.1L473.1,143.1L470.6,141.3L473.4,136.0L477.7,137.6L481.9,137.5L483.3,133.6L484.3,133.4L485.7,130.5L489.8,128.9L488.5,127.5L489.3,124.2L490.6,124.0L491.4,122.4L491.7,118.0L495.3,112.5L495.5,110.8L502.0,108.8L504.3,109.2L507.1,105.1L511.5,106.4L513.6,108.2L522.8,107.6L528.3,109.5L530.8,108.1L531.8,107.9L531.8,109.4L534.3,108.3L537.3,113.2L538.8,113.0L539.3,113.7L538.9,115.7L539.7,116.2L540.0,114.5L540.9,114.3L540.9,118.1L543.3,118.3L544.0,119.7L546.8,120.3L548.4,123.5L555.2,128.1L555.8,130.7L559.4,134.1L559.8,138.9L563.4,144.0L564.6,149.1L567.8,151.9L567.4,153.3L568.2,154.4L569.7,154.9L568.8,155.6L571.2,163.0L573.4,164.5L573.8,165.9L577.7,167.6L581.1,173.3L582.3,173.5L584.2,180.1L585.4,181.3Z"
}, {
  "id": "COL",
  "nombre": "Colima",
  "d": "M470.0,484.9L466.9,487.7L465.2,487.7L465.2,489.9L462.9,491.4L462.0,493.6L455.0,488.1L443.4,482.8L444.4,480.9L442.4,479.5L440.1,480.7L437.6,478.9L431.8,477.4L435.4,476.5L436.8,474.5L438.3,475.1L440.7,473.2L449.2,472.7L453.1,469.8L458.9,469.9L467.0,464.9L467.4,469.8L470.2,472.5L468.9,480.4L470.0,484.9Z"
}, {
  "id": "DUR",
  "nombre": "Durango",
  "d": "M458.2,217.5L462.8,219.3L464.4,220.8L468.3,225.1L470.1,230.1L469.7,235.6L471.8,240.6L471.6,246.0L473.1,251.7L471.6,255.6L468.4,259.4L469.2,261.5L470.9,261.9L471.9,263.4L469.0,264.0L467.3,265.7L468.1,269.7L471.1,274.6L474.2,277.1L475.6,282.1L481.6,285.7L485.1,285.9L488.6,287.3L489.0,281.8L493.6,277.9L495.5,282.5L498.4,284.6L497.4,290.8L498.9,291.4L500.2,296.5L499.0,297.1L499.4,299.0L489.6,299.4L488.7,300.6L484.1,298.6L479.8,299.5L472.1,298.2L460.8,310.3L457.8,311.2L457.5,312.9L458.9,315.6L458.5,321.7L459.6,327.1L453.1,333.8L451.4,343.6L448.9,347.5L449.8,353.1L449.7,360.1L445.3,362.7L442.5,368.5L438.8,370.1L438.3,371.9L435.4,370.5L434.2,367.9L431.1,364.8L428.9,364.3L427.2,362.1L425.4,365.3L423.6,366.4L420.8,360.6L425.1,357.2L425.7,354.5L423.6,354.1L422.4,350.7L418.5,350.0L416.6,347.8L412.6,349.8L407.2,343.7L402.8,344.2L401.4,338.9L399.4,335.8L397.8,327.4L393.1,321.2L390.8,311.7L389.5,310.5L389.4,307.7L387.0,303.5L382.7,300.2L377.6,298.7L373.2,302.7L370.7,303.6L368.7,303.2L366.7,299.0L365.7,293.7L364.0,293.7L362.5,288.0L360.8,287.6L359.7,284.3L355.7,284.4L354.6,283.4L355.0,281.5L352.0,275.4L350.7,274.6L351.4,265.6L353.1,261.5L351.7,259.9L355.4,256.1L355.2,255.1L354.2,255.3L354.6,253.7L357.5,252.7L357.9,254.4L359.2,255.2L361.3,254.9L366.5,258.1L372.1,252.8L374.8,248.5L372.8,244.1L375.0,239.0L376.1,238.7L375.7,236.0L377.5,235.7L377.5,234.0L381.5,231.0L381.5,229.7L379.9,228.5L382.9,219.6L382.9,217.3L385.1,216.5L386.3,214.2L387.2,215.3L392.5,217.3L395.7,221.4L398.1,221.7L402.3,224.8L404.7,224.7L405.8,226.8L407.4,226.5L410.2,227.8L411.8,226.6L413.0,227.2L416.4,224.3L418.9,225.5L422.1,225.2L427.9,229.4L430.1,228.2L432.8,228.2L432.9,225.5L435.2,221.6L437.1,220.9L438.6,219.0L441.8,218.5L441.8,217.2L439.3,216.2L440.6,214.9L446.8,218.0L447.9,216.9L449.8,217.6L453.9,216.3L456.8,217.8L458.2,217.5Z"
}, {
  "id": "GUA",
  "nombre": "Guanajuato",
  "d": "M587.3,398.8L587.8,402.0L586.4,404.4L589.5,405.2L588.6,408.5L584.6,410.9L582.4,408.7L580.5,409.4L577.7,413.6L577.0,417.5L575.9,416.9L574.8,418.8L571.4,418.3L563.7,419.6L562.8,421.4L562.2,427.1L564.2,430.3L564.2,433.7L569.0,440.0L568.7,446.4L569.7,447.2L568.0,449.5L565.4,449.9L563.8,452.7L562.8,450.7L559.1,452.5L548.6,451.4L548.0,447.7L542.8,448.4L543.0,449.7L541.5,450.4L536.0,449.1L534.8,442.2L536.9,442.5L533.8,439.3L528.6,439.9L526.1,443.5L523.3,443.1L519.0,443.5L518.0,438.8L515.1,437.5L515.6,434.0L517.9,429.7L515.9,426.0L513.8,425.5L513.0,424.2L518.8,417.3L520.5,413.3L523.6,410.9L525.6,405.7L528.0,405.1L528.8,403.4L527.8,402.8L528.5,400.0L527.6,399.9L529.4,391.9L530.9,390.2L530.0,389.2L531.1,387.8L532.7,388.3L533.8,387.1L549.3,391.5L559.0,398.1L564.4,397.3L565.0,393.5L566.3,392.6L571.3,394.2L576.2,397.5L578.3,400.2L581.1,399.3L582.0,400.4L584.0,400.4L587.3,398.8Z"
}, {
  "id": "GRO",
  "nombre": "Guerrero",
  "d": "M597.3,494.8L597.7,497.7L600.5,498.0L603.0,501.4L610.0,502.3L612.9,505.3L612.8,506.8L616.2,509.1L617.8,512.0L621.9,512.0L620.8,514.0L626.1,516.2L626.2,517.6L631.7,516.3L635.7,519.8L633.3,526.6L636.7,534.3L637.5,540.1L636.4,541.2L636.1,543.8L639.7,545.5L640.2,549.4L642.5,551.1L642.9,553.1L641.8,556.8L637.9,559.1L637.7,560.8L632.5,565.3L631.9,567.9L626.1,572.4L619.1,564.6L615.0,565.3L601.6,561.3L590.5,559.7L584.4,556.1L584.8,554.7L583.1,555.6L580.6,552.9L547.0,540.8L546.6,539.3L542.5,535.8L534.6,532.5L534.9,531.4L533.7,530.0L528.5,527.8L527.5,525.4L524.5,522.5L523.5,520.7L518.7,518.0L515.9,517.2L513.2,518.4L511.7,517.1L511.3,515.2L511.4,512.0L512.6,510.6L517.0,509.9L520.8,507.8L521.1,505.1L520.3,503.3L521.0,501.9L520.2,500.4L522.0,498.0L523.3,498.8L524.8,497.1L525.3,497.9L528.9,497.4L530.1,499.6L532.5,500.8L539.8,499.0L547.1,500.0L548.5,500.4L550.1,503.5L552.7,502.3L560.0,506.5L560.9,505.3L557.4,500.4L555.5,491.1L557.4,488.7L558.7,490.7L562.9,486.3L564.3,483.2L567.2,481.5L567.5,485.2L566.2,487.6L565.3,493.0L565.8,495.0L568.0,496.0L568.1,497.5L565.7,500.7L566.2,501.5L570.1,501.7L572.1,505.3L573.8,505.0L576.5,502.1L579.5,501.5L578.6,499.7L580.3,498.3L585.7,498.6L587.2,497.3L588.3,497.7L588.8,495.7L591.1,495.3L590.6,493.1L595.3,495.3L597.3,494.8Z"
}, {
  "id": "HID",
  "nombre": "Hidalgo",
  "d": "M626.7,402.3L628.1,403.4L627.8,406.8L630.1,409.0L631.7,409.8L633.3,409.9L634.4,408.8L637.0,409.6L640.1,414.3L637.8,417.0L637.4,422.0L635.6,422.3L633.3,420.5L629.0,425.0L627.6,434.0L629.1,437.3L630.8,438.4L643.8,427.7L645.6,429.0L645.7,432.8L640.9,437.7L636.4,440.1L637.2,441.9L639.9,441.3L640.5,444.0L639.5,450.1L637.5,454.1L638.4,460.1L635.4,459.4L632.5,462.8L628.6,462.9L622.3,465.1L622.1,463.3L624.4,458.0L624.2,455.8L616.8,456.6L614.7,459.8L613.5,459.7L613.6,458.6L612.5,456.3L614.9,454.9L616.3,449.4L615.0,447.7L606.6,450.8L606.0,455.5L605.1,456.5L602.4,455.2L602.2,458.1L600.5,459.1L600.8,456.2L597.5,450.4L598.3,449.2L596.4,445.2L595.5,444.2L589.6,443.3L584.8,439.6L586.0,431.3L592.9,428.9L595.8,426.9L595.0,424.3L596.5,421.1L599.0,419.0L600.6,414.2L600.3,412.8L602.4,411.0L603.9,411.9L609.1,410.2L610.7,406.3L613.5,405.3L615.0,408.4L618.0,409.7L619.5,407.5L620.9,408.3L624.6,402.2L626.7,402.3Z"
}, {
  "id": "JAL",
  "nombre": "Jalisco",
  "d": "M492.7,392.9L495.3,391.5L500.6,391.9L505.6,395.0L511.0,393.6L515.1,388.5L520.5,386.0L518.0,383.3L518.0,380.5L522.5,381.6L531.5,387.5L530.0,389.2L530.9,390.2L529.4,391.9L527.6,399.9L528.5,400.0L527.8,402.8L528.8,403.4L528.0,405.1L525.6,405.7L523.6,410.9L520.5,413.3L518.8,417.3L513.1,423.8L513.8,425.5L515.9,426.0L517.9,429.7L515.6,434.0L515.1,437.5L501.6,439.5L495.2,443.2L495.1,444.8L491.1,446.0L490.8,447.0L488.9,445.4L485.8,444.8L485.4,446.3L483.8,446.4L483.8,449.4L482.6,451.3L483.3,452.4L487.3,452.1L492.2,454.1L493.0,456.9L491.4,458.9L493.8,464.2L493.0,467.5L497.3,467.4L498.3,469.4L495.1,473.4L494.0,476.3L491.1,475.6L489.4,476.5L479.5,484.8L476.9,482.6L474.1,484.7L470.0,484.9L468.9,480.4L470.2,472.5L467.4,469.8L467.0,464.9L458.9,469.9L453.1,469.8L449.2,472.7L440.7,473.2L439.0,475.0L436.8,474.5L435.4,476.5L433.8,477.0L430.9,475.5L428.4,475.6L428.9,473.6L426.3,474.0L423.8,472.6L421.4,470.4L421.8,469.5L420.3,468.0L419.6,464.7L414.0,460.6L406.5,449.6L405.0,446.7L404.9,442.3L401.7,439.2L400.4,436.2L403.0,434.1L412.3,432.6L414.2,431.2L415.1,429.2L413.0,426.6L418.0,419.9L420.1,418.9L423.1,419.5L428.7,416.1L432.1,418.9L436.0,419.9L445.9,430.1L443.3,423.4L444.9,422.3L446.8,411.5L451.9,411.2L458.6,408.1L459.8,406.5L460.0,399.2L458.2,397.7L456.0,392.2L450.4,391.5L449.2,386.0L445.6,383.8L443.5,384.4L443.1,383.2L444.2,373.8L445.6,372.2L447.3,372.7L447.8,368.8L451.7,367.3L452.4,367.8L451.4,372.5L454.9,369.6L452.5,362.9L452.7,361.9L455.4,360.0L458.8,359.5L461.1,360.8L457.6,365.3L455.5,370.7L455.4,374.9L457.0,377.2L458.4,377.4L458.9,375.9L458.9,367.0L464.0,365.4L467.6,367.7L468.4,370.2L468.3,371.6L463.5,379.5L464.1,380.9L466.6,380.9L467.5,379.9L470.0,380.8L471.1,380.2L472.3,378.1L475.3,375.6L473.7,373.7L474.1,372.0L476.5,371.0L479.2,371.3L479.7,372.3L478.8,374.3L482.8,375.5L480.4,383.6L473.7,386.8L467.8,391.7L467.6,397.1L465.6,399.5L463.3,400.1L464.4,403.2L465.5,403.9L467.7,403.4L468.0,405.5L461.7,408.8L461.6,409.8L464.8,410.6L467.8,414.4L470.7,414.2L474.4,416.2L477.0,415.0L482.3,414.6L484.1,410.8L485.8,410.2L487.7,410.9L496.3,403.7L496.9,400.3L493.4,398.0L492.7,392.9Z"
}, {
  "id": "MEX",
  "nombre": "México",
  "d": "M622.3,465.1L623.5,467.4L625.1,467.8L625.6,470.2L624.9,472.3L626.2,476.9L626.4,482.5L621.9,485.4L618.7,484.2L616.3,481.1L615.9,475.3L615.0,475.3L614.9,473.9L612.6,472.2L609.6,467.2L609.7,465.9L608.7,465.8L606.4,468.5L605.7,471.1L601.7,474.6L605.2,481.4L597.3,494.8L595.3,495.3L590.6,493.1L591.1,495.3L588.8,495.7L588.3,497.7L579.0,499.0L579.5,501.5L576.5,502.1L573.8,505.0L572.1,505.3L570.1,501.7L566.2,501.5L565.7,500.7L568.1,497.5L568.0,496.0L565.8,495.0L565.3,493.0L567.6,484.2L567.2,481.5L571.4,474.2L572.0,470.7L573.8,469.0L573.3,462.4L571.7,459.2L575.1,458.8L575.8,455.5L577.5,453.4L576.3,451.6L576.4,448.5L579.7,448.1L582.1,445.5L581.0,442.1L583.3,442.3L583.4,440.6L584.8,439.6L589.6,443.3L595.5,444.2L596.4,445.2L598.3,449.2L597.5,450.4L600.8,456.2L600.5,459.1L602.2,458.1L602.4,455.2L605.1,456.5L606.0,455.5L606.6,450.8L615.7,447.7L616.3,449.4L614.9,454.9L612.5,456.3L613.5,459.7L614.7,459.8L616.8,456.6L624.2,455.8L624.4,458.0L622.1,463.3L622.3,465.1Z"
}, {
  "id": "MIC",
  "nombre": "Michoacán",
  "d": "M569.0,440.0L571.0,441.2L572.3,444.6L576.4,448.5L576.3,451.6L577.5,453.4L575.8,455.5L575.1,458.8L571.7,459.2L573.3,462.4L573.8,469.0L572.0,470.7L571.4,474.2L567.9,481.0L564.3,483.2L562.9,486.3L558.7,490.7L557.4,488.7L555.5,491.1L557.4,500.4L560.9,505.3L560.0,506.5L552.7,502.3L550.1,503.5L548.5,500.4L539.8,499.0L532.5,500.8L530.1,499.6L528.9,497.4L525.3,497.9L524.8,497.1L523.3,498.8L522.5,498.0L520.6,498.9L520.8,507.8L511.7,511.4L511.3,515.2L512.8,519.0L511.2,519.7L502.3,516.3L492.3,514.1L485.9,511.0L474.2,508.1L470.1,505.9L467.1,499.9L463.5,497.1L464.0,496.0L462.0,493.6L462.9,491.4L465.2,489.9L465.6,487.3L466.9,487.7L471.2,484.4L474.1,484.7L476.9,482.6L479.5,484.8L489.4,476.5L491.1,475.6L494.0,476.3L495.1,473.4L498.1,470.2L497.3,467.4L493.0,467.5L493.8,464.2L491.4,458.9L493.0,456.9L492.2,454.1L487.3,452.1L483.3,452.4L482.6,451.3L483.8,449.4L483.8,446.4L485.4,446.3L485.8,444.8L488.9,445.4L490.8,447.0L491.1,446.0L495.1,444.8L495.2,443.2L501.6,439.5L508.9,438.9L511.6,437.5L517.3,438.2L518.4,443.0L520.0,443.6L521.5,442.7L526.1,443.5L528.6,439.9L533.8,439.3L536.9,442.5L534.8,442.2L536.0,449.1L541.5,450.4L543.0,449.7L542.8,448.4L548.0,447.7L548.6,451.4L559.1,452.5L562.8,450.7L563.8,452.7L565.4,449.9L568.0,449.5L569.5,448.1L569.7,447.2L568.7,446.4L569.0,440.0Z"
}, {
  "id": "MOR",
  "nombre": "Morelos",
  "d": "M616.3,481.1L618.7,484.2L621.9,485.4L626.4,482.5L622.9,491.5L624.5,501.5L623.8,502.4L619.6,499.2L612.9,505.3L610.0,502.3L603.0,501.4L600.5,498.0L597.7,497.7L597.6,493.5L605.2,481.4L606.9,481.0L608.3,482.5L611.0,481.0L612.1,482.0L616.3,481.1Z"
}, {
  "id": "NAY",
  "nombre": "Nayarit",
  "d": "M400.8,362.7L402.8,374.0L402.9,375.8L402.1,375.8L398.9,364.9L400.2,366.3L401.2,366.0L400.8,362.7ZM369.5,389.9L370.0,391.2L369.4,391.5L369.5,389.9ZM383.5,404.8L383.7,405.9L382.7,406.3L382.1,405.4L383.5,404.8ZM370.1,392.6L373.4,393.5L374.6,396.9L373.8,397.3L370.8,395.7L370.1,392.6ZM442.5,368.5L442.8,372.0L444.5,374.4L442.9,380.6L443.5,384.4L445.6,383.8L449.2,386.0L450.4,391.5L456.0,392.2L460.3,401.1L459.3,407.5L451.9,411.2L446.8,411.5L444.9,422.3L443.3,423.4L445.9,430.1L436.0,419.9L432.1,418.9L428.7,416.1L423.1,419.5L420.1,418.9L418.0,419.9L413.0,426.6L411.5,424.4L409.8,425.2L406.0,423.9L412.5,415.0L413.8,415.4L414.7,414.6L415.6,409.5L414.7,404.5L416.4,401.1L416.2,399.5L408.2,394.8L401.8,381.7L402.0,376.4L403.0,375.9L404.7,378.6L407.2,379.8L407.6,377.9L404.7,376.4L404.4,374.9L403.0,374.9L400.9,362.7L408.1,364.8L408.8,363.6L408.5,361.0L405.5,355.6L408.1,351.6L408.8,347.3L409.8,346.5L412.6,349.8L416.6,347.8L418.5,350.0L422.4,350.7L423.6,354.1L425.7,354.5L425.1,357.2L420.8,360.6L423.6,366.4L425.4,365.3L427.2,362.1L428.9,364.3L431.1,364.8L434.2,367.9L435.4,370.5L437.7,371.9L438.8,370.1L442.5,368.5ZM376.9,399.3L379.4,400.6L378.6,402.0L375.2,400.2L376.9,399.3Z"
}, {
  "id": "NLE",
  "nombre": "Nuevo León",
  "d": "M589.1,184.8L586.6,187.4L583.1,188.4L582.2,191.6L587.8,192.3L588.1,193.6L586.6,195.4L588.2,196.5L588.3,201.3L589.7,202.8L590.2,206.8L588.2,208.6L587.1,211.6L587.3,213.0L589.2,213.0L591.4,214.8L590.5,220.5L591.5,221.6L593.5,221.6L594.5,224.0L596.9,224.3L598.5,229.6L600.8,232.7L602.6,232.6L604.0,235.9L606.6,235.1L607.3,238.5L606.2,238.9L607.7,240.4L611.8,240.9L614.2,244.7L615.4,245.3L618.7,243.4L625.2,243.3L626.4,246.4L626.2,259.2L630.5,261.4L627.9,265.8L624.6,268.4L622.3,270.0L616.8,271.0L614.6,275.1L611.1,274.8L609.7,273.3L605.9,276.8L607.5,280.1L607.0,282.2L604.7,283.2L604.1,285.2L602.7,285.8L601.8,284.0L598.4,288.0L596.2,287.9L594.6,290.6L588.4,293.9L587.6,296.6L590.2,296.8L591.8,300.1L590.7,308.7L592.9,311.4L594.7,316.0L596.4,317.0L597.4,319.9L594.5,319.4L593.6,321.4L591.4,322.7L587.3,322.0L584.4,323.5L583.5,327.1L581.3,330.6L581.5,336.4L577.6,336.0L576.6,336.8L576.7,339.5L571.8,338.6L568.9,342.1L565.4,339.3L563.7,330.4L565.2,323.3L563.8,320.3L564.1,314.8L559.8,308.0L560.0,306.2L557.4,303.0L558.9,301.0L558.1,300.2L558.7,298.2L555.6,297.8L553.4,294.9L555.4,290.2L554.4,286.9L552.7,284.9L552.7,282.3L556.2,281.3L555.0,274.8L557.1,270.7L559.4,270.0L559.0,269.0L562.4,268.8L564.1,270.8L570.8,271.9L572.4,269.1L570.2,266.4L565.6,265.6L566.2,264.3L561.1,260.8L559.9,256.0L554.8,254.9L553.4,249.5L554.7,245.9L554.2,245.0L551.3,243.5L550.0,239.5L540.6,230.4L546.3,221.6L550.7,221.2L554.0,219.1L558.0,219.1L560.8,215.4L561.9,212.5L561.3,206.0L558.0,204.0L557.1,208.0L556.3,208.1L552.8,205.4L552.4,201.2L556.3,196.1L557.8,196.6L564.0,194.9L563.8,192.0L567.0,184.8L573.1,183.6L580.0,184.8L586.3,181.1L589.1,184.8Z"
}, {
  "id": "OAX",
  "nombre": "Oaxaca",
  "d": "M774.0,544.9L771.7,554.4L768.2,557.4L765.2,565.7L766.7,570.5L766.2,575.6L763.7,576.7L761.5,576.2L759.4,575.1L758.3,573.2L756.1,575.0L757.5,577.0L763.0,577.4L766.9,580.3L766.6,581.1L756.9,577.4L747.8,575.9L747.4,575.1L750.3,574.2L751.7,572.0L748.7,570.9L745.0,573.9L744.2,573.2L745.6,572.0L742.8,568.7L740.7,569.2L739.0,572.1L737.5,572.0L735.2,575.3L744.2,575.8L733.8,576.7L733.7,577.4L729.7,578.2L729.5,579.5L726.9,580.6L726.8,582.3L724.8,583.5L720.2,584.1L717.5,585.8L708.0,588.6L699.2,593.3L693.6,592.9L689.2,594.1L684.8,592.2L679.7,591.5L668.6,585.5L650.8,583.7L636.8,575.2L630.9,574.2L626.1,572.4L631.9,567.9L632.5,565.3L637.7,560.8L637.9,559.1L641.8,556.8L642.9,553.1L642.5,551.1L640.2,549.4L639.7,545.5L636.1,543.8L636.4,541.2L637.5,540.1L636.7,534.3L633.3,526.6L635.7,519.8L639.8,516.3L641.8,515.8L648.0,515.1L650.8,517.1L653.2,517.3L655.3,514.7L651.8,511.6L654.4,506.1L658.4,505.0L659.2,506.7L657.6,508.9L660.2,511.5L663.5,518.1L669.0,511.3L675.4,512.1L679.9,508.6L682.9,508.0L687.8,499.8L687.6,496.5L688.5,495.7L691.2,497.6L690.4,499.3L692.0,503.9L694.5,505.9L696.1,505.4L697.9,506.4L699.2,508.8L700.9,508.9L700.2,509.7L701.1,510.5L703.5,509.4L710.7,511.1L711.7,517.5L708.5,523.1L708.7,525.5L711.5,531.1L714.0,531.8L719.2,530.8L723.0,528.1L729.6,525.6L731.4,526.7L729.3,528.4L729.0,529.9L732.0,534.0L737.6,539.0L738.0,542.7L774.0,544.9Z"
}, {
  "id": "PUE",
  "nombre": "Puebla",
  "d": "M686.3,502.5L682.9,508.0L679.9,508.6L675.4,512.1L669.0,511.3L663.5,518.1L660.2,511.5L657.6,508.9L659.2,506.7L658.4,505.0L654.4,506.1L651.8,511.6L655.3,514.7L653.2,517.3L650.8,517.1L648.0,515.1L641.8,515.8L639.8,516.3L635.7,519.8L631.7,516.3L626.2,517.6L626.1,516.2L620.8,514.0L621.9,512.0L617.8,512.0L616.2,509.1L613.4,507.4L612.9,505.3L619.6,499.2L623.8,502.4L624.5,501.5L622.8,492.8L626.4,482.5L626.2,476.9L624.9,472.3L625.6,470.2L625.1,467.8L627.5,467.9L631.3,470.9L635.2,476.0L640.3,478.9L645.3,475.3L648.8,476.4L652.1,472.4L657.6,471.5L658.0,470.0L655.9,469.0L654.0,465.9L652.5,465.5L650.1,465.6L650.4,463.7L644.4,458.0L641.0,460.5L638.4,460.1L637.5,454.1L639.5,450.1L640.5,444.0L639.9,441.3L637.2,441.9L636.4,440.1L640.9,437.7L645.7,432.8L646.0,426.8L649.3,421.2L653.3,421.3L653.3,423.6L651.7,424.5L654.1,425.4L653.8,427.6L657.6,430.2L658.2,431.6L656.4,434.7L654.3,433.6L652.8,434.5L653.5,442.6L656.9,443.1L658.8,445.6L663.4,440.5L672.3,443.6L669.7,448.1L667.6,453.5L667.3,457.0L664.2,462.7L665.9,466.5L665.7,468.7L675.8,472.7L676.5,475.0L676.3,475.9L669.5,475.8L670.0,484.0L667.5,488.5L668.0,493.7L673.8,496.0L676.0,500.9L677.8,501.1L680.8,498.7L684.0,499.8L686.3,502.5Z"
}, {
  "id": "QUE",
  "nombre": "Querétaro",
  "d": "M610.7,406.3L609.1,410.2L603.9,411.9L602.4,411.0L600.3,412.8L600.6,414.2L599.0,419.0L596.5,421.1L595.0,424.3L595.8,426.9L592.9,428.9L586.0,431.3L584.8,439.6L583.4,440.6L583.3,442.3L581.0,442.1L582.1,445.5L579.2,448.3L575.6,447.9L572.3,444.6L572.1,442.8L569.0,440.0L568.1,437.9L565.5,436.1L564.2,433.7L563.4,428.0L562.0,426.2L563.7,419.6L571.4,418.3L574.8,418.8L575.9,416.9L577.0,417.5L577.7,413.6L580.5,409.4L582.4,408.7L584.6,410.9L588.6,408.5L589.5,405.2L586.4,404.4L587.8,402.0L588.0,399.4L586.6,398.0L588.5,397.6L588.4,396.4L591.2,397.1L592.4,400.1L594.2,401.2L599.6,401.1L600.9,397.6L603.5,397.3L604.5,399.8L610.7,406.3Z"
}, {
  "id": "ROO",
  "nombre": "Quintana Roo",
  "d": "M999.9,430.0L998.5,433.3L993.4,439.5L991.6,440.8L990.6,438.5L990.7,436.1L993.6,431.3L996.4,431.8L999.9,430.0ZM987.5,396.2L984.7,398.4L982.9,398.4L982.2,398.9L981.6,397.7L984.4,397.8L987.5,396.2ZM923.5,518.7L923.1,515.6L926.9,510.4L926.0,502.7L926.7,500.6L925.7,500.0L926.3,498.2L924.7,494.1L925.4,484.4L927.3,483.0L927.7,475.7L923.3,469.4L914.9,461.7L916.3,456.2L921.5,455.4L926.3,452.2L930.9,451.7L932.7,449.8L935.0,450.2L934.7,449.3L937.1,447.3L946.9,442.8L948.5,439.3L949.8,439.3L951.4,441.4L951.1,438.6L953.0,435.1L954.4,434.4L955.9,435.6L959.7,435.2L969.5,428.7L974.3,417.8L972.8,412.5L973.4,408.5L974.7,406.5L974.2,399.7L980.5,401.6L985.3,401.3L987.7,400.2L988.0,397.7L987.2,397.4L988.6,396.2L992.8,398.8L994.8,402.5L996.1,407.7L997.8,404.7L996.9,402.5L997.7,402.4L997.4,409.9L999.1,412.0L998.2,415.1L997.3,415.2L995.3,421.3L989.6,428.1L982.5,434.8L977.9,442.3L976.2,447.3L976.9,454.2L975.6,456.4L973.0,457.0L970.9,460.5L967.9,462.0L967.6,463.4L969.1,465.0L970.0,464.6L970.7,466.6L971.8,465.0L973.8,464.5L974.6,465.4L975.3,463.8L977.5,463.6L978.2,464.6L977.2,467.8L974.7,470.2L974.2,469.2L971.1,471.0L970.4,473.2L969.9,476.8L971.7,476.8L974.2,473.2L977.1,473.2L974.3,476.5L973.9,480.6L968.8,493.1L967.1,502.9L965.3,505.9L964.6,510.1L962.9,509.5L963.5,505.2L961.6,503.7L961.8,502.4L958.5,501.4L957.2,499.8L958.6,497.8L959.6,492.2L958.2,489.6L958.5,488.5L957.5,488.1L950.4,500.4L944.5,500.4L943.3,501.5L937.5,514.7L932.9,519.2L933.0,521.2L927.4,516.8L923.5,518.7Z"
}, {
  "id": "SLP",
  "nombre": "San Luis Potosí",
  "d": "M576.7,339.5L577.9,340.9L578.0,343.5L580.0,345.9L579.8,354.3L581.4,356.4L593.6,359.4L595.6,356.8L601.3,360.9L606.2,369.2L614.0,369.4L614.9,368.4L617.2,369.9L621.1,369.5L622.2,371.0L629.8,372.2L631.6,373.6L633.1,378.1L629.9,378.2L628.6,379.1L628.6,383.2L625.5,384.2L626.5,386.8L629.3,389.6L626.8,391.6L625.5,391.6L625.6,392.5L624.0,392.5L623.7,393.6L624.8,397.8L626.5,398.0L626.7,402.3L624.6,402.2L620.9,408.3L619.5,407.5L618.0,409.7L615.0,408.4L613.5,405.3L609.6,405.9L604.5,399.8L603.5,397.3L600.9,397.6L599.6,401.1L596.4,401.3L593.2,400.9L591.7,397.7L589.8,396.4L588.4,396.4L588.5,397.6L586.6,398.0L587.3,398.8L584.0,400.4L582.0,400.4L581.1,399.3L578.3,400.2L576.2,397.5L571.3,394.2L566.3,392.6L565.0,393.5L564.2,395.8L564.4,397.3L559.0,398.1L549.3,391.5L533.8,387.1L537.4,377.9L535.7,373.0L540.1,361.6L537.6,358.3L536.7,358.4L529.3,365.2L523.6,366.0L520.5,360.9L516.3,359.8L508.4,353.6L508.3,350.1L509.9,345.0L508.5,338.0L510.4,335.6L513.3,336.8L517.1,336.1L518.8,332.9L526.2,329.2L530.5,322.6L536.5,320.6L539.4,314.9L538.1,313.4L539.2,309.0L544.1,306.5L546.4,301.7L549.6,301.1L553.4,294.9L555.6,297.8L558.7,298.2L558.1,300.2L558.9,301.0L557.4,303.0L560.0,306.2L559.8,308.0L564.1,314.8L563.8,320.3L565.2,323.3L563.7,330.4L565.4,339.3L568.9,342.1L571.8,338.6L576.7,339.5Z"
}, {
  "id": "SIN",
  "nombre": "Sinaloa",
  "d": "M316.4,271.6L318.9,273.8L316.8,272.8L316.4,271.6ZM323.2,277.1L325.6,279.0L326.1,285.0L323.2,280.8L323.2,277.1ZM317.1,274.5L324.4,282.9L324.4,284.6L323.6,283.9L320.5,278.3L317.1,274.5ZM289.2,232.5L291.0,233.1L290.4,234.7L291.8,235.6L293.2,234.3L290.8,231.5L290.6,228.6L291.3,230.7L293.4,230.9L294.5,233.2L302.4,228.9L303.1,224.6L308.3,223.4L310.9,218.4L313.2,217.7L312.8,214.6L316.8,209.7L317.2,207.4L324.2,207.6L324.4,211.3L326.7,211.3L328.0,214.2L327.9,222.1L329.3,222.7L329.8,225.6L333.7,232.0L335.3,237.9L347.1,240.6L350.7,246.8L351.5,250.9L354.2,255.3L355.2,255.1L355.4,256.1L351.7,259.9L353.1,261.5L351.4,265.6L350.7,274.6L352.0,275.4L355.0,281.5L354.6,283.4L355.7,284.4L359.7,284.3L360.8,287.6L362.5,288.0L364.0,293.7L365.7,293.7L366.7,299.0L368.7,303.2L370.7,303.6L373.2,302.7L377.6,298.7L382.7,300.2L387.0,303.5L389.4,307.7L389.5,310.5L390.8,311.7L393.1,321.2L397.8,327.4L399.4,335.8L401.4,338.9L402.8,344.2L407.2,343.7L409.8,346.5L408.8,347.3L408.1,351.6L405.5,355.6L408.5,361.0L408.1,364.8L401.3,362.4L401.6,361.1L399.9,359.1L401.0,357.9L400.1,357.2L399.4,358.1L400.8,361.1L400.1,363.2L400.7,365.4L400.2,366.1L399.6,365.4L397.4,361.3L378.4,341.7L378.6,340.6L377.2,341.2L374.1,334.6L365.2,325.6L365.7,324.9L362.6,319.1L353.1,310.2L354.3,308.6L352.7,309.4L333.8,296.4L334.1,295.7L343.1,302.2L343.1,300.4L344.0,300.1L342.8,296.6L341.3,295.3L340.2,295.6L340.3,297.4L338.9,297.7L337.5,295.8L335.5,296.3L333.2,293.2L328.1,291.4L325.5,286.5L326.2,286.2L327.8,287.7L328.6,286.2L327.4,283.6L328.0,282.9L327.1,282.6L327.8,280.1L326.5,279.3L325.5,276.0L322.4,275.1L319.6,271.9L317.6,271.9L317.7,270.5L316.1,269.7L315.3,272.4L313.0,269.6L306.2,266.2L306.4,264.8L304.7,265.2L302.8,262.3L303.6,260.6L301.6,260.3L301.1,259.1L299.0,259.3L299.6,261.3L298.1,263.0L296.8,261.1L294.6,262.7L292.3,259.9L294.9,258.4L295.6,259.3L296.7,258.7L297.0,257.5L298.4,257.0L298.0,255.4L295.3,256.1L294.2,258.4L291.2,258.4L288.6,254.9L288.0,255.5L288.7,256.4L285.5,256.3L285.7,255.5L286.8,255.9L286.9,253.4L282.4,251.2L283.0,247.7L282.0,246.1L282.2,243.9L288.2,232.7L286.4,237.9L287.3,238.4L289.2,232.5Z"
}, {
  "id": "SON",
  "nombre": "Sonora",
  "d": "M192.2,128.5L192.5,131.9L195.0,136.2L192.4,145.3L191.4,146.1L186.6,144.1L182.8,141.5L185.7,138.8L185.2,134.7L186.1,130.9L186.8,129.8L188.5,130.1L192.2,128.5ZM245.4,195.5L247.2,198.3L245.3,197.2L245.4,195.5ZM303.2,51.6L304.5,53.0L303.3,54.6L306.4,62.7L305.8,66.6L303.8,66.7L303.7,67.4L307.2,70.8L307.3,73.9L308.6,75.1L307.9,78.1L309.3,80.0L311.7,89.3L310.4,93.5L312.3,95.2L309.9,106.1L311.8,108.0L312.9,116.5L312.8,119.8L311.6,122.2L312.0,129.4L309.8,130.9L309.7,134.3L307.8,135.9L308.0,143.7L306.3,148.8L307.3,151.2L306.8,154.9L308.7,157.2L311.6,158.3L310.8,159.8L305.2,163.0L301.4,161.2L296.3,162.9L295.0,164.6L297.2,166.8L296.5,170.3L299.3,172.1L301.9,175.9L302.4,178.0L301.5,181.1L305.7,184.1L309.8,193.7L308.3,199.9L308.9,204.2L307.9,205.4L312.4,207.7L314.9,206.9L317.2,207.4L316.8,209.7L312.8,214.6L313.2,217.7L310.9,218.4L308.8,222.8L303.1,224.6L302.4,228.9L294.5,233.2L293.4,230.9L291.3,230.7L290.6,228.6L290.8,230.5L290.0,231.2L286.8,224.7L280.7,217.6L279.3,217.1L278.2,219.5L274.4,220.0L270.3,217.5L269.1,215.9L266.9,206.1L264.7,204.4L262.5,205.5L254.9,203.1L249.3,198.4L249.3,195.3L246.9,194.6L245.7,191.9L245.6,187.3L244.5,186.3L246.4,184.1L245.5,183.9L246.2,182.5L245.0,181.0L245.4,179.6L247.4,178.1L246.2,177.1L238.8,175.7L238.3,174.6L236.2,176.1L236.7,178.2L234.0,176.4L233.7,174.6L232.0,174.2L230.3,175.2L227.2,173.0L224.0,170.0L222.3,166.2L218.4,161.7L218.3,159.9L210.3,156.4L208.6,151.7L203.6,147.0L203.0,145.4L204.3,144.6L205.0,146.1L205.8,144.5L200.2,142.0L198.1,138.7L195.7,138.0L196.4,137.1L195.4,134.1L196.0,132.8L194.8,130.5L193.9,130.4L194.6,128.1L193.8,125.8L188.5,124.8L188.0,123.1L189.2,119.5L182.8,111.1L180.2,104.6L177.6,103.7L178.0,100.6L176.7,92.5L174.3,90.1L174.2,86.2L172.8,83.8L169.9,81.1L167.0,76.0L165.5,70.8L167.8,62.9L166.6,57.1L163.1,55.4L162.7,54.3L161.2,55.0L149.9,51.9L148.9,45.8L141.7,41.4L139.5,41.0L138.8,41.9L139.3,43.2L137.5,44.3L136.9,45.8L133.3,45.7L129.4,43.9L119.3,36.0L115.0,35.1L113.8,33.6L106.7,29.9L105.5,28.7L106.9,19.1L105.3,15.9L107.5,13.4L109.1,8.5L111.2,9.0L112.2,8.4L230.5,51.8L303.2,51.6ZM117.8,35.9L118.9,36.1L118.8,36.9L117.0,36.4L117.8,35.9ZM113.1,33.6L117.0,37.2L117.3,39.5L116.3,38.7L113.0,36.9L113.1,33.6Z"
}, {
  "id": "TAB",
  "nombre": "Tabasco",
  "d": "M818.5,495.2L820.7,501.1L823.8,502.4L824.6,503.7L825.9,503.3L827.3,505.1L827.7,508.8L830.5,513.6L834.9,516.6L836.0,518.4L842.3,520.4L846.1,519.5L846.4,514.6L849.9,514.4L854.6,515.4L859.6,519.4L860.4,518.9L865.5,520.9L865.2,541.4L851.8,541.6L853.5,539.9L852.1,537.7L850.4,537.2L850.2,536.1L844.7,534.6L845.6,531.2L844.0,527.0L840.8,525.4L840.1,521.9L839.4,521.2L835.6,521.9L835.1,520.7L833.3,520.2L832.4,522.6L827.7,522.0L827.0,526.2L822.9,527.7L810.2,538.0L808.3,537.7L805.2,533.0L802.6,533.1L803.0,530.8L799.9,526.8L802.4,521.9L801.8,521.1L797.8,520.9L796.1,518.8L793.4,517.7L790.6,518.8L789.7,527.8L785.7,532.7L785.6,534.7L782.4,538.7L780.3,538.2L779.7,532.1L778.3,528.2L772.6,525.6L770.8,523.0L767.7,521.3L766.0,509.9L773.9,507.1L774.1,508.7L777.4,508.1L778.7,505.8L782.9,506.0L783.5,503.7L787.7,502.7L788.0,503.5L789.1,502.4L795.8,502.1L797.0,502.6L796.2,504.5L799.2,504.3L799.6,503.6L797.3,502.7L805.1,502.0L808.9,500.0L811.8,496.5L818.5,495.2ZM783.0,503.9L777.4,506.5L775.0,506.7L783.0,503.9Z"
}, {
  "id": "TAM",
  "nombre": "Tamaulipas",
  "d": "M661.1,270.5L661.7,270.7L658.1,279.5L658.0,276.6L661.1,270.5ZM650.2,373.7L647.6,375.5L643.7,370.6L638.5,368.4L637.6,366.8L634.4,367.1L634.2,368.9L631.7,369.5L628.6,367.9L617.2,369.9L614.9,368.4L614.0,369.4L606.2,369.2L601.3,360.9L597.4,358.8L596.4,357.2L594.4,357.5L593.6,359.4L586.7,358.1L580.1,355.2L580.0,345.9L578.0,343.5L576.6,336.8L578.4,335.8L581.5,336.4L581.3,330.6L583.5,327.1L584.4,323.5L587.3,322.0L591.4,322.7L593.6,321.4L594.5,319.4L597.4,319.9L596.4,317.0L594.7,316.0L592.9,311.4L590.7,308.7L591.8,300.1L590.2,296.8L587.6,296.6L588.1,294.5L594.6,290.6L596.2,287.9L598.4,288.0L601.8,284.0L602.7,285.8L604.1,285.2L604.7,283.2L607.0,282.2L607.5,280.1L605.9,276.8L609.7,273.3L611.1,274.8L614.6,275.1L616.8,271.0L622.3,270.0L624.6,268.4L627.9,265.8L630.5,261.4L626.2,259.2L626.4,246.4L625.2,243.3L618.7,243.4L615.4,245.3L614.2,244.7L611.8,240.9L607.7,240.4L606.2,238.9L607.3,238.5L606.6,235.1L604.0,235.9L602.6,232.6L600.8,232.7L598.5,229.6L596.9,224.3L594.5,224.0L593.5,221.6L591.5,221.6L590.5,220.5L591.4,214.8L589.2,213.0L587.3,213.0L587.1,211.6L588.2,208.6L590.2,206.8L589.7,202.8L588.3,201.3L588.2,196.5L586.6,195.4L588.1,193.6L587.8,192.3L582.2,191.6L583.1,188.4L586.6,187.4L589.1,184.8L590.9,185.1L591.0,186.0L593.1,185.7L595.8,188.5L595.3,190.7L596.8,191.4L595.1,197.6L596.4,197.8L596.2,199.0L598.0,199.8L598.0,207.8L603.0,213.6L606.5,221.8L606.6,224.8L609.1,227.0L608.5,228.6L609.7,229.9L610.7,229.3L613.4,229.9L613.5,230.7L618.3,230.9L622.2,234.9L629.6,236.0L631.4,238.4L637.3,242.0L638.0,241.3L638.9,242.1L641.1,241.4L642.4,242.4L644.1,241.5L649.7,241.7L650.0,242.6L654.1,243.1L658.7,247.8L661.7,249.4L663.6,249.1L663.4,247.0L664.3,246.2L670.6,245.4L669.0,256.5L661.9,270.6L660.9,270.3L663.2,266.3L662.3,265.6L662.8,264.8L658.4,262.2L657.1,263.6L658.9,264.9L657.6,266.9L658.5,268.7L657.5,269.1L657.1,267.3L656.0,268.1L655.6,265.9L653.4,266.2L652.3,267.2L652.9,268.3L651.2,269.6L654.0,272.7L651.4,279.5L654.5,281.2L651.7,284.0L652.6,286.3L651.9,290.1L652.8,291.3L651.7,296.6L650.7,296.0L650.9,294.2L648.0,295.4L648.2,297.4L650.3,301.2L651.4,298.2L650.8,310.4L649.7,310.1L649.6,310.8L650.7,311.3L650.8,320.3L651.9,320.9L651.0,324.4L651.6,325.4L652.0,321.6L651.0,334.1L650.9,352.4L646.8,361.7L648.1,362.7L647.6,367.5L650.2,373.7Z"
}, {
  "id": "TLA",
  "nombre": "Tlaxcala",
  "d": "M625.1,467.8L623.5,467.4L622.3,465.1L628.6,462.9L632.5,462.8L635.4,459.4L641.0,460.5L643.7,457.9L650.4,463.7L650.1,465.6L654.0,465.9L655.9,469.0L658.0,470.0L657.6,471.5L652.1,472.4L648.8,476.4L645.3,475.3L640.3,478.9L635.2,476.0L631.3,470.9L627.5,467.9L625.1,467.8Z"
}, {
  "id": "VER",
  "nombre": "Veracruz",
  "d": "M662.5,399.9L660.9,403.6L660.3,403.1L661.0,400.9L662.5,399.9ZM650.2,373.7L651.0,380.6L653.1,386.3L652.4,387.9L653.7,393.7L657.2,400.5L659.1,400.1L659.8,401.0L659.9,404.9L661.9,407.5L669.6,427.6L692.7,455.2L695.0,464.6L696.9,467.3L697.5,473.0L702.7,476.7L704.7,481.2L707.8,481.7L708.1,484.9L710.1,488.3L714.5,490.4L714.5,491.3L711.9,489.6L711.2,490.1L712.2,491.3L711.4,493.0L714.7,492.1L715.0,490.5L720.7,493.0L732.7,493.3L737.2,497.7L744.2,498.9L746.7,503.6L750.2,507.1L750.9,510.2L754.3,511.8L768.3,509.0L766.0,509.9L767.7,521.3L770.8,523.0L772.6,525.6L778.3,528.2L779.7,532.1L779.9,537.8L782.4,538.7L774.0,544.9L738.0,542.7L737.6,539.0L732.0,534.0L729.0,529.9L729.3,528.4L731.4,526.7L729.6,525.6L723.0,528.1L719.2,530.8L714.0,531.8L711.5,531.1L708.7,525.5L708.5,523.1L711.7,517.5L710.7,511.1L703.5,509.4L701.1,510.5L700.1,508.7L699.2,508.8L697.9,506.4L696.1,505.4L694.5,505.9L692.0,503.9L690.4,499.3L691.2,497.6L688.5,495.7L686.3,502.5L684.0,499.8L680.8,498.7L677.8,501.1L676.0,500.9L673.8,496.0L668.0,493.7L667.5,488.5L670.0,484.0L669.5,475.8L676.3,475.9L676.5,475.0L675.8,472.7L665.7,468.7L665.9,466.5L664.2,462.7L667.3,457.0L667.6,453.5L669.7,448.1L672.3,443.6L663.4,440.5L658.8,445.6L656.9,443.1L653.5,442.6L652.8,434.5L654.3,433.6L656.4,434.7L658.2,431.6L657.6,430.2L653.8,427.6L654.1,425.4L651.7,424.5L653.3,423.6L653.3,421.3L649.3,421.2L645.6,429.0L643.8,427.7L642.7,428.2L630.8,438.4L629.1,437.3L627.6,434.0L629.0,425.0L633.3,420.5L635.6,422.3L637.4,422.0L637.8,417.0L640.1,414.3L637.0,409.6L634.4,408.8L633.3,409.9L631.7,409.8L627.8,406.8L628.1,403.4L626.7,402.3L626.5,398.0L624.8,397.8L623.7,393.6L624.0,392.5L625.6,392.5L625.5,391.6L626.8,391.6L629.3,389.6L626.5,386.8L625.5,384.2L628.6,383.2L628.6,379.1L629.9,378.2L633.1,378.1L630.8,372.7L625.2,371.0L622.2,371.0L621.1,369.5L623.4,368.2L628.6,367.9L631.7,369.5L634.2,368.9L634.4,367.1L637.6,366.8L638.5,368.4L643.7,370.6L647.6,375.5L650.2,373.7ZM655.8,387.9L664.7,397.4L661.9,406.3L661.4,406.8L661.0,404.3L663.3,399.9L663.1,398.2L655.7,389.6L655.1,388.2L655.8,387.9Z"
}, {
  "id": "YUC",
  "nombre": "Yucatán",
  "d": "M974.2,399.7L974.7,406.5L973.4,408.5L972.8,412.5L974.3,417.8L970.9,426.9L959.7,435.2L955.9,435.6L954.4,434.4L953.0,435.1L951.1,438.6L951.4,441.4L949.8,439.3L948.5,439.3L946.9,442.8L937.1,447.3L934.7,449.3L935.0,450.2L932.7,449.8L930.9,451.7L926.3,452.2L921.5,455.4L917.0,455.6L914.9,461.7L913.4,456.7L909.4,452.2L907.9,449.0L902.4,445.3L901.5,442.4L898.2,439.2L896.4,434.5L895.8,434.1L893.7,436.5L892.5,435.2L890.6,435.4L889.3,432.9L884.1,432.2L884.3,423.0L883.3,422.6L885.0,417.2L891.5,412.1L901.9,407.6L933.1,402.7L939.4,400.3L940.1,398.5L947.1,397.0L951.2,397.4L955.7,395.0L960.3,397.0L964.8,397.3L966.8,399.1L974.2,399.7Z"
}, {
  "id": "ZAC",
  "nombre": "Zacatecas",
  "d": "M554.1,294.3L552.4,295.4L549.6,301.1L546.4,301.7L544.1,306.5L539.2,309.0L538.1,313.4L539.4,314.9L536.5,320.6L530.5,322.6L526.2,329.2L518.8,332.9L517.1,336.1L513.3,336.8L510.4,335.6L508.5,338.0L509.9,345.0L508.3,350.1L508.4,353.6L516.3,359.8L520.5,360.9L523.6,366.0L529.3,365.2L536.7,358.4L537.6,358.3L540.1,361.6L535.7,373.0L537.4,377.9L537.0,380.0L533.2,388.1L528.5,386.1L522.5,381.6L518.0,380.5L515.8,374.8L510.2,371.5L507.6,368.0L506.6,368.2L504.6,371.0L496.6,374.9L495.5,379.0L489.7,388.5L489.8,390.0L492.7,392.9L493.4,398.0L496.9,400.3L495.1,405.4L487.7,410.9L485.8,410.2L484.1,410.8L482.9,414.1L480.9,415.2L478.7,414.7L474.4,416.2L470.7,414.2L467.8,414.4L464.8,410.6L461.6,409.8L461.7,408.8L468.0,405.5L467.7,403.4L465.5,403.9L464.4,403.2L463.3,400.1L465.6,399.5L467.6,397.1L467.8,391.7L473.7,386.8L479.4,384.5L481.4,381.4L482.8,375.5L478.8,374.3L479.7,372.3L479.2,371.3L476.5,371.0L474.1,372.0L473.7,373.7L475.3,375.6L472.3,378.1L471.1,380.2L470.0,380.8L467.5,379.9L466.6,380.9L464.1,380.9L463.5,379.5L468.3,371.6L468.2,369.2L465.8,366.0L464.0,365.4L459.7,366.2L458.9,367.0L458.9,375.9L458.4,377.4L457.0,377.2L455.4,374.9L455.5,370.7L457.6,365.3L461.1,360.8L457.5,359.4L452.7,361.9L454.9,369.6L453.6,371.1L451.4,372.5L451.0,371.9L452.4,367.8L451.7,367.3L447.8,368.8L447.3,372.7L445.6,372.2L444.2,373.8L442.8,372.0L442.5,368.5L444.0,364.6L445.9,362.2L449.7,360.1L449.8,353.1L448.9,347.5L451.4,343.6L453.1,333.8L459.6,327.1L458.5,321.7L458.9,315.6L457.5,312.9L457.8,311.2L460.8,310.3L472.1,298.2L479.8,299.5L484.1,298.6L488.7,300.6L489.6,299.4L499.4,299.0L499.0,297.1L500.2,296.5L498.9,291.4L497.4,290.8L498.4,284.6L493.9,280.3L493.6,275.8L501.2,273.8L513.1,274.6L519.5,278.0L524.6,284.0L528.0,283.9L528.7,288.4L532.3,288.4L536.4,286.6L540.1,287.1L541.7,288.2L545.8,294.6L548.5,295.6L551.5,293.8L554.1,294.3Z"
}];
Object.assign(__ds_scope, { mxViewBox, mxEstados });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graficas/mxEstados.js", error: String((e && e.message) || e) }); }

// components/graficas/MapaEstados.jsx
try { (() => {
const {
  useMemo,
  useRef,
  useState
} = React;
function MapaEstados({
  valores = {},
  escala = "secuencial",
  dominio,
  promedio,
  rango = 10,
  formato = v => `${v.toFixed(1)}%`,
  seleccionado,
  onSeleccionar,
  etiquetaLeyenda = "% de jóvenes de 18 a 29 años que votó",
  mostrarLeyenda = true,
  style
}) {
  const ref = useRef();
  const [hover, setHover] = useState(null);
  const vals = Object.values(valores).filter(v => typeof v === "number");
  const [mn, mx] = dominio || [Math.min(...vals), Math.max(...vals)];
  const prom = promedio ?? vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
  const paso = v => {
    if (typeof v !== "number") return null;
    if (escala === "divergente") return Math.max(0, Math.min(8, Math.round((v - prom) / rango * 4) + 4));
    return Math.max(0, Math.min(8, Math.floor((v - mn) / (mx - mn || 1) * 9)));
  };
  const pref = escala === "divergente" ? "--color-divergente-" : "--color-escala-";
  const orden = useMemo(() => {
    const a = [...__ds_scope.mxEstados];
    const k = hover?.id || seleccionado;
    if (k) a.sort((x, y) => (x.id === k) - (y.id === k));
    return a;
  }, [hover, seleccionado]);
  const mover = (e, est) => {
    const r = ref.current.getBoundingClientRect();
    setHover({
      id: est.id,
      x: e.clientX - r.left,
      y: e.clientY - r.top,
      w: r.width
    });
  };
  const actual = hover && __ds_scope.mxEstados.find(s => s.id === hover.id);
  const v = actual ? valores[actual.id] : null;
  const diff = typeof v === "number" ? v - prom : null;
  return React.createElement("figure", {
    style: {
      margin: 0,
      ...style
    }
  }, React.createElement("div", {
    ref,
    style: {
      position: "relative"
    },
    onPointerLeave: () => setHover(null)
  }, React.createElement("svg", {
    viewBox: __ds_scope.mxViewBox,
    width: "100%",
    role: "img",
    "aria-label": "Mapa de México por estado",
    style: {
      display: "block",
      overflow: "visible",
      touchAction: "manipulation"
    }
  }, orden.map(s => {
    const p = paso(valores[s.id]);
    const act = hover?.id === s.id;
    const sel = seleccionado === s.id;
    return React.createElement("path", {
      key: s.id,
      d: s.d,
      tabIndex: 0,
      "aria-label": `${s.nombre}: ${typeof valores[s.id] === "number" ? formato(valores[s.id]) : "sin dato"}`,
      fill: p == null ? "var(--color-superficie-alta)" : `var(${pref}${p})`,
      stroke: sel ? "var(--color-foco-encendido)" : act ? "var(--color-texto)" : "var(--color-fondo)",
      strokeWidth: sel ? 3 : act ? 2 : 0.8,
      strokeLinejoin: "round",
      style: {
        cursor: "pointer",
        outline: "none",
        transition: "stroke var(--duration-instante) var(--ease-entrada)"
      },
      onPointerMove: e => mover(e, s),
      onPointerDown: e => mover(e, s),
      onClick: () => onSeleccionar && onSeleccionar(s.id),
      onFocus: e => {
        const r = ref.current.getBoundingClientRect(),
          b = e.target.getBoundingClientRect();
        setHover({
          id: s.id,
          x: b.left - r.left + b.width / 2,
          y: b.top - r.top + b.height / 2,
          w: r.width
        });
      },
      onBlur: () => setHover(null)
    });
  })), actual ? React.createElement("div", {
    role: "status",
    style: {
      position: "absolute",
      left: hover.x,
      top: hover.y,
      pointerEvents: "none",
      zIndex: 2,
      transform: `translate(${hover.x > hover.w * 0.6 ? "calc(-100% - 14px)" : "14px"}, calc(-100% - 10px))`,
      minWidth: 150,
      maxWidth: 220,
      padding: "10px 12px",
      background: "var(--color-superficie-alta)",
      border: "1px solid var(--color-linea)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-tooltip)",
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, React.createElement("span", {
    style: {
      fontFamily: "var(--font-titulo)",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 1.2,
      color: "var(--color-texto)"
    }
  }, actual.nombre), React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 22,
      fontWeight: 500,
      color: "var(--color-acento-texto)",
      fontVariantNumeric: "tabular-nums"
    }
  }, typeof v === "number" ? formato(v) : "Sin dato"), diff != null ? React.createElement("span", {
    style: {
      fontFamily: "var(--font-texto)",
      fontSize: 13,
      lineHeight: 1.35,
      color: "var(--color-texto-2)"
    }
  }, Math.abs(diff) < 0.05 ? "Igual al promedio" : `${Math.abs(diff).toFixed(1)} pts ${diff > 0 ? "arriba" : "abajo"} del promedio`) : null) : null), mostrarLeyenda ? React.createElement("figcaption", {
    style: {
      marginTop: 14,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      maxWidth: 360
    }
  }, React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--color-texto-2)"
    }
  }, etiquetaLeyenda), React.createElement("div", {
    style: {
      display: "flex",
      height: 12,
      borderRadius: 2,
      overflow: "hidden"
    }
  }, Array.from({
    length: 9
  }, (_, i) => React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      background: `var(${pref}${i})`
    }
  }))), React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--color-texto-3)"
    }
  }, escala === "divergente" ? [React.createElement("span", {
    key: 0
  }, `−${rango} pts`), React.createElement("span", {
    key: 1
  }, "promedio"), React.createElement("span", {
    key: 2
  }, `+${rango} pts`)] : [React.createElement("span", {
    key: 0
  }, formato(mn)), React.createElement("span", {
    key: 2
  }, formato(mx))])) : null);
}
Object.assign(__ds_scope, { MapaEstados });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/graficas/MapaEstados.jsx", error: String((e && e.message) || e) }); }

// components/iconos/lucide.js
try { (() => {
// Trazos copiados de lucide-static@0.460.0 (ISC). No editar a mano.
const lucidePaths = {
  "x": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />",
  "check": "<path d=\"M20 6 9 17l-5-5\" />",
  "circle-alert": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><line x1=\"12\" x2=\"12\" y1=\"8\" y2=\"12\" /><line x1=\"12\" x2=\"12.01\" y1=\"16\" y2=\"16\" />",
  "info": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 16v-4\" /><path d=\"M12 8h.01\" />",
  "chevron-down": "<path d=\"m6 9 6 6 6-6\" />",
  "chevron-left": "<path d=\"m15 18-6-6 6-6\" />",
  "chevron-right": "<path d=\"m9 18 6-6-6-6\" />",
  "arrow-right": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />",
  "arrow-down": "<path d=\"M12 5v14\" /><path d=\"m19 12-7 7-7-7\" />",
  "download": "<path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><polyline points=\"7 10 12 15 17 10\" /><line x1=\"12\" x2=\"12\" y1=\"15\" y2=\"3\" />",
  "share-2": "<circle cx=\"18\" cy=\"5\" r=\"3\" /><circle cx=\"6\" cy=\"12\" r=\"3\" /><circle cx=\"18\" cy=\"19\" r=\"3\" /><line x1=\"8.59\" x2=\"15.42\" y1=\"13.51\" y2=\"17.49\" /><line x1=\"15.41\" x2=\"8.59\" y1=\"6.51\" y2=\"10.49\" />",
  "printer": "<path d=\"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2\" /><path d=\"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6\" /><rect x=\"6\" y=\"14\" width=\"12\" height=\"8\" rx=\"1\" />",
  "map-pin": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />",
  "search": "<circle cx=\"11\" cy=\"11\" r=\"8\" /><path d=\"m21 21-4.3-4.3\" />",
  "rotate-ccw": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\" /><path d=\"M3 3v5h5\" />",
  "pencil": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\" /><path d=\"m15 5 4 4\" />",
  "minus": "<path d=\"M5 12h14\" />",
  "plus": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />",
  "external-link": "<path d=\"M15 3h6v6\" /><path d=\"M10 14 21 3\" /><path d=\"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6\" />",
  "link": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\" /><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\" />",
  "copy": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\" /><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\" />",
  "circle-help": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\" /><path d=\"M12 17h.01\" />"
};
Object.assign(__ds_scope, { lucidePaths });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/iconos/lucide.js", error: String((e && e.message) || e) }); }

// components/iconos/Icono.jsx
try { (() => {
function Icono({
  nombre,
  tamano = 20,
  grosor = 1.75,
  titulo,
  style,
  ...rest
}) {
  const inner = __ds_scope.lucidePaths[nombre];
  if (!inner) return null;
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: tamano,
    height: tamano,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: grosor,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: titulo ? "img" : undefined,
    "aria-label": titulo,
    "aria-hidden": titulo ? undefined : true,
    style: {
      flex: "none",
      display: "block",
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: (titulo ? `<title>${titulo}</title>` : "") + inner
    },
    ...rest
  });
}
Object.assign(__ds_scope, { Icono });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/iconos/Icono.jsx", error: String((e && e.message) || e) }); }

// components/acciones/Toast.jsx
try { (() => {
const {
  useEffect,
  useState
} = React;
const iconos = {
  info: "info",
  exito: "check",
  alerta: "circle-alert"
};
function Toast({
  tono = "info",
  mensaje,
  accion,
  onCerrar,
  flotante = false,
  duracion = 0,
  children,
  style
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(r);
  }, []);
  useEffect(() => {
    if (!duracion || !onCerrar) return;
    const t = setTimeout(onCerrar, duracion);
    return () => clearTimeout(t);
  }, [duracion, onCerrar]);
  const color = tono === "alerta" ? "var(--color-alerta)" : tono === "exito" ? "var(--color-foco-encendido)" : "var(--color-texto-2)";
  return React.createElement("div", {
    role: tono === "alerta" ? "alert" : "status",
    "aria-live": tono === "alerta" ? "assertive" : "polite",
    style: {
      position: flotante ? "fixed" : "relative",
      left: flotante ? 16 : undefined,
      right: flotante ? 16 : undefined,
      bottom: flotante ? "calc(16px + env(safe-area-inset-bottom, 0px))" : undefined,
      zIndex: flotante ? 50 : undefined,
      maxWidth: 440,
      margin: flotante ? "0 auto" : undefined,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 12px 12px 16px",
      minHeight: 52,
      background: "var(--color-superficie-alta)",
      color: "var(--color-texto)",
      border: "1px solid var(--color-linea)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-flotante)",
      fontFamily: "var(--font-texto)",
      fontSize: 16,
      lineHeight: 1.35,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity var(--duration-media) var(--ease-entrada), transform var(--duration-media) var(--ease-entrada)",
      ...style
    }
  }, React.createElement("span", {
    style: {
      color,
      display: "flex"
    }
  }, React.createElement(__ds_scope.Icono, {
    nombre: iconos[tono],
    tamano: 20
  })), React.createElement("span", {
    style: {
      flex: 1,
      textWrap: "pretty"
    }
  }, mensaje ?? children), accion ? React.createElement("button", {
    type: "button",
    onClick: accion.onClick,
    style: {
      background: "none",
      border: 0,
      padding: "0 8px",
      minHeight: 44,
      color: "var(--color-acento-texto)",
      font: "inherit",
      fontWeight: 700,
      cursor: "pointer",
      textDecoration: "underline",
      textUnderlineOffset: "0.2em"
    }
  }, accion.etiqueta) : null, onCerrar ? React.createElement("button", {
    type: "button",
    "aria-label": "Cerrar",
    onClick: onCerrar,
    style: {
      background: "none",
      border: 0,
      width: 44,
      height: 44,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--color-texto-2)",
      cursor: "pointer",
      borderRadius: "var(--radius-sm)"
    }
  }, React.createElement(__ds_scope.Icono, {
    nombre: "x",
    tamano: 18
  })) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/acciones/Toast.jsx", error: String((e && e.message) || e) }); }

// components/formularios/SelectorEstadoMunicipio.jsx
try { (() => {
const {
  useState
} = React;
const campoEstilos = {
  etiqueta: {
    fontFamily: "var(--font-texto)",
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.3,
    color: "var(--color-texto)"
  },
  ayuda: {
    fontFamily: "var(--font-texto)",
    fontSize: "var(--text-nota)",
    lineHeight: "var(--text-nota--line-height)",
    color: "var(--color-texto-2)"
  },
  error: {
    fontFamily: "var(--font-texto)",
    fontSize: "var(--text-nota)",
    lineHeight: "var(--text-nota--line-height)",
    color: "var(--color-alerta)",
    display: "flex",
    gap: 6,
    alignItems: "center"
  },
  control: (foco, error, disabled) => ({
    width: "100%",
    boxSizing: "border-box",
    height: 52,
    padding: "0 44px 0 14px",
    appearance: "none",
    WebkitAppearance: "none",
    background: disabled ? "transparent" : "var(--color-superficie)",
    color: disabled ? "var(--color-texto-3)" : "var(--color-texto)",
    border: `1.5px solid ${error ? "var(--color-alerta)" : foco ? "var(--color-foco-encendido)" : "var(--color-linea)"}`,
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-texto)",
    fontSize: 17,
    outline: "none",
    boxShadow: foco && !error ? "0 0 0 3px rgb(255 181 71 / 0.18)" : "none",
    transition: "border-color var(--duration-instante) var(--ease-entrada), box-shadow var(--duration-instante) var(--ease-entrada)",
    cursor: disabled ? "not-allowed" : "pointer"
  })
};
function Selecto({
  id,
  etiqueta,
  valor,
  opciones,
  placeholder,
  onChange,
  disabled
}) {
  const [foco, setFoco] = useState(false);
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      flex: 1,
      minWidth: 0
    }
  }, React.createElement("label", {
    htmlFor: id,
    style: {
      ...campoEstilos.etiqueta,
      color: disabled ? "var(--color-texto-3)" : "var(--color-texto)"
    }
  }, etiqueta), React.createElement("div", {
    style: {
      position: "relative"
    }
  }, React.createElement("select", {
    id,
    value: valor || "",
    disabled,
    onChange: e => onChange(e.target.value),
    onFocus: () => setFoco(true),
    onBlur: () => setFoco(false),
    style: campoEstilos.control(foco, false, disabled)
  }, React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), opciones.map(o => React.createElement("option", {
    key: o.id,
    value: o.id
  }, o.nombre))), React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: "absolute",
      right: 14,
      top: 16,
      pointerEvents: "none",
      color: "var(--color-texto-2)"
    }
  }, React.createElement(__ds_scope.Icono, {
    nombre: "chevron-down",
    tamano: 20
  }))));
}
function SelectorEstadoMunicipio({
  estados = [],
  estado,
  municipio,
  onCambiar = () => {},
  direccion = "columna",
  style
}) {
  const est = estados.find(e => e.id === estado);
  const munis = (est?.municipios || []).map(m => typeof m === "string" ? {
    id: m,
    nombre: m
  } : m);
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: direccion === "fila" ? "row" : "column",
      gap: 16,
      ...style
    }
  }, React.createElement(Selecto, {
    id: "sel-estado",
    etiqueta: "Estado",
    valor: estado,
    opciones: estados,
    placeholder: "Elige tu estado",
    onChange: v => onCambiar({
      estado: v,
      municipio: undefined
    })
  }), React.createElement(Selecto, {
    id: "sel-municipio",
    etiqueta: "Municipio o alcaldía",
    valor: municipio,
    opciones: munis,
    placeholder: est ? "Elige tu municipio" : "Primero elige un estado",
    disabled: !est,
    onChange: v => onCambiar({
      estado,
      municipio: v
    })
  }));
}
Object.assign(__ds_scope, { campoEstilos, SelectorEstadoMunicipio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/formularios/SelectorEstadoMunicipio.jsx", error: String((e && e.message) || e) }); }

// components/formularios/CampoEdad.jsx
try { (() => {
const {
  useState
} = React;
function CampoEdad({
  valor,
  onCambiar = () => {},
  min = 18,
  max = 99,
  etiqueta = "Tu edad",
  ayuda = "Solo la usamos para ubicar a tu generación.",
  error,
  id = "campo-edad",
  style
}) {
  const [foco, setFoco] = useState(false);
  const n = valor === "" || valor == null ? null : Number(valor);
  const fuera = n != null && (n < min || n > max);
  const msg = error || (fuera ? `Escribe una edad entre ${min} y ${max} años.` : null);
  const btn = (nombre, delta, label) => React.createElement("button", {
    type: "button",
    "aria-label": label,
    onClick: () => onCambiar(Math.max(min, Math.min(max, (n ?? (delta > 0 ? min - 1 : min + 1)) + delta))),
    style: {
      width: 52,
      height: 52,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--color-superficie)",
      color: "var(--color-texto)",
      border: "1.5px solid var(--color-linea)",
      borderRadius: "var(--radius-sm)",
      cursor: "pointer"
    }
  }, React.createElement(__ds_scope.Icono, {
    nombre,
    tamano: 20
  }));
  return React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...style
    }
  }, React.createElement("label", {
    htmlFor: id,
    style: __ds_scope.campoEstilos.etiqueta
  }, etiqueta), React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, btn("minus", -1, "Restar un año"), React.createElement("input", {
    id,
    type: "text",
    inputMode: "numeric",
    pattern: "[0-9]*",
    autoComplete: "off",
    maxLength: 2,
    value: valor ?? "",
    "aria-invalid": !!msg,
    "aria-describedby": id + "-ayuda",
    onChange: e => {
      const t = e.target.value.replace(/\D/g, "");
      onCambiar(t === "" ? "" : Number(t));
    },
    onFocus: () => setFoco(true),
    onBlur: () => setFoco(false),
    style: {
      ...__ds_scope.campoEstilos.control(foco, !!msg, false),
      padding: "0 14px",
      textAlign: "center",
      fontFamily: "var(--font-mono)",
      fontSize: 22,
      fontWeight: 500,
      cursor: "text",
      flex: 1,
      minWidth: 0
    }
  }), btn("plus", 1, "Sumar un año")), React.createElement("span", {
    id: id + "-ayuda",
    style: msg ? __ds_scope.campoEstilos.error : __ds_scope.campoEstilos.ayuda
  }, msg ? [React.createElement(__ds_scope.Icono, {
    key: "i",
    nombre: "circle-alert",
    tamano: 16
  }), msg] : ayuda));
}
Object.assign(__ds_scope, { CampoEdad });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/formularios/CampoEdad.jsx", error: String((e && e.message) || e) }); }

// components/formularios/SelectorSexo.jsx
try { (() => {
const def = [{
  id: "mujer",
  nombre: "Mujer"
}, {
  id: "hombre",
  nombre: "Hombre"
}, {
  id: "nd",
  nombre: "Prefiero no decir"
}];
function SelectorSexo({
  valor,
  onCambiar = () => {},
  opciones = def,
  etiqueta = "Sexo",
  ayuda = "Los datos del INE solo distinguen mujeres y hombres.",
  nombre = "sexo",
  style
}) {
  return React.createElement("fieldset", {
    style: {
      border: 0,
      margin: 0,
      padding: 0,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...style
    }
  }, React.createElement("legend", {
    style: {
      ...__ds_scope.campoEstilos.etiqueta,
      padding: 0,
      marginBottom: 8
    }
  }, etiqueta), React.createElement("div", {
    role: "radiogroup",
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8
    }
  }, opciones.map(o => {
    const sel = valor === o.id;
    return React.createElement("label", {
      key: o.id,
      style: {
        position: "relative",
        flex: "1 1 auto",
        minHeight: 48,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxSizing: "border-box",
        background: sel ? "var(--color-superficie-alta)" : "var(--color-superficie)",
        color: sel ? "var(--color-texto)" : "var(--color-texto-2)",
        border: `1.5px solid ${sel ? "var(--color-foco-encendido)" : "var(--color-linea)"}`,
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-texto)",
        fontSize: 16,
        fontWeight: sel ? 700 : 400,
        cursor: "pointer",
        transition: "border-color var(--duration-instante) var(--ease-entrada), background-color var(--duration-instante) var(--ease-entrada)"
      }
    }, React.createElement("input", {
      type: "radio",
      name: nombre,
      value: o.id,
      checked: sel,
      onChange: () => onCambiar(o.id),
      style: {
        position: "absolute",
        opacity: 0,
        inset: 0,
        margin: 0,
        cursor: "pointer"
      }
    }), React.createElement("span", {
      "aria-hidden": true,
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: sel ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)",
        boxShadow: sel ? "var(--shadow-halo)" : "none"
      }
    }), o.nombre);
  })), ayuda ? React.createElement("span", {
    style: __ds_scope.campoEstilos.ayuda
  }, ayuda) : null);
}
Object.assign(__ds_scope, { SelectorSexo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/formularios/SelectorSexo.jsx", error: String((e && e.message) || e) }); }

// components/narrativa/CampoLuces.jsx
try { (() => {
const {
  useMemo
} = React;
function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => {
    s = s * 16807 % 2147483647;
    return s / 2147483647;
  };
}
let _poligonos = null;
function poligonos() {
  if (_poligonos) return _poligonos;
  _poligonos = [];
  for (const e of __ds_scope.mxEstados) for (const anillo of e.d.split("Z")) {
    if (!anillo) continue;
    const pts = anillo.replace("M", "").split("L").map(p => p.split(",").map(Number));
    let x0 = 1e9,
      y0 = 1e9,
      x1 = -1e9,
      y1 = -1e9,
      a = 0;
    pts.forEach(([x, y], i) => {
      x0 = Math.min(x0, x);
      x1 = Math.max(x1, x);
      y0 = Math.min(y0, y);
      y1 = Math.max(y1, y);
      const [nx, ny] = pts[(i + 1) % pts.length];
      a += x * ny - nx * y;
    });
    _poligonos.push({
      pts,
      x0,
      y0,
      x1,
      y1,
      area: Math.abs(a / 2)
    });
  }
  return _poligonos;
}
function dentro(x, y) {
  for (const p of poligonos()) {
    if (x < p.x0 || x > p.x1 || y < p.y0 || y > p.y1) continue;
    let c = false;
    const v = p.pts;
    for (let i = 0, j = v.length - 1; i < v.length; j = i++) if (v[i][1] > y !== v[j][1] > y && x < (v[j][0] - v[i][0]) * (y - v[i][1]) / (v[j][1] - v[i][1]) + v[i][0]) c = !c;
    if (c) return true;
  }
  return false;
}
const _cache = {};
function puntosMexico(total) {
  if (_cache[total]) return _cache[total];
  const area = poligonos().reduce((s, p) => s + p.area, 0);
  const [,, W, H] = __ds_scope.mxViewBox.split(" ").map(Number);
  let paso = Math.sqrt(area / total / 0.866),
    mejor = null;
  for (let k = 0; k < 6; k++) {
    const pts = [];
    const dy = paso * 0.866;
    for (let f = 0, y = dy / 2; y < H; f++, y += dy) for (let x = f % 2 ? paso : paso / 2; x < W; x += paso) if (dentro(x, y)) pts.push([x, y]);
    mejor = {
      pts,
      paso
    };
    if (Math.abs(pts.length - total) / total < 0.04) break;
    paso *= Math.sqrt(pts.length / total);
  }
  return _cache[total] = mejor;
}
function CampoLuces({
  forma = "mexico",
  total = 400,
  proporcion = 0.61,
  encendidas,
  columnas = 20,
  radio = 4,
  separacion = 7,
  semilla = 1,
  orden = "azar",
  halo = true,
  animar = true,
  mostrarMapa = true,
  colorEncendida = "var(--color-foco-encendido)",
  colorApagada = "var(--color-foco-apagado)",
  colorMapa = "var(--color-superficie)",
  colorBordes = "var(--color-linea)",
  etiqueta,
  style
}) {
  const geo = useMemo(() => {
    if (forma !== "mexico") {
      const paso = radio * 2 + separacion;
      const pts = Array.from({
        length: total
      }, (_, i) => [i % columnas * paso + radio, Math.floor(i / columnas) * paso + radio]);
      const w = columnas * paso - separacion,
        h = Math.ceil(total / columnas) * paso - separacion;
      return {
        pts,
        r: radio,
        viewBox: `${-radio * 1.2} ${-radio * 1.2} ${w + radio * 2.4} ${h + radio * 2.4}`
      };
    }
    const {
      pts,
      paso
    } = puntosMexico(total);
    return {
      pts,
      r: paso * 0.24,
      viewBox: __ds_scope.mxViewBox,
      mapa: true
    };
  }, [forma, total, columnas, radio, separacion]);
  const N = geo.pts.length;
  const rangos = useMemo(() => {
    const r = rng(semilla);
    const idx = Array.from({
      length: N
    }, (_, i) => i);
    if (orden === "azar") for (let i = N - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const rank = new Array(N);
    idx.forEach((v, k) => {
      rank[v] = k;
    });
    return rank;
  }, [N, semilla, orden]);
  const n = encendidas != null ? Math.round(encendidas / total * N) : Math.round(N * proporcion);
  const R = geo.r;
  const hijos = [];
  if (geo.mapa && mostrarMapa) hijos.push(React.createElement("g", {
    key: "mapa",
    "aria-hidden": true
  }, __ds_scope.mxEstados.map(e => React.createElement("path", {
    key: e.id,
    d: e.d,
    fill: colorMapa,
    stroke: colorBordes,
    strokeWidth: 0.8,
    strokeLinejoin: "round"
  }))));
  geo.pts.forEach(([cx, cy], i) => {
    const on = rangos[i] < n;
    const delay = animar ? `calc(var(--duration-escalonado) * ${Math.abs(rangos[i] - n) % 160})` : "0ms";
    const tr = animar ? `fill var(--duration-larga) var(--ease-apagado) ${delay}, opacity var(--duration-larga) var(--ease-apagado) ${delay}` : "none";
    if (halo) hijos.push(React.createElement("circle", {
      key: "h" + i,
      cx,
      cy,
      r: R * 2.1,
      fill: colorEncendida,
      style: {
        opacity: on ? 0.16 : 0,
        transition: tr
      }
    }));
    hijos.push(React.createElement("circle", {
      key: i,
      cx,
      cy,
      r: R,
      style: {
        fill: on ? colorEncendida : colorApagada,
        transition: tr
      }
    }));
  });
  return React.createElement("svg", {
    viewBox: geo.viewBox,
    width: "100%",
    role: "img",
    "aria-label": etiqueta || `${n} de ${N} luces encendidas`,
    style: {
      display: "block",
      overflow: "visible",
      ...style
    }
  }, hijos);
}
Object.assign(__ds_scope, { CampoLuces });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrativa/CampoLuces.jsx", error: String((e && e.message) || e) }); }

// components/compartir/TarjetaWrapped.jsx
try { (() => {
const W = 1080,
  H = 1920;
const t = n => ({
  fontSize: `var(--text-wrapped-${n})`,
  lineHeight: `var(--text-wrapped-${n}--line-height)`,
  letterSpacing: `var(--text-wrapped-${n}--letter-spacing)`
});
const tit = {
  fontFamily: "var(--font-titulo)",
  fontWeight: 700,
  fontStretch: "82%",
  margin: 0,
  textWrap: "balance"
};
const cuerpo = {
  fontFamily: "var(--font-texto)",
  ...t("cuerpo"),
  color: "var(--color-texto)",
  margin: 0,
  textWrap: "pretty"
};
const eti = {
  fontFamily: "var(--font-mono)",
  ...t("etiqueta"),
  textTransform: "uppercase",
  fontWeight: 500,
  color: "var(--color-texto-2)"
};
const pct = v => `${Number(v).toFixed(1)}%`;
const h = React.createElement;
function Cifra({
  v,
  color = "var(--color-luz)",
  size
}) {
  return h("div", {
    style: {
      ...tit,
      ...t("cifra"),
      fontSize: size || "var(--text-wrapped-cifra)",
      color,
      display: "flex",
      alignItems: "baseline",
      fontVariantNumeric: "tabular-nums"
    }
  }, Number(v).toFixed(1), h("span", {
    style: {
      fontSize: "0.42em",
      marginLeft: 8
    }
  }, "%"));
}
const contenidos = {
  municipio: d => [h("span", {
    key: "a",
    style: {
      ...eti,
      color: "var(--color-luz)"
    }
  }, `Tu municipio · ${d.anio ?? 2024}`), h("h2", {
    key: "b",
    style: {
      ...tit,
      ...t("titulo"),
      color: "var(--color-texto)"
    }
  }, d.municipio ?? "Zapopan"), h(Cifra, {
    key: "c",
    v: d.valor ?? 54.2
  }), h("p", {
    key: "d",
    style: cuerpo
  }, `de las personas de 18 a 29 años en ${d.municipio ?? "Zapopan"} votó en ${d.anio ?? 2024}.`), h("div", {
    key: "e",
    style: {
      marginTop: "auto",
      width: 888
    }
  }, h(__ds_scope.CampoLuces, {
    total: 240,
    proporcion: (d.valor ?? 54.2) / 100,
    animar: false,
    colorMapa: "var(--color-noche-2)",
    colorBordes: "var(--color-noche-linea)",
    colorEncendida: "var(--color-luz)",
    colorApagada: "var(--color-apagada)"
  }))],
  edad: d => {
    const fila = (lab, v, k) => h("div", {
      key: k,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 24
      }
    }, h("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
      }
    }, h("span", {
      style: eti
    }, lab), h("span", {
      style: {
        ...tit,
        fontSize: 120,
        lineHeight: 1,
        color: "var(--color-luz)",
        fontVariantNumeric: "tabular-nums"
      }
    }, pct(v))), h(__ds_scope.CampoLuces, {
      forma: "rejilla",
      total: 50,
      encendidas: Math.round(v / 2),
      columnas: 25,
      radio: 13,
      separacion: 21,
      animar: false,
      halo: false,
      colorEncendida: "var(--color-luz)",
      colorApagada: "var(--color-apagada)"
    }));
    return [h("span", {
      key: "a",
      style: {
        ...eti,
        color: "var(--color-luz)"
      }
    }, "Por edad · 2024"), h("h2", {
      key: "b",
      style: {
        ...tit,
        ...t("titulo"),
        color: "var(--color-texto)"
      }
    }, `A tus ${d.edad ?? 24} años, se vota menos que a los 18`), h("div", {
      key: "c",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 80,
        marginTop: 40
      }
    }, fila("A los 18 años", d.valor18 ?? 61, "f1"), fila(`A los ${d.edad ?? 24} años`, d.valorEdad ?? 47.6, "f2")), h("p", {
      key: "d",
      style: {
        ...cuerpo,
        marginTop: "auto",
        color: "var(--color-texto-2)"
      }
    }, "Cada punto son dos de cada cien personas.")];
  },
  generacion: d => {
    const pts = d.puntos ?? [{
      anio: 2012,
      edad: 18,
      valor: 66.7
    }, {
      anio: 2018,
      edad: 24,
      valor: 52.1
    }, {
      anio: 2024,
      edad: 30,
      valor: 50.3
    }];
    return [h("span", {
      key: "a",
      style: {
        ...eti,
        color: "var(--color-luz)"
      }
    }, d.antetitulo ?? "Tu generación · 18 años en 2012"), h("h2", {
      key: "b",
      style: {
        ...tit,
        ...t("titulo"),
        color: "var(--color-texto)"
      }
    }, d.titulo ?? "Así se fue apagando tu generación"), h("div", {
      key: "c",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 64,
        marginTop: 80
      }
    }, pts.map((p, i) => h("div", {
      key: i,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 20
      }
    }, h("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline"
      }
    }, h("span", {
      style: eti
    }, `${p.anio} · ${p.edad} años`), h("span", {
      style: {
        ...tit,
        fontSize: 150,
        lineHeight: 0.9,
        color: i === 0 ? "var(--color-luz)" : "var(--color-texto)",
        fontVariantNumeric: "tabular-nums"
      }
    }, pct(p.valor))), h("div", {
      style: {
        height: 20,
        background: "var(--color-noche-3)",
        borderRadius: 2
      }
    }, h("div", {
      style: {
        height: "100%",
        width: `${p.valor}%`,
        background: i === 0 ? "var(--color-luz)" : `var(--color-seq-${7 - i * 2})`,
        borderRadius: 2
      }
    }))))), h("p", {
      key: "d",
      style: {
        ...cuerpo,
        marginTop: "auto"
      }
    }, d.texto ?? "Nunca volvió a votar como la primera vez.")];
  },
  secciones: d => {
    const lado = (lab, s, k) => h("div", {
      key: k,
      style: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 28
      }
    }, h("span", {
      style: eti
    }, lab), h("span", {
      style: {
        ...tit,
        fontSize: 150,
        lineHeight: 0.9,
        color: k === "a" ? "var(--color-luz)" : "var(--color-texto-2)"
      }
    }, `${Math.round(s.valor)}%`), h("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 30,
        color: "var(--color-texto-2)"
      }
    }, `Sección ${s.id}`), h(__ds_scope.CampoLuces, {
      forma: "rejilla",
      total: 100,
      encendidas: Math.round(s.valor),
      columnas: 10,
      radio: 11,
      separacion: 13,
      animar: false,
      halo: false,
      colorEncendida: "var(--color-luz)",
      colorApagada: "var(--color-apagada)"
    }));
    return [h("span", {
      key: "a",
      style: {
        ...eti,
        color: "var(--color-luz)"
      }
    }, `Secciones · ${d.municipio ?? "Zapopan"}`), h("h2", {
      key: "b",
      style: {
        ...tit,
        ...t("titulo"),
        color: "var(--color-texto)"
      }
    }, "En el mismo municipio, calles que votan distinto"), h("div", {
      key: "c",
      style: {
        display: "flex",
        gap: 64,
        marginTop: 80
      }
    }, lado("La más encendida", d.alta ?? {
      id: "1482",
      valor: 72
    }, "a"), lado("La más apagada", d.baja ?? {
      id: "1530",
      valor: 31
    }, "b")), h("p", {
      key: "d",
      style: {
        ...cuerpo,
        marginTop: "auto",
        color: "var(--color-texto-2)"
      }
    }, "Participación de 18 a 29 años por sección electoral.")];
  },
  cierre: d => [h("div", {
    key: "a",
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, h("div", {
    style: {
      position: "relative",
      width: 360,
      height: 360,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, [360, 260, 180].map((s, i) => h("span", {
    key: i,
    style: {
      position: "absolute",
      width: s,
      height: s,
      borderRadius: "50%",
      background: "var(--color-luz)",
      opacity: [0.06, 0.12, 0.22][i]
    }
  })), h("span", {
    style: {
      position: "relative",
      width: 120,
      height: 120,
      borderRadius: "50%",
      background: "var(--color-luz-suave)",
      boxShadow: "0 0 0 16px var(--color-luz)"
    }
  }))), h("h2", {
    key: "b",
    style: {
      ...tit,
      fontSize: 132,
      lineHeight: 0.95,
      letterSpacing: "-0.035em",
      color: "var(--color-texto)"
    }
  }, d.pregunta ?? "¿Tu luz sigue encendida?"), h("p", {
    key: "c",
    style: {
      ...cuerpo,
      color: "var(--color-texto-2)"
    }
  }, d.texto ?? "Hay más de 15 mil secciones donde los jóvenes votan 60% o más."), h("span", {
    key: "d",
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 34,
      fontWeight: 500,
      color: "var(--color-luz)"
    }
  }, d.url ?? "lageneracionqueseapago.mx")]
};
function TarjetaWrapped({
  variante = "municipio",
  datos = {},
  escala = 1,
  indice,
  total = 5,
  fuente = "INE, Conteo Censal de Participación 2024",
  style
}) {
  const pag = indice != null ? `${String(indice).padStart(2, "0")}/${String(total).padStart(2, "0")}` : null;
  return h("div", {
    style: {
      width: W * escala,
      height: H * escala,
      overflow: "hidden",
      flex: "none",
      ...style
    }
  }, h("div", {
    "data-tarjeta": variante,
    style: {
      width: W,
      height: H,
      transform: `scale(${escala})`,
      transformOrigin: "0 0",
      boxSizing: "border-box",
      padding: "96px 96px 88px",
      background: "var(--color-noche-1)",
      color: "var(--color-hueso)",
      display: "flex",
      flexDirection: "column",
      gap: 40,
      position: "relative",
      fontFamily: "var(--font-texto)"
    }
  }, h("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 36,
      borderBottom: "2px solid var(--color-noche-linea)"
    }
  }, h("span", {
    style: {
      fontFamily: "var(--font-titulo)",
      fontWeight: 700,
      fontStretch: "82%",
      fontSize: 38,
      letterSpacing: "-0.02em"
    }
  }, "La generación que se apagó"), pag ? h("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 30,
      color: "var(--color-arena)"
    }
  }, pag) : null), h("main", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 40,
      paddingTop: 40
    }
  }, (contenidos[variante] || contenidos.municipio)(datos)), h("footer", {
    style: {
      paddingTop: 32,
      borderTop: "2px solid var(--color-noche-linea)",
      fontFamily: "var(--font-mono)",
      fontSize: 26,
      color: "var(--color-ceniza)"
    }
  }, `Fuente: ${fuente}`)));
}
Object.assign(__ds_scope, { TarjetaWrapped });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/compartir/TarjetaWrapped.jsx", error: String((e && e.message) || e) }); }

// components/impresion/FichaImprimible.jsx
try { (() => {
const h = React.createElement;
const mono = (s = 11) => ({
  fontFamily: "var(--font-mono)",
  fontSize: s,
  letterSpacing: "0.02em"
});
const tit = {
  fontFamily: "var(--font-titulo)",
  fontWeight: 700,
  fontStretch: "82%",
  margin: 0
};
const ante = {
  ...mono(10.5),
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  fontWeight: 500,
  color: "var(--color-texto-2)"
};
const pct = v => `${Number(v).toFixed(1)}%`;
function FichaImprimible({
  municipio = "Zapopan",
  estado = "Jalisco",
  anio = 2024,
  participacionJoven = 54.2,
  participacionTotal = 63.8,
  participacionEstado = 52.6,
  participacionNacional = 51.9,
  porEdad = [{
    grupo: "18–19",
    valor: 58.4
  }, {
    grupo: "20–24",
    valor: 51.0
  }, {
    grupo: "25–29",
    valor: 49.1
  }, {
    grupo: "30–39",
    valor: 56.7
  }, {
    grupo: "40–59",
    valor: 67.9
  }, {
    grupo: "60 y más",
    valor: 72.3
  }],
  seccionAlta = {
    id: "1482",
    valor: 72.0
  },
  seccionBaja = {
    id: "1530",
    valor: 31.0
  },
  preguntas = ["¿Por qué creen que a los 25 se vota menos que a los 18?", "¿Qué hace distinta a una sección donde los jóvenes sí votan?", "¿Qué tendría que pasar para que su luz se encienda en 2027?"],
  url = "lageneracionqueseapago.mx",
  qrSrc,
  escala = 1,
  style
}) {
  const qr = qrSrc || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&color=1C1814&bgcolor=FBF8F3&data=${encodeURIComponent("https://" + url)}`;
  const max = Math.max(...porEdad.map(p => p.valor), 80);
  return h("div", {
    style: {
      width: 816 * escala,
      height: 1056 * escala,
      overflow: "hidden",
      flex: "none",
      ...style
    }
  }, h("article", {
    "data-tema": "impresion",
    "data-ficha": municipio,
    style: {
      width: 816,
      height: 1056,
      transform: `scale(${escala})`,
      transformOrigin: "0 0",
      boxSizing: "border-box",
      padding: "48px 56px 40px",
      background: "var(--color-fondo)",
      color: "var(--color-texto)",
      fontFamily: "var(--font-texto)",
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, h("header", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      paddingBottom: 12,
      borderBottom: "1.5px solid var(--color-texto)"
    }
  }, h("span", {
    style: {
      ...tit,
      fontSize: 18,
      letterSpacing: "-0.01em"
    }
  }, "La generación que se apagó"), h("span", {
    style: ante
  }, `Ficha municipal · ${anio}`)), h("div", null, h("h1", {
    style: {
      ...tit,
      fontSize: 52,
      lineHeight: 0.95,
      letterSpacing: "-0.035em"
    }
  }, municipio), h("div", {
    style: {
      fontSize: 16,
      color: "var(--color-texto-2)",
      marginTop: 6
    }
  }, estado)), h("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 240px",
      gap: 36,
      alignItems: "start"
    }
  }, h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, h("span", {
    style: ante
  }, "Jóvenes de 18 a 29 años que votaron"), h("div", {
    style: {
      ...tit,
      fontSize: 112,
      lineHeight: 0.9,
      letterSpacing: "-0.045em",
      color: "var(--color-acento-texto)",
      fontVariantNumeric: "tabular-nums"
    }
  }, Number(participacionJoven).toFixed(1), h("span", {
    style: {
      fontSize: "0.45em"
    }
  }, "%")), h("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, auto)",
      justifyContent: "start",
      gap: "4px 28px",
      marginTop: 8
    }
  }, [["Todas las edades", participacionTotal], [estado + " (18–29)", participacionEstado], ["Nacional (18–29)", participacionNacional]].map(([l, v], i) => h("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, h("span", {
    style: {
      ...mono(18),
      fontWeight: 500
    }
  }, pct(v)), h("span", {
    style: {
      fontSize: 12,
      color: "var(--color-texto-2)"
    }
  }, l))))), h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, h(__ds_scope.CampoLuces, {
    forma: "rejilla",
    total: 100,
    proporcion: participacionJoven / 100,
    columnas: 10,
    radio: 7,
    separacion: 9,
    halo: false,
    animar: false
  }), h("span", {
    style: {
      fontSize: 12,
      color: "var(--color-texto-2)"
    }
  }, "De cada 100 jóvenes, ", h("b", null, Math.round(participacionJoven)), " votaron."))), h("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 36,
      paddingTop: 18,
      borderTop: "1px solid var(--color-linea)"
    }
  }, h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, h("span", {
    style: ante
  }, "Participación por edad"), porEdad.map((p, i) => h("div", {
    key: i,
    style: {
      display: "grid",
      gridTemplateColumns: "64px 1fr 48px",
      alignItems: "center",
      gap: 10
    }
  }, h("span", {
    style: mono(11.5)
  }, p.grupo), h("div", {
    style: {
      height: 12,
      background: "var(--color-superficie-alta)"
    }
  }, h("div", {
    style: {
      height: "100%",
      width: `${p.valor / max * 100}%`,
      background: i < 3 ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)"
    }
  })), h("span", {
    style: {
      ...mono(11.5),
      textAlign: "right",
      fontWeight: 500
    }
  }, pct(p.valor))))), h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, h("span", {
    style: ante
  }, "Contraste entre secciones (18–29)"), [["Más encendida", seccionAlta, "var(--color-acento-texto)"], ["Más apagada", seccionBaja, "var(--color-texto-2)"]].map(([l, s, c], i) => h("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid var(--color-linea)"
    }
  }, h("span", {
    style: {
      fontSize: 14
    }
  }, l, h("span", {
    style: {
      ...mono(11.5),
      color: "var(--color-texto-2)",
      marginLeft: 8
    }
  }, `Secc. ${s.id}`)), h("span", {
    style: {
      ...tit,
      fontSize: 30,
      color: c
    }
  }, `${Math.round(s.valor)}%`))))), h("section", {
    style: {
      paddingTop: 18,
      borderTop: "1px solid var(--color-linea)",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, h("span", {
    style: ante
  }, "Para conversar en clase"), h("ol", {
    style: {
      margin: 0,
      paddingLeft: 20,
      display: "flex",
      flexDirection: "column",
      gap: 4,
      fontSize: 15,
      lineHeight: 1.45
    }
  }, preguntas.map((q, i) => h("li", {
    key: i
  }, q)))), h("footer", {
    style: {
      marginTop: "auto",
      display: "grid",
      gridTemplateColumns: "96px 1fr",
      gap: 20,
      alignItems: "end",
      paddingTop: 16,
      borderTop: "1.5px solid var(--color-texto)"
    }
  }, h("img", {
    src: qr,
    alt: `Código QR a ${url}`,
    width: 96,
    height: 96,
    style: {
      display: "block"
    }
  }), h("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, h("span", {
    style: {
      ...mono(13),
      fontWeight: 600
    }
  }, url), h("span", {
    style: {
      fontSize: 11.5,
      lineHeight: 1.4,
      color: "var(--color-texto-2)"
    }
  }, "Participación = personas que votaron entre personas en la lista nominal, por edad cumplida el día de la elección. Secciones con menos de 50 jóvenes en lista nominal no se muestran."), h(__ds_scope.PieFuente, {
    fuente: `INE, Conteo Censal de Participación ${anio}`,
    style: {
      fontSize: 11
    }
  })))));
}
Object.assign(__ds_scope, { FichaImprimible });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/impresion/FichaImprimible.jsx", error: String((e && e.message) || e) }); }

// components/narrativa/PasoScrolly.jsx
try { (() => {
function PasoScrolly({
  numero,
  antetitulo,
  activo = true,
  alineacion = "izquierda",
  children,
  style
}) {
  const centro = alineacion === "centro";
  return React.createElement("section", {
    "data-paso": numero,
    "aria-current": activo ? "step" : undefined,
    style: {
      minHeight: "var(--spacing-paso)",
      display: "flex",
      alignItems: "center",
      justifyContent: centro ? "center" : alineacion === "derecha" ? "flex-end" : "flex-start",
      pointerEvents: "none",
      ...style
    }
  }, React.createElement("div", {
    style: {
      pointerEvents: "auto",
      width: "100%",
      maxWidth: "24rem",
      boxSizing: "border-box",
      padding: "20px 22px 22px",
      background: "var(--color-superficie)",
      border: "1px solid var(--color-linea)",
      borderRadius: "var(--radius-lg)",
      display: "flex",
      flexDirection: "column",
      gap: 10,
      opacity: activo ? 1 : 0.4,
      transform: activo ? "translateY(0)" : "translateY(8px)",
      transition: "opacity var(--duration-larga) var(--ease-entrada), transform var(--duration-larga) var(--ease-entrada)"
    }
  }, antetitulo || numero != null ? React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-mono)",
      fontSize: "var(--text-antetitulo)",
      letterSpacing: "var(--text-antetitulo--letter-spacing)",
      textTransform: "uppercase",
      fontWeight: 500,
      color: activo ? "var(--color-acento-texto)" : "var(--color-texto-3)"
    }
  }, React.createElement("span", {
    "aria-hidden": true,
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: activo ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)",
      boxShadow: activo ? "var(--shadow-halo)" : "none"
    }
  }), antetitulo ?? String(numero).padStart(2, "0")) : null, React.createElement("div", {
    style: {
      fontFamily: "var(--font-texto)",
      fontSize: "var(--text-cuerpo)",
      lineHeight: "var(--text-cuerpo--line-height)",
      color: "var(--color-texto)",
      textWrap: "pretty"
    }
  }, children)));
}
Object.assign(__ds_scope, { PasoScrolly });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/narrativa/PasoScrolly.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/CarruselTarjetas.jsx
try { (() => {
function CarruselTarjetas({
  datos = {
    municipio: "Zapopan",
    edad: 24
  },
  onEditar = () => {}
}) {
  const {
    TarjetaWrapped,
    Boton,
    Icono,
    Toast
  } = DS;
  const [i, setI] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const pista = React.useRef();
  const esc = 0.27,
    ancho = 1080 * esc;
  const tarjetas = [{
    variante: "municipio",
    datos: {
      municipio: datos.municipio,
      valor: 54.2
    }
  }, {
    variante: "edad",
    datos: {
      edad: datos.edad,
      valor18: 61,
      valorEdad: 47.6
    }
  }, {
    variante: "generacion",
    datos: {}
  }, {
    variante: "secciones",
    datos: {
      municipio: datos.municipio
    }
  }, {
    variante: "cierre",
    datos: {}
  }];
  const ir = k => {
    const n = Math.max(0, Math.min(4, k));
    pista.current.scrollTo({
      left: n * (ancho + 12),
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "08 Carrusel",
    style: {
      padding: "32px 0 40px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 20px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...kitAnte,
      color: "var(--color-acento-texto)"
    }
  }, datos.municipio, " \xB7 ", datos.edad, " a\xF1os"), /*#__PURE__*/React.createElement("h2", {
    style: kitTitulo2
  }, "Tus cinco tarjetas")), /*#__PURE__*/React.createElement("div", {
    ref: pista,
    onScroll: e => setI(Math.round(e.currentTarget.scrollLeft / (ancho + 12))),
    style: {
      display: "flex",
      gap: 12,
      overflowX: "auto",
      scrollSnapType: "x mandatory",
      padding: "0 calc(50% - " + ancho / 2 + "px)",
      scrollbarWidth: "none"
    }
  }, tarjetas.map((t, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      scrollSnapAlign: "center",
      flex: "none",
      borderRadius: 10,
      overflow: "hidden",
      border: "1px solid var(--color-linea)",
      opacity: k === i ? 1 : 0.5,
      transition: "opacity var(--duration-media) var(--ease-entrada)"
    }
  }, /*#__PURE__*/React.createElement(TarjetaWrapped, {
    variante: t.variante,
    datos: t.datos,
    indice: k + 1,
    escala: esc
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Anterior",
    onClick: () => ir(i - 1),
    style: {
      width: 44,
      height: 44,
      background: "none",
      border: 0,
      color: "var(--color-texto-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icono, {
    nombre: "chevron-left"
  })), tarjetas.map((_, k) => /*#__PURE__*/React.createElement("button", {
    key: k,
    type: "button",
    "aria-label": `Tarjeta ${k + 1}`,
    onClick: () => ir(k),
    style: {
      width: 20,
      height: 44,
      background: "none",
      border: 0,
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 4,
      background: k === i ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)",
      boxShadow: k === i ? "var(--shadow-halo)" : "none"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": "Siguiente",
    onClick: () => ir(i + 1),
    style: {
      width: 44,
      height: 44,
      background: "none",
      border: 0,
      color: "var(--color-texto-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Icono, {
    nombre: "chevron-right"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 20px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Boton, {
    completo: true,
    icono: /*#__PURE__*/React.createElement(Icono, {
      nombre: "download"
    }),
    onClick: () => setToast({
      tono: "exito",
      m: `Tarjeta ${i + 1} guardada en tus fotos.`
    })
  }, "Descargar tarjeta"), /*#__PURE__*/React.createElement(Boton, {
    completo: true,
    variante: "secundario",
    icono: /*#__PURE__*/React.createElement(Icono, {
      nombre: "share-2"
    }),
    onClick: () => setToast({
      tono: "info",
      m: "Enlace copiado."
    })
  }, "Compartir"), /*#__PURE__*/React.createElement(Boton, {
    variante: "texto",
    onClick: onEditar,
    style: {
      alignSelf: "center"
    }
  }, "Cambiar mis datos")), toast && /*#__PURE__*/React.createElement(Toast, {
    key: toast.m,
    flotante: true,
    tono: toast.tono,
    mensaje: toast.m,
    duracion: 3200,
    onCerrar: () => setToast(null)
  }));
}
window.CarruselTarjetas = CarruselTarjetas;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/CarruselTarjetas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/DibujaloTu.jsx
try { (() => {
function DibujaloTu({
  trazoInicial,
  reveladoInicial = false
}) {
  const {
    Boton,
    Icono,
    PieFuente
  } = DS;
  const real = kitDatos.porEdad;
  const W = 350,
    H = 300,
    m = {
      t: 16,
      r: 44,
      b: 30,
      l: 30
    },
    X0 = 18,
    X1 = 29,
    Y0 = 30,
    Y1 = 80;
  const sx = x => m.l + (x - X0) / (X1 - X0) * (W - m.l - m.r);
  const sy = y => m.t + (1 - (y - Y0) / (Y1 - Y0)) * (H - m.t - m.b);
  const ix = px => Math.round(X0 + (px - m.l) / (W - m.l - m.r) * (X1 - X0));
  const iy = py => Math.max(Y0, Math.min(Y1, Y0 + (1 - (py - m.t) / (H - m.t - m.b)) * (Y1 - Y0)));
  const [trazo, setTrazo] = React.useState(trazoInicial || {
    18: 61
  });
  const [revelado, setRevelado] = React.useState(reveladoInicial);
  const svg = React.useRef();
  const dibujando = React.useRef(false);
  const punto = e => {
    const r = svg.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * W,
      py = (e.clientY - r.top) / r.height * H;
    return [Math.max(19, Math.min(X1, ix(px))), +iy(py).toFixed(1)];
  };
  const pintar = e => {
    if (!dibujando.current || revelado) return;
    const [x, y] = punto(e);
    setTrazo(t => {
      const n = {
        ...t
      };
      const prev = Math.max(...Object.keys(n).map(Number).filter(k => k < x), 18);
      for (let k = prev + 1; k <= x; k++) n[k] = +(n[prev] + (y - n[prev]) * (k - prev) / (x - prev)).toFixed(1);
      n[x] = y;
      return n;
    });
  };
  const pts = Object.entries(trazo).map(([x, y]) => ({
    x: +x,
    y
  })).sort((a, b) => a.x - b.x);
  const completo = pts.length && pts[pts.length - 1].x >= 25;
  const path = arr => arr.map((p, i) => (i ? "L" : "M") + sx(p.x).toFixed(1) + "," + sy(p.y).toFixed(1)).join("");
  const u25 = trazo[25];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": revelado ? "03b Dibújalo tú · revelado" : "03a Dibújalo tú",
    style: {
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...kitAnte,
      color: "var(--color-acento-texto)"
    }
  }, "Dib\xFAjalo t\xFA"), /*#__PURE__*/React.createElement("h2", {
    style: kitTitulo2
  }, "\xBFCu\xE1ntos j\xF3venes crees que votan despu\xE9s de los 18?"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...kitEntrada,
      color: "var(--color-texto-2)",
      fontSize: 17
    }
  }, "A los 18 vot\xF3 el 61%. Traza con el dedo c\xF3mo crees que sigue la l\xEDnea hasta los 29."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "var(--color-superficie)",
      border: "1px solid var(--color-linea)",
      borderRadius: "var(--radius-lg)",
      padding: "10px 4px 0"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    ref: svg,
    viewBox: `0 0 ${W} ${H}`,
    width: "100%",
    style: {
      display: "block",
      touchAction: "none",
      cursor: revelado ? "default" : "crosshair"
    },
    onPointerDown: e => {
      dibujando.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      pintar(e);
    },
    onPointerMove: pintar,
    onPointerUp: () => dibujando.current = false
  }, [30, 40, 50, 60, 70, 80].map(y => /*#__PURE__*/React.createElement("g", {
    key: y
  }, /*#__PURE__*/React.createElement("line", {
    x1: m.l,
    x2: W - m.r,
    y1: sy(y),
    y2: sy(y),
    stroke: "var(--color-linea)"
  }), /*#__PURE__*/React.createElement("text", {
    x: m.l - 6,
    y: sy(y) + 4,
    textAnchor: "end",
    style: {
      font: "12px var(--font-mono)",
      fill: "var(--color-texto-3)"
    }
  }, y))), [18, 20, 22, 24, 26, 28].map(x => /*#__PURE__*/React.createElement("text", {
    key: x,
    x: sx(x),
    y: H - 8,
    textAnchor: "middle",
    style: {
      font: "12px var(--font-mono)",
      fill: "var(--color-texto-3)"
    }
  }, x)), !revelado && /*#__PURE__*/React.createElement("rect", {
    x: sx(18.5),
    y: m.t,
    width: sx(X1) - sx(18.5),
    height: H - m.t - m.b,
    fill: "none",
    stroke: "var(--color-texto-3)",
    strokeDasharray: "2 5",
    rx: "4"
  }), revelado && /*#__PURE__*/React.createElement("path", {
    d: path(real),
    fill: "none",
    stroke: "var(--color-foco-encendido)",
    strokeWidth: "3",
    strokeLinejoin: "round",
    pathLength: "1",
    strokeDasharray: "1",
    style: {
      animation: "dibuja var(--duration-escena) var(--ease-entrada) both"
    }
  }), /*#__PURE__*/React.createElement("path", {
    d: path(pts),
    fill: "none",
    stroke: revelado ? "var(--color-arena)" : "var(--color-foco-encendido)",
    strokeWidth: revelado ? 2 : 3,
    strokeDasharray: revelado ? "3 5" : "none",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: sx(18),
    cy: sy(61),
    r: "5",
    fill: "var(--color-foco-encendido)"
  }), /*#__PURE__*/React.createElement("text", {
    x: sx(18) + 8,
    y: sy(61) - 9,
    style: {
      font: "500 13px var(--font-mono)",
      fill: "var(--color-acento-texto)"
    }
  }, "61%"), revelado && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: sx(25),
    cy: sy(47),
    r: "5",
    fill: "var(--color-fondo)",
    stroke: "var(--color-texto)",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("text", {
    x: sx(25),
    y: sy(47) + 22,
    textAnchor: "middle",
    style: {
      font: "600 13px var(--font-mono)",
      fill: "var(--color-acento-texto)"
    }
  }, "47% a los 25"))), pts.length < 2 && !revelado && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      pointerEvents: "none",
      color: "var(--color-texto-2)",
      fontFamily: "var(--font-mono)",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icono, {
    nombre: "pencil",
    tamano: 18
  }), "Dibuja aqu\xED")), !revelado ? /*#__PURE__*/React.createElement(Boton, {
    completo: true,
    disabled: !completo,
    onClick: () => setRevelado(true)
  }, completo ? "Ver la respuesta" : "Dibuja al menos hasta los 25") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      ...kitEntrada,
      fontSize: 19
    }
  }, u25 != null ? /*#__PURE__*/React.createElement(React.Fragment, null, "Dibujaste ", /*#__PURE__*/React.createElement("b", null, Math.round(u25), "%"), " a los 25. En realidad fue ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--color-acento-texto)"
    }
  }, "47%"), ": ", u25 > 47 ? "menos de lo que pensabas." : "cerca de lo que pensabas.") : /*#__PURE__*/React.createElement(React.Fragment, null, "A los 25 vot\xF3 el 47%.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--color-texto-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 16,
      height: 3,
      background: "var(--color-foco-encendido)"
    }
  }), "Dato real"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 16,
      height: 0,
      borderTop: "2px dashed var(--color-arena)"
    }
  }), "Tu l\xEDnea")), /*#__PURE__*/React.createElement(Boton, {
    variante: "texto",
    iconoFinal: /*#__PURE__*/React.createElement(Icono, {
      nombre: "rotate-ccw",
      tamano: 18
    }),
    onClick: () => {
      setTrazo({
        18: 61
      });
      setRevelado(false);
    },
    style: {
      alignSelf: "flex-start"
    }
  }, "Volver a dibujar")), /*#__PURE__*/React.createElement(PieFuente, {
    fuente: "INE, Conteo Censal de Participaci\xF3n 2024",
    nota: "Valores intermedios ilustrativos."
  }));
}
window.DibujaloTu = DibujaloTu;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/DibujaloTu.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/EscenaCohorte.jsx
try { (() => {
function EscenaCohorte({
  alto = "100svh",
  pasoFijo
}) {
  const {
    CampoLuces,
    PasoScrolly,
    CifraProtagonista
  } = DS;
  const [paso, reg] = usePasoActivo(pasoFijo);
  const c = kitDatos.cohorte;
  const textos = [/*#__PURE__*/React.createElement(React.Fragment, null, "Quienes ten\xEDan 18 en 2012 votaron por primera vez. Lo hizo el ", /*#__PURE__*/React.createElement("b", null, "66.7%"), ": dos de cada tres."), /*#__PURE__*/React.createElement(React.Fragment, null, "Seis a\xF1os despu\xE9s, a los 24, la misma generaci\xF3n vot\xF3 ", /*#__PURE__*/React.createElement("b", null, "52.1%"), "."), /*#__PURE__*/React.createElement(React.Fragment, null, "A los 30, ", /*#__PURE__*/React.createElement("b", null, "50.3%"), ". Nunca volvi\xF3 a encenderse como la primera vez.")];
  const actual = c[paso];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "04 Cohorte",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      height: alto,
      boxSizing: "border-box",
      padding: "28px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, c.map((p, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      paddingTop: 8,
      borderTop: `2px solid ${i <= paso ? "var(--color-foco-encendido)" : "var(--color-linea)"}`,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: i === paso ? "var(--color-texto)" : "var(--color-texto-3)",
      transition: "border-color var(--duration-media) var(--ease-entrada)"
    }
  }, p.anio, " \xB7 ", p.edad))), /*#__PURE__*/React.createElement(CifraProtagonista, {
    key: paso,
    tamano: "cifra",
    valor: actual.valor.toFixed(1),
    unidad: "%",
    antetitulo: `Votó a los ${actual.edad} años`,
    etiqueta: null,
    fuente: null,
    animar: true
  }), /*#__PURE__*/React.createElement(CampoLuces, {
    total: 420,
    proporcion: actual.valor / 100,
    semilla: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: `calc(-1 * ${alto})`,
      padding: "0 20px"
    }
  }, textos.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    ref: reg(i)
  }, /*#__PURE__*/React.createElement(PasoScrolly, {
    antetitulo: `${c[i].anio} · ${c[i].edad} años`,
    activo: paso === i,
    style: {
      minHeight: alto,
      alignItems: "flex-end",
      paddingBottom: 28,
      boxSizing: "border-box"
    }
  }, t)))));
}
window.EscenaCohorte = EscenaCohorte;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/EscenaCohorte.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/EscenaEscala.jsx
try { (() => {
function EscenaEscala({
  alto = "100svh",
  pasoFijo
}) {
  const {
    CampoLuces,
    PasoScrolly,
    CifraProtagonista
  } = DS;
  const [paso, reg] = usePasoActivo(pasoFijo);
  const pasos = [/*#__PURE__*/React.createElement(React.Fragment, null, "En 2024, ", /*#__PURE__*/React.createElement("b", null, "37.1 millones"), " de personas no votaron. Cada punto son 100 mil de ellas."), /*#__PURE__*/React.createElement(React.Fragment, null, "Un tercio ten\xEDa entre ", /*#__PURE__*/React.createElement("b", null, "18 y 29 a\xF1os"), ". Son los puntos claros.")];
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "02 Escala",
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      height: alto,
      boxSizing: "border-box",
      padding: "28px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(CifraProtagonista, {
    tamano: "cifra",
    tono: "apagada",
    valor: "37.1",
    unidad: " M",
    etiqueta: null,
    fuente: null,
    antetitulo: "Personas que no votaron \xB7 2024"
  }), /*#__PURE__*/React.createElement(CampoLuces, {
    total: 371,
    encendidas: paso >= 1 ? 124 : 0,
    semilla: 4,
    halo: false,
    colorEncendida: "var(--color-arena)",
    etiqueta: "371 puntos apagados; 124 de ellos son j\xF3venes"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      fontFamily: "var(--font-mono)",
      fontSize: 12,
      color: "var(--color-texto-2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 4,
      background: "var(--color-foco-apagado)"
    }
  }), "100 mil personas"), paso >= 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 4,
      background: "var(--color-arena)"
    }
  }), "de 18 a 29 a\xF1os"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: `calc(-1 * ${alto})`,
      padding: "0 20px"
    }
  }, pasos.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    ref: reg(i)
  }, /*#__PURE__*/React.createElement(PasoScrolly, {
    numero: i + 1,
    activo: paso === i,
    style: {
      minHeight: alto,
      alignItems: "flex-end",
      paddingBottom: 28,
      boxSizing: "border-box"
    }
  }, t)))));
}
window.EscenaEscala = EscenaEscala;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/EscenaEscala.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/EscenaMapa.jsx
try { (() => {
function EscenaMapa({
  seleccionInicial = "JAL"
}) {
  const {
    MapaEstados,
    PieFuente,
    Boton,
    Icono
  } = DS;
  const [modo, setModo] = React.useState("secuencial");
  const [sel, setSel] = React.useState(seleccionInicial);
  const v = kitDatos.estados;
  const prom = Object.values(v).reduce((a, b) => a + b, 0) / 32;
  const tab = (id, l) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "tab",
    "aria-selected": modo === id,
    onClick: () => setModo(id),
    style: {
      flex: 1,
      minHeight: 44,
      background: "none",
      border: 0,
      borderBottom: `2px solid ${modo === id ? "var(--color-foco-encendido)" : "var(--color-linea)"}`,
      color: modo === id ? "var(--color-texto)" : "var(--color-texto-2)",
      fontFamily: "var(--font-texto)",
      fontSize: 15,
      fontWeight: modo === id ? 700 : 400,
      cursor: "pointer"
    }
  }, l);
  const nombre = {
    JAL: "Jalisco",
    OAX: "Oaxaca",
    YUC: "Yucatán",
    NLE: "Nuevo León",
    CMX: "Ciudad de México"
  }[sel] || sel;
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "05 Mapa",
    style: {
      padding: "40px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: kitAnte
  }, "Por estado \xB7 18 a 29 a\xF1os \xB7 2024"), /*#__PURE__*/React.createElement("h2", {
    style: kitTitulo2
  }, "\xBFD\xF3nde se apaga m\xE1s?"), /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: "flex"
    }
  }, tab("secuencial", "Participación"), tab("divergente", "Contra el promedio")), /*#__PURE__*/React.createElement(MapaEstados, {
    valores: v,
    escala: modo,
    dominio: [42, 64],
    promedio: prom,
    rango: 10,
    seleccionado: sel,
    onSeleccionar: setSel,
    etiquetaLeyenda: modo === "secuencial" ? "% de jóvenes que votó" : "Puntos contra el promedio nacional"
  }), sel && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "14px 16px",
      background: "var(--color-superficie)",
      border: "1px solid var(--color-linea)",
      borderRadius: "var(--radius-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-titulo)",
      fontWeight: 600,
      fontSize: 18
    }
  }, nombre), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 13,
      color: "var(--color-texto-2)"
    }
  }, v[sel].toFixed(1), "% \xB7 ", (v[sel] - prom >= 0 ? "+" : "−") + Math.abs(v[sel] - prom).toFixed(1), " pts")), /*#__PURE__*/React.createElement(Boton, {
    variante: "texto",
    iconoFinal: /*#__PURE__*/React.createElement(Icono, {
      nombre: "arrow-right",
      tamano: 18
    })
  }, "Ver municipios")), /*#__PURE__*/React.createElement(PieFuente, {
    fuente: "INE, Conteo Censal de Participaci\xF3n 2024",
    nota: "Valores del mapa ilustrativos."
  }));
}
window.EscenaMapa = EscenaMapa;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/EscenaMapa.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/FormularioWrapped.jsx
try { (() => {
function Esperanza() {
  const {
    CifraProtagonista,
    CampoLuces
  } = DS;
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "06 Esperanza",
    style: {
      padding: "56px 20px 24px",
      display: "flex",
      flexDirection: "column",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(CampoLuces, {
    total: 300,
    proporcion: 0.68,
    semilla: 5
  }), /*#__PURE__*/React.createElement(CifraProtagonista, {
    tamano: "cifra",
    valor: "15,000",
    unidad: "+",
    antetitulo: "Lo que sigue encendido",
    etiqueta: "secciones donde los j\xF3venes votan 60% o m\xE1s. No es un caso perdido: hay lugares donde la luz no se apaga."
  }));
}
function FormularioWrapped({
  onCrear = () => {},
  inicial = {}
}) {
  const {
    SelectorEstadoMunicipio,
    CampoEdad,
    SelectorSexo,
    Boton,
    Icono
  } = DS;
  const [f, setF] = React.useState({
    estado: undefined,
    municipio: undefined,
    edad: "",
    sexo: undefined,
    ...inicial
  });
  const valido = f.estado && f.municipio && f.edad >= 18 && f.edad <= 99;
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "07 Formulario Wrapped",
    style: {
      padding: "40px 20px 48px",
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...kitAnte,
      color: "var(--color-acento-texto)"
    }
  }, "Tus tarjetas"), /*#__PURE__*/React.createElement("h2", {
    style: kitTitulo2
  }, "\xBFTu luz sigue encendida?"), /*#__PURE__*/React.createElement("p", {
    style: {
      ...kitEntrada,
      color: "var(--color-texto-2)",
      fontSize: 17
    }
  }, "Con tu municipio y tu edad armamos cinco tarjetas para compartir. No guardamos tus datos."), /*#__PURE__*/React.createElement(SelectorEstadoMunicipio, {
    estados: kitDatos.catalogo,
    estado: f.estado,
    municipio: f.municipio,
    onCambiar: v => setF({
      ...f,
      ...v
    })
  }), /*#__PURE__*/React.createElement(CampoEdad, {
    valor: f.edad,
    onCambiar: edad => setF({
      ...f,
      edad
    })
  }), /*#__PURE__*/React.createElement(SelectorSexo, {
    valor: f.sexo,
    onCambiar: sexo => setF({
      ...f,
      sexo
    })
  }), /*#__PURE__*/React.createElement(Boton, {
    completo: true,
    tamano: "lg",
    disabled: !valido,
    iconoFinal: /*#__PURE__*/React.createElement(Icono, {
      nombre: "arrow-right"
    }),
    onClick: () => onCrear(f)
  }, "Crear mis tarjetas"));
}
Object.assign(window, {
  Esperanza,
  FormularioWrapped
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/FormularioWrapped.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/Hero.jsx
try { (() => {
function Hero({
  alto = "100svh"
}) {
  const {
    CampoLuces,
    Icono
  } = DS;
  return /*#__PURE__*/React.createElement("section", {
    "data-screen-label": "01 Hero",
    style: {
      minHeight: alto,
      boxSizing: "border-box",
      padding: "20px 20px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: kitAnte
  }, "Participaci\xF3n electoral \xB7 2012\u20132024"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      padding: "8px 4px"
    }
  }, /*#__PURE__*/React.createElement(CampoLuces, {
    total: 420,
    proporcion: 1,
    semilla: 3
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-titulo)",
      fontWeight: 700,
      fontStretch: "82%",
      fontSize: 58,
      lineHeight: 0.92,
      letterSpacing: "-0.04em",
      margin: 0
    }
  }, "La generaci\xF3n que se ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--color-foco-apagado)"
    }
  }, "apag\xF3")), /*#__PURE__*/React.createElement("p", {
    style: {
      ...kitEntrada,
      color: "var(--color-texto-2)"
    }
  }, "Cada luz es una persona: encendida si vot\xF3, apagada si no. Esta es la historia de quienes cumplieron 18 a\xF1os en 2012."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      color: "var(--color-acento-texto)",
      fontFamily: "var(--font-mono)",
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement(Icono, {
    nombre: "arrow-down",
    tamano: 18
  }), " Desliza para empezar"));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/micrositio/kit-utils.jsx
try { (() => {
const DS = window.LaGeneraciNQueSeApagDesignSystem_a5d389;
function usePasoActivo(fijo) {
  const nodos = React.useRef([]);
  const [activo, setActivo] = React.useState(fijo ?? 0);
  React.useEffect(() => {
    if (fijo != null) {
      setActivo(fijo);
      return;
    }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) setActivo(+e.target.dataset.i);
    }), {
      rootMargin: "-40% 0px -40% 0px"
    });
    nodos.current.forEach(n => n && io.observe(n));
    return () => io.disconnect();
  }, [fijo]);
  const registrar = i => el => {
    nodos.current[i] = el;
    if (el) el.dataset.i = i;
  };
  return [activo, registrar];
}
const kitAnte = {
  fontFamily: "var(--font-mono)",
  fontSize: "var(--text-antetitulo)",
  letterSpacing: "var(--text-antetitulo--letter-spacing)",
  textTransform: "uppercase",
  fontWeight: 500,
  color: "var(--color-texto-2)"
};
const kitTitulo2 = {
  fontFamily: "var(--font-titulo)",
  fontWeight: 700,
  fontSize: "var(--text-titulo-2)",
  lineHeight: "var(--text-titulo-2--line-height)",
  letterSpacing: "var(--text-titulo-2--letter-spacing)",
  margin: 0,
  textWrap: "balance"
};
const kitEntrada = {
  fontSize: "var(--text-entrada)",
  lineHeight: "var(--text-entrada--line-height)",
  margin: 0,
  textWrap: "pretty"
};

/* Datos: 18 y 25 años (61%, 47%) y la cohorte 2012 (66.7 / 52.1 / 50.3) son del brief; el resto es ilustrativo. */
const kitDatos = {
  porEdad: [[18, 61], [19, 57], [20, 54], [21, 51.5], [22, 49.6], [23, 48.4], [24, 47.6], [25, 47], [26, 47.3], [27, 47.9], [28, 48.7], [29, 49.4]].map(([x, y]) => ({
    x,
    y
  })),
  cohorte: [{
    anio: 2012,
    edad: 18,
    valor: 66.7
  }, {
    anio: 2018,
    edad: 24,
    valor: 52.1
  }, {
    anio: 2024,
    edad: 30,
    valor: 50.3
  }],
  estados: (() => {
    const ids = "AGU BCN BCS CAM CHP CHH CMX COA COL DUR GUA GRO HID JAL MEX MIC MOR NAY NLE OAX PUE QUE ROO SLP SIN SON TAB TAM TLA VER YUC ZAC".split(" ");
    let s = 11;
    const r = () => {
      s = s * 16807 % 2147483647;
      return s / 2147483647;
    };
    const o = {};
    ids.forEach(i => o[i] = +(42 + r() * 22).toFixed(1));
    return o;
  })(),
  catalogo: [{
    id: "CMX",
    nombre: "Ciudad de México",
    municipios: ["Iztapalapa", "Coyoacán", "Cuauhtémoc", "Gustavo A. Madero"]
  }, {
    id: "JAL",
    nombre: "Jalisco",
    municipios: ["Guadalajara", "Zapopan", "San Pedro Tlaquepaque", "Tonalá"]
  }, {
    id: "NLE",
    nombre: "Nuevo León",
    municipios: ["Monterrey", "Guadalupe", "Apodaca", "San Nicolás de los Garza"]
  }, {
    id: "OAX",
    nombre: "Oaxaca",
    municipios: ["Oaxaca de Juárez", "Juchitán de Zaragoza", "Salina Cruz"]
  }, {
    id: "YUC",
    nombre: "Yucatán",
    municipios: ["Mérida", "Valladolid", "Progreso"]
  }]
};
Object.assign(window, {
  DS,
  usePasoActivo,
  kitAnte,
  kitTitulo2,
  kitEntrada,
  kitDatos
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/micrositio/kit-utils.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Boton = __ds_scope.Boton;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.CifraProtagonista = __ds_scope.CifraProtagonista;

__ds_ns.TarjetaWrapped = __ds_scope.TarjetaWrapped;

__ds_ns.CampoEdad = __ds_scope.CampoEdad;

__ds_ns.SelectorEstadoMunicipio = __ds_scope.SelectorEstadoMunicipio;

__ds_ns.SelectorSexo = __ds_scope.SelectorSexo;

__ds_ns.NotaMetodologica = __ds_scope.NotaMetodologica;

__ds_ns.PieFuente = __ds_scope.PieFuente;

__ds_ns.GraficaEdad = __ds_scope.GraficaEdad;

__ds_ns.MapaEstados = __ds_scope.MapaEstados;

__ds_ns.Icono = __ds_scope.Icono;

__ds_ns.FichaImprimible = __ds_scope.FichaImprimible;

__ds_ns.CampoLuces = __ds_scope.CampoLuces;

__ds_ns.PasoScrolly = __ds_scope.PasoScrolly;

})();

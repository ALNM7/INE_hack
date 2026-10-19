import React, { useEffect, useRef, useState } from "react";

function parse(v) { const s = String(v); const n = parseFloat(s.replace(/,/g, "")); const dec = (s.split(".")[1] || "").length; return { n, dec }; }
function fmt(n, dec) { return n.toLocaleString("es-MX", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

export function CifraProtagonista({ valor, unidad, antetitulo, etiqueta, fuente = "Fuente: INE", tamano = "display", tono = "luz", animar = false, alinear = "inicio", style }) {
  const { n, dec } = parse(valor);
  const [mostrado, setMostrado] = useState(animar && !isNaN(n) ? 0 : n);
  const ref = useRef();
  useEffect(() => {
    if (!animar || isNaN(n)) { setMostrado(n); return; }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setMostrado(n); return; }
    const t0 = performance.now(), D = 1100;
    const tick = (t) => { const p = Math.min(1, (t - t0) / D); const e = 1 - Math.pow(1 - p, 4); setMostrado(n * e); if (p < 1) ref.current = requestAnimationFrame(tick); };
    ref.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(ref.current);
  }, [n, animar]);
  const color = { luz: "var(--color-acento-texto)", texto: "var(--color-texto)", apagada: "var(--color-texto-3)" }[tono];
  const t = tamano === "display" ? "display" : "cifra";
  const centro = alinear === "centro";
  const texto = isNaN(n) ? valor : fmt(mostrado, dec);
  return React.createElement("figure", { style: { margin: 0, display: "flex", flexDirection: "column", alignItems: centro ? "center" : "flex-start", textAlign: centro ? "center" : "left", gap: 12, ...style } },
    antetitulo ? React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: "var(--text-antetitulo)", lineHeight: "var(--text-antetitulo--line-height)", letterSpacing: "var(--text-antetitulo--letter-spacing)", textTransform: "uppercase", fontWeight: 500, color: "var(--color-texto-2)" } }, antetitulo) : null,
    React.createElement("span", { "aria-label": `${valor}${unidad || ""}`, style: { fontFamily: "var(--font-titulo)", fontWeight: 700, fontStretch: "82%", fontSize: `var(--text-${t})`, lineHeight: `var(--text-${t}--line-height)`, letterSpacing: `var(--text-${t}--letter-spacing)`, color, fontVariantNumeric: "tabular-nums", display: "flex", alignItems: "baseline" } },
      texto,
      unidad ? React.createElement("span", { style: { fontSize: "0.5em", marginLeft: "0.04em", letterSpacing: "-0.02em" } }, unidad) : null),
    React.createElement("figcaption", { style: { display: "flex", flexDirection: "column", gap: 10, alignItems: centro ? "center" : "flex-start", maxWidth: "26rem" } },
      etiqueta ? React.createElement("span", { style: { fontFamily: "var(--font-texto)", fontSize: "var(--text-entrada)", lineHeight: "var(--text-entrada--line-height)", color: "var(--color-texto)", textWrap: "pretty" } }, etiqueta) : null,
      fuente ? React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: "var(--text-etiqueta)", letterSpacing: "var(--text-etiqueta--letter-spacing)", color: "var(--color-texto-3)" } }, fuente) : null));
}

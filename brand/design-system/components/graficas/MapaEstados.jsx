import React, { useMemo, useRef, useState } from "react";
import { mxEstados, mxViewBox } from "./mxEstados.js";

export function MapaEstados({ valores = {}, escala = "secuencial", dominio, promedio, rango = 10, formato = (v) => `${v.toFixed(1)}%`, seleccionado, onSeleccionar, etiquetaLeyenda = "% de jóvenes de 18 a 29 años que votó", mostrarLeyenda = true, style }) {
  const ref = useRef();
  const [hover, setHover] = useState(null);
  const vals = Object.values(valores).filter((v) => typeof v === "number");
  const [mn, mx] = dominio || [Math.min(...vals), Math.max(...vals)];
  const prom = promedio ?? (vals.reduce((a, b) => a + b, 0) / (vals.length || 1));
  const paso = (v) => {
    if (typeof v !== "number") return null;
    if (escala === "divergente") return Math.max(0, Math.min(8, Math.round(((v - prom) / rango) * 4) + 4));
    return Math.max(0, Math.min(8, Math.floor(((v - mn) / (mx - mn || 1)) * 9)));
  };
  const pref = escala === "divergente" ? "--color-divergente-" : "--color-escala-";
  const orden = useMemo(() => { const a = [...mxEstados]; const k = hover?.id || seleccionado; if (k) a.sort((x, y) => (x.id === k) - (y.id === k)); return a; }, [hover, seleccionado]);
  const mover = (e, est) => { const r = ref.current.getBoundingClientRect(); setHover({ id: est.id, x: e.clientX - r.left, y: e.clientY - r.top, w: r.width }); };
  const actual = hover && mxEstados.find((s) => s.id === hover.id);
  const v = actual ? valores[actual.id] : null;
  const diff = typeof v === "number" ? v - prom : null;
  return React.createElement("figure", { style: { margin: 0, ...style } },
    React.createElement("div", { ref, style: { position: "relative" }, onPointerLeave: () => setHover(null) },
      React.createElement("svg", { viewBox: mxViewBox, width: "100%", role: "img", "aria-label": "Mapa de México por estado", style: { display: "block", overflow: "visible", touchAction: "manipulation" } },
        orden.map((s) => {
          const p = paso(valores[s.id]); const act = hover?.id === s.id; const sel = seleccionado === s.id;
          return React.createElement("path", { key: s.id, d: s.d, tabIndex: 0, "aria-label": `${s.nombre}: ${typeof valores[s.id] === "number" ? formato(valores[s.id]) : "sin dato"}`,
            fill: p == null ? "var(--color-superficie-alta)" : `var(${pref}${p})`,
            stroke: sel ? "var(--color-foco-encendido)" : act ? "var(--color-texto)" : "var(--color-fondo)", strokeWidth: sel ? 3 : act ? 2 : 0.8, strokeLinejoin: "round",
            style: { cursor: "pointer", outline: "none", transition: "stroke var(--duration-instante) var(--ease-entrada)" },
            onPointerMove: (e) => mover(e, s), onPointerDown: (e) => mover(e, s), onClick: () => onSeleccionar && onSeleccionar(s.id),
            onFocus: (e) => { const r = ref.current.getBoundingClientRect(), b = e.target.getBoundingClientRect(); setHover({ id: s.id, x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2, w: r.width }); },
            onBlur: () => setHover(null) });
        })),
      actual ? React.createElement("div", { role: "status", style: {
        position: "absolute", left: hover.x, top: hover.y, pointerEvents: "none", zIndex: 2,
        transform: `translate(${hover.x > hover.w * 0.6 ? "calc(-100% - 14px)" : "14px"}, calc(-100% - 10px))`,
        minWidth: 150, maxWidth: 220, padding: "10px 12px", background: "var(--color-superficie-alta)", border: "1px solid var(--color-linea)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-tooltip)", display: "flex", flexDirection: "column", gap: 4 } },
        React.createElement("span", { style: { fontFamily: "var(--font-titulo)", fontWeight: 600, fontSize: 16, lineHeight: 1.2, color: "var(--color-texto)" } }, actual.nombre),
        React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 500, color: "var(--color-acento-texto)", fontVariantNumeric: "tabular-nums" } }, typeof v === "number" ? formato(v) : "Sin dato"),
        diff != null ? React.createElement("span", { style: { fontFamily: "var(--font-texto)", fontSize: 13, lineHeight: 1.35, color: "var(--color-texto-2)" } }, Math.abs(diff) < 0.05 ? "Igual al promedio" : `${Math.abs(diff).toFixed(1)} pts ${diff > 0 ? "arriba" : "abajo"} del promedio`) : null) : null),
    mostrarLeyenda ? React.createElement("figcaption", { style: { marginTop: 14, display: "flex", flexDirection: "column", gap: 6, maxWidth: 360 } },
      React.createElement("span", { style: { fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-texto-2)" } }, etiquetaLeyenda),
      React.createElement("div", { style: { display: "flex", height: 12, borderRadius: 2, overflow: "hidden" } }, Array.from({ length: 9 }, (_, i) => React.createElement("span", { key: i, style: { flex: 1, background: `var(${pref}${i})` } }))),
      React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--color-texto-3)" } },
        escala === "divergente"
          ? [React.createElement("span", { key: 0 }, `−${rango} pts`), React.createElement("span", { key: 1 }, "promedio"), React.createElement("span", { key: 2 }, `+${rango} pts`)]
          : [React.createElement("span", { key: 0 }, formato(mn)), React.createElement("span", { key: 2 }, formato(mx))])) : null);
}

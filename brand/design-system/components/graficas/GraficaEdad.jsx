import React, { useEffect, useRef, useState } from "react";

const tonos = { luz: "var(--color-foco-encendido)", apagada: "var(--color-texto-3)", texto: "var(--color-texto)", mujer: "var(--color-mujer)", hombre: "var(--color-hombre)" };
const mono = { fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.02em" };

function useAncho(ref, inicial) {
  const [w, setW] = useState(inicial);
  useEffect(() => { if (!ref.current || typeof ResizeObserver === "undefined") return; const ro = new ResizeObserver(([e]) => setW(e.contentRect.width)); ro.observe(ref.current); return () => ro.disconnect(); }, []);
  return w;
}

export function GraficaEdad({ series = [], anotaciones = [], dominioX = [18, 30], dominioY = [30, 80], pasoY = 10, ticksX, alto = 320, etiquetaY = "% que votó", formatoX = (x) => String(x), referencia, hastaX, revelar = true, titulo, style }) {
  const ref = useRef();
  const W = useAncho(ref, 360);
  const m = { t: 18, r: 64, b: 34, l: 34 };
  const iw = Math.max(10, W - m.l - m.r), ih = alto - m.t - m.b;
  const sx = (x) => m.l + ((x - dominioX[0]) / (dominioX[1] - dominioX[0])) * iw;
  const sy = (y) => m.t + (1 - (y - dominioY[0]) / (dominioY[1] - dominioY[0])) * ih;
  const ys = []; for (let y = Math.ceil(dominioY[0] / pasoY) * pasoY; y <= dominioY[1]; y += pasoY) ys.push(y);
  const xs = ticksX || (() => { const a = []; const step = (dominioX[1] - dominioX[0]) > 10 ? 2 : 1; for (let x = dominioX[0]; x <= dominioX[1]; x += step) a.push(x); return a; })();
  const [visto, setVisto] = useState(!revelar);
  useEffect(() => { if (!revelar) return; const r = requestAnimationFrame(() => setVisto(true)); return () => cancelAnimationFrame(r); }, [revelar]);
  const svg = [];
  ys.forEach((y) => {
    svg.push(React.createElement("line", { key: "gy" + y, x1: m.l, x2: m.l + iw, y1: sy(y), y2: sy(y), stroke: "var(--color-linea)", strokeWidth: 1 }));
    svg.push(React.createElement("text", { key: "ty" + y, x: m.l - 8, y: sy(y) + 4, textAnchor: "end", style: { ...mono, fill: "var(--color-texto-3)" } }, y));
  });
  xs.forEach((x) => svg.push(React.createElement("text", { key: "tx" + x, x: sx(x), y: alto - 10, textAnchor: "middle", style: { ...mono, fill: "var(--color-texto-3)" } }, formatoX(x))));
  if (referencia) {
    svg.push(React.createElement("line", { key: "ref", x1: m.l, x2: m.l + iw, y1: sy(referencia.y), y2: sy(referencia.y), stroke: "var(--color-texto-2)", strokeWidth: 1, strokeDasharray: "3 4" }));
    svg.push(React.createElement("text", { key: "reft", x: m.l + iw + 6, y: sy(referencia.y) + 4, style: { ...mono, fill: "var(--color-texto-2)" } }, referencia.etiqueta ?? referencia.y));
  }
  series.forEach((s) => {
    const pts = (s.puntos || []).filter((p) => hastaX == null || p.x <= hastaX);
    if (!pts.length) return;
    const color = tonos[s.tono] || s.tono || tonos.luz;
    const d = pts.map((p, i) => (i ? "L" : "M") + sx(p.x).toFixed(1) + "," + sy(p.y).toFixed(1)).join("");
    const destacada = s.tono === "luz" || !s.tono;
    svg.push(React.createElement("path", { key: "s" + s.id, d, fill: "none", stroke: color, strokeWidth: destacada ? 3 : 2, strokeLinejoin: "round", strokeLinecap: "round", strokeDasharray: s.punteada ? "2 6" : "1", pathLength: s.punteada ? undefined : 1, strokeDashoffset: s.punteada || visto ? 0 : 1, style: { transition: "stroke-dashoffset var(--duration-escena) var(--ease-entrada)" } }));
    const u = pts[pts.length - 1];
    svg.push(React.createElement("circle", { key: "e" + s.id, cx: sx(u.x), cy: sy(u.y), r: destacada ? 4.5 : 3.5, fill: color }));
    svg.push(React.createElement("text", { key: "el" + s.id, x: sx(u.x) + 9, y: sy(u.y) + 4, style: { ...mono, fontSize: 13, fontWeight: 500, fill: color } }, s.etiquetaFinal ?? `${u.y}%`));
  });
  const notas = anotaciones.filter((a) => hastaX == null || a.x <= hastaX).map((a, i) => {
    const x = sx(a.x), y = sy(a.y); const arriba = a.lado !== "abajo";
    const ali = x > m.l + iw * 0.66 ? "derecha" : x < m.l + iw * 0.2 ? "izquierda" : "centro";
    svg.push(React.createElement("line", { key: "al" + i, x1: x, x2: x, y1: y + (arriba ? -7 : 7), y2: y + (arriba ? -22 : 22), stroke: "var(--color-texto-2)", strokeWidth: 1 }));
    svg.push(React.createElement("circle", { key: "ac" + i, cx: x, cy: y, r: 5, fill: "var(--color-fondo)", stroke: "var(--color-texto)", strokeWidth: 1.5 }));
    return React.createElement("div", { key: "an" + i, style: { position: "absolute", left: x, top: arriba ? y - 24 : y + 24, transform: `translate(${ali === "derecha" ? "-100%" : ali === "izquierda" ? "0" : "-50%"}, ${arriba ? "-100%" : "0"})`, width: "max-content", maxWidth: 170, fontFamily: "var(--font-texto)", fontSize: 13, lineHeight: 1.35, color: "var(--color-texto)", textAlign: ali === "derecha" ? "right" : ali === "izquierda" ? "left" : "center", textWrap: "balance", pointerEvents: "none" } },
      a.cifra ? React.createElement("div", { style: { ...mono, fontSize: 14, fontWeight: 600, color: "var(--color-acento-texto)" } }, a.cifra) : null, a.texto);
  });
  return React.createElement("figure", { style: { margin: 0, ...style } },
    titulo ? React.createElement("figcaption", { style: { fontFamily: "var(--font-titulo)", fontWeight: 600, fontSize: "var(--text-titulo-3)", lineHeight: "var(--text-titulo-3--line-height)", marginBottom: 6 } }, titulo) : null,
    React.createElement("div", { style: { ...mono, color: "var(--color-texto-2)", marginBottom: 4 } }, etiquetaY),
    React.createElement("div", { ref, style: { position: "relative", width: "100%" } },
      React.createElement("svg", { width: W, height: alto, role: "img", "aria-label": titulo || "Participación por edad", style: { display: "block", overflow: "visible" } }, svg),
      notas));
}

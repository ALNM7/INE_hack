import React, { useMemo } from "react";
import { mxEstados, mxViewBox } from "../graficas/mxEstados.js";

function rng(seed) { let s = (seed * 9301 + 49297) % 233280 || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

let _poligonos = null;
function poligonos() {
  if (_poligonos) return _poligonos;
  _poligonos = [];
  for (const e of mxEstados) for (const anillo of e.d.split("Z")) {
    if (!anillo) continue;
    const pts = anillo.replace("M", "").split("L").map((p) => p.split(",").map(Number));
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, a = 0;
    pts.forEach(([x, y], i) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); const [nx, ny] = pts[(i + 1) % pts.length]; a += x * ny - nx * y; });
    _poligonos.push({ pts, x0, y0, x1, y1, area: Math.abs(a / 2) });
  }
  return _poligonos;
}
function dentro(x, y) {
  for (const p of poligonos()) {
    if (x < p.x0 || x > p.x1 || y < p.y0 || y > p.y1) continue;
    let c = false; const v = p.pts;
    for (let i = 0, j = v.length - 1; i < v.length; j = i++) if ((v[i][1] > y) !== (v[j][1] > y) && x < ((v[j][0] - v[i][0]) * (y - v[i][1])) / (v[j][1] - v[i][1]) + v[i][0]) c = !c;
    if (c) return true;
  }
  return false;
}
const _cache = {};
function puntosMexico(total) {
  if (_cache[total]) return _cache[total];
  const area = poligonos().reduce((s, p) => s + p.area, 0);
  const [, , W, H] = mxViewBox.split(" ").map(Number);
  let paso = Math.sqrt(area / total / 0.866), mejor = null;
  for (let k = 0; k < 6; k++) {
    const pts = []; const dy = paso * 0.866;
    for (let f = 0, y = dy / 2; y < H; f++, y += dy) for (let x = (f % 2 ? paso : paso / 2); x < W; x += paso) if (dentro(x, y)) pts.push([x, y]);
    mejor = { pts, paso };
    if (Math.abs(pts.length - total) / total < 0.04) break;
    paso *= Math.sqrt(pts.length / total);
  }
  return (_cache[total] = mejor);
}

export function CampoLuces({ forma = "mexico", total = 400, proporcion = 0.61, encendidas, columnas = 20, radio = 4, separacion = 7, semilla = 1, orden = "azar", halo = true, animar = true, mostrarMapa = true, colorEncendida = "var(--color-foco-encendido)", colorApagada = "var(--color-foco-apagado)", colorMapa = "var(--color-superficie)", colorBordes = "var(--color-linea)", etiqueta, style }) {
  const geo = useMemo(() => {
    if (forma !== "mexico") {
      const paso = radio * 2 + separacion;
      const pts = Array.from({ length: total }, (_, i) => [(i % columnas) * paso + radio, Math.floor(i / columnas) * paso + radio]);
      const w = columnas * paso - separacion, h = Math.ceil(total / columnas) * paso - separacion;
      return { pts, r: radio, viewBox: `${-radio * 1.2} ${-radio * 1.2} ${w + radio * 2.4} ${h + radio * 2.4}` };
    }
    const { pts, paso } = puntosMexico(total);
    return { pts, r: paso * 0.24, viewBox: mxViewBox, mapa: true };
  }, [forma, total, columnas, radio, separacion]);
  const N = geo.pts.length;
  const rangos = useMemo(() => {
    const r = rng(semilla); const idx = Array.from({ length: N }, (_, i) => i);
    if (orden === "azar") for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const rank = new Array(N); idx.forEach((v, k) => { rank[v] = k; }); return rank;
  }, [N, semilla, orden]);
  const n = encendidas != null ? Math.round((encendidas / total) * N) : Math.round(N * proporcion);
  const R = geo.r;
  const hijos = [];
  if (geo.mapa && mostrarMapa) hijos.push(React.createElement("g", { key: "mapa", "aria-hidden": true }, mxEstados.map((e) => React.createElement("path", { key: e.id, d: e.d, fill: colorMapa, stroke: colorBordes, strokeWidth: 0.8, strokeLinejoin: "round" }))));
  geo.pts.forEach(([cx, cy], i) => {
    const on = rangos[i] < n;
    const delay = animar ? `calc(var(--duration-escalonado) * ${Math.abs(rangos[i] - n) % 160})` : "0ms";
    const tr = animar ? `fill var(--duration-larga) var(--ease-apagado) ${delay}, opacity var(--duration-larga) var(--ease-apagado) ${delay}` : "none";
    if (halo) hijos.push(React.createElement("circle", { key: "h" + i, cx, cy, r: R * 2.1, fill: colorEncendida, style: { opacity: on ? 0.16 : 0, transition: tr } }));
    hijos.push(React.createElement("circle", { key: i, cx, cy, r: R, style: { fill: on ? colorEncendida : colorApagada, transition: tr } }));
  });
  return React.createElement("svg", { viewBox: geo.viewBox, width: "100%", role: "img", "aria-label": etiqueta || `${n} de ${N} luces encendidas`, style: { display: "block", overflow: "visible", ...style } }, hijos);
}

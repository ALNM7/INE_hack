import React from "react";
import { CampoLuces } from "../narrativa/CampoLuces.jsx";

const W = 1080, H = 1920;
const t = (n) => ({ fontSize: `var(--text-wrapped-${n})`, lineHeight: `var(--text-wrapped-${n}--line-height)`, letterSpacing: `var(--text-wrapped-${n}--letter-spacing)` });
const tit = { fontFamily: "var(--font-titulo)", fontWeight: 700, fontStretch: "82%", margin: 0, textWrap: "balance" };
const cuerpo = { fontFamily: "var(--font-texto)", ...t("cuerpo"), color: "var(--color-texto)", margin: 0, textWrap: "pretty" };
const eti = { fontFamily: "var(--font-mono)", ...t("etiqueta"), textTransform: "uppercase", fontWeight: 500, color: "var(--color-texto-2)" };
const pct = (v) => `${Number(v).toFixed(1)}%`;
const h = React.createElement;

function Cifra({ v, color = "var(--color-luz)", size }) {
  return h("div", { style: { ...tit, ...t("cifra"), fontSize: size || "var(--text-wrapped-cifra)", color, display: "flex", alignItems: "baseline", fontVariantNumeric: "tabular-nums" } }, Number(v).toFixed(1), h("span", { style: { fontSize: "0.42em", marginLeft: 8 } }, "%"));
}

const contenidos = {
  municipio: (d) => [
    h("span", { key: "a", style: { ...eti, color: "var(--color-luz)" } }, `Tu municipio · ${d.anio ?? 2024}`),
    h("h2", { key: "b", style: { ...tit, ...t("titulo"), color: "var(--color-texto)" } }, d.municipio ?? "Zapopan"),
    h(Cifra, { key: "c", v: d.valor ?? 54.2 }),
    h("p", { key: "d", style: cuerpo }, `de las personas de 18 a 29 años en ${d.municipio ?? "Zapopan"} votó en ${d.anio ?? 2024}.`),
    h("div", { key: "e", style: { marginTop: "auto", width: 888 } }, h(CampoLuces, { total: 240, proporcion: (d.valor ?? 54.2) / 100, animar: false, colorMapa: "var(--color-noche-2)", colorBordes: "var(--color-noche-linea)", colorEncendida: "var(--color-luz)", colorApagada: "var(--color-apagada)" })),
  ],
  edad: (d) => {
    const fila = (lab, v, k) => h("div", { key: k, style: { display: "flex", flexDirection: "column", gap: 24 } },
      h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } }, h("span", { style: eti }, lab), h("span", { style: { ...tit, fontSize: 120, lineHeight: 1, color: "var(--color-luz)", fontVariantNumeric: "tabular-nums" } }, pct(v))),
      h(CampoLuces, { forma: "rejilla", total: 50, encendidas: Math.round(v / 2), columnas: 25, radio: 13, separacion: 21, animar: false, halo: false, colorEncendida: "var(--color-luz)", colorApagada: "var(--color-apagada)" }));
    return [
      h("span", { key: "a", style: { ...eti, color: "var(--color-luz)" } }, "Por edad · 2024"),
      h("h2", { key: "b", style: { ...tit, ...t("titulo"), color: "var(--color-texto)" } }, `A tus ${d.edad ?? 24} años, se vota menos que a los 18`),
      h("div", { key: "c", style: { display: "flex", flexDirection: "column", gap: 80, marginTop: 40 } }, fila("A los 18 años", d.valor18 ?? 61, "f1"), fila(`A los ${d.edad ?? 24} años`, d.valorEdad ?? 47.6, "f2")),
      h("p", { key: "d", style: { ...cuerpo, marginTop: "auto", color: "var(--color-texto-2)" } }, "Cada punto son dos de cada cien personas."),
    ];
  },
  generacion: (d) => {
    const pts = d.puntos ?? [{ anio: 2012, edad: 18, valor: 66.7 }, { anio: 2018, edad: 24, valor: 52.1 }, { anio: 2024, edad: 30, valor: 50.3 }];
    return [
      h("span", { key: "a", style: { ...eti, color: "var(--color-luz)" } }, d.antetitulo ?? "Tu generación · 18 años en 2012"),
      h("h2", { key: "b", style: { ...tit, ...t("titulo"), color: "var(--color-texto)" } }, d.titulo ?? "Así se fue apagando tu generación"),
      h("div", { key: "c", style: { display: "flex", flexDirection: "column", gap: 64, marginTop: 80 } }, pts.map((p, i) => h("div", { key: i, style: { display: "flex", flexDirection: "column", gap: 20 } },
        h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
          h("span", { style: eti }, `${p.anio} · ${p.edad} años`),
          h("span", { style: { ...tit, fontSize: 150, lineHeight: 0.9, color: i === 0 ? "var(--color-luz)" : "var(--color-texto)", fontVariantNumeric: "tabular-nums" } }, pct(p.valor))),
        h("div", { style: { height: 20, background: "var(--color-noche-3)", borderRadius: 2 } }, h("div", { style: { height: "100%", width: `${p.valor}%`, background: i === 0 ? "var(--color-luz)" : `var(--color-seq-${7 - i * 2})`, borderRadius: 2 } }))))),
      h("p", { key: "d", style: { ...cuerpo, marginTop: "auto" } }, d.texto ?? "Nunca volvió a votar como la primera vez."),
    ];
  },
  secciones: (d) => {
    const lado = (lab, s, k) => h("div", { key: k, style: { flex: 1, display: "flex", flexDirection: "column", gap: 28 } },
      h("span", { style: eti }, lab), h("span", { style: { ...tit, fontSize: 150, lineHeight: 0.9, color: k === "a" ? "var(--color-luz)" : "var(--color-texto-2)" } }, `${Math.round(s.valor)}%`),
      h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--color-texto-2)" } }, `Sección ${s.id}`),
      h(CampoLuces, { forma: "rejilla", total: 100, encendidas: Math.round(s.valor), columnas: 10, radio: 11, separacion: 13, animar: false, halo: false, colorEncendida: "var(--color-luz)", colorApagada: "var(--color-apagada)" }));
    return [
      h("span", { key: "a", style: { ...eti, color: "var(--color-luz)" } }, `Secciones · ${d.municipio ?? "Zapopan"}`),
      h("h2", { key: "b", style: { ...tit, ...t("titulo"), color: "var(--color-texto)" } }, "En el mismo municipio, calles que votan distinto"),
      h("div", { key: "c", style: { display: "flex", gap: 64, marginTop: 80 } }, lado("La más encendida", d.alta ?? { id: "1482", valor: 72 }, "a"), lado("La más apagada", d.baja ?? { id: "1530", valor: 31 }, "b")),
      h("p", { key: "d", style: { ...cuerpo, marginTop: "auto", color: "var(--color-texto-2)" } }, "Participación de 18 a 29 años por sección electoral."),
    ];
  },
  cierre: (d) => [
    h("div", { key: "a", style: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" } },
      h("div", { style: { position: "relative", width: 360, height: 360, display: "flex", alignItems: "center", justifyContent: "center" } },
        [360, 260, 180].map((s, i) => h("span", { key: i, style: { position: "absolute", width: s, height: s, borderRadius: "50%", background: "var(--color-luz)", opacity: [0.06, 0.12, 0.22][i] } })),
        h("span", { style: { position: "relative", width: 120, height: 120, borderRadius: "50%", background: "var(--color-luz-suave)", boxShadow: "0 0 0 16px var(--color-luz)" } }))),
    h("h2", { key: "b", style: { ...tit, fontSize: 132, lineHeight: 0.95, letterSpacing: "-0.035em", color: "var(--color-texto)" } }, d.pregunta ?? "¿Tu luz sigue encendida?"),
    h("p", { key: "c", style: { ...cuerpo, color: "var(--color-texto-2)" } }, d.texto ?? "Hay más de 15 mil secciones donde los jóvenes votan 60% o más."),
    h("span", { key: "d", style: { fontFamily: "var(--font-mono)", fontSize: 34, fontWeight: 500, color: "var(--color-luz)" } }, d.url ?? "lageneracionqueseapago.mx"),
  ],
};

export function TarjetaWrapped({ variante = "municipio", datos = {}, escala = 1, indice, total = 5, fuente = "INE, Conteo Censal de Participación 2024", style }) {
  const pag = indice != null ? `${String(indice).padStart(2, "0")}/${String(total).padStart(2, "0")}` : null;
  return h("div", { style: { width: W * escala, height: H * escala, overflow: "hidden", flex: "none", ...style } },
    h("div", { "data-tarjeta": variante, style: { width: W, height: H, transform: `scale(${escala})`, transformOrigin: "0 0", boxSizing: "border-box", padding: "96px 96px 88px", background: "var(--color-noche-1)", color: "var(--color-hueso)", display: "flex", flexDirection: "column", gap: 40, position: "relative", fontFamily: "var(--font-texto)" } },
      h("header", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 36, borderBottom: "2px solid var(--color-noche-linea)" } },
        h("span", { style: { fontFamily: "var(--font-titulo)", fontWeight: 700, fontStretch: "82%", fontSize: 38, letterSpacing: "-0.02em" } }, "La generación que se apagó"),
        pag ? h("span", { style: { fontFamily: "var(--font-mono)", fontSize: 30, color: "var(--color-arena)" } }, pag) : null),
      h("main", { style: { flex: 1, display: "flex", flexDirection: "column", gap: 40, paddingTop: 40 } }, (contenidos[variante] || contenidos.municipio)(datos)),
      h("footer", { style: { paddingTop: 32, borderTop: "2px solid var(--color-noche-linea)", fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--color-ceniza)" } }, `Fuente: ${fuente}`)));
}

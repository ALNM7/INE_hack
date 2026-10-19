import React from "react";
import { CampoLuces } from "../narrativa/CampoLuces.jsx";
import { PieFuente } from "../fuentes/PieFuente.jsx";

const h = React.createElement;
const mono = (s = 11) => ({ fontFamily: "var(--font-mono)", fontSize: s, letterSpacing: "0.02em" });
const tit = { fontFamily: "var(--font-titulo)", fontWeight: 700, fontStretch: "82%", margin: 0 };
const ante = { ...mono(10.5), letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, color: "var(--color-texto-2)" };
const pct = (v) => `${Number(v).toFixed(1)}%`;

export function FichaImprimible({
  municipio = "Zapopan", estado = "Jalisco", anio = 2024,
  participacionJoven = 54.2, participacionTotal = 63.8, participacionEstado = 52.6, participacionNacional = 51.9,
  porEdad = [{ grupo: "18–19", valor: 58.4 }, { grupo: "20–24", valor: 51.0 }, { grupo: "25–29", valor: 49.1 }, { grupo: "30–39", valor: 56.7 }, { grupo: "40–59", valor: 67.9 }, { grupo: "60 y más", valor: 72.3 }],
  seccionAlta = { id: "1482", valor: 72.0 }, seccionBaja = { id: "1530", valor: 31.0 },
  preguntas = ["¿Por qué creen que a los 25 se vota menos que a los 18?", "¿Qué hace distinta a una sección donde los jóvenes sí votan?", "¿Qué tendría que pasar para que su luz se encienda en 2027?"],
  url = "lageneracionqueseapago.mx", qrSrc, escala = 1, style,
}) {
  const qr = qrSrc || `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=0&color=1C1814&bgcolor=FBF8F3&data=${encodeURIComponent("https://" + url)}`;
  const max = Math.max(...porEdad.map((p) => p.valor), 80);
  return h("div", { style: { width: 816 * escala, height: 1056 * escala, overflow: "hidden", flex: "none", ...style } },
    h("article", { "data-tema": "impresion", "data-ficha": municipio, style: { width: 816, height: 1056, transform: `scale(${escala})`, transformOrigin: "0 0", boxSizing: "border-box", padding: "48px 56px 40px", background: "var(--color-fondo)", color: "var(--color-texto)", fontFamily: "var(--font-texto)", display: "flex", flexDirection: "column", gap: 22 } },
      h("header", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 12, borderBottom: "1.5px solid var(--color-texto)" } },
        h("span", { style: { ...tit, fontSize: 18, letterSpacing: "-0.01em" } }, "La generación que se apagó"),
        h("span", { style: ante }, `Ficha municipal · ${anio}`)),
      h("div", null,
        h("h1", { style: { ...tit, fontSize: 52, lineHeight: 0.95, letterSpacing: "-0.035em" } }, municipio),
        h("div", { style: { fontSize: 16, color: "var(--color-texto-2)", marginTop: 6 } }, estado)),
      h("section", { style: { display: "grid", gridTemplateColumns: "1fr 240px", gap: 36, alignItems: "start" } },
        h("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
          h("span", { style: ante }, "Jóvenes de 18 a 29 años que votaron"),
          h("div", { style: { ...tit, fontSize: 112, lineHeight: 0.9, letterSpacing: "-0.045em", color: "var(--color-acento-texto)", fontVariantNumeric: "tabular-nums" } }, Number(participacionJoven).toFixed(1), h("span", { style: { fontSize: "0.45em" } }, "%")),
          h("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, auto)", justifyContent: "start", gap: "4px 28px", marginTop: 8 } },
            [["Todas las edades", participacionTotal], [estado + " (18–29)", participacionEstado], ["Nacional (18–29)", participacionNacional]].map(([l, v], i) => h("div", { key: i, style: { display: "flex", flexDirection: "column", gap: 2 } }, h("span", { style: { ...mono(18), fontWeight: 500 } }, pct(v)), h("span", { style: { fontSize: 12, color: "var(--color-texto-2)" } }, l))))),
        h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
          h(CampoLuces, { forma: "rejilla", total: 100, proporcion: participacionJoven / 100, columnas: 10, radio: 7, separacion: 9, halo: false, animar: false }),
          h("span", { style: { fontSize: 12, color: "var(--color-texto-2)" } }, "De cada 100 jóvenes, ", h("b", null, Math.round(participacionJoven)), " votaron."))),
      h("section", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, paddingTop: 18, borderTop: "1px solid var(--color-linea)" } },
        h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
          h("span", { style: ante }, "Participación por edad"),
          porEdad.map((p, i) => h("div", { key: i, style: { display: "grid", gridTemplateColumns: "64px 1fr 48px", alignItems: "center", gap: 10 } },
            h("span", { style: mono(11.5) }, p.grupo),
            h("div", { style: { height: 12, background: "var(--color-superficie-alta)" } }, h("div", { style: { height: "100%", width: `${(p.valor / max) * 100}%`, background: i < 3 ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)" } })),
            h("span", { style: { ...mono(11.5), textAlign: "right", fontWeight: 500 } }, pct(p.valor))))),
        h("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
          h("span", { style: ante }, "Contraste entre secciones (18–29)"),
          [["Más encendida", seccionAlta, "var(--color-acento-texto)"], ["Más apagada", seccionBaja, "var(--color-texto-2)"]].map(([l, s, c], i) => h("div", { key: i, style: { display: "flex", alignItems: "baseline", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-linea)" } },
            h("span", { style: { fontSize: 14 } }, l, h("span", { style: { ...mono(11.5), color: "var(--color-texto-2)", marginLeft: 8 } }, `Secc. ${s.id}`)),
            h("span", { style: { ...tit, fontSize: 30, color: c } }, `${Math.round(s.valor)}%`))))),
      h("section", { style: { paddingTop: 18, borderTop: "1px solid var(--color-linea)", display: "flex", flexDirection: "column", gap: 8 } },
        h("span", { style: ante }, "Para conversar en clase"),
        h("ol", { style: { margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4, fontSize: 15, lineHeight: 1.45 } }, preguntas.map((q, i) => h("li", { key: i }, q)))),
      h("footer", { style: { marginTop: "auto", display: "grid", gridTemplateColumns: "96px 1fr", gap: 20, alignItems: "end", paddingTop: 16, borderTop: "1.5px solid var(--color-texto)" } },
        h("img", { src: qr, alt: `Código QR a ${url}`, width: 96, height: 96, style: { display: "block" } }),
        h("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
          h("span", { style: { ...mono(13), fontWeight: 600 } }, url),
          h("span", { style: { fontSize: 11.5, lineHeight: 1.4, color: "var(--color-texto-2)" } }, "Participación = personas que votaron entre personas en la lista nominal, por edad cumplida el día de la elección. Secciones con menos de 50 jóvenes en lista nominal no se muestran."),
          h(PieFuente, { fuente: `INE, Conteo Censal de Participación ${anio}`, style: { fontSize: 11 } })))));
}

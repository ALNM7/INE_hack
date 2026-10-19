import React from "react";

const mono = { fontFamily: "var(--font-mono)", fontSize: "var(--text-etiqueta)", lineHeight: 1.45, letterSpacing: "var(--text-etiqueta--letter-spacing)" };

export function PieFuente({ fuente = "INE, Conteos Censales de Participación 2012, 2018 y 2024", nota, enlace, style }) {
  return React.createElement("p", { style: { margin: 0, ...mono, color: "var(--color-texto-3)", textWrap: "pretty", ...style } },
    React.createElement("span", { style: { color: "var(--color-texto-2)", fontWeight: 500 } }, "Fuente: "),
    enlace ? React.createElement("a", { href: enlace, style: { color: "inherit" } }, fuente) : fuente,
    nota ? React.createElement(React.Fragment, null, React.createElement("span", { "aria-hidden": true }, " · "), nota) : null);
}


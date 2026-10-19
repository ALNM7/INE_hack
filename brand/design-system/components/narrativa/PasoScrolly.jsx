import React from "react";

export function PasoScrolly({ numero, antetitulo, activo = true, alineacion = "izquierda", children, style }) {
  const centro = alineacion === "centro";
  return React.createElement("section", {
    "data-paso": numero, "aria-current": activo ? "step" : undefined,
    style: { minHeight: "var(--spacing-paso)", display: "flex", alignItems: "center", justifyContent: centro ? "center" : alineacion === "derecha" ? "flex-end" : "flex-start", pointerEvents: "none", ...style },
  },
    React.createElement("div", {
      style: {
        pointerEvents: "auto", width: "100%", maxWidth: "24rem", boxSizing: "border-box", padding: "20px 22px 22px",
        background: "var(--color-superficie)", border: "1px solid var(--color-linea)", borderRadius: "var(--radius-lg)",
        display: "flex", flexDirection: "column", gap: 10,
        opacity: activo ? 1 : 0.4, transform: activo ? "translateY(0)" : "translateY(8px)",
        transition: "opacity var(--duration-larga) var(--ease-entrada), transform var(--duration-larga) var(--ease-entrada)",
      },
    },
      antetitulo || numero != null ? React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: "var(--text-antetitulo)", letterSpacing: "var(--text-antetitulo--letter-spacing)", textTransform: "uppercase", fontWeight: 500, color: activo ? "var(--color-acento-texto)" : "var(--color-texto-3)" } },
        React.createElement("span", { "aria-hidden": true, style: { width: 7, height: 7, borderRadius: "50%", background: activo ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)", boxShadow: activo ? "var(--shadow-halo)" : "none" } }),
        antetitulo ?? String(numero).padStart(2, "0")) : null,
      React.createElement("div", { style: { fontFamily: "var(--font-texto)", fontSize: "var(--text-cuerpo)", lineHeight: "var(--text-cuerpo--line-height)", color: "var(--color-texto)", textWrap: "pretty" } }, children)));
}

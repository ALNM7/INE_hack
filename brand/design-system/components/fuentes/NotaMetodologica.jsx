import React from "react";

export function NotaMetodologica({ titulo = "Nota metodológica", abierta = false, children, style }) {
  return React.createElement("details", { open: abierta, style: { borderTop: "1px solid var(--color-linea)", paddingTop: 4, ...style } },
    React.createElement("summary", { style: { listStyle: "none", cursor: "pointer", minHeight: 44, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, fontFamily: "var(--font-mono)", fontSize: "var(--text-antetitulo)", letterSpacing: "var(--text-antetitulo--letter-spacing)", textTransform: "uppercase", fontWeight: 500, color: "var(--color-texto-2)" } },
      titulo, React.createElement("span", { "aria-hidden": true, style: { fontSize: 16 } }, "+")),
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, paddingBottom: 12, fontFamily: "var(--font-texto)", fontSize: "var(--text-nota)", lineHeight: "var(--text-nota--line-height)", color: "var(--color-texto-2)", maxWidth: "var(--container-texto)" } }, children));
}

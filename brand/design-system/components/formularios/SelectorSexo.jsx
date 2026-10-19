import React from "react";
import { campoEstilos } from "./SelectorEstadoMunicipio.jsx";

const def = [{ id: "mujer", nombre: "Mujer" }, { id: "hombre", nombre: "Hombre" }, { id: "nd", nombre: "Prefiero no decir" }];

export function SelectorSexo({ valor, onCambiar = () => {}, opciones = def, etiqueta = "Sexo", ayuda = "Los datos del INE solo distinguen mujeres y hombres.", nombre = "sexo", style }) {
  return React.createElement("fieldset", { style: { border: 0, margin: 0, padding: 0, minWidth: 0, display: "flex", flexDirection: "column", gap: 8, ...style } },
    React.createElement("legend", { style: { ...campoEstilos.etiqueta, padding: 0, marginBottom: 8 } }, etiqueta),
    React.createElement("div", { role: "radiogroup", style: { display: "flex", flexWrap: "wrap", gap: 8 } },
      opciones.map((o) => {
        const sel = valor === o.id;
        return React.createElement("label", { key: o.id, style: {
          position: "relative", flex: "1 1 auto", minHeight: 48, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxSizing: "border-box",
          background: sel ? "var(--color-superficie-alta)" : "var(--color-superficie)", color: sel ? "var(--color-texto)" : "var(--color-texto-2)",
          border: `1.5px solid ${sel ? "var(--color-foco-encendido)" : "var(--color-linea)"}`, borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-texto)", fontSize: 16, fontWeight: sel ? 700 : 400, cursor: "pointer",
          transition: "border-color var(--duration-instante) var(--ease-entrada), background-color var(--duration-instante) var(--ease-entrada)" } },
          React.createElement("input", { type: "radio", name: nombre, value: o.id, checked: sel, onChange: () => onCambiar(o.id), style: { position: "absolute", opacity: 0, inset: 0, margin: 0, cursor: "pointer" } }),
          React.createElement("span", { "aria-hidden": true, style: { width: 8, height: 8, borderRadius: "50%", background: sel ? "var(--color-foco-encendido)" : "var(--color-foco-apagado)", boxShadow: sel ? "var(--shadow-halo)" : "none" } }),
          o.nombre);
      })),
    ayuda ? React.createElement("span", { style: campoEstilos.ayuda }, ayuda) : null);
}

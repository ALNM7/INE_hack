import React, { useState } from "react";
import { Icono } from "../iconos/Icono.jsx";

export const campoEstilos = {
  etiqueta: { fontFamily: "var(--font-texto)", fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: "var(--color-texto)" },
  ayuda: { fontFamily: "var(--font-texto)", fontSize: "var(--text-nota)", lineHeight: "var(--text-nota--line-height)", color: "var(--color-texto-2)" },
  error: { fontFamily: "var(--font-texto)", fontSize: "var(--text-nota)", lineHeight: "var(--text-nota--line-height)", color: "var(--color-alerta)", display: "flex", gap: 6, alignItems: "center" },
  control: (foco, error, disabled) => ({
    width: "100%", boxSizing: "border-box", height: 52, padding: "0 44px 0 14px", appearance: "none", WebkitAppearance: "none",
    background: disabled ? "transparent" : "var(--color-superficie)", color: disabled ? "var(--color-texto-3)" : "var(--color-texto)",
    border: `1.5px solid ${error ? "var(--color-alerta)" : foco ? "var(--color-foco-encendido)" : "var(--color-linea)"}`,
    borderRadius: "var(--radius-sm)", fontFamily: "var(--font-texto)", fontSize: 17, outline: "none",
    boxShadow: foco && !error ? "0 0 0 3px rgb(255 181 71 / 0.18)" : "none",
    transition: "border-color var(--duration-instante) var(--ease-entrada), box-shadow var(--duration-instante) var(--ease-entrada)",
    cursor: disabled ? "not-allowed" : "pointer",
  }),
};

function Selecto({ id, etiqueta, valor, opciones, placeholder, onChange, disabled }) {
  const [foco, setFoco] = useState(false);
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, flex: 1, minWidth: 0 } },
    React.createElement("label", { htmlFor: id, style: { ...campoEstilos.etiqueta, color: disabled ? "var(--color-texto-3)" : "var(--color-texto)" } }, etiqueta),
    React.createElement("div", { style: { position: "relative" } },
      React.createElement("select", { id, value: valor || "", disabled, onChange: (e) => onChange(e.target.value), onFocus: () => setFoco(true), onBlur: () => setFoco(false), style: campoEstilos.control(foco, false, disabled) },
        React.createElement("option", { value: "", disabled: true }, placeholder),
        opciones.map((o) => React.createElement("option", { key: o.id, value: o.id }, o.nombre))),
      React.createElement("span", { "aria-hidden": true, style: { position: "absolute", right: 14, top: 16, pointerEvents: "none", color: "var(--color-texto-2)" } }, React.createElement(Icono, { nombre: "chevron-down", tamano: 20 }))));
}

export function SelectorEstadoMunicipio({ estados = [], estado, municipio, onCambiar = () => {}, direccion = "columna", style }) {
  const est = estados.find((e) => e.id === estado);
  const munis = (est?.municipios || []).map((m) => (typeof m === "string" ? { id: m, nombre: m } : m));
  return React.createElement("div", { style: { display: "flex", flexDirection: direccion === "fila" ? "row" : "column", gap: 16, ...style } },
    React.createElement(Selecto, { id: "sel-estado", etiqueta: "Estado", valor: estado, opciones: estados, placeholder: "Elige tu estado", onChange: (v) => onCambiar({ estado: v, municipio: undefined }) }),
    React.createElement(Selecto, { id: "sel-municipio", etiqueta: "Municipio o alcaldía", valor: municipio, opciones: munis, placeholder: est ? "Elige tu municipio" : "Primero elige un estado", disabled: !est, onChange: (v) => onCambiar({ estado, municipio: v }) }));
}

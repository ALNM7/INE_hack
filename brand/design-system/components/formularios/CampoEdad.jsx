import React, { useState } from "react";
import { Icono } from "../iconos/Icono.jsx";
import { campoEstilos } from "./SelectorEstadoMunicipio.jsx";

export function CampoEdad({ valor, onCambiar = () => {}, min = 18, max = 99, etiqueta = "Tu edad", ayuda = "Solo la usamos para ubicar a tu generación.", error, id = "campo-edad", style }) {
  const [foco, setFoco] = useState(false);
  const n = valor === "" || valor == null ? null : Number(valor);
  const fuera = n != null && (n < min || n > max);
  const msg = error || (fuera ? `Escribe una edad entre ${min} y ${max} años.` : null);
  const btn = (nombre, delta, label) => React.createElement("button", { type: "button", "aria-label": label, onClick: () => onCambiar(Math.max(min, Math.min(max, (n ?? (delta > 0 ? min - 1 : min + 1)) + delta))),
    style: { width: 52, height: 52, flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-superficie)", color: "var(--color-texto)", border: "1.5px solid var(--color-linea)", borderRadius: "var(--radius-sm)", cursor: "pointer" } }, React.createElement(Icono, { nombre, tamano: 20 }));
  return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, ...style } },
    React.createElement("label", { htmlFor: id, style: campoEstilos.etiqueta }, etiqueta),
    React.createElement("div", { style: { display: "flex", gap: 8 } },
      btn("minus", -1, "Restar un año"),
      React.createElement("input", { id, type: "text", inputMode: "numeric", pattern: "[0-9]*", autoComplete: "off", maxLength: 2, value: valor ?? "", "aria-invalid": !!msg, "aria-describedby": id + "-ayuda",
        onChange: (e) => { const t = e.target.value.replace(/\D/g, ""); onCambiar(t === "" ? "" : Number(t)); }, onFocus: () => setFoco(true), onBlur: () => setFoco(false),
        style: { ...campoEstilos.control(foco, !!msg, false), padding: "0 14px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 500, cursor: "text", flex: 1, minWidth: 0 } }),
      btn("plus", 1, "Sumar un año")),
    React.createElement("span", { id: id + "-ayuda", style: msg ? campoEstilos.error : campoEstilos.ayuda }, msg ? [React.createElement(Icono, { key: "i", nombre: "circle-alert", tamano: 16 }), msg] : ayuda));
}

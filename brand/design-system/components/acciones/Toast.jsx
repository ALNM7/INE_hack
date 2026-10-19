import React, { useEffect, useState } from "react";
import { Icono } from "../iconos/Icono.jsx";

const iconos = { info: "info", exito: "check", alerta: "circle-alert" };

export function Toast({ tono = "info", mensaje, accion, onCerrar, flotante = false, duracion = 0, children, style }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setVisible(true)); return () => cancelAnimationFrame(r); }, []);
  useEffect(() => { if (!duracion || !onCerrar) return; const t = setTimeout(onCerrar, duracion); return () => clearTimeout(t); }, [duracion, onCerrar]);
  const color = tono === "alerta" ? "var(--color-alerta)" : tono === "exito" ? "var(--color-foco-encendido)" : "var(--color-texto-2)";
  return React.createElement("div", {
    role: tono === "alerta" ? "alert" : "status", "aria-live": tono === "alerta" ? "assertive" : "polite",
    style: {
      position: flotante ? "fixed" : "relative", left: flotante ? 16 : undefined, right: flotante ? 16 : undefined, bottom: flotante ? "calc(16px + env(safe-area-inset-bottom, 0px))" : undefined,
      zIndex: flotante ? 50 : undefined, maxWidth: 440, margin: flotante ? "0 auto" : undefined, boxSizing: "border-box",
      display: "flex", alignItems: "center", gap: 12, padding: "12px 12px 12px 16px", minHeight: 52,
      background: "var(--color-superficie-alta)", color: "var(--color-texto)", border: "1px solid var(--color-linea)",
      borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-flotante)",
      fontFamily: "var(--font-texto)", fontSize: 16, lineHeight: 1.35,
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity var(--duration-media) var(--ease-entrada), transform var(--duration-media) var(--ease-entrada)",
      ...style,
    },
  },
    React.createElement("span", { style: { color, display: "flex" } }, React.createElement(Icono, { nombre: iconos[tono], tamano: 20 })),
    React.createElement("span", { style: { flex: 1, textWrap: "pretty" } }, mensaje ?? children),
    accion ? React.createElement("button", { type: "button", onClick: accion.onClick, style: { background: "none", border: 0, padding: "0 8px", minHeight: 44, color: "var(--color-acento-texto)", font: "inherit", fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "0.2em" } }, accion.etiqueta) : null,
    onCerrar ? React.createElement("button", { type: "button", "aria-label": "Cerrar", onClick: onCerrar, style: { background: "none", border: 0, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-texto-2)", cursor: "pointer", borderRadius: "var(--radius-sm)" } }, React.createElement(Icono, { nombre: "x", tamano: 18 })) : null
  );
}

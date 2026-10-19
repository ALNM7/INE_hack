import React, { useState } from "react";

const alturas = { md: 48, lg: 56 };

export function Boton({ variante = "primario", tamano = "md", icono, iconoFinal, disabled = false, completo = false, href, type = "button", onClick, children, style, ...rest }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const esTexto = variante === "texto";
  const base = {
    display: completo ? "flex" : "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    width: completo ? "100%" : undefined, boxSizing: "border-box",
    minHeight: esTexto ? 44 : alturas[tamano], padding: esTexto ? "0 4px" : tamano === "lg" ? "0 28px" : "0 22px",
    fontFamily: "var(--font-texto)", fontSize: tamano === "lg" ? 18 : 17, fontWeight: 700, lineHeight: 1.1, letterSpacing: "0.005em",
    borderRadius: "var(--radius-md)", border: "1.5px solid transparent", cursor: disabled ? "not-allowed" : "pointer",
    textDecoration: "none", WebkitTapHighlightColor: "transparent", userSelect: "none",
    transform: press && !disabled ? "scale(0.98)" : "none",
    transition: "background-color var(--duration-instante) var(--ease-entrada), color var(--duration-instante) var(--ease-entrada), border-color var(--duration-instante) var(--ease-entrada), transform var(--duration-instante) var(--ease-entrada)",
  };
  const v = {
    primario: { background: hover ? "var(--color-luz-suave)" : "var(--color-foco-encendido)", color: "var(--color-sobre-acento)" },
    secundario: { background: hover ? "var(--color-superficie-alta)" : "transparent", color: "var(--color-texto)", borderColor: hover ? "var(--color-texto)" : "var(--color-texto-3)" },
    texto: { background: "transparent", color: hover ? "var(--color-texto)" : "var(--color-acento-texto)", textDecoration: "underline", textDecorationThickness: hover ? 2 : 1, textUnderlineOffset: "0.22em", borderRadius: "var(--radius-xs)" },
  }[variante];
  const off = disabled ? (variante === "primario" ? { background: "var(--color-superficie-alta)", color: "var(--color-texto-3)", borderColor: "transparent" } : { color: "var(--color-texto-3)", borderColor: variante === "secundario" ? "var(--color-linea)" : "transparent", background: "transparent" }) : null;
  const Tag = href && !disabled ? "a" : "button";
  return React.createElement(Tag, {
    href: Tag === "a" ? href : undefined, type: Tag === "button" ? type : undefined, disabled: Tag === "button" ? disabled : undefined,
    "aria-disabled": disabled || undefined, onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPress(false); },
    onPointerDown: () => setPress(true), onPointerUp: () => setPress(false),
    style: { ...base, ...v, ...off, ...style }, ...rest,
  }, icono, children != null ? React.createElement("span", null, children) : null, iconoFinal);
}

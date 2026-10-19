import React from "react";
import { lucidePaths } from "./lucide.js";

export function Icono({ nombre, tamano = 20, grosor = 1.75, titulo, style, ...rest }) {
  const inner = lucidePaths[nombre];
  if (!inner) return null;
  return React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg", width: tamano, height: tamano, viewBox: "0 0 24 24",
    fill: "none", stroke: "currentColor", strokeWidth: grosor, strokeLinecap: "round", strokeLinejoin: "round",
    role: titulo ? "img" : undefined, "aria-label": titulo, "aria-hidden": titulo ? undefined : true,
    style: { flex: "none", display: "block", ...style },
    dangerouslySetInnerHTML: { __html: (titulo ? `<title>${titulo}</title>` : "") + inner },
    ...rest,
  });
}

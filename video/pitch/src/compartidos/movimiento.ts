import { interpolate } from "remotion";
import { curva } from "../datos/marca";

type Curva = (t: number) => number;
const limite = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const avance = (frame: number, desde: number, cuadros: number, easing: Curva = curva.entrada) =>
  interpolate(frame, [desde, desde + Math.max(1, cuadros)], [0, 1], { ...limite, easing });

export const entra = (frame: number, desde: number, cuadros: number, distancia = 24) => {
  const p = avance(frame, desde, cuadros);
  return { opacity: p, translate: `0px ${(1 - p) * distancia}px` };
};

export const entraYSale = (frame: number, desde: number, hasta: number, cuadros: number, distancia = 24) => {
  const p = avance(frame, desde, cuadros);
  const q = avance(frame, hasta - cuadros, cuadros, curva.salida);
  return { opacity: p * (1 - q), translate: `0px ${(1 - p) * distancia - q * distancia * 0.5}px` };
};

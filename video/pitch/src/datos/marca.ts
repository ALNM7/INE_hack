import { Easing } from "remotion";
import marca from "./marca.json";

type Bezier = [number, number, number, number];
const bezier = (c: unknown) => {
  const [a, b, x, y] = c as Bezier;
  return Easing.bezier(a, b, x, y);
};

export const color = marca.color;
export const fuente = marca.fuente;
export const duracion = marca.duracion;
export const radio = marca.radio;
export const nombreProyecto = marca.nombre;
export const fuentesLocales = marca.fuentes;

export const curva = {
  entrada: bezier(marca.curva.entrada),
  salida: bezier(marca.curva.salida),
  enfasis: bezier(marca.curva.enfasis),
  escena: bezier(marca.curva.escena),
  apagado: bezier(marca.curva.apagado),
};

export const escalaSecuencial = [
  color.seq0,
  color.seq1,
  color.seq2,
  color.seq3,
  color.seq4,
  color.seq5,
  color.seq6,
  color.seq7,
  color.seq8,
];

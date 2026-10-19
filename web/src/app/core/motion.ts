import tokens from '../../../../brand/tokens.json';

export type Bezier = readonly [number, number, number, number];

export interface Curva {
  nombre: string;
  variable: string;
  css: string;
  bezier: Bezier;
}

export interface Duracion {
  nombre: string;
  variable: string;
  css: string;
  segundos: number;
}

const LINEAL: Bezier = [0, 0, 1, 1];

function aBezier(valor: string): Bezier {
  const coincidencia = /cubic-bezier\(([^)]+)\)/.exec(valor);
  if (!coincidencia) {
    return LINEAL;
  }
  const [x1, y1, x2, y2] = coincidencia[1].split(',').map((n) => Number(n.trim()));
  return [x1, y1, x2, y2];
}

const entradas = Object.entries(tokens.movimiento) as [string, string][];

export const curvas: readonly Curva[] = entradas
  .filter(([variable]) => variable.startsWith('--ease-'))
  .map(([variable, css]) => ({
    nombre: variable.replace('--ease-', ''),
    variable,
    css,
    bezier: aBezier(css),
  }));

export const duraciones: readonly Duracion[] = entradas
  .filter(([variable]) => variable.startsWith('--duration-'))
  .map(([variable, css]) => ({
    nombre: variable.replace('--duration-', ''),
    variable,
    css,
    segundos: parseFloat(css) / 1000,
  }));

export function curva(nombre: string): Curva | undefined {
  return curvas.find((c) => c.nombre === nombre);
}

export function duracion(nombre: string): number {
  return duraciones.find((d) => d.nombre === nombre)?.segundos ?? 0;
}

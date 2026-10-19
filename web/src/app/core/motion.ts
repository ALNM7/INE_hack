import { DestroyRef } from '@angular/core';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import tokens from '../../../../brand/tokens.json';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export { gsap, ScrollTrigger };

export type Bezier = readonly [number, number, number, number];

export type NombreCurva = 'entrada' | 'salida' | 'enfasis' | 'escena' | 'scroll' | 'apagado';

export type NombreDuracion = 'instante' | 'corta' | 'media' | 'larga' | 'escena' | 'encendido' | 'escalonado';

export interface Curva {
  nombre: NombreCurva;
  variable: string;
  css: string;
  bezier: Bezier;
  gsap: string;
}

export interface Duracion {
  nombre: NombreDuracion;
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
  .map(([variable, css]) => {
    const nombre = variable.replace('--ease-', '') as NombreCurva;
    const bezier = aBezier(css);
    const id = `gen-${nombre}`;
    CustomEase.create(id, `M0,0 C${bezier[0]},${bezier[1]} ${bezier[2]},${bezier[3]} 1,1`);
    return { nombre, variable, css, bezier, gsap: id };
  });

export const duraciones: readonly Duracion[] = entradas
  .filter(([variable]) => variable.startsWith('--duration-'))
  .map(([variable, css]) => ({
    nombre: variable.replace('--duration-', '') as NombreDuracion,
    variable,
    css,
    segundos: parseFloat(css) / 1000,
  }));

const reducidas = tokens['movimiento-reducido'] as Record<string, string>;

export function curva(nombre: NombreCurva): string {
  return curvas.find((c) => c.nombre === nombre)!.gsap;
}

export function funcionCurva(nombre: NombreCurva): (t: number) => number {
  return gsap.parseEase(curva(nombre));
}

export function duracion(nombre: NombreDuracion, reducido = false): number {
  const d = duraciones.find((x) => x.nombre === nombre)!;
  if (reducido && d.variable in reducidas) {
    return parseFloat(reducidas[d.variable]) / 1000;
  }
  return d.segundos;
}

export function escalonadoTexto(): number {
  return duracion('corta') / 3;
}

export function contextoGsap(
  destroyRef: DestroyRef,
  alcance: Element,
  crear: (contexto: gsap.Context) => void,
): gsap.Context {
  const contexto = gsap.context(crear, alcance);
  destroyRef.onDestroy(() => contexto.revert());
  return contexto;
}

export const ESCALA_ENTRADA = 0.96;

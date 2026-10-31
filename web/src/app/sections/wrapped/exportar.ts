import { Injectable } from '@angular/core';
import { getFontEmbedCSS, toPng } from 'html-to-image';
import { colorToken, valorToken } from '../../core/tokens';
import { ALTO_TARJETA, ANCHO_TARJETA } from './tarjeta-wrapped';

const PESOS: readonly [string, string][] = [
  ['--font-titulo', '700'],
  ['--font-texto', '400'],
  ['--font-texto', '700'],
  ['--font-mono', '400'],
  ['--font-mono', '500'],
  ['--font-mono', '600'],
];

async function esperarFuentes(): Promise<void> {
  await document.fonts.ready;
  await Promise.all(PESOS.map(([variable, peso]) => document.fonts.load(`${peso} 1em ${valorToken(variable)}`, 'Aáéíóúñ¿?%0123456789')));
}

async function esperarAnimaciones(nodo: HTMLElement): Promise<void> {
  await Promise.all(nodo.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined)));
}

export function nombreArchivo(indice: number): string {
  return `wrapped-${indice}.png`;
}

export async function aBlob(dataUrl: string): Promise<Blob> {
  const respuesta = await fetch(dataUrl);
  return respuesta.blob();
}

export function descargarBlob(blob: Blob, nombre: string): void {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.rel = 'noopener';
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function archivoDe(blob: Blob, indice: number): File {
  return new File([blob], nombreArchivo(indice), { type: 'image/png' });
}

export function puedeCompartirArchivos(): boolean {
  if (typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') {
    return false;
  }
  try {
    return navigator.canShare({ files: [new File([new Uint8Array(1)], nombreArchivo(1), { type: 'image/png' })] });
  } catch {
    return false;
  }
}

export function guardaEnGaleria(): boolean {
  return puedeCompartirArchivos() && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

@Injectable({ providedIn: 'root' })
export class ExportadorTarjetas {
  private fuentes: Promise<string> | null = null;

  async png(nodo: HTMLElement): Promise<string> {
    await esperarFuentes();
    await esperarAnimaciones(nodo);
    const opciones = {
      width: ANCHO_TARJETA,
      height: ALTO_TARJETA,
      canvasWidth: ANCHO_TARJETA,
      canvasHeight: ALTO_TARJETA,
      pixelRatio: 1,
      skipAutoScale: true,
      backgroundColor: colorToken('--color-fondo'),
      style: { transform: 'none' },
      fontEmbedCSS: await this.cssFuentes(nodo),
    };
    await toPng(nodo, opciones);
    return toPng(nodo, opciones);
  }

  async blob(nodo: HTMLElement): Promise<Blob> {
    return aBlob(await this.png(nodo));
  }

  private cssFuentes(nodo: HTMLElement): Promise<string> {
    if (!this.fuentes) {
      this.fuentes = getFontEmbedCSS(nodo).catch((error: unknown) => {
        this.fuentes = null;
        throw error;
      });
    }
    return this.fuentes;
  }
}

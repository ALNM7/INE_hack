import type { Estados } from '../../core/mapa.service';
import { colorToken } from '../../core/tokens';
import { generador } from '../../core/semilla';
import { mapaLuces } from '../../shared/charts/mapa-luces';
import { TOTAL_PUNTOS } from '../escala/resumen';

const ANCHO = 1920;
const ALTO = 1080;
const MARGEN_RELATIVO = 0.06;
const SEMILLA = 2024;
const RADIO_RELATIVO = 0.3;
const HALO_RELATIVO = 0.85;
const PROPORCION_BRILLANTES = 0.18;
const PROPORCION_HALO = 0.14;

let cache: string | null = null;

export function posterHero(estados: Estados): string {
  if (cache) {
    return cache;
  }
  const mapa = mapaLuces(estados, ANCHO, ALTO, TOTAL_PUNTOS, ALTO * MARGEN_RELATIVO);
  const fondo = colorToken('--color-fondo');
  const superficie = colorToken('--color-superficie');
  const linea = colorToken('--color-linea');
  const luz = colorToken('--color-foco-encendido');
  const brillante = colorToken('--color-luz-suave');
  const halo = colorToken('--color-luz-halo');
  const azar = generador(SEMILLA);
  const r = mapa.paso * RADIO_RELATIVO;
  const halos: string[] = [];
  const luces: string[] = [];
  for (let i = 0; i < mapa.xs.length; i++) {
    const cx = mapa.xs[i].toFixed(1);
    const cy = mapa.ys[i].toFixed(1);
    if (azar() < PROPORCION_HALO) {
      halos.push(`<circle cx="${cx}" cy="${cy}" r="${(mapa.paso * HALO_RELATIVO).toFixed(2)}"/>`);
    }
    luces.push(`<circle cx="${cx}" cy="${cy}" r="${r.toFixed(2)}" fill="${azar() < PROPORCION_BRILLANTES ? brillante : luz}"/>`);
  }
  const estadosSvg = mapa.rutas.map((d) => `<path d="${d}"/>`).join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" width="${ANCHO}" height="${ALTO}">` +
    `<rect width="100%" height="100%" fill="${fondo}"/>` +
    `<g fill="${superficie}" stroke="${linea}" stroke-width="1.5" stroke-linejoin="round">${estadosSvg}</g>` +
    `<g fill="${halo}" opacity="0.5">${halos.join('')}</g>` +
    `<g>${luces.join('')}</g>` +
    `</svg>`;
  cache = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return cache;
}

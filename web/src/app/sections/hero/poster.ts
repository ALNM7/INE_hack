import { colorToken } from '../../core/tokens';
import { generador } from '../../core/semilla';

const ANCHO = 1920;
const ALTO = 1080;
const COLUMNAS = 48;
const SEMILLA = 2024;
const RADIO_RELATIVO = 0.11;
const HALO_RELATIVO = 0.32;
const DESPLAZAMIENTO_RELATIVO = 0.28;
const PROPORCION_BRILLANTES = 0.18;
const PROPORCION_HALO = 0.12;

let cache: string | null = null;

export function posterHero(): string {
  if (cache) {
    return cache;
  }
  const fondo = colorToken('--color-fondo');
  const luz = colorToken('--color-foco-encendido');
  const brillante = colorToken('--color-luz-suave');
  const halo = colorToken('--color-luz-halo');
  const azar = generador(SEMILLA);
  const paso = ANCHO / COLUMNAS;
  const alto = paso * Math.sqrt(3) / 2;
  const halos: string[] = [];
  const luces: string[] = [];
  for (let fila = 0, y = alto / 2; y < ALTO + alto; fila++, y += alto) {
    for (let x = fila % 2 ? paso : paso / 2; x < ANCHO + paso; x += paso) {
      const cx = (x + (azar() - 0.5) * paso * DESPLAZAMIENTO_RELATIVO).toFixed(1);
      const cy = (y + (azar() - 0.5) * alto * DESPLAZAMIENTO_RELATIVO).toFixed(1);
      const escala = 0.75 + azar() * 0.5;
      const r = (paso * RADIO_RELATIVO * escala).toFixed(2);
      const esBrillante = azar() < PROPORCION_BRILLANTES;
      if (azar() < PROPORCION_HALO) {
        halos.push(`<circle cx="${cx}" cy="${cy}" r="${(paso * HALO_RELATIVO * escala).toFixed(2)}"/>`);
      }
      luces.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${esBrillante ? brillante : luz}"/>`);
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ANCHO} ${ALTO}" width="${ANCHO}" height="${ALTO}">` +
    `<rect width="100%" height="100%" fill="${fondo}"/>` +
    `<g fill="${halo}">${halos.join('')}</g>` +
    `<g>${luces.join('')}</g>` +
    `</svg>`;
  cache = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return cache;
}

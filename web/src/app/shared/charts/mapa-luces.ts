import { geoConicConformal, geoPath } from 'd3';
import type { Estados } from '../../core/mapa.service';

export interface MapaLuces {
  xs: Float32Array;
  ys: Float32Array;
  paso: number;
  rutas: string[];
  silueta: string;
}

const PARALELOS: [number, number] = [17.5, 29.5];
const MERIDIANO_CENTRAL = 102;
const RAIZ_TRES_MEDIOS = Math.sqrt(3) / 2;
const TOLERANCIA = 0.03;
const INTENTOS = 12;

interface Rejilla {
  puntos: [number, number, number, number][];
  paso: number;
}

function rejilla(contexto: CanvasRenderingContext2D, silueta: Path2D, ancho: number, alto: number, paso: number): Rejilla {
  const puntos: [number, number, number, number][] = [];
  const dy = paso * RAIZ_TRES_MEDIOS;
  for (let fila = 0, y = dy / 2; y < alto; fila++, y += dy) {
    for (let columna = 0, x = fila % 2 ? paso : paso / 2; x < ancho; columna++, x += paso) {
      if (contexto.isPointInPath(silueta, x, y)) {
        puntos.push([x, y, fila, columna]);
      }
    }
  }
  return { puntos, paso };
}

function recortar(puntos: [number, number, number, number][], sobran: number): [number, number, number, number][] {
  if (sobran <= 0) {
    return puntos;
  }
  const clave = (f: number, c: number) => `${f}:${c}`;
  const ocupados = new Set(puntos.map(([, , f, c]) => clave(f, c)));
  const vecinos = puntos.map(([, , f, c], i) => {
    const corrimiento = f % 2 ? 0 : -1;
    const cercanos = [
      [f, c - 1],
      [f, c + 1],
      [f - 1, c + corrimiento],
      [f - 1, c + corrimiento + 1],
      [f + 1, c + corrimiento],
      [f + 1, c + corrimiento + 1],
    ].filter(([ff, cc]) => ocupados.has(clave(ff, cc))).length;
    return { i, cercanos };
  });
  vecinos.sort((a, b) => a.cercanos - b.cercanos || a.i - b.i);
  const fuera = new Set(vecinos.slice(0, sobran).map((v) => v.i));
  return puntos.filter((_, i) => !fuera.has(i));
}

export function mapaLuces(estados: Estados, ancho: number, alto: number, total: number, margen: number): MapaLuces {
  const proyeccion = geoConicConformal()
    .parallels(PARALELOS)
    .rotate([MERIDIANO_CENTRAL, 0])
    .fitExtent(
      [
        [margen, margen],
        [ancho - margen, alto - margen],
      ],
      estados,
    );
  const ruta = geoPath(proyeccion);
  const silueta = ruta(estados) ?? '';
  const rutas = estados.features.map((f) => ruta(f) ?? '');
  const lienzo = document.createElement('canvas');
  const contexto = lienzo.getContext('2d')!;
  const forma = new Path2D(silueta);
  let paso = Math.sqrt((ancho * alto * 0.35) / total / RAIZ_TRES_MEDIOS);
  let mejor = rejilla(contexto, forma, ancho, alto, paso);
  for (let intento = 0; intento < INTENTOS; intento++) {
    const n = mejor.puntos.length;
    if (n >= total && n <= total * (1 + TOLERANCIA)) {
      break;
    }
    paso *= Math.sqrt(n / total) * (n < total ? 0.995 : 1);
    mejor = rejilla(contexto, forma, ancho, alto, paso);
  }
  while (mejor.puntos.length < total) {
    paso *= 0.99;
    mejor = rejilla(contexto, forma, ancho, alto, paso);
  }
  const puntos = recortar(mejor.puntos, mejor.puntos.length - total);
  return {
    xs: Float32Array.from(puntos, (p) => p[0]),
    ys: Float32Array.from(puntos, (p) => p[1]),
    paso: mejor.paso,
    rutas,
    silueta,
  };
}

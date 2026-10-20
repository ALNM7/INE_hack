import { GeoProjection, geoBounds, geoContains } from 'd3';
import type { Feature, Geometry } from 'geojson';
import type { Estados as Geo } from '../../core/mapa.service';
import { Estado, PropiedadesEstado } from '../../core/models';
import { generador, rangos } from '../../core/semilla';
import { aCss, colorToken, rgbToken } from '../../core/tokens';
import { FOCOS_POR_PUNTO } from './escena';

const INTENTOS_POR_PUNTO = 400;
const DURACION_ESTADO = 0.3;

export interface PuntosFocos {
  lon: Float64Array;
  lat: Float64Array;
  estado: Int16Array;
  inicio: Float32Array;
  total: number;
}

export interface ConfigLuces {
  radio: number;
  halo: number;
  curva: (t: number) => number;
}

export function generarFocos(geo: Geo, estados: readonly Estado[], semilla: number): PuntosFocos {
  const porClave = new Map(estados.map((e) => [e.c, e]));
  const lon: number[] = [];
  const lat: number[] = [];
  const estado: number[] = [];
  const orden = rangos(geo.features.length, semilla);
  geo.features.forEach((f: Feature<Geometry, PropiedadesEstado>, i) => {
    const dato = porClave.get(f.properties.c);
    const cuantos = dato ? Math.ceil(dato.focos / FOCOS_POR_PUNTO) : 0;
    const [[x0, y0], [x1, y1]] = geoBounds(f);
    const azar = generador(semilla * 100 + f.properties.c);
    let puestos = 0;
    for (let intento = 0; puestos < cuantos && intento < cuantos * INTENTOS_POR_PUNTO; intento++) {
      const punto: [number, number] = [x0 + azar() * (x1 - x0), y0 + azar() * (y1 - y0)];
      if (geoContains(f, punto)) {
        lon.push(punto[0]);
        lat.push(punto[1]);
        estado.push(i);
        puestos++;
      }
    }
  });
  const n = geo.features.length;
  const inicio = Float32Array.from(orden, (r) =>
    n > 1 ? (r / (n - 1)) * (1 - DURACION_ESTADO) : 0,
  );
  return {
    lon: Float64Array.from(lon),
    lat: Float64Array.from(lat),
    estado: Int16Array.from(estado),
    inicio,
    total: lon.length,
  };
}

export class LucesFocos {
  private readonly contexto: CanvasRenderingContext2D;
  private readonly sprite = document.createElement('canvas');
  private xs = new Float32Array(0);
  private ys = new Float32Array(0);
  private alfas = new Float32Array(0);
  private dpr = 1;
  private ultimo = -1;
  private uniformeUltimo = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly puntos: PuntosFocos,
    private readonly config: ConfigLuces,
  ) {
    this.contexto = canvas.getContext('2d')!;
    this.alfas = new Float32Array(puntos.inicio.length);
  }

  medir(ancho: number, alto: number, proyeccion: GeoProjection): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(ancho * this.dpr);
    this.canvas.height = Math.round(alto * this.dpr);
    const { lon, lat, total } = this.puntos;
    this.xs = new Float32Array(total);
    this.ys = new Float32Array(total);
    for (let i = 0; i < total; i++) {
      const p = proyeccion([lon[i], lat[i]]);
      this.xs[i] = p ? p[0] : -1;
      this.ys[i] = p ? p[1] : -1;
    }
    this.crearSprite();
    this.ultimo = -1;
  }

  pintar(progreso: number, uniforme: boolean): void {
    if (progreso === this.ultimo && uniforme === this.uniformeUltimo) {
      return;
    }
    this.ultimo = progreso;
    this.uniformeUltimo = uniforme;
    const { contexto: c, dpr } = this;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (progreso <= 0) {
      return;
    }
    const { inicio, estado, total } = this.puntos;
    for (let e = 0; e < inicio.length; e++) {
      const local = uniforme
        ? progreso
        : Math.min(Math.max((progreso - inicio[e]) / DURACION_ESTADO, 0), 1);
      this.alfas[e] = uniforme ? local : this.config.curva(local);
    }
    const lado = this.sprite.width;
    const mitad = lado / 2;
    for (let i = 0; i < total; i++) {
      const a = this.alfas[estado[i]];
      if (a <= 0) {
        continue;
      }
      c.globalAlpha = a;
      c.drawImage(this.sprite, this.xs[i] * dpr - mitad, this.ys[i] * dpr - mitad);
    }
    c.globalAlpha = 1;
  }

  limpiar(): void {
    this.ultimo = -1;
    this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private crearSprite(): void {
    const { radio, halo } = this.config;
    const lado = Math.ceil((radio + halo) * 2 * this.dpr);
    this.sprite.width = lado;
    this.sprite.height = lado;
    const s = this.sprite.getContext('2d')!;
    const centro = lado / 2;
    s.clearRect(0, 0, lado, lado);
    s.shadowColor = colorToken('--color-luz-halo', this.canvas);
    s.shadowBlur = halo * this.dpr;
    s.fillStyle = aCss(rgbToken('--color-foco-encendido', this.canvas));
    s.beginPath();
    s.arc(centro, centro, radio * this.dpr, 0, Math.PI * 2);
    s.fill();
    s.shadowBlur = 0;
    s.fill();
  }
}

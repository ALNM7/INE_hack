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
  private readonly sprite = document.createElement('canvas');
  private capas: HTMLCanvasElement[] = [];
  private opacidades: number[] = [];
  private dpr = 1;
  private ultimo = -1;
  private uniformeUltimo = false;

  constructor(
    private readonly contenedor: HTMLElement,
    private readonly puntos: PuntosFocos,
    private readonly config: ConfigLuces,
  ) {}

  medir(ancho: number, alto: number, proyeccion: GeoProjection): void {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.crearSprite();
    this.capas.forEach((capa) => capa.remove());
    const { lon, lat, estado, total, inicio } = this.puntos;
    const n = inicio.length;
    const porEstado: [number, number][][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < total; i++) {
      const p = proyeccion([lon[i], lat[i]]);
      if (p && p[0] >= 0 && p[1] >= 0 && p[0] <= ancho && p[1] <= alto) {
        porEstado[estado[i]].push([p[0], p[1]]);
      }
    }
    const margen = this.config.radio + this.config.halo;
    const lado = this.sprite.width;
    this.capas = porEstado.map((puntos) => {
      const capa = document.createElement('canvas');
      capa.setAttribute('aria-hidden', 'true');
      if (!puntos.length) {
        return capa;
      }
      const x0 = Math.floor(Math.min(...puntos.map((p) => p[0])) - margen);
      const y0 = Math.floor(Math.min(...puntos.map((p) => p[1])) - margen);
      const x1 = Math.ceil(Math.max(...puntos.map((p) => p[0])) + margen);
      const y1 = Math.ceil(Math.max(...puntos.map((p) => p[1])) + margen);
      capa.width = Math.round((x1 - x0) * this.dpr);
      capa.height = Math.round((y1 - y0) * this.dpr);
      capa.style.cssText = `position:absolute;left:0;top:0;width:${x1 - x0}px;height:${y1 - y0}px;transform:translate(${x0}px,${y0}px);opacity:0`;
      const c = capa.getContext('2d')!;
      for (const [x, y] of puntos) {
        c.drawImage(this.sprite, (x - x0) * this.dpr - lado / 2, (y - y0) * this.dpr - lado / 2);
      }
      this.contenedor.appendChild(capa);
      return capa;
    });
    this.opacidades = this.capas.map(() => 0);
    this.ultimo = -1;
  }

  pintar(progreso: number, uniforme: boolean): void {
    if (progreso === this.ultimo && uniforme === this.uniformeUltimo) {
      return;
    }
    this.ultimo = progreso;
    this.uniformeUltimo = uniforme;
    const { inicio } = this.puntos;
    this.capas.forEach((capa, e) => {
      const local = uniforme
        ? progreso
        : Math.min(Math.max((progreso - inicio[e]) / DURACION_ESTADO, 0), 1);
      const alfa = Math.round((uniforme ? local : this.config.curva(local)) * 100) / 100;
      if (alfa !== this.opacidades[e]) {
        this.opacidades[e] = alfa;
        capa.style.opacity = String(alfa);
      }
    });
  }

  destruir(): void {
    this.capas.forEach((capa) => capa.remove());
    this.capas = [];
  }

  private crearSprite(): void {
    const { radio, halo } = this.config;
    const lado = Math.ceil((radio + halo) * 2 * this.dpr);
    this.sprite.width = lado;
    this.sprite.height = lado;
    const s = this.sprite.getContext('2d')!;
    const centro = lado / 2;
    s.clearRect(0, 0, lado, lado);
    s.shadowColor = colorToken('--color-luz-halo', this.contenedor);
    s.shadowBlur = halo * this.dpr;
    s.fillStyle = aCss(rgbToken('--color-foco-encendido', this.contenedor));
    s.beginPath();
    s.arc(centro, centro, radio * this.dpr, 0, Math.PI * 2);
    s.fill();
    s.shadowBlur = 0;
    s.fill();
  }
}

import { Rgb, aCss, mezclar, rgbToken } from '../../core/tokens';
import type { Estados } from '../../core/mapa.service';
import { rangos } from '../../core/semilla';
import { mapaLuces } from '../../shared/charts/mapa-luces';

export interface EstadoCampo {
  apagado: number;
  jovenes: number;
  uniforme: boolean;
}

export interface ConfigCampo {
  total: number;
  apagadas: number;
  jovenes: number;
  semilla: number;
  estados: Estados;
  margen: number;
  curvaApagado: (t: number) => number;
  curvaJovenes: (t: number) => number;
}

const NIVELES = 24;
const VENTANA = 0.12;
const RADIO_RELATIVO = 0.3;

function limitar(valor: number): number {
  return valor < 0 ? 0 : valor > 1 ? 1 : valor;
}

export class CampoEscala {
  private readonly contexto: CanvasRenderingContext2D;
  private readonly rangoApagado: number[];
  private readonly rangoJoven: Int32Array;
  private xs: Float32Array = new Float32Array(0);
  private ys: Float32Array = new Float32Array(0);
  private radio = 0;
  private ancho = 0;
  private alto = 0;
  private colorFondo = '';
  private colorMapa = '';
  private colorBordes = '';
  private dpr = 1;
  private readonly capaFondo = document.createElement('canvas');
  private colorEncendido: Rgb = [0, 0, 0];
  private colorApagado: Rgb = [0, 0, 0];
  private colorJoven: Rgb = [0, 0, 0];
  private estado: EstadoCampo = { apagado: 0, jovenes: 0, uniforme: false };
  private pendiente = 0;
  private niveles = new Int32Array(0);
  private completo = true;
  private readonly estilos = new Map<number, string>();

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly config: ConfigCampo,
  ) {
    this.contexto = canvas.getContext('2d', { alpha: false })!;
    this.rangoApagado = rangos(config.total, config.semilla);
    const ordenJoven = rangos(config.apagadas, config.semilla + 1);
    this.rangoJoven = new Int32Array(config.total).fill(-1);
    for (let i = 0; i < config.total; i++) {
      const r = this.rangoApagado[i];
      if (r < config.apagadas) {
        this.rangoJoven[i] = ordenJoven[r];
      }
    }
    this.leerColores();
  }

  leerColores(): void {
    this.estilos.clear();
    this.completo = true;
    this.colorFondo = aCss(rgbToken('--color-fondo', this.canvas));
    this.colorMapa = aCss(rgbToken('--color-superficie', this.canvas));
    this.colorBordes = aCss(rgbToken('--color-linea', this.canvas));
    this.colorEncendido = rgbToken('--color-foco-encendido', this.canvas);
    this.colorApagado = rgbToken('--color-foco-apagado', this.canvas);
    this.colorJoven = rgbToken('--color-arena', this.canvas);
  }

  medir(): void {
    const caja = this.canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.dpr = dpr;
    this.ancho = caja.width;
    this.alto = caja.height;
    this.canvas.width = Math.round(caja.width * dpr);
    this.canvas.height = Math.round(caja.height * dpr);
    this.contexto.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.ancho <= 0 || this.alto <= 0) {
      return;
    }
    const mapa = mapaLuces(this.config.estados, this.ancho, this.alto, this.config.total, this.config.margen);
    this.xs = mapa.xs;
    this.ys = mapa.ys;
    this.radio = mapa.paso * RADIO_RELATIVO;
    this.capaFondo.width = this.canvas.width;
    this.capaFondo.height = this.canvas.height;
    const fondo = this.capaFondo.getContext('2d', { alpha: false })!;
    fondo.setTransform(dpr, 0, 0, dpr, 0, 0);
    fondo.fillStyle = this.colorFondo;
    fondo.fillRect(0, 0, this.ancho, this.alto);
    fondo.fillStyle = this.colorMapa;
    fondo.strokeStyle = this.colorBordes;
    fondo.lineJoin = 'round';
    for (const ruta of mapa.rutas) {
      const forma = new Path2D(ruta);
      fondo.fill(forma);
      fondo.stroke(forma);
    }
    this.niveles = new Int32Array(this.config.total).fill(-1);
    this.completo = true;
    this.dibujar();
  }

  fijar(estado: EstadoCampo): void {
    this.estado = estado;
    if (!this.pendiente) {
      this.pendiente = requestAnimationFrame(() => {
        this.pendiente = 0;
        this.dibujar();
      });
    }
  }

  destruir(): void {
    cancelAnimationFrame(this.pendiente);
  }

  private intensidad(progreso: number, rango: number, cuantos: number, curvaLuz: (t: number) => number): number {
    if (this.estado.uniforme) {
      return progreso;
    }
    const ventana = Math.max(1, cuantos * VENTANA);
    return curvaLuz(limitar((progreso * (cuantos + ventana) - rango) / ventana));
  }

  private estilo(clave: number): string {
    let css = this.estilos.get(clave);
    if (!css) {
      const nivelApagado = Math.floor(clave / (NIVELES + 1)) / NIVELES;
      const nivelJoven = (clave % (NIVELES + 1)) / NIVELES;
      const base = mezclar(this.colorEncendido, this.colorApagado, nivelApagado);
      css = aCss(mezclar(base, this.colorJoven, nivelJoven));
      this.estilos.set(clave, css);
    }
    return css;
  }

  private dibujar(): void {
    const ctx = this.contexto;
    const { total, apagadas, jovenes, curvaApagado, curvaJovenes } = this.config;
    const completo = this.completo;
    if (completo) {
      this.restaurar(0, 0, this.ancho, this.alto);
      this.completo = false;
    }
    if (!this.xs.length) {
      return;
    }
    const cubetas = new Map<number, number[]>();
    const cambiados: number[] = [];
    for (let i = 0; i < total; i++) {
      const r = this.rangoApagado[i];
      let nivelApagado = 0;
      let nivelJoven = 0;
      if (r < apagadas) {
        nivelApagado = Math.round(this.intensidad(this.estado.apagado, r, apagadas, curvaApagado) * NIVELES);
        const rj = this.rangoJoven[i];
        if (rj >= 0 && rj < jovenes) {
          nivelJoven = Math.round(this.intensidad(this.estado.jovenes, rj, jovenes, curvaJovenes) * NIVELES);
        }
      }
      const clave = nivelApagado * (NIVELES + 1) + nivelJoven;
      if (!completo && this.niveles[i] === clave) {
        continue;
      }
      this.niveles[i] = clave;
      cambiados.push(i);
      const lista = cubetas.get(clave);
      if (lista) {
        lista.push(i);
      } else {
        cubetas.set(clave, [i]);
      }
    }
    if (!cambiados.length) {
      return;
    }
    const r = this.radio;
    if (!completo) {
      const borde = r + 1;
      for (const i of cambiados) {
        this.restaurar(this.xs[i] - borde, this.ys[i] - borde, borde * 2, borde * 2);
      }
    }
    for (const [clave, indices] of cubetas) {
      ctx.fillStyle = this.estilo(clave);
      ctx.beginPath();
      for (const i of indices) {
        ctx.moveTo(this.xs[i] + r, this.ys[i]);
        ctx.arc(this.xs[i], this.ys[i], r, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  private restaurar(x: number, y: number, ancho: number, alto: number): void {
    const d = this.dpr;
    const sx = Math.max(0, Math.floor(x * d));
    const sy = Math.max(0, Math.floor(y * d));
    const sw = Math.min(this.capaFondo.width - sx, Math.ceil(ancho * d) + 1);
    const sh = Math.min(this.capaFondo.height - sy, Math.ceil(alto * d) + 1);
    if (sw <= 0 || sh <= 0) {
      return;
    }
    this.contexto.save();
    this.contexto.setTransform(1, 0, 0, 1, 0, 0);
    this.contexto.drawImage(this.capaFondo, sx, sy, sw, sh, sx, sy, sw, sh);
    this.contexto.restore();
  }
}

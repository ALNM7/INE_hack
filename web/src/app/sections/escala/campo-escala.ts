import { Rgb, aCss, mezclar, rgbToken } from '../../core/tokens';
import { rangos } from '../../core/semilla';

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
  private xs = new Float32Array(0);
  private ys = new Float32Array(0);
  private radio = 0;
  private ancho = 0;
  private alto = 0;
  private colorFondo = '';
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
    this.colorEncendido = rgbToken('--color-foco-encendido', this.canvas);
    this.colorApagado = rgbToken('--color-foco-apagado', this.canvas);
    this.colorJoven = rgbToken('--color-arena', this.canvas);
  }

  medir(): void {
    const caja = this.canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.ancho = caja.width;
    this.alto = caja.height;
    this.canvas.width = Math.round(caja.width * dpr);
    this.canvas.height = Math.round(caja.height * dpr);
    this.contexto.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = this.config.total;
    if (this.ancho <= 0 || this.alto <= 0) {
      return;
    }
    const columnas = Math.max(1, Math.round(Math.sqrt((n * this.ancho) / this.alto)));
    const filas = Math.ceil(n / columnas);
    const celda = Math.min(this.ancho / columnas, this.alto / filas);
    const x0 = (this.ancho - columnas * celda) / 2 + celda / 2;
    const y0 = (this.alto - filas * celda) / 2 + celda / 2;
    const ultimaFila = n - (filas - 1) * columnas;
    const xs = new Float32Array(n);
    const ys = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const fila = Math.floor(i / columnas);
      const columna = i % columnas;
      const sangria = fila === filas - 1 ? ((columnas - ultimaFila) * celda) / 2 : 0;
      xs[i] = x0 + columna * celda + sangria;
      ys[i] = y0 + fila * celda;
    }
    this.xs = xs;
    this.ys = ys;
    this.radio = celda * RADIO_RELATIVO;
    this.niveles = new Int32Array(n).fill(-1);
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
      ctx.fillStyle = this.colorFondo;
      ctx.fillRect(0, 0, this.ancho, this.alto);
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
      ctx.fillStyle = this.colorFondo;
      ctx.beginPath();
      for (const i of cambiados) {
        ctx.rect(this.xs[i] - borde, this.ys[i] - borde, borde * 2, borde * 2);
      }
      ctx.fill();
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
}

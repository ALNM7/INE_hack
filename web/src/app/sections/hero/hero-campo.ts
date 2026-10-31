import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { duracion, funcionCurva } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Rgb, aCss, mezclar, rgbToken } from '../../core/tokens';
import { generador, rangos } from '../../core/semilla';

const PROPORCION_ENCENDIDA = 0.38;
const ESPACIADO = 30;
const JITTER = 0.46;
const NIVELES = 20;
const VENTANA = 0.16;
const RESPIRO_AMPLITUD = 0.16;
const RESPIRO_VELOCIDAD = 0.0014;
const ESPERA = 0.5;

function limitar(valor: number): number {
  return valor < 0 ? 0 : valor > 1 ? 1 : valor;
}

interface OpcionesCampo {
  semilla: number;
  reducido: boolean;
  espaciado: number;
  escalaRadio: number;
  opaco: boolean;
}

export type CapaCampo = 'cerca' | 'lejos';

const CAPAS: Record<CapaCampo, Omit<OpcionesCampo, 'reducido'>> = {
  cerca: { semilla: 37, espaciado: ESPACIADO, escalaRadio: 1, opaco: false },
  lejos: { semilla: 73, espaciado: ESPACIADO * 0.55, escalaRadio: 0.5, opaco: true },
};

class CampoHero {
  private readonly contexto: CanvasRenderingContext2D;
  private readonly curvaApagado = funcionCurva('apagado');
  private readonly curvaEntrada = funcionCurva('entrada');
  private readonly dApagado: number;
  private xs = new Float32Array(0);
  private ys = new Float32Array(0);
  private rango: number[] = [];
  private fases = new Float32Array(0);
  private total = 0;
  private apagadas = 0;
  private radio = 0;
  private ancho = 0;
  private alto = 0;
  private dpr = 1;
  private colorFondo = '';
  private colorEncendido: Rgb = [0, 0, 0];
  private colorApagado: Rgb = [0, 0, 0];
  private readonly glow = document.createElement('canvas');
  private glowRadio = 0;
  private readonly estilos = new Map<number, string>();
  private cubetas: number[][] = [];
  private cuadro = 0;
  private inicio = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly opciones: OpcionesCampo,
  ) {
    this.contexto = canvas.getContext('2d', { alpha: !opciones.opaco })!;
    this.dApagado = duracion('encendido') * 2 + duracion('escena');
    this.leerColores();
  }

  private leerColores(): void {
    this.estilos.clear();
    this.colorFondo = aCss(rgbToken('--color-fondo', this.canvas));
    this.colorEncendido = rgbToken('--color-foco-encendido', this.canvas);
    this.colorApagado = rgbToken('--color-foco-apagado', this.canvas);
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
    this.colocar();
    this.prepararGlow();
    this.inicio = 0;
    this.detener();
    if (this.opciones.reducido) {
      this.pintar(1);
      return;
    }
    this.cuadro = requestAnimationFrame((t) => this.animar(t));
  }

  private colocar(): void {
    const cols = Math.max(1, Math.round(this.ancho / this.opciones.espaciado));
    const filas = Math.max(1, Math.round(this.alto / this.opciones.espaciado));
    const pasoX = this.ancho / cols;
    const pasoY = this.alto / filas;
    this.total = cols * filas;
    this.radio = Math.max(1.2, Math.min(pasoX, pasoY) * 0.16) * this.opciones.escalaRadio;
    this.glowRadio = Math.min(pasoX, pasoY) * 0.62 * this.opciones.escalaRadio;
    this.xs = new Float32Array(this.total);
    this.ys = new Float32Array(this.total);
    this.fases = new Float32Array(this.total);
    const azar = generador(this.opciones.semilla);
    const borde = this.radio + 1;
    const maxX = this.ancho - borde;
    const maxY = this.alto - borde;
    let i = 0;
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) * pasoX + (azar() - 0.5) * pasoX * JITTER * 2;
        const y = (f + 0.5) * pasoY + (azar() - 0.5) * pasoY * JITTER * 2;
        this.xs[i] = Math.min(maxX, Math.max(borde, x));
        this.ys[i] = Math.min(maxY, Math.max(borde, y));
        this.fases[i] = azar() * Math.PI * 2;
        i++;
      }
    }
    this.rango = rangos(this.total, this.opciones.semilla);
    this.apagadas = Math.round(this.total * (1 - PROPORCION_ENCENDIDA));
  }

  private prepararGlow(): void {
    const lado = Math.ceil(this.glowRadio * 2 * this.dpr);
    this.glow.width = lado;
    this.glow.height = lado;
    const ctx = this.glow.getContext('2d')!;
    const centro = lado / 2;
    const gradiente = ctx.createRadialGradient(centro, centro, 0, centro, centro, centro);
    const [r, g, b] = this.colorEncendido;
    gradiente.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.55)`);
    gradiente.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.16)`);
    gradiente.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, lado, lado);
  }

  private intensidad(indice: number, tiempo: number): number {
    const r = this.rango[indice];
    if (r >= this.apagadas) {
      return 1;
    }
    const ventana = Math.max(1, this.apagadas * VENTANA);
    const local = this.curvaApagado(limitar((tiempo * (this.apagadas + ventana) - r) / ventana));
    return 1 - local;
  }

  private estilo(nivel: number): string {
    let css = this.estilos.get(nivel);
    if (!css) {
      css = aCss(mezclar(this.colorApagado, this.colorEncendido, nivel / NIVELES));
      this.estilos.set(nivel, css);
    }
    return css;
  }

  private pintar(tiempo: number): void {
    const ctx = this.contexto;
    if (!this.cubetas.length) {
      this.cubetas = Array.from({ length: NIVELES + 1 }, () => []);
    }
    for (const lista of this.cubetas) {
      lista.length = 0;
    }
    if (this.opciones.opaco) {
      ctx.fillStyle = this.colorFondo;
      ctx.fillRect(0, 0, this.ancho, this.alto);
    } else {
      ctx.clearRect(0, 0, this.ancho, this.alto);
    }
    const respirar = !this.opciones.reducido && tiempo >= 1;
    const ahora = respirar ? performance.now() * RESPIRO_VELOCIDAD : 0;
    const intensidades = new Float32Array(this.total);
    for (let i = 0; i < this.total; i++) {
      let inten = this.intensidad(i, tiempo);
      if (respirar && inten > 0.5) {
        inten = limitar(inten + RESPIRO_AMPLITUD * Math.sin(ahora + this.fases[i]));
      }
      intensidades[i] = inten;
      const nivel = Math.round(inten * NIVELES);
      this.cubetas[nivel].push(i);
    }
    const radio = this.radio;
    for (let nivel = 0; nivel <= NIVELES; nivel++) {
      const indices = this.cubetas[nivel];
      if (!indices.length) {
        continue;
      }
      ctx.fillStyle = this.estilo(nivel);
      ctx.beginPath();
      for (const i of indices) {
        ctx.moveTo(this.xs[i] + radio, this.ys[i]);
        ctx.arc(this.xs[i], this.ys[i], radio, 0, Math.PI * 2);
      }
      ctx.fill();
    }
    const lado = this.glowRadio * 2;
    for (let i = 0; i < this.total; i++) {
      const inten = intensidades[i];
      if (inten <= 0.45) {
        continue;
      }
      ctx.globalAlpha = (inten - 0.45) / 0.55;
      ctx.drawImage(this.glow, this.xs[i] - this.glowRadio, this.ys[i] - this.glowRadio, lado, lado);
    }
    ctx.globalAlpha = 1;
  }

  private animar(marca: number): void {
    if (!this.inicio) {
      this.inicio = marca;
    }
    const transcurrido = (marca - this.inicio) / 1000;
    const tiempo = limitar((transcurrido - ESPERA) / this.dApagado);
    this.pintar(tiempo);
    this.cuadro = requestAnimationFrame((t) => this.animar(t));
  }

  private detener(): void {
    if (this.cuadro) {
      cancelAnimationFrame(this.cuadro);
      this.cuadro = 0;
    }
  }

  destruir(): void {
    this.detener();
  }
}

@Component({
  selector: 'app-hero-campo',
  template: '<canvas #lienzo class="block size-full" role="img" [attr.aria-label]="etiqueta"></canvas>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden',
    '[class.bg-fondo]': "capa() === 'lejos'",
    '[attr.aria-hidden]': "capa() === 'lejos' ? 'true' : null",
  },
})
export class HeroCampo {
  readonly capa = input<CapaCampo>('cerca');
  protected readonly etiqueta =
    'Un campo de luces: cada punto es una persona con credencial para votar. Al inicio todas brillan y, poco a poco, muchas se apagan y solo algunas siguen encendidas.';

  private readonly destroyRef = inject(DestroyRef);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');

  constructor() {
    afterNextRender(() => {
      const campo = new CampoHero(this.lienzo().nativeElement, { ...CAPAS[this.capa()], reducido: this.reducido() });
      let anchoPrevio = 0;
      let altoPrevio = 0;
      const observador = new ResizeObserver(([entrada]) => {
        const { width, height } = entrada.contentRect;
        if (Math.abs(width - anchoPrevio) < 1 && Math.abs(height - altoPrevio) < 1) {
          return;
        }
        anchoPrevio = width;
        altoPrevio = height;
        campo.medir();
      });
      observador.observe(this.lienzo().nativeElement);
      this.destroyRef.onDestroy(() => {
        observador.disconnect();
        campo.destruir();
      });
    });
  }
}

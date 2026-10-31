import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { generador, rangos } from '../../core/semilla';
import { Rgb, aCss, mezclar, rgbToken } from '../../core/tokens';

const ESPACIADO = 30;
const JITTER = 0.46;
const NIVELES = 20;
const VENTANA = 0.08;
const RESPIRO_AMPLITUD = 0.14;
const RESPIRO_VELOCIDAD = 0.0014;
const SEMILLA = 37;
const RELEVO_POR_MS = 0.000012;
const ENCENDER_MS = 500;
const APAGAR_MS = 900;

function limitar(valor: number): number {
  return valor < 0 ? 0 : valor > 1 ? 1 : valor;
}

class CampoHero {
  fraccion = 0;
  private readonly contexto: CanvasRenderingContext2D;
  private xs = new Float32Array(0);
  private ys = new Float32Array(0);
  private fases = new Float32Array(0);
  private rango: number[] = [];
  private total = 0;
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
  private readonly cubetas: number[][] = Array.from({ length: NIVELES + 1 }, () => []);
  private intensidades = new Float32Array(0);
  private actual = new Float32Array(0);
  private readonly azar = generador(SEMILLA + 1);
  private relevando = false;
  private acumulado = 0;
  private ultimo = 0;
  private cuadro = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly reducido: boolean,
  ) {
    this.contexto = canvas.getContext('2d', { alpha: false })!;
    this.colorFondo = aCss(rgbToken('--color-fondo', canvas));
    this.colorEncendido = rgbToken('--color-foco-encendido', canvas);
    this.colorApagado = rgbToken('--color-foco-apagado', canvas);
  }

  medir(): void {
    const caja = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
    this.ancho = caja.width;
    this.alto = caja.height;
    this.canvas.width = Math.round(caja.width * this.dpr);
    this.canvas.height = Math.round(caja.height * this.dpr);
    this.contexto.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.ancho <= 0 || this.alto <= 0) {
      return;
    }
    this.colocar();
    this.prepararGlow();
    if (this.reducido) {
      this.pintar(0, 0);
    } else if (!this.cuadro) {
      this.cuadro = requestAnimationFrame((t) => this.animar(t));
    }
  }

  fijar(fraccion: number): void {
    this.fraccion = fraccion;
    if (this.reducido && this.total) {
      this.pintar(0, 0);
    }
  }

  relevar(activo: boolean): void {
    this.relevando = activo && !this.reducido;
  }

  destruir(): void {
    cancelAnimationFrame(this.cuadro);
    this.cuadro = 0;
  }

  private colocar(): void {
    const cols = Math.max(1, Math.round(this.ancho / ESPACIADO));
    const filas = Math.max(1, Math.round(this.alto / ESPACIADO));
    const pasoX = this.ancho / cols;
    const pasoY = this.alto / filas;
    this.total = cols * filas;
    this.radio = Math.max(1.2, Math.min(pasoX, pasoY) * 0.15);
    this.glowRadio = Math.min(pasoX, pasoY) * 0.62;
    this.xs = new Float32Array(this.total);
    this.ys = new Float32Array(this.total);
    this.fases = new Float32Array(this.total);
    this.intensidades = new Float32Array(this.total);
    this.actual = new Float32Array(this.total);
    const azar = generador(SEMILLA);
    const borde = this.radio + 1;
    let i = 0;
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < cols; c++) {
        const x = (c + 0.5) * pasoX + (azar() - 0.5) * pasoX * JITTER * 2;
        const y = (f + 0.5) * pasoY + (azar() - 0.5) * pasoY * JITTER * 2;
        this.xs[i] = Math.min(this.ancho - borde, Math.max(borde, x));
        this.ys[i] = Math.min(this.alto - borde, Math.max(borde, y));
        this.fases[i] = azar() * Math.PI * 2;
        i++;
      }
    }
    this.rango = rangos(this.total, SEMILLA);
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

  private estilo(nivel: number): string {
    let css = this.estilos.get(nivel);
    if (!css) {
      css = aCss(mezclar(this.colorApagado, this.colorEncendido, nivel / NIVELES));
      this.estilos.set(nivel, css);
    }
    return css;
  }

  private pintar(tiempo: number, dt: number): void {
    const ctx = this.contexto;
    for (const lista of this.cubetas) {
      lista.length = 0;
    }
    ctx.fillStyle = this.colorFondo;
    ctx.fillRect(0, 0, this.ancho, this.alto);
    const ventana = Math.max(1, this.total * VENTANA);
    const avance = this.fraccion * (this.total + ventana);
    const respiro = this.reducido ? 0 : tiempo * RESPIRO_VELOCIDAD;
    const suave = this.relevando && dt > 0;
    const subir = suave ? 1 - Math.exp(-dt / ENCENDER_MS) : 1;
    const bajar = suave ? 1 - Math.exp(-dt / APAGAR_MS) : 1;
    for (let i = 0; i < this.total; i++) {
      const objetivo = limitar((avance - this.rango[i]) / ventana);
      const previo = this.actual[i];
      this.actual[i] = previo + (objetivo - previo) * (objetivo > previo ? subir : bajar);
      let inten = this.actual[i];
      if (!this.reducido && inten > 0.5) {
        inten = limitar(inten + RESPIRO_AMPLITUD * Math.sin(respiro + this.fases[i]));
      }
      this.intensidades[i] = inten;
      this.cubetas[Math.round(inten * NIVELES)].push(i);
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
      const inten = this.intensidades[i];
      if (inten <= 0.45) {
        continue;
      }
      ctx.globalAlpha = (inten - 0.45) / 0.55;
      ctx.drawImage(this.glow, this.xs[i] - this.glowRadio, this.ys[i] - this.glowRadio, lado, lado);
    }
    ctx.globalAlpha = 1;
  }

  private animar(tiempo: number): void {
    const dt = this.ultimo ? Math.min(100, tiempo - this.ultimo) : 16;
    this.ultimo = tiempo;
    if (this.canvas.getClientRects().length > 0) {
      if (this.relevando) {
        this.relevo(dt);
      }
      this.pintar(tiempo, dt);
    }
    this.cuadro = requestAnimationFrame((t) => this.animar(t));
  }

  private relevo(dt: number): void {
    const ventana = Math.max(1, this.total * VENTANA);
    const avance = this.fraccion * (this.total + ventana);
    this.acumulado += dt * this.total * RELEVO_POR_MS;
    while (this.acumulado >= 1) {
      this.acumulado -= 1;
      const prendida = this.buscar((r) => r < avance - ventana);
      const apagada = this.buscar((r) => r >= avance);
      if (prendida < 0 || apagada < 0) {
        return;
      }
      const rango = this.rango[prendida];
      this.rango[prendida] = this.rango[apagada];
      this.rango[apagada] = rango;
    }
  }

  private buscar(cumple: (rango: number) => boolean): number {
    for (let intento = 0; intento < 12; intento++) {
      const i = Math.floor(this.azar() * this.total);
      if (cumple(this.rango[i])) {
        return i;
      }
    }
    return -1;
  }
}

@Component({
  selector: 'app-hero-campo',
  template: '<canvas #lienzo class="block size-full" aria-hidden="true"></canvas>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block overflow-hidden bg-fondo' },
})
export class HeroCampo {
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private campo: CampoHero | null = null;
  private fraccion = 0;
  private relevando = false;

  constructor() {
    afterNextRender(() => {
      const lienzo = this.lienzo().nativeElement;
      const campo = new CampoHero(lienzo, this.reducido());
      campo.fijar(this.fraccion);
      campo.relevar(this.relevando);
      this.campo = campo;
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
      observador.observe(lienzo);
      this.destroyRef.onDestroy(() => {
        observador.disconnect();
        campo.destruir();
      });
    });
  }

  fijar(fraccion: number): void {
    this.fraccion = fraccion;
    this.campo?.fijar(fraccion);
  }

  relevar(activo: boolean): void {
    this.relevando = activo;
    this.campo?.relevar(activo);
  }
}

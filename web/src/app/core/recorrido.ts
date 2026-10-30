import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, Injector, Signal, afterNextRender, computed, inject, signal } from '@angular/core';
import { ScrollTrigger, curva, curvas, duracion, gsap } from './motion';

export const CONSULTA_LADO = '(min-width: 48rem), (orientation: landscape) and (min-width: 36rem)';
export const CONSULTA_PILA = '(max-width: 47.99rem) and (orientation: portrait), (max-width: 35.99rem)';

export type IdActo = 'hero' | 'escala' | 'dibujalo' | 'cohorte' | 'wrapped';

export const ORDEN: readonly IdActo[] = ['hero', 'escala', 'dibujalo', 'cohorte', 'wrapped'];

const NOMBRES: Record<IdActo, string> = {
  hero: 'Inicio',
  escala: 'Intro',
  dibujalo: 'Acto 1',
  cohorte: 'Acto 2',
  wrapped: 'Acto 3',
};

const CON_SCROLL: ReadonlySet<IdActo> = new Set(['dibujalo', 'wrapped']);

export interface PasosActo {
  total: Signal<number>;
  ir(paso: number, instantaneo: boolean): void;
  listo?: Signal<boolean>;
  texto?(paso: number): string;
  titulo?(): HTMLElement | null | undefined;
}

export function consultaMedia(consulta: string): Signal<boolean> {
  const lista = matchMedia(consulta);
  const estado = signal(lista.matches);
  const alCambiar = (evento: MediaQueryListEvent) => estado.set(evento.matches);
  lista.addEventListener('change', alCambiar);
  inject(DestroyRef).onDestroy(() => lista.removeEventListener('change', alCambiar));
  return estado.asReadonly();
}

let tweenScroll: gsap.core.Tween | null = null;

export function desplazarA(y: number, instantaneo: boolean): void {
  tweenScroll?.kill();
  tweenScroll = null;
  const destino = Math.max(0, Math.round(y));
  if (instantaneo) {
    window.scrollTo(0, destino);
    return;
  }
  const posicion = { y: window.scrollY };
  tweenScroll = gsap.to(posicion, {
    y: destino,
    duration: duracion('escena'),
    ease: curva('escena'),
    onUpdate: () => window.scrollTo(0, posicion.y),
  });
}

function easing(nombre: 'entrada' | 'salida'): string {
  return curvas.find((c) => c.nombre === nombre)?.css ?? 'linear';
}

@Injectable({ providedIn: 'root' })
export class Recorrido {
  private readonly documento = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly anunciador = inject(LiveAnnouncer);
  private readonly registro = signal<Partial<Record<IdActo, PasosActo>>>({});

  readonly acto = signal(0);
  readonly paso = signal(0);
  readonly cambiando = signal(false);
  readonly id = computed(() => ORDEN[this.acto()]);
  readonly nombre = computed(() => NOMBRES[this.id()]);

  private readonly actual = computed(() => this.registro()[this.id()]);
  readonly total = computed(() => this.actual()?.total() ?? 1);
  readonly listo = computed(() => this.actual()?.listo?.() ?? true);
  readonly esUltimo = computed(() => this.acto() === ORDEN.length - 1);
  readonly esPrimero = computed(() => this.acto() === 0);
  readonly conScroll = computed(() => CON_SCROLL.has(this.id()));

  reiniciar(): void {
    tweenScroll?.kill();
    this.acto.set(0);
    this.paso.set(0);
    this.cambiando.set(false);
  }

  registrar(id: IdActo, pasos: PasosActo): void {
    this.registro.update((r) => ({ ...r, [id]: pasos }));
  }

  siguiente(): void {
    if (this.cambiando()) {
      return;
    }
    if (this.paso() < this.total() - 1) {
      this.moverPaso(this.paso() + 1);
    } else if (!this.esUltimo()) {
      void this.cambiarActo(this.acto() + 1, 'inicio');
    }
  }

  anterior(): void {
    if (this.cambiando()) {
      return;
    }
    if (this.paso() > 0) {
      this.moverPaso(this.paso() - 1);
    } else if (!this.esPrimero()) {
      void this.cambiarActo(this.acto() - 1, 'final');
    }
  }

  iniciarEn(id: IdActo): void {
    const indice = ORDEN.indexOf(id);
    if (indice > 0) {
      void this.cambiarActo(indice, 'inicio', true);
    }
  }

  private moverPaso(paso: number): void {
    this.paso.set(paso);
    this.actual()?.ir(paso, false);
    this.anunciar();
  }

  private async cambiarActo(indice: number, donde: 'inicio' | 'final', directo = false): Promise<void> {
    this.cambiando.set(true);
    tweenScroll?.kill();
    const principal = this.documento.querySelector('main');
    const enfocado = this.documento.activeElement as HTMLElement | null;
    let salida: Animation | null = null;
    if (principal && !directo) {
      salida = principal.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: duracion('corta') * 1000,
        easing: easing('salida'),
        fill: 'forwards',
      });
      await salida.finished;
    }
    this.acto.set(indice);
    const total = this.registro()[ORDEN[indice]]?.total() ?? 1;
    const paso = donde === 'final' ? Math.max(0, total - 1) : 0;
    this.paso.set(paso);
    await new Promise<void>((resolver) => afterNextRender(() => resolver(), { injector: this.injector }));
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
    this.actual()?.ir(paso, donde === 'final' || directo);
    if (principal) {
      const entrada = principal.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: directo ? 0 : duracion('media') * 1000,
        easing: easing('entrada'),
        fill: 'forwards',
      });
      salida?.cancel();
      await entrada.finished;
      entrada.cancel();
    }
    this.cambiando.set(false);
    const perdido = !enfocado || !enfocado.isConnected || enfocado.closest('[hidden]') || enfocado === this.documento.body;
    if (perdido && !directo) {
      this.actual()?.titulo?.()?.focus({ preventScroll: true });
    }
    this.anunciar();
  }

  private anunciar(): void {
    const total = this.total();
    const texto = this.actual()?.texto?.(this.paso()) ?? '';
    const prefijo = total > 1 ? `${this.nombre()}, paso ${this.paso() + 1} de ${total}.` : `${this.nombre()}.`;
    this.anunciador.announce(`${prefijo} ${texto}`.trim(), 'polite');
  }
}

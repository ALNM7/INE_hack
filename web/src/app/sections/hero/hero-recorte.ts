import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { ESCALA_ENTRADA, contextoGsap, curva, duracion, escalonadoTexto, gsap } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Boton } from '../../shared/ui/boton';
import { FondoLuces } from './fondo-luces';
import { BOTON, SUBTITULO, TITULO } from './textos';

@Component({
  selector: 'app-hero-recorte',
  imports: [Boton, FondoLuces],
  template: `
    <section
      class="relative grid min-h-svh place-items-end justify-items-center overflow-hidden bg-fondo px-margen-movil pt-[calc(var(--space-16)+env(safe-area-inset-top))] pb-[calc(var(--space-10)+env(safe-area-inset-bottom))] text-texto md:px-margen-escritorio lg:pb-[calc(var(--space-16)+env(safe-area-inset-bottom))]"
      aria-labelledby="hero-titulo"
    >
      <app-fondo-luces #campo class="absolute inset-0 lg:left-5/12" [arriba]="true" />
      <div
        #bloque
        class="relative flex max-w-(--container-texto) flex-col items-center gap-6 rounded-lg bg-fondo px-6 py-10 text-center md:px-12 md:py-14 lg:w-5/12 lg:items-start lg:self-center lg:justify-self-start lg:px-0 lg:text-left"
      >
        <h1 id="hero-titulo" class="text-titulo-1 ancho-titulo">{{ titulo }}</h1>
        <p class="text-entrada text-texto-2">{{ subtitulo }}</p>
        <button appBoton type="button" (click)="empezar.emit()">{{ boton }}</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroRecorte {
  readonly empezar = output<void>();

  protected readonly titulo = TITULO;
  protected readonly subtitulo = SUBTITULO;
  protected readonly boton = BOTON;

  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly campo = viewChild.required('campo', { read: ElementRef });
  private readonly bloque = viewChild.required<ElementRef<HTMLElement>>('bloque');

  constructor() {
    afterNextRender(() => {
      const campo = this.campo().nativeElement as HTMLElement;
      const bloque = this.bloque().nativeElement;
      const hijos = Array.from(bloque.children);
      contextoGsap(this.destroyRef, this.anfitrion.nativeElement, () => {
        if (this.reducido()) {
          gsap.from([campo, bloque], { opacity: 0, duration: duracion('corta'), ease: curva('entrada') });
          return;
        }
        gsap
          .timeline({ defaults: { ease: curva('entrada'), duration: duracion('larga') } })
          .from(campo, { opacity: 0, duration: duracion('encendido') }, 0)
          .from(bloque, { opacity: 0, scale: ESCALA_ENTRADA }, duracion('encendido') / 2)
          .from(hijos, { opacity: 0, stagger: escalonadoTexto() }, '<');
      });
    });
  }
}

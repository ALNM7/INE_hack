import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  viewChild,
  viewChildren,
} from '@angular/core';
import { contextoGsap, curva, duracion, escalonadoTexto, gsap } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { pxToken } from '../../core/tokens';
import { Boton } from '../../shared/ui/boton';
import { FondoLuces } from './fondo-luces';
import { BOTON, SUBTITULO, TITULO, TITULO_LINEAS } from './textos';

@Component({
  selector: 'app-hero-horizonte',
  imports: [Boton, FondoLuces],
  template: `
    <section class="grid min-h-svh grid-rows-[minmax(0,1fr)_auto] bg-fondo text-texto" aria-labelledby="hero-titulo">
      <div #campo class="relative min-h-48">
        <app-fondo-luces class="absolute inset-0" />
      </div>
      <div
        class="mx-auto flex w-full max-w-(--container-max) flex-col items-start gap-6 px-margen-movil pt-10 pb-[calc(var(--space-10)+env(safe-area-inset-bottom))] md:px-margen-escritorio md:pt-16"
      >
        <h1 id="hero-titulo" class="text-titulo-1 ancho-titulo" [attr.aria-label]="titulo">
          @for (linea of lineas; track linea) {
            <span #renglon class="block" aria-hidden="true">{{ linea }}</span>
          }
        </h1>
        <p #sub class="max-w-(--container-texto) text-entrada text-texto-2">{{ subtitulo }}</p>
        <button #accion appBoton type="button" (click)="empezar.emit()">{{ boton }}</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroHorizonte {
  readonly empezar = output<void>();

  protected readonly titulo = TITULO;
  protected readonly lineas = TITULO_LINEAS;
  protected readonly subtitulo = SUBTITULO;
  protected readonly boton = BOTON;

  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly campo = viewChild.required<ElementRef<HTMLElement>>('campo');
  private readonly lineasTitulo = viewChildren<ElementRef<HTMLElement>>('renglon');
  private readonly subtituloRef = viewChild.required<ElementRef<HTMLElement>>('sub');
  private readonly accion = viewChild.required('accion', { read: ElementRef });

  constructor() {
    afterNextRender(() => {
      const campo = this.campo().nativeElement;
      const lineas = this.lineasTitulo().map((l) => l.nativeElement);
      const resto = [this.subtituloRef().nativeElement, this.accion().nativeElement];
      contextoGsap(this.destroyRef, this.anfitrion.nativeElement, () => {
        if (this.reducido()) {
          gsap.from([campo, ...lineas, ...resto], { opacity: 0, duration: duracion('corta'), ease: curva('entrada') });
          return;
        }
        const y = pxToken('--space-2');
        gsap
          .timeline({ defaults: { ease: curva('entrada'), duration: duracion('larga') } })
          .from(campo, { opacity: 0, duration: duracion('encendido') }, 0)
          .from(
            lineas,
            { clipPath: 'inset(0 0 100% 0)', y, stagger: escalonadoTexto(), clearProps: 'clipPath' },
            duracion('escena') / 2,
          )
          .from(resto, { opacity: 0, y, stagger: escalonadoTexto() }, `-=${duracion('corta')}`);
      });
    });
  }
}

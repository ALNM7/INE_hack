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
import { colorToken, pxToken } from '../../core/tokens';
import { Boton } from '../../shared/ui/boton';
import { FondoLuces } from './fondo-luces';
import { BOTON, PALABRA_APAGADA, SUBTITULO, TITULO, TITULO_PALABRAS } from './textos';

@Component({
  selector: 'app-hero-titular',
  imports: [Boton, FondoLuces],
  template: `
    <section
      class="flex min-h-svh flex-col justify-between gap-10 bg-fondo px-margen-movil pt-[calc(var(--space-16)+env(safe-area-inset-top))] pb-[calc(var(--space-10)+env(safe-area-inset-bottom))] text-texto md:px-margen-escritorio lg:grid lg:grid-cols-12 lg:content-between lg:gap-x-6"
      aria-labelledby="hero-titulo"
    >
      <h1 id="hero-titulo" class="text-cifra ancho-titulo md:text-display lg:col-span-12" [attr.aria-label]="titulo">
        @for (palabra of palabras; track $index) {
          <span
            #termino
            class="inline-block"
            [class.text-foco-apagado]="palabra === apagada"
            [attr.data-apagada]="palabra === apagada ? '' : null"
            aria-hidden="true"
            >{{ palabra }}</span
          >{{ ' ' }}
        }
      </h1>
      <div #panel class="aspect-video overflow-hidden rounded-lg border border-linea lg:col-span-7">
        <app-fondo-luces class="size-full" />
      </div>
      <div class="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9 lg:self-end">
        <p #sub class="text-entrada text-texto-2">{{ subtitulo }}</p>
        <button #accion appBoton type="button" (click)="empezar.emit()">{{ boton }}</button>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroTitular {
  readonly empezar = output<void>();

  protected readonly titulo = TITULO;
  protected readonly palabras = TITULO_PALABRAS;
  protected readonly apagada = PALABRA_APAGADA;
  protected readonly subtitulo = SUBTITULO;
  protected readonly boton = BOTON;

  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly palabrasRef = viewChildren<ElementRef<HTMLElement>>('termino');
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly subtituloRef = viewChild.required<ElementRef<HTMLElement>>('sub');
  private readonly accion = viewChild.required('accion', { read: ElementRef });

  constructor() {
    afterNextRender(() => {
      const palabras = this.palabrasRef().map((p) => p.nativeElement);
      const apagada = palabras.find((p) => p.hasAttribute('data-apagada'));
      const panel = this.panel().nativeElement;
      const resto = [this.subtituloRef().nativeElement, this.accion().nativeElement];
      contextoGsap(this.destroyRef, this.anfitrion.nativeElement, () => {
        if (this.reducido()) {
          gsap.from([...palabras, panel, ...resto], { opacity: 0, duration: duracion('corta'), ease: curva('entrada') });
          return;
        }
        const y = pxToken('--space-2');
        const linea = gsap
          .timeline({ defaults: { ease: curva('entrada'), duration: duracion('larga') } })
          .from(palabras, { opacity: 0, y, stagger: escalonadoTexto() }, 0);
        if (apagada) {
          linea.from(
            apagada,
            { color: colorToken('--color-foco-encendido'), duration: duracion('escena'), ease: curva('apagado') },
            '>',
          );
        }
        linea
          .from(panel, { opacity: 0, duration: duracion('escena') }, '<')
          .from(resto, { opacity: 0, y, stagger: escalonadoTexto() }, `-=${duracion('larga')}`);
      });
    });
  }
}

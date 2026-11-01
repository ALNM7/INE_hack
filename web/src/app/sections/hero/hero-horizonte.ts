import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DataService } from '../../core/data.service';
import { contextoGsap, curva, duracion, escalonadoTexto, gsap } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { colorToken, pxToken } from '../../core/tokens';
import { Boton } from '../../shared/ui/boton';
import { HeroCampo } from './hero-campo';
import { BOTON, FRASES, PALABRA_APAGADA, TITULO, TITULO_LINEAS } from './textos';

const EDAD_PRIMERA = 18;

const porcentaje = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

@Component({
  selector: 'app-hero-horizonte',
  imports: [Boton, HeroCampo],
  template: `
    <section
      class="relative isolate grid min-h-svh grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-fondo text-texto"
      aria-labelledby="hero-titulo"
    >
      <div #campo class="absolute inset-0 -z-10" aria-hidden="true">
        <app-hero-campo class="absolute inset-0" />
        <div class="absolute inset-0 bg-linear-to-t from-fondo via-fondo/75 to-transparent"></div>
      </div>

      <div
        class="relative row-start-2 mx-auto flex w-full max-w-(--container-max) flex-col items-start gap-6 px-margen-movil pt-10 pb-[calc(var(--space-10)+env(safe-area-inset-bottom))] md:gap-8 md:px-margen-escritorio md:pt-16"
      >
        <h1 id="hero-titulo" class="text-cifra ancho-titulo" [attr.aria-label]="titulo">
          <span #renglon class="block" aria-hidden="true">{{ lineas[0] }}</span>
          <span #renglon class="block" aria-hidden="true"
            >{{ inicioFinal }}<span #palabraApagada class="text-foco-apagado">{{ apagada }}</span></span
          >
        </h1>
        <p #sub class="max-w-(--container-texto) text-titulo-3 text-texto-2">
          <span class="text-texto">{{ frases[0] }} {{ frases[1] }}</span> {{ frases[2] }}
        </p>
        <button #accion appBoton type="button" (click)="empezar.emit()">{{ boton }}</button>
        @if (descripcion(); as d) {
          <p class="sr-only">{{ d }}</p>
        }
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroHorizonte {
  readonly empezar = output<void>();

  protected readonly titulo = TITULO;
  protected readonly lineas = TITULO_LINEAS;
  protected readonly apagada = PALABRA_APAGADA;
  protected readonly inicioFinal = TITULO_LINEAS[1].slice(0, TITULO_LINEAS[1].length - PALABRA_APAGADA.length);
  protected readonly frases = FRASES;
  protected readonly boton = BOTON;
  protected readonly descripcion = signal<string | null>(null);

  private readonly datos = inject(DataService);
  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly luces = viewChild.required(HeroCampo);
  private readonly campo = viewChild.required<ElementRef<HTMLElement>>('campo');
  private readonly lineasTitulo = viewChildren<ElementRef<HTMLElement>>('renglon');
  private readonly apagadaRef = viewChild.required<ElementRef<HTMLElement>>('palabraApagada');
  private readonly subRef = viewChild.required<ElementRef<HTMLElement>>('sub');
  private readonly accion = viewChild.required('accion', { read: ElementRef });

  constructor() {
    afterNextRender(() => {
      const campo = this.campo().nativeElement;
      const lineas = this.lineasTitulo().map((l) => l.nativeElement);
      const apagada = this.apagadaRef().nativeElement;
      const sub = this.subRef().nativeElement;
      const cierre = [this.accion().nativeElement];
      const datos = this.cifras();

      contextoGsap(this.destroyRef, this.anfitrion.nativeElement, () => {
        if (this.reducido()) {
          gsap.from([campo, ...lineas, sub, ...cierre], {
            opacity: 0,
            duration: duracion('corta'),
            ease: curva('entrada'),
          });
          datos.then((c) => c && this.luces().fijar(c.alos24));
          return;
        }

        const y = pxToken('--space-2');
        const encendido = duracion('encendido');
        const estado = { f: 1 };
        const fijar = () => this.luces().fijar(estado.f);

        fijar();
        gsap.set(apagada, { color: colorToken('--color-foco-encendido') });
        const linea = gsap
          .timeline({ paused: true, defaults: { ease: curva('entrada'), duration: duracion('larga') } })
          .from(campo, { opacity: 0, duration: duracion('escena') }, 0)
          .from(lineas, { clipPath: 'inset(0 0 100% 0)', y, stagger: escalonadoTexto(), clearProps: 'clipPath' }, duracion('corta'))
          .addLabel('encender', duracion('escena'))
          .from(sub, { opacity: 0, y }, 'encender')
          .from(cierre, { opacity: 0, y }, `encender+=${escalonadoTexto()}`)
          .addLabel('apagar', `encender+=${encendido}`)
          .to(apagada, { color: colorToken('--color-foco-apagado'), duration: encendido, ease: curva('escena') }, 'apagar');

        datos.then((c) => {
          if (c) {
            linea
              .to(
                estado,
                { f: c.alos24, duration: encendido * 1.8, ease: curva('escena'), onUpdate: fijar },
                `apagar-=${encendido * 0.8 + duracion('corta')}`,
              )
              .call(() => this.luces().relevar(true), undefined, `apagar+=${encendido}`);
          }
          linea.play();
        });
      });
    });
  }

  private async cifras(): Promise<{ alos18: number; alos24: number } | null> {
    try {
      const cohortes = await this.datos.cohortes.cargar();
      const fila = cohortes.corta.filas.find((f) => f[0] === EDAD_PRIMERA);
      if (!fila || fila[1] === null || fila[2] === null) {
        return null;
      }
      const [, alos18, alos24] = fila as [number, number, number];
      this.descripcion.set(
        `Cada punto es una persona. La generación que tenía ${EDAD_PRIMERA} años en 2018 votó ${porcentaje.format(alos18)}%; seis años después, ${porcentaje.format(alos24)}%.`,
      );
      return { alos18: alos18 / 100, alos24: alos24 / 100 };
    } catch {
      return null;
    }
  }
}

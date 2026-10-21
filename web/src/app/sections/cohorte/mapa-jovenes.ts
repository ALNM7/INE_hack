import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  TemplateRef,
  ViewContainerRef,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import {
  FlexibleConnectedPositionStrategy,
  OverlayRef,
  createCloseScrollStrategy,
  createFlexibleConnectedPositionStrategy,
  createOverlayRef,
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { GeoProjection, geoPath, scaleQuantize } from 'd3';
import type { Estados as Geo } from '../../core/mapa.service';
import { Estado } from '../../core/models';
import { funcionCurva } from '../../core/motion';
import { pxToken } from '../../core/tokens';
import { proyeccionMexico } from '../../shared/charts/proyeccion';
import { DatosActo, FOCOS_POR_PUNTO, porcentaje } from './escena';
import { LucesFocos, generarFocos } from './focos';

const SEMILLA_FOCOS = 2024;
const OSCURO_MINIMO = 0.3;
const RELLENOS = [
  'fill-escala-0',
  'fill-escala-1',
  'fill-escala-2',
  'fill-escala-3',
  'fill-escala-4',
  'fill-escala-5',
  'fill-escala-6',
  'fill-escala-7',
  'fill-escala-8',
] as const;
const MUESTRAS = [
  'bg-escala-0',
  'bg-escala-1',
  'bg-escala-2',
  'bg-escala-3',
  'bg-escala-4',
  'bg-escala-5',
  'bg-escala-6',
  'bg-escala-7',
  'bg-escala-8',
] as const;

interface EstadoMapa {
  c: number;
  n: string;
  d: string;
  valor: number | null;
  relleno: string;
}

interface Seleccion {
  c: number;
  n: string;
  valor: string;
}

@Component({
  selector: 'app-mapa-jovenes',
  template: `
    <figure class="flex h-full flex-col gap-3">
      <div #area class="relative min-h-0 flex-1" (pointerleave)="salir($event)">
        @let m = medidas();
        @if (m.ancho > 0) {
          <svg
            class="absolute inset-0 size-full overflow-visible will-change-[opacity]"
            [attr.viewBox]="'0 0 ' + m.ancho + ' ' + m.alto"
            [style.opacity]="opacidadMapa()"
            aria-hidden="true"
          >
            @for (e of estadosMapa(); track e.c) {
              <path
                [attr.d]="e.d"
                [class]="e.relleno"
                class="stroke-fondo [stroke-width:calc(var(--spacing)/4)] [stroke-linejoin:round]"
                (pointermove)="sobre($event, e)"
                (click)="sobre($event, e)"
              />
            }
            @if (resaltado(); as r) {
              <path
                [attr.d]="r.d"
                class="pointer-events-none fill-none stroke-texto [stroke-width:calc(var(--spacing)/2)] [stroke-linejoin:round]"
              />
            }
          </svg>
          <svg
            class="pointer-events-none absolute inset-0 size-full overflow-visible"
            [attr.viewBox]="'0 0 ' + m.ancho + ' ' + m.alto"
            [style.opacity]="etiquetas()"
            aria-hidden="true"
          >
            @for (e of etiquetasFijas(); track e.c) {
              <circle [attr.cx]="e.x" [attr.cy]="e.y" [attr.r]="punto()" class="fill-texto" />
              <text
                [attr.x]="e.tx"
                [attr.y]="e.y"
                [attr.text-anchor]="e.ancla"
                dominant-baseline="middle"
                class="font-mono text-etiqueta [paint-order:stroke] stroke-fondo [stroke-width:calc(var(--spacing))] [stroke-linejoin:round]"
              >
                <tspan class="fill-texto font-medio">{{ e.n }}</tspan>
                <tspan class="fill-acento-texto tabular" [attr.dx]="punto()">{{ e.cifra }}</tspan>
              </text>
            }
          </svg>
        }
        <div #capaFocos class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true"></div>
      </div>

      <div class="grid font-mono text-etiqueta text-texto-2">
        <div
          class="flex flex-col gap-1 [grid-area:1/1]"
          [style.opacity]="opacidadLeyenda()"
          [attr.aria-hidden]="nota() > 0.5 ? 'true' : null"
        >
          <span>% de jóvenes de 18 a 24 años que votó · {{ anio }}</span>
          <div class="flex h-2 max-w-80 overflow-hidden rounded-xs" aria-hidden="true">
            @for (clase of muestras; track clase) {
              <span class="flex-1" [class]="clase"></span>
            }
          </div>
          <div class="flex max-w-80 justify-between text-texto-3 tabular">
            <span>{{ leyenda().min }}</span>
            <span>{{ leyenda().max }}</span>
          </div>
        </div>
        <p
          class="self-end text-texto-2 [grid-area:1/1]"
          [style.opacity]="opacidadNota()"
          [attr.aria-hidden]="nota() > 0.5 ? null : 'true'"
        >
          Cada punto representa {{ focosPorPunto }} secciones. La ubicación dentro de cada estado es
          aproximada.
        </p>
      </div>
    </figure>

    <ng-template #globo>
      @if (seleccion(); as s) {
        <div
          class="flex min-w-36 origin-bottom flex-col gap-1 rounded-md border border-linea bg-superficie-alta px-3 py-2 shadow-tooltip transition-[opacity,scale] duracion-corta ease-entrada starting:scale-96 starting:opacity-0 motion-reduce:starting:scale-100"
          role="status"
        >
          <span class="font-titulo text-cuerpo font-semi ancho-titulo">{{ s.n }}</span>
          <span class="font-mono text-titulo-3 font-medio text-acento-texto tabular">{{
            s.valor
          }}</span>
          <span class="text-etiqueta text-texto-2">de 18 a 24 años votó en {{ anio }}</span>
        </div>
      }
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block h-full' },
})
export class MapaJovenes {
  readonly datos = input.required<DatosActo>();
  readonly geo = input.required<Geo>();
  readonly activo = input(false);
  readonly oscuro = input(0);
  readonly etiquetas = input(0);
  readonly nota = input(0);
  readonly reducido = input(false);

  private readonly injector = inject(Injector);
  private readonly vcr = inject(ViewContainerRef);
  private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');
  private readonly capaFocos = viewChild.required<ElementRef<HTMLElement>>('capaFocos');
  private readonly globo = viewChild.required<TemplateRef<unknown>>('globo');

  protected readonly anio = '2024';
  protected readonly muestras = MUESTRAS;
  protected readonly focosPorPunto = FOCOS_POR_PUNTO;
  protected readonly medidas = signal({ ancho: 0, alto: 0, margen: 0 });
  protected readonly punto = signal(0);
  protected readonly seleccion = signal<Seleccion | null>(null);

  private overlay: OverlayRef | null = null;
  private posicion: FlexibleConnectedPositionStrategy | null = null;
  private luces: LucesFocos | null = null;
  private progresoFocos = 0;

  private readonly proyeccion = computed<GeoProjection | null>(() => {
    const { ancho, alto, margen } = this.medidas();
    if (!ancho || !alto) {
      return null;
    }
    return proyeccionMexico().fitExtent(
      [
        [margen, margen],
        [ancho - margen, alto - margen],
      ],
      this.geo(),
    );
  });

  private readonly escala = computed(() => {
    const { min, max } = this.datos().extremos;
    return scaleQuantize<number>()
      .domain([min.jovenes_18_24[this.anio]!, max.jovenes_18_24[this.anio]!])
      .range(RELLENOS.map((_, i) => i));
  });

  protected readonly leyenda = computed(() => {
    const [min, max] = this.escala().domain();
    return { min: porcentaje(min), max: porcentaje(max) };
  });

  protected readonly estadosMapa = computed<EstadoMapa[]>(() => {
    const proyeccion = this.proyeccion();
    if (!proyeccion) {
      return [];
    }
    const ruta = geoPath(proyeccion);
    const porClave = new Map(this.datos().estados.map((e) => [e.c, e]));
    const escala = this.escala();
    return this.geo().features.map((f) => {
      const dato = porClave.get(f.properties.c);
      const valor = dato?.jovenes_18_24[this.anio] ?? null;
      return {
        c: f.properties.c,
        n: dato?.n ?? f.properties.n,
        d: ruta(f) ?? '',
        valor,
        relleno: valor === null ? 'fill-superficie-alta' : RELLENOS[escala(valor)],
      };
    });
  });

  protected readonly etiquetasFijas = computed(() => {
    const proyeccion = this.proyeccion();
    const { ancho } = this.medidas();
    if (!proyeccion) {
      return [];
    }
    const ruta = geoPath(proyeccion);
    const { min, max } = this.datos().extremos;
    const sep = this.punto() * 2;
    return [min, max].flatMap((estado: Estado) => {
      const forma = this.geo().features.find((f) => f.properties.c === estado.c);
      if (!forma) {
        return [];
      }
      const [x, y] = ruta.centroid(forma);
      const ancla: 'start' | 'end' = x > ancho / 2 ? 'end' : 'start';
      return [
        {
          c: estado.c,
          n: estado.n,
          x,
          y,
          tx: ancla === 'end' ? x - sep : x + sep,
          ancla,
          cifra: porcentaje(estado.jovenes_18_24[this.anio]!),
        },
      ];
    });
  });

  protected readonly resaltado = computed(() => {
    const s = this.seleccion();
    return s ? (this.estadosMapa().find((e) => e.c === s.c) ?? null) : null;
  });

  protected readonly opacidadLeyenda = computed(() => Math.max(0, 1 - this.nota() * 2));
  protected readonly opacidadNota = computed(() => Math.max(0, this.nota() * 2 - 1));

  protected readonly opacidadMapa = computed(() => 1 - this.oscuro() * (1 - OSCURO_MINIMO));

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.punto.set(pxToken('--space-1'));
      const margen = pxToken('--space-2');
      const area = this.area().nativeElement;
      const puntos = generarFocos(this.geo(), this.datos().estados, SEMILLA_FOCOS);
      this.luces = new LucesFocos(this.capaFocos().nativeElement, puntos, {
        radio: pxToken('--space-1') / 2,
        halo: pxToken('--space-2'),
        curva: funcionCurva('entrada'),
      });
      const observador = new ResizeObserver(([entrada]) => {
        const { width, height } = entrada.contentRect;
        const previo = this.medidas();
        if (Math.abs(width - previo.ancho) < 1 && Math.abs(height - previo.alto) < 1) {
          return;
        }
        this.medidas.set({ ancho: width, alto: height, margen });
        const proyeccion = this.proyeccion();
        if (proyeccion && this.luces) {
          this.luces.medir(width, height, proyeccion);
          this.luces.pintar(this.progresoFocos, this.reducido());
        }
        this.ocultar();
      });
      observador.observe(area);
      destroyRef.onDestroy(() => {
        observador.disconnect();
        this.luces?.destruir();
      });
    });

    effect(() => {
      if (!this.activo()) {
        untracked(() => this.ocultar());
      }
    });

    destroyRef.onDestroy(() => {
      this.overlay?.dispose();
      this.overlay = null;
    });
  }

  pintarFocos(progreso: number): void {
    this.progresoFocos = progreso;
    this.luces?.pintar(progreso, this.reducido());
  }

  protected sobre(evento: PointerEvent | MouseEvent, estado: EstadoMapa): void {
    if (!this.activo()) {
      return;
    }
    if (evento.type === 'pointermove' && (evento as PointerEvent).pointerType !== 'mouse') {
      return;
    }
    this.seleccion.set({
      c: estado.c,
      n: estado.n,
      valor: estado.valor === null ? 'Sin dato' : porcentaje(estado.valor),
    });
    const origen = { x: evento.clientX, y: evento.clientY };
    if (!this.overlay || !this.posicion) {
      const sep = this.punto() * 2;
      this.posicion = createFlexibleConnectedPositionStrategy(this.injector, origen)
        .withPositions([
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -sep,
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: sep,
          },
        ])
        .withViewportMargin(sep)
        .withPush(true)
        .withFlexibleDimensions(false);
      this.overlay = createOverlayRef(this.injector, {
        positionStrategy: this.posicion,
        scrollStrategy: createCloseScrollStrategy(this.injector, { threshold: sep * 2 }),
        panelClass: 'pointer-events-none',
      });
      this.overlay.detachments().subscribe(() => this.seleccion.set(null));
      this.overlay.outsidePointerEvents().subscribe((e) => {
        if (!(e.target instanceof SVGPathElement)) {
          this.ocultar();
        }
      });
    } else {
      this.posicion.setOrigin(origen);
    }
    if (!this.overlay.hasAttached()) {
      this.overlay.attach(new TemplatePortal(this.globo(), this.vcr));
    } else {
      this.overlay.updatePosition();
    }
  }

  protected salir(evento: PointerEvent): void {
    if (evento.pointerType === 'mouse') {
      this.ocultar();
    }
  }

  private ocultar(): void {
    if (this.overlay?.hasAttached()) {
      this.overlay.detach();
    }
    this.seleccion.set(null);
  }
}

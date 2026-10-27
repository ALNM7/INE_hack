import { ActiveDescendantKeyManager, Highlightable, LiveAnnouncer } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { sinAcentos } from '../../core/formato';
import { Icono } from '../../shared/ui/icono';

export interface OpcionMunicipio {
  c: number;
  n: string;
}

interface OpcionNormalizada extends OpcionMunicipio {
  clave: string;
}

@Component({
  selector: 'li[appOpcion]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'option',
    '[attr.id]': 'id()',
    '[attr.aria-selected]': 'elegida()',
    '[attr.data-activa]': 'activa() ? "" : null',
  },
})
export class Opcion implements Highlightable {
  readonly id = input.required<string>();
  readonly opcion = input.required<OpcionMunicipio>();
  readonly elegida = input(false);
  readonly activa = signal(false);
  readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);

  setActiveStyles(): void {
    this.activa.set(true);
  }

  setInactiveStyles(): void {
    this.activa.set(false);
  }
}

@Component({
  selector: 'app-combobox-municipio',
  imports: [Opcion, Icono],
  template: `
    <div class="flex flex-col gap-2">
      <label [attr.for]="idCampo()" class="text-nota font-negrita text-texto" [class.text-texto-3]="deshabilitado()">Municipio o alcaldía</label>
      <div class="relative">
        <app-icono nombre="buscar" class="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-texto-3" />
        <input
          #campo
          type="text"
          role="combobox"
          autocomplete="off"
          autocapitalize="none"
          spellcheck="false"
          enterkeyhint="done"
          aria-autocomplete="list"
          class="h-13 w-full rounded-sm border-[1.5px] bg-superficie pr-11 pl-11 font-texto text-cuerpo text-texto transition-[border-color,box-shadow] duracion-instante ease-entrada outline-none placeholder:text-texto-3 focus:border-foco-encendido focus:shadow-[0_0_0_3px_var(--color-luz-halo)] disabled:cursor-not-allowed disabled:bg-transparent"
          [class.border-linea]="!invalido()"
          [class.border-alerta]="invalido()"
          [attr.id]="idCampo()"
          [attr.aria-expanded]="abierto()"
          [attr.aria-controls]="idLista()"
          [attr.aria-activedescendant]="activa()"
          [attr.aria-invalid]="invalido()"
          [attr.aria-describedby]="describe()"
          [disabled]="deshabilitado()"
          [placeholder]="marcador()"
          [value]="consulta()"
          (input)="escribir($event)"
          (focus)="abrir()"
          (click)="abrir()"
          (blur)="salir()"
          (keydown)="tecla($event)"
        />
        <app-icono
          nombre="desplegar"
          class="pointer-events-none absolute top-1/2 right-3.5 size-5 -translate-y-1/2 text-texto-2 transition-transform duracion-instante ease-entrada"
          [class.rotate-180]="abierto()"
        />
      </div>
      @if (desborda() && !abierto() && nombreElegido(); as nombre) {
        <p class="text-nota text-texto-2">{{ nombre }}</p>
      }
      <div [hidden]="!abierto()">
        <ul
          #lista
          role="listbox"
          aria-label="Municipios"
          class="max-h-72 overflow-y-auto overscroll-contain rounded-sm border border-linea bg-superficie py-1"
          [attr.id]="idLista()"
        >
          @for (o of filtradas(); track o.c; let i = $index) {
            <li
              appOpcion
              [id]="idLista() + '-' + o.c"
              [opcion]="o"
              [elegida]="o.c === valor()"
              class="flex min-h-12 cursor-pointer items-center justify-between gap-3 px-4 py-2 text-cuerpo text-texto-2 select-none data-activa:bg-superficie-alta data-activa:text-texto aria-selected:font-negrita aria-selected:text-texto"
              (pointerdown)="$event.preventDefault()"
              (click)="elegir(o)"
            >
              <span class="min-w-0 [overflow-wrap:anywhere]">{{ o.n }}</span>
              @if (o.c === valor()) {
                <span class="size-2 shrink-0 rounded-full bg-foco-encendido shadow-halo" aria-hidden="true"></span>
              }
            </li>
          } @empty {
            <li role="presentation" class="px-4 py-3 text-cuerpo text-texto-2">No encontramos ese municipio. Revisa cómo lo escribiste.</li>
          }
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ComboboxMunicipio {
  readonly opciones = input.required<readonly OpcionMunicipio[]>();
  readonly deshabilitado = input(false);
  readonly cargando = input(false);
  readonly invalido = input(false);
  readonly descripcion = input<string | null>(null);
  readonly idCampo = input('wrapped-municipio');
  readonly valor = model<number | null>(null);

  protected readonly idLista = computed(() => `${this.idCampo()}-lista`);
  protected readonly consulta = signal('');
  protected readonly abierto = signal(false);
  protected readonly activa = signal<string | null>(null);

  private readonly campo = viewChild.required<ElementRef<HTMLInputElement>>('campo');
  private readonly elementos = viewChildren(Opcion);
  private readonly anunciador = inject(LiveAnnouncer);
  private readonly injector = inject(Injector);
  private teclas: ActiveDescendantKeyManager<Opcion> | null = null;
  private anuncio: ReturnType<typeof setTimeout> | undefined;

  private readonly normalizadas = computed<OpcionNormalizada[]>(() =>
    this.opciones()
      .map((o) => ({ ...o, clave: sinAcentos(o.n) }))
      .sort((a, b) => a.n.localeCompare(b.n, 'es-MX')),
  );

  protected readonly desborda = signal(false);

  protected readonly nombreElegido = computed(() => this.opciones().find((o) => o.c === this.valor())?.n ?? null);

  protected readonly filtradas = computed<OpcionNormalizada[]>(() => {
    const todas = this.normalizadas();
    const texto = this.consulta();
    if (!texto || texto === this.nombreElegido()) {
      return todas;
    }
    const q = sinAcentos(texto);
    const inicio: OpcionNormalizada[] = [];
    const resto: OpcionNormalizada[] = [];
    for (const o of todas) {
      if (o.clave.startsWith(q) || o.clave.includes(` ${q}`)) {
        inicio.push(o);
      } else if (o.clave.includes(q)) {
        resto.push(o);
      }
    }
    return [...inicio, ...resto];
  });

  protected readonly marcador = computed(() => {
    if (this.cargando()) {
      return 'Cargando municipios';
    }
    return this.deshabilitado() ? 'Primero elige un estado' : 'Escribe para buscar';
  });

  protected readonly describe = computed(() => this.descripcion());

  constructor() {
    effect(() => {
      const nombre = this.nombreElegido();
      untracked(() => {
        if (nombre !== null) {
          this.consulta.set(nombre);
        } else if (this.valor() === null && document.activeElement !== this.campo().nativeElement) {
          this.consulta.set('');
        }
      });
    });

    effect(() => {
      const opciones = this.opciones();
      untracked(() => {
        const valor = this.valor();
        if (valor === null || !opciones.some((o) => o.c === valor)) {
          this.valor.set(null);
          this.consulta.set('');
          this.cerrar();
        }
      });
    });

    effect(() => {
      const total = this.filtradas().length;
      const abierto = this.abierto();
      untracked(() => {
        clearTimeout(this.anuncio);
        if (!abierto || !this.consulta()) {
          return;
        }
        this.anuncio = setTimeout(() => {
          const texto = total === 0 ? 'Sin resultados' : total === 1 ? '1 municipio' : `${total} municipios`;
          this.anunciador.announce(texto, 'polite');
        }, 400);
      });
    });

    afterRenderEffect(() => {
      this.consulta();
      const campo = this.campo().nativeElement;
      this.desborda.set(campo.scrollWidth > campo.clientWidth);
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.anuncio);
      this.teclas?.destroy();
    });
  }

  private gestor(): ActiveDescendantKeyManager<Opcion> {
    if (!this.teclas) {
      this.teclas = new ActiveDescendantKeyManager(this.elementos, this.injector).withWrap(false).withVerticalOrientation(true);
      this.teclas.change.subscribe(() => {
        const item = this.teclas?.activeItem;
        this.activa.set(item ? item.id() : null);
        item?.elemento.nativeElement.scrollIntoView({ block: 'nearest' });
      });
    }
    return this.teclas;
  }

  protected abrir(): void {
    if (!this.deshabilitado()) {
      this.abierto.set(true);
    }
  }

  protected escribir(evento: Event): void {
    const texto = (evento.target as HTMLInputElement).value;
    this.consulta.set(texto);
    if (this.valor() !== null && texto !== this.nombreElegido()) {
      this.valor.set(null);
    }
    this.abierto.set(true);
    this.limpiarActiva();
  }

  protected elegir(opcion: OpcionMunicipio): void {
    this.valor.set(opcion.c);
    this.consulta.set(opcion.n);
    this.cerrar();
  }

  protected salir(): void {
    if (this.valor() === null) {
      const q = sinAcentos(this.consulta());
      const exacta = q ? this.normalizadas().find((o) => o.clave === q) : undefined;
      if (exacta) {
        this.elegir(exacta);
        return;
      }
    }
    this.cerrar();
  }

  protected tecla(evento: KeyboardEvent): void {
    const gestor = this.gestor();
    switch (evento.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        evento.preventDefault();
        if (!this.abierto()) {
          this.abierto.set(true);
        }
        if (gestor.activeItemIndex === null || gestor.activeItemIndex < 0) {
          const elegida = this.elementos().findIndex((e) => e.opcion().c === this.valor());
          if (elegida >= 0) {
            gestor.setActiveItem(elegida);
            return;
          }
          if (evento.key === 'ArrowDown') {
            gestor.setFirstItemActive();
          } else {
            gestor.setLastItemActive();
          }
          return;
        }
        gestor.onKeydown(evento);
        break;
      case 'Enter': {
        const item = gestor.activeItem;
        if (this.abierto() && item) {
          evento.preventDefault();
          this.elegir(item.opcion());
        } else if (this.abierto() && this.filtradas().length === 1) {
          evento.preventDefault();
          this.elegir(this.filtradas()[0]);
        }
        break;
      }
      case 'Escape':
        if (this.abierto()) {
          evento.preventDefault();
          this.cerrar();
        }
        break;
      case 'Tab':
        this.cerrar();
        break;
    }
  }

  enfocar(): void {
    this.campo().nativeElement.focus();
  }

  private cerrar(): void {
    this.abierto.set(false);
    this.limpiarActiva();
  }

  private limpiarActiva(): void {
    this.teclas?.updateActiveItem(-1);
    this.elementos().forEach((e) => e.setInactiveStyles());
    this.activa.set(null);
  }
}

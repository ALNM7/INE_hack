import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { DataService } from '../../core/data.service';
import { curva, duracion, escalonadoTexto, gsap, vibracionCorta } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Recorrido } from '../../core/recorrido';
import { pxToken } from '../../core/tokens';
import { Boton } from '../../shared/ui/boton';
import { Icono } from '../../shared/ui/icono';
import { SelectorVariantes } from '../../shared/ui/selector-variantes';
import {
  EDAD_MAX,
  EDAD_MIN,
  GRUPOS,
  MARGEN_ATINO,
  PASO_FINO,
  PASO_GRUESO,
  PUNTOS_REQUERIDOS,
  Punto,
  SERIE,
  Trazo,
  VALOR_MAX,
  VALOR_MIN,
  acotar,
  ajustarGrupo,
  completo,
  curvaDePuntos,
  errorMedio,
  extremos,
  puntosDibujados,
  redondear,
  serieReal,
  trazar,
  trazoInicial,
  ultimaDibujada,
  valorGrupo,
} from './trazo';

const VARIANTES = ['Trazo', 'Puntos'] as const;
const EDAD_CLAVE = 25;
const TICKS_Y = [0, 25, 50, 75, 100];
const TICKS_X = [18, 25, 35, 45, 55, 65, 75, 85];

const decimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const entero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const plural = new Intl.PluralRules('es-MX');

interface Margenes {
  izq: number;
  der: number;
  arr: number;
  aba: number;
  sep: number;
  punto: number;
}

interface Arrastre {
  id: number;
  previo: Punto | null;
  indice: number;
  valorInicial: number;
  yInicial: number;
}

function porcentaje(valor: number): string {
  return `${decimal.format(valor)}%`;
}

function ruta(puntos: readonly { x: number; y: number }[]): string {
  return puntos.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('');
}

@Component({
  selector: 'app-dibujalo',
  imports: [Boton, Icono, SelectorVariantes],
  templateUrl: './dibujalo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Dibujalo {
  private readonly datos = inject(DataService);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  private readonly recorrido = inject(Recorrido);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly reducido = inject(MovimientoReducido).activo;

  private readonly parametro = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((p) => p.get('a1'))), {
    initialValue: null,
  });

  protected readonly nombres = VARIANTES;
  protected readonly grupos = GRUPOS;
  protected readonly edadMin = EDAD_MIN;
  protected readonly edadMax = EDAD_MAX;
  protected readonly edadClave = EDAD_CLAVE;
  protected readonly serie = SERIE;
  protected readonly ticksY = TICKS_Y;
  protected readonly ticksX = TICKS_X;
  protected readonly valorMin = VALOR_MIN;
  protected readonly valorMax = VALOR_MAX;
  protected readonly porcentaje = porcentaje;

  protected readonly conSelector = computed(() => this.parametro() !== null);
  protected readonly variante = computed(() => {
    const numero = parseInt(this.parametro() ?? '1', 10);
    return numero >= 1 && numero <= VARIANTES.length ? numero - 1 : 0;
  });
  protected readonly libre = computed(() => this.variante() === 0);

  private readonly area = viewChild.required<ElementRef<HTMLElement>>('area');
  private readonly lienzo = viewChild<ElementRef<SVGSVGElement>>('lienzo');
  private readonly lineaReal = viewChild<ElementRef<SVGPathElement>>('lineaReal');
  private readonly sombra = viewChild<ElementRef<SVGGElement>>('sombra');
  private readonly recorte = viewChild<ElementRef<SVGRectElement>>('recorte');
  private readonly punta = viewChild<ElementRef<SVGCircleElement>>('punta');
  private readonly botonReiniciar = viewChild('botonOtraVez', { read: ElementRef });
  private readonly botonRevelar = viewChild('botonVer', { read: ElementRef });
  private readonly deslizadores = viewChildren<ElementRef<HTMLElement>>('deslizador');

  protected readonly estadoCarga = this.datos.edadExacta.estado;
  protected readonly real = computed(() => {
    const d = this.datos.edadExacta.valor();
    return d ? serieReal(d) : null;
  });
  protected readonly valor18 = computed(() => this.real()?.[0] ?? null);

  protected readonly trazo = linkedSignal<Trazo>(() => {
    this.variante();
    const v = this.valor18();
    return v === null ? [] : trazoInicial(v);
  });
  protected readonly puntos = linkedSignal<number[]>(() => {
    this.variante();
    const v = this.valor18();
    return v === null ? [] : GRUPOS.map(() => v);
  });
  protected readonly movidos = linkedSignal<ReadonlySet<number>>(() => {
    this.variante();
    return new Set<number>();
  });
  protected readonly revelado = linkedSignal(() => {
    this.variante();
    return false;
  });
  protected readonly mensajes = linkedSignal(() => {
    this.variante();
    return false;
  });
  protected readonly arrastrando = signal<number | null>(null);

  private readonly tam = signal({ ancho: 0, alto: 0 });
  private readonly margen = signal<Margenes>({ izq: 0, der: 0, arr: 0, aba: 0, sep: 0, punto: 0 });
  private arrastre: Arrastre | null = null;
  private animacion: gsap.Context | null = null;

  protected readonly geo = computed(() => {
    const { ancho, alto } = this.tam();
    const m = this.margen();
    const iw = Math.max(1, ancho - m.izq - m.der);
    const ih = Math.max(1, alto - m.arr - m.aba);
    return {
      ...m,
      ancho,
      alto,
      iw,
      ih,
      x: (edad: number) => m.izq + ((edad - EDAD_MIN) / (EDAD_MAX - EDAD_MIN)) * iw,
      y: (valor: number) => m.arr + (1 - (valor - VALOR_MIN) / (VALOR_MAX - VALOR_MIN)) * ih,
    };
  });

  protected readonly listoDatos = computed(() => this.real() !== null && this.tam().ancho > 0);
  protected readonly ultima = computed(() => ultimaDibujada(this.trazo()));

  protected readonly curvaUsuario = computed<number[] | null>(() => {
    const v18 = this.valor18();
    if (v18 === null) {
      return null;
    }
    return this.libre() ? completo(this.trazo()) : curvaDePuntos(v18, this.puntos());
  });

  private readonly puntosUsuario = computed<Punto[]>(() => {
    const c = this.libre() ? null : this.curvaUsuario();
    return c ? c.map((valor, i) => ({ edad: EDAD_MIN + i, valor })) : puntosDibujados(this.trazo());
  });

  protected readonly dUsuario = computed(() => {
    const g = this.geo();
    return ruta(this.puntosUsuario().map((p) => ({ x: g.x(p.edad), y: g.y(p.valor) })));
  });

  protected readonly clasesUsuario = computed(() => {
    const base = 'transition-[stroke] duracion-corta ease-entrada';
    const grueso = '[stroke-width:calc(var(--spacing)*0.75)]';
    const punteada = '[stroke-dasharray:var(--space-1)_var(--space-2)]';
    if (this.revelado()) {
      return `${base} stroke-arena stroke-2 ${punteada}`;
    }
    if (!this.libre() && this.movidos().size === 0) {
      return `${base} stroke-texto-3 ${grueso} ${punteada}`;
    }
    return `${base} stroke-foco-encendido ${grueso}`;
  });

  protected readonly dReal = computed(() => {
    const r = this.real();
    const g = this.geo();
    return r ? ruta(r.map((v, i) => ({ x: g.x(EDAD_MIN + i), y: g.y(v) }))) : '';
  });

  protected readonly dSombra = computed(() => {
    const r = this.real();
    const u = this.curvaUsuario();
    const g = this.geo();
    if (!r || !u) {
      return '';
    }
    const ida = u.map((v, i) => ({ x: g.x(EDAD_MIN + i), y: g.y(v) }));
    const vuelta = r.map((v, i) => ({ x: g.x(EDAD_MIN + i), y: g.y(v) })).reverse();
    return `${ruta([...ida, ...vuelta])}Z`;
  });

  protected readonly listo = computed(() =>
    this.libre() ? this.ultima() === EDAD_MAX : this.movidos().size >= PUNTOS_REQUERIDOS,
  );

  protected readonly hayCambios = computed(() =>
    this.revelado() || (this.libre() ? this.ultima() > EDAD_MIN : this.movidos().size > 0),
  );

  protected readonly guia = computed(() => {
    if (this.libre()) {
      const ultima = this.ultima();
      if (ultima === EDAD_MIN) {
        return 'Arrastra el dedo o el mouse sobre la gráfica, de izquierda a derecha.';
      }
      return ultima < EDAD_MAX
        ? `Vas en los ${entero.format(ultima)} años. Sigue hasta los ${entero.format(EDAD_MAX)}.`
        : 'Listo. Ya puedes ver la realidad.';
    }
    const faltan = PUNTOS_REQUERIDOS - this.movidos().size;
    if (faltan === PUNTOS_REQUERIDOS) {
      return `Arrastra los puntos hacia arriba o hacia abajo. Mueve al menos ${entero.format(PUNTOS_REQUERIDOS)}.`;
    }
    return faltan > 0
      ? `Mueve ${entero.format(faltan)} ${plural.select(faltan) === 'one' ? 'punto' : 'puntos'} más.`
      : 'Listo. Ya puedes ver la realidad.';
  });

  protected readonly controles = computed(() => {
    const g = this.geo();
    const trazo = this.trazo();
    const puntos = this.puntos();
    const ultimoValor = trazo[this.ultima() - EDAD_MIN] ?? this.valor18() ?? VALOR_MIN;
    return GRUPOS.map((grupo, i) => {
      const valor = this.libre() ? valorGrupo(trazo, grupo) : (puntos[i] ?? null);
      return {
        grupo,
        valor,
        x: g.x(grupo.ancla),
        y: g.y(valor ?? ultimoValor),
        texto: valor === null ? 'Sin dibujar' : porcentaje(valor),
        movido: this.movidos().has(i),
      };
    });
  });

  protected readonly resultado = computed(() => {
    const r = this.real();
    const u = this.curvaUsuario();
    if (!this.revelado() || !r || !u) {
      return null;
    }
    const i25 = EDAD_CLAVE - EDAD_MIN;
    const real25 = r[i25];
    const diferencia = u[i25] - real25;
    const cifra25 = porcentaje(real25);
    const g = this.geo();
    return {
      error: decimal.format(redondear(errorMedio(u, r))),
      frase25:
        diferencia >= MARGEN_ATINO
          ? `Pensaste que a los ${EDAD_CLAVE} votaba más gente. En realidad votó solo el ${cifra25}.`
          : diferencia <= -MARGEN_ATINO
            ? `Pensaste que a los ${EDAD_CLAVE} votaba menos gente. En realidad votó el ${cifra25}.`
            : `Le atinaste: a los ${EDAD_CLAVE} años votó solo el ${cifra25}. Casi nadie lo adivina.`,
      cifra25,
      x25: g.x(EDAD_CLAVE),
      y25: g.y(real25),
    };
  });

  protected readonly descripcion = computed(() => {
    const r = this.real();
    if (!r) {
      return 'Gráfica de participación por edad.';
    }
    const inicio = `A los ${EDAD_MIN} votó el ${porcentaje(r[0])}.`;
    if (!this.revelado()) {
      return `Gráfica para dibujar qué porcentaje de personas votó a cada edad, de ${EDAD_MIN} a ${EDAD_MAX} años. ${inicio}`;
    }
    const { minimo, maximo } = extremos(r);
    const fin = r[r.length - 1];
    return (
      `Participación por edad en ${SERIE}. ${inicio} Baja hasta ${porcentaje(minimo.valor)} a los ${minimo.edad}, el punto más bajo; ` +
      `sube hasta ${porcentaje(maximo.valor)} a los ${maximo.edad}, el más alto, y termina en ${porcentaje(fin)} a los ${EDAD_MAX}.`
    );
  });

  protected readonly escalonado = escalonadoTexto();

  constructor() {
    this.recorrido.registrar('dibujalo', {
      total: signal(1).asReadonly(),
      ir: () => undefined,
      listo: this.revelado,
      titulo: () => document.getElementById('dibujalo-titulo'),
    });
    this.datos.edadExacta.cargar().catch(() => undefined);

    effect(() => {
      this.variante();
      untracked(() => this.detener());
    });

    afterNextRender(() => {
      this.margen.set({
        izq: pxToken('--space-10'),
        der: pxToken('--space-6'),
        arr: pxToken('--space-8'),
        aba: pxToken('--space-12'),
        sep: pxToken('--space-2'),
        punto: pxToken('--space-1'),
      });
      const observador = new ResizeObserver(([entrada]) => {
        const caja = entrada?.contentRect;
        if (caja) {
          this.tam.set({ ancho: caja.width, alto: caja.height });
        }
      });
      observador.observe(this.area().nativeElement);
      this.destroyRef.onDestroy(() => {
        observador.disconnect();
        this.detener();
      });
    });
  }

  private aDatos(evento: PointerEvent): Punto & { yPx: number } {
    const svg = this.lienzo()!.nativeElement.getBoundingClientRect();
    const g = this.geo();
    const x = evento.clientX - svg.left;
    const y = evento.clientY - svg.top;
    return {
      edad: Math.round(EDAD_MIN + ((x - g.izq) / g.iw) * (EDAD_MAX - EDAD_MIN)),
      valor: redondear(VALOR_MIN + (1 - (y - g.arr) / g.ih) * (VALOR_MAX - VALOR_MIN)),
      yPx: evento.clientY,
    };
  }

  protected abajo(evento: PointerEvent): void {
    if (this.revelado() || !this.listoDatos() || this.arrastre || !evento.isPrimary || evento.button !== 0) {
      return;
    }
    evento.preventDefault();
    const area = evento.currentTarget as HTMLElement;
    area.setPointerCapture(evento.pointerId);
    const punto = this.aDatos(evento);
    if (this.libre()) {
      this.arrastre = { id: evento.pointerId, previo: null, indice: -1, valorInicial: 0, yInicial: 0 };
      this.dibujar([punto]);
      return;
    }
    const indice = GRUPOS.reduce(
      (mejor, g, i) => (Math.abs(g.ancla - punto.edad) < Math.abs(GRUPOS[mejor].ancla - punto.edad) ? i : mejor),
      0,
    );
    this.arrastre = {
      id: evento.pointerId,
      previo: null,
      indice,
      valorInicial: this.puntos()[indice],
      yInicial: punto.yPx,
    };
    this.arrastrando.set(indice);
  }

  protected mover(evento: PointerEvent): void {
    const arrastre = this.arrastre;
    if (!arrastre || evento.pointerId !== arrastre.id) {
      return;
    }
    const agrupados = evento.getCoalescedEvents?.() ?? [];
    const eventos = agrupados.length ? agrupados : [evento];
    if (this.libre()) {
      this.dibujar(eventos.map((e) => this.aDatos(e)));
      return;
    }
    const ultimo = eventos[eventos.length - 1];
    const delta = (-(ultimo.clientY - arrastre.yInicial) / this.geo().ih) * (VALOR_MAX - VALOR_MIN);
    this.fijarPunto(arrastre.indice, arrastre.valorInicial + delta);
  }

  protected soltar(evento: PointerEvent): void {
    if (this.arrastre && evento.pointerId === this.arrastre.id) {
      this.arrastre = null;
      this.arrastrando.set(null);
    }
  }

  private dibujar(puntos: Punto[]): void {
    const arrastre = this.arrastre!;
    let trazo = this.trazo();
    for (const punto of puntos) {
      const destino = { edad: acotar(punto.edad, EDAD_MIN + 1, EDAD_MAX), valor: acotar(punto.valor) };
      trazo = trazar(trazo, arrastre.previo, destino);
      arrastre.previo = destino;
    }
    this.trazo.set(trazo);
  }

  private fijarPunto(indice: number, valor: number): void {
    const nuevo = redondear(acotar(valor));
    const puntos = this.puntos();
    if (puntos[indice] === nuevo) {
      return;
    }
    this.puntos.set(puntos.map((v, i) => (i === indice ? nuevo : v)));
    if (!this.movidos().has(indice)) {
      this.movidos.set(new Set([...this.movidos(), indice]));
    }
  }

  protected tecla(evento: KeyboardEvent, indice: number): void {
    if (this.revelado() || !this.listoDatos()) {
      return;
    }
    const paso = evento.shiftKey ? PASO_GRUESO : PASO_FINO;
    const deltas: Record<string, number> = {
      ArrowUp: paso,
      ArrowDown: -paso,
      '+': paso,
      '-': -paso,
      PageUp: PASO_GRUESO,
      PageDown: -PASO_GRUESO,
    };
    const delta = deltas[evento.key];
    if (delta === undefined) {
      return;
    }
    evento.preventDefault();
    if (this.libre()) {
      this.trazo.set(ajustarGrupo(this.trazo(), GRUPOS[indice], delta));
      return;
    }
    this.fijarPunto(indice, this.puntos()[indice] + delta);
  }

  protected revelar(): void {
    if (!this.listo() || this.revelado()) {
      return;
    }
    const conFoco = document.activeElement === this.botonRevelar()?.nativeElement;
    this.arrastre = null;
    this.arrastrando.set(null);
    this.revelado.set(true);
    afterNextRender(
      {
        write: () => {
          if (conFoco) {
            this.botonReiniciar()?.nativeElement.focus();
          }
          this.animarRevelacion();
        },
      },
      { injector: this.injector },
    );
  }

  private animarRevelacion(): void {
    const linea = this.lineaReal()?.nativeElement;
    const sombra = this.sombra()?.nativeElement;
    if (!linea || !sombra) {
      this.mensajes.set(true);
      return;
    }
    this.animacion?.revert();
    this.animacion = gsap.context(() => {
      if (this.reducido()) {
        gsap.from([linea, sombra], {
          opacity: 0,
          duration: duracion('corta'),
          ease: curva('entrada'),
          onComplete: () => this.mensajes.set(true),
        });
        return;
      }
      const recorte = this.recorte()?.nativeElement;
      const punta = this.punta()?.nativeElement;
      const total = linea.getTotalLength();
      const estado = { p: 0 };
      const pintar = () => {
        linea.style.strokeDashoffset = String(1 - estado.p);
        const pt = linea.getPointAtLength(estado.p * total);
        punta?.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        recorte?.setAttribute('transform', `translate(${pt.x - this.tam().ancho} 0)`);
      };
      pintar();
      gsap.to(estado, {
        p: 1,
        duration: duracion('encendido'),
        ease: curva('escena'),
        onUpdate: pintar,
        onComplete: () => {
          recorte?.removeAttribute('transform');
          if (punta) {
            gsap.to(punta, { opacity: 0, duration: duracion('corta'), ease: curva('salida') });
          }
          if (typeof navigator.vibrate === 'function') {
            navigator.vibrate(vibracionCorta());
          }
          this.mensajes.set(true);
        },
      });
    });
  }

  private detener(): void {
    this.animacion?.revert();
    this.animacion = null;
    this.arrastre = null;
    this.arrastrando.set(null);
  }

  protected reiniciar(): void {
    const v18 = this.valor18();
    if (v18 === null) {
      return;
    }
    const conFoco = document.activeElement === this.botonReiniciar()?.nativeElement;
    this.detener();
    this.trazo.set(trazoInicial(v18));
    this.puntos.set(GRUPOS.map(() => v18));
    this.movidos.set(new Set<number>());
    this.revelado.set(false);
    this.mensajes.set(false);
    if (conFoco) {
      afterNextRender({ write: () => this.deslizadores()[0]?.nativeElement.focus() }, { injector: this.injector });
    }
  }

  protected elegir(indice: number): void {
    if (indice === this.variante()) {
      return;
    }
    this.router.navigate([], { queryParams: { a1: indice + 1 }, queryParamsHandling: 'merge', replaceUrl: true });
  }

}

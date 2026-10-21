import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  TemplateRef,
  afterNextRender,
  afterRenderEffect,
  computed,
  inject,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DataService } from '../../core/data.service';
import { MapaService } from '../../core/mapa.service';
import { ScrollTrigger, curvas, duracion, funcionCurva, gsap } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Rgb, aCss, mezclar, pxToken, rgbToken } from '../../core/tokens';
import { Boton } from '../../shared/ui/boton';
import {
  Curvas,
  DatosActo,
  Etiqueta,
  FOCOS_POR_PUNTO,
  Medidas,
  PASOS,
  PASO_FOCOS,
  PASO_MAPA,
  Persona,
  Vista,
  miles,
  porcentaje,
  puntos,
  extraerDatos,
  vista,
} from './escena';
import { MapaJovenes } from './mapa-jovenes';

const CONSULTA_LADO = '(min-width: 48rem), (orientation: landscape) and (min-width: 36rem)';
const CONSULTA_PILA = '(max-width: 47.99rem) and (orientation: portrait), (max-width: 35.99rem)';
const ESCALA_RELLENO = [
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

interface Paso {
  antetitulo: string;
  texto: string;
  nota?: string;
  tabla?: boolean;
}

interface FilaTabla {
  c: number;
  n: string;
  valor: string;
  focos: string;
  muestra: string;
}

interface Tipografia {
  etiqueta: number;
  cifra: number;
}

function casi(total: number): string {
  const miles = Math.ceil(total / 1000);
  return miles * 1000 === total ? `${miles} mil` : `casi ${miles} mil`;
}

@Component({
  selector: 'app-cohorte',
  imports: [MapaJovenes, Boton],
  templateUrl: './cohorte.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Cohorte {
  private readonly datosServicio = inject(DataService);
  private readonly mapaServicio = inject(MapaService);
  private readonly dialogo = inject(Dialog);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly reducido = inject(MovimientoReducido).activo;

  private readonly refTarjetas = viewChildren<ElementRef<HTMLElement>>('tarjeta');
  private readonly tarjetas = computed(() => this.refTarjetas().map((t) => t.nativeElement), {
    equal: (a, b) => a.length === b.length && a.every((el, i) => el === b[i]),
  });
  private readonly refPanel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly panel = computed(() => this.refPanel()?.nativeElement);
  private readonly figura = viewChild<ElementRef<HTMLElement>>('figura');
  private readonly refGrafica = viewChild<ElementRef<HTMLElement>>('grafica');
  private readonly grafica = computed(() => this.refGrafica()?.nativeElement);
  private readonly mapa = viewChild(MapaJovenes);
  private readonly plantillaTabla = viewChild.required<TemplateRef<unknown>>('tabla');

  protected readonly t = signal(0);
  protected readonly geo = this.mapaServicio.estados;
  private readonly medidas = signal<Medidas | null>(null);
  protected readonly tipografia = signal<Tipografia>({ etiqueta: 0, cifra: 0 });
  private colores: { encendido: Rgb; apagado: Rgb } = { encendido: [0, 0, 0], apagado: [0, 0, 0] };
  private montando = false;
  private programado = false;
  private tPendiente = 0;

  private readonly curvas: Curvas = {
    escena: funcionCurva('escena'),
    entrada: funcionCurva('entrada'),
    apagado: funcionCurva('apagado'),
  };

  protected readonly datos = computed<DatosActo | null>(() => {
    const cohortes = this.datosServicio.cohortes.valor();
    const nacional = this.datosServicio.nacional.valor();
    const estados = this.datosServicio.estados.valor();
    const focos = this.datosServicio.focos.valor();
    const meta = this.datosServicio.meta.valor();
    return cohortes && nacional && estados && focos && meta
      ? extraerDatos(cohortes, nacional, estados, focos, meta)
      : null;
  });

  protected readonly vista = computed<Vista | null>(() => {
    const datos = this.datos();
    const medidas = this.medidas();
    return datos && medidas ? vista(datos, this.t(), medidas, this.curvas) : null;
  });

  protected readonly medida = computed(() => this.medidas());

  protected readonly activo = computed(() => Math.round(this.t()));

  protected readonly mapaActivo = computed(() => this.t() > PASO_MAPA - 0.5);

  protected readonly pasos = computed<Paso[]>(() => {
    const d = this.datos();
    if (!d) {
      return [];
    }
    const [c18, c24] = d.corta;
    const [l18, l24, l30] = d.larga;
    const [k50] = d.contraste;
    const g = d.genero;
    const { min, max } = d.extremos;
    return [
      {
        antetitulo: `${c18.anio} · Primera elección`,
        texto: `Ana y Luis cumplieron ${c18.edad} en ${c18.anio}. Era su primera elección.`,
      },
      {
        antetitulo: `${c18.anio} · ${c18.edad} años`,
        texto: `Ese año votó el ${porcentaje(c18.valor)} de quienes tenían ${c18.edad}, como ellos.`,
      },
      {
        antetitulo: `${c24.anio} · ${c24.edad} años`,
        texto: `Seis años después, su generación perdió ${puntos(c18.valor - c24.valor)} puntos. A los ${c24.edad} votó el ${porcentaje(c24.valor)}.`,
      },
      {
        antetitulo: `Generación ${l18.anio}`,
        texto: `La generación de ${l18.anio} votó ${porcentaje(l18.valor)} a los ${l18.edad}, ${porcentaje(l24.valor)} a los ${l24.edad} y ${porcentaje(l30.valor)} a los ${l30.edad}. Nunca se recuperó.`,
      },
      {
        antetitulo: `${k50.anio} · ${k50.edad} años`,
        texto: `La generación que tenía ${k50.edad} en ${k50.anio} no cambió. No es la edad: es lo que pasa en esta etapa de la vida.`,
      },
      {
        antetitulo: `${g.anio} · ${g.desde} a ${g.hasta} años`,
        texto: `Entre los ${g.desde} y los ${g.hasta} años votó el ${porcentaje(g.m)} de las mujeres y el ${porcentaje(g.h)} de los hombres. La luz de Luis se apaga más que la de Ana.`,
      },
      {
        antetitulo: `${g.anio} · Por estado`,
        texto: `Entre los 18 y los 24 años, votar cambia mucho según el estado: de ${porcentaje(min.jovenes_18_24['2024']!)} en ${min.n} a ${porcentaje(max.jovenes_18_24['2024']!)} en ${max.n}.`,
        tabla: true,
      },
      {
        antetitulo: 'Focos encendidos',
        texto: `Pero hay ${casi(d.focos.total)} secciones donde los jóvenes sí votan.`,
        nota: `${miles(d.focos.total)} secciones donde votó ${miles(d.focos.umbral)}% o más de las personas de 18 a 29 años.`,
        tabla: true,
      },
    ];
  });

  protected readonly descripcion = computed(() => {
    const d = this.datos();
    if (!d) {
      return '';
    }
    const [c18, c24] = d.corta;
    const [l18, l24, l30] = d.larga;
    const [k50, k56] = d.contraste;
    const g = d.genero;
    const { min, max } = d.extremos;
    const textos = [
      `Dos luces encendidas: Ana y Luis, que cumplieron ${c18.edad} años en ${c18.anio}.`,
      `Gráfica: a los ${c18.edad} años, en ${c18.anio}, votó ${porcentaje(c18.valor)} de su generación.`,
      `Gráfica: a los ${c24.edad} años, en ${c24.anio}, la misma generación votó ${porcentaje(c24.valor)}, ${puntos(c18.valor - c24.valor)} puntos menos.`,
      `Gráfica: la generación de ${l18.anio} votó ${porcentaje(l18.valor)} a los ${l18.edad}, ${porcentaje(l24.valor)} a los ${l24.edad} y ${porcentaje(l30.valor)} a los ${l30.edad}.`,
      `Gráfica: quienes tenían ${k50.edad} años en ${k50.anio} votaron ${porcentaje(k50.valor)}, y ${porcentaje(k56.valor)} a los ${k56.edad} en ${k56.anio}.`,
      `Gráfica: de ${g.desde} a ${g.hasta} años, en ${g.anio}, votó ${porcentaje(g.m)} de las mujeres y ${porcentaje(g.h)} de los hombres, ${puntos(g.m - g.h)} puntos de diferencia.`,
      `Mapa de México: participación de jóvenes de 18 a 24 años en ${g.anio}, de ${porcentaje(min.jovenes_18_24['2024']!)} en ${min.n} a ${porcentaje(max.jovenes_18_24['2024']!)} en ${max.n}.`,
      `Mapa de México con ${miles(d.puntosFocos)} puntos de luz. Cada punto representa ${FOCOS_POR_PUNTO} de las ${miles(d.focos.total)} secciones donde los jóvenes votaron ${miles(d.focos.umbral)}% o más. La ubicación dentro de cada estado es aproximada.`,
    ];
    return textos[Math.min(this.activo(), textos.length - 1)];
  });

  protected readonly filasTabla = computed<FilaTabla[]>(() => {
    const d = this.datos();
    if (!d) {
      return [];
    }
    const valor = (n: number | null) => n ?? -1;
    const { min, max } = d.extremos;
    const bajo = min.jovenes_18_24['2024']!;
    const alto = max.jovenes_18_24['2024']!;
    const paso = (alto - bajo) / ESCALA_RELLENO.length;
    return [...d.estados]
      .sort((a, b) => valor(b.jovenes_18_24['2024']) - valor(a.jovenes_18_24['2024']))
      .map((e) => {
        const v = e.jovenes_18_24['2024'];
        const indice =
          v === null
            ? 0
            : Math.min(ESCALA_RELLENO.length - 1, Math.floor((v - bajo) / (paso || 1)));
        return {
          c: e.c,
          n: e.n,
          valor: v === null ? 'Sin dato' : porcentaje(v),
          focos: miles(e.focos),
          muestra: ESCALA_RELLENO[indice],
        };
      });
  });

  protected readonly textoTabla = computed(() => {
    const d = this.datos();
    const n = this.filasTabla().length;
    const anio = d ? String(d.genero.anio) : '';
    return {
      anio,
      caption: `${n} estados ordenados de mayor a menor participación de jóvenes de 18 a 24 años en ${anio}, con sus focos.`,
      pie: d
        ? `Focos: secciones donde votó ${miles(d.focos.umbral)}% o más de las personas de 18 a 29 años. Fuente: ${d.fuente}.`
        : '',
    };
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    for (const archivo of [
      this.datosServicio.cohortes,
      this.datosServicio.nacional,
      this.datosServicio.estados,
      this.datosServicio.focos,
      this.datosServicio.meta,
    ]) {
      archivo.cargar().catch(() => undefined);
    }
    this.mapaServicio.cargar().catch(() => undefined);

    afterNextRender(() => {
      let altoPrevio = document.body.scrollHeight;
      let pendiente = false;
      const refrescar = () => {
        pendiente = false;
        ScrollTrigger.refresh();
      };
      const alTerminar = () => {
        if (pendiente) {
          refrescar();
        }
      };
      const observador = new ResizeObserver(() => {
        const alto = document.body.scrollHeight;
        if (Math.abs(alto - altoPrevio) < 1) {
          return;
        }
        altoPrevio = alto;
        pendiente = true;
        if (!ScrollTrigger.isScrolling()) {
          refrescar();
        }
      });
      observador.observe(document.body);
      ScrollTrigger.addEventListener('scrollEnd', alTerminar);
      destroyRef.onDestroy(() => {
        observador.disconnect();
        ScrollTrigger.removeEventListener('scrollEnd', alTerminar);
      });
    });

    afterRenderEffect((alLimpiar) => {
      const grafica = this.grafica();
      if (!grafica) {
        return;
      }
      untracked(() => this.leerEstilos(grafica));
      let anchoPrevio = 0;
      let altoPrevio = 0;
      const observador = new ResizeObserver(([entrada]) => {
        const { width, height } = entrada.contentRect;
        if (Math.abs(width - anchoPrevio) < 1 && Math.abs(height - altoPrevio) < 1) {
          return;
        }
        anchoPrevio = width;
        altoPrevio = height;
        this.medir(width, height);
      });
      observador.observe(grafica);
      alLimpiar(() => observador.disconnect());
    });

    afterRenderEffect((alLimpiar) => {
      const datos = this.datos();
      const reducido = this.reducido();
      const tarjetas = this.tarjetas();
      const panel = this.panel();
      if (!datos || !panel || tarjetas.length < PASOS) {
        return;
      }
      const medios = untracked(() => this.montar(reducido, tarjetas, panel));
      alLimpiar(() => medios.revert());
    });
  }

  private montar(reducido: boolean, tarjetas: HTMLElement[], panel: HTMLElement): gsap.MatchMedia {
    this.montando = true;
    const hueco = pxToken('--space-4');
    const medios = gsap.matchMedia();
    medios.add({ lado: CONSULTA_LADO, pila: CONSULTA_PILA }, (contexto) => {
      const lado = !!contexto.conditions?.['lado'];
      const fin = lado
        ? 'center center'
        : () => `top ${panel.getBoundingClientRect().height + hueco}px`;
      if (reducido) {
        tarjetas.slice(1).forEach((tarjeta, i) => {
          ScrollTrigger.create({
            trigger: tarjeta,
            start: fin,
            onEnter: () => this.irA(i + 1),
            onLeaveBack: () => this.irA(i),
          });
        });
        return;
      }
      const progresos = new Array<number>(PASOS - 1).fill(0);
      tarjetas.slice(1).forEach((tarjeta, i) => {
        const actualizar = (disparador: ScrollTrigger) => {
          progresos[i] = disparador.progress;
          this.fijarT(progresos.reduce((a, b) => a + b, 0));
        };
        ScrollTrigger.create({
          trigger: tarjeta,
          start: 'top bottom',
          end: fin,
          scrub: true,
          onUpdate: actualizar,
          onRefresh: actualizar,
        });
      });
    });
    ScrollTrigger.refresh();
    this.montando = false;
    this.pintarFocos();
    return medios;
  }

  protected abrirTabla(): void {
    this.dialogo.open(this.plantillaTabla(), {
      ariaLabelledBy: 'tabla-jovenes-titulo',
      backdropClass: ['bg-fondo/80'],
      panelClass: ['flex', 'justify-center'],
      restoreFocus: true,
      autoFocus: 'first-heading',
    });
  }

  protected color(persona: Persona): string {
    return aCss(mezclar(this.colores.apagado, this.colores.encendido, persona.brillo));
  }

  protected yCifra(e: Etiqueta): number {
    const { etiqueta, cifra } = this.tipografia();
    const sep = this.medidas()?.sep ?? 0;
    if (e.dy < 0) {
      return e.y - sep * 2 - etiqueta * 1.3;
    }
    if (e.dy > 0) {
      return e.y + sep * 2 + cifra * 0.8;
    }
    return e.y + cifra * 0.35;
  }

  protected yTexto(e: Etiqueta): number {
    const { etiqueta, cifra } = this.tipografia();
    const sep = this.medidas()?.sep ?? 0;
    if (e.dy < 0) {
      return e.y - sep * 2;
    }
    if (e.dy > 0) {
      return e.y + sep * 2 + cifra * 0.8 + etiqueta * 1.3;
    }
    return e.y + cifra * 0.35;
  }

  private medir(ancho: number, alto: number): void {
    const sep = pxToken('--space-2');
    this.medidas.set({
      ancho,
      alto,
      izq: pxToken('--space-8'),
      der: pxToken('--space-4'),
      arr: pxToken('--space-16'),
      aba: pxToken('--space-10'),
      sep,
      punto: pxToken('--space-1'),
      persona: pxToken('--space-1') * 1.5,
      hueco: pxToken('--space-3'),
    });
  }

  private leerEstilos(elemento: HTMLElement): void {
    this.colores = {
      encendido: rgbToken('--color-foco-encendido', elemento),
      apagado: rgbToken('--color-foco-apagado', elemento),
    };
    const tamano = (clase: string) => {
      const prueba = document.createElement('span');
      prueba.className = clase;
      prueba.style.position = 'absolute';
      prueba.style.visibility = 'hidden';
      prueba.textContent = '0';
      elemento.appendChild(prueba);
      const px = parseFloat(getComputedStyle(prueba).fontSize);
      prueba.remove();
      return px;
    };
    this.tipografia.set({ etiqueta: tamano('text-etiqueta'), cifra: tamano('text-titulo-3') });
  }

  private fijarT(valor: number): void {
    this.tPendiente = valor;
    if (this.programado) {
      return;
    }
    this.programado = true;
    queueMicrotask(() => {
      this.programado = false;
      if (Math.abs(this.tPendiente - this.t()) < 1e-4) {
        return;
      }
      this.t.set(this.tPendiente);
      if (!this.montando) {
        this.cdr.detectChanges();
      }
      this.pintarFocos();
    });
  }

  private irA(paso: number): void {
    this.t.set(paso);
    if (!this.montando) {
      this.cdr.detectChanges();
    }
    this.pintarFocos();
    const figura = this.figura()?.nativeElement;
    const entrada = curvas.find((c) => c.nombre === 'entrada')?.css ?? 'linear';
    figura?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: duracion('corta') * 1000,
      easing: entrada,
    });
  }

  private pintarFocos(): void {
    const v = this.vista();
    if (!v) {
      return;
    }
    const progreso = this.reducido() ? (this.t() >= PASO_FOCOS ? 1 : 0) : v.mapa.focos;
    this.mapa()?.pintarFocos(progreso);
  }
}

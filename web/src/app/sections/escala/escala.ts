import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DataService } from '../../core/data.service';
import { MapaService } from '../../core/mapa.service';
import { ScrollTrigger, curva, duracion, funcionCurva, gsap } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { CONSULTA_LADO, CONSULTA_PILA, Recorrido, consultaMedia, desplazarA } from '../../core/recorrido';
import { pxToken } from '../../core/tokens';
import { CampoEscala, EstadoCampo } from './campo-escala';
import { resumirEscala } from './resumen';

const SEMILLA = 37;

type Aplicar = (paso: number, instantaneo: boolean) => void;

@Component({
  selector: 'app-escala',
  templateUrl: './escala.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Escala {
  private readonly datos = inject(DataService);
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly mapa = inject(MapaService);
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private readonly tarjetas = viewChildren<ElementRef<HTMLElement>>('tarjeta');
  private readonly titulo = viewChild<ElementRef<HTMLElement>>('titulo');
  private readonly pila = consultaMedia(CONSULTA_PILA);
  private readonly recorrido = inject(Recorrido);

  protected readonly resumen = computed(() => {
    const nacional = this.datos.nacional.valor();
    return nacional ? resumirEscala(nacional) : null;
  });

  private readonly pasoScroll = signal(-1);
  protected readonly objetivo = signal(-1);
  protected readonly pasoActivo = computed(() => (this.pila() ? this.objetivo() : this.pasoScroll()));

  protected readonly descripcionCampo = computed(() => {
    const r = this.resumen();
    return r
      ? `${r.total} puntos. ${r.apagadas} representan a quienes no votaron en ${r.anio}; ${r.jovenes} de ellos tienen entre 18 y 29 años.`
      : '';
  });

  private aplicar: Aplicar | null = null;

  constructor() {
    this.datos.nacional.cargar().catch(() => undefined);
    this.mapa.cargar().catch(() => undefined);

    this.recorrido.registrar('escala', {
      total: computed(() => this.resumen()?.pasos.length ?? 2),
      ir: (paso, instantaneo) => {
        this.objetivo.set(paso);
        this.aplicar?.(paso, instantaneo);
      },
      texto: (paso) => this.resumen()?.pasos[paso]?.texto ?? '',
      titulo: () => this.titulo()?.nativeElement,
    });

    afterRenderEffect((alLimpiar) => {
      const resumen = this.resumen();
      const reducido = this.reducido();
      const estados = this.mapa.estados();
      const tarjetas = this.tarjetas().map((t) => t.nativeElement);
      if (!resumen || !estados || tarjetas.length < 2) {
        return;
      }
      const lienzo = this.lienzo().nativeElement;
      const campo = new CampoEscala(lienzo, {
        total: resumen.total,
        apagadas: resumen.apagadas,
        jovenes: resumen.jovenes,
        semilla: SEMILLA,
        estados,
        margen: pxToken('--space-2'),
        curvaApagado: funcionCurva('apagado'),
        curvaJovenes: funcionCurva('entrada'),
      });
      const estado: EstadoCampo = { apagado: 0, jovenes: 0, uniforme: reducido };
      const pintar = () => campo.fijar({ ...estado });
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

      const medios = gsap.matchMedia();
      medios.add({ lado: CONSULTA_LADO, pila: CONSULTA_PILA }, (contexto) => {
        if (contexto.conditions?.['pila']) {
          this.aplicar = (paso, instantaneo) => {
            const destino = { apagado: paso >= 0 ? 1 : 0, jovenes: paso >= 1 ? 1 : 0 };
            if (instantaneo) {
              gsap.killTweensOf(estado);
              Object.assign(estado, destino);
              pintar();
              return;
            }
            gsap.to(estado, {
              ...destino,
              duration: reducido ? duracion('corta') : duracion('encendido'),
              ease: reducido ? curva('entrada') : 'none',
              overwrite: true,
              onUpdate: pintar,
            });
          };
          return;
        }
        const posiciones: (() => number)[] = [];
        tarjetas.forEach((tarjeta, i) => {
          ScrollTrigger.create({
            trigger: tarjeta,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => this.pasoScroll.set(i),
            onEnterBack: () => this.pasoScroll.set(i),
            onLeaveBack: () => this.pasoScroll.set(i - 1),
          });
        });
        const claves: (keyof Pick<EstadoCampo, 'apagado' | 'jovenes'>)[] = ['apagado', 'jovenes'];
        claves.forEach((clave, i) => {
          if (reducido) {
            const fundir = (valor: number) =>
              gsap.to(estado, {
                [clave]: valor,
                duration: duracion('corta'),
                ease: curva('entrada'),
                overwrite: true,
                onUpdate: pintar,
              });
            const disparador = ScrollTrigger.create({
              trigger: tarjetas[i],
              start: 'top center',
              onEnter: () => fundir(1),
              onLeaveBack: () => fundir(0),
            });
            posiciones.push(() => disparador.start + 1);
            return;
          }
          const disparador = ScrollTrigger.create({
            trigger: tarjetas[i],
            start: 'top bottom',
            end: 'center center',
            scrub: true,
            onUpdate: (d) => {
              estado[clave] = d.progress;
              pintar();
            },
          });
          posiciones.push(() => disparador.end);
        });
        this.aplicar = (paso, instantaneo) => {
          if (paso < 0) {
            return;
          }
          const posicion = posiciones[Math.min(paso, posiciones.length - 1)];
          desplazarA(posicion(), instantaneo || reducido);
        };
      });
      ScrollTrigger.refresh();
      untracked(() => {
        if (this.recorrido.id() === 'escala' || this.pila()) {
          this.aplicar?.(this.objetivo(), true);
        }
      });
      pintar();

      alLimpiar(() => {
        medios.revert();
        gsap.killTweensOf(estado);
        this.aplicar = null;
        observador.disconnect();
        campo.destruir();
      });
    });
  }
}

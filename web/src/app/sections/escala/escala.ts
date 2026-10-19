import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { DataService } from '../../core/data.service';
import { MapaService } from '../../core/mapa.service';
import { ScrollTrigger, curva, duracion, funcionCurva, gsap } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { pxToken } from '../../core/tokens';
import { CampoEscala, EstadoCampo } from './campo-escala';
import { resumirEscala } from './resumen';

const SEMILLA = 37;

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

  protected readonly resumen = computed(() => {
    const nacional = this.datos.nacional.valor();
    return nacional ? resumirEscala(nacional) : null;
  });

  protected readonly pasoActivo = signal(-1);

  protected readonly descripcionCampo = computed(() => {
    const r = this.resumen();
    return r
      ? `${r.total} puntos. ${r.apagadas} representan a quienes no votaron en ${r.anio}; ${r.jovenes} de ellos tienen entre 18 y 29 años.`
      : '';
  });

  constructor() {
    this.datos.nacional.cargar().catch(() => undefined);
    this.mapa.cargar().catch(() => undefined);

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
      const observador = new ResizeObserver(() => campo.medir());
      observador.observe(lienzo);

      const contexto = gsap.context(() => {
        tarjetas.forEach((tarjeta, i) => {
          ScrollTrigger.create({
            trigger: tarjeta,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => this.pasoActivo.set(i),
            onEnterBack: () => this.pasoActivo.set(i),
            onLeaveBack: () => this.pasoActivo.set(i - 1),
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
            ScrollTrigger.create({
              trigger: tarjetas[i],
              start: 'top center',
              onEnter: () => fundir(1),
              onLeaveBack: () => fundir(0),
            });
            return;
          }
          ScrollTrigger.create({
            trigger: tarjetas[i],
            start: 'top bottom',
            end: 'center center',
            scrub: true,
            onUpdate: (disparador) => {
              estado[clave] = disparador.progress;
              pintar();
            },
          });
        });
      });
      ScrollTrigger.refresh();
      pintar();

      alLimpiar(() => {
        contexto.revert();
        observador.disconnect();
        campo.destruir();
      });
    });
  }

  enfocar(): void {
    this.titulo()?.nativeElement.focus({ preventScroll: true });
  }
}

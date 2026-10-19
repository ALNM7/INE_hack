import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { MapaService } from '../../core/mapa.service';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { MediaHero } from './media-hero';
import { posterHero } from './poster';

@Component({
  selector: 'app-fondo-luces',
  template: `
    <video
      #video
      class="block size-full object-contain"
      [class.object-top]="arriba()"
      [class.lg:object-center]="arriba()"
      [attr.poster]="poster()"
      muted
      loop
      playsinline
      disablepictureinpicture
      preload="metadata"
      [autoplay]="!reducido()"
      aria-hidden="true"
      tabindex="-1"
    >
      @for (fuente of fuentes(); track fuente.src) {
        <source [src]="fuente.src" [type]="fuente.tipo" />
      }
    </video>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block overflow-hidden bg-fondo',
  },
})
export class FondoLuces {
  readonly arriba = input(false);
  private readonly mapa = inject(MapaService);
  protected readonly poster = computed(() => {
    const estados = this.mapa.estados();
    return estados ? posterHero(estados) : null;
  });
  protected readonly reducido = inject(MovimientoReducido).activo;
  protected readonly fuentes = inject(MediaHero).fuentes;
  private fuentesCargadas = 0;
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    this.mapa.cargar().catch(() => undefined);
    afterRenderEffect(() => {
      const video = this.video().nativeElement;
      const cuantas = this.fuentes().length;
      video.muted = true;
      if (cuantas !== this.fuentesCargadas) {
        this.fuentesCargadas = cuantas;
        video.load();
      }
      if (this.reducido()) {
        video.pause();
        return;
      }
      if (cuantas > 0 && video.paused) {
        video.play().catch(() => undefined);
      }
    });
  }
}

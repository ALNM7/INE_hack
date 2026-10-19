import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { MediaHero } from './media-hero';

@Component({
  selector: 'app-fondo-luces',
  template: `
    <video
      #video
      class="block size-full object-cover"
      [attr.poster]="poster()"
      muted
      loop
      playsinline
      disablepictureinpicture
      preload="auto"
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
  private readonly media = inject(MediaHero);
  protected readonly poster = this.media.poster;
  protected readonly reducido = inject(MovimientoReducido).activo;
  protected readonly fuentes = computed(() => (this.reducido() ? [] : this.media.fuentes()));
  private fuentesCargadas = 0;
  private readonly video = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  constructor() {
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

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const TRAZOS = {
  lapiz: [
    'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    'm15 5 4 4',
  ],
  reiniciar: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
  abajo: ['M12 5v14', 'm19 12-7 7-7-7'],
  descargar: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5', 'M12 15V3'],
  compartir: [
    'M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    'M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    'M21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
    'm8.59 13.51 6.83 3.98',
    'm15.41 6.51-6.82 3.98',
  ],
  info: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', 'M12 16v-4', 'M12 8h.01'],
  alerta: ['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', 'M12 8v4', 'M12 16h.01'],
  menos: ['M5 12h14'],
  mas: ['M5 12h14', 'M12 5v14'],
  desplegar: ['m6 9 6 6 6-6'],
  buscar: ['M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0', 'm21 21-4.3-4.3'],
  cerrar: ['M18 6 6 18', 'm6 6 12 12'],
  derecha: ['M5 12h14', 'm12 5 7 7-7 7'],
} as const;

export type NombreIcono = keyof typeof TRAZOS;

@Component({
  selector: 'app-icono',
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="size-full" aria-hidden="true" focusable="false">
      @for (d of trazos(); track d) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'inline-block shrink-0' },
})
export class Icono {
  readonly nombre = input.required<NombreIcono>();

  protected readonly trazos = computed(() => TRAZOS[this.nombre()]);
}

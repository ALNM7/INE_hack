import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const TRAZOS = {
  lapiz: [
    'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    'm15 5 4 4',
  ],
  reiniciar: ['M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8', 'M3 3v5h5'],
  abajo: ['M12 5v14', 'm19 12-7 7-7-7'],
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

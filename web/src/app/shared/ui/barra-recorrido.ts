import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Recorrido } from '../../core/recorrido';
import { Boton } from './boton';
import { Icono } from './icono';

@Component({
  selector: 'app-barra-recorrido',
  imports: [Boton, Icono],
  template: `
    <nav
      aria-label="Recorrido de la historia"
      class="mx-auto flex h-full max-w-(--container-max) items-center justify-between gap-3 px-margen-movil md:px-margen-escritorio"
    >
      <button appBoton variante="secundario" type="button" class="min-w-0 px-4 disabled:opacity-40" [disabled]="recorrido.cambiando()" (click)="recorrido.anterior()">
        <app-icono nombre="derecha" class="size-5 rotate-180" />
        <span class="sr-only lado:not-sr-only">Anterior</span>
      </button>
      <p class="flex min-w-0 flex-col items-center text-center font-mono text-etiqueta font-medio text-texto-2 uppercase tabular lado:flex-row lado:gap-2">
        <span>{{ recorrido.nombre() }}</span>
        @if (recorrido.total() > 1) {
          <span aria-hidden="true" class="hidden lado:inline">·</span>
          <span>{{ recorrido.paso() + 1 }}/{{ recorrido.total() }}</span>
        }
      </p>
      @if (!recorrido.esUltimo()) {
        @if (recorrido.listo()) {
          <button appBoton type="button" class="disabled:opacity-60" [disabled]="recorrido.cambiando()" (click)="recorrido.siguiente()">
            Siguiente
            <app-icono nombre="derecha" class="size-5" />
          </button>
        } @else {
          <button appBoton variante="secundario" type="button" class="disabled:opacity-60" [disabled]="recorrido.cambiando()" (click)="recorrido.siguiente()">
            Saltar
            <app-icono nombre="derecha" class="size-5" />
          </button>
        }
      } @else {
        <span class="w-12 shrink-0" aria-hidden="true"></span>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'fixed inset-x-0 bottom-0 z-40 block h-(--alto-barra) border-t border-linea bg-fondo pb-[env(safe-area-inset-bottom,0px)] text-texto select-none',
  },
})
export class BarraRecorrido {
  protected readonly recorrido = inject(Recorrido);
}

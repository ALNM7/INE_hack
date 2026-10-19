import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-marcador-seccion',
  template: `
    <div class="mx-auto flex max-w-(--container-max) items-center gap-3 border-t border-linea px-margen-movil py-10 md:px-margen-escritorio">
      <span class="size-2 shrink-0 rounded-full bg-foco-apagado" aria-hidden="true"></span>
      <p class="font-mono text-antetitulo font-medio uppercase text-texto-3">{{ nombre() }} · en preparación</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.id]': 'ancla()',
    '[attr.aria-label]': 'nombre()',
    role: 'region',
  },
})
export class MarcadorSeccion {
  readonly nombre = input.required<string>();
  readonly ancla = input.required<string>();
}

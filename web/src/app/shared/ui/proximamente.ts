import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Boton } from './boton';

@Component({
  selector: 'app-proximamente',
  imports: [RouterLink, Boton],
  template: `
    <main class="flex min-h-svh flex-col justify-center bg-fondo px-margen-movil pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-texto md:px-margen-escritorio">
      <div class="mx-auto flex w-full max-w-(--container-texto) flex-col gap-6">
        <p class="flex items-center gap-2 font-mono text-antetitulo font-medio uppercase text-texto-3">
          <span class="size-2 rounded-full bg-foco-apagado" aria-hidden="true"></span>
          En preparación
        </p>
        <h1 class="text-titulo-1">{{ titulo() }}</h1>
        <p class="text-entrada text-texto-2">{{ descripcion() }}</p>
        <div>
          <a appBoton variante="texto" routerLink="/">Volver al inicio</a>
        </div>
      </div>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Proximamente {
  readonly titulo = input.required<string>();
  readonly descripcion = input.required<string>();
}

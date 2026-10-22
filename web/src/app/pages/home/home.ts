import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Cohorte } from '../../sections/cohorte/cohorte';
import { Dibujalo } from '../../sections/dibujalo/dibujalo';
import { Escala } from '../../sections/escala/escala';
import { Hero } from '../../sections/hero/hero';
import { Wrapped } from '../../sections/wrapped/wrapped';

@Component({
  selector: 'app-home',
  imports: [Hero, Escala, Dibujalo, Cohorte, Wrapped],
  template: `
    <main class="bg-fondo text-texto">
      <app-hero (empezar)="empezar()" />
      <app-escala />
      <app-dibujalo />
      <app-cohorte />
      <app-wrapped />
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly reducido = inject(MovimientoReducido).activo;
  private readonly escala = viewChild.required(Escala);

  protected empezar(): void {
    document.getElementById('escala')?.scrollIntoView({ behavior: this.reducido() ? 'auto' : 'smooth', block: 'start' });
    this.escala().enfocar();
  }
}

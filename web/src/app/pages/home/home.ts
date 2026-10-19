import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Dibujalo } from '../../sections/dibujalo/dibujalo';
import { Escala } from '../../sections/escala/escala';
import { Hero } from '../../sections/hero/hero';
import { MarcadorSeccion } from '../../shared/ui/marcador-seccion';

@Component({
  selector: 'app-home',
  imports: [Hero, Escala, Dibujalo, MarcadorSeccion],
  template: `
    <main class="bg-fondo text-texto">
      <app-hero (empezar)="empezar()" />
      <app-escala />
      <app-dibujalo />
      <app-marcador-seccion nombre="Acto 2 · Lo que se apagó" ancla="cohorte" />
      <app-marcador-seccion nombre="Acto 3 · Tu Wrapped" ancla="wrapped" />
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

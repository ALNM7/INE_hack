import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Cohorte } from '../../sections/cohorte/cohorte';
import { Dibujalo } from '../../sections/dibujalo/dibujalo';
import { Escala } from '../../sections/escala/escala';
import { Hero } from '../../sections/hero/hero';
import { BarraProgreso } from '../../shared/ui/barra-progreso';
import { MarcadorSeccion } from '../../shared/ui/marcador-seccion';

@Component({
  selector: 'app-home',
  imports: [Hero, Escala, Dibujalo, Cohorte, MarcadorSeccion, BarraProgreso],
  template: `
    <app-barra-progreso />
    <main class="bg-fondo text-texto">
      <app-hero (empezar)="empezar()" />
      <app-escala />
      <app-dibujalo />
      <app-cohorte />
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

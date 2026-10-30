import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IdActo, ORDEN, Recorrido } from '../../core/recorrido';
import { Cohorte } from '../../sections/cohorte/cohorte';
import { Dibujalo } from '../../sections/dibujalo/dibujalo';
import { Escala } from '../../sections/escala/escala';
import { Hero } from '../../sections/hero/hero';
import { Wrapped } from '../../sections/wrapped/wrapped';
import { BarraRecorrido } from '../../shared/ui/barra-recorrido';

const ATAJOS: Record<string, IdActo> = { intro: 'escala', '1': 'dibujalo', '2': 'cohorte', '3': 'wrapped' };

@Component({
  selector: 'app-home',
  imports: [Hero, Escala, Dibujalo, Cohorte, Wrapped, BarraRecorrido],
  template: `
    <main class="bg-fondo text-texto">
      <div [hidden]="id() !== 'hero'"><app-hero (empezar)="recorrido.siguiente()" /></div>
      <div [hidden]="id() !== 'escala'"><app-escala /></div>
      <div [hidden]="id() !== 'dibujalo'"><app-dibujalo /></div>
      <div [hidden]="id() !== 'cohorte'"><app-cohorte /></div>
      <div [hidden]="id() !== 'wrapped'" class="pb-(--alto-barra)"><app-wrapped /></div>
    </main>
    @if (id() !== 'hero') {
      <app-barra-recorrido />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly recorrido = inject(Recorrido);
  protected readonly id = this.recorrido.id;

  constructor() {
    this.recorrido.reiniciar();
    const raiz = inject(DOCUMENT).documentElement;
    effect(() => {
      raiz.toggleAttribute('data-recorrido-fijo', !this.recorrido.conScroll());
    });
    inject(DestroyRef).onDestroy(() => raiz.removeAttribute('data-recorrido-fijo'));

    const inicio = ATAJOS[inject(ActivatedRoute).snapshot.queryParamMap.get('acto') ?? ''];
    if (inicio && ORDEN.includes(inicio)) {
      setTimeout(() => this.recorrido.iniciarEn(inicio));
    }
  }
}

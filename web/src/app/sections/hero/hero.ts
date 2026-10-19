import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { SelectorVariantes } from '../../shared/ui/selector-variantes';
import { HeroHorizonte } from './hero-horizonte';
import { HeroRecorte } from './hero-recorte';
import { HeroTitular } from './hero-titular';

const VARIANTES = ['Horizonte', 'Titular', 'Recorte'] as const;

@Component({
  selector: 'app-hero',
  imports: [HeroHorizonte, HeroTitular, HeroRecorte, SelectorVariantes],
  template: `
    @for (clave of [montaje()]; track clave) {
      @switch (variante()) {
        @case (1) {
          <app-hero-titular (empezar)="empezar.emit()" />
        }
        @case (2) {
          <app-hero-recorte (empezar)="empezar.emit()" />
        }
        @default {
          <app-hero-horizonte (empezar)="empezar.emit()" />
        }
      }
    }
    @if (conSelector()) {
      <app-selector-variantes [nombres]="nombres" [activo]="variante()" (elegir)="elegir($event)" (repetir)="repetir()" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Hero {
  readonly empezar = output<void>();

  protected readonly nombres = VARIANTES;
  protected readonly montaje = signal(0);

  private readonly router = inject(Router);
  private readonly parametro = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((p) => p.get('v'))), {
    initialValue: null,
  });

  protected readonly conSelector = computed(() => this.parametro() !== null);

  protected readonly variante = computed(() => {
    const numero = parseInt(this.parametro() ?? '1', 10);
    return numero >= 1 && numero <= VARIANTES.length ? numero - 1 : 0;
  });

  protected elegir(indice: number): void {
    if (indice === this.variante()) {
      return;
    }
    this.router.navigate([], { queryParams: { v: indice + 1 }, queryParamsHandling: 'merge', replaceUrl: true });
  }

  protected repetir(): void {
    this.montaje.update((n) => n + 1);
  }
}

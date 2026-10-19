import { DestroyRef, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MovimientoReducido {
  private readonly consulta = matchMedia('(prefers-reduced-motion: reduce)');
  private readonly estado = signal(this.consulta.matches);

  readonly activo = this.estado.asReadonly();

  constructor() {
    const alCambiar = (evento: MediaQueryListEvent) => this.estado.set(evento.matches);
    this.consulta.addEventListener('change', alCambiar);
    inject(DestroyRef).onDestroy(() => this.consulta.removeEventListener('change', alCambiar));
  }
}

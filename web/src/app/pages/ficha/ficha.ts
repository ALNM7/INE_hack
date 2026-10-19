import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DataService } from '../../core/data.service';
import { Proximamente } from '../../shared/ui/proximamente';

@Component({
  selector: 'app-ficha',
  imports: [Proximamente],
  template: `<app-proximamente titulo="Ficha del municipio" [descripcion]="descripcion()" />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ficha {
  readonly edo = input.required<string>();
  readonly mpio = input.required<string>();

  private readonly catalogo = inject(DataService).catalogo;

  protected readonly descripcion = computed(() => {
    const estado = this.catalogo.valor()?.find((e) => e.c === Number(this.edo()));
    const municipio = estado?.m.find(([clave]) => clave === Number(this.mpio()));
    const lugar = estado && municipio ? `${municipio[1]}, ${estado.n}` : 'tu municipio';
    return `Aquí vivirá la ficha imprimible en hoja carta de ${lugar}, para pláticas en escuelas.`;
  });

  constructor() {
    this.catalogo.cargar().catch(() => undefined);
  }
}

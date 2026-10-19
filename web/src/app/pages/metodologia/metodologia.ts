import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Proximamente } from '../../shared/ui/proximamente';

@Component({
  selector: 'app-metodologia',
  imports: [Proximamente],
  template: `
    <app-proximamente
      titulo="Metodología"
      descripcion="Fuente, definiciones, supresión de datos y notas de captura de los Conteos Censales de Participación Ciudadana del INE."
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Metodologia {}

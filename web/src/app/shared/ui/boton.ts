import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type VarianteBoton = 'primario' | 'secundario' | 'texto';

const BASE =
  'inline-flex items-center justify-center gap-3 rounded-md border font-texto text-cuerpo font-negrita leading-none select-none ' +
  'transition-[background-color,color,border-color,transform] duracion-instante ease-entrada active:scale-[0.98] ' +
  '[-webkit-touch-callout:none]';

const VARIANTES: Record<VarianteBoton, string> = {
  primario: 'min-h-12 px-6 border-transparent bg-foco-encendido text-sobre-acento hover:bg-luz-suave',
  secundario: 'min-h-12 px-6 border-texto-3 bg-transparent text-texto hover:border-texto hover:bg-superficie-alta',
  texto: 'min-h-11 px-1 border-transparent text-acento-texto underline underline-offset-4 hover:text-texto',
};

@Component({
  selector: 'button[appBoton], a[appBoton]',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'clases()',
  },
})
export class Boton {
  readonly variante = input<VarianteBoton>('primario');

  protected readonly clases = computed(() => `${BASE} ${VARIANTES[this.variante()]}`);
}

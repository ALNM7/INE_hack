import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { duracion } from '../../core/motion';
import { unDecimal } from '../../core/formato';
import { Visual } from './tarjetas';

export type Tamano = 'compacto' | 'normal' | 'grande';

interface Medida {
  columnas: number;
  punto: string;
  separacion: string;
  porColumna?: boolean;
}

const REJILLAS: Record<'decimas' | 'comparacion' | 'secciones' | 'centenas', Record<Tamano, Medida>> = {
  decimas: {
    compacto: { columnas: 10, punto: 'var(--space-10)', separacion: 'var(--space-4)' },
    normal: { columnas: 5, punto: 'var(--space-24)', separacion: 'var(--space-10)' },
    grande: { columnas: 5, punto: 'var(--space-32)', separacion: 'var(--space-12)' },
  },
  comparacion: {
    compacto: { columnas: 25, punto: 'var(--space-5)', separacion: 'var(--space-2)', porColumna: true },
    normal: { columnas: 25, punto: 'var(--space-6)', separacion: 'var(--space-3)', porColumna: true },
    grande: { columnas: 10, punto: 'var(--space-12)', separacion: 'var(--space-6)' },
  },
  secciones: {
    compacto: { columnas: 10, punto: 'var(--space-4)', separacion: 'var(--space-2)' },
    normal: { columnas: 10, punto: 'var(--space-6)', separacion: 'var(--space-3)' },
    grande: { columnas: 10, punto: 'var(--space-8)', separacion: 'var(--space-2)' },
  },
  centenas: {
    compacto: { columnas: 10, punto: 'var(--space-6)', separacion: 'var(--space-3)' },
    normal: { columnas: 10, punto: 'var(--space-12)', separacion: 'var(--space-4)' },
    grande: { columnas: 10, punto: 'var(--space-16)', separacion: 'var(--space-5)' },
  },
};

const ALTO_BARRAS: Record<Tamano, number> = { compacto: 2, normal: 3, grande: 5 };
const ANILLO: Record<Tamano, number> = { compacto: 2, normal: 3, grande: 5 };

interface Punto {
  encendido: boolean;
  retraso: number;
}

interface Rejilla {
  medida: Medida;
  filas: number;
  puntos: Punto[];
}

@Component({
  selector: 'app-luces-wrapped',
  template: `
    @let v = visual();
    @switch (v.tipo) {
      @case ('decimas') {
        <ng-container [ngTemplateOutlet]="rejilla" [ngTemplateOutletContext]="{ $implicit: rejillas()[0] }" />
      }
      @case ('centenas') {
        <ng-container [ngTemplateOutlet]="rejilla" [ngTemplateOutletContext]="{ $implicit: rejillas()[0] }" />
      }
      @case ('comparacion') {
        <div class="flex flex-col gap-(--space-12)">
          @for (fila of v.filas; track fila.etiqueta; let i = $index) {
            <div class="flex flex-col gap-(--space-5)">
              <div class="flex items-baseline justify-between gap-(--space-6)">
                <span class="font-mono text-wrapped-etiqueta font-medio uppercase" [class.text-acento-texto]="fila.luz" [class.text-texto-2]="!fila.luz">{{ fila.etiqueta }}</span>
                <span class="font-titulo text-wrapped-titulo font-negrita ancho-titulo tabular" [class.text-acento-texto]="fila.luz" [class.text-texto]="!fila.luz">{{ decimal(fila.valor) }}%</span>
              </div>
              <ng-container [ngTemplateOutlet]="rejilla" [ngTemplateOutletContext]="{ $implicit: rejillas()[i] }" />
            </div>
          }
        </div>
      }
      @case ('secciones') {
        <div class="flex gap-(--space-16)">
          @for (lado of v.lados; track lado.etiqueta; let i = $index) {
            <div class="flex min-w-0 flex-1 flex-col gap-(--space-5)">
              <span class="font-mono text-wrapped-etiqueta font-medio uppercase" [class.text-acento-texto]="lado.luz" [class.text-texto-2]="!lado.luz">{{ lado.etiqueta }}</span>
              <span class="font-titulo text-wrapped-titulo font-negrita ancho-titulo tabular" [class.text-texto]="lado.luz" [class.text-texto-2]="!lado.luz">{{ decimal(lado.valor) }}%</span>
              <span class="font-mono text-wrapped-etiqueta text-texto-3 tabular">{{ lado.detalle }}</span>
              <ng-container [ngTemplateOutlet]="rejilla" [ngTemplateOutletContext]="{ $implicit: rejillas()[i] }" />
            </div>
          }
        </div>
      }
      @case ('barras') {
        <div class="flex flex-col gap-(--space-4)">
          <div class="flex items-end gap-(--space-4)" [style.height]="'calc(var(--space-32) * ' + altoBarras() + ')'">
            @for (b of v.barras; track b.etiqueta) {
              <div class="relative flex h-full min-w-0 flex-1 items-end">
                <div
                  class="w-full rounded-t-xs"
                  [class.bg-foco-encendido]="b.propia"
                  [class.shadow-halo]="b.propia"
                  [class.bg-foco-apagado]="!b.propia"
                  [style.height.%]="b.valor"
                ></div>
              </div>
            }
          </div>
          <div class="flex gap-(--space-4)">
            @for (b of v.barras; track b.etiqueta) {
              <span
                class="min-w-0 flex-1 text-center font-mono text-wrapped-etiqueta tabular"
                [class.text-acento-texto]="b.propia"
                [class.font-semi]="b.propia"
                [class.text-texto-3]="!b.propia"
              >{{ b.etiqueta }}</span>
            }
          </div>
        </div>
      }
      @case ('cierre') {
        <div class="flex items-center justify-center">
          <div
            class="flex items-center justify-center rounded-full bg-luz-halo/50"
            [style.width]="'calc(var(--space-32) * ' + anillo() + ')'"
            [style.height]="'calc(var(--space-32) * ' + anillo() + ')'"
          >
            <div class="flex size-[62%] items-center justify-center rounded-full bg-luz-halo">
              <div class="size-[40%] rounded-full bg-luz-suave shadow-halo"></div>
            </div>
          </div>
        </div>
      }
    }

    <ng-template #rejilla let-r>
      <div
        class="grid w-[max-content] max-w-full"
        [style.grid-template-columns]="'repeat(' + r.medida.columnas + ', ' + r.medida.punto + ')'"
        [style.grid-template-rows]="r.medida.porColumna ? 'repeat(' + r.filas + ', ' + r.medida.punto + ')' : null"
        [style.grid-auto-flow]="r.medida.porColumna ? 'column' : null"
        [style.gap]="r.medida.separacion"
      >
        @for (p of r.puntos; track $index) {
          @if (p.encendido) {
            <span
              [style.width]="r.medida.punto"
              [style.height]="r.medida.punto"
              class="block rounded-full bg-foco-encendido shadow-halo transition-[background-color,box-shadow] duracion-media ease-entrada starting:bg-foco-apagado starting:shadow-none motion-reduce:transition-none"
              [style.transition-delay.s]="p.retraso"
            ></span>
          } @else {
            <span class="block rounded-full bg-foco-apagado" [style.width]="r.medida.punto" [style.height]="r.medida.punto"></span>
          }
        }
      </div>
    </ng-template>
  `,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class LucesWrapped {
  readonly visual = input.required<Visual>();
  readonly tamano = input<Tamano>('normal');
  readonly inicio = input(0);
  readonly reducido = input(false);

  protected readonly decimal = unDecimal;
  protected readonly altoBarras = computed(() => ALTO_BARRAS[this.tamano()]);
  protected readonly anillo = computed(() => ANILLO[this.tamano()]);

  protected readonly rejillas = computed<Rejilla[]>(() => {
    const v = this.visual();
    const t = this.tamano();
    const listas: { encendidas: number; total: number; medida: Medida }[] = [];
    if (v.tipo === 'decimas' || v.tipo === 'centenas') {
      listas.push({ encendidas: v.encendidas, total: v.total, medida: REJILLAS[v.tipo][t] });
    } else if (v.tipo === 'comparacion') {
      v.filas.forEach((f) => listas.push({ encendidas: Math.round((f.valor / 100) * v.total), total: v.total, medida: REJILLAS.comparacion[t] }));
    } else if (v.tipo === 'secciones') {
      v.lados.forEach((l) => listas.push({ encendidas: Math.round((l.valor / 100) * v.total), total: v.total, medida: REJILLAS.secciones[t] }));
    }
    const reducido = this.reducido();
    const paso = duracion('escalonado');
    const tope = duracion('media');
    return listas.map((l) => {
      const intervalo = l.encendidas > 0 ? Math.min(paso, tope / l.encendidas) : 0;
      const puntos = Array.from({ length: l.total }, (_, i) => ({
        encendido: i < l.encendidas,
        retraso: reducido ? 0 : this.inicio() + i * intervalo,
      }));
      return { medida: l.medida, filas: Math.ceil(l.total / l.medida.columnas), puntos };
    });
  });
}

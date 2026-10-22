import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input } from '@angular/core';
import { escalonadoTexto } from '../../core/motion';
import { Icono } from '../../shared/ui/icono';
import { LucesWrapped } from './luces-wrapped';
import { FUENTE, TOTAL_TARJETAS, Tarjeta } from './tarjetas';

export const ANCHO_TARJETA = 1080;
export const ALTO_TARJETA = 1920;

export type VarianteTarjeta = 0 | 1 | 2;

const ENTRA =
  'transition-[opacity,translate] duracion-media ease-entrada starting:translate-y-(--space-6) starting:opacity-0 motion-reduce:duracion-corta motion-reduce:starting:translate-y-0';

function ajuste(largo: number, limite: number, minimo: number, maximo: number): number {
  return Math.min(maximo, Math.max(minimo, Math.sqrt(limite / Math.max(1, largo))));
}

function tamano(token: string, factor: number): string {
  return `calc(var(${token}) * ${factor.toFixed(3)})`;
}

@Component({
  selector: 'app-tarjeta-wrapped',
  imports: [LucesWrapped, Icono],
  template: `
    @let t = tarjeta();
    <header class="flex items-baseline justify-between gap-(--space-6) border-b-2 border-linea pb-(--space-8)">
      <span class="font-titulo text-wrapped-etiqueta font-negrita ancho-titulo tracking-(--text-wrapped-titulo--letter-spacing)">La generación que se apagó</span>
      <span class="font-mono text-wrapped-etiqueta text-texto-2 tabular">{{ pagina() }}</span>
    </header>

    @switch (variante()) {
      @case (1) {
        <main class="flex min-h-0 flex-1 flex-col gap-(--space-10) pt-(--space-12)">
          <span class="font-titulo text-wrapped-cifra font-negrita ancho-titulo text-foco-apagado tabular {{ entra }}" [style.transition-delay.s]="retraso(0)" aria-hidden="true">{{ indice() }}</span>
          <p class="font-titulo text-wrapped-titulo font-negrita ancho-titulo [overflow-wrap:anywhere] [text-wrap:balance] {{ entra }}" [style.font-size]="tamTitular()" [style.transition-delay.s]="retraso(1)">
            @for (p of t.frase; track $index) {
              <span [class.text-acento-texto]="p.luz">{{ p.texto }}</span>
            }
          </p>
          @if (t.visual.tipo === 'cierre') {
            <p class="font-texto text-wrapped-cuerpo text-texto-2 {{ entra }}" [style.transition-delay.s]="retraso(2)">
              {{ t.antetitulo }}: <span class="font-negrita text-acento-texto">{{ t.visual.fecha }}</span>
            </p>
          }
          <div class="mt-auto flex flex-col gap-(--space-8) {{ entra }}" [style.transition-delay.s]="retraso(2)">
            <span class="font-mono text-wrapped-etiqueta font-medio text-texto-2 uppercase [overflow-wrap:anywhere]" [style.font-size]="tamAntetitulo()">{{ t.visual.tipo === 'cierre' ? t.visual.sitio : t.antetitulo }}</span>
            <app-luces-wrapped [class.self-start]="!anchoCompleto()" [visual]="t.visual" tamano="compacto" [inicio]="retraso(3)" [reducido]="reducido()" />
          </div>
        </main>
      }
      @case (2) {
        <main class="flex min-h-0 flex-1 flex-col gap-(--space-10) pt-(--space-12)">
          <div class="flex flex-1 items-center justify-center {{ entra }}" [style.transition-delay.s]="retraso(0)">
            <app-luces-wrapped [visual]="t.visual" tamano="grande" [inicio]="retraso(2)" [reducido]="reducido()" [class.w-full]="anchoCompleto()" />
          </div>
          <div class="flex flex-col gap-(--space-6) rounded-lg border-2 border-linea bg-superficie p-(--space-12) {{ entra }}" [style.transition-delay.s]="retraso(1)">
            <span class="font-mono text-wrapped-etiqueta font-medio text-acento-texto uppercase [overflow-wrap:anywhere]" [style.font-size]="tamAntetitulo()">{{ t.antetitulo }}</span>
            @if (t.cifra; as c) {
              <span class="flex items-baseline gap-(--space-4) font-titulo font-negrita ancho-titulo text-acento-texto tabular">
                <span class="text-wrapped-titulo" [style.font-size]="tamCifraCampo()">{{ c.numero }}{{ c.sufijo }}</span>
                <span class="font-mono text-wrapped-etiqueta font-medio text-texto-2 uppercase">{{ c.unidad }}</span>
              </span>
            }
            <p class="font-texto text-wrapped-cuerpo [overflow-wrap:anywhere]" [class.font-titulo]="!t.cifra" [class.font-negrita]="!t.cifra" [class.ancho-titulo]="!t.cifra" [style.font-size]="t.cifra ? tamFrase() : tamTitular()">
              @for (p of t.frase; track $index) {
                <span [class.text-acento-texto]="p.luz" [class.font-negrita]="p.luz">{{ p.texto }}</span>
              }
            </p>
            @if (t.visual.tipo === 'cierre') {
              <span class="font-texto text-wrapped-cuerpo font-negrita text-acento-texto">{{ t.visual.fecha }}</span>
              <span class="font-mono text-wrapped-etiqueta font-medio text-texto-2">{{ t.visual.sitio }}</span>
            }
          </div>
        </main>
      }
      @default {
        <main class="flex min-h-0 flex-1 flex-col gap-(--space-10) pt-(--space-12)">
          <span class="font-mono text-wrapped-etiqueta font-medio text-acento-texto uppercase [overflow-wrap:anywhere] {{ entra }}" [style.font-size]="tamAntetitulo()" [style.transition-delay.s]="retraso(0)">{{ t.antetitulo }}</span>
          @if (t.cifra; as c) {
            <div class="flex flex-col gap-(--space-4) {{ entra }}" [style.transition-delay.s]="retraso(1)">
              <span class="flex items-baseline font-titulo text-wrapped-cifra font-negrita ancho-titulo text-acento-texto tabular" [style.font-size]="tamCifra()">
                {{ c.numero }}@if (c.sufijo) {<span class="text-[0.42em]">{{ c.sufijo }}</span>}
              </span>
              <span class="font-mono text-wrapped-etiqueta font-medio text-texto-2 uppercase">{{ c.unidad }}</span>
            </div>
          } @else if (t.visual.tipo === 'cierre') {
            <div class="flex flex-col gap-(--space-10) py-(--space-12) {{ entra }}" [style.transition-delay.s]="retraso(1)">
              <app-luces-wrapped [visual]="t.visual" tamano="normal" [inicio]="retraso(3)" [reducido]="reducido()" />
              <span class="text-center font-titulo text-wrapped-titulo font-negrita ancho-titulo text-acento-texto">{{ t.visual.fecha }}</span>
            </div>
          }
          <p class="font-texto text-wrapped-cuerpo [overflow-wrap:anywhere] {{ entra }}" [class.font-titulo]="!t.cifra" [class.font-negrita]="!t.cifra" [class.ancho-titulo]="!t.cifra" [class.text-center]="!t.cifra" [style.font-size]="t.cifra ? tamFrase() : tamTitular()" [style.transition-delay.s]="retraso(2)">
            @for (p of t.frase; track $index) {
              <span [class.text-acento-texto]="p.luz" [class.font-negrita]="p.luz">{{ p.texto }}</span>
            }
          </p>
          @if (t.visual.tipo === 'cierre') {
            <span class="text-center font-mono text-wrapped-etiqueta font-medio text-acento-texto {{ entra }}" [style.transition-delay.s]="retraso(3)">{{ t.visual.sitio }}</span>
          } @else {
            <div class="flex flex-1 flex-col justify-center {{ entra }}" [style.transition-delay.s]="retraso(3)">
              <app-luces-wrapped [visual]="t.visual" tamano="normal" [inicio]="retraso(4)" [reducido]="reducido()" />
            </div>
          }
        </main>
      }
    }

    @if (t.notas.length) {
      <div class="flex flex-col gap-(--space-3) {{ entra }}" [style.transition-delay.s]="retraso(4)">
        @for (nota of t.notas; track nota) {
          <p class="flex items-start gap-(--space-4) font-texto text-wrapped-etiqueta text-texto-2">
            <app-icono nombre="info" class="mt-(--space-1) size-(--space-8) text-texto-3" />
            <span class="min-w-0 [overflow-wrap:anywhere]">{{ nota }}</span>
          </p>
        }
      </div>
    }

    <footer class="border-t-2 border-linea pt-(--space-8) font-mono text-wrapped-etiqueta tracking-(--text-wrapped-cuerpo--letter-spacing) text-texto-3">{{ fuente }}</footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-tarjeta': '',
    class:
      'absolute top-0 left-0 flex origin-top-left flex-col gap-(--space-10) overflow-hidden bg-fondo px-(--space-24) pt-(--space-24) pb-(--space-20) font-texto text-texto [-webkit-font-smoothing:antialiased]',
    '[style.width.px]': 'ancho',
    '[style.height.px]': 'alto',
    '[style.transform]': '"scale(" + escala() + ")"',
    '[attr.aria-hidden]': 'true',
  },
})
export class TarjetaWrapped {
  readonly tarjeta = input.required<Tarjeta>();
  readonly variante = input<VarianteTarjeta>(0);
  readonly escala = input(1);
  readonly reducido = input(false);

  readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly ancho = ANCHO_TARJETA;
  protected readonly alto = ALTO_TARJETA;
  protected readonly entra = ENTRA;
  protected readonly fuente = FUENTE;

  protected readonly indice = computed(() => String(this.tarjeta().indice).padStart(2, '0'));
  protected readonly pagina = computed(() => `${this.indice()}/${String(TOTAL_TARJETAS).padStart(2, '0')}`);
  protected readonly anchoCompleto = computed(() => ['comparacion', 'barras', 'secciones'].includes(this.tarjeta().visual.tipo));

  protected readonly tamFrase = computed(() => tamano('--text-wrapped-cuerpo', ajuste(this.tarjeta().largo, 110, 0.8, 1)));
  protected readonly tamTitular = computed(() => tamano('--text-wrapped-titulo', ajuste(this.tarjeta().largo, 70, 0.62, 1.45)));
  protected readonly tamAntetitulo = computed(() => tamano('--text-wrapped-etiqueta', ajuste(this.tarjeta().antetitulo.length, 60, 0.8, 1)));
  protected readonly tamCifra = computed(() => tamano('--text-wrapped-cifra', (this.tarjeta().cifra?.numero.length ?? 0) >= 5 ? 0.82 : 1));
  protected readonly tamCifraCampo = computed(() => tamano('--text-wrapped-titulo', 1.6));

  protected retraso(orden: number): number {
    return this.reducido() ? 0 : orden * escalonadoTexto();
  }
}

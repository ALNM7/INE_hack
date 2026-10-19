import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  input,
  output,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

@Component({
  selector: 'app-selector-variantes',
  template: `
    <nav class="proto-picker" aria-label="Prototype variants" [attr.data-position]="posicion() === 'top' ? 'top' : null" [attr.data-ready]="listo() ? '' : null">
      <span #resaltado class="proto-picker-highlight" aria-hidden="true"></span>
      @for (nombre of nombres(); track nombre; let i = $index) {
        <button
          #opcion
          type="button"
          class="proto-picker-item"
          [attr.data-active]="i === activo() ? '' : null"
          [attr.aria-current]="i === activo() ? 'true' : null"
          (click)="elegir.emit(i)"
        >
          {{ nombre }}
        </button>
      }
      <span class="proto-picker-divider" aria-hidden="true"></span>
      <button type="button" class="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" (click)="repetir.emit()">↻</button>
    </nav>
  `,
  styles: `
    .proto-picker {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 2px;
      padding: 4px;
      border-radius: 999px;
      background: rgba(10, 10, 10, 0.82);
      -webkit-backdrop-filter: blur(12px) saturate(1.4);
      backdrop-filter: blur(12px) saturate(1.4);
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.08) inset,
        0 8px 24px rgba(0, 0, 0, 0.24),
        0 2px 6px rgba(0, 0, 0, 0.12);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 13px;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      user-select: none;
      -webkit-user-select: none;
    }

    .proto-picker-highlight {
      position: absolute;
      top: 4px;
      left: 0;
      height: 28px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.12);
      will-change: transform;
    }

    .proto-picker[data-ready] .proto-picker-highlight {
      transition:
        transform 250ms cubic-bezier(0.23, 1, 0.32, 1),
        width 250ms cubic-bezier(0.23, 1, 0.32, 1);
    }

    @media (prefers-reduced-motion: reduce) {
      .proto-picker[data-ready] .proto-picker-highlight { transition: none; }
    }

    .proto-picker-item {
      position: relative;
      display: flex;
      align-items: center;
      height: 28px;
      padding: 0 12px;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      font: inherit;
      cursor: pointer;
      transition: color 150ms ease-out;
    }

    .proto-picker-item:hover {
      color: rgba(255, 255, 255, 0.85);
    }

    .proto-picker-item:active {
      transform: scale(0.97);
    }

    .proto-picker-item:focus-visible {
      outline: 2px solid rgba(255, 255, 255, 0.4);
      outline-offset: 2px;
    }

    .proto-picker-item[data-active] {
      color: #fff;
    }

    .proto-picker-divider {
      width: 1px;
      height: 16px;
      margin: 0 4px;
      background: rgba(255, 255, 255, 0.12);
    }

    .proto-picker-replay {
      padding: 0 10px;
      font-size: 14px;
    }

    .proto-picker[data-position="top"] {
      bottom: auto;
      top: 24px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'tecla($event)',
    '(window:resize)': 'moverResaltado()',
  },
})
export class SelectorVariantes {
  readonly nombres = input.required<readonly string[]>();
  readonly activo = input.required<number>();
  readonly posicion = input<'top' | 'bottom'>('top');
  readonly elegir = output<number>();
  readonly repetir = output<void>();

  protected readonly listo = signal(false);
  private readonly resaltado = viewChild.required<ElementRef<HTMLElement>>('resaltado');
  private readonly opciones = viewChildren<ElementRef<HTMLElement>>('opcion');

  constructor() {
    afterRenderEffect(() => {
      this.activo();
      this.moverResaltado();
    });
    afterNextRender(() => requestAnimationFrame(() => requestAnimationFrame(() => this.listo.set(true))));
  }

  protected moverResaltado(): void {
    const opcion = this.opciones()[this.activo()]?.nativeElement;
    if (!opcion) {
      return;
    }
    const resaltado = this.resaltado().nativeElement;
    resaltado.style.width = `${opcion.offsetWidth}px`;
    resaltado.style.transform = `translateX(${opcion.offsetLeft}px)`;
  }

  protected tecla(evento: KeyboardEvent): void {
    const objetivo = evento.target as HTMLElement | null;
    if (objetivo && (/^(INPUT|TEXTAREA|SELECT)$/.test(objetivo.tagName) || objetivo.isContentEditable || objetivo.closest('[role="slider"]'))) {
      return;
    }
    if (evento.metaKey || evento.ctrlKey || evento.altKey) {
      return;
    }
    const total = this.nombres().length;
    const numero = parseInt(evento.key, 10);
    if (numero >= 1 && numero <= total) {
      this.elegir.emit(numero - 1);
    } else if (evento.key === 'ArrowRight') {
      this.elegir.emit((this.activo() + 1) % total);
    } else if (evento.key === 'ArrowLeft') {
      this.elegir.emit((this.activo() - 1 + total) % total);
    } else if (evento.key === 'r' || evento.key === 'R') {
      this.repetir.emit();
    }
  }
}

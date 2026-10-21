import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, inject, signal } from '@angular/core';

@Component({
  selector: 'app-barra-progreso',
  template: `
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-foco-encendido transition-opacity duracion-media ease-salida"
      [style.transform]="'scaleX(' + progreso() + ')'"
      [style.opacity]="progreso() > 0.004 ? 1 : 0"
      role="progressbar"
      aria-label="Avance de la lectura"
      [attr.aria-valuenow]="porcentaje()"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraProgreso {
  protected readonly progreso = signal(0);
  protected readonly porcentaje = signal(0);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      let cuadro = 0;
      const actualizar = () => {
        cuadro = 0;
        const doc = document.documentElement;
        const maximo = doc.scrollHeight - doc.clientHeight;
        const valor = maximo > 0 ? Math.min(1, Math.max(0, doc.scrollTop / maximo)) : 0;
        this.progreso.set(valor);
        this.porcentaje.set(Math.round(valor * 100));
      };
      const alMover = () => {
        if (!cuadro) {
          cuadro = requestAnimationFrame(actualizar);
        }
      };
      actualizar();
      window.addEventListener('scroll', alMover, { passive: true });
      window.addEventListener('resize', alMover, { passive: true });
      this.destroyRef.onDestroy(() => {
        cancelAnimationFrame(cuadro);
        window.removeEventListener('scroll', alMover);
        window.removeEventListener('resize', alMover);
      });
    });
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { colorToken } from './core/tokens';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  template: `
    <router-outlet />
    <ngx-sonner-toaster theme="dark" position="bottom-center" [offset]="offset" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly offset = 'calc(var(--alto-barra) + var(--space-4))';

  constructor() {
    const documento = inject(DOCUMENT);
    const meta = documento.createElement('meta');
    meta.name = 'theme-color';
    meta.content = colorToken('--color-fondo');
    documento.head.appendChild(meta);
  }
}

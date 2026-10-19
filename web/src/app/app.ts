import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { colorToken } from './core/tokens';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor() {
    const documento = inject(DOCUMENT);
    const meta = documento.createElement('meta');
    meta.name = 'theme-color';
    meta.content = colorToken('--color-fondo');
    documento.head.appendChild(meta);
  }
}

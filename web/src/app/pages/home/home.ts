import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: '<main class="min-h-svh bg-fondo text-texto"></main>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}

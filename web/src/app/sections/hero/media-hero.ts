import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface FuenteVideo {
  src: string;
  tipo: string;
}

interface ManifiestoHero {
  listo: boolean;
  fuentes: FuenteVideo[];
}

@Injectable({ providedIn: 'root' })
export class MediaHero {
  private readonly manifiesto = signal<ManifiestoHero | null>(null);

  readonly fuentes = computed<FuenteVideo[]>(() => {
    const m = this.manifiesto();
    return m?.listo ? m.fuentes : [];
  });

  constructor() {
    firstValueFrom(inject(HttpClient).get<ManifiestoHero>('media/hero.json')).then(
      (m) => this.manifiesto.set(m),
      () => this.manifiesto.set(null),
    );
  }
}

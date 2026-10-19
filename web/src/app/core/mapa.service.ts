import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { firstValueFrom } from 'rxjs';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { PropiedadesEstado } from './models';

export type Estados = FeatureCollection<Geometry, PropiedadesEstado>;

@Injectable({ providedIn: 'root' })
export class MapaService {
  private readonly http = inject(HttpClient);
  private readonly datos = signal<Estados | null>(null);
  private promesa: Promise<Estados> | null = null;

  readonly estados = this.datos.asReadonly();

  cargar(): Promise<Estados> {
    if (!this.promesa) {
      this.promesa = firstValueFrom(this.http.get<Topology>('geo/mx_estados.topojson')).then(
        (topologia) => {
          const capa = topologia.objects['estados'] as GeometryCollection<PropiedadesEstado>;
          const coleccion = feature(topologia, capa) as Estados;
          coleccion.features = coleccion.features.filter((f): f is Feature<Geometry, PropiedadesEstado> => !!f.geometry);
          this.datos.set(coleccion);
          return coleccion;
        },
        (error: unknown) => {
          this.promesa = null;
          throw error;
        },
      );
    }
    return this.promesa;
  }
}

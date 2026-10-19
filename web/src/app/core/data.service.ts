import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ArchivoMunicipios,
  Catalogo,
  Cohortes,
  EdadExacta,
  Estados,
  Focos,
  Meta,
  Nacional,
} from './models';

export type EstadoCarga = 'inactivo' | 'cargando' | 'listo' | 'error';

export class ArchivoDatos<T> {
  private readonly dato = signal<T | undefined>(undefined);
  private readonly fase = signal<EstadoCarga>('inactivo');
  private promesa: Promise<T> | null = null;

  readonly valor: Signal<T | undefined> = this.dato.asReadonly();
  readonly estado: Signal<EstadoCarga> = this.fase.asReadonly();
  readonly listo = computed(() => this.fase() === 'listo');

  constructor(
    private readonly http: HttpClient,
    readonly ruta: string,
  ) {}

  cargar(): Promise<T> {
    if (this.promesa) {
      return this.promesa;
    }
    this.fase.set('cargando');
    this.promesa = firstValueFrom(this.http.get<T>(this.ruta)).then(
      (respuesta) => {
        this.dato.set(respuesta);
        this.fase.set('listo');
        return respuesta;
      },
      (error: unknown) => {
        this.promesa = null;
        this.fase.set('error');
        throw error;
      },
    );
    return this.promesa;
  }
}

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly municipiosPorEstado = new Map<number, ArchivoDatos<ArchivoMunicipios>>();

  readonly nacional = this.archivo<Nacional>('nacional.json');
  readonly edadExacta = this.archivo<EdadExacta>('edad_exacta.json');
  readonly cohortes = this.archivo<Cohortes>('cohortes.json');
  readonly estados = this.archivo<Estados>('estados.json');
  readonly focos = this.archivo<Focos>('focos.json');
  readonly catalogo = this.archivo<Catalogo>('catalogo.json');
  readonly meta = this.archivo<Meta>('meta.json');

  municipios(estado: number): ArchivoDatos<ArchivoMunicipios> {
    let archivo = this.municipiosPorEstado.get(estado);
    if (!archivo) {
      archivo = this.archivo<ArchivoMunicipios>(`municipios/${String(estado).padStart(2, '0')}.json`);
      this.municipiosPorEstado.set(estado, archivo);
    }
    return archivo;
  }

  cargarBase(): Promise<unknown[]> {
    return Promise.all(
      [this.nacional, this.edadExacta, this.cohortes, this.estados, this.focos, this.catalogo, this.meta].map((a) =>
        a.cargar(),
      ),
    );
  }

  private archivo<T>(nombre: string): ArchivoDatos<T> {
    return new ArchivoDatos<T>(this.http, `data/${nombre}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, Promise<unknown>>();

  nacional(): Promise<Nacional> {
    return this.cargar<Nacional>('nacional.json');
  }

  edadExacta(): Promise<EdadExacta> {
    return this.cargar<EdadExacta>('edad_exacta.json');
  }

  cohortes(): Promise<Cohortes> {
    return this.cargar<Cohortes>('cohortes.json');
  }

  estados(): Promise<Estados> {
    return this.cargar<Estados>('estados.json');
  }

  focos(): Promise<Focos> {
    return this.cargar<Focos>('focos.json');
  }

  catalogo(): Promise<Catalogo> {
    return this.cargar<Catalogo>('catalogo.json');
  }

  meta(): Promise<Meta> {
    return this.cargar<Meta>('meta.json');
  }

  municipios(estado: number): Promise<ArchivoMunicipios> {
    return this.cargar<ArchivoMunicipios>(`municipios/${String(estado).padStart(2, '0')}.json`);
  }

  private cargar<T>(archivo: string): Promise<T> {
    const guardado = this.cache.get(archivo);
    if (guardado) {
      return guardado as Promise<T>;
    }
    const peticion = firstValueFrom(this.http.get<T>(`data/${archivo}`)).catch((error: unknown) => {
      this.cache.delete(archivo);
      throw error;
    });
    this.cache.set(archivo, peticion);
    return peticion;
  }
}

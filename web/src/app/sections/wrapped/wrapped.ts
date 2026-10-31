import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  afterRenderEffect,
  computed,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
  viewChildren,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { map } from 'rxjs';
import { DataService } from '../../core/data.service';
import { duracion } from '../../core/motion';
import { MovimientoReducido } from '../../core/movimiento-reducido.service';
import { Recorrido } from '../../core/recorrido';
import { Boton } from '../../shared/ui/boton';
import { Icono } from '../../shared/ui/icono';
import { SelectorVariantes } from '../../shared/ui/selector-variantes';
import { ComboboxMunicipio, OpcionMunicipio } from './combobox-municipio';
import { ExportadorTarjetas, archivoDe, descargarBlob, guardaEnGaleria, nombreArchivo, puedeCompartirArchivos } from './exportar';
import { ANCHO_TARJETA, TarjetaWrapped, VarianteTarjeta } from './tarjeta-wrapped';
import { EDAD_MAX, EDAD_MIN, Entrada, SEXOS, Sexo, Tarjeta, generarTarjetas } from './tarjetas';

const VARIANTES = ['Cifra', 'Titular', 'Campo'] as const;

type Campo = 'estado' | 'municipio' | 'edad' | 'sexo';

type Ocupado = 'una' | 'todas' | 'compartir' | null;

interface Generado {
  entrada: Entrada;
  version: number;
}

function esperar(segundos: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, segundos * 1000));
}

@Component({
  selector: 'app-wrapped',
  imports: [Boton, Icono, ComboboxMunicipio, TarjetaWrapped, SelectorVariantes],
  templateUrl: './wrapped.html',
  styles: `
    .pista {
      --ancho-marco: clamp(
        calc(var(--space-24) * 2),
        min(78vw, calc((100svh - var(--space-32) - var(--space-24)) * 9 / 16)),
        calc(var(--space-32) * 3)
      );
      margin-inline: calc(var(--margen) * -1);
      padding-inline: max(var(--margen), calc(50% + var(--margen) - var(--ancho-marco) / 2));
      scrollbar-width: none;
    }
    .pista::-webkit-scrollbar {
      display: none;
    }
    .marco {
      width: var(--ancho-marco);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class Wrapped {
  private readonly datos = inject(DataService);
  private readonly anunciador = inject(LiveAnnouncer);
  private readonly exportador = inject(ExportadorTarjetas);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);
  protected readonly reducido = inject(MovimientoReducido).activo;

  protected readonly edadMin = EDAD_MIN;
  protected readonly edadMax = EDAD_MAX;
  protected readonly sexos = SEXOS;
  protected readonly nombres = VARIANTES;
  protected readonly compartible = puedeCompartirArchivos();
  protected readonly galeria = guardaEnGaleria();

  protected readonly catalogo = this.datos.catalogo.valor;
  private readonly estados = this.datos.estados.valor;

  protected readonly estado = signal<number | null>(null);
  protected readonly municipio = signal<number | null>(null);
  protected readonly edad = signal('');
  protected readonly sexo = signal<Sexo | null>(null);
  protected readonly intentado = signal(false);

  private readonly archivo = computed(() => {
    const e = this.estado();
    return e === null ? null : this.datos.municipios(e);
  });
  protected readonly cargandoMunicipios = computed(() => this.archivo()?.estado() === 'cargando');
  protected readonly errorMunicipios = computed(() => this.archivo()?.estado() === 'error');
  protected readonly opciones = computed<OpcionMunicipio[]>(
    () => this.archivo()?.valor()?.municipios.map((m) => ({ c: m.c, n: m.n })) ?? [],
  );

  private readonly edadNumero = computed(() => {
    const texto = this.edad().trim();
    return /^\d{1,2}$/.test(texto) ? Number(texto) : null;
  });

  private readonly errores = computed<Record<Campo, string | null>>(() => {
    const edad = this.edadNumero();
    return {
      estado: this.estado() === null ? 'Elige tu estado.' : null,
      municipio: this.estado() !== null && this.municipio() === null ? 'Elige tu municipio de la lista.' : null,
      edad: edad === null || edad < EDAD_MIN || edad > EDAD_MAX ? `Escribe una edad entre ${EDAD_MIN} y ${EDAD_MAX} años.` : null,
      sexo: this.sexo() === null ? 'Elige una opción. Puede ser "Prefiero no decir".' : null,
    };
  });

  protected readonly generado = signal<Generado | null>(null);
  protected readonly tarjetas = computed<Tarjeta[]>(() => {
    const g = this.generado();
    return g ? generarTarjetas(g.entrada) : [];
  });

  private readonly parametro = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((p) => p.get('w'))), {
    initialValue: null,
  });
  protected readonly conSelector = computed(() => this.parametro() !== null);
  protected readonly variante = computed<VarianteTarjeta>(() => {
    const n = parseInt(this.parametro() ?? '1', 10);
    return (n >= 1 && n <= VARIANTES.length ? n - 1 : 0) as VarianteTarjeta;
  });
  private readonly montaje = signal(0);
  protected readonly claveMontaje = computed(() => `${this.generado()?.version ?? 0}-${this.variante()}-${this.montaje()}`);

  protected readonly escala = signal(0);
  protected readonly activa = signal(0);
  protected readonly ocupado = signal<Ocupado>(null);

  private readonly combobox = viewChild(ComboboxMunicipio);
  private readonly pista = viewChild<ElementRef<HTMLElement>>('pista');
  private readonly marcos = viewChildren<ElementRef<HTMLElement>>('marco');
  private readonly nodos = viewChildren(TarjetaWrapped);
  private readonly cache = new Map<string, Promise<Blob>>();
  private cuadro = 0;
  private version = 0;

  constructor() {
    inject(Recorrido).registrar('wrapped', {
      total: signal(1).asReadonly(),
      ir: () => undefined,
      titulo: () => document.getElementById('wrapped-titulo'),
    });
    this.datos.catalogo.cargar().catch(() => undefined);
    this.datos.estados.cargar().catch(() => undefined);

    effect(() => {
      const archivo = this.archivo();
      untracked(() => archivo?.cargar().catch(() => undefined));
    });

    afterRenderEffect((limpiar) => {
      const marco = this.marcos()[0]?.nativeElement;
      if (!marco) {
        return;
      }
      const observador = new ResizeObserver(([e]) => this.escala.set(e.contentRect.width / ANCHO_TARJETA));
      observador.observe(marco);
      limpiar(() => observador.disconnect());
    });

    effect((limpiar) => {
      const indice = this.activa();
      this.claveMontaje();
      const total = this.tarjetas().length;
      if (!this.compartible || !total) {
        return;
      }
      let cancelado = false;
      const orden = [indice, ...Array.from({ length: total }, (_, i) => i).filter((i) => i !== indice)];
      const espera = setTimeout(async () => {
        for (const i of orden) {
          if (cancelado) {
            return;
          }
          await this.blobDe(i).catch(() => undefined);
        }
      }, duracion('escena') * 1000);
      limpiar(() => {
        cancelado = true;
        clearTimeout(espera);
      });
    });

    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.cuadro));
  }

  protected error(campo: Campo): string | null {
    return this.intentado() ? this.errores()[campo] : null;
  }

  protected cambiarEstado(evento: Event): void {
    const valor = Number((evento.target as HTMLSelectElement).value);
    this.estado.set(Number.isFinite(valor) && valor > 0 ? valor : null);
    this.municipio.set(null);
  }

  protected reintentarMunicipios(): void {
    this.archivo()?.cargar().catch(() => undefined);
  }

  protected escribirEdad(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const limpio = campo.value.replace(/\D/g, '').slice(0, 2);
    if (limpio !== campo.value) {
      campo.value = limpio;
    }
    this.edad.set(limpio);
  }

  protected pasoEdad(delta: number): void {
    const actual = this.edadNumero();
    const base = actual ?? (delta > 0 ? EDAD_MIN - 1 : EDAD_MIN + 1);
    this.edad.set(String(Math.min(EDAD_MAX, Math.max(EDAD_MIN, base + delta))));
  }

  protected async enviar(evento: Event): Promise<void> {
    evento.preventDefault();
    this.intentado.set(true);
    const errores = this.errores();
    const primero = (Object.keys(errores) as Campo[]).find((c) => errores[c]);
    if (primero) {
      this.enfocarCampo(primero);
      return;
    }
    const [estados, archivo] = await Promise.all([this.datos.estados.cargar(), this.archivo()!.cargar()]);
    const estado = estados.estados.find((e) => e.c === this.estado());
    const municipio = archivo.municipios.find((m) => m.c === this.municipio());
    if (!estado || !municipio) {
      return;
    }
    this.version += 1;
    this.cache.clear();
    this.activa.set(0);
    this.generado.set({
      entrada: { estado, municipio, grupos: archivo.grupos, edad: this.edadNumero()!, sexo: this.sexo()! },
      version: this.version,
    });
    this.anunciador.announce(`Tus ${this.tarjetas().length} tarjetas están listas.`, 'polite');
    afterNextRender(
      () => {
        const pista = this.pista()?.nativeElement;
        if (!pista) {
          return;
        }
        pista.scrollLeft = 0;
        document.getElementById('wrapped-tarjetas')?.scrollIntoView({ behavior: this.reducido() ? 'auto' : 'smooth', block: 'start' });
        pista.focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }

  private enfocarCampo(campo: Campo): void {
    if (campo === 'municipio') {
      this.combobox()?.enfocar();
      return;
    }
    const id = campo === 'sexo' ? `wrapped-sexo-${SEXOS[0].id}` : `wrapped-${campo}`;
    document.getElementById(id)?.focus();
  }

  protected alDesplazar(): void {
    cancelAnimationFrame(this.cuadro);
    this.cuadro = requestAnimationFrame(() => {
      const pista = this.pista()?.nativeElement;
      if (!pista) {
        return;
      }
      const centro = pista.scrollLeft + pista.clientWidth / 2;
      let mejor = 0;
      let distancia = Number.POSITIVE_INFINITY;
      this.marcos().forEach((m, i) => {
        const d = Math.abs(m.nativeElement.offsetLeft + m.nativeElement.offsetWidth / 2 - centro);
        if (d < distancia) {
          distancia = d;
          mejor = i;
        }
      });
      this.activa.set(mejor);
    });
  }

  protected ir(indice: number): void {
    const pista = this.pista()?.nativeElement;
    const total = this.marcos().length;
    if (!pista || !total) {
      return;
    }
    const destino = Math.min(total - 1, Math.max(0, indice));
    const marco = this.marcos()[destino].nativeElement;
    pista.scrollTo({
      left: marco.offsetLeft - (pista.clientWidth - marco.offsetWidth) / 2,
      behavior: this.reducido() ? 'auto' : 'smooth',
    });
    this.activa.set(destino);
  }

  protected teclaPista(evento: KeyboardEvent): void {
    const total = this.marcos().length;
    const acciones: Record<string, number> = {
      ArrowRight: this.activa() + 1,
      ArrowLeft: this.activa() - 1,
      Home: 0,
      End: total - 1,
    };
    if (evento.key in acciones) {
      evento.preventDefault();
      this.ir(acciones[evento.key]);
    }
  }

  protected textoAccesible(t: Tarjeta): string {
    const frase = t.frase.map((p) => p.texto).join('');
    if (t.visual.tipo === 'cierre') {
      return `${frase} ${t.antetitulo}: ${t.visual.fecha}. ${t.visual.sitio}.`;
    }
    return [`${t.antetitulo}.`, frase, ...t.notas].join(' ');
  }

  private blobDe(indice: number): Promise<Blob> {
    const clave = `${this.claveMontaje()}-${indice}`;
    let promesa = this.cache.get(clave);
    if (!promesa) {
      const nodo = this.nodos()[indice]?.elemento.nativeElement;
      if (!nodo) {
        return Promise.reject(new Error('sin tarjeta'));
      }
      promesa = this.exportador.blob(nodo).catch((error: unknown) => {
        this.cache.delete(clave);
        throw error;
      });
      this.cache.set(clave, promesa);
    }
    return promesa;
  }

  protected async descargarUna(): Promise<void> {
    if (this.ocupado()) {
      return;
    }
    this.ocupado.set('una');
    const indice = this.activa();
    try {
      const blob = await this.blobDe(indice);
      if (this.galeria) {
        await this.abrirMenu([archivoDe(blob, indice + 1)]);
      } else {
        descargarBlob(blob, nombreArchivo(indice + 1));
        toast.success('Tarjeta descargada');
      }
    } catch (error) {
      this.avisarError(error);
    } finally {
      this.ocupado.set(null);
    }
  }

  protected async descargarTodas(): Promise<void> {
    if (this.ocupado()) {
      return;
    }
    this.ocupado.set('todas');
    const total = this.tarjetas().length;
    try {
      const blobs: Blob[] = [];
      for (let i = 0; i < total; i++) {
        blobs.push(await this.blobDe(i));
      }
      const archivos = blobs.map((blob, i) => archivoDe(blob, i + 1));
      if (this.galeria && navigator.canShare({ files: archivos })) {
        await this.abrirMenu(archivos);
        return;
      }
      for (let i = 0; i < total; i++) {
        descargarBlob(blobs[i], nombreArchivo(i + 1));
        if (i < total - 1) {
          await esperar(duracion('larga'));
        }
      }
      toast.success(`Listo, se descargaron las ${total}`);
    } catch (error) {
      this.avisarError(error);
    } finally {
      this.ocupado.set(null);
    }
  }

  protected async compartir(): Promise<void> {
    if (this.ocupado()) {
      return;
    }
    this.ocupado.set('compartir');
    const indice = this.activa();
    try {
      await this.abrirMenu([archivoDe(await this.blobDe(indice), indice + 1)]);
    } catch (error) {
      this.avisarError(error);
    } finally {
      this.ocupado.set(null);
    }
  }

  private abrirMenu(archivos: File[]): Promise<void> {
    return navigator.share({ files: archivos, title: 'La generación que se apagó' });
  }

  private avisarError(error: unknown): void {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return;
    }
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      toast.info('Tus tarjetas ya están listas. Vuelve a tocar el botón.');
      return;
    }
    toast.error('No se pudo generar la imagen, intenta de nuevo');
  }

  protected elegirVariante(indice: number): void {
    if (indice !== this.variante()) {
      this.router.navigate([], { queryParams: { w: indice + 1 }, queryParamsHandling: 'merge', replaceUrl: true });
    }
  }

  protected repetir(): void {
    this.montaje.update((n) => n + 1);
  }
}

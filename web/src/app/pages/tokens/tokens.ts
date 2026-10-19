import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import tokens from '../../../../../brand/tokens.json';
import { Bezier, curvas, duraciones, duracion } from '../../core/motion';

interface Token {
  variable: string;
  valor: string;
}

interface GrupoColor {
  titulo: string;
  nota: string;
  escala: boolean;
  tokens: Token[];
}

interface PasoTexto extends Token {
  familia: string;
  muestra: string;
  antetitulo: boolean;
  titulo: boolean;
}

const aLista = (grupo: Record<string, string>): Token[] =>
  Object.entries(grupo).map(([variable, valor]) => ({ variable, valor }));

const GRUPOS_COLOR: { titulo: string; nota: string; escala: boolean; prueba: RegExp }[] = [
  { titulo: 'Noche y luz', nota: 'Fondos, texto, luz encendida y apagada, alerta.', escala: false, prueba: /^--color-(noche-|luz$|luz-suave|luz-halo|apagada$|hueso|arena|ceniza|coral)/ },
  { titulo: 'Sexo', nota: 'Mujeres y hombres, en noche y en papel.', escala: false, prueba: /^--color-(mujeres|hombres)/ },
  { titulo: 'Impresión', nota: 'Papel, tinta y acentos para la ficha en hoja carta.', escala: false, prueba: /^--color-(papel|tinta|luz-papel|luz-tinta|apagada-papel|ladrillo)/ },
  { titulo: 'Secuencial', nota: 'De apagado a encendido, 9 pasos.', escala: true, prueba: /^--color-seq-\d/ },
  { titulo: 'Secuencial papel', nota: 'Más participación, más tinta.', escala: true, prueba: /^--color-seq-papel/ },
  { titulo: 'Divergente', nota: 'Peor o mejor que el promedio.', escala: true, prueba: /^--color-div-\d/ },
  { titulo: 'Divergente papel', nota: 'La misma lectura para imprimir.', escala: true, prueba: /^--color-div-papel/ },
];

const MUESTRAS: { prueba: RegExp; familia: string; muestra: string }[] = [
  { prueba: /(display|cifra)$/, familia: 'var(--font-titulo)', muestra: '59.7%' },
  { prueba: /titulo/, familia: 'var(--font-titulo)', muestra: 'La generación que se apagó' },
  { prueba: /(etiqueta|antetitulo)$/, familia: 'var(--font-mono)', muestra: 'Participación 2024' },
  { prueba: /.*/, familia: 'var(--font-texto)', muestra: '¿Tu luz sigue encendida?' },
];

function rutaCurva([x1, y1, x2, y2]: Bezier): string {
  const y = (v: number) => 100 - v * 100;
  return `M0,100 C${x1 * 100},${y(y1)} ${x2 * 100},${y(y2)} 100,0`;
}

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'medir()',
  },
})
export class Tokens {
  private readonly destroyRef = inject(DestroyRef);
  private readonly muestras = viewChildren<ElementRef<HTMLElement>>('muestra');

  protected readonly tema = signal<'noche' | 'impresion'>('noche');
  protected readonly encendido = signal(false);
  protected readonly medidas = signal<string[]>([]);

  protected readonly gruposColor: GrupoColor[] = GRUPOS_COLOR.map((g) => ({
    titulo: g.titulo,
    nota: g.nota,
    escala: g.escala,
    tokens: aLista(tokens.color).filter((t) => g.prueba.test(t.variable)),
  }));

  protected readonly semanticos = aLista(tokens.semantico);

  protected readonly familias = aLista(tokens.font).filter(
    (t) => !t.variable.startsWith('--font-weight') && !t.variable.startsWith('--font-stretch'),
  );

  protected readonly pesos = aLista(tokens.font).filter((t) => t.variable.startsWith('--font-weight'));

  protected readonly escalaTexto: PasoTexto[] = aLista(tokens.texto)
    .filter((t) => !t.variable.slice(2).includes('--'))
    .map((t) => {
      const tipo = MUESTRAS.find((m) => m.prueba.test(t.variable))!;
      return {
        ...t,
        familia: tipo.familia,
        muestra: tipo.muestra,
        antetitulo: t.variable.endsWith('antetitulo'),
        titulo: tipo.familia === 'var(--font-titulo)',
      };
    });

  protected readonly espacios = aLista(tokens.espacio).filter((t) => t.variable.startsWith('--space-'));
  protected readonly margenes = aLista(tokens.espacio).filter((t) => t.variable.startsWith('--spacing-'));
  protected readonly radios = aLista(tokens.forma).filter((t) => t.variable.startsWith('--radius-'));
  protected readonly sombras = aLista(tokens.forma).filter((t) => t.variable.startsWith('--shadow-'));
  protected readonly rejilla = aLista(tokens.rejilla);

  protected readonly curvas = curvas.map((c) => ({ ...c, ruta: rutaCurva(c.bezier) }));
  protected readonly duraciones = duraciones;
  protected readonly duracionMaxima = Math.max(...duraciones.map((d) => d.segundos));

  constructor() {
    afterNextRender(() => {
      this.medir();
      const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducido) {
        return;
      }
      const ciclo = (duracion('encendido') + duracion('escena')) * 1000;
      const id = setInterval(() => this.encendido.update((v) => !v), ciclo);
      this.destroyRef.onDestroy(() => clearInterval(id));
      requestAnimationFrame(() => this.encendido.set(true));
    });
  }

  protected reproducir(): void {
    this.encendido.update((v) => !v);
  }

  protected alternarTema(): void {
    this.tema.update((t) => (t === 'noche' ? 'impresion' : 'noche'));
  }

  protected medir(): void {
    this.medidas.set(
      this.muestras().map((m) => `${Math.round(parseFloat(getComputedStyle(m.nativeElement).fontSize))} px`),
    );
  }

  protected css(variable: string): string {
    return `var(${variable})`;
  }
}

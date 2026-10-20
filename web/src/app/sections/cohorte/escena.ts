import { ScaleLinear, line, scaleLinear } from 'd3';
import { Cohortes, Estado, Estados, Focos, Meta, Nacional } from '../../core/models';

export const PASOS = 8;
export const PASO_MAPA = 6;
export const PASO_FOCOS = 7;
export const FOCOS_POR_PUNTO = 25;
const RETRASO_FOCOS = 0.2;

const EDAD_PRIMERA = 18;
const EDAD_CONTRASTE = 50;
const GRUPO_GENERO = '25-29';
const DOMINIO_Y: [number, number] = [35, 75];
const TICKS_Y = [40, 50, 60, 70];

type Fila = readonly number[];

export interface Punto {
  edad: number;
  valor: number;
  anio: number;
}

export interface DatosActo {
  corta: [Punto, Punto];
  larga: [Punto, Punto, Punto];
  contraste: [Punto, Punto];
  genero: { edad: number; desde: number; hasta: number; anio: number; h: number; m: number };
  estados: Estado[];
  extremos: { min: Estado; max: Estado };
  focos: Focos;
  puntosFocos: number;
  fuente: string;
}

export interface Medidas {
  ancho: number;
  alto: number;
  izq: number;
  der: number;
  arr: number;
  aba: number;
  sep: number;
  punto: number;
  persona: number;
  hueco: number;
}

export interface Curvas {
  escena: (t: number) => number;
  entrada: (t: number) => number;
  apagado: (t: number) => number;
}

export interface Trazo {
  id: string;
  d: string;
  avance: number;
  o: number;
  clase: string;
}

export interface Marca {
  id: string;
  x: number;
  y: number;
  r: number;
  o: number;
  clase: string;
}

export interface Etiqueta {
  id: string;
  x: number;
  y: number;
  ancla: 'start' | 'middle' | 'end';
  cifra: string;
  texto: string;
  o: number;
  clase: string;
  dy: number;
}

export interface Persona {
  id: 'ana' | 'luis';
  nombre: string;
  x: number;
  y: number;
  brillo: number;
  ancla: 'start' | 'end';
  dx: number;
}

export interface Vista {
  ejes: number;
  ticksY: { y: number; texto: string }[];
  ticksX: { id: string; x: number; texto: string; o: number }[];
  trazos: Trazo[];
  marcas: Marca[];
  etiquetas: Etiqueta[];
  personas: Persona[];
  conector: { x: number; y1: number; y2: number; o: number };
  nombres: number;
  linea: { o: number; s: number };
  mapa: { o: number; s: number; oscuro: number; focos: number; etiquetas: number };
}

const decimal = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const entero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

export function porcentaje(valor: number): string {
  return `${decimal.format(valor)}%`;
}

export function puntos(valor: number): string {
  return decimal.format(valor);
}

export function miles(valor: number): string {
  return entero.format(valor);
}

function anioDe(campo: string): number {
  return Number(campo.replace(/\D/g, ''));
}

function numero(valor: number | null | undefined): number | null {
  return typeof valor === 'number' && Number.isFinite(valor) ? valor : null;
}

function fila(filas: readonly Fila[], edad: number): Fila | null {
  return filas.find((f) => f[0] === edad) ?? null;
}

export function extraerDatos(
  cohortes: Cohortes,
  nacional: Nacional,
  estados: Estados,
  focos: Focos,
  meta: Meta,
): DatosActo | null {
  const corta = fila(cohortes.corta.filas as Fila[], EDAD_PRIMERA);
  const larga = fila(cohortes.larga.filas as Fila[], EDAD_PRIMERA);
  const contraste = fila(cohortes.corta.filas as Fila[], EDAD_CONTRASTE);
  const aniosCorta = cohortes.corta.campos.slice(1).map(anioDe);
  const aniosLarga = cohortes.larga.campos.slice(1).map(anioDe);
  const indiceGrupo = nacional.grupos?.indexOf(GRUPO_GENERO) ?? -1;
  const grupo = nacional.grupos_2024;
  if (!corta || !larga || !contraste || indiceGrupo < 0 || !grupo) {
    return null;
  }
  const serie = (f: Fila, anios: number[]): Punto[] | null => {
    const lista = anios.map((anio, i) => ({
      edad: f[0] + anio - anios[0],
      valor: numero(f[i + 1]),
      anio,
    }));
    return lista.every((p) => p.valor !== null) ? (lista as Punto[]) : null;
  };
  const sCorta = serie(corta, aniosCorta);
  const sLarga = serie(larga, aniosLarga);
  const sContraste = serie(contraste, aniosCorta);
  const h = numero(grupo.h[indiceGrupo]);
  const m = numero(grupo.m[indiceGrupo]);
  const conDato = estados.estados.filter((e) => numero(e.jovenes_18_24['2024']) !== null);
  if (!sCorta || !sLarga || !sContraste || h === null || m === null || conDato.length === 0) {
    return null;
  }
  const [desde, hasta] = GRUPO_GENERO.split('-').map(Number);
  const ordenados = [...conDato].sort(
    (a, b) => a.jovenes_18_24['2024']! - b.jovenes_18_24['2024']!,
  );
  return {
    corta: [sCorta[0], sCorta[1]],
    larga: [sLarga[0], sLarga[1], sLarga[2]],
    contraste: [sContraste[0], sContraste[1]],
    genero: {
      edad: (desde + hasta) / 2,
      desde,
      hasta,
      anio: aniosCorta[aniosCorta.length - 1],
      h,
      m,
    },
    estados: estados.estados,
    extremos: { min: ordenados[0], max: ordenados[ordenados.length - 1] },
    focos,
    puntosFocos: estados.estados.reduce(
      (suma, e) => suma + Math.ceil(e.focos / FOCOS_POR_PUNTO),
      0,
    ),
    fuente: meta.fuente,
  };
}

function tramo(t: number): { k: number; f: number } {
  const acotado = Math.min(Math.max(t, 0), PASOS - 1);
  const k = Math.min(Math.floor(acotado), PASOS - 2);
  return { k, f: acotado - k };
}

function interpolar(valores: readonly number[], t: number, curva: (x: number) => number): number {
  const { k, f } = tramo(t);
  const a = valores[k];
  const b = valores[k + 1];
  return a === b ? a : a + (b - a) * curva(f);
}

function ruta(
  escalaX: ScaleLinear<number, number>,
  escalaY: ScaleLinear<number, number>,
  serie: readonly Punto[],
): string {
  return (
    line<Punto>()
      .x((p) => escalaX(p.edad))
      .y((p) => escalaY(p.valor))(serie as Punto[]) ?? ''
  );
}

export function brillo(valor: number, referencia: number): number {
  const piso = DOMINIO_Y[0];
  return Math.min(Math.max((valor - piso) / (referencia - piso), 0), 1);
}

export function vista(datos: DatosActo, t: number, m: Medidas, c: Curvas): Vista {
  const [c18, c24] = datos.corta;
  const [l18, l24, l30] = datos.larga;
  const [k50, k56] = datos.contraste;
  const g = datos.genero;
  const lejos = k56.edad + (k56.edad - k50.edad) * 2;
  const ancho = l30.edad - c18.edad;
  const cerca = l30.edad + (l30.edad - l24.edad) / 2;
  const inicio = c18.edad - (c24.edad - c18.edad) / 3;
  const centro = c18.edad - (cerca - inicio) / 2;

  const dominioIzq = interpolar(
    [centro, inicio, inicio, inicio, inicio, inicio, inicio, inicio],
    t,
    c.escena,
  );
  const genero = cerca + ancho / 2;
  const dominioDer = interpolar(
    [centro + (cerca - inicio), cerca, cerca, cerca, lejos, genero, genero, genero],
    t,
    c.escena,
  );
  const x = scaleLinear()
    .domain([dominioIzq, dominioDer])
    .range([m.izq, m.ancho - m.der]);
  const y = scaleLinear()
    .domain(DOMINIO_Y)
    .range([m.alto - m.aba, m.arr]);
  const op = (valores: readonly number[]) => interpolar(valores, t, c.entrada);
  const esc = (valores: readonly number[]) => interpolar(valores, t, c.escena);

  const ejes = op([0, 1, 1, 1, 1, 1, 1, 1]);
  const ticksX = [
    { id: 'x18', edad: c18.edad, texto: String(c18.edad), o: [0, 1, 1, 1, 1, 0, 0, 0] },
    { id: 'x24', edad: c24.edad, texto: String(c24.edad), o: [0, 0, 1, 1, 1, 0, 0, 0] },
    { id: 'x30', edad: l30.edad, texto: String(l30.edad), o: [0, 0, 0, 1, 1, 0, 0, 0] },
    { id: 'x50', edad: k50.edad, texto: String(k50.edad), o: [0, 0, 0, 0, 1, 0, 0, 0] },
    { id: 'x56', edad: k56.edad, texto: String(k56.edad), o: [0, 0, 0, 0, 1, 0, 0, 0] },
    { id: 'xg', edad: g.edad, texto: `${g.desde} a ${g.hasta}`, o: [0, 0, 0, 0, 0, 1, 0, 0] },
  ].map((tick) => ({ id: tick.id, x: x(tick.edad), texto: tick.texto, o: op(tick.o) }));

  const trazos: Trazo[] = [
    {
      id: 'corta',
      d: ruta(x, y, datos.corta),
      avance: esc([0, 0, 1, 1, 1, 1, 1, 1]),
      o: op([1, 1, 1, 0.35, 0.35, 0.2, 0.2, 0.2]),
      clase: 'stroke-foco-encendido',
    },
    {
      id: 'larga',
      d: ruta(x, y, datos.larga),
      avance: esc([0, 0, 0, 1, 1, 1, 1, 1]),
      o: op([1, 1, 1, 1, 0.35, 0.2, 0.2, 0.2]),
      clase: 'stroke-luz-suave',
    },
    {
      id: 'contraste',
      d: ruta(x, y, datos.contraste),
      avance: esc([0, 0, 0, 0, 1, 1, 1, 1]),
      o: op([1, 1, 1, 1, 1, 0, 0, 0]),
      clase: 'stroke-texto-2',
    },
  ];

  const marcas: Marca[] = [
    ...datos.larga.map((p, i) => ({
      id: `l${i}`,
      x: x(p.edad),
      y: y(p.valor),
      r: m.punto,
      o: op([0, 0, 0, 1, 0.35, 0.2, 0.2, 0.2]),
      clase: 'fill-luz-suave',
    })),
    ...datos.contraste.map((p, i) => ({
      id: `k${i}`,
      x: x(p.edad),
      y: y(p.valor),
      r: m.punto,
      o: op([0, 0, 0, 0, 1, 0, 0, 0]),
      clase: 'fill-texto-2',
    })),
    {
      id: 'gm',
      x: x(g.edad),
      y: y(g.m),
      r: m.persona,
      o: op([0, 0, 0, 0, 0, 1, 0, 0]),
      clase: 'fill-mujer',
    },
    {
      id: 'gh',
      x: x(g.edad),
      y: y(g.h),
      r: m.persona,
      o: op([0, 0, 0, 0, 0, 1, 0, 0]),
      clase: 'fill-hombre',
    },
  ];

  const solo = (paso: number) => op(Array.from({ length: PASOS }, (_, i) => (i === paso ? 1 : 0)));
  const etiquetas: Etiqueta[] = [
    {
      id: 'c18',
      p: c18,
      ancla: 'start',
      texto: `a los ${c18.edad}, en ${c18.anio}`,
      o: op([0, 1, 1, 0, 0, 0, 0, 0]),
      dy: -1,
    },
    {
      id: 'c24',
      p: c24,
      ancla: 'middle',
      texto: `a los ${c24.edad}, en ${c24.anio}`,
      o: solo(2),
      dy: 1,
    },
    {
      id: 'l18',
      p: l18,
      ancla: 'start',
      texto: `a los ${l18.edad}, en ${l18.anio}`,
      o: solo(3),
      dy: -1,
    },
    { id: 'l24', p: l24, ancla: 'start', texto: `a los ${l24.edad}`, o: solo(3), dy: -1 },
    { id: 'l30', p: l30, ancla: 'middle', texto: `a los ${l30.edad}`, o: solo(3), dy: 1 },
    {
      id: 'k50',
      p: k50,
      ancla: 'end',
      texto: `a los ${k50.edad}, en ${k50.anio}`,
      o: solo(4),
      dy: -1,
    },
    { id: 'k56', p: k56, ancla: 'start', texto: `a los ${k56.edad}`, o: solo(4), dy: -1 },
  ].map((e) => ({
    id: e.id,
    x: x(e.p.edad) + (e.ancla === 'start' ? -m.punto : e.ancla === 'end' ? m.punto : 0),
    y: y(e.p.valor),
    ancla: e.ancla as Etiqueta['ancla'],
    cifra: porcentaje(e.p.valor),
    texto: e.texto,
    o: e.o,
    clase: e.id.startsWith('k') ? 'fill-texto' : 'fill-acento-texto',
    dy: e.dy,
  }));

  const perdida = c18.valor - c24.valor;
  etiquetas.push({
    id: 'perdida',
    x: x((c18.edad + c24.edad) / 2) + m.sep * 2,
    y: y((c18.valor + c24.valor) / 2),
    ancla: 'start',
    cifra: `−${puntos(perdida)}`,
    texto: 'puntos',
    o: tramo(t).k === 1 ? Math.max(0, (tramo(t).f - 0.7) / 0.3) : solo(2),
    clase: 'fill-alerta',
    dy: 0,
  });

  const diferencia = g.m - g.h;
  const xGenero = x(g.edad) + m.persona + m.sep;
  etiquetas.push(
    {
      id: 'gm',
      x: xGenero,
      y: y(g.m),
      ancla: 'start',
      cifra: porcentaje(g.m),
      texto: 'Mujeres',
      o: solo(5),
      clase: 'fill-mujer',
      dy: 0,
    },
    {
      id: 'gh',
      x: xGenero,
      y: y(g.h),
      ancla: 'start',
      cifra: porcentaje(g.h),
      texto: 'Hombres',
      o: solo(5),
      clase: 'fill-hombre',
      dy: 0,
    },
    {
      id: 'gd',
      x: xGenero,
      y: y((g.m + g.h) / 2),
      ancla: 'start',
      cifra: puntos(diferencia),
      texto: 'puntos',
      o: solo(5),
      clase: 'fill-texto',
      dy: 0,
    },
  );

  const edadPersona = [c18.edad, c18.edad, c24.edad, c24.edad, c24.edad, g.edad, g.edad, g.edad];
  const valorBase = [c18.valor, c18.valor, c24.valor, c24.valor, c24.valor];
  const ladoGenero = -(m.persona * 2 + m.hueco);
  const persona = (
    id: Persona['id'],
    nombre: string,
    signo: number,
    valorGenero: number,
  ): Persona => {
    const desplazamiento = esc([
      ...valorBase.map(() => signo * m.hueco),
      ladoGenero,
      ladoGenero,
      ladoGenero,
    ]);
    return {
      id,
      nombre,
      x: x(esc(edadPersona)) + desplazamiento,
      y: y(esc([...valorBase, valorGenero, valorGenero, valorGenero])),
      brillo: interpolar([1, 1, 1, 1, 1, brillo(valorGenero, c18.valor), 0, 0], t, c.apagado),
      ancla: signo < 0 ? 'end' : 'start',
      dx: signo * (m.persona + m.sep),
    };
  };
  const { k, f } = tramo(t);
  const cambiaLado = k > 4 || (k === 4 && f >= 0.5);
  const personas = [persona('ana', 'Ana', -1, g.m), persona('luis', 'Luis', 1, g.h)];
  if (cambiaLado) {
    personas.forEach((p) => {
      p.ancla = 'end';
      p.dx = -(m.persona + m.sep);
    });
  }
  const nombres =
    k === 4 ? (0.6 + 0.4 * f) * Math.abs(1 - 2 * f) : op([1, 1, 1, 0.6, 0.6, 1, 0, 0]);
  trazos.forEach((trazo) => {
    if (trazo.avance <= 0.001) {
      trazo.o = 0;
    }
  });

  return {
    ejes,
    ticksY: TICKS_Y.map((v) => ({ y: y(v), texto: String(v) })),
    ticksX,
    trazos,
    marcas,
    etiquetas,
    personas,
    conector: { x: x(g.edad), y1: y(g.m) + m.persona, y2: y(g.h) - m.persona, o: solo(5) },
    nombres,
    linea: {
      o: op([1, 1, 1, 1, 1, 1, 0, 0]),
      s: interpolar([1, 1, 1, 1, 1, 1, 0.96, 0.96], t, c.escena),
    },
    mapa: {
      o: op([0, 0, 0, 0, 0, 0, 1, 1]),
      s: interpolar([0.96, 0.96, 0.96, 0.96, 0.96, 0.96, 1, 1], t, c.escena),
      oscuro: Math.min(Math.max((t - PASO_MAPA) * 2, 0), 1),
      focos: Math.min(Math.max((t - PASO_MAPA - RETRASO_FOCOS) / (1 - RETRASO_FOCOS), 0), 1),
      etiquetas: op([0, 0, 0, 0, 0, 0, 1, 0]),
    },
  };
}

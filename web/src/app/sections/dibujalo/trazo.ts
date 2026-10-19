import { EdadExacta } from '../../core/models';

export const SERIE = '2024';
export const EDAD_MIN = 18;
export const EDAD_MAX = 85;
export const VALOR_MIN = 0;
export const VALOR_MAX = 100;
export const PUNTOS_REQUERIDOS = 3;
export const MARGEN_ATINO = 3;
export const PASO_FINO = 1;
export const PASO_GRUESO = 10;

const RANGOS: readonly (readonly [number, number])[] = [
  [18, 19],
  [20, 24],
  [25, 29],
  [30, 34],
  [35, 44],
  [45, 59],
  [60, 69],
  [70, 79],
  [80, EDAD_MAX],
];

export interface Grupo {
  indice: number;
  desde: number;
  hasta: number;
  ancla: number;
  etiqueta: string;
}

export interface Punto {
  edad: number;
  valor: number;
}

export type Trazo = (number | null)[];

export const GRUPOS: readonly Grupo[] = RANGOS.map(([desde, hasta], indice) => ({
  indice,
  desde,
  hasta,
  ancla: indice === RANGOS.length - 1 ? hasta : Math.round((desde + hasta) / 2),
  etiqueta: `De ${desde} a ${hasta} años`,
}));

export const EDADES: readonly number[] = Array.from({ length: EDAD_MAX - EDAD_MIN + 1 }, (_, i) => EDAD_MIN + i);

export function acotar(valor: number, min = VALOR_MIN, max = VALOR_MAX): number {
  return Math.min(max, Math.max(min, valor));
}

export function redondear(valor: number): number {
  return Math.round(valor * 10) / 10;
}

export function serieReal(datos: EdadExacta): number[] | null {
  const serie = datos[SERIE];
  const valores = EDADES.map((edad) => serie[datos.edades.indexOf(edad)] ?? null);
  return valores.every((v): v is number => typeof v === 'number') ? valores : null;
}

export function trazoInicial(valor18: number): Trazo {
  return EDADES.map((edad) => (edad === EDAD_MIN ? valor18 : null));
}

export function ultimaDibujada(trazo: Trazo): number {
  let ultima = EDAD_MIN;
  trazo.forEach((v, i) => {
    if (v !== null) {
      ultima = EDAD_MIN + i;
    }
  });
  return ultima;
}

function escribir(trazo: Trazo, a: Punto, b: Punto): void {
  const pasos = Math.abs(b.edad - a.edad);
  const sentido = Math.sign(b.edad - a.edad);
  for (let k = 0; k <= pasos; k++) {
    const edad = a.edad + k * sentido;
    if (edad <= EDAD_MIN) {
      continue;
    }
    const t = pasos === 0 ? 1 : k / pasos;
    trazo[edad - EDAD_MIN] = redondear(acotar(a.valor + (b.valor - a.valor) * t));
  }
}

export function trazar(trazo: Trazo, previo: Punto | null, punto: Punto): Trazo {
  const nuevo = trazo.slice();
  const ultima = ultimaDibujada(trazo);
  const destino: Punto = { edad: acotar(punto.edad, EDAD_MIN + 1, EDAD_MAX), valor: acotar(punto.valor) };
  const origen = previo ?? (destino.edad > ultima ? { edad: ultima, valor: trazo[ultima - EDAD_MIN]! } : destino);
  escribir(nuevo, origen, destino);
  return nuevo;
}

export function valorGrupo(trazo: Trazo, grupo: Grupo): number | null {
  const valores: number[] = [];
  for (let edad = Math.max(grupo.desde, EDAD_MIN + 1); edad <= grupo.hasta; edad++) {
    const v = trazo[edad - EDAD_MIN];
    if (v !== null) {
      valores.push(v);
    }
  }
  return valores.length ? redondear(valores.reduce((s, v) => s + v, 0) / valores.length) : null;
}

export function ajustarGrupo(trazo: Trazo, grupo: Grupo, delta: number): Trazo {
  const nuevo = trazo.slice();
  const desde = Math.max(grupo.desde, EDAD_MIN + 1);
  const ultima = ultimaDibujada(trazo);
  const base = trazo[ultima - EDAD_MIN]!;
  for (let edad = ultima + 1; edad <= grupo.hasta; edad++) {
    nuevo[edad - EDAD_MIN] = base;
  }
  for (let edad = desde; edad <= grupo.hasta; edad++) {
    const v = nuevo[edad - EDAD_MIN];
    if (v !== null) {
      nuevo[edad - EDAD_MIN] = redondear(acotar(v + delta));
    }
  }
  return nuevo;
}

export function curvaDePuntos(valor18: number, puntos: readonly number[]): number[] {
  const nodos: Punto[] = [{ edad: EDAD_MIN, valor: valor18 }, ...GRUPOS.map((g, i) => ({ edad: g.ancla, valor: puntos[i] }))];
  return EDADES.map((edad) => {
    const j = nodos.findIndex((n) => n.edad >= edad);
    if (j <= 0) {
      return nodos[Math.max(0, j)].valor;
    }
    const a = nodos[j - 1];
    const b = nodos[j];
    return redondear(a.valor + ((b.valor - a.valor) * (edad - a.edad)) / (b.edad - a.edad));
  });
}

export function completo(trazo: Trazo): number[] | null {
  return trazo.every((v): v is number => v !== null) ? trazo : null;
}

export function errorMedio(usuario: readonly number[], real: readonly number[]): number {
  const total = real.reduce((suma, r, i) => suma + Math.abs(usuario[i] - r), 0);
  return total / real.length;
}

export function puntosDibujados(trazo: Trazo): Punto[] {
  return trazo.flatMap((v, i) => (v === null ? [] : [{ edad: EDAD_MIN + i, valor: v }]));
}

export function extremos(real: readonly number[]): { minimo: Punto; maximo: Punto } {
  const puntos = real.map((valor, i) => ({ edad: EDAD_MIN + i, valor }));
  return {
    minimo: puntos.reduce((a, b) => (b.valor < a.valor ? b : a)),
    maximo: puntos.reduce((a, b) => (b.valor > a.valor ? b : a)),
  };
}

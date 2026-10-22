import { fechaProximaEleccion, sitioCorto } from '../../core/config';
import { porcentaje, unDecimal } from '../../core/formato';
import { Estado, GruposSexo, Municipio, Participacion } from '../../core/models';

export type Sexo = 'mujer' | 'hombre' | 'nd';

export type Serie = keyof GruposSexo;

export const SEXOS: readonly { id: Sexo; nombre: string; serie: Serie }[] = [
  { id: 'mujer', nombre: 'Mujer', serie: 'm' },
  { id: 'hombre', nombre: 'Hombre', serie: 'h' },
  { id: 'nd', nombre: 'Prefiero no decir', serie: 't' },
];

export const EDAD_MIN = 18;
export const EDAD_MAX = 99;
export const TOTAL_TARJETAS = 5;
export const FUENTE = 'Fuente: INE, Conteos Censales 2024';

export interface Entrada {
  estado: Estado;
  municipio: Municipio;
  grupos: readonly string[];
  edad: number;
  sexo: Sexo;
}

export interface Parte {
  texto: string;
  luz?: boolean;
}

export interface Fila {
  etiqueta: string;
  valor: number;
  luz: boolean;
}

export interface Barra {
  etiqueta: string;
  valor: number;
  propia: boolean;
}

export interface Lado {
  etiqueta: string;
  detalle: string;
  valor: number;
  luz: boolean;
}

export type Visual =
  | { tipo: 'decimas'; encendidas: number; total: number }
  | { tipo: 'comparacion'; filas: Fila[]; total: number }
  | { tipo: 'barras'; barras: Barra[] }
  | { tipo: 'secciones'; lados: Lado[]; total: number }
  | { tipo: 'centenas'; encendidas: number; total: number }
  | { tipo: 'cierre'; fecha: string; sitio: string };

export interface Cifra {
  numero: string;
  sufijo: string;
  unidad: string;
}

function cifraPorcentaje(valor: number, unidad: string): Cifra {
  return { numero: unDecimal(valor), sufijo: '%', unidad };
}

export interface Tarjeta {
  indice: number;
  clave: string;
  antetitulo: string;
  cifra: Cifra | null;
  frase: Parte[];
  visual: Visual;
  notas: string[];
  largo: number;
}

export interface Rango {
  desde: number;
  hasta: number;
}

export function rangoGrupo(etiqueta: string): Rango {
  const numeros = etiqueta.match(/\d+/g)?.map(Number) ?? [];
  if (etiqueta.includes('+')) {
    return { desde: numeros[0], hasta: Number.POSITIVE_INFINITY };
  }
  return { desde: numeros[0], hasta: numeros[1] ?? numeros[0] };
}

export function indiceGrupo(grupos: readonly string[], edad: number): number {
  return grupos.findIndex((g) => {
    const r = rangoGrupo(g);
    return edad >= r.desde && edad <= r.hasta;
  });
}

export function nombreGrupo(etiqueta: string): string {
  const r = rangoGrupo(etiqueta);
  return Number.isFinite(r.hasta) ? `${r.desde} a ${r.hasta} años` : `${r.desde} años o más`;
}

function inicioGrupo(etiqueta: string): string {
  const r = rangoGrupo(etiqueta);
  return Number.isFinite(r.hasta) ? String(r.desde) : `${r.desde}+`;
}

export const EDAD_JOVEN_MAX = 29;

export function rangoJoven(grupos: readonly string[]): Rango {
  const jovenes = grupos.map(rangoGrupo).filter((r) => r.hasta <= EDAD_JOVEN_MAX);
  return { desde: jovenes[0].desde, hasta: jovenes[jovenes.length - 1].hasta };
}

export type Posicion = 'ultima' | 'abajo' | 'arriba' | 'mitad';

export function posicionGrupo(valores: readonly number[], indice: number): Posicion {
  const propio = valores[indice];
  const menores = valores.filter((v, i) => i !== indice && v < propio).length;
  const empates = valores.filter((v, i) => i !== indice && v === propio).length;
  const mayores = valores.filter((v, i) => i !== indice && v > propio).length;
  if (menores === 0 && empates === 0) {
    return 'ultima';
  }
  if (menores <= 2) {
    return 'abajo';
  }
  if (mayores <= 2) {
    return 'arriba';
  }
  return 'mitad';
}

const FRASES_POSICION: Record<Posicion, (lugar: string) => string> = {
  ultima: (lugar) => `Tu generación es la que menos vota en ${lugar}.`,
  abajo: (lugar) => `Tu generación está entre las que menos votan en ${lugar}.`,
  arriba: (lugar) => `Tu generación está entre las que más votan en ${lugar}.`,
  mitad: (lugar) => `Tu generación está a la mitad de la tabla en ${lugar}.`,
};

export function notaNula(estado: string): string {
  return `Dato de ${estado}: en tu municipio hay muy pocos registros para este grupo.`;
}

export function notaBaja(estado: string): string {
  return `En tu municipio no se capturó la mayoría de los registros, así que usamos el dato de ${estado}.`;
}

interface Dato {
  valor: number;
  delEstado: boolean;
}

function elegir(municipio: Participacion | undefined, estado: Participacion | undefined, soloEstado: boolean): Dato {
  if (!soloEstado && typeof municipio === 'number') {
    return { valor: municipio, delEstado: false };
  }
  return { valor: estado ?? 0, delEstado: !soloEstado };
}

function partes(texto: string, resaltados: readonly string[]): Parte[] {
  const resultado: Parte[] = [];
  let resto = texto;
  for (const r of resaltados) {
    const i = resto.indexOf(r);
    if (i < 0) {
      continue;
    }
    if (i > 0) {
      resultado.push({ texto: resto.slice(0, i) });
    }
    resultado.push({ texto: r, luz: true });
    resto = resto.slice(i + r.length);
  }
  if (resto) {
    resultado.push({ texto: resto });
  }
  return resultado;
}

export function generarTarjetas(entrada: Entrada): Tarjeta[] {
  const { estado, municipio, grupos, edad, sexo } = entrada;
  const baja = municipio.calidad === 'baja';
  const lugar = baja ? estado.n : municipio.n;
  const notaCalidad = baja ? [notaBaja(estado.n)] : [];
  const nula = notaNula(estado.n);
  const serie = SEXOS.find((s) => s.id === sexo)?.serie ?? 't';
  const grupo = Math.max(0, indiceGrupo(grupos, edad));
  const etiquetaGrupo = nombreGrupo(grupos[grupo]);
  const antetituloMunicipio = `${municipio.n}, ${estado.n}`;

  const total = elegir(municipio.p2024, estado.total['2024'], baja);
  const decimas = Math.round(total.valor / 10);
  const frase1 = `En ${lugar} votaron ${decimas} de cada 10 personas.`;

  const propio = elegir(municipio.grupos[serie][grupo], estado.grupos_2024[serie][grupo], baja);
  const etiquetaLugar = baja ? 'Tu estado' : 'Tu municipio';
  const frase2 = `Las personas de tu edad votaron ${porcentaje(propio.valor)}. ${etiquetaLugar}: ${porcentaje(total.valor)}.`;
  const quien = serie === 'm' ? 'Mujeres' : serie === 'h' ? 'Hombres' : 'Personas';

  const columna = grupos.map((_, i) => elegir(municipio.grupos.t[i], estado.grupos_2024.t[i], baja));
  const valores = columna.map((d) => d.valor);
  const posicion = posicionGrupo(valores, grupo);
  const frase3 = FRASES_POSICION[posicion](lugar);

  const max = baja ? null : municipio.seccion_max;
  const min = baja ? null : municipio.seccion_min;

  const tarjetas: Tarjeta[] = [
    {
      indice: 1,
      clave: 'municipio',
      antetitulo: `Tu municipio · ${antetituloMunicipio}`,
      cifra: { numero: String(decimas), sufijo: '', unidad: 'de cada 10' },
      frase: partes(frase1, [`${decimas} de cada 10`]),
      visual: { tipo: 'decimas', encendidas: decimas, total: 10 },
      notas: [...notaCalidad, ...(total.delEstado ? [nula] : [])],
      largo: frase1.length,
    },
    {
      indice: 2,
      clave: 'edad',
      antetitulo: `${quien} de ${etiquetaGrupo} · 2024`,
      cifra: cifraPorcentaje(propio.valor, 'votó'),
      frase: partes(frase2, [porcentaje(propio.valor)]),
      visual: {
        tipo: 'comparacion',
        total: 50,
        filas: [
          { etiqueta: 'Tu edad', valor: propio.valor, luz: true },
          { etiqueta: etiquetaLugar, valor: total.valor, luz: false },
        ],
      },
      notas: [...notaCalidad, ...(propio.delEstado || total.delEstado ? [nula] : [])],
      largo: frase2.length,
    },
    {
      indice: 3,
      clave: 'generacion',
      antetitulo: `Tu generación · ${etiquetaGrupo}`,
      cifra: cifraPorcentaje(valores[grupo], 'votó'),
      frase: partes(frase3, []),
      visual: {
        tipo: 'barras',
        barras: grupos.map((g, i) => ({ etiqueta: inicioGrupo(g), valor: valores[i], propia: i === grupo })),
      },
      notas: [...notaCalidad, ...(columna.some((d) => d.delEstado) ? [nula] : [])],
      largo: frase3.length,
    },
  ];

  if (max && min) {
    const frase4 = `En tu municipio, la sección que más votó llegó a ${porcentaje(max[1])} y la que menos a ${porcentaje(min[1])}.`;
    tarjetas.push({
      indice: 4,
      clave: 'secciones',
      antetitulo: `Secciones · ${municipio.n}`,
      cifra: cifraPorcentaje(max[1], 'la que más votó'),
      frase: partes(frase4, [porcentaje(max[1])]),
      visual: {
        tipo: 'secciones',
        total: 100,
        lados: [
          { etiqueta: 'La que más votó', detalle: `Sección ${max[0]}`, valor: max[1], luz: true },
          { etiqueta: 'La que menos', detalle: `Sección ${min[0]}`, valor: min[1], luz: false },
        ],
      },
      notas: [],
      largo: frase4.length,
    });
  } else {
    const jovenes = elegir(municipio.jovenes, estado.jovenes['2024'], baja);
    const edades = rangoJoven(grupos);
    const lugarJovenes = jovenes.delEstado ? estado.n : lugar;
    const frase4 = `En ${lugarJovenes} votó el ${porcentaje(jovenes.valor)} de las personas de ${edades.desde} a ${edades.hasta} años.`;
    tarjetas.push({
      indice: 4,
      clave: 'jovenes',
      antetitulo: `Jóvenes · ${antetituloMunicipio}`,
      cifra: cifraPorcentaje(jovenes.valor, `de ${edades.desde} a ${edades.hasta} años votó`),
      frase: partes(frase4, [porcentaje(jovenes.valor)]),
      visual: { tipo: 'centenas', encendidas: Math.round(jovenes.valor), total: 100 },
      notas: [...notaCalidad, ...(jovenes.delEstado ? [nula] : [])],
      largo: frase4.length,
    });
  }

  const frase5 = '¿Tu luz sigue encendida?';
  tarjetas.push({
    indice: 5,
    clave: 'cierre',
    antetitulo: 'Próxima elección federal',
    cifra: null,
    frase: [{ texto: frase5 }],
    visual: { tipo: 'cierre', fecha: fechaProximaEleccion(), sitio: sitioCorto() },
    notas: [],
    largo: frase5.length,
  });

  return tarjetas;
}

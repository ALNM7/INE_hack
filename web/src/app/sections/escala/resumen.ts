import { Anio, Nacional } from '../../core/models';

export const TOTAL_PUNTOS = 1000;

const PALABRAS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];

export interface PasoEscala {
  numero: string;
  texto: string;
}

export interface ResumenEscala {
  anio: Anio;
  millones: string;
  porPunto: string;
  unoDeCada: string;
  apagadas: number;
  jovenes: number;
  total: number;
  pasos: PasoEscala[];
}

const decimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const entero = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });

export function resumirEscala(nacional: Nacional): ResumenEscala {
  const anio = (Object.keys(nacional).filter((k) => /^\d{4}$/.test(k)) as Anio[]).sort().at(-1)!;
  const { sv, nv } = nacional[anio];
  const abstencion = nacional.abstencion_2024;
  const abstencionJovenes = nacional.abstencion_jovenes_2024;
  const apagadas = Math.round((TOTAL_PUNTOS * nv) / (sv + nv));
  const razon = Math.round(abstencion / abstencionJovenes);
  const millones = decimal.format(abstencion / 1e6);
  const deCada = PALABRAS[razon] ?? entero.format(razon);
  const textos = [
    `En ${anio}, ${millones} millones de personas con credencial no votaron.`,
    `Uno de cada ${deCada} tiene entre 18 y 29 años.`,
  ];
  return {
    anio,
    millones,
    porPunto: `${entero.format(Math.round((sv + nv) / TOTAL_PUNTOS / 1000))} mil`,
    unoDeCada: deCada,
    apagadas,
    jovenes: Math.round((apagadas * abstencionJovenes) / abstencion),
    total: TOTAL_PUNTOS,
    pasos: textos.map((texto, i) => ({ numero: String(i + 1).padStart(2, '0'), texto })),
  };
}

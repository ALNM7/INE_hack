import nacional from "../../../data/nacional.json";
import edadExacta from "../../../data/edad_exacta.json";
import cohortes from "../../../data/cohortes.json";
import estados from "../../../data/estados.json";
import focos from "../../../data/focos.json";
import catalogo from "../../../data/catalogo.json";
import meta from "../../../data/meta.json";
import puebla from "../../../data/municipios/21.json";
import geografia from "../../../data/mx_estados.topojson";

export { nacional, edadExacta, cohortes, estados, focos, catalogo, meta, geografia };

const formatoDecimal = new Intl.NumberFormat("es-MX", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const formatoEntero = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 });

export const formato = {
  porcentaje: (valor: number) => `${formatoDecimal.format(valor)}%`,
  decimal: (valor: number) => formatoDecimal.format(valor),
  millones: (valor: number) => formatoDecimal.format(valor / 1e6),
  entero: (valor: number) => formatoEntero.format(valor),
};

export const totalMunicipios = () => catalogo.reduce((suma, estado) => suma + estado.m.length, 0);

const anios = Object.keys(nacional).filter((k) => /^\d{4}$/.test(k)).sort();
export const anioReciente = anios[anios.length - 1] as "2024";
export const anioAnterior = anios[anios.length - 2];

export const participacionPorEdad = (edad: number, serie: keyof typeof edadExacta = anioReciente) => {
  const indice = edadExacta.edades.indexOf(edad);
  return (edadExacta[serie] as number[])[indice];
};

export const grupoNacional = (grupo: string) => {
  const i = nacional.grupos.indexOf(grupo);
  return { mujeres: nacional.grupos_2024.m[i], hombres: nacional.grupos_2024.h[i], total: nacional.grupos_2024.t[i] };
};

export const estadoPorNombre = (nombre: string) => estados.estados.find((e) => e.n === nombre)!;

export const cohorteLarga = (edad: number) => {
  const fila = cohortes.larga.filas.find((f) => f[0] === edad)!;
  return cohortes.larga.campos.slice(1).map((campo, i) => ({ anio: Number(campo.slice(1)), valor: fila[i + 1], edad: edad + Number(campo.slice(1)) - Number(cohortes.larga.campos[1].slice(1)) }));
};

export const cohorteCorta = (edad: number) => {
  const fila = cohortes.corta.filas.find((f) => f[0] === edad)!;
  const base = Number(cohortes.corta.campos[1].slice(1));
  return cohortes.corta.campos.slice(1).map((campo, i) => ({ anio: Number(campo.slice(1)), valor: fila[i + 1], edad: edad + Number(campo.slice(1)) - base }));
};

export const fichaMunicipio = (clave: number) => {
  const m = puebla.municipios.find((x) => x.c === clave)!;
  return { ...m, estado: puebla.n, etiquetas: puebla.grupos };
};

export const fuenteDatos = meta.fuente;

const [primerGrupo] = nacional.grupos;
const grupoJovenFinal = nacional.grupos.find((g) => g.endsWith(String(Number(primerGrupo.split("-")[0]) + 11)))!;
export const edadesJovenes = { desde: Number(primerGrupo.split("-")[0]), hasta: Number(grupoJovenFinal.split("-")[1]) };
export const rangoTexto = (grupo: string) => grupo.replace("-", " a ");

export const edadesClave = () => {
  const serie = edadExacta[anioReciente];
  const edades = edadExacta.edades;
  const maximo = serie.indexOf(Math.max(...serie));
  const previas = serie.slice(0, maximo);
  const minimo = previas.indexOf(Math.min(...previas));
  return { primera: edades[0], minima: edades[minimo], maxima: edades[maximo] };
};

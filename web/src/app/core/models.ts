export type Anio = '2012' | '2018' | '2024';

export type Participacion = number | null;

export interface ResumenAnio {
  ln: number;
  sv: number;
  nv: number;
  ns: number;
  part: number;
  ns_pct: number;
}

export interface Nacional {
  '2012': ResumenAnio;
  '2018': ResumenAnio;
  '2024': ResumenAnio;
  abstencion_2024: number;
  abstencion_jovenes_2024: number;
  ln_jovenes_2024: number;
}

export interface EdadExacta {
  edades: number[];
  '2012': Participacion[];
  '2018': Participacion[];
  '2024': Participacion[];
  '2024_h': Participacion[];
  '2024_m': Participacion[];
}

export interface SerieCohorte {
  campos: string[];
  filas: Participacion[][];
}

export interface Cohortes {
  larga: SerieCohorte;
  corta: SerieCohorte;
}

export interface GruposSexo {
  t: Participacion[];
  h: Participacion[];
  m: Participacion[];
}

export type PorAnio = Record<Anio, Participacion>;

export interface Estado {
  c: number;
  n: string;
  total: PorAnio;
  jovenes: PorAnio;
  jovenes_18_24: PorAnio;
  grupos_2024: GruposSexo;
  focos: number;
}

export interface Estados {
  grupos: string[];
  estados: Estado[];
}

export interface Municipio {
  c: number;
  n: string;
  ln: number;
  p2024: Participacion;
  p2018: Participacion;
  jovenes: Participacion;
  ns_pct: number;
  calidad: 'ok' | 'baja';
  secciones: number;
  seccion_max: [number, number] | null;
  seccion_min: [number, number] | null;
  focos: number;
  grupos: GruposSexo;
}

export interface ArchivoMunicipios {
  edo: number;
  n: string;
  grupos: string[];
  municipios: Municipio[];
}

export interface Focos {
  umbral: number;
  minimo_jovenes: number;
  total: number;
  por_municipio: [number, number, number][];
}

export interface EntradaCatalogo {
  c: number;
  n: string;
  m: [number, string][];
}

export type Catalogo = EntradaCatalogo[];

export interface Meta {
  generado: string;
  fuente: string;
  url: string;
  participacion: string;
  supresion: string;
  calidad: string;
  secciones: string;
  focos: string;
  cohorte: string;
  ns_2012: string;
  cobertura: string;
  municipios: number;
}

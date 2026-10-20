export type Anio = '2012' | '2018' | '2024';

export type Participacion = number | null;

export interface ResumenAnio {
  ln: number;
  sv: number;
  nv: number;
  ns: number;
  part: number;
  ns_pct: number;
  part_h: number;
  part_m: number;
  nv_h: number;
  nv_m: number;
}

export interface Nacional {
  '2012': ResumenAnio;
  '2018': ResumenAnio;
  '2024': ResumenAnio;
  abstencion_2024: number;
  abstencion_jovenes_2024: number;
  ln_jovenes_2024: number;
  grupos: string[];
  grupos_2012: GruposSexo;
  grupos_2018: GruposSexo;
  grupos_2024: GruposSexo;
}

export interface EdadExacta {
  edades: number[];
  '2012': Participacion[];
  '2018': Participacion[];
  '2024': Participacion[];
  '2024_h': Participacion[];
  '2024_m': Participacion[];
}

export type FilaCohorteLarga = [edad2012: number, p2012: Participacion, p2018: Participacion, p2024: Participacion];

export type FilaCohorteCorta = [edad2018: number, p2018: Participacion, p2024: Participacion];

export interface CohorteLarga {
  campos: ['edad_2012', 'p2012', 'p2018', 'p2024'];
  filas: FilaCohorteLarga[];
}

export interface CohorteCorta {
  campos: ['edad_2018', 'p2018', 'p2024'];
  filas: FilaCohorteCorta[];
}

export interface Cohortes {
  larga: CohorteLarga;
  corta: CohorteCorta;
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
  correcciones: string;
  mapa: string;
}

export interface PropiedadesEstado {
  c: number;
  n: string;
}

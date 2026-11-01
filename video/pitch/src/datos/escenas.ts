export const FPS = 30;
export const ANCHO = 1920;
export const ALTO = 1080;
export const RESPIRO = 0.6;
export const ENTRE_CLIPS = 0.25;
export const ESPERA_FINAL = 2;
export const MUSICA_BAJO_VOZ_DB = -20;
export const MUSICA_PAUSA_DB = -10;
export const MUSICA_FINAL_DB = -4;
export const MUSICA_RAMPA = 0.5;

export const URL_SITIO = "https://alnm7.github.io/INE_hack/";
export const URL_REPO = "https://github.com/alnm7/INE_hack";
export const EDAD_CONTRASTE = 50;
export const MUNICIPIO_FICHA = { estado: 21, municipio: 115 };
export const SECCIONES_POR_FOCO = 25;
export const GRUPO_BRECHA = "25-29";
export const ESTADOS_CONTRASTE = ["Sonora", "Yucatán"];
export const PROXIMA_ELECCION = 2027;
export const EQUIPO = ["Alfredo", "Alejandro", "Hector", "Tiago"];

export type DefinicionEscena = { id: string; clips: number[]; espera: number };

export const ESCENAS: DefinicionEscena[] = [
  { id: "Escena01", clips: [1], espera: 0 },
  { id: "Escena02", clips: [2], espera: 0 },
  { id: "Escena03", clips: [3], espera: 0 },
  { id: "Escena04", clips: [4], espera: 0 },
  { id: "Escena05", clips: [5, 6], espera: 0 },
  { id: "Escena06", clips: [7], espera: 0 },
  { id: "Escena07", clips: [8, 9], espera: ESPERA_FINAL },
];

export const PANTALLAS = ["hero", "acto1", "acto2", "acto3"] as const;
export type Pantalla = (typeof PANTALLAS)[number];

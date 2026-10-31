import { createContext, useContext } from "react";
import { getAudioDurationInSeconds, getVideoMetadata } from "@remotion/media-utils";
import { staticFile, useVideoConfig } from "remotion";
import { DefinicionEscena, ENTRE_CLIPS, ESCENAS, FPS, PANTALLAS, Pantalla, RESPIRO } from "./escenas";
import { subtitulosDe } from "./subtitulos";

export type MedidaPantalla = { duracion: number; proporcion: number };
export type PropsEscena = { duraciones: number[]; pantallas: Partial<Record<Pantalla, MedidaPantalla>> };
export type PropsPitch = { escenas: PropsEscena[]; musica: string | null };

export const rutaAudio = (clip: number) => staticFile(`audio/${clip}.wav`);
export const rutaPantalla = (nombre: Pantalla) => staticFile(`pantallas/${nombre}.mp4`);
export const rutaCuadroFinal = (nombre: Pantalla) => staticFile(`pantallas/${nombre}_fin.png`);

export const inicioClips = (duraciones: number[], fps: number) => {
  const inicios: number[] = [];
  let t = 0;
  for (const d of duraciones) {
    inicios.push(Math.round(t * fps));
    t += d + ENTRE_CLIPS;
  }
  return inicios;
};

export const cuadrosEscena = (definicion: DefinicionEscena, duraciones: number[], fps: number) => {
  const voz = duraciones.reduce((s, d) => s + d, 0) + ENTRE_CLIPS * (duraciones.length - 1);
  return Math.ceil((voz + RESPIRO + definicion.espera) * fps);
};

export const medirEscena = async (definicion: DefinicionEscena): Promise<PropsEscena> => {
  const duraciones = await Promise.all(definicion.clips.map((c) => getAudioDurationInSeconds(rutaAudio(c))));
  const pantallas: PropsEscena["pantallas"] = {};
  if (definicion.id === "Escena05") {
    const medidas = await Promise.all(PANTALLAS.map((p) => getVideoMetadata(rutaPantalla(p))));
    PANTALLAS.forEach((p, i) => (pantallas[p] = { duracion: medidas[i].durationInSeconds, proporcion: medidas[i].width / medidas[i].height }));
  }
  return { duraciones, pantallas };
};

export const metadatosEscena = (definicion: DefinicionEscena) => async () => {
  const props = await medirEscena(definicion);
  return { props, durationInFrames: cuadrosEscena(definicion, props.duraciones, FPS), fps: FPS };
};

export const metadatosPitch = async ({ props }: { props: PropsPitch }) => {
  const escenas = await Promise.all(ESCENAS.map(medirEscena));
  const total = ESCENAS.reduce((s, def, i) => s + cuadrosEscena(def, escenas[i].duraciones, FPS), 0);
  return { props: { ...props, escenas }, durationInFrames: total, fps: FPS };
};

type ContextoEscena = { clips: number[]; inicios: number[]; duraciones: number[] };
export const EscenaContexto = createContext<ContextoEscena>({ clips: [], inicios: [], duraciones: [] });

const normalizar = (t: string) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");

export const usePalabra = () => {
  const contexto = useContext(EscenaContexto);
  const { fps } = useVideoConfig();
  return (clip: number, frase: string, ocurrencia = 1, borde: "inicio" | "fin" = "inicio") => {
    const indiceClip = contexto.clips.indexOf(clip);
    const { palabras } = subtitulosDe(clip);
    const buscadas = frase.split(/\s+/).map(normalizar);
    let encontradas = 0;
    for (let i = 0; i + buscadas.length <= palabras.length; i++) {
      if (buscadas.every((b, k) => normalizar(palabras[i + k].texto) === b)) {
        encontradas++;
        if (encontradas === ocurrencia) {
          const segundos = borde === "inicio" ? palabras[i].inicio : palabras[i + buscadas.length - 1].fin;
          return contexto.inicios[indiceClip] + Math.round(segundos * fps);
        }
      }
    }
    throw new Error(`No se encontró "${frase}" en el clip ${clip}`);
  };
};

export const useEscena = () => useContext(EscenaContexto);

import { ReactNode } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { color, curva, duracion } from "../datos/marca";
import { EscenaContexto, inicioClips, rutaAudio } from "../datos/tiempos";
import { Subtitulos } from "./Subtitulos";

const Fundido = ({ children }: { children: ReactNode }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const cuadros = Math.round(duracion.media * fps);
  const opacidad = interpolate(frame, [0, cuadros, durationInFrames - cuadros, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curva.escena,
  });
  return <AbsoluteFill style={{ opacity: opacidad }}>{children}</AbsoluteFill>;
};

export const Escena = ({ clips, duraciones, children, fundidoFinal = true }: { clips: number[]; duraciones: number[]; children: ReactNode; fundidoFinal?: boolean }) => {
  const { fps } = useVideoConfig();
  const inicios = inicioClips(duraciones, fps);
  const contenido = (
    <>
      {children}
      <Subtitulos />
    </>
  );
  return (
    <EscenaContexto.Provider value={{ clips, inicios, duraciones }}>
      <AbsoluteFill style={{ backgroundColor: color.noche1, overflow: "hidden" }}>
        {fundidoFinal ? <Fundido>{contenido}</Fundido> : contenido}
        {clips.map((clip, i) => (
          <Sequence key={clip} from={inicios[i]} name={`Voz ${clip}`} layout="none">
            <Audio src={rutaAudio(clip)} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </EscenaContexto.Provider>
  );
};

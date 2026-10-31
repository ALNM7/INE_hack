import { Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { color, fuente, curva, duracion } from "../datos/marca";
import { subtitulosDe } from "../datos/subtitulos";
import { useEscena } from "../datos/tiempos";
import { RESPIRO } from "../datos/escenas";

const Bloque = ({ clip }: { clip: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { bloques } = subtitulosDe(clip);
  const activo = bloques.find((b) => t >= b.inicio && t < b.fin);
  if (!activo) return null;
  const desde = Math.round(activo.inicio * fps);
  const hasta = Math.round(activo.fin * fps);
  const corta = Math.round(duracion.corta * fps);
  const opacidad = interpolate(frame, [desde, desde + corta, hasta - corta, hasta], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curva.entrada,
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: opacidad,
      }}
    >
      {activo.lineas.map((linea) => (
        <div
          key={linea}
          style={{
            fontFamily: fuente.texto,
            fontWeight: fuente.peso.medio,
            fontSize: 36,
            lineHeight: 1.32,
            color: color.hueso,
            textShadow: `0 2px 12px ${color.noche1}, 0 0 2px ${color.noche1}`,
            whiteSpace: "nowrap",
          }}
        >
          {linea}
        </div>
      ))}
    </div>
  );
};

export const Subtitulos = () => {
  const { clips, inicios, duraciones } = useEscena();
  const { fps } = useVideoConfig();
  return (
    <>
      {clips.map((clip, i) => (
        <Sequence key={clip} from={inicios[i]} durationInFrames={i + 1 < inicios.length ? inicios[i + 1] - inicios[i] : Math.ceil((duraciones[i] + RESPIRO) * fps)} name={`Subtítulos ${clip}`}>
          <Bloque clip={clip} />
        </Sequence>
      ))}
    </>
  );
};

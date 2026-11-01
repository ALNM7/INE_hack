import { Audio, Series, interpolate, staticFile, useVideoConfig } from "remotion";
import { ESCENAS, MUSICA_BAJO_VOZ_DB, MUSICA_FINAL_DB, MUSICA_PAUSA_DB, MUSICA_RAMPA } from "./datos/escenas";
import { PropsEscena, PropsPitch, cuadrosEscena, inicioClips } from "./datos/tiempos";
import { curva, duracion } from "./datos/marca";
import musica from "./datos/musica.json";
import { Efecto } from "./compartidos/Efecto";
import { Escena01 } from "./escenas/Escena01";
import { Escena02 } from "./escenas/Escena02";
import { Escena03 } from "./escenas/Escena03";
import { Escena04 } from "./escenas/Escena04";
import { Escena05 } from "./escenas/Escena05";
import { Escena06 } from "./escenas/Escena06";
import { Escena07 } from "./escenas/Escena07";

export const componentesEscena: Record<string, React.FC<PropsEscena>> = { Escena01, Escena02, Escena03, Escena04, Escena05, Escena06, Escena07 };

const ganancia = (db: number) => Math.pow(10, db / 20);

const Musica = ({ archivo, voces, total }: { archivo: string; voces: [number, number][]; total: number }) => {
  const { fps } = useVideoConfig();
  const rampa = MUSICA_RAMPA * fps;
  const finVoz = voces[voces.length - 1][1];
  const recorte = Math.max(0, Math.round(musica.fin * fps) - total);
  const volumen = (f: number) => {
    const distancia = Math.min(...voces.map(([a, b]) => (f < a ? a - f : f > b ? f - b : 0)));
    const libre = interpolate(distancia, [0, rampa], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curva.escena });
    const techo = f > finVoz ? MUSICA_FINAL_DB : MUSICA_PAUSA_DB;
    const db = MUSICA_BAJO_VOZ_DB + (techo - MUSICA_BAJO_VOZ_DB) * libre;
    const entrada = interpolate(f, [0, duracion.encendido * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const salida = interpolate(f, [total - duracion.escena * fps, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return ganancia(db) * entrada * salida;
  };
  return <Audio src={staticFile(archivo)} trimBefore={recorte} volume={volumen} />;
};

export const Pitch = ({ escenas, musica: archivoMusica }: PropsPitch) => {
  const { fps, durationInFrames } = useVideoConfig();
  const cuadros = ESCENAS.map((definicion, i) => cuadrosEscena(definicion, escenas[i].duraciones, fps));
  const inicios = cuadros.map((_, i) => cuadros.slice(0, i).reduce((s, c) => s + c, 0));
  const voces = ESCENAS.flatMap((_, i) => {
    const clips = inicioClips(escenas[i].duraciones, fps);
    return clips.map((c, k) => [inicios[i] + c, inicios[i] + c + Math.round(escenas[i].duraciones[k] * fps)] as [number, number]);
  });
  return (
    <>
      <Series>
        {ESCENAS.map((definicion, i) => {
          const Componente = componentesEscena[definicion.id];
          return (
            <Series.Sequence key={definicion.id} durationInFrames={cuadros[i]} name={definicion.id}>
              <Componente {...escenas[i]} />
            </Series.Sequence>
          );
        })}
      </Series>
      {inicios.slice(1).map((inicio) => (
        <Efecto key={inicio} id="whoosh-medium-soft" en={inicio} />
      ))}
      {archivoMusica ? <Musica archivo={archivoMusica} voces={voces} total={durationInFrames} /> : null}
    </>
  );
};

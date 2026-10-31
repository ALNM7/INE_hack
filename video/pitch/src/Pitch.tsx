import { Audio, Series, staticFile, useVideoConfig } from "remotion";
import { ESCENAS, VOLUMEN_MUSICA } from "./datos/escenas";
import { PropsEscena, PropsPitch, cuadrosEscena } from "./datos/tiempos";
import { Escena01 } from "./escenas/Escena01";
import { Escena02 } from "./escenas/Escena02";
import { Escena03 } from "./escenas/Escena03";
import { Escena04 } from "./escenas/Escena04";
import { Escena05 } from "./escenas/Escena05";
import { Escena06 } from "./escenas/Escena06";
import { Escena07 } from "./escenas/Escena07";

export const componentesEscena: Record<string, React.FC<PropsEscena>> = { Escena01, Escena02, Escena03, Escena04, Escena05, Escena06, Escena07 };

export const Pitch = ({ escenas, musica }: PropsPitch) => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Series>
        {ESCENAS.map((definicion, i) => {
          const Componente = componentesEscena[definicion.id];
          return (
            <Series.Sequence key={definicion.id} durationInFrames={cuadrosEscena(definicion, escenas[i].duraciones, fps)} name={definicion.id}>
              <Componente {...escenas[i]} />
            </Series.Sequence>
          );
        })}
      </Series>
      {musica ? <Audio src={staticFile(musica)} volume={VOLUMEN_MUSICA} /> : null}
    </>
  );
};

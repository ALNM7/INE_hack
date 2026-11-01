import { Composition, Still } from "remotion";
import "./compartidos/Fuentes";
import { ALTO, ANCHO, ESCENAS, FPS } from "./datos/escenas";
import { metadatosEscena, metadatosPitch } from "./datos/tiempos";
import { Pitch, componentesEscena } from "./Pitch";
import { Miniatura } from "./Miniatura";
import musica from "./datos/musica.json";

export const Raiz = () => (
  <>
    <Composition id="Pitch" component={Pitch} durationInFrames={FPS} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ escenas: [], musica: musica.archivo }} calculateMetadata={metadatosPitch} />
    {ESCENAS.map((definicion) => (
      <Composition
        key={definicion.id}
        id={definicion.id}
        component={componentesEscena[definicion.id]}
        durationInFrames={FPS}
        fps={FPS}
        width={ANCHO}
        height={ALTO}
        defaultProps={{ duraciones: [], pantallas: {} }}
        calculateMetadata={metadatosEscena(definicion)}
      />
    ))}
    <Still id="Miniatura" component={Miniatura} width={1280} height={720} />
  </>
);

import { useCurrentFrame, useVideoConfig } from "remotion";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { CampoLuces } from "../compartidos/CampoLuces";
import { CifraProtagonista } from "../compartidos/CifraProtagonista";
import { avance, entra } from "../compartidos/movimiento";
import { color, fuente, duracion, curva } from "../datos/marca";
import { anioReciente, edadesJovenes, formato, nacional, fuenteDatos } from "../datos/cifras";
import { PropsEscena, usePalabra } from "../datos/tiempos";

const COLUMNAS = 40;
const FILAS = 25;

const Leyenda = ({ desde, resalte }: { desde: number; resalte: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elementos = [
    { tono: color.luz, texto: "Votó", inicio: desde },
    { tono: color.apagada, texto: "No votó", inicio: desde },
    { tono: color.hueso, texto: `No votó y tiene de ${edadesJovenes.desde} a ${edadesJovenes.hasta} años`, inicio: resalte },
  ];
  return (
    <div style={{ position: "absolute", left: 920, top: 806, display: "flex", gap: 32, fontFamily: fuente.mono, fontSize: 18, color: color.arena }}>
      {elementos.map((e) => (
        <div key={e.texto} style={{ display: "flex", alignItems: "center", gap: 10, ...entra(frame, e.inicio, Math.round(duracion.larga * fps), 6) }}>
          <span style={{ width: 12, height: 12, borderRadius: 99, background: e.tono }} />
          {e.texto}
        </div>
      ))}
    </div>
  );
};

const Contenido = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const cifra = palabra(1, "treinta");
  const finApagado = palabra(1, "votaron.", 1, "fin");
  const jovenes = palabra(1, "Una de cada tres");
  const datos = nacional[anioReciente];
  const votantes = datos.sv + datos.nv;
  const proporcionJovenes = nacional.abstencion_jovenes_2024 / nacional.abstencion_2024;
  const estado = {
    encendido: avance(frame, 0, Math.round(duracion.encendido * fps)),
    apagado: avance(frame, cifra, finApagado - cifra + Math.round(duracion.larga * fps), curva.escena),
    fraccionApagada: datos.nv / votantes,
    resaltado: avance(frame, jovenes, Math.round(duracion.larga * fps * 2)),
    fraccionResaltada: proporcionJovenes,
  };
  return (
    <>
      <Encabezado numero="01" titulo="Abstención" nota={`Fuente: ${fuenteDatos}`} />
      <CampoLuces columnas={COLUMNAS} filas={FILAS} separacion={22} radio={5.2} semilla="escena01" estado={estado} style={{ left: 920, top: 230 }} />
      <div style={{ position: "absolute", left: 920, top: 190, fontFamily: fuente.mono, fontSize: 18, color: color.ceniza, ...entra(frame, 0, Math.round(duracion.larga * fps), 6) }}>
        Cada luz representa a {formato.entero(Math.round(votantes / (COLUMNAS * FILAS)))} personas
      </div>
      <Leyenda desde={cifra} resalte={jovenes} />
      <CifraProtagonista
        desde={cifra}
        cifra={formato.millones(nacional.abstencion_2024)}
        unidad="millones"
        detalle={`personas con credencial no votaron en ${anioReciente}.`}
        style={{ left: 120, top: 250 }}
      />
      <CifraProtagonista
        desde={jovenes}
        cifra={formato.porcentaje(proporcionJovenes * 100)}
        tono={color.hueso}
        tamano={120}
        detalle={`de quienes no votaron tenía entre ${edadesJovenes.desde} y ${edadesJovenes.hasta} años: ${formato.millones(nacional.abstencion_jovenes_2024)} millones de personas.`}
        style={{ left: 120, top: 580 }}
      />
    </>
  );
};

export const Escena01 = ({ duraciones }: PropsEscena) => (
  <Escena clips={[1]} duraciones={duraciones}>
    <Contenido />
  </Escena>
);

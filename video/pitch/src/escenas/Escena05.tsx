import { Img, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { MarcoTelefono } from "../compartidos/MarcoTelefono";
import { avance } from "../compartidos/movimiento";
import { color, fuente, duracion, curva, nombreProyecto } from "../datos/marca";
import { Pantalla } from "../datos/escenas";
import { MedidaPantalla, PropsEscena, rutaCuadroFinal, rutaPantalla, useEscena, usePalabra } from "../datos/tiempos";

const VELOCIDAD_MINIMA = 0.6;
const VELOCIDAD_MAXIMA = 3;
const ALTO_TELEFONO = 840;
const ANCHO_RESPALDO = 0.46;

type Tramo = { pantalla: Pantalla; titulo: string; acto: number | null; desde: number; hasta: number };

const Grabacion = ({
  pantalla,
  medida,
  cuadros,
  salidaDesde,
  transicion,
  primera,
}: {
  pantalla: Pantalla;
  medida: MedidaPantalla | undefined;
  cuadros: number;
  salidaDesde: number;
  transicion: number;
  primera: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!medida) {
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fuente.mono, fontSize: 18, color: color.ceniza }}>
        Falta la grabación: {pantalla}
      </div>
    );
  }
  const cuadrosOriginales = medida.duracion * fps;
  const velocidad = Math.min(VELOCIDAD_MAXIMA, Math.max(VELOCIDAD_MINIMA, cuadrosOriginales / cuadros));
  const cuadrosVideo = Math.min(cuadros, Math.floor(cuadrosOriginales / velocidad) - 1);
  const entrada = primera ? 1 : avance(frame, 0, transicion, curva.escena);
  const salida = avance(frame, salidaDesde, transicion, curva.escena);
  const estilo = { position: "absolute" as const, inset: 0, width: "100%", height: "100%", objectFit: "cover" as const };
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: entrada,
        translate: `0px ${(1 - entrada) * 48}px`,
        scale: String(1 - salida * 0.04),
        filter: `brightness(${1 - salida * 0.5}) blur(${(1 - entrada) * 2 + salida * 2}px)`,
      }}
    >
      <Sequence durationInFrames={cuadrosVideo} layout="none">
        <OffthreadVideo src={rutaPantalla(pantalla)} playbackRate={velocidad} muted style={estilo} />
      </Sequence>
      <Sequence from={cuadrosVideo} layout="none">
        <Img src={rutaCuadroFinal(pantalla)} style={estilo} />
      </Sequence>
    </div>
  );
};

const Titulos = ({ tramos, transicion }: { tramos: Tramo[]; transicion: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const actos = tramos.filter((t) => t.acto !== null);
  const media = Math.round(duracion.larga * fps);
  return (
    <div style={{ position: "absolute", left: 120, top: 0, width: 880, height: 1080 }}>
      {tramos.map((t) => {
        const entrada = avance(frame, t.desde, media + transicion);
        const salida = avance(frame, t.hasta - transicion / 2, transicion, curva.salida);
        const esUltimo = t === tramos[tramos.length - 1];
        const visible = entrada * (esUltimo ? 1 : 1 - salida);
        return (
          <div key={t.pantalla} style={{ position: "absolute", left: 0, top: 330, opacity: visible, translate: `0px ${(1 - entrada) * 36 - (esUltimo ? 0 : salida * 24)}px` }}>
            <div style={{ fontFamily: fuente.mono, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: color.luz }}>
              {t.acto === null ? "Un sitio para el celular" : `Acto ${t.acto}`}
            </div>
            <div
              style={{
                marginTop: 18,
                fontFamily: fuente.titulo,
                fontStretch: fuente.estiramientoTitulo,
                fontWeight: fuente.peso.extra,
                fontSize: t.acto === null ? 112 : 132,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                color: color.hueso,
                maxWidth: t.acto === null ? 620 : 820,
              }}
            >
              {t.titulo}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 720, display: "flex", gap: 28, opacity: avance(frame, actos[0].desde, media) }}>
        {actos.map((t) => {
          const activo = frame >= t.desde - transicion / 2 && frame < t.hasta - transicion / 2;
          const pasado = frame >= t.hasta - transicion / 2;
          const brillo = activo ? 1 : pasado ? 0.5 : 0.28;
          return (
            <div key={t.pantalla} style={{ display: "flex", flexDirection: "column", gap: 12, opacity: brillo }}>
              <div style={{ width: 180, height: 4, borderRadius: 2, background: activo ? color.luz : color.arena }} />
              <div style={{ fontFamily: fuente.mono, fontSize: 18, color: activo ? color.luz : color.arena }}>{t.titulo}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Contenido = ({ pantallas }: { pantallas: PropsEscena["pantallas"] }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const palabra = usePalabra();
  const { inicios } = useEscena();
  const transicion = Math.round(duracion.larga * fps);
  const cortes = [0, palabra(5, "Primero"), inicios[1], palabra(6, "Y al final"), durationInFrames];
  const definiciones: Omit<Tramo, "desde" | "hasta">[] = [
    { pantalla: "hero", titulo: nombreProyecto, acto: null },
    { pantalla: "acto1", titulo: "Dibújalo tú", acto: 1 },
    { pantalla: "acto2", titulo: "Lo que se apagó", acto: 2 },
    { pantalla: "acto3", titulo: "Tu Wrapped", acto: 3 },
  ];
  const tramos: Tramo[] = definiciones.map((d, i) => ({ ...d, desde: cortes[i], hasta: cortes[i + 1] }));
  const proporcion = Object.values(pantallas).find(Boolean)?.proporcion ?? ANCHO_RESPALDO;
  const entradaTelefono = avance(frame, 0, Math.round(duracion.escena * fps), curva.entrada);
  return (
    <>
      <Encabezado numero="05" titulo="La propuesta" />
      <Titulos tramos={tramos} transicion={transicion} />
      <MarcoTelefono
        alto={ALTO_TELEFONO}
        proporcion={proporcion}
        style={{ left: 1180, top: 60, opacity: entradaTelefono, translate: `0px ${interpolate(entradaTelefono, [0, 1], [80, 0])}px` }}
      >
        {tramos.map((t, i) => {
          const desde = i === 0 ? 0 : Math.round(t.desde - transicion / 2);
          const fin = Math.round(t.hasta + transicion / 2);
          return (
            <Sequence key={t.pantalla} from={desde} durationInFrames={fin - desde} name={t.pantalla} layout="none">
              <Grabacion pantalla={t.pantalla} medida={pantallas[t.pantalla]} cuadros={fin - desde} salidaDesde={Math.round(t.hasta - transicion / 2) - desde} transicion={transicion} primera={i === 0} />
            </Sequence>
          );
        })}
      </MarcoTelefono>
    </>
  );
};

export const Escena05 = ({ duraciones, pantallas }: PropsEscena) => (
  <Escena clips={[5, 6]} duraciones={duraciones}>
    <Contenido pantallas={pantallas} />
  </Escena>
);

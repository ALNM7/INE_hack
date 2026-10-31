import { useCurrentFrame, useVideoConfig } from "remotion";
import { scaleLinear } from "d3-scale";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { Ejes, Lienzo, Marca } from "../compartidos/Grafica";
import { avance, entra } from "../compartidos/movimiento";
import { color, fuente, duracion, curva } from "../datos/marca";
import { cohorteCorta, cohorteLarga, cohortes, formato, fuenteDatos } from "../datos/cifras";
import { PropsEscena, usePalabra } from "../datos/tiempos";
import { EDAD_CONTRASTE } from "../datos/escenas";

const ANCHO = 1100;
const ALTO = 540;

const Tramo = ({ desde, hasta, progreso, tono, ancho }: { desde: [number, number]; hasta: [number, number]; progreso: number; tono: string; ancho: number }) => (
  <line
    x1={desde[0]}
    y1={desde[1]}
    x2={desde[0] + (hasta[0] - desde[0]) * progreso}
    y2={desde[1] + (hasta[1] - desde[1]) * progreso}
    stroke={tono}
    strokeWidth={ancho}
    strokeLinecap="round"
    opacity={progreso > 0 ? 1 : 0}
  />
);

const Contenido = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const edadInicial = cohortes.larga.filas[0][0];
  const larga = cohorteLarga(edadInicial);
  const filaContraste = EDAD_CONTRASTE;
  const corta = cohorteCorta(filaContraste);
  const anios = larga.map((p) => p.anio);
  const x = scaleLinear().domain([anios[0], anios[anios.length - 1]]).range([0, ANCHO]);
  const y = scaleLinear().domain([30, 90]).range([ALTO, 0]);
  const media = Math.round(duracion.larga * fps);
  const momentos = larga.map((p) => palabra(3, String(Math.round(p.valor))));
  const puntos = larga.map((p) => [x(p.anio), y(p.valor)] as [number, number]);
  const inicioContraste = palabra(3, "En cambio,");
  const igual = palabra(3, "igual");
  const puntosCorta = corta.map((p) => [x(p.anio), y(p.valor)] as [number, number]);
  const atenuar = avance(frame, inicioContraste, media);
  return (
    <>
      <Encabezado numero="03" titulo="Una generación" nota={`Fuente: ${fuenteDatos}`} />
      <Lienzo izquierda={220} arriba={260}>
        <Ejes
          ancho={ANCHO}
          alto={ALTO}
          ticksY={y.ticks(5)}
          y={y}
          ticksX={anios}
          x={x}
          etiquetaY="% que votó"
          etiquetaX={(v) => `${v}`}
          opacidad={avance(frame, 0, media)}
        />
        <g opacity={1 - atenuar * 0.45}>
          {puntos.slice(1).map((p, i) => (
            <Tramo key={i} desde={puntos[i]} hasta={p} progreso={avance(frame, momentos[i + 1] - media, media, curva.escena)} tono={color.luz} ancho={6} />
          ))}
          {larga.map((p, i) => (
            <Marca
              key={p.anio}
              cx={puntos[i][0]}
              cy={puntos[i][1]}
              valor={formato.porcentaje(p.valor)}
              leyenda={`${p.edad} años`}
              arriba={i === 0}
              alinear={i === 0 ? "start" : "middle"}
              progreso={avance(frame, momentos[i], media)}
            />
          ))}
        </g>
        <Tramo desde={puntosCorta[0]} hasta={puntosCorta[1]} progreso={avance(frame, igual - media, media * 2, curva.escena)} tono={color.hueso} ancho={6} />
        {corta.map((p, i) => (
          <Marca
            key={`c${p.anio}`}
            cx={puntosCorta[i][0]}
            cy={puntosCorta[i][1]}
            valor={formato.porcentaje(p.valor)}
            leyenda={`${p.edad} años`}
            arriba
            tono={color.hueso}
            progreso={avance(frame, i === 0 ? inicioContraste + media : igual + media, media)}
          />
        ))}
      </Lienzo>
      <div style={{ position: "absolute", left: 1460, top: 300, width: 380, fontFamily: fuente.texto, fontSize: 28, lineHeight: 1.35 }}>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline", color: color.hueso, ...entra(frame, palabra(3, "Quienes"), media, 12) }}>
          <span style={{ flex: "none", width: 28, height: 6, borderRadius: 3, background: color.luz, translate: "0 -6px" }} />
          <span>
            Tenían {edadInicial} años en {anios[0]}
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 28, color: color.hueso, ...entra(frame, inicioContraste, media, 12) }}>
          <span style={{ flex: "none", width: 28, height: 6, borderRadius: 3, background: color.hueso, translate: "0 -6px" }} />
          <span>
            Tenían {filaContraste} años en {corta[0].anio}
          </span>
        </div>
      </div>
    </>
  );
};

export const Escena03 = ({ duraciones }: PropsEscena) => (
  <Escena clips={[3]} duraciones={duraciones}>
    <Contenido />
  </Escena>
);

import { useCurrentFrame, useVideoConfig } from "remotion";
import { scaleLinear } from "d3-scale";
import { line, curveMonotoneX } from "d3-shape";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { Ejes, Lienzo, Marca } from "../compartidos/Grafica";
import { avance } from "../compartidos/movimiento";
import { color, fuente, duracion, curva } from "../datos/marca";
import { anioReciente, edadExacta, edadesClave, formato, participacionPorEdad, fuenteDatos } from "../datos/cifras";
import { PropsEscena, usePalabra } from "../datos/tiempos";

const ANCHO = 1560;
const ALTO = 560;

const Contenido = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const edades = edadExacta.edades;
  const serie = edadExacta[anioReciente];
  const x = scaleLinear().domain([edades[0], edades[edades.length - 1]]).range([0, ANCHO]);
  const y = scaleLinear().domain([0, 100]).range([ALTO, 0]);
  const ruta = line<number>()
    .x((_, i) => x(edades[i]))
    .y((v) => y(v))
    .curve(curveMonotoneX)(serie)!;
  const inicioCurva = palabra(2, "Pero");
  const finCurva = palabra(2, "edad.", 1, "fin");
  const dibujo = avance(frame, inicioCurva, finCurva - inicioCurva, curva.escena);
  const larga = Math.round(duracion.larga * fps);
  const clave = edadesClave();
  const marcas = [
    { edad: clave.primera, momento: palabra(2, `${clave.primera}`), arriba: true, inicio: true },
    { edad: clave.minima, momento: palabra(2, `${clave.minima}`), arriba: false },
    { edad: clave.maxima, momento: palabra(2, `${clave.maxima},`), arriba: true },
  ];
  return (
    <>
      <Encabezado numero="02" titulo="Participación por edad" nota={`Fuente: ${fuenteDatos}`} />
      <Lienzo izquierda={220} arriba={250}>
        <Ejes
          ancho={ANCHO}
          alto={ALTO}
          ticksY={y.ticks(4)}
          y={y}
          ticksX={x.ticks(8)}
          x={x}
          etiquetaY={`% que votó en ${anioReciente}`}
          etiquetaX={(v) => `${v}`}
          opacidad={avance(frame, 0, larga)}
        />
        <text x={ANCHO} y={ALTO + 40 + 32} textAnchor="end" fontFamily={fuente.mono} fontSize={18} fill={color.ceniza} opacity={avance(frame, 0, larga)}>
          Edad
        </text>
        <path d={ruta} pathLength={1} fill="none" stroke={color.luz} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - dibujo} />
        {marcas.map((m) => {
          const valor = participacionPorEdad(m.edad);
          return (
            <Marca
              key={m.edad}
              cx={x(m.edad)}
              cy={y(valor)}
              valor={formato.porcentaje(valor)}
              leyenda={`${m.edad} años`}
              arriba={m.arriba}
              alinear={"inicio" in m ? "start" : "middle"}
              progreso={avance(frame, m.momento, larga, curva.entrada)}
            />
          );
        })}
      </Lienzo>
    </>
  );
};

export const Escena02 = ({ duraciones }: PropsEscena) => (
  <Escena clips={[2]} duraciones={duraciones}>
    <Contenido />
  </Escena>
);

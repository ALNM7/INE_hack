import { useMemo } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { avance, entra } from "../compartidos/movimiento";
import { estadosGeo, proyectar, puntosEnEstado } from "../compartidos/mapa";
import { color, fuente, duracion, curva, nombreProyecto } from "../datos/marca";
import { estados, focos, formato, meta } from "../datos/cifras";
import { EQUIPO, SECCIONES_POR_FOCO, URL_REPO, URL_SITIO } from "../datos/escenas";
import { PropsEscena, useEscena, usePalabra } from "../datos/tiempos";

const ANCHO_MAPA = 1240;
const ALTO_MAPA = 820;

const Mapa = ({ desde, hasta, atenuar }: { desde: number; hasta: number; atenuar: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { ruta, proyeccion } = proyectar(ANCHO_MAPA, ALTO_MAPA);
  const puntos = useMemo(
    () =>
      estados.estados
        .flatMap((e) => puntosEnEstado(e.c, Math.round(e.focos / SECCIONES_POR_FOCO), "focos").map((p) => ({ p, c: e.c })))
        .map((d, i) => ({ ...d, xy: proyeccion(d.p)!, orden: random(`foco-orden-${i}`), fase: random(`foco-fase-${i}`) * Math.PI * 2 })),
    [proyeccion]
  );
  const encendido = avance(frame, desde, hasta - desde, curva.escena);
  const media = Math.round(duracion.media * fps);
  return (
    <svg width={ANCHO_MAPA} height={ALTO_MAPA} style={{ position: "absolute", left: 600, top: 120, overflow: "visible", opacity: 1 - atenuar * 0.72 }}>
      {estadosGeo.features.map((f) => (
        <path key={f.properties.c} d={ruta(f) ?? undefined} fill={color.noche2} stroke={color.nocheLinea} strokeWidth={1.2} />
      ))}
      {puntos.map((d, i) => {
        const momento = desde + d.orden * (hasta - desde) * 0.92;
        const p = encendido > 0 ? avance(frame, momento, media, curva.entrada) : 0;
        const respiro = 0.85 + 0.15 * Math.sin((frame / fps) * 1.4 + d.fase);
        return (
          <g key={i} opacity={p}>
            <circle cx={d.xy[0]} cy={d.xy[1]} r={9} fill={color.luzHalo} opacity={0.5 * respiro} />
            <circle cx={d.xy[0]} cy={d.xy[1]} r={3.2} fill={color.luz} opacity={respiro} />
          </g>
        );
      })}
    </svg>
  );
};

const Contenido = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const { inicios } = useEscena();
  const larga = Math.round(duracion.larga * fps);
  const finVotar = palabra(8, "votar.", 1, "fin");
  const cierre = inicios[1];
  const atenuar = avance(frame, cierre - larga, larga * 2, curva.escena);
  const salidaTexto = 1 - avance(frame, cierre - larga, larga, curva.salida);
  const puntosTotales = estados.estados.reduce((s, e) => s + Math.round(e.focos / SECCIONES_POR_FOCO), 0);
  return (
    <>
      <div style={{ opacity: salidaTexto }}>
        <Encabezado numero="07" titulo="Focos encendidos" nota={`Fuente: ${meta.fuente}`} />
      </div>
      <Mapa desde={palabra(8, "hay")} hasta={finVotar} atenuar={atenuar} />
      <div style={{ position: "absolute", left: 120, top: 260, width: 560, opacity: salidaTexto }}>
        <div style={{ ...entra(frame, palabra(8, "15"), larga, 24) }}>
          <div style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.extra, fontSize: 168, lineHeight: 0.9, letterSpacing: "-0.04em", color: color.luz }}>
            {formato.entero(focos.total)}
          </div>
          <div style={{ marginTop: 20, fontFamily: fuente.texto, fontSize: 30, lineHeight: 1.35, color: color.arena }}>
            secciones donde votó {formato.porcentaje(focos.umbral)} o más de las personas jóvenes.
          </div>
        </div>
        <div style={{ marginTop: 40, fontFamily: fuente.mono, fontSize: 18, color: color.ceniza, ...entra(frame, palabra(8, "secciones"), larga, 8) }}>
          Cada luz representa {SECCIONES_POR_FOCO} secciones ({formato.entero(puntosTotales)} luces)
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.extra, fontSize: 150, lineHeight: 0.9, letterSpacing: "-0.04em", color: color.hueso, ...entra(frame, cierre, larga * 2, 32) }}>
          {nombreProyecto}
        </div>
        <div style={{ marginTop: 44, fontFamily: fuente.mono, fontSize: 30, color: color.luz, ...entra(frame, cierre + larga, larga, 12) }}>{URL_SITIO.replace(/^https:\/\//, "")}</div>
        <div style={{ marginTop: 14, fontFamily: fuente.mono, fontSize: 24, color: color.arena, ...entra(frame, cierre + larga * 2, larga, 12) }}>{URL_REPO.replace(/^https:\/\//, "")}</div>
        <div style={{ marginTop: 56, fontFamily: fuente.texto, fontSize: 30, color: color.hueso, ...entra(frame, cierre + larga * 3, larga, 12) }}>
          {EQUIPO.slice(0, -1).join(", ")} y {EQUIPO[EQUIPO.length - 1]}
        </div>
      </div>
    </>
  );
};

export const Escena07 = ({ duraciones }: PropsEscena) => (
  <Escena clips={[8, 9]} duraciones={duraciones}>
    <Contenido />
  </Escena>
);

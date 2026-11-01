import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { scaleQuantize } from "d3-scale";
import { geoCentroid } from "d3-geo";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { Efecto } from "../compartidos/Efecto";
import { CifraProtagonista } from "../compartidos/CifraProtagonista";
import { avance, entra, entraYSale } from "../compartidos/movimiento";
import { estadosGeo, proyectar } from "../compartidos/mapa";
import { color, fuente, duracion, curva, escalaSecuencial } from "../datos/marca";
import { anioReciente, estadoPorNombre, estados, formato, grupoNacional, rangoTexto, fuenteDatos } from "../datos/cifras";
import { ESTADOS_CONTRASTE, GRUPO_BRECHA } from "../datos/escenas";
import { PropsEscena, usePalabra } from "../datos/tiempos";

const LADO = 10;

const Rejilla = ({ valor, tono, momento, semilla }: { valor: number; tono: string; momento: number; semilla: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const encendidas = Math.round(valor);
  const paso = 40;
  return (
    <svg width={LADO * paso} height={LADO * paso} style={{ overflow: "visible" }}>
      {Array.from({ length: LADO * LADO }, (_, i) => {
        const cx = (i % LADO) * paso + paso / 2;
        const cy = (LADO - 1 - Math.floor(i / LADO)) * paso + paso / 2;
        const enciende = i < encendidas;
        const p = enciende ? avance(frame, momento + Math.round((i / encendidas) * duracion.escena * fps + random(`${semilla}-${i}`) * 4), Math.round(duracion.media * fps)) : 0;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={8} fill={color.apagada} opacity={0.6} />
            {enciende ? <circle cx={cx} cy={cy} r={18} fill={tono} opacity={0.18 * p} /> : null}
            {enciende ? <circle cx={cx} cy={cy} r={8 + p * 2} fill={tono} opacity={p} /> : null}
          </g>
        );
      })}
    </svg>
  );
};

const Brecha = ({ hasta }: { hasta: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const grupo = grupoNacional(GRUPO_BRECHA);
  const momentoMujeres = palabra(4, String(Math.round(grupo.mujeres)));
  const momentoHombres = palabra(4, String(Math.round(grupo.hombres)));
  const media = Math.round(duracion.larga * fps);
  const columnas = [
    { titulo: "Mujeres", valor: grupo.mujeres, tono: color.mujeres, momento: momentoMujeres, izquierda: 260 },
    { titulo: "Hombres", valor: grupo.hombres, tono: color.hombres, momento: momentoHombres, izquierda: 1060 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, ...entraYSale(frame, 0, hasta, media, 0) }}>
      <Efecto id="tone-ding-mid" en={momentoMujeres} />
      <Efecto id="tone-ding-low" en={momentoHombres} />
      <div style={{ position: "absolute", left: 260, top: 170, fontFamily: fuente.mono, fontSize: 22, color: color.arena, letterSpacing: "0.04em" }}>
        Participación de {rangoTexto(GRUPO_BRECHA)} años, {anioReciente}
      </div>
      {columnas.map((c) => (
        <div key={c.titulo} style={{ position: "absolute", left: c.izquierda, top: 250, display: "flex", gap: 56, alignItems: "flex-end" }}>
          <Rejilla valor={c.valor} tono={c.tono} momento={c.momento} semilla={c.titulo} />
          <div style={{ paddingBottom: 6 }}>
            <div style={{ fontFamily: fuente.mono, fontSize: 22, color: color.arena, textTransform: "uppercase", letterSpacing: "0.12em", ...entra(frame, c.momento, media, 8) }}>{c.titulo}</div>
            <div
              style={{
                fontFamily: fuente.titulo,
                fontStretch: fuente.estiramientoTitulo,
                fontWeight: fuente.peso.extra,
                fontSize: 120,
                lineHeight: 1,
                color: c.tono,
                ...entra(frame, c.momento, media, 24),
              }}
            >
              {formato.porcentaje(c.valor)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ANCHO_MAPA = 1060;
const ALTO_MAPA = 700;

const Mapa = ({ desde }: { desde: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const media = Math.round(duracion.larga * fps);
  const { ruta, proyeccion } = proyectar(ANCHO_MAPA, ALTO_MAPA);
  const valores = estados.estados.map((e) => e.jovenes_18_24[anioReciente]);
  const escala = scaleQuantize<string>().domain([Math.min(...valores), Math.max(...valores)]).range(escalaSecuencial.slice(3));
  const destacados = ESTADOS_CONTRASTE.map((nombre) => ({ estado: estadoPorNombre(nombre), momento: palabra(4, nombre) }));
  const relleno = avance(frame, desde, Math.round(duracion.escena * fps));
  return (
    <>
      <svg width={ANCHO_MAPA} height={ALTO_MAPA} style={{ position: "absolute", left: 760, top: 170, overflow: "visible", ...entra(frame, desde, media, 20) }}>
        {estadosGeo.features.map((f) => {
          const dato = estados.estados.find((e) => e.c === f.properties.c)!;
          const resaltado = destacados.find((d) => d.estado.c === f.properties.c);
          const enfasis = resaltado ? avance(frame, resaltado.momento, media) : 0;
          const orden = random(`mapa-${f.properties.c}`) * 0.5;
          const visible = Math.min(1, Math.max(0, (relleno - orden) / 0.5));
          return (
            <path
              key={f.properties.c}
              d={ruta(f) ?? undefined}
              fill={escala(dato.jovenes_18_24[anioReciente])}
              fillOpacity={visible * (destacados.some((d) => frame >= d.momento) && !resaltado ? 0.55 : 1)}
              stroke={enfasis > 0 ? color.hueso : color.noche1}
              strokeWidth={1 + enfasis * 3}
            />
          );
        })}
        {destacados.map(({ estado, momento }) => {
          const f = estadosGeo.features.find((g) => g.properties.c === estado.c)!;
          const [cx, cy] = proyeccion(geoCentroid(f))!;
          const p = avance(frame, momento, media);
          return (
            <g key={estado.c} opacity={p}>
              <circle cx={cx} cy={cy} r={8} fill={color.hueso} />
              <circle cx={cx} cy={cy} r={20 * p} fill="none" stroke={color.hueso} strokeWidth={2} opacity={0.6} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 120, top: 170, fontFamily: fuente.mono, fontSize: 22, color: color.arena, letterSpacing: "0.04em", ...entra(frame, desde, media, 8) }}>
        Votaron de 18 a 24 años, {anioReciente}
      </div>
      {destacados.map(({ estado, momento }, i) => (
        <CifraProtagonista
          key={estado.c}
          desde={momento}
          cifra={formato.porcentaje(estado.jovenes_18_24[anioReciente])}
          detalle={estado.n}
          tamano={150}
          tono={escala(estado.jovenes_18_24[anioReciente])}
          style={{ left: 120, top: 250 + i * 290 }}
        />
      ))}
      <div style={{ position: "absolute", left: 120, top: 840, display: "flex", alignItems: "center", gap: 12, fontFamily: fuente.mono, fontSize: 18, color: color.ceniza, ...entra(frame, desde, media, 6) }}>
        <span>{formato.porcentaje(Math.min(...valores))}</span>
        {escala.range().map((c) => (
          <span key={c} style={{ width: 34, height: 12, background: c }} />
        ))}
        <span>{formato.porcentaje(Math.max(...valores))}</span>
      </div>
    </>
  );
};

const Contenido = () => {
  const palabra = usePalabra();
  const momentoMapa = palabra(4, ESTADOS_CONTRASTE[0]);
  return (
    <>
      <Encabezado numero="04" titulo="No se apaga igual" nota={`Fuente: ${fuenteDatos}`} />
      <Efecto id="whoosh-slow-medium" en={momentoMapa} />
      <Brecha hasta={momentoMapa} />
      <Mapa desde={momentoMapa} />
    </>
  );
};

export const Escena04 = ({ duraciones }: PropsEscena) => (
  <Escena clips={[4]} duraciones={duraciones}>
    <Contenido />
  </Escena>
);

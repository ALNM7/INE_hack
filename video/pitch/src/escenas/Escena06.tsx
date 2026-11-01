import { CSSProperties, ReactNode } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { scaleLinear } from "d3-scale";
import { Escena } from "../compartidos/Escena";
import { Encabezado } from "../compartidos/Encabezado";
import { Efecto, IdEfecto } from "../compartidos/Efecto";
import { Qr } from "../compartidos/Qr";
import { avance, entra } from "../compartidos/movimiento";
import { color, fuente, duracion, curva, nombreProyecto } from "../datos/marca";
import { anioAnterior, anioReciente, fichaMunicipio, formato, fuenteDatos, totalMunicipios } from "../datos/cifras";
import { MUNICIPIO_FICHA, PROXIMA_ELECCION, URL_SITIO } from "../datos/escenas";
import { PropsEscena, usePalabra } from "../datos/tiempos";

const CARTA = { ancho: 816, alto: 1056 };
const ESCALA = 0.78;

const Bloque = ({ desde, children, style }: { desde: number; children: ReactNode; style?: CSSProperties }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={{ ...entra(frame, desde, Math.round(duracion.larga * fps), 10), ...style }}>{children}</div>;
};

const Etiqueta = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{ fontFamily: fuente.mono, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: color.tinta3, ...style }}>{children}</div>
);

const Dato = ({ etiqueta, valor, tono = color.tinta1 }: { etiqueta: string; valor: string; tono?: string }) => (
  <div style={{ flex: 1, borderTop: `1px solid ${color.papelLinea}`, paddingTop: 14 }}>
    <Etiqueta>{etiqueta}</Etiqueta>
    <div style={{ marginTop: 6, fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.extra, fontSize: 60, lineHeight: 1, color: tono, letterSpacing: "-0.02em" }}>{valor}</div>
  </div>
);

const Seccion = ({ etiqueta, seccion, tono }: { etiqueta: string; seccion: number[] | null; tono: string }) => (
  <div style={{ flex: 1, background: color.papel2, borderRadius: 6, padding: "16px 20px" }}>
    <Etiqueta>{etiqueta}</Etiqueta>
    {seccion ? (
      <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 14 }}>
        <span style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.extra, fontSize: 44, color: tono }}>{formato.porcentaje(seccion[1])}</span>
        <span style={{ fontSize: 18, color: color.tinta2 }}>sección {seccion[0]}</span>
      </div>
    ) : (
      <div style={{ marginTop: 8, fontSize: 18, color: color.tinta2 }}>Sin secciones suficientes</div>
    )}
  </div>
);

const Ficha = ({ desde }: { desde: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = fichaMunicipio(MUNICIPIO_FICHA.municipio);
  const paso = Math.round(duracion.media * fps);
  const entrada = avance(frame, desde, Math.round(duracion.escena * fps), curva.entrada);
  const alto = scaleLinear().domain([0, 100]).range([0, 150]);
  const url = `${URL_SITIO}ficha/${MUNICIPIO_FICHA.estado}/${MUNICIPIO_FICHA.municipio}`;
  return (
    <div
      style={{
        position: "absolute",
        left: 1120,
        top: 80,
        width: CARTA.ancho,
        height: CARTA.alto,
        transformOrigin: "top left",
        scale: String(ESCALA * (0.96 + 0.04 * entrada)),
        rotate: `${(1 - entrada) * -2}deg`,
        translate: `0px ${(1 - entrada) * 80}px`,
        opacity: entrada,
        background: color.papel1,
        borderRadius: 4,
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        padding: "52px 60px",
        boxSizing: "border-box",
        color: color.tinta1,
        fontFamily: fuente.texto,
      }}
    >
      <Bloque desde={desde + paso} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <Etiqueta>Ficha municipal de participación</Etiqueta>
        <Etiqueta>{nombreProyecto}</Etiqueta>
      </Bloque>
      <Bloque desde={desde + paso * 2} style={{ marginTop: 24 }}>
        <div style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.extra, fontSize: 76, lineHeight: 0.95, letterSpacing: "-0.03em" }}>
          {m.n}, {m.estado}
        </div>
        <div style={{ marginTop: 12, fontSize: 18, color: color.tinta2 }}>
          {formato.entero(m.ln)} personas en la lista nominal, {formato.entero(m.secciones)} secciones electorales
        </div>
      </Bloque>
      <Bloque desde={desde + paso * 3} style={{ marginTop: 32, display: "flex", gap: 28 }}>
        <Dato etiqueta={`Participación ${anioReciente}`} valor={formato.porcentaje(m.p2024)} tono={color.luzTinta} />
        <Dato etiqueta={`Participación ${anioAnterior}`} valor={m.p2018 === null ? "Sin dato" : formato.porcentaje(m.p2018)} />
        <Dato etiqueta="Jóvenes" valor={formato.porcentaje(m.jovenes)} />
      </Bloque>
      <Bloque desde={desde + paso * 4} style={{ marginTop: 32 }}>
        <Etiqueta>Participación por grupo de edad, {anioReciente}</Etiqueta>
        <div style={{ marginTop: 14, display: "flex", alignItems: "flex-end", gap: 10, height: 190 }}>
          {m.etiquetas.map((g, i) => {
            const v = m.grupos.t[i];
            const crece = avance(frame, desde + paso * 4 + i * 2, Math.round(duracion.larga * fps), curva.entrada);
            return (
              <div key={g} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontFamily: fuente.mono, fontSize: 12, color: color.tinta2, opacity: crece }}>{v === null ? "" : formato.decimal(v)}</div>
                <div style={{ width: "100%", height: v === null ? 2 : alto(v) * crece, background: i < 3 ? color.luzPapel : color.apagadaPapel, borderRadius: "3px 3px 0 0" }} />
                <div style={{ fontFamily: fuente.mono, fontSize: 12, color: color.tinta3 }}>{g}</div>
              </div>
            );
          })}
        </div>
      </Bloque>
      <Bloque desde={desde + paso * 5} style={{ marginTop: 30, display: "flex", gap: 16 }}>
        <Seccion etiqueta="Sección con mayor participación" seccion={m.seccion_max} tono={color.luzTinta} />
        <Seccion etiqueta="Sección con menor participación" seccion={m.seccion_min} tono={color.tinta1} />
      </Bloque>
      <Bloque desde={desde + paso * 6} style={{ position: "absolute", left: 60, right: 60, bottom: 48, display: "flex", gap: 22, alignItems: "center", borderTop: `1px solid ${color.papelLinea}`, paddingTop: 20 }}>
        <Qr texto={url} lado={104} tinta={color.tinta1} fondo={color.papel1} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: fuente.peso.semi }}>Genera la ficha de tu municipio</div>
          <div style={{ marginTop: 4, fontFamily: fuente.mono, fontSize: 13, color: color.tinta2 }}>{url}</div>
          <div style={{ marginTop: 10, fontFamily: fuente.mono, fontSize: 12, color: color.tinta3 }}>Fuente: {fuenteDatos}</div>
        </div>
      </Bloque>
    </div>
  );
};

const Mensajes = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palabra = usePalabra();
  const larga = Math.round(duracion.larga * fps);
  const total = formato.entero(totalMunicipios());
  const lineas = [
    { texto: "Datos abiertos", momento: palabra(7, "datos abiertos") },
    { texto: "Sin servidor", momento: palabra(7, "servidor") },
    { texto: `Lista para ${PROXIMA_ELECCION}`, momento: palabra(7, `${PROXIMA_ELECCION}.`) },
  ];
  return (
    <div style={{ position: "absolute", left: 120, top: 220, width: 860 }}>
      <div style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.extra, fontSize: 84, lineHeight: 0.98, letterSpacing: "-0.03em", color: color.hueso, ...entra(frame, palabra(7, "Genera"), larga, 24) }}>
        Una ficha imprimible para cada uno de los <span style={{ color: color.luz }}>{total}</span> municipios
      </div>
      <div style={{ marginTop: 22, fontSize: 30, fontFamily: fuente.texto, color: color.arena, ...entra(frame, palabra(7, "pensada"), larga, 12) }}>Pensada para pláticas en escuelas.</div>
      {lineas.map((l, i) => (
        <Efecto key={l.texto} id={`tone-step-${i + 1}` as IdEfecto} en={l.momento} />
      ))}
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 18 }}>
        {lineas.map((l) => (
          <div key={l.texto} style={{ display: "flex", alignItems: "center", gap: 18, ...entra(frame, l.momento, larga, 16) }}>
            <span style={{ width: 14, height: 14, borderRadius: 99, background: color.luz, boxShadow: `0 0 16px ${color.luzHalo}` }} />
            <span style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.semi, fontSize: 52, color: color.hueso }}>{l.texto}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Contenido = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Encabezado numero="06" titulo="Para el INE" />
      <Efecto id="foley-paper-slide" en={Math.round(duracion.media * fps)} />
      <Ficha desde={Math.round(duracion.media * fps)} />
      <Mensajes />
    </>
  );
};

export const Escena06 = ({ duraciones }: PropsEscena) => (
  <Escena clips={[7]} duraciones={duraciones}>
    <Contenido />
  </Escena>
);

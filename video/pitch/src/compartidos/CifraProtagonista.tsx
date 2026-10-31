import { CSSProperties } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { color, fuente, duracion } from "../datos/marca";
import { entra } from "./movimiento";

export const CifraProtagonista = ({
  desde,
  cifra,
  unidad,
  detalle,
  tono = color.luz,
  tamano = 200,
  style,
}: {
  desde: number;
  cifra: string;
  unidad?: string;
  detalle?: string;
  tono?: string;
  tamano?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cuadros = Math.round(duracion.larga * fps * 1.6);
  return (
    <div style={{ position: "absolute", ...style }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 20, ...entra(frame, desde, cuadros, 32) }}>
        <span
          style={{
            fontFamily: fuente.titulo,
            fontStretch: fuente.estiramientoTitulo,
            fontWeight: fuente.peso.extra,
            fontSize: tamano,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            color: tono,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {cifra}
        </span>
        {unidad ? (
          <span style={{ fontFamily: fuente.titulo, fontStretch: fuente.estiramientoTitulo, fontWeight: fuente.peso.semi, fontSize: tamano * 0.3, color: color.hueso }}>{unidad}</span>
        ) : null}
      </div>
      {detalle ? (
        <div
          style={{
            marginTop: 20,
            maxWidth: 640,
            fontFamily: fuente.texto,
            fontSize: 30,
            lineHeight: 1.35,
            color: color.arena,
            ...entra(frame, desde + Math.round(duracion.media * fps), cuadros, 16),
          }}
        >
          {detalle}
        </div>
      ) : null}
    </div>
  );
};

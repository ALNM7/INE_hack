import { useCurrentFrame, useVideoConfig } from "remotion";
import { color, fuente, duracion } from "../datos/marca";
import { entra } from "./movimiento";

export const Encabezado = ({ numero, titulo, nota }: { numero: string; titulo: string; nota?: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 72,
        left: 120,
        right: 120,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        fontFamily: fuente.mono,
        fontSize: 20,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        ...entra(frame, 0, Math.round(duracion.larga * fps), 8),
      }}
    >
      <div style={{ display: "flex", gap: 16, alignItems: "center", color: color.luz }}>
        <span style={{ width: 10, height: 10, borderRadius: 999, background: color.luz, boxShadow: `0 0 14px ${color.luzHalo}` }} />
        <span>{numero}</span>
        <span style={{ color: color.arena }}>{titulo}</span>
      </div>
      {nota ? <div style={{ color: color.ceniza, fontSize: 16, letterSpacing: "0.04em", textTransform: "none" }}>{nota}</div> : null}
    </div>
  );
};

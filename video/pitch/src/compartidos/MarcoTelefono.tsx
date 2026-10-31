import { CSSProperties, ReactNode } from "react";
import { color } from "../datos/marca";

export const MarcoTelefono = ({ alto, proporcion, children, style }: { alto: number; proporcion: number; children: ReactNode; style?: CSSProperties }) => {
  const borde = Math.round(alto * 0.018);
  const pantallaAlto = alto - borde * 2;
  const pantallaAncho = Math.round(pantallaAlto * proporcion);
  const radioExterior = Math.round(alto * 0.07);
  return (
    <div
      style={{
        position: "absolute",
        width: pantallaAncho + borde * 2,
        height: alto,
        borderRadius: radioExterior,
        background: color.noche3,
        border: `1.5px solid ${color.nocheLinea}`,
        boxShadow: `0 40px 90px rgba(0,0,0,0.45)`,
        padding: borde,
        boxSizing: "border-box",
        ...style,
      }}
    >
      <div style={{ position: "relative", width: pantallaAncho, height: pantallaAlto, borderRadius: radioExterior - borde, overflow: "hidden", background: color.noche1 }}>
        {children}
      </div>
    </div>
  );
};

import { ReactNode } from "react";
import { color, fuente } from "../datos/marca";

export const Ejes = ({
  ancho,
  alto,
  ticksY,
  y,
  ticksX,
  x,
  etiquetaY,
  etiquetaX,
  opacidad,
}: {
  ancho: number;
  alto: number;
  ticksY: number[];
  y: (v: number) => number;
  ticksX: number[];
  x: (v: number) => number;
  etiquetaY: string;
  etiquetaX: (v: number) => string;
  opacidad: number;
}) => (
  <g opacity={opacidad}>
    {ticksY.map((t) => (
      <g key={`y${t}`}>
        <line x1={0} x2={ancho} y1={y(t)} y2={y(t)} stroke={color.nocheLinea} strokeWidth={1} />
        <text x={-18} y={y(t) + 6} textAnchor="end" fontFamily={fuente.mono} fontSize={18} fill={color.ceniza}>
          {t}
        </text>
      </g>
    ))}
    {ticksX.map((t) => (
      <text key={`x${t}`} x={x(t)} y={alto + 40} textAnchor="middle" fontFamily={fuente.mono} fontSize={18} fill={color.ceniza}>
        {etiquetaX(t)}
      </text>
    ))}
    <text x={0} y={-28} fontFamily={fuente.mono} fontSize={18} fill={color.arena}>
      {etiquetaY}
    </text>
  </g>
);

export const Lienzo = ({ izquierda, arriba, children }: { izquierda: number; arriba: number; children: ReactNode }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <g transform={`translate(${izquierda},${arriba})`}>{children}</g>
  </svg>
);

export const Marca = ({
  cx,
  cy,
  valor,
  leyenda,
  progreso,
  arriba = true,
  tono = color.luz,
}: {
  cx: number;
  cy: number;
  valor: string;
  leyenda: string;
  progreso: number;
  arriba?: boolean;
  tono?: string;
}) => {
  const dy = arriba ? -1 : 1;
  return (
    <g opacity={progreso}>
      <circle cx={cx} cy={cy} r={22 * (0.6 + 0.4 * progreso)} fill={tono} opacity={0.18} />
      <circle cx={cx} cy={cy} r={9} fill={color.noche1} stroke={tono} strokeWidth={4} />
      <g transform={`translate(${cx},${cy + dy * (64 + (1 - progreso) * 14)})`}>
        <text textAnchor="middle" y={arriba ? 0 : 36} fontFamily={fuente.titulo} fontStretch={fuente.estiramientoTitulo} fontWeight={fuente.peso.extra} fontSize={64} fill={tono}>
          {valor}
        </text>
        <text textAnchor="middle" y={arriba ? -58 : 70} fontFamily={fuente.mono} fontSize={20} fill={color.arena}>
          {leyenda}
        </text>
      </g>
    </g>
  );
};

import { CSSProperties, useMemo } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { color } from "../datos/marca";

export type EstadoLuces = {
  encendido: number;
  apagado: number;
  fraccionApagada: number;
  resaltado: number;
  fraccionResaltada: number;
};

export const CampoLuces = ({
  columnas,
  filas,
  separacion,
  radio,
  semilla,
  desorden = 1.6,
  estado,
  style,
}: {
  columnas: number;
  filas: number;
  separacion: number;
  radio: number;
  semilla: string;
  desorden?: number;
  estado: EstadoLuces;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = columnas * filas;
  const puntos = useMemo(() => {
    const rango = Array.from({ length: total }, (_, i) => {
      const columna = i % columnas;
      const fila = Math.floor(i / columnas);
      return (columna * filas + fila) / total + (random(`${semilla}-orden-${i}`) - 0.5) * (desorden / columnas);
    });
    const posicion = new Array<number>(total);
    rango
      .map((valor, i) => [valor, i])
      .sort((a, b) => a[0] - b[0])
      .forEach(([, i], k) => (posicion[i] = k / total));
    return Array.from({ length: total }, (_, i) => ({
      x: (i % columnas) * separacion + separacion / 2,
      y: Math.floor(i / columnas) * separacion + separacion / 2,
      rango: posicion[i],
      llegada: random(`${semilla}-llegada-${i}`),
      fase: random(`${semilla}-fase-${i}`) * Math.PI * 2,
    }));
  }, [columnas, filas, separacion, semilla, total, desorden]);

  const cupo = estado.fraccionApagada;
  return (
    <svg width={columnas * separacion} height={filas * separacion} style={{ position: "absolute", overflow: "visible", ...style }}>
      {puntos.map((p, i) => {
        const visible = Math.min(1, Math.max(0, (estado.encendido - p.llegada * 0.6) / 0.4));
        const vaApagarse = p.rango < cupo;
        const umbral = cupo > 0 ? p.rango / cupo : 1;
        const apagado = vaApagarse ? Math.min(1, Math.max(0, (estado.apagado - umbral * 0.85) / 0.15)) : 0;
        const esJoven = vaApagarse && p.rango < cupo * estado.fraccionResaltada;
        const resalte = esJoven ? estado.resaltado : 0;
        const respiro = 0.86 + 0.14 * Math.sin((frame / fps) * 1.3 + p.fase);
        const brillo = (1 - apagado) * respiro;
        const relleno = resalte > 0 ? color.hueso : apagado > 0.5 ? color.apagada : color.luz;
        return (
          <g key={i} opacity={visible}>
            {brillo > 0.05 ? <circle cx={p.x} cy={p.y} r={radio * 2} fill={color.luzHalo} opacity={brillo * 0.4} /> : null}
            <circle cx={p.x} cy={p.y} r={radio * (1 - apagado * 0.25 + resalte * 0.15)} fill={relleno} opacity={0.55 + 0.45 * Math.max(brillo, resalte)} />
          </g>
        );
      })}
    </svg>
  );
};

/** Línea de fuente al pie de gráfica, tarjeta o escena. Siempre "Fuente: INE…", nunca logotipos. */
export interface PieFuenteProps {
  /** Texto después de "Fuente: ". */
  fuente?: string;
  /** Aclaración corta tras un punto medio: "Participación sobre lista nominal." */
  nota?: React.ReactNode;
  enlace?: string;
  style?: React.CSSProperties;
}
export function PieFuente(props: PieFuenteProps): JSX.Element;

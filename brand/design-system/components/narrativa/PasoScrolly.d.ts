/** Bloque de texto que pasa sobre una gráfica fija (sticky) en scrollytelling. Uno por idea. */
export interface PasoScrollyProps {
  numero?: number;
  /** Sustituye al número: "2018 · 24 años". */
  antetitulo?: string;
  /** El paso que controla la gráfica en este momento. Los inactivos bajan a 40%. */
  activo?: boolean;
  alineacion?: "izquierda" | "centro" | "derecha";
  /** Uno o dos párrafos cortos; cifras clave en <b>. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function PasoScrolly(props: PasoScrollyProps): JSX.Element;

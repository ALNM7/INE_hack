/** Número enorme que abre o cierra una escena, con antetítulo, etiqueta explicativa y fuente. */
export interface CifraProtagonistaProps {
  /** Texto numérico tal cual se debe leer: "47", "37.1", "15,000". Los decimales se respetan. */
  valor: string | number;
  /** "%", " M", " mil"… se dibuja a la mitad del tamaño. */
  unidad?: string;
  antetitulo?: string;
  /** Oración que dice qué significa el número. */
  etiqueta?: React.ReactNode;
  /** Default "Fuente: INE". null para ocultar. */
  fuente?: string | null;
  /** display = 88→200px; cifra = 56→112px */
  tamano?: "display" | "cifra";
  /** luz = encendida (acento), texto = neutro, apagada = cifra de lo que se perdió */
  tono?: "luz" | "texto" | "apagada";
  /** Cuenta desde 0 con ease-out 1.1 s (respeta prefers-reduced-motion). */
  animar?: boolean;
  alinear?: "inicio" | "centro";
  style?: React.CSSProperties;
}
export function CifraProtagonista(props: CifraProtagonistaProps): JSX.Element;

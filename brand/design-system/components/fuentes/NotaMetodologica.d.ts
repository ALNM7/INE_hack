/** Bloque plegable con definiciones, cobertura y limitaciones de los datos. */
export interface NotaMetodologicaProps {
  titulo?: string;
  abierta?: boolean;
  /** Párrafos <p> en tono llano. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function NotaMetodologica(props: NotaMetodologicaProps): JSX.Element;

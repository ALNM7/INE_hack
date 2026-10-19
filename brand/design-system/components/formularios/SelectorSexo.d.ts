/** Grupo de radios segmentado (Mujer / Hombre / Prefiero no decir). La opción elegida se "enciende". */
export interface SelectorSexoProps {
  valor?: string;
  onCambiar?: (id: string) => void;
  opciones?: { id: string; nombre: string }[];
  etiqueta?: string;
  ayuda?: string | null;
  /** name del grupo de radios */
  nombre?: string;
  style?: React.CSSProperties;
}
export function SelectorSexo(props: SelectorSexoProps): JSX.Element;

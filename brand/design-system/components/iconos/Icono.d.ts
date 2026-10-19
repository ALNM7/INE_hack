export type NombreIcono =
  | "x" | "check" | "circle-alert" | "info" | "chevron-down" | "chevron-left" | "chevron-right"
  | "arrow-right" | "arrow-down" | "download" | "share-2" | "printer" | "map-pin" | "search"
  | "rotate-ccw" | "pencil" | "minus" | "plus" | "external-link" | "link" | "copy" | "circle-help";

/** Lucide icon (copied stroke data, 24px grid, 1.75 stroke). Inherits currentColor. */
export interface IconoProps {
  nombre: NombreIcono;
  /** px, default 20 */
  tamano?: number;
  /** stroke width, default 1.75 */
  grosor?: number;
  /** Accessible label. Omit for decorative icons (aria-hidden). */
  titulo?: string;
  style?: React.CSSProperties;
}
export function Icono(props: IconoProps): JSX.Element | null;

/**
 * Botón. Primario = la única acción encendida de la pantalla (fondo luz). Secundario = contorno. Texto = enlace subrayado.
 */
export interface BotonProps {
  variante?: "primario" | "secundario" | "texto";
  /** md = 48px, lg = 56px de alto. Texto siempre ≥ 44px de área táctil. */
  tamano?: "md" | "lg";
  /** Nodo antes del texto, normalmente <Icono tamano={20}/> */
  icono?: React.ReactNode;
  iconoFinal?: React.ReactNode;
  disabled?: boolean;
  /** Ocupa el 100% del ancho (móvil). */
  completo?: boolean;
  /** Si existe, se renderiza como <a>. */
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Boton(props: BotonProps): JSX.Element;

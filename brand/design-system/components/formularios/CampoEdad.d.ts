/** Campo numérico de edad con botones −/+ de 52 px y validación de rango. */
export interface CampoEdadProps {
  valor?: number | "";
  onCambiar?: (v: number | "") => void;
  min?: number;
  max?: number;
  etiqueta?: string;
  ayuda?: string;
  /** Error externo; si no, valida el rango solo. */
  error?: string;
  id?: string;
  style?: React.CSSProperties;
}
export function CampoEdad(props: CampoEdadProps): JSX.Element;

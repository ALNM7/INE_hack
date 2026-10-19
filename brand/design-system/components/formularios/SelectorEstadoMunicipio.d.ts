/** Par de selects nativos encadenados (estado → municipio). Nativos para usar el selector del sistema en móvil. */
export interface SelectorEstadoMunicipioProps {
  estados: { id: string; nombre: string; municipios?: (string | { id: string; nombre: string })[] }[];
  estado?: string;
  municipio?: string;
  /** Al cambiar de estado, municipio vuelve a undefined. */
  onCambiar?: (v: { estado?: string; municipio?: string }) => void;
  /** columna en móvil (default), fila en escritorio. */
  direccion?: "columna" | "fila";
  style?: React.CSSProperties;
}
export function SelectorEstadoMunicipio(props: SelectorEstadoMunicipioProps): JSX.Element;

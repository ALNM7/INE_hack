export type ClaveEstado = "AGU" | "BCN" | "BCS" | "CAM" | "CHP" | "CHH" | "CMX" | "COA" | "COL" | "DUR" | "GUA" | "GRO" | "HID" | "JAL" | "MEX" | "MIC" | "MOR" | "NAY" | "NLE" | "OAX" | "PUE" | "QUE" | "ROO" | "SLP" | "SIN" | "SON" | "TAB" | "TAM" | "TLA" | "VER" | "YUC" | "ZAC";

/** Mapa coroplético de los 32 estados con tooltip (hover, tap o foco de teclado) y leyenda escalonada de 9 pasos. */
export interface MapaEstadosProps {
  /** Valor por clave ISO de estado (sin "MX-"). */
  valores: Partial<Record<ClaveEstado, number>>;
  /** secuencial = apagado→encendido; divergente = vs. promedio (azul peor, ámbar mejor). */
  escala?: "secuencial" | "divergente";
  /** [mín, máx] para la secuencial; por defecto el rango de los datos. */
  dominio?: [number, number];
  /** Centro de la divergente y referencia del tooltip; por defecto la media de los valores. */
  promedio?: number;
  /** Puntos que corresponden a los extremos de la divergente (default 10). */
  rango?: number;
  formato?: (v: number) => string;
  seleccionado?: ClaveEstado;
  onSeleccionar?: (id: ClaveEstado) => void;
  etiquetaLeyenda?: string;
  mostrarLeyenda?: boolean;
  style?: React.CSSProperties;
}
export function MapaEstados(props: MapaEstadosProps): JSX.Element;

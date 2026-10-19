/** Campo de puntos: cada punto es una persona; encendido = votó, apagado = no votó. Motivo central de la marca. */
export interface CampoLucesProps {
  /** mexico (default) = puntos repartidos sobre un mapa oscuro de México; rejilla = cuadrícula ("de cada 100"). */
  forma?: "mexico" | "rejilla";
  /** Solo en forma mexico: dibuja los estados debajo de los puntos. */
  mostrarMapa?: boolean;
  /** Relleno de los estados (default superficie: oscuro, para que resalten las luces). */
  colorMapa?: string;
  colorBordes?: string;
  /** Número aproximado de puntos (en mapa se ajusta ±4% a la forma). 100 en rejilla, 300–600 en mapa. */
  total?: number;
  /** 0–1. Ignorado si se pasa `encendidas`. */
  proporcion?: number;
  /** Número exacto de puntos encendidos. */
  encendidas?: number;
  /** Solo rejilla. */
  columnas?: number;
  /** Solo rejilla. Radio del punto en unidades del viewBox (escala al ancho). */
  radio?: number;
  separacion?: number;
  /** Misma semilla = mismo orden: al bajar la proporción se apagan siempre los mismos. */
  semilla?: number;
  /** azar = se apagan dispersos; lineal = se apagan de abajo hacia arriba. */
  orden?: "azar" | "lineal";
  /** Halo suave detrás de cada luz encendida. */
  halo?: boolean;
  /** Transición escalonada al cambiar la proporción (6 ms entre puntos). */
  animar?: boolean;
  colorEncendida?: string;
  colorApagada?: string;
  /** aria-label; por defecto "N de T luces encendidas". */
  etiqueta?: string;
  style?: React.CSSProperties;
}
export function CampoLuces(props: CampoLucesProps): JSX.Element;

export interface SerieEdad {
  id: string;
  nombre?: string;
  /** x = edad (o año), y = % que votó */
  puntos: { x: number; y: number }[];
  /** luz = serie protagonista; apagada = contexto; mujer / hombre; o cualquier color CSS */
  tono?: "luz" | "apagada" | "texto" | "mujer" | "hombre" | string;
  /** Punteada = estimación o promedio. */
  punteada?: boolean;
  /** Texto al final de la línea; default "{y}%". */
  etiquetaFinal?: string;
}
export interface AnotacionEdad { x: number; y: number; texto: React.ReactNode; cifra?: string; lado?: "arriba" | "abajo"; }

/** Gráfica de línea de participación por edad, con anotaciones HTML y línea de referencia. Responsiva al ancho. */
export interface GraficaEdadProps {
  series: SerieEdad[];
  anotaciones?: AnotacionEdad[];
  dominioX?: [number, number];
  dominioY?: [number, number];
  pasoY?: number;
  ticksX?: number[];
  formatoX?: (x: number) => string;
  /** Alto total en px (default 320). */
  alto?: number;
  etiquetaY?: string;
  /** Línea punteada horizontal, p. ej. promedio nacional. */
  referencia?: { y: number; etiqueta?: string };
  /** Recorta series y anotaciones hasta esta x (scrollytelling). */
  hastaX?: number;
  /** Dibuja las líneas al montar (900 ms, ease-entrada). */
  revelar?: boolean;
  titulo?: string;
  style?: React.CSSProperties;
}
export function GraficaEdad(props: GraficaEdadProps): JSX.Element;

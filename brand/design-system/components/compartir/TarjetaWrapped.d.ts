/** Tarjeta vertical 1080×1920 para historias (estilo "Wrapped"). Siempre en tema nocturno, cinco variantes de contenido. */
export interface TarjetaWrappedProps {
  /**
   * municipio : cifra de participación joven del municipio + 100 luces
   * edad      : 18 años vs. tu edad
   * generacion: tu cohorte 2012 → 2018 → 2024
   * secciones : sección más encendida vs. más apagada del municipio
   * cierre    : "¿Tu luz sigue encendida?"
   */
  variante?: "municipio" | "edad" | "generacion" | "secciones" | "cierre";
  /**
   * municipio: { municipio, valor, anio }
   * edad: { edad, valor18, valorEdad }
   * generacion: { antetitulo, titulo, texto, puntos: [{anio, edad, valor}] }
   * secciones: { municipio, alta: {id, valor}, baja: {id, valor} }
   * cierre: { pregunta, texto, url }
   */
  datos?: Record<string, any>;
  /** Escala de visualización (0.25 → 270×480). La exportación se hace a 1. */
  escala?: number;
  /** Paginación "02/05" en la cabecera. */
  indice?: number;
  total?: number;
  fuente?: string;
  style?: React.CSSProperties;
}
export function TarjetaWrapped(props: TarjetaWrappedProps): JSX.Element;

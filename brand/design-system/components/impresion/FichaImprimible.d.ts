/** Ficha municipal imprimible en hoja carta (816×1056 px a 96 dpi), tema claro de impresión, con QR. Para docentes y personal en pláticas escolares. */
export interface FichaImprimibleProps {
  municipio?: string;
  estado?: string;
  anio?: number;
  /** % 18–29 que votó en el municipio */
  participacionJoven?: number;
  participacionTotal?: number;
  participacionEstado?: number;
  participacionNacional?: number;
  /** Barras por grupo de edad; los tres primeros (jóvenes) se pintan encendidos. */
  porEdad?: { grupo: string; valor: number }[];
  seccionAlta?: { id: string; valor: number };
  seccionBaja?: { id: string; valor: number };
  /** Tres preguntas abiertas para el grupo. */
  preguntas?: string[];
  /** Sin protocolo; se usa para el QR y el pie. */
  url?: string;
  /** Imagen del QR. Default: generado por api.qrserver.com (requiere red). */
  qrSrc?: string;
  /** Escala de vista previa; imprime a 1. */
  escala?: number;
  style?: React.CSSProperties;
}
export function FichaImprimible(props: FichaImprimibleProps): JSX.Element;

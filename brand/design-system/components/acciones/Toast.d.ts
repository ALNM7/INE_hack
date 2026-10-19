/** Aviso breve y no bloqueante: confirmaciones ("Tarjeta guardada") y errores recuperables. */
export interface ToastProps {
  tono?: "info" | "exito" | "alerta";
  mensaje?: React.ReactNode;
  /** Acción única en texto, p. ej. { etiqueta: "Deshacer", onClick } */
  accion?: { etiqueta: string; onClick: () => void };
  /** Muestra la X de cierre. */
  onCerrar?: () => void;
  /** Fijo abajo, respetando safe-area. */
  flotante?: boolean;
  /** ms antes de llamar onCerrar automáticamente; 0 = no se cierra solo. */
  duracion?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Toast(props: ToastProps): JSX.Element;

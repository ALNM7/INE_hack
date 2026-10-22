export const CONFIG = {
  proxima_eleccion: '2027-06-06',
  sitio: 'https://alnm7.github.io/INE_hack/',
} as const;

export function fechaProximaEleccion(): string {
  const [anio, mes, dia] = CONFIG.proxima_eleccion.split('-').map(Number);
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(anio, mes - 1, dia)),
  );
}

export function sitioCorto(): string {
  return CONFIG.sitio.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

const decimal = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function unDecimal(valor: number): string {
  return decimal.format(valor);
}

export function porcentaje(valor: number): string {
  return `${unDecimal(valor)}%`;
}

export function sinAcentos(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es-MX')
    .trim();
}

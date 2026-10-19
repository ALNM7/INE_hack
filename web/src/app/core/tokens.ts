export type Rgb = readonly [number, number, number];

function raiz(): CSSStyleDeclaration {
  return getComputedStyle(document.documentElement);
}

export function valorToken(variable: string, elemento: Element = document.documentElement): string {
  return getComputedStyle(elemento).getPropertyValue(variable).trim();
}

export function pxToken(variable: string): number {
  const prueba = document.createElement('div');
  prueba.style.position = 'absolute';
  prueba.style.visibility = 'hidden';
  prueba.style.width = `var(${variable})`;
  document.body.appendChild(prueba);
  const px = prueba.getBoundingClientRect().width;
  prueba.remove();
  return px;
}

export function colorToken(variable: string, elemento?: Element): string {
  const valor = elemento ? valorToken(variable, elemento) : raiz().getPropertyValue(variable).trim();
  if (valor.startsWith('var(')) {
    return colorToken(valor.slice(4, -1).trim(), elemento);
  }
  return valor;
}

export function rgbToken(variable: string, elemento?: Element): Rgb {
  const valor = colorToken(variable, elemento);
  if (valor.startsWith('#')) {
    const hex = valor.slice(1);
    const completo = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex.slice(0, 6);
    const n = parseInt(completo, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const numeros = valor.match(/[\d.]+/g)?.map(Number) ?? [];
  return [numeros[0] ?? 0, numeros[1] ?? 0, numeros[2] ?? 0];
}

export function mezclar(a: Rgb, b: Rgb, t: number): Rgb {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function aCss([r, g, b]: Rgb): string {
  return `rgb(${Math.round(r)} ${Math.round(g)} ${Math.round(b)})`;
}

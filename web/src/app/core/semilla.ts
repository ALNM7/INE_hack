export function generador(semilla: number): () => number {
  let estado = semilla >>> 0;
  return () => {
    estado = (estado + 0x6d2b79f5) >>> 0;
    let t = estado;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ordenBarajado(total: number, semilla: number): number[] {
  const azar = generador(semilla);
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function rangos(total: number, semilla: number): number[] {
  const rango = new Array<number>(total);
  ordenBarajado(total, semilla).forEach((indice, posicion) => {
    rango[indice] = posicion;
  });
  return rango;
}

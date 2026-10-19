import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";

const raiz = dirname(fileURLToPath(import.meta.url));
const rutaTokens = join(raiz, "..", "brand", "tokens.json");
const rutaFuentes = join(raiz, "..", "brand", "fonts.css");
const tokens = JSON.parse(readFileSync(rutaTokens, "utf8"));

const planos = {};
for (const grupo of ["color", "semantico", "font", "texto", "espacio", "forma", "movimiento"]) {
  Object.assign(planos, tokens[grupo]);
}

function resolver(valor, visitados = new Set()) {
  return String(valor).replace(/var\((--[\w-]+)\)/g, (_, nombre) => {
    if (visitados.has(nombre) || !(nombre in planos)) return `var(${nombre})`;
    return resolver(planos[nombre], new Set([...visitados, nombre]));
  });
}

function agrupar(prefijo, fuente) {
  const salida = {};
  for (const [nombre, valor] of Object.entries(fuente)) {
    if (!nombre.startsWith(prefijo)) continue;
    const clave = nombre.slice(prefijo.length).replace(/-(\w)/g, (_, l) => l.toUpperCase());
    salida[clave] = resolver(valor);
  }
  return salida;
}

const color = { ...agrupar("--color-", tokens.color), ...agrupar("--color-", tokens.semantico) };

const fuentes = tokens.font;
const fuente = {
  titulo: resolver(fuentes["--font-titulo"]),
  texto: resolver(fuentes["--font-texto"]),
  mono: resolver(fuentes["--font-mono"]),
  estiramientoTitulo: resolver(fuentes["--font-stretch-titulo"]),
  peso: Object.fromEntries(
    Object.entries(fuentes)
      .filter(([n]) => n.startsWith("--font-weight-"))
      .map(([n, v]) => [n.slice("--font-weight-".length), Number(v)])
  ),
};

const texto = {};
for (const [nombre, valor] of Object.entries(tokens.texto)) {
  const m = nombre.match(/^--text-(wrapped-[\w]+?)(--(line-height|letter-spacing))?$/);
  if (!m) continue;
  const clave = m[1].replace("wrapped-", "");
  texto[clave] ??= {};
  if (!m[3]) texto[clave].size = valor;
  else if (m[3] === "line-height") texto[clave].lineHeight = valor;
  else texto[clave].letterSpacing = valor;
}

const curva = {};
const curvaCss = {};
const duracion = {};
for (const [nombre, valor] of Object.entries(tokens.movimiento)) {
  if (nombre.startsWith("--ease-")) {
    const clave = nombre.slice("--ease-".length);
    curvaCss[clave] = valor;
    const m = valor.match(/cubic-bezier\(([^)]+)\)/);
    curva[clave] = m ? m[1].split(",").map((n) => Number(n.trim())) : valor;
  }
  if (nombre.startsWith("--duration-")) {
    duracion[nombre.slice("--duration-".length)] = parseFloat(valor) / 1000;
  }
}

const espacio = agrupar("--space-", tokens.espacio);
const radio = agrupar("--radius-", tokens.forma);

export const brand = { nombre: tokens.nombre, color, fuente, texto, curva, curvaCss, duracion, espacio, radio };

export function archivosFuente() {
  const css = readFileSync(rutaFuentes, "utf8");
  return [...css.matchAll(/url\("\.\/([^"]+)"\)/g)].map((m) => join(raiz, "..", "brand", m[1]));
}

export function cssMarca(rutaFuentesRelativa) {
  const css = readFileSync(rutaFuentes, "utf8").replace(/url\("\.\/[^"]*\/([^"/]+)"\)/g, (_, f) => `url("${rutaFuentesRelativa}/${basename(f)}")`);
  const variables = [];
  for (const grupo of ["color", "semantico", "font", "texto", "espacio", "forma", "movimiento"]) {
    for (const [nombre, valor] of Object.entries(tokens[grupo])) {
      if (grupo === "texto" && !nombre.startsWith("--text-wrapped")) continue;
      variables.push(`${nombre}:${valor}`);
    }
  }
  return `${css}\n:root{${variables.join(";")}}`;
}

export function scriptMarca() {
  const datos = JSON.stringify({ color, fuente, texto, curva, duracion, espacio, radio });
  const registro = Object.entries(curva)
    .filter(([, v]) => Array.isArray(v))
    .map(([k, v]) => `CustomEase.create(${JSON.stringify(k)},${JSON.stringify(v.join(","))});`)
    .join("");
  return `window.BRAND=${datos};gsap.registerPlugin(CustomEase);${registro}`;
}

export default brand;

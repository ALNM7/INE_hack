import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { archivosFuente, cssMarca, scriptMarca } from "./brand.js";

const raiz = dirname(fileURLToPath(import.meta.url));
const grupos = ["hero", "reels", "carrusel", "pitch", "prueba"];

const librerias = {
  "gsap.min.js": "node_modules/gsap/dist/gsap.min.js",
  "CustomEase.min.js": "node_modules/gsap/dist/CustomEase.min.js",
  "d3.min.js": "node_modules/d3/dist/d3.min.js",
  "topojson-client.min.js": "node_modules/topojson-client/dist/topojson-client.min.js",
};

function proyectos() {
  const salida = [];
  const visitar = (ruta, profundidad) => {
    if (!existsSync(ruta) || profundidad > 2) return;
    if (existsSync(join(ruta, "index.html"))) salida.push(ruta);
    for (const nombre of readdirSync(ruta)) {
      const hijo = join(ruta, nombre);
      if (nombre !== "assets" && nombre !== "renders" && !nombre.startsWith(".") && statSync(hijo).isDirectory()) visitar(hijo, profundidad + 1);
    }
  };
  for (const grupo of grupos) visitar(join(raiz, grupo), 0);
  return salida;
}

function prepararAssets(proyecto) {
  mkdirSync(join(proyecto, "assets", "fonts"), { recursive: true });
  mkdirSync(join(proyecto, "assets", "vendor"), { recursive: true });
  for (const archivo of archivosFuente()) copyFileSync(archivo, join(proyecto, "assets", "fonts", basename(archivo)));
  for (const [destino, origen] of Object.entries(librerias)) copyFileSync(join(raiz, origen), join(proyecto, "assets", "vendor", destino));
}

function escaparJson(texto) {
  return texto.replace(/</g, "\\u003c");
}

let total = 0;
for (const proyecto of proyectos()) {
  prepararAssets(proyecto);
  const archivo = join(proyecto, "index.html");
  let html = readFileSync(archivo, "utf8");
  html = html.replace(/<style id="marca">[\s\S]*?<\/style>/, () => `<style id="marca">${cssMarca("assets/fonts")}</style>`);
  html = html.replace(/<script id="marca-js">[\s\S]*?<\/script>/, () => `<script id="marca-js">${scriptMarca()}</script>`);
  html = html.replace(
    /<script type="application\/json" id="([\w-]+)" data-fuente="([^"]+)">[\s\S]*?<\/script>/g,
    (_, id, fuente) => {
      const contenido = JSON.stringify(JSON.parse(readFileSync(join(raiz, fuente), "utf8")));
      return `<script type="application/json" id="${id}" data-fuente="${fuente}">${escaparJson(contenido)}</script>`;
    }
  );
  writeFileSync(archivo, html);
  total += 1;
  console.log(`sincronizado ${relative(raiz, archivo)}`);
}
console.log(`${total} composiciones`);

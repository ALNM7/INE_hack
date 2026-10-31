import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { brand, archivosFuente } from "../../brand.js";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const carpeta = join(raiz, "public", "fonts");
mkdirSync(carpeta, { recursive: true });
const fuentes = archivosFuente()
  .filter((f) => f.endsWith("-latin.woff2"))
  .map((f) => {
    copyFileSync(f, join(carpeta, basename(f)));
    const [, familia, estilo, peso] = basename(f).match(/^(.+)-(normal|italic)-([\d_]+)-latin\.woff2$/);
    const nombres = { "bricolage-grotesque": "Bricolage Grotesque", "atkinson-hyperlegible-next": "Atkinson Hyperlegible Next", "ibm-plex-mono": "IBM Plex Mono" };
    return { familia: nombres[familia], estilo, peso: peso.replace("_", " "), archivo: `fonts/${basename(f)}` };
  });
writeFileSync(join(raiz, "src", "datos", "marca.json"), JSON.stringify({ ...brand, fuentes }, null, 2));
console.log(fuentes.length, "fuentes");

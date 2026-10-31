import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const salida = join(raiz, "renders", "revision");
mkdirSync(salida, { recursive: true });
const navegador = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({
  entryPoint: join(raiz, "src", "index.ts"),
  webpackOverride: (actual) => ({ ...actual, module: { ...actual.module, rules: [...(actual.module?.rules ?? []), { test: /\.topojson$/, type: "json" }] } }),
});
const [id, ...cuadros] = process.argv.slice(2);
const composition = await selectComposition({ serveUrl, id, browserExecutable: navegador });
for (const frame of cuadros.map(Number)) {
  await renderStill({ composition, serveUrl, frame, output: join(salida, `${id}_${String(frame).padStart(4, "0")}.jpg`), imageFormat: "jpeg", jpegQuality: 80, scale: 0.5, browserExecutable: navegador });
  console.log(frame);
}

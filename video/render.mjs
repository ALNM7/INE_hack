import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { auditar, hf } from "./audit.mjs";

const raiz = dirname(fileURLToPath(import.meta.url));
const repo = join(raiz, "..");
const salida = join(raiz, "salida");
const media = join(repo, "web", "public", "media");

function ffmpeg(args) {
  const r = spawnSync("ffmpeg", ["-v", "error", "-y", ...args], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr);
}

function paso(texto) {
  console.log(`\n== ${texto}`);
}

function construir() {
  const r = spawnSync("node", [join(raiz, "build.mjs")], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr);
}

function revisar(proyecto, { estatico = false } = {}) {
  paso(`lint ${proyecto}`);
  const l = hf(["lint", proyecto]);
  const resumen = l.salida.split("\n").filter((x) => /error|warning|✗|⚠/.test(x) && !x.includes("npm notice"));
  console.log(resumen.join("\n"));
  if (l.codigo !== 0) throw new Error(`lint falló en ${proyecto}`);
  paso(`auditoría animation-map ${proyecto}`);
  const { banderas, muertas, reporte } = auditar(proyecto);
  console.log(`${banderas.length} banderas, ${muertas.length} zonas muertas, reporte en ${reporte}`);
  for (const b of banderas) console.log(`  bandera ${b}`);
  for (const m of muertas) console.log(`  zona muerta ${m}${estatico ? " (composición estática, se acepta)" : ""}`);
  if ((banderas.length || (muertas.length && !estatico)) && !process.argv.includes("--aceptar-banderas")) throw new Error(`corrige las banderas y zonas muertas de ${proyecto} antes de renderizar`);
}

function renderizar(proyecto, args) {
  paso(`render ${proyecto}`);
  const r = hf(["render", proyecto, ...args]);
  const lineas = r.salida.split("\n").filter((x) => /video ·|capture ·|Error|error:/.test(x));
  console.log(lineas.join("\n"));
  if (r.codigo !== 0) {
    console.error(r.salida.slice(-3000));
    throw new Error(`render falló en ${proyecto}`);
  }
}

function hero() {
  revisar("hero");
  const cuadros = join(raiz, "hero", "renders", "cuadros");
  rmSync(cuadros, { recursive: true, force: true });
  renderizar("hero", ["--format", "png-sequence", "-o", cuadros]);
  const lista = readdirSync(cuadros).filter((f) => f.endsWith(".png")).sort();
  const patron = join(cuadros, lista[0].replace(/\d+(?=\.png$)/, (m) => `%0${m.length}d`));
  const primero = Number(lista[0].match(/(\d+)\.png$/)[1]);
  mkdirSync(media, { recursive: true });
  const entrada = ["-framerate", "30", "-start_number", String(primero), "-i", patron];
  paso("codificación hero_loop.mp4 (H.264 CRF 28)");
  const crudo = join(cuadros, "hero.264");
  ffmpeg([...entrada, "-frames:v", String(lista.length - 1), "-an", "-c:v", "libx264", "-preset", "veryslow", "-crf", "28", "-pix_fmt", "yuv420p", "-profile:v", "high", "-x264-params", "aud=1:bframes=0", "-f", "h264", crudo]);
  const flujo = readFileSync(crudo);
  const aud = [];
  for (let i = 0; i + 4 < flujo.length; i++) {
    if (flujo[i] === 0 && flujo[i + 1] === 0 && flujo[i + 2] === 1 && (flujo[i + 3] & 31) === 9) aud.push(i > 0 && flujo[i - 1] === 0 ? i - 1 : i);
  }
  writeFileSync(crudo, Buffer.concat([flujo, flujo.subarray(aud[0], aud[1])]));
  ffmpeg(["-fflags", "+genpts", "-r", "30", "-i", crudo, "-c:v", "copy", "-an", "-movflags", "+faststart", join(media, "hero_loop.mp4")]);
  paso("codificación hero_loop.webm (VP9)");
  ffmpeg([...entrada, "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "32", "-row-mt", "1", "-deadline", "good", "-cpu-used", "1", "-pix_fmt", "yuv420p", "-force_key_frames", `expr:eq(n,0)+eq(n,${lista.length - 1})`, "-auto-alt-ref", "0", "-lag-in-frames", "0", join(media, "hero_loop.webm")]);
  paso("póster hero_poster.jpg");
  ffmpeg(["-i", join(cuadros, lista[0]), "-q:v", "3", join(media, "hero_poster.jpg")]);
  for (const f of ["hero_loop.mp4", "hero_loop.webm", "hero_poster.jpg"]) console.log(`${f}: ${(statSync(join(media, f)).size / 1048576).toFixed(2)} MB`);
  verificarLoop(cuadros, lista);
}

function md5Cuadro(video, n) {
  const r = spawnSync("ffmpeg", ["-v", "error", "-i", video, "-vf", `select=eq(n\\,${n})`, "-frames:v", "1", "-f", "md5", "-"], { encoding: "utf8" });
  return r.stdout.trim().replace("MD5=", "");
}

function cuadrosDe(video) {
  const r = spawnSync("ffprobe", ["-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries", "stream=nb_read_frames", "-of", "csv=p=0", video], { encoding: "utf8" });
  return Number(r.stdout.trim());
}

function verificarLoop(cuadros, lista) {
  paso("comparación primer y último cuadro");
  const filas = [];
  const maestro = [join(cuadros, lista[0]), join(cuadros, lista.at(-1))].map((f) => spawnSync("ffmpeg", ["-v", "error", "-i", f, "-f", "md5", "-"], { encoding: "utf8" }).stdout.trim().replace("MD5=", ""));
  filas.push(["maestro PNG", lista.length, maestro[0], maestro[1]]);
  for (const f of ["hero_loop.mp4", "hero_loop.webm"]) {
    const v = join(media, f);
    const n = cuadrosDe(v);
    filas.push([f, n, md5Cuadro(v, 0), md5Cuadro(v, n - 1)]);
  }
  const lineas = ["# Hero loop: comparación del primer y último cuadro", "", "| Archivo | Cuadros | MD5 primer cuadro | MD5 último cuadro | Idénticos |", "|---|---|---|---|---|"];
  for (const [a, n, x, y] of filas) {
    const ok = x === y && x.length === 32;
    lineas.push(`| ${a} | ${n} | ${x} | ${y} | ${ok ? "sí" : "no"} |`);
    console.log(`${a}: ${ok ? "idénticos" : "DIFERENTES"} (${x} / ${y})`);
    if (!ok) throw new Error(`primer y último cuadro distintos en ${a}`);
  }
  mkdirSync(join(raiz, "auditoria"), { recursive: true });
  writeFileSync(join(raiz, "auditoria", "hero_loop_comparacion.md"), `${lineas.join("\n")}\n`);
}

function reel(nombre) {
  const proyecto = `reels/${nombre}`;
  revisar(proyecto);
  mkdirSync(join(salida, "reels"), { recursive: true });
  renderizar(proyecto, ["--quality", "delivery", "-o", join(salida, "reels", `${nombre}.mp4`)]);
}

function carrusel() {
  revisar("carrusel", { estatico: true });
  const cuadros = join(raiz, "carrusel", "renders", "cuadros");
  rmSync(cuadros, { recursive: true, force: true });
  renderizar("carrusel", ["--format", "png-sequence", "--fps", "1", "-o", cuadros]);
  const destino = join(salida, "carrusel");
  rmSync(destino, { recursive: true, force: true });
  mkdirSync(destino, { recursive: true });
  const lista = readdirSync(cuadros).filter((f) => f.endsWith(".png")).sort();
  lista.forEach((f, i) => {
    ffmpeg(["-i", join(cuadros, f), "-pix_fmt", "rgb24", join(destino, `carrusel_${String(i + 1).padStart(2, "0")}.png`)]);
  });
  paso("entrega/carrusel.pdf");
  const r = spawnSync("python3", ["-I", "-c", "import sys,glob;from PIL import Image;fs=sorted(glob.glob(sys.argv[1]+'/*.png'));im=[Image.open(f).convert('RGB') for f in fs];im[0].save(sys.argv[2],save_all=True,append_images=im[1:],resolution=144)", destino, join(repo, "entrega", "carrusel.pdf")], { encoding: "utf8" });
  if (r.status !== 0) throw new Error(r.stderr);
}

const tareas = { hero, carrusel, reel_curva: () => reel("reel_curva"), reel_cohorte: () => reel("reel_cohorte"), reel_estados: () => reel("reel_estados"), reel_37m: () => reel("reel_37m") };
const pedidas = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!pedidas.length) throw new Error(`uso: node render.mjs <${Object.keys(tareas).join("|")}>`);
construir();
for (const t of pedidas) {
  if (!tareas[t]) throw new Error(`tarea desconocida ${t}`);
  tareas[t]();
}

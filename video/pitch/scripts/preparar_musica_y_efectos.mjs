import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", "-y", ...args]);
const duracion = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }));

mkdirSync(join(raiz, "public", "musica"), { recursive: true });
const musicaOrigen = join(raiz, "assets", "musica", "novus_initium.mp3");
const musicaDestino = join(raiz, "public", "musica", "novus_initium.wav");
const medicion = spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-i", musicaOrigen, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const m = JSON.parse(medicion.match(/\{[^{}]*"input_i"[^{}]*\}/s)[0]);
ffmpeg([
  "-i",
  musicaOrigen,
  "-af",
  `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`,
  "-ac",
  "2",
  "-c:a",
  "pcm_s16le",
  musicaDestino,
]);
const silencios = spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-i", musicaDestino, "-af", "silencedetect=n=-50dB:d=0.3", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const total = duracion(musicaDestino);
const finales = [...silencios.matchAll(/silence_start: ([\d.]+)/g)].map((x) => Number(x[1])).filter((t) => t > total - 10);
const fin = finales.length ? finales[0] : total;
writeFileSync(
  join(raiz, "src", "datos", "musica.json"),
  JSON.stringify({ archivo: "musica/novus_initium.wav", titulo: "Novus Initium", autor: "Alexander Nakarada", licencia: "CC0 1.0 (FreePD)", duracion: total, fin }, null, 1)
);

mkdirSync(join(raiz, "public", "sfx"), { recursive: true });
const catalogo = JSON.parse(readFileSync(join(raiz, "assets", "sfx", "catalogo.json"), "utf8"));
const efectos = {};
for (const archivo of readdirSync(join(raiz, "assets", "sfx")).filter((f) => f.endsWith(".wav"))) {
  const id = basename(archivo, ".wav");
  ffmpeg(["-i", join(raiz, "assets", "sfx", archivo), "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", join(raiz, "public", "sfx", archivo)]);
  efectos[id] = { archivo: `sfx/${archivo}`, sincronia: catalogo[id].sync.at, bajoVoz: catalogo[id].under_voiceover_db, duracion: catalogo[id].duration };
}
writeFileSync(join(raiz, "src", "datos", "efectos.json"), JSON.stringify(efectos, null, 1));
console.log("musica", { total, fin }, Object.keys(efectos).length, "efectos");

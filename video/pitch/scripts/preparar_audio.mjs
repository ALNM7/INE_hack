import { execFileSync, spawnSync } from "node:child_process";
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origen = join(raiz, "assets", "voces");
const wav = join(origen, "wav");
const salida = join(raiz, "public", "audio");
mkdirSync(wav, { recursive: true });
mkdirSync(salida, { recursive: true });

const corte = "silenceremove=start_periods=1:start_duration=0.05:start_threshold=-50dB:start_silence=0.12";
const recorte = `${corte},areverse,${corte},areverse`;
const fundido = "afade=t=in:d=0.03,areverse,afade=t=in:d=0.03,areverse";
const limpio = "afftdn=nr=12:nf=-45";

const correr = (args) => execFileSync("ffmpeg", ["-hide_banner", "-nostdin", "-y", ...args], { stdio: ["ignore", "pipe", "pipe"] });

const archivos = readdirSync(origen)
  .filter((f) => /^\d+\.(wav|mp3|m4a|mp4|ogg|opus|aac|flac)$/i.test(f))
  .sort((a, b) => parseInt(a) - parseInt(b));

const reporte = [];
for (const archivo of archivos) {
  const n = parseInt(archivo);
  const base = join(wav, `${n}.wav`);
  correr(["-i", join(origen, archivo), "-vn", "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", base]);

  const previo = `${limpio},${recorte}`;
  const salidaMedicion = (archivoMedido, filtro) => spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-i", archivoMedido, "-af", filtro, "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const texto = salidaMedicion(base, `${previo},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json`);
  const bloque = texto.match(/\{[^{}]*"input_i"[^{}]*\}/s)[0];
  const m = JSON.parse(bloque);
  const norm = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
  const destino = join(salida, `${n}.wav`);
  correr(["-i", base, "-af", `${previo},${norm},aresample=48000,${fundido}`, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", destino]);

  const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }));
  const medido = salidaMedicion(destino, "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json");
  const fin = JSON.parse(medido.match(/\{[^{}]*"input_i"[^{}]*\}/s)[0]);
  reporte.push({ clip: n, original: archivo, duracionOriginal: Number(dur(base).toFixed(3)), duracion: Number(dur(destino).toFixed(3)), lufs: Number(fin.input_i) });
}
writeFileSync(join(raiz, "assets", "voces", "reporte_audio.json"), JSON.stringify(reporte, null, 2));
console.table(reporte);

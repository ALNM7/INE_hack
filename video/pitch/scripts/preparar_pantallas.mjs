import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const salida = join(raiz, "public", "pantallas");
mkdirSync(salida, { recursive: true });
for (const nombre of ["hero", "acto1", "acto2", "acto3"]) {
  const origen = join(raiz, "assets", `${nombre}.mov`);
  if (!existsSync(origen)) {
    console.log(`falta ${nombre}`);
    continue;
  }
  const video = join(salida, `${nombre}.mp4`);
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", "-y", "-i", origen, "-an", "-vf", "fps=30,scale=804:-2:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-g", "15", "-movflags", "+faststart", video]);
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", "-y", "-sseof", "-0.1", "-i", video, "-frames:v", "1", "-update", "1", join(salida, `${nombre}_fin.png`)]);
  console.log(nombre);
}

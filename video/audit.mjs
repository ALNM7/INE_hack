import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const raiz = dirname(fileURLToPath(import.meta.url));

export function lanzador() {
  const cache = join(homedir(), ".claude", "plugins", "cache", "hyperframes", "hyperframes");
  const version = process.env.HYPERFRAMES_PLUGIN_ROOT ? "" : readdirSync(cache).sort().at(-1);
  const plugin = process.env.HYPERFRAMES_PLUGIN_ROOT ?? join(cache, version);
  return {
    cli: join(plugin, "skills", "hyperframes", "scripts", "plugin-cli.mjs"),
    mapa: join(plugin, "skills", "hyperframes-animation", "scripts", "animation-map.mjs"),
  };
}

export function hf(args, opciones = {}) {
  const { cli } = lanzador();
  const r = spawnSync("node", [cli, ...args], {
    cwd: raiz,
    encoding: "utf8",
    env: { ...process.env, HYPERFRAMES_SKILL_BOOTSTRAP_DEPS: "1" },
    maxBuffer: 1 << 28,
    ...opciones,
  });
  return { codigo: r.status, salida: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

export function auditar(proyecto) {
  const { mapa } = lanzador();
  const destino = join(raiz, proyecto, ".hyperframes", "anim-map");
  const r = hf(["--script", mapa, proyecto, "--out", destino]);
  const ruta = join(destino, "animation-map.json");
  if (!existsSync(ruta)) {
    console.error(r.salida);
    throw new Error(`la auditoría de ${proyecto} no produjo animation-map.json`);
  }
  const mapaJson = JSON.parse(readFileSync(ruta, "utf8"));
  const banderas = [];
  for (const t of mapaJson.tweens) for (const f of t.flags ?? []) banderas.push(`${t.selector} (${t.start}s a ${t.end}s): ${typeof f === "string" ? f : JSON.stringify(f)}`);
  const muertas = (mapaJson.deadZones ?? []).map((z) => (typeof z === "string" ? z : JSON.stringify(z)));
  const nombre = proyecto.replace(/\//g, "_");
  const lineas = [
    `# Auditoría de animación: ${proyecto}`,
    "",
    `Duración: ${mapaJson.duration} s. Tweens: ${mapaJson.totalTweens} (mapeados ${mapaJson.mappedTweens}, micro omitidos ${mapaJson.skippedMicroTweens}).`,
    "",
    "## Banderas",
    "",
    ...(banderas.length ? banderas.map((b) => `- ${b}`) : ["- Ninguna"]),
    "",
    "## Zonas muertas",
    "",
    ...(muertas.length ? muertas.map((m) => `- ${m}`) : ["- Ninguna"]),
    "",
    "## Coreografía",
    "",
    "```",
    mapaJson.choreography,
    "```",
    "",
  ];
  mkdirSync(join(raiz, "auditoria"), { recursive: true });
  const reporte = join(raiz, "auditoria", `${nombre}.md`);
  writeFileSync(reporte, lineas.join("\n"));
  return { banderas, muertas, reporte: relative(raiz, reporte), mapa: mapaJson };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const objetivos = process.argv.slice(2);
  if (!objetivos.length) throw new Error("uso: node audit.mjs <proyecto> [proyecto...]");
  let fallas = 0;
  for (const p of objetivos) {
    const { banderas, muertas, reporte } = auditar(p);
    console.log(`${p}: ${banderas.length} banderas, ${muertas.length} zonas muertas -> ${reporte}`);
    for (const b of banderas) console.log(`  bandera ${b}`);
    for (const m of muertas) console.log(`  zona muerta ${m}`);
    fallas += banderas.length;
  }
  process.exitCode = fallas ? 1 : 0;
}

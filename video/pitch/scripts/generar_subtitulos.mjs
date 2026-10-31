import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const guion = JSON.parse(readFileSync(join(raiz, "src", "datos", "guion.json"), "utf8"));
const salida = join(raiz, "src", "subtitulos");
mkdirSync(salida, { recursive: true });

const MAX_LINEA = 42;
const MAX_LINEAS = 2;


const duracion = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", f], { encoding: "utf8" }));
const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve", "veinte"];
const decenas = ["", "", "veinti", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
function hablado(n) {
  if (n <= 20) return unidades[n] || "cero";
  if (n < 30) return "veinti" + unidades[n - 20];
  if (n < 100) return decenas[Math.floor(n / 10)] + (n % 10 ? " y " + unidades[n % 10] : "");
  if (n < 1000) return (n < 200 ? "ciento" : unidades[Math.floor(n / 100)] + "cientos") + " " + (n % 100 ? hablado(n % 100) : "");
  const miles = Math.floor(n / 1000);
  return (miles === 1 ? "mil" : hablado(miles) + " mil") + " " + (n % 1000 ? hablado(n % 1000) : "");
}
const pronunciado = (p) => p.replace(/\d[\d,]*/g, (d) => hablado(Number(d.replace(/,/g, "")))).replace(/%/g, " por ciento");
const peso = (p) => pronunciado(p).replace(/[^\p{L}]/gu, "").length + 2;
const cierraFrase = (p) => /[.,:;…?]$/.test(p);

function silencios(archivo, dur) {
  const texto = spawnSync("ffmpeg", ["-hide_banner", "-nostdin", "-i", archivo, "-af", "silencedetect=n=-38dB:d=0.18", "-f", "null", "-"], { encoding: "utf8" }).stderr;
  const inicios = [...texto.matchAll(/silence_start: ([\d.]+)/g)].map((m) => Number(m[1]));
  const finales = [...texto.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
  return inicios.map((a, i) => [Math.max(0, a), Math.min(dur, finales[i] ?? dur)]);
}

function repartir(palabras, dur, pausas) {
  const tramos = [];
  let t = 0;
  for (const [a, b] of pausas) {
    if (a > t) tramos.push([t, a]);
    t = Math.max(t, b);
  }
  if (t < dur) tramos.push([t, dur]);
  const voz = tramos.reduce((s, [a, b]) => s + b - a, 0);
  const real = (x, derecha) => {
    let acumulado = 0;
    for (let k = 0; k < tramos.length; k++) {
      const [a, b] = tramos[k];
      const largo = b - a;
      if (x < acumulado + largo || (!derecha && x <= acumulado + largo) || k === tramos.length - 1) return a + Math.min(largo, x - acumulado);
      acumulado += largo;
    }
    return dur;
  };
  const pesos = palabras.map(peso);
  const total = pesos.reduce((s, x) => s + x, 0);
  const acumulados = [0];
  pesos.forEach((x) => acumulados.push(acumulados[acumulados.length - 1] + x));
  const anclas = [[0, 0]];
  let acumuladoVoz = 0;
  for (let k = 0; k < tramos.length - 1; k++) {
    acumuladoVoz += tramos[k][1] - tramos[k][0];
    const estimado = (total * acumuladoVoz) / voz;
    let mejor = null;
    for (let i = 0; i < palabras.length - 1; i++) {
      if (!cierraFrase(palabras[i])) continue;
      const pos = acumulados[i + 1];
      if (pos <= anclas[anclas.length - 1][0]) continue;
      if (Math.abs(pos - estimado) > total * 0.12) continue;
      if (!mejor || Math.abs(pos - estimado) < Math.abs(mejor - estimado)) mejor = pos;
    }
    if (mejor !== null) anclas.push([mejor, acumuladoVoz]);
  }
  anclas.push([total, voz]);
  const aVoz = (w) => {
    for (let k = 1; k < anclas.length; k++) {
      const [w0, t0] = anclas[k - 1];
      const [w1, t1] = anclas[k];
      if (w <= w1) return t0 + ((t1 - t0) * (w - w0)) / Math.max(1e-6, w1 - w0);
    }
    return voz;
  };
  return palabras.map((p, i) => ({ inicio: real(aVoz(acumulados[i]), true), fin: real(aVoz(acumulados[i + 1]), false) }));
}

const largo = (l) => l.map((p) => p.texto).join(" ").length;
const tieneComa = (p) => /[,:;]$/.test(p.texto);

function dividir(palabras, maximo, valido = () => true) {
  const total = largo(palabras);
  for (let n = Math.ceil(total / maximo); n <= palabras.length; n++) {
    const ideal = total / n;
    const costo = new Array(palabras.length + 1).fill(Infinity);
    const corte = new Array(palabras.length + 1).fill(-1);
    costo[0] = 0;
    for (let j = 1; j <= palabras.length; j++)
      for (let i = 0; i < j; i++) {
        const tramo = palabras.slice(i, j);
        const l = largo(tramo);
        if (l > maximo || costo[i] === Infinity || !valido(tramo)) continue;
        const c = costo[i] + (l - ideal) ** 2 - (j < palabras.length && tieneComa(palabras[j - 1]) ? ideal * ideal * 0.15 : 0) + (tramo.length === 1 && palabras.length > 1 ? 400 : 0);
        if (c < costo[j]) {
          costo[j] = c;
          corte[j] = i;
        }
      }
    if (costo[palabras.length] === Infinity) continue;
    const partes = [];
    let j = palabras.length;
    while (j > 0) {
      partes.unshift(palabras.slice(corte[j], j));
      j = corte[j];
    }
    return partes;
  }
  return [palabras];
}

function bloques(palabras) {
  const frases = [];
  let actual = [];
  for (const p of palabras) {
    actual.push(p);
    if (/[.?…!]$/.test(p.texto)) {
      frases.push(actual);
      actual = [];
    }
  }
  if (actual.length) frases.push(actual);
  const salidaBloques = [];
  for (const frase of frases)
    for (const tramo of dividir(frase, MAX_LINEA * MAX_LINEAS, (t) => largo(t) <= MAX_LINEA || dividir(t, MAX_LINEA).length <= MAX_LINEAS)) {
      const lineas = largo(tramo) <= MAX_LINEA ? [tramo] : dividir(tramo, MAX_LINEA);
      salidaBloques.push({ lineas: lineas.map((l) => l.map((p) => p.texto).join(" ")), inicio: tramo[0].inicio, fin: tramo[tramo.length - 1].fin });
    }
  for (let i = 0; i < salidaBloques.length - 1; i++) {
    const siguiente = salidaBloques[i + 1].inicio;
    salidaBloques[i].fin = siguiente - salidaBloques[i].fin < 0.6 ? siguiente : salidaBloques[i].fin + 0.3;
  }
  salidaBloques[salidaBloques.length - 1].fin += 0.3;
  return salidaBloques;
}

const reporte = [];
for (const [clip, texto] of Object.entries(guion)) {
  const archivo = join(raiz, "public", "audio", `${clip}.wav`);
  const dur = duracion(archivo);
  const palabras = texto.split(/\s+/).filter(Boolean);
  const pausas = silencios(archivo, dur);
  const tiempos = repartir(palabras, dur, pausas);
  const lista = palabras.map((p, i) => ({ texto: p, inicio: Number(tiempos[i].inicio.toFixed(3)), fin: Number(tiempos[i].fin.toFixed(3)) }));
  writeFileSync(join(salida, `${clip}.json`), JSON.stringify({ clip: Number(clip), duracion: dur, metodo: "proporcional con pausas", palabras: lista, bloques: bloques(lista) }, null, 1));
  reporte.push({ clip, palabras: lista.length, pausas: pausas.length, bloques: bloques(lista).length });
}
console.table(reporte);

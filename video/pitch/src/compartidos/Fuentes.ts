import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { fuentesLocales } from "../datos/marca";

export const fuentesListas = Promise.all(
  fuentesLocales.map((f) =>
    loadFont({ family: f.familia, url: staticFile(f.archivo), weight: f.peso, style: f.estilo, format: "woff2" })
  )
);

import { geoConicConformal, geoPath, geoBounds, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import { random } from "remotion";
import { geografia } from "../datos/cifras";

type Propiedades = { c: number; n: string };
export const estadosGeo = feature(geografia, geografia.objects.estados) as unknown as FeatureCollection<Geometry, Propiedades>;

export const proyectar = (ancho: number, alto: number) => {
  const proyeccion = geoConicConformal().parallels([17.5, 29.5]).rotate([102, 0]).fitSize([ancho, alto], estadosGeo);
  return { proyeccion, ruta: geoPath(proyeccion) };
};

export const puntosEnEstado = (clave: number, cantidad: number, semilla: string) => {
  const estado = estadosGeo.features.find((f) => f.properties.c === clave)!;
  const [[x0, y0], [x1, y1]] = geoBounds(estado);
  const puntos: [number, number][] = [];
  let intento = 0;
  while (puntos.length < cantidad && intento < cantidad * 400) {
    const lon = x0 + (x1 - x0) * random(`${semilla}-${clave}-x-${intento}`);
    const lat = y0 + (y1 - y0) * random(`${semilla}-${clave}-y-${intento}`);
    if (geoContains(estado, [lon, lat])) puntos.push([lon, lat]);
    intento++;
  }
  return puntos;
};

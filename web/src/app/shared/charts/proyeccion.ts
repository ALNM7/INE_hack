import { GeoConicProjection, geoConicConformal } from 'd3';

const PARALELOS: [number, number] = [17.5, 29.5];
const MERIDIANO_CENTRAL = 102;

export function proyeccionMexico(): GeoConicProjection {
  return geoConicConformal().parallels(PARALELOS).rotate([MERIDIANO_CENTRAL, 0]);
}

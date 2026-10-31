declare module "*.topojson" {
  const valor: import("topojson-specification").Topology;
  export default valor;
}

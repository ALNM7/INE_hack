import qrcode from "qrcode-generator";

export const Qr = ({ texto, lado, tinta, fondo }: { texto: string; lado: number; tinta: string; fondo: string }) => {
  const qr = qrcode(0, "M");
  qr.addData(texto);
  qr.make();
  const modulos = qr.getModuleCount();
  const margen = 2;
  const total = modulos + margen * 2;
  const celdas = [];
  for (let fila = 0; fila < modulos; fila++)
    for (let columna = 0; columna < modulos; columna++)
      if (qr.isDark(fila, columna)) celdas.push(<rect key={`${fila}-${columna}`} x={columna + margen} y={fila + margen} width={1.02} height={1.02} fill={tinta} />);
  return (
    <svg width={lado} height={lado} viewBox={`0 0 ${total} ${total}`} shapeRendering="crispEdges">
      <rect width={total} height={total} fill={fondo} />
      {celdas}
    </svg>
  );
};

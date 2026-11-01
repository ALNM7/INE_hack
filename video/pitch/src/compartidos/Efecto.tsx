import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import efectos from "../datos/efectos.json";

export type IdEfecto = keyof typeof efectos;

export const Efecto = ({ id, en, ajuste = 0 }: { id: IdEfecto; en: number; ajuste?: number }) => {
  const { fps } = useVideoConfig();
  const efecto = efectos[id];
  const desde = Math.max(0, en - Math.round(efecto.sincronia * fps));
  return (
    <Sequence from={desde} durationInFrames={Math.ceil(efecto.duracion * fps) + 2} layout="none" name={`Efecto ${id}`}>
      <Audio src={staticFile(efecto.archivo)} volume={Math.pow(10, (efecto.bajoVoz + ajuste) / 20)} />
    </Sequence>
  );
};

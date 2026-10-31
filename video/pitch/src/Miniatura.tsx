import { AbsoluteFill } from "remotion";
import { CampoLuces } from "./compartidos/CampoLuces";
import { color, fuente, nombreProyecto } from "./datos/marca";
import { anioReciente, formato, nacional } from "./datos/cifras";

export const Miniatura = () => {
  const datos = nacional[anioReciente];
  return (
    <AbsoluteFill style={{ backgroundColor: color.noche1, overflow: "hidden" }}>
      <CampoLuces
        columnas={22}
        filas={20}
        separacion={22}
        radio={5}
        semilla="miniatura"
        desorden={6}
        estado={{ encendido: 1, apagado: 1, fraccionApagada: datos.nv / (datos.sv + datos.nv), resaltado: 0, fraccionResaltada: 0 }}
        style={{ left: 740, top: 140 }}
      />
      <div style={{ position: "absolute", left: 72, top: 96, fontFamily: fuente.mono, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase", color: color.luz }}>
        {formato.millones(nacional.abstencion_2024)} millones no votaron en {anioReciente}
      </div>
      <div
        style={{
          position: "absolute",
          left: 68,
          top: 170,
          width: 640,
          fontFamily: fuente.titulo,
          fontStretch: fuente.estiramientoTitulo,
          fontWeight: fuente.peso.extra,
          fontSize: 150,
          lineHeight: 0.88,
          letterSpacing: "-0.045em",
          color: color.hueso,
        }}
      >
        {nombreProyecto}
      </div>
    </AbsoluteFill>
  );
};

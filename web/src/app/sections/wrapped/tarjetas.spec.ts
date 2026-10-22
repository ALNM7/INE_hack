import { ArchivoMunicipios, Estado, Estados } from '../../core/models';
import estadosJson from '../../../../public/data/estados.json';
import coahuila from '../../../../public/data/municipios/05.json';
import chiapas from '../../../../public/data/municipios/07.json';
import cdmx from '../../../../public/data/municipios/09.json';
import oaxaca from '../../../../public/data/municipios/20.json';
import { Sexo, generarTarjetas, indiceGrupo, notaBaja, notaNula, posicionGrupo } from './tarjetas';

const estados = estadosJson as unknown as Estados;

function caso(archivo: unknown, nombre: string, edad: number, sexo: Sexo) {
  const datos = archivo as ArchivoMunicipios;
  const estado = estados.estados.find((e) => e.c === datos.edo) as Estado;
  const municipio = datos.municipios.find((m) => m.n === nombre)!;
  return { estado, municipio, tarjetas: generarTarjetas({ estado, municipio, grupos: datos.grupos, edad, sexo }) };
}

function texto(partes: { texto: string }[]): string {
  return partes.map((p) => p.texto).join('');
}

describe('tarjetas del Wrapped', () => {
  it('elige el grupo de edad en los bordes', () => {
    const grupos = estados.grupos;
    expect(grupos[indiceGrupo(grupos, 18)]).toBe('18-19');
    expect(grupos[indiceGrupo(grupos, 29)]).toBe('25-29');
    expect(grupos[indiceGrupo(grupos, 30)]).toBe('30-34');
    expect(grupos[indiceGrupo(grupos, 99)]).toBe('80+');
  });

  it('ordena la posición del grupo con empates', () => {
    const valores = [5, 1, 1, 6, 7, 8, 9, 10, 11];
    expect(posicionGrupo(valores, 1)).toBe('abajo');
    expect(posicionGrupo([0, 1, 2, 3, 4, 5, 6, 7, 8], 0)).toBe('ultima');
    expect(posicionGrupo([0, 1, 2, 3, 4, 5, 6, 7, 8], 8)).toBe('arriba');
    expect(posicionGrupo([0, 1, 2, 3, 4, 5, 6, 7, 8], 4)).toBe('mitad');
  });

  it('usa los datos del municipio con su nombre', () => {
    const { municipio, tarjetas } = caso(cdmx, 'Iztapalapa', 30, 'mujer');
    expect(tarjetas).toHaveLength(5);
    expect(texto(tarjetas[0].frase)).toBe(`En Iztapalapa votaron ${Math.round(municipio.p2024! / 10)} de cada 10 personas.`);
    expect(tarjetas[1].cifra?.numero).toBe(municipio.grupos.m[3]!.toFixed(1));
    expect(tarjetas[3].clave).toBe('secciones');
    expect(tarjetas.every((t) => t.notas.length === 0)).toBe(true);
  });

  it('con calidad baja usa el estado en todas las tarjetas', () => {
    const { estado, tarjetas } = caso(chiapas, 'Chicomuselo', 22, 'hombre');
    expect(texto(tarjetas[0].frase)).toContain('En Chiapas votaron');
    expect(tarjetas[1].cifra?.numero).toBe(estado.grupos_2024.h[1]!.toFixed(1));
    expect(tarjetas[3].clave).toBe('jovenes');
    tarjetas.slice(0, 4).forEach((t) => expect(t.notas).toEqual([notaBaja('Chiapas')]));
  });

  it('con un grupo en null usa el estado y lo avisa', () => {
    const { estado, tarjetas } = caso(coahuila, 'Abasolo', 19, 'hombre');
    expect(tarjetas[1].cifra?.numero).toBe(estado.grupos_2024.h[0]!.toFixed(1));
    expect(tarjetas[1].notas).toEqual([notaNula('Coahuila')]);
    expect(tarjetas[0].notas).toEqual([]);
  });

  it('sin secciones cambia a la tarjeta de jóvenes', () => {
    const { tarjetas } = caso(oaxaca, 'San Mateo Tlapiltepec', 27, 'nd');
    expect(tarjetas[3].clave).toBe('jovenes');
    expect(texto(tarjetas[3].frase)).toContain('En Oaxaca votó el');
    expect(tarjetas[3].notas).toEqual([notaNula('Oaxaca')]);
  });

  it('el nombre más largo del país llega completo a la frase', () => {
    const nombre = 'Heroica Villa Tezoatlán de Segura y Luna, Cuna de la Independencia de Oaxaca';
    const { tarjetas } = caso(oaxaca, nombre, 24, 'mujer');
    expect(texto(tarjetas[0].frase)).toContain(nombre);
    expect(texto(tarjetas[4].frase)).toBe('¿Tu luz sigue encendida?');
  });
});

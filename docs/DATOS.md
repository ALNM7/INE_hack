# Datos procesados

Todos los archivos están en `web/public/data/`. Se generaron con `pipeline/build_data.py` a partir de los CSV del INE (Conteos Censales de Participación Ciudadana 2012, 2018 y 2024) y se validaron con `pipeline/validate_data.py`. No se editan a mano.

## Reglas generales
- Participación = SV / (SV + NV) * 100, con 1 decimal. Los no especificados (NS) quedan fuera del denominador.
- `null` significa dato suprimido (menos de 50 personas con registro). En la interfaz se muestra el dato del estado y se avisa.
- Grupos de edad, siempre en este orden: `18-19, 20-24, 25-29, 30-34, 35-44, 45-59, 60-69, 70-79, 80+`.
- Joven = 18 a 29 años.
- Claves de estado de 1 a 32 (clave INE). Los archivos de municipio usan dos dígitos: `01.json` a `32.json`.

## `nacional.json`
```
{
  "2012": { "ln", "sv", "nv", "ns", "part", "ns_pct", "part_h", "part_m", "nv_h", "nv_m" },
  "2018": { ... },
  "2024": { ... },
  "abstencion_2024": 37105466,
  "abstencion_jovenes_2024": 12383365,
  "ln_jovenes_2024": 26015732
}
```

`part_h` y `part_m` son participación de hombres y mujeres; `nv_h` y `nv_m`, cuántos no votaron de cada sexo.

También trae `grupos` (los 9 grupos de edad) y `grupos_2012`, `grupos_2018`, `grupos_2024`, cada uno con `t`, `h` y `m`: participación nacional por grupo de edad y sexo. La brecha de género del Acto 2 sale de `grupos_2024` en el grupo `25-29` (hombres 40.6, mujeres 53.9). No calcular promedios a partir de `edad_exacta.json`, porque no están ponderados.

## `edad_exacta.json`
`edades` va de 18 a 95. Cada serie tiene un valor por edad en el mismo orden.
```
{ "edades": [18, ..., 95], "2012": [...], "2018": [...], "2024": [...], "2024_h": [...], "2024_m": [...] }
```

## `cohortes.json`
Cada bloque trae `campos` (nombres de las columnas) y `filas`.
- `larga.campos`: `["edad_2012", "p2012", "p2018", "p2024"]`
- `corta.campos`: `["edad_2018", "p2018", "p2024"]`
- `larga.filas`: `[edad_en_2012, part_2012, part_2018 a esa edad + 6, part_2024 a esa edad + 12]`, edades 18 a 60.
- `corta.filas`: `[edad_en_2018, part_2018, part_2024 a esa edad + 6]`, edades 18 a 70.

## `estados.json`
```
{
  "grupos": [...],
  "estados": [
    {
      "c": 21, "n": "Puebla",
      "total": { "2012", "2018", "2024" },
      "jovenes": { "2012", "2018", "2024" },
      "jovenes_18_24": { "2012", "2018", "2024" },
      "grupos_2024": { "t": [9], "h": [9], "m": [9] },
      "focos": 1234
    }
  ]
}
```
`t` total, `h` hombres, `m` mujeres. El mapa del Acto 2 usa `jovenes_18_24["2024"]`.

## `municipios/XX.json`
```
{
  "edo": 21, "n": "Puebla", "grupos": [...],
  "municipios": [
    {
      "c": 115, "n": "Puebla", "ln": 1372589,
      "p2024": 60.1, "p2018": 62.5, "jovenes": 49.1,
      "ns_pct": 6.33, "calidad": "ok",
      "secciones": 817,
      "seccion_max": [2643, 80.2],
      "seccion_min": [1492, 27.9],
      "focos": 133,
      "grupos": { "t": [9], "h": [9], "m": [9] }
    }
  ]
}
```
- `calidad: "baja"` cuando más de 50% de los registros son no especificados (38 municipios). No usarlos en rankings y mostrar aviso.
- `seccion_max` y `seccion_min` pueden ser `null` si el municipio no tiene secciones con al menos 200 registros.
- `p2018` es `null` si la clave del municipio no existía en 2018.

## `focos.json`
```
{ "umbral": 60.0, "minimo_jovenes": 50, "total": 14671, "por_municipio": [[edo, mpio, n], ...] }
```
Secciones donde las personas de 18 a 29 votaron 60% o más. El texto del sitio dice "casi 15 mil" y la cifra exacta sale de `total`.

## `catalogo.json`
`[{ "c": 1, "n": "Aguascalientes", "m": [[clave, nombre], ...] }, ...]` para los selectores.

## `meta.json`
Fecha de generación, fuente, URL, notas metodológicas, correcciones aplicadas y fuente del mapa, listas para la página de metodología.

## `web/public/geo/mx_estados.topojson`
Geometría de los 32 estados (Natural Earth, dominio público), 21 KB. Capa `estados`, cada estado con propiedades `c` (clave INE, igual que en `estados.json`) y `n` (nombre). Se une con los datos por `c`. Usar este archivo y no la geometría que trae el design system.

## Correcciones a los datos del INE
- Municipio 6 de Campeche: el CSV de 2024 dice "Hopelche}én". Se corrigió a "Hopelchén", como aparece en 2012 y 2018. El validador ahora rechaza cualquier nombre con caracteres raros.

## Cifras de referencia
| Indicador | Valor |
|---|---|
| Participación nacional 2012, 2018, 2024 | 62.1, 62.4, 59.7 |
| Hombres y mujeres 2012 | 57.8, 66.1 |
| Hombres y mujeres 2024 | 54.8, 64.2 |
| Hombres y mujeres de 25 a 29 en 2024 | 40.6, 53.9 |
| Edad 18, 25 y 65 en 2024 | 61.5, 46.9, 76.8 |
| Cohorte 2012: 18, 24, 30 años | 66.7, 52.1, 50.3 |
| Cohorte 2018: 18, 24 años | 64.8, 47.1 |
| Jóvenes 18 a 24, Sonora y Yucatán 2024 | 38.7, 64.8 |
| Abstencionistas 2024 | 37,105,466 |
| Abstencionistas de 18 a 29 en 2024 | 12,383,365 |
| Focos (secciones con jóvenes al 60% o más) | 14,671 |
| Municipios | 2,477 |

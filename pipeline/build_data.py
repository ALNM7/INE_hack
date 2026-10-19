import sys
import json
import glob
import datetime
from pathlib import Path

import numpy as np
import pandas as pd

RAW = Path(sys.argv[1])
OUT = Path(sys.argv[2])
YEARS = [2012, 2018, 2024]
MIN_CELDA = 50
MIN_SECCION = 200
UMBRAL_FOCO = 60.0

ESTADOS = {
    1: "Aguascalientes", 2: "Baja California", 3: "Baja California Sur", 4: "Campeche",
    5: "Coahuila", 6: "Colima", 7: "Chiapas", 8: "Chihuahua", 9: "Ciudad de México",
    10: "Durango", 11: "Guanajuato", 12: "Guerrero", 13: "Hidalgo", 14: "Jalisco",
    15: "Estado de México", 16: "Michoacán", 17: "Morelos", 18: "Nayarit", 19: "Nuevo León",
    20: "Oaxaca", 21: "Puebla", 22: "Querétaro", 23: "Quintana Roo", 24: "San Luis Potosí",
    25: "Sinaloa", 26: "Sonora", 27: "Tabasco", 28: "Tamaulipas", 29: "Tlaxcala",
    30: "Veracruz", 31: "Yucatán", 32: "Zacatecas",
}

GRUPOS = ["18-19", "20-24", "25-29", "30-34", "35-44", "45-59", "60-69", "70-79", "80+"]
CORTES = [17, 19, 24, 29, 34, 44, 59, 69, 79, 200]
USECOLS = ["EDOCVE", "MPIOCVE", "MPIONOM", "SECCION", "SEXO", "EDAD", "LN", "SV", "NV", "NS"]
DTYPES = {"EDOCVE": "int8", "MPIOCVE": "int16", "SECCION": "int32", "SEXO": "int8", "EDAD": "int16",
          "LN": "int32", "SV": "int32", "NV": "int32", "NS": "int32"}
SUMAS = ["LN", "SV", "NV", "NS"]


def part(sv, nv, minimo=MIN_CELDA):
    d = sv + nv
    if d < minimo or d == 0:
        return None
    return round(100.0 * sv / d, 1)


def leer_anio(anio):
    carpeta = RAW / f"DatosAbiertos_DECEyEC_ConteosCensales{anio}"
    archivos = sorted(glob.glob(str(carpeta / "*.csv")))
    if len(archivos) != 32:
        raise SystemExit(f"Se esperaban 32 CSV en {carpeta}, hay {len(archivos)}")
    detalle, secciones, nombres = [], [], {}
    for f in archivos:
        d = pd.read_csv(f, encoding="utf-8-sig", usecols=USECOLS, dtype=DTYPES)
        for c in SUMAS:
            d[c] = d[c].astype("int64")
        for (e, m), n in d.groupby(["EDOCVE", "MPIOCVE"])["MPIONOM"].first().items():
            nombres[(int(e), int(m))] = str(n).strip()
        detalle.append(d.groupby(["EDOCVE", "MPIOCVE", "SEXO", "EDAD"], observed=True)[SUMAS].sum().reset_index())
        if anio == 2024:
            d["J"] = d["EDAD"] <= 29
            s = d.groupby(["EDOCVE", "MPIOCVE", "SECCION"])[SUMAS].sum()
            j = d[d["J"]].groupby(["EDOCVE", "MPIOCVE", "SECCION"])[["SV", "NV"]].sum()
            j.columns = ["JSV", "JNV"]
            secciones.append(s.join(j).fillna(0).astype("int64").reset_index())
        del d
    det = pd.concat(detalle, ignore_index=True)
    for c in SUMAS:
        det[c] = det[c].astype("int64")
    det["GRUPO"] = pd.cut(det["EDAD"], bins=CORTES, labels=GRUPOS).astype(str)
    sec = pd.concat(secciones, ignore_index=True) if secciones else None
    return det, sec, nombres


def tasa_df(df):
    return df.apply(lambda r: part(r["SV"], r["NV"]), axis=1)


def serie_grupos(df):
    g = df.groupby("GRUPO")[["SV", "NV"]].sum()
    return [part(int(g.loc[k, "SV"]), int(g.loc[k, "NV"])) if k in g.index else None for k in GRUPOS]


def totales(df):
    s = df[SUMAS].sum()
    return int(s.LN), int(s.SV), int(s.NV), int(s.NS)


def escribir(nombre, obj):
    p = OUT / nombre
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    datos, nombres_mpio = {}, {}
    secc24 = None
    for a in YEARS:
        det, sec, nombres = leer_anio(a)
        datos[a] = det
        if a == 2024:
            secc24 = sec
        for k, v in nombres.items():
            if a == 2024 or k not in nombres_mpio:
                nombres_mpio[k] = v
        print(f"{a}: {len(det)} filas agregadas")

    nacional = {}
    for a in YEARS:
        ln, sv, nv, ns = totales(datos[a])
        nacional[str(a)] = {"ln": ln, "sv": sv, "nv": nv, "ns": ns,
                            "part": part(sv, nv), "ns_pct": round(100.0 * ns / ln, 2)}
    d24 = datos[2024]
    nacional["abstencion_2024"] = int(d24["NV"].sum())
    nacional["abstencion_jovenes_2024"] = int(d24[d24["EDAD"] <= 29]["NV"].sum())
    nacional["ln_jovenes_2024"] = int(d24[d24["EDAD"] <= 29]["LN"].sum())
    escribir("nacional.json", nacional)

    edades = list(range(18, 96))
    edad_exacta = {"edades": edades}
    for a in YEARS:
        e = datos[a].groupby("EDAD")[["SV", "NV"]].sum()
        edad_exacta[str(a)] = [part(int(e.loc[x, "SV"]), int(e.loc[x, "NV"])) if x in e.index else None for x in edades]
    for sx, k in [(0, "2024_h"), (1, "2024_m")]:
        e = d24[d24["SEXO"] == sx].groupby("EDAD")[["SV", "NV"]].sum()
        edad_exacta[k] = [part(int(e.loc[x, "SV"]), int(e.loc[x, "NV"])) if x in e.index else None for x in edades]
    escribir("edad_exacta.json", edad_exacta)

    pe = {a: dict(zip(edades, edad_exacta[str(a)])) for a in YEARS}
    cohortes = {
        "larga": {"campos": ["edad_2012", "p2012", "p2018", "p2024"],
                  "filas": [[x, pe[2012].get(x), pe[2018].get(x + 6), pe[2024].get(x + 12)] for x in range(18, 61)]},
        "corta": {"campos": ["edad_2018", "p2018", "p2024"],
                  "filas": [[x, pe[2018].get(x), pe[2024].get(x + 6)] for x in range(18, 71)]},
    }
    escribir("cohortes.json", cohortes)

    secc24["P"] = np.where(secc24["SV"] + secc24["NV"] > 0, 100.0 * secc24["SV"] / (secc24["SV"] + secc24["NV"]).clip(lower=1), np.nan)
    secc24["PJ"] = np.where(secc24["JSV"] + secc24["JNV"] > 0, 100.0 * secc24["JSV"] / (secc24["JSV"] + secc24["JNV"]).clip(lower=1), np.nan)
    secc24["NSP"] = np.where(secc24["LN"] > 0, 100.0 * secc24["NS"] / secc24["LN"].clip(lower=1), 0)
    validas = secc24[(secc24["SV"] + secc24["NV"] >= MIN_SECCION) & (secc24["NSP"] <= 50)]
    foco_mask = (secc24["JSV"] + secc24["JNV"] >= MIN_CELDA) & (secc24["PJ"] >= UMBRAL_FOCO) & (secc24["NSP"] <= 50)
    focos_mpio = secc24[foco_mask].groupby(["EDOCVE", "MPIOCVE"]).size()

    estados = []
    for e in range(1, 33):
        reg = {"c": e, "n": ESTADOS[e], "total": {}, "jovenes": {}, "jovenes_18_24": {}}
        for a in YEARS:
            de = datos[a][datos[a]["EDOCVE"] == e]
            _, sv, nv, _ = totales(de)
            reg["total"][str(a)] = part(sv, nv)
            j = de[de["EDAD"] <= 29]
            reg["jovenes"][str(a)] = part(int(j["SV"].sum()), int(j["NV"].sum()))
            j2 = de[de["EDAD"] <= 24]
            reg["jovenes_18_24"][str(a)] = part(int(j2["SV"].sum()), int(j2["NV"].sum()))
        de = d24[d24["EDOCVE"] == e]
        reg["grupos_2024"] = {"t": serie_grupos(de), "h": serie_grupos(de[de["SEXO"] == 0]), "m": serie_grupos(de[de["SEXO"] == 1])}
        reg["focos"] = int(focos_mpio.loc[e].sum()) if e in focos_mpio.index.get_level_values(0) else 0
        estados.append(reg)
    escribir("estados.json", {"grupos": GRUPOS, "estados": estados})

    d18 = datos[2018].groupby(["EDOCVE", "MPIOCVE"])[["SV", "NV"]].sum()
    catalogo = []
    total_mpios = 0
    for e in range(1, 33):
        de = d24[d24["EDOCVE"] == e]
        se = validas[validas["EDOCVE"] == e]
        sall = secc24[secc24["EDOCVE"] == e]
        lista = []
        for m, dm in de.groupby("MPIOCVE"):
            ln, sv, nv, ns = totales(dm)
            ns_pct = round(100.0 * ns / ln, 2) if ln else 0
            sm = se[se["MPIOCVE"] == m]
            smax = smin = None
            if len(sm):
                r1 = sm.loc[sm["P"].idxmax()]
                r0 = sm.loc[sm["P"].idxmin()]
                smax = [int(r1["SECCION"]), round(float(r1["P"]), 1)]
                smin = [int(r0["SECCION"]), round(float(r0["P"]), 1)]
            p18 = None
            if (e, m) in d18.index:
                p18 = part(int(d18.loc[(e, m), "SV"]), int(d18.loc[(e, m), "NV"]))
            j = dm[dm["EDAD"] <= 29]
            lista.append({
                "c": int(m),
                "n": nombres_mpio.get((e, int(m)), str(m)),
                "ln": ln,
                "p2024": part(sv, nv),
                "p2018": p18,
                "jovenes": part(int(j["SV"].sum()), int(j["NV"].sum())),
                "ns_pct": ns_pct,
                "calidad": "baja" if ns_pct > 50 else "ok",
                "secciones": int((sall["MPIOCVE"] == m).sum()),
                "seccion_max": smax,
                "seccion_min": smin,
                "focos": int(focos_mpio.loc[(e, m)]) if (e, m) in focos_mpio.index else 0,
                "grupos": {"t": serie_grupos(dm), "h": serie_grupos(dm[dm["SEXO"] == 0]), "m": serie_grupos(dm[dm["SEXO"] == 1])},
            })
        lista.sort(key=lambda x: x["n"])
        total_mpios += len(lista)
        escribir(f"municipios/{e:02d}.json", {"edo": e, "n": ESTADOS[e], "grupos": GRUPOS, "municipios": lista})
        catalogo.append({"c": e, "n": ESTADOS[e], "m": [[x["c"], x["n"]] for x in lista]})
    escribir("catalogo.json", catalogo)

    escribir("focos.json", {
        "umbral": UMBRAL_FOCO,
        "minimo_jovenes": MIN_CELDA,
        "total": int(foco_mask.sum()),
        "por_municipio": [[int(e), int(m), int(n)] for (e, m), n in focos_mpio.items()],
    })

    escribir("meta.json", {
        "generado": datetime.date.today().isoformat(),
        "fuente": "INE, Conteos Censales de Participación Ciudadana 2012, 2018 y 2024",
        "url": "https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/",
        "participacion": "SV / (SV + NV) * 100. Los registros no especificados (NS) se excluyen del denominador.",
        "supresion": f"Se publica null cuando SV + NV es menor a {MIN_CELDA}.",
        "calidad": "Municipios con más de 50% de registros no especificados se marcan con calidad baja.",
        "secciones": f"Sección más y menos participativa: solo secciones con al menos {MIN_SECCION} registros y hasta 50% no especificados.",
        "focos": f"Secciones donde las personas de 18 a 29 años votaron {UMBRAL_FOCO:.0f}% o más, con al menos {MIN_CELDA} jóvenes con registro.",
        "cohorte": "Cohorte aproximada: compara la misma edad desplazada entre elecciones, no a las mismas personas.",
        "ns_2012": "En 2012 casi no hay registros no especificados (0.2%) frente a 6.8% en 2018 y 6.4% en 2024, por diferencias en la captura de cuadernillos.",
        "cobertura": "No incluye casillas especiales ni voto desde el extranjero.",
        "municipios": total_mpios,
    })
    print("listo", total_mpios, "municipios")


if __name__ == "__main__":
    main()

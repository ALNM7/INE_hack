import re
import sys
import json
import math
from pathlib import Path

D = Path(sys.argv[1])
TOL = 0.1
errores = []


def cargar(n):
    with open(D / n, encoding="utf-8") as f:
        return json.load(f)


def check(nombre, valor, esperado, tol=TOL):
    ok = valor is not None and abs(valor - esperado) <= tol
    print(f"{'OK ' if ok else 'ERR'} {nombre}: {valor} (esperado {esperado})")
    if not ok:
        errores.append(nombre)


def recorrer(x, ruta=""):
    if isinstance(x, dict):
        for k, v in x.items():
            recorrer(v, f"{ruta}.{k}")
    elif isinstance(x, list):
        for i, v in enumerate(x):
            recorrer(v, f"{ruta}[{i}]")
    elif isinstance(x, float):
        if math.isnan(x) or math.isinf(x):
            errores.append(f"NaN en {ruta}")
    if isinstance(x, (int, float)) and not isinstance(x, bool) and x < 0:
        errores.append(f"negativo en {ruta}")


nac = cargar("nacional.json")
ed = cargar("edad_exacta.json")
coh = cargar("cohortes.json")
est = cargar("estados.json")

check("Nacional 2012", nac["2012"]["part"], 62.1)
check("Nacional 2018", nac["2018"]["part"], 62.4)
check("Nacional 2024", nac["2024"]["part"], 59.7)

check("Hombres 2012", nac["2012"]["part_h"], 57.8)
check("Mujeres 2012", nac["2012"]["part_m"], 66.1)
check("Hombres 2024", nac["2024"]["part_h"], 54.8)
check("Mujeres 2024", nac["2024"]["part_m"], 64.2)

edad = dict(zip(ed["edades"], ed["2024"]))
check("Edad 18 en 2024", edad[18], 61.5)
check("Edad 25 en 2024", edad[25], 46.9)
check("Edad 65 en 2024", edad[65], 76.8)

larga = {f[0]: f for f in coh["larga"]["filas"]}
check("Cohorte 18 en 2012", larga[18][1], 66.7)
check("Cohorte 24 en 2018", larga[18][2], 52.1)
check("Cohorte 30 en 2024", larga[18][3], 50.3)
corta = {f[0]: f for f in coh["corta"]["filas"]}
check("Cohorte 18 en 2018", corta[18][1], 64.8)
check("Cohorte 24 en 2024", corta[18][2], 47.1)

por_nombre = {e["n"]: e for e in est["estados"]}
check("Jovenes 18-24 Sonora 2024", por_nombre["Sonora"]["jovenes_18_24"]["2024"], 38.7)
check("Jovenes 18-24 Yucatan 2024", por_nombre["Yucatán"]["jovenes_18_24"]["2024"], 64.8)

check("Abstencionistas 2024", nac["abstencion_2024"], 37105466, 0)
check("NV 18 a 29 en 2024", nac["abstencion_jovenes_2024"], 12383365, 0)

if len(est["estados"]) != 32:
    errores.append("estados != 32")

total = 0
for i in range(1, 33):
    p = D / "municipios" / f"{i:02d}.json"
    if not p.exists():
        errores.append(f"falta {p.name}")
        continue
    kb = p.stat().st_size / 1024
    if kb > 400:
        errores.append(f"{p.name} pesa {kb:.0f} KB")
    m = cargar(f"municipios/{i:02d}.json")
    total += len(m["municipios"])
    recorrer(m, p.name)
print(f"Municipios: {total}")
if total < 2400:
    errores.append("menos de 2400 municipios")

for e in cargar("catalogo.json"):
    for k, n in e["m"]:
        if re.search(r"[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ .,'()\-]", n):
            errores.append(f"nombre raro {e['c']}-{k}: {n}")

for n in ["nacional.json", "edad_exacta.json", "cohortes.json", "estados.json", "focos.json", "catalogo.json"]:
    recorrer(cargar(n), n)

if errores:
    print("FALLO")
    for e in errores[:30]:
        print(" ", e)
    sys.exit(1)
print("OK")

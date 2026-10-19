import json
import re
from pathlib import Path

BRAND = Path(__file__).resolve().parent
DS = BRAND / "design-system"

GRUPOS_THEME = ["color", "semantico", "font", "texto", "espacio", "rejilla", "forma", "movimiento"]

EXTRAS = {
    "font": {"--font-stretch-titulo": "82%"},
}


def leer_export():
    with open(DS / "export" / "tokens.json", encoding="utf-8") as f:
        datos = json.load(f)
    datos.pop("$descripcion", None)
    for grupo, valores in EXTRAS.items():
        datos[grupo].update(valores)
    return datos


def leer_movimiento_reducido():
    css = (DS / "tokens" / "motion.css").read_text(encoding="utf-8")
    bloque = css.split("prefers-reduced-motion", 1)[1]
    return dict(re.findall(r"(--duration-[\w-]+):\s*([^;]+);", bloque))


def leer_fuentes():
    css = (DS / "tokens" / "fonts.css").read_text(encoding="utf-8")
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S).strip()
    return css.replace('url("../assets/fonts/', 'url("./design-system/assets/fonts/')


def bloque(selector, valores, sangria="  "):
    lineas = [f"{sangria}{k}: {v};" for k, v in valores.items()]
    return f"{selector} {{\n" + "\n".join(lineas) + "\n}"


def main():
    datos = leer_export()
    reducido = leer_movimiento_reducido()

    salida_json = {
        "nombre": "La generación que se apagó",
        "fuente": "brand/design-system/export/tokens.json",
        **datos,
        "movimiento-reducido": reducido,
    }
    (BRAND / "tokens.json").write_text(
        json.dumps(salida_json, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    tema = {"--color-*": "initial"}
    for grupo in GRUPOS_THEME:
        tema.update(datos[grupo])

    partes = [
        bloque("@theme static", tema),
        bloque('[data-tema="noche"]', datos["semantico"]),
        bloque('[data-tema="impresion"]', datos["tema-impresion"]),
        "@media (prefers-reduced-motion: reduce) {\n"
        + bloque("  :root", reducido, "    ").replace("\n}", "\n  }")
        + "\n}",
    ]
    (BRAND / "tokens.css").write_text("\n\n".join(partes) + "\n", encoding="utf-8")
    (BRAND / "fonts.css").write_text(leer_fuentes() + "\n", encoding="utf-8")

    total = sum(len(datos[g]) for g in GRUPOS_THEME)
    print(f"tokens.json y tokens.css generados: {total} variables en @theme, {len(datos['tema-impresion'])} en tema impresion")


if __name__ == "__main__":
    main()

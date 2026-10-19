# La generación que se apagó: Design System

Sistema de diseño para **"La generación que se apagó"**, un micrositio de storytelling con datos para el hackatón del Instituto Nacional Electoral de México (Reto 3: comunicar la participación ciudadana con datos).

## Contexto

Experiencia web, móvil primero, que cuenta con datos oficiales del INE (Conteos Censales de Participación 2012, 2018 y 2024) cómo cae la participación electoral en la juventud:

- A los 18 años vota el **61%**; a los 25, el **47%**.
- La generación que tenía 18 en 2012 votó **66.7%**, luego **52.1%** a los 24 (2018) y **50.3%** a los 30 (2024). Nunca se recuperó.
- En 2024, **37.1 millones** de personas no votaron; un tercio tenía entre 18 y 29 años.
- Cierre con esperanza: hay **más de 15 mil secciones** donde los jóvenes votan 60% o más.

**Público principal:** jóvenes mexicanos de 18 a 29 años, en celular. **Secundario:** personal del INE y docentes que imprimen fichas por municipio para pláticas en escuelas.

**Superficies:** (1) micrositio móvil de scrollytelling, (2) tarjetas compartibles 1080×1920 ("Wrapped"), (3) ficha municipal imprimible en carta.

**Fuentes recibidas:** solo el brief escrito (sin Figma, repositorio, logotipo ni capturas). Todo el sistema es una propuesta original. Restricciones: no usar logotipos, colores ni tipografías institucionales del INE; solo se cita "Fuente: INE". No hay logotipo del proyecto: el nombre se compone siempre en tipografía.

---

## Índice

| Ruta | Qué es |
|---|---|
| `styles.css` | Punto de entrada (solo `@import`). Enlaza este archivo. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `motion.css`, `base.css` |
| `export/tailwind-theme.css` | Tokens en bloque `@theme` para Tailwind v4 |
| `export/tokens.json` | Mismos nombres y valores, para animación/video |
| `assets/fonts/` | WOFF2 autoalojados (latin + latin-ext) |
| `assets/icons/` | SVG Lucide copiados (22) |
| `guidelines/` | Tarjetas de fundamentos (color, datos, tipo, espacio, movimiento, marca) |
| `components/` | Componentes React (ver lista) |
| `ui_kits/micrositio/` | Prototipo móvil y pantallas clave |
| `SKILL.md` | Manifiesto para usar este sistema como Agent Skill |

### Componentes

- `components/cifras/`: **CifraProtagonista**
- `components/narrativa/`: **PasoScrolly**, **CampoLuces**
- `components/graficas/`: **GraficaEdad**, **MapaEstados** (+ `mxEstados.js`, geometría de los 32 estados)
- `components/formularios/`: **SelectorEstadoMunicipio**, **CampoEdad**, **SelectorSexo**
- `components/acciones/`: **Boton** (primario, secundario, texto), **Toast**
- `components/compartir/`: **TarjetaWrapped** (5 variantes)
- `components/impresion/`: **FichaImprimible** (carta, tema claro, QR)
- `components/fuentes/`: **PieFuente**, **NotaMetodologica**
- `components/iconos/`: **Icono**

**Adiciones intencionales** (no pedidas explícitamente): **CampoLuces**, porque el concepto "cada persona es una luz" aparece en casi todas las pantallas y tarjetas; **Icono**, envoltorio de los trazos Lucide para que hereden `currentColor`.

### UI kit

- `ui_kits/micrositio/index.html`: historia completa navegable a 390 px.
- `ui_kits/micrositio/pantallas.html`: Hero, campo de puntos de escala, Dibújalo tú (antes/después), paso de cohorte, mapa, formulario del Wrapped, carrusel de tarjetas.

---

## Manual de marca

### Nombre

**La generación que se apagó.** Siempre completo, en minúsculas salvo la inicial, sin comillas ni punto final. En espacios cortos: "La generación". Nunca siglas ("LGQSA"). Se compone en Bricolage Grotesque 700, ancho 82%, tracking −0.035em. En portada, la palabra "apagó" puede ir en el color de luz apagada; en el resto, el nombre va en un solo color.

### El concepto de luz

Cada persona es una luz. **Encendida = votó. Apagada = no votó.** Es la única metáfora visual del proyecto y se usa con disciplina:

- La luz encendida es **el único acento** (`--color-luz` #FFB547). Si algo brilla, es porque representa a alguien que votó o es la acción principal.
- Una luz apagada no desaparece: es **ceniza visible** (`--color-apagada`, 3:1 sobre el fondo). Quien no votó sigue contando.
- La narrativa empieza encendida (hero con todas las luces) y se oscurece conforme la generación crece. Al final aparecen los focos que siguen encendidos.
- Por defecto las luces se reparten sobre la **silueta de México en un mapa oscuro** (estados en `superficie`, bordes `linea`): el país se apaga. La rejilla se reserva para lecturas "de cada 100" (ficha impresa, tarjetas de edad y secciones). Los puntos no indican dónde vive cada votante.
- La misma semilla de `CampoLuces` en todas las escenas: las luces que se apagan son siempre las mismas personas.
- No usar focos, bombillas ni velas como íconos o ilustración. La luz son puntos.
- Halo solo en lo encendido, nunca en texto ni en tarjetas.

---

## CONTENT FUNDAMENTALS

**Voz:** cercana, honesta, sin sermonear ni culpar. Seria con los datos, cálida con las personas. Escribimos como una periodista de datos que le explica algo a una amiga.

- **Persona:** tuteo ("tu municipio", "tu generación"). Nosotros solo para el equipo ("No guardamos tus datos").
- **Mayúsculas:** tipo oración en todo (títulos, botones, etiquetas). VERSALES solo en antetítulos mono.
- **Cifras:** siempre con su significado en la misma oración. Un decimal en porcentajes (47.0% → "47%" si es redondo en el texto; "52.1%" en gráfica). Separador de miles con coma (15,000), decimal con punto, como el INE. "37.1 millones", no "37,100,000".
- **Edad y tiempo:** "a los 25", "en 2018", "seis años después". Nada de "segmento etario".
- **Sin exclamaciones ni emoji.** Las preguntas sí: invitan sin ordenar.
- **Fuente siempre visible:** "Fuente: INE, Conteo Censal de Participación 2024".
- **Errores:** en positivo y con la solución: "Escribe una edad entre 18 y 99 años."

| Sí | No |
|---|---|
| A los 25, menos de la mitad votó. | Los jóvenes no votan porque no les importa. |
| Tu generación nunca volvió a votar como la primera vez. | Tu generación le falló a México. |
| ¿Tu luz sigue encendida? | ¡Vota! ¡Es tu obligación! |
| Hay más de 15 mil secciones donde los jóvenes sí votan. | La juventud está perdida. |
| No guardamos tus datos. | Al continuar aceptas los términos y condiciones. |
| Dibujaste 58% a los 25. En realidad fue 47%. | ¡Fallaste! |
| Participación sobre lista nominal. | Tasa de participación ciudadana efectiva del padrón. |

---

## VISUAL FOUNDATIONS

**Ambiente:** noche cálida e íntima con un solo acento luminoso. Pieza editorial de periodismo de datos, no dashboard ni plantilla de startup.

**Color.** Tres niveles de noche cálida (`noche-1` #0E0C0A fondo, `noche-2` #181512 superficie, `noche-3` #231F1A superficie alta) y una línea `noche-linea` #3A342D. Texto en hueso (16.9:1), arena (8.9:1) y ceniza (≥4.97:1 incluso sobre noche-3). Alerta en coral #FF8466, siempre con ícono. Los alias semánticos (`--color-fondo`, `--color-texto`, `--color-foco-encendido`…) cambian solos con `data-tema="impresion"` a papel #FBF8F3, tinta #1C1814, ámbar de relleno #E39B22 y ámbar de texto #8C5600 (5.8:1).

**Escalas de datos.** Secuencial de 9 pasos de apagado (marrón casi negro) a encendido (amarillo pálido), construida en oklch con luminosidad monótona: se lee igual con protanopia, deuteranopia y en escala de grises. Versión papel invertida (más participación = más tinta). Divergente azul frío ↔ gris ↔ ámbar para "peor/mejor que el promedio" (eje azul–naranja, seguro para daltonismo). Mujeres durazno #F0986F, hombres cielo #65B4E9; nunca en la misma vista que la divergente. Ver `guidelines/datos-daltonismo.html`.

**Tipografía.** Bricolage Grotesque (títulos y cifras gigantes, 700, ancho 82%, tracking negativo), Atkinson Hyperlegible Next (lectura, diseñada para baja visión), IBM Plex Mono (etiquetas de gráfica, antetítulos, cifras tabulares). Escala fluida con `clamp()` entre 390 y 1280 px; tamaños fijos aparte para tarjetas 1080×1920.

**Espaciado y rejilla.** Base 4 px. Móvil: 4 columnas, margen 20, medianil 12. Escritorio: 12 columnas, margen 48, medianil 24, máximo 1200 px; texto a 36rem (~62 caracteres), gráficas a 60rem. Pasos de scrollytelling de 85vh.

**Fondos.** Planos, sin imágenes ni texturas. El único "patrón" es el campo de luces, y siempre representa datos. **Sin degradados**, sin glassmorphism, sin blur.

**Tarjetas.** Superficie sólida (`noche-2`), borde de 1 px `noche-linea`, radio 14 px, sin sombra. Nada de borde lateral de color.

**Radios.** Casi rectos: 2 (foco, etiquetas), 4 (campos), 8 (botones, toast, tooltip), 14 (tarjetas), full (puntos).

**Elevación.** Se sube con superficie, no con sombra. Solo tooltip y toast llevan sombra corta y oscura. El halo (`--shadow-halo`) es exclusivo de lo encendido.

**Transparencia.** Solo en el halo de las luces (16–35%) y en pasos inactivos (opacidad 40%). Nunca texto translúcido.

**Movimiento.** Entradas con `ease-entrada` (expo out), salidas con `ease-salida` (ease-in, más cortas). Interfaz ≤ 240 ms; narrativa: escena 900 ms, ola de luces 1400 ms con 6 ms de escalonado. `ease-apagado` para luces que se apagan (lento al inicio, como un filamento). Scroll ligado = lineal. `prefers-reduced-motion` reduce todo a 0.

**Hover.** Primario aclara a `luz-suave`; secundario rellena `superficie-alta` y su borde pasa a texto; texto engrosa el subrayado. 90 ms.

**Presión.** Escala 0.98, 90 ms. Sin cambios de color extra.

**Foco.** Contorno de 2 px en color acento con separación de 3 px; campos: borde luz + anillo 3 px al 18%.

**Imágenes.** No se usan fotografías. Si hiciera falta (prensa), cálidas, nocturnas, con grano, nunca stock sonriente.

**Capas fijas.** Solo la gráfica sticky del scrollytelling y el toast (con safe-area). Sin barras de navegación fijas.

---

## ICONOGRAPHY

- **Sistema:** [Lucide](https://lucide.dev) (ISC), trazo 1.75, esquinas redondeadas, 24 px de rejilla. Los 22 glifos usados están copiados en `assets/icons/*.svg` y como trazos en `components/iconos/lucide.js` (desde `lucide-static@0.460.0`). Se renderizan con `<Icono nombre="…">` y heredan `currentColor`.
- **Uso:** funcional, nunca decorativo. Botones (descargar, compartir, flechas), campos (chevron, −/+), toasts (check, alerta, info), Dibújalo tú (lápiz, reiniciar). Tamaños 16/20/24.
- **Sin emoji** como íconos, ni en copy. **Sin caracteres Unicode** como íconos, salvo "·" como separador y "−" (menos) en cifras.
- **Sin logotipos** (ni del INE ni propio) y sin ilustraciones: el campo de luces es la imagen del proyecto.

---

## Tokens para código

`export/tailwind-theme.css` y `export/tokens.json` tienen exactamente los mismos nombres y valores que `tokens/*.css` (generados de una misma fuente). Nombres clave: `--color-luz`, `--color-apagada`, `--color-seq-0…8`, `--color-div-0…8`, `--font-titulo`, `--font-texto`, `--font-mono`, `--text-display` (+ `--line-height`, `--letter-spacing`), `--ease-entrada`, `--ease-salida`, `--ease-enfasis`, `--ease-escena`, `--ease-scroll`, `--duration-media`.

## Fuentes tipográficas

Las tres familias son de Google Fonts (OFL) y están autoalojadas en `assets/fonts/`. Elección propia del sistema; no son sustituciones de archivos faltantes.

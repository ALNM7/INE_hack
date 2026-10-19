# Plan de ejecución: "La generación que se apagó" (v2, Angular + Tailwind)
Hackatón INE "Hackea la participación" 2026, Reto 3 (storytelling con datos)
Entrega: 31 de octubre de 2026, 23:59

Este documento lo ejecutan dos modelos de IA distintos. Cada fase tiene objetivo, archivos, especificación y criterios de aceptación. No avances a la siguiente fase sin cumplir los criterios de la actual.

---

## 0. Reglas obligatorias para cualquier modelo que ejecute

1. Nunca escribas comentarios de ningún tipo en el código (ni `//`, ni `/* */`, ni `#`, ni `<!-- -->`).
2. Nunca uses el carácter em dash (U+2014) en ningún archivo, texto, interfaz ni commit. Usa comas, punto, dos puntos o paréntesis.
3. Todo el texto visible está en español de México, tono cercano, sin sermonear. Nunca culpar a quien no vota.
4. Las cifras que aparecen en la web y en los videos salen siempre de los JSON generados en la Fase 1. Nunca escribas a mano una cifra que no exista en esos archivos.
5. El resultado debe verse profesional, sobrio y hecho con intención. Prohibido el look genérico de plantilla: nada de degradados morado a azul, glassmorphism sin razón, emojis como íconos, sombras exageradas, tarjetas idénticas en rejilla ni textos de relleno.
6. Antes de cada tarea de interfaz o animación, consulta las skills indicadas en la sección 3. Registra en `docs/SKILLS_USAGE.md` qué skill usaste, en qué componente y qué cambió gracias a ella.
7. Haz commit al cerrar cada fase con un mensaje claro en español.

---

## 1. División del trabajo

| Modelo | Responsable de | Fases |
|---|---|---|
| **Modelo A: Web y datos** | Repositorio, datos, design tokens en código, aplicación Angular, publicación | 0, 1, 2, 3, 5 |
| **Modelo B: Video** | Todo lo de HyperFrames: loop del hero, reels, carrusel, video pitch | 4 |

Puntos de contacto entre los dos (no tocar archivos del otro):

| Qué | Lo produce | Lo consume | Ruta |
|---|---|---|---|
| Design tokens | Claude Design, luego Modelo A | Modelo B | `brand/tokens.json`, `brand/tokens.css` |
| Datos procesados | Modelo A | Modelo B | `web/public/data/` copiado a `video/data/` |
| Loop del hero | Modelo B | Modelo A | `web/public/media/hero_loop.mp4` y `.webm` |
| Grabaciones de pantalla del sitio | Nava | Modelo B | `video/pitch/assets/` |

Mientras el Modelo B no entregue el loop, el Modelo A usa un `poster` estático en el hero.

---

## 2. Decisión técnica: qué hace HyperFrames y qué no

HyperFrames (HeyGen, Apache 2.0) convierte HTML + CSS + GSAP en **video MP4 determinista**. No es una librería de animación para una web en vivo.

| Pieza | Herramienta |
|---|---|
| Video pitch de 3 min (MP4 1080p) | HyperFrames |
| Reels verticales de difusión (9:16, 15 s) | HyperFrames |
| Carrusel PNG | Cuadros extraídos de los reels con FFmpeg |
| Video de fondo del hero (loop 8 s) | HyperFrames |
| Micrositio interactivo | Angular + Tailwind + GSAP + D3 |

Los dos mundos comparten `brand/tokens.json`, tipografías y GSAP, así que se ven como una sola marca.

---

## 3. Skills obligatorias

### 3.1 Instalación
```bash
npx skills@latest add emilkowalski/skills
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```
Si el agente no es Claude Code, usar `npx skills add heygen-com/hyperframes` y `npx hyperframes skills update`.

Verificar que existan todas estas skills de `emilkowalski/skills`. Si alguna no aparece, leer su `SKILL.md` directo del repositorio.

### 3.2 Cuándo usar cada skill (Modelo A)

| Skill | Dónde se aplica en este proyecto |
|---|---|
| `emil-design-eng` | Base de todo: leerla antes de escribir cualquier componente. Rige criterios de diseño y movimiento |
| `apple-design` | Jerarquía tipográfica, espaciado, movimiento fluido del scrollytelling y del Wrapped |
| `pick-ui-library` | Elegir primitivas de UI en vez de construirlas desde cero. Como es Angular, traducir la recomendación a su equivalente: Angular CDK (overlay, a11y, scrolling) y, si hace falta, Spartan UI |
| `animation-vocabulary` | Redactar la especificación de cada animación antes de programarla |
| `find-animation-opportunities` | Al terminar el esqueleto de cada sección, decidir qué se anima y qué no |
| `animate` | Construir cada animación nueva (curva, duración, propiedades) |
| `prototype` | Hacer 2 o 3 variantes del hero, de las tarjetas del Wrapped y del Acto 1, con un selector oculto (`?v=1`, `?v=2`) para que Nava elija |
| `mobile-native` | Safe areas, `100dvh`, sin zoom en inputs (16 px mínimo), sin parpadeo al tocar, estados hover solo con puntero fino |
| `break-ui` | Probar con municipios de nombre muy largo, datos suprimidos (`null`), 0%, 100%, cifras enormes y pantallas de 320 px |
| `ask-sonner` | Toasts de "Tarjeta descargada", "Enlace copiado", "No hay datos suficientes". En Angular usar `ngx-sonner`, que es el port oficial de la misma API |
| `improve-animations` | Auditoría al cerrar la Fase 3. Aplicar el plan priorizado que genere |
| `review-animations` | Revisión estricta final, después de `improve-animations` |
| `animation-performance` | Si algo baja de 60 fps en un celular de gama media, sobre todo el campo de 1,000 puntos y el mapa |
| `animate-expo` | Es para React Native y Expo. Leerla y registrar en `SKILLS_USAGE.md` qué principios de gestos y hápticos se trasladaron a la web (por ejemplo, `navigator.vibrate` corto al revelar la curva real) |
| `write-swift` | Es para Swift. No aplica a este proyecto. Registrarlo en `SKILLS_USAGE.md` con esa justificación |

### 3.3 Skills del Modelo B
`/hyperframes`, `/hyperframes-animation`, `/hyperframes-cli`, `/hyperframes-audio`, más `animation-vocabulary`, `animate`, `emil-design-eng` y `apple-design` de Emil para criterios de movimiento.

---

## 4. Estructura del repositorio

```
generacion-apagada/
  data_raw/                         (no se sube a git)
  pipeline/
    build_data.py
    validate_data.py
  brand/
    tokens.json
    tokens.css
    design-system/                  (exportación de Claude Design)
  web/                              (proyecto Angular)
    public/
      data/
      media/
      geo/mx_estados.topojson
    src/
      styles.css
      app/
        core/
          data.service.ts
          models.ts
          motion.ts
        sections/
          hero/
          escala/
          dibujalo/
          cohorte/
          wrapped/
        pages/
          home/
          ficha/
          metodologia/
        shared/
          ui/
          charts/
    .postcssrc.json
  video/
    hero/
    reels/
    pitch/
    data/
  docs/
    SKILLS_USAGE.md
    DECISIONES.md
  entrega/
  .gitignore
  README.md
```

`.gitignore`: `data_raw/`, `node_modules/`, `dist/`, `.angular/`, `video/**/renders/`.

---

## 5. Fase 0: preparación (Modelo A)

1. Verificar versiones: Node 22 o mayor, npm, Python 3.11+ con pandas, FFmpeg, Git. Si falta algo, detenerse y avisar.
2. Crear el repo con la estructura de la sección 4.
3. Crear la app Angular en `web/` con la última versión estable:
   ```bash
   npx @angular/cli@latest new web --style css --routing --ssr false --skip-git
   ```
   Componentes standalone, signals, control flow nuevo (`@if`, `@for`), `ChangeDetectionStrategy.OnPush` en todos los componentes.
4. Instalar Tailwind v4 según la guía oficial:
   ```bash
   cd web
   npm install tailwindcss @tailwindcss/postcss postcss --force
   ```
   `.postcssrc.json`:
   ```json
   { "plugins": { "@tailwindcss/postcss": {} } }
   ```
   `src/styles.css` empieza con `@import "tailwindcss";` y luego importa `brand/tokens.css` dentro de un bloque `@theme`.
5. Instalar dependencias:
   ```bash
   npm install gsap d3 topojson-client html-to-image qrcode ngx-sonner @angular/cdk
   npm install -D @types/d3 @types/topojson-client @types/qrcode prettier angular-cli-ghpages
   ```
6. Instalar las skills (sección 3.1) y crear `docs/SKILLS_USAGE.md` con una fila por skill y la columna "Estado: pendiente".
7. Copiar el contenido de `generacion-apagada-base.zip` en la raíz del repo: trae `pipeline/`, `web/public/data/` y `docs/DATOS.md`. Los CSV crudos no se usan ni se suben.
8. Copiar la exportación del design system a `brand/design-system/` y generar `brand/tokens.json` y `brand/tokens.css` (ver Fase 2).
9. Crear `README.md` inicial y hacer el primer commit.

Criterios de aceptación:
- `npm run start` dentro de `web/` levanta una página en blanco con el fondo y la tipografía del design system.
- Una clase de Tailwind que usa un token (por ejemplo `bg-noche text-luz`) se ve correctamente.
- `docs/SKILLS_USAGE.md` lista las 15 skills de Emil y las de HyperFrames.
- `web/public/data/` existe con los JSON ya validados y `python pipeline/validate_data.py web/public/data` imprime `OK` (solo necesita los JSON).

---

## 6. Fase 1: preparación de datos (YA HECHA, no repetir)

Esta fase se ejecutó fuera del repo porque los CSV pesan casi 2 GB. Los JSON resultantes ya vienen en `web/public/data/` y su estructura está en `docs/DATOS.md`. El Modelo A no debe regenerarlos ni modificarlos; si necesita un dato nuevo, se lo pide a Nava. Lo que sigue documenta cómo se generaron, para el README y la metodología.

### Entrada
`data_raw/DatosAbiertos_DECEyEC_ConteosCensales{2012,2018,2024}/*.csv` (32 archivos por año).

Columnas: `AELEC, FELECCION, EDOCVE, EDONOM, MPIOCVE, MPIONOM, SECCION, TIPOSEC, DEF, DEL, SEXO, EDAD, LN, SV, NV, NS`
- SEXO: 0 hombre, 1 mujer, 2 no binario (solo 2024)
- TIPOSEC: U, M, R
- LN lista nominal, SV sí votó, NV no votó, NS no especificado
- Leer siempre con `encoding="utf-8-sig"` (los de 2024 traen BOM)
- 9 a 10 millones de filas por año: leer un archivo por estado a la vez, agregar y liberar memoria
- Dtypes compactos al leer, pero **LN, SV, NV y NS a `int64` antes de sumar** (con `int32` las sumas se desbordan)
- En 2012 NS casi siempre es 0 (0.2% contra 6.8% en 2018). Anotarlo en metodología

### Definiciones
- `participacion = SV / (SV + NV) * 100`, 1 decimal. NS fuera del denominador
- `ns_pct = NS / LN * 100`
- Grupos de edad: `18-19, 20-24, 25-29, 30-34, 35-44, 45-59, 60-69, 70-79, 80+`
- Joven = 18 a 29
- Supresión: si `SV + NV < 50`, publicar `null`
- Municipio con `ns_pct > 50`: `"calidad": "baja"`, fuera de rankings
- Llave de estado: `EDOCVE`. Nombres con diccionario fijo de 32 entradas en formato título con acentos ("Ciudad de México", "Michoacán", "Nuevo León", etc.)

### Salidas en `web/public/data/` (JSON minificados)
1. `nacional.json`: ln, sv, nv, part, ns_pct por año; `abstencion_2024`; `abstencion_jovenes_2024`
2. `edad_exacta.json`: participación por edad 18 a 95 por año, más `2024_h` y `2024_m`
3. `cohortes.json`: para edades 18 a 60 en 2012, su valor en 2012, edad +6 en 2018 y edad +12 en 2024; más la serie 2018 a 2024 para edades 18 a 70
4. `estados.json`: por estado, total 2012, 2018 y 2024; jóvenes por año; por grupo de edad y sexo en 2024
5. `municipios/XX.json`: por municipio, clave, nombre, ln, part 2024, part por grupo de edad x sexo 2024, part 2018 si existe con la misma clave, calidad, número de secciones, sección con mayor y menor participación (secciones con SV+NV >= 200)
6. `focos.json`: conteo por municipio de secciones donde los jóvenes votan 60% o más (SV+NV jóvenes >= 50)
7. `catalogo.json`: estados y municipios para selectores
8. `meta.json`: fecha, fuente, notas

### Validación (`validate_data.py`), tolerancia 0.1

| Indicador | Esperado |
|---|---|
| Participación nacional 2012 | 62.1 |
| Participación nacional 2018 | 62.4 |
| Participación nacional 2024 | 59.7 |
| Hombres 2012 / Mujeres 2012 | 57.8 / 66.1 |
| Hombres 2024 / Mujeres 2024 | 54.8 / 64.2 |
| Edad 18 en 2024 | 61.5 |
| Edad 25 en 2024 | 46.9 |
| Edad 65 en 2024 | 76.8 |
| Cohorte larga: 18 en 2012, 24 en 2018, 30 en 2024 | 66.7, 52.1, 50.3 |
| Cohorte corta: 18 en 2018, 24 en 2024 | 64.8, 47.1 |
| Jóvenes 18 a 24 Sonora / Yucatán 2024 | 38.7 / 64.8 |
| Abstencionistas 2024 (NV) | 37,105,466 |
| NV de 18 a 29 en 2024 | 12,383,365 |

Además: 32 estados, más de 2,400 municipios, ningún JSON de municipio mayor a 400 KB, ningún NaN ni negativo.

Criterios: el build termina en menos de 15 min y menos de 3 GB de RAM; la validación imprime `OK`; copiar los JSON a `video/data/`.

---

## 7. Fase 2: identidad (Modelo A)

La identidad la define el design system creado en Claude Design (prompt aparte). El Modelo A solo la traduce a código:

1. Leer la exportación en `brand/design-system/`.
2. Generar `brand/tokens.json` con: colores (incluye escalas de datos), tipografías, escala tipográfica, espaciado, radios, sombras, duraciones y curvas de movimiento.
3. Generar `brand/tokens.css` como variables dentro de `@theme` de Tailwind v4 (por ejemplo `--color-luz`, `--font-titulo`, `--ease-entrada`), para que existan utilidades como `bg-luz`, `font-titulo`, `ease-entrada`.
4. Crear `src/app/core/motion.ts` que exporta las mismas curvas y duraciones para GSAP.
5. Crear una ruta oculta `/tokens` que muestre todos los tokens para revisarlos a ojo.

Criterio: ningún color, tamaño o duración escrito a mano en los componentes; todo sale de tokens.

---

## 8. Fase 3: aplicación Angular (Modelo A)

### Arquitectura
- Rutas: `/` (historia completa), `/ficha/:edo/:mpio`, `/metodologia`, `/tokens` (oculta).
- `DataService` con `HttpClient` y signals; carga perezosa de `municipios/XX.json` solo cuando se elige estado; caché en memoria.
- GSAP se inicializa en `afterNextRender`; cada componente guarda su `gsap.context()` y lo revierte en `DestroyRef.onDestroy`. Registrar `ScrollTrigger` una sola vez en `motion.ts`.
- D3 solo calcula escalas, rutas y proyecciones; el SVG se pinta con plantillas de Angular siempre que sea posible.
- `prefers-reduced-motion`: servicio con signal; si está activo, sin scrub ni animaciones largas, solo estados finales con fundidos cortos.
- Mobile first: diseñar a 390 px y luego escalar.
- Publicación en GitHub Pages: `ng build --base-href /<repo>/` y `npx angular-cli-ghpages --dir=dist/web/browser`. Copiar `index.html` como `404.html` para que funcionen las rutas.

### Secciones

**8.1 Hero.** Video `media/hero_loop.mp4` de fondo (muted, autoplay, loop, playsinline, poster). Título "La generación que se apagó". Subtítulo "A los 18 votamos con ganas. A los 24, la mitad ya no fue. ¿Qué pasó en el camino?". Botón "Empezar". Usar `prototype` para 2 o 3 variantes.

**8.2 Escala.** "En 2024, 37.1 millones de personas con credencial no votaron." Canvas con 1,000 puntos (cada uno = 37,105 personas) que pasan de encendidos a apagados con ScrollTrigger hasta la proporción real; luego se resaltan los de 18 a 29. Cierre: "Uno de cada tres tiene entre 18 y 29 años." Revisar con `animation-performance`.

**8.3 Acto 1, "Dibújalo tú".** SVG edad (18 a 85) por participación (0 a 100). El punto de 18 años ya viene puesto. El usuario traza con el dedo o el mouse. Botón "Ver la realidad" al llegar a 85. La curva real se dibuja con `stroke-dashoffset`; el área entre curvas se sombrea. Mensaje: "Te equivocaste por X puntos en promedio" y la frase sobre los 25 años (47%). Alternativa accesible con teclado (+/- por grupo de edad). Usar `prototype` para 2 variantes de interacción.

**8.4 Acto 2, "Lo que se apagó".** Scrollytelling con gráfica sticky:
1. "Ana y Luis cumplieron 18 en 2018. Era su primera elección."
2. Punto 18 años en 2018: 64.8%.
3. Transición a 24 años en 2024: 47.1%. "Seis años después, su generación perdió 18 puntos."
4. La generación de 2012: 66.7% a los 18, 52.1% a los 24, 50.3% a los 30. "Nunca se recuperó."
5. Contraste: la generación de 50 en 2018 se mantuvo (68.8 a 68.9).
6. Brecha de género 25 a 29: hombres 40.6%, mujeres 53.9%.
7. Mapa de jóvenes 18 a 24 por estado con `geo/mx_estados.topojson` (ya incluido, unir por `c`); etiquetas en Sonora (38.7) y Yucatán (64.8); tooltip con Angular CDK Overlay.
8. Cierre: "Pero hay casi 15 mil secciones donde los jóvenes sí votan." (cifra exacta en `focos.json`, campo `total`). Puntos que se encienden escalonados con semilla fija.

**8.5 Acto 3, "Tu Wrapped".** Formulario: estado, municipio (dependiente), edad, sexo. Genera 5 tarjetas 1080x1920 (vista escalada y deslizable):
1. "En [municipio] votaron [X] de cada 10 personas."
2. "Las personas de tu edad votaron [Y]%. Tu municipio: [Z]%."
3. Posición de su grupo de edad frente a los demás de su municipio.
4. "La sección que más votó llegó a [A]% y la que menos a [B]%."
5. "¿Tu luz sigue encendida?" + próxima elección federal + fuente.

Si un dato es `null`, usar el del estado y avisarlo. Descargar PNG con html-to-image, descargar todas, compartir con `navigator.share`. Toasts con `ngx-sonner`. Texto: "Tus datos no salen de tu teléfono." Usar `prototype` para 3 estilos de tarjeta y `break-ui` con nombres largos.

**8.6 Metodología.** Fuente y enlace, qué se cuenta y qué no, definición de participación, cohorte aproximada, supresión, calidad de captura, diferencia de NS en 2012, solo se comparan presidenciales.

**8.7 Ficha institucional.** `/ficha/21/115` (Puebla capital), hoja carta, estilo claro para imprimir (`@page { size: letter; margin: 12mm; }`). Contenido: municipio, participación 2024 y 2018, curva del municipio contra la nacional, brecha de género en jóvenes, sección más y menos participativa, 3 mensajes para pláticas en escuelas, QR al sitio. Enlace discreto desde el sitio: "Soy del INE o docente: generar ficha de mi municipio".

### Cierre de la Fase 3
1. Correr `find-animation-opportunities` sobre todo el sitio y aplicar lo que tenga sentido.
2. Correr `improve-animations` y aplicar el plan priorizado.
3. Correr `review-animations` y corregir todo lo que marque.
4. Correr `break-ui` y `mobile-native` sobre cada sección.
5. Actualizar `docs/SKILLS_USAGE.md`: ninguna skill puede quedar en "pendiente".

### Criterios de aceptación
- Lighthouse móvil: rendimiento 85 o más, accesibilidad 95 o más.
- Bundle inicial menor a 350 KB comprimido (sin video).
- Chrome, Safari iOS y Firefox sin errores en consola.
- Cifras visibles iguales a los JSON.
- `ng build` sin advertencias.

---

## 9. Fase 4: videos con HyperFrames (Modelo B)

### Reglas técnicas
- Una sola timeline GSAP pausada por composición, registrada en `window.__timelines["id"]`.
- Animar posición solo con `x`, `y`, `scale`, `rotation`. Nunca `width`, `height`, `top`, `left`.
- Calcular layout al inicio, nunca con `getBoundingClientRect` durante la animación.
- Nada aleatorio sin semilla, nada que dependa del reloj.
- Datos incrustados como `<script type="application/json">` desde `video/data/`, sin `fetch`.
- Gráficas dibujadas con D3 a SVG en la preparación y animadas con GSAP.
- Colores, fuentes y curvas desde `brand/tokens.json`.
- `npx hyperframes preview` para revisar, `npx hyperframes render` para exportar.
- Correr la auditoría `animation-map.mjs` antes de cada render.

### 9.1 `video/hero`: loop 1920x1080, 8 s, sin audio
Campo de luces que respiran y una ola de apagado que recorre de izquierda a derecha y vuelve a encender. Primer y último cuadro idénticos. MP4 H.264 CRF 28 y WebM VP9, menos de 3 MB. Entregar en `web/public/media/`.

### 9.2 `video/reels`: 4 reels 1080x1920, 15 s
1. `reel_curva`: "¿A qué edad crees que menos se vota?" -> curva -> "A los 25. Solo 47%."
2. `reel_cohorte`: "En 2012 tenías 18 y votaste. ¿Y después?" -> 66.7, 52.1, 50.3.
3. `reel_estados`: estados que se encienden de Sonora (38.7) a Yucatán (64.8).
4. `reel_37m`: "37.1 millones no votaron. Uno de cada tres tiene entre 18 y 29."

Subtítulos quemados (máximo 42 caracteres por línea), música libre de derechos a volumen 0.4, URL del sitio al final.

### 9.3 Carrusel
6 a 8 PNG 1080x1350 a partir de los cuadros finales de cada escena (FFmpeg o composición 4:5 dedicada). Unir en `entrega/carrusel.pdf`.

### 9.4 `video/pitch`: 1920x1080, máximo 2:55

| Tiempo | Escena | Visual |
|---|---|---|
| 0:00 a 0:15 | Gancho | Luces que se apagan. "37.1 millones no votaron en 2024." |
| 0:15 a 0:40 | Problema | Curva por edad 2024 dibujándose |
| 0:40 a 1:05 | Hallazgo | Cohorte 2012: 66.7, 52.1, 50.3. Contraste con la generación de 50 |
| 1:05 a 1:20 | Contexto | Brecha de género y Sonora contra Yucatán |
| 1:20 a 2:10 | Solución | Grabaciones del sitio dentro de un marco de teléfono animado |
| 2:10 a 2:35 | Valor para el INE | Fichas por municipio, costo cero, datos abiertos, reutilizable en 2027 |
| 2:35 a 2:55 | Cierre | "Que tu luz no se apague." Equipo, URL, repo |

Voz en off grabada por un integrante (WAV limpio). Grabaciones de pantalla a 1080p y 30 fps, entregadas por Nava.

### Criterios
Pitch menor a 3:00, 1920x1080, H.264 + AAC. Reels 1080x1920 de 15 s. Cifras iguales a los JSON. Pitch en YouTube oculto, verificado en incógnito.

---

## 10. Fase 5: publicación y QA (Modelo A)

1. Publicar en GitHub Pages.
2. README: descripción, cómo correr el pipeline, `npm start`, cómo renderizar videos, licencia, fuente de datos.
3. QA:
   - [ ] Android y iPhone reales
   - [ ] 5 municipios en Wrapped (grande, rural chico, con datos suprimidos, nombre largo, CDMX)
   - [ ] Ficha impresa en papel
   - [ ] Acentos de los 32 estados
   - [ ] `grep -rn $'\xe2\x80\x94' .` vacío
   - [ ] Sin comentarios en el código
   - [ ] `docs/SKILLS_USAGE.md` completo

---

## 11. Entregables

| Entregable | Archivo | Responsable |
|---|---|---|
| Presentación (máx. 10 diapositivas) | `entrega/presentacion.pdf` | Integrantes 2 y 3 |
| Código o repositorio | URL + `entrega/codigo.zip` | Nava (Modelo A) |
| Carta de cesión firmada | `entrega/carta_cesion.pdf` | Los 4 |
| Carta declaratoria firmada | `entrega/carta_declaratoria.pdf` | Los 4 |
| Prototipo visual | URL del sitio + `entrega/carrusel.pdf` | Modelos A y B |
| Guion narrativo (3 a 5 cuartillas) | `entrega/guion_narrativo.pdf` | Integrante 4 |
| Video pitch | URL de YouTube oculto | Modelo B + voz de un integrante |

Todo en un `.zip` con nombre del equipo y eje.

---

## 12. Cronograma

| Fecha | Modelo A | Modelo B |
|---|---|---|
| 19 a 20 oct | Design system, Fase 0, Fase 2 | Instalar HyperFrames, prueba de render |
| 21 a 22 oct | Hero, Escala, Acto 1 | Hero loop |
| 23 a 25 oct | Acto 2, Wrapped, ficha, metodología | Reels y carrusel |
| 26 a 27 oct | Cierre de Fase 3 (skills de auditoría) | Pitch (con grabaciones del sitio) |
| 28 a 30 oct | Fase 5 | Ajustes finales y subida |
| 31 oct | Entrega antes de las 20:00 | |

---

## 13. Prompts por modelo

Adjunta siempre este documento. Una sesión por prompt.

**Modelo A, Fase 0**: ver archivo `PROMPTS.md`.

**Modelo A, Fase 1**
> No aplica: los datos ya vienen procesados en `generacion-apagada-base.zip`.

**Modelo A, Fase 2 y 3**
> Lee PLAN_la_generacion_que_se_apago.md. Eres el Modelo A. Ejecuta la Fase 2 (sección 7) y luego la Fase 3 (sección 8) sección por sección. Antes de cada componente consulta las skills de la sección 3.2 que apliquen y registra su uso en `docs/SKILLS_USAGE.md`. Al terminar cada sección levanta `npm start`, revisa la consola y hazme un resumen de lo que cambió. Respeta la sección 0.

**Modelo B, Fase 4**
> Lee PLAN_la_generacion_que_se_apago.md. Eres el Modelo B y solo trabajas dentro de `video/` y en `web/public/media/hero_loop.*`. Instala las skills de la sección 3.1 y usa las de la sección 3.3. Ejecuta la Fase 4 (sección 9) en este orden: 9.1, 9.2, 9.3, 9.4. Usa `brand/tokens.json` y los JSON de `video/data/`. Antes de cada render corre la auditoría de animación. Respeta la sección 0.

**Modelo A, Fase 5**
> Lee PLAN_la_generacion_que_se_apago.md. Eres el Modelo A. Ejecuta la Fase 5 (sección 10) y reporta cada punto del QA como cumplido o pendiente.

---

Fuentes:
- Datos: https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/
- HyperFrames: https://github.com/heygen-com/hyperframes
- Skills de Emil Kowalski: https://github.com/emilkowalski/skills
- Tailwind en Angular: https://tailwindcss.com/docs/installation/framework-guides/angular

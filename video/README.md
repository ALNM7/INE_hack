# Videos de "La generación que se apagó"

Composiciones de HyperFrames del Modelo B. Cada carpeta con `index.html` es un proyecto: `hero`, `reels/reel_curva`, `reels/reel_cohorte`, `reels/reel_estados`, `reels/reel_37m` y `carrusel`.

## Preparar

```bash
cd video
npm install
node build.mjs
```

`build.mjs` copia fuentes, librerías y `comun/` a `assets/` de cada proyecto (carpetas generadas, fuera de git) e incrusta en cada `index.html` la marca de `brand/tokens.json` (vía `brand.js`) y los JSON de `video/data/` como `<script type="application/json">`.

## Renderizar

```bash
node render.mjs hero
node render.mjs reel_curva reel_cohorte reel_estados reel_37m
node render.mjs carrusel
```

Cada tarea corre build, lint y la auditoría `animation-map.mjs` (reporte en `auditoria/`). Si la auditoría marca algo, el render se detiene.

Salidas:

- `web/public/media/hero_loop.mp4`, `hero_loop.webm`, `hero_poster.jpg`
- `video/salida/reels/*.mp4`
- `video/salida/carrusel/*.png` y `entrega/carrusel.pdf`

## Música de los reels

Cada reel declara su pista en `<script type="application/json" id="pista-musica">` con `data-volume="0.4"`. Coloca el archivo en `video/musica/musica.mp3` y vuelve a renderizar: el build agrega el `<audio>` solo cuando el archivo existe.

## Configuración

`config.json` guarda la URL del sitio, la zona segura de Instagram y TikTok (250 px arriba, 350 px abajo) y el límite de 42 caracteres por línea de subtítulo.

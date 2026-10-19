# La generación que se apagó

Micrositio de storytelling con datos para el hackatón del INE "Hackea la participación" 2026, Reto 3. Cuenta, con los Conteos Censales de Participación Ciudadana 2012, 2018 y 2024, cómo cae la participación electoral en la juventud y dónde sigue encendida.

Estado: Fases 0, 1 y 2 terminadas. De la Fase 3 están la arquitectura, el Hero (3 variantes) y la Escala. El plan completo está en `docs/PLAN_la_generacion_que_se_apago.md`.

## Qué hay en el repo

| Carpeta | Contenido |
|---|---|
| `pipeline/` | `build_data.py` (genera los JSON desde los CSV del INE) y `validate_data.py` (revisa cifras clave) |
| `brand/` | `design-system/` (exportación de Claude Design), `tokens.json`, `tokens.css`, `fonts.css` y `generar_tokens.py` |
| `web/` | App Angular 22 con Tailwind v4. Los datos procesados viven en `web/public/data/` |
| `video/` | Composiciones de HyperFrames (Modelo B): `hero/`, `reels/`, `pitch/`, `data/` |
| `docs/` | Plan, checklist, prompts, `DATOS.md`, `DECISIONES.md`, `SKILLS_USAGE.md` y capturas |
| `entrega/` | Entregables finales del hackatón |
| `data_raw/` | CSV crudos del INE (casi 2 GB). No se suben a git |

## Requisitos

- Node 22.22.3 o mayor (o Node 24.15 o mayor). Angular 22 no arranca con versiones anteriores.
- npm 10 o mayor
- Python 3.11 o mayor con pandas
- FFmpeg
- Git

## Correr el sitio

```bash
cd web
npm install
npm start
```

Abre `http://localhost:4200/`. La ruta `http://localhost:4200/tokens` muestra todos los tokens del design system para revisarlos a ojo; no se enlaza desde el sitio.

Build de producción:

```bash
cd web
npx ng build
```

Variantes del hero para elegir: `http://localhost:4200/?v=1`, `?v=2` y `?v=3`. Con `?v=` aparece un selector arriba (teclas 1 a 3, flechas y R para repetir la entrada). Sin el parámetro se muestra la variante 1 y no hay selector.

## Publicar en GitHub Pages

```bash
cd web
npm run build:pages
npm run deploy
```

`build:pages` compila con `--base-href /INE_hack/` y copia `index.html` como `404.html` para que funcionen las rutas. `deploy` publica `dist/web/browser` en la rama `gh-pages`.

## Video del hero

El hero lee `web/public/media/hero.json`. Hoy está activo con el loop del Modelo B (`hero_loop.webm`, `hero_loop.mp4` y el póster `hero_poster.jpg`, generados con `node render.mjs hero` dentro de `video/`). Si se cambia `"listo"` a `false`, el hero muestra solo el póster.

## Datos

Los JSON de `web/public/data/` ya vienen procesados y validados. No se editan a mano. Su estructura está en `docs/DATOS.md`.

Validar:

```bash
python pipeline/validate_data.py web/public/data
```

Debe terminar con `OK`.

Regenerar desde cero (solo si cambian los CSV): poner los CSV en `data_raw/DatosAbiertos_DECEyEC_ConteosCensales{2012,2018,2024}/` y correr `python pipeline/build_data.py`.

## Tokens de diseño

La fuente es `brand/design-system/export/tokens.json`. Para regenerar `brand/tokens.json`, `brand/tokens.css` y `brand/fonts.css`:

```bash
python brand/generar_tokens.py
```

`web/src/styles.css` importa Tailwind, las fuentes y los tokens. Tailwind no trae paleta por defecto: solo existen los colores del design system (`bg-fondo`, `text-luz`, `bg-noche-1`, etc.). El tema claro para imprimir se activa con `data-tema="impresion"` en cualquier contenedor.

## Skills para agentes

Las skills de Emil Kowalski no se suben al repo (traen texto y código de terceros). Se restauran con la versión fijada en `skills-lock.json`:

```bash
npx skills@latest experimental_install
```

El plugin de HyperFrames queda declarado en `.claude/settings.json`. Si no se instala solo:

```bash
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes
```

## Fuente de datos

INE, Conteos Censales de Participación Ciudadana 2012, 2018 y 2024.
https://ine.mx/transparencia/datos-abiertos/visualizacion-datos/conteos-censales-participacion/

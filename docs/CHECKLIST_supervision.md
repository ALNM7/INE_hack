# Checklist de supervisión: "La generación que se apagó"
Va de la mano con `PLAN_la_generacion_que_se_apago.md`. Marca cada punto solo cuando lo hayas visto tú, no cuando el modelo diga que ya quedó.

## Design system (meta: 20 oct)
- [ ] Design system creado en Claude Design con el prompt de `PROMPTS.md`
- [ ] Trae tokens en CSS `@theme` y en JSON con los mismos valores
- [ ] Versión clara para la ficha impresa

## Fase 0. Preparación, Modelo A (meta: 20 oct)
- [ ] Repo creado en GitHub, público, con `.gitignore` que excluye `data_raw/`, `node_modules/`, `dist/` y `renders/`
- [ ] Node 22 o más reciente, FFmpeg y Python con pandas (`node -v`, `ffmpeg -version`)
- [ ] App Angular en `web/` con Tailwind v4 funcionando
- [ ] Las 15 skills de Emil y el plugin de HyperFrames instalados
- [ ] `docs/SKILLS_USAGE.md` con las 15 skills y `docs/DECISIONES.md` con las reglas de diseño
- [ ] Página `/tokens` muestra los colores y fuentes del design system
- [ ] `generacion-apagada-base.zip` descomprimido y `validate_data.py` imprime OK

## Fase 1. Datos (ya hecha por Claude, solo verifica)
- [ ] `validate_data.py` imprime `OK` (pídele que te pegue la salida completa)
- [ ] Nacional: 62.1 (2012), 62.4 (2018), 59.7 (2024)
- [ ] Cohorte: 66.7 a los 18 (2012) -> 52.1 a los 24 (2018) -> 50.3 a los 30 (2024)
- [ ] Ningún número negativo ni NaN en los JSON
- [ ] Existen 32 archivos en `web/public/data/municipios/`, ninguno arriba de 400 KB
- [ ] Revisa a mano un municipio que conozcas (Puebla capital, por ejemplo) y que el nombre traiga acentos

## Fase 2. Identidad (meta: 20 oct)
- [ ] `brand/tokens.json` y `tokens.css` con los mismos colores
- [ ] Los componentes usan solo tokens, sin logos del INE

## Fase 3. Micrositio Angular (meta: 27 oct)
- [ ] Hero con video en loop y botón "Empezar"
- [ ] Campo de 1,000 puntos que se apagan (37.1 millones)
- [ ] Acto 1: puedes dibujar con el dedo en tu celular y aparece la curva real
- [ ] Acto 2: el scroll avanza la historia sin saltos; aparecen los 3 puntos de la cohorte
- [ ] Mapa: Sonora 38.7 y Yucatán 64.8 en jóvenes
- [ ] Cierre con los focos encendidos
- [ ] Wrapped: pruebas 5 municipios (uno grande, uno rural chico, uno con datos suprimidos) y descargas el PNG
- [ ] Ficha institucional se imprime bien en hoja carta y trae QR
- [ ] Página de metodología completa
- [ ] Sin errores en consola (F12) y `ng build` sin advertencias
- [ ] Lighthouse móvil: rendimiento 85+, accesibilidad 95+
- [ ] Elegiste entre las variantes de `prototype` (hero, Acto 1, tarjetas)
- [ ] Se corrieron `improve-animations`, `review-animations`, `break-ui` y `mobile-native`
- [ ] `docs/SKILLS_USAGE.md` sin ninguna skill en pendiente
- [ ] No se ve genérico: nada de degradados morados, emojis ni tarjetas clonadas

## Fase 4. Videos HyperFrames, Modelo B (meta: 28 oct)
- [ ] Modelo B solo tocó `video/` y `web/public/media/`
- [ ] Hero loop: menos de 3 MB, el primer y último cuadro coinciden
- [ ] 4 reels de 15 s en 1080x1920 con subtítulos
- [ ] Carrusel de 6 a 8 PNG y su PDF
- [ ] Voz en off grabada y limpia
- [ ] Grabaciones de pantalla del sitio a 1080p
- [ ] Pitch: menos de 3:00, 1920x1080, se escucha bien
- [ ] Pitch subido como oculto y abre en modo incógnito
- [ ] Las cifras del video coinciden con las del sitio

## Fase 5. Publicación y QA (meta: 30 oct)
- [ ] Sitio en GitHub Pages abre desde un celular con datos móviles
- [ ] README explica cómo correr todo
- [ ] Probado en Android y iPhone
- [ ] Búsqueda de em dash en el repo sale vacía
- [ ] Sin comentarios en el código

## Entregables del equipo (meta: 28 oct)
- [ ] Presentación de máximo 10 diapositivas (PDF)
- [ ] Guion narrativo de 3 a 5 cuartillas con propuesta de difusión (PDF)
- [ ] Carta de cesión de derechos firmada por los 4
- [ ] Carta declaratoria firmada por los 4

## Entrega final (31 oct, antes de las 20:00)
- [ ] Zip con nombre del equipo y eje, con los 7 entregables
- [ ] Enlaces del zip probados en modo incógnito
- [ ] Captura de pantalla del correo o formulario de envío

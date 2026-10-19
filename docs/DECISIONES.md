# Decisiones de diseño y movimiento

Salen de leer completas `emil-design-eng`, `apple-design` y `pick-ui-library`, cruzadas con el design system de `brand/design-system/`. Aplican a todo el sitio. Si una regla choca con el design system, gana el design system y se anota aquí.

## Las 10 reglas

1. **Cada animación tiene un propósito con nombre.** Antes de animar algo se dice para qué: retroalimentación, consistencia espacial, indicar un estado, evitar un cambio brusco o explicar un dato. "Se ve bonito" no cuenta. Lo que se usa muchas veces (abrir un selector, navegar con teclado) no se anima. El presupuesto de delicia se gasta solo en momentos raros: revelar la curva real, los focos que se encienden al final, generar el Wrapped.

2. **Interfaz rápida, narrativa con su tiempo.** Botones, toasts, tooltips y selectores van de 90 a 240 ms (`--duration-instante`, `--duration-corta`, `--duration-media`). Ningún elemento de interfaz pasa de 300 ms. Las escenas de la historia sí pueden durar más (`--duration-escena` 900 ms, `--duration-encendido` 1400 ms) porque explican un dato.

3. **Curvas propias y con nombre, nunca las de CSS.** Todo lo que entra usa `--ease-entrada`. Lo que sale usa `--ease-salida` y dura menos que su entrada. Lo que se mueve en pantalla usa `--ease-escena`. Lo ligado al scroll es lineal (`--ease-scroll`). La luz que se apaga usa `--ease-apagado`. `--ease-enfasis` (con rebote) solo para una cifra que aterriza. `ease-in` nunca en un elemento de interfaz. GSAP lee las mismas curvas desde `core/motion.ts`.

4. **Solo `transform` y `opacity`.** Nada de animar `width`, `height`, `top`, `left`, `margin` ni `padding`. `clip-path` se permite para revelados. El trazo de la curva usa `stroke-dashoffset`. El campo de 1,000 luces va en canvas, no en DOM.

5. **Nada aparece de la nada.** Las entradas empiezan en `scale(0.95)` con `opacity: 0`, nunca en `scale(0)`. Los tooltips del mapa y cualquier panel salen desde su origen (`transform-origin` en el disparador). La única excepción son los diálogos centrados.

6. **Respuesta en el momento del toque.** Todo lo que se presiona reacciona en `:active` con `scale(0.98)` en `--duration-instante`, sin esperar al `click`. En el Acto 1 el trazo sigue al dedo 1:1 con Pointer Events y `setPointerCapture`, respetando dónde se tocó, sin retrasos ni suavizados que se sientan como lag.

7. **Todo se puede interrumpir.** Ninguna transición bloquea la entrada del usuario. Lo que se dispara seguido (toasts, cambios de estado) usa transiciones que retoman desde el valor actual, no keyframes que empiezan de cero. El scrollytelling usa `scrub` para que regresar el scroll regrese la historia sin saltos.

8. **Movimiento reducido es más suave, no cero.** Con `prefers-reduced-motion` se quitan desplazamientos, escalas, scrub y rebotes, y se dejan fundidos cortos que explican el cambio. Los tokens ya llevan las duraciones largas a 0 en ese modo. Hover solo dentro de `@media (hover: hover) and (pointer: fine)`; en touch la retroalimentación es `:active`.

9. **Tipografía con tracking e interlineado por tamaño.** Se usa la escala del design system tal cual: display y cifras con interlineado cerrado y tracking negativo, cuerpo cerca de 0, etiquetas y antetítulos mono con tracking positivo. La jerarquía se arma con tamaño, peso e interlineado juntos. Cifras que cambian o se comparan van con `tabular-nums`. Los campos de formulario nunca bajan de 16 px.

10. **Una sola luz y cero decoración vacía.** El único acento es `--color-luz` y solo marca a quien votó o la acción principal. Elevación con superficie, no con sombra; el halo es exclusivo de lo encendido. Sin degradados, sin glassmorphism, sin blur de fondo, sin emojis, sin tarjetas clonadas en rejilla. Cada valor de color, tamaño, espacio, radio, sombra, duración y curva sale de `brand/tokens.css`; Tailwind no tiene paleta por defecto (`--color-*: initial`), así que un color fuera de los tokens ni siquiera compila a una clase.

## Primitivas de UI en Angular

`pick-ui-library` recomienda librerías de React. Esta es la traducción a Angular, una por tarea:

| Tarea | Recomendación de la skill | En este proyecto | Uso |
|---|---|---|---|
| Primitivas accesibles (popover, overlay, foco, listas) | base-ui | **Angular CDK** (`@angular/cdk`): `Overlay` y `ConnectedPosition` para el tooltip del mapa, `A11yModule` (`FocusTrap`, `LiveAnnouncer`, `FocusMonitor`) para foco y anuncios, `ScrollingModule` si una lista crece | Tooltip del mapa con `transform-origin` en el estado señalado, anuncio de resultados del Wrapped a lectores de pantalla |
| Toasts | Sonner | **ngx-sonner** (port de la misma API) | Un solo `<ngx-sonner-toaster>` en la raíz, `theme="dark"`, estilos con tokens. "Tarjeta descargada", "Enlace copiado", "No hay datos suficientes" |
| Gráficas | recharts | **D3** solo para escalas, rutas y proyecciones; el SVG se pinta con plantillas de Angular | Curva por edad, cohorte, mapa de estados |
| Animación general | motion | **GSAP** con `ScrollTrigger` (ya es dependencia del plan y lo comparte el Modelo B); CSS transitions para lo simple | Scrollytelling, campo de luces, revelados. Hover y press se quedan en CSS |
| Números que cambian | NumberFlow | Sin librería: GSAP sobre un valor y `tabular-nums` en el texto | Contadores de las cifras protagonistas |
| Clases condicionales | clsx | Bindings nativos de Angular (`[class.x]`, `[class]`) | Estados de botones y pasos |
| Variantes con tipo | cva | Inputs con tipo union en componentes propios (`variante: 'primario' \| 'secundario' \| 'texto'`) | Botón, tarjeta del Wrapped |
| Estado compartido | zustand | **Signals** de Angular en servicios (`DataService`, servicio de movimiento reducido) | Datos cargados, selección de estado y municipio |
| Selectores de formulario | base-ui Select | `<select>` nativo con estilo de tokens | Estado, municipio, sexo. En móvil abre el selector del sistema, que es lo más rápido y accesible |

Si hace falta un componente más armado (por ejemplo un combobox con búsqueda de municipio), la siguiente opción es Spartan UI, que está construido sobre Angular CDK con la misma filosofía headless. No se instala hasta que haga falta.

## Movimiento del hero y la escala

Especificación escrita antes de programar, con el vocabulario de `animation-vocabulary` y la secuencia de `animate` (si debe animarse, propósito, herramienta, propiedades, curva y duración, interrupción, movimiento reducido). Todas las duraciones y curvas son tokens; GSAP las lee desde `core/motion.ts`.

El design system no trae un valor entre 30 y 80 ms para escalonar texto. Se deriva de un token: **escalonado de texto = `--duration-corta` / 3** (unos 53 ms). Queda definido una sola vez en `motion.ts`.

### Comunes a todo el hero

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Press / Tap feedback** del botón "Empezar" | El botón completo | `transform: scale(0.98)` | `--duration-instante` | `--ease-entrada` | `:active` (al bajar el dedo, no al soltar) | Igual: es retroalimentación, no desplazamiento |
| **Hover effect** del botón | Fondo del botón | `background-color` de `luz` a `luz-suave` | `--duration-instante` | `--ease-entrada` | `:hover` solo con `(hover: hover) and (pointer: fine)` | Igual |
| **Loop** del fondo | Video `media/hero_loop.*` | Reproducción nativa | La del video | No aplica | `autoplay` al cargar | Sin `autoplay`: queda el póster fijo (Apple pide evitar fondos en movimiento a pantalla completa) |
| Desplazamiento a la Escala | La página | Scroll nativo | El del navegador | El del navegador | Clic en "Empezar" | `behavior: auto` (salto directo) y foco en el título de la Escala |

### Variante 1, "Horizonte" (`?v=1`)

Campo de luces arriba a sangre completa, texto abajo a la izquierda sobre el fondo. Jerarquía: imagen primero, luego título.

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Fade in** del campo (las luces se encienden) | Contenedor del video | `opacity` 0 a 1 | `--duration-encendido` | `--ease-entrada` | Montaje | **Fade in** de `--duration-corta` |
| **Reveal** del título, línea por línea, con **Stagger** | Cada línea del título | `clip-path: inset(0 0 100% 0)` a `inset(0)` y `transform: translateY(space-2)` a 0 | `--duration-larga` | `--ease-entrada` | Montaje, después de media escena | Solo `opacity`, `--duration-corta`, sin stagger |
| **Fade in** del subtítulo y del botón, con **Stagger** | Subtítulo y botón | `opacity` y `translateY(space-2)` | `--duration-larga` | `--ease-entrada` | Al terminar de entrar el título | Solo `opacity`, `--duration-corta` |

### Variante 2, "Titular" (`?v=2`)

La tipografía manda: título a escala display arriba, el campo en un panel enmarcado. En escritorio son dos columnas.

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Stagger** de **Fade in** palabra por palabra | Cada palabra del título | `opacity` y `translateY(space-2)` | `--duration-larga` | `--ease-entrada` | Montaje | Solo `opacity`, `--duration-corta` |
| **State indication**: "apagó" se apaga | La palabra "apagó" | `color` de `foco-encendido` a `foco-apagado` | `--duration-escena` | `--ease-apagado` | Al terminar el stagger | Aparece directo en `foco-apagado` |
| **Fade in** del panel del campo | Panel del video | `opacity` | `--duration-escena` | `--ease-entrada` | En paralelo al apagado | `--duration-corta` |
| **Fade in** de subtítulo y botón | Subtítulo y botón | `opacity` y `translateY(space-2)` | `--duration-larga` | `--ease-entrada` | Al final | Solo `opacity` |

### Variante 3, "Recorte" (`?v=3`)

Campo de luces a pantalla completa y un bloque sólido centrado que "recorta" las luces y contiene el texto. Composición centrada y silenciosa.

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Fade in** del campo | Contenedor del video | `opacity` | `--duration-encendido` | `--ease-entrada` | Montaje | `--duration-corta` |
| **Scale in** del bloque central | Bloque de texto | `transform: scale(0.96)` a 1 y `opacity` | `--duration-larga` | `--ease-entrada` | Cuando el campo va a la mitad | Solo `opacity`, `--duration-corta` |
| **Stagger** de **Fade in** del contenido | Título, subtítulo y botón | `opacity` | `--duration-larga` | `--ease-entrada` | Dentro del bloque | Sin stagger |

### Escala

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Scroll-driven animation** del apagado, como una ola en orden fijo (semilla) | Las luces de no votantes en el canvas | Color de relleno, interpolado de `foco-encendido` a `foco-apagado` | Ligada al scroll | Progreso con `--ease-scroll` (lineal); cada luz se apaga con `--ease-apagado` | Mientras la tarjeta 01 sube del borde inferior al centro de la pantalla (`scrub: true`, 1:1 con el dedo) | Sin scrub: cuando la tarjeta 01 cruza el centro, **Crossfade** de todas las luces a la vez al estado final en `--duration-corta` |
| **Scroll-driven animation** del resaltado joven | Las luces de 18 a 29 años, entre las apagadas | Color de `foco-apagado` a `arena` | Ligada al scroll | Igual que arriba, con `--ease-entrada` por luz | Mientras la tarjeta 02 sube del borde inferior al centro | **Crossfade** de `--duration-corta` cuando la tarjeta 02 cruza el centro |
| **State indication** de los pasos (tarjetas) | La tarjeta activa y las inactivas | `opacity` 0.4 a 1 y `translateY(space-2)` a 0, solo en el contenido; el fondo de la tarjeta queda opaco para que las luces no se vean a través del texto | `--duration-larga` | `--ease-entrada` | La tarjeta cruza el centro de la pantalla | Solo `opacity`, `--duration-corta` |

Rechazados a propósito:
- Contador animado (**Number ticker**) para "37.1 millones": es el dato que se lee y no debe moverse por estilo.
- **Parallax** del campo en el hero: es un fondo a pantalla completa en movimiento y no explica nada.
- **Hover effect** sobre las luces del canvas: no tienen interacción.
- **Pin** de GSAP para la escena: se usa `position: sticky` nativo, que no salta en móvil.

### Decisiones tomadas al implementar

- **Alto del hero en `100svh`, no `100dvh`.** `mobile-native` marca `100dvh` en un hero de entrada como error: cambia de alto cuando se oculta la barra del navegador y mueve el contenido a mitad del scroll. `100dvh` se usa donde sí corresponde: la escena sticky de la Escala, que debe seguir el área visible.
- **Hover solo con puntero fino.** La variante `hover:` de Tailwind se redefinió en `styles.css` como `@media (hover: hover) and (pointer: fine)`.
- **Video del hero con manifiesto.** El `<video>` lee `media/hero.json`. Mientras `"listo"` sea `false` no pide ningún archivo y muestra el póster, así la consola queda limpia. Cuando el Modelo B entregue `hero_loop.mp4` y `hero_loop.webm`, solo cambia `"listo"` a `true`. Se probó con un video temporal: reproduce en loop, silenciado e inline.
- **Póster hecho con tokens.** El póster es un SVG generado en el navegador con los colores reales de los tokens y una semilla fija, del mismo tamaño que el loop (1920x1080).
- **Excepción documentada: el selector de variantes.** `prototype` exige copiar su estilo tal cual (colores y tamaños fijos, fuente del sistema) para que se lea como herramienta y no como diseño. Solo aparece cuando la URL trae `?v=` y se borra cuando Nava elija la variante ganadora.
- **Escala: proporción sobre quienes tienen registro.** Los 1,000 puntos representan a las personas con credencial y registro (SV + NV, unas 92 mil cada punto); se apagan los que no votaron (NV / (SV + NV), 403 puntos), y luego se resaltan los jóvenes entre ellos (abstención joven / abstención total, 134 puntos). Todo sale de `nacional.json`.
- **Canvas con redibujado parcial.** Cada cuadro solo repinta las luces cuyo nivel cambió. Con CPU x4 la Escala pasó de 49 fps (p95 de 48 ms) a 60 fps sostenidos (p95 de 16.8 ms).

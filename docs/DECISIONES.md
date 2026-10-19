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
- **Luces sobre la silueta de México.** Como pide el manual de marca ("por defecto las luces se reparten sobre la silueta de México en un mapa oscuro: el país se apaga"), las 1,000 luces del hero y de la Escala se acomodan en una rejilla hexagonal dentro del país, sobre los estados en `superficie` con bordes `linea`. La geometría es `web/public/geo/mx_estados.topojson` con la proyección cónica conforme de Lambert de INEGI (paralelos 17.5° y 29.5°). El hero y la Escala usan la misma rejilla, así que las luces encendidas del inicio son las mismas que luego se apagan. Debajo del mapa se aclara que la forma es el país y que los puntos no indican dónde vive cada persona.
- **Variante 3 del hero con el mapa.** El bloque centrado tapaba el país. En móvil y tablet el mapa queda arriba y el texto abajo; en escritorio, el texto a la izquierda y el mapa en las 7/12 de la derecha.

## Acto 1

Especificación escrita antes de programar, con el vocabulario de `animation-vocabulary`, la secuencia de `animate`, los arreglos de plataforma de `mobile-native` y los principios de gestos y hápticos de `animate-expo` traducidos a la web. Datos: `edad_exacta.json`, serie `"2024"`, edades 18 a 85. El punto de los 18 años viene puesto con el valor real y no se puede mover.

### Puerta de `animate`

Es un momento raro (se ve una vez por visita) y explica un dato, así que aquí sí se gasta presupuesto de movimiento en la revelación. El trazo en sí no se anima: es **Drag** 1:1 y cualquier suavizado se sentiría como lag. Lo que se toca muchas veces (ajustar un punto con flechas, cada paso del trazo) cambia al instante, sin transición.

### Interacción, variante 1 "Trazo libre" (`?a1=1`)

Eje del prototipo: modelo de interacción de dibujo continuo, como un lápiz.

| Qué | Especificación |
|---|---|
| Inicio | `pointerdown` en cualquier punto del área de la gráfica. `setPointerCapture` para que el trazo siga aunque el dedo salga del área. Solo el puntero primario; un segundo dedo se ignora (protección multitáctil de `animate`). |
| Trazo | Cada `pointermove` (más sus eventos agrupados con `getCoalescedEvents`) se convierte a edad redondeada a 1 año y a participación con 1 decimal. La curva sigue al puntero 1:1, sin retraso ni suavizado. |
| Saltos | Si entre dos eventos el puntero salta varias edades, las intermedias se llenan por interpolación lineal. Si el trazo empieza más adelante de donde iba, el hueco se llena desde la última edad dibujada. |
| Límites | La edad se acota a 19..85 (los 18 son fijos, no se puede ir antes) y el valor a 0..100. Salir por arriba deja 100, por abajo 0, por los lados la primera o la última edad. Se puede regresar sobre lo ya dibujado para corregirlo. |
| Listo | El botón "Ver la realidad" se activa cuando el trazo llega a 85. |

### Interacción, variante 2 "Puntos arrastrables" (`?a1=2`)

Eje del prototipo: modelo de interacción por controles discretos, como un ecualizador.

| Qué | Especificación |
|---|---|
| Puntos | 9, uno por grupo de edad (18-19, 20-24, 25-29, 30-34, 35-44, 45-59, 60-69, 70-79, 80+), en la edad central de cada grupo; el de 80+ va en 85 para cerrar la curva. Arrancan todos en el valor real de los 18, como línea plana. |
| Agarre | `pointerdown` en cualquier lugar del área toma el punto más cercano en horizontal, así no hace falta atinarle a un círculo pequeño con el dedo. Se arrastra solo en vertical. |
| Arrastre | El punto se mueve con el desplazamiento del dedo desde donde se tocó (respeta el punto de agarre, sin salto inicial). Límite duro en 0 y 100. |
| Curva | Interpolación lineal entre el punto fijo de los 18 y los 9 puntos, edad por edad. |
| Listo | El botón se activa cuando el usuario movió al menos 3 puntos distintos. |

### Comunes a las dos variantes

- **Pointer Events** y `touch-action: none` solo en el área de la gráfica mientras se puede dibujar; al revelar vuelve a `pan-y` para que el dedo pueda hacer scroll encima de la gráfica. El resto de la página hace scroll normal.
- **Sin selección ni menú al mantener presionado** (`mobile-native` §8): `user-select: none`, `-webkit-user-select: none`, `-webkit-touch-callout: none` y `contextmenu` cancelado, solo en el área de la gráfica.
- **Teclado.** Los 9 grupos son `role="slider"` en una capa HTML encima del SVG (el SVG es `role="img"` y sus hijos no serían accesibles). Tab los recorre en orden; flecha arriba y abajo ajustan 1 punto, con Shift 10. En la variante 1, ajustar un grupo sin dibujar lo llena desde la última edad dibujada, así se puede completar la curva solo con teclado.
- **Texto guía** discreto debajo de la gráfica que dice qué falta ("Sigue hasta los 85", "Mueve 2 puntos más"). Botón secundario "Volver a dibujar" con el ícono `rotate-ccw`.

### Movimiento

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Drag** del trazo o del punto | Curva del usuario | Atributo `d` del path | Ninguna, 1:1 | No aplica | `pointermove` | Igual: es manipulación directa |
| **Press / Tap feedback** de los botones | Botón | `scale(0.98)` | `--duration-instante` | `--ease-entrada` | `:active` | Igual |
| **State indication** del botón al activarse | "Ver la realidad" | `opacity` y color (componente `Boton`) | `--duration-instante` | `--ease-entrada` | Trazo en 85 o 3 puntos movidos | Igual |
| **State indication** de la línea del usuario al revelar | Curva del usuario | Color de `foco-encendido` a `arena` y trazo punteado | `--duration-corta` | `--ease-entrada` | Clic en "Ver la realidad" | Igual |
| **Line drawing** de la curva real | Path de la curva real | `stroke-dashoffset` de 1 a 0 con `pathLength="1"` | `--duration-encendido` | `--ease-escena` (se mueve en pantalla de izquierda a derecha) | Justo después del cambio de la línea del usuario | **Fade in** de la curva completa en `--duration-corta` |
| Punta de luz | Un punto `foco-encendido` en la punta del trazo | `transform: translate` calculado con `getPointAtLength` | La del line drawing | La del line drawing | Igual | No aparece |
| **Reveal** del sombreado entre curvas | Área entre la curva del usuario y la real, `alerta` a baja opacidad | `clip-path: inset()` sincronizado con la `x` de la punta | La del line drawing | La del line drawing | Igual | **Fade in** en `--duration-corta` |
| Vibración | El teléfono | `navigator.vibrate` | `--duration-instante` / 3 (unos 30 ms, derivado de un token como el escalonado de texto) | No aplica | En el mismo cuadro en que termina el line drawing y aterriza el mensaje | No vibra |
| **Stagger** de **Fade in** de los mensajes | Error promedio, frase de los 25, anotación de los 25 y línea final | `opacity` y `translateY(space-2)` | `--duration-larga` | `--ease-entrada` | Al terminar el line drawing | Solo `opacity`, `--duration-corta`, sin stagger |

Hápticos (de `animate-expo`): un solo pulso por acción del usuario, nunca por cada paso del trazo; en el mismo cuadro que el cambio visual al que acompaña; y nunca como única señal, porque muchas personas los tienen apagados y iOS Safari no tiene `navigator.vibrate`. Solo se llama si existe la función y no hay movimiento reducido.

Rechazados a propósito:
- Suavizado o resorte en el trazo: se sentiría como lag. El dedo manda.
- Animación al cambiar de variante: es chrome del prototipo y debe ser instantánea.
- **Idle animation** o **Float** en la flecha de "¿Qué pasa entre los 18 y los 25?": compite con el mensaje que la persona está leyendo. La flecha es estática.
- **Number ticker** en el error promedio: es la cifra que se lee.
- Vibración al llegar a 85 o al mover cada punto: sería un háptico por cuadro o por paso.

### Mensajes

- "Te equivocaste por X puntos en promedio." X es el error absoluto medio entre las dos curvas, edad por edad de 18 a 85, con un decimal.
- A los 25: si el usuario puso 3 puntos o más por encima del real, "Pensaste que a los 25 votaba más gente. En realidad votó solo el X%." Si no, "Le atinaste: a los 25 años votó solo el X%. Casi nadie lo adivina."
- Línea final: "¿Qué pasa entre los 18 y los 25?" con una flecha que lleva al Acto 2.
- Todas las cifras salen de `edad_exacta.json` y se formatean con `Intl.NumberFormat("es-MX")`. Los mensajes viven en una región `aria-live="polite"` que existe desde el inicio, para que el lector de pantalla los anuncie al llenarse. Después de revelar, el `aria-label` de la gráfica describe la curva real (inicio, punto más bajo, punto más alto y final, calculados de los datos).

### Decisiones tomadas al implementar el Acto 1

- **Mensaje de los 25 con tres casos.** La regla pedida ("menos o casi igual" da "Le atinaste") le decía "Le atinaste" a quien dibujó 0%. Ahora "Le atinaste" solo sale si la diferencia es menor a 3 puntos; si puso 3 o más por debajo sale "Pensaste que a los 25 votaba menos gente. En realidad votó el X%."
- **Puntos de 12 px en la variante 2.** Los grupos 18-19, 20-24, 25-29 y 30-34 están a 3 a 5 años de distancia y a 16 px se enciman. El área para tocar sigue siendo toda la gráfica gracias al agarre por cercanía.
- **Controles del teclado fuera del SVG.** El SVG es `role="img"`, así que los 9 `role="slider"` van en una capa HTML encima, con `pointer-events: none` para que el puntero lo maneje el área.
- **Selector del Acto 1 abajo.** El del hero va arriba; si la URL trae `?v=` y `?a1=` a la vez, las teclas numéricas cambian los dos.

### Resultados de break-ui (Acto 1)

| Caso | Qué pasó | Corrección |
|---|---|---|
| Trazo que sale por arriba | El valor se queda en 100 y el trazo sigue (captura del puntero) | Ninguna |
| Trazo que sale por abajo | El valor se queda en 0 | Ninguna |
| Trazo que sale por la derecha | La edad se queda en 85 y el botón se activa | Ninguna |
| Trazo que sale por la izquierda | La edad se queda en 19; los 18 no se pueden mover | Ninguna |
| Salto de 20 años de golpe | La curva queda con sus 68 vértices, sin huecos (interpolación lineal) | Ninguna |
| Curva toda en 0 | Error de 62.2 puntos y sombreado correcto, pero decía "Le atinaste" | Tercer caso del mensaje |
| Curva toda en 100 | Error de 20.1 puntos, mensaje "votaba más gente" | Ninguna |
| Rotar a mitad del trazo (390x844 a 844x390) | El trazo sigue con la nueva geometría porque cada evento se convierte con el tamaño actual | Ninguna |
| 320 px | Sin scroll horizontal; etiquetas legibles; los puntos de la variante 2 se enciman | Puntos de 12 px |

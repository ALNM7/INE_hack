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
- **Video del hero con manifiesto.** El `<video>` lee `media/hero.json`. Ya está activo (`"listo": true`) con el loop del Modelo B (`hero_loop.webm` y `hero_loop.mp4`, 8 s, primer y último cuadro idénticos) y su póster `hero_poster.jpg`. Con movimiento reducido no se descarga el video: solo se muestra el póster.
- **Excepción documentada: el selector de variantes.** `prototype` exige copiar su estilo tal cual (colores y tamaños fijos, fuente del sistema) para que se lea como herramienta y no como diseño. Solo aparece cuando la URL trae `?v=` y se borra cuando Nava elija la variante ganadora.
- **Escala: proporción sobre quienes tienen registro.** Los 1,000 puntos representan a las personas con credencial y registro (SV + NV, unas 92 mil cada punto); se apagan los que no votaron (NV / (SV + NV), 403 puntos), y luego se resaltan los jóvenes entre ellos (abstención joven / abstención total, 134 puntos). Todo sale de `nacional.json`.
- **Canvas con redibujado parcial.** Cada cuadro solo repinta las luces cuyo nivel cambió. Con CPU x4 la Escala pasó de 49 fps (p95 de 48 ms) a 60 fps sostenidos (p95 de 16.8 ms).
- **Luces sobre la silueta de México solo en la Escala.** Como pide el manual de marca, las 1,000 luces de la Escala se acomodan en una rejilla hexagonal dentro del país, sobre los estados en `superficie` con bordes `linea` (`web/public/geo/mx_estados.topojson`, proyección cónica conforme de Lambert de INEGI, paralelos 17.5° y 29.5°). Debajo del mapa se aclara que la forma es el país y que los puntos no indican dónde vive cada persona. El hero usa la rejilla de luces del loop del Modelo B, por decisión del equipo.

## Acto 2

Decisión tomada antes de programar. Primero se pasó cada uno de los 8 pasos por la puerta de `find-animation-opportunities` (frecuencia, propósito, velocidad, función) y después se escribió la especificación con los términos de `animation-vocabulary` y la secuencia de `animate`. Todas las duraciones y curvas son tokens; GSAP las lee desde `core/motion.ts`.

### Resultado de la puerta

Frecuencia: el Acto 2 se ve una vez por visita (nivel "raro"), así que hay presupuesto para movimiento de explicación. Función: aquí se leen cifras, así que ninguna cifra se mueve por estilo; lo que se mueve es la posición de los datos cuando cambia la pregunta.

| Paso | Hoy (sin movimiento) | Propósito | ¿Se anima? | Movimiento |
|---|---|---|---|---|
| 1, Ana y Luis | Dos luces fijas | Ninguno extra | No | Estado inicial. Solo el **State indication** de la tarjeta activa |
| 1 a 2, punto de 18 en 2018 | Aparecen ejes y cifra de golpe | Evitar un cambio brusco | Sí | **Fade in** de ejes y etiqueta, ligado al scroll |
| 2 a 3, de 18 a 24 años | El punto salta de lugar | Explicación (es la misma generación seis años después) | Sí | **Interpolation** de la posición de Ana y Luis y **Line drawing** del trazo que dejan; la pérdida aparece con **Fade in** al llegar |
| 3 a 4, generación de 2012 | La línea nueva aparece completa | Explicación | Sí | **Line drawing** de 18 a 24 y de 24 a 30; la línea anterior baja a contexto con **Fade out** parcial |
| 4 a 5, contraste de 50 años | Cambia el eje de golpe | Consistencia espacial | Sí | **Continuity transition**: el eje de edad se estira hasta 56 y los puntos viejos se recorren a la izquierda; **Line drawing** de la línea plana |
| 5 a 6, brecha de género | Aparecen dos puntos nuevos | Indicar un estado | Sí | **Shared element transition**: Ana y Luis viajan a sus puntos (mujeres, hombres); el eje regresa a 16 a 34; el color de Luis se apaga más que el de Ana |
| 6 a 7, línea a mapa | Cambio de gráfica en seco | Evitar un cambio brusco | Sí | **Crossfade** de la línea al mapa, con **Scale in** del mapa desde 0.96 |
| 7 a 8, focos | El mapa y los puntos cambian de golpe | Explicación y el momento de delicia del acto | Sí | El mapa se oscurece con **Fade out** parcial y los puntos se encienden con **Stagger** de **Fade in** por estado, en orden de semilla fija |
| Tooltip del mapa | Aparece y desaparece | Consistencia espacial | Sí, sutil | **Origin-aware animation**: **Scale in** desde 0.96 con origen en el punto tocado |
| Tabla del mapa | Aparece | Evitar un cambio brusco | Sí | **Fade in** y **Scale in** desde 0.96, centrada (diálogo, exento de origen) |

Rechazados a propósito:
- **Number ticker** en 64.8, 47.1, 40.6 y demás: son los datos que se leen. Cambian con un **Crossfade** de la etiqueta, nunca contando.
- **Line drawing** con tiempo propio (que se dibuje solo al llegar al paso): el scroll tiene que poder regresar la historia; todo lo de la gráfica va ligado al scroll.
- **Pulse** o **Idle animation** en los focos encendidos (que titilen): es movimiento en bucle sin propósito y molesta con sensibilidad vestibular.
- **Stagger** del color de los 32 estados al entrar el mapa: el **Crossfade** ya trae el mapa; sería doble movimiento.
- **Hover effect** que levante o escale un estado del mapa: es una gráfica de lectura. Solo cambia el borde, sin transición.
- **Parallax** entre gráfica y tarjetas, y hápticos por paso (se dispararían en cada scroll).

### Especificación

El progreso de la escena es un número continuo `t` de 0 a 7 (un entero por paso). Cada tarjeta, de la 2 a la 8, es un `ScrollTrigger` con `scrub: true` que mueve su tramo de `t` mientras sube: en móvil desde que asoma por abajo (`top bottom`) hasta que su borde superior llega a 55% de la pantalla, justo debajo de la gráfica; en escritorio hasta que su centro llega al centro (`center center`). `t` es la suma de los progresos, así que bajar y subir recorre exactamente los mismos cuadros. Dentro de cada tramo, el progreso lineal (`--ease-scroll`) pasa por la curva de cada elemento.

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **State indication** de las tarjetas | Contenido de la tarjeta | `opacity` 0.4 a 1 y `translateY(space-2)` a 0 | `--duration-larga` | `--ease-entrada` | La tarjeta llega a la línea de activación | Solo `opacity`, `--duration-corta` |
| **Fade in** de ejes y etiquetas | Rejilla, marcas de edad, cifras | `opacity` | Ligada al scroll | `--ease-entrada` por elemento | Tramo del paso | **Crossfade** de toda la gráfica en `--duration-corta` |
| **Interpolation** de Ana, Luis y el punto | Círculos SVG | `transform: translate()` | Ligada al scroll | `--ease-escena` (se mueven en pantalla) | Tramos 2 a 3 y 5 a 6 | Estado final directo con el fundido |
| **Line drawing** de cohortes | Trazos SVG | `stroke-dashoffset` con `pathLength="1"` | Ligada al scroll | `--ease-escena`, la punta del trazo es la posición de Ana y Luis | Tramos 2 a 3, 3 a 4 y 4 a 5 | Trazos completos |
| **Continuity transition** del eje de edad | Escala X de D3 | Dominio de 16 a 34, a 16 a 60 y de regreso | Ligada al scroll | `--ease-escena` | Tramos 4 a 5 y 5 a 6 | Estado final directo |
| Apagado de Luis | Relleno de Ana y Luis | Color de `foco-encendido` hacia `foco-apagado`, proporcional a la altura de su punto en la gráfica | Ligada al scroll | `--ease-apagado` | Tramo 5 a 6 | Color final directo |
| **Crossfade** línea a mapa | Contenedor de la línea y contenedor del mapa | `opacity` y `transform: scale(0.96)` a 1 en el mapa | Ligada al scroll | `--ease-escena` | Tramo 6 a 7 | Fundido de `--duration-corta` |
| Oscurecer el mapa | SVG del mapa completo | `opacity` de 1 a 0.3 | Ligada al scroll | `--ease-entrada` | Primera mitad del tramo 7 a 8 | Directo |
| **Stagger** de focos por estado | Puntos en canvas | Alfa de cada punto | Ligada al scroll; cada estado ocupa 30% del tramo y los inicios se reparten en el 70% restante | `--ease-entrada` por estado | Tramo 7 a 8, orden de estados barajado con semilla fija | Todos encendidos a la vez con el fundido, sin escalonado |
| **Origin-aware** **Scale in** del tooltip | Panel del CDK Overlay | `opacity` y `transform: scale(0.96)` a 1, `transform-origin` abajo al centro (el punto tocado) | `--duration-corta` | `--ease-entrada` | `pointermove` con mouse, toque con el dedo | Solo `opacity` |
| Salida del tooltip | Panel | Se quita sin animación al salir del estado o hacer scroll | Instantánea | No aplica | `pointerleave`, scroll | Igual |
| **Fade in** + **Scale in** de la tabla | Diálogo del CDK | `opacity` y `transform: scale(0.96)` a 1 | `--duration-media` | `--ease-entrada` | Botón "Ver como tabla" | Solo `opacity`, `--duration-corta` |
| **Press feedback** del botón | Botón | `transform: scale(0.98)` | `--duration-instante` | `--ease-entrada` | `:active` | Igual |

Distribución y tamaños:
- Móvil (390 px): la gráfica es un panel `sticky` arriba (52svh) con fondo sólido; las tarjetas suben por la parte de abajo y se meten debajo del panel, así nunca tapan la gráfica mientras cambia.
- Escritorio, o teléfono en horizontal: texto a la izquierda (5 de 12 columnas) y gráfica `sticky` a la derecha en `100dvh`. El cambio entre los dos arreglos se hace con `gsap.matchMedia`, así que rotar el teléfono a mitad del acto vuelve a crear los disparadores con la medida nueva.
- Focos: un punto por cada 25 focos de cada estado (redondeando hacia arriba), en una posición al azar con semilla fija dentro del polígono del estado (`d3.geoContains`), dibujados en canvas con un sprite de halo precalculado.

### Decisiones tomadas al implementar

- **Una sola gráfica de línea.** `sections/cohorte/escena.ts` es una función pura: recibe el progreso `t` y las medidas y devuelve posiciones, trazos y opacidades de cada paso. D3 calcula escalas y rutas; la plantilla de Angular pinta el SVG. El mapa es otro componente (`mapa-jovenes.ts`) y los focos van en un canvas encima.
- **Ana y Luis dibujan su línea.** La punta del trazo de 18 a 24 años y la posición de los dos marcadores usan la misma curva, así que los marcadores van dejando la línea.
- **El apagado de Luis sale de los datos.** El brillo de cada marcador es la altura de su punto en la gráfica entre el piso del eje (35) y su valor a los 18: mujeres 53.9 da 0.63 y hombres 40.6 da 0.19.
- **El nombre de Luis cambia de lado a mitad del tramo 5 a 6 con un fundido a cero**, no con un salto.
- **"Casi 15 mil" se calcula**: miles redondeados hacia arriba a partir de `focos.json`, y "casi" solo si el total no es exacto. La pérdida (17.7) y la brecha (13.3) también se calculan.
- **Tooltip del mapa con CDK Overlay.** Con mouse sigue al puntero; con el dedo aparece al tocar y se cierra al hacer scroll más de dos espacios. La estrategia de cierre sin umbral lo cerraba al instante (cualquier evento de scroll de 0 px), por eso lleva umbral.
- **Tabla en un diálogo del CDK** con trampa de foco, foco inicial en el título y foco de regreso al botón al cerrar con Escape. Los botones "Ver como tabla" están dentro de las tarjetas 7 y 8, en el orden de lectura.
- **Disposición lado a lado** con la variante `lado` (`(min-width: 48rem), (orientation: landscape) and (min-width: 36rem)`), así un teléfono en horizontal también pone el texto al lado.
- **Refresco de disparadores** cuando cambia el alto del documento (por ejemplo, cuando el Acto 1 muestra su resultado), para que los pasos del Acto 2 no queden desfasados.

### Rendimiento (`animation-performance`)

Medición en Chromium sin GPU, 390 px, CPU x4, scroll programado de 1.5 s sobre cada tramo. La Escala sirve de referencia en las mismas condiciones.

| Momento | Antes | Causa nombrada | Arreglo | Después (promedio de 3) |
|---|---|---|---|---|
| Línea a mapa | 10 fps | Ciclo infinito de detección de cambios (NG0103): `ScrollTrigger.refresh()` leía `t` dentro del efecto de montaje, el efecto se volvía a ejecutar en cada cuadro y recreaba todos los disparadores | Montaje dentro de `untracked` y consultas de tarjetas comparadas por identidad | 46 fps |
| Focos | 8 fps | Lo mismo | Lo mismo | 41 fps |
| Línea a mapa | 46 fps | Repintado de las capas que cambian de opacidad y escala | `will-change` en los dos contenedores del cruce | 59 fps |
| Focos | 41 fps | Repintado de los 32 contornos del mapa al oscurecerse | `will-change: opacity` en el SVG base del mapa; los focos usan un sprite de halo precalculado y solo se redibujan si cambia el progreso | 57 fps |
| Escala (referencia) | | | | 60 fps |

`will-change` se probó quitándolo: sin él los focos bajaron a 51 fps, por eso se quedó solo en esas tres capas. A densidad de pantalla 3x la caída restante es rasterizado por software de este entorno (sin GPU); hay que confirmarlo en un Android de gama media real.

### Pruebas de `break-ui`

| Prueba | Resultado |
|---|---|
| 320 px | Los 8 pasos se activan en orden, sin scroll horizontal. Encontró 5 recortes dentro del SVG: "Edad", "13.3 puntos de diferencia", "Mujeres" y "Hombres", "a los 56", y el choque de "52.1%" con "50.3%". Arreglos: "Edad" a la izquierda, la brecha al lado derecho como "13.3 puntos", el eje de edad se abre más en los pasos 5 y 6, "50.3%" va debajo de su punto, y la figura usa `contain: size layout style` (sin `paint`, que recortaba). |
| Scroll muy rápido abajo y arriba (3 vueltas) | Termina en el paso 8 al bajar y en el paso 1 al subir, con el mapa en opacidad 0. Los tramos se suman, así que no quedan pasos a medias. |
| Rotar a mitad del acto | En el paso 5, de 390x844 a 844x390: cambia a texto al lado, sigue en el paso 5; al regresar a vertical, sigue funcionando en el paso 3. Sin errores. |
| Zoom 200% (1280x800 se vuelve 640x400) | Lado a lado, sin desbordes, pasos correctos. |
| Mitad de transiciones | La etiqueta "−17.7 puntos" aparecía donde pasaban Ana y Luis: ahora entra en el último 30% del tramo. Leyenda y nota del mapa se enciman al cruzarse: ahora una sale en la primera mitad y la otra entra en la segunda. |
| Movimiento reducido | Los 8 pasos se activan con fundido corto, sin scrub; los focos se encienden todos juntos. |
| Consola | Sin errores ni advertencias en todos los casos. |

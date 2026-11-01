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

## Wrapped

Decisión tomada antes de programar, después de leer `pick-ui-library`, `ask-sonner`, `prototype`, `mobile-native`, `animate` y `break-ui`. La especificación de movimiento usa los términos de `animation-vocabulary`. Todas las duraciones y curvas son tokens.

### Componentes de UI de los selectores

`pick-ui-library` pide primitivas accesibles (base-ui) en vez de construir a mano. La traducción a Angular es Angular CDK, que ya está instalado; Spartan UI no hace falta.

| Campo | Componente | Por qué |
|---|---|---|
| Estado | `<select>` nativo con estilo de tokens | 32 opciones fijas. En el teléfono abre el selector del sistema, que es lo más rápido y accesible. Igual que la tabla de primitivas de arriba. |
| Municipio | Combobox propio con `role="combobox"` y `role="listbox"`, teclado con `ActiveDescendantKeyManager` de `@angular/cdk/a11y` y anuncio del número de resultados con `LiveAnnouncer` | Oaxaca tiene 570 municipios: un `<select>` de 570 renglones no se puede recorrer en el teléfono. La búsqueda normaliza con `NFD` y quita diacríticos y mayúsculas ("queretaro" encuentra "Querétaro"). La lista va en el flujo de la página, debajo del campo, y no en un `Overlay`: en el teléfono el teclado ocupa media pantalla y un panel flotante queda debajo de él. 570 renglones de texto no llegan al umbral de virtualización de la skill (1,000 o más), así que se pintan todos; si el filtro deja la lista vacía se dice "No encontramos ese municipio". Se habilita al elegir estado y carga `municipios/XX.json` bajo demanda con el `DataService`. |
| Edad | `<input type="text" inputmode="numeric" pattern="[0-9]*">` con botones de menos y más, como `CampoEdad` del design system | `type="number"` cambia el valor con la rueda del mouse y acepta "e". Fuente de 16 px como mínimo (`mobile-native`, regla 4), `enterkeyhint="done"`. |
| Sexo | Radios nativos en botones segmentados, como `SelectorSexo` del design system | Tres opciones visibles de un toque, flechas del teclado gratis por ser radios. |
| Toasts | `ngx-sonner`, un solo `<ngx-sonner-toaster>` en la raíz (`app.ts`) | `ask-sonner`: un solo Toaster montado una vez, lo más cerca de la raíz, nunca por sección. `theme="dark"` explícito porque el tema por defecto es claro. Colores con las variables `--ngx-sonner-toast-dark-*` apuntando a tokens (peldaño 2 de la escalera, sin `!important`). `position="bottom-center"` con margen de safe area. Solo 3 mensajes: "Tarjeta descargada", "Listo, se descargaron las 5" (`toast.success`) y "No se pudo generar la imagen, intenta de nuevo" (`toast.error`). Generar, cambiar de tarjeta o compartir no llevan toast: el resultado ya se ve. |

Validación: los mensajes aparecen solo al presionar "Ver mi Wrapped", en positivo y con la solución ("Elige tu municipio de la lista."). El campo se marca con borde `alerta` (coral suave del design system) y el mensaje va en color de texto con el ícono en coral, nunca texto rojo. El foco va al primer campo que falta.

### Lógica de las tarjetas

Función pura en `sections/wrapped/tarjetas.ts`: recibe municipio, estado, edad y sexo y devuelve el modelo de las 5 tarjetas. Toda cifra sale de `municipios/XX.json` y `estados.json`; la fecha y la URL salen de `core/config.ts`.

- Con `calidad: "baja"` todas las tarjetas usan el estado y la oración nombra al estado ("En Chiapas votaron..."), porque decir el nombre del municipio con la cifra del estado sería falso aunque haya nota. El municipio sigue en el antetítulo.
- Con un valor `null` suelto se usa el del estado y la tarjeta lleva la nota.
- En la tarjeta 3, si hay empates, "la que menos vota" exige que ningún otro grupo tenga un valor igual o menor; si no, cuenta como "entre las que menos votan".

### Prototipo de las tarjetas (`prototype`)

Tres variantes detrás de `?w=1`, `?w=2` y `?w=3`, con el selector de `PICKER.md` abajo (el de arriba es del hero). Eje: la jerarquía, qué se lee primero.

| # | Variante | Eje | Qué se lee primero |
|---|---|---|---|
| 1 | Cifra | La cifra manda | Cifra a `--text-wrapped-cifra` en luz, frase debajo a `--text-wrapped-cuerpo`, luces al pie |
| 2 | Titular | La frase manda | Frase a `--text-wrapped-titulo` con las cifras encendidas dentro del texto; número de tarjeta gigante en luz apagada; luces compactas |
| 3 | Campo | Las luces mandan | Luces a sangre en los dos tercios de arriba; abajo un bloque sólido `superficie` con cifra a `--text-wrapped-titulo` y frase |

### Entrada de las tarjetas (`animate` con `animation-vocabulary`)

Puerta: se genera una vez o pocas veces por visita (nivel "raro"), así que tiene presupuesto de delicia; el propósito es **State indication** (tus tarjetas están listas) y **Preventing a jarring change** (5 tarjetas que aparecen de golpe). Las cifras no se mueven por estilo.

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Stagger** de **Fade in** con desplazamiento corto | Bloques de cada tarjeta: antetítulo, cifra, frase, luces, nota | `opacity` 0 a 1 y `translate` de `space-6` a 0 (en pixeles de la tarjeta de 1080) | `--duration-media` | `--ease-entrada` | Montaje de las tarjetas (`@starting-style`) | Solo **Fade in** de `--duration-corta`, sin desplazamiento ni escalonado |
| Escalonado | Entre bloques | `transition-delay` | Escalonado de texto (`--duration-corta` / 3, de `motion.ts`) | | | Sin retraso |
| **State indication** de las luces que se encienden | Puntos encendidos de la tarjeta | `background-color` de `foco-apagado` a `foco-encendido` | `--duration-media` | `--ease-entrada` | Después del texto, con `--duration-escalonado` (6 ms) entre luces | Encendidas desde el inicio |
| Cambio de tarjeta | Carrusel | Scroll nativo con `scroll-snap-type: x mandatory` | El del navegador | El del navegador | Dedo, puntos o flechas del teclado | `behavior: auto` |
| **Press feedback** de botones | Botones | `scale(0.98)` | `--duration-instante` | `--ease-entrada` | `:active` | Igual |

La herramienta es `@starting-style` con transiciones (la más barata para una entrada al montar, como el Acto 1), no GSAP. La entrada vive dentro de las tarjetas para que todas las tarjetas, también las que no están en pantalla, terminen en su estado final; antes de exportar se espera a que terminen (`getAnimations({ subtree: true })`). Todo dura menos de 300 ms por bloque.

Rechazados: **Number ticker** en las cifras (son el dato que se lee), carrusel con autoplay, **Parallax** o inclinación 3D entre tarjetas, transición propia al cambiar de tarjeta (es una acción de muchas veces; el scroll nativo ya da continuidad) y **Pulse** en la luz del cierre.

### Carrusel (`mobile-native`)

- Pista con `overflow-x: auto`, `scroll-snap-type: x mandatory` y `scroll-snap-align: center`; la física es la del navegador, así que no hace falta `touch-action`. `overscroll-behavior-x: contain` para que el gesto no navegue hacia atrás en el navegador.
- Cada tarjeta es un nodo real de 1080x1920 dentro de un marco del tamaño en pantalla, escalado con `transform: scale()`. La escala sale de un `ResizeObserver` sobre la pista y del alto visible, así la tarjeta cabe a lo alto en vertical y en horizontal.
- Indicador: 5 luces, la activa encendida, más "2 de 5" para lectores de pantalla. La pista tiene `tabindex="0"`, `role="region"`, `aria-roledescription="carrusel"`, y responde a flechas, Inicio y Fin. El selector de variantes ignora esas teclas cuando el foco está en el carrusel.

### Exportación a PNG

- `html-to-image` con `toPng` sobre el nodo de 1080x1920, con `width: 1080`, `height: 1920`, `pixelRatio: 1` y `style: { transform: 'none' }` para quitar la escala de pantalla. El PNG sale exactamente de 1080x1920.
- Fuentes: ya están autoalojadas en WOFF2 (`brand/design-system/assets/fonts/`, enlazadas desde `brand/fonts.css`), así que no hay que pedir nada a Google ni copiarlas a `web/public/fonts/`. Antes de exportar se espera `document.fonts.ready` y `document.fonts.load()` de las tres familias en los pesos que usan las tarjetas; el CSS de fuentes incrustadas se calcula una vez con `getFontEmbedCSS` y se reusa en las 5 tarjetas.
- Safari de iOS a veces devuelve la primera imagen en blanco porque todavía no decodifica las fuentes incrustadas en el SVG intermedio. Se llama `toPng` dos veces por tarjeta y se usa el segundo resultado.
- "Descargar todas": secuencial, una tarjeta a la vez, `wrapped-1.png` a `wrapped-5.png`, con una pausa corta entre descargas para que el navegador no las descarte.
- "Compartir": `navigator.share({ files })` solo si `navigator.canShare({ files })` acepta un PNG; si no, el botón no se muestra. Cancelar el menú de compartir (`AbortError`) no es un error y no lleva toast.

### Decisiones tomadas al implementar

- **`w-max` no es "max-content" en este proyecto.** Tailwind v4 resuelve `w-max` con el token `--container-max` (75rem), así que una rejilla de luces medía 1200 px y se salía de la tarjeta. Se usa `w-[max-content]`.
- **Los puntos llevan ancho y alto explícitos**, no `aspect-ratio`: con `aspect-ratio` dentro de la rejilla el navegador calculaba mal el ancho.
- **Comparación de la tarjeta 2 por columnas** (`grid-auto-flow: column`): con 25 columnas y 2 renglones, llenar por renglones dejaba uno lleno y otro a medias; por columnas se lee como una barra.
- **Relleno del carrusel con el margen de la página.** El porcentaje del `padding-inline` se calcula sobre el contenedor sin el margen negativo; se suma `--margen` para que la primera tarjeta quede centrada.
- **Alto del marco**: el ancho sale de `clamp(space-24 * 2, min(78vw, (100svh - space-32 - space-24) * 9 / 16), space-32 * 3)`, así en horizontal la tarjeta cabe a lo alto.
- **Nombre completo bajo el combobox** cuando no cabe en el campo (se mide `scrollWidth` contra `clientWidth`).
- **Tarjeta de jóvenes con dato del estado** (municipio sin secciones y con `jovenes` en `null`): la oración nombra al estado, igual que con calidad baja, y lleva la nota.
- **Compartir**: se pregenera el PNG de la tarjeta activa poco después de cambiar de tarjeta, para que `navigator.share` se llame dentro del gesto del usuario (Safari lo exige). Si el usuario cancela (`AbortError`) o el navegador niega el permiso (`NotAllowedError`) no hay toast.
- **Tamaños de texto por longitud**: frase de cuerpo entre 0.8 y 1 vez el token, titular entre 0.62 y 1.45 veces `--text-wrapped-titulo`, antetítulo entre 0.8 y 1 vez, cifra a 0.82 cuando tiene 5 caracteres ("100.0"). Factor = raíz de (límite / longitud), acotado.

### Pruebas de `break-ui`

Los peores casos son municipios reales, así que entran por la misma frontera que los datos normales (el formulario y los JSON) y no hace falta un archivo de datos falso. Quedan como regresión en `sections/wrapped/tarjetas.spec.ts`. Medido en Chromium con emulación de teléfono (390x844, táctil, densidad 2), salvo donde se indica.

| Caso | Resultado |
|---|---|
| Nombre más largo del país: "Heroica Villa Tezoatlán de Segura y Luna, Cuna de la Independencia de Oaxaca" (76 caracteres) | Sin recortes en las 3 variantes ni en el PNG. Titular de la variante 2 baja a 0.74 del token. Falla encontrada y corregida: en la variante 2 el antetítulo se partía letra por letra al lado de las luces; ahora va encima. Otra: en 320 px el campo de municipio cortaba el nombre; ahora aparece completo debajo. |
| Calidad baja: Chicomuselo, Chiapas | Las 4 tarjetas con datos usan Chiapas, la oración dice "En Chiapas votaron..." y cada una lleva la nota de calidad. Como tampoco tiene secciones, la tarjeta 4 es la de jóvenes del estado. |
| Grupo en `null`: Abasolo, Coahuila, hombre de 19 | La tarjeta 2 usa el valor de Coahuila para hombres de 18 a 19 y lleva "Dato de Coahuila: ...". La tarjeta 3 rellena el grupo con el estado y lleva la misma nota. Las tarjetas 1 y 4 no llevan nota. |
| Sin `seccion_max`: San Mateo Tlapiltepec, Oaxaca (calidad "ok", `jovenes` en `null`) | La tarjeta 4 cambia a jóvenes con el dato de Oaxaca. Falla corregida: la oración decía el nombre del municipio con la cifra del estado; ahora dice "En Oaxaca votó...". |
| Ciudad de México: Iztapalapa, mujer de 30 | Todo del municipio, sin notas. "Alcaldía" cabe en la etiqueta "Municipio o alcaldía". |
| Edad 18, 29, 30 y 99 | 18 cae en 18 a 19, 29 en 25 a 29, 30 en 30 a 34 y 99 en "80 años o más". 17, 100 y letras muestran "Escribe una edad entre 18 y 99 años." (el campo acepta 2 dígitos y solo números). |
| Cambiar de estado después de elegir municipio | Falla encontrada y corregida: si el foco seguía en el campo de municipio, el texto anterior se quedaba y filtraba la lista nueva a 0 resultados. Ahora, al cambiar la lista, el campo se limpia y se cierra. |
| Búsqueda | "queretaro" encuentra "Querétaro"; flecha abajo y Enter lo eligen. En Oaxaca abrir la lista de 570 tarda unos 90 ms y filtrar "santa maria" (53 resultados) unos 40 ms. Sin resultados: "No encontramos ese municipio. Revisa cómo lo escribiste." Escribir el nombre exacto y salir del campo lo elige. |
| 320 px | Sin scroll horizontal, tarjeta de 234x416 centrada, formulario completo. |
| Horizontal (844x390) | Falla corregida: la tarjeta medía 455 px de alto, más que la pantalla. Ahora 192x341. |
| Escritorio (1280x800) | Tarjeta de 324x576, se ven dos completas y parte de la tercera, flechas y puntos funcionan con mouse. |
| Teclado | Flecha derecha dos veces lleva a "Tarjeta 3 de 5", Fin a la 5; el selector de variantes no se mueve mientras el foco está en el carrusel. |
| Movimiento reducido | Solo fundido de 160 ms, sin desplazamiento ni escalonado; luces encendidas desde el inicio. |
| Exportar en Chromium (emulación Android) | Los 15 PNG (5 tarjetas por 3 variantes) miden 1080x1920 y traen las 3 fuentes. Pesan de 154 a 249 KB. "Descargar todas" baja `wrapped-1.png` a `wrapped-5.png` en unos 7 s. Compartir (con `navigator.share` simulado) entrega `wrapped-2.png` de 1080x1920. |
| Safari de iOS | No se pudo probar: este entorno solo tiene Chromium. El patrón de doble `toPng` está aplicado. Pendiente en iPhone real. |
| Consola | Sin errores ni advertencias en todos los casos. |

## Recorrido guiado

Pedido del equipo (30 oct): la historia se recorre como diapositivas. No se avanza con scroll libre, solo con botones; "Empezar" en el hero, luego "Siguiente" y "Anterior". Cada tarjeta es un paso. En móvil, las tarjetas de la Escala y del Acto 2 van debajo de la gráfica y se reemplazan; en escritorio esas dos secciones se ven como antes.

### Cómo funciona

- **Un acto a la vez.** `core/recorrido.ts` guarda el acto y el paso actuales. Los actos que no están en pantalla quedan con `hidden`: no se puede llegar a ellos con scroll, ni con el tabulador, ni los lee un lector de pantalla. Cada componente registra cuántos pasos tiene y cómo mostrar un paso.
- **Pasos:** hero 1, Escala 2, Acto 1 1, Acto 2 8, Acto 3 1.
- **Scroll bloqueado** (`overflow: hidden` en `html`) en el hero, la Escala y el Acto 2. En el Acto 1 y el Acto 3 la página sí hace scroll, porque son pantallas más altas que el teléfono y solo contienen ese acto, así que no hay forma de saltarse nada.
- **Escritorio (disposición `lado`)**: "Siguiente" desplaza la ventana hasta la posición donde la tarjeta siguiente queda activa. Las animaciones siguen ligadas al scroll (`scrub`), así que el usuario ve exactamente la misma transición que antes, solo que la dispara el botón. Las posiciones se leen de los `ScrollTrigger` (`start` y `end`), no se calculan aparte.
- **Móvil (disposición `pila`)**: la Escala y el Acto 2 caben en `100dvh`. Arriba el encabezado, en medio la gráfica (que toma el alto que sobra), abajo la tarjeta del paso y la barra de botones. No hay `ScrollTrigger`: "Siguiente" anima el progreso de la escena con GSAP. Al rotar el teléfono, `gsap.matchMedia` cambia de un modo al otro.
- **Acto 1**: mientras no se revele la curva, el botón dice "Saltar"; después de "Ver la realidad", "Siguiente". El botón "¿Qué pasa entre los 18 y los 25?" también avanza.
- **Acto 3**: es el final, la barra solo tiene "Anterior".
- **Revisión de variantes**: `?acto=intro`, `?acto=1`, `?acto=2` o `?acto=3` abre directo en ese acto, para que Nava no tenga que recorrer toda la historia para ver `?w=` o `?a1=`.

### Excepción al design system

El design system dice "sin barras de navegación fijas". La barra de "Anterior" y "Siguiente" es fija abajo porque el equipo pidió que el avance sea solo con botones. Va sobre `fondo` con borde superior `linea`, respeta la safe area y las secciones reservan su alto (`--alto-barra`) para que nunca tape contenido.

### Movimiento (`animate` con `animation-vocabulary`)

Puerta: "Siguiente" se presiona muchas veces por visita (unas 13), pero cada presión es narrativa y el usuario espera ver qué cambia, así que la transición de la gráfica sí se anima; la barra y los botones no.

| Animación | Qué se mueve | Propiedad | Duración | Curva | Disparador | Movimiento reducido |
|---|---|---|---|---|---|---|
| **Crossfade** entre actos | `main` completo | `opacity` | Salida `--duration-corta`, entrada `--duration-media` | `--ease-salida` y `--ease-entrada` | Cambiar de acto | Igual (es un fundido) |
| Paso en escritorio | Ventana | Scroll programado, la escena sigue con `scrub` | `--duration-escena` | `--ease-escena` (se mueve en pantalla) | "Siguiente" o "Anterior" | Salto directo y el fundido corto que ya tenían los pasos |
| Paso en móvil | Progreso de la escena (Escala: luces que se apagan y jóvenes; Acto 2: `t`) | Las mismas propiedades que ya animaba el scroll | `--duration-escena` por paso; las luces de la Escala `--duration-encendido` | Lineal sobre el progreso; cada elemento aplica su propia curva, como con el scroll | "Siguiente" o "Anterior" | Estado final con el fundido corto existente |
| **Fade in** de la tarjeta nueva (móvil) | Tarjeta del paso | `opacity` y `translate` de `space-2` | `--duration-media` | `--ease-entrada` | Cambio de paso (`@starting-style` al pasar de `display: none` a visible) | Solo `opacity`, `--duration-corta` |
| **Press feedback** | Botones de la barra | `scale(0.98)` | `--duration-instante` | `--ease-entrada` | `:active` | Igual |

Todo es interrumpible: presionar "Siguiente" a mitad de una transición retoma desde el valor actual (`overwrite` en GSAP), no reinicia.

Rechazados: deslizar el acto completo de lado (**Direction-aware transition**), porque el contenido ya se mueve dentro de cada acto y serían dos movimientos; animar el texto del progreso ("Acto 2 · 3 de 8") con **Number ticker**; vibración en cada paso.

### Accesibilidad

- Al cambiar de acto, el foco va al título del acto nuevo (si el foco se quedó en un botón que desapareció) o se queda en "Siguiente".
- Cada cambio de paso se anuncia con `LiveAnnouncer`: el nombre del acto, "paso N de M" y el texto de la tarjeta.

### Decisiones tomadas al implementar

- **El fundido de salida se cancela al cambiar de acto.** Con `fill: forwards`, al terminar la entrada la página regresaba a opacidad 0 y todo lo que seguía se veía en negro (lo encontró la prueba de escritorio).
- **La Escala usa la disposición lado a lado con la misma consulta `lado` que el Acto 2** (antes era solo desde `lg`). En un teléfono horizontal la tarjeta tapaba el mapa al quedar fija en su paso.
- **Pantallas bajas** (`max-height: 30rem`, teléfono horizontal): en la Escala se ocultan las dos notas de pie y la cifra baja a `--text-titulo-2`, para que el mapa tenga alto.
- **Progreso en dos renglones en móvil** ("Acto 2" arriba, "6/8" abajo): en una línea se cortaba a 375 px.
- **La Escala arranca con las luces encendidas** (`objetivo = -1`) y se apagan al llegar, no antes de que el usuario las vea.
- **Las posiciones de escritorio salen de los `ScrollTrigger`**: el paso 0 del Acto 2 es el inicio de la sección, y cada paso siguiente es el `end` del disparador de su tarjeta.
- **Los selectores de variantes del Acto 1 y del Acto 3 van arriba** para no quedar debajo de la barra.
- **El toast sube sobre la barra** (`offset` = `--alto-barra` más `space-4`).

### Pruebas

| Caso | Resultado |
|---|---|
| Recorrido completo en 390x844 | Hero, Escala 1 y 2, Acto 1 con "Saltar", Acto 2 del 1 al 8, Acto 3 sin "Siguiente", y de regreso con "Anterior" al paso 8 y al 7 del Acto 2. La rueda del mouse no mueve la página en el hero ni en la Escala. |
| Recorrido completo en 1280x800 | Cada "Siguiente" desplaza la ventana a la tarjeta correcta (Escala 620 y 1300 px; Acto 2 de 877 a 4957 px, cada 680 px) y la escena se anima con el `scrub` de siempre. Falla encontrada y corregida: pantalla negra después del primer cambio de acto. |
| 320x640 e iPhone SE (375x667) | Ninguna tarjeta, gráfica o mapa queda debajo de la barra (de 12 a 83 px libres), sin scroll horizontal. |
| Teléfono horizontal (844x390) | Fallas corregidas: la tarjeta tapaba el mapa de la Escala y el mapa medía unos 20 px. Ahora mapa a la izquierda, tarjeta a la derecha. |
| 5 clics seguidos en "Siguiente" | Llega al paso 6 de 8 sin saltos: cada animación retoma desde donde iba. |
| Acto 1 | "Saltar" hasta revelar; después de "Ver la realidad", "Siguiente". El botón "¿Qué pasa entre los 18 y los 25?" avanza al Acto 2 y el foco va al título del acto. |
| Movimiento reducido | Los pasos cambian con el fundido corto, sin animación de scroll ni de progreso. |
| Consola | Sin errores ni advertencias. |

### Ajustes después de revisarlo (30 oct)

- **Tarjetas del mismo tamaño en móvil (Intro y Acto 2).** Antes la tarjeta activa cambiaba de alto en cada paso y la gráfica (que toma el alto que sobra) se encogía o crecía, lo que rompía la animación. Ahora las tarjetas se apilan en la misma celda de una rejilla (`grid-area: 1/1`) y las inactivas se ocultan con `visibility` y `opacity`, sin salir del flujo: el área mide lo que la tarjeta más alta y todas se estiran a ese alto. El cambio de tarjeta queda como **Crossfade** de `--duration-media`. Medido: la gráfica del Acto 2 mide lo mismo en los 8 pasos (364 px a 390x844, 187 px en iPhone SE).
- **Acto 1 cabe en una pantalla.** La sección mide `100dvh`; la gráfica toma el alto que sobra (mínimo `min-h-40`) y los botones quedan siempre arriba de la barra, antes y después de revelar (probado en 320x568, 375x667, 390x844 y 1280x800). Se quitó el párrafo "A los 18 votó..." (la cifra ya está en la gráfica), la ayuda de teclado quedó solo para lectores de pantalla (`sr-only`) y se quitó el botón "¿Qué pasa entre los 18 y los 25?", que repetía lo que hace "Siguiente" en la barra. Título y mensajes bajan un nivel de la escala tipográfica en móvil.
- **Acto 1 en escritorio (`lg`) en dos columnas.** Con una sola columna, al revelar aparecían los mensajes debajo y la gráfica se encogía (en 1280x800 pasaba de 381 a 208 px de alto) y en pantallas bajas el texto se encimaba. Ahora la gráfica va a la izquierda y los mensajes y botones a la derecha, centrados. La instrucción y la leyenda comparten el mismo renglón reservado (dos líneas), así que la gráfica mide lo mismo antes y después de revelar en 1024x768, 1280x720, 1366x768, 1440x900 y 1920x1080, sin bloques encimados. En móvil se queda en una columna.

## Hero combinado y gráficas con menos texto (rama `combinar`, 31 oct)

### Hero

- **Base: la propuesta del compañero** (rama `propuesta`): `sections/hero/hero-campo.ts` (campo de luces en canvas que se apaga y luego respira) y la tipografía de la variante Horizonte (título a `--text-cifra`, `--text-display` en escritorio). El selector de variantes `?v=` se queda como él lo dejó; Horizonte, la variante por defecto, usa su campo en lugar del video.
- **Cambio de composición pedido por el equipo**: en `propuesta` el título iba arriba, las luces en medio y el texto abajo. Ahora las luces son el fondo a pantalla completa y el texto va encima. Un velo de `fondo` arriba y abajo (`bg-linear-to-b`, el mismo recurso de legibilidad que ya usaba el hero con video) asegura el contraste del título y del botón.
- **Profundidad** (lo "fancy" elegido): el campo se dibuja en dos capas. La lejana es más densa (espaciado al 55%), con luces a la mitad de tamaño y al 50% de opacidad, y su propia semilla; la cercana es la del compañero sin cambios. No hay parallax ni movimiento extra: la sensación de profundidad sale de tamaño, densidad y brillo. La capa lejana es decorativa (`aria-hidden`).
- Pendiente para decidir: `PROPORCION_ENCENDIDA = 0.38` en `hero-campo.ts` es una cifra escrita a mano (regla 4 del plan). Se dejó tal cual porque es la propuesta del compañero; se puede ligar a `nacional.json` si el equipo quiere.

### Menos texto en las gráficas

Pedido: las tarjetas ya cuentan la historia; las gráficas deben ser visuales.

- **Acto 2**: se quitaron las descripciones junto a las cifras ("a los 18, en 2018", "puntos", "Mujeres" y "Hombres", etc.) y los títulos de ejes ("% que votó", "Edad"). Quedan las cifras, los números de los ejes y los nombres de Ana y Luis. Las cifras que iban arriba de su descripción bajan a donde estaba el texto.
- **Mapa del Acto 2**: se quitaron el título de la escala de color y la nota "Cada punto representa 25 secciones...". La escala conserva sus extremos.
- **Intro**: se quitaron "La forma es el país..." y "Cada punto: unas 92 mil personas..."; queda la leyenda de colores y una línea "Fuente: INE, Conteo Censal de Participación 2024".
- Lo quitado sigue disponible para lectores de pantalla en la descripción de cada gráfica (`aria-label`), que no cambió.

## Hero con luces ligadas al dato (rama `Cambios`, 31 oct)

Reemplaza la composición del hero de la sección anterior; lo de "Menos texto en las gráficas" se conserva sin cambios.

- **Secuencia**: todas las luces arrancan encendidas y se apagan poco a poco hasta dejar encendido el 47.1%, la participación a los 24 años de la generación que cumplió 18 en 2018. La cifra se lee de `cohortes.json` (fila de 18 años de `corta`), así que se resuelve el pendiente de `PROPORCION_ENCENDIDA = 0.38` escrito a mano.
- **Título**: la palabra "apagó" empieza en `--color-foco-encendido` y pasa a `--color-foco-apagado`; las luces terminan de apagarse (~3.4 s) antes de que la palabra llegue a gris (~3.7 s).
- **Después de la entrada**: las luces se relevan en vivo (unas se apagan y otras se encienden) sin cambiar la proporción encendida. El dibujo se pausa cuando el hero está oculto por el recorrido.
- **Composición**: título y subtítulo juntos abajo, más grandes (`--text-cifra`/`--text-display` y `--text-titulo-3`), con el velo inferior `bg-linear-to-t` para legibilidad. Se retiró la capa lejana de luces; el campo es una sola capa.
- **Movimiento reducido**: se muestra directamente el estado final (47.1% encendido, "apagó" en gris), sin relevo.

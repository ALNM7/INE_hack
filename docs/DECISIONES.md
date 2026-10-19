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

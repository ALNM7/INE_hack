# Hero loop: especificación de movimiento

Video de fondo del hero del sitio. 1920x1080, 8 s, 30 fps, sin audio. Se reproduce en **Loop** infinito detrás del título, así que nunca compite con el texto: es **Idle animation**, no protagonista.

## Propósito

**Purposeful animation**: explica la idea del proyecto sin palabras. Un país lleno de luces (personas que votan) donde una generación se apaga y luego vuelve a encender. La pieza se ve muchas veces, por eso el movimiento es lento, sobrio y sin sobresaltos (**Frequency of use**).

## Elementos

- Campo de luces: rejilla de 48 columnas por 27 filas (1,296 luces) con desplazamiento aleatorio con semilla fija, dibujada en un solo `<canvas>`.
- Cada luz tiene un núcleo y un halo. Encendida usa `color.luz` con halo `color.luzHalo`; apagada usa `color.apagada` sin halo. Fondo `color.fondo`.

## Movimiento

1. **Pulse** (respiración). Cada luz cambia su opacidad de forma suave y continua, con fase propia y 1 o 2 ciclos completos por vuelta del loop. Es un **Alternate (yoyo)** senoidal, no hay saltos. Amplitud baja para que el campo se sienta vivo sin parpadear.
2. **Stagger** direccional de **Fade out** (la ola de apagado). Un frente recorre la pantalla de izquierda a derecha. Cada luz se apaga cuando el frente la alcanza, con un pequeño retraso propio con semilla para que el borde de la ola no sea una línea recta.
   - **Duration**: `duracion.escena`.
   - **Easing**: `curva.apagado` (**Ease-in** de marca). En interfaz se evita el ease-in, aquí es intencional: una luz que se apaga cae lento y luego se va de golpe, como un filamento.
3. Pausa en oscuro de `duracion.escena`.
4. **Stagger** direccional de **Fade in** (el reencendido). El mismo orden de izquierda a derecha.
   - **Duration**: `duracion.encendido`.
   - **Easing**: `curva.entrada` (**Ease-out** fuerte de marca).
   - **Asymmetric easing** y tiempos asimétricos: apagar es más rápido que volver a encender, para que el regreso se sienta como alivio y no como rebote.
5. Las últimas luces terminan de encender antes del segundo 7.3. El resto del tiempo solo respiran, para que el cierre del loop no tenga movimiento brusco.

## Orquestación (Orchestration)

| Tiempo | Qué pasa |
|---|---|
| 0.0 a 0.8 s | Solo respiración |
| 0.8 a 4.9 s | El frente de apagado cruza de izquierda a derecha (inicio de la ola en 1 s, cruce de 2.8 s, borde irregular de unos 0.2 s) |
| 2.6 a 7.3 s | Reencendido escalonado en el mismo orden |
| 7.3 a 8.0 s | Solo respiración, regreso al estado inicial |

La línea de tiempo GSAP se divide en cinco tramos lineales de 2 s o menos (respiración, apagado, oscuro, encendido, regreso). Juntos forman un solo progreso continuo; se dividieron para que la auditoría `animation-map.mjs` no marque `paced-slow`.

## Loop sin costura

- Todo el estado visual es una función pura del progreso `p` del loop (**Interpolation / Tween** de un solo valor con **Linear**).
- `p` va de 0 a 1 entre el primer cuadro y el último cuadro (t = 8 s menos un cuadro). Por eso el primer y el último cuadro son idénticos, como pide el plan.
- La respiración usa ciclos enteros, la ola empieza y termina con todas las luces encendidas.
- Nada aleatorio sin semilla, nada que dependa del reloj.

## Rendimiento y entrega

- Un solo canvas redibujado por cuadro, el halo es un sprite precalculado (**Hardware acceleration** no aplica a canvas, por eso se minimiza el trabajo por cuadro).
- MP4 H.264 CRF 28 (sin cuadros B; el cuadro 240 repite bit a bit el cuadro clave inicial) y WebM VP9 (cuadro clave forzado en el primero y el último). Ambos menores a 3 MB, sin pista de audio.
- Póster JPG con el primer cuadro.
- **Reduced motion**: el sitio debe mostrar el póster estático cuando el usuario pide movimiento reducido (responsabilidad del Modelo A).

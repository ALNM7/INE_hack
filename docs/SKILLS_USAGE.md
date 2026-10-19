# Uso de skills

Registro de qué skill se usó, en qué componente y qué cambió gracias a ella (regla 6 del plan). Al cerrar la Fase 3 ninguna fila puede seguir en "pendiente".

Instalación (Fase 0, 19 oct 2026):

- `npx skills@latest add emilkowalski/skills` instaló las 15 skills en `.claude/skills/` (versión fijada en `skills-lock.json`).
- `claude plugin marketplace add heygen-com/hyperframes` y `claude plugin install hyperframes@hyperframes` instalaron HyperFrames 0.8.176 con 21 skills. El marketplace y el plugin quedan declarados en `.claude/settings.json`.

## Skills de Emil Kowalski (Modelo A)

| Skill | Para qué sirve | Dónde se aplicará en este proyecto | Estado y qué cambió gracias a ella |
|---|---|---|---|
| `emil-design-eng` | Filosofía base de diseño y movimiento: cuándo animar, curvas, duraciones, botones con `scale(0.97)`, nada desde `scale(0)`, popovers desde su origen, `prefers-reduced-motion`, hover solo con puntero fino. | Antes de escribir cualquier componente. Rige los criterios de diseño y movimiento de todo el sitio (ver `docs/DECISIONES.md`). | en uso (Fase 2 y 3: hero, escala). Botón con `scale(0.98)` en `:active` y transición solo de propiedades nombradas; entradas desde `scale(0.96)` y nunca desde 0; stagger corto (corta/3, unos 53 ms) que no bloquea el botón; contador animado de 37.1 rechazado porque es el dato que se lee. |
| `apple-design` | Interfaces fluidas al estilo Apple: respuesta inmediata, manipulación directa 1:1, interrupción, resortes, consistencia espacial, tipografía con tracking e interlineado por tamaño, accesibilidad de movimiento. | Jerarquía tipográfica, espaciado, scrollytelling del Acto 2, trazo con el dedo del Acto 1 y carrusel del Wrapped. | en uso (hero, escala). Scrub 1:1 con el scroll (`scrub: true`, sin retraso). Escena con `sticky` nativo en vez de pin. Con movimiento reducido el video queda en pausa (sin fondo en movimiento a pantalla completa) y los desplazamientos se cambian por fundidos. Tracking negativo del título con la escala del design system. |
| `pick-ui-library` | Lista curada de librerías por tarea (primitivas accesibles, toasts, gráficas, animación de números, estilos con variantes). | Elegir primitivas en vez de construirlas. Traducción a Angular: Angular CDK (overlay, a11y, scrolling) en lugar de base-ui, `ngx-sonner` en lugar de Sonner, D3 + plantillas de Angular en lugar de recharts. | pendiente |
| `animation-vocabulary` | Glosario que convierte una descripción vaga de movimiento en su término exacto (stagger, reveal, line drawing, scroll-driven, etc.). | Redactar la especificación de cada animación antes de programarla (campo de luces, curva real, cohorte, focos). | en uso (spec del hero y la escala). La especificación de `docs/DECISIONES.md` se escribió con sus términos (Reveal, Stagger, Scale in, Fade in, State indication, Scroll-driven animation, Crossfade, Press feedback) antes de programar. Sirvió para que las 3 variantes del hero se diferenciaran en su entrada y no solo en la composición. |
| `find-animation-opportunities` | Busca dónde falta movimiento y descarta lo que no debe animarse. Solo propone, no implementa. Pasa cada candidato por frecuencia, propósito, velocidad y función. | Al terminar el esqueleto de cada sección (Hero, Escala, Dibújalo, Cohorte, Wrapped, ficha, metodología). | pendiente |
| `animate` | Construye una animación nueva en orden: si debe animarse, propósito, herramienta, propiedades, curva y duración, interrupción, salida, movimiento reducido. | Cada animación nueva: luces que se apagan, revelado de la curva real con `stroke-dashoffset`, transiciones de pasos del scrollytelling, focos escalonados, entrada de tarjetas. | en uso (todas las animaciones del hero y la escala). Se aplicó la puerta de frecuencia y propósito a cada animación; quedaron rechazados el contador, el parallax y el hover de las luces. Propiedades limitadas a `transform`, `opacity`, `clip-path` y color del canvas. Curvas y duraciones solo de tokens (`motion.ts`). Movimiento reducido incluido desde el inicio, no como arreglo posterior. |
| `prototype` | Construye 2 a 5 variantes realmente distintas de una pieza detrás de un selector para elegir en vivo. | Variantes del Hero, del Acto 1 y de las tarjetas del Wrapped, con selector oculto (`?v=1`, `?v=2`) para que Nava elija. | en uso (hero). 3 variantes con ejes distintos: Horizonte (imagen primero, título abajo con Reveal), Titular (tipografía display manda, "apagó" se apaga) y Recorte (centrado, bloque que recorta el campo). Selector copiado verbatim de `PICKER.md`, visible solo con `?v=`, movido arriba porque tapaba el botón. Pendiente: que Nava elija y se borre el resto. |
| `mobile-native` | Arreglos de plataforma para que una web se sienta nativa en el teléfono: safe areas, `100svh`/`100dvh`, inputs de 16 px, sin parpadeo al tocar, hover solo con puntero fino, `touch-action`. | Todo el sitio, mobile first a 390 px. Revisión obligatoria al cerrar la Fase 3 en cada sección. | en uso (hero, escala, global). Hero en `100svh` (no `dvh`, para que no salte al ocultarse la barra) y escena de la Escala en `100dvh`; safe areas con `env(safe-area-inset-*)`; `theme-color` leído del token de fondo; hover redefinido a `(hover: hover) and (pointer: fine)`; `touch-action: manipulation` y sin parpadeo al tocar. Pendiente: probar en teléfono real. |
| `break-ui` | Prueba la interfaz con los peores datos realistas detrás de un selector "Demo / Peor caso" y reporta qué se rompe. | Wrapped y ficha: municipios de nombre muy largo, datos suprimidos (`null`), 0%, 100%, cifras enormes, pantallas de 320 px. | pendiente |
| `ask-sonner` | Guía de Sonner: un solo `Toaster`, qué llamada usar, estilos, temas y problemas comunes. | Toasts "Tarjeta descargada", "Enlace copiado", "No hay datos suficientes" con `ngx-sonner` (port de la misma API para Angular). | pendiente |
| `improve-animations` | Auditoría de todo el movimiento del código con hallazgos priorizados y planes autocontenidos. Solo planea. | Al cerrar la Fase 3. Aplicar el plan priorizado que genere. | pendiente |
| `review-animations` | Revisión estricta del código de movimiento con 10 estándares no negociables y veredicto Block o Approve. | Revisión final de la Fase 3, después de `improve-animations`. | pendiente |
| `animation-performance` | Diagnóstico de cuadros perdidos: propiedades que solo componen, hilo principal ocupado, variables CSS heredadas, costo del blur, uso correcto de `will-change`. | Si algo baja de 60 fps en un celular de gama media, sobre todo el campo de 1,000 puntos en canvas y el mapa. | en uso (escala). Medición con CPU x4: primero 49 fps y p95 de 48 ms. Causa nombrada: se repintaban los 1,000 círculos por cuadro. Arreglo: redibujar solo los que cambian de nivel y guardar colores en caché. Resultado: 60 fps sostenidos y p95 de 16.8 ms. Pendiente: confirmar en un Android de gama media real. |
| `animate-expo` | Animación en React Native y Expo (Reanimated, gestos, hápticos). | No hay app nativa. Se registrará qué principios de gestos y hápticos se trasladan a la web: un háptico por acción del usuario, en el mismo cuadro que lo visual y nunca como única señal (por ejemplo, `navigator.vibrate` corto al revelar la curva real en el Acto 1). | pendiente |
| `write-swift` | Cómo escribir Swift moderno (tipos de valor, concurrencia de Swift 6, pruebas, macros). | No aplica: el proyecto no tiene código Swift ni app de iOS. Se deja registrada con esa justificación. | pendiente |

## Skills de HyperFrames (Modelo B, plugin `hyperframes@hyperframes` 0.8.176)

El Modelo A no las usa. Se listan para que el Modelo B registre aquí su uso en la Fase 4.

| Skill | Para qué sirve | Dónde se aplicará en este proyecto | Estado |
|---|---|---|---|
| `hyperframes` | Punto de entrada: arma un video con HTML, CSS y GSAP. | Loop del hero, reels, pitch. | pendiente |
| `hyperframes-core` | Contrato de composición: atributos `data-*` de tiempo, pistas, subcomposiciones, variables. | Estructura de cada composición en `video/`. | pendiente |
| `hyperframes-animation` | Reglas de animación, escenas por fases, transiciones y adaptadores de GSAP. | Timelines de hero, reels y pitch. | pendiente |
| `hyperframes-cli` | `preview`, `render` y demás comandos. | Revisar y exportar cada video. | pendiente |
| `hyperframes-audio` | Música, efectos y voz en la composición. | Música a 0.4 en reels y voz en off del pitch. | pendiente |
| `hyperframes-creative` | Dirección creativa: paleta, tipografía, narración, ritmo. | Aplicar `brand/tokens.json` a los videos. | pendiente |
| `hyperframes-keyframes` | Animación por cuadros clave. | Según lo necesite el Modelo B. | pendiente |
| `hyperframes-registry` | Bloques y componentes listos del registro. | Según lo necesite el Modelo B. | pendiente |
| `hyperframes-studio` | Editor visual de composiciones. | Según lo necesite el Modelo B. | pendiente |
| `embedded-captions` | Subtítulos quemados en el video. | Subtítulos de los reels (máximo 42 caracteres por línea). | pendiente |
| `media-use` | Resuelve música, efectos, íconos y voz a archivos locales. | Música libre de derechos de los reels. | pendiente |
| `motion-graphics` | Gráficos en movimiento. | Escenas de datos del pitch. | pendiente |
| `slideshow` | Video tipo presentación. | Posible base del carrusel. | pendiente |
| `faceless-explainer` | Video explicativo sin persona a cuadro a partir de un texto. | No previsto, referencia. | pendiente |
| `general-video` | Video general a partir de un brief. | No previsto, referencia. | pendiente |
| `product-launch-video` | Video promocional de producto. | No previsto, referencia. | pendiente |
| `music-to-video` | Video sincronizado con una pista de música. | No previsto, referencia. | pendiente |
| `talking-head-recut` | Tarjetas gráficas sobre un video de entrevista. | No previsto, referencia. | pendiente |
| `pr-to-video` | Video a partir de un pull request. | No aplica. | pendiente |
| `remotion-to-hyperframes` | Migrar composiciones de Remotion. | No aplica. | pendiente |
| `figma` | Importar contenido de Figma. | No aplica (el design system viene de Claude Design). | pendiente |

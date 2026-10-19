# Prompts del proyecto "La generación que se apagó"

## 1. Prompt para Claude Design (design system)

Crea un design system completo para "La generación que se apagó", un micrositio de storytelling con datos que estamos desarrollando para el hackatón del Instituto Nacional Electoral de México (Reto 3: comunicar la participación ciudadana con datos).

**Qué es el proyecto**
Una experiencia web, móvil primero, que cuenta con datos oficiales del INE (Conteos Censales de Participación 2012, 2018 y 2024) cómo la participación electoral cae en la juventud. A los 18 años vota el 61%, a los 25 solo el 47%, y la generación que tenía 18 en 2012 votó 66.7%, luego 52.1% a los 24 y 50.3% a los 30: nunca se recuperó. En 2024, 37.1 millones de personas no votaron y un tercio tenía entre 18 y 29 años. La historia termina con esperanza: hay casi 15 mil secciones donde los jóvenes sí votan 60% o más.

**Público**
Jóvenes mexicanos de 18 a 29 años que usan el celular para todo. Público secundario: personal del INE y docentes que imprimen fichas por municipio para pláticas en escuelas.

**Concepto visual**
Cada persona es una luz. Quien votó es una luz encendida, quien no, una luz apagada. La experiencia empieza encendida y se oscurece conforme la generación crece; al final aparecen los focos que siguen encendidos. Ambiente nocturno, cálido, íntimo, con un solo acento luminoso. Debe sentirse como una pieza editorial de periodismo de datos de primer nivel (referencias de tono: The Pudding, Reuters Graphics, NYT Upshot), no como un dashboard de gobierno ni como una plantilla de startup.

**Tono**
Cercano, honesto, sin sermonear ni culpar a quien no vota. Serio con los datos, cálido con las personas.

**Restricciones**
- No usar logotipos, colores institucionales ni tipografías oficiales del INE. Solo se cita "Fuente: INE".
- Contraste WCAG AA como mínimo en todo el texto, también sobre fondo oscuro.
- Las escalas de datos deben distinguirse con daltonismo (protanopia y deuteranopia).
- Nada de degradados genéricos, glassmorphism, emojis como íconos ni sombras exageradas.
- Tipografías disponibles en Google Fonts. Como punto de partida puedes considerar una grotesca expresiva para títulos, una sans muy legible para texto y una monoespaciada para cifras, pero decide tú lo que mejor sirva al concepto.

**Lo que necesito que incluya**
1. Paleta: fondos oscuros (2 o 3 niveles), color de luz encendida, color de luz apagada, texto principal y secundario, color de alerta, y una variante clara completa para impresión.
2. Escalas de datos: secuencial de apagado a encendido (mínimo 7 pasos), un par de colores para mujeres y hombres, y una divergente para "mejor o peor que el promedio".
3. Tipografía: familias, escala completa (display gigante para cifras, títulos, cuerpo, notas al pie, etiquetas de gráfica) con tamaños, interlineados y tracking para móvil y escritorio.
4. Espaciado, rejilla móvil y escritorio, radios y elevación.
5. Movimiento: duraciones y curvas con nombre (entrada, salida, énfasis, transición de escena, scroll), siguiendo el principio de entradas con ease-out y duraciones cortas en interfaz.
6. Componentes:
   - Cifra protagonista (número enorme con etiqueta y fuente)
   - Bloque de paso de scrollytelling (texto que acompaña a una gráfica fija)
   - Gráfica de línea por edad con anotaciones
   - Mapa coroplético de estados con tooltip
   - Selector de estado y municipio, campo de edad, selector de sexo
   - Botones primario, secundario y de texto
   - Toast
   - Tarjeta "Wrapped" vertical 1080x1920 (5 variantes de contenido: cifra del municipio, comparación por edad, posición de su generación, contraste entre secciones, cierre "¿Tu luz sigue encendida?")
   - Ficha institucional imprimible en hoja carta, en estilo claro, con QR
   - Pie de fuente y nota metodológica
7. Pantallas clave de ejemplo en móvil (390 px): hero, campo de puntos de escala, "Dibújalo tú" antes y después de revelar, paso de cohorte, mapa, formulario del Wrapped y carrusel de tarjetas.
8. Un mini manual de marca: nombre, uso del concepto de luz, voz y tono con ejemplos de frases que sí y que no.

**Formato de salida**
Además del design system visual, entrega los tokens listos para código en dos formatos:
- CSS para Tailwind v4 dentro de un bloque `@theme` (variables como `--color-luz`, `--font-titulo`, `--text-display`, `--ease-entrada`, `--duration-media`).
- JSON con exactamente los mismos valores, para reutilizarlo en las animaciones de video.

---

## 2. Prompt para el Modelo A: Fase 0 (todo lo previo a la Fase 1)

Lee completo `PLAN_la_generacion_que_se_apago.md`. Eres el **Modelo A** (web y datos). En esta sesión ejecuta **solo la Fase 0 (sección 5)**. No empieces la Fase 1.

Contexto: tengo en mi carpeta el zip `generacion-apagada-base.zip` con los datos ya procesados (JSON), los scripts del pipeline y la documentación de datos, y la exportación del design system de Claude Design en `<RUTA_DEL_DESIGN_SYSTEM>`.

Haz lo siguiente en orden y detente a avisarme si algo falla:

1. Verifica Node 22 o mayor, npm, Python 3.11+ con pandas, FFmpeg y Git. Muéstrame las versiones.
2. Crea el repositorio `generacion-apagada` con la estructura exacta de la sección 4 y el `.gitignore` indicado.
3. Crea la app Angular en `web/` con la última versión estable, standalone, routing, sin SSR. Configura `OnPush` como default en los schematics de `angular.json`.
4. Instala Tailwind v4 con la guía oficial (`tailwindcss`, `@tailwindcss/postcss`, `postcss`, `.postcssrc.json`, `@import "tailwindcss";`).
5. Instala las dependencias de la sección 5, paso 5.
6. Instala las skills de la sección 3.1: `npx skills@latest add emilkowalski/skills` y el plugin de HyperFrames. Lista las skills instaladas y confirma que están las 15 de Emil. Lee el `SKILL.md` de cada una y crea `docs/SKILLS_USAGE.md` con una tabla: skill, para qué sirve, dónde se aplicará en este proyecto (según la sección 3.2), estado "pendiente".
7. Lee `emil-design-eng`, `apple-design` y `pick-ui-library` completas y escribe en `docs/DECISIONES.md` las 10 reglas de diseño y movimiento que vas a seguir en todo el proyecto y qué primitivas de UI usarás en Angular (Angular CDK, ngx-sonner y lo que recomiende la skill traducido a Angular).
8. Descomprime `generacion-apagada-base.zip` en la raíz del repo. Corre `python pipeline/validate_data.py web/public/data` y muéstrame que imprime OK. Lee `docs/DATOS.md`. No regeneres ni modifiques los JSON: la Fase 1 ya está hecha.
9. Copia la exportación del design system a `brand/design-system/`, genera `brand/tokens.json` y `brand/tokens.css` (bloque `@theme`), e impórtalos en `web/src/styles.css`.
10. Crea la ruta oculta `/tokens` que muestre colores, tipografías, escala tipográfica, espaciado y curvas de movimiento (con una demo animada de cada curva).
11. Crea el `README.md` inicial y haz el primer commit.

Reglas: sin comentarios en el código, sin el carácter em dash en ningún lado, sin colores ni tamaños escritos a mano fuera de los tokens.

Al terminar, dame:
- El árbol de carpetas (sin `node_modules`).
- Captura o descripción de la página `/tokens`.
- El contenido de `docs/SKILLS_USAGE.md` y `docs/DECISIONES.md`.
- La lista de criterios de aceptación de la Fase 0 con cumplido o pendiente.

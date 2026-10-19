Botón de acción; usa un solo `primario` por pantalla (es la "luz encendida"), `secundario` para alternativas y `texto` para acciones menores.

```jsx
<Boton variante="primario" iconoFinal={<Icono nombre="arrow-right" />}>Crear mi tarjeta</Boton>
<Boton variante="secundario" icono={<Icono nombre="download" />}>Descargar</Boton>
<Boton variante="texto">Ver nota metodológica</Boton>
```

- `tamano`: `md` 48 px (default), `lg` 56 px para CTA de cierre.
- `completo` para ancho total en móvil. `href` lo vuelve `<a>`.
- Hover: primario aclara a `luz-suave`; secundario rellena `superficie-alta`. Presión: escala 0.98, 90 ms.

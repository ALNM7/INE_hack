Paso de scrollytelling: tarjeta de texto que sube sobre una gráfica fija; el paso `activo` decide qué muestra la gráfica.

```jsx
<div style={{ position: "relative" }}>
  <div style={{ position: "sticky", top: 0, height: "100svh" }}><CampoLuces proporcion={p} /></div>
  <PasoScrolly numero={1} activo={paso === 1}>En 2012, a los 18, votó el <b>66.7%</b>.</PasoScrolly>
  <PasoScrolly antetitulo="2018 · 24 años" activo={paso === 2}>Seis años después, 52.1%.</PasoScrolly>
</div>
```

- Alto mínimo `--spacing-paso` (85vh) para que solo haya un paso legible a la vez.
- Máx. 40 palabras por paso. Detecta el activo con IntersectionObserver (umbral 0.5).

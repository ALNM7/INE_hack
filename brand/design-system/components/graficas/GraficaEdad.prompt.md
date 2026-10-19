Gráfica de línea de participación por edad con anotaciones; la serie protagonista va en `luz`, el contexto en `apagada`.

```jsx
<GraficaEdad
  dominioY={[40, 70]}
  series={[{ id: "2024", tono: "luz", puntos: [{x:18,y:61},{x:25,y:47},{x:30,y:50}] }]}
  anotaciones={[{ x: 25, y: 47, cifra: "47%", texto: "A los 25, menos de la mitad", lado: "abajo" }]}
  referencia={{ y: 61, etiqueta: "18 años" }}
/>
```

- Máximo 3 series. Mujeres/hombres con `tono="mujer"`/`"hombre"`, nunca junto a la escala divergente.
- `hastaX` para revelar por pasos en scrollytelling. Anotaciones: máx. 2 por estado de la gráfica, ≤ 8 palabras.
- Etiquetas directas al final de cada línea; no uses leyenda aparte.

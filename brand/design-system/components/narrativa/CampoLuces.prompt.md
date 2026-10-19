Campo de luces: la metáfora central (cada persona es una luz). Por defecto los puntos se reparten sobre un mapa oscuro de México; encendido = votó, apagado = no votó.

```jsx
<CampoLuces total={420} proporcion={0.667} semilla={12} />   {/* mapa */}
<CampoLuces total={420} proporcion={0.503} semilla={12} />   {/* misma semilla: se apagan las mismas */}
<CampoLuces forma="rejilla" total={100} encendidas={54} columnas={10} radio={10} separacion={10} />
```

- `forma="mexico"` (default): rejilla hexagonal recortada a la silueta real de los 32 estados, sobre estados en `superficie` con bordes `linea`. Los puntos no representan ubicación geográfica de votantes; es una forma.
- `forma="rejilla"` cuando el número se lee como "de cada 100" (ficha impresa, tarjetas de edad y secciones).
- Mantén `semilla` fija entre escenas para que las luces que se apagan sean siempre las mismas.
- Sin halo (`halo={false}`) en impresión o con muchos puntos pequeños.

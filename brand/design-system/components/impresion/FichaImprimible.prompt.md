Ficha municipal en hoja carta, tema claro, lista para imprimir en blanco y negro o color; incluye QR al sitio.

```jsx
<FichaImprimible municipio="Zapopan" estado="Jalisco" participacionJoven={54.2} url="lageneracionqueseapago.mx" />
```

- Imprime con `@page { size: letter; margin: 0 }` y el nodo a escala 1. Funciona en escala de grises: encendido vs. apagado se distingue por luminosidad.
- Para producción, pasa `qrSrc` con un QR generado localmente (el default usa un servicio externo).
- Datos de ejemplo ilustrativos.

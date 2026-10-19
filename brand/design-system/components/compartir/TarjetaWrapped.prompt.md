Tarjeta compartible 1080×1920 para historias; cinco variantes que juntas cuentan la historia personal del usuario (municipio → edad → generación → secciones → cierre).

```jsx
<TarjetaWrapped variante="municipio" indice={1} datos={{ municipio: "Zapopan", valor: 54.2 }} escala={0.3} />
<TarjetaWrapped variante="cierre" indice={5} datos={{ url: "lageneracionqueseapago.mx" }} escala={0.3} />
```

- Siempre fondo `noche-1`; usa los tamaños fijos `--text-wrapped-*` (cifra 340, título 92, cuerpo 44, etiqueta 30).
- Márgenes 96 px; zona segura superior/inferior de 200 px libre de texto clave (barras de Instagram/TikTok).
- Exporta a escala 1 (html-to-image o captura del nodo `[data-tarjeta]`).
- Las cifras de ejemplo son ilustrativas salvo las de la cohorte (66.7 / 52.1 / 50.3).

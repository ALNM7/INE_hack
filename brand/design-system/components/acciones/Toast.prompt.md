Aviso breve abajo de la pantalla para confirmar una acción o reportar un error recuperable; entra con `ease-entrada` en 240 ms.

```jsx
<Toast tono="exito" mensaje="Tu tarjeta se guardó en Fotos." onCerrar={cerrar} duracion={4000} flotante />
<Toast tono="alerta" mensaje="No encontramos ese municipio." accion={{ etiqueta: "Reintentar", onClick: buscar }} />
```

- Tonos: `info` (ícono arena), `exito` (ícono luz), `alerta` (ícono coral). El color nunca va solo: siempre ícono + texto.
- Mensajes en una oración, sin signos de exclamación.

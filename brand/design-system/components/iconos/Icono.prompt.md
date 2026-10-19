Icono de línea Lucide (trazo 1.75, hereda `currentColor`); úsalo dentro de botones, campos y toasts, nunca como decoración suelta.

```jsx
<Icono nombre="share-2" tamano={20} />
<Icono nombre="circle-alert" titulo="Error" style={{ color: "var(--color-alerta)" }} />
```

- 22 glifos disponibles (ver `Icono.d.ts`). Para otros, copia el trazo desde lucide-static@0.460.0 a `lucide.js`.
- Tamaños: 16 en etiquetas, 20 en botones/campos, 24 en barras.

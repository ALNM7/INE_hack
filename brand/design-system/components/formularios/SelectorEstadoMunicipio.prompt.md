Selector encadenado de estado y municipio para el formulario del Wrapped y la ficha imprimible.

```jsx
<SelectorEstadoMunicipio
  estados={[{ id: "JAL", nombre: "Jalisco", municipios: ["Guadalajara", "Zapopan"] }]}
  estado={f.estado} municipio={f.municipio}
  onCambiar={(v) => setF({ ...f, ...v })}
/>
```

- Municipio queda deshabilitado hasta elegir estado. Altura 52 px, foco con borde luz.

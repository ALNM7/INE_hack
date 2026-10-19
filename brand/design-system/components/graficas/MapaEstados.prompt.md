Mapa coroplético de México por estado con tooltip; úsalo para "dónde se apaga más" (secuencial) o "mejor o peor que el promedio" (divergente).

```jsx
<MapaEstados valores={{ JAL: 54.1, OAX: 47.3, YUC: 63.0 /* … */ }} />
<MapaEstados escala="divergente" promedio={52.4} rango={8} valores={datos} seleccionado="JAL" onSeleccionar={setEstado} />
```

- Geometría real (Mercator, simplificada) en `mxEstados.js`; claves ISO sin "MX-" (CMX = Ciudad de México).
- Tooltip con nombre, valor (mono, luz) y diferencia contra el promedio. Navegable con Tab.
- Los estados sin dato se pintan en `superficie-alta`.

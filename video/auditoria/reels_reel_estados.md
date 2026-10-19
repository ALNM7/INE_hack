# Auditoría de animación: reels/reel_estados

Duración: 15 s. Tweens: 23 (mapeados 23, micro omitidos 0).

## Banderas

- Ninguna

## Zonas muertas

- Ninguna

## Coreografía

```
Timeline (15.0s, each char ≈ 0.25s):
  0s                                                    15s
  ┼───────────────────────────────────────────────────────────┤
  ███                                                           #cabecera opacity+y
   ███                                                          #sub-1 opacity+y
    ███                                                         #titulo-grafica opacity+y
     █████                                                      #mapa opacity+scale
            ██                                                  #sub-1 opacity+y
             ███████                                            (onUpdate driver) p
              ███                                               #sub-2 opacity+y
               ██                                               #llamada-bajo opacity+y
                   ███████                                      (onUpdate driver) p
                         ███████                                (onUpdate driver) p
                               ███████                          (onUpdate driver) p
                                  ██                            #sub-2 opacity+y
                                    ███                         #llamada-alto opacity+y
                                    ███                         #sub-3 opacity+y
                                       █████                    #leyenda opacity+y
                                           █████                circle.foco-llamada scale+transformOrigin
                                               █████            circle.foco-llamada scale+transformOrigin
                                                  ██            #sub-3 opacity+y
                                                   ███          #visual opacity+y
                                                     ████       #cierre-regla opacity+scaleX
                                                     █████      #cierre-titulo opacity+y
                                                      █████     #cierre-url opacity+y
                                                       ████     #cierre-fuente opacity
```

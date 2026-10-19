# Auditoría de animación: reels/reel_curva

Duración: 15 s. Tweens: 24 (mapeados 24, micro omitidos 0).

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
     █████                                                      #guia-0 opacity+scaleX
      ████                                                      text.eje-y opacity
            █████████                                           #curva attr
                ██                                              #sub-1 opacity+y
                    █████                                       #area opacity
                        ██                                      #marcador opacity+scale
                          ██                                    #etiqueta-minimo opacity+y
                           ██████                               #grafica y+scale
                                 ████                           #respuesta-cifra opacity+y
                                  ██                            #respuesta-etiqueta opacity+y
                                   ██                           #sub-2 opacity+y
                                   █████                        #halo-minimo scale+opacity+transformOrigin
                                       █████                    #halo-minimo scale+opacity+transformOrigin
                                           ████                 #halo-minimo scale+opacity+transformOrigin
                                              █████             #halo-minimo scale+opacity+transformOrigin
                                                  ██            #sub-2 opacity+y
                                                   ███          #visual opacity+y
                                                     ████       #cierre-regla opacity+scaleX
                                                     █████      #cierre-titulo opacity+y
                                                      ████      #cierre-url opacity+y
                                                       ████     #cierre-fuente opacity
```

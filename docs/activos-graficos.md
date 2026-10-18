# Activos gráficos

Imágenes proporcionadas por la institución el 18/10/2026 y optimizadas para el juego (formato WebP).

| Archivo | Uso | Escenas |
|---|---|---|
| `src/assets/escenarios/centro-exterior.webp` | Entrada del centro comunitario | Portada, E01, E08 |
| `src/assets/escenarios/entrada.webp` | Primer plano de la puerta de salida (recorte del anterior) | E02, E03 |
| `src/assets/escenarios/oficina.webp` | Oficina de coordinación | E04 a E07 |
| `src/assets/personajes/{mariela,elena,referente}-{atenta,pensativa,explica}.webp` | Tres poses por personaje, de la cabeza a medio muslo, con fondo transparente | Según la escena y quien habla |

## Cómo se eligen las poses
- Quien habla aparece **explicando** (manos abiertas), salvo que la línea indique otra pose en `src/content/episodio1/escenas.ts` (campo `pose`).
- Quien escucha aparece **atenta**.
- Líneas con pose **pensativa**: la preocupación de Mariela en E01 y E02, su petición en E07 y la pregunta de Elena en E08.

## Reemplazar o añadir imágenes
1. Mantén el mismo nombre de archivo y el formato WebP. Fondos: 1600 × 720 px. Personajes: unos 600 px de alto, con fondo transparente y el mismo encuadre.
2. Ejecuta `npm test` y `npm run build:archivo` para regenerar la demostración en un solo archivo.

## Pendiente de confirmar
- [ ] Derechos de uso de las imágenes y su origen (por ejemplo, si son generadas por IA o encargadas). Deben representar a personas ficticias: no se usan fotografías de participantes reales.
- [ ] Revisión de la representación de los personajes con el Punto Focal (diversidad, ausencia de estereotipos).

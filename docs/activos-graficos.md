# Activos gráficos

Imágenes **generadas con IA**, proporcionadas por la institución el 18/10/2026, que representan a **personas ficticias**. Están optimizadas en formato WebP, con fondo transparente.

| Archivo | Personaje | Poses |
|---|---|---|
| `src/assets/personajes/mariela-*.webp` | Mariela (chaqueta terracota) | atenta, pensativa, explica |
| `src/assets/personajes/elena-*.webp` | Elena (chaleco verde y credencial) | atenta, pensativa, explica |
| `src/assets/personajes/referente-*.webp` | Referente (camisa verde y credencial) | atenta, pensativa, explica |

**Módulo 2.** Lucía (15 años) y la profesional de atención aún no tienen ilustración: se muestra una **silueta neutra provisional** (SVG en `src/ui/ilustraciones.tsx`), sin rasgos, con una descripción accesible. Elena y el Referente reutilizan sus imágenes. La persona señalada no tiene retrato.

Para sustituir las siluetas hacen falta:
- `lucia-atenta.webp`, `lucia-pensativa.webp`, `lucia-explica.webp`: adolescente de unos 15 años, de cuerpo entero y con ropa cotidiana, en el mismo estilo. Expresiones naturales; no llorando ni en primer plano de sufrimiento (guion, apartado 3).
- Opcional: `profesional-atenta.webp`, `profesional-pensativa.webp` y `profesional-explica.webp`, para la profesional de un servicio de atención genérico.

Después, añade las importaciones en `personajes` (`src/ui/ilustraciones.tsx`) y quita la silueta.

Los personajes se muestran **de cuerpo entero sobre un fondo neutro**, sin escenarios (decisión de la institución del 19/10/2026). Las escenas sin personajes (E05, E05B y E06) no muestran escenario. La portada no lleva imagen.

## Cómo se eligen las poses
- Quien habla aparece **explicando** (manos abiertas), salvo que la línea indique otra pose en `src/content/episodio1/escenas.ts` (campo `pose`).
- Quien escucha aparece **atenta**.
- Líneas con pose **pensativa**: la preocupación de Mariela en E01 y E02, su petición en E07 y la pregunta de Elena en E08. En el módulo 2, las líneas en que Lucía expresa temor o una preocupación.

## Reemplazar imágenes
1. Mantén el mismo nombre de archivo, el formato WebP con fondo transparente y la figura de cuerpo entero (unos 1000 px de alto).
2. Ejecuta `npm test` y `npm run build:archivo` para regenerar la demostración en un solo archivo.

## Pendiente de confirmar
- [ ] Términos de uso de la herramienta de IA con que se generaron las imágenes (uso institucional y publicación).
- [ ] Revisión de la representación de los personajes con el Punto Focal (diversidad, ausencia de estereotipos).

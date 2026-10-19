# Activos gráficos

Imágenes **generadas con IA**, proporcionadas por la institución el 18/10/2026, que representan a **personas ficticias**. Están optimizadas en formato WebP, con fondo transparente.

| Archivo | Personaje | Poses |
|---|---|---|
| `src/assets/personajes/mariela-*.webp` | Mariela (chaqueta terracota) | atenta, pensativa, explica |
| `src/assets/personajes/elena-*.webp` | Elena (chaleco verde y credencial) | atenta, pensativa, explica |
| `src/assets/personajes/referente-*.webp` | Referente (camisa verde y credencial) | atenta, pensativa, explica |
| `src/assets/personajes/lucia-*.webp` | Lucía, 15 años (chaqueta azul con capucha y jeans), módulo 2 | atenta, pensativa, explica |
| `src/assets/personajes/profesional-*.webp` | Profesional de atención (chaqueta de punto verde, gafas y credencial), módulo 2 | atenta, pensativa, explica |

**Módulo 2.** Lucía y la profesional de atención fueron proporcionadas por la institución el 19/10/2026 (también generadas con IA). Lucía se muestra algo más baja que las personas adultas. La persona señalada no tiene retrato.

**Módulo 3.** Nicolás, Camila y Diego aún no tienen ilustración: se muestra una **silueta neutra provisional** (SVG en `src/ui/ilustraciones.tsx`), sin rasgos y con una descripción accesible. Elena reutiliza sus imágenes. La persona visitante no tiene retrato (guion: no se la caracteriza por su aspecto). Para sustituir las siluetas, en el mismo estilo, de cuerpo entero y en tres poses (`atenta`, `pensativa`, `explica`):
- `nicolas-*.webp`: colega a cargo de logística y transporte, persona adulta del equipo técnico.
- `camila-*.webp`: participante adolescente de 14 años, con ropa cotidiana.
- `diego-*.webp`: participante de 11 años que necesita una adaptación de acceso al espacio. No debe presumirse una condición clínica ni representarse como objeto de ayuda; si se muestra una ayuda técnica, que sea con naturalidad y que la institución lo decida.

Después, añade las importaciones en `personajes` (`src/ui/ilustraciones.tsx`).

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

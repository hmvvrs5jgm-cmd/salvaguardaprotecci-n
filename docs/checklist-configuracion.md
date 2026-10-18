# Checklist de configuración pendiente antes del lanzamiento

Marca cada punto solo cuando la institución lo haya verificado.

## Contenido institucional
- [ ] Confirmar la vigencia de la Política PRO-POL-080 (revisión prevista para el 30/06/2026) y la fecha de aprobación del Procedimiento PRO-PRO-080 (junio o julio de 2023). Actualizar `src/config/fuentes.ts`.
- [ ] Revisar con el Punto Focal la fidelidad del episodio al procedimiento y a las rutas (guion, apartado 21).
- [ ] Confirmar con Asesoría Legal la decisión de denunciar en casos con personas adultas y el alcance del COIP, art. 276 (`docs/discrepancias.md`, puntos 3, 4 y 15).
- [ ] Armonizar el criterio de niveles 2 y 3 entre la ruta gráfica y el Procedimiento 5.2.3 (punto 16).
- [ ] Aprobar o ajustar el umbral pedagógico provisional (8/10 y críticas 2, 3, 4 y 6): `src/content/episodio1/evaluacion.ts`. Después, regenerar el banco con `npm run gen:assessment-sql`.
- [ ] Validar la interpretación de las insignias (`docs/discrepancias.md`, punto 13).
- [ ] Banco de preguntas equivalentes revisado para nuevos intentos (hoy: práctica reforzada con las mismas diez).

## Canales y contactos (`src/config/canales.ts`)
- [ ] Punto Focal de Salvaguarda de ChildFund: verificar el canal y cambiar el estado a `verificado`. (Descripción ajustada por la institución el 18/10/2026: «Recibe la preocupación y la registra mediante el formulario de incidentes».)
- [x] Gerentes y dirección directa: confirmados por la institución el 18/10/2026 (Política 2.9.1; Procedimiento 5.2.2).
- [x] `complaints@childfund.org`: confirmado por la institución el 18/10/2026; se muestra como enlace de correo.
- [x] Speak Up: `http://speakup.childfund.org` confirmado por la institución el 18/10/2026; se muestra como enlace externo.
- [ ] Teléfono de país: se consulta en el sitio de Speak Up; no copiarlo sin verificar.
- [ ] Punto focal de las organizaciones socias: redacción genérica, sin nombrar intermediarios.
- [x] Número de emergencia 911 y servicios públicos del Capítulo III (`serviciosPublicos` en `src/config/canales.ts`): confirmados por la institución el 18/10/2026. Revisar periódicamente su vigencia.
- [ ] PEP suplente: verificar el canal de contacto (Plan de Salvaguarda FY2026, anexo 4).
- [ ] Mecanismo comunitario de retroalimentación y quejas: verificar cómo se accede.
- [ ] Directorio local de servicios: el mapeo del Protocolo es de uso interno; definir cómo se consulta a través del PEP.

## Privacidad y registro (`src/config/privacidad.ts`)
- [ ] Responsable del tratamiento.
- [ ] Plazo de conservación.
- [ ] Base jurídica.
- [ ] Canal de consultas.
- [ ] Vigencia de la aprobación (opcional; vacía por defecto).
- [ ] Mientras falten los cuatro primeros campos, `npm run build` en modo `registro` se detiene.

## Marca y activos
- [ ] Manual de marca: el color verde es un acento provisional (`--acento` en `src/styles.css`). No se usa el logotipo.
- [x] Ilustraciones: imágenes de escenarios y personajes proporcionadas por la institución (ver `docs/activos-graficos.md`).
- [ ] Confirmar los derechos de uso y el origen de las imágenes.

## Backend y publicación (ver `docs/despliegue.md`)
- [ ] Proyecto Supabase creado por la institución, con las migraciones aplicadas.
- [ ] Plantilla de correo con el código `{{ .Token }}`; SMTP propio configurado.
- [ ] MFA TOTP habilitado.
- [ ] Punto Focal designado con `private.asignar_punto_focal`.
- [ ] Variables del repositorio para Pages (`VITE_APP_MODE`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
- [ ] GitHub Pages activado con «GitHub Actions» como fuente; ejecución manual del flujo «Publicar en GitHub Pages».
- [ ] Prueba piloto con personal de ChildFund y socios (guion, apartado 21), sin solicitar relatos reales.

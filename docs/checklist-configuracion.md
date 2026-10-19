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

### Módulo 2 — «Gracias por escucharme»
- [ ] Validación del guion v1.0 por el Punto Focal (guion, apartado 24): roles y articulación socio–ChildFund, excepciones de contacto con representantes, consentimiento por intervención y no cierre automático.
- [ ] Resolver los puntos 19, 20 y 23 de `docs/discrepancias.md` (nivel 1 con agresor en el hogar, liderazgo del nivel 1 y consentimiento de adolescentes).
- [ ] Aprobar o ajustar el umbral provisional del módulo 2 (`src/content/episodio2/evaluacion.ts`) y regenerar el banco con `npm run gen:assessment-sql`.
- [x] Ilustraciones de Lucía (tres poses) y de la profesional de atención (tres poses), 19/10/2026.
- [ ] Aplicar la migración `20261019000005_banco_m2_v1_0.sql` en el proyecto Supabase.
- [ ] Piloto del módulo 2 con personal de ChildFund y socios, sin relatos reales.

### Módulo 3 — «Antes de abrir las puertas»
- [ ] Revisión del guion v1.0 por el Punto Focal y por los responsables operativos (guion, apartado 23).
- [ ] Resolver los puntos 26 a 30 de `docs/discrepancias.md`: proporciones de supervisión, consentimiento de imagen, visitas no previstas en socios, requisitos de transporte, quién valida las adaptaciones y procedimiento de entrega.
- [ ] Validar el umbral provisional del módulo 3 (8/10 y críticas 2, 4, 6 y 8) en `src/content/episodio3/evaluacion.ts` y regenerar el banco.
- [x] Ilustraciones de Camila, Diego y Nicolás (tres poses cada uno), 19/10/2026.
- [ ] Aplicar la migración `20261019000006_banco_m3_v1_0.sql` en el proyecto Supabase.
- [ ] Piloto: comprobar que se entiende que adaptar o suspender puede ser correcto, que dos personas adultas no siempre bastan y que una autorización no elimina el deber de cuidado.

### Módulo 4 — «La información también protege»
- [ ] Validación del guion v1.0 por el Punto Focal (guion, apartado 24): esquema real de autorización, articulación socio–ChildFund, funciones técnicas, comunicación a personas afectadas y requisitos externos, conservación y eliminación.
- [ ] Resolver los puntos 33 a 37 de `docs/discrepancias.md`: accesos para tareas operativas, plazos de conservación, notificaciones de datos personales y la función de soporte autorizado.
- [ ] Adoptar o ajustar el umbral provisional del módulo 4 (8/10 y críticas 2, 5, 6 y 7) en `src/content/episodio4/evaluacion.ts` y regenerar el banco.
- [ ] Aplicar la migración `20261019000007_banco_m4_v1_0.sql` en el proyecto Supabase.
- [ ] Piloto: comprobar que se entiende que compartir lo necesario puede proteger y que pertenecer a un equipo no autoriza a conocerlo todo.

### Módulo 5 — «Es alguien importante»
- [ ] Revisión del guion v1.0 por el Punto Focal (guion, apartado 24): canales alternativos existentes, articulación socio–ChildFund, manejo de un posible conflicto sin inventar una estructura de recusación, protección de NNA y denunciantes, y distinción entre prevención, investigación y decisiones laborales.
- [ ] Resolver los puntos 39 a 42 de `docs/discrepancias.md`.
- [ ] Ilustraciones de Paula (colaboradora adulta del equipo territorial, tres poses) (`docs/activos-graficos.md`).
- [ ] Adoptar o ajustar el umbral provisional del módulo 5 (8/10 y críticas 2, 4, 6 y 8) en `src/content/episodio5/evaluacion.ts` y regenerar el banco.
- [ ] Aplicar la migración `20261019000008_banco_m5_v1_0.sql` en el proyecto Supabase.
- [ ] Piloto: comprobar que se entiende que no hace falta probar un hecho para reportar, que el conflicto se informa sin presumir culpabilidad y que prevenir represalias no significa prometer resultados laborales.

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
- [x] Ilustraciones: personajes generados con IA, de cuerpo entero sobre un fondo neutro (ver `docs/activos-graficos.md`).
- [ ] Confirmar los términos de uso de la herramienta de IA.

## Backend y publicación (ver `docs/despliegue.md`)
- [ ] Proyecto Supabase creado por la institución, con las migraciones aplicadas.
- [ ] Plantilla de correo con el código `{{ .Token }}`; SMTP propio configurado.
- [ ] MFA TOTP habilitado.
- [ ] Punto Focal designado con `private.asignar_punto_focal`.
- [ ] Variables del repositorio para Pages (`VITE_APP_MODE`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
- [ ] GitHub Pages activado con «GitHub Actions» como fuente; ejecución manual del flujo «Publicar en GitHub Pages».
- [ ] Prueba piloto con personal de ChildFund y socios (guion, apartado 21), sin solicitar relatos reales.

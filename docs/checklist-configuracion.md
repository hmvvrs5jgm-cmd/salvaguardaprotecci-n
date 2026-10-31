# Checklist de configuración pendiente antes del lanzamiento

Marca cada punto solo cuando la institución lo haya verificado.

## Contenido institucional
- [x] Política PRO-POL-080: sigue vigente (Punto Focal, 31/10/2026, punto 7.6). La fecha de aprobación del Procedimiento (13 de junio de 2023) quedó confirmada el 23/10/2026.
- [ ] Revisar con el Punto Focal la fidelidad del episodio al procedimiento y a las rutas (guion, apartado 21).
- [ ] Confirmar con Asesoría Legal la decisión de denunciar en casos con personas adultas y el alcance del COIP, art. 276 (`docs/discrepancias.md`, puntos 3, 4 y 15).
- [ ] Armonizar el criterio de niveles 2 y 3 entre la ruta gráfica y el Procedimiento 5.2.3 (punto 16).
- [x] Umbral pedagógico (8/10 y cuatro críticas en el mismo intento) confirmado por el Punto Focal el 23/10/2026 para los seis módulos. Si cambia, ajustar: `src/content/episodio1/evaluacion.ts`. Después, regenerar el banco con `npm run gen:assessment-sql`.
- [x] Interpretación de las insignias confirmada el 23/10/2026 (`docs/discrepancias.md`, punto 13).
- [x] Forma B validada por el Punto Focal (31/10/2026). Versión `<versión A>-B`; bancos en `supabase/migrations/2026103100001{1..6}_*_B.sql`. Los nuevos intentos alternan A y B en la demostración y en el registro.
- [ ] Aplicar en Supabase las seis migraciones de la forma B.
- [ ] Identificar la versión o fecha exacta de cada guion aprobado (punto 1.1).

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
- [x] Ilustraciones de Paula (tres poses), 19/10/2026.
- [ ] Adoptar o ajustar el umbral provisional del módulo 5 (8/10 y críticas 2, 4, 6 y 8) en `src/content/episodio5/evaluacion.ts` y regenerar el banco.
- [ ] Aplicar la migración `20261019000008_banco_m5_v1_0.sql` en el proyecto Supabase.
- [ ] Piloto: comprobar que se entiende que no hace falta probar un hecho para reportar, que el conflicto se informa sin presumir culpabilidad y que prevenir represalias no significa prometer resultados laborales.

### Módulo 6 — «Una imagen que no debió publicarse»
- [ ] Revisión institucional del guion v1.0 (apartado 24): requisitos y alcance del uso de imagen, participación de NNA y representación, roles en cuentas y comunicaciones, contacto seguro, articulación socio–ChildFund, mecanismos de retiro, conservación y criterios para reanudar publicaciones.
- [ ] Resolver los puntos 45 a 47 de `docs/discrepancias.md`.
- [x] Ilustraciones de Alma y Valeria (tres poses cada una), 20/10/2026.
- [ ] Adoptar o ajustar el umbral provisional del módulo 6 (8/10 y críticas 2, 4, 5 y 6) en `src/content/episodio6/evaluacion.ts` y regenerar el banco.
- [ ] Aplicar la migración `20261019000009_banco_m6_v1_0.sql` en el proyecto Supabase.
- [ ] Piloto: comprobar que se entiende que una imagen cotidiana puede exponer por el contexto, que una firma no elimina la valoración de riesgos y que una negativa no perjudica la participación.

## Canales y contactos (`src/config/canales.ts`)
- [x] Punto Focal de Salvaguarda de ChildFund: `gvasquez@childfund.org`, confirmado el 23/10/2026.
- [x] Gerentes y dirección directa: confirmados por la institución el 18/10/2026 (Política 2.9.1; Procedimiento 5.2.2).
- [x] `complaints@childfund.org`: confirmado por la institución el 18/10/2026; se muestra como enlace de correo.
- [x] Speak Up: `http://speakup.childfund.org` confirmado por la institución el 18/10/2026; se muestra como enlace externo.
- [x] Teléfono de país: se remite al sitio de Speak Up (decisión del 23/10/2026); no se publica un número.
- [x] Punto focal de las organizaciones socias: «Punto focal de salvaguarda de tu organización» (23/10/2026).
- [ ] Contacto concreto y alternativa de cada organización socia.
- [x] Número de emergencia 911 y servicios públicos del Capítulo III (`serviciosPublicos` en `src/config/canales.ts`): confirmados por la institución el 18/10/2026. Revisar periódicamente su vigencia.
- [x] PEP suplente: `mespin@childfund.org`, confirmado el 23/10/2026.
- [ ] Constancia documental de la designación vigente del suplente.
- [ ] Mecanismo comunitario: criterio confirmado (cada socio lo establece y difunde); documentar modalidades y acceso de cada socio.
- [x] Directorio local: se consulta a través del Punto Focal correspondiente; revisión semestral (23/10/2026).

## Privacidad y registro (`src/config/privacidad.ts`)
- [x] Responsable del tratamiento: Punto Focal de Salvaguarda de ChildFund Ecuador, gvasquez@childfund.org (31/10/2026).
- [x] Plazo de conservación: siete años desde cada resultado (31/10/2026).
- [x] Base jurídica: Ley Orgánica de Protección de Datos Personales (LOPDP) (31/10/2026).
- [x] Canal de consultas: gvasquez@childfund.org (31/10/2026).
- [ ] Recomendado: que Asesoría Legal precise la denominación jurídica del responsable y la base de legitimación concreta (LOPDP, art. 7). Basta con editar los textos de `src/config/privacidad.ts`.
- [x] Registro con correo institucional de organizaciones socias: confirmado (23/10/2026).
- [x] Vigencia de la aprobación: doce meses (23/10/2026). Se muestra en «Mi cuenta» y en el panel del Punto Focal.
- [x] Los cuatro campos están completos: `npm run build` en modo `registro` ya no se detiene por privacidad.

## Marca y activos
- [x] Acentos verde y naranja (`--acento` y `--acento-2` en `src/styles.css`), según el punto 6.4 (31/10/2026). Ambos cumplen contraste AA sobre blanco y sobre el fondo.
- [ ] Logotipo: entregar el archivo oficial (SVG o PNG) y los códigos de color del manual de marca. El archivo se copia en `public/marca/` y su nombre se indica en `src/config/marca.ts`.
- [x] Ilustraciones: personajes generados con IA, de cuerpo entero sobre un fondo neutro (ver `docs/activos-graficos.md`).
- [x] Términos de uso de la herramienta de IA: el uso institucional y la publicación están permitidos (31/10/2026, punto 6.5).
- [x] Representación de los personajes aprobada (31/10/2026, punto 6.6).

## Backend y publicación (ver `docs/despliegue.md`)
- [ ] Proyecto Supabase creado por la institución y administrado por Grace Vásquez (gvasquez@childfund.org, punto 7.1), con todas las migraciones de `supabase/migrations/` aplicadas en orden (incluidos los bancos de los módulos 2 a 6 y `20261020000010_csv_columna_modulo.sql`).
- [ ] Plantilla de correo con el código `{{ .Token }}`; SMTP propio configurado con la cuenta gvasquez@childfund.org (punto 7.2). Las credenciales se cargan en Supabase, nunca en el repositorio.
- [ ] MFA TOTP habilitado.
- [ ] Punto Focal designado con `private.asignar_punto_focal` para gvasquez@childfund.org, después de su primer inicio de sesión (punto 7.3).
- [ ] Variables del repositorio para Pages (`VITE_APP_MODE`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
- [ ] GitHub Pages activado en este repositorio (punto 7.4) con «GitHub Actions» como fuente; ejecución manual del flujo «Publicar en GitHub Pages».
- [ ] Prueba piloto en la Oficina País de Ecuador en noviembre, facilitada por Grace Vásquez (punto 7.5), sin solicitar relatos reales.

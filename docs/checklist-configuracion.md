# Checklist de configuración pendiente antes del lanzamiento

Marca cada punto solo cuando la institución lo haya verificado.

## Contenido institucional
- [ ] Confirmar la vigencia de la Política PRO-POL-080 (revisión prevista para el 30/06/2026) y la fecha de aprobación del Procedimiento PRO-PRO-080 (junio o julio de 2023). Actualizar `src/config/fuentes.ts`.
- [ ] Revisar con el Punto Focal la fidelidad del episodio al procedimiento y a las rutas (guion, apartado 21).
- [ ] Confirmar la interpretación sobre la decisión de denunciar en casos con personas adultas (`docs/discrepancias.md`, punto 3) y las obligaciones legales aplicables (punto 4).
- [ ] Aprobar o ajustar el umbral pedagógico provisional (8/10 y críticas 2, 3, 4 y 6): `src/content/episodio1/evaluacion.ts`. Después, regenerar el banco con `npm run gen:assessment-sql`.
- [ ] Validar la interpretación de las insignias (`docs/discrepancias.md`, punto 13).
- [ ] Banco de preguntas equivalentes revisado para nuevos intentos (hoy: práctica reforzada con las mismas diez).

## Canales y contactos (`src/config/canales.ts`)
- [ ] Punto Focal de Salvaguarda de ChildFund: verificar el canal y cambiar el estado a `verificado`. (Descripción ajustada por la institución el 18/10/2026: «Recibe la preocupación y la registra mediante el formulario de incidentes».)
- [ ] Gerentes y dirección directa: verificar la redacción.
- [x] `complaints@childfund.org`: confirmado por la institución el 18/10/2026; se muestra como enlace de correo.
- [x] Speak Up: `http://speakup.childfund.org` confirmado por la institución el 18/10/2026; se muestra como enlace externo.
- [ ] Teléfono de país: se consulta en el sitio de Speak Up; no copiarlo sin verificar.
- [ ] Punto focal de las organizaciones socias: redacción genérica, sin nombrar intermediarios.
- [ ] Número de emergencia local (`emergencia`): solo con estado `verificado`.
- [ ] Directorio local de servicios (`directorioLocal`): enlace o procedimiento de consulta vigente.

## Privacidad y registro (`src/config/privacidad.ts`)
- [ ] Responsable del tratamiento.
- [ ] Plazo de conservación.
- [ ] Base jurídica.
- [ ] Canal de consultas.
- [ ] Vigencia de la aprobación (opcional; vacía por defecto).
- [ ] Mientras falten los cuatro primeros campos, `npm run build` en modo `registro` se detiene.

## Marca y activos
- [ ] Manual de marca: el color verde es un acento provisional (`--acento` en `src/styles.css`). No se usa el logotipo.
- [ ] Ilustraciones: las de `src/ui/ilustraciones.tsx` son provisionales y reemplazables.

## Backend y publicación (ver `docs/despliegue.md`)
- [ ] Proyecto Supabase creado por la institución, con las migraciones aplicadas.
- [ ] Plantilla de correo con el código `{{ .Token }}`; SMTP propio configurado.
- [ ] MFA TOTP habilitado.
- [ ] Punto Focal designado con `private.asignar_punto_focal`.
- [ ] Variables del repositorio para Pages (`VITE_APP_MODE`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).
- [ ] GitHub Pages activado con «GitHub Actions» como fuente; ejecución manual del flujo «Publicar en GitHub Pages».
- [ ] Prueba piloto con personal de ChildFund y socios (guion, apartado 21), sin solicitar relatos reales.

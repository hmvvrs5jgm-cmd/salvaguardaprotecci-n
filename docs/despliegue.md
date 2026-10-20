# Guía de despliegue

Hay dos piezas que se despliegan por separado:

1. **Frontend estático** en GitHub Pages: no requiere servidor Node.
2. **Registro privado** en Supabase: Auth, PostgreSQL y funciones del servidor.

Sin el punto 2, el sitio funciona como **demostración no registrada**.

> Nada de esto se ha publicado. Los pasos que requieren cuentas o secretos debe hacerlos la persona propietaria. Comprueba cada paso con la documentación oficial vigente de GitHub y Supabase: los nombres de menús y claves cambian.

## 1. Publicar la demostración en GitHub Pages

1. En el repositorio, ve a **Settings → Pages → Build and deployment → Source** y elige **GitHub Actions**.
2. En **Actions**, ejecuta manualmente el flujo **«Publicar en GitHub Pages»** (`.github/workflows/pages.yml`). El flujo compila con `VITE_BASE_PATH=/<nombre-del-repositorio>/` y publica `dist/`.
3. Sin variables configuradas, se publica el modo `demo`.

Las rutas usan `HashRouter` (`…/#/jugar`): recargar cualquier pantalla funciona en Pages sin 404. La prueba `tests/e2e/pages.spec.ts` lo verifica con una compilación bajo la subruta.

## 2. Preparar el registro privado (Supabase)

### 2.1 Proyecto y migraciones
1. La institución crea un proyecto en Supabase en su propia cuenta. No se crearon servicios de pago.
2. Aplica las migraciones de `supabase/migrations/` **en orden**:
   - Con la CLI: `supabase link --project-ref <ref>` y después `supabase db push`.
   - O pega el contenido de cada archivo en el **SQL Editor**, en orden.
3. En la configuración de la **Data API**, deja expuesto solo el esquema `public`. El esquema `private` no debe exponerse.

### 2.2 Autenticación
- **Proveedor de correo** habilitado, con confirmación de correo activa.
- **Código de un solo uso**: la app usa `signInWithOtp` y `verifyOtp` con un código de 6 dígitos que la persona escribe en la app. Edita las plantillas de correo de inicio de sesión y confirmación para que incluyan `{{ .Token }}`. Así no hay retorno con tokens en la URL, lo que evita la colisión con `HashRouter`.
- **SMTP propio**: el servicio de correo por defecto tiene límites estrictos y no es apto para producción.
- **Site URL**: la URL pública de Pages (`https://<usuario>.github.io/<repositorio>/`).
- **MFA TOTP** habilitado. El panel del Punto Focal exige una sesión `aal2`, comprobada en el servidor por `private.exigir_punto_focal()`.
- Se admiten correos de cualquier dominio (personal de ChildFund y de organizaciones socias).

### 2.3 Variables del frontend
En **Settings → Secrets and variables → Actions → Variables** (son variables, no secretos, porque se incluyen en el sitio público):

| Variable | Valor |
|---|---|
| `VITE_APP_MODE` | `registro` |
| `VITE_SUPABASE_URL` | URL del proyecto |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave **pública** (publishable o anon) |

Nunca uses la clave secreta ni la `service_role` en el frontend: `scripts/check-release-config.ts` detiene la compilación si lo detecta. Antes de publicar en modo registro, completa el aviso de privacidad en `src/config/privacidad.ts`; si falta, la compilación también se detiene.

### 2.4 Designar al Punto Focal
Consulta `docs/guia-punto-focal.md`.

## 3. Pruebas locales

| Comando | Qué verifica |
|---|---|
| `npm test` | Unidades y componentes: motor, grafo, puntuación, mezcla, almacenamiento, contenido, pantallas y modo registro con servicio simulado. |
| `npm run test:e2e` | Playwright y axe en escritorio, móvil a 320 px y subruta de Pages. Con un Chromium preinstalado: `PW_CHROMIUM_PATH=/ruta/chrome npm run test:e2e`. |
| `npm run test:db` | Migraciones y pruebas SQL en un PostgreSQL local temporal (sin Docker). Requiere los binarios de PostgreSQL 15+ (`initdb`, `pg_ctl`, `psql`). |
| `npm run validate:content` | Grafo narrativo. |
| `npm run check:guion` | Coincidencia literal con el guion local (si está en `referencias/`). |
| `npm run gen:assessment-sql -- --check` | El banco del servidor coincide con el contenido. |

`npm run test:db` usa `supabase/tests/stub_supabase.sql`, una emulación mínima de Supabase: roles, `auth.users`, y `auth.uid()` y `auth.jwt()` leídos de `request.jwt.claims`, como en PostgREST. No sustituye una prueba en un proyecto Supabase real. Tras desplegar, repite estas comprobaciones manualmente contra la API real:

1. Un usuario anónimo no puede llamar a las funciones RPC ni leer las tablas.
2. El usuario A no ve los resultados de B.
3. Un envío con `passed`, `score` u opciones ajenas se rechaza.
4. El Punto Focal sin MFA recibe `mfa_required`.

## 4. Decisiones técnicas y límites

- **Funciones de PostgreSQL en lugar de Edge Functions.** La lógica de confianza (crear el intento, puntuar, validar, idempotencia, límite de solicitudes, autorización del Punto Focal, exportación) está en funciones `security definer` expuestas como RPC. Así se reduce la superficie, se aplican en la misma transacción que los datos y pueden probarse en PostgreSQL. No hay Edge Functions que desplegar.
- **CORS.** La API de Supabase gestiona CORS a nivel de plataforma. La autorización no depende de CORS: cada llamada exige un JWT válido y se comprueban RLS, la propiedad del intento, el rol y la MFA.
- **Caché.** Las funciones fijan `Cache-Control: no-store`. El frontend no guarda resultados en almacenamiento local. Cerrar sesión limpia `sessionStorage` y las cachés del navegador, y conserva el progreso anónimo de práctica.
- **Acceso de operadores.** Quien administra el proyecto Supabase (propietarios, `service_role`, acceso directo a la base) puede leer los datos técnicamente. «Único rol autorizado» se refiere a la aplicación, no a una exclusividad criptográfica. Hay que limitar el número de personas con acceso al proyecto y activar MFA en esas cuentas.
- **Clave de evaluación.** El repositorio y el paquete de la demostración son públicos, así que la clave está al alcance de quien la busque. En modo registro, la clave no se incluye en el paquete (lo comprueba la CI) ni se expone por la API antes del envío; aun así, la evaluación es formativa y sin supervisión, no un examen seguro.
- **Datos registrados.** Identificador, nombre y organización (autodeclarados), correo verificado, módulo (episode_id), versión, fecha, puntaje y estado. Del intento se guardan el orden y las respuestas solo para la integridad e idempotencia del envío. No se guardan relatos, decisiones de práctica ni datos de personajes.
- **Sin analítica** ni rastreadores. CSP estricta en la compilación: sin recursos remotos y con conexión solo al backend configurado.

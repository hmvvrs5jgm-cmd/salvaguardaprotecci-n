# Cambios del prompt 1.0 → 1.1

Revisión hecha contrastando el prompt con el guion «Una ayuda con condiciones» (versión de diseño 1.0).

## Huecos frente al guion que se cubrieron

- **Tipos de resultado por opción.** El guion usa cinco comportamientos distintos (avanzar, reparar y avanzar, pausa que vuelve a la decisión, reintento y complemento parcial de D3-D). El prompt 1.0 solo hablaba de «reparaciones y reintentos». Se añadió una tabla tipificada con ejemplos para que el motor y el validador del grafo los modelen explícitamente.
- **D7 es una selección múltiple**, no una elección única; se especificaron la solución, el caso «faltan y sobran» y la prueba de que no hay solicitudes de red.
- **Pantallas de resultado:** se exigen los tres textos del guion, el caso de recuperación tras error crítico y el aviso de «práctica reforzada» mientras solo existan diez ítems.
- **Herramientas e insignias:** se listan las cinco herramientas y las tres insignias, con una interpretación operativa y provisional de «con comprensión».
- **Encuadre narrativo:** E05B como «variación ficticia» que vuelve al hilo principal; en D8 la persona jugadora no entrevista a Mariela.
- **Fidelidad literal** de los diálogos, con registro de cambios editoriales y script de comparación.
- **Sin campos de texto libre** en el juego.

## Riesgos técnicos que el prompt 1.0 no anticipaba

- **HashRouter + autenticación:** el flujo implícito pone tokens en `#`, lo que choca con HashRouter. Se recomienda código OTP o PKCE.
- **Clave de evaluación en modo demostración:** la demostración sin backend necesita la clave en el paquete público. Se explicita que se acepta y documenta, y que en modo registro solo puntúa el servidor.
- **Modo decidido por configuración**, no por disponibilidad de red, para evitar fallbacks silenciosos.
- **Evaluación sin cuenta:** se aclara que su resultado nunca se convierte después en aprobación registrada; para registrar hay que autenticarse antes de iniciar el intento.
- **Único Punto Focal** garantizado con una restricción de base de datos; **MFA** comprobado por nivel de garantía de la sesión.
- **Límite de solicitudes:** Supabase no lo trae en las funciones; se pide implementarlo.
- **Docker/CLI de Supabase ausentes:** escribir igualmente las pruebas de base de datos y documentar cómo correrlas.

## Alcance y privacidad

- Se definió qué significa «administrar el registro» (consultar, filtrar, exportar, anular con motivo; nunca editar puntajes ni crear aprobaciones).
- Nombre y organización se marcan como autodeclarados.
- El modo registro en producción queda bloqueado mientras el aviso de privacidad institucional esté incompleto.
- Cerrar sesión limpia datos privados sin borrar el progreso anónimo de práctica.

## Forma de trabajo

- Herramientas de prueba concretas (Vitest, Testing Library, Playwright + axe) y objetivo WCAG 2.2 AA.
- Fases ordenadas con commits pequeños, para asegurar una versión jugable antes del backend.
- Archivos de seguimiento: `docs/discrepancias.md` y `docs/cambios-editoriales.md`.
- Flujo de publicación en Pages separado y manual.

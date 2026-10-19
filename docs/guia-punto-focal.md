# Guía del Punto Focal de Salvaguarda

El Punto Focal es el **único rol de la aplicación** que puede consultar las aprobaciones de otras personas y administrar el registro. Cada participante solo ve su propio resultado. No hay roles de consulta para coordinaciones ni socios.

## Designación (la hace el operador del servicio, nunca la propia persona)

1. La persona designada inicia sesión una vez en la app (sección **Mi cuenta**) con su correo, para que exista su cuenta verificada.
2. El operador del proyecto Supabase ejecuta en el **SQL Editor**:
   ```sql
   select private.asignar_punto_focal('correo@dominio', false, 'Designación según acta o memorando');
   ```
   - Si ya hay un Punto Focal activo, la función se detiene. Para **sustituirlo**, usa `true` como segundo argumento: el anterior se revoca en la misma transacción.
   - Una restricción de la base de datos impide que haya dos Puntos Focales activos.
3. Para **revocar** sin sustituir:
   ```sql
   select private.revocar_punto_focal('Motivo');
   ```
   Estas funciones no están expuestas a la API: ninguna persona usuaria puede autodesignarse. El selector de rol de práctica (ChildFund o socio) no da permisos.

El historial de designaciones queda en `private.focal_points`, con fechas y la cuenta que las ejecutó.

## Acceso al panel

1. Inicia sesión en **Mi cuenta** con tu correo y el código recibido.
2. Abre **Acerca de → Panel del Punto Focal** (`#/punto-focal`).
3. La primera vez, configura una aplicación de autenticación (TOTP) escaneando el código QR. En adelante, introduce el código de 6 dígitos en cada sesión.

El servidor rechaza cualquier consulta administrativa sin verificación en dos pasos (`mfa_required`), aunque se llame a la API directamente.

## Qué puedes hacer

- **Consultar** registros y **filtrar** por organización, versión, estado y fechas.
- **Exportar CSV privado.** El archivo se genera en el servidor con la misma autorización. Las celdas que empiezan por `=`, `+`, `-`, `@` o un tabulador se neutralizan para que la hoja de cálculo no las ejecute como fórmulas. Guarda el archivo en un lugar con acceso restringido y elimínalo cuando ya no sea necesario.
- **Anular** un registro, con motivo obligatorio (por ejemplo, un duplicado o un error de identidad). La anulación queda trazada: fecha, motivo y quién la hizo. **No puedes editar puntajes ni crear aprobaciones manuales.**

Cada consulta, exportación y anulación se registra en `private.admin_access_log` con metadatos mínimos: quién, qué acción, cuándo, número de filas y qué filtros se usaron (sin sus valores).

## Qué tener en cuenta

- Nombre y organización son **autodeclarados**: la app no los verifica.
- Una aprobación corresponde solo al módulo y la versión indicados (columna «Módulo»; filtro por módulo en el panel). Cada módulo tiene su propio resultado: aprobar el módulo 2 no sustituye al módulo 1. No es un certificado oficial ni habilita para investigar o gestionar casos.
- El registro de formación es independiente de cualquier sistema de denuncias. Nunca registres aquí información de casos.
- El apoyo formativo a quien no aprueba se ofrece sin publicar resultados. No hay rankings.
- Las personas que administran técnicamente el proyecto Supabase pueden acceder a los datos. Limita su número.

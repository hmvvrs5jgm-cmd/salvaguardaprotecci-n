-- La exportación CSV del Punto Focal nombra la columna del identificador de módulo como «Módulo».
-- Desde el módulo 2 el juego tiene varios módulos; la columna contiene el episode_id estable (p. ej., m2-gracias-por-escucharme).
-- Misma firma y mismos permisos que en 20261018000002_funciones.sql; solo cambia el encabezado.

create or replace function public.admin_export_csv(
  p_organization text default null, p_episode_id text default null, p_content_version text default null,
  p_status text default null, p_from date default null, p_to date default null
) returns text
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := private.exigir_punto_focal();
  v_csv text;
  n int;
begin
  perform private.sin_cache();
  select count(*),
         string_agg(
           concat_ws(',',
             private.celda_csv(f.display_name), private.celda_csv(f.email), private.celda_csv(f.organization),
             private.celda_csv(f.episode_id), private.celda_csv(f.content_version),
             private.celda_csv(to_char(f.created_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')),
             private.celda_csv(f.score::text), private.celda_csv(f.status), private.celda_csv(f.annul_reason)),
           E'\r\n' order by f.created_at desc)
    into n, v_csv
    from private.registros_filtrados(p_organization, p_episode_id, p_content_version, p_status, p_from, p_to) f;
  perform private.registrar_acceso(actor, 'export_csv', n, jsonb_build_object(
    'organization', p_organization, 'episode_id', p_episode_id, 'content_version', p_content_version,
    'status', p_status, 'from', p_from, 'to', p_to));
  return concat_ws(E'\r\n',
    '"Nombre","Correo","Organización","Módulo","Versión","Fecha","Puntaje","Estado","Motivo de anulación"',
    v_csv);
end $$;

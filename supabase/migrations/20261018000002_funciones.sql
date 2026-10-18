-- Funciones del servidor expuestas por la API (PostgREST/RPC).
-- El cliente nunca envía puntaje, aprobación, rol ni identidad: la identidad sale de auth.uid()
-- y el puntaje se calcula aquí con el banco privado.

-- ---------------------------------------------------------------------------
-- Utilidades privadas
-- ---------------------------------------------------------------------------

create function private.sin_cache() returns void
language sql set search_path = '' as $$
  select set_config('response.headers', '[{"Cache-Control": "no-store"}]', true);
$$;

create function private.usuario_actual() returns uuid
language plpgsql stable set search_path = '' as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  return uid;
end $$;

create function private.limitar(p_uid uuid, p_action text, p_max int, p_ventana interval) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from private.rate_events
      where user_id = p_uid and action = p_action and at > now() - p_ventana) >= p_max then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into private.rate_events (user_id, action) values (p_uid, p_action);
  delete from private.rate_events where at < now() - interval '2 days';
end $$;

-- Exige un Punto Focal activo con sesión de nivel aal2 (MFA verificada). Devuelve su ID.
create function private.exigir_punto_focal() returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := private.usuario_actual();
begin
  if not exists (select 1 from private.focal_points where user_id = uid and active) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if coalesce(auth.jwt() ->> 'aal', '') <> 'aal2' then
    raise exception 'mfa_required' using errcode = '42501';
  end if;
  return uid;
end $$;

create function private.registrar_acceso(p_actor uuid, p_action text, p_rows int, p_filtros jsonb) returns void
language sql security definer set search_path = '' as $$
  insert into private.admin_access_log (actor, action, row_count, filter_keys)
  values (
    p_actor, p_action, p_rows,
    (select coalesce(array_agg(k order by k), '{}') from jsonb_each_text(coalesce(p_filtros, '{}')) as e(k, v) where v is not null and v <> '')
  );
$$;

-- Neutraliza fórmulas de hoja de cálculo y escapa comillas.
create function private.celda_csv(p text) returns text
language sql immutable set search_path = '' as $$
  select '"' || replace(
    case when coalesce(p, '') ~ '^[=+\-@\t\r]' then '''' || p else coalesce(p, '') end,
    '"', '""') || '"';
$$;

-- ---------------------------------------------------------------------------
-- Participante: iniciar y enviar un intento, consultar sus resultados
-- ---------------------------------------------------------------------------

create function public.start_attempt(p_episode_id text, p_content_version text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := private.usuario_actual();
  v_orden text[];
  v_opciones jsonb;
  v_id uuid;
  v_expira timestamptz := now() + interval '7 days';
begin
  perform private.sin_cache();
  if not exists (select 1 from auth.users where id = uid and email_confirmed_at is not null) then
    raise exception 'email_not_confirmed' using errcode = '28000';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = uid and btrim(display_name) <> '' and btrim(organization) <> ''
  ) then
    raise exception 'profile_incomplete' using errcode = 'P0001';
  end if;
  if not exists (
    select 1 from private.assessment_versions
    where episode_id = p_episode_id and content_version = p_content_version and active
  ) then
    raise exception 'version_mismatch' using errcode = 'P0001';
  end if;
  -- Límite generoso, compatible con reintentos educativos.
  perform private.limitar(uid, 'start_attempt', 30, interval '1 hour');

  select array_agg(question_id order by position),
         jsonb_object_agg(question_id, (select jsonb_agg(o order by random()) from unnest(option_ids) as o))
    into v_orden, v_opciones
    from private.assessment_items
   where episode_id = p_episode_id and content_version = p_content_version;

  insert into private.attempts (user_id, episode_id, content_version, question_order, option_order, expires_at)
  values (uid, p_episode_id, p_content_version, v_orden, v_opciones, v_expira)
  returning id into v_id;

  return jsonb_build_object(
    'attempt_id', v_id,
    'question_order', to_jsonb(v_orden),
    'option_order', v_opciones,
    'expires_at', v_expira
  );
end $$;

create function public.submit_attempt(p_attempt_id uuid, p_answers jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := private.usuario_actual();
  a private.attempts%rowtype;
  v_pass int;
  v_score int := 0;
  v_total int := 0;
  v_fallidas text[] := '{}';
  v_per jsonb := '{}';
  v_passed boolean;
  v_estado text;
  v_result_id uuid;
  v_creado timestamptz := now();
  v_res jsonb;
  it record;
  v_sel text;
begin
  perform private.sin_cache();
  perform private.limitar(uid, 'submit_attempt', 120, interval '1 hour');

  select * into a from private.attempts where id = p_attempt_id for update;
  -- Un intento ajeno se trata como inexistente: no se revela su existencia.
  if not found or a.user_id <> uid then
    raise exception 'attempt_not_found' using errcode = 'P0002';
  end if;

  -- Idempotencia: un intento enviado devuelve su resultado original y no crea otro registro.
  if a.submitted_at is not null then
    return a.result || jsonb_build_object('replayed', true);
  end if;

  if a.expires_at < now() then
    raise exception 'attempt_expired' using errcode = 'P0001';
  end if;

  select pass_score into v_pass from private.assessment_versions
   where episode_id = a.episode_id and content_version = a.content_version and active;
  if not found then
    raise exception 'version_mismatch' using errcode = 'P0001';
  end if;

  -- Validación: objeto con exactamente las preguntas del intento y una opción válida de cada una.
  if p_answers is null or jsonb_typeof(p_answers) <> 'object' then
    raise exception 'invalid_answers' using errcode = '22023';
  end if;
  if (select array_agg(k order by k) from jsonb_object_keys(p_answers) as k)
     is distinct from (select array_agg(q order by q) from unnest(a.question_order) as q) then
    raise exception 'invalid_answers' using errcode = '22023';
  end if;

  for it in
    select i.question_id, i.critical, i.correct_option_id, i.option_ids
      from private.assessment_items i
     where i.episode_id = a.episode_id and i.content_version = a.content_version
     order by i.position
  loop
    if jsonb_typeof(p_answers -> it.question_id) <> 'string' then
      raise exception 'invalid_answers' using errcode = '22023';
    end if;
    v_sel := p_answers ->> it.question_id;
    if not (v_sel = any (it.option_ids)) or not (a.option_order -> it.question_id) ? v_sel then
      raise exception 'invalid_answers' using errcode = '22023';
    end if;
    v_total := v_total + 1;
    if v_sel = it.correct_option_id then
      v_score := v_score + 1;
    elsif it.critical then
      v_fallidas := v_fallidas || it.question_id;
    end if;
    v_per := v_per || jsonb_build_object(it.question_id, jsonb_build_object(
      'correct', v_sel = it.correct_option_id, 'correct_option', it.correct_option_id, 'selected', v_sel));
  end loop;

  -- Regla pedagógica provisional: puntaje mínimo Y todas las críticas correctas.
  v_passed := v_score >= v_pass and cardinality(v_fallidas) = 0;
  v_estado := case when v_passed then 'aprobado' when v_score >= v_pass then 'critico_fallido' else 'insuficiente' end;

  insert into public.episode_results (user_id, attempt_id, episode_id, content_version, score, passed, status, created_at)
  values (uid, a.id, a.episode_id, a.content_version, v_score, v_passed,
          case when v_passed then 'aprobado' else 'no_aprobado' end, v_creado)
  returning id into v_result_id;

  v_res := jsonb_build_object(
    'result_id', v_result_id,
    'score', v_score,
    'total', v_total,
    'critical_ok', cardinality(v_fallidas) = 0,
    'passed', v_passed,
    'estado', v_estado,
    'failed_critical', to_jsonb(v_fallidas),
    'per_question', v_per,
    'content_version', a.content_version,
    'created_at', v_creado,
    'replayed', false
  );

  update private.attempts set submitted_at = v_creado, answers = p_answers, result = v_res where id = a.id;
  return v_res;
end $$;

create function public.my_results()
returns table (id uuid, episode_id text, content_version text, score int, passed boolean, status text, created_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  perform private.sin_cache();
  return query
    select r.id, r.episode_id, r.content_version, r.score, r.passed, r.status, r.created_at
      from public.episode_results r
     where r.user_id = (select auth.uid())
     order by r.created_at desc;
end $$;

-- ---------------------------------------------------------------------------
-- Punto Focal: consultar, exportar y anular (con MFA comprobada en el servidor)
-- ---------------------------------------------------------------------------

create function private.registros_filtrados(
  p_organization text, p_episode_id text, p_content_version text, p_status text, p_from date, p_to date
) returns table (
  id uuid, display_name text, email text, organization text, episode_id text, content_version text,
  score int, status text, created_at timestamptz, annul_reason text
)
language sql stable security definer set search_path = '' as $$
  select r.id, p.display_name, u.email::text, p.organization, r.episode_id, r.content_version,
         r.score, r.status, r.created_at, r.annul_reason
    from public.episode_results r
    join public.profiles p on p.id = r.user_id
    join auth.users u on u.id = r.user_id
   where (p_organization is null or p.organization ilike '%' || p_organization || '%')
     and (p_episode_id is null or r.episode_id = p_episode_id)
     and (p_content_version is null or r.content_version = p_content_version)
     and (p_status is null or r.status = p_status)
     and (p_from is null or r.created_at >= p_from)
     and (p_to is null or r.created_at < p_to + 1)
   order by r.created_at desc;
$$;

create function public.admin_list_results(
  p_organization text default null, p_episode_id text default null, p_content_version text default null,
  p_status text default null, p_from date default null, p_to date default null
) returns setof jsonb
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := private.exigir_punto_focal();
  n int;
begin
  perform private.sin_cache();
  return query
    select to_jsonb(f) from private.registros_filtrados(p_organization, p_episode_id, p_content_version, p_status, p_from, p_to) f;
  get diagnostics n = row_count;
  perform private.registrar_acceso(actor, 'list', n, jsonb_build_object(
    'organization', p_organization, 'episode_id', p_episode_id, 'content_version', p_content_version,
    'status', p_status, 'from', p_from, 'to', p_to));
end $$;

create function public.admin_export_csv(
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
    '"Nombre","Correo","Organización","Episodio","Versión","Fecha","Puntaje","Estado","Motivo de anulación"',
    v_csv);
end $$;

create function public.admin_annul_result(p_result_id uuid, p_reason text) returns void
language plpgsql security definer set search_path = '' as $$
declare
  actor uuid := private.exigir_punto_focal();
begin
  perform private.sin_cache();
  if p_reason is null or char_length(btrim(p_reason)) < 5 then
    raise exception 'reason_required' using errcode = '22023';
  end if;
  update public.episode_results
     set status = 'anulado', annulled_at = now(), annul_reason = left(btrim(p_reason), 300), annulled_by = actor
   where id = p_result_id and status <> 'anulado';
  if not found then
    raise exception 'attempt_not_found' using errcode = 'P0002';
  end if;
  perform private.registrar_acceso(actor, 'annul', 1, null);
end $$;

-- ---------------------------------------------------------------------------
-- Administración del rol (solo operador del servicio; no expuesta a la API)
-- ---------------------------------------------------------------------------

-- Designa al Punto Focal por correo. Si ya hay uno activo, exige p_reemplazar = true y lo revoca en la misma transacción.
create function private.asignar_punto_focal(p_email text, p_reemplazar boolean default false, p_nota text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid;
begin
  select id into v_uid from auth.users where lower(email) = lower(btrim(p_email)) and email_confirmed_at is not null;
  if v_uid is null then
    raise exception 'La cuenta % no existe o su correo no está verificado', p_email;
  end if;
  if exists (select 1 from private.focal_points where active) then
    if not p_reemplazar then
      raise exception 'Ya existe un Punto Focal activo. Usa p_reemplazar => true para sustituirlo.';
    end if;
    update private.focal_points set active = false, revoked_at = now(), revoked_by = session_user where active;
  end if;
  insert into private.focal_points (user_id, assigned_by, note) values (v_uid, session_user, p_nota);
end $$;

create function private.revocar_punto_focal(p_nota text default null) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update private.focal_points
     set active = false, revoked_at = now(), revoked_by = session_user, note = coalesce(p_nota, note)
   where active;
end $$;

-- ---------------------------------------------------------------------------
-- Privilegios de ejecución: nada para anon; solo lo necesario para authenticated.
-- ---------------------------------------------------------------------------
revoke all on all functions in schema private from public, anon, authenticated;
revoke all on function public.start_attempt(text, text) from public, anon;
revoke all on function public.submit_attempt(uuid, jsonb) from public, anon;
revoke all on function public.my_results() from public, anon;
revoke all on function public.admin_list_results(text, text, text, text, date, date) from public, anon;
revoke all on function public.admin_export_csv(text, text, text, text, date, date) from public, anon;
revoke all on function public.admin_annul_result(uuid, text) from public, anon;

grant execute on function public.start_attempt(text, text) to authenticated;
grant execute on function public.submit_attempt(uuid, jsonb) to authenticated;
grant execute on function public.my_results() to authenticated;
grant execute on function public.admin_list_results(text, text, text, text, date, date) to authenticated;
grant execute on function public.admin_export_csv(text, text, text, text, date, date) to authenticated;
grant execute on function public.admin_annul_result(uuid, text) to authenticated;


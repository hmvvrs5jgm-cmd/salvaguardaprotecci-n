-- Pruebas del registro privado: RLS, privilegios, evaluación en servidor, Punto Focal con MFA y exportación.
-- Se ejecutan con supabase/tests/run-local.sh (PostgreSQL local + stub_supabase.sql).
-- Cada comprobación falla con una excepción que detiene psql (ON_ERROR_STOP).

\set QUIET on
set client_min_messages = warning;

create schema t;
grant usage on schema t to anon, authenticated;

create function t.como(p_uid uuid, p_aal text default 'aal1') returns void language sql as $$
  select set_config('request.jwt.claims',
    json_build_object('sub', p_uid, 'role', 'authenticated', 'aal', p_aal)::text, false);
$$;
create function t.anonimo() returns void language sql as $$
  select set_config('request.jwt.claims', json_build_object('role', 'anon')::text, false);
$$;
create function t.afirma(p_cond boolean, p_msg text) returns void language plpgsql as $$
begin
  if p_cond is distinct from true then raise exception 'FALLO: %', p_msg; end if;
end $$;
create function t.espera_error(p_sql text, p_fragmento text) returns void language plpgsql as $$
begin
  begin
    execute p_sql;
  exception when others then
    if p_fragmento is not null and position(p_fragmento in sqlerrm) = 0 then
      raise exception 'FALLO: error distinto al esperado (%). Recibido: % — SQL: %', p_fragmento, sqlerrm, p_sql;
    end if;
    return;
  end;
  raise exception 'FALLO: se esperaba el error «%» — SQL: %', p_fragmento, p_sql;
end $$;
-- Respuestas para un puntaje: errores = lista de preguntas a responder mal.
create function t.respuestas(p_errores text[]) returns jsonb language sql as $$
  select jsonb_object_agg(question_id,
    case when question_id = any (p_errores)
      then (select o from unnest(option_ids) o where o <> correct_option_id limit 1)
      else correct_option_id end)
  from private.assessment_items where content_version = '1.2';
$$;
revoke all on function t.respuestas(text[]) from public;
grant execute on all functions in schema t to anon, authenticated;
grant execute on function t.respuestas(text[]) to postgres;

-- Usuarios ficticios
insert into auth.users (id, email, email_confirmed_at) values
  ('00000000-0000-0000-0000-00000000000a', 'a@ejemplo.invalid', now()),
  ('00000000-0000-0000-0000-00000000000b', 'b@ejemplo.invalid', now()),
  ('00000000-0000-0000-0000-00000000000c', 'pf@ejemplo.invalid', now()),
  ('00000000-0000-0000-0000-00000000000d', 'sin-verificar@ejemplo.invalid', null),
  ('00000000-0000-0000-0000-00000000000e', 'e@ejemplo.invalid', now());

select t.afirma((select count(*) from public.profiles) = 5, 'el disparador crea un perfil por usuario');

-- Respuestas precalculadas (la clave solo es legible por el operador).
create table t.r (nombre text primary key, v jsonb);
insert into t.r values
  ('ok8', t.respuestas(array['P1', 'P5'])),
  ('ok7', t.respuestas(array['P1', 'P5', 'P7'])),
  ('crit9', t.respuestas(array['P3'])),
  ('todo', t.respuestas(array[]::text[]));
grant select on t.r to authenticated;
create table t.ids (nombre text primary key, id uuid);
grant select, insert, update on t.ids to authenticated;

-- =========================================================================
-- 1. Anónimo sin acceso a nada
-- =========================================================================
select t.anonimo();
set role anon;
select t.espera_error('select * from public.profiles', 'permission denied');
select t.espera_error('select * from public.episode_results', 'permission denied');
select t.espera_error($$select public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2')$$, 'permission denied');
select t.espera_error('select public.my_results()', 'permission denied');
select t.espera_error('select public.admin_list_results()', 'permission denied');
select t.espera_error('select public.admin_export_csv()', 'permission denied');
select t.espera_error('select * from private.attempts', 'permission denied');
select t.espera_error('select * from private.assessment_items', 'permission denied');
reset role;

-- =========================================================================
-- 2. Perfil: solo el propio, solo nombre y organización
-- =========================================================================
select t.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select t.espera_error($$select public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2')$$, 'profile_incomplete');
update public.profiles set display_name = '=HIPERVINCULO("x")', organization = 'Org Ficticia 1'
 where id = '00000000-0000-0000-0000-00000000000a';
select t.afirma((select count(*) from public.profiles) = 1, 'A solo ve su propio perfil');
update public.profiles set display_name = 'Intruso' where id = '00000000-0000-0000-0000-00000000000b';
select t.espera_error($$update public.profiles set id = '00000000-0000-0000-0000-00000000000b'$$, 'permission denied');
select t.espera_error($$update public.profiles set created_at = now()$$, 'permission denied');
select t.espera_error($$insert into public.profiles (id) values (gen_random_uuid())$$, 'permission denied');
select t.espera_error($$delete from public.profiles$$, 'permission denied');
reset role;
select t.afirma((select display_name from public.profiles where id = '00000000-0000-0000-0000-00000000000b') = '',
  'A no puede modificar el perfil de B');

-- Perfiles completos para B y E
update public.profiles set display_name = 'Persona B', organization = 'Org Ficticia 2' where id = '00000000-0000-0000-0000-00000000000b';
update public.profiles set display_name = 'Persona E', organization = 'Org Ficticia 2' where id = '00000000-0000-0000-0000-00000000000e';
update public.profiles set display_name = 'Persona D', organization = 'Org Ficticia 3' where id = '00000000-0000-0000-0000-00000000000d';

-- =========================================================================
-- 3. Inicio de intento: correo verificado, versión válida, sin clave expuesta
-- =========================================================================
select t.como('00000000-0000-0000-0000-00000000000d');
set role authenticated;
select t.espera_error($$select public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2')$$, 'email_not_confirmed');
reset role;

select t.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select t.espera_error($$select public.start_attempt('ep1-una-ayuda-con-condiciones', '1.0')$$, 'version_mismatch');
select t.espera_error($$select public.start_attempt('ep1-una-ayuda-con-condiciones', '1.1')$$, 'version_mismatch');
do $$
declare r jsonb;
begin
  r := public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2');
  perform t.afirma(jsonb_array_length(r -> 'question_order') = 10, 'el intento tiene 10 preguntas');
  perform t.afirma(r::text !~* 'correct', 'la respuesta de inicio no contiene la clave');
  perform t.afirma(current_setting('response.headers', true) like '%no-store%', 'respuesta sin caché');
  insert into t.ids values ('a1', (r ->> 'attempt_id')::uuid);
end $$;

-- =========================================================================
-- 4. Envíos inválidos y falsificados
-- =========================================================================
do $$
declare a1 uuid := (select id from t.ids where nombre = 'a1'); ok jsonb := (select v from t.r where nombre = 'todo');
begin
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', a1, ok - 'P4'), 'invalid_answers');
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', a1, jsonb_set(ok, '{P1}', '"P2-C"')), 'invalid_answers');
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', a1, ok || '{"P11": "P11-A"}'), 'invalid_answers');
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', a1, ok || '{"passed": true, "score": 10}'), 'invalid_answers');
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', a1, jsonb_set(ok, '{P2}', '["P2-C"]')), 'invalid_answers');
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', a1, '[]'), 'invalid_answers');
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', gen_random_uuid(), ok), 'attempt_not_found');
end $$;
reset role;

-- B no puede enviar el intento de A (sustitución de usuario)
select t.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
do $$ begin
  perform t.espera_error(format('select public.submit_attempt(%L, %L)',
    (select id from t.ids where nombre = 'a1'), (select v from t.r where nombre = 'todo')), 'attempt_not_found');
end $$;
reset role;

-- =========================================================================
-- 5. Regla de aprobación en el servidor e idempotencia
-- =========================================================================
select t.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
do $$
declare a1 uuid := (select id from t.ids where nombre = 'a1'); r jsonb; r2 jsonb; i jsonb;
begin
  r := public.submit_attempt(a1, (select v from t.r where nombre = 'ok8'));
  perform t.afirma((r ->> 'score')::int = 8 and (r ->> 'passed')::boolean and r ->> 'estado' = 'aprobado', '8/10 con críticas correctas aprueba');
  -- Repetición con otras respuestas: devuelve el resultado original, sin nuevo registro.
  r2 := public.submit_attempt(a1, (select v from t.r where nombre = 'todo'));
  perform t.afirma((r2 ->> 'replayed')::boolean and (r2 ->> 'score')::int = 8, 'el reenvío es idempotente');
  perform t.afirma((select count(*) from public.episode_results) = 1, 'un solo registro tras el reenvío');

  i := public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2');
  r := public.submit_attempt((i ->> 'attempt_id')::uuid, (select v from t.r where nombre = 'ok7'));
  perform t.afirma((r ->> 'score')::int = 7 and not (r ->> 'passed')::boolean and r ->> 'estado' = 'insuficiente', '7/10 no aprueba');

  i := public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2');
  r := public.submit_attempt((i ->> 'attempt_id')::uuid, (select v from t.r where nombre = 'crit9'));
  perform t.afirma((r ->> 'score')::int = 9 and not (r ->> 'passed')::boolean and r ->> 'estado' = 'critico_fallido'
    and r -> 'failed_critical' = '["P3"]', '9/10 con crítica fallida no aprueba');
end $$;

-- =========================================================================
-- 6. Resultados: lectura propia; sin escritura desde el cliente
-- =========================================================================
select t.afirma((select count(*) from public.episode_results) = 3, 'A ve sus tres resultados');
select t.afirma((select count(*) from public.my_results()) = 3, 'my_results devuelve los de A');
select t.espera_error($$insert into public.episode_results (user_id, attempt_id, episode_id, content_version, score, passed, status)
  values (auth.uid(), gen_random_uuid(), 'x', '1.2', 10, true, 'aprobado')$$, 'permission denied');
select t.espera_error($$update public.episode_results set score = 10, passed = true$$, 'permission denied');
select t.espera_error($$update public.episode_results set status = 'aprobado'$$, 'permission denied');
select t.espera_error($$update public.episode_results set user_id = '00000000-0000-0000-0000-00000000000b'$$, 'permission denied');
select t.espera_error($$delete from public.episode_results$$, 'permission denied');
select t.espera_error($$select annul_reason from public.episode_results$$, 'permission denied');
select t.espera_error($$select * from private.attempts$$, 'permission denied');
select t.espera_error($$select private.asignar_punto_focal('a@ejemplo.invalid')$$, 'permission denied');
select t.espera_error($$select public.admin_list_results()$$, 'forbidden');
select t.espera_error($$select public.admin_export_csv()$$, 'forbidden');
reset role;

select t.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
select t.afirma((select count(*) from public.episode_results) = 0, 'B no ve resultados de A, incluso por consulta directa');
select t.afirma((select count(*) from public.my_results()) = 0, 'my_results de B está vacío');
select t.afirma((select count(*) from public.episode_results where user_id = '00000000-0000-0000-0000-00000000000a') = 0,
  'B no puede filtrar por el ID de A');
-- Aunque B tenga MFA, no es Punto Focal.
select t.como('00000000-0000-0000-0000-00000000000b', 'aal2');
select t.espera_error($$select public.admin_list_results()$$, 'forbidden');
reset role;

-- =========================================================================
-- 7. Punto Focal: asignación solo por el operador, único activo, MFA obligatoria
-- =========================================================================
select private.asignar_punto_focal('pf@ejemplo.invalid', false, 'Designación de prueba');
select t.espera_error($$select private.asignar_punto_focal('b@ejemplo.invalid')$$, 'Ya existe un Punto Focal activo');
select t.espera_error($$insert into private.focal_points (user_id) values ('00000000-0000-0000-0000-00000000000b')$$, 'duplicate key');
select t.espera_error($$select private.asignar_punto_focal('sin-verificar@ejemplo.invalid', true)$$, 'no está verificado');

select t.como('00000000-0000-0000-0000-00000000000c', 'aal1');
set role authenticated;
select t.espera_error($$select public.admin_list_results()$$, 'mfa_required');
select t.espera_error($$select public.admin_export_csv()$$, 'mfa_required');
select t.espera_error($$select public.admin_annul_result(gen_random_uuid(), 'motivo suficiente')$$, 'mfa_required');
reset role;

select t.como('00000000-0000-0000-0000-00000000000c', 'aal2');
set role authenticated;
select t.afirma((select count(*) from public.admin_list_results()) = 3, 'el Punto Focal ve todos los registros');
select t.afirma((select count(*) from public.admin_list_results(p_organization => 'Org Ficticia 2')) = 0, 'filtro por organización');
select t.afirma((select count(*) from public.admin_list_results(p_status => 'aprobado')) = 1, 'filtro por estado');
select t.afirma((select count(*) from public.admin_list_results(p_content_version => '1.2', p_from => current_date, p_to => current_date)) = 3,
  'filtro por versión y fecha');
do $$
declare csv text := public.admin_export_csv();
begin
  perform t.afirma(csv like '"Nombre","Correo"%', 'CSV con encabezados');
  perform t.afirma(position('"''=HIPERVINCULO(""x"")"' in csv) > 0, 'CSV neutraliza fórmulas y escapa comillas');
  perform t.afirma(position('"=HIPERVINCULO' in csv) = 0, 'ninguna celda empieza por =');
  perform t.afirma(current_setting('response.headers', true) like '%no-store%', 'exportación sin caché');
end $$;
select t.espera_error(format('select public.admin_annul_result(%L, %L)',
  (select r.id from public.admin_list_results(p_status => 'aprobado') x, lateral (select (x ->> 'id')::uuid as id) r), 'no'), 'reason_required');
do $$
declare v uuid := (select (x ->> 'id')::uuid from public.admin_list_results(p_status => 'aprobado') x);
begin
  perform public.admin_annul_result(v, 'Registro duplicado de prueba');
  perform t.afirma((select count(*) from public.admin_list_results(p_status => 'anulado')) = 1, 'el registro queda anulado');
  perform t.espera_error(format('select public.admin_annul_result(%L, %L)', v, 'Otra vez'), 'attempt_not_found');
end $$;
-- El Punto Focal tampoco escribe puntajes directamente.
select t.espera_error($$update public.episode_results set score = 10$$, 'permission denied');
reset role;

select t.afirma((select count(*) from private.admin_access_log) >= 6, 'los accesos administrativos se registran');
select t.afirma(not exists (select 1 from private.admin_access_log where 'organization' = any (filter_keys) and action = 'export_csv'),
  'el registro de acceso guarda solo claves de filtros usados');
select t.afirma(exists (select 1 from private.admin_access_log where filter_keys @> array['organization']),
  'el registro de acceso anota la clave del filtro aplicado');

select t.como('00000000-0000-0000-0000-00000000000a');
set role authenticated;
select t.afirma((select count(*) from public.my_results() where status = 'anulado') = 1, 'A ve su resultado anulado');
reset role;

-- Sustitución y revocación
select private.asignar_punto_focal('b@ejemplo.invalid', true, 'Sustitución de prueba');
select t.afirma((select count(*) from private.focal_points where active) = 1, 'sigue habiendo un solo Punto Focal activo');
select t.como('00000000-0000-0000-0000-00000000000c', 'aal2');
set role authenticated;
select t.espera_error($$select public.admin_list_results()$$, 'forbidden');
reset role;
select t.como('00000000-0000-0000-0000-00000000000b', 'aal2');
set role authenticated;
select t.afirma((select count(*) from public.admin_list_results()) = 3, 'el nuevo Punto Focal accede');
reset role;
select private.revocar_punto_focal('Revocación de prueba');
select t.como('00000000-0000-0000-0000-00000000000b', 'aal2');
set role authenticated;
select t.espera_error($$select public.admin_list_results()$$, 'forbidden');
reset role;

-- =========================================================================
-- 8. Vencimiento y límite de solicitudes
-- =========================================================================
select t.como('00000000-0000-0000-0000-00000000000e');
set role authenticated;
do $$
declare i jsonb;
begin
  i := public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2');
  insert into t.ids values ('e1', (i ->> 'attempt_id')::uuid);
end $$;
reset role;
update private.attempts set expires_at = now() - interval '1 minute' where id = (select id from t.ids where nombre = 'e1');
set role authenticated;
do $$ begin
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', (select id from t.ids where nombre = 'e1'),
    (select v from t.r where nombre = 'todo')), 'attempt_expired');
  for k in 2..30 loop
    perform public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2');
  end loop;
  perform t.espera_error($q$select public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2')$q$, 'rate_limited');
end $$;
reset role;

-- Una versión desactivada deja de aceptar envíos.
select t.como('00000000-0000-0000-0000-00000000000b');
set role authenticated;
do $$ declare i jsonb; begin
  i := public.start_attempt('ep1-una-ayuda-con-condiciones', '1.2');
  insert into t.ids values ('b1', (i ->> 'attempt_id')::uuid);
end $$;
reset role;
update private.assessment_versions set active = false;
set role authenticated;
do $$ begin
  perform t.espera_error(format('select public.submit_attempt(%L, %L)', (select id from t.ids where nombre = 'b1'),
    (select v from t.r where nombre = 'todo')), 'version_mismatch');
end $$;
reset role;
update private.assessment_versions set active = true;

-- =========================================================================
-- 9. Privilegios: ninguna función pública ejecutable por anon; nada de private expuesto
-- =========================================================================
select t.afirma(not exists (
  select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and has_function_privilege('anon', p.oid, 'execute')
), 'anon no puede ejecutar funciones públicas');
select t.afirma(not has_schema_privilege('authenticated', 'private', 'usage'), 'authenticated no usa el esquema private');
select t.afirma(not has_schema_privilege('anon', 'private', 'usage'), 'anon no usa el esquema private');
select t.afirma((select bool_and(relrowsecurity) from pg_class where oid in ('public.profiles'::regclass, 'public.episode_results'::regclass)),
  'RLS activo en tablas expuestas');

\echo '  ✓ registro.test.sql: todas las comprobaciones superadas'

-- Decisiones que protegen — esquema del registro privado.
-- Principios: privilegios mínimos, RLS en tablas expuestas, toda escritura de resultados en funciones del servidor,
-- un único Punto Focal activo con MFA comprobado en el servidor.
-- Supabase concede por defecto privilegios amplios en el esquema public a anon y authenticated:
-- aquí se revocan explícitamente y se conceden solo los necesarios.

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon, authenticated;
-- Las funciones nuevas no son ejecutables por PUBLIC salvo concesión explícita.
alter default privileges in schema private revoke execute on functions from public;
alter default privileges in schema public revoke execute on functions from public;

-- ---------------------------------------------------------------------------
-- Perfiles: nombre y organización autodeclarados.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  organization text not null default '' check (char_length(organization) <= 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, organization) on public.profiles to authenticated;

create policy profiles_select_own on public.profiles
  for select to authenticated using (id = (select auth.uid()));
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create function private.tocar_perfil() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.display_name := btrim(regexp_replace(new.display_name, '[[:cntrl:]]', '', 'g'));
  new.organization := btrim(regexp_replace(new.organization, '[[:cntrl:]]', '', 'g'));
  new.updated_at := now();
  return new;
end $$;

create trigger profiles_tocar before update on public.profiles
  for each row execute function private.tocar_perfil();

create function private.crear_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function private.crear_perfil();

-- ---------------------------------------------------------------------------
-- Banco de evaluación (privado: no expuesto por la API).
-- ---------------------------------------------------------------------------
create table private.assessment_versions (
  episode_id text not null,
  content_version text not null,
  pass_score int not null check (pass_score between 0 and 100),
  active boolean not null default true,
  primary key (episode_id, content_version)
);

create table private.assessment_items (
  episode_id text not null,
  content_version text not null,
  question_id text not null,
  position int not null,
  critical boolean not null,
  correct_option_id text not null,
  option_ids text[] not null,
  primary key (episode_id, content_version, question_id),
  foreign key (episode_id, content_version) references private.assessment_versions on delete cascade,
  check (correct_option_id = any (option_ids))
);

-- ---------------------------------------------------------------------------
-- Intentos (privados). Las respuestas se guardan solo para integridad e idempotencia del envío.
-- ---------------------------------------------------------------------------
create table private.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  episode_id text not null,
  content_version text not null,
  question_order text[] not null,
  option_order jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  answers jsonb,
  result jsonb,
  foreign key (episode_id, content_version) references private.assessment_versions
);
create index attempts_user_created on private.attempts (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Resultados: tabla expuesta con RLS. Solo lectura del propio resultado; sin escritura desde el cliente.
-- ---------------------------------------------------------------------------
create table public.episode_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  attempt_id uuid not null unique references private.attempts (id) on delete cascade,
  episode_id text not null,
  content_version text not null,
  score int not null check (score >= 0),
  passed boolean not null,
  status text not null check (status in ('aprobado', 'no_aprobado', 'anulado')),
  created_at timestamptz not null default now(),
  annulled_at timestamptz,
  annul_reason text,
  annulled_by uuid
);
create index episode_results_user on public.episode_results (user_id, created_at desc);

alter table public.episode_results enable row level security;
revoke all on public.episode_results from public, anon, authenticated;
grant select (id, episode_id, content_version, score, passed, status, created_at) on public.episode_results to authenticated;
-- user_id también se concede para que la política pueda evaluarse sin exponer datos ajenos.
grant select (user_id) on public.episode_results to authenticated;

create policy results_select_own on public.episode_results
  for select to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- Punto Focal: único activo, asignado solo por el operador del servicio.
-- ---------------------------------------------------------------------------
create table private.focal_points (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  active boolean not null default true,
  assigned_at timestamptz not null default now(),
  assigned_by text not null default current_user,
  revoked_at timestamptz,
  revoked_by text,
  note text
);
create unique index focal_points_un_activo on private.focal_points ((true)) where active;

create table private.admin_access_log (
  id bigint generated always as identity primary key,
  actor uuid not null,
  action text not null,
  at timestamptz not null default now(),
  row_count int,
  filter_keys text[]
);

create table private.rate_events (
  user_id uuid not null,
  action text not null,
  at timestamptz not null default now()
);
create index rate_events_idx on private.rate_events (user_id, action, at desc);

revoke all on all tables in schema private from public, anon, authenticated;
revoke all on all sequences in schema private from public, anon, authenticated;

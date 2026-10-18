#!/usr/bin/env bash
# Ejecuta las migraciones y las pruebas de base de datos en un PostgreSQL local temporal (sin Docker).
# Requisitos: binarios de PostgreSQL 15+ (initdb, pg_ctl, psql). Uso: npm run test:db
set -euo pipefail
cd "$(dirname "$0")/../.."
RAIZ="$(pwd)"
PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
PUERTO="${PGPORT_PRUEBAS:-54329}"
DATOS="$(mktemp -d /tmp/dqp-pg-XXXXXX)"

como_pg() {
  if [ "$(id -u)" = "0" ]; then su postgres -s /bin/bash -c "$*"; else bash -c "$*"; fi
}
if [ "$(id -u)" = "0" ]; then chown postgres "$DATOS"; fi

limpiar() { como_pg "$PGBIN/pg_ctl -D $DATOS -m immediate stop" >/dev/null 2>&1 || true; rm -rf "$DATOS"; }
trap limpiar EXIT

como_pg "$PGBIN/initdb -D $DATOS -U postgres --auth=trust --encoding=UTF8 --locale=C.UTF-8" >/dev/null
como_pg "$PGBIN/pg_ctl -D $DATOS -o '-p $PUERTO -k /tmp -c listen_addresses=' -l $DATOS/log.txt start" >/dev/null
PSQL=("$PGBIN/psql" -h /tmp -p "$PUERTO" -U postgres -v ON_ERROR_STOP=1 -q -X -t -A -o /dev/null)
"${PSQL[@]}" -d postgres -c "create database dqp" >/dev/null

"${PSQL[@]}" -d dqp -f "$RAIZ/supabase/tests/stub_supabase.sql"
for m in "$RAIZ"/supabase/migrations/*.sql; do
  echo "→ migración $(basename "$m")"
  "${PSQL[@]}" -d dqp -f "$m"
done
for t in "$RAIZ"/supabase/tests/*.test.sql; do
  echo "→ pruebas $(basename "$t")"
  "${PSQL[@]}" -d dqp -f "$t"
done
echo "✓ Pruebas de base de datos superadas."

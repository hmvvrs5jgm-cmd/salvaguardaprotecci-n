// Vigencia de la aprobación de un módulo (documento de respuestas revisadas, 23/10/2026, punto 1.6):
// doce meses desde la fecha en que se obtiene. El resultado histórico se conserva; solo se marca la vigencia vencida.
// La renovación exige una nueva evaluación aprobada sobre la versión vigente.

export const VIGENCIA_MESES = 12;

export function vigenteHasta(fechaAprobacion: string | Date, meses = VIGENCIA_MESES): Date {
  const d = new Date(fechaAprobacion);
  const dia = d.getUTCDate();
  const r = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + meses, 1, d.getUTCHours(), d.getUTCMinutes()));
  // Si el mes de destino es más corto (p. ej., 29 de febrero), se usa su último día.
  const ultimo = new Date(Date.UTC(r.getUTCFullYear(), r.getUTCMonth() + 1, 0)).getUTCDate();
  r.setUTCDate(Math.min(dia, ultimo));
  return r;
}

export type EstadoVigencia = 'vigente' | 'vencida';

/** Solo las aprobaciones tienen vigencia; los demás estados devuelven null. */
export function estadoVigencia(status: string, fechaAprobacion: string | Date, ahora: Date = new Date()): EstadoVigencia | null {
  if (status !== 'aprobado') return null;
  return ahora.getTime() <= vigenteHasta(fechaAprobacion).getTime() ? 'vigente' : 'vencida';
}

export function textoEstadoRegistro(
  r: { status: string; created_at: string; annul_reason?: string | null },
  ahora: Date = new Date(),
): string {
  if (r.status === 'anulado') return r.annul_reason ? `Anulado (${r.annul_reason})` : 'Anulado';
  if (r.status !== 'aprobado') return 'No aprobado';
  const hasta = vigenteHasta(r.created_at).toLocaleDateString('es-EC', { timeZone: 'UTC' });
  return estadoVigencia(r.status, r.created_at, ahora) === 'vigente'
    ? `Aprobado · vigente hasta ${hasta}`
    : `Aprobado · vigencia vencida el ${hasta}`;
}

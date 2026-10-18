// Cliente del registro privado (modo «registro»). Toda la lógica de confianza está en el servidor:
// el navegador nunca envía puntaje, aprobación, rol ni identidad; solo IDs de opciones elegidas.
// Si la red o el servidor fallan, se informa del error: nunca se crea una aprobación local.

import type { SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/modo';

let clientePromesa: Promise<SupabaseClient> | null = null;

export function registroDisponible(): boolean {
  return config.modo === 'registro' && config.supabaseUrl !== '' && config.supabasePublishableKey !== '';
}

export async function cliente(): Promise<SupabaseClient> {
  // En modo demostración la rama se elimina en compilación y el cliente de Supabase no se incluye en el paquete.
  if (import.meta.env.VITE_APP_MODE !== 'registro' || !registroDisponible()) {
    throw new ErrorRegistro('no_configurado', 'El registro no está configurado en esta versión.');
  }
  if (!clientePromesa) {
    clientePromesa = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(config.supabaseUrl, config.supabasePublishableKey, {
        auth: {
          // Verificación por código de un solo uso: no hay retorno por URL que colisione con HashRouter.
          flowType: 'pkce',
          detectSessionInUrl: false,
          persistSession: true,
          autoRefreshToken: true,
        },
      }),
    );
  }
  return clientePromesa;
}

export class ErrorRegistro extends Error {
  constructor(
    public codigo: string,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

const MENSAJES: Record<string, string> = {
  not_authenticated: 'Necesitas iniciar sesión con un correo verificado.',
  email_not_confirmed: 'Tu correo todavía no está verificado.',
  profile_incomplete: 'Completa tu nombre y organización antes de iniciar la evaluación.',
  rate_limited: 'Has iniciado muchos intentos en poco tiempo. Espera unos minutos y vuelve a intentarlo.',
  attempt_not_found: 'No se encontró el intento.',
  attempt_expired: 'El intento venció. Inicia uno nuevo.',
  version_mismatch: 'La versión del contenido no coincide con la del servidor.',
  invalid_answers: 'Las respuestas no son válidas para este intento.',
  mfa_required: 'El acceso administrativo requiere verificación en dos pasos.',
  forbidden: 'No tienes autorización para esta acción.',
  reason_required: 'Indica el motivo de la anulación.',
};

function traducirError(e: { message?: string; code?: string } | null): ErrorRegistro {
  const msg = e?.message ?? '';
  const codigo = Object.keys(MENSAJES).find((k) => msg.includes(k)) ?? 'error_servidor';
  return new ErrorRegistro(codigo, MENSAJES[codigo] ?? 'No se pudo completar la operación. No se registró ningún resultado.');
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const sb = await cliente();
  let res;
  try {
    res = await sb.rpc(fn, args);
  } catch {
    throw new ErrorRegistro('red', 'No hay conexión con el servidor. No se registró ningún resultado.');
  }
  if (res.error) throw traducirError(res.error);
  return res.data as T;
}

export interface IntentoServidor {
  attempt_id: string;
  question_order: string[];
  option_order: Record<string, string[]>;
  expires_at: string;
}

export interface ResultadoServidor {
  result_id: string;
  score: number;
  total: number;
  critical_ok: boolean;
  passed: boolean;
  estado: 'aprobado' | 'critico_fallido' | 'insuficiente';
  failed_critical: string[];
  per_question: Record<string, { correct: boolean; correct_option: string; selected: string }>;
  content_version: string;
  created_at: string;
  replayed: boolean;
}

export const iniciarIntento = (episodeId: string, version: string) =>
  rpc<IntentoServidor>('start_attempt', { p_episode_id: episodeId, p_content_version: version });

export const enviarIntento = (attemptId: string, answers: Record<string, string>) =>
  rpc<ResultadoServidor>('submit_attempt', { p_attempt_id: attemptId, p_answers: answers });

export interface MiResultado {
  id: string;
  episode_id: string;
  content_version: string;
  score: number;
  passed: boolean;
  status: 'aprobado' | 'no_aprobado' | 'anulado';
  created_at: string;
}

export const misResultados = () => rpc<MiResultado[]>('my_results', {});

export interface Perfil {
  display_name: string;
  organization: string;
}

export async function leerPerfil(): Promise<Perfil | null> {
  const sb = await cliente();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return null;
  const { data, error } = await sb.from('profiles').select('display_name, organization').eq('id', u.user.id).maybeSingle();
  if (error) throw traducirError(error);
  return (data as Perfil | null) ?? null;
}

export async function guardarPerfil(p: Perfil): Promise<void> {
  const sb = await cliente();
  const { data: u } = await sb.auth.getUser();
  if (!u.user) throw new ErrorRegistro('not_authenticated', MENSAJES.not_authenticated!);
  const { error } = await sb
    .from('profiles')
    .update({ display_name: p.display_name.trim(), organization: p.organization.trim() })
    .eq('id', u.user.id);
  if (error) throw traducirError(error);
}

// --- Autenticación por código de un solo uso ---

export async function enviarCodigo(email: string): Promise<void> {
  const sb = await cliente();
  const { error } = await sb.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
  if (error) throw new ErrorRegistro('otp', 'No se pudo enviar el código. Revisa el correo e inténtalo de nuevo.');
}

export async function verificarCodigo(email: string, token: string): Promise<void> {
  const sb = await cliente();
  const { error } = await sb.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'email' });
  if (error) throw new ErrorRegistro('otp', 'El código no es válido o venció.');
}

export async function sesionActual(): Promise<{ email: string; aal: string } | null> {
  if (!registroDisponible()) return null;
  const sb = await cliente();
  const { data } = await sb.auth.getSession();
  if (!data.session) return null;
  const aal = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  return { email: data.session.user.email ?? '', aal: aal.data?.currentLevel ?? 'aal1' };
}

/** Cierra sesión y limpia datos privados de interfaz y caché, sin borrar el progreso anónimo de práctica. */
export async function cerrarSesion(): Promise<void> {
  if (registroDisponible()) {
    const sb = await cliente();
    await sb.auth.signOut();
  }
  try {
    sessionStorage.clear();
  } catch {
    /* sin almacenamiento */
  }
  try {
    if ('caches' in window) {
      const nombres = await caches.keys();
      await Promise.all(nombres.map((n) => caches.delete(n)));
    }
  } catch {
    /* sin caché */
  }
}

// --- MFA (Punto Focal) ---

export async function estadoMfa(): Promise<{ factorId: string | null; aal: string }> {
  const sb = await cliente();
  const { data } = await sb.auth.mfa.listFactors();
  const totp = data?.totp?.find((f) => f.status === 'verified') ?? null;
  const aal = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  return { factorId: totp?.id ?? null, aal: aal.data?.currentLevel ?? 'aal1' };
}

export async function inscribirTotp(): Promise<{ factorId: string; qr: string; secret: string }> {
  const sb = await cliente();
  const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp' });
  if (error || !data) throw new ErrorRegistro('mfa', 'No se pudo iniciar la verificación en dos pasos.');
  return { factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret };
}

export async function verificarTotp(factorId: string, code: string): Promise<void> {
  const sb = await cliente();
  const { error } = await sb.auth.mfa.challengeAndVerify({ factorId, code: code.trim() });
  if (error) throw new ErrorRegistro('mfa', 'El código de verificación no es válido.');
}

// --- Administración (solo Punto Focal con MFA; el servidor lo comprueba) ---

export interface FiltrosAdmin {
  organization?: string;
  episode_id?: string;
  content_version?: string;
  status?: string;
  from?: string;
  to?: string;
}

export interface RegistroAdmin {
  id: string;
  display_name: string;
  email: string;
  organization: string;
  episode_id: string;
  content_version: string;
  score: number;
  status: 'aprobado' | 'no_aprobado' | 'anulado';
  created_at: string;
  annul_reason: string | null;
}

const argsFiltros = (f: FiltrosAdmin) => ({
  p_organization: f.organization || null,
  p_episode_id: f.episode_id || null,
  p_content_version: f.content_version || null,
  p_status: f.status || null,
  p_from: f.from || null,
  p_to: f.to || null,
});

export const adminListar = (f: FiltrosAdmin) => rpc<RegistroAdmin[]>('admin_list_results', argsFiltros(f));
export const adminExportar = (f: FiltrosAdmin) => rpc<string>('admin_export_csv', argsFiltros(f));
export const adminAnular = (id: string, motivo: string) =>
  rpc<null>('admin_annul_result', { p_result_id: id, p_reason: motivo });

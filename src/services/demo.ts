// Evaluación en modo demostración: se puntúa en el dispositivo y NUNCA se presenta como registrada.
// La clave solo se carga en este modo; en modo registro, Vite elimina esta rama de la compilación.

import type { AnswerKey } from '../content/types';

export async function cargarClaveDemo(): Promise<AnswerKey> {
  if (import.meta.env.VITE_APP_MODE === 'registro') {
    throw new Error('La clave no está disponible en modo registro: la puntuación la calcula el servidor.');
  }
  const m = await import('../content/episodio1/clave');
  return m.claveEp1;
}

/** Registros ficticios para previsualizar el panel del Punto Focal en la demostración. */
export const registrosFicticios = [
  {
    id: 'demo-1',
    display_name: 'Persona ficticia A',
    email: 'persona.a@ejemplo.invalid',
    organization: 'Organización ficticia 1',
    episode_id: 'ep1-una-ayuda-con-condiciones',
    content_version: '1.2',
    score: 9,
    status: 'aprobado' as const,
    created_at: '2026-10-01T15:00:00Z',
    annul_reason: null,
  },
  {
    id: 'demo-2',
    display_name: 'Persona ficticia B',
    email: 'persona.b@ejemplo.invalid',
    organization: 'Organización ficticia 2',
    episode_id: 'ep1-una-ayuda-con-condiciones',
    content_version: '1.2',
    score: 9,
    status: 'no_aprobado' as const,
    created_at: '2026-10-03T10:30:00Z',
    annul_reason: null,
  },
  {
    id: 'demo-3',
    display_name: '=Persona ficticia C',
    email: 'persona.c@ejemplo.invalid',
    organization: '+Organización ficticia 1',
    episode_id: 'ep1-una-ayuda-con-condiciones',
    content_version: '1.2',
    score: 7,
    status: 'no_aprobado' as const,
    created_at: '2026-10-05T09:10:00Z',
    annul_reason: null,
  },
];

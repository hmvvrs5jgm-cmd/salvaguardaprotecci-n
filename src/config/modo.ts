// El modo se decide por configuración de compilación, nunca por disponibilidad de red (prompt, apartado 3).
// demo: práctica y evaluación locales, rotuladas como «demostración no registrada».
// registro: la evaluación registrada la crea y puntúa exclusivamente el servidor.

export type ModoApp = 'demo' | 'registro';

export interface ConfigApp {
  modo: ModoApp;
  supabaseUrl: string;
  supabasePublishableKey: string;
}

export function leerConfig(env: Record<string, string | undefined> = import.meta.env): ConfigApp {
  const modo: ModoApp = env.VITE_APP_MODE === 'registro' ? 'registro' : 'demo';
  return {
    modo,
    supabaseUrl: env.VITE_SUPABASE_URL ?? '',
    supabasePublishableKey: env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '',
  };
}

export const config = leerConfig();

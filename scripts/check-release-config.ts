// Bloquea la compilación de producción en modo «registro» mientras falten datos institucionales
// del aviso de privacidad o la configuración del backend (prompt, apartado 9).
import { camposPrivacidadPendientes } from '../src/config/privacidad';

const modo = process.env.VITE_APP_MODE === 'registro' ? 'registro' : 'demo';
if (modo === 'demo') {
  console.log('Modo demostración: no se requiere configuración institucional.');
  process.exit(0);
}
const errores: string[] = [];
const pendientes = camposPrivacidadPendientes();
if (pendientes.length) errores.push(`Aviso de privacidad incompleto: ${pendientes.join(', ')} (src/config/privacidad.ts).`);
if (!process.env.VITE_SUPABASE_URL) errores.push('Falta VITE_SUPABASE_URL.');
if (!process.env.VITE_SUPABASE_PUBLISHABLE_KEY) errores.push('Falta VITE_SUPABASE_PUBLISHABLE_KEY (clave pública del proveedor).');
if (process.env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith('sb_secret_') || /service_role/.test(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '')) {
  errores.push('La clave del frontend parece una clave secreta. Usa solo la clave pública (publishable/anon).');
}
if (errores.length && process.env.ALLOW_INCOMPLETE_REGISTRO !== '1') {
  console.error('No se puede compilar el modo registro:\n- ' + errores.join('\n- '));
  console.error('Para pruebas locales no productivas, define ALLOW_INCOMPLETE_REGISTRO=1.');
  process.exit(1);
}
console.log(errores.length ? 'Modo registro con configuración incompleta (solo pruebas locales).' : 'Configuración de registro completa.');

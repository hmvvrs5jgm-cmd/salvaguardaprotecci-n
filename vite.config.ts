import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import type { Plugin } from 'vite';

// La ruta base se configura por variable para publicar en la subruta de GitHub Pages
// (por ejemplo, VITE_BASE_PATH=/salvaguardaprotecci-n/). En local se usa «/».
const base = process.env.VITE_BASE_PATH ?? '/';

// Política de seguridad de contenido solo en la compilación (el servidor de desarrollo usa scripts en línea).
// Sin recursos remotos en tiempo de ejecución; la única conexión externa permitida es el backend configurado.
function csp(): Plugin {
  const backend = process.env.VITE_SUPABASE_URL ? new URL(process.env.VITE_SUPABASE_URL).origin : '';
  const politica = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src 'self'",
    "font-src 'self'",
    "script-src 'self'",
    `connect-src 'self'${backend ? ' ' + backend : ''}`,
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ');
  return {
    name: 'csp',
    apply: 'build',
    transformIndexHtml: (html) =>
      html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${politica}" />`),
  };
}

export default defineConfig({
  base,
  plugins: [react(), csp()],
  build: {
    sourcemap: false,
    assetsInlineLimit: 0,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
});

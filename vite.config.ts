import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// La ruta base se configura por variable para publicar en la subruta de GitHub Pages
// (por ejemplo, VITE_BASE_PATH=/salvaguardaprotecci-n/). En local se usa «/».
const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
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

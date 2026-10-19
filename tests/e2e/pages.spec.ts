import { expect, test } from '@playwright/test';

// Compilación con la subruta de GitHub Pages (proyecto «pages» en playwright.config.ts).
test('rutas y recursos funcionan bajo la subruta de Pages, incluso al recargar', async ({ page }) => {
  const fallos: string[] = [];
  page.on('response', (r) => r.status() >= 400 && fallos.push(`${r.status()} ${r.url()}`));
  await page.goto('/salvaguardaprotecci-n/');
  await expect(page.getByRole('heading', { level: 1, name: 'Decisiones que protegen' })).toBeVisible();
  await page.goto('/salvaguardaprotecci-n/#/m2');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Gracias por escucharme' })).toBeVisible();
  await page.goto('/salvaguardaprotecci-n/#/comunicar');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Cómo comunicar una preocupación real' })).toBeVisible();
  const fuente = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(fuente).toContain('Atkinson Hyperlegible');
  expect(fallos).toEqual([]);
});

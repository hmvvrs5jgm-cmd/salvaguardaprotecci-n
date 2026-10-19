import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function entrar(
  page: Page,
  rol: 'cf' | 'socio',
  modo: 'Comenzar' | 'Versión de lectura' = 'Comenzar',
  modulo: 'm1' | 'm2' = 'm1',
) {
  await page.goto(`./#/${modulo}`);
  await page.getByLabel('Confirmo que soy una persona mayor de 18 años.').check();
  await page.getByRole('button', { name: modo, exact: true }).click();
  await page
    .getByRole('button', { name: rol === 'cf' ? 'Personal técnico de ChildFund Ecuador' : 'Personal técnico de una organización socia' })
    .click();
}

/** Avanza la introducción de la escena actual hasta la decisión. */
export async function hastaDecision(page: Page) {
  for (let i = 0; i < 6; i++) {
    const cont = page.locator('.dialogo-caja').getByRole('button', { name: 'Continuar' });
    if (!(await cont.isVisible().catch(() => false))) break;
    await cont.click();
  }
}

/** Elige una opción por su texto y resuelve el paso de retroalimentación. */
export async function elegir(page: Page, texto: RegExp) {
  await page.locator('.opciones').getByRole('button', { name: texto }).click();
  const reparar = page.getByRole('button', { name: 'Reparar respuesta' });
  if (await reparar.isVisible().catch(() => false)) await reparar.click();
  const salida = page.getByRole('button', { name: /^(Continuar|Volver a intentar|Elegir otra alternativa|Ir a la reparación)$/ }).last();
  await salida.click();
}

export async function sinInfraccionesGraves(page: Page, contexto: string) {
  const r = await new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  const graves = r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(graves.map((v) => `${contexto}: ${v.id} — ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
}

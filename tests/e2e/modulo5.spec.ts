import { expect, test } from '@playwright/test';
import { elegir, entrar, hastaDecision, sinInfraccionesGraves } from './ayudas';

for (const [rol, ruta] of [['cf', 'habitual'], ['socio', 'conflicto']] as const) {
  test(`módulo 5: recorrido completo por la ruta ${ruta} (${rol})`, async ({ page }) => {
    await entrar(page, rol, 'Comenzar', 'm5');
    await expect(page.getByRole('heading', { level: 1, name: /No sé si debería decirlo/ })).toBeFocused();
    await sinInfraccionesGraves(page, 'M5_E01');
    await hastaDecision(page);
    await elegir(page, /Consigue una copia de los mensajes/); // pausa
    await elegir(page, /seguramente tiene una razón/); // reparación
    await hastaDecision(page);
    await elegir(page, /no hay riesgo y podemos esperar/); // reintento
    await elegir(page, /Comunico la preocupación, la información desconocida/);
    await hastaDecision(page);
    await elegir(page, /decidir por mayoría/); // pausa
    await elegir(page, /No nos corresponde confrontar ni negociar/);
    await hastaDecision(page);
    await sinInfraccionesGraves(page, 'M5_E04');
    if (ruta === 'habitual') {
      await page.getByRole('button', { name: /Canal habitual/ }).click();
      await hastaDecision(page);
      await page.getByText('Tarjeta de transferencia: si hubiera un conflicto').click();
      await elegir(page, /Pido primero autorización a la persona señalada/); // pausa
      await elegir(page, /Comunico por el mecanismo del Punto Focal receptor/);
    } else {
      await page.getByRole('button', { name: /Posible conflicto de interés/ }).click();
      await hastaDecision(page);
      await elegir(page, /Descarto el reporte porque no sé quién podría recibirlo/); // reintento
      await page.getByText('Vías institucionales de referencia').click();
      await expect(page.getByRole('link', { name: 'complaints@childfund.org' })).toBeVisible();
      await elegir(page, /Utilizo una alternativa institucional habilitada/);
    }
    await hastaDecision(page);
    await elegir(page, /si no escribes tu nombre, nadie podrá reconocerte/); // reintento
    await elegir(page, /Existen vías que permiten comunicar sin indicar el nombre/);
    // D06
    const marcadas = ruta === 'habitual' ? [1, 2, 3] : [1, 2, 3, 4];
    await expect(page.getByRole('checkbox')).toHaveCount(ruta === 'habitual' ? 6 : 7);
    for (const n of marcadas) await page.getByLabel(new RegExp(`^Tarjeta ${n} `)).check();
    await page.getByRole('button', { name: 'Comprobar selección' }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /que no lo tome en serio/); // reintento
    await elegir(page, /La registro por el canal autorizado como una nueva preocupación/);
    await hastaDecision(page);
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /cualquier cambio de tarea después de un reporte es una represalia/); // reintento
    await elegir(page, /Comunico de forma restringida el cambio conocido/);
    await hastaDecision(page);
    await elegir(page, /Acepto si la adolescente está de acuerdo/); // pausa
    await elegir(page, /Rechazo la propuesta y evito involucrar a la adolescente/);
    await hastaDecision(page);
    await elegir(page, /deja de ser nuestra responsabilidad/); // reintento
    await elegir(page, /Coordinamos confirmación de recepción/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeFocused();
    await expect(page.getByText('Ruta segura.', { exact: true })).toBeVisible();
    await expect(page.getByText('Prevención de represalias.', { exact: true })).toBeVisible();
    await sinInfraccionesGraves(page, 'M5 cierre');
  });
}

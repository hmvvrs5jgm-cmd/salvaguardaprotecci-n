import { expect, test } from '@playwright/test';
import { elegir, entrar, hastaDecision, sinInfraccionesGraves } from './ayudas';

for (const rol of ['cf', 'socio'] as const) {
  test(`recorrido completo con errores, reparaciones y reintentos (${rol})`, async ({ page }) => {
    await entrar(page, rol);
    await expect(page.getByRole('heading', { level: 1, name: /Al terminar la jornada/ })).toBeFocused();
    await sinInfraccionesGraves(page, 'E01 intro');
    await hastaDecision(page);
    await elegir(page, /Voy a llamar a esa persona/); // pausa y vuelve
    await expect(page.getByRole('heading', { name: '¿Cómo respondes primero?' })).toBeVisible();
    await elegir(page, /Cuéntamelo aquí/); // repara y avanza
    await expect(page.getByRole('heading', { level: 1, name: /Lo que sí puedes prometer/ })).toBeFocused();
    await hastaDecision(page);
    await elegir(page, /Te prometo que no se lo diré/);
    await hastaDecision(page);
    await elegir(page, /Dime exactamente qué te pidió/); // pausa
    await elegir(page, /¿Qué te ayudaría ahora\?/); // complemento
    await hastaDecision(page);
    await elegir(page, /Esperaré a la siguiente reunión/);
    await elegir(page, /Comunicaré oportunamente/);
    await hastaDecision(page);
    const variante = rol === 'cf' ? /Reporto al Punto Focal/ : /Activo el mecanismo de mi organización/;
    await expect(page.locator('.opciones').getByRole('button', { name: variante })).toBeVisible();
    await elegir(page, /Determino primero si es nivel/);
    await elegir(page, variante);
    await expect(page.getByText('Variación ficticia', { exact: true })).toBeVisible();
    await hastaDecision(page);
    await page.getByText('Vías institucionales de referencia').click();
    await expect(page.getByText('Pendiente de verificación').first()).toBeVisible();
    await sinInfraccionesGraves(page, 'E05B panel');
    await elegir(page, /Uso una alternativa institucional/);
    await expect(page.getByText('Termina la variación ficticia. Vuelves al caso de Mariela.')).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();
    // D7
    for (const n of [1, 2, 3]) await page.getByLabel(new RegExp(`Tarjeta ${n}`)).check();
    await page.getByRole('button', { name: 'Comprobar selección' }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await page.locator('.opciones').getByRole('button', { name: /Para recibir apoyo debes presentar primero/ }).click();
    await expect(page.locator('.nota-complementaria')).toContainText('si existiera una obligación legal de denuncia');
    await page.getByRole('button', { name: 'Volver a intentar' }).click();
    await elegir(page, /Se te explicarán las opciones de apoyo/);
    await hastaDecision(page);
    await elegir(page, /Excluimos a Mariela/);
    await elegir(page, /Compartimos criterios de acceso/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cierre del episodio' })).toBeFocused();
    await expect(page.getByText('Escucha respetuosa.')).toBeVisible();
    await expect(page.getByText('Reporte responsable.')).toBeVisible();
    await expect(page.getByText('Respuesta centrada en la persona.')).toBeVisible();
    await sinInfraccionesGraves(page, 'cierre');
    await page.getByRole('link', { name: 'Ir a evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Evaluación final' })).toBeVisible();
  });
}

test('la versión de lectura ofrece las mismas decisiones y funciona con teclado', async ({ page }) => {
  await entrar(page, 'cf', 'Versión de lectura');
  await expect(page.locator('svg.fondo')).toHaveCount(0);
  await expect(page.getByRole('radio')).toHaveCount(4);
  await page.getByLabel(/Gracias por contármelo/).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByText(/Ofreces privacidad y elección/)).toBeVisible();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1, name: /Lo que sí puedes prometer/ })).toBeFocused();
  await sinInfraccionesGraves(page, 'lectura');
});

test('pausa, recarga y recuperación del progreso; borrar progreso', async ({ page }) => {
  await entrar(page, 'socio');
  await hastaDecision(page);
  await elegir(page, /Gracias por contármelo/);
  await expect(page.getByRole('heading', { level: 1, name: /Lo que sí puedes prometer/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: /Lo que sí puedes prometer/ })).toBeVisible();
  await page.getByRole('button', { name: 'Pausa' }).click();
  await sinInfraccionesGraves(page, 'pausa');
  await page.getByRole('button', { name: 'Borrar progreso' }).click();
  await page.getByRole('button', { name: 'Sí, borrar progreso' }).click();
  await expect(page.getByRole('button', { name: 'Comenzar' })).toBeVisible();
});

test('D7 no realiza solicitudes de red', async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem('sembrado')) return;
    sessionStorage.setItem('sembrado', '1');
    localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
    localStorage.setItem(
      'dqp:progreso',
      JSON.stringify({ episodeId: 'ep1-una-ayuda-con-condiciones', contentVersion: '1.2', role: 'cf', node: 'E06', resolved: [], toolsViewed: [], badges: [] }),
    );
  });
  await page.goto('./#/jugar');
  await expect(page.getByText('SIMULACIÓN. Este ejercicio no envía reportes')).toBeVisible();
  const solicitudes: string[] = [];
  // Solo se permiten imágenes y fuentes locales del propio juego; nunca envíos de datos ni conexiones externas.
  page.on('request', (r) => {
    const recursoLocal = r.method() === 'GET' && ['image', 'font'].includes(r.resourceType()) && new URL(r.url()).origin === new URL(page.url()).origin;
    if (!recursoLocal) solicitudes.push(`${r.method()} ${r.resourceType()} ${r.url()}`);
  });
  await page.getByLabel(/Tarjeta 4/).check();
  await page.getByRole('button', { name: 'Comprobar selección' }).click();
  await page.getByLabel(/Tarjeta 4/).uncheck();
  for (const n of [1, 2, 3]) await page.getByLabel(new RegExp(`Tarjeta ${n}`)).check();
  await page.getByRole('button', { name: 'Comprobar selección' }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  expect(solicitudes).toEqual([]);
});

test('herramientas desde cualquier escena: cierran con Escape y devuelven el foco', async ({ page }) => {
  await entrar(page, 'cf');
  await hastaDecision(page);
  const boton = page.getByRole('button', { name: 'Herramientas' });
  await boton.click();
  await page.getByRole('button', { name: 'Opciones de apoyo' }).click();
  await expect(page.getByText(/deben iniciarse dentro de las 72 horas/)).toBeVisible();
  await sinInfraccionesGraves(page, 'herramientas');
  await page.keyboard.press('Escape');
  await expect(boton).toBeFocused();
  await expect(page.getByRole('heading', { name: '¿Cómo respondes primero?' })).toBeVisible();
});

test('movimiento reducido desactiva transiciones', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await entrar(page, 'cf');
  const t = await page.locator('.retrato').first().evaluate((el) => getComputedStyle(el).transitionDuration);
  expect(t).toBe('0s');
});

test('sin desplazamiento horizontal y pantallas accesibles', async ({ page }) => {
  for (const ruta of ['./', './#/comunicar', './#/accesibilidad', './#/acerca', './#/evaluacion', './#/cuenta', './#/punto-focal']) {
    await page.goto(ruta);
    await expect(page.locator('h1')).toBeVisible();
    const ancho = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(ancho, ruta).toBeLessThanOrEqual(0);
    await sinInfraccionesGraves(page, ruta);
  }
});

test('evaluación demo: oculta soluciones, rotula «no registrado» y no hace solicitudes a servidores', async ({ page }) => {
  const externas: string[] = [];
  page.on('request', (r) => {
    if (!r.url().startsWith('http://localhost:4173')) externas.push(r.url());
  });
  await page.goto('./#/evaluacion');
  await page.getByRole('button', { name: 'Iniciar evaluación' }).click();
  for (let i = 0; i < 10; i++) {
    await expect(page.locator('.retro__caja')).toHaveCount(0);
    await page.getByRole('radio').first().check();
    await page.getByRole('button', { name: i < 9 ? 'Siguiente' : 'Revisar respuestas' }).click();
  }
  await page.getByRole('button', { name: 'Enviar evaluación' }).click();
  await expect(page.getByRole('heading', { name: 'Resultado de demostración (no registrado)' })).toBeVisible();
  await sinInfraccionesGraves(page, 'resultado');
  expect(externas).toEqual([]);
});

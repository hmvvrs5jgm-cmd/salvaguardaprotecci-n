import { expect, test } from '@playwright/test';
import { elegir, entrar, hastaDecision, sinInfraccionesGraves } from './ayudas';

for (const rol of ['cf', 'socio'] as const) {
  test(`módulo 2: recorrido completo con pausas, reparaciones y la ficha de verificación (${rol})`, async ({ page }) => {
    await entrar(page, rol, 'Comenzar', 'm2');
    await expect(page.getByRole('heading', { level: 1, name: /¿Podemos hablar\?/ })).toBeFocused();
    await sinInfraccionesGraves(page, 'M2_E01 intro');
    await hastaDecision(page);
    await elegir(page, /Salgamos solos en mi vehículo/); // pausa preventiva
    await elegir(page, /Si es importante, dilo aquí/); // reparación
    await expect(page.getByRole('heading', { level: 1, name: /No quiero que me culpen/ })).toBeFocused();
    await hastaDecision(page);
    await elegir(page, /Necesito que me cuentes todo/); // pausa
    await elegir(page, /¿Qué hiciste para que se enojara\?/); // reparación explícita
    await hastaDecision(page);
    await elegir(page, /Si no autorizas el reporte/); // reparación con la explicación B
    await hastaDecision(page);
    await elegir(page, /¿Por qué no lo contaste antes\?/); // reintento
    await elegir(page, /¿Te sientes segura ahora\?/);
    // Subescena urgente: sin cuenta regresiva y con el panel de peligro inmediato.
    await expect(page.getByRole('heading', { level: 1, name: /Una acción dentro de tu rol/ })).toBeVisible();
    await page.getByText('Si hubiera peligro inmediato').click();
    await expect(page.locator('.panel-contextual')).toContainText('911');
    await sinInfraccionesGraves(page, 'M2_URGENTE');
    await elegir(page, /La llevo a mi casa/); // pausa
    await elegir(page, /Activo inmediatamente el mecanismo/);
    await expect(page.getByRole('heading', { level: 1, name: /¿Hay alguien con quien te sientas segura\?/ })).toBeVisible();
    if (rol === 'socio') await expect(page.getByText(/Se activa el punto focal de tu organización/)).toBeVisible();
    await hastaDecision(page);
    await elegir(page, /Llamo a su tía y le cuento todo/); // pausa
    await elegir(page, /No tendremos en cuenta a nadie de la familia/); // reparación
    await expect(page.getByText(/el personal técnico no decide custodia ni traslado/)).toBeVisible();
    await hastaDecision(page); // transición
    // E06: tarjetas
    await expect(page.getByText(/SIMULACIÓN\. Esta ficha no envía un reporte/)).toBeVisible();
    for (const n of [1, 2, 3, 4]) await page.getByLabel(new RegExp(`Tarjeta ${n}`)).check();
    await page.getByRole('button', { name: 'Comprobar selección' }).click();
    await expect(page.getByText('Limita lo compartido a hechos, necesidades y acciones pertinentes.')).toBeVisible();
    await page.getByLabel(/Tarjeta 4/).uncheck();
    await page.getByRole('button', { name: 'Comprobar selección' }).click();
    await expect(page.getByRole('heading', { name: 'Registro simulado' })).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /firme primero/); // reintento
    await elegir(page, /Le aseguro que nadie más le preguntará nada/); // reparación
    await hastaDecision(page);
    await elegir(page, /Le digo que debe aceptar la primera opción/); // a la reparación de la derivación
    await expect(page.getByRole('heading', { level: 1, name: /Reparar la derivación/ })).toBeVisible();
    await hastaDecision(page);
    await page.getByRole('button', { name: 'Revisar condiciones de acceso' }).click();
    await hastaDecision(page);
    await page.getByLabel('Horario', { exact: true }).check();
    await page.getByRole('button', { name: 'Comprobar la ficha' }).click();
    await expect(page.getByText('Ficha incompleta', { exact: true })).toBeVisible();
    await sinInfraccionesGraves(page, 'M2_VERIFICAR');
    await page.getByRole('button', { name: /Ver la contingencia/ }).click();
    await expect(page.getByText('Contingencia', { exact: true })).toBeVisible();
    await hastaDecision(page);
    await page.getByRole('button', { name: 'Volver al ejemplo principal' }).click();
    await hastaDecision(page);
    for (const c of [
      'Servicio pertinente',
      'Recepción confirmada por canal autorizado',
      'Horario',
      'Accesibilidad y costos',
      'Traslado/acompañamiento autorizado',
      'Información mínima acordada',
    ]) {
      await page.getByLabel(c, { exact: true }).check();
    }
    await page.getByRole('button', { name: 'Comprobar la ficha' }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /Envío un mensaje con el nombre del servicio/); // pausa
    await elegir(page, /Transmito al Referente la restricción de contacto/);
    await hastaDecision(page);
    await elegir(page, /todo está resuelto y cierro el caso/); // reintento
    await elegir(page, /Comunico la barrera de la próxima cita/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeFocused();
    await expect(page.getByText('Escucha que cuida.')).toBeVisible();
    await expect(page.getByText('Seguridad y participación.')).toBeVisible();
    await expect(page.getByText('Derivación segura.')).toBeVisible();
    await sinInfraccionesGraves(page, 'M2 cierre');
    await page.getByRole('link', { name: 'Evaluación del módulo' }).click();
    await expect(page.getByText(/Módulo 2 · Gracias por escucharme/)).toBeVisible();
  });
}

test('módulo 2: la versión de lectura conserva decisiones y el progreso es independiente del módulo 1', async ({ page }) => {
  await entrar(page, 'cf', 'Versión de lectura', 'm2');
  await expect(page.getByRole('radio')).toHaveCount(4);
  await page.getByLabel(/Puedo escucharte/).check();
  await page.getByRole('button', { name: 'Confirmar respuesta' }).click();
  await expect(page.getByText(/Ofreces una alternativa sin obligarla a repetir/)).toBeVisible();
  await sinInfraccionesGraves(page, 'M2 lectura');
  await page.goto('./#/m1');
  await expect(page.getByRole('button', { name: 'Comenzar' })).toBeVisible();
  await page.goto('./#/');
  await expect(page.getByText('Práctica en curso en este dispositivo.')).toHaveCount(1);
});

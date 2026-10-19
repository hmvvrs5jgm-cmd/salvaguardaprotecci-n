import { expect, test } from '@playwright/test';
import { elegir, entrar, hastaDecision, sinInfraccionesGraves } from './ayudas';

for (const [rol, desenlace] of [['cf', 'no republicar'], ['socio', 'contenido alternativo']] as const) {
  test(`módulo 6: recorrido completo con desenlace «${desenlace}» (${rol})`, async ({ page }) => {
    await entrar(page, rol, 'Comenzar', 'm6');
    await expect(page.getByRole('heading', { level: 1, name: /Me reconocieron/ })).toBeFocused();
    await hastaDecision(page);
    await expect(page.getByText('Dato oculto: rostro identificable')).toBeVisible();
    await sinInfraccionesGraves(page, 'M6_E01');
    await elegir(page, /Pregunto al grupo de participantes/); // pausa
    await elegir(page, /no puede hacer daño/); // reintento
    await elegir(page, /Trato la comunicación como una preocupación/);
    await hastaDecision(page);
    await elegir(page, /Pedimos otra firma/); // reintento
    await elegir(page, /Revisamos alcance, propósito y comprensión del permiso/);
    // D03
    for (const n of [1, 2, 3, 4, 5, 6]) await page.getByLabel(new RegExp(`^Tarjeta ${n} `)).check();
    await page.getByRole('button', { name: 'Comprobar selección' }).click();
    await expect(page.getByText(/no es, por sí solo, el factor relevante/)).toBeVisible();
    await page.getByLabel(/^Tarjeta 6 /).uncheck();
    await page.getByRole('button', { name: 'Comprobar selección' }).click();
    await sinInfraccionesGraves(page, 'M6_D03');
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /Espero a una reunión de comunicación/); // reintento
    await elegir(page, /Solicitar por los responsables restringir o retirar/);
    await hastaDecision(page); // estado tras la contención
    await hastaDecision(page);
    await elegir(page, /graba un video diciendo/); // pausa
    await elegir(page, /Puedes seguir participando sin aceptar grabaciones/);
    await hastaDecision(page);
    await expect(page.getByRole('table', { name: 'Estado de la exposición (simulación)' })).toBeVisible();
    await elegir(page, /Pido a Alma y sus amigas buscar/); // pausa
    await elegir(page, /Informo las referencias conocidas por el canal restringido/);
    await hastaDecision(page);
    await elegir(page, /No se explica nada a nadie/); // reparación
    await hastaDecision(page);
    await elegir(page, /difuminar garantiza/); // reintento
    if (desenlace === 'no republicar') {
      await elegir(page, /No reutilizamos esa historia ni imagen/);
      await expect(page.getByText('Desenlace: no republicar', { exact: true })).toBeVisible();
    } else {
      await elegir(page, /Preparamos una alternativa sin vínculo con el caso/);
      await expect(page.getByText('Desenlace: contenido alternativo', { exact: true })).toBeVisible();
    }
    await hastaDecision(page);
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /Elimino todo, incluido el permiso original/); // pausa
    await elegir(page, /Comunico a los responsables los usos conocidos/);
    await hastaDecision(page);
    await elegir(page, /retirar la imagen demuestra que no queda riesgo/); // reintento
    await elegir(page, /Registro solo las acciones asignadas y confirmadas/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeFocused();
    await expect(
      page.getByText(desenlace === 'no republicar' ? /no se vuelve a publicar/ : /pieza general independiente/),
    ).toBeVisible();
    await expect(page.getByText('Comunicar sin exponer.', { exact: true })).toBeVisible();
    await sinInfraccionesGraves(page, 'M6 cierre');
  });
}

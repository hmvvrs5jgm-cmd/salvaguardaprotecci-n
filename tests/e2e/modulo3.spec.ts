import { expect, test, type Page } from '@playwright/test';
import { elegir, entrar, hastaDecision, sinInfraccionesGraves } from './ayudas';

async function hastaE08(page: Page) {
  await hastaDecision(page);
  await elegir(page, /revisemos los riesgos al final/); // reintento
  await elegir(page, /Pedimos a las familias que asuman/); // pausa
  await elegir(page, /Revisamos riesgos del lugar/);
  await hastaDecision(page);
  await page.getByText('¿Y si el relevo no llega?').click();
  await expect(page.getByText(/No abrimos una actividad que no podamos supervisar/)).toBeVisible();
  await elegir(page, /Dividimos las salas/); // pausa
  await elegir(page, /Reorganizamos en un espacio común/);
  await hastaDecision(page);
  await elegir(page, /Por hoy participas mirando/); // reparación
  await hastaDecision(page);
  await page.getByRole('button', { name: 'Continuar con la preparación' }).click();
  await hastaDecision(page);
  await elegir(page, /Acepto; si alguien lo conoce/); // pausa
  await elegir(page, /Comunico el cambio y suspendemos/);
  await hastaDecision(page);
  await elegir(page, /Una adolescente puede acompañarlo/); // pausa
  await elegir(page, /No facilito contacto ni fotografías/);
  await hastaDecision(page); // salida de E05
  await hastaDecision(page);
  await elegir(page, /Tomamos la foto y después difuminamos/); // reparación
  await hastaDecision(page);
  await elegir(page, /Mantenemos la consigna/); // reintento
  await elegir(page, /La sustituimos por situaciones ficticias/);
  await hastaDecision(page);
  await expect(page.getByRole('table', { name: 'Ficha de condiciones (simulación)' })).toBeVisible();
  await sinInfraccionesGraves(page, 'M3_E08');
  await elegir(page, /explicaré a los participantes que deben cuidarse/); // pausa
}

test('módulo 3: jornada adaptada (cf)', async ({ page }) => {
  await entrar(page, 'cf', 'Comenzar', 'm3');
  await expect(page.getByRole('heading', { level: 1, name: /La agenda no es el plan de seguridad/ })).toBeFocused();
  await sinInfraccionesGraves(page, 'M3_E01');
  await hastaE08(page);
  await elegir(page, /Iniciamos únicamente los componentes con condiciones verificadas/);
  await expect(page.getByText('Jornada adaptada', { exact: true })).toBeVisible();
  await hastaDecision(page);
  await page.getByRole('button', { name: 'Comenzar el taller interior' }).click();
  await hastaDecision(page);
  await elegir(page, /Encargo a Camila controlar al grupo/); // pausa
  await elegir(page, /Pausamos el componente afectado/);
  await hastaDecision(page);
  await elegir(page, /Lo dejo salir porque reconoce/); // pausa
  await elegir(page, /Mantengo acompañamiento seguro y solicito/);
  await expect(page.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeFocused();
  await expect(page.getByText(/Realizamos una actividad más pequeña/)).toBeVisible();
  await expect(page.getByText('Adaptación responsable.')).toBeVisible();
  await sinInfraccionesGraves(page, 'M3 cierre adaptado');
});

test('módulo 3: jornada suspendida (socio)', async ({ page }) => {
  await entrar(page, 'socio', 'Comenzar', 'm3');
  await hastaE08(page);
  await elegir(page, /suspendemos o reprogramamos la jornada completa/);
  await expect(page.getByText('Jornada suspendida', { exact: true })).toBeVisible();
  await hastaDecision(page);
  await page.getByRole('button', { name: 'Coordinar la salida' }).click();
  await hastaDecision(page);
  await expect(page.getByText(/Aunque no hay taller, el grupo continúa bajo cuidado/)).toBeVisible();
  await elegir(page, /Reducimos la supervisión porque solo estamos esperando/); // pausa
  await elegir(page, /Mantenemos condiciones seguras y coordinamos relevo/);
  await hastaDecision(page);
  await elegir(page, /Mantengo acompañamiento seguro y solicito/);
  await expect(page.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeFocused();
  await expect(page.getByText(/Hoy protegimos al grupo al no iniciar/)).toBeVisible();
  await expect(page.getByText(/Realizamos una actividad más pequeña/)).toHaveCount(0);
  await expect(page.getByText('Adaptación responsable.')).toBeVisible();
  await sinInfraccionesGraves(page, 'M3 cierre suspendido');
});

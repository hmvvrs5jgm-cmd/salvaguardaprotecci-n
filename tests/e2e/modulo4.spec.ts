import { expect, test } from '@playwright/test';
import { elegir, entrar, hastaDecision, sinInfraccionesGraves } from './ayudas';

for (const rol of ['cf', 'socio'] as const) {
  test(`módulo 4: recorrido completo con solicitudes, exposición y contención (${rol})`, async ({ page }) => {
    await entrar(page, rol, 'Comenzar', 'm4');
    await expect(page.getByRole('heading', { level: 1, name: /Mándame el expediente completo/ })).toBeFocused();
    await sinInfraccionesGraves(page, 'M4_E01');
    await hastaDecision(page);
    await elegir(page, /Lo envío, porque Elena trabaja/); // pausa
    await elegir(page, /No compartimos información de salvaguarda con nadie/); // reparación
    await hastaDecision(page);
    await elegir(page, /Le doy acceso de lectura/); // reintento
    await elegir(page, /Solicito que se precise la intervención necesaria/);
    await hastaDecision(page);
    await elegir(page, /Sustituyo el nombre por iniciales/); // reintento
    await elegir(page, /Elimino o generalizo detalles innecesarios/);
    // D04: tres solicitudes
    await page.getByLabel(/Entregar la historia de violencia/).check();
    await page.getByLabel(/Remitir por el responsable el resumen pertinente/).check();
    await page.getByLabel(/Remitir la solicitud al canal responsable/).check();
    await page.getByRole('button', { name: 'Comprobar las acciones' }).click();
    await expect(page.getByText('Hay solicitudes por revisar')).toBeVisible();
    await sinInfraccionesGraves(page, 'M4_D04');
    await page.getByLabel(/Coordinar con el responsable los datos operativos mínimos/).check();
    await page.getByRole('button', { name: 'Comprobar las acciones' }).click();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /Comparto un enlace configurado como accesible/); // pausa
    await elegir(page, /Utilizo el mecanismo aprobado/);
    await hastaDecision(page);
    await expect(page.getByText('Dato oculto: edad')).toBeVisible();
    await sinInfraccionesGraves(page, 'M4_E06 chat');
    await elegir(page, /Hago una captura completa/); // pausa
    await elegir(page, /No reenvío, no amplío la exposición/);
    await hastaDecision(page);
    await elegir(page, /Elimino mensajes, archivos e historial/); // pausa
    await elegir(page, /Identifico por la vía restringida el recurso/);
    await hastaDecision(page);
    await expect(page.getByRole('table', { name: 'Estado de la exposición (simulación)' })).toBeVisible();
    await page.getByRole('button', { name: 'Continuar' }).click();
    await hastaDecision(page);
    await elegir(page, /Decidir que no se le informará/); // reintento
    await elegir(page, /Comunicar el riesgo al Punto Focal para que coordine/);
    await expect(page.getByText('Variación hipotética', { exact: true })).toBeVisible();
    await hastaDecision(page);
    await elegir(page, /Pido a una colega que diga que ella lo envió/); // pausa
    await elegir(page, /Comunico inmediatamente el error/);
    await hastaDecision(page); // regreso de la variación
    await hastaDecision(page);
    await elegir(page, /Conservar copias personales/); // pausa
    await elegir(page, /Remitir a los responsables para aplicar conservación/);
    await expect(page.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeFocused();
    await expect(page.getByText('Necesidad de conocimiento.')).toBeVisible();
    await expect(page.getByText('Compartir con cuidado.')).toBeVisible();
    await expect(page.getByText('Respuesta responsable.', { exact: true })).toBeVisible();
    await sinInfraccionesGraves(page, 'M4 cierre');
  });
}

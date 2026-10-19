import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Rutas } from '../App';
import { PrefsProvider } from '../state/AppState';
import { AnuncioProvider } from '../ui/comunes';

const CLAVE = 'dqp:progreso:m3-antes-de-abrir-las-puertas';

function montar(ruta: string) {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_relativeSplatPath: true }}>
      <PrefsProvider>
        <AnuncioProvider>
          <Rutas />
        </AnuncioProvider>
      </PrefsProvider>
    </MemoryRouter>,
  );
}

function sembrar(node: string, recorrido: string[] = [node]) {
  localStorage.setItem(
    CLAVE,
    JSON.stringify({ episodeId: 'm3-antes-de-abrir-las-puertas', contentVersion: '1.0', role: 'cf', node, resolved: [], recorrido, toolsViewed: [], badges: [] }),
  );
  localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
}

beforeEach(() => localStorage.clear());

describe('módulo 3', () => {
  it('aparece en el inicio y su portada aclara que suspender es válido', () => {
    montar('/');
    expect(screen.getByRole('heading', { name: 'Antes de abrir las puertas' })).toBeInTheDocument();
    montar('/m3');
    expect(screen.getAllByText(/Adaptar o suspender una actividad insegura es una decisión válida/).length).toBeGreaterThan(0);
  });

  it('la ficha de condiciones muestra cada estado con texto', () => {
    sembrar('M3_E08');
    montar('/m3/lectura');
    const ficha = screen.getByRole('table', { name: 'Ficha de condiciones (simulación)' });
    expect(within(ficha).getByText('Supervisión del circuito exterior').closest('tr')).toHaveTextContent('Pendiente de verificar');
    expect(within(ficha).getByText('Fotografía del grupo (eliminada)').closest('tr')).toHaveTextContent('No viable');
    expect(within(ficha).getByText('Visita no prevista (reprogramada)').closest('tr')).toHaveTextContent('Suspendido');
  });

  it('la consulta «¿Y si el relevo no llega?» es opcional y no cambia la escena', async () => {
    sembrar('M3_E02');
    const user = userEvent.setup();
    montar('/m3/lectura');
    await user.click(screen.getByText('¿Y si el relevo no llega?'));
    expect(screen.getByText(/No abrimos una actividad que no podamos supervisar/)).toBeVisible();
    expect(screen.getByRole('heading', { level: 1, name: /Cambió el equipo/ })).toBeInTheDocument();
  });

  it('la rama suspendida termina con el cierre de jornada suspendida', async () => {
    sembrar('M3_E10', ['M3_E01', 'M3_E08', 'M3_SUSPENSION', 'M3_E09S', 'M3_E10']);
    const user = userEvent.setup();
    montar('/m3/lectura');
    await user.click(screen.getByLabelText(/Mantengo acompañamiento seguro y solicito/));
    await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Cierre del módulo' })).toBeInTheDocument();
    expect(screen.getByText(/Hoy protegimos al grupo al no iniciar/)).toBeInTheDocument();
    expect(screen.queryByText(/Realizamos una actividad más pequeña/)).toBeNull();
  });

  it('las siete herramientas del guion están disponibles', async () => {
    sembrar('M3_E01');
    const user = userEvent.setup();
    montar('/m3/jugar');
    await user.click(screen.getByRole('button', { name: 'Herramientas' }));
    const dlg = screen.getByRole('dialog', { name: 'Herramientas de consulta' });
    for (let i = 1; i <= 7; i++) expect(within(dlg).getByRole('button', { name: new RegExp(`^${i}\\. `) })).toBeInTheDocument();
  });
});

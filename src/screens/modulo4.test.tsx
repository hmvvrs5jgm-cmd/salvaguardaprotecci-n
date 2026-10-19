import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Rutas } from '../App';
import { PrefsProvider } from '../state/AppState';
import { AnuncioProvider } from '../ui/comunes';

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
function sembrar(node: string) {
  localStorage.setItem(
    'dqp:progreso:m4-la-informacion-tambien-protege',
    JSON.stringify({ episodeId: 'm4-la-informacion-tambien-protege', contentVersion: '1.0', role: 'cf', node, resolved: [], recorrido: [node], toolsViewed: [], badges: [] }),
  );
  localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
}

beforeEach(() => localStorage.clear());

describe('módulo 4', () => {
  it('D04 explica cada solicitud mal resuelta y permite corregir', async () => {
    sembrar('M4_E04');
    const user = userEvent.setup();
    montar('/m4/lectura');
    await user.click(screen.getByLabelText(/Coordinar con el responsable los datos operativos mínimos/));
    await user.click(screen.getByLabelText(/Copiar siempre el expediente íntegro/));
    await user.click(screen.getByLabelText(/Remitir la solicitud al canal responsable/));
    await user.click(screen.getByRole('button', { name: 'Comprobar las acciones' }));
    expect(screen.getByText('Hay solicitudes por revisar')).toBeInTheDocument();
    const s2 = screen.getByRole('group', { name: /Solicitud 2/ });
    expect(within(s2).getByText(/Gobernanza y toma de decisiones no implican distribución indiscriminada/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
    await user.click(within(s2).getByLabelText(/Remitir por el responsable el resumen pertinente/));
    await user.click(screen.getByRole('button', { name: 'Comprobar las acciones' }));
    expect(screen.getByText(/mínimo no significa siempre cero datos/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('heading', { level: 1, name: /El canal también importa/ })).toBeInTheDocument();
  });

  it('el chat ficticio solo muestra tipos de dato ocultos', () => {
    sembrar('M4_E06');
    montar('/m4/lectura');
    const chat = screen.getByRole('region', { name: /Chat ficticio de coordinación/ });
    expect(within(chat).getByText('Dato oculto: edad')).toBeInTheDocument();
    expect(within(chat).getByText('Dato oculto: enlace con permisos abiertos')).toBeInTheDocument();
    expect(chat.querySelector('a')).toBeNull();
  });

  it('la contención muestra que el alcance sigue en evaluación', () => {
    sembrar('M4_CONTENCION');
    montar('/m4/lectura');
    const ficha = screen.getByRole('table', { name: 'Estado de la exposición (simulación)' });
    expect(within(ficha).getByText('Alcance: accesos y posibles copias').closest('tr')).toHaveTextContent('Riesgo en evaluación');
    expect(screen.queryByText(/Todo resuelto/)).toBeNull();
  });
});

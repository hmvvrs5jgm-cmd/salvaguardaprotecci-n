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
    'dqp:progreso:m6-una-imagen-que-no-debio-publicarse',
    JSON.stringify({ episodeId: 'm6-una-imagen-que-no-debio-publicarse', contentVersion: '1.0', role: 'cf', node, resolved: [], recorrido: [node], toolsViewed: [], badges: [] }),
  );
  localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
}

beforeEach(() => localStorage.clear());

describe('módulo 6', () => {
  it('la publicación ficticia solo muestra tipos de dato y D03 usa el rótulo «Revisar»', async () => {
    sembrar('M6_E03');
    const user = userEvent.setup();
    montar('/m6/lectura');
    const post = screen.getByRole('region', { name: /Publicación ficticia/ });
    expect(within(post).getByText('Dato oculto: rostro identificable')).toBeInTheDocument();
    expect(post.querySelector('img')).toBeNull();
    for (const n of [1, 2, 3, 4, 5]) await user.click(screen.getByLabelText(new RegExp(`^Tarjeta ${n} `)));
    await user.click(screen.getByRole('button', { name: 'Comprobar selección' }));
    expect(screen.getByText(/No basta con mirar el rostro/)).toBeInTheDocument();
    expect(screen.getAllByText(/— Revisar:/)).toHaveLength(5);
  });

  it('Alma se muestra con una silueta provisional accesible', () => {
    sembrar('M6_E05');
    montar('/m6/jugar');
    expect(screen.getByRole('img', { name: /Alma, niña participante de 12 años/ })).toBeInTheDocument();
  });
});

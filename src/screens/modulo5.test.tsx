import { render, screen } from '@testing-library/react';
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
function sembrar(node: string, recorrido: string[]) {
  localStorage.setItem(
    'dqp:progreso:m5-es-alguien-importante',
    JSON.stringify({ episodeId: 'm5-es-alguien-importante', contentVersion: '1.0', role: 'cf', node, resolved: [], recorrido, toolsViewed: [], badges: [] }),
  );
  localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
}

beforeEach(() => localStorage.clear());

describe('módulo 5', () => {
  it('E04 deja elegir la variación sin puntuarla', async () => {
    sembrar('M5_E04', ['M5_E01', 'M5_E04']);
    const user = userEvent.setup();
    montar('/m5/lectura');
    expect(screen.getByText('Elegir una variación no se puntúa: ambas son válidas.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Posible conflicto de interés/ }));
    expect(screen.getByText('Variación: posible conflicto')).toBeInTheDocument();
    expect(screen.getByText('Vías institucionales de referencia')).toBeInTheDocument();
  });

  it('D06 muestra seis tarjetas en la ruta habitual y siete en la de conflicto', () => {
    sembrar('M5_E06', ['M5_E01', 'M5_E04', 'M5_CANAL_HABITUAL', 'M5_E05', 'M5_E06']);
    const { unmount } = montar('/m5/lectura');
    expect(screen.getAllByRole('checkbox')).toHaveLength(6);
    expect(screen.queryByText(/relación relevante del receptor habitual/)).toBeNull();
    unmount();
    sembrar('M5_E06', ['M5_E01', 'M5_E04', 'M5_CONFLICTO', 'M5_E05', 'M5_E06']);
    montar('/m5/lectura');
    expect(screen.getAllByRole('checkbox')).toHaveLength(7);
    expect(screen.getByText(/relación relevante del receptor habitual/)).toBeInTheDocument();
  });

  it('Paula se muestra con su ilustración y una descripción accesible', () => {
    sembrar('M5_E01', ['M5_E01']);
    montar('/m5/jugar');
    expect(screen.getByRole('img', { name: /Paula, colaboradora adulta/ })).toBeInTheDocument();
  });
});

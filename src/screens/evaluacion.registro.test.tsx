// Modo registro con el servicio simulado: el navegador solo envía IDs de opciones,
// el resultado mostrado es el del servidor y un fallo de red nunca produce una aprobación.
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../config/modo', () => ({ config: { modo: 'registro', supabaseUrl: 'https://x.supabase.co', supabasePublishableKey: 'pk' } }));

const servicio = vi.hoisted(() => ({
  iniciarIntento: vi.fn(),
  enviarIntento: vi.fn(),
  sesionActual: vi.fn(),
  leerPerfil: vi.fn(),
}));

vi.mock('../services/registro', async (orig) => {
  const real = await orig<typeof import('../services/registro')>();
  return { ...real, ...servicio, registroDisponible: () => true };
});

vi.mock('../services/demo', () => ({
  cargarClaveDemo: () => {
    throw new Error('la clave no debe cargarse en modo registro');
  },
  registrosFicticios: [],
}));

import { Rutas } from '../App';
import { preguntas } from '../content/episodio1';
import { ErrorRegistro } from '../services/registro';
import { AppStateProvider } from '../state/AppState';

function montar() {
  return render(
    <MemoryRouter initialEntries={['/evaluacion']} future={{ v7_relativeSplatPath: true }}>
      <AppStateProvider>
        <Rutas />
      </AppStateProvider>
    </MemoryRouter>,
  );
}

const orden = {
  attempt_id: '11111111-1111-1111-1111-111111111111',
  question_order: preguntas.map((p) => p.id),
  option_order: Object.fromEntries(preguntas.map((p) => [p.id, [...p.options.map((o) => o.id)].reverse()])),
  expires_at: '2026-10-25T00:00:00Z',
};

async function responderTodo(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Iniciar evaluación' }));
  for (let i = 0; i < 10; i++) {
    await user.click(screen.getAllByRole('radio')[0]!);
    await user.click(screen.getByRole('button', { name: i < 9 ? 'Siguiente' : 'Revisar respuestas' }));
  }
  await user.click(screen.getByRole('button', { name: 'Enviar evaluación' }));
}

beforeEach(() => {
  vi.clearAllMocks();
  servicio.sesionActual.mockResolvedValue({ email: 'a@ejemplo.invalid', aal: 'aal1' });
  servicio.leerPerfil.mockResolvedValue({ display_name: 'A', organization: 'Org' });
  servicio.iniciarIntento.mockResolvedValue(orden);
});

describe('evaluación en modo registro', () => {
  it('exige iniciar sesión antes de comenzar', async () => {
    servicio.sesionActual.mockResolvedValue(null);
    montar();
    expect(await screen.findByText(/inicia sesión con un correo verificado/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Iniciar evaluación' })).toBeDisabled();
  });

  it('usa el orden del servidor y envía solo IDs de opciones', async () => {
    servicio.enviarIntento.mockResolvedValue({
      result_id: 'r', score: 10, total: 10, critical_ok: true, passed: true, estado: 'aprobado', failed_critical: [],
      per_question: Object.fromEntries(preguntas.map((p) => [p.id, { correct: true, correct_option: p.options[2]!.id, selected: p.options[2]!.id }])),
      content_version: '1.1', created_at: '2026-10-18T00:00:00Z', replayed: false,
    });
    const user = userEvent.setup();
    montar();
    await responderTodo(user);
    const [attemptId, enviadas] = servicio.enviarIntento.mock.calls[0]!;
    expect(attemptId).toBe(orden.attempt_id);
    // La primera opción mostrada es la última del contenido (orden invertido por el «servidor»).
    expect(enviadas).toEqual(Object.fromEntries(preguntas.map((p) => [p.id, p.options[p.options.length - 1]!.id])));
    expect(Object.keys(enviadas)).not.toContain('passed');
    expect(await screen.findByRole('heading', { name: 'Tu resultado' })).toBeInTheDocument();
    expect(screen.queryByText(/Demostración no registrada/)).toBeNull();
  });

  it('un fallo de red no crea una aprobación local', async () => {
    servicio.enviarIntento.mockRejectedValue(new ErrorRegistro('red', 'No hay conexión con el servidor. No se registró ningún resultado.'));
    const user = userEvent.setup();
    montar();
    await responderTodo(user);
    expect(await screen.findByRole('alert')).toHaveTextContent('No se registró ningún resultado');
    expect(screen.queryByText(/Has aprobado/)).toBeNull();
    expect(screen.queryByRole('heading', { name: /resultado/i })).toBeNull();
    expect(screen.getByRole('button', { name: 'Enviar evaluación' })).toBeEnabled();
  });
});

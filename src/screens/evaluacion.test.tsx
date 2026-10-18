import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Rutas } from '../App';
import { claveEp1 } from '../content/episodio1/clave';
import { preguntas } from '../content/episodio1';
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

async function responder(user: ReturnType<typeof userEvent.setup>, errores: string[]) {
  for (let i = 0; i < 10; i++) {
    const titulo = screen.getByRole('heading', { level: 1 }).textContent!;
    const p = preguntas.find((q) => q.title === titulo)!;
    const elegida = errores.includes(p.id) ? p.options.find((o) => o.id !== claveEp1[p.id])! : p.options.find((o) => o.id === claveEp1[p.id])!;
    // Antes de enviar no se muestra ninguna solución.
    expect(screen.queryByText(p.explanation)).toBeNull();
    await user.click(screen.getByLabelText(elegida.text));
    await user.click(screen.getByRole('button', { name: i < 9 ? 'Siguiente' : 'Revisar respuestas' }));
  }
  await user.click(screen.getByRole('button', { name: 'Enviar evaluación' }));
}

describe('evaluación en modo demostración', () => {
  it('8/10 con críticas correctas: aprobado, rotulado como no registrado', async () => {
    const user = userEvent.setup();
    montar();
    expect(screen.getByText(/Demostración no registrada/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Iniciar evaluación' }));
    await responder(user, ['P1', 'P5']);
    expect(await screen.findByRole('heading', { name: 'Resultado de demostración (no registrado)' })).toBeInTheDocument();
    expect(screen.getByText(/Has aprobado este episodio\. .*Resultado: 8\/10\. .*versión 1\.1\./)).toBeInTheDocument();
  });

  it('9/10 con una crítica fallida: criterio esencial, caso de recuperación y práctica reforzada', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('button', { name: 'Iniciar evaluación' }));
    await responder(user, ['P3']);
    expect(await screen.findByText(/Obtuviste 9\/10\. Necesitas reforzar un criterio esencial/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Criterio esencial a reforzar' })).toBeInTheDocument();
    expect(screen.getByText(/Caso de recuperación — Lo que sí puedes prometer/)).toBeInTheDocument();
    expect(screen.getByText(/práctica reforzada/)).toBeInTheDocument();
  });

  it('7/10 con críticas correctas: no aprueba', async () => {
    const user = userEvent.setup();
    montar();
    await user.click(screen.getByRole('button', { name: 'Iniciar evaluación' }));
    await responder(user, ['P1', 'P5', 'P7']);
    expect(await screen.findByText(/Hay decisiones que conviene practicar nuevamente/)).toBeInTheDocument();
  });
});

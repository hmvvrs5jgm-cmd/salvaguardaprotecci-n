import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Rutas } from '../App';
import { AppStateProvider } from '../state/AppState';
import { AnuncioProvider } from '../ui/comunes';

function montar(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_relativeSplatPath: true }}>
      <AppStateProvider>
        <AnuncioProvider>
          <Rutas />
        </AnuncioProvider>
      </AppStateProvider>
    </MemoryRouter>,
  );
}

async function empezar(user: ReturnType<typeof userEvent.setup>, rol: RegExp, boton = 'Comenzar') {
  await user.click(screen.getByLabelText('Confirmo que soy una persona mayor de 18 años.'));
  await user.click(screen.getByRole('button', { name: boton }));
  await user.click(screen.getByRole('button', { name: rol }));
}

beforeEach(() => localStorage.clear());

describe('juego en modo gráfico', () => {
  it('exige confirmar público adulto sin pedir fecha de nacimiento', () => {
    montar();
    expect(screen.getByRole('button', { name: 'Comenzar' })).toBeDisabled();
    expect(screen.queryByLabelText(/fecha|nacimiento|edad/i)).toBeNull();
  });

  it('mueve el foco al encabezado de la escena y exige reparar antes de avanzar', async () => {
    const user = userEvent.setup();
    montar();
    await empezar(user, /ChildFund Ecuador/);
    expect(screen.getByRole('heading', { level: 1, name: /Al terminar la jornada/ })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: /¿Estás segura\?/ }));
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Reparar respuesta' }));
    expect(screen.getByText(/Lo que dijiste merece atención/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('heading', { level: 1, name: /Lo que sí puedes prometer/ })).toHaveFocus();
  });

  it('la opción de confrontación se detiene y vuelve a la decisión', async () => {
    const user = userEvent.setup();
    montar();
    await empezar(user, /ChildFund Ecuador/);
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: /Voy a llamar/ }));
    expect(screen.getByRole('heading', { name: /Pausa pedagógica/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Elegir otra alternativa' }));
    expect(screen.getByRole('heading', { name: '¿Cómo respondes primero?' })).toHaveFocus();
  });

  it('las herramientas se abren desde la escena y al cerrar se vuelve al mismo punto', async () => {
    const user = userEvent.setup();
    montar();
    await empezar(user, /organización socia/);
    await user.click(screen.getByRole('button', { name: 'Herramientas' }));
    const dlg = screen.getByRole('dialog', { name: 'Herramientas de consulta' });
    await user.click(within(dlg).getByRole('button', { name: 'Roles, niveles y plazos' }));
    expect(within(dlg).getByText(/Este nivel no significa daño leve/)).toBeInTheDocument();
    expect(within(dlg).getByRole('heading', { name: 'Fuentes' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: /Al terminar la jornada/ })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('dqp:progreso')!).toolsViewed).toEqual(['roles']);
  });
});

describe('versión de lectura', () => {
  it('presenta la misma decisión con la introducción completa y las mismas opciones', async () => {
    const user = userEvent.setup();
    montar();
    await empezar(user, /ChildFund Ecuador/, 'Versión de lectura');
    expect(screen.getByText(/¿Podemos hablar\?/)).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(4);
    await user.click(screen.getByLabelText(/Gracias por contármelo/));
    await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
    expect(screen.getByText(/Ofreces privacidad y elección/)).toBeInTheDocument();
    expect(document.querySelector('svg.fondo')).toBeNull();
  });
});

describe('D7 y canales', () => {
  it('el ejercicio de tarjetas está rotulado como simulación y no realiza solicitudes de red', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    localStorage.setItem(
      'dqp:progreso',
      JSON.stringify({ episodeId: 'ep1-una-ayuda-con-condiciones', contentVersion: '1.1', role: 'cf', node: 'E06', resolved: [], toolsViewed: [], badges: [] }),
    );
    localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
    const user = userEvent.setup();
    montar('/jugar');
    expect(screen.getByText('SIMULACIÓN. Este ejercicio no envía reportes')).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Tarjeta 1/));
    await user.click(screen.getByLabelText(/Tarjeta 5/));
    await user.click(screen.getByRole('button', { name: 'Comprobar selección' }));
    expect(screen.getByText('Incluye los hechos y necesidades que ya conoces.')).toBeInTheDocument();
    expect(screen.getByText('Elimina suposiciones e información personal innecesaria.')).toBeInTheDocument();
    await user.click(screen.getByLabelText(/Tarjeta 5/));
    await user.click(screen.getByLabelText(/Tarjeta 2/));
    await user.click(screen.getByLabelText(/Tarjeta 3/));
    await user.click(screen.getByRole('button', { name: 'Comprobar selección' }));
    expect(screen.getByText(/Este es un reporte de una preocupación comunicada/)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('el panel institucional enlaza solo canales verificados y cambia según el rol', async () => {
    const user = userEvent.setup();
    montar('/comunicar');
    expect(screen.getByText(/Este juego no es un sistema de denuncias/)).toBeInTheDocument();
    const speakUp = screen.getByRole('link', { name: /Abrir el sitio de Speak Up/ });
    expect(speakUp).toHaveAttribute('href', 'http://speakup.childfund.org');
    expect(speakUp).toHaveAttribute('rel', 'noopener noreferrer');
    // Correo verificado: enlace de correo simple, sin asunto ni cuerpo que transfieran datos del juego.
    expect(screen.getByRole('link', { name: 'complaints@childfund.org' })).toHaveAttribute('href', 'mailto:complaints@childfund.org');
    expect(screen.getByText('Recibe la preocupación y la registra mediante el formulario de incidentes.')).toBeInTheDocument();
    expect(screen.getByText('Cualquier gerente de ChildFund')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Personal de una organización socia'));
    expect(screen.getByText('Punto focal de salvaguarda de tu organización')).toBeInTheDocument();
    expect(screen.queryByText('Cualquier gerente de ChildFund')).toBeNull();
  });

  it('recupera el progreso y avisa si cambió la versión de contenido', () => {
    localStorage.setItem('dqp:progreso', JSON.stringify({ episodeId: 'ep1-una-ayuda-con-condiciones', contentVersion: '1.0', node: 'E03' }));
    montar();
    expect(screen.getByRole('heading', { name: 'El contenido se actualizó' })).toBeInTheDocument();
  });
});

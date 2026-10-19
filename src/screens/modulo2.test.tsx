import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { Rutas } from '../App';
import { PrefsProvider } from '../state/AppState';
import { AnuncioProvider } from '../ui/comunes';

const CLAVE = 'dqp:progreso:m2-gracias-por-escucharme';

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

function sembrar(node: string, role = 'cf') {
  localStorage.setItem(
    CLAVE,
    JSON.stringify({ episodeId: 'm2-gracias-por-escucharme', contentVersion: '1.0', role, node, resolved: [], toolsViewed: [], badges: [] }),
  );
  localStorage.setItem('dqp:preferencias', JSON.stringify({ adultoConfirmado: true }));
}

beforeEach(() => localStorage.clear());

describe('inicio con módulos', () => {
  it('lista los dos módulos y enlaza a sus portadas', () => {
    montar('/');
    expect(screen.getByRole('heading', { name: 'Una ayuda con condiciones' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Gracias por escucharme' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Abrir el módulo.*Gracias por escucharme/ })).toHaveAttribute('href', '/m2');
  });
});

describe('módulo 2', () => {
  it('muestra la portada, el aviso y las variantes de rol del guion', async () => {
    const user = userEvent.setup();
    montar('/m2');
    expect(screen.getByText(/Escuchar abre una puerta/)).toBeInTheDocument();
    expect(screen.getByText(/Este módulo aborda violencia contra una adolescente/)).toBeInTheDocument();
    await user.click(screen.getByLabelText('Confirmo que soy una persona mayor de 18 años.'));
    await user.click(screen.getByRole('button', { name: 'Comenzar' }));
    expect(screen.getByRole('heading', { name: '¿Desde qué rol actuarás?' })).toBeInTheDocument();
    expect(screen.getByText(/La jerarquía interna no debe impedir un reporte oportuno/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /organización socia/ }));
    expect(screen.getByRole('heading', { level: 1, name: /¿Podemos hablar\?/ })).toHaveFocus();
    expect(screen.getByRole('img', { name: /Lucía, adolescente participante/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    await user.click(screen.getByRole('button', { name: /Salgamos solos en mi vehículo/ }));
    expect(screen.getByRole('heading', { name: /Pausa pedagógica/ })).toBeInTheDocument();
    expect(screen.getByText(/No improvises un traslado ni un espacio aislado/)).toBeInTheDocument();
    // El progreso del módulo 2 se guarda con su propia clave y no toca el del módulo 1.
    expect(JSON.parse(localStorage.getItem(CLAVE)!).role).toBe('socio');
    expect(localStorage.getItem('dqp:progreso')).toBeNull();
  });

  it('E08-A redirige a la reparación de la derivación', async () => {
    sembrar('M2_E08');
    const user = userEvent.setup();
    montar('/m2/lectura');
    await user.click(screen.getByLabelText(/Entrego el número y considero la derivación completada/));
    await user.click(screen.getByRole('button', { name: 'Confirmar respuesta' }));
    expect(screen.getByText('Entregar un contacto no verifica acceso.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ir a la reparación' }));
    expect(screen.getByRole('heading', { level: 1, name: /Reparar la derivación/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Revisar condiciones de acceso' }));
    expect(screen.getByRole('heading', { level: 1, name: /Verificar el acceso/ })).toBeInTheDocument();
  });

  it('la ficha de verificación exige las seis condiciones y ofrece la contingencia', async () => {
    sembrar('M2_VERIFICAR');
    const user = userEvent.setup();
    montar('/m2/lectura');
    expect(screen.getByText('SIMULACIÓN. Ficha ficticia: no se envía ni se guarda')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Servicio pertinente'));
    await user.click(screen.getByRole('button', { name: 'Comprobar la ficha' }));
    expect(screen.getByText(/una ficha incompleta no se marca como derivación recibida/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Continuar' })).toBeNull();

    await user.click(screen.getByRole('button', { name: /Ver la contingencia/ }));
    expect(screen.getByText('Contingencia')).toBeInTheDocument();
    expect(screen.getByText(/Nunca se cierra el caso por falta de cupo/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Volver al ejemplo principal' }));

    for (const c of [
      'Servicio pertinente',
      'Recepción confirmada por canal autorizado',
      'Horario',
      'Accesibilidad y costos',
      'Traslado/acompañamiento autorizado',
      'Información mínima acordada',
    ]) {
      await user.click(screen.getByLabelText(c));
    }
    await user.click(screen.getByRole('button', { name: 'Comprobar la ficha' }));
    expect(screen.getByText('Alternativa confirmada')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
    expect(screen.getByRole('heading', { level: 1, name: /No quiero mensajes en mi teléfono/ })).toBeInTheDocument();
  });

  it('las herramientas del módulo 2 incluyen las seis tarjetas del guion', async () => {
    sembrar('M2_E01');
    const user = userEvent.setup();
    montar('/m2/jugar');
    await user.click(screen.getByRole('button', { name: 'Herramientas' }));
    const dlg = screen.getByRole('dialog', { name: 'Herramientas de consulta' });
    for (let i = 1; i <= 6; i++) expect(within(dlg).getByRole('button', { name: new RegExp(`^Tarjeta ${i}\\.`) })).toBeInTheDocument();
    await user.click(within(dlg).getByRole('button', { name: 'Tarjeta 5. Derivación segura' }));
    expect(within(dlg).getByText(/Si no hay cupo, mantener la respuesta de protección y escalar la barrera/)).toBeInTheDocument();
  });

  it('la evaluación del módulo 2 usa sus propias preguntas', async () => {
    const user = userEvent.setup();
    montar('/m2/evaluacion');
    expect(screen.getByText(/Módulo 2 · Gracias por escucharme/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Iniciar evaluación' }));
    expect(screen.getByText(/Pregunta 1 de 10/)).toBeInTheDocument();
    const titulos = ['Escucha', 'Confidencialidad', 'Riesgo inmediato', 'Contacto familiar', 'Consentimiento y participación', 'Barrera en la derivación', 'Información mínima', 'Evitar repetición', 'Contacto seguro', 'Recepción y cierre'];
    expect(titulos).toContain(screen.getByRole('heading', { level: 1 }).textContent);
  });
});

import { describe, expect, it } from 'vitest';
import { episodio1 } from '../content/episodio1';
import { borrarProgreso, cargarProgreso, guardarProgreso, type Almacen } from './almacen';
import { estadoInicial } from './practica';

function memoria(): Almacen & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
}

describe('almacenamiento local', () => {
  it('recupera rol, escena, herramientas e insignias y no guarda opciones elegidas', () => {
    const m = memoria();
    guardarProgreso(episodio1, { ...estadoInicial(episodio1), role: 'socio', node: 'E04', paso: { kind: 'feedback', optionId: 'D4-A', repairShown: false }, toolsViewed: ['roles'], badges: ['escucha-respetuosa'], resolved: ['D1', 'D2', 'D3'] }, m);
    expect(m.data.get('dqp:progreso')).not.toContain('D4-A');
    const r = cargarProgreso(episodio1, m);
    expect(r.estado).toBe('recuperado');
    expect(r.progreso).toMatchObject({ role: 'socio', node: 'E04', toolsViewed: ['roles'], badges: ['escucha-respetuosa'], paso: { kind: 'intro', index: 0 } });
  });
  it('informa cuando la versión de contenido no coincide', () => {
    const m = memoria();
    m.setItem('dqp:progreso', JSON.stringify({ episodeId: episodio1.id, contentVersion: '1.0', node: 'E03' }));
    const r = cargarProgreso(episodio1, m);
    expect(r).toMatchObject({ estado: 'version_distinta', versionGuardada: '1.0' });
    expect(r.progreso.node).toBe('E01');
  });
  it('tolera datos corruptos y almacenamiento ausente', () => {
    const m = memoria();
    m.setItem('dqp:progreso', '{no es json');
    expect(cargarProgreso(episodio1, m).estado).toBe('nuevo');
    expect(cargarProgreso(episodio1, null).estado).toBe('nuevo');
    const roto: Almacen = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('x'); }, removeItem: () => { throw new Error('x'); } };
    expect(cargarProgreso(episodio1, roto).estado).toBe('nuevo');
    expect(() => guardarProgreso(episodio1, estadoInicial(episodio1), roto)).not.toThrow();
    expect(() => borrarProgreso(episodio1, roto)).not.toThrow();
  });
  it('borra el progreso', () => {
    const m = memoria();
    guardarProgreso(episodio1, estadoInicial(episodio1), m);
    borrarProgreso(episodio1, m);
    expect(m.data.size).toBe(0);
  });
});

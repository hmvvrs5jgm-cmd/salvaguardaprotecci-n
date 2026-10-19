import { describe, expect, it } from 'vitest';
import { episodio3 as ep } from '../content/episodio3';
import { escenaDe, estadoInicial, lineasDeCierre, reducir, type Accion, type EstadoPractica } from './practica';
import { validarGrafo, destinosDeEscena } from './grafo';

const run = (s: EstadoPractica, ...acts: Accion[]) => acts.reduce((acc, a) => reducir(ep, acc, a), s);
const hastaDecision = (s: EstadoPractica) => {
  let x = s;
  for (let i = 0; i < 20 && x.paso.kind === 'intro'; i++) x = reducir(ep, x, { type: 'CONTINUAR' });
  return x;
};
const elegir = (s: EstadoPractica, optionId: string) =>
  hastaDecision(run(s, { type: 'ELEGIR_OPCION', optionId }, { type: 'CONTINUAR' }));
const continuar = (s: EstadoPractica) => hastaDecision(run(s, { type: 'CONTINUAR' }));

/** Recorre el módulo hasta E08 con respuestas adecuadas. */
function hastaE08(): EstadoPractica {
  let s = hastaDecision(run(estadoInicial(ep), { type: 'ELEGIR_ROL', role: 'cf' }));
  for (const o of ['M3_D01-B', 'M3_D02-B', 'M3_D03-B']) s = elegir(s, o);
  s = continuar(s); // E03B
  for (const o of ['M3_D04-B', 'M3_D05-B']) s = elegir(s, o);
  s = continuar(s); // salida de E05
  for (const o of ['M3_D06-B', 'M3_D07-B']) s = elegir(s, o);
  expect(s.node).toBe('M3_E08');
  return s;
}

describe('módulo 3 — grafo', () => {
  it('es válido, usa IDs M3_ y sigue el mapa del guion (apartado 21)', () => {
    expect(validarGrafo(ep)).toEqual([]);
    for (const s of Object.values(ep.scenes)) expect(s.decision.id).toMatch(/^M3_/);
    expect(destinosDeEscena(ep, 'M3_E08')).toEqual(['M3_INICIO_ADAPTADO', 'M3_SUSPENSION']);
    expect(destinosDeEscena(ep, 'M3_INICIO_ADAPTADO')).toEqual(['M3_E09']);
    expect(destinosDeEscena(ep, 'M3_SUSPENSION')).toEqual(['M3_E09S']);
    expect(destinosDeEscena(ep, 'M3_E09')).toEqual(['M3_E10']);
    expect(destinosDeEscena(ep, 'M3_E09S')).toEqual(['M3_E10']);
  });
  it('la rama suspendida no menciona un taller realizado', () => {
    for (const id of ['M3_SUSPENSION', 'M3_E09S']) {
      const s = escenaDe(ep, id);
      const textos = [...s.intro.map((l) => l.text), ...(s.decision.kind === 'choice' ? s.decision.options.map((o) => o.label) : [])];
      for (const t of textos) expect(String(t)).not.toMatch(/taller (interior )?se desarrolla|durante el taller/i);
    }
  });
});

describe('módulo 3 — ramas adaptada y suspendida', () => {
  it('jornada adaptada: E08-B, inicio adaptado, E09, E10 y cierre adaptado con las tres insignias', () => {
    let s = elegir(hastaE08(), 'M3_D08-B');
    expect(s.node).toBe('M3_INICIO_ADAPTADO');
    s = continuar(s);
    expect(s.node).toBe('M3_E09');
    s = elegir(elegir(s, 'M3_D09-B'), 'M3_D10-B');
    expect(s.node).toBe('CIERRE');
    expect(lineasDeCierre(ep, s)[0]!.text).toMatch(/^Realizamos una actividad más pequeña/);
    expect(s.badges).toEqual(['m3-planificacion-protectora', 'm3-participacion-limites', 'm3-adaptacion-responsable']);
  });

  it('jornada suspendida: E08-C, suspensión, E09S, E10 y cierre suspendido, también con insignias', () => {
    let s = elegir(hastaE08(), 'M3_D08-C');
    expect(s.node).toBe('M3_SUSPENSION');
    s = continuar(s);
    expect(s.node).toBe('M3_E09S');
    expect(elegir(s, 'M3_D09S-C').node).toBe('M3_E09S'); // delegar en una adolescente se detiene
    s = elegir(elegir(s, 'M3_D09S-B'), 'M3_D10-B');
    expect(s.node).toBe('CIERRE');
    const cierre = lineasDeCierre(ep, s);
    expect(cierre[0]!.text).toMatch(/^Hoy protegimos al grupo/);
    expect(cierre.some((l) => String(l.text).startsWith('Realizamos'))).toBe(false);
    expect(s.badges).toContain('m3-adaptacion-responsable');
    expect(s.recorrido).not.toContain('M3_E09');
  });

  it('un nuevo recorrido usa el cierre de la rama más reciente', () => {
    let s = elegir(hastaE08(), 'M3_D08-C');
    s = elegir(elegir(continuar(s), 'M3_D09S-B'), 'M3_D10-B');
    s = hastaDecision(run(s, { type: 'CAMBIAR_ROL', role: 'socio' }));
    expect(s.recorrido).toEqual(['M3_E01']);
    for (const o of ['M3_D01-B', 'M3_D02-B', 'M3_D03-B']) s = elegir(s, o);
    s = continuar(s);
    for (const o of ['M3_D04-B', 'M3_D05-B']) s = elegir(s, o);
    s = continuar(s);
    for (const o of ['M3_D06-B', 'M3_D07-B']) s = elegir(s, o);
    s = elegir(continuar(elegir(s, 'M3_D08-B')), 'M3_D09-B');
    s = elegir(s, 'M3_D10-B');
    expect(lineasDeCierre(ep, s)[0]!.text).toMatch(/^Realizamos/);
  });

  it('pausas: dividir salas, el vehículo de un conocido y la salida no verificada vuelven a la decisión', () => {
    let s = hastaDecision(run(estadoInicial(ep), { type: 'ELEGIR_ROL', role: 'cf' }));
    s = elegir(s, 'M3_D01-A');
    expect(s.node).toBe('M3_E01');
    s = elegir(elegir(s, 'M3_D01-B'), 'M3_D02-A');
    expect(s.node).toBe('M3_E02');
  });
});

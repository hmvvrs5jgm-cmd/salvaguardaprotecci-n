import { describe, expect, it } from 'vitest';
import { claveM5 } from '../content/episodio5/clave';
import { configEvaluacion, episodio5 as ep, preguntas } from '../content/episodio5';
import { escenaDe, estadoInicial, reducir, tarjetasVisibles, type Accion, type EstadoPractica } from './practica';
import { destinosDeEscena, validarGrafo } from './grafo';
import { puntuar } from './puntuacion';

const run = (s: EstadoPractica, ...acts: Accion[]) => acts.reduce((acc, a) => reducir(ep, acc, a), s);
const hastaDecision = (s: EstadoPractica) => {
  let x = s;
  for (let i = 0; i < 20 && x.paso.kind === 'intro'; i++) x = reducir(ep, x, { type: 'CONTINUAR' });
  return x;
};
const elegir = (s: EstadoPractica, optionId: string) =>
  hastaDecision(run(s, { type: 'ELEGIR_OPCION', optionId }, { type: 'CONTINUAR' }));

function hastaE04(): EstadoPractica {
  let s = hastaDecision(run(estadoInicial(ep), { type: 'ELEGIR_ROL', role: 'socio' }));
  for (const o of ['M5_D01-B', 'M5_D02-C', 'M5_D03-A']) s = elegir(s, o);
  expect(s.node).toBe('M5_E04');
  return s;
}

/** Desde E05 hasta el cierre, marcando las tarjetas indicadas en D06. */
function desdeE05(s: EstadoPractica, tarjetas: string[]): EstadoPractica {
  let x = elegir(s, 'M5_D05-C');
  expect(x.node).toBe('M5_E06');
  for (const c of tarjetas) x = run(x, { type: 'ALTERNAR_TARJETA', cardId: c });
  x = run(x, { type: 'COMPROBAR_TARJETAS' });
  return x;
}

describe('módulo 5 — grafo', () => {
  it('es válido y E04 ofrece las dos variaciones del guion', () => {
    expect(validarGrafo(ep)).toEqual([]);
    expect(destinosDeEscena(ep, 'M5_E04')).toEqual(['M5_CANAL_HABITUAL', 'M5_CONFLICTO']);
    expect(destinosDeEscena(ep, 'M5_E07')).toEqual(['M5_MEDIDAS']);
    expect(destinosDeEscena(ep, 'M5_MEDIDAS')).toEqual(['M5_E08']);
  });
  it('la tarjeta 4 solo aparece en la ruta de conflicto', () => {
    const d = escenaDe(ep, 'M5_E06').decision;
    if (d.kind !== 'cards') throw new Error();
    expect(tarjetasVisibles(d, ['M5_CANAL_HABITUAL']).map((c) => c.id)).not.toContain('M5_D06-T4');
    expect(tarjetasVisibles(d, ['M5_CONFLICTO']).map((c) => c.id)).toContain('M5_D06-T4');
  });
});

describe('módulo 5 — rutas', () => {
  it('canal habitual: 1, 2 y 3 bastan en D06 y se obtiene «Ruta segura»', () => {
    let s = hastaDecision(run(hastaE04(), { type: 'ELEGIR_VARIANTE', optionId: 'M5_DVAR-H' }));
    expect(s.node).toBe('M5_CANAL_HABITUAL');
    expect(elegir(s, 'M5_D04H-A').node).toBe('M5_CANAL_HABITUAL');
    s = elegir(s, 'M5_D04H-B');
    s = desdeE05(s, ['M5_D06-T1', 'M5_D06-T2', 'M5_D06-T3']);
    expect(s.paso).toMatchObject({ kind: 'cards', checked: { ok: true } });
    s = hastaDecision(run(s, { type: 'CONTINUAR' }));
    s = elegir(s, 'M5_D07-A');
    expect(s.node).toBe('M5_MEDIDAS');
    s = hastaDecision(run(s, { type: 'CONTINUAR' }));
    for (const o of ['M5_D08-C', 'M5_D09-A', 'M5_D10-B']) s = elegir(s, o);
    expect(s.node).toBe('CIERRE');
    expect(s.badges).toEqual(['m5-criterio-presion', 'm5-ruta-segura', 'm5-prevencion-represalias']);
  });

  it('posible conflicto: D06 exige también la tarjeta 4', () => {
    let s = hastaDecision(run(hastaE04(), { type: 'ELEGIR_VARIANTE', optionId: 'M5_DVAR-C' }));
    expect(s.node).toBe('M5_CONFLICTO');
    expect(elegir(s, 'M5_D04-C').node).toBe('M5_CONFLICTO');
    s = elegir(s, 'M5_D04-B');
    let x = desdeE05(s, ['M5_D06-T1', 'M5_D06-T2', 'M5_D06-T3']);
    expect(x.paso).toMatchObject({ checked: { ok: false, missing: true } });
    x = run(x, { type: 'ALTERNAR_TARJETA', cardId: 'M5_D06-T4' }, { type: 'COMPROBAR_TARJETAS' });
    expect(x.paso).toMatchObject({ checked: { ok: true } });
    expect(x.resolved).toContain('M5_D04');
  });

  it('en la ruta habitual no se puede marcar la tarjeta 4', () => {
    let s = hastaDecision(run(hastaE04(), { type: 'ELEGIR_VARIANTE', optionId: 'M5_DVAR-H' }));
    s = desdeE05(elegir(s, 'M5_D04H-B'), ['M5_D06-T4']);
    expect(s.paso).toMatchObject({ selected: [] });
  });
});

describe('evaluación del módulo 5 (guion, apartado 24)', () => {
  const incorrecta = (qid: string) => preguntas.find((p) => p.id === qid)!.options.find((o) => o.id !== claveM5[qid])!.id;
  const respuestas = (errores: string[]) =>
    Object.fromEntries(preguntas.map((p) => [p.id, errores.includes(p.id) ? incorrecta(p.id) : claveM5[p.id]!]));
  it('clave B, A, C, B, A, C, B, A, C, B y críticas P2, P4, P6 y P8', () => {
    expect(preguntas.map((p) => claveM5[p.id]!.slice(-1)).join('')).toBe('BACBACBACB');
    expect(preguntas.filter((p) => p.critical).map((p) => p.id)).toEqual(['M5_P2', 'M5_P4', 'M5_P6', 'M5_P8']);
  });
  it('8/10 con críticas aprueba; 7/10 no; 9/10 con una crítica fallida no', () => {
    expect(puntuar(respuestas(['M5_P1', 'M5_P3']), claveM5, configEvaluacion)).toMatchObject({ score: 8, passed: true });
    expect(puntuar(respuestas(['M5_P1', 'M5_P3', 'M5_P5']), claveM5, configEvaluacion)).toMatchObject({ score: 7, passed: false });
    for (const c of configEvaluacion.criticalQuestionIds) {
      expect(puntuar(respuestas([c]), claveM5, configEvaluacion)).toMatchObject({ score: 9, estado: 'critico_fallido' });
    }
  });
});

import { describe, expect, it } from 'vitest';
import { claveM4 } from '../content/episodio4/clave';
import { configEvaluacion, episodio4 as ep, preguntas } from '../content/episodio4';
import { textosLiterales } from '../content/textos';
import { escenaDe, estadoInicial, pasoDecision, reducir, type Accion, type EstadoPractica } from './practica';
import { destinosDeEscena, validarGrafo } from './grafo';
import { puntuar } from './puntuacion';

const run = (s: EstadoPractica, ...acts: Accion[]) => acts.reduce((acc, a) => reducir(ep, acc, a), s);
const hastaDecision = (s: EstadoPractica) => {
  let x = s;
  for (let i = 0; i < 20 && x.paso.kind === 'intro'; i++) x = reducir(ep, x, { type: 'CONTINUAR' });
  return x;
};
const irA = (node: string): EstadoPractica => {
  const sc = escenaDe(ep, node);
  return hastaDecision({ ...estadoInicial(ep), role: 'cf', node, paso: sc.intro.length ? { kind: 'intro', index: 0 } : pasoDecision(sc) });
};
const elegir = (s: EstadoPractica, optionId: string) => run(s, { type: 'ELEGIR_OPCION', optionId }, { type: 'CONTINUAR' });
const sol = (solicitudId: string, optionId: string): Accion => ({ type: 'ELEGIR_SOLICITUD', solicitudId, optionId });

describe('módulo 4 — grafo y navegación', () => {
  it('es válido, con IDs M4_ y el mapa del guion (apartado 22)', () => {
    expect(validarGrafo(ep)).toEqual([]);
    for (const s of Object.values(ep.scenes)) expect(s.decision.id).toMatch(/^M4_/);
    expect(destinosDeEscena(ep, 'M4_E07')).toEqual(['M4_CONTENCION']);
    expect(destinosDeEscena(ep, 'M4_CONTENCION')).toEqual(['M4_E08']);
    expect(destinosDeEscena(ep, 'M4_E10')).toEqual(['CIERRE']);
  });

  it('D04: las tres solicitudes deben quedar con la acción autorizable', () => {
    let s = irA('M4_E04');
    expect(s.paso.kind).toBe('solicitudes');
    s = run(s, sol('M4_D04-S1', 'M4_D04-S1-B'), sol('M4_D04-S2', 'M4_D04-S2-B'), sol('M4_D04-S3', 'M4_D04-S3-B'));
    s = run(s, { type: 'COMPROBAR_SOLICITUDES' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('M4_E04');
    s = run(s, sol('M4_D04-S2', 'M4_D04-S2-A'));
    expect(s.paso).toMatchObject({ comprobado: false });
    s = run(s, { type: 'COMPROBAR_SOLICITUDES' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('M4_E05');
    expect(s.resolved).toContain('M4_D04');
  });

  it('borrar sin comunicar (D06-A) se reintenta; la captura (D06-C) se detiene; avisar (D06-B) avanza', () => {
    expect(elegir(irA('M4_E06'), 'M4_D06-A').node).toBe('M4_E06');
    expect(elegir(irA('M4_E06'), 'M4_D06-C').paso.kind).toBe('decision');
    expect(elegir(irA('M4_E06'), 'M4_D06-B').node).toBe('M4_E07');
  });

  it('E09 es una variación hipotética que termina con una narración de regreso', () => {
    const s = elegir(irA('M4_E09'), 'M4_D09-B');
    expect(s.paso.kind).toBe('outro');
    expect(run(s, { type: 'CONTINUAR' }).node).toBe('M4_E10');
  });

  it('el chat simulado no contiene datos sensibles, solo tipos', () => {
    const chat = escenaDe(ep, 'M4_E06').chat!;
    const ocultos = chat.mensajes.flatMap((m) => m.partes.filter((p) => typeof p !== 'string'));
    expect(ocultos.length).toBeGreaterThan(0);
    const texto = JSON.stringify(chat);
    expect(texto).not.toMatch(/\d/);
    expect(texto).not.toMatch(/@|https?:/);
  });

  it('los textos de las tres solicitudes se comparan con el guion', () => {
    const ids = textosLiterales(ep).map((t) => t.origen);
    for (const id of ['M4_D04-S1', 'M4_D04-S2-A', 'M4_D04-S3-B', 'M4_D04 final']) expect(ids).toContain(id);
  });
});

describe('evaluación del módulo 4 (guion, apartado 24)', () => {
  const incorrecta = (qid: string) => preguntas.find((p) => p.id === qid)!.options.find((o) => o.id !== claveM4[qid])!.id;
  const respuestas = (errores: string[]) =>
    Object.fromEntries(preguntas.map((p) => [p.id, errores.includes(p.id) ? incorrecta(p.id) : claveM4[p.id]!]));
  it('clave B, A, C, B, A, C, B, A, C, B y críticas P2, P5, P6 y P7', () => {
    expect(preguntas.map((p) => claveM4[p.id]!.slice(-1)).join('')).toBe('BACBACBACB');
    expect(preguntas.filter((p) => p.critical).map((p) => p.id)).toEqual(['M4_P2', 'M4_P5', 'M4_P6', 'M4_P7']);
  });
  it('8/10 con críticas aprueba; 7/10 no; 9/10 con una crítica fallida no', () => {
    expect(puntuar(respuestas(['M4_P1', 'M4_P3']), claveM4, configEvaluacion)).toMatchObject({ score: 8, passed: true });
    expect(puntuar(respuestas(['M4_P1', 'M4_P3', 'M4_P4']), claveM4, configEvaluacion)).toMatchObject({ score: 7, passed: false });
    for (const c of configEvaluacion.criticalQuestionIds) {
      expect(puntuar(respuestas([c]), claveM4, configEvaluacion)).toMatchObject({ score: 9, estado: 'critico_fallido' });
    }
  });
});

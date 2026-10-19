import { describe, expect, it } from 'vitest';
import { claveM2 } from '../content/episodio2/clave';
import { configEvaluacion, preguntas } from '../content/episodio2';
import { claveEp1 } from '../content/episodio1/clave';
import { puntuar } from './puntuacion';

const incorrecta = (qid: string) => preguntas.find((p) => p.id === qid)!.options.find((o) => o.id !== claveM2[qid])!.id;
const respuestas = (errores: string[]) =>
  Object.fromEntries(preguntas.map((p) => [p.id, errores.includes(p.id) ? incorrecta(p.id) : claveM2[p.id]!]));

describe('evaluación del módulo 2 (guion, apartado 24)', () => {
  it('la clave del guion: B, C, A, B, C, A, B, C, A, B', () => {
    expect(preguntas.map((p) => claveM2[p.id]!.slice(-1)).join('')).toBe('BCABCABCAB');
    expect(configEvaluacion.criticalQuestionIds).toEqual(['M2_P2', 'M2_P3', 'M2_P4', 'M2_P6']);
    expect(preguntas.filter((p) => p.critical).map((p) => p.id)).toEqual(configEvaluacion.criticalQuestionIds);
  });
  it('8/10 con críticas correctas aprueba', () => {
    expect(puntuar(respuestas(['M2_P1', 'M2_P5']), claveM2, configEvaluacion)).toMatchObject({ score: 8, passed: true });
  });
  it('7/10 con críticas correctas no aprueba', () => {
    expect(puntuar(respuestas(['M2_P1', 'M2_P5', 'M2_P7']), claveM2, configEvaluacion)).toMatchObject({ score: 7, passed: false, estado: 'insuficiente' });
  });
  it('9/10 con una crítica fallida no aprueba', () => {
    for (const c of configEvaluacion.criticalQuestionIds) {
      expect(puntuar(respuestas([c]), claveM2, configEvaluacion)).toMatchObject({ score: 9, passed: false, estado: 'critico_fallido', failedCritical: [c] });
    }
  });
  it('los IDs no colisionan con el módulo 1', () => {
    for (const id of Object.keys(claveM2)) expect(id in claveEp1).toBe(false);
  });
});

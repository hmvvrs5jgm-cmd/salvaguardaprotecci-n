import { describe, expect, it } from 'vitest';
import { claveM3 } from '../content/episodio3/clave';
import { configEvaluacion, preguntas } from '../content/episodio3';
import { puntuar } from './puntuacion';

const incorrecta = (qid: string) => preguntas.find((p) => p.id === qid)!.options.find((o) => o.id !== claveM3[qid])!.id;
const respuestas = (errores: string[]) =>
  Object.fromEntries(preguntas.map((p) => [p.id, errores.includes(p.id) ? incorrecta(p.id) : claveM3[p.id]!]));

describe('evaluación del módulo 3 (guion, apartado 23)', () => {
  it('clave del guion A, C, B, C, A, B, C, B, A, C y críticas P2, P4, P6 y P8', () => {
    expect(preguntas.map((p) => claveM3[p.id]!.slice(-1)).join('')).toBe('ACBCABCBAC');
    expect(preguntas.filter((p) => p.critical).map((p) => p.id)).toEqual(['M3_P2', 'M3_P4', 'M3_P6', 'M3_P8']);
  });
  it('8/10 con críticas correctas aprueba; 7/10 no', () => {
    expect(puntuar(respuestas(['M3_P1', 'M3_P3']), claveM3, configEvaluacion)).toMatchObject({ score: 8, passed: true });
    expect(puntuar(respuestas(['M3_P1', 'M3_P3', 'M3_P5']), claveM3, configEvaluacion)).toMatchObject({ score: 7, passed: false });
  });
  it('9/10 con una crítica fallida no aprueba', () => {
    for (const c of configEvaluacion.criticalQuestionIds) {
      expect(puntuar(respuestas([c]), claveM3, configEvaluacion)).toMatchObject({ score: 9, passed: false, estado: 'critico_fallido' });
    }
  });
});

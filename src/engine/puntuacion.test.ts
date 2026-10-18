import { describe, expect, it } from 'vitest';
import { claveEp1 } from '../content/episodio1/clave';
import { configEvaluacion, preguntas } from '../content/episodio1';
import { crearOrden, rngConSemilla } from './mezcla';
import { puntuar, RespuestasInvalidas, validarRespuestas } from './puntuacion';

const incorrecta = (qid: string) => preguntas.find((p) => p.id === qid)!.options.find((o) => o.id !== claveEp1[qid])!.id;

function respuestas(errores: string[]) {
  return Object.fromEntries(preguntas.map((p) => [p.id, errores.includes(p.id) ? incorrecta(p.id) : claveEp1[p.id]!]));
}

describe('regla de aprobación (provisional)', () => {
  it('10/10 aprueba', () => {
    expect(puntuar(respuestas([]), claveEp1, configEvaluacion)).toMatchObject({ score: 10, passed: true, estado: 'aprobado' });
  });
  it('8/10 con todas las críticas correctas aprueba', () => {
    expect(puntuar(respuestas(['P1', 'P5']), claveEp1, configEvaluacion)).toMatchObject({ score: 8, criticalOk: true, passed: true });
  });
  it('7/10 con críticas correctas no aprueba', () => {
    expect(puntuar(respuestas(['P1', 'P5', 'P7']), claveEp1, configEvaluacion)).toMatchObject({ score: 7, criticalOk: true, passed: false, estado: 'insuficiente' });
  });
  it('9/10 con una crítica fallida no aprueba', () => {
    for (const c of ['P2', 'P3', 'P4', 'P6']) {
      const r = puntuar(respuestas([c]), claveEp1, configEvaluacion);
      expect(r).toMatchObject({ score: 9, criticalOk: false, passed: false, estado: 'critico_fallido', failedCritical: [c] });
    }
  });
});

describe('validación de respuestas', () => {
  const opciones = Object.fromEntries(preguntas.map((p) => [p.id, p.options.map((o) => o.id)]));
  it('rechaza preguntas omitidas', () => {
    const r = respuestas([]);
    delete (r as Record<string, string>).P4;
    expect(() => validarRespuestas(r, opciones)).toThrow(RespuestasInvalidas);
  });
  it('rechaza opciones ajenas', () => {
    expect(() => validarRespuestas({ ...respuestas([]), P1: 'P2-C' }, opciones)).toThrow(RespuestasInvalidas);
  });
  it('rechaza preguntas ajenas', () => {
    expect(() => validarRespuestas({ ...respuestas([]), P11: 'x' }, opciones)).toThrow(RespuestasInvalidas);
  });
});

describe('mezcla', () => {
  it('mezcla opciones sin alterar la clave', () => {
    for (let seed = 1; seed < 50; seed++) {
      const orden = crearOrden(preguntas, rngConSemilla(seed), true);
      expect([...orden.questionOrder].sort()).toEqual(preguntas.map((p) => p.id).sort());
      for (const p of preguntas) {
        expect([...orden.optionOrder[p.id]!].sort()).toEqual(p.options.map((o) => o.id).sort());
        expect(orden.optionOrder[p.id]).toContain(claveEp1[p.id]);
      }
      const r = puntuar(respuestas([]), claveEp1, configEvaluacion);
      expect(r.passed).toBe(true);
    }
  });
  it('produce órdenes distintos según la semilla', () => {
    const a = crearOrden(preguntas, rngConSemilla(1));
    const b = crearOrden(preguntas, rngConSemilla(2));
    expect(JSON.stringify(a.optionOrder)).not.toEqual(JSON.stringify(b.optionOrder));
  });
});

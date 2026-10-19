import { describe, expect, it } from 'vitest';
import { claveM6 } from '../content/episodio6/clave';
import { configEvaluacion, episodio6 as ep, preguntas } from '../content/episodio6';
import { escenaDe, estadoInicial, lineasDeCierre, reducir, type Accion, type EstadoPractica } from './practica';
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
const continuar = (s: EstadoPractica) => hastaDecision(run(s, { type: 'CONTINUAR' }));

function hastaE08(): EstadoPractica {
  let s = hastaDecision(run(estadoInicial(ep), { type: 'ELEGIR_ROL', role: 'cf' }));
  s = elegir(elegir(s, 'M6_D01-B'), 'M6_D02-C');
  for (const c of ['M6_D03-T1', 'M6_D03-T2', 'M6_D03-T3', 'M6_D03-T4', 'M6_D03-T5']) s = run(s, { type: 'ALTERNAR_TARJETA', cardId: c });
  s = continuar(run(s, { type: 'COMPROBAR_TARJETAS' }));
  s = continuar(elegir(s, 'M6_D04-A')); // salida con el estado de la publicación
  for (const o of ['M6_D05-B', 'M6_D06-C', 'M6_D07-B']) s = elegir(s, o);
  expect(s.node).toBe('M6_E08');
  return s;
}

describe('módulo 6', () => {
  it('grafo válido con dos desenlaces que convergen en E09', () => {
    expect(validarGrafo(ep)).toEqual([]);
    expect(destinosDeEscena(ep, 'M6_E08')).toEqual(['M6_NO_REPUBLICAR', 'M6_CONTENIDO_ALTERNATIVO']);
    expect(destinosDeEscena(ep, 'M6_NO_REPUBLICAR')).toEqual(['M6_E09']);
    expect(destinosDeEscena(ep, 'M6_CONTENIDO_ALTERNATIVO')).toEqual(['M6_E09']);
  });

  it('D03 tiene seis tarjetas y la del color del marco no se marca', () => {
    const d = escenaDe(ep, 'M6_E03').decision;
    if (d.kind !== 'cards') throw new Error();
    expect(d.cards).toHaveLength(6);
    expect(d.cards.filter((c) => !c.include).map((c) => c.id)).toEqual(['M6_D03-T6']);
  });

  it('la publicación ficticia no contiene datos, solo tipos', () => {
    const texto = JSON.stringify(escenaDe(ep, 'M6_E01').chat);
    expect(texto).not.toMatch(/\d|@|https?:/);
    expect(texto).not.toMatch(/Alma/);
  });

  for (const [op, escena, frase] of [
    ['M6_D08-B', 'M6_NO_REPUBLICAR', /no se vuelve a publicar/],
    ['M6_D08-C', 'M6_CONTENIDO_ALTERNATIVO', /pieza general independiente/],
  ] as const) {
    it(`desenlace ${escena}: cierre con su línea al final y las tres insignias`, () => {
      let s = elegir(hastaE08(), op);
      expect(s.node).toBe(escena);
      s = continuar(s);
      s = elegir(elegir(s, 'M6_D09-C'), 'M6_D10-B');
      expect(s.node).toBe('CIERRE');
      const cierre = lineasDeCierre(ep, s);
      expect(String(cierre.at(-1)!.text)).toMatch(frase);
      expect(String(cierre[0]!.text)).toMatch(/^Quiero seguir viniendo/);
      expect(s.badges).toEqual(['m6-mirada-protectora', 'm6-contencion-cuidado', 'm6-comunicar-sin-exponer']);
    });
  }

  it('la disculpa pública (D07-A) y el video de Alma (D05-C) se detienen', () => {
    const s = hastaE08();
    expect(elegir({ ...s, node: 'M6_E07', paso: { kind: 'decision' } }, 'M6_D07-A').node).toBe('M6_E07');
    expect(elegir({ ...s, node: 'M6_E05', paso: { kind: 'decision' } }, 'M6_D05-C').node).toBe('M6_E05');
  });
});

describe('evaluación del módulo 6 (guion, apartado 24)', () => {
  const incorrecta = (qid: string) => preguntas.find((p) => p.id === qid)!.options.find((o) => o.id !== claveM6[qid])!.id;
  const respuestas = (errores: string[]) =>
    Object.fromEntries(preguntas.map((p) => [p.id, errores.includes(p.id) ? incorrecta(p.id) : claveM6[p.id]!]));
  it('clave C, A, B, C, A, B, C, A, B, C y críticas P2, P4, P5 y P6', () => {
    expect(preguntas.map((p) => claveM6[p.id]!.slice(-1)).join('')).toBe('CABCABCABC');
    expect(preguntas.filter((p) => p.critical).map((p) => p.id)).toEqual(['M6_P2', 'M6_P4', 'M6_P5', 'M6_P6']);
  });
  it('8/10 con críticas aprueba; 7/10 no; 9/10 con una crítica fallida no', () => {
    expect(puntuar(respuestas(['M6_P1', 'M6_P3']), claveM6, configEvaluacion)).toMatchObject({ score: 8, passed: true });
    expect(puntuar(respuestas(['M6_P1', 'M6_P3', 'M6_P7']), claveM6, configEvaluacion)).toMatchObject({ score: 7, passed: false });
    for (const c of configEvaluacion.criticalQuestionIds) {
      expect(puntuar(respuestas([c]), claveM6, configEvaluacion)).toMatchObject({ score: 9, estado: 'critico_fallido' });
    }
  });
});

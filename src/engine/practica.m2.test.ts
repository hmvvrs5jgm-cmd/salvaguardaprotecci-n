import { describe, expect, it } from 'vitest';
import { episodio2 as ep } from '../content/episodio2';
import type { NodeId, RoleId } from '../content/types';
import { escenaDe, estadoInicial, pasoDecision, reducir, type Accion, type EstadoPractica } from './practica';

const run = (s: EstadoPractica, ...acts: Accion[]) => acts.reduce((acc, a) => reducir(ep, acc, a), s);

function hastaDecision(s: EstadoPractica): EstadoPractica {
  let x = s;
  for (let i = 0; i < 20 && x.paso.kind === 'intro'; i++) x = reducir(ep, x, { type: 'CONTINUAR' });
  return x;
}

function irA(node: NodeId, role: RoleId = 'cf'): EstadoPractica {
  const sc = escenaDe(ep, node);
  return hastaDecision({
    ...estadoInicial(ep),
    role,
    node,
    paso: sc.intro.length === 0 ? pasoDecision(sc) : { kind: 'intro', index: 0 },
  });
}

const elegir = (s: EstadoPractica, optionId: string) => run(s, { type: 'ELEGIR_OPCION', optionId }, { type: 'CONTINUAR' });

describe('motor narrativo — módulo 2', () => {
  it('E01 A y D convergen en E02', () => {
    expect(elegir(irA('M2_E01'), 'M2_D01-A').node).toBe('M2_E02');
    expect(elegir(irA('M2_E01'), 'M2_D01-D').node).toBe('M2_E02');
  });

  it('el vehículo (E01-C) se detiene y vuelve a la decisión', () => {
    const s = elegir(irA('M2_E01'), 'M2_D01-C');
    expect(s.node).toBe('M2_E01');
    expect(s.paso.kind).toBe('decision');
    expect(s.resolved).not.toContain('M2_D01');
  });

  it('la promesa de secreto exige reparación antes de avanzar', () => {
    let s = elegir(irA('M2_E03'), 'M2_D03-A');
    expect(s.node).toBe('M2_E03');
    s = run(s, { type: 'MOSTRAR_REPARACION' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('M2_E04');
  });

  it('E04-A lleva a la subescena urgente antes de la red de apoyo', () => {
    expect(elegir(irA('M2_E04'), 'M2_D04-A').node).toBe('M2_URGENTE');
    const s = elegir(irA('M2_URGENTE'), 'M2_DURG-A');
    expect(s.node).toBe('M2_E05');
    expect(elegir(irA('M2_URGENTE'), 'M2_DURG-C').node).toBe('M2_URGENTE');
  });

  it('E05 muestra la transición sobre la medida de protección antes de E06', () => {
    let s = elegir(irA('M2_E05'), 'M2_D05-B');
    expect(s.paso.kind).toBe('outro');
    expect(s.node).toBe('M2_E05');
    s = run(s, { type: 'CONTINUAR' });
    expect(s.node).toBe('M2_E06');
  });

  it('E08 A y D pasan por la reparación de la derivación; B va a la verificación', () => {
    for (const o of ['M2_D08-A', 'M2_D08-D']) {
      let s = elegir(irA('M2_E08'), o);
      expect(s.node).toBe('M2_REPARAR_DERIVACION');
      s = hastaDecision(s);
      expect(s.paso.kind).toBe('decision');
      s = run(s, { type: 'CONTINUAR' });
      expect(s.node).toBe('M2_VERIFICAR');
    }
    expect(elegir(irA('M2_E08'), 'M2_D08-B').node).toBe('M2_VERIFICAR');
    expect(elegir(irA('M2_E08'), 'M2_D08-C').node).toBe('M2_E08');
  });

  it('una ficha incompleta no avanza; la completa sí', () => {
    let s = irA('M2_VERIFICAR');
    expect(s.paso.kind).toBe('checklist');
    s = run(s, { type: 'ALTERNAR_ITEM', itemId: 'M2_DVER-1' }, { type: 'COMPROBAR_FICHA' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('M2_VERIFICAR');
    const resto = ['M2_DVER-2', 'M2_DVER-3', 'M2_DVER-4', 'M2_DVER-5', 'M2_DVER-6'].map(
      (itemId): Accion => ({ type: 'ALTERNAR_ITEM', itemId }),
    );
    s = run(s, ...resto);
    expect(s.paso).toMatchObject({ kind: 'checklist', comprobado: false });
    s = run(s, { type: 'COMPROBAR_FICHA' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('M2_E09');
    expect(s.resolved).toContain('M2_DVER');
  });

  it('la contingencia sin servicio no resuelve la ficha y vuelve al ejemplo principal', () => {
    let s = run(irA('M2_VERIFICAR'), { type: 'ALTERNATIVA' });
    expect(s.node).toBe('M2_SIN_SERVICIO');
    expect(s.resolved).not.toContain('M2_DVER');
    s = run(hastaDecision(s), { type: 'CONTINUAR' });
    expect(s.node).toBe('M2_VERIFICAR');
    expect(s.paso.kind).toBe('intro');
  });

  it('E10-B lleva al cierre; cerrar el caso (A) se reintenta', () => {
    expect(elegir(irA('M2_E10'), 'M2_D10-A').node).toBe('M2_E10');
    expect(elegir(irA('M2_E10'), 'M2_D10-B').node).toBe('CIERRE');
  });

  it('otorga las tres insignias al recorrer el módulo con respuestas adecuadas', () => {
    let s = hastaDecision(run(estadoInicial(ep), { type: 'ELEGIR_ROL', role: 'socio' }));
    const opciones = ['M2_D01-A', 'M2_D02-A', 'M2_D03-B', 'M2_D04-A', 'M2_DURG-A', 'M2_D05-B'];
    for (const o of opciones) s = hastaDecision(elegir(s, o));
    s = hastaDecision(run(s, { type: 'CONTINUAR' })); // salida de E05
    expect(s.node).toBe('M2_E06');
    for (const c of ['M2_D06-T1', 'M2_D06-T2', 'M2_D06-T3']) s = run(s, { type: 'ALTERNAR_TARJETA', cardId: c });
    s = hastaDecision(run(s, { type: 'COMPROBAR_TARJETAS' }, { type: 'CONTINUAR' }));
    s = hastaDecision(elegir(s, 'M2_D07-B'));
    s = hastaDecision(elegir(s, 'M2_D08-B'));
    for (let i = 1; i <= 6; i++) s = run(s, { type: 'ALTERNAR_ITEM', itemId: `M2_DVER-${i}` });
    s = hastaDecision(run(s, { type: 'COMPROBAR_FICHA' }, { type: 'CONTINUAR' }));
    s = hastaDecision(elegir(s, 'M2_D09-B'));
    s = elegir(s, 'M2_D10-B');
    expect(s.node).toBe('CIERRE');
    expect(s.badges).toEqual(['m2-escucha-que-cuida', 'm2-seguridad-participacion', 'm2-derivacion-segura']);
  });
});

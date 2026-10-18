import { describe, expect, it } from 'vitest';
import { episodio1 as ep } from '../content/episodio1';
import type { DecisionId, NodeId, RoleId } from '../content/types';
import { estadoInicial, reducir, type Accion, type EstadoPractica } from './practica';

const run = (s: EstadoPractica, ...acts: Accion[]) => acts.reduce((acc, a) => reducir(ep, acc, a), s);

/** Avanza la intro hasta la decisión. */
function hastaDecision(s: EstadoPractica): EstadoPractica {
  let x = s;
  for (let i = 0; i < 20 && x.paso.kind === 'intro'; i++) x = reducir(ep, x, { type: 'CONTINUAR' });
  return x;
}

function inicio(role: RoleId = 'cf') {
  return hastaDecision(run(estadoInicial(ep), { type: 'ELEGIR_ROL', role }));
}

function irA(node: NodeId, role: RoleId = 'cf'): EstadoPractica {
  const s = { ...estadoInicial(ep), role, node };
  const sc = node === 'CIERRE' ? null : ep.scenes[node];
  return hastaDecision({
    ...s,
    paso: sc && sc.intro.length === 0 && sc.decision.kind === 'cards' ? { kind: 'cards', selected: [], checked: null } : sc && sc.intro.length === 0 ? { kind: 'decision' } : { kind: 'intro', index: 0 },
  });
}

describe('motor narrativo', () => {
  it('avanza: D1-A lleva a E02', () => {
    const s = run(inicio(), { type: 'ELEGIR_OPCION', optionId: 'D1-A' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('E02');
    expect(s.resolved).toContain('D1');
  });

  it('repara_y_avanza: no avanza sin mostrar la reparación (D2-A)', () => {
    let s = run(irA('E02'), { type: 'ELEGIR_OPCION', optionId: 'D2-A' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('E02');
    expect(s.paso.kind).toBe('feedback');
    s = run(s, { type: 'MOSTRAR_REPARACION' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('E03');
  });

  for (const id of ['D1-B', 'D1-C']) {
    it(`repara_y_avanza: ${id} exige reparación`, () => {
      let s = run(inicio(), { type: 'ELEGIR_OPCION', optionId: id }, { type: 'CONTINUAR' });
      expect(s.node).toBe('E01');
      s = run(s, { type: 'MOSTRAR_REPARACION' }, { type: 'CONTINUAR' });
      expect(s.node).toBe('E02');
    });
  }

  it('pausa_y_vuelve: D1-D no avanza y vuelve a la decisión', () => {
    const s = run(inicio(), { type: 'ELEGIR_OPCION', optionId: 'D1-D' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('E01');
    expect(s.paso).toEqual({ kind: 'decision' });
    expect(s.resolved).not.toContain('D1');
  });

  it('pausa_y_vuelve: D3-B vuelve a D3', () => {
    const s = run(irA('E03'), { type: 'ELEGIR_OPCION', optionId: 'D3-B' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('E03');
    expect(s.paso).toEqual({ kind: 'decision' });
  });

  it('reintenta en todas las opciones del guion marcadas así', () => {
    const casos: Array<[NodeId, string]> = [
      ['E03', 'D3-C'], ['E04', 'D4-A'], ['E04', 'D4-B'], ['E05', 'D5-B'], ['E05', 'D5-C'], ['E05', 'D5-D'],
      ['E05B', 'D6-B'], ['E05B', 'D6-C'], ['E07', 'D8-A'], ['E07', 'D8-C'], ['E08', 'D9-B'], ['E08', 'D9-C'],
    ];
    for (const [node, opt] of casos) {
      const s = run(irA(node), { type: 'ELEGIR_OPCION', optionId: opt }, { type: 'CONTINUAR' });
      expect([s.node, s.paso.kind]).toEqual([node, 'decision']);
    }
  });

  it('complementa_y_avanza: D3-D avanza a E04', () => {
    const s = run(irA('E03'), { type: 'ELEGIR_OPCION', optionId: 'D3-D' }, { type: 'CONTINUAR' });
    expect(s.node).toBe('E04');
    expect(s.resolved).toContain('D3');
  });

  it('E05B muestra el regreso al hilo principal antes de E06', () => {
    let s = run(irA('E05B'), { type: 'ELEGIR_OPCION', optionId: 'D6-A' }, { type: 'CONTINUAR' });
    expect(s.paso).toEqual({ kind: 'outro', next: 'E06' });
    s = run(s, { type: 'CONTINUAR' });
    expect(s.node).toBe('E06');
    expect(s.paso.kind).toBe('cards');
  });

  describe('D7 tarjetas', () => {
    const sel = (ids: string[]) =>
      run(irA('E06'), ...ids.map((cardId) => ({ type: 'ALTERNAR_TARJETA', cardId }) as Accion), { type: 'COMPROBAR_TARJETAS' });

    it('solución correcta 1, 2 y 3', () => {
      const s = sel(['D7-T1', 'D7-T2', 'D7-T3']);
      expect(s.paso).toMatchObject({ checked: { ok: true, missing: false, extra: false } });
      expect(run(s, { type: 'CONTINUAR' }).node).toBe('E07');
    });
    it('faltantes', () => {
      expect(sel(['D7-T1']).paso).toMatchObject({ checked: { ok: false, missing: true, extra: false } });
    });
    it('sobrantes', () => {
      expect(sel(['D7-T1', 'D7-T2', 'D7-T3', 'D7-T4']).paso).toMatchObject({ checked: { ok: false, missing: false, extra: true } });
    });
    it('faltantes y sobrantes a la vez; no avanza', () => {
      const s = sel(['D7-T1', 'D7-T5']);
      expect(s.paso).toMatchObject({ checked: { ok: false, missing: true, extra: true } });
      expect(run(s, { type: 'CONTINUAR' }).node).toBe('E06');
    });
    it('reintentos ilimitados: cambiar la selección limpia la comprobación', () => {
      const s = run(sel(['D7-T4']), { type: 'ALTERNAR_TARJETA', cardId: 'D7-T4' });
      expect(s.paso).toMatchObject({ checked: null, selected: [] });
    });
  });

  it('recorrido completo con reparaciones y reintentos otorga las tres insignias (ambos roles)', () => {
    for (const role of ['cf', 'socio'] as RoleId[]) {
      let s = inicio(role);
      const elegir = (...ops: string[]) => {
        for (const o of ops) {
          s = run(s, { type: 'ELEGIR_OPCION', optionId: o });
          if (s.paso.kind === 'feedback') s = run(s, { type: 'MOSTRAR_REPARACION' });
          s = hastaDecision(run(s, { type: 'CONTINUAR' }));
          if (s.paso.kind === 'outro') s = hastaDecision(run(s, { type: 'CONTINUAR' }));
        }
      };
      elegir('D1-D', 'D1-B', 'D2-C', 'D3-C', 'D3-D', 'D4-A', 'D4-C', 'D5-D', 'D5-A', 'D6-B', 'D6-A');
      expect(s.node).toBe('E06');
      s = run(s, { type: 'ALTERNAR_TARJETA', cardId: 'D7-T1' }, { type: 'ALTERNAR_TARJETA', cardId: 'D7-T2' }, { type: 'ALTERNAR_TARJETA', cardId: 'D7-T3' }, { type: 'COMPROBAR_TARJETAS' }, { type: 'CONTINUAR' });
      s = hastaDecision(s);
      elegir('D8-A', 'D8-B', 'D9-C', 'D9-A');
      expect(s.node).toBe('CIERRE');
      expect(s.resolved.sort()).toEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'] as DecisionId[]);
      expect(s.badges).toEqual(['escucha-respetuosa', 'reporte-responsable', 'respuesta-centrada']);
    }
  });

  it('cambiar de rol reinicia desde E01 y conserva herramientas e insignias', () => {
    const s = run(irA('E04'), { type: 'VER_HERRAMIENTA', toolId: 'roles' }, { type: 'CAMBIAR_ROL', role: 'socio' });
    expect(s.node).toBe('E01');
    expect(s.role).toBe('socio');
    expect(s.toolsViewed).toEqual(['roles']);
  });

  it('ignora opciones ajenas a la decisión actual', () => {
    const s0 = inicio();
    expect(reducir(ep, s0, { type: 'ELEGIR_OPCION', optionId: 'D9-A' })).toBe(s0);
  });
});

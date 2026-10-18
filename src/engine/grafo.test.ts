import { describe, expect, it } from 'vitest';
import { episodio1 } from '../content/episodio1';
import type { Episode } from '../content/types';
import { recorridoAdecuado, validarGrafo } from './grafo';

const clonar = (): Episode => structuredClone(episodio1);

describe('validación del grafo narrativo', () => {
  it('el episodio 1 no tiene problemas', () => {
    expect(validarGrafo(episodio1)).toEqual([]);
  });

  it('contiene las nueve decisiones D1–D9 y D7 es de tarjetas', () => {
    const ids = episodio1.order.map((s) => episodio1.scenes[s].decision.id);
    expect(ids).toEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9']);
    expect(episodio1.scenes.E06.decision.kind).toBe('cards');
  });

  it('detecta destinos inexistentes', () => {
    const ep = clonar();
    const d = ep.scenes.E01.decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[0]!.outcome = { type: 'avanza', next: 'E99' as never };
    expect(validarGrafo(ep).map((p) => p.tipo)).toContain('destino_inexistente');
  });

  it('detecta IDs duplicados', () => {
    const ep = clonar();
    const d = ep.scenes.E02.decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[1]!.id = d.options[0]!.id;
    expect(validarGrafo(ep).map((p) => p.tipo)).toContain('id_duplicado');
  });

  it('detecta nodos inaccesibles y ausencia de final', () => {
    const ep = clonar();
    const d = ep.scenes.E08.decision;
    if (d.kind !== 'choice') throw new Error();
    for (const o of d.options) o.outcome = { type: 'reintenta' };
    const tipos = validarGrafo(ep).map((p) => p.tipo);
    expect(tipos).toContain('sin_opcion_adecuada');
    expect(tipos).toContain('sin_final');
    expect(tipos).toContain('ciclo_sin_salida');
  });

  it('detecta escenas inaccesibles', () => {
    const ep = clonar();
    const d = ep.scenes.E05.decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[0]!.outcome = { type: 'avanza', next: 'E06' };
    expect(validarGrafo(ep)).toContainEqual({ tipo: 'nodo_inaccesible', detalle: 'E05B' });
  });

  it('detecta variantes de rol incompletas', () => {
    const ep = clonar();
    const d = ep.scenes.E05.decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[0]!.label = { cf: 'x', socio: '' };
    expect(validarGrafo(ep).map((p) => p.tipo)).toContain('variante_rol_incompleta');
  });

  it('ambos roles recorren el episodio hasta el cierre con su variante de D5', () => {
    const cf = recorridoAdecuado(episodio1, 'cf');
    const socio = recorridoAdecuado(episodio1, 'socio');
    expect(cf).toHaveLength(9);
    expect(socio).toHaveLength(9);
    expect(cf[4]!.label).toMatch(/^Reporto al Punto Focal/);
    expect(socio[4]!.label).toMatch(/^Activo el mecanismo de mi organización/);
  });
});

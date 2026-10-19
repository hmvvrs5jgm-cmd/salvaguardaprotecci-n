import { describe, expect, it } from 'vitest';
import { episodio1 } from '../content/episodio1';
import type { Episode } from '../content/types';
import { episodio2 } from '../content/episodio2';
import { recorridoAdecuado, validarGrafo, destinosDeEscena } from './grafo';
import { escenaDe } from './practica';

// Las funciones de los textos de resultado no se pueden clonar: se copian solo las escenas.
const clonar = (): Episode => ({ ...episodio1, scenes: structuredClone(episodio1.scenes) });

describe('validación del grafo narrativo', () => {
  it('el episodio 1 no tiene problemas', () => {
    expect(validarGrafo(episodio1)).toEqual([]);
  });

  it('contiene las nueve decisiones D1–D9 y D7 es de tarjetas', () => {
    const ids = episodio1.order.map((s) => escenaDe(episodio1, s).decision.id);
    expect(ids).toEqual(['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9']);
    expect(escenaDe(episodio1, 'E06').decision.kind).toBe('cards');
  });

  it('detecta destinos inexistentes', () => {
    const ep = clonar();
    const d = escenaDe(ep, 'E01').decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[0]!.outcome = { type: 'avanza', next: 'E99' as never };
    expect(validarGrafo(ep).map((p) => p.tipo)).toContain('destino_inexistente');
  });

  it('detecta IDs duplicados', () => {
    const ep = clonar();
    const d = escenaDe(ep, 'E02').decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[1]!.id = d.options[0]!.id;
    expect(validarGrafo(ep).map((p) => p.tipo)).toContain('id_duplicado');
  });

  it('detecta nodos inaccesibles y ausencia de final', () => {
    const ep = clonar();
    const d = escenaDe(ep, 'E08').decision;
    if (d.kind !== 'choice') throw new Error();
    for (const o of d.options) o.outcome = { type: 'reintenta' };
    const tipos = validarGrafo(ep).map((p) => p.tipo);
    expect(tipos).toContain('sin_opcion_adecuada');
    expect(tipos).toContain('sin_final');
    expect(tipos).toContain('ciclo_sin_salida');
  });

  it('detecta escenas inaccesibles', () => {
    const ep = clonar();
    const d = escenaDe(ep, 'E05').decision;
    if (d.kind !== 'choice') throw new Error();
    d.options[0]!.outcome = { type: 'avanza', next: 'E06' };
    expect(validarGrafo(ep)).toContainEqual({ tipo: 'nodo_inaccesible', detalle: 'E05B' });
  });

  it('detecta variantes de rol incompletas', () => {
    const ep = clonar();
    const d = escenaDe(ep, 'E05').decision;
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

describe('grafo del módulo 2', () => {
  it('no tiene problemas y usa IDs con prefijo M2_', () => {
    expect(validarGrafo(episodio2)).toEqual([]);
    for (const s of Object.values(episodio2.scenes)) {
      expect(s.id).toMatch(/^M2_/);
      expect(s.decision.id).toMatch(/^M2_/);
    }
    for (const q of episodio2.evaluacion.preguntas) expect(q.id).toMatch(/^M2_P\d+$/);
  });

  it('sigue el mapa de navegación del guion (apartado 22)', () => {
    expect(destinosDeEscena(episodio2, 'M2_E04')).toEqual(['M2_URGENTE']);
    expect(destinosDeEscena(episodio2, 'M2_URGENTE')).toEqual(['M2_E05']);
    // E08: A y D pasan por la reparación; B llega a la verificación.
    const d08 = escenaDe(episodio2, 'M2_E08').decision;
    if (d08.kind !== 'choice') throw new Error();
    const destino = (letra: string) => {
      const o = d08.options.find((x) => x.guionLetter === letra)!;
      return 'next' in o.outcome ? o.outcome.next : null;
    };
    expect(destino('A')).toBe('M2_REPARAR_DERIVACION');
    expect(destino('D')).toBe('M2_REPARAR_DERIVACION');
    expect(destino('B')).toBe('M2_VERIFICAR');
    expect(destino('C')).toBeNull();
    expect(destinosDeEscena(episodio2, 'M2_REPARAR_DERIVACION')).toEqual(['M2_VERIFICAR']);
    expect(destinosDeEscena(episodio2, 'M2_VERIFICAR')).toEqual(['M2_E09', 'M2_SIN_SERVICIO']);
    expect(destinosDeEscena(episodio2, 'M2_SIN_SERVICIO')).toEqual(['M2_VERIFICAR']);
    expect(destinosDeEscena(episodio2, 'M2_E10')).toEqual(['CIERRE']);
  });

  it('el recorrido adecuado pasa por la urgencia antes de la derivación de corto plazo', () => {
    const r = recorridoAdecuado(episodio2, 'cf').map((x) => x.scene);
    expect(r).toEqual([
      'M2_E01', 'M2_E02', 'M2_E03', 'M2_E04', 'M2_URGENTE', 'M2_E05', 'M2_E06', 'M2_E07', 'M2_E08', 'M2_VERIFICAR', 'M2_E09', 'M2_E10',
    ]);
  });

  it('las insignias cubren las decisiones del guion (apartado 19)', () => {
    expect(episodio2.badges.map((b) => b.decisions)).toEqual([
      ['M2_D01', 'M2_D02', 'M2_D03'],
      ['M2_D04', 'M2_DURG', 'M2_D05', 'M2_D06', 'M2_D07'],
      ['M2_D08', 'M2_DVER', 'M2_D09', 'M2_D10'],
    ]);
  });
});

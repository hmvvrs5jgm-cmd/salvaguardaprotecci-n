import { describe, expect, it } from 'vitest';
import { episodio1 } from '../content/episodio1';
import { episodio2 } from '../content/episodio2';
import { episodio3 } from '../content/episodio3';
import { episodio5 } from '../content/episodio5';
import type { Episode } from '../content/types';
import { estadoInicial, progreso, type EstadoPractica } from './practica';

const en = (ep: Episode, node: string, recorrido: string[]): EstadoPractica => ({ ...estadoInicial(ep), role: 'cf', node, recorrido });

describe('contador de escenas por recorrido', () => {
  it('módulo 1 (lineal): nueve escenas', () => {
    expect(progreso(episodio1, en(episodio1, 'E08', ['E01', 'E08']))).toEqual({ actual: 9, total: 9 });
  });

  it('módulo 3: cada jornada cuenta solo sus escenas y termina en «12 de 12»', () => {
    const base = ['M3_E01', 'M3_E02', 'M3_E03', 'M3_E03B', 'M3_E04', 'M3_E05', 'M3_E06', 'M3_E07', 'M3_E08'];
    expect(progreso(episodio3, en(episodio3, 'M3_E08', base))).toEqual({ actual: 9, total: 12 });
    const adaptada = [...base, 'M3_INICIO_ADAPTADO', 'M3_E09', 'M3_E10'];
    expect(progreso(episodio3, en(episodio3, 'M3_E10', adaptada))).toEqual({ actual: 12, total: 12 });
    const suspendida = [...base, 'M3_SUSPENSION', 'M3_E09S', 'M3_E10'];
    expect(progreso(episodio3, en(episodio3, 'M3_E09S', suspendida.slice(0, -1)))).toEqual({ actual: 11, total: 12 });
    expect(progreso(episodio3, en(episodio3, 'M3_E10', suspendida))).toEqual({ actual: 12, total: 12 });
  });

  it('módulo 5: la variación de canal elegida es la única que cuenta', () => {
    const r = ['M5_E01', 'M5_E02', 'M5_E03', 'M5_E04', 'M5_CONFLICTO'];
    expect(progreso(episodio5, en(episodio5, 'M5_CONFLICTO', r))).toEqual({ actual: 5, total: 12 });
  });

  it('módulo 2: las escenas de reparación y contingencia solo cuentan si se visitaron', () => {
    const r = ['M2_E01', 'M2_E02', 'M2_E03', 'M2_E04', 'M2_URGENTE', 'M2_E05', 'M2_E06', 'M2_E07', 'M2_E08', 'M2_VERIFICAR'];
    expect(progreso(episodio2, en(episodio2, 'M2_VERIFICAR', r))).toEqual({ actual: 10, total: 12 });
    const conReparacion = [...r.slice(0, -1), 'M2_REPARAR_DERIVACION'];
    expect(progreso(episodio2, en(episodio2, 'M2_REPARAR_DERIVACION', conReparacion))).toEqual({ actual: 10, total: 13 });
  });
});

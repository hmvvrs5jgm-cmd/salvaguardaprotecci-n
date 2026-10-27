import { describe, expect, it } from 'vitest';
import { estadoVigencia, textoEstadoRegistro, vigenteHasta } from './vigencia';

describe('vigencia de la aprobación (doce meses)', () => {
  it('vence doce meses después de la aprobación', () => {
    expect(vigenteHasta('2026-10-27T15:00:00Z').toISOString().slice(0, 10)).toBe('2027-10-27');
    expect(vigenteHasta('2028-02-29T10:00:00Z').toISOString().slice(0, 10)).toBe('2029-02-28');
  });
  it('marca vigente o vencida sin borrar el resultado', () => {
    expect(estadoVigencia('aprobado', '2026-01-10T00:00:00Z', new Date('2026-12-01T00:00:00Z'))).toBe('vigente');
    expect(estadoVigencia('aprobado', '2025-01-10T00:00:00Z', new Date('2026-12-01T00:00:00Z'))).toBe('vencida');
    expect(estadoVigencia('no_aprobado', '2026-01-10T00:00:00Z')).toBeNull();
  });
  it('describe el estado del registro', () => {
    const ahora = new Date('2026-12-01T00:00:00Z');
    expect(textoEstadoRegistro({ status: 'aprobado', created_at: '2025-01-10T00:00:00Z' }, ahora)).toMatch(/^Aprobado · vigencia vencida/);
    expect(textoEstadoRegistro({ status: 'aprobado', created_at: '2026-01-10T00:00:00Z' }, ahora)).toMatch(/^Aprobado · vigente hasta/);
    expect(textoEstadoRegistro({ status: 'anulado', created_at: '2026-01-10T00:00:00Z', annul_reason: 'Duplicado' }, ahora)).toBe('Anulado (Duplicado)');
    expect(textoEstadoRegistro({ status: 'no_aprobado', created_at: '2026-01-10T00:00:00Z' }, ahora)).toBe('No aprobado');
  });
});

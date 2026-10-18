import { describe, expect, it } from 'vitest';
import { canales, esEnlaceActivo } from '../config/canales';
import { herramientas } from './herramientas';
import { preguntas, configEvaluacion } from './episodio1';
import { claveEp1 } from './episodio1/clave';
import { todoElTexto } from './textos';

describe('reglas de contenido (prompt, apartado 11)', () => {
  const texto = todoElTexto();

  it('ningún texto publicado contiene «sepeakup»', () => {
    expect(texto.toLowerCase()).not.toContain('sepeakup');
    expect(texto).toContain('speakup.childfund.org');
  });

  it('no asocia los niveles a la escala menor/moderado/grave', () => {
    expect(texto).not.toMatch(/nivel\s*[123]\s*\(?\s*(menor|moderado|grave)/i);
    expect(texto).not.toMatch(/\((menor|moderado|grave)\)/i);
  });

  it('cada herramienta muestra fuentes', () => {
    expect(herramientas.map((h) => h.id)).toEqual(['escucha', 'seguridad', 'reporte', 'roles', 'apoyos']);
    for (const h of herramientas) expect(h.sources.length).toBeGreaterThan(0);
  });

  it('ningún canal pendiente es un enlace activo', () => {
    for (const c of canales) if (c.estado === 'pendiente') expect(esEnlaceActivo(c)).toBe(false);
  });

  it('la tarjeta de niveles aclara que el nivel 1 no significa daño leve y que el caso no es de nivel 1', () => {
    const roles = herramientas.find((h) => h.id === 'roles')!;
    const t = JSON.stringify(roles);
    expect(t).toContain('no significa daño leve');
    expect(t).toContain('no es de nivel 1');
  });

  it('no hay teléfonos en el contenido publicado', () => {
    expect(texto).not.toMatch(/\b\d{3}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/);
    expect(texto).not.toMatch(/ECU\s*911/i);
  });

  it('diez preguntas con clave completa; críticas 2, 3, 4 y 6; umbral 8', () => {
    expect(preguntas).toHaveLength(10);
    expect(configEvaluacion).toMatchObject({ passScore: 8, criticalQuestionIds: ['P2', 'P3', 'P4', 'P6'] });
    expect(preguntas.filter((p) => p.critical).map((p) => p.id)).toEqual(['P2', 'P3', 'P4', 'P6']);
    for (const p of preguntas) expect(p.options.map((o) => o.id)).toContain(claveEp1[p.id]);
  });

  it('las preguntas no llevan la clave incorporada', () => {
    expect(JSON.stringify(preguntas)).not.toMatch(/correct/i);
  });
});

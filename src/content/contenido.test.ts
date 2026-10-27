import { describe, expect, it } from 'vitest';
import { canales, esEnlaceActivo, serviciosPublicos } from '../config/canales';
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
    expect(herramientas.map((h) => h.id)).toEqual(['escucha', 'seguridad', 'no-hacer', 'reporte', 'ruta', 'roles', 'apoyos']);
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

  it('solo aparecen los números de servicios públicos verificados', () => {
    const permitidos = serviciosPublicos.filter((s) => s.estado === 'verificado').map((s) => s.contacto ?? '');
    const sinPermitidos = permitidos.reduce((t, p) => t.split(p).join(''), texto);
    expect(sinPermitidos).not.toMatch(/\b\d{3}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/);
    // «1800» solo puede figurar en la línea de denuncia de la Fiscalía.
    expect(sinPermitidos.replace(/1800-DELITO/g, '')).not.toMatch(/1800/);
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

describe('contenido de las fuentes de la Oficina de País (v1.2)', () => {
  const texto = todoElTexto();
  it('no publica el mapeo de servicios de uso interno ni nombres de entidades del directorio', () => {
    for (const t of ['CEPAM', 'Casa Matilde', 'DEVIF', 'DINAPEN', 'Warmi', 'Enrique Garc', 'Danumis', 'HIAS']) expect(texto).not.toContain(t);
  });
  it('matiza la decisión de la persona adulta con las obligaciones legales que valoran los roles competentes', () => {
    expect(texto).toContain('COIP (art. 276)');
    expect(texto).not.toMatch(/esa decisión es tuya y el apoyo no depende de ella/);
  });
  it('incluye la herramienta de acciones no permitidas y la ruta de respuesta', () => {
    expect(texto).toContain('Derivar sin coordinación con el PEP o el SIMT');
    expect(texto).toContain('Tu participación en la ruta termina al comunicar');
  });
});

describe('servicios públicos del Capítulo III', () => {
  it('911 para emergencias; 1800-DELITO como vía de denuncia de la Fiscalía; derivación coordinada por el PEP', () => {
    const porId = Object.fromEntries(serviciosPublicos.map((s) => [s.id, s]));
    expect(porId['ecu-911']).toMatchObject({ tipo: 'emergencia', contacto: '911', estado: 'verificado' });
    expect(porId['linea-1800-delito']).toMatchObject({ tipo: 'denuncia' });
    expect(porId['linea-1800-delito']!.descripcion).toContain('Fiscalía');
    expect(todoElTexto()).toContain('Las derivaciones las coordina el Punto Focal de Salvaguarda (PEP)');
    expect(todoElTexto()).toContain('no son un plazo para reportar ni para esperar');
  });
});

describe('forma B propuesta (respuestas revisadas, 23/10/2026, anexo C)', () => {
  it('tiene diez preguntas por módulo, tres opciones, una clave válida y las críticas comunicadas', async () => {
    const { itemsFormaB } = await import('./formaB/items');
    const { claveFormaB } = await import('./formaB/clave');
    const { construirFormaB } = await import('./formaB');
    const { episodios } = await import('./episodios');
    const criticas: Record<number, number[]> = { 1: [2, 3, 4, 6], 2: [2, 3, 4, 6], 3: [2, 4, 6, 8], 4: [2, 5, 6, 7], 5: [2, 4, 6, 8], 6: [2, 4, 5, 6] };
    for (const ep of episodios) {
      const n = ep.number as 1 | 2 | 3 | 4 | 5 | 6;
      expect(itemsFormaB[n].items).toHaveLength(10);
      const forma = construirFormaB(n, ep.evaluacion.config, ep.evaluacion.preguntas);
      expect(forma.preguntas.filter((p) => p.critical).map((p) => p.number)).toEqual(criticas[n]);
      expect(forma.config.criticalQuestionIds).toHaveLength(4);
      expect(forma.config.passScore).toBe(8);
      expect(forma.config.version).toMatch(/forma B \(propuesta\)/);
      for (const p of forma.preguntas) {
        expect(p.options).toHaveLength(3);
        expect(p.options.map((o) => o.id)).toContain(claveFormaB[n][p.id]);
        expect(ep.herramientas).toContain(p.recovery.toolId);
      }
      // La clave no viaja dentro de las preguntas.
      expect(JSON.stringify(forma.preguntas)).not.toMatch(/"(correct\w*|clave|key)":/i);
    }
  });
});

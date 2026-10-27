// Forma alternativa B de la evaluación de cada módulo (documento de respuestas revisadas, 23/10/2026, punto 1.5 y anexo C).
// Estado: banco inicial PROPUESTO, pendiente de validación del Punto Focal y cotejo de equivalencia con la forma A.
// Uso: solo en modo demostración, para los nuevos intentos. El registro sigue usando la forma A del servidor
// hasta que esta forma se valide, se versione y se genere su banco en supabase/migrations.

import type { AssessmentConfig, Question, ToolId } from '../types';
import { itemsFormaB } from './items';

export const ESTADO_FORMA_B = 'propuesta' as const;

export const avisoFormaB =
  'Este nuevo intento usa la forma B: diez preguntas distintas sobre las mismas competencias. Es un banco inicial propuesto, pendiente de validación del Punto Focal; no se presenta como equivalente validado y no se registra.';

/** Herramienta temática para la recuperación de cada pregunta crítica de la forma B (número de pregunta → herramienta). */
const herramientaCritica: Record<number, Record<number, ToolId>> = {
  1: { 2: 'escucha', 3: 'apoyos', 4: 'seguridad', 6: 'ruta' },
  2: { 2: 'm2-escucha', 3: 'm2-familia', 4: 'm2-reporte', 6: 'm2-necesidades' },
  3: { 2: 'm3-supervision', 4: 'm3-visitas', 6: 'm3-transporte', 8: 'm3-transporte' },
  4: { 2: 'm4-compartir', 5: 'm4-exposicion', 6: 'm4-accesos', 7: 'm4-contener' },
  5: { 2: 'm5-ruta', 4: 'm5-reporte', 6: 'm5-represalias', 8: 'm5-represalias' },
  6: { 2: 'm6-decisiones', 4: 'm6-comunicacion', 5: 'm6-copias', 6: 'm6-archivo' },
};

export interface FormaEvaluacion {
  forma: 'A' | 'B';
  config: AssessmentConfig;
  preguntas: Question[];
}

/**
 * Construye la forma B de un módulo a partir de su forma A: reutiliza episodeId y umbral,
 * y toma la escena de práctica de la misma posición solo como referencia técnica
 * (en el resultado no se muestra como caso de recuperación, porque el tema puede no coincidir).
 */
export function construirFormaB(numeroModulo: number, configA: AssessmentConfig, preguntasA: Question[]): FormaEvaluacion {
  const datos = itemsFormaB[numeroModulo as 1 | 2 | 3 | 4 | 5 | 6];
  if (!datos) throw new Error(`No hay forma B para el módulo ${numeroModulo}`);
  const preguntas: Question[] = datos.items.map((it) => {
    const id = `M${numeroModulo}_B${String(it.numero).padStart(2, '0')}`;
    const ref = preguntasA.find((p) => p.number === it.numero) ?? preguntasA[0]!;
    return {
      id,
      number: it.numero,
      title: it.competencia,
      stem: it.enunciado,
      options: it.opciones.map((text, i) => ({ id: `${id}-${'ABC'[i]}`, text })),
      critical: it.critica,
      criterion: it.competencia,
      explanation: it.retroalimentacion,
      recovery: { ...ref.recovery, toolId: herramientaCritica[numeroModulo]?.[it.numero] ?? ref.recovery.toolId },
      sinCasoRecuperacion: true,
    };
  });
  return {
    forma: 'B',
    config: {
      ...configA,
      version: `${configA.version} · forma B (propuesta)`,
      criticalQuestionIds: preguntas.filter((p) => p.critical).map((p) => p.id),
    },
    preguntas,
  };
}

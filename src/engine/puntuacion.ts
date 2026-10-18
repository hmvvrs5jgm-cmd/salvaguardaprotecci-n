// Cálculo de la evaluación. Es la referencia de la regla pedagógica provisional:
// aprobado ⇔ puntaje ≥ passScore Y todas las críticas correctas (condiciones simultáneas).
// En modo registro, el servidor aplica la misma regla en SQL (supabase/migrations) y es la única fuente oficial.

import type { AnswerKey, AssessmentConfig } from '../content/types';

export interface ResultadoEvaluacion {
  score: number;
  total: number;
  criticalOk: boolean;
  failedCritical: string[];
  passed: boolean;
  perQuestion: Record<string, { correct: boolean; selected: string; correctOption: string }>;
  estado: 'aprobado' | 'critico_fallido' | 'insuficiente';
}

export class RespuestasInvalidas extends Error {}

export function validarRespuestas(
  answers: Record<string, string>,
  questionOptions: Record<string, string[]>,
): void {
  const qids = Object.keys(questionOptions);
  const given = Object.keys(answers);
  const faltan = qids.filter((q) => !(q in answers));
  if (faltan.length > 0) throw new RespuestasInvalidas(`Faltan respuestas: ${faltan.join(', ')}`);
  const ajenas = given.filter((q) => !(q in questionOptions));
  if (ajenas.length > 0) throw new RespuestasInvalidas(`Preguntas ajenas al intento: ${ajenas.join(', ')}`);
  for (const q of qids) {
    const sel = answers[q];
    if (typeof sel !== 'string' || !questionOptions[q]!.includes(sel)) {
      throw new RespuestasInvalidas(`Opción ajena a la pregunta ${q}`);
    }
  }
}

export function puntuar(
  answers: Record<string, string>,
  key: AnswerKey,
  cfg: Pick<AssessmentConfig, 'passScore' | 'criticalQuestionIds'>,
): ResultadoEvaluacion {
  const perQuestion: ResultadoEvaluacion['perQuestion'] = {};
  let score = 0;
  for (const [qid, correctOption] of Object.entries(key)) {
    const selected = answers[qid] ?? '';
    const correct = selected === correctOption;
    if (correct) score += 1;
    perQuestion[qid] = { correct, selected, correctOption };
  }
  const failedCritical = cfg.criticalQuestionIds.filter((q) => !perQuestion[q]?.correct);
  const criticalOk = failedCritical.length === 0;
  const passed = score >= cfg.passScore && criticalOk;
  const estado = passed ? 'aprobado' : score >= cfg.passScore ? 'critico_fallido' : 'insuficiente';
  return { score, total: Object.keys(key).length, criticalOk, failedCritical, passed, perQuestion, estado };
}

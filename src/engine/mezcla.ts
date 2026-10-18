// Mezcla de preguntas y opciones mediante IDs. La correspondencia con la clave no cambia
// porque la clave se indexa por ID de opción, nunca por posición o letra.

import type { Question } from '../content/types';

export type Rng = () => number;

/** Generador determinista (mulberry32) para pruebas reproducibles. */
export function rngConSemilla(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngSeguro(): Rng {
  return () => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0]! / 4294967296;
  };
}

export function barajar<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export interface OrdenIntento {
  questionOrder: string[];
  optionOrder: Record<string, string[]>;
}

export function crearOrden(preguntas: Question[], rng: Rng, mezclarPreguntas = false): OrdenIntento {
  const ids = preguntas.map((p) => p.id);
  const optionOrder: Record<string, string[]> = {};
  for (const p of preguntas) optionOrder[p.id] = barajar(p.options.map((o) => o.id), rng);
  return { questionOrder: mezclarPreguntas ? barajar(ids, rng) : ids, optionOrder };
}

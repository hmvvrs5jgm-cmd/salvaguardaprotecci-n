// Validación del grafo narrativo (prompt, apartado 5.1): destinos inexistentes, nodos inaccesibles,
// IDs duplicados, decisiones sin opción adecuada, ciclos sin salida, ausencia de final y cobertura de roles.

import type { ChoiceDecision, Episode, NodeId, Option, RoleId, SceneId } from '../content/types';
import { ROLES } from '../content/types';
import { escenaDe } from './practica';

export interface ProblemaGrafo {
  tipo:
    | 'destino_inexistente'
    | 'nodo_inaccesible'
    | 'id_duplicado'
    | 'sin_opcion_adecuada'
    | 'ciclo_sin_salida'
    | 'sin_final'
    | 'variante_rol_incompleta'
    | 'complemento_invalido'
    | 'insignia_invalida';
  detalle: string;
}

const FINAL: NodeId = 'CIERRE';

/** Opciones que permiten salir de la decisión hacia otro nodo. */
export function destinosDeOpcion(o: Option): NodeId[] {
  switch (o.outcome.type) {
    case 'avanza':
    case 'repara_y_avanza':
    case 'complementa_y_avanza':
    case 'redirige_a_reparacion':
      return [o.outcome.next];
    default:
      return [];
  }
}

export function destinosDeEscena(ep: Episode, id: SceneId): NodeId[] {
  const d = escenaDe(ep, id).decision;
  switch (d.kind) {
    case 'cards':
    case 'continuar':
    case 'solicitudes':
      return [d.next];
    case 'checklist':
      return d.alternative ? [d.next, d.alternative.next] : [d.next];
    case 'choice':
      return d.options.flatMap(destinosDeOpcion);
    case 'variante':
      return d.opciones.map((o) => o.next);
  }
}

export function textoParaRol(t: Option['label'], rol: RoleId): string {
  return typeof t === 'string' ? t : t[rol];
}

export function validarGrafo(ep: Episode): ProblemaGrafo[] {
  const problemas: ProblemaGrafo[] = [];
  const nodos = new Set<string>([...Object.keys(ep.scenes), FINAL]);

  // IDs duplicados (escenas, decisiones, opciones, tarjetas, líneas)
  const vistos = new Map<string, string>();
  const registrar = (id: string, donde: string) => {
    if (vistos.has(id)) problemas.push({ tipo: 'id_duplicado', detalle: `${id} en ${donde} y ${vistos.get(id)}` });
    else vistos.set(id, donde);
  };
  for (const s of Object.values(ep.scenes)) {
    registrar(s.id, 'escena');
    registrar(s.decision.id, `decisión de ${s.id}`);
    s.intro.forEach((l) => registrar(l.id, `línea de ${s.id}`));
    s.outro?.forEach((l) => registrar(l.id, `línea final de ${s.id}`));
    if (s.decision.kind === 'choice') {
      for (const o of s.decision.options) {
        registrar(o.id, `opción de ${s.decision.id}`);
        o.consequence.forEach((l) => registrar(l.id, `consecuencia de ${o.id}`));
        if (o.outcome.type === 'repara_y_avanza') {
          o.outcome.repair.forEach((l) => registrar(l.id, `reparación de ${o.id}`));
          o.outcome.repairFollowUp?.forEach((l) => registrar(l.id, `reparación de ${o.id}`));
        }
        if (o.outcome.type === 'complementa_y_avanza') {
          o.outcome.complement.forEach((l) => registrar(l.id, `complemento de ${o.id}`));
        }
      }
    } else if (s.decision.kind === 'cards') {
      s.decision.cards.forEach((c) => registrar(c.id, `tarjeta de ${s.decision.id}`));
    } else if (s.decision.kind === 'checklist') {
      s.decision.items.forEach((i) => registrar(i.id, `condición de ${s.decision.id}`));
    } else if (s.decision.kind === 'variante') {
      s.decision.opciones.forEach((o) => registrar(o.id, `variante de ${s.decision.id}`));
    } else if (s.decision.kind === 'solicitudes') {
      for (const sol of s.decision.solicitudes) {
        registrar(sol.id, `solicitud de ${s.decision.id}`);
        sol.opciones.forEach((o) => registrar(o.id, `opción de ${sol.id}`));
      }
    }
  }
  ep.closing.lines.forEach((l) => registrar(l.id, 'cierre'));
  ep.closing.variantes?.forEach((v) => {
    v.lines.forEach((l) => registrar(l.id, `cierre tras ${v.siVisitada}`));
    if (!(v.siVisitada in ep.scenes)) problemas.push({ tipo: 'destino_inexistente', detalle: `cierre: ${v.siVisitada}` });
  });
  for (const s of Object.values(ep.scenes)) s.consultas?.forEach((c) => c.lines.forEach((l) => registrar(l.id, `consulta de ${s.id}`)));

  // Insignias: cada decisión requerida existe
  const decisiones = new Set(Object.values(ep.scenes).map((s) => s.decision.id));
  for (const b of ep.badges) {
    for (const d of b.decisions.flat()) {
      if (!decisiones.has(d)) problemas.push({ tipo: 'insignia_invalida', detalle: `${b.id}: ${d}` });
    }
  }

  // Destinos inexistentes
  for (const s of Object.values(ep.scenes)) {
    for (const dest of destinosDeEscena(ep, s.id)) {
      if (!nodos.has(dest)) problemas.push({ tipo: 'destino_inexistente', detalle: `${s.id} → ${dest}` });
    }
    if (!(ep.order as string[]).includes(s.id)) {
      problemas.push({ tipo: 'nodo_inaccesible', detalle: `${s.id} no figura en el orden del episodio` });
    }
  }

  // Decisiones sin opción adecuada (que avance) y complementos válidos
  for (const s of Object.values(ep.scenes)) {
    const d = s.decision;
    if (d.kind === 'choice') {
      if (!d.options.some((o) => o.outcome.type === 'avanza')) {
        problemas.push({ tipo: 'sin_opcion_adecuada', detalle: d.id });
      }
      for (const o of d.options) {
        if (o.outcome.type === 'complementa_y_avanza') {
          const comp = (d as ChoiceDecision).options.find((x) => x.id === (o.outcome as { complementOptionId: string }).complementOptionId);
          if (!comp || comp.outcome.type !== 'avanza') {
            problemas.push({ tipo: 'complemento_invalido', detalle: `${o.id} remite a una opción que no avanza` });
          }
        }
        if (typeof o.label !== 'string') {
          for (const r of ROLES) {
            if (!o.label[r] || o.label[r].trim() === '') {
              problemas.push({ tipo: 'variante_rol_incompleta', detalle: `${o.id} sin texto para ${r}` });
            }
          }
        }
      }
    } else if (d.kind === 'cards' && d.cards.some((c) => c.soloSiVisitada && !(c.soloSiVisitada in ep.scenes))) {
      problemas.push({ tipo: 'destino_inexistente', detalle: `${d.id}: tarjeta condicional` });
    } else if (d.kind === 'cards' && !d.cards.some((c) => c.include)) {
      problemas.push({ tipo: 'sin_opcion_adecuada', detalle: d.id });
    } else if (d.kind === 'checklist' && d.items.length === 0) {
      problemas.push({ tipo: 'sin_opcion_adecuada', detalle: d.id });
    } else if (d.kind === 'solicitudes') {
      for (const sol of d.solicitudes) {
        if (sol.opciones.filter((o) => o.correcta).length !== 1) problemas.push({ tipo: 'sin_opcion_adecuada', detalle: sol.id });
      }
    }
  }

  // Accesibilidad desde el inicio y llegada al final
  const alcanzables = new Set<string>();
  const pila: string[] = [ep.start];
  while (pila.length) {
    const n = pila.pop()!;
    if (alcanzables.has(n)) continue;
    alcanzables.add(n);
    if (n !== FINAL && n in ep.scenes) pila.push(...destinosDeEscena(ep, n as SceneId).filter((x) => nodos.has(x)));
  }
  for (const id of Object.keys(ep.scenes)) {
    if (!alcanzables.has(id)) problemas.push({ tipo: 'nodo_inaccesible', detalle: id });
  }
  if (!alcanzables.has(FINAL)) problemas.push({ tipo: 'sin_final', detalle: 'CIERRE no es alcanzable desde el inicio' });

  // Ciclos sin salida: todo nodo alcanzable debe poder llegar al final
  const llegaAlFinal = new Set<string>([FINAL]);
  let cambio = true;
  while (cambio) {
    cambio = false;
    for (const id of Object.keys(ep.scenes)) {
      if (llegaAlFinal.has(id)) continue;
      if (destinosDeEscena(ep, id as SceneId).some((d) => llegaAlFinal.has(d))) {
        llegaAlFinal.add(id);
        cambio = true;
      }
    }
  }
  for (const id of alcanzables) {
    if (!llegaAlFinal.has(id)) problemas.push({ tipo: 'ciclo_sin_salida', detalle: id });
  }

  return problemas;
}

/** Recorrido de referencia por la opción que avanza en cada decisión, para un rol. */
export function recorridoAdecuado(ep: Episode, rol: RoleId): Array<{ scene: SceneId; label: string }> {
  const out: Array<{ scene: SceneId; label: string }> = [];
  let n: NodeId = ep.start;
  const guard = new Set<string>();
  while (n !== 'CIERRE' && !guard.has(n)) {
    guard.add(n);
    const s = escenaDe(ep, n);
    if (s.decision.kind === 'variante') {
      const primera = s.decision.opciones[0];
      if (!primera) break;
      out.push({ scene: s.id, label: primera.label });
      n = primera.next;
      continue;
    }
    if (s.decision.kind !== 'choice') {
      out.push({ scene: s.id, label: s.decision.kind === 'continuar' ? s.decision.label : s.decision.kind });
      n = s.decision.next;
      continue;
    }
    const o = s.decision.options.find((x) => x.outcome.type === 'avanza');
    if (!o) break;
    out.push({ scene: s.id, label: textoParaRol(o.label, rol) });
    n = (o.outcome as { next: NodeId }).next;
  }
  return out;
}

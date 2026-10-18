// Estado de la práctica narrativa como reductor puro, compartido por el modo gráfico y la versión de lectura.
// Solo se guarda localmente: rol, escena actual, decisiones resueltas (para insignias), herramientas consultadas
// e insignias. No se guardan las opciones elegidas ni se envía nada al servidor.

import type {
  CardsDecision,
  ChoiceDecision,
  DecisionId,
  Episode,
  NodeId,
  Option,
  RoleId,
  Scene,
  ToolId,
} from '../content/types';

export type Paso =
  | { kind: 'intro'; index: number }
  | { kind: 'decision' }
  | { kind: 'feedback'; optionId: string; repairShown: boolean }
  | { kind: 'cards'; selected: string[]; checked: CardsCheck | null }
  | { kind: 'outro'; next: NodeId };

export interface CardsCheck {
  missing: boolean;
  extra: boolean;
  ok: boolean;
}

export interface EstadoPractica {
  episodeId: string;
  contentVersion: string;
  role: RoleId | null;
  node: NodeId;
  paso: Paso;
  resolved: DecisionId[];
  toolsViewed: ToolId[];
  badges: string[];
}

export type Accion =
  | { type: 'ELEGIR_ROL'; role: RoleId }
  | { type: 'CAMBIAR_ROL'; role: RoleId }
  | { type: 'CONTINUAR' }
  | { type: 'SALTAR_INTRO' }
  | { type: 'ELEGIR_OPCION'; optionId: string }
  | { type: 'MOSTRAR_REPARACION' }
  | { type: 'ALTERNAR_TARJETA'; cardId: string }
  | { type: 'COMPROBAR_TARJETAS' }
  | { type: 'VER_HERRAMIENTA'; toolId: ToolId }
  | { type: 'REINICIAR' };

export function estadoInicial(ep: Episode): EstadoPractica {
  return {
    episodeId: ep.id,
    contentVersion: ep.version,
    role: null,
    node: ep.start,
    paso: { kind: 'intro', index: 0 },
    resolved: [],
    toolsViewed: [],
    badges: [],
  };
}

export function escenaActual(ep: Episode, s: EstadoPractica): Scene | null {
  return s.node === 'CIERRE' ? null : ep.scenes[s.node];
}

export function opcionElegida(ep: Episode, s: EstadoPractica): Option | null {
  const sc = escenaActual(ep, s);
  if (!sc || sc.decision.kind !== 'choice' || s.paso.kind !== 'feedback') return null;
  const id = s.paso.optionId;
  return sc.decision.options.find((o) => o.id === id) ?? null;
}

/** Paso inicial al entrar en una escena: intro si hay líneas; si no, decisión directamente. */
function pasoDeEntrada(ep: Episode, node: NodeId): Paso {
  if (node === 'CIERRE') return { kind: 'intro', index: 0 };
  const sc = ep.scenes[node];
  if (sc.intro.length > 0) return { kind: 'intro', index: 0 };
  return pasoDecision(sc);
}

function pasoDecision(sc: Scene): Paso {
  return sc.decision.kind === 'cards' ? { kind: 'cards', selected: [], checked: null } : { kind: 'decision' };
}

function conInsignias(ep: Episode, s: EstadoPractica): EstadoPractica {
  const badges = new Set(s.badges);
  for (const b of ep.badges) if (b.decisions.every((d) => s.resolved.includes(d))) badges.add(b.id);
  return { ...s, badges: ep.badges.map((b) => b.id).filter((id) => badges.has(id)) };
}

function resolverYSalir(ep: Episode, s: EstadoPractica, next: NodeId): EstadoPractica {
  const sc = escenaActual(ep, s)!;
  const resolved = s.resolved.includes(sc.decision.id) ? s.resolved : [...s.resolved, sc.decision.id];
  const base = conInsignias(ep, { ...s, resolved });
  if (sc.outro && sc.outro.length > 0) return { ...base, paso: { kind: 'outro', next } };
  return { ...base, node: next, paso: pasoDeEntrada(ep, next) };
}

export function comprobarTarjetas(d: CardsDecision, selected: string[]): CardsCheck {
  const requeridas = d.cards.filter((c) => c.include).map((c) => c.id);
  const missing = requeridas.some((id) => !selected.includes(id));
  const extra = selected.some((id) => !requeridas.includes(id));
  return { missing, extra, ok: !missing && !extra };
}

export function reducir(ep: Episode, s: EstadoPractica, a: Accion): EstadoPractica {
  switch (a.type) {
    case 'ELEGIR_ROL':
      return { ...s, role: a.role, node: ep.start, paso: pasoDeEntrada(ep, ep.start) };
    case 'CAMBIAR_ROL':
      // El recorrido se reinicia desde E01; se conservan herramientas e insignias.
      return { ...s, role: a.role, node: ep.start, paso: pasoDeEntrada(ep, ep.start) };
    case 'REINICIAR':
      return estadoInicial(ep);
    case 'VER_HERRAMIENTA':
      return s.toolsViewed.includes(a.toolId) ? s : { ...s, toolsViewed: [...s.toolsViewed, a.toolId] };
  }

  if (s.role === null) return s;
  const sc = escenaActual(ep, s);
  if (!sc) return s; // CIERRE: no hay más pasos narrativos.

  switch (a.type) {
    case 'CONTINUAR': {
      const p = s.paso;
      if (p.kind === 'intro') {
        if (p.index + 1 < sc.intro.length) return { ...s, paso: { kind: 'intro', index: p.index + 1 } };
        return { ...s, paso: pasoDecision(sc) };
      }
      if (p.kind === 'outro') return { ...s, node: p.next, paso: pasoDeEntrada(ep, p.next) };
      if (p.kind === 'feedback') {
        const o = opcionElegida(ep, s);
        if (!o) return s;
        switch (o.outcome.type) {
          case 'avanza':
          case 'complementa_y_avanza':
            return resolverYSalir(ep, s, o.outcome.next);
          case 'repara_y_avanza':
            // La reparación es obligatoria antes de avanzar.
            if (!p.repairShown) return s;
            return resolverYSalir(ep, s, o.outcome.next);
          case 'pausa_y_vuelve':
          case 'reintenta':
            return { ...s, paso: { kind: 'decision' } };
        }
      }
      if (p.kind === 'cards') {
        if (sc.decision.kind !== 'cards' || !p.checked?.ok) return s;
        return resolverYSalir(ep, s, sc.decision.next);
      }
      return s;
    }
    case 'SALTAR_INTRO': {
      // Versión de lectura: la introducción se muestra completa junto a la decisión.
      if (s.paso.kind !== 'intro') return s;
      return { ...s, paso: pasoDecision(sc) };
    }
    case 'ELEGIR_OPCION': {
      if (s.paso.kind !== 'decision' || sc.decision.kind !== 'choice') return s;
      const d: ChoiceDecision = sc.decision;
      if (!d.options.some((o) => o.id === a.optionId)) return s;
      return { ...s, paso: { kind: 'feedback', optionId: a.optionId, repairShown: false } };
    }
    case 'MOSTRAR_REPARACION': {
      if (s.paso.kind !== 'feedback') return s;
      return { ...s, paso: { ...s.paso, repairShown: true } };
    }
    case 'ALTERNAR_TARJETA': {
      if (s.paso.kind !== 'cards' || sc.decision.kind !== 'cards') return s;
      if (!sc.decision.cards.some((c) => c.id === a.cardId)) return s;
      const sel = s.paso.selected.includes(a.cardId)
        ? s.paso.selected.filter((x) => x !== a.cardId)
        : [...s.paso.selected, a.cardId];
      return { ...s, paso: { kind: 'cards', selected: sel, checked: null } };
    }
    case 'COMPROBAR_TARJETAS': {
      if (s.paso.kind !== 'cards' || sc.decision.kind !== 'cards') return s;
      return { ...s, paso: { ...s.paso, checked: comprobarTarjetas(sc.decision, s.paso.selected) } };
    }
  }
}

/** Progreso visible: posición de la escena en el recorrido. */
export function progreso(ep: Episode, s: EstadoPractica): { actual: number; total: number } {
  const total = ep.order.length;
  if (s.node === 'CIERRE') return { actual: total, total };
  return { actual: ep.order.indexOf(s.node) + 1, total };
}

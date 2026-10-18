// Progreso anónimo en el dispositivo, con control de versión de contenido.
// Toda lectura y escritura tolera que el almacenamiento no esté disponible.

import type { Episode } from '../content/types';
import { estadoInicial, type EstadoPractica } from './practica';

const CLAVE = 'dqp:progreso';
const CLAVE_PREFS = 'dqp:preferencias';

export interface Almacen {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

function almacenPorDefecto(): Almacen | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export type CargaProgreso =
  | { estado: 'nuevo'; progreso: EstadoPractica }
  | { estado: 'recuperado'; progreso: EstadoPractica }
  | { estado: 'version_distinta'; progreso: EstadoPractica; versionGuardada: string };

export function cargarProgreso(ep: Episode, store: Almacen | null = almacenPorDefecto()): CargaProgreso {
  const inicial = estadoInicial(ep);
  if (!store) return { estado: 'nuevo', progreso: inicial };
  let raw: string | null = null;
  try {
    raw = store.getItem(CLAVE);
  } catch {
    return { estado: 'nuevo', progreso: inicial };
  }
  if (!raw) return { estado: 'nuevo', progreso: inicial };
  try {
    const data = JSON.parse(raw) as Partial<EstadoPractica>;
    if (data.episodeId !== ep.id || data.contentVersion !== ep.version) {
      return { estado: 'version_distinta', progreso: inicial, versionGuardada: String(data.contentVersion ?? '?') };
    }
    const nodoValido = data.node === 'CIERRE' || (typeof data.node === 'string' && data.node in ep.scenes);
    if (!nodoValido) return { estado: 'nuevo', progreso: inicial };
    const progreso: EstadoPractica = {
      ...inicial,
      role: data.role === 'cf' || data.role === 'socio' ? data.role : null,
      node: data.node!,
      // Al recuperar se retoma al inicio de la escena: no se guardan las opciones elegidas.
      paso: { kind: 'intro', index: 0 },
      resolved: Array.isArray(data.resolved) ? data.resolved.filter((d) => typeof d === 'string') : [],
      toolsViewed: Array.isArray(data.toolsViewed) ? data.toolsViewed : [],
      badges: Array.isArray(data.badges) ? data.badges : [],
    };
    if (progreso.node !== 'CIERRE' && ep.scenes[progreso.node].intro.length === 0) {
      const d = ep.scenes[progreso.node].decision;
      progreso.paso = d.kind === 'cards' ? { kind: 'cards', selected: [], checked: null } : { kind: 'decision' };
    }
    return { estado: 'recuperado', progreso };
  } catch {
    return { estado: 'nuevo', progreso: inicial };
  }
}

export function guardarProgreso(s: EstadoPractica, store: Almacen | null = almacenPorDefecto()): void {
  if (!store) return;
  const { episodeId, contentVersion, role, node, resolved, toolsViewed, badges } = s;
  try {
    store.setItem(CLAVE, JSON.stringify({ episodeId, contentVersion, role, node, resolved, toolsViewed, badges }));
  } catch {
    /* almacenamiento no disponible: el juego sigue funcionando sin guardar */
  }
}

export function borrarProgreso(store: Almacen | null = almacenPorDefecto()): void {
  try {
    store?.removeItem(CLAVE);
  } catch {
    /* sin almacenamiento */
  }
}

export interface Preferencias {
  textoGrande: boolean;
  movimientoReducido: boolean;
  altoContraste: boolean;
  sonido: boolean;
  adultoConfirmado: boolean;
}

export const preferenciasPorDefecto: Preferencias = {
  textoGrande: false,
  movimientoReducido: false,
  altoContraste: false,
  sonido: false,
  adultoConfirmado: false,
};

export function cargarPreferencias(store: Almacen | null = almacenPorDefecto()): Preferencias {
  try {
    const raw = store?.getItem(CLAVE_PREFS);
    if (!raw) return preferenciasPorDefecto;
    return { ...preferenciasPorDefecto, ...(JSON.parse(raw) as Partial<Preferencias>) };
  } catch {
    return preferenciasPorDefecto;
  }
}

export function guardarPreferencias(p: Preferencias, store: Almacen | null = almacenPorDefecto()): void {
  try {
    store?.setItem(CLAVE_PREFS, JSON.stringify(p));
  } catch {
    /* sin almacenamiento */
  }
}

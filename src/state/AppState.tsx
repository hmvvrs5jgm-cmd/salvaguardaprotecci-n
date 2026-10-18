import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { episodio1 } from '../content/episodio1';
import type { Episode } from '../content/types';
import {
  borrarProgreso,
  cargarPreferencias,
  cargarProgreso,
  guardarPreferencias,
  guardarProgreso,
  type CargaProgreso,
  type Preferencias,
} from '../engine/almacen';
import { estadoInicial, reducir, type Accion, type EstadoPractica } from '../engine/practica';

interface Ctx {
  ep: Episode;
  estado: EstadoPractica;
  despachar: (a: Accion) => void;
  carga: CargaProgreso['estado'];
  versionGuardada: string | null;
  descartarAviso: () => void;
  borrar: () => void;
  prefs: Preferencias;
  setPrefs: (p: Partial<Preferencias>) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStateProvider({ children, episodio = episodio1 }: { children: ReactNode; episodio?: Episode }) {
  const [inicial] = useState(() => cargarProgreso(episodio));
  const [carga, setCarga] = useState<CargaProgreso['estado']>(inicial.estado);
  const versionGuardada = inicial.estado === 'version_distinta' ? inicial.versionGuardada : null;
  const [estado, despachar] = useReducer((s: EstadoPractica, a: Accion) => reducir(episodio, s, a), inicial.progreso);
  const [prefs, setPrefsState] = useState<Preferencias>(() => cargarPreferencias());

  useEffect(() => {
    // Con versión distinta no se sobrescribe hasta que la persona decida reiniciar.
    if (carga !== 'version_distinta') guardarProgreso(estado);
  }, [estado, carga]);

  useEffect(() => {
    guardarPreferencias(prefs);
    const root = document.documentElement;
    root.dataset.texto = prefs.textoGrande ? 'grande' : 'normal';
    root.dataset.contraste = prefs.altoContraste ? 'alto' : 'normal';
    root.dataset.movimiento = prefs.movimientoReducido ? 'reducido' : 'normal';
  }, [prefs]);

  const setPrefs = useCallback((p: Partial<Preferencias>) => setPrefsState((x) => ({ ...x, ...p })), []);
  const borrar = useCallback(() => {
    borrarProgreso();
    despachar({ type: 'REINICIAR' });
    setCarga('nuevo');
  }, []);
  const descartarAviso = useCallback(() => setCarga('nuevo'), []);

  const value = useMemo(
    () => ({ ep: episodio, estado, despachar, carga, versionGuardada, descartarAviso, borrar, prefs, setPrefs }),
    [episodio, estado, carga, versionGuardada, descartarAviso, borrar, prefs, setPrefs],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp fuera de AppStateProvider');
  return c;
}

export { estadoInicial };

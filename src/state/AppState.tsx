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

// Preferencias globales (accesibilidad, confirmación de mayoría de edad y último rol elegido).

interface PrefsCtx {
  prefs: Preferencias;
  setPrefs: (p: Partial<Preferencias>) => void;
}

const PrefsContext = createContext<PrefsCtx | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Preferencias>(() => cargarPreferencias());
  useEffect(() => {
    guardarPreferencias(prefs);
    const root = document.documentElement;
    root.dataset.texto = prefs.textoGrande ? 'grande' : 'normal';
    root.dataset.contraste = prefs.altoContraste ? 'alto' : 'normal';
    root.dataset.movimiento = prefs.movimientoReducido ? 'reducido' : 'normal';
  }, [prefs]);
  const setPrefs = useCallback((p: Partial<Preferencias>) => setPrefsState((x) => ({ ...x, ...p })), []);
  const value = useMemo(() => ({ prefs, setPrefs }), [prefs, setPrefs]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsCtx {
  const c = useContext(PrefsContext);
  if (!c) throw new Error('usePrefs fuera de PrefsProvider');
  return c;
}

// Estado de práctica de un módulo. Cada módulo guarda su progreso con su propia clave.

interface Ctx extends PrefsCtx {
  ep: Episode;
  estado: EstadoPractica;
  despachar: (a: Accion) => void;
  carga: CargaProgreso['estado'];
  versionGuardada: string | null;
  descartarAviso: () => void;
  borrar: () => void;
  /** Ruta absoluta dentro del módulo, p. ej. enlace('jugar') → «/m2/jugar». */
  enlace: (sub?: string) => string;
}

const AppCtx = createContext<Ctx | null>(null);

export function EpisodioProvider({ children, episodio }: { children: ReactNode; episodio: Episode }) {
  const { prefs, setPrefs } = usePrefs();
  const [inicial] = useState(() => cargarProgreso(episodio));
  const [carga, setCarga] = useState<CargaProgreso['estado']>(inicial.estado);
  const versionGuardada = inicial.estado === 'version_distinta' ? inicial.versionGuardada : null;
  const [estado, despacharBase] = useReducer((s: EstadoPractica, a: Accion) => reducir(episodio, s, a), inicial.progreso);

  useEffect(() => {
    // Con versión distinta no se sobrescribe hasta que la persona decida reiniciar.
    if (carga !== 'version_distinta') guardarProgreso(episodio, estado);
  }, [episodio, estado, carga]);

  const despachar = useCallback(
    (a: Accion) => {
      if (a.type === 'ELEGIR_ROL' || a.type === 'CAMBIAR_ROL') setPrefs({ ultimoRol: a.role });
      despacharBase(a);
    },
    [setPrefs],
  );
  const borrar = useCallback(() => {
    borrarProgreso(episodio);
    despacharBase({ type: 'REINICIAR' });
    setCarga('nuevo');
  }, [episodio]);
  const descartarAviso = useCallback(() => setCarga('nuevo'), []);
  const enlace = useCallback((sub?: string) => `/${episodio.ruta}${sub ? `/${sub}` : ''}`, [episodio.ruta]);

  const value = useMemo(
    () => ({ ep: episodio, estado, despachar, carga, versionGuardada, descartarAviso, borrar, prefs, setPrefs, enlace }),
    [episodio, estado, despachar, carga, versionGuardada, descartarAviso, borrar, prefs, setPrefs, enlace],
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

/** Preferencias y módulo 1 por defecto (pruebas y compatibilidad). */
export function AppStateProvider({ children, episodio = episodio1 }: { children: ReactNode; episodio?: Episode }) {
  return (
    <PrefsProvider>
      <EpisodioProvider episodio={episodio}>{children}</EpisodioProvider>
    </PrefsProvider>
  );
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp fuera de EpisodioProvider');
  return c;
}

/** Estado del módulo si la pantalla está dentro de uno; null en las pantallas generales. */
export function useAppOpcional(): Ctx | null {
  return useContext(AppCtx);
}

export { estadoInicial };

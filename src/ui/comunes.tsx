import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { etiquetaReferente } from '../config/canales';
import { config } from '../config/modo';
import type { Line, RoleId, RoleText, Speaker } from '../content/types';

export const textoRol = (t: RoleText, rol: RoleId | null): string => (typeof t === 'string' ? t : t[rol ?? 'cf']);

export function nombreHablante(s: Speaker, rol: RoleId | null): string | null {
  switch (s) {
    case 'mariela':
      return 'Mariela';
    case 'elena':
      return 'Elena';
    case 'lucia':
      return 'Lucía';
    case 'profesional':
      return 'Profesional de atención';
    case 'nicolas':
      return 'Nicolás';
    case 'camila':
      return 'Camila';
    case 'diego':
      return 'Diego';
    case 'visitante':
      return 'Visitante';
    case 'comunicaciones':
      return 'Comunicaciones (mensaje ficticio)';
    case 'colega':
      return 'Colega';
    case 'tu':
      return 'Tú';
    case 'referente':
      return etiquetaReferente[rol ?? 'cf'];
    default:
      return null;
  }
}

export function Linea({ linea, rol }: { linea: Line; rol: RoleId | null }) {
  const nombre = nombreHablante(linea.speaker, rol);
  const texto = textoRol(linea.text, rol);
  if (!nombre) return <p className="linea linea--narracion">{texto}</p>;
  return (
    <p className={`linea linea--${linea.speaker}`}>
      <span className="linea__hablante">{nombre}:</span> <span className="linea__texto">«{texto}»</span>
    </p>
  );
}

/** Mueve el foco al elemento cuando cambia la clave (cambio de escena o de paso). */
export function useEnfocar<T extends HTMLElement>(clave: unknown): RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [clave]);
  return ref;
}

// --- Anuncios para lector de pantalla ---

const AnuncioCtx = createContext<(msg: string) => void>(() => {});

export function AnuncioProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const anunciar = useCallback((m: string) => {
    setMsg('');
    window.setTimeout(() => setMsg(m), 30);
  }, []);
  return (
    <AnuncioCtx.Provider value={anunciar}>
      {children}
      <div className="solo-lector" role="status" aria-live="polite" aria-atomic="true" data-testid="anuncio">
        {msg}
      </div>
    </AnuncioCtx.Provider>
  );
}

export const useAnunciar = () => useContext(AnuncioCtx);

// --- Diálogo modal accesible ---

export function Dialogo({
  titulo,
  abierto,
  onCerrar,
  children,
  etiquetaCerrar = 'Cerrar y volver',
}: {
  titulo: string;
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
  etiquetaCerrar?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const previo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!abierto) return;
    previo.current = document.activeElement as HTMLElement | null;
    document.body.classList.add('con-dialogo');
    ref.current?.querySelector<HTMLElement>('h2')?.focus();
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrar();
      }
      if (e.key === 'Tab' && ref.current) {
        const focos = ref.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focos.length === 0) return;
        const primero = focos[0]!;
        const ultimo = focos[focos.length - 1]!;
        if (e.shiftKey && document.activeElement === primero) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primero.focus();
        }
      }
    };
    document.addEventListener('keydown', alTeclear);
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.classList.remove('con-dialogo');
      previo.current?.focus?.();
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;
  return (
    <div className="dialogo__fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className="dialogo" role="dialog" aria-modal="true" aria-labelledby="dialogo-titulo" ref={ref}>
        <div className="dialogo__cabecera">
          <h2 id="dialogo-titulo" tabIndex={-1}>
            {titulo}
          </h2>
          <button type="button" className="boton boton--secundario" onClick={onCerrar}>
            {etiquetaCerrar}
          </button>
        </div>
        <div className="dialogo__cuerpo">{children}</div>
      </div>
    </div>
  );
}

export function BannerDemo({ contexto }: { contexto?: string }) {
  if (config.modo !== 'demo') return null;
  return (
    <p className="banner-demo" role="note">
      <strong>Demostración no registrada.</strong> {contexto ?? 'Ningún resultado de esta versión se guarda en un servidor ni cuenta como aprobación.'}
    </p>
  );
}

export function Encabezado({ children, clave, id }: { children: ReactNode; clave?: unknown; id?: string }) {
  const ref = useEnfocar<HTMLHeadingElement>(clave ?? children);
  return (
    <h1 ref={ref} tabIndex={-1} id={id}>
      {children}
    </h1>
  );
}

import { HashRouter, Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { episodioPorRuta } from './content/episodios';
import { EpisodioProvider, PrefsProvider } from './state/AppState';
import { AnuncioProvider } from './ui/comunes';
import { Inicio } from './screens/Inicio';
import { Portada } from './screens/Portada';
import { Rol } from './screens/Rol';
import { Accesibilidad } from './screens/Accesibilidad';
import { Juego } from './screens/Juego';
import { Repaso } from './screens/Repaso';
import { Evaluacion } from './screens/Evaluacion';
import { Cuenta } from './screens/Cuenta';
import { PuntoFocal } from './screens/PuntoFocal';
import { Comunicar } from './screens/Comunicar';
import { Acerca } from './screens/Acerca';

const titulosModulo: Record<string, string> = {
  '': 'Portada del módulo',
  rol: 'Elegir rol',
  jugar: 'Práctica',
  lectura: 'Versión de lectura',
  repaso: 'Revisar decisiones',
  evaluacion: 'Evaluación',
};

function TituloDocumento() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titulos: Record<string, string> = {
      '/': 'Inicio',
      '/cuenta': 'Cuenta',
      '/punto-focal': 'Punto Focal',
      '/comunicar': 'Comunicar una preocupación real',
      '/accesibilidad': 'Accesibilidad',
      '/acerca': 'Acerca de',
    };
    const [, mod, sub = ''] = pathname.split('/');
    const ep = episodioPorRuta(mod);
    const titulo = titulos[pathname] ?? (ep && sub in titulosModulo ? `${titulosModulo[sub]} · ${ep.rotulo}` : undefined);
    document.title = `${titulo ?? 'Decisiones que protegen'} · Decisiones que protegen`;
  }, [pathname]);
  return null;
}

/** Rutas de un módulo: /m1, /m1/rol, /m1/jugar, /m1/lectura, /m1/repaso, /m1/evaluacion. */
function Modulo() {
  const { mod } = useParams();
  const ep = episodioPorRuta(mod);
  if (!ep) return <Navigate to="/" replace />;
  return (
    <EpisodioProvider key={ep.id} episodio={ep}>
      <Routes>
        <Route index element={<Portada />} />
        <Route path="rol" element={<Rol />} />
        <Route path="jugar" element={<Juego modo="grafico" />} />
        <Route path="lectura" element={<Juego modo="lectura" />} />
        <Route path="repaso" element={<Repaso />} />
        <Route path="evaluacion" element={<Evaluacion />} />
        <Route path="*" element={<Navigate to={`/${ep.ruta}`} replace />} />
      </Routes>
    </EpisodioProvider>
  );
}

/** Rutas anteriores a los módulos (solo existía el módulo 1). */
function Heredada({ sub }: { sub: string }) {
  const { search } = useLocation();
  return <Navigate to={`/m1/${sub}${search}`} replace />;
}

export function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      {['rol', 'jugar', 'lectura', 'repaso', 'evaluacion'].map((s) => (
        <Route key={s} path={`/${s}`} element={<Heredada sub={s} />} />
      ))}
      <Route path="/accesibilidad" element={<Accesibilidad />} />
      <Route path="/cuenta" element={<Cuenta />} />
      <Route path="/punto-focal" element={<PuntoFocal />} />
      <Route path="/comunicar" element={<Comunicar />} />
      <Route path="/acerca" element={<Acerca />} />
      <Route path="/:mod/*" element={<Modulo />} />
      <Route path="*" element={<Inicio />} />
    </Routes>
  );
}

export function Marco({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="saltar" href="#contenido" onClick={(e) => { e.preventDefault(); document.getElementById('contenido')?.focus(); }}>
        Saltar al contenido
      </a>
      <header className="cabecera">
        <Link to="/" className="marca">
          Decisiones que protegen
        </Link>
        <nav aria-label="Principal">
          <ul>
            <li><NavLink to="/" end>Módulos</NavLink></li>
            <li><NavLink to="/accesibilidad">Accesibilidad</NavLink></li>
            <li><NavLink to="/comunicar">Preocupación real</NavLink></li>
          </ul>
        </nav>
      </header>
      <main id="contenido" tabIndex={-1}>
        {children}
      </main>
      <footer className="pie">
        <p>Situaciones ficticias con fines formativos. No ingreses datos ni relatos reales.</p>
      </footer>
    </>
  );
}

export default function App() {
  return (
    <HashRouter future={{ v7_relativeSplatPath: true }}>
      <PrefsProvider>
        <AnuncioProvider>
          <TituloDocumento />
          <Marco>
            <Rutas />
          </Marco>
        </AnuncioProvider>
      </PrefsProvider>
    </HashRouter>
  );
}

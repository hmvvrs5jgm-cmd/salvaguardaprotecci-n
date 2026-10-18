import { HashRouter, Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppStateProvider } from './state/AppState';
import { AnuncioProvider } from './ui/comunes';
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

function TituloDocumento() {
  const { pathname } = useLocation();
  useEffect(() => {
    const titulos: Record<string, string> = {
      '/': 'Inicio',
      '/rol': 'Elegir rol',
      '/jugar': 'Episodio',
      '/lectura': 'Versión de lectura',
      '/repaso': 'Revisar decisiones',
      '/evaluacion': 'Evaluación',
      '/cuenta': 'Cuenta',
      '/punto-focal': 'Punto Focal',
      '/comunicar': 'Comunicar una preocupación real',
      '/accesibilidad': 'Accesibilidad',
      '/acerca': 'Acerca de',
    };
    document.title = `${titulos[pathname] ?? 'Decisiones que protegen'} · Decisiones que protegen`;
  }, [pathname]);
  return null;
}

export function Rutas() {
  return (
    <Routes>
      <Route path="/" element={<Portada />} />
      <Route path="/rol" element={<Rol />} />
      <Route path="/accesibilidad" element={<Accesibilidad />} />
      <Route path="/jugar" element={<Juego modo="grafico" />} />
      <Route path="/lectura" element={<Juego modo="lectura" />} />
      <Route path="/repaso" element={<Repaso />} />
      <Route path="/evaluacion" element={<Evaluacion />} />
      <Route path="/cuenta" element={<Cuenta />} />
      <Route path="/punto-focal" element={<PuntoFocal />} />
      <Route path="/comunicar" element={<Comunicar />} />
      <Route path="/acerca" element={<Acerca />} />
      <Route path="*" element={<Portada />} />
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
      <AppStateProvider>
        <AnuncioProvider>
          <TituloDocumento />
          <Marco>
            <Rutas />
          </Marco>
        </AnuncioProvider>
      </AppStateProvider>
    </HashRouter>
  );
}

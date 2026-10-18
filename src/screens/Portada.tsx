import { Link, useNavigate } from 'react-router-dom';
import { portada } from '../content/episodio1';
import { useApp } from '../state/AppState';
import { BannerDemo, Encabezado } from '../ui/comunes';

export function Portada() {
  const { ep, estado, carga, versionGuardada, borrar, descartarAviso, prefs, setPrefs } = useApp();
  const navegar = useNavigate();
  const hayProgreso = estado.role !== null && carga !== 'version_distinta';

  const comenzar = (destino: '/jugar' | '/lectura') => {
    if (!prefs.adultoConfirmado) return;
    navegar(estado.role ? destino : `/rol?modo=${destino === '/lectura' ? 'lectura' : 'grafico'}`);
  };

  return (
    <div className="pantalla portada">
      <p className="sobretitulo">Episodio {ep.number}</p>
      <Encabezado>{ep.title}</Encabezado>
      <p className="portada__lead">{portada.lead}</p>

      <section className="aviso" aria-labelledby="aviso-titulo">
        <h2 id="aviso-titulo">Aviso de contenido</h2>
        <p>{portada.aviso}</p>
      </section>

      {carga === 'version_distinta' && (
        <section className="aviso aviso--info" aria-labelledby="version-titulo">
          <h2 id="version-titulo">El contenido se actualizó</h2>
          <p>
            Tu progreso guardado corresponde a la versión {versionGuardada} del episodio y la actual es la {ep.version}. Para
            evitar errores, el recorrido empieza de nuevo.
          </p>
          <div className="acciones">
            <button type="button" className="boton" onClick={borrar}>
              Reiniciar con la versión {ep.version}
            </button>
            <button type="button" className="boton boton--secundario" onClick={descartarAviso}>
              Entendido
            </button>
          </div>
        </section>
      )}

      <div className="confirmacion-adulta">
        <input
          id="adulto"
          type="checkbox"
          checked={prefs.adultoConfirmado}
          onChange={(e) => setPrefs({ adultoConfirmado: e.target.checked })}
        />
        <label htmlFor="adulto">Confirmo que soy una persona mayor de 18 años.</label>
      </div>
      {!prefs.adultoConfirmado && (
        <p className="ayuda" id="ayuda-adulto">
          Este juego está dirigido a personas adultas. Confirma para comenzar.
        </p>
      )}

      <div className="acciones acciones--portada">
        <button
          type="button"
          className="boton boton--principal"
          disabled={!prefs.adultoConfirmado}
          aria-describedby={!prefs.adultoConfirmado ? 'ayuda-adulto' : undefined}
          onClick={() => comenzar('/jugar')}
        >
          {hayProgreso ? 'Continuar donde lo dejaste' : 'Comenzar'}
        </button>
        <button
          type="button"
          className="boton"
          disabled={!prefs.adultoConfirmado}
          aria-describedby={!prefs.adultoConfirmado ? 'ayuda-adulto' : undefined}
          onClick={() => comenzar('/lectura')}
        >
          Versión de lectura
        </button>
        <Link className="boton boton--secundario" to="/accesibilidad">
          Accesibilidad
        </Link>
        <Link className="boton boton--institucional" to="/comunicar">
          Cómo comunicar una preocupación real
        </Link>
      </div>

      <p className="portada__extra">
        <Link to="/evaluacion">Ir a la evaluación</Link> · <Link to="/cuenta">Mi cuenta y resultados</Link> ·{' '}
        <Link to="/acerca">Acerca de este juego</Link>
      </p>
      <BannerDemo />
    </div>
  );
}

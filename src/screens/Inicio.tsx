import { Link } from 'react-router-dom';
import { episodios } from '../content/episodios';
import { cargarProgreso } from '../engine/almacen';
import { BannerDemo, Encabezado } from '../ui/comunes';

/** Pantalla de inicio: lista de módulos. Cada módulo conserva su progreso y su resultado por separado. */
export function Inicio() {
  return (
    <div className="pantalla inicio">
      <Encabezado>Decisiones que protegen</Encabezado>
      <p className="portada__lead">
        Practica cómo responder desde tu rol cuando una persona comunica una preocupación de salvaguarda. Cada módulo es una
        historia ficticia con decisiones, reparaciones y una evaluación propia.
      </p>
      <ul className="modulos">
        {episodios.map((ep) => {
          const carga = cargarProgreso(ep);
          const enCurso = carga.estado === 'recuperado' && carga.progreso.role !== null;
          return (
            <li key={ep.id} className="modulo">
              <p className="sobretitulo">{ep.rotulo}</p>
              <h2>{ep.title}</h2>
              {ep.subtitle && <p>{ep.subtitle}</p>}
              <p className="modulo__estado">
                {enCurso
                  ? carga.progreso.node === 'CIERRE'
                    ? 'Práctica completada en este dispositivo.'
                    : 'Práctica en curso en este dispositivo.'
                  : 'Sin progreso guardado.'}{' '}
                Versión de contenido {ep.version}.
              </p>
              <Link className="boton boton--principal" to={`/${ep.ruta}`}>
                Abrir el módulo<span className="solo-lector">: {ep.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="acciones">
        <Link className="boton boton--secundario" to="/accesibilidad">
          Accesibilidad
        </Link>
        <Link className="boton boton--institucional" to="/comunicar">
          Cómo comunicar una preocupación real
        </Link>
      </div>
      <p className="portada__extra">
        <Link to="/cuenta">Mi cuenta y resultados</Link> · <Link to="/acerca">Acerca de este juego</Link>
      </p>
      <BannerDemo />
    </div>
  );
}

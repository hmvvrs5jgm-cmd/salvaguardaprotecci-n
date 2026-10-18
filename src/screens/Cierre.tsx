import { Link } from 'react-router-dom';
import { useApp } from '../state/AppState';
import { Linea, useEnfocar } from '../ui/comunes';

export function Cierre({ onHerramientas }: { onHerramientas: () => void }) {
  const { ep, estado } = useApp();
  const ref = useEnfocar<HTMLHeadingElement>('CIERRE');
  const obtenidas = ep.badges.filter((b) => estado.badges.includes(b.id));

  return (
    <section className="cierre" aria-labelledby="cierre-titulo">
      <h1 id="cierre-titulo" ref={ref} tabIndex={-1}>
        Cierre del episodio
      </h1>
      {ep.closing.lines.map((l) => (
        <Linea key={l.id} linea={l} rol={estado.role} />
      ))}
      <p className="cierre__contribucion">{ep.closing.contribution}</p>

      <section aria-labelledby="reflexion-titulo" className="reflexion">
        <h2 id="reflexion-titulo">Para reflexionar</h2>
        <p className="ayuda">Preguntas para pensar en silencio. No se registran respuestas.</p>
        <ul>
          {ep.closing.reflection.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="insignias-titulo" className="insignias">
        <h2 id="insignias-titulo">Insignias de práctica</h2>
        <p className="ayuda">Las insignias reconocen tu práctica. No equivalen a la aprobación del episodio.</p>
        {obtenidas.length === 0 ? (
          <p>Aún no tienes insignias.</p>
        ) : (
          <ul>
            {obtenidas.map((b) => (
              <li key={b.id}>
                <strong>{b.name}.</strong> {b.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="acciones">
        <Link className="boton" to="/repaso">
          Revisar decisiones
        </Link>
        <button type="button" className="boton" onClick={onHerramientas}>
          Herramientas
        </button>
        <Link className="boton boton--principal" to="/evaluacion">
          Ir a evaluación
        </Link>
        <Link className="boton boton--secundario" to="/">
          Salir
        </Link>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import type { Option } from '../content/types';
import { useApp } from '../state/AppState';
import { Encabezado, textoRol } from '../ui/comunes';

const adecuada = (o: Option) => o.outcome.type === 'avanza';

/** Repaso de las decisiones: muestra la respuesta adecuada y su explicación (no guarda el historial personal). */
export function Repaso() {
  const { ep, estado } = useApp();
  const rol = estado.role ?? 'cf';
  return (
    <div className="pantalla repaso">
      <Encabezado>Revisar decisiones</Encabezado>
      <p>Respuesta adecuada y explicación de cada decisión del episodio{estado.role ? '' : ' (textos para personal de ChildFund)'}.</p>
      <ol className="repaso__lista">
        {ep.order.map((id) => {
          const s = ep.scenes[id];
          const d = s.decision;
          return (
            <li key={id}>
              <h2>
                {d.id}. {s.title}
              </h2>
              {d.kind === 'choice' ? (
                <>
                  <p className="repaso__pregunta">{d.prompt}</p>
                  {d.options.filter(adecuada).map((o) => (
                    <div key={o.id}>
                      <p>
                        <strong>Respuesta adecuada:</strong> «{textoRol(o.label, rol)}»
                      </p>
                      <p>{o.feedback}</p>
                    </div>
                  ))}
                  {d.complementaryNote && <p className="nota-complementaria">{d.complementaryNote}</p>}
                </>
              ) : (
                <>
                  <p className="repaso__pregunta">{d.prompt}</p>
                  <ul>
                    {d.cards.map((c) => (
                      <li key={c.id}>
                        <strong>
                          Tarjeta {c.number} — {c.include ? 'Incluir' : 'Excluir'}:
                        </strong>{' '}
                        {c.explanation}
                      </li>
                    ))}
                  </ul>
                  <p>{d.successText}</p>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <div className="acciones">
        <Link className="boton" to="/jugar">
          Volver al juego
        </Link>
        <Link className="boton boton--principal" to="/evaluacion">
          Ir a evaluación
        </Link>
      </div>
    </div>
  );
}

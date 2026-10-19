import { Link } from 'react-router-dom';
import type { Option } from '../content/types';
import { escenaDe } from '../engine/practica';
import { useApp } from '../state/AppState';
import { Encabezado, textoRol } from '../ui/comunes';

const adecuada = (o: Option) => o.outcome.type === 'avanza';

/** Repaso de las decisiones: muestra la respuesta adecuada y su explicación (no guarda el historial personal). */
export function Repaso() {
  const { ep, estado, enlace } = useApp();
  const rol = estado.role ?? 'cf';
  return (
    <div className="pantalla repaso">
      <Encabezado>Revisar decisiones</Encabezado>
      <p>Respuesta adecuada y explicación de cada decisión del módulo{estado.role ? '' : ' (textos para personal de ChildFund)'}.</p>
      <ol className="repaso__lista">
        {ep.order.map((id) => {
          const s = escenaDe(ep, id);
          const d = s.decision;
          if (d.kind === 'continuar' || d.kind === 'variante') return null;
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
              ) : d.kind === 'solicitudes' ? (
                <>
                  <p className="repaso__pregunta">{d.prompt}</p>
                  <ul>
                    {d.solicitudes.map((sol) => (
                      <li key={sol.id}>
                        <strong>{sol.titulo}</strong> Acción autorizable: «{sol.opciones.find((o) => o.correcta)?.texto}»{' '}
                        {sol.explicacion}
                      </li>
                    ))}
                  </ul>
                  <p>{d.successText}</p>
                </>
              ) : d.kind === 'checklist' ? (
                <>
                  <p className="repaso__pregunta">{d.prompt}</p>
                  <ul>
                    {d.items.map((i) => (
                      <li key={i.id}>{i.label}</li>
                    ))}
                  </ul>
                  <p>{d.incompleteMessage}</p>
                </>
              ) : (
                <>
                  <p className="repaso__pregunta">{d.prompt}</p>
                  <ul>
                    {d.cards.map((c) => (
                      <li key={c.id}>
                        <strong>
                          {c.soloSiVisitada ? 'Solo en la variación correspondiente — ' : ''}Tarjeta {c.number} — {c.include ? (d.includeLabel ?? 'Incluir') : 'Excluir'}:
                        </strong>{' '}
                        {c.explanation}
                      </li>
                    ))}
                  </ul>
                  {d.successTitle && <p className="repaso__subtitulo">{d.successTitle}</p>}
                  <p>{d.successText}</p>
                </>
              )}
            </li>
          );
        })}
      </ol>
      <div className="acciones">
        <Link className="boton" to={enlace('jugar')}>
          Volver al juego
        </Link>
        <Link className="boton boton--principal" to={enlace('evaluacion')}>
          Ir a evaluación
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { herramientas } from '../content/herramientas';
import type { Tool, ToolId } from '../content/types';
import { useApp } from '../state/AppState';
import { Dialogo } from './comunes';

export function VistaHerramienta({ tool }: { tool: Tool }) {
  return (
    <article className="herramienta" aria-labelledby={`h-${tool.id}`}>
      <h3 id={`h-${tool.id}`}>{tool.title}</h3>
      <p className="herramienta__resumen">{tool.summary}</p>
      {tool.sections.map((sec) => (
        <section key={sec.heading}>
          <h4>{sec.heading}</h4>
          {sec.paragraphs?.map((p) => <p key={p}>{p}</p>)}
          {sec.bullets && (
            <ul>
              {sec.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          {sec.table && (
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    {sec.table.headers.map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sec.table.rows.map((r) => (
                    <tr key={r.join('|')}>
                      {r.map((c, i) => (i === 0 ? <th key={c} scope="row">{c}</th> : <td key={c}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}
      <footer className="fuentes">
        <h4>Fuentes</h4>
        <ul>
          {tool.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </footer>
    </article>
  );
}

/** Diálogo de herramientas: se abre desde cualquier escena y al cerrarlo se vuelve al mismo punto. */
export function DialogoHerramientas({
  abierto,
  onCerrar,
  inicial,
}: {
  abierto: boolean;
  onCerrar: () => void;
  inicial?: ToolId | null;
}) {
  const { despachar } = useApp();
  const [actual, setActual] = useState<ToolId | null>(inicial ?? null);
  const tool = herramientas.find((h) => h.id === actual) ?? null;
  const abrir = (id: ToolId) => {
    setActual(id);
    despachar({ type: 'VER_HERRAMIENTA', toolId: id });
  };
  const cerrar = () => {
    setActual(null);
    onCerrar();
  };
  return (
    <Dialogo titulo="Herramientas de consulta" abierto={abierto} onCerrar={cerrar} etiquetaCerrar="Volver a la escena">
      <p>Disponibles en todo momento. Ninguna herramienta exige puntos.</p>
      <ul className="lista-herramientas">
        {herramientas.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              className={`boton boton--herramienta${actual === h.id ? ' es-actual' : ''}`}
              aria-pressed={actual === h.id}
              onClick={() => abrir(h.id)}
            >
              {h.title}
            </button>
          </li>
        ))}
      </ul>
      {tool && <VistaHerramienta tool={tool} />}
    </Dialogo>
  );
}

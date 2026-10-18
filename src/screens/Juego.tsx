import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { canalesParaRol, directorioLocal, emergencia, esEnlaceActivo } from '../config/canales';
import { panelTransferencia } from '../content/episodio1';
import { panelApoyos } from '../content/herramientas';
import type { CardsDecision, ChoiceDecision, Option, PanelId, RoleId, Scene } from '../content/types';
import { opcionElegida, progreso, type EstadoPractica } from '../engine/practica';
import { useApp } from '../state/AppState';
import { Dialogo, Linea, textoRol, useAnunciar, useEnfocar } from '../ui/comunes';
import { DialogoHerramientas } from '../ui/Herramientas';
import { Fondo, IconoResultado, Retrato } from '../ui/ilustraciones';
import { Cierre } from './Cierre';

export type ModoJuego = 'grafico' | 'lectura';

export function Juego({ modo }: { modo: ModoJuego }) {
  const { ep, estado, despachar, prefs } = useApp();
  const [herramientasAbiertas, setHerramientasAbiertas] = useState(false);
  const [pausa, setPausa] = useState(false);

  // La versión de lectura muestra la introducción completa junto a la decisión.
  useEffect(() => {
    if (modo === 'lectura' && estado.paso.kind === 'intro' && estado.node !== 'CIERRE') despachar({ type: 'SALTAR_INTRO' });
  }, [modo, estado.paso.kind, estado.node, despachar]);

  if (!prefs.adultoConfirmado) return <Navigate to="/" replace />;
  if (!estado.role) return <Navigate to={`/rol?modo=${modo}`} replace />;

  const { actual, total } = progreso(ep, estado);
  const escena = estado.node === 'CIERRE' ? null : ep.scenes[estado.node];

  return (
    <div className={`pantalla juego juego--${modo}`}>
      <div className="barra-juego">
        <div className="progreso">
          <span id="progreso-etiqueta">{escena ? `Escena ${actual} de ${total}` : 'Cierre del episodio'}</span>
          <progress max={total} value={actual} aria-labelledby="progreso-etiqueta" />
        </div>
        <div className="barra-juego__acciones">
          <button type="button" className="boton boton--secundario" onClick={() => setHerramientasAbiertas(true)}>
            Herramientas
          </button>
          <button type="button" className="boton boton--secundario" onClick={() => setPausa(true)}>
            Pausa
          </button>
        </div>
      </div>

      {escena ? (
        <EscenaVista escena={escena} estado={estado} modo={modo} />
      ) : (
        <Cierre onHerramientas={() => setHerramientasAbiertas(true)} />
      )}

      <DialogoHerramientas abierto={herramientasAbiertas} onCerrar={() => setHerramientasAbiertas(false)} />
      <MenuPausa abierto={pausa} onCerrar={() => setPausa(false)} modo={modo} onHerramientas={() => { setPausa(false); setHerramientasAbiertas(true); }} />
    </div>
  );
}

function EscenaVista({ escena, estado, modo }: { escena: Scene; estado: EstadoPractica; modo: ModoJuego }) {
  const rol = estado.role!;
  const titulo = useEnfocar<HTMLHeadingElement>(escena.id);
  const hablante = estado.paso.kind === 'intro' ? escena.intro[estado.paso.index]?.speaker : undefined;

  return (
    <section className="escena" aria-labelledby="escena-titulo">
      <header className="escena__cabecera">
        {escena.variationLabel && <p className="rotulo-variacion">{escena.variationLabel}</p>}
        <h1 id="escena-titulo" ref={titulo} tabIndex={-1}>
          <span className="escena__codigo">{escena.id}</span> {escena.title}
        </h1>
      </header>

      {modo === 'grafico' && (
        <div className="escenario">
          <Fondo id={escena.background} alt={escena.backgroundAlt} />
          <div className="escenario__personajes">
            {escena.characters.map((c) => (
              <Retrato key={c} id={c} activo={hablante === c} />
            ))}
          </div>
        </div>
      )}

      <PasoVista escena={escena} estado={estado} rol={rol} modo={modo} />
    </section>
  );
}

function PasoVista({ escena, estado, rol, modo }: { escena: Scene; estado: EstadoPractica; rol: RoleId; modo: ModoJuego }) {
  const { despachar } = useApp();
  const anunciar = useAnunciar();
  const p = estado.paso;
  const botonContinuar = useRef<HTMLButtonElement>(null);
  // El encabezado de la decisión solo recibe el foco al volver desde la retroalimentación;
  // al entrar en una escena, el foco va al encabezado de la escena.
  const pasoAnterior = useRef(p.kind);
  const volviendo = pasoAnterior.current === 'feedback' && p.kind === 'decision';
  useEffect(() => {
    pasoAnterior.current = p.kind;
  }, [p.kind]);

  if (p.kind === 'intro') {
    const linea = escena.intro[p.index];
    if (!linea) return null;
    return (
      <div className="dialogo-caja">
        <div className="dialogo-caja__texto" aria-live="polite">
          <Linea linea={linea} rol={rol} />
        </div>
        <button
          ref={botonContinuar}
          type="button"
          className="boton boton--principal"
          onClick={() => {
            despachar({ type: 'CONTINUAR' });
            const sig = escena.intro[p.index + 1];
            if (!sig) anunciar('Decisión');
          }}
        >
          Continuar
        </button>
      </div>
    );
  }

  if (p.kind === 'outro') {
    return (
      <div className="dialogo-caja">
        <OutroVista escena={escena} rol={rol} />
        <button type="button" className="boton boton--principal" onClick={() => despachar({ type: 'CONTINUAR' })}>
          Continuar
        </button>
      </div>
    );
  }

  return (
    <>
      {escena.intro.length > 0 && (
        <div className="transcripcion" aria-label="Lo que ocurrió en esta escena">
          {escena.intro.map((l) => (
            <Linea key={l.id} linea={l} rol={rol} />
          ))}
        </div>
      )}
      {escena.panel && <PanelContextual id={escena.panel} rol={rol} />}
      {p.kind === 'decision' && escena.decision.kind === 'choice' && (
        <DecisionVista decision={escena.decision} rol={rol} modo={modo} enfocar={volviendo} />
      )}
      {p.kind === 'feedback' && escena.decision.kind === 'choice' && (
        <RetroalimentacionVista decision={escena.decision} estado={estado} rol={rol} />
      )}
      {p.kind === 'cards' && escena.decision.kind === 'cards' && (
        <TarjetasVista decision={escena.decision} selected={p.selected} checked={p.checked} />
      )}
    </>
  );
}

function OutroVista({ escena, rol }: { escena: Scene; rol: RoleId }) {
  const ref = useEnfocar<HTMLDivElement>('outro');
  return (
    <div className="dialogo-caja__texto" ref={ref} tabIndex={-1}>
      {escena.outro?.map((l) => (
        <Linea key={l.id} linea={l} rol={rol} />
      ))}
    </div>
  );
}

function DecisionVista({
  decision,
  rol,
  modo,
  enfocar,
}: {
  decision: ChoiceDecision;
  rol: RoleId;
  modo: ModoJuego;
  enfocar: boolean;
}) {
  const { despachar } = useApp();
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (enfocar) ref.current?.focus();
  }, [enfocar]);
  const [seleccion, setSeleccion] = useState<string | null>(null);

  if (modo === 'lectura') {
    return (
      <form
        className="decision"
        onSubmit={(e) => {
          e.preventDefault();
          if (seleccion) despachar({ type: 'ELEGIR_OPCION', optionId: seleccion });
        }}
      >
        <fieldset>
          <legend>
            <h2 ref={ref} tabIndex={-1} className="decision__pregunta">
              {decision.id}. {decision.prompt}
            </h2>
          </legend>
          {decision.options.map((o) => (
            <div className="opcion-lectura" key={o.id}>
              <input
                type="radio"
                id={`op-${o.id}`}
                name={decision.id}
                value={o.id}
                checked={seleccion === o.id}
                onChange={() => setSeleccion(o.id)}
              />
              <label htmlFor={`op-${o.id}`}>«{textoRol(o.label, rol)}»</label>
            </div>
          ))}
        </fieldset>
        <button type="submit" className="boton boton--principal" disabled={!seleccion}>
          Confirmar respuesta
        </button>
      </form>
    );
  }

  return (
    <div className="decision">
      <h2 ref={ref} tabIndex={-1} className="decision__pregunta" id={`preg-${decision.id}`}>
        {decision.prompt}
      </h2>
      <ul className="opciones" aria-labelledby={`preg-${decision.id}`}>
        {decision.options.map((o) => (
          <li key={o.id}>
            <button type="button" className="opcion" onClick={() => despachar({ type: 'ELEGIR_OPCION', optionId: o.id })}>
              «{textoRol(o.label, rol)}»
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const rotulos: Record<Option['outcome']['type'], { icono: 'ok' | 'mejora' | 'pausa' | 'info'; texto: string }> = {
  avanza: { icono: 'ok', texto: 'Respuesta adecuada' },
  complementa_y_avanza: { icono: 'info', texto: 'Respuesta útil que conviene completar' },
  repara_y_avanza: { icono: 'mejora', texto: 'Puedes reparar tu respuesta' },
  reintenta: { icono: 'mejora', texto: 'Puedes mejorar esta respuesta' },
  pausa_y_vuelve: { icono: 'pausa', texto: 'Pausa pedagógica' },
};

function RetroalimentacionVista({ decision, estado, rol }: { decision: ChoiceDecision; estado: EstadoPractica; rol: RoleId }) {
  const { ep, despachar } = useApp();
  const o = opcionElegida(ep, estado)!;
  const p = estado.paso as Extract<EstadoPractica['paso'], { kind: 'feedback' }>;
  const ref = useEnfocar<HTMLHeadingElement>(`${o.id}-${p.repairShown}`);
  const r = rotulos[o.outcome.type];
  const continuar = () => despachar({ type: 'CONTINUAR' });

  return (
    <div className={`retro retro--${o.outcome.type}`}>
      <p className="retro__eleccion">
        <span className="linea__hablante">Tu respuesta:</span> «{textoRol(o.label, rol)}»
      </p>
      {o.consequence.map((l) => (
        <Linea key={l.id} linea={l} rol={rol} />
      ))}
      <div className="retro__caja">
        <h2 ref={ref} tabIndex={-1} className="retro__titulo">
          <IconoResultado tipo={r.icono} /> {p.repairShown ? 'Reparación' : r.texto}
        </h2>
        <p>{o.feedback}</p>
        {o.sourceNote && <p className="nota-fuente">{o.sourceNote}</p>}
        {decision.complementaryNote && <p className="nota-complementaria">{decision.complementaryNote}</p>}
      </div>

      {o.outcome.type === 'pausa_y_vuelve' && (
        <>
          <p className="pausa-nota">{o.outcome.pauseNote}</p>
          <button type="button" className="boton boton--principal" onClick={continuar}>
            Elegir otra alternativa
          </button>
        </>
      )}
      {o.outcome.type === 'reintenta' && (
        <button type="button" className="boton boton--principal" onClick={continuar}>
          Volver a intentar
        </button>
      )}
      {o.outcome.type === 'avanza' && (
        <button type="button" className="boton boton--principal" onClick={continuar}>
          Continuar
        </button>
      )}
      {o.outcome.type === 'complementa_y_avanza' && (
        <>
          <div className="complemento">
            <h3>Respuesta completa</h3>
            {o.outcome.complement.map((l) => (
              <Linea key={l.id} linea={l} rol={rol} />
            ))}
          </div>
          <button type="button" className="boton boton--principal" onClick={continuar}>
            Continuar
          </button>
        </>
      )}
      {o.outcome.type === 'repara_y_avanza' &&
        (p.repairShown ? (
          <>
            <div className="complemento">
              {o.outcome.repair.map((l) => (
                <Linea key={l.id} linea={l} rol={rol} />
              ))}
              {o.outcome.repairFollowUp?.map((l) => (
                <Linea key={l.id} linea={l} rol={rol} />
              ))}
            </div>
            <button type="button" className="boton boton--principal" onClick={continuar}>
              Continuar
            </button>
          </>
        ) : (
          <>
            <p className="ayuda">Para continuar, completa la reparación.</p>
            <button type="button" className="boton boton--principal" onClick={() => despachar({ type: 'MOSTRAR_REPARACION' })}>
              Reparar respuesta
            </button>
          </>
        ))}
    </div>
  );
}

function TarjetasVista({
  decision,
  selected,
  checked,
}: {
  decision: CardsDecision;
  selected: string[];
  checked: { missing: boolean; extra: boolean; ok: boolean } | null;
}) {
  const { despachar } = useApp();
  const resultado = useEnfocar<HTMLDivElement>(checked ? `${checked.missing}-${checked.extra}-${checked.ok}` : null);

  return (
    <div className="decision tarjetas">
      <p className="rotulo-simulacion" role="note">
        {decision.simulationLabel}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          despachar({ type: 'COMPROBAR_TARJETAS' });
        }}
        noValidate
      >
        <fieldset disabled={checked?.ok}>
          <legend>
            <h2 className="decision__pregunta">{decision.prompt}</h2>
          </legend>
          {decision.cards.map((c) => (
            <div className={`tarjeta${selected.includes(c.id) ? ' tarjeta--marcada' : ''}`} key={c.id}>
              <input
                type="checkbox"
                id={`t-${c.id}`}
                checked={selected.includes(c.id)}
                onChange={() => despachar({ type: 'ALTERNAR_TARJETA', cardId: c.id })}
              />
              <label htmlFor={`t-${c.id}`}>
                <span className="tarjeta__numero">Tarjeta {c.number}</span> «{c.text}»
              </label>
            </div>
          ))}
        </fieldset>
        {!checked?.ok && (
          <button type="submit" className="boton boton--principal">
            Comprobar selección
          </button>
        )}
      </form>

      {checked && (
        <div className={`retro__caja${checked.ok ? ' retro__caja--ok' : ''}`} ref={resultado} tabIndex={-1}>
          {checked.ok ? (
            <>
              <p className="retro__titulo">
                <IconoResultado tipo="ok" /> Selección adecuada
              </p>
              <ul>
                {decision.cards.map((c) => (
                  <li key={c.id}>
                    <strong>
                      Tarjeta {c.number} — {c.include ? 'Incluir' : 'Excluir'}:
                    </strong>{' '}
                    {c.explanation}
                  </li>
                ))}
              </ul>
              <p>{decision.successText}</p>
            </>
          ) : (
            <>
              <p className="retro__titulo">
                <IconoResultado tipo="mejora" /> Revisa tu selección
              </p>
              {checked.missing && <p>{decision.messages.missing}</p>}
              {checked.extra && <p>{decision.messages.extra}</p>}
              <p className="ayuda">Puedes cambiar las tarjetas y comprobar de nuevo tantas veces como necesites.</p>
            </>
          )}
        </div>
      )}
      {checked?.ok && (
        <button type="button" className="boton boton--principal" onClick={() => despachar({ type: 'CONTINUAR' })}>
          Continuar
        </button>
      )}
    </div>
  );
}

export function PanelContextual({ id, rol }: { id: PanelId; rol: RoleId }) {
  const titulos: Record<PanelId, string> = {
    transferencia: 'Si hubiera peligro inmediato',
    canales: 'Vías institucionales de referencia',
    apoyos: 'Posibles apoyos',
  };
  return (
    <details className="panel-contextual">
      <summary>{titulos[id]}</summary>
      {id === 'transferencia' && (
        <>
          <p>{panelTransferencia}</p>
          <p>
            {emergencia.nombre}:{' '}
            {emergencia.estado === 'verificado' && emergencia.valor ? (
              <strong>{emergencia.valor}</strong>
            ) : (
              <em>pendiente de verificación institucional</em>
            )}
            .
          </p>
        </>
      )}
      {id === 'canales' && (
        <>
          <ListaCanales rol={rol} />
          <p className="ayuda">
            No se precargan datos del ejercicio en un formulario real ni se envía un reporte desde el juego.
          </p>
        </>
      )}
      {id === 'apoyos' && (
        <>
          <p>{panelApoyos.intro}</p>
          <p>{panelApoyos.denuncia}</p>
          <p>
            {panelApoyos.medica} {panelApoyos.medicaAclaracion}
          </p>
          <p>
            {directorioLocal.descripcion}{' '}
            {directorioLocal.estado === 'pendiente' && <em>(pendiente de configuración)</em>}
          </p>
          <p className="fuentes-linea">Fuentes: Política 2.10.3–2.10.5; Procedimiento 5.3.1.3.4 y 5.3.1.3.5.</p>
        </>
      )}
    </details>
  );
}

export function ListaCanales({ rol }: { rol: RoleId }) {
  return (
    <ul className="canales">
      {canalesParaRol(rol).map((c) => (
        <li key={c.id} className="canal">
          <p className="canal__nombre">
            <strong>{c.nombre}</strong>{' '}
            <span className={`estado estado--${c.estado}`}>
              {c.estado === 'verificado' ? 'Verificado' : 'Pendiente de verificación'}
            </span>
          </p>
          <p>{c.descripcion}</p>
          {c.estado === 'verificado' && c.contacto && (
            <p>
              Contacto:{' '}
              {/* Enlace de correo sin asunto ni cuerpo: no se transfiere ningún dato del juego. */}
              {c.contacto.includes('@') ? <a href={`mailto:${c.contacto}`}>{c.contacto}</a> : c.contacto}
            </p>
          )}
          {esEnlaceActivo(c) ? (
            <p>
              <a href={c.url} rel="noopener noreferrer" target="_blank">
                Abrir {c.nombre} (sitio externo)
              </a>
            </p>
          ) : (
            c.estado === 'pendiente' &&
            (c.url || c.contacto) && (
              <p className="ayuda">Dato de contacto no publicado como enlace hasta que la institución lo verifique.</p>
            )
          )}
          {c.estado === 'verificado' && c.verificacion && <p className="fuentes-linea">{c.verificacion}</p>}
          <p className="fuentes-linea">Fuente: {c.fuente}</p>
        </li>
      ))}
    </ul>
  );
}

function MenuPausa({
  abierto,
  onCerrar,
  modo,
  onHerramientas,
}: {
  abierto: boolean;
  onCerrar: () => void;
  modo: ModoJuego;
  onHerramientas: () => void;
}) {
  const { borrar } = useApp();
  const navegar = useNavigate();
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);
  return (
    <Dialogo titulo="Pausa" abierto={abierto} onCerrar={onCerrar} etiquetaCerrar="Continuar">
      <p>Tu progreso se conserva en este dispositivo.</p>
      <ul className="menu-pausa">
        <li>
          <button type="button" className="boton" onClick={onHerramientas}>
            Herramientas
          </button>
        </li>
        <li>
          <Link className="boton" to={modo === 'grafico' ? '/lectura' : '/jugar'} onClick={onCerrar}>
            {modo === 'grafico' ? 'Cambiar a la versión de lectura' : 'Cambiar a la versión gráfica'}
          </Link>
        </li>
        <li>
          <Link className="boton" to="/rol" onClick={onCerrar}>
            Cambiar de rol
          </Link>
        </li>
        <li>
          <Link className="boton" to="/accesibilidad" onClick={onCerrar}>
            Accesibilidad
          </Link>
        </li>
        <li>
          {confirmarBorrado ? (
            <div className="confirmar">
              <p>¿Borrar el progreso de práctica de este dispositivo? Se reiniciará el episodio.</p>
              <button
                type="button"
                className="boton"
                onClick={() => {
                  borrar();
                  onCerrar();
                  navegar('/');
                }}
              >
                Sí, borrar progreso
              </button>
              <button type="button" className="boton boton--secundario" onClick={() => setConfirmarBorrado(false)}>
                No borrar
              </button>
            </div>
          ) : (
            <button type="button" className="boton" onClick={() => setConfirmarBorrado(true)}>
              Borrar progreso
            </button>
          )}
        </li>
        <li>
          <button
            type="button"
            className="boton"
            onClick={() => {
              onCerrar();
              navegar('/');
            }}
          >
            Salir a la portada
          </button>
        </li>
      </ul>
    </Dialogo>
  );
}

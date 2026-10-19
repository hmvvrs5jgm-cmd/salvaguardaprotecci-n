import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { avisoServicios, canalesParaRol, directorioLocal, emergencia, esEnlaceActivo, serviciosPublicos } from '../config/canales';
import { panelApoyos } from '../content/herramientas';
import type {
  CardsDecision,
  ChecklistDecision,
  ChoiceDecision,
  ContinueDecision,
  EstadoCondicion,
  Option,
  PanelId,
  RoleId,
  Scene,
} from '../content/types';
import { escenaDe, fichaCompleta, opcionElegida, progreso, type EstadoPractica } from '../engine/practica';
import { useApp } from '../state/AppState';
import { Dialogo, Linea, textoRol, useAnunciar, useEnfocar } from '../ui/comunes';
import { DialogoHerramientas } from '../ui/Herramientas';
import { IconoResultado, Retrato } from '../ui/ilustraciones';
import { Cierre } from './Cierre';

export type ModoJuego = 'grafico' | 'lectura';

export function Juego({ modo }: { modo: ModoJuego }) {
  const { ep, estado, despachar, prefs, enlace } = useApp();
  const [herramientasAbiertas, setHerramientasAbiertas] = useState(false);
  const [pausa, setPausa] = useState(false);

  // La versión de lectura muestra la introducción completa junto a la decisión.
  useEffect(() => {
    if (modo === 'lectura' && estado.paso.kind === 'intro' && estado.node !== 'CIERRE') despachar({ type: 'SALTAR_INTRO' });
  }, [modo, estado.paso.kind, estado.node, despachar]);

  if (!prefs.adultoConfirmado) return <Navigate to={enlace()} replace />;
  if (!estado.role) return <Navigate to={`${enlace('rol')}?modo=${modo}`} replace />;

  const { actual, total } = progreso(ep, estado);
  const escena = estado.node === 'CIERRE' ? null : escenaDe(ep, estado.node);

  return (
    <div className={`pantalla juego juego--${modo}`}>
      <div className="barra-juego">
        <div className="progreso">
          <span id="progreso-etiqueta">{escena ? `Escena ${actual} de ${total}` : 'Cierre del módulo'}</span>
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
  const lineaActual = estado.paso.kind === 'intro' ? escena.intro[estado.paso.index] : undefined;
  const hablante = lineaActual?.speaker;

  return (
    <section className="escena" aria-labelledby="escena-titulo">
      <header className="escena__cabecera">
        {escena.variationLabel && <p className="rotulo-variacion">{escena.variationLabel}</p>}
        <h1 id="escena-titulo" ref={titulo} tabIndex={-1}>
          <span className="escena__codigo">{escena.id.replace(/^M\d+_/, '')}</span> {escena.title}
        </h1>
      </header>

      {modo === 'grafico' && escena.characters.length > 0 && (
        <div className="escenario">
          <div className="escenario__personajes">
            {escena.characters.map((c) => (
              <Retrato
                key={c}
                id={c}
                activo={hablante === c}
                pose={hablante === c ? (lineaActual?.pose ?? 'explica') : 'atenta'}
              />
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
      {escena.ficha && <FichaCondiciones ficha={escena.ficha} />}
      {escena.panel && <PanelContextual id={escena.panel} rol={rol} />}
      {escena.consultas?.map((c) => (
        <details className="panel-contextual" key={c.titulo}>
          <summary>{c.titulo}</summary>
          {c.lines.map((l) => (
            <Linea key={l.id} linea={l} rol={rol} />
          ))}
        </details>
      ))}
      {p.kind === 'decision' && escena.decision.kind === 'choice' && (
        <DecisionVista decision={escena.decision} rol={rol} modo={modo} enfocar={volviendo} />
      )}
      {p.kind === 'feedback' && escena.decision.kind === 'choice' && (
        <RetroalimentacionVista decision={escena.decision} estado={estado} rol={rol} />
      )}
      {p.kind === 'cards' && escena.decision.kind === 'cards' && (
        <TarjetasVista decision={escena.decision} selected={p.selected} checked={p.checked} />
      )}
      {p.kind === 'checklist' && escena.decision.kind === 'checklist' && (
        <FichaVista decision={escena.decision} marcados={p.marcados} comprobado={p.comprobado} />
      )}
      {p.kind === 'decision' && escena.decision.kind === 'continuar' && (
        <ContinuarVista decision={escena.decision} enfocar={escena.intro.length === 0} />
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
  redirige_a_reparacion: { icono: 'mejora', texto: 'Puedes mejorar esta respuesta' },
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
      {o.outcome.type === 'redirige_a_reparacion' && (
        <>
          <p className="ayuda">Antes de continuar, revisarás cómo reparar esta respuesta.</p>
          <button type="button" className="boton boton--principal" onClick={continuar}>
            Ir a la reparación
          </button>
        </>
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
                      Tarjeta {c.number} — {c.include ? (decision.includeLabel ?? 'Incluir') : 'Excluir'}:
                    </strong>{' '}
                    {c.explanation}
                  </li>
                ))}
              </ul>
              {decision.successTitle && <h3>{decision.successTitle}</h3>}
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

const etiquetasEstado: Record<EstadoCondicion, string> = {
  pendiente_de_verificar: 'Pendiente de verificar',
  verificado: 'Verificado',
  no_viable: 'No viable',
  suspendido: 'Suspendido',
};

function FichaCondiciones({ ficha }: { ficha: NonNullable<Scene['ficha']> }) {
  return (
    <div className="tabla-contenedor ficha-condiciones" tabIndex={0} role="region" aria-label={ficha.titulo}>
      <table>
        <caption>{ficha.titulo}</caption>
        <thead>
          <tr>
            <th scope="col">Condición</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {ficha.filas.map((f) => (
            <tr key={f.aspecto}>
              <td>{f.aspecto}</td>
              <td>
                <span className={`estado-condicion estado-condicion--${f.estado}`}>{etiquetasEstado[f.estado]}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContinuarVista({ decision, enfocar }: { decision: ContinueDecision; enfocar: boolean }) {
  const { despachar } = useApp();
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (enfocar) ref.current?.focus();
  }, [enfocar]);
  return (
    <div className="decision">
      {decision.note && <p className="continuar-nota">{decision.note}</p>}
      <button ref={ref} type="button" className="boton boton--principal" onClick={() => despachar({ type: 'CONTINUAR' })}>
        {decision.label}
      </button>
    </div>
  );
}

function FichaVista({ decision, marcados, comprobado }: { decision: ChecklistDecision; marcados: string[]; comprobado: boolean }) {
  const { despachar } = useApp();
  const completa = fichaCompleta(decision, marcados);
  const resultado = useEnfocar<HTMLDivElement>(comprobado ? `ficha-${completa}` : null);
  const listo = comprobado && completa;
  return (
    <div className="decision ficha">
      <p className="rotulo-simulacion" role="note">
        {decision.simulationLabel}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          despachar({ type: 'COMPROBAR_FICHA' });
        }}
        noValidate
      >
        <fieldset disabled={listo}>
          <legend>
            <h2 className="decision__pregunta">{decision.prompt}</h2>
          </legend>
          {decision.items.map((i) => (
            <div className={`tarjeta${marcados.includes(i.id) ? ' tarjeta--marcada' : ''}`} key={i.id}>
              <input
                type="checkbox"
                id={`f-${i.id}`}
                checked={marcados.includes(i.id)}
                onChange={() => despachar({ type: 'ALTERNAR_ITEM', itemId: i.id })}
              />
              <label htmlFor={`f-${i.id}`}>{i.label}</label>
            </div>
          ))}
        </fieldset>
        <p>
          Estado de la derivación:{' '}
          <span className={`ficha__estado ficha__estado--${listo ? 'ok' : 'pendiente'}`}>
            {listo ? decision.doneState : decision.pendingState}
          </span>{' '}
          ({marcados.length} de {decision.items.length} condiciones comprobadas)
        </p>
        {!listo && (
          <button type="submit" className="boton boton--principal">
            Comprobar la ficha
          </button>
        )}
      </form>
      {comprobado && (
        <div className={`retro__caja${listo ? ' retro__caja--ok' : ''}`} ref={resultado} tabIndex={-1}>
          <p className="retro__titulo">
            <IconoResultado tipo={listo ? 'ok' : 'mejora'} /> {listo ? 'Ficha completa' : 'Ficha incompleta'}
          </p>
          <p>{listo ? decision.successText : decision.incompleteMessage}</p>
        </div>
      )}
      {listo && (
        <button type="button" className="boton boton--principal" onClick={() => despachar({ type: 'CONTINUAR' })}>
          Continuar
        </button>
      )}
      {decision.alternative && !listo && (
        <p>
          <button type="button" className="boton boton--secundario" onClick={() => despachar({ type: 'ALTERNATIVA' })}>
            {decision.alternative.label}
          </button>
        </p>
      )}
    </div>
  );
}

export function PanelContextual({ id, rol }: { id: PanelId; rol: RoleId }) {
  const { ep } = useApp();
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
          <p>{ep.panelTransferencia}</p>
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
          {ep.panelApoyos ? (
            ep.panelApoyos.map((t) => <p key={t}>{t}</p>)
          ) : (
            <>
              <p>{panelApoyos.intro}</p>
              <p>{panelApoyos.denuncia}</p>
              <p>
                {panelApoyos.medica} {panelApoyos.medicaAclaracion}
              </p>
            </>
          )}
          <h3>Servicios de protección que pueden comunicarse a la persona</h3>
          <ListaServicios />
          <p>{directorioLocal.descripcion}</p>
          <p className="fuentes-linea">
            Fuentes: Política 2.10.3–2.10.5; Procedimiento 5.3.1.3.4 y 5.3.1.3.5; Protocolo de asistencia y derivación; Capítulo III.
          </p>
        </>
      )}
    </details>
  );
}

/** Servicios públicos informativos (Capítulo III). Solo se muestran los verificados. */
export function ListaServicios() {
  const visibles = serviciosPublicos.filter((s) => s.estado === 'verificado');
  return (
    <>
      <p className="aviso aviso--info">{avisoServicios}</p>
      <ul className="canales">
        {visibles.map((s) => (
          <li key={s.id} className="canal">
            <p className="canal__nombre">
              <strong>{s.nombre}</strong>
              {s.contacto && <> — {s.contacto}</>}
            </p>
            <p>{s.descripcion}</p>
            {s.url && esEnlaceActivo(s) && (
              <p>
                <a href={s.url} rel="noopener noreferrer" target="_blank">
                  {s.etiquetaEnlace ?? s.nombre} (se abre en una pestaña nueva)
                </a>
              </p>
            )}
            <p className="fuentes-linea">Fuente: {s.fuente}</p>
          </li>
        ))}
      </ul>
    </>
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
                {c.etiquetaEnlace ?? `Abrir ${c.nombre}`} (se abre en una pestaña nueva)
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
  const { borrar, enlace } = useApp();
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
          <Link className="boton" to={enlace(modo === 'grafico' ? 'lectura' : 'jugar')} onClick={onCerrar}>
            {modo === 'grafico' ? 'Cambiar a la versión de lectura' : 'Cambiar a la versión gráfica'}
          </Link>
        </li>
        <li>
          <Link className="boton" to={enlace('rol')} onClick={onCerrar}>
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
              <p>¿Borrar el progreso de práctica de este dispositivo? Se reiniciará este módulo.</p>
              <button
                type="button"
                className="boton"
                onClick={() => {
                  borrar();
                  onCerrar();
                  navegar(enlace());
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
              navegar(enlace());
            }}
          >
            Salir a la portada del módulo
          </button>
        </li>
      </ul>
    </Dialogo>
  );
}

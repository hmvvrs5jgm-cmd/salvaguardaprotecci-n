import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../config/modo';
import { configEvaluacion, notaUmbral, preguntas, textosResultado } from '../content/episodio1';
import type { Question, ToolId } from '../content/types';
import { crearOrden, rngSeguro, type OrdenIntento } from '../engine/mezcla';
import { puntuar } from '../engine/puntuacion';
import { cargarClaveDemo } from '../services/demo';
import {
  enviarIntento,
  ErrorRegistro,
  iniciarIntento,
  leerPerfil,
  registroDisponible,
  sesionActual,
} from '../services/registro';
import { useApp } from '../state/AppState';
import { BannerDemo, Encabezado, textoRol, useEnfocar } from '../ui/comunes';
import { DialogoHerramientas } from '../ui/Herramientas';
import { IconoResultado } from '../ui/ilustraciones';

export interface ResultadoVista {
  score: number;
  total: number;
  passed: boolean;
  estado: 'aprobado' | 'critico_fallido' | 'insuficiente';
  failedCritical: string[];
  perQuestion: Record<string, { correct: boolean; correctOption: string; selected: string }>;
  version: string;
  registrado: boolean;
}

type Fase =
  | { kind: 'intro' }
  | { kind: 'preguntas'; orden: OrdenIntento; attemptId: string | null; indice: number }
  | { kind: 'revision'; orden: OrdenIntento; attemptId: string | null }
  | { kind: 'resultado'; resultado: ResultadoVista };

const porId = (id: string) => preguntas.find((p) => p.id === id)!;

export function Evaluacion() {
  const [fase, setFase] = useState<Fase>({ kind: 'intro' });
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [intentos, setIntentos] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [requisito, setRequisito] = useState<'sesion' | 'perfil' | null>(null);
  const modoRegistro = config.modo === 'registro';

  useEffect(() => {
    if (!modoRegistro) return;
    let vivo = true;
    (async () => {
      try {
        const s = await sesionActual();
        if (!vivo) return;
        if (!s) return setRequisito('sesion');
        const p = await leerPerfil();
        if (!vivo) return;
        setRequisito(!p || !p.display_name.trim() || !p.organization.trim() ? 'perfil' : null);
      } catch {
        if (vivo) setRequisito('sesion');
      }
    })();
    return () => {
      vivo = false;
    };
  }, [modoRegistro]);

  const iniciar = async () => {
    setError(null);
    setRespuestas({});
    if (!modoRegistro) {
      setFase({ kind: 'preguntas', orden: crearOrden(preguntas, rngSeguro()), attemptId: null, indice: 0 });
      return;
    }
    if (!registroDisponible()) {
      setError('El registro no está configurado en esta versión.');
      return;
    }
    setOcupado(true);
    try {
      // El servidor crea el intento y decide el orden de presentación.
      const it = await iniciarIntento(configEvaluacion.episodeId, configEvaluacion.version);
      setFase({
        kind: 'preguntas',
        orden: { questionOrder: it.question_order, optionOrder: it.option_order },
        attemptId: it.attempt_id,
        indice: 0,
      });
    } catch (e) {
      setError(e instanceof ErrorRegistro ? e.message : 'No se pudo iniciar el intento.');
    } finally {
      setOcupado(false);
    }
  };

  const enviar = async (orden: OrdenIntento, attemptId: string | null) => {
    setError(null);
    setOcupado(true);
    try {
      if (!modoRegistro) {
        const clave = await cargarClaveDemo();
        const r = puntuar(respuestas, clave, configEvaluacion);
        setFase({ kind: 'resultado', resultado: { ...r, version: configEvaluacion.version, registrado: false } });
      } else {
        const r = await enviarIntento(attemptId!, respuestas);
        const perQuestion = Object.fromEntries(
          Object.entries(r.per_question).map(([q, v]) => [q, { correct: v.correct, correctOption: v.correct_option, selected: v.selected }]),
        );
        setFase({
          kind: 'resultado',
          resultado: {
            score: r.score,
            total: r.total,
            passed: r.passed,
            estado: r.estado,
            failedCritical: r.failed_critical,
            perQuestion,
            version: r.content_version,
            registrado: true,
          },
        });
      }
      setIntentos((n) => n + 1);
    } catch (e) {
      // Ante un fallo no se crea ningún resultado local: se informa y se permite reintentar el envío.
      setError(e instanceof ErrorRegistro ? e.message : 'No se pudo enviar. No se registró ningún resultado.');
      setFase({ kind: 'revision', orden, attemptId });
    } finally {
      setOcupado(false);
    }
  };

  if (fase.kind === 'resultado') {
    return <Resultado resultado={fase.resultado} onNuevoIntento={() => setFase({ kind: 'intro' })} />;
  }

  if (fase.kind === 'preguntas') {
    const qid = fase.orden.questionOrder[fase.indice]!;
    return (
      <PreguntaVista
        pregunta={porId(qid)}
        orden={fase.orden.optionOrder[qid]!}
        indice={fase.indice}
        total={fase.orden.questionOrder.length}
        seleccion={respuestas[qid] ?? null}
        onSeleccion={(op) => setRespuestas((r) => ({ ...r, [qid]: op }))}
        onAnterior={() => setFase({ ...fase, indice: Math.max(0, fase.indice - 1) })}
        onSiguiente={() =>
          fase.indice + 1 < fase.orden.questionOrder.length
            ? setFase({ ...fase, indice: fase.indice + 1 })
            : setFase({ kind: 'revision', orden: fase.orden, attemptId: fase.attemptId })
        }
      />
    );
  }

  if (fase.kind === 'revision') {
    const faltan = fase.orden.questionOrder.filter((q) => !respuestas[q]);
    return (
      <div className="pantalla evaluacion">
        <Encabezado>Revisar antes de enviar</Encabezado>
        <BannerDemo contexto="Este resultado no se registra." />
        <p>Las soluciones se muestran después de enviar todo el intento.</p>
        <ol className="revision">
          {fase.orden.questionOrder.map((q, i) => (
            <li key={q}>
              <button
                type="button"
                className="enlace"
                onClick={() => setFase({ kind: 'preguntas', orden: fase.orden, attemptId: fase.attemptId, indice: i })}
              >
                Pregunta {i + 1}: {porId(q).title}
              </button>{' '}
              — {respuestas[q] ? 'respondida' : <strong>sin responder</strong>}
            </li>
          ))}
        </ol>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          className="boton boton--principal"
          disabled={faltan.length > 0 || ocupado}
          onClick={() => enviar(fase.orden, fase.attemptId)}
        >
          {ocupado ? 'Enviando…' : 'Enviar evaluación'}
        </button>
        {faltan.length > 0 && <p className="ayuda">Responde todas las preguntas para enviar.</p>}
      </div>
    );
  }

  return (
    <div className="pantalla evaluacion">
      <Encabezado>Evaluación final</Encabezado>
      <BannerDemo contexto="En esta versión la evaluación se puntúa en tu dispositivo y no se registra en ningún servidor." />
      <ul>
        <li>Diez preguntas con casos nuevos, independientes de tu recorrido de práctica. Sin límite de tiempo.</li>
        <li>Las soluciones se muestran solo después de enviar todo el intento.</li>
        <li>{notaUmbral}</li>
        <li>Es una evaluación formativa: no es un examen supervisado ni un certificado.</li>
      </ul>
      {intentos > 0 && <p className="aviso aviso--info">{textosResultado.practicaReforzada}</p>}
      {modoRegistro && requisito === 'sesion' && (
        <p className="aviso">
          Para registrar tu resultado, <Link to="/cuenta">inicia sesión con un correo verificado</Link> antes de empezar.
        </p>
      )}
      {modoRegistro && requisito === 'perfil' && (
        <p className="aviso">
          <Link to="/cuenta">Completa tu nombre y organización</Link> antes de empezar.
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        className="boton boton--principal"
        onClick={iniciar}
        disabled={ocupado || (modoRegistro && requisito !== null)}
      >
        {intentos > 0 ? 'Iniciar un nuevo intento' : 'Iniciar evaluación'}
      </button>
    </div>
  );
}

function PreguntaVista({
  pregunta,
  orden,
  indice,
  total,
  seleccion,
  onSeleccion,
  onAnterior,
  onSiguiente,
}: {
  pregunta: Question;
  orden: string[];
  indice: number;
  total: number;
  seleccion: string | null;
  onSeleccion: (id: string) => void;
  onAnterior: () => void;
  onSiguiente: () => void;
}) {
  const ref = useEnfocar<HTMLHeadingElement>(pregunta.id);
  return (
    <div className="pantalla evaluacion">
      <div className="progreso">
        <span id="prog-ev">
          Pregunta {indice + 1} de {total}
        </span>
        <progress max={total} value={indice + 1} aria-labelledby="prog-ev" />
      </div>
      <BannerDemo contexto="Resultado no registrado." />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (seleccion) onSiguiente();
        }}
      >
        <fieldset>
          <legend>
            <h1 ref={ref} tabIndex={-1}>
              {pregunta.title}
            </h1>
          </legend>
          <p className="pregunta__enunciado">{pregunta.stem}</p>
          {orden.map((oid) => {
            const o = pregunta.options.find((x) => x.id === oid)!;
            return (
              <div className="opcion-lectura" key={oid}>
                <input
                  type="radio"
                  id={`r-${oid}`}
                  name={pregunta.id}
                  checked={seleccion === oid}
                  onChange={() => onSeleccion(oid)}
                />
                <label htmlFor={`r-${oid}`}>{o.text}</label>
              </div>
            );
          })}
        </fieldset>
        <div className="acciones">
          <button type="button" className="boton boton--secundario" onClick={onAnterior} disabled={indice === 0}>
            Anterior
          </button>
          <button type="submit" className="boton boton--principal" disabled={!seleccion}>
            {indice + 1 < total ? 'Siguiente' : 'Revisar respuestas'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function Resultado({ resultado, onNuevoIntento }: { resultado: ResultadoVista; onNuevoIntento: () => void }) {
  const { ep, estado } = useApp();
  const ref = useEnfocar<HTMLHeadingElement>('resultado');
  const [herramienta, setHerramienta] = useState<ToolId | null>(null);
  const botonNuevo = useRef<HTMLButtonElement>(null);
  const texto =
    resultado.estado === 'aprobado'
      ? textosResultado.aprobado(resultado.score, resultado.version)
      : resultado.estado === 'critico_fallido'
        ? textosResultado.criticoFallido(resultado.score)
        : textosResultado.insuficiente;
  const criticasFallidas = preguntas.filter((p) => resultado.failedCritical.includes(p.id));

  return (
    <div className="pantalla resultado">
      <h1 ref={ref} tabIndex={-1}>
        {resultado.registrado ? 'Tu resultado' : 'Resultado de demostración (no registrado)'}
      </h1>
      {!resultado.registrado && (
        <p className="banner-demo" role="note">
          <strong>Demostración no registrada.</strong> Este resultado no se guardó en ningún servidor y no cuenta como
          aprobación.
        </p>
      )}
      <div className={`resultado__caja resultado__caja--${resultado.estado}`}>
        <p className="resultado__puntaje">
          {resultado.score}/{resultado.total}
        </p>
        <p>{texto}</p>
        {resultado.registrado && resultado.passed && (
          <p className="ayuda">No es un certificado oficial ni acredita la formación completa.</p>
        )}
      </div>

      {criticasFallidas.length > 0 && (
        <section aria-labelledby="criticos-titulo">
          <h2 id="criticos-titulo">Criterio esencial a reforzar</h2>
          {criticasFallidas.map((p) => {
            const s = ep.scenes[p.recovery.sceneId];
            const d = s.decision;
            const adecuada = d.kind === 'choice' ? d.options.find((o) => o.outcome.type === 'avanza') : undefined;
            return (
              <article key={p.id} className="recuperacion">
                <h3>{p.criterion}</h3>
                <p>
                  <strong>Caso de recuperación — {s.title}:</strong>{' '}
                  {adecuada ? <>«{textoRol(adecuada.label, estado.role)}» {adecuada.feedback}</> : null}
                </p>
                <p>{p.explanation}</p>
                <button type="button" className="boton boton--secundario" onClick={() => setHerramienta(p.recovery.toolId)}>
                  Consultar la herramienta relacionada
                </button>
              </article>
            );
          })}
        </section>
      )}

      <section aria-labelledby="detalle-titulo">
        <h2 id="detalle-titulo">Detalle por pregunta</h2>
        <ol className="detalle">
          {preguntas.map((p) => {
            const r = resultado.perQuestion[p.id];
            const correcta = p.options.find((o) => o.id === r?.correctOption);
            return (
              <li key={p.id} className={r?.correct ? 'detalle--ok' : 'detalle--mejora'}>
                <p className="detalle__titulo">
                  <IconoResultado tipo={r?.correct ? 'ok' : 'mejora'} /> {p.title}
                  {p.critical && ' (crítica)'} — {r?.correct ? 'Correcta' : 'Para revisar'}
                </p>
                {!r?.correct && correcta && (
                  <p>
                    <strong>Respuesta adecuada:</strong> {correcta.text}
                  </p>
                )}
                <p>{p.explanation}</p>
                {p.complementaryNote && <p className="nota-complementaria">{p.complementaryNote}</p>}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="acciones">
        {!resultado.passed && <p className="aviso aviso--info">{textosResultado.practicaReforzada}</p>}
        <button ref={botonNuevo} type="button" className="boton boton--principal" onClick={onNuevoIntento}>
          Realizar un nuevo intento
        </button>
        <Link className="boton" to="/jugar">
          Volver a practicar
        </Link>
        {resultado.registrado && (
          <Link className="boton boton--secundario" to="/cuenta">
            Ver mis resultados
          </Link>
        )}
      </div>
      <DialogoHerramientas
        key={herramienta ?? 'ninguna'}
        abierto={herramienta !== null}
        inicial={herramienta}
        onCerrar={() => setHerramienta(null)}
      />
    </div>
  );
}

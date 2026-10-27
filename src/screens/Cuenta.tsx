import { textoEstadoRegistro } from '../engine/vigencia';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../config/modo';
import { avisoPrevioRegistro, camposPrivacidadPendientes, finalidadRegistro, privacidad } from '../config/privacidad';
import {
  cerrarSesion,
  enviarCodigo,
  ErrorRegistro,
  guardarPerfil,
  leerPerfil,
  misResultados,
  registroDisponible,
  sesionActual,
  verificarCodigo,
  type MiResultado,
} from '../services/registro';
import { episodioPorId } from '../content/episodios';
import { Encabezado } from '../ui/comunes';

export function Cuenta() {
  if (config.modo !== 'registro' || !registroDisponible()) return <CuentaDemo />;
  return <CuentaRegistro />;
}

function CuentaDemo() {
  return (
    <div className="pantalla">
      <Encabezado>Cuenta y resultados</Encabezado>
      <p className="banner-demo" role="note">
        <strong>Demostración no registrada.</strong> Esta versión no tiene un servidor de registro configurado. Puedes practicar
        y hacer la evaluación, pero ningún resultado se registra ni cuenta como aprobación.
      </p>
      <p>
        Cuando la institución active el registro, podrás identificarte con un correo verificado (se admiten correos de
        organizaciones socias) y consultar aquí tu propio resultado.
      </p>
      <h2>Aviso previo al registro</h2>
      <p>{avisoPrevioRegistro}</p>
      <p>{finalidadRegistro}</p>
      <AvisoPrivacidad />
      <Link className="boton" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}

export function AvisoPrivacidad() {
  const pendientes = camposPrivacidadPendientes();
  return (
    <section className="aviso" aria-labelledby="priv-titulo">
      <h2 id="priv-titulo">Aviso de privacidad</h2>
      {pendientes.length > 0 ? (
        <p>
          Pendiente de completar por la institución antes de activar el registro real: {pendientes.join(', ')}.
        </p>
      ) : (
        <dl>
          <dt>Responsable del tratamiento</dt>
          <dd>{privacidad.responsableTratamiento}</dd>
          <dt>Plazo de conservación</dt>
          <dd>{privacidad.plazoConservacion}</dd>
          <dt>Base jurídica</dt>
          <dd>{privacidad.baseJuridica}</dd>
          <dt>Consultas</dt>
          <dd>{privacidad.canalConsultas}</dd>
        </dl>
      )}
      <p>
        Datos registrados: identificador, nombre, correo verificado, organización, episodio y versión, fecha, puntaje y estado.
        No se guardan relatos, decisiones de práctica ni información de personajes. No se usa analítica ni rastreadores.
      </p>
      {privacidad.vigenciaAprobacion && <p>Vigencia de la aprobación: {privacidad.vigenciaAprobacion}</p>}
    </section>
  );
}

function CuentaRegistro() {
  const [sesion, setSesion] = useState<{ email: string } | null | undefined>(undefined);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoEnviado, setCodigoEnviado] = useState(false);
  const [nombre, setNombre] = useState('');
  const [organizacion, setOrganizacion] = useState('');
  const [aceptado, setAceptado] = useState(false);
  const [resultados, setResultados] = useState<MiResultado[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refrescar = useCallback(async () => {
    try {
      const s = await sesionActual();
      setSesion(s);
      if (s) {
        const p = await leerPerfil();
        setNombre(p?.display_name ?? '');
        setOrganizacion(p?.organization ?? '');
        setAceptado(Boolean(p?.display_name));
        setResultados(await misResultados());
      }
    } catch (e) {
      setError(e instanceof ErrorRegistro ? e.message : 'No se pudo cargar la cuenta.');
    }
  }, []);

  useEffect(() => {
    void refrescar();
  }, [refrescar]);

  const ejecutar = async (f: () => Promise<void>) => {
    setError(null);
    setMensaje(null);
    try {
      await f();
    } catch (e) {
      setError(e instanceof ErrorRegistro ? e.message : 'Ocurrió un error.');
    }
  };

  if (sesion === undefined) return <div className="pantalla"><Encabezado>Cuenta</Encabezado><p>Cargando…</p></div>;

  if (!sesion) {
    return (
      <div className="pantalla">
        <Encabezado>Identificarte para registrar tu evaluación</Encabezado>
        <p>{avisoPrevioRegistro}</p>
        <p>Recibirás un código de un solo uso en tu correo. Se admiten correos de ChildFund y de organizaciones socias.</p>
        {!codigoEnviado ? (
          <form onSubmit={(e) => { e.preventDefault(); void ejecutar(async () => { await enviarCodigo(email); setCodigoEnviado(true); setMensaje('Te enviamos un código. Revisa tu correo.'); }); }}>
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" className="boton boton--principal">Enviar código</button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); void ejecutar(async () => { await verificarCodigo(email, codigo); setCodigo(''); await refrescar(); }); }}>
            <label htmlFor="codigo">Código recibido</label>
            <input id="codigo" inputMode="numeric" autoComplete="one-time-code" required value={codigo} onChange={(e) => setCodigo(e.target.value)} />
            <button type="submit" className="boton boton--principal">Verificar</button>
            <button type="button" className="boton boton--secundario" onClick={() => setCodigoEnviado(false)}>Usar otro correo</button>
          </form>
        )}
        {mensaje && <p role="status">{mensaje}</p>}
        {error && <p className="error" role="alert">{error}</p>}
        <AvisoPrivacidad />
      </div>
    );
  }

  return (
    <div className="pantalla">
      <Encabezado>Tu cuenta</Encabezado>
      <p>Sesión iniciada con {sesion.email}.</p>
      <form
        className="perfil"
        onSubmit={(e) => {
          e.preventDefault();
          void ejecutar(async () => {
            await guardarPerfil({ display_name: nombre, organization: organizacion });
            setMensaje('Datos guardados.');
          });
        }}
      >
        <h2>Tus datos</h2>
        <p className="ayuda">Nombre y organización son autodeclarados.</p>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" required maxLength={120} autoComplete="name" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <label htmlFor="org">Organización</label>
        <input id="org" required maxLength={160} autoComplete="organization" value={organizacion} onChange={(e) => setOrganizacion(e.target.value)} />
        <div className="confirmacion-adulta">
          <input id="acepto" type="checkbox" checked={aceptado} onChange={(e) => setAceptado(e.target.checked)} required />
          <label htmlFor="acepto">He leído el aviso previo al registro y el aviso de privacidad.</label>
        </div>
        <button type="submit" className="boton boton--principal" disabled={!aceptado}>Guardar</button>
      </form>
      {mensaje && <p role="status">{mensaje}</p>}
      {error && <p className="error" role="alert">{error}</p>}

      <h2>Tus resultados</h2>
      {resultados.length === 0 ? (
        <p>Aún no tienes resultados registrados.</p>
      ) : (
        <div className="tabla-contenedor" tabIndex={0} role="region" aria-label="Tabla de tus resultados">
          <table>
            <thead>
              <tr><th scope="col">Fecha</th><th scope="col">Módulo</th><th scope="col">Versión</th><th scope="col">Puntaje</th><th scope="col">Estado</th></tr>
            </thead>
            <tbody>
              {resultados.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleDateString('es-EC')}</td>
                  <td>{episodioPorId(r.episode_id)?.title ?? r.episode_id}</td>
                  <td>{r.content_version}</td>
                  <td>{r.score}/10</td>
                  <td>{textoEstadoRegistro({ status: r.status, created_at: r.created_at })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AvisoPrivacidad />
      <div className="acciones">
        <Link className="boton" to="/">Ir a los módulos</Link>
        <button
          type="button"
          className="boton boton--secundario"
          onClick={() => void ejecutar(async () => {
            await cerrarSesion();
            setSesion(null);
            setResultados([]);
            setNombre('');
            setOrganizacion('');
            setEmail('');
          })}
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { config } from '../config/modo';
import { aCsv } from '../services/csv';
import { registrosFicticios } from '../services/demo';
import {
  adminAnular,
  adminExportar,
  adminListar,
  ErrorRegistro,
  estadoMfa,
  inscribirTotp,
  registroDisponible,
  sesionActual,
  verificarTotp,
  type FiltrosAdmin,
  type RegistroAdmin,
} from '../services/registro';
import { episodioPorId, episodios } from '../content/episodios';
import { textoEstadoRegistro } from '../engine/vigencia';
import { Encabezado } from '../ui/comunes';

// La interfaz no concede permisos: el servidor comprueba rol de Punto Focal activo y MFA (aal2) en cada llamada.

const ENCABEZADOS = ['Nombre', 'Correo', 'Organización', 'Módulo', 'Versión', 'Fecha', 'Puntaje', 'Estado'];

function descargar(contenido: string, nombre: string) {
  const blob = new Blob(['﻿' + contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

export function PuntoFocal() {
  const demo = config.modo !== 'registro' || !registroDisponible();
  return demo ? <PanelDemo /> : <PanelRegistro />;
}

function Tabla({ filas, onAnular }: { filas: RegistroAdmin[]; onAnular?: (r: RegistroAdmin) => void }) {
  if (filas.length === 0) return <p>No hay registros con estos filtros.</p>;
  return (
    <div className="tabla-contenedor" tabIndex={0} role="region" aria-label="Tabla de registros">
      <table>
        <caption className="solo-lector">Registros de evaluación</caption>
        <thead>
          <tr>
            {ENCABEZADOS.map((h) => (
              <th key={h} scope="col">{h}</th>
            ))}
            {onAnular && <th scope="col">Acción</th>}
          </tr>
        </thead>
        <tbody>
          {filas.map((r) => (
            <tr key={r.id}>
              <td>{r.display_name}</td>
              <td>{r.email}</td>
              <td>{r.organization}</td>
              <td>{episodioPorId(r.episode_id)?.title ?? r.episode_id}</td>
              <td>{r.content_version}</td>
              <td>{new Date(r.created_at).toLocaleDateString('es-EC')}</td>
              <td>{r.score}/10</td>
              <td>{textoEstadoRegistro(r)}</td>
              {onAnular && (
                <td>
                  {r.status !== 'anulado' && (
                    <button type="button" className="boton boton--secundario" onClick={() => onAnular(r)}>
                      Anular
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Filtros({ valor, onCambio }: { valor: FiltrosAdmin; onCambio: (f: FiltrosAdmin) => void }) {
  return (
    <fieldset className="filtros">
      <legend>Filtros</legend>
      <label htmlFor="f-mod">Módulo</label>
      <select id="f-mod" value={valor.episode_id ?? ''} onChange={(e) => onCambio({ ...valor, episode_id: e.target.value })}>
        <option value="">Todos</option>
        {episodios.map((ep) => (
          <option key={ep.id} value={ep.id}>
            {ep.rotulo}: {ep.title}
          </option>
        ))}
      </select>
      <label htmlFor="f-org">Organización</label>
      <input id="f-org" value={valor.organization ?? ''} onChange={(e) => onCambio({ ...valor, organization: e.target.value })} />
      <label htmlFor="f-ver">Versión</label>
      <input id="f-ver" value={valor.content_version ?? ''} onChange={(e) => onCambio({ ...valor, content_version: e.target.value })} />
      <label htmlFor="f-est">Estado</label>
      <select id="f-est" value={valor.status ?? ''} onChange={(e) => onCambio({ ...valor, status: e.target.value })}>
        <option value="">Todos</option>
        <option value="aprobado">Aprobado</option>
        <option value="no_aprobado">No aprobado</option>
        <option value="anulado">Anulado</option>
      </select>
      <label htmlFor="f-desde">Desde</label>
      <input id="f-desde" type="date" value={valor.from ?? ''} onChange={(e) => onCambio({ ...valor, from: e.target.value })} />
      <label htmlFor="f-hasta">Hasta</label>
      <input id="f-hasta" type="date" value={valor.to ?? ''} onChange={(e) => onCambio({ ...valor, to: e.target.value })} />
    </fieldset>
  );
}

function PanelDemo() {
  const [f, setF] = useState<FiltrosAdmin>({});
  const filas = registrosFicticios.filter(
    (r) =>
      (!f.organization || r.organization.toLowerCase().includes(f.organization.toLowerCase())) &&
      (!f.status || r.status === f.status) &&
      (!f.episode_id || r.episode_id === f.episode_id) &&
      (!f.content_version || r.content_version === f.content_version),
  );
  return (
    <div className="pantalla panel-pf">
      <Encabezado>Panel del Punto Focal</Encabezado>
      <p className="banner-demo" role="note">
        <strong>Demostración con datos ficticios.</strong> No hay registros reales. En la versión con registro, este panel exige
        iniciar sesión como Punto Focal activo con verificación en dos pasos, comprobada en el servidor.
      </p>
      <Filtros valor={f} onCambio={setF} />
      <Tabla filas={filas} />
      <button
        type="button"
        className="boton"
        onClick={() =>
          descargar(
            aCsv(ENCABEZADOS, filas.map((r) => [r.display_name, r.email, r.organization, r.episode_id, r.content_version, r.created_at, r.score, r.status])),
            'demostracion-datos-ficticios.csv',
          )
        }
      >
        Exportar CSV de demostración
      </button>
    </div>
  );
}

function PanelRegistro() {
  const [estado, setEstado] = useState<'cargando' | 'sin_sesion' | 'mfa_inscribir' | 'mfa_verificar' | 'listo'>('cargando');
  const [factor, setFactor] = useState<{ id: string; qr?: string; secret?: string } | null>(null);
  const [codigo, setCodigo] = useState('');
  const [filtros, setFiltros] = useState<FiltrosAdmin>({});
  const [filas, setFilas] = useState<RegistroAdmin[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [anulando, setAnulando] = useState<RegistroAdmin | null>(null);
  const [motivo, setMotivo] = useState('');

  const evaluar = useCallback(async () => {
    const s = await sesionActual();
    if (!s) return setEstado('sin_sesion');
    const m = await estadoMfa();
    if (m.aal === 'aal2') return setEstado('listo');
    if (m.factorId) {
      setFactor({ id: m.factorId });
      return setEstado('mfa_verificar');
    }
    setEstado('mfa_inscribir');
  }, []);

  useEffect(() => {
    void evaluar().catch(() => setEstado('sin_sesion'));
  }, [evaluar]);

  const cargar = useCallback(async () => {
    setError(null);
    try {
      setFilas(await adminListar(filtros));
    } catch (e) {
      setFilas([]);
      setError(e instanceof ErrorRegistro ? e.message : 'No se pudo consultar.');
    }
  }, [filtros]);

  useEffect(() => {
    if (estado === 'listo') void cargar();
  }, [estado, cargar]);

  if (estado === 'cargando') return <div className="pantalla"><Encabezado>Panel del Punto Focal</Encabezado><p>Cargando…</p></div>;
  if (estado === 'sin_sesion')
    return (
      <div className="pantalla">
        <Encabezado>Panel del Punto Focal</Encabezado>
        <p>Inicia sesión desde «Mi cuenta». El acceso solo se concede a la persona designada como Punto Focal activo.</p>
      </div>
    );

  if (estado === 'mfa_inscribir' || estado === 'mfa_verificar') {
    return (
      <div className="pantalla">
        <Encabezado>Verificación en dos pasos</Encabezado>
        <p>El acceso administrativo exige verificación en dos pasos (TOTP).</p>
        {estado === 'mfa_inscribir' && !factor?.qr && (
          <button type="button" className="boton" onClick={async () => {
            try { const f = await inscribirTotp(); setFactor({ id: f.factorId, qr: f.qr, secret: f.secret }); } catch (e) { setError((e as Error).message); }
          }}>Configurar aplicación de autenticación</button>
        )}
        {factor?.qr && (
          <>
            <img src={factor.qr} alt="Código QR para tu aplicación de autenticación" width={180} height={180} />
            <p>Si no puedes escanearlo, introduce esta clave: <code>{factor.secret}</code></p>
          </>
        )}
        {factor && (
          <form onSubmit={async (e) => {
            e.preventDefault();
            try { await verificarTotp(factor.id, codigo); setCodigo(''); await evaluar(); } catch (er) { setError((er as Error).message); }
          }}>
            <label htmlFor="totp">Código de 6 dígitos</label>
            <input id="totp" inputMode="numeric" autoComplete="one-time-code" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
            <button type="submit" className="boton boton--principal">Verificar</button>
          </form>
        )}
        {error && <p className="error" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="pantalla panel-pf">
      <Encabezado>Panel del Punto Focal</Encabezado>
      <p className="ayuda">Nombre y organización son autodeclarados por cada participante. Cada consulta y exportación queda registrada.</p>
      <Filtros valor={filtros} onCambio={setFiltros} />
      <button type="button" className="boton" onClick={() => void cargar()}>Aplicar filtros</button>
      {error && <p className="error" role="alert">{error}</p>}
      <Tabla filas={filas} onAnular={(r) => { setAnulando(r); setMotivo(''); }} />
      <button type="button" className="boton" onClick={async () => {
        try { descargar(await adminExportar(filtros), 'registro-evaluaciones.csv'); } catch (e) { setError((e as Error).message); }
      }}>Exportar CSV privado</button>
      {anulando && (
        <form className="anular" onSubmit={async (e) => {
          e.preventDefault();
          try { await adminAnular(anulando.id, motivo); setAnulando(null); await cargar(); } catch (er) { setError((er as Error).message); }
        }}>
          <h2>Anular registro de {anulando.display_name}</h2>
          <label htmlFor="motivo">Motivo (obligatorio)</label>
          <input id="motivo" required minLength={5} maxLength={300} value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          <button type="submit" className="boton boton--principal">Confirmar anulación</button>
          <button type="button" className="boton boton--secundario" onClick={() => setAnulando(null)}>Cancelar</button>
        </form>
      )}
    </div>
  );
}

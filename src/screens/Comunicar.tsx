import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { RoleId } from '../content/types';
import { usePrefs } from '../state/AppState';
import { Encabezado } from '../ui/comunes';
import { ListaCanales, ListaServicios } from './Juego';

/** Panel institucional separado del juego. No es un formulario y no transfiere datos del juego. */
export function Comunicar() {
  const { prefs } = usePrefs();
  const [rol, setRol] = useState<RoleId>(prefs.ultimoRol ?? 'cf');
  return (
    <div className="pantalla comunicar">
      <p className="rotulo-institucional">Información institucional</p>
      <Encabezado>Cómo comunicar una preocupación real</Encabezado>
      <div className="aviso">
        <p>
          <strong>Este juego no es un sistema de denuncias.</strong> No envía información a ningún canal, no transfiere tus
          decisiones, tu perfil ni tu historial de juego y no precarga datos en formularios externos.
        </p>
      </div>
      <p>
        Si conoces una preocupación real de salvaguarda, comunícala dentro de 24 horas por los mecanismos institucionales, con la
        información disponible. No necesitas pruebas ni certeza.
      </p>
      <div className="aviso" role="note">
        <h2>Si hay peligro inmediato</h2>
        <p>
          Llama al <strong>911</strong> para proteger la seguridad física de la persona y activa de inmediato al Punto Focal de
          Salvaguarda. No actúes solo o sola.
        </p>
      </div>
      <h2>Canales institucionales</h2>
      <fieldset className="selector-rol">
        <legend>Mostrar la ruta para</legend>
        <div>
          <input type="radio" id="c-cf" name="rol" checked={rol === 'cf'} onChange={() => setRol('cf')} />
          <label htmlFor="c-cf">Personal de ChildFund Ecuador</label>
        </div>
        <div>
          <input type="radio" id="c-socio" name="rol" checked={rol === 'socio'} onChange={() => setRol('socio')} />
          <label htmlFor="c-socio">Personal de una organización socia</label>
        </div>
      </fieldset>
      {rol === 'socio' && (
        <p>
          Activa el mecanismo de tu organización y su articulación con ChildFund según la ruta y los acuerdos aplicables, sin
          retrasar la comunicación por falta de una autorización interna.
        </p>
      )}
      <p>Si no es seguro o adecuado usar el canal habitual, existen otras vías institucionales, incluidas vías anónimas.</p>
      <ListaCanales rol={rol} />
      <p className="ayuda">
        Los contactos se publicarán como enlaces solo después de que la institución los verifique. Mientras tanto, consulta a tu
        Punto Focal de Salvaguarda.
      </p>
      <h2>Servicios públicos de protección y denuncia</h2>
      <ListaServicios />
      <Link className="boton" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}

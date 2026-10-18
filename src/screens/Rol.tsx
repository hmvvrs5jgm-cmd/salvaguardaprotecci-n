import { useNavigate, useSearchParams } from 'react-router-dom';
import { portada } from '../content/episodio1';
import type { RoleId } from '../content/types';
import { useApp } from '../state/AppState';
import { Encabezado } from '../ui/comunes';

export function Rol() {
  const { estado, despachar, prefs } = useApp();
  const navegar = useNavigate();
  const [params] = useSearchParams();
  const destino = params.get('modo') === 'lectura' ? '/lectura' : '/jugar';

  if (!prefs.adultoConfirmado) {
    return (
      <div className="pantalla">
        <Encabezado>Antes de comenzar</Encabezado>
        <p>Confirma en la portada que eres una persona mayor de 18 años.</p>
        <button type="button" className="boton" onClick={() => navegar('/')}>
          Ir a la portada
        </button>
      </div>
    );
  }

  const elegir = (role: RoleId) => {
    despachar(estado.role ? { type: 'CAMBIAR_ROL', role } : { type: 'ELEGIR_ROL', role });
    navegar(destino);
  };

  return (
    <div className="pantalla rol">
      <Encabezado>{portada.rolPregunta}</Encabezado>
      <p className="rol__mensaje">{portada.rolMensaje}</p>
      {estado.role && (
        <p className="aviso aviso--info">Si eliges un rol, el recorrido se reinicia desde la primera escena.</p>
      )}
      <ul className="opciones" role="list">
        {(['cf', 'socio'] as RoleId[]).map((r) => (
          <li key={r}>
            <button type="button" className="opcion" onClick={() => elegir(r)} aria-current={estado.role === r ? 'true' : undefined}>
              {portada.roles[r]}
            </button>
          </li>
        ))}
      </ul>
      <p className="ayuda">El rol de práctica solo cambia algunos textos de la ruta. No otorga permisos en la aplicación.</p>
    </div>
  );
}

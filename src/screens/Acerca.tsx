import { Link } from 'react-router-dom';
import { config } from '../config/modo';
import { fuentes } from '../config/fuentes';
import { notaUmbral } from '../content/episodio1';
import { useApp } from '../state/AppState';
import { Encabezado } from '../ui/comunes';
import { AvisoPrivacidad } from './Cuenta';

export function Acerca() {
  const { ep } = useApp();
  return (
    <div className="pantalla">
      <Encabezado>Acerca de este juego</Encabezado>
      <p>
        <strong>Decisiones que protegen</strong> es un juego formativo para personas adultas del personal técnico de ChildFund
        Ecuador y de organizaciones socias. Todas las personas, organizaciones y situaciones son ficticias.
      </p>
      <h2>Episodios</h2>
      <ul>
        <li>
          Episodio {ep.number}: {ep.title}, versión {ep.version}.
        </li>
      </ul>
      <h2>Fuentes</h2>
      <ul>
        {fuentes.map((f) => (
          <li key={f.nombre}>
            <strong>{f.nombre}.</strong> {f.detalle} {'advertencia' in f && <em>{f.advertencia}</em>}
          </li>
        ))}
      </ul>
      <h2>Límites</h2>
      <ul>
        <li>Aprobar acredita únicamente este episodio y versión. No es un certificado oficial ni habilita para investigar o gestionar casos.</li>
        <li>{notaUmbral}</li>
        <li>
          El código del juego es público: la evaluación es formativa y sin supervisión, por lo que no impide consultar las
          respuestas.
        </li>
        <li>No hay chatbot ni respuestas generadas en tiempo real: todas las ramas están redactadas y revisadas previamente.</li>
        <li>Modo de esta versión: {config.modo === 'demo' ? 'demostración no registrada' : 'registro privado'}.</li>
      </ul>
      <AvisoPrivacidad />
      <p>
        <Link to="/punto-focal">Panel del Punto Focal</Link> (acceso restringido)
      </p>
      <Link className="boton" to="/">
        Volver a la portada
      </Link>
    </div>
  );
}

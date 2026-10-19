import { Link } from 'react-router-dom';
import { config } from '../config/modo';
import { fuentes } from '../config/fuentes';
import { episodios } from '../content/episodios';
import { Encabezado } from '../ui/comunes';
import { AvisoPrivacidad } from './Cuenta';

export function Acerca() {
  return (
    <div className="pantalla">
      <Encabezado>Acerca de este juego</Encabezado>
      <p>
        <strong>Decisiones que protegen</strong> es un juego formativo para personas adultas del personal técnico de ChildFund
        Ecuador y de organizaciones socias. Todas las personas, organizaciones y situaciones son ficticias.
      </p>
      <h2>Módulos</h2>
      <ul>
        {episodios.map((ep) => (
          <li key={ep.id}>
            {ep.rotulo}: {ep.title}, versión de contenido {ep.version}.
          </li>
        ))}
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
        <li>Aprobar acredita únicamente el módulo y la versión evaluados; cada módulo tiene su propio resultado. No es un certificado oficial ni habilita para investigar o gestionar casos.</li>
        {episodios.map((ep) => (
          <li key={ep.id}>
            {ep.rotulo}: {ep.evaluacion.notaUmbral}
          </li>
        ))}
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
        Volver al inicio
      </Link>
    </div>
  );
}

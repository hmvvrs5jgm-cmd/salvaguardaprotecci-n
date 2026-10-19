import { Link } from 'react-router-dom';
import type { Preferencias } from '../engine/almacen';
import { usePrefs } from '../state/AppState';
import { Encabezado } from '../ui/comunes';

const opciones: Array<{ clave: keyof Preferencias; etiqueta: string; ayuda: string }> = [
  { clave: 'textoGrande', etiqueta: 'Texto grande', ayuda: 'Aumenta el tamaño de todo el texto.' },
  { clave: 'altoContraste', etiqueta: 'Contraste alto', ayuda: 'Refuerza bordes y colores de texto.' },
  {
    clave: 'movimientoReducido',
    etiqueta: 'Reducir movimiento',
    ayuda: 'Desactiva transiciones. También se aplica si tu sistema lo solicita.',
  },
  { clave: 'sonido', etiqueta: 'Sonido', ayuda: 'El juego no usa sonido; la opción queda desactivada por defecto.' },
];

export function Accesibilidad() {
  const { prefs, setPrefs } = usePrefs();
  return (
    <div className="pantalla">
      <Encabezado>Accesibilidad</Encabezado>
      <p>Ajustes guardados solo en este dispositivo. Salir o usar una alternativa accesible no reduce la calificación.</p>
      <fieldset className="ajustes">
        <legend>Preferencias de lectura</legend>
        {opciones.map((o) => (
          <div className="ajuste" key={o.clave}>
            <input
              id={`pref-${o.clave}`}
              type="checkbox"
              checked={Boolean(prefs[o.clave])}
              onChange={(e) => setPrefs({ [o.clave]: e.target.checked })}
              aria-describedby={`ayuda-${o.clave}`}
            />
            <label htmlFor={`pref-${o.clave}`}>{o.etiqueta}</label>
            <p className="ayuda" id={`ayuda-${o.clave}`}>
              {o.ayuda}
            </p>
          </div>
        ))}
      </fieldset>
      <h2>Otras formas de jugar</h2>
      <ul>
        <li>
          Cada módulo tiene una versión de lectura equivalente, que se elige en su portada: presenta las mismas decisiones,
          reparaciones y retroalimentación sin ilustraciones. <Link to="/">Elegir un módulo</Link>.
        </li>
        <li>Todo se puede usar con teclado: Tab para moverse, Enter o Espacio para elegir y Escape para cerrar paneles.</li>
        <li>Puedes pausar en cualquier momento: el progreso se conserva en este dispositivo.</li>
      </ul>
      <Link className="boton" to="/">
        Volver al inicio
      </Link>
    </div>
  );
}

// Personajes de cuerpo entero sobre un fondo neutro (imágenes locales optimizadas en src/assets/personajes).
// Imágenes generadas con IA que representan a personas ficticias. La persona señalada no tiene retrato.

import type { CharacterId, Pose } from '../content/types';
import marielaAtenta from '../assets/personajes/mariela-atenta.webp';
import marielaPensativa from '../assets/personajes/mariela-pensativa.webp';
import marielaExplica from '../assets/personajes/mariela-explica.webp';
import elenaAtenta from '../assets/personajes/elena-atenta.webp';
import elenaPensativa from '../assets/personajes/elena-pensativa.webp';
import elenaExplica from '../assets/personajes/elena-explica.webp';
import referenteAtenta from '../assets/personajes/referente-atenta.webp';
import referentePensativa from '../assets/personajes/referente-pensativa.webp';
import referenteExplica from '../assets/personajes/referente-explica.webp';
import luciaAtenta from '../assets/personajes/lucia-atenta.webp';
import luciaPensativa from '../assets/personajes/lucia-pensativa.webp';
import luciaExplica from '../assets/personajes/lucia-explica.webp';
import profesionalAtenta from '../assets/personajes/profesional-atenta.webp';
import profesionalExplica from '../assets/personajes/profesional-explica.webp';

const personajes: Record<CharacterId, Record<Pose, string>> = {
  mariela: { atenta: marielaAtenta, pensativa: marielaPensativa, explica: marielaExplica },
  elena: { atenta: elenaAtenta, pensativa: elenaPensativa, explica: elenaExplica },
  referente: { atenta: referenteAtenta, pensativa: referentePensativa, explica: referenteExplica },
  lucia: { atenta: luciaAtenta, pensativa: luciaPensativa, explica: luciaExplica },
  // La profesional no tiene pose pensativa: se usa la atenta.
  profesional: { atenta: profesionalAtenta, pensativa: profesionalAtenta, explica: profesionalExplica },
};

const descripciones: Record<CharacterId, string> = {
  mariela: 'Mariela, participante adulta del programa, con chaqueta tejida color terracota.',
  elena: 'Elena, integrante del equipo técnico, con chaleco verde y credencial.',
  referente: 'El Referente, rol competente de la ruta, con camisa verde y credencial.',
  lucia: 'Lucía, adolescente participante del taller, con chaqueta azul con capucha y jeans.',
  profesional: 'Profesional de un servicio de atención, con chaqueta de punto verde, gafas y credencial.',
};

const gestos: Record<Pose, string> = {
  atenta: 'escucha con atención',
  pensativa: 'se muestra pensativa',
  explica: 'habla y explica con las manos abiertas',
};

export function Retrato({ id, pose = 'atenta', activo }: { id: CharacterId; pose?: Pose; activo?: boolean }) {
  return (
    <img
      className={`retrato retrato--${id}${activo ? ' retrato--activo' : ''}`}
      src={personajes[id][pose]}
      alt={`${descripciones[id]} ${activo ? gestos[pose] : gestos.atenta}.`}
      decoding="async"
    />
  );
}

export function IconoResultado({ tipo }: { tipo: 'ok' | 'mejora' | 'pausa' | 'info' }) {
  const paths: Record<typeof tipo, JSX.Element> = {
    ok: <path d="M6 12.5l4 4 8-9" />,
    mejora: <path d="M17 8a6 6 0 1 0 1 6M17 3v5h-5" />,
    pausa: <path d="M9 6v12M15 6v12" />,
    info: <path d="M12 11v6M12 7.5v.5" />,
  };
  return (
    <svg className={`icono icono--${tipo}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" />
      <g fill="none" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {paths[tipo]}
      </g>
    </svg>
  );
}

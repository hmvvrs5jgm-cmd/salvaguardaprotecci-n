// Personajes de cuerpo entero sobre un fondo neutro (imágenes locales optimizadas en src/assets/personajes).
// Imágenes generadas con IA que representan a personas ficticias. La persona señalada no tiene retrato.
// Los personajes sin ilustración (módulo 3: Nicolás, Camila y Diego) usan una silueta neutra provisional
// (docs/activos-graficos.md).

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
import profesionalPensativa from '../assets/personajes/profesional-pensativa.webp';
import profesionalExplica from '../assets/personajes/profesional-explica.webp';

const personajes: Partial<Record<CharacterId, Record<Pose, string>>> = {
  mariela: { atenta: marielaAtenta, pensativa: marielaPensativa, explica: marielaExplica },
  elena: { atenta: elenaAtenta, pensativa: elenaPensativa, explica: elenaExplica },
  referente: { atenta: referenteAtenta, pensativa: referentePensativa, explica: referenteExplica },
  lucia: { atenta: luciaAtenta, pensativa: luciaPensativa, explica: luciaExplica },
  profesional: { atenta: profesionalAtenta, pensativa: profesionalPensativa, explica: profesionalExplica },
};

const descripciones: Record<CharacterId, string> = {
  mariela: 'Mariela, participante adulta del programa, con chaqueta tejida color terracota.',
  elena: 'Elena, integrante del equipo técnico, con chaleco verde y credencial.',
  referente: 'El Referente, rol competente de la ruta, con camisa verde y credencial.',
  lucia: 'Lucía, adolescente participante del taller, con chaqueta azul con capucha y jeans.',
  profesional: 'Profesional de un servicio de atención, con chaqueta de punto verde, gafas y credencial.',
  nicolas: 'Nicolás, colega a cargo de logística y transporte (silueta provisional).',
  camila: 'Camila, participante adolescente (silueta provisional).',
  diego: 'Diego, participante de 11 años (silueta provisional).',
};

const gestos: Record<Pose, string> = {
  atenta: 'escucha con atención',
  pensativa: 'se muestra pensativa',
  explica: 'habla y explica con las manos abiertas',
};

const jovenes: CharacterId[] = ['lucia', 'camila', 'diego'];

export function Retrato({ id, pose = 'atenta', activo }: { id: CharacterId; pose?: Pose; activo?: boolean }) {
  const imagenes = personajes[id];
  const alt = `${descripciones[id]} ${activo ? gestos[pose] : gestos.atenta}.`;
  if (!imagenes) return <Silueta id={id} alt={alt} activo={activo} />;
  return (
    <img
      className={`retrato retrato--${id}${activo ? ' retrato--activo' : ''}`}
      src={imagenes[pose]}
      alt={alt}
      decoding="async"
    />
  );
}

/** Silueta de cuerpo entero, neutra y sin rasgos, para personajes sin ilustración. */
function Silueta({ id, alt, activo }: { id: CharacterId; alt: string; activo?: boolean }) {
  const joven = jovenes.includes(id);
  return (
    <svg
      className={`retrato retrato--silueta retrato--${id}${activo ? ' retrato--activo' : ''}`}
      viewBox="0 0 120 300"
      role="img"
      aria-label={alt}
    >
      <circle cx="60" cy={joven ? 42 : 38} r={joven ? 21 : 22} />
      <path
        d={
          joven
            ? 'M60 68c-19 0-31 10-33 30l-5 70c-1 7 9 9 11 2l7-52 2 62-4 108c0 8 12 8 13 0l9-96 9 96c1 8 13 8 13 0l-4-108 2-62 7 52c2 7 12 5 11-2l-5-70c-2-20-14-30-33-30z'
            : 'M60 64c-21 0-34 11-36 32l-5 76c-1 7 9 9 11 2l8-56 2 66-5 104c0 8 12 8 13 0l12-98 12 98c1 8 13 8 13 0l-5-104 2-66 8 56c2 7 12 5 11-2l-5-76c-2-21-15-32-36-32z'
        }
      />
    </svg>
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

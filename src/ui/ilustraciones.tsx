// Ilustración editorial vectorial local y reemplazable (prompt, apartado 4).
// Sin fotografías, sin violencia, sin rasgos estereotipados. La persona señalada no tiene retrato.

import type { BackgroundId, CharacterId } from '../content/types';

const piel = { mariela: '#B07A57', elena: '#E2B48F', referente: '#8A5A3C' };

export function Fondo({ id, alt }: { id: BackgroundId; alt: string }) {
  return (
    <svg className="fondo" viewBox="0 0 800 360" role="img" aria-label={alt} preserveAspectRatio="xMidYMid slice">
      <rect width="800" height="360" fill="var(--esc-cielo)" />
      {id === 'centro' && <Centro />}
      {id === 'conversacion' && <Conversacion />}
      {id === 'salida' && <Salida />}
      {id === 'oficina' && <Oficina />}
    </svg>
  );
}

function Suelo() {
  return <rect y="270" width="800" height="90" fill="var(--esc-suelo)" />;
}

function Centro() {
  return (
    <g>
      <rect x="0" y="40" width="800" height="230" fill="var(--esc-pared)" />
      <rect x="60" y="80" width="160" height="110" rx="6" fill="var(--esc-ventana)" />
      <line x1="140" y1="80" x2="140" y2="190" stroke="var(--esc-marco)" strokeWidth="6" />
      <rect x="560" y="70" width="180" height="120" rx="8" fill="var(--esc-tablero)" />
      <rect x="580" y="92" width="90" height="10" rx="5" fill="var(--esc-pared)" />
      <rect x="580" y="114" width="130" height="10" rx="5" fill="var(--esc-pared)" />
      <rect x="580" y="136" width="110" height="10" rx="5" fill="var(--esc-pared)" />
      <Suelo />
      <rect x="300" y="220" width="220" height="16" rx="4" fill="var(--esc-mueble)" />
      <rect x="315" y="236" width="10" height="40" fill="var(--esc-mueble)" />
      <rect x="495" y="236" width="10" height="40" fill="var(--esc-mueble)" />
      <circle cx="350" cy="208" r="10" fill="var(--acento-suave)" />
      <rect x="400" y="200" width="60" height="18" rx="3" fill="var(--esc-ventana)" />
    </g>
  );
}

function Conversacion() {
  return (
    <g>
      <rect x="0" y="40" width="800" height="230" fill="var(--esc-pared-2)" />
      <rect x="600" y="70" width="120" height="200" rx="6" fill="var(--esc-puerta)" />
      <circle cx="700" cy="175" r="6" fill="var(--esc-marco)" />
      <rect x="610" y="40" width="100" height="22" rx="4" fill="var(--acento-suave)" />
      <path d="M626 51 h50 m-10 -7 l10 7 l-10 7" stroke="var(--esc-pared)" strokeWidth="4" fill="none" />
      <rect x="70" y="90" width="140" height="100" rx="6" fill="var(--esc-ventana)" />
      <Suelo />
      <rect x="230" y="232" width="90" height="14" rx="4" fill="var(--esc-mueble)" />
      <rect x="420" y="232" width="90" height="14" rx="4" fill="var(--esc-mueble)" />
      <ellipse cx="370" cy="250" rx="34" ry="8" fill="var(--esc-mueble)" />
      <rect x="364" y="250" width="12" height="24" fill="var(--esc-mueble)" />
    </g>
  );
}

function Salida() {
  return (
    <g>
      <rect x="0" y="0" width="800" height="270" fill="var(--esc-cielo)" />
      <circle cx="680" cy="70" r="34" fill="var(--esc-sol)" />
      <rect x="40" y="90" width="300" height="180" fill="var(--esc-pared)" />
      <rect x="150" y="160" width="80" height="110" fill="var(--esc-puerta)" />
      <Suelo />
      <path d="M0 300 Q400 270 800 300 L800 360 L0 360 Z" fill="var(--esc-camino)" />
    </g>
  );
}

function Oficina() {
  return (
    <g>
      <rect x="0" y="40" width="800" height="230" fill="var(--esc-pared-2)" />
      <rect x="80" y="70" width="200" height="130" rx="6" fill="var(--esc-ventana)" />
      <rect x="560" y="80" width="40" height="150" fill="var(--esc-mueble)" />
      <rect x="610" y="80" width="40" height="150" fill="var(--esc-mueble)" opacity="0.8" />
      <rect x="660" y="80" width="40" height="150" fill="var(--esc-mueble)" opacity="0.6" />
      <Suelo />
      <rect x="280" y="215" width="260" height="18" rx="4" fill="var(--esc-mueble)" />
      <rect x="300" y="233" width="12" height="42" fill="var(--esc-mueble)" />
      <rect x="508" y="233" width="12" height="42" fill="var(--esc-mueble)" />
      <rect x="380" y="196" width="70" height="20" rx="3" fill="var(--esc-ventana)" />
      <path d="M470 210 q20 -18 40 0" stroke="var(--acento)" strokeWidth="5" fill="none" />
    </g>
  );
}

const etiquetas: Record<CharacterId, string> = {
  mariela: 'Mariela, participante adulta del programa, con expresión atenta.',
  elena: 'Elena, integrante del equipo técnico, con expresión reflexiva.',
  referente: 'El Referente, rol competente de la ruta, con expresión serena.',
};

export function Retrato({ id, activo }: { id: CharacterId; activo?: boolean }) {
  return (
    <svg
      className={`retrato${activo ? ' retrato--activo' : ''}`}
      viewBox="0 0 120 160"
      role="img"
      aria-label={etiquetas[id]}
    >
      {id === 'mariela' && (
        <g>
          <path d="M20 160 Q20 110 60 104 Q100 110 100 160 Z" fill="#3F7D6E" />
          <path d="M30 70 Q28 26 60 24 Q92 26 90 70 Q92 98 78 104 L42 104 Q28 98 30 70 Z" fill="#2B2420" />
          <ellipse cx="60" cy="66" rx="24" ry="28" fill={piel.mariela} />
          <path d="M36 58 Q40 34 60 34 Q82 34 86 58 Q74 46 60 46 Q46 46 36 58 Z" fill="#2B2420" />
          <circle cx="51" cy="66" r="2.6" fill="#1E1A17" />
          <circle cx="69" cy="66" r="2.6" fill="#1E1A17" />
          <path d="M53 80 Q60 84 67 80" stroke="#5A3726" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <rect x="54" y="92" width="12" height="14" fill={piel.mariela} />
        </g>
      )}
      {id === 'elena' && (
        <g>
          <path d="M20 160 Q20 112 60 106 Q100 112 100 160 Z" fill="#5B5F97" />
          <path d="M60 106 L52 130 L60 160 L68 130 Z" fill="#EDEBF7" />
          <ellipse cx="60" cy="66" rx="24" ry="28" fill={piel.elena} />
          <path d="M34 64 Q32 30 60 30 Q90 30 86 64 Q82 44 60 42 Q40 44 34 64 Z" fill="#7A4E2D" />
          <circle cx="51" cy="66" r="2.6" fill="#1E1A17" />
          <circle cx="69" cy="66" r="2.6" fill="#1E1A17" />
          <path d="M47 58 h8 M65 58 h8" stroke="#7A4E2D" strokeWidth="2" strokeLinecap="round" />
          <path d="M54 81 h12" stroke="#7A4637" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="54" y="92" width="12" height="16" fill={piel.elena} />
        </g>
      )}
      {id === 'referente' && (
        <g>
          <path d="M18 160 Q18 110 60 104 Q102 110 102 160 Z" fill="#2F5D7C" />
          <path d="M44 104 L60 124 L76 104" fill="#F4F1EA" />
          <ellipse cx="60" cy="64" rx="25" ry="29" fill={piel.referente} />
          <path d="M35 56 Q38 30 60 30 Q84 30 85 56 Q74 42 60 42 Q46 42 35 56 Z" fill="#1F1B18" />
          <circle cx="51" cy="65" r="2.6" fill="#1E1A17" />
          <circle cx="69" cy="65" r="2.6" fill="#1E1A17" />
          <circle cx="51" cy="65" r="7" stroke="#1F1B18" strokeWidth="1.6" fill="none" />
          <circle cx="69" cy="65" r="7" stroke="#1F1B18" strokeWidth="1.6" fill="none" />
          <path d="M58 65 h4" stroke="#1F1B18" strokeWidth="1.6" />
          <path d="M53 80 Q60 84 67 80" stroke="#3E2618" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <rect x="54" y="90" width="12" height="16" fill={piel.referente} />
        </g>
      )}
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

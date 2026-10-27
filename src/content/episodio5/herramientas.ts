// Herramientas del módulo 5 (guion «Es alguien importante» v1.0, apartado 18).
// El texto de cada tarjeta del guion se conserva; las secciones de apoyo citan sus fuentes.
// No se inventan cadenas de recusación, comités ni plazos no descritos en las fuentes.

import type { Tool } from '../types';

export const herramientasM5: Tool[] = [
  {
    id: 'm5-autoridad',
    title: '1. Autoridad y deber de cuidado',
    summary: 'El prestigio no descarta una preocupación ni prueba culpabilidad.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Prestigio, cargo, aportes, amistad o reputación no descartan una preocupación ni prueban culpabilidad.',
          'Tolerancia cero no significa culpabilidad automática. Reportar de buena fe no exige demostrar el hecho; una preocupación no confirmada no prueba, por sí sola, mala fe.',
          'Es una orientación pedagógica validada por el Punto Focal: no equivale a una declaración legal de inmunidad ni autoriza acusaciones deliberadamente falsas. Comunica lo observado o conocido, sin investigar por tu cuenta ni presentar sospechas como hechos comprobados.',
        ],
      },
    ],
    sources: [
      'Procedimiento 3.3 (protección de supervivientes, denunciantes y testigos)',
      'Plan de Salvaguarda FY2026, anexo 2 (declaración de confidencialidad y no represalias)',
      'Respuestas revisadas del Punto Focal, 23/10/2026, punto 2.11 (redacción validada)',
      'Guion del módulo 5, escenas M5_E01 y M5_E03',
    ],
  },
  {
    id: 'm5-ruta',
    title: '2. Ruta y alternativas',
    summary: 'Un mecanismo habilitado y, ante un posible conflicto, una alternativa institucional.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Utilizar un mecanismo habilitado; informar posible conflicto con hechos; no requerir autorización de la persona señalada. No enviar a todos los canales por defecto. Si una vía no responde, usar el seguimiento y la alternativa institucional pertinentes.',
        ],
        bullets: [
          'Vías institucionales: el Punto Focal de Salvaguarda, cualquier gerente de ChildFund, la dirección directa (complaints@childfund.org) y Speak Up. Consulta el panel «Cómo comunicar una preocupación real».',
          'En una organización socia: su mecanismo, articulado con ChildFund según la ruta. Si una estructura local está involucrada o bloquea la comunicación, se usa una alternativa habilitada.',
          'Ante un posible conflicto del receptor habitual, usa otra vía que no dependa de esa persona: otro gerente o la Dirección sin conflicto, complaints@childfund.org o Speak Up. Si el conflicto alcanza a la Dirección o al Punto Focal, usa la vía global autorizada.',
          'No necesitas probar parcialidad para informar un posible conflicto: lo valoran las instancias competentes, que deciden quién interviene y con qué acceso.',
          'La comunicación se hace dentro de 24 horas desde que se conoce la preocupación; si hay peligro inmediato, la respuesta urgente no espera.',
        ],
      },
    ],
    sources: [
      'Política 2.9, 2.9.1 y 2.9.2.1; Procedimiento 5.2.2',
      'Ruta gráfica de respuesta y derivación (mecanismos de reporte)',
      'Guion del módulo 5, escenas M5_E04, M5_CANAL_HABITUAL, M5_CONFLICTO y M5_E10',
    ],
  },
  {
    id: 'm5-confidencialidad',
    title: '3. Confidencialidad y anonimato',
    summary: 'Acceso restringido sin prometer secreto absoluto ni una identidad imposible de inferir.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Acceso restringido según necesidad; no prometer secreto absoluto ni identidad imposible de inferir. Acordar contacto seguro.',
        ],
        bullets: [
          'Existen vías que permiten comunicar sin indicar el nombre, pero el contexto puede permitir inferir una identidad.',
          'Anonimato y confidencialidad son distintos: la confidencialidad limita quién conoce la información.',
          'El temor de quien comunica se transmite al receptor para reducir la exposición; no justifica el silencio.',
        ],
      },
    ],
    sources: [
      'Plan de Salvaguarda FY2026, apartado X (confidencialidad y prohibición de represalias) y anexo 6',
      'Procedimiento 5.1.14.7 (confidencialidad)',
      'Guion del módulo 5, escena M5_E05',
    ],
  },
  {
    id: 'm5-reporte',
    title: '4. Reporte factual',
    summary: 'Quién comunicó qué, qué se conoce, vacíos, riesgos y acciones iniciales.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Quién comunicó qué, qué se conoce directamente, vacíos, riesgos y acciones iniciales. No exigir pruebas, completar mediante investigación ni predeterminar sanción.',
        ],
        bullets: [
          'Atribuye la fuente: lo que te contaron no es una observación propia.',
          'Consigna lo desconocido como desconocido; no lo completes con entrevistas.',
          'Excluye suposiciones, opiniones sobre la vida privada y propuestas de sanción.',
        ],
      },
    ],
    sources: ['Procedimiento 5.2.4.3 y 5.2.4.4 (plazo y contenido del reporte)', 'Guion del módulo 5, escenas M5_E02 y M5_E06'],
  },
  {
    id: 'm5-represalias',
    title: '5. Posibles represalias',
    summary: 'Amenazas, presiones y cambios adversos se comunican para su valoración.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Amenazas, presiones para callar, aislamiento, pérdida de acceso o cambios adversos pueden requerir valoración. El contexto y las razones se revisan por los responsables; ni la duda justifica silencio ni una secuencia temporal prueba causalidad por sí sola.',
        ],
        bullets: [
          'Está prohibida cualquier forma de represalia, intimidación, discriminación o trato adverso contra denunciantes, sobrevivientes o testigos.',
          'Quien conoce un intento, amenaza o acto de represalia lo comunica de inmediato por la vía autorizada. Este deber alcanza al personal de ChildFund y al personal y los representantes de las organizaciones socias. No se espera a demostrar la represalia para alertar.',
          'Comunica la frase o el cambio conocido, cuándo se advirtió y lo que se desconoce, sin calificarlo como hecho probado.',
        ],
      },
    ],
    sources: [
      'Plan de Salvaguarda FY2026: principio de no represalias, apartado X y anexo 2',
      'Respuestas revisadas del Punto Focal, 23/10/2026, punto 2.10 (alcance al personal y a los socios)',
      'Procedimiento 3.3',
      'Guion del módulo 5, escenas M5_E07, M5_MEDIDAS y M5_E08',
    ],
  },
  {
    id: 'm5-limites',
    title: '6. Límites',
    summary: 'Sin mediación, confrontación, votación ni investigación paralela.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'No mediación con la persona señalada, confrontación, votación de reportes, investigación paralela ni uso de NNA para conseguir evidencia. Medidas preventivas y decisiones laborales corresponden a los roles competentes.',
        ],
        bullets: [
          'Si recibes espontáneamente mensajes o documentos, no los borres ni los reenvíes a grupos: informa al mecanismo, que indicará cómo conservarlos.',
          'La investigación la realizan profesionales autorizados.',
        ],
      },
    ],
    sources: ['Política 2.9; Procedimiento 5.2', 'Guion del módulo 5, escenas M5_E03 y M5_E09'],
  },
  {
    id: 'm5-apoyo',
    title: '7. Apoyo',
    summary: 'Necesidades de seguridad de sobrevivientes, denunciantes y testigos, sin promesas imposibles.',
    sections: [
      {
        heading: 'Criterio',
        paragraphs: [
          'Comunicar necesidades de seguridad de sobrevivientes, denunciantes y testigos. No prometer renovación, impunidad, resultados judiciales ni ausencia total de riesgo. No condicionar ayuda a demostrar el hecho.',
        ],
        bullets: [
          'Las medidas que pueden valorar los responsables incluyen un punto de contacto sin conflicto, seguimiento seguro, revisión de cambios adversos y ajustes proporcionales al riesgo.',
          'Ninguna medida protectora expulsa a la adolescente, aísla a quien comunicó ni obliga a confrontar a nadie.',
          'Si la persona que reportó trabaja en una organización socia y sufre un cambio adverso, ChildFund puede articular con la Junta y la coordinación del socio, siempre que no tengan conflicto de interés, compartiendo solo lo indispensable. Si están implicadas, se usa una instancia alternativa y los canales globales.',
        ],
      },
    ],
    sources: ['Procedimiento 3.3 y 5.3.1.3', 'Plan de Salvaguarda FY2026 (deber de cuidado)', 'Guion del módulo 5, escena M5_MEDIDAS'],
  },
];

// Evaluación final del módulo 2 (guion «Gracias por escucharme» v1.0, apartados 20 y 21).
// Las preguntas no contienen la clave: está en ./clave.ts, que el frontend en modo registro no importa.
// Los IDs llevan el prefijo M2_ y conservan la letra del guion solo para trazabilidad.

import type { AssessmentConfig, Question, TextosResultado } from '../types';

export const configEvaluacion: AssessmentConfig = {
  episodeId: 'm2-gracias-por-escucharme',
  version: '1.0',
  passScore: 8,
  criticalQuestionIds: ['M2_P2', 'M2_P3', 'M2_P4', 'M2_P6'],
  isProvisional: true,
};

export const notaUmbral =
  'Criterio pedagógico propuesto, pendiente de adopción institucional: al menos 8 de 10 y acierto en las preguntas críticas 2, 3, 4 y 6. Ambas condiciones deben cumplirse. No es un requisito textual de la política.';

export const preguntas: Question[] = [
  {
    id: 'M2_P1',
    number: 1,
    title: 'Escucha',
    stem: 'Un adolescente dice que una persona de su entorno lo amenaza. ¿Cuál es una primera respuesta adecuada?',
    options: [
      { id: 'M2_P1-A', text: '«Explícame qué hiciste para que reaccionara así».' },
      {
        id: 'M2_P1-B',
        text: '«Gracias por contármelo. Lo que dices merece atención. No necesitas darme detalles íntimos».',
      },
      { id: 'M2_P1-C', text: '«Busca pruebas antes de seguir hablando».' },
    ],
    critical: false,
    criterion: 'Escuchar sin preguntas investigativas ni culpabilización.',
    explanation: 'Reconoce la comunicación, sin culpabilizar ni investigar.',
    recovery: { decisionId: 'M2_D02', sceneId: 'M2_E02', toolId: 'm2-escucha' },
  },
  {
    id: 'M2_P2',
    number: 2,
    title: 'Confidencialidad',
    stem: 'Una adolescente pide que no se informe a nadie. ¿Qué corresponde?',
    options: [
      { id: 'M2_P2-A', text: 'Prometer secreto para que continúe.' },
      { id: 'M2_P2-B', text: 'Compartirlo con todo el equipo porque es menor de edad.' },
      {
        id: 'M2_P2-C',
        text: 'Explicar el deber de comunicar a los responsables, el acceso restringido y cómo se considerarán sus necesidades de seguridad.',
      },
    ],
    critical: true,
    criterion: 'Explicar los límites de la confidencialidad con lenguaje adecuado a la edad.',
    explanation: 'Explicar límites de confidencialidad no elimina la voz de la adolescente.',
    recovery: { decisionId: 'M2_D03', sceneId: 'M2_E03', toolId: 'm2-escucha' },
  },
  {
    id: 'M2_P3',
    number: 3,
    title: 'Riesgo inmediato',
    stem: 'Un niño teme salir con la persona a quien señala como responsable del daño. ¿Qué acción procede?',
    options: [
      {
        id: 'M2_P3-A',
        text: 'Activar de inmediato la coordinación de protección y, si hay peligro inminente, la respuesta de emergencia, manteniendo acompañamiento seguro dentro del rol y sin improvisar custodia.',
      },
      { id: 'M2_P3-B', text: 'Esperar al día siguiente porque no hay lesiones visibles.' },
      { id: 'M2_P3-C', text: 'Llevarlo a tu domicilio para decidir después.' },
    ],
    critical: true,
    criterion: 'Reconocer un riesgo inmediato y activar ayuda dentro del rol.',
    explanation: 'La seguridad tiene prioridad y la respuesta no se sustituye por acogimiento personal.',
    recovery: { decisionId: 'M2_DURG', sceneId: 'M2_URGENTE', toolId: 'm2-necesidades' },
  },
  {
    id: 'M2_P4',
    number: 4,
    title: 'Contacto familiar',
    stem: 'Una adolescente advierte que una llamada a su hogar puede ponerla en peligro. ¿Qué haces?',
    options: [
      { id: 'M2_P4-A', text: 'Llamas automáticamente porque siempre se requiere permiso familiar.' },
      {
        id: 'M2_P4-B',
        text: 'Comunicas el riesgo al Referente para valorar contacto seguro, participación y protección competente, considerando su opinión.',
      },
      { id: 'M2_P4-C', text: 'Decides tú que nunca habrá contacto con ningún familiar.' },
    ],
    critical: true,
    criterion: 'Evitar contactar automáticamente a un familiar que pueda aumentar el peligro.',
    explanation: 'Evita tanto el contacto automático como decisiones absolutas sin valoración.',
    recovery: { decisionId: 'M2_D05', sceneId: 'M2_E05', toolId: 'm2-familia' },
  },
  {
    id: 'M2_P5',
    number: 5,
    title: 'Consentimiento y participación',
    stem: 'Antes de un apoyo especializado, ¿qué criterio es adecuado?',
    options: [
      { id: 'M2_P5-A', text: 'Una firma basta aunque no se comprendan los pasos.' },
      { id: 'M2_P5-B', text: 'Toda persona adolescente puede autorizar cualquier intervención sin evaluación.' },
      {
        id: 'M2_P5-C',
        text: 'Explicar opciones e información a compartir, comprobar comprensión y aplicar los requisitos de consentimiento/asentimiento según intervención, edad, riesgos y normativa, mediante los responsables.',
      },
    ],
    critical: false,
    criterion: 'Distinguir el deber de reporte de las decisiones sobre servicios y del consentimiento o asentimiento aplicable.',
    explanation: 'La participación informada es un proceso, no una firma ni una regla universal sobre edad.',
    recovery: { decisionId: 'M2_D07', sceneId: 'M2_E07', toolId: 'm2-reporte' },
  },
  {
    id: 'M2_P6',
    number: 6,
    title: 'Barrera en la derivación',
    stem: 'El primer servicio no tiene capacidad adecuada y el traslado propuesto aumenta dificultades. ¿Qué corresponde?',
    options: [
      {
        id: 'M2_P6-A',
        text: 'Comunicar las barreras y apoyar una alternativa verificada con el Referente, manteniendo las medidas de protección y reevaluando la urgencia.',
      },
      { id: 'M2_P6-B', text: 'Entregar el teléfono y cerrar el proceso.' },
      { id: 'M2_P6-C', text: 'Presionar para que acepte porque ya se hizo una llamada.' },
    ],
    critical: true,
    criterion: 'Reconocer barreras de acceso y revisar alternativas con el Referente.',
    explanation: 'Una derivación requiere condiciones reales de acceso; si falla, la respuesta continúa.',
    recovery: { decisionId: 'M2_D08', sceneId: 'M2_E08', toolId: 'm2-derivacion' },
  },
  {
    id: 'M2_P7',
    number: 7,
    title: 'Información mínima',
    stem: 'Para coordinar atención, ¿qué puede compartir el personal por el canal restringido?',
    options: [
      { id: 'M2_P7-A', text: 'El expediente completo con cualquier colega interesado.' },
      {
        id: 'M2_P7-B',
        text: 'Solo la información necesaria sobre la preocupación, el riesgo, las acciones y preferencias relevantes, distinguiendo lo conocido de las suposiciones.',
      },
      { id: 'M2_P7-C', text: 'Fotografías corporales para demostrar el daño.' },
    ],
    critical: false,
    criterion: 'Comunicar la preocupación mediante la ruta institucional con información mínima.',
    explanation: 'La necesidad de conocimiento limita información y destinatarios.',
    recovery: { decisionId: 'M2_D06', sceneId: 'M2_E06', toolId: 'm2-reporte' },
  },
  {
    id: 'M2_P8',
    number: 8,
    title: 'Evitar repetición',
    stem: 'Un servicio necesita datos para recibir a una adolescente. ¿Qué contribuye a evitar revictimización?',
    options: [
      { id: 'M2_P8-A', text: 'Hacerla grabar una narración completa para compartir con todas las instituciones.' },
      { id: 'M2_P8-B', text: 'Prometer que nunca le harán otra pregunta.' },
      {
        id: 'M2_P8-C',
        text: 'Coordinar por los responsables una transmisión mínima permitida, explicar el propósito y evitar entrevistas redundantes sin garantizar que no habrá preguntas necesarias.',
      },
    ],
    critical: false,
    criterion: 'Contribuir a una derivación coordinada que evite repeticiones innecesarias.',
    explanation: 'La coordinación reduce repeticiones sin hacer promesas imposibles.',
    recovery: { decisionId: 'M2_D07', sceneId: 'M2_E07', toolId: 'm2-derivacion' },
  },
  {
    id: 'M2_P9',
    number: 9,
    title: 'Contacto seguro',
    stem: 'Se informa que el teléfono de una adolescente es revisado por una persona que podría hacerle daño. ¿Qué haces?',
    options: [
      {
        id: 'M2_P9-A',
        text: 'Acordar con los responsables un medio y momento seguros, sin enviar mensajes sensibles al teléfono identificado como inseguro.',
      },
      { id: 'M2_P9-B', text: 'Enviar un mensaje con el nombre del servicio para que haya constancia.' },
      { id: 'M2_P9-C', text: 'Eliminar todo seguimiento sin revisar alternativas.' },
    ],
    critical: false,
    criterion: 'Acordar un seguimiento seguro, además de oportuno.',
    explanation: 'El canal se adapta a la seguridad; no basta con disponer de un contacto.',
    recovery: { decisionId: 'M2_D09', sceneId: 'M2_E09', toolId: 'm2-seguimiento' },
  },
  {
    id: 'M2_P10',
    number: 10,
    title: 'Recepción y cierre',
    stem: 'Se confirmó una primera atención, pero existe una barrera para continuar. ¿Qué interpretación es correcta?',
    options: [
      { id: 'M2_P10-A', text: 'La primera atención prueba que el caso está resuelto.' },
      {
        id: 'M2_P10-B',
        text: 'Se comunica la nueva necesidad al responsable y se mantiene el seguimiento pertinente; el cierre requiere una decisión fundada de los roles competentes.',
      },
      { id: 'M2_P10-C', text: 'Se solicita la historia clínica completa para decidir desde el equipo técnico.' },
    ],
    critical: false,
    criterion: 'Verificar recepción sin investigar ni interpretar una cita como cierre.',
    explanation: 'Confirmar acceso no equivale a cerrar ni autoriza consultar información clínica.',
    recovery: { decisionId: 'M2_D10', sceneId: 'M2_E10', toolId: 'm2-seguimiento' },
  },
];

/** Textos de resultado (guion del módulo 2, apartado 21). */
export const textosResultado: TextosResultado = {
  aprobado: (score: number, version: string) =>
    `Aprobaste el módulo Gracias por escucharme. Resultado: ${score}/10. Demostraste los criterios evaluados de escucha y derivación segura. Esta aprobación corresponde a este módulo (versión ${version}) y no habilita para investigar o gestionar casos.`,
  criticoFallido: (score: number) =>
    `Obtuviste ${score}/10. Antes de aprobar necesitas reforzar un criterio esencial. Revisa la orientación y vuelve a intentarlo.`,
  insuficiente:
    'Hay decisiones que puedes practicar nuevamente. Las herramientas están disponibles y puedes repetir la evaluación.',
  practicaReforzada:
    'Este nuevo intento repite las mismas diez preguntas: es práctica reforzada, no un intento independiente. La forma B del banco alternativo está pendiente de validación y todavía no se usa en el registro.',
};

// Evaluación final del módulo 5 (guion «Es alguien importante» v1.0, apartados 20 y 21).
// Las preguntas no contienen la clave: está en ./clave.ts, que el frontend en modo registro no importa.
// Los IDs llevan el prefijo M5_ y conservan la letra del guion solo para trazabilidad.

import type { AssessmentConfig, Question, TextosResultado } from '../types';

export const configEvaluacion: AssessmentConfig = {
  episodeId: 'm5-es-alguien-importante',
  version: '1.0',
  passScore: 8,
  criticalQuestionIds: ['M5_P2', 'M5_P4', 'M5_P6', 'M5_P8'],
  isProvisional: true,
};

export const notaUmbral =
  'Criterio pedagógico propuesto, pendiente de adopción institucional: al menos 8 de 10 y acierto en las preguntas críticas 2, 4, 6 y 8. Son dos condiciones simultáneas. No es una exigencia textual de las fuentes.';

export const preguntas: Question[] = [
  {
    id: 'M5_P1',
    number: 1,
    title: 'Prestigio',
    stem: 'Una preocupación involucra a una persona reconocida que aporta mucho al programa. ¿Cuál es el criterio adecuado?',
    options: [
      { id: 'M5_P1-A', text: 'Su reputación permite descartar el reporte.' },
      {
        id: 'M5_P1-B',
        text: 'La preocupación se comunica por el mecanismo, sin que el prestigio pruebe ni descarte lo ocurrido.',
      },
      { id: 'M5_P1-C', text: 'Su influencia demuestra culpabilidad.' },
    ],
    critical: false,
    criterion: 'Reconocer que la jerarquía o el prestigio no eximen del deber de reporte.',
    explanation: 'La responsabilidad de proteger se mantiene y no reemplaza el proceso de valoración.',
    recovery: { decisionId: 'M5_D01', sceneId: 'M5_E01', toolId: 'm5-autoridad' },
  },
  {
    id: 'M5_P2',
    number: 2,
    title: 'No esperar pruebas',
    stem: 'Una colega comunica una preocupación recibida de una adolescente, pero no tiene capturas. ¿Qué haces?',
    options: [
      {
        id: 'M5_P2-A',
        text: 'Comunicar lo conocido y los riesgos por el mecanismo, distinguiendo la fuente y lo desconocido, sin investigar.',
      },
      { id: 'M5_P2-B', text: 'Pedir capturas para decidir si vale la pena.' },
      { id: 'M5_P2-C', text: 'Esperar a una segunda adolescente.' },
    ],
    critical: true,
    criterion: 'Reportar con la información disponible, sin exigir pruebas.',
    explanation: 'Reportar no exige demostrar ni repetir el hecho.',
    recovery: { decisionId: 'M5_D02', sceneId: 'M5_E02', toolId: 'm5-reporte' },
  },
  {
    id: 'M5_P3',
    number: 3,
    title: 'Solución informal',
    stem: 'Se propone una reunión entre la adolescente y la persona señalada para aclarar todo. ¿Qué corresponde?',
    options: [
      { id: 'M5_P3-A', text: 'Realizarla para ahorrar tiempo.' },
      { id: 'M5_P3-B', text: 'Someter la decisión a votación del equipo.' },
      {
        id: 'M5_P3-C',
        text: 'Evitar mediación o confrontación y activar la respuesta institucional sin exponer a la adolescente.',
      },
    ],
    critical: false,
    criterion: 'Evitar mediación, confrontación y circulación informal.',
    explanation: 'El equipo técnico no resuelve por negociación una preocupación de salvaguarda.',
    recovery: { decisionId: 'M5_D03', sceneId: 'M5_E03', toolId: 'm5-limites' },
  },
  {
    id: 'M5_P4',
    number: 4,
    title: 'Conflicto de interés',
    stem: 'El receptor habitual tiene una relación relevante con la persona señalada que podría comprometer su participación. ¿Qué haces?',
    options: [
      { id: 'M5_P4-A', text: 'Dejar de reportar.' },
      {
        id: 'M5_P4-B',
        text: 'Usar una alternativa institucional e informar el posible conflicto con datos pertinentes para su valoración y definición de accesos.',
      },
      { id: 'M5_P4-C', text: 'Difundir públicamente la relación.' },
    ],
    critical: true,
    criterion: 'Utilizar un canal alternativo ante un posible conflicto de interés.',
    explanation:
      'No se requiere demostrar parcialidad para comunicar un posible impedimento; lo valoran los responsables.',
    recovery: { decisionId: 'M5_D04', sceneId: 'M5_CONFLICTO', toolId: 'm5-ruta' },
  },
  {
    id: 'M5_P5',
    number: 5,
    title: 'Anonimato',
    stem: 'Alguien pregunta si reportar sin nombre garantiza que nadie lo reconocerá. ¿Qué respondes?',
    options: [
      {
        id: 'M5_P5-A',
        text: 'Explicar las opciones disponibles y sus límites, ya que el contexto puede permitir inferencias; comunicar necesidades de seguridad y contacto.',
      },
      { id: 'M5_P5-B', text: 'Garantizar que es imposible identificarlo.' },
      { id: 'M5_P5-C', text: 'Recomendar silencio para eliminar cualquier riesgo.' },
    ],
    critical: false,
    criterion: 'Explicar confidencialidad y anonimato sin prometer protección absoluta.',
    explanation: 'Se informa sin prometer protección absoluta ni abandonar el deber de reporte.',
    recovery: { decisionId: 'M5_D05', sceneId: 'M5_E05', toolId: 'm5-confidencialidad' },
  },
  {
    id: 'M5_P6',
    number: 6,
    title: 'Presión para callar',
    stem: 'Una persona comunica que recibió una advertencia sobre su continuidad si reporta. ¿Qué corresponde?',
    options: [
      { id: 'M5_P6-A', text: 'Ignorar hasta que exista pérdida efectiva del puesto.' },
      { id: 'M5_P6-B', text: 'Declarar públicamente culpabilidad por represalia.' },
      {
        id: 'M5_P6-C',
        text: 'Comunicar la posible intimidación, la frase conocida y los riesgos por la vía autorizada, solicitando valoración y protección.',
      },
    ],
    critical: true,
    criterion: 'Comunicar posibles amenazas y presiones sin calificarlas como hechos probados.',
    explanation: 'Las amenazas y presiones merecen atención sin esperar un daño consumado ni emitir un veredicto.',
    recovery: { decisionId: 'M5_D07', sceneId: 'M5_E07', toolId: 'm5-represalias' },
  },
  {
    id: 'M5_P7',
    number: 7,
    title: 'Cambio adverso',
    stem: 'Después de un reporte, una colega deja de ser convocada a una tarea y se desconoce la razón. ¿Qué criterio aplicas?',
    options: [
      { id: 'M5_P7-A', text: 'Todo cambio posterior es automáticamente represalia.' },
      {
        id: 'M5_P7-B',
        text: 'Comunicar el hecho y el temor, diferenciando lo conocido de la causa no establecida, para valoración por los responsables.',
      },
      { id: 'M5_P7-C', text: 'No comunicar nada hasta investigar por cuenta propia.' },
    ],
    critical: false,
    criterion: 'Separar hechos, señales y conclusiones no establecidas.',
    explanation: 'Una señal se reporta con incertidumbre explícita; no requiere una conclusión personal.',
    recovery: { decisionId: 'M5_D08', sceneId: 'M5_E08', toolId: 'm5-represalias' },
  },
  {
    id: 'M5_P8',
    number: 8,
    title: 'Obtención de pruebas',
    stem: 'Un colega sugiere que la adolescente continúe interactuando con la persona señalada para conseguir mensajes. ¿Qué haces?',
    options: [
      {
        id: 'M5_P8-A',
        text: 'Rechazar esa exposición, activar el mecanismo pertinente y dejar las actuaciones investigativas a personal autorizado.',
      },
      { id: 'M5_P8-B', text: 'Aceptar si ella está de acuerdo.' },
      { id: 'M5_P8-C', text: 'Delegar en otro colega la coordinación de mensajes.' },
    ],
    critical: true,
    criterion: 'Evitar la investigación paralela y proteger a la adolescente.',
    explanation: 'La persona afectada no debe exponerse para demostrar lo que comunicó.',
    recovery: { decisionId: 'M5_D09', sceneId: 'M5_E09', toolId: 'm5-limites' },
  },
  {
    id: 'M5_P9',
    number: 9,
    title: 'Medidas y proceso',
    stem: '¿Cuál es una respuesta adecuada al pedir protección frente a posibles represalias?',
    options: [
      { id: 'M5_P9-A', text: 'Prometer que un contrato será renovado.' },
      { id: 'M5_P9-B', text: 'Garantizar que no habrá ninguna consecuencia para nadie.' },
      {
        id: 'M5_P9-C',
        text: 'Comunicar necesidades y pedir medidas proporcionadas a los responsables, sin anticipar culpabilidad ni decisiones laborales.',
      },
    ],
    critical: false,
    criterion: 'Distinguir medidas preventivas, investigación y decisiones disciplinarias.',
    explanation: 'La protección y el debido proceso se coordinan sin promesas que excedan el rol.',
    recovery: { decisionId: 'M5_D07', sceneId: 'M5_E07', toolId: 'm5-apoyo' },
  },
  {
    id: 'M5_P10',
    number: 10,
    title: 'Seguimiento',
    stem: 'Se confirmó recepción del reporte, pero no se comparten todos los detalles. ¿Qué corresponde?',
    options: [
      { id: 'M5_P10-A', text: 'Solicitar acceso irrestricto o difundir el caso.' },
      {
        id: 'M5_P10-B',
        text: 'Mantener contacto seguro para nuevas preocupaciones y utilizar seguimiento o alternativa institucional si no hay respuesta, respetando la confidencialidad.',
      },
      { id: 'M5_P10-C', text: 'Asumir que la investigación terminó.' },
    ],
    critical: false,
    criterion: 'Dar seguimiento seguro dentro de las responsabilidades asignadas.',
    explanation: 'Recepción, investigación, cierre y seguimiento son momentos diferentes.',
    recovery: { decisionId: 'M5_D10', sceneId: 'M5_E10', toolId: 'm5-ruta' },
  },
];

/** Textos de resultado (guion del módulo 5, apartado 21). */
export const textosResultado: TextosResultado = {
  aprobado: (score: number, version: string) =>
    `Aprobaste Es alguien importante. Resultado: ${score}/10. Demostraste los criterios evaluados de reporte seguro, conflictos de interés y prevención de represalias. La aprobación corresponde a este módulo (versión ${version}).`,
  criticoFallido: (score: number) =>
    `Obtuviste ${score}/10. Antes de aprobar necesitas reforzar un criterio esencial. Revisa la orientación y vuelve a intentarlo.`,
  insuficiente: 'Puedes practicar y consultar herramientas antes de repetir la evaluación.',
  practicaReforzada:
    'Este nuevo intento repite las mismas diez preguntas: es práctica reforzada, no un intento independiente. Aún no existe un banco de preguntas equivalentes revisado.',
};

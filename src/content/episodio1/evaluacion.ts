// Evaluación final independiente (guion v1.2, apartado 16).
// Las preguntas no contienen la clave: está en ./clave.ts, que el frontend en modo registro no importa.
// Los IDs de opción conservan la letra del guion solo para trazabilidad; la interfaz no muestra letras.

import type { AssessmentConfig, Question } from '../types';

export const configEvaluacion: AssessmentConfig = {
  episodeId: 'ep1-una-ayuda-con-condiciones',
  version: '1.2',
  passScore: 8,
  criticalQuestionIds: ['P2', 'P3', 'P4', 'P6'],
  isProvisional: true,
};

export const notaUmbral =
  'Criterio pedagógico propuesto, pendiente de adopción institucional: al menos 8 de 10 y acierto en las preguntas críticas 2, 3, 4 y 6. No es un requisito textual de la política.';

export const preguntas: Question[] = [
  {
    id: 'P1',
    number: 1,
    title: 'Reconocer la preocupación',
    stem: 'Una persona adulta comenta que un colaborador ofrece prioridad en un beneficio a cambio de un favor sexual. ¿Cuál es el criterio adecuado?',
    options: [
      { id: 'P1-A', text: 'Es un asunto privado si la persona es adulta.' },
      {
        id: 'P1-B',
        text: 'Es una posible preocupación de explotación sexual y abuso de poder que requiere activar el mecanismo.',
      },
      { id: 'P1-C', text: 'Solo merece atención si el favor ya ocurrió.' },
    ],
    critical: false,
    criterion: 'Reconocer una posible explotación sexual vinculada con una ayuda.',
    explanation:
      'La solicitud o condición comunicada merece atención; no se espera consumación ni se determina culpabilidad al reportar.',
    recovery: { decisionId: 'D1', sceneId: 'E01', toolId: 'roles' },
  },
  {
    id: 'P2',
    number: 2,
    title: 'Reportar sin pruebas',
    stem: 'Conoces una preocupación, pero la persona no tiene capturas. ¿Qué haces?',
    options: [
      { id: 'P2-A', text: 'Pides que vuelva cuando tenga evidencia.' },
      { id: 'P2-B', text: 'Esperas otra comunicación similar.' },
      { id: 'P2-C', text: 'Reportas por el mecanismo con la información disponible, sin investigar personalmente.' },
    ],
    critical: true,
    criterion: 'Reportar oportunamente con la información disponible, sin exigir pruebas.',
    explanation: 'No se exige evidencia completa para comunicar una preocupación.',
    recovery: { decisionId: 'D4', sceneId: 'E04', toolId: 'reporte' },
  },
  {
    id: 'P3',
    number: 3,
    title: 'Confidencialidad',
    stem: 'Alguien te pide secreto absoluto. ¿Qué respondes?',
    options: [
      {
        id: 'P3-A',
        text: 'Explicas que existe un deber de reporte, cómo se restringe la información y que deseas conocer sus necesidades de seguridad.',
      },
      { id: 'P3-B', text: 'Prometes secreto para que continúe hablando.' },
      { id: 'P3-C', text: 'Dices que todo el equipo deberá conocerlo.' },
    ],
    critical: true,
    criterion: 'Explicar los límites de la confidencialidad sin prometer secreto absoluto ni divulgar.',
    explanation: 'Se evita una promesa imposible y la divulgación innecesaria.',
    recovery: { decisionId: 'D2', sceneId: 'E02', toolId: 'escucha' },
  },
  {
    id: 'P4',
    number: 4,
    title: 'Seguridad',
    stem: 'La persona teme encontrarse con quien señaló cuando salga de la actividad. ¿Qué priorizas?',
    options: [
      { id: 'P4-A', text: 'Completar todos los campos antes de actuar.' },
      {
        id: 'P4-B',
        text: 'Escuchar qué necesita y coordinar medidas inmediatas seguras, dentro de tu rol, junto con activar la ruta.',
      },
      { id: 'P4-C', text: 'Llamar a la persona señalada para que se retire, sin consultar a los responsables.' },
    ],
    critical: true,
    criterion: 'Atender la seguridad inmediata dentro del propio rol, sin confrontar.',
    explanation:
      'La seguridad no espera completar documentación y las medidas no deben improvisarse mediante confrontación.',
    recovery: { decisionId: 'D3', sceneId: 'E03', toolId: 'seguridad' },
  },
  {
    id: 'P5',
    number: 5,
    title: 'Información mínima',
    stem: '¿Qué incluir en un reporte?',
    options: [
      { id: 'P5-A', text: 'Rumores, opiniones y toda la vida familiar.' },
      { id: 'P5-B', text: 'Únicamente el nombre del programa, aunque ya conozcas necesidades relevantes.' },
      {
        id: 'P5-C',
        text: 'Hechos comunicados, contexto conocido, necesidades y acciones iniciales, distinguiendo información desconocida.',
      },
    ],
    critical: false,
    criterion: 'Compartir información pertinente, factual y de acceso restringido.',
    explanation: 'Información pertinente, factual y de acceso restringido.',
    recovery: { decisionId: 'D7', sceneId: 'E06', toolId: 'reporte' },
  },
  {
    id: 'P6',
    number: 6,
    title: 'Límites del rol',
    stem: 'Un colega propone entrevistar a más participantes para comprobar la preocupación. ¿Qué haces?',
    options: [
      {
        id: 'P6-A',
        text: 'Mantienes el reporte por el mecanismo y dejas las actuaciones de investigación a los responsables autorizados.',
      },
      { id: 'P6-B', text: 'Organizas entrevistas discretas para ayudar.' },
      { id: 'P6-C', text: 'Solicitas a la persona afectada que consiga testimonios.' },
    ],
    critical: true,
    criterion: 'No desarrollar una investigación paralela ni trasladar esa carga a la persona.',
    explanation: 'No se desarrolla una investigación paralela ni se traslada esa carga a la persona.',
    recovery: { decisionId: 'D8', sceneId: 'E07', toolId: 'no-hacer' },
  },
  {
    id: 'P7',
    number: 7,
    title: 'Conflicto de interés',
    stem: 'La persona que recibe habitualmente los reportes tiene un posible conflicto. ¿Qué haces?',
    options: [
      { id: 'P7-A', text: 'Esperas hasta que cambie de puesto.' },
      {
        id: 'P7-B',
        text: 'Acudes a una alternativa institucional habilitada y comunicas el conflicto con información mínima.',
      },
      { id: 'P7-C', text: 'Publicas la preocupación para que alguien intervenga.' },
    ],
    critical: false,
    criterion: 'Usar un canal alternativo institucional cuando el habitual no es seguro o adecuado.',
    explanation: 'Los canales alternativos permiten reportar sin exponer públicamente el caso.',
    recovery: { decisionId: 'D6', sceneId: 'E05B', toolId: 'reporte' },
  },
  {
    id: 'P8',
    number: 8,
    title: 'Apoyos',
    stem: 'Una participante pide conocer opciones de atención, pero teme que la obliguen a confrontar al señalado. ¿Qué corresponde?',
    options: [
      { id: 'P8-A', text: 'Suspender la ayuda hasta su colaboración.' },
      { id: 'P8-B', text: 'Exigir primero una denuncia penal como requisito general de todo apoyo.' },
      {
        id: 'P8-C',
        text: 'Explicar apoyos y proceso con los responsables, considerar sus preferencias y aclarar obligaciones aplicables sin imponer una confrontación.',
      },
    ],
    critical: false,
    criterion: 'Separar la asistencia de exigencias indebidas.',
    explanation:
      'El enfoque centrado en la persona separa asistencia de exigencias indebidas. La persona adulta decide sobre su atención; las obligaciones legales de denuncia que pudieran aplicar las valoran y explican los roles competentes.',
    complementaryNote:
      'El apoyo no se condiciona a una denuncia penal. La persona adulta decide sobre su atención; si existiera una obligación legal de denuncia, los roles competentes la valoran y se la explican.',
    recovery: { decisionId: 'D8', sceneId: 'E07', toolId: 'apoyos' },
  },
  {
    id: 'P9',
    number: 9,
    title: 'Clasificación',
    stem: 'No sabes si una preocupación corresponde a nivel 2 o 3. ¿Qué haces?',
    options: [
      {
        id: 'P9-A',
        text: 'Comunicas oportunamente lo conocido y permites que los roles competentes valoren nivel y escalamiento.',
      },
      { id: 'P9-B', text: 'Aplazas hasta tener certeza.' },
      { id: 'P9-C', text: 'Descartas la preocupación porque no puedes clasificarla.' },
    ],
    critical: false,
    criterion: 'Reportar sin exigir una clasificación previa.',
    explanation: 'La clasificación no es una condición previa para reportar.',
    recovery: { decisionId: 'D5', sceneId: 'E05', toolId: 'roles' },
  },
  {
    id: 'P10',
    number: 10,
    title: 'Prevención de represalias',
    stem: 'Tras una comunicación, alguien propone retirar a la persona del programa para evitar conflictos. ¿Qué corresponde?',
    options: [
      { id: 'P10-A', text: 'Aceptarlo siempre como medida protectora.' },
      {
        id: 'P10-B',
        text: 'Evitar una exclusión punitiva y solicitar valoración de medidas seguras por los responsables, considerando la voz de la persona y los criterios del programa.',
      },
      { id: 'P10-C', text: 'Avisar a todo el grupo quién presentó la preocupación.' },
    ],
    critical: false,
    criterion: 'Evitar represalias y no exponer a quien comunica.',
    explanation:
      'No se desplazan los costos de la respuesta a quien comunica ni se expone su identidad.',
    recovery: { decisionId: 'D9', sceneId: 'E08', toolId: 'escucha' },
  },
];

/** Textos de resultado (guion v1.1, apartado 17). */
export const textosResultado = {
  aprobado: (score: number, version: string) =>
    `Has aprobado este episodio. Demostraste los criterios evaluados para reconocer una preocupación y activar una respuesta desde tu rol. Resultado: ${score}/10. Esta aprobación corresponde al episodio Una ayuda con condiciones, versión ${version}.`,
  criticoFallido: (score: number) =>
    `Obtuviste ${score}/10. Necesitas reforzar un criterio esencial antes de aprobar. Revisa la orientación y realiza un nuevo intento.`,
  insuficiente: 'Hay decisiones que conviene practicar nuevamente. Puedes consultar las herramientas y volver a intentarlo.',
  practicaReforzada:
    'Este nuevo intento repite las mismas diez preguntas: es práctica reforzada, no un intento independiente. Aún no existe un banco de preguntas equivalentes revisado.',
};

// Evaluación final del módulo 3 (guion «Antes de abrir las puertas» v1.0, apartados 19 y 20).
// Las preguntas no contienen la clave: está en ./clave.ts, que el frontend en modo registro no importa.
// Los IDs llevan el prefijo M3_ y conservan la letra del guion solo para trazabilidad.

import type { AssessmentConfig, Question, TextosResultado } from '../types';

export const configEvaluacion: AssessmentConfig = {
  episodeId: 'm3-antes-de-abrir-las-puertas',
  version: '1.0',
  passScore: 8,
  criticalQuestionIds: ['M3_P2', 'M3_P4', 'M3_P6', 'M3_P8'],
  isProvisional: true,
};

export const notaUmbral =
  'Criterio pedagógico propuesto, pendiente de validación por el Punto Focal: al menos 8 de 10 y acierto en las preguntas críticas 2, 4, 6 y 8. Ambas condiciones deben cumplirse. No es un requisito textual de la política.';

export const preguntas: Question[] = [
  {
    id: 'M3_P1',
    number: 1,
    title: 'Prevención desde la preparación',
    stem: 'Una actividad dispone de local y agenda. ¿Qué falta para decidir si puede realizarse?',
    options: [
      {
        id: 'M3_P1-A',
        text: 'Una revisión de riesgos con medidas implementadas, responsables y comprobación de condiciones.',
      },
      {
        id: 'M3_P1-B',
        text: 'Una firma de las familias que libere de responsabilidad al equipo.',
      },
      { id: 'M3_P1-C', text: 'Esperar a que alguien comunique un incidente.' },
    ],
    critical: false,
    criterion: 'Revisar riesgos desde la preparación, con medidas, responsables y comprobación.',
    explanation: 'La logística programada no demuestra por sí sola condiciones de salvaguarda.',
    recovery: { decisionId: 'M3_D01', sceneId: 'M3_E01', toolId: 'm3-ficha' },
  },
  {
    id: 'M3_P2',
    number: 2,
    title: 'Supervisión',
    stem: 'Una persona del equipo falta y se propone dejar un grupo con una persona adulta en un espacio separado. ¿Qué procede?',
    options: [
      {
        id: 'M3_P2-A',
        text: 'Continuar con la puerta abierta, sin más valoración.',
      },
      {
        id: 'M3_P2-B',
        text: 'Pedir a un adolescente que asuma la responsabilidad del grupo.',
      },
      {
        id: 'M3_P2-C',
        text: 'Reorganizar, pausar o no iniciar hasta garantizar supervisión conforme a la regla institucional y las necesidades del grupo, con personal autorizado.',
      },
    ],
    critical: true,
    criterion: 'Mantener una supervisión adecuada con personal autorizado.',
    explanation:
      'La regla de dos adultos no se sustituye por una puerta abierta ni significa suficiencia automática para cualquier actividad.',
    recovery: {
      decisionId: 'M3_D02',
      sceneId: 'M3_E02',
      toolId: 'm3-supervision',
    },
  },
  {
    id: 'M3_P3',
    number: 3,
    title: 'Accesibilidad',
    stem: 'La dinámica propuesta impide a una participante acceder al espacio. ¿Cuál es la respuesta adecuada?',
    options: [
      {
        id: 'M3_P3-A',
        text: 'Excluirla temporalmente para no retrasar al grupo.',
      },
      {
        id: 'M3_P3-B',
        text: 'Consultar necesidades y preferencias y verificar una adaptación segura e inclusiva; si no es posible, replantear el componente sin excluirla para conservar la agenda.',
      },
      {
        id: 'M3_P3-C',
        text: 'Improvisar cualquier ayuda física sin preguntar.',
      },
    ],
    critical: false,
    criterion: 'Considerar la accesibilidad con participación de la persona.',
    explanation: 'La adaptación debe ser pertinente y segura, con participación de la persona.',
    recovery: {
      decisionId: 'M3_D03',
      sceneId: 'M3_E03',
      toolId: 'm3-participacion',
    },
  },
  {
    id: 'M3_P4',
    number: 4,
    title: 'Cambio de transporte',
    stem: 'Un vehículo distinto reemplaza al proveedor previsto a última hora. ¿Qué haces?',
    options: [
      { id: 'M3_P4-A', text: 'Aceptarlo si lo recomienda alguien conocido.' },
      { id: 'M3_P4-B', text: 'Pedir una firma que autorice cualquier riesgo.' },
      {
        id: 'M3_P4-C',
        text: 'Detener la aceptación del traslado hasta verificar condiciones y autorización, y coordinar alternativa y acompañamiento seguro si no se confirma.',
      },
    ],
    critical: true,
    criterion: 'Coordinar transporte y salida verificados.',
    explanation: 'El cambio exige controles; ni confianza ni firma sustituyen las verificaciones.',
    recovery: {
      decisionId: 'M3_D04',
      sceneId: 'M3_E04',
      toolId: 'm3-transporte',
    },
  },
  {
    id: 'M3_P5',
    number: 5,
    title: 'Visita no prevista',
    stem: 'Una persona vinculada a un donante solicita conversar a solas con participantes. ¿Qué corresponde?',
    options: [
      {
        id: 'M3_P5-A',
        text: 'No facilitar contacto improvisado; activar el procedimiento de visita, controles y acompañamiento autorizado y reprogramar si no se cumplen condiciones.',
      },
      { id: 'M3_P5-B', text: 'Permitirlo por su relación con el donante.' },
      { id: 'M3_P5-C', text: 'Asignar a un niño como acompañante.' },
    ],
    critical: false,
    criterion: 'Controlar las visitas.',
    explanation: 'Las visitas están sujetas a controles y no se delega su supervisión en NNA.',
    recovery: { decisionId: 'M3_D05', sceneId: 'M3_E05', toolId: 'm3-visitas' },
  },
  {
    id: 'M3_P6',
    number: 6,
    title: 'Imagen y voluntariedad',
    stem: 'Una adolescente no desea aparecer en fotografías aunque participa en el taller. ¿Qué haces?',
    options: [
      {
        id: 'M3_P6-A',
        text: 'Indicar que la autorización de participación cubre todo uso de imagen.',
      },
      {
        id: 'M3_P6-B',
        text: 'Respetar su decisión y asegurar participación sin exposición; revisar permisos, finalidad y riesgos antes de cualquier registro o publicación.',
      },
      {
        id: 'M3_P6-C',
        text: 'Excluirla de la actividad para facilitar la fotografía.',
      },
    ],
    critical: true,
    criterion: 'Distinguir participación e imagen y respetar la voluntariedad.',
    explanation: 'Participación e imagen son decisiones diferenciadas; no se utiliza coerción ni exclusión.',
    recovery: { decisionId: 'M3_D06', sceneId: 'M3_E06', toolId: 'm3-visitas' },
  },
  {
    id: 'M3_P7',
    number: 7,
    title: 'Dinámica sensible',
    stem: 'Una actividad propone compartir públicamente experiencias personales de violencia. ¿Qué ajuste es protector?',
    options: [
      {
        id: 'M3_P7-A',
        text: 'Solicitar solo a quienes parecen tener más confianza.',
      },
      { id: 'M3_P7-B', text: 'Prometer que nadie repetirá los relatos.' },
      {
        id: 'M3_P7-C',
        text: 'Utilizar situaciones ficticias, participación voluntaria y formas seguras de pedir apoyo; si hay una revelación espontánea, activar respuesta sin interrogar.',
      },
    ],
    critical: false,
    criterion: 'Atender el malestar sin obligar a revelar.',
    explanation: 'La formación no debe provocar exposición ni prometer confidencialidad grupal absoluta.',
    recovery: {
      decisionId: 'M3_D07',
      sceneId: 'M3_E07',
      toolId: 'm3-preocupacion',
    },
  },
  {
    id: 'M3_P8',
    number: 8,
    title: 'Decisión de inicio o suspensión',
    stem: 'Una parte de la jornada no dispone de condiciones mínimas de supervisión. ¿Qué corresponde?',
    options: [
      { id: 'M3_P8-A', text: 'Realizarla porque la comunidad ya llegó.' },
      {
        id: 'M3_P8-B',
        text: 'No iniciar el componente inseguro; adaptar lo viable o suspender/reprogramar, con validación de los responsables, comunicación y continuidad del cuidado.',
      },
      {
        id: 'M3_P8-C',
        text: 'Transferir a participantes la responsabilidad por cualquier incidente.',
      },
    ],
    critical: true,
    criterion: 'Adaptar o suspender lo que no tiene condiciones, manteniendo el cuidado.',
    explanation: 'La respuesta es proporcional y conserva acompañamiento seguro; cumplir una meta no elimina riesgos.',
    recovery: { decisionId: 'M3_D08', sceneId: 'M3_E08', toolId: 'm3-pausar' },
  },
  {
    id: 'M3_P9',
    number: 9,
    title: 'Entrega al finalizar',
    stem: 'Una persona no registrada llega a recoger a un niño. ¿Qué haces?',
    options: [
      {
        id: 'M3_P9-A',
        text: 'Mantener acompañamiento y verificar identidad y autorización por el procedimiento y con los responsables antes de la salida, atendiendo cualquier señal de riesgo.',
      },
      { id: 'M3_P9-B', text: 'Dar por suficiente que el niño la reconoce.' },
      {
        id: 'M3_P9-C',
        text: 'Publicar su documento en el grupo general para consultar.',
      },
    ],
    critical: false,
    criterion: 'Verificar una entrega autorizada sin exponer datos.',
    explanation: 'La salida se verifica sin exposición innecesaria ni suposiciones sobre autorización.',
    recovery: {
      decisionId: 'M3_D10',
      sceneId: 'M3_E10',
      toolId: 'm3-transporte',
    },
  },
  {
    id: 'M3_P10',
    number: 10,
    title: 'Aprendizaje y reporte',
    stem: 'Se corrigió una situación que pudo poner a participantes en riesgo. ¿Qué corresponde?',
    options: [
      { id: 'M3_P10-A', text: 'No documentarla porque no hubo daño visible.' },
      {
        id: 'M3_P10-B',
        text: 'Compartir nombres y detalles con todos para dar ejemplo.',
      },
      {
        id: 'M3_P10-C',
        text: 'Registrar la mejora y los pendientes por los canales pertinentes y comunicar cualquier preocupación o incumplimiento de salvaguarda según el mecanismo, con información restringida.',
      },
    ],
    critical: false,
    criterion: 'Documentar el aprendizaje y reportar preocupaciones.',
    explanation:
      'Corregir no elimina la responsabilidad de reportar cuando corresponde; el aprendizaje no exige exposición pública.',
    recovery: {
      decisionId: 'M3_D10',
      sceneId: 'M3_E10',
      toolId: 'm3-preocupacion',
    },
  },
];

/** Textos de resultado (guion del módulo 3, apartado 20). */
export const textosResultado: TextosResultado = {
  aprobado: (score: number, version: string) =>
    `Aprobaste Antes de abrir las puertas. Resultado: ${score}/10. Demostraste los criterios evaluados para preparar y adaptar actividades con medidas de salvaguarda. Esta aprobación corresponde a este módulo (versión ${version}).`,
  criticoFallido: (score: number) =>
    `Obtuviste ${score}/10. Antes de aprobar necesitas reforzar una condición esencial de seguridad. Revisa la herramienta y vuelve a intentarlo.`,
  insuficiente: 'Puedes revisar las decisiones y consultar las herramientas antes de repetir la evaluación.',
  practicaReforzada:
    'Este nuevo intento repite las mismas diez preguntas: es práctica reforzada, no un intento independiente. La forma B del banco alternativo está pendiente de validación y todavía no se usa en el registro.',
};

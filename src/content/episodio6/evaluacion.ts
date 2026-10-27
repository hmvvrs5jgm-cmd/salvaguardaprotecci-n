// Evaluación final del módulo 6 (guion «Una imagen que no debió publicarse» v1.0, apartados 20 y 21).
// Las preguntas no contienen la clave: está en ./clave.ts, que el frontend en modo registro no importa.
// Los IDs llevan el prefijo M6_ y conservan la letra del guion solo para trazabilidad.

import type { AssessmentConfig, Question, TextosResultado } from '../types';

export const configEvaluacion: AssessmentConfig = {
  episodeId: 'm6-una-imagen-que-no-debio-publicarse',
  version: '1.0',
  passScore: 8,
  criticalQuestionIds: ['M6_P2', 'M6_P4', 'M6_P5', 'M6_P6'],
  isProvisional: true,
};

export const notaUmbral =
  'Criterio pedagógico propuesto, pendiente de adopción institucional: al menos 8 de 10 y acierto en las preguntas críticas 2, 4, 5 y 6. Ambas condiciones deben cumplirse. No es una exigencia textual de las fuentes.';

export const preguntas: Question[] = [
  {
    id: 'M6_P1',
    number: 1,
    title: 'Identificación contextual',
    stem: 'Una fotografía cotidiana no muestra violencia, pero el texto y la ubicación permiten reconocer a una niña y vincularla con información sensible. ¿Qué criterio corresponde?',
    options: [
      { id: 'M6_P1-A', text: 'No hay riesgo porque la fotografía es cotidiana.' },
      { id: 'M6_P1-B', text: 'Solo importa si aparece el nombre completo.' },
      {
        id: 'M6_P1-C',
        text: 'Se debe valorar la combinación de imagen, texto y contexto como posible exposición y activar el mecanismo.',
      },
    ],
    critical: false,
    criterion: 'Reconocer la identificación directa e indirecta en imagen, texto, etiquetas y contexto.',
    explanation: 'La exposición puede provenir del contexto, sin contenido explícito.',
    recovery: { decisionId: 'M6_D01', sceneId: 'M6_E01', toolId: 'm6-revision' },
  },
  {
    id: 'M6_P2',
    number: 2,
    title: 'Alcance de la autorización',
    stem: 'Existe un permiso general, pero la niña expresa preocupación por una publicación. ¿Qué haces?',
    options: [
      {
        id: 'M6_P2-A',
        text: 'Atender el riesgo actual y revisar alcance y comprensión del permiso con responsables, sin forzar uso ni esperar otra firma para contener exposición.',
      },
      { id: 'M6_P2-B', text: 'Mantener la pieza porque la firma elimina cualquier objeción.' },
      { id: 'M6_P2-C', text: 'Pedir un nuevo permiso para seguir con la campaña antes de escucharla.' },
    ],
    critical: true,
    criterion: 'Comprender que una autorización no elimina el deber de valorar riesgos ni la voz de la niña.',
    explanation: 'El consentimiento no reemplaza la protección ni convierte una firma en autorización ilimitada.',
    recovery: { decisionId: 'M6_D02', sceneId: 'M6_E02', toolId: 'm6-decisiones' },
  },
  {
    id: 'M6_P3',
    number: 3,
    title: 'Difuminar',
    stem: 'Se propone difuminar un rostro y conservar el texto que describe el caso y el lugar. ¿Qué observas?',
    options: [
      { id: 'M6_P3-A', text: 'Difuminar garantiza anonimato en todo contexto.' },
      {
        id: 'M6_P3-B',
        text: 'Otros rasgos, datos y publicaciones pueden permitir reconocimiento; debe revisarse toda la pieza y puede ser necesario no publicarla.',
      },
      { id: 'M6_P3-C', text: 'Bastaría quitar el primer nombre.' },
    ],
    critical: false,
    criterion: 'No equiparar desenfoque con anonimato.',
    explanation: 'La seguridad exige valorar la combinación de datos, no solo el rostro.',
    recovery: { decisionId: 'M6_D08', sceneId: 'M6_E08', toolId: 'm6-alternativas' },
  },
  {
    id: 'M6_P4',
    number: 4,
    title: 'Contención',
    stem: 'Una publicación institucional está generando preocupación de seguridad. ¿Qué acción corresponde?',
    options: [
      { id: 'M6_P4-A', text: 'Esperar al siguiente calendario de reuniones.' },
      { id: 'M6_P4-B', text: 'Reenviar la imagen para pedir consejo amplio.' },
      {
        id: 'M6_P4-C',
        text: 'Comunicar y coordinar retiro o restricción por administradores autorizados, registro mínimo seguro y protección, sin prolongar exposición para obtener pruebas.',
      },
    ],
    critical: true,
    criterion: 'Comunicar una exposición y coordinar la contención sin investigación personal.',
    explanation: 'La contención se ejecuta según roles y no implica nueva difusión ni borrado para ocultar.',
    recovery: { decisionId: 'M6_D04', sceneId: 'M6_E04', toolId: 'm6-preocupacion' },
  },
  {
    id: 'M6_P5',
    number: 5,
    title: 'Escuchar y no condicionar',
    stem: 'Una niña quiere continuar en el programa, pero no acepta fotografías. ¿Qué respondes?',
    options: [
      {
        id: 'M6_P5-A',
        text: 'Su participación y acceso no se condicionan a imágenes; se escucha la preferencia y se coordinan medidas sin exigir contenido nuevo.',
      },
      { id: 'M6_P5-B', text: 'Debe salir del programa para facilitar las fotos del grupo.' },
      { id: 'M6_P5-C', text: 'Debe grabar una explicación pública para retirar el material.' },
    ],
    critical: true,
    criterion: 'Escuchar preferencias sin condicionar la participación a producir imágenes o testimonios.',
    explanation: 'La participación y la protección no dependen de producir material comunicacional.',
    recovery: { decisionId: 'M6_D05', sceneId: 'M6_E05', toolId: 'm6-comunicacion' },
  },
  {
    id: 'M6_P6',
    number: 6,
    title: 'Copias externas',
    stem: 'Otra cuenta compartió una imagen que se intenta retirar. ¿Qué corresponde?',
    options: [
      { id: 'M6_P6-A', text: 'Pedir a la niña que busque todas las copias.' },
      {
        id: 'M6_P6-B',
        text: 'Transmitir referencias conocidas por vía restringida para solicitudes y mecanismos competentes, sin amplificar, exponer más ni prometer borrado total.',
      },
      { id: 'M6_P6-C', text: 'Repostear la imagen públicamente para pedir que nadie la comparta.' },
    ],
    critical: true,
    criterion: 'Actuar sobre copias conocidas sin amplificar ni trasladar la tarea a la niña.',
    explanation:
      'La respuesta a copias conocidas no debe convertir a la persona afectada en investigadora ni amplificar el material.',
    recovery: { decisionId: 'M6_D06', sceneId: 'M6_E06', toolId: 'm6-copias' },
  },
  {
    id: 'M6_P7',
    number: 7,
    title: 'Rectificación',
    stem: 'Se propone una disculpa pública con nombre e imagen de la niña. ¿Qué criterio aplicas?',
    options: [
      { id: 'M6_P7-A', text: 'La transparencia exige mostrar el material original.' },
      { id: 'M6_P7-B', text: 'Se debe ocultar todo a la persona afectada.' },
      {
        id: 'M6_P7-C',
        text: 'Los responsables evalúan comunicación necesaria sin identificación ni amplificación; la explicación privada y segura a la niña no se sustituye por publicidad.',
      },
    ],
    critical: false,
    criterion: 'Evitar rectificaciones públicas que identifiquen o amplifiquen.',
    explanation: 'Rendición de cuentas y privacidad pueden y deben coordinarse.',
    recovery: { decisionId: 'M6_D07', sceneId: 'M6_E07', toolId: 'm6-comunicacion' },
  },
  {
    id: 'M6_P8',
    number: 8,
    title: 'Alternativa comunicacional',
    stem: 'No existe una pieza segura y revisada para el calendario. ¿Qué decisión es válida?',
    options: [
      {
        id: 'M6_P8-A',
        text: 'Reprogramar o no publicar, o preparar contenido general independiente revisado, sin presionar a la niña ni reconstruir su imagen o historia.',
      },
      { id: 'M6_P8-B', text: 'Generar su retrato con IA a partir de la fotografía retirada.' },
      { id: 'M6_P8-C', text: 'Publicar con prisa y revisar después.' },
    ],
    critical: false,
    criterion: 'Revisar alternativas comunicacionales sin condicionar la ayuda.',
    explanation: 'El calendario no elimina la obligación de protección y revisión.',
    recovery: { decisionId: 'M6_D08', sceneId: 'M6_E08', toolId: 'm6-alternativas' },
  },
  {
    id: 'M6_P9',
    number: 9,
    title: 'Conservación y reutilización',
    stem: 'La imagen sigue en una carpeta de campaña y en una pieza programada. ¿Qué procede?',
    options: [
      { id: 'M6_P9-A', text: 'Ignorarlo porque ya no está en la publicación inicial.' },
      {
        id: 'M6_P9-B',
        text: 'Coordinar detener reutilizaciones y revisar permisos, copias y conservación autorizada, sin crear archivos personales ni borrar registros para ocultar.',
      },
      { id: 'M6_P9-C', text: 'Borrar también toda autorización sin revisión.' },
    ],
    critical: false,
    criterion: 'Detener reutilizaciones sin destruir registros.',
    explanation: 'Impedir nueva exposición y conservar registros necesarios son tareas diferentes y coordinadas.',
    recovery: { decisionId: 'M6_D09', sceneId: 'M6_E09', toolId: 'm6-archivo' },
  },
  {
    id: 'M6_P10',
    number: 10,
    title: 'Seguimiento',
    stem: 'Se retiró una publicación propia. ¿Qué conclusión es adecuada?',
    options: [
      { id: 'M6_P10-A', text: 'No puede quedar ningún riesgo.' },
      { id: 'M6_P10-B', text: 'La niña debe declarar públicamente que está bien.' },
      {
        id: 'M6_P10-C',
        text: 'Se documenta lo confirmado, lo pendiente y lo desconocido; los responsables mantienen valoración, apoyos y seguimiento antes de una eventual decisión de cierre.',
      },
    ],
    critical: false,
    criterion: 'No declarar resuelta la exposición ni cerrado el caso por retirar una publicación.',
    explanation: 'Retiro, reducción de riesgos y cierre no son equivalentes.',
    recovery: { decisionId: 'M6_D10', sceneId: 'M6_E10', toolId: 'm6-archivo' },
  },
];

/** Textos de resultado (guion del módulo 6, apartado 21). */
export const textosResultado: TextosResultado = {
  aprobado: (score: number, version: string) =>
    `Aprobaste Una imagen que no debió publicarse. Resultado: ${score}/10. Demostraste los criterios evaluados sobre uso de imagen, participación y respuesta protectora ante exposición. La aprobación corresponde a este módulo (versión ${version}).`,
  criticoFallido: (score: number) =>
    `Obtuviste ${score}/10. Necesitas reforzar un criterio esencial antes de aprobar. Revisa la herramienta y vuelve a intentarlo.`,
  insuficiente: 'Puedes consultar recursos y volver a practicar antes de repetir la evaluación.',
  practicaReforzada:
    'Este nuevo intento repite las mismas diez preguntas: es práctica reforzada, no un intento independiente. La forma B del banco alternativo está pendiente de validación y todavía no se usa en el registro.',
};

// Evaluación final del módulo 4 (guion «La información también protege» v1.0, apartados 20 y 21).
// Las preguntas no contienen la clave: está en ./clave.ts, que el frontend en modo registro no importa.
// Los IDs llevan el prefijo M4_ y conservan la letra del guion solo para trazabilidad.

import type { AssessmentConfig, Question, TextosResultado } from '../types';

export const configEvaluacion: AssessmentConfig = {
  episodeId: 'm4-la-informacion-tambien-protege',
  version: '1.0',
  passScore: 8,
  criticalQuestionIds: ['M4_P2', 'M4_P5', 'M4_P6', 'M4_P7'],
  isProvisional: true,
};

export const notaUmbral =
  'Criterio pedagógico propuesto, pendiente de adopción institucional: al menos 8 de 10 y acierto en las preguntas críticas 2, 5, 6 y 7. Ambas condiciones deben cumplirse. No es una exigencia textual de las fuentes.';

export const preguntas: Question[] = [
  {
    id: 'M4_P1',
    number: 1,
    title: 'Finalidad',
    stem: 'Una colega solicita un expediente para preparar un resumen de resultados. ¿Qué procede?',
    options: [
      { id: 'M4_P1-A', text: 'Enviar todo para que ella seleccione.' },
      {
        id: 'M4_P1-B',
        text: 'Aclarar propósito y destinatarios y gestionar información mínima y autorizada por el responsable.',
      },
      { id: 'M4_P1-C', text: 'Negar cualquier información, incluso la necesaria para proteger.' },
    ],
    critical: false,
    criterion: 'Diferenciar interés y necesidad funcional de acceso.',
    explanation: 'Se comparte por función y propósito, no por comodidad ni de forma absoluta.',
    recovery: { decisionId: 'M4_D01', sceneId: 'M4_E01', toolId: 'm4-compartir' },
  },
  {
    id: 'M4_P2',
    number: 2,
    title: 'Acceso por pertenencia',
    stem: 'Una persona dice que integrar el SIMT le da derecho a todos los expedientes. ¿Cuál es el criterio correcto?',
    options: [
      {
        id: 'M4_P2-A',
        text: 'La pertenencia no concede acceso automático; debe justificarse y autorizarse según la función y el caso, con registro.',
      },
      { id: 'M4_P2-B', text: 'Toda persona del SIMT tiene acceso completo por defecto.' },
      { id: 'M4_P2-C', text: 'El acceso de lectura no necesita autorización.' },
    ],
    critical: true,
    criterion: 'Aplicar la necesidad de conocimiento aun dentro de equipos formales.',
    explanation: 'La necesidad de conocimiento limita datos y destinatarios aun dentro de equipos formales.',
    recovery: { decisionId: 'M4_D02', sceneId: 'M4_E02', toolId: 'm4-accesos' },
  },
  {
    id: 'M4_P3',
    number: 3,
    title: 'Identificación',
    stem: 'Un informe elimina nombres, pero conserva una comunidad pequeña, una edad y una fecha precisa. ¿Qué observas?',
    options: [
      { id: 'M4_P3-A', text: 'Está anonimizado de forma suficiente en cualquier contexto.' },
      { id: 'M4_P3-B', text: 'Bastaría añadir iniciales.' },
      {
        id: 'M4_P3-C',
        text: 'Los datos pueden combinarse e identificar; hay que revisar necesidad, generalización y audiencia antes de compartir.',
      },
    ],
    critical: false,
    criterion: 'Identificar datos directos e indirectos.',
    explanation: 'Quitar el nombre no garantiza anonimato.',
    recovery: { decisionId: 'M4_D03', sceneId: 'M4_E03', toolId: 'm4-identificacion' },
  },
  {
    id: 'M4_P4',
    number: 4,
    title: 'Mínimo por tarea',
    stem: 'Un área logística recibe una tarea autorizada de apoyo. ¿Qué información corresponde?',
    options: [
      { id: 'M4_P4-A', text: 'Todo el relato y el expediente clínico.' },
      {
        id: 'M4_P4-B',
        text: 'Los datos operativos mínimos que el responsable autorice para cumplir la tarea segura, sin detalles ajenos a su finalidad.',
      },
      { id: 'M4_P4-C', text: 'Todos los casos del programa para comparar.' },
    ],
    critical: false,
    criterion: 'Elaborar información mínima para un propósito autorizado.',
    explanation: 'El acceso se ajusta a la tarea sin suponer que mínimo siempre significa cero datos.',
    recovery: { decisionId: 'M4_D04', sceneId: 'M4_E04', toolId: 'm4-accesos' },
  },
  {
    id: 'M4_P5',
    number: 5,
    title: 'Canal y permisos',
    stem: 'Un archivo sensible está en un repositorio institucional con enlace abierto a cualquiera. ¿Es seguro enviarlo?',
    options: [
      {
        id: 'M4_P5-A',
        text: 'No basta con el repositorio: se necesitan destinatarios y permisos autorizados; se coordina corregirlos sin exponerlo más.',
      },
      { id: 'M4_P5-B', text: 'Sí, todo enlace institucional es seguro.' },
      { id: 'M4_P5-C', text: 'Sí, si se pide verbalmente que no se comparta.' },
    ],
    critical: true,
    criterion: 'Utilizar canales y repositorios aprobados con permisos apropiados.',
    explanation: 'Un canal aprobado puede estar configurado de forma insegura.',
    recovery: { decisionId: 'M4_D05', sceneId: 'M4_E05', toolId: 'm4-compartir' },
  },
  {
    id: 'M4_P6',
    number: 6,
    title: 'Exposición detectada',
    stem: 'Un fragmento identificable aparece en un chat amplio. ¿Qué haces?',
    options: [
      { id: 'M4_P6-A', text: 'Reenviarlo para que nadie diga que no fue advertido.' },
      { id: 'M4_P6-B', text: 'Borrarlo sin comunicar y asumir que todo se resolvió.' },
      {
        id: 'M4_P6-C',
        text: 'Evitar nueva difusión y comunicar inmediatamente por el mecanismo autorizado para contención y valoración de riesgos.',
      },
    ],
    critical: true,
    criterion: 'Comunicar una exposición sin ampliarla.',
    explanation: 'La respuesta requiere comunicación y protección, no difusión ni ocultamiento.',
    recovery: { decisionId: 'M4_D06', sceneId: 'M4_E06', toolId: 'm4-exposicion' },
  },
  {
    id: 'M4_P7',
    number: 7,
    title: 'Contención y rol',
    stem: 'Te solicitan apoyo para identificar el recurso expuesto. ¿Qué acción es adecuada?',
    options: [
      { id: 'M4_P7-A', text: 'Descargar todo en un dispositivo personal como prueba.' },
      {
        id: 'M4_P7-B',
        text: 'Aportar referencias y hechos mínimos por la vía autorizada, sin nuevas copias ni accesos ajenos, y ejecutar solo medidas permitidas.',
      },
      { id: 'M4_P7-C', text: 'Eliminar historial y registros para que no quede rastro.' },
    ],
    critical: true,
    criterion: 'Distinguir la contención autorizada del borrado, el ocultamiento o la investigación personal.',
    explanation: 'Contener y preservar se coordinan; no justifican investigación ni borrado personal.',
    recovery: { decisionId: 'M4_D07', sceneId: 'M4_E07', toolId: 'm4-contener' },
  },
  {
    id: 'M4_P8',
    number: 8,
    title: 'Seguridad de la persona',
    stem: 'La exposición podría permitir reconocer a una adolescente. ¿Cómo contribuyes?',
    options: [
      {
        id: 'M4_P8-A',
        text: 'Comunicar el riesgo al Punto Focal para coordinar protección, revisión de obligaciones y comunicación segura por los roles competentes.',
      },
      { id: 'M4_P8-B', text: 'Contactar cualquier número que encuentres en el archivo.' },
      { id: 'M4_P8-C', text: 'Decidir por tu cuenta que nadie debe informarle.' },
    ],
    critical: false,
    criterion: 'Mantener la protección de las personas como prioridad de la respuesta.',
    explanation:
      'La información a la persona y las medidas se coordinan considerando seguridad y obligaciones, sin improvisación.',
    recovery: { decisionId: 'M4_D08', sceneId: 'M4_E08', toolId: 'm4-exposicion' },
  },
  {
    id: 'M4_P9',
    number: 9,
    title: 'Error propio',
    stem: 'Descubres que enviaste un enlace al destinatario equivocado. ¿Qué corresponde?',
    options: [
      { id: 'M4_P9-A', text: 'Esperar para saber si alguien reclama.' },
      { id: 'M4_P9-B', text: 'Pedir a otra persona que asuma el error.' },
      {
        id: 'M4_P9-C',
        text: 'Comunicarlo oportunamente con hechos y acciones realizadas y colaborar con la respuesta autorizada.',
      },
    ],
    critical: false,
    criterion: 'Comunicar una exposición, incluso cuando el error es propio.',
    explanation: 'El reconocimiento permite contención; el silencio no demuestra ausencia de acceso.',
    recovery: { decisionId: 'M4_D09', sceneId: 'M4_E09', toolId: 'm4-reportar' },
  },
  {
    id: 'M4_P10',
    number: 10,
    title: 'Conservación',
    stem: 'Un caso cerró y alguien propone borrar toda documentación inmediatamente. ¿Qué criterio corresponde?',
    options: [
      { id: 'M4_P10-A', text: 'Borrarla sin revisión porque el cierre elimina toda obligación.' },
      {
        id: 'M4_P10-B',
        text: 'Aplicar conservación y eliminación autorizadas y documentadas, considerando requisitos pendientes, con aprendizaje mínimo no identificable.',
      },
      { id: 'M4_P10-C', text: 'Guardar copias personales por si acaso.' },
    ],
    critical: false,
    criterion: 'Aplicar conservación y eliminación solo según los procesos autorizados.',
    explanation: 'El cierre no autoriza borrado indiscriminado ni archivo personal.',
    recovery: { decisionId: 'M4_D10', sceneId: 'M4_E10', toolId: 'm4-aprendizaje' },
  },
];

/** Textos de resultado (guion del módulo 4, apartado 21). */
export const textosResultado: TextosResultado = {
  aprobado: (score: number, version: string) =>
    `Aprobaste La información también protege. Resultado: ${score}/10. Demostraste los criterios evaluados de confidencialidad, necesidad de conocimiento y respuesta responsable ante una exposición. Esta aprobación corresponde a este módulo (versión ${version}).`,
  criticoFallido: (score: number) =>
    `Obtuviste ${score}/10. Necesitas reforzar un criterio esencial antes de aprobar. Revisa la herramienta y vuelve a intentarlo.`,
  insuficiente: 'Puedes practicar las decisiones y consultar herramientas antes de un nuevo intento.',
  practicaReforzada:
    'Este nuevo intento repite las mismas diez preguntas: es práctica reforzada, no un intento independiente. Aún no existe un banco de preguntas equivalentes revisado.',
};

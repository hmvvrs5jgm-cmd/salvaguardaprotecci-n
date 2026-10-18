// Herramientas de consulta (guion v1.2, apartado 15; prompt, apartados 2.2 y 5).
// Cada herramienta cita sus fuentes. No contienen teléfonos de servicios, autoridades ni personas inventadas.
// El mapeo de servicios del Protocolo de asistencia y derivación es de uso interno: no se publica aquí.

import { avisoServicios, serviciosPublicos } from '../config/canales';
import type { Tool, ToolId } from './types';

const lineaServicio = (s: (typeof serviciosPublicos)[number]) =>
  `${s.nombre}${s.contacto ? ` (${s.contacto})` : ''}: ${s.descripcion}`;

export const herramientas: Tool[] = [
  {
    id: 'escucha',
    title: 'Guía de escucha',
    summary: 'Cómo recibir una preocupación sin culpabilizar, interrogar ni prometer lo que no puedes cumplir.',
    sections: [
      {
        heading: 'Al escuchar',
        bullets: [
          'Agradece que la persona se acerque («gracias por confiar») y valida sus emociones.',
          'Ofrece un espacio discreto donde se sienta segura, sin que terceras personas escuchen; pregúntale dónde prefiere hablar.',
          'Escucha sin juzgar, sin interrumpir y sin cuestionar su credibilidad. Escuchar no implica determinar culpabilidad.',
          'No pidas detalles íntimos ni reconstruyas los hechos: escucha lo esencial y formula preguntas mínimas para identificar necesidades y activar la respuesta.',
          'Evita que repita su relato y no presiones sus decisiones. Usa un lenguaje sencillo y refiérete a la persona como prefiera ser tratada.',
        ],
      },
      {
        heading: 'Confidencialidad con límites',
        bullets: [
          'No prometas secreto absoluto: existen obligaciones de reporte y excepciones por riesgo grave.',
          'Explica desde el inicio qué información necesitas comunicar, por qué vía y cómo se restringe su acceso a quienes deban atenderla.',
          'Pregunta por sus preocupaciones para reducir riesgos y no garantices resultados que no controlas, como obtener una plaza.',
        ],
      },
      {
        heading: 'Si te equivocas',
        paragraphs: [
          'Puedes reparar: reconoce lo que dijiste y corrígelo con respeto. Por ejemplo, aclarar que no puedes prometer secreto absoluto y explicar los límites.',
        ],
      },
    ],
    sources: [
      'Protocolo de asistencia y derivación, 3.3, 3.4, 7.2 y 8.2',
      'PPT, diapositivas 26–28 y 33 (no revictimización y enfoque centrado en la persona sobreviviente)',
      'PPT, diapositiva 48 (promesas inapropiadas sobre la confidencialidad)',
      'Procedimiento 5.1.14.7 (confidencialidad)',
      'Guion, escenas E01 y E02',
    ],
  },
  {
    id: 'seguridad',
    title: 'Tarjeta de seguridad y contacto',
    summary: 'Preguntas mínimas para atender la seguridad inmediata y acordar un contacto seguro.',
    sections: [
      {
        heading: 'Preguntas mínimas',
        bullets: [
          '¿Te sientes segura o seguro ahora?',
          '¿Hay algo que necesites para salir de aquí con tranquilidad?',
          '¿De qué manera sería seguro contactarte, si necesitas seguimiento?',
        ],
      },
      {
        heading: 'Dentro de tu función',
        bullets: [
          'Si hubiera peligro inmediato o necesidad urgente de atención, activa la respuesta de emergencia (911) y los servicios competentes según la ruta local. La seguridad y la atención no esperan una clasificación ni la conclusión de una investigación.',
          'No actúes solo o sola ante un riesgo grave: activa de inmediato al Punto Focal de Salvaguarda (PEP) y sigue los protocolos de emergencia.',
          'No improvises medidas mediante confrontación: no contactes a la persona señalada.',
          'Explica con honestidad los límites de la protección disponible.',
          'Registra la preferencia de contacto solo por la vía restringida, con acceso para quienes necesitan actuar.',
        ],
      },
    ],
    sources: [
      'Procedimiento 5.3.1.3.4.1 (seguridad y límites de la protección)',
      'Protocolo de asistencia y derivación, 3.5, 6.1 (fase 1), 7.3 y 8',
      'Capítulo III (línea 911)',
      'Guion, escena E03 y panel de transferencia',
    ],
  },
  {
    id: 'no-hacer',
    title: 'Lo que no debes hacer',
    summary: 'Acciones no permitidas durante la activación de la ruta de protección, y qué hacer en su lugar.',
    sections: [
      {
        heading: 'Acciones no permitidas',
        table: {
          headers: ['No hacer', 'Por qué', 'Qué hacer en su lugar'],
          rows: [
            [
              'Interrogar o investigar por cuenta propia',
              'La investigación corresponde al SIMT o a las autoridades competentes; interrogar puede revictimizar.',
              'Escuchar lo esencial, registrar lo mínimo necesario y activar al PEP.',
            ],
            [
              'Prometer confidencialidad absoluta',
              'Existen obligaciones legales de denuncia y excepciones por riesgo grave.',
              'Explicar desde el inicio los límites de la confidencialidad.',
            ],
            [
              'Compartir información por WhatsApp personal u otros canales informales',
              'No garantiza la protección de datos ni la trazabilidad.',
              'Utilizar únicamente canales institucionales autorizados.',
            ],
            [
              'Derivar sin coordinación con el PEP o el SIMT',
              'Puede romper la ruta institucional, duplicar entrevistas y exponer a la persona.',
              'Activar primero al PEP y seguir la ruta establecida.',
            ],
            [
              'Actuar solo o sola ante un riesgo grave',
              'Puede comprometer tu seguridad y la de la persona sobreviviente.',
              'Activar de inmediato al PEP y seguir los protocolos de emergencia.',
            ],
            [
              'Solicitar pruebas (fotos, capturas, audios)',
              'Puede vulnerar derechos, contaminar evidencia y afectar procesos legales.',
              'Remitir a las autoridades competentes para su manejo técnico.',
            ],
            [
              'Juzgar o cuestionar la credibilidad',
              'Es revictimización y violencia institucional.',
              'Validar emociones y mantener una postura neutral y respetuosa.',
            ],
          ],
        },
      },
      {
        heading: 'Antes de cerrar la conversación, verifica',
        bullets: [
          'Escuchaste sin juzgar ni interrumpir.',
          'Validaste sus emociones («gracias por confiar»).',
          'Explicaste opciones claras y comprensibles.',
          'Verificaste su consentimiento para los apoyos, según su edad.',
          'Informarás al PEP por el canal institucional.',
          'No compartirás información por medios informales.',
          'No prometiste confidencialidad absoluta.',
          'Documentarás solo lo estrictamente necesario.',
        ],
      },
      {
        heading: 'Mensaje clave',
        paragraphs: [
          'Tu rol es escuchar, informar y activar apoyo, no investigar. La seguridad es prioridad. La coordinación con el PEP protege a la persona y a todas las personas involucradas.',
        ],
      },
    ],
    sources: ['Protocolo de asistencia y derivación, 8, 8.1 y 8.2'],
  },
  {
    id: 'reporte',
    title: 'Guía de reporte e información mínima',
    summary: 'Cuándo, por dónde y qué comunicar, sin investigar ni difundir.',
    sections: [
      {
        heading: 'Cuándo',
        paragraphs: [
          'Comunica la preocupación dentro de 24 horas desde que la conoces, con la información disponible. No necesitas pruebas, certeza ni una clasificación previa.',
        ],
      },
      {
        heading: 'Por dónde',
        paragraphs: [
          'Por los canales oficiales: el reporte llega al Punto Focal de Salvaguarda (PEP). En una organización socia, se activa por medio de su punto focal de salvaguarda, que informa al PEP de ChildFund. Si no es seguro o adecuado usar el canal habitual, existen otras vías institucionales, incluidas vías anónimas. Consulta el panel «Cómo comunicar una preocupación real».',
        ],
      },
      {
        heading: 'Qué incluir',
        bullets: [
          'Fecha, hora y lugar en que se recibió la preocupación.',
          'Naturaleza de lo comunicado: lo que la persona manifestó, sin conclusiones de culpabilidad ni juicios de valor.',
          'Acciones en curso para mantener a salvo a la persona.',
          'Ayuda o acciones necesarias.',
          'Lo que todavía se desconoce, sin llenarlo mediante investigación personal.',
        ],
      },
      {
        heading: 'Qué no incluir',
        bullets: [
          'Suposiciones, rumores u opiniones.',
          'Información personal innecesaria sobre la vida privada o la familia, o detalles que puedan revictimizar.',
        ],
      },
      {
        heading: 'Cómo compartir',
        paragraphs: [
          'Solo por la vía institucional restringida, con quienes necesitan conocerla para actuar. No uses correos personales, aplicaciones de mensajería no institucionales ni dispositivos no seguros. Se limita el acceso y se suprimen los datos identificativos al compartir.',
        ],
      },
    ],
    sources: [
      'Política 2.9 y 2.9.2.1; Procedimiento 5.2.1 y 5.2.2',
      'Procedimiento 5.2.4.3, 5.2.4.4 y 5.2.4.7 (plazo, contenido del reporte y acceso limitado)',
      'Protocolo de asistencia y derivación, 6 y 10.1–10.2',
      'Guion, escenas E04 a E06',
    ],
  },
  {
    id: 'ruta',
    title: 'Ruta de respuesta y derivación',
    summary: 'Qué ocurre después de comunicar una preocupación y dónde termina tu parte.',
    sections: [
      {
        heading: 'Tu parte',
        bullets: [
          'Escuchar, atender la seguridad inmediata dentro de tu función y comunicar la preocupación por un canal oficial.',
          'Tu participación en la ruta termina al comunicar: no clasificas, no investigas y no derivas por tu cuenta.',
        ],
      },
      {
        heading: 'Ruta gráfica de la Oficina de País (resumen)',
        bullets: [
          'Surge una preocupación o se presenta una denuncia.',
          'Recepción de la alerta por un canal seguro, el mecanismo comunitario de retroalimentación, el personal o un socio.',
          'Evaluación inicial y clasificación del riesgo por el Punto Focal de Salvaguarda (PEP).',
          'Si la preocupación no proviene del comportamiento del personal o de los socios ni de la forma en que la organización desarrolla su actividad, corresponde al nivel 1 (protección infantil): el socio local aborda el caso con un plan de respuesta, en consulta con la familia o tutor.',
          'Si proviene del personal, los socios o la forma de trabajar de la organización, se valora si la vida o la integridad física, psicológica, emocional o sexual de la persona está en riesgo: si no, nivel 2; si sí, nivel 3.',
          'En los niveles 2 y 3 se activa el Equipo de Gestión de Incidentes de Salvaguarda (SIMT), que elabora un plan de acción centrado en la persona sobreviviente. En el nivel 3 se aplican de inmediato medidas de protección organizacional.',
          'Seguimiento, derivación a instancias competentes cuando corresponde, y cierre del caso con reporte final.',
        ],
      },
      {
        heading: 'Las cinco fases de la asistencia y derivación',
        table: {
          headers: ['Fase', 'Qué ocurre', 'Quién'],
          rows: [
            ['1. Identificación y evaluación inicial', 'Recepción por canales oficiales, activación del PEP, evaluación de riesgo y medidas inmediatas de protección.', 'PEP'],
            ['2. Análisis de riesgo y opciones', 'Valoración técnica de necesidades y factores de riesgo. No es una investigación.', 'PEP, con el SIMT cuando corresponde'],
            ['3. Oferta de asistencia', 'Explicación clara de opciones, beneficios, implicaciones y qué información se compartiría. Consentimiento informado.', 'PEP'],
            ['4. Derivación', 'Activación coordinada de servicios públicos u organizaciones especializadas, solo si la persona lo acepta.', 'PEP'],
            ['5. Seguimiento y cierre', 'Seguimiento voluntario y acordado; documentación del cierre y archivo seguro.', 'PEP y SIMT'],
          ],
        },
      },
    ],
    sources: [
      'Ruta gráfica de respuesta y derivación (Oficina de País)',
      'Protocolo de asistencia y derivación, 6, 6.1 y 7.3',
      'Plan de Salvaguarda FY2026, sección 6',
    ],
  },
  {
    id: 'roles',
    title: 'Roles, niveles y plazos',
    summary: 'Definiciones, quién decide qué y la tarjeta de los tres niveles. No necesitas clasificar para reportar.',
    sections: [
      {
        heading: 'Definiciones',
        bullets: [
          'Explotación sexual: «cualquier abuso real o intento de abuso de una posición de vulnerabilidad, poder diferencial o confianza con fines sexuales» (Política 3.4.1). No es necesario que el hecho se haya consumado.',
          'Está prohibido el intercambio de dinero, empleo, bienes o servicios por sexo, incluido el intercambio de ayuda que se debe a los beneficiarios (Política, nota 1, principio 3).',
        ],
      },
      {
        heading: 'Quién hace qué',
        bullets: [
          'Tú: escuchar, atender riesgos dentro de tu función y comunicar la preocupación. Tu rol es escuchar, informar y activar apoyo, no investigar.',
          'Punto Focal de Protección y Salvaguarda (PEP): recibe los reportes, hace el triage, activa la ruta, coordina las derivaciones y da seguimiento. Lleva la secretaría del SIMT.',
          'PEP suplente: asegura la continuidad y reemplaza al PEP titular cuando es necesario.',
          'Equipo de Gestión de Incidentes de Salvaguarda (SIMT): gestiona, da seguimiento y cierra los casos con un enfoque interdisciplinario, bajo la conducción de la Dirección País. Las investigaciones las realizan profesionales experimentados y cualificados.',
          'Punto focal de salvaguarda de cada organización socia: primer nivel de detección y canalización; reporta los incidentes al PEP.',
        ],
      },
      {
        heading: 'Tarjeta de los tres niveles',
        paragraphs: [
          'Es un recurso de consulta. No es una decisión que debas acertar antes de comunicar: el referente determina la clasificación aplicable.',
        ],
        bullets: [
          'Nivel 1: incidentes de protección infantil no cometidos por personal o representantes de ChildFund, sino por miembros de la comunidad o agencias externas no afiliadas. Puede incluir daño físico, emocional, sexual o psicológico grave, lesiones o la muerte. Este nivel no significa daño leve. La responsabilidad de la gestión recae en el socio local, que notifica y coordina con el Punto Focal de ChildFund.',
          'Nivel 2: violaciones o incumplimientos de la política, el procedimiento, el protocolo de comportamiento o el código de conducta por parte de personal o representantes, que colocan a participantes en riesgo directo de daño o abuso, cuando se cree que no se ha producido un daño real. La valoración y gestión corresponden a los responsables establecidos.',
          'Nivel 3: violaciones graves, reales o sospechadas, cometidas por personal o representantes que provocan daño, incluida cualquier forma de violencia, explotación, abuso o negligencia; también la muerte o lesión grave de un participante bajo el cuidado temporal de ChildFund o en una actividad organizada o facilitada por ChildFund.',
          'El caso de este episodio —una preocupación sobre una persona vinculada al programa respecto de una participante adulta— no es de nivel 1. No te corresponde decidir entre nivel 2 o 3.',
        ],
      },
      {
        heading: 'Plazos que no deben confundirse',
        paragraphs: ['Ninguno de estos plazos autoriza a demorar la seguridad, la atención ni la comunicación inicial.'],
        table: {
          headers: ['Quién', 'Qué', 'Plazo'],
          rows: [
            ['Personal o representante que conoce la preocupación', 'Comunicarla por el mecanismo institucional', '24 horas'],
            [
              'Gerente de ChildFund que recibe una preocupación',
              'Contactar con Cumplimiento Global (no traslada tu propio deber de comunicar en 24 horas)',
              '5 días laborables',
            ],
            ['Roles competentes, nivel 3', 'Notificación según el escalamiento', '24 horas'],
            ['Roles competentes, nivel 2', 'Notificación a ChildFund según el escalamiento', '48 horas'],
            [
              'Socio local, nivel 1',
              'Notificar al Punto Focal de ChildFund casos de daño grave que amenacen la seguridad y el bienestar del niño o joven',
              '72 horas',
            ],
          ],
        },
      },
    ],
    sources: [
      'Política 2.9, 2.9.1, 2.13.1 y 3.4.1; nota 1 de la política',
      'Procedimiento 5.2.1 y 5.2.3 (definiciones y escalamiento por niveles)',
      'Plan de Salvaguarda FY2026, sección 6 y anexo 4',
      'Protocolo de asistencia y derivación, 8.2',
      'Guion, apartado 20',
    ],
  },
  {
    id: 'apoyos',
    title: 'Opciones de apoyo',
    summary: 'Categorías de apoyo según necesidades, con consentimiento y sin condiciones indebidas.',
    sections: [
      {
        heading: 'Posibles apoyos según necesidades y ruta',
        bullets: [
          'Seguridad.',
          'Atención médica.',
          'Apoyo psicosocial.',
          'Orientación o asistencia jurídica.',
          'Asistencia material básica.',
        ],
        paragraphs: [
          'La elección de servicios y la información a compartir se tratan con consentimiento cuando corresponde y explicando las obligaciones aplicables. No todos los casos requieren todos los servicios.',
        ],
      },
      {
        heading: 'Consentimiento informado de una persona adulta',
        bullets: [
          'Lo otorga directamente la persona, sin intermediación de terceros.',
          'Antes, recibe información clara sobre las opciones disponibles —incluida la de no acceder a ningún servicio por ahora—, sus riesgos y beneficios, las implicaciones legales y qué información se compartiría y con quién.',
          'Puede aceptar, rechazar o suspender la asistencia o la derivación, y retirar su consentimiento en cualquier momento, sin perder el acceso a los programas ni sufrir represalias.',
          'Es un proceso continuo: se reconfirma si cambian las condiciones, las opciones o los riesgos.',
        ],
      },
      {
        heading: 'Sin condiciones indebidas',
        bullets: [
          'El apoyo no se condiciona a pruebas, a participar en una investigación ni a una denuncia penal.',
          'Si lo ocurrido pudiera constituir un delito, los roles competentes exploran con la persona si desea apoyo para denunciarlo ante las autoridades. En el caso de un niño, niña o adolescente, la denuncia es obligatoria.',
          'Pueden existir obligaciones legales de denuncia también en casos de personas adultas: el Protocolo cita el COIP (art. 276) para delitos contra las mujeres conocidos en razón de la profesión en ámbitos como educación, salud, recreación o cultura. No te corresponde decidirlo: los roles competentes las valoran y las explican a la persona.',
          'La confidencialidad solo cede ante un riesgo grave e inminente o un mandato legal de denuncia, y esas excepciones se explican a la persona.',
        ],
      },
      {
        heading: 'Información general sobre atención médica',
        paragraphs: [
          'En casos de abuso sexual, es importante buscar atención médica cuanto antes; algunos tratamientos, como la profilaxis posexposición al VIH y la anticoncepción de emergencia, deben iniciarse dentro de las 72 horas. Este dato no describe el caso de Mariela, en el que no se comunicó contacto físico, y no es un plazo de reporte.',
        ],
      },
      {
        heading: 'Servicios de protección que pueden comunicarse a la persona',
        paragraphs: [avisoServicios],
        bullets: serviciosPublicos.filter((s) => s.estado === 'verificado').map(lineaServicio),
      },
      {
        heading: 'Ruta orientativa para la persona',
        bullets: [
          '¿Está en peligro inmediato? Llamar al 911.',
          '¿Es violencia de género y el hecho ocurrió hace menos de 48 horas? Unidades de Flagrancia.',
          '¿El hecho ocurrió hace más de 48 horas? Fiscalía, juzgado o Junta de Protección más cercana; también se puede denunciar en línea.',
          '¿Busca orientación o información sobre servicios de atención? Servicios de Protección Integral y Centros Violeta.',
        ],
      },
      {
        heading: 'Directorio interno',
        paragraphs: [
          'La oficina de país mantiene además un mapeo detallado de servicios de uso interno, revisado al menos cada seis meses. Se consulta a través del PEP y no se publica aquí.',
        ],
      },
    ],
    sources: [
      'Política 2.10.3, 2.10.4 y 2.10.5',
      'Procedimiento 5.3.1.3.1 a 5.3.1.3.5',
      'Protocolo de asistencia y derivación, 3.3, 4.1–4.3, 5.1.2, 5.3, 7.3 y 9',
      'Capítulo III: vías de denuncia y servicios de protección en Ecuador',
      'PPT, diapositivas 32, 55 y 66–67',
      'Guion, escena E07 y panel de apoyos',
    ],
  },
];

export function herramienta(id: ToolId): Tool {
  const t = herramientas.find((h) => h.id === id);
  if (!t) throw new Error(`Herramienta desconocida: ${id}`);
  return t;
}

/** Texto del panel de apoyos de E07 (guion v1.2, apartado 12). */
export const panelApoyos = {
  intro:
    'Posibles apoyos según necesidades y ruta: seguridad, atención médica, apoyo psicosocial, orientación jurídica o asistencia material. La elección de servicios y la información a compartir se tratan con consentimiento cuando corresponde y explicando las obligaciones aplicables. No todos los casos requieren todos los servicios.',
  denuncia:
    'Si lo ocurrido pudiera constituir un delito, los roles competentes exploran contigo si deseas apoyo para denunciarlo ante las autoridades. Como persona adulta, decides sobre tu atención: puedes aceptar, rechazar o suspender los apoyos, y el apoyo no depende de que denuncies. Si existiera una obligación legal de denuncia, los roles competentes te lo explicarán.',
  medica:
    'En casos de abuso sexual, es importante buscar atención médica cuanto antes; algunos tratamientos, como la profilaxis posexposición al VIH y la anticoncepción de emergencia, deben iniciarse dentro de las 72 horas.',
  medicaAclaracion:
    'Este dato no describe el caso de Mariela, en el que no se comunicó contacto físico, y no es un plazo de reporte.',
};

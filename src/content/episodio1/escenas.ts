// Episodio 1 — «Una ayuda con condiciones». Guion versión de diseño 1.1.
// Los diálogos marcados literal: true se copian sin parafrasear del guion.
// Los textos con literal: false convierten indicaciones de pantalla en narración
// y están registrados en docs/cambios-editoriales.md.

import type { Episode, Line, Scene, SceneId, Speaker } from '../types';

let seq = 0;
const l = (speaker: Speaker, text: Line['text'], literal = true): Line => ({
  id: `L${++seq}`,
  speaker,
  text,
  literal,
});

const D2_B_TEXT =
  'Compartiré la preocupación por el mecanismo institucional, con acceso limitado a quienes deban atenderla. Te explicaré el proceso y quiero conocer tus preocupaciones para reducir riesgos. No tienes que aceptar encuentros íntimos para acceder a una ayuda.';

const D3_A_TEXT =
  '¿Te sientes segura ahora? ¿Hay algo que necesites para salir de aquí con tranquilidad? ¿De qué manera sería seguro contactarte, si necesitas seguimiento?';

const D3_A_RESPUESTA =
  'Estoy segura aquí. Mi hermana está afuera. Prefiero salir con ella. Pueden llamarme mañana entre diez y once; no envíen mensajes sobre esto.';

const NO_REVICTIMIZACION =
  'Según las fuentes, una respuesta que no revictimiza evita la repetición innecesaria del relato, no culpabiliza y no presiona decisiones (PPT, diapositivas 26–28 y 33).';

const E01: Scene = {
  id: 'E01',
  title: 'Al terminar la jornada',
  background: 'centro',
  backgroundAlt: 'Centro comunitario ilustrado al final de una reunión informativa. Algunas personas adultas se retiran.',
  characters: ['mariela'],
  intro: [
    l('narracion', 'La jornada termina. Mariela espera a que el grupo se retire y se acerca a ti.'),
    l(
      'mariela',
      '¿Podemos hablar? Una persona que trabaja con el programa dijo que puede ayudarme a entrar si acepto salir con ella. Insinuó que esperaba algo íntimo. Me preocupa perder la ayuda.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'D1',
    prompt: '¿Cómo respondes primero?',
    options: [
      {
        id: 'D1-A',
        guionLetter: 'A',
        label:
          'Gracias por contármelo. Busquemos un lugar donde te resulte seguro hablar, sin que otras personas escuchen. No necesitas darme detalles íntimos.',
        consequence: [
          l('narracion', 'Mariela acepta hablar en un espacio accesible y discreto.', false),
          l('mariela', 'Prefiero quedarme cerca de la salida.'),
          l('narracion', 'Tú respetas esa preferencia.', false),
        ],
        feedback:
          'Ofreces privacidad y elección. No necesitas aislarla ni pedir información íntima para escuchar una preocupación.',
        outcome: { type: 'avanza', next: 'E02' },
      },
      {
        id: 'D1-B',
        guionLetter: 'B',
        label: '¿Estás segura? Quizá entendiste mal una invitación.',
        consequence: [l('mariela', 'No sé… mejor dejémoslo.')],
        feedback: 'Cuestionar de entrada puede desalentar la comunicación. Escuchar no implica determinar culpabilidad.',
        sourceNote: NO_REVICTIMIZACION,
        outcome: {
          type: 'repara_y_avanza',
          next: 'E02',
          repair: [
            l('tu', 'Lo que dijiste merece atención. Gracias por acercarte. Puedes contarme solo lo que necesites.'),
          ],
          repairFollowUp: [l('narracion', 'Mariela decide continuar.', false)],
        },
      },
      {
        id: 'D1-C',
        guionLetter: 'C',
        label: 'Cuéntamelo aquí, antes de que se vaya el equipo.',
        consequence: [l('narracion', 'Mariela mira a las personas cercanas y baja la voz.', false)],
        feedback: 'La conversación puede ser escuchada. Ofrece un espacio seguro y pregunta dónde prefiere hablar.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'E02',
          repair: [l('tu', 'Podemos movernos a un lugar más discreto si te parece.')],
        },
      },
      {
        id: 'D1-D',
        guionLetter: 'D',
        label: 'Voy a llamar a esa persona para aclararlo contigo.',
        consequence: [
          l('narracion', 'Antes de realizar la llamada, el ejercicio se detiene. La llamada no se realiza.', false),
        ],
        feedback:
          'Confrontar puede exponer a Mariela, aumentar el riesgo de represalias e interferir con el procedimiento.',
        outcome: {
          type: 'pausa_y_vuelve',
          pauseNote: 'Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.',
        },
      },
    ],
  },
};

const E02: Scene = {
  id: 'E02',
  title: 'Lo que sí puedes prometer',
  background: 'conversacion',
  backgroundAlt: 'Espacio discreto de conversación junto a la salida del centro comunitario.',
  characters: ['mariela'],
  intro: [l('mariela', 'Por favor, que nadie se entere. Si cuento esto, quizás dejen de ayudarme.')],
  designNote:
    'Nunca prometer que Mariela obtendrá una plaza. El acceso depende de criterios del programa; rechazar una conducta sexual o comunicar una preocupación no debe utilizarse para perjudicarla.',
  decision: {
    kind: 'choice',
    id: 'D2',
    prompt: '¿Qué puedes decirle?',
    options: [
      {
        id: 'D2-A',
        guionLetter: 'A',
        label: 'Te prometo que no se lo diré a nadie.',
        consequence: [],
        feedback:
          'Una promesa de secreto absoluto es incompatible con el deber de reporte. Explica los límites antes de continuar.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'E03',
          repair: [
            l(
              'tu',
              'Debo corregir lo que dije: no puedo prometer secreto absoluto. Sí puedo explicarte qué información necesito comunicar y cómo se restringe su acceso.',
            ),
          ],
        },
      },
      {
        id: 'D2-B',
        guionLetter: 'B',
        label: D2_B_TEXT,
        consequence: [l('mariela', 'Quiero saber quién me contactaría y cómo.')],
        feedback:
          'Explicas una obligación sin quitarle voz. No prometes que nadie inferirá su identidad ni garantizas un resultado que no controlas.',
        outcome: { type: 'avanza', next: 'E03' },
      },
      {
        id: 'D2-C',
        guionLetter: 'C',
        label: 'Solo informaré si tú autorizas; de lo contrario no haré nada.',
        consequence: [],
        feedback:
          'El deber institucional de reportar no debe confundirse con el consentimiento para servicios de apoyo. Escucha sus preferencias y explica las obligaciones.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'E03',
          repair: [l('tu', D2_B_TEXT)],
        },
      },
    ],
  },
};

const E03: Scene = {
  id: 'E03',
  title: 'Seguridad y necesidades inmediatas',
  background: 'conversacion',
  backgroundAlt: 'Espacio discreto de conversación. Mariela y la persona jugadora conversan sentadas.',
  characters: ['mariela'],
  intro: [
    l(
      'narracion',
      'Sabes que Mariela teme consecuencias sobre la ayuda. Aún no conoces si necesita una medida inmediata.',
    ),
  ],
  panel: 'transferencia',
  decision: {
    kind: 'choice',
    id: 'D3',
    prompt: '¿Qué preguntas ahora?',
    options: [
      {
        id: 'D3-A',
        guionLetter: 'A',
        label: D3_A_TEXT,
        consequence: [l('mariela', D3_A_RESPUESTA)],
        feedback:
          'Preguntas por seguridad y contacto, sin interrogar sobre el hecho. Una preferencia de contacto se registra con acceso restringido.',
        outcome: { type: 'avanza', next: 'E04' },
      },
      {
        id: 'D3-B',
        guionLetter: 'B',
        label: 'Dime exactamente qué te pidió, cuántas veces y todo lo que ocurrió.',
        consequence: [],
        feedback:
          'No necesitas reconstruir los hechos ni obtener detalles íntimos. Formula preguntas mínimas para identificar necesidades y activar la respuesta.',
        sourceNote: NO_REVICTIMIZACION,
        outcome: {
          type: 'pausa_y_vuelve',
          pauseNote: 'Pausa pedagógica: no se formula esta pregunta. Vuelve a la decisión.',
        },
      },
      {
        id: 'D3-C',
        guionLetter: 'C',
        label: 'Vete a casa y espera a que te llamemos.',
        consequence: [],
        feedback: 'Dar una instrucción sin preguntar por seguridad puede dejar una necesidad sin atender.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D3-D',
        guionLetter: 'D',
        label: '¿Qué te ayudaría ahora?',
        consequence: [l('mariela', 'Salir con mi hermana.')],
        feedback:
          'Es una pregunta útil. Complétala comprobando si existe riesgo inmediato y acordando un contacto seguro.',
        outcome: {
          type: 'complementa_y_avanza',
          next: 'E04',
          complementOptionId: 'D3-A',
          complement: [l('tu', D3_A_TEXT), l('mariela', D3_A_RESPUESTA)],
        },
      },
    ],
  },
};

const E04: Scene = {
  id: 'E04',
  title: 'Una presión del equipo',
  background: 'oficina',
  backgroundAlt: 'Oficina de coordinación con una mesa y dos sillas. No hay documentos identificables.',
  characters: ['elena'],
  intro: [
    l(
      'narracion',
      'Mariela se retira acompañada, como prefirió. Más tarde, Elena conversa contigo en un espacio privado. No compartes con ella información que identifique a Mariela.',
      false,
    ),
    l(
      'elena',
      'Si es una preocupación sobre el equipo, tal vez convenga tener pruebas antes de reportar. Es un programa importante para la comunidad.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'D4',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'D4-A',
        guionLetter: 'A',
        label: 'Pediré a Mariela que consiga más mensajes antes de reportar.',
        consequence: [],
        feedback:
          'No le corresponde exponerse ni reunir pruebas. El reporte de una preocupación no exige demostrar lo ocurrido.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D4-B',
        guionLetter: 'B',
        label: 'Esperaré a la siguiente reunión para comentarlo con todo el equipo.',
        consequence: [],
        feedback: 'Retrasa la comunicación y amplía innecesariamente el acceso a información sensible.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D4-C',
        guionLetter: 'C',
        label:
          'Comunicaré oportunamente la preocupación por el mecanismo establecido, con la información disponible. No nos corresponde investigar ni difundirla.',
        consequence: [
          l('elena', 'Entiendo. Podemos revisar cómo asegurar que las personas conozcan sus derechos y los canales.'),
        ],
        feedback: 'El deber de cuidado se mantiene aunque existan presiones operativas o reputacionales.',
        outcome: { type: 'avanza', next: 'E05' },
      },
    ],
  },
};

const E05: Scene = {
  id: 'E05',
  title: 'Elegir el mecanismo',
  background: 'oficina',
  backgroundAlt: 'Oficina de coordinación. La persona jugadora revisa en silencio las vías institucionales.',
  characters: [],
  intro: [],
  decision: {
    kind: 'choice',
    id: 'D5',
    prompt: 'Selecciona la acción que corresponde a tu rol.',
    options: [
      {
        id: 'D5-A',
        guionLetter: 'A',
        label: {
          cf: 'Reporto al Punto Focal mediante el mecanismo institucional. Si existe conflicto de interés o no es seguro usar ese canal, utilizo una alternativa institucional disponible.',
          socio:
            'Activo el mecanismo de mi organización y su articulación con ChildFund según la ruta aplicable, sin retrasar la comunicación por falta de una autorización interna. Si existe conflicto de interés, utilizo el canal alternativo disponible.',
        },
        consequence: [],
        feedback: 'La ruta ordena responsabilidades; no debe convertirse en una barrera para reportar.',
        outcome: { type: 'avanza', next: 'E05B' },
      },
      {
        id: 'D5-B',
        guionLetter: 'B',
        label: 'Lo comento únicamente al colega con más experiencia y espero su decisión.',
        consequence: [],
        feedback: 'Consultar puede ayudar, pero no sustituye activar el mecanismo ni justifica demorar.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D5-C',
        guionLetter: 'C',
        label: 'Lo publico en el grupo del programa para alertar a todos.',
        consequence: [],
        feedback:
          'Una comunicación grupal expone información y puede provocar represalias. Usa el mecanismo con acceso restringido.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D5-D',
        guionLetter: 'D',
        label: 'Determino primero si es nivel 1, 2 o 3 y luego decido si reportar.',
        consequence: [],
        feedback:
          'La incertidumbre sobre el nivel no suspende tu responsabilidad. Comunica los hechos disponibles; los roles competentes valoran clasificación y escalamiento.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const E05B: Scene = {
  id: 'E05B',
  title: 'Canal alternativo',
  background: 'oficina',
  backgroundAlt: 'Oficina de coordinación. Un rótulo indica que se trata de una variación ficticia.',
  characters: [],
  variationLabel: 'Variación ficticia',
  intro: [
    l(
      'narracion',
      'Variación ficticia: adviertes que la persona que recibiría habitualmente la preocupación podría tener un conflicto de interés.',
    ),
  ],
  panel: 'canales',
  decision: {
    kind: 'choice',
    id: 'D6',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'D6-A',
        guionLetter: 'A',
        label: 'Uso una alternativa institucional habilitada y explico el conflicto de interés con información mínima.',
        consequence: [],
        feedback: 'Permite comunicar sin depender exclusivamente de una persona comprometida en la situación.',
        outcome: { type: 'avanza', next: 'E06' },
      },
      {
        id: 'D6-B',
        guionLetter: 'B',
        label: 'Informo únicamente a esa persona porque es la jerarquía habitual.',
        consequence: [],
        feedback: 'El mecanismo debe ofrecer alternativas seguras. Un conflicto de interés requiere otra vía.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D6-C',
        guionLetter: 'C',
        label: 'Espero a que el conflicto desaparezca.',
        consequence: [],
        feedback: 'La espera puede dejar la preocupación sin respuesta.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
  outro: [l('narracion', 'Termina la variación ficticia. Vuelves al caso de Mariela.', false)],
};

const E06: Scene = {
  id: 'E06',
  title: 'Información mínima',
  background: 'oficina',
  backgroundAlt: 'Oficina de coordinación con un formulario ficticio rotulado como simulación.',
  characters: [],
  intro: [],
  decision: {
    kind: 'cards',
    id: 'D7',
    prompt: 'Selecciona qué tarjetas incluirías en la comunicación. Puedes marcar varias.',
    simulationLabel: 'SIMULACIÓN. Este ejercicio no envía reportes',
    cards: [
      {
        id: 'D7-T1',
        number: 1,
        include: true,
        text: 'Una participante adulta manifestó que una persona vinculada al programa insinuó una condición íntima para facilitar el acceso a una ayuda.',
        explanation: 'Es el contenido comunicado; no una conclusión de culpabilidad.',
      },
      {
        id: 'D7-T2',
        number: 2,
        include: true,
        text: 'La conversación se recibió al finalizar la jornada ficticia. Se conoce el contexto del programa. La identidad de la persona señalada todavía no ha sido comunicada.',
        explanation: 'Distingue lo conocido de lo desconocido. No se pide investigar para completar vacíos.',
      },
      {
        id: 'D7-T3',
        number: 3,
        include: true,
        text: 'No expresó peligro inmediato en ese momento. Prefirió salir con su hermana y solicitó una llamada en un horario concreto, sin mensajes relativos a la preocupación.',
        explanation: 'Solo se comparte por la vía restringida con quienes necesitan actuar.',
      },
      {
        id: 'D7-T4',
        number: 4,
        include: false,
        text: 'Seguro esa persona ya ha hecho esto muchas veces.',
        explanation: 'Es una suposición.',
      },
      {
        id: 'D7-T5',
        number: 5,
        include: false,
        text: 'Fotografías de la familia y comentarios de otras personas sobre su vida privada.',
        explanation: 'No son necesarios para este reporte.',
      },
    ],
    messages: {
      missing: 'Incluye los hechos y necesidades que ya conoces.',
      extra: 'Elimina suposiciones e información personal innecesaria.',
    },
    successText:
      'Este es un reporte de una preocupación comunicada. No se determina si ocurrió una infracción. Se informa lo conocido y se identifican los vacíos sin llenarlos mediante investigación personal.',
    next: 'E07',
  },
};

const E07: Scene = {
  id: 'E07',
  title: 'Reporte y apoyo',
  background: 'oficina',
  backgroundAlt: 'Oficina de coordinación. El Referente conversa con la persona jugadora.',
  characters: ['referente', 'mariela'],
  intro: [
    l(
      'referente',
      'He recibido la preocupación por el mecanismo correspondiente. Corresponde valorar riesgos, activar la ruta y coordinar los apoyos pertinentes. Evita nuevos contactos para recabar información por tu cuenta.',
    ),
    l(
      'narracion',
      'Más adelante, el rol competente conversa con Mariela mediante el contacto acordado. Tú no conduces esa conversación.',
      false,
    ),
    l(
      'mariela',
      'Quiero conocer las opciones de apoyo, pero no quiero que me obliguen a hablar con la persona señalada.',
    ),
  ],
  panel: 'apoyos',
  decision: {
    kind: 'choice',
    id: 'D8',
    prompt: '¿Qué orientación corresponde?',
    complementaryNote:
      'El apoyo no se condiciona a una denuncia penal. Cuando corresponda, la persona adulta decide si desea denunciar ante las autoridades.',
    options: [
      {
        id: 'D8-A',
        guionLetter: 'A',
        label: 'Para recibir apoyo debes presentar primero una denuncia y demostrar lo ocurrido.',
        consequence: [],
        feedback:
          'El apoyo no debe condicionarse a pruebas ni a una investigación. Las obligaciones legales se explican por los roles competentes.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D8-B',
        guionLetter: 'B',
        label:
          'Se te explicarán las opciones de apoyo, cómo se maneja la información y cualquier obligación aplicable. Tus necesidades y preferencias deben orientar la atención. No te corresponde confrontar a esa persona.',
        consequence: [],
        feedback:
          'Distingues reporte institucional, asistencia y actuaciones especializadas. No impones una derivación ni prometes resultados.',
        outcome: { type: 'avanza', next: 'E08' },
      },
      {
        id: 'D8-C',
        guionLetter: 'C',
        label: 'Ya reportamos; no hay nada más que hacer.',
        consequence: [],
        feedback:
          'El reporte abre una respuesta. La seguridad, el apoyo y la prevención de represalias requieren seguimiento por los responsables.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const E08: Scene = {
  id: 'E08',
  title: 'Lo que puedes hacer después',
  background: 'centro',
  backgroundAlt: 'Centro comunitario preparado para una nueva actividad. Elena ordena materiales informativos.',
  characters: ['elena'],
  intro: [l('elena', '¿Qué hacemos para que las personas conozcan mejor sus derechos?')],
  decision: {
    kind: 'choice',
    id: 'D9',
    prompt: 'Selecciona la medida preventiva adecuada.',
    options: [
      {
        id: 'D9-A',
        guionLetter: 'A',
        label:
          'Compartimos criterios de acceso y canales de reporte con todas las personas participantes, revisamos medidas de supervisión y mantenemos restringida la información del caso.',
        consequence: [],
        feedback:
          'Puedes mejorar prácticas sin exponer a Mariela. El equipo responsable gestiona medidas sobre personas señaladas, seguimiento y posibles represalias.',
        outcome: { type: 'avanza', next: 'CIERRE' },
      },
      {
        id: 'D9-B',
        guionLetter: 'B',
        label: 'Excluimos a Mariela temporalmente para evitar tensiones.',
        consequence: [],
        feedback:
          'Desplaza las consecuencias hacia quien comunica la preocupación. Las medidas de protección se valoran con los responsables y considerando su voz.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'D9-C',
        guionLetter: 'C',
        label: 'Contamos su historia sin nombre en la siguiente reunión.',
        consequence: [],
        feedback:
          'En un grupo pequeño puede reconocerse a alguien aunque no se diga su nombre. Utiliza ejemplos ficticios para la formación.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const scenes: Record<SceneId, Scene> = { E01, E02, E03, E04, E05, E05B, E06, E07, E08 };

export const episodio1: Episode = {
  id: 'ep1-una-ayuda-con-condiciones',
  number: 1,
  title: 'Una ayuda con condiciones',
  version: '1.1',
  start: 'E01',
  scenes,
  order: ['E01', 'E02', 'E03', 'E04', 'E05', 'E05B', 'E06', 'E07', 'E08'],
  closing: {
    lines: [
      l('mariela', 'Gracias por explicarme qué iba a pasar y preguntarme cómo podían contactarme.'),
      l(
        'narracion',
        'La preocupación ha sido comunicada. Los roles responsables valoran la clasificación y el escalamiento, coordinan apoyos y gestionan el seguimiento. El desenlace de una investigación no forma parte de tu misión en este episodio.',
      ),
    ],
    contribution:
      'Tu contribución fue escuchar, cuidar la información, reconocer necesidades y activar una respuesta. Las decisiones sobre el programa deben mantenerse libres de condiciones sexuales y de represalias.',
    reflection: [
      '¿Reconozco una presión que podría llevarme a demorar un reporte?',
      '¿Sé qué alternativa usar si el canal habitual tiene un conflicto de interés?',
      '¿Puedo explicar los límites de confidencialidad con respeto?',
    ],
  },
  badges: [
    {
      id: 'escucha-respetuosa',
      name: 'Escucha respetuosa',
      description: 'Completaste D1 y D2 llegando a la respuesta adecuada o a su reparación.',
      decisions: ['D1', 'D2'],
    },
    {
      id: 'reporte-responsable',
      name: 'Reporte responsable',
      description: 'Completaste D4 a D7 llegando a la respuesta adecuada o a su reparación.',
      decisions: ['D4', 'D5', 'D6', 'D7'],
    },
    {
      id: 'respuesta-centrada',
      name: 'Respuesta centrada en la persona',
      description: 'Completaste D3, D8 y D9 llegando a la respuesta adecuada o a su complemento.',
      decisions: ['D3', 'D8', 'D9'],
    },
  ],
};

/** Textos de la portada, aviso y rol (guion, apartados 3 y 4). */
export const portada = {
  lead: 'Una conversación puede abrir una oportunidad para proteger. Practica cómo responder desde tu rol cuando una persona comunica una preocupación.',
  aviso:
    'Este episodio aborda una posible explotación sexual y abuso de poder, sin contenido explícito. Puedes pausar, salir o utilizar la versión de lectura equivalente. Trabajaremos únicamente con situaciones ficticias. No ingreses datos ni relatos reales.',
  rolPregunta: '¿Desde qué rol practicarás?',
  roles: {
    cf: 'Personal técnico de ChildFund Ecuador',
    socio: 'Personal técnico de una organización socia',
  },
  rolMensaje:
    'Tu responsabilidad es escuchar, atender riesgos dentro de tu función y comunicar la preocupación. La clasificación, investigación y gestión especializada corresponden a los roles designados.',
};

/** Texto del panel de transferencia de E03 (guion, apartado 7). */
export const panelTransferencia =
  'Si hubiera peligro inmediato o necesidad urgente de atención, activa la respuesta de emergencia y los servicios competentes según la ruta local, dentro de tu función. La seguridad y atención no esperan una clasificación ni la conclusión de una investigación.';

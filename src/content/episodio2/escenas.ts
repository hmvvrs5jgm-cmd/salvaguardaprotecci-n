// Módulo 2 — «Gracias por escucharme». Guion versión 1.0 para revisión institucional.
// Los diálogos marcados literal: true se copian sin parafrasear del guion.
// Los textos con literal: false convierten indicaciones de pantalla en narración
// y están registrados en docs/cambios-editoriales.md.
// Todos los IDs llevan el prefijo M2_ para no colisionar con el módulo 1.

import type { Episode, Line, Pose, Scene, SceneId, Speaker } from '../types';
import { configEvaluacion, notaUmbral, preguntas, textosResultado } from './evaluacion';

let seq = 0;
const l = (speaker: Speaker, text: Line['text'], literal = true, pose?: Pose): Line => ({
  id: `M2_L${++seq}`,
  speaker,
  text,
  literal,
  ...(pose ? { pose } : {}),
});

const PAUSA = 'Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.';
const SE_DETIENE = () => l('narracion', 'El ejercicio se detiene antes de ejecutar esta acción.', false);

const D03_B_TEXT =
  'Voy a cuidar lo que me cuentas. Necesito comunicar esta preocupación a quienes deben ayudar a protegerte, y no a todo el equipo. Te explicaré los pasos. Lo que dices sobre tu casa es importante para decidir cómo actuar con seguridad.';

const D05_B_TEXT =
  'Comunico al Referente su preferencia y su temor. Le explicamos que se valorará cómo y cuándo contactar, qué información sería necesaria y qué medidas corresponden.';
const D05_B_REFERENTE =
  'Tu opinión importa. Antes de hacer un contacto, revisaremos contigo cómo evitar que aumente el riesgo. También coordinaremos las medidas que correspondan con las instancias competentes.';

const D07_B_TEXT =
  'Apoyo que el Referente explique las opciones en lenguaje claro, confirme qué entendió y valore el consentimiento/asentimiento y la intervención de representantes conforme a su edad, riesgos y requisitos del servicio.';
const D07_B_REFERENTE =
  'Compartiremos solo lo necesario con quienes deban atenderte. Coordinaremos para evitar repeticiones innecesarias. No puedo asegurar que nunca te hagan una pregunta, pero deben explicarte para qué la necesitan.';

const D09_B_TEXT =
  'Transmito al Referente la restricción de contacto y apoyo el acuerdo de un medio, momento y responsable seguros. No dejo mensajes, avisos o notificaciones con detalles.';

const M2_E01: Scene = {
  id: 'M2_E01',
  title: '¿Podemos hablar?',
  setting: 'Centro comunitario ficticio al terminar un taller sobre participación comunitaria.',
  characters: ['lucia', 'elena'],
  intro: [
    l('narracion', 'El taller termina. Mientras Elena organiza los materiales, Lucía se acerca a ti.'),
    l('lucia', '¿Podemos hablar sin que todos escuchen? No quiero irme todavía.', true, 'pensativa'),
  ],
  decision: {
    kind: 'choice',
    id: 'M2_D01',
    prompt: '¿Cómo abres el espacio?',
    options: [
      {
        id: 'M2_D01-A',
        guionLetter: 'A',
        label:
          'Sí. Podemos hablar en ese lugar más discreto, manteniendo las condiciones de seguridad del centro. ¿Te resulta cómodo?',
        consequence: [l('lucia', 'Sí, prefiero que no nos escuchen.')],
        feedback: 'Ofreces privacidad sin crear aislamiento ni contacto fuera de las medidas de salvaguarda.',
        outcome: { type: 'avanza', next: 'M2_E02' },
      },
      {
        id: 'M2_D01-B',
        guionLetter: 'B',
        label: 'Si es importante, dilo aquí para que Elena también lo escuche.',
        consequence: [l('narracion', 'Lucía mira al grupo y calla.', false)],
        feedback:
          'La exposición puede dificultar que hable. Tener colegas cerca no significa que todos necesiten conocer su preocupación.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E02',
          repair: [l('tu', 'Podemos buscar un espacio más discreto. No necesitas hablar frente al grupo.')],
        },
      },
      {
        id: 'M2_D01-C',
        guionLetter: 'C',
        label: 'Salgamos solos en mi vehículo para conversar.',
        consequence: [SE_DETIENE()],
        feedback:
          'No improvises un traslado ni un espacio aislado. Aplica las condiciones institucionales de supervisión y contacto.',
        sourceNote:
          'Las medidas de salvaguarda evitan que una persona adulta quede a solas con una niña, niño o adolescente en un espacio aislado o en un vehículo (regla de dos adultos; PPT, diapositiva 50).',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D01-D',
        guionLetter: 'D',
        label: 'Puedo escucharte. Si lo prefieres, puedo facilitar que hablemos con el referente de salvaguarda.',
        consequence: [
          l('lucia', 'Primero quisiera hablar contigo.'),
          l('tu', 'Está bien. Busquemos un lugar seguro y discreto.'),
        ],
        feedback: 'Ofreces una alternativa sin obligarla a repetir ni enviarla de una persona a otra.',
        outcome: { type: 'avanza', next: 'M2_E02' },
      },
    ],
  },
};

const M2_E02: Scene = {
  id: 'M2_E02',
  title: 'No quiero que me culpen',
  setting: 'Espacio discreto de escucha que mantiene las condiciones de supervisión del centro.',
  characters: ['lucia'],
  intro: [
    l(
      'lucia',
      'En mi casa una persona adulta me golpea cuando se enoja. Me dijo que si cuento algo será peor. No quiero que piensen que yo provoqué esto.',
      true,
      'pensativa',
    ),
  ],
  designNote:
    'No pedir que exhiba lesiones, no tomar fotografías y no solicitar demostraciones. No se necesita esa comprobación para comunicar la preocupación.',
  decision: {
    kind: 'choice',
    id: 'M2_D02',
    prompt: '¿Qué respondes?',
    options: [
      {
        id: 'M2_D02-A',
        guionLetter: 'A',
        label:
          'Gracias por contármelo. No es tu culpa. Lo que dices merece atención. No necesitas darme detalles que no quieras contar.',
        consequence: [l('lucia', 'Tenía miedo de decirlo.')],
        feedback:
          'Reconoces su comunicación y evitas culpabilizar. Escuchar no equivale a investigar ni determinar responsabilidad.',
        outcome: { type: 'avanza', next: 'M2_E03' },
      },
      {
        id: 'M2_D02-B',
        guionLetter: 'B',
        label: '¿Qué hiciste para que se enojara?',
        consequence: [],
        feedback: 'La pregunta puede hacerla responsable de la violencia.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E03',
          repair: [l('tu', 'Esa pregunta no fue adecuada. Nadie merece que le hagan daño. Gracias por hablar conmigo.')],
        },
      },
      {
        id: 'M2_D02-C',
        guionLetter: 'C',
        label: 'Necesito que me cuentes todo desde el principio y cuántas veces pasó.',
        consequence: [SE_DETIENE()],
        feedback:
          'La respuesta inicial no requiere reconstruir los hechos. Escucha lo que comunica espontáneamente y pregunta solo lo necesario para proteger y activar la ruta.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D02-D',
        guionLetter: 'D',
        label: 'No estés triste, seguro tu familia lo resolverá.',
        consequence: [],
        feedback: 'Minimiza la preocupación y supone que la familia es segura sin conocer el contexto.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E03',
          repair: [l('tu', 'Quiero escucharte con cuidado y ayudarte a buscar protección.')],
        },
      },
    ],
  },
};

const M2_E03: Scene = {
  id: 'M2_E03',
  title: 'Prométeme que no lo contarás',
  setting: 'Espacio discreto de escucha que mantiene las condiciones de supervisión del centro.',
  characters: ['lucia'],
  intro: [l('lucia', 'No llames a mi casa. Prométeme que esto se queda entre nosotros.', true, 'pensativa')],
  decision: {
    kind: 'choice',
    id: 'M2_D03',
    prompt: '¿Cómo explicas la confidencialidad?',
    options: [
      {
        id: 'M2_D03-A',
        guionLetter: 'A',
        label: 'Te lo prometo; nadie más lo sabrá.',
        consequence: [],
        feedback: 'No se puede prometer secreto absoluto.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E04',
          repair: [
            l(
              'tu',
              'Necesito corregir esa promesa. Para buscar protección debo comunicar la preocupación a las personas responsables. Te explicaré lo que comparta y quiero saber qué podría ponerte en riesgo.',
            ),
          ],
        },
      },
      {
        id: 'M2_D03-B',
        guionLetter: 'B',
        label: D03_B_TEXT,
        consequence: [
          l('lucia', 'Lo que me asusta es que llamen y se enteren antes de que yo esté segura.', true, 'pensativa'),
        ],
        feedback:
          'Explicas límites y escuchas el riesgo asociado con la comunicación. No prometes controlar todas las decisiones de otras instituciones.',
        outcome: { type: 'avanza', next: 'M2_E04' },
      },
      {
        id: 'M2_D03-C',
        guionLetter: 'C',
        label: 'Como eres menor, debo llamar a tu familia ahora.',
        consequence: [SE_DETIENE()],
        feedback:
          'La edad no elimina la necesidad de valorar riesgos. No se contacta automáticamente a una persona que pueda estar involucrada o exponerla.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D03-D',
        guionLetter: 'D',
        label: 'Si no autorizas el reporte, no podemos ayudarte.',
        consequence: [],
        feedback:
          'Confunde la obligación de comunicar con las decisiones sobre servicios y condiciona la ayuda.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E04',
          repair: [l('tu', D03_B_TEXT)],
          repairFollowUp: [
            l('narracion', 'Lee la explicación y confirma que la has comprendido antes de continuar.', false),
          ],
        },
      },
    ],
  },
};

const M2_E04: Scene = {
  id: 'M2_E04',
  title: 'Hoy viene a recogerme',
  setting: 'Espacio discreto de escucha que mantiene las condiciones de supervisión del centro.',
  characters: ['lucia'],
  intro: [l('narracion', 'Necesitas saber si hay una necesidad inmediata, sin pedir más detalles de la violencia.')],
  decision: {
    kind: 'choice',
    id: 'M2_D04',
    prompt: '¿Qué pregunta es pertinente?',
    options: [
      {
        id: 'M2_D04-A',
        guionLetter: 'A',
        label:
          '¿Te sientes segura ahora? ¿Hay algo que te preocupe al salir de aquí? ¿Necesitas atención de salud en este momento?',
        consequence: [
          l(
            'lucia',
            'Ahora estoy bien aquí. La persona que me hace daño viene a recogerme hoy. Me da miedo irme con ella.',
            true,
            'pensativa',
          ),
        ],
        feedback:
          'Identificas un riesgo próximo. No hace falta una lesión visible ni una entrevista extensa para activar ayuda.',
        outcome: { type: 'avanza', next: 'M2_URGENTE' },
      },
      {
        id: 'M2_D04-B',
        guionLetter: 'B',
        label: '¿Puedes mostrarme marcas para saber si es grave?',
        consequence: [SE_DETIENE()],
        feedback:
          'No examines ni pidas exposición corporal. La necesidad de protección no depende de que obtengas una prueba.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D04-C',
        guionLetter: 'C',
        label: '¿Por qué no lo contaste antes?',
        consequence: [],
        feedback: 'Puede sonar a reproche y no ayuda a reconocer necesidades inmediatas.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const M2_URGENTE: Scene = {
  id: 'M2_URGENTE',
  title: 'Una acción dentro de tu rol',
  setting: 'Espacio discreto de escucha. La salida del taller se acerca; no hay cuenta regresiva.',
  characters: ['lucia'],
  intro: [],
  panel: 'transferencia',
  designNote:
    'Sin cuenta regresiva. No mostrar una persona amenazante llegando ni convertir la escena en una prueba de rapidez. La coordinación con emergencias no se reemplaza por una llamada al Punto Focal si existe peligro inmediato.',
  decision: {
    kind: 'choice',
    id: 'M2_DURG',
    prompt: '¿Qué haces con la información sobre la recogida?',
    options: [
      {
        id: 'M2_DURG-A',
        guionLetter: 'A',
        label:
          'Activo inmediatamente el mecanismo de salvaguarda y solicito coordinación de protección antes de la salida. Mantengo acompañamiento seguro dentro de las condiciones del centro mientras los responsables y las autoridades competentes indican medidas. Si el peligro es inminente, activo la respuesta de emergencia disponible sin esperar una autorización que demore la protección.',
        consequence: [
          l(
            'narracion',
            'Se activa ayuda. Lucía permanece acompañada durante la coordinación, sin que el personal decida por su cuenta una nueva custodia. Elena mantiene la organización de la actividad sin recibir el relato.',
            false,
          ),
        ],
        feedback:
          'Respondes ahora y dentro de tu rol: activas el mecanismo y la coordinación de protección, mantienes un acompañamiento seguro y, si el peligro es inminente, activas la respuesta de emergencia. No improvisas custodia ni traslados.',
        feedbackEditorial: true,
        outcome: { type: 'avanza', next: 'M2_E05' },
      },
      {
        id: 'M2_DURG-B',
        guionLetter: 'B',
        label: 'La envío a casa y reporto al cerrar el taller.',
        consequence: [SE_DETIENE()],
        feedback:
          'La preocupación por una salida próxima requiere respuesta ahora. No ejecutes una salida que ignore el riesgo comunicado.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_DURG-C',
        guionLetter: 'C',
        label: 'La llevo a mi casa hasta resolverlo.',
        consequence: [SE_DETIENE()],
        feedback: 'No improvises acogimiento, custodia ni traslados personales. Activa los mecanismos y servicios competentes.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M2_E05: Scene = {
  id: 'M2_E05',
  title: '¿Hay alguien con quien te sientas segura?',
  setting: 'Sala de coordinación del centro comunitario.',
  characters: ['referente', 'lucia'],
  intro: [
    l(
      'narracion',
      {
        cf: 'El Referente toma la coordinación. Tú mantienes tu rol de apoyo técnico.',
        socio:
          'Se activa el punto focal de tu organización, que informa y se articula con ChildFund según la ruta. El Referente toma la coordinación. Tú mantienes tu rol de apoyo técnico.',
      },
      false,
    ),
    l(
      'lucia',
      'Mi tía me escucha. Quisiera que ella estuviera, pero no sé si llamarla hará que se enteren en mi casa.',
      true,
      'pensativa',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M2_D05',
    prompt: '¿Cómo actúas frente a ese posible apoyo?',
    options: [
      {
        id: 'M2_D05-A',
        guionLetter: 'A',
        label: 'Llamo a su tía y le cuento todo; Lucía la ha nombrado.',
        consequence: [SE_DETIENE()],
        feedback:
          'Nombrar una persona de confianza no autoriza una divulgación total ni confirma que el contacto sea seguro.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D05-B',
        guionLetter: 'B',
        label: D05_B_TEXT,
        consequence: [l('referente', D05_B_REFERENTE)],
        feedback:
          'La red de apoyo se valora; no se presume segura ni se sustituye automáticamente la representación legal.',
        outcome: { type: 'avanza', next: 'M2_E06' },
      },
      {
        id: 'M2_D05-C',
        guionLetter: 'C',
        label: 'No tendremos en cuenta a nadie de la familia.',
        consequence: [],
        feedback:
          'Descartar a toda la red sin valoración puede perder un apoyo protector. Escucha y comunica la preferencia sin decidir por cuenta propia.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E06',
          repair: [l('tu', D05_B_TEXT)],
          repairFollowUp: [l('referente', D05_B_REFERENTE)],
        },
      },
    ],
  },
  outro: [
    l(
      'narracion',
      'El Referente y las instancias competentes coordinan una medida de protección ante el riesgo de salida. No se establece un contacto familiar que la exponga. La medida concreta depende de la valoración del caso; el personal técnico no decide custodia ni traslado. Solo después de atender esta urgencia continúa la coordinación de apoyos de corto plazo.',
    ),
  ],
};

const M2_E06: Scene = {
  id: 'M2_E06',
  title: 'Comunicar sin hacer repetir',
  setting: 'Mesa de coordinación con una ficha ficticia rotulada como simulación.',
  characters: [],
  intro: [],
  decision: {
    kind: 'cards',
    id: 'M2_D06',
    prompt:
      'Marca las tarjetas que compartirías por canal restringido. Las que no marques quedarán excluidas. Puedes marcar varias.',
    simulationLabel: 'SIMULACIÓN. Esta ficha no envía un reporte ni se almacena como expediente',
    includeLabel: 'Compartir por canal restringido',
    cards: [
      {
        id: 'M2_D06-T1',
        number: 1,
        include: true,
        text: 'Lucía comunicó espontáneamente violencia y amenazas por parte de una persona adulta de su hogar.',
        explanation: 'Es el relato comunicado, sin concluir culpabilidad.',
      },
      {
        id: 'M2_D06-T2',
        number: 2,
        include: true,
        text: 'Expresó temor de salir con la persona que esperaba recogerla; se activó coordinación de protección.',
        explanation: 'Riesgo y acción inicial relevantes.',
      },
      {
        id: 'M2_D06-T3',
        number: 3,
        include: true,
        text: 'Propuso a su tía como posible apoyo y advirtió que contactarla podría alertar al hogar.',
        explanation: 'Preferencia y riesgo de contacto.',
      },
      {
        id: 'M2_D06-T4',
        number: 4,
        include: false,
        text: 'Probablemente la familia entera sabía lo que pasaba.',
        explanation: 'Suposición.',
      },
      {
        id: 'M2_D06-T5',
        number: 5,
        include: false,
        text: 'Fotografías del taller, lista completa del grupo y comentarios sobre su conducta escolar.',
        explanation: 'No son necesarios para esta comunicación.',
      },
    ],
    messages: {
      missing: 'Incluye el riesgo que ya conoces para que pueda atenderse.',
      extra: 'Limita lo compartido a hechos, necesidades y acciones pertinentes.',
    },
    successTitle: 'Registro simulado',
    successText:
      'Fecha y contexto ficticios de recepción; manifestación espontánea; riesgo comunicado; medidas activadas; necesidades y preferencias; responsable que recibió. Información desconocida: consignar como no conocida, sin obtenerla mediante entrevistas personales.',
    next: 'M2_E07',
  },
};

const M2_E07: Scene = {
  id: 'M2_E07',
  title: 'Comprender antes de aceptar',
  setting: 'Sala de coordinación. El Referente conversa con Lucía; tú apoyas en tareas asignadas.',
  characters: ['referente', 'lucia'],
  intro: [
    l('narracion', 'Observas la coordinación del Referente. Tú apoyas únicamente en tareas asignadas.'),
    l(
      'referente',
      'Podemos coordinar una atención especializada para apoyarte. Antes te explicaremos en qué consiste, quién te recibiría y qué información se necesita. También debes conocer qué actuaciones son obligatorias y por qué.',
    ),
    l('lucia', 'Quiero hablar con alguien, pero no quiero contar lo mismo otra vez.', true, 'pensativa'),
  ],
  panel: 'apoyos',
  decision: {
    kind: 'choice',
    id: 'M2_D07',
    prompt: '¿Qué apoyo corresponde?',
    complementaryNote:
      'La decisión sobre quién puede consentir cada intervención no queda a tu cargo. Si un representante es señalado o implica conflicto, se activa la protección competente; no se pide su firma ni se le informa automáticamente. La falta de una firma no se utiliza para aplazar una emergencia.',
    options: [
      {
        id: 'M2_D07-A',
        guionLetter: 'A',
        label: 'Le digo que firme primero y que el servicio explicará después.',
        consequence: [],
        feedback: 'Una firma no reemplaza información comprensible ni participación.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M2_D07-B',
        guionLetter: 'B',
        label: D07_B_TEXT,
        consequence: [
          l('tu', '¿Hay algo que quisieras que expliquemos de otra manera?'),
          l('lucia', 'Quiero saber quién va a conocer lo que conté.', true, 'pensativa'),
          l('referente', D07_B_REFERENTE),
        ],
        feedback:
          'Distingues información, comprensión y decisión. La autonomía progresiva no se reduce a una edad fija ni elimina las obligaciones de protección.',
        outcome: { type: 'avanza', next: 'M2_E08' },
      },
      {
        id: 'M2_D07-C',
        guionLetter: 'C',
        label: 'Le aseguro que nadie más le preguntará nada.',
        consequence: [],
        feedback:
          'No puedes garantizar las actuaciones de otros servicios. Sí puedes promover coordinación y evitar repeticiones innecesarias.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M2_E08',
          repair: [l('tu', D07_B_TEXT)],
          repairFollowUp: [l('referente', D07_B_REFERENTE)],
        },
      },
    ],
  },
};

const M2_E08: Scene = {
  id: 'M2_E08',
  title: 'El primer servicio no puede recibirla',
  setting: 'Sala de coordinación. Una profesional de un servicio de atención genérico confirma condiciones.',
  characters: ['profesional', 'lucia'],
  intro: [
    l(
      'narracion',
      'La medida inmediata de protección sigue vigente. Para el apoyo psicosocial de corto plazo, el Referente consulta un servicio del directorio.',
    ),
    l(
      'profesional',
      'No contamos con atención especializada para adolescentes en el horario propuesto. La disponibilidad que podemos ofrecer requiere un desplazamiento largo.',
    ),
    l('lucia', 'Ese viaje me preocupa. No conozco el lugar y no sé cómo iría.', true, 'pensativa'),
  ],
  decision: {
    kind: 'choice',
    id: 'M2_D08',
    prompt: '¿Cómo contribuyes a una alternativa segura?',
    options: [
      {
        id: 'M2_D08-A',
        guionLetter: 'A',
        label: 'Entrego el número y considero la derivación completada.',
        consequence: [l('narracion', 'La ficha muestra: «Recepción no confirmada» y «Barreras sin resolver».', false)],
        feedback: 'Entregar un contacto no verifica acceso.',
        outcome: { type: 'redirige_a_reparacion', next: 'M2_REPARAR_DERIVACION' },
      },
      {
        id: 'M2_D08-B',
        guionLetter: 'B',
        label:
          'Comunico las barreras al Referente y apoyo la búsqueda de una alternativa verificada: capacidad para adolescentes, disponibilidad, accesibilidad, costos, traslado seguro y confidencialidad. Lucía recibe explicación de la nueva opción.',
        consequence: [
          l('narracion', 'Se consulta otro servicio sin circular el relato completo por una lista de contactos.', false),
        ],
        feedback:
          'Comunicas las barreras y apoyas una alternativa verificada sin presionar a Lucía. La derivación la coordina el Referente y la protección se mantiene mientras tanto.',
        feedbackEditorial: true,
        outcome: { type: 'avanza', next: 'M2_VERIFICAR' },
      },
      {
        id: 'M2_D08-C',
        guionLetter: 'C',
        label: 'La llevo personalmente para asegurar que alguien la reciba.',
        consequence: [SE_DETIENE()],
        feedback: 'No improvises transporte ni recepción. Se coordinan mediante los mecanismos autorizados y medidas seguras.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D08-D',
        guionLetter: 'D',
        label: 'Le digo que debe aceptar la primera opción porque es la única disponible.',
        consequence: [],
        feedback: 'La presión no resuelve las barreras ni sustituye la valoración de alternativas.',
        outcome: { type: 'redirige_a_reparacion', next: 'M2_REPARAR_DERIVACION' },
      },
    ],
  },
};

const M2_REPARAR_DERIVACION: Scene = {
  id: 'M2_REPARAR_DERIVACION',
  opcional: true,
  title: 'Reparar la derivación',
  setting: 'Sala de coordinación.',
  characters: ['lucia'],
  intro: [
    l(
      'tu',
      'El contacto inicial no garantiza que puedas recibir atención. Voy a comunicar la dificultad para que se revise una alternativa contigo.',
    ),
  ],
  decision: {
    kind: 'continuar',
    id: 'M2_DREP',
    label: 'Revisar condiciones de acceso',
    next: 'M2_VERIFICAR',
  },
};

const M2_VERIFICAR: Scene = {
  id: 'M2_VERIFICAR',
  title: 'Verificar el acceso',
  setting: 'Mesa de coordinación con una ficha de servicio genérica y ficticia.',
  characters: ['referente', 'lucia'],
  intro: [
    l(
      'referente',
      'Hay otra opción con capacidad para atenderte. Revisemos cómo llegarías, quién te recibiría y qué información se compartiría. Si esta alternativa no resulta adecuada, tendremos que revisarla.',
    ),
  ],
  decision: {
    kind: 'checklist',
    id: 'M2_DVER',
    prompt: 'Revisa la ficha de la alternativa y marca cada condición que quedó comprobada.',
    simulationLabel: 'SIMULACIÓN. Ficha ficticia: no se envía ni se guarda',
    items: [
      { id: 'M2_DVER-1', label: 'Servicio pertinente' },
      { id: 'M2_DVER-2', label: 'Recepción confirmada por canal autorizado' },
      { id: 'M2_DVER-3', label: 'Horario' },
      { id: 'M2_DVER-4', label: 'Accesibilidad y costos' },
      { id: 'M2_DVER-5', label: 'Traslado/acompañamiento autorizado' },
      { id: 'M2_DVER-6', label: 'Información mínima acordada' },
    ],
    pendingState: 'En coordinación',
    doneState: 'Alternativa confirmada',
    incompleteMessage:
      'Las seis condiciones deben quedar comprobadas o con un responsable y acción pendiente; una ficha incompleta no se marca como derivación recibida.',
    successText:
      'En la historia principal se confirma una alternativa pertinente. Lucía conoce cómo llegaría, quién la recibiría y qué información se compartiría.',
    next: 'M2_E09',
    alternative: { label: 'Ver la contingencia: ninguna alternativa se confirma', next: 'M2_SIN_SERVICIO' },
  },
};

const M2_SIN_SERVICIO: Scene = {
  id: 'M2_SIN_SERVICIO',
  opcional: true,
  title: 'Derivación pendiente',
  setting: 'Sala de coordinación.',
  characters: ['referente'],
  variationLabel: 'Contingencia',
  intro: [
    l('narracion', 'Estado de la ficha: «Derivación pendiente». Ninguna alternativa se ha confirmado todavía.', false),
    l(
      'narracion',
      'El Referente mantiene coordinación de protección, escala la barrera y revisa apoyos disponibles sin prometer una plaza. Nunca se cierra el caso por falta de cupo.',
      false,
    ),
    l(
      'narracion',
      'La urgencia se reevalúa y, si cambia, se activa la respuesta pertinente sin esperar agenda.',
      false,
    ),
  ],
  decision: {
    kind: 'continuar',
    id: 'M2_DSIN',
    label: 'Volver al ejemplo principal',
    note: 'Volver al ejemplo principal no resuelve una falta de cupo real: en esta historia se retoma la alternativa confirmada.',
    next: 'M2_VERIFICAR',
  },
};

const M2_E09: Scene = {
  id: 'M2_E09',
  title: 'No quiero mensajes en mi teléfono',
  setting: 'Espacio acordado y seguro dentro del centro comunitario.',
  characters: ['lucia'],
  intro: [
    l(
      'lucia',
      'Mi teléfono lo revisan en casa. No manden mensajes sobre esto. Prefiero hablar cuando esté en el espacio acordado con la persona que me acompaña.',
      true,
      'pensativa',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M2_D09',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'M2_D09-A',
        guionLetter: 'A',
        label: 'Envío un mensaje con el nombre del servicio para que tenga constancia.',
        consequence: [SE_DETIENE()],
        feedback: 'Podría exponer información sensible. No uses un canal que se ha identificado como inseguro.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M2_D09-B',
        guionLetter: 'B',
        label: D09_B_TEXT,
        consequence: [],
        feedback: 'El seguimiento debe ser seguro, además de oportuno. No basta con tener un número de teléfono.',
        outcome: { type: 'avanza', next: 'M2_E10' },
      },
      {
        id: 'M2_D09-C',
        guionLetter: 'C',
        label: 'Como el teléfono no es seguro, dejamos de hacer seguimiento.',
        consequence: [],
        feedback:
          'Se necesitan alternativas; no abandono. El seguimiento voluntario sobre apoyos se acuerda con Lucía y las obligaciones de protección se mantienen por los roles competentes.',
        outcome: { type: 'repara_y_avanza', next: 'M2_E10', repair: [l('tu', D09_B_TEXT)] },
      },
    ],
  },
};

const M2_E10: Scene = {
  id: 'M2_E10',
  title: 'Confirmar acceso sin pedir un nuevo relato',
  setting: 'Espacio acordado y seguro dentro del centro comunitario.',
  characters: ['referente', 'lucia'],
  intro: [
    l(
      'narracion',
      'En el contacto seguro acordado, el servicio confirma al Referente la recepción con la información mínima permitida. Lucía expresa su experiencia de acceso sin reconstruir la violencia.',
    ),
    l('lucia', 'Sí me recibieron. Me explicaron las opciones. Para la próxima cita necesito revisar cómo llegar.'),
  ],
  decision: {
    kind: 'choice',
    id: 'M2_D10',
    prompt: '¿Qué conclusión es adecuada?',
    options: [
      {
        id: 'M2_D10-A',
        guionLetter: 'A',
        label: 'Recibió una atención, así que todo está resuelto y cierro el caso.',
        consequence: [],
        feedback:
          'La recepción inicial no equivale a recuperación, desaparición del riesgo ni cierre del caso. El cierre corresponde a los responsables y a los criterios de la ruta.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M2_D10-B',
        guionLetter: 'B',
        label:
          'Comunico la barrera de la próxima cita al Referente para revisar el apoyo acordado. Registro solo lo que corresponde a mi función; no solicito detalles de la atención. La decisión de cierre queda a cargo de los responsables.',
        consequence: [],
        feedback:
          'Verificas acceso y detectas una barrera nueva sin invadir la privacidad ni sustituir la gestión especializada.',
        outcome: { type: 'avanza', next: 'CIERRE' },
      },
      {
        id: 'M2_D10-C',
        guionLetter: 'C',
        label: 'Pido el informe psicológico completo para comprobar que asistió.',
        consequence: [SE_DETIENE()],
        feedback: 'Comprobar recepción no autoriza acceso a notas clínicas ni información íntima.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const scenes: Record<SceneId, Scene> = {
  M2_E01,
  M2_E02,
  M2_E03,
  M2_E04,
  M2_URGENTE,
  M2_E05,
  M2_E06,
  M2_E07,
  M2_E08,
  M2_REPARAR_DERIVACION,
  M2_VERIFICAR,
  M2_SIN_SERVICIO,
  M2_E09,
  M2_E10,
};

export const episodio2: Episode = {
  id: 'm2-gracias-por-escucharme',
  ruta: 'm2',
  rotulo: 'Módulo 2',
  number: 2,
  title: 'Gracias por escucharme',
  subtitle: 'Escucha respetuosa y derivación segura',
  version: '1.0',
  claveAlmacen: 'dqp:progreso:m2-gracias-por-escucharme',
  guionArchivo: '^Guion_Modulo_2_.*\\.md$',
  start: 'M2_E01',
  scenes,
  order: [
    'M2_E01',
    'M2_E02',
    'M2_E03',
    'M2_E04',
    'M2_URGENTE',
    'M2_E05',
    'M2_E06',
    'M2_E07',
    'M2_E08',
    'M2_REPARAR_DERIVACION',
    'M2_VERIFICAR',
    'M2_SIN_SERVICIO',
    'M2_E09',
    'M2_E10',
  ],
  closing: {
    lines: [
      l('lucia', 'Me ayudó que me explicaras lo que ibas a hacer y que no me pidieras contarlo todo otra vez.'),
      l(
        'narracion',
        'La preocupación fue comunicada, se coordinó una respuesta a la seguridad y se confirmó un acceso inicial a atención. El Referente mantiene el seguimiento pertinente. La historia no declara que la violencia haya desaparecido ni que el caso esté cerrado.',
      ),
    ],
    contribution:
      'Escuchar con respeto, explicar los pasos y comprobar que una derivación sea viable forman parte de una respuesta protectora. No necesitas investigar para cumplir tu responsabilidad.',
    reflection: [
      '¿Qué frase puedo utilizar para explicar la confidencialidad?',
      '¿Qué barrera de acceso podría pasar por alto?',
      '¿Sé cuándo debo pedir apoyo y qué información debo restringir?',
    ],
    reviewLabel: 'Ver mis aprendizajes',
  },
  badges: [
    {
      id: 'm2-escucha-que-cuida',
      name: 'Escucha que cuida',
      description: 'Completaste D01 a D03 llegando a la respuesta adecuada o a su reparación.',
      decisions: ['M2_D01', 'M2_D02', 'M2_D03'],
    },
    {
      id: 'm2-seguridad-participacion',
      name: 'Seguridad y participación',
      description: 'Completaste D04, la subescena urgente y D05 a D07.',
      decisions: ['M2_D04', 'M2_DURG', 'M2_D05', 'M2_D06', 'M2_D07'],
    },
    {
      id: 'm2-derivacion-segura',
      name: 'Derivación segura',
      description: 'Completaste D08 a D10 y la ficha de verificación.',
      decisions: ['M2_D08', 'M2_DVER', 'M2_D09', 'M2_D10'],
    },
  ],
  portada: {
    lead: 'Escuchar abre una puerta. Coordinar una atención segura ayuda a que esa puerta no se cierre.',
    aviso:
      'Este módulo aborda violencia contra una adolescente, sin escenas explícitas. Todas las situaciones son ficticias. Puedes pausar, salir o elegir lectura equivalente. No compartas nombres, relatos ni documentos reales.',
    rolPregunta: '¿Desde qué rol actuarás?',
    roles: {
      cf: 'Personal técnico de ChildFund Ecuador',
      socio: 'Personal técnico de una organización socia',
    },
    rolMensaje:
      'Puedes escuchar, reconocer necesidades inmediatas y activar el mecanismo. La valoración especializada, las medidas de protección, las derivaciones y la investigación tienen responsables específicos.',
    rolNotas: {
      cf: 'Acceso al Punto Focal de ChildFund y alternativas institucionales.',
      socio:
        'Activación por el Punto Focal del socio y comunicación/articulación con el Punto Focal de ChildFund conforme a la ruta. La jerarquía interna no debe impedir un reporte oportuno ni una respuesta urgente. Si el canal habitual no está disponible o existe conflicto de interés, se usa la alternativa institucional.',
    },
  },
  herramientas: [
    'm2-escucha',
    'm2-necesidades',
    'm2-familia',
    'm2-reporte',
    'm2-derivacion',
    'm2-seguimiento',
    'm2-servicios',
    'no-hacer',
    'ruta',
  ],
  evaluacion: { config: configEvaluacion, preguntas, textos: textosResultado, notaUmbral },
  panelApoyos: [
    'Posibles apoyos según necesidades y ruta: seguridad, atención de salud, apoyo psicosocial y orientación jurídica. El Referente los coordina con los servicios competentes; no todos los casos requieren todos los servicios.',
    'Con adolescentes se aplica la autonomía progresiva: los responsables valoran caso a caso el consentimiento o asentimiento y la participación del representante legal, siempre que sea posible y seguro. Si el representante es presunto agresor o existe conflicto de intereses, se activan las rutas de protección especial.',
    'En delitos que afectan a niñas, niños y adolescentes existen obligaciones de denuncia: las aplican y explican los roles competentes. El apoyo no depende de que la adolescente repita su relato.',
  ],
  panelTransferencia:
    'Si el peligro es inminente, activa la respuesta de emergencia disponible sin esperar una autorización que demore la protección. La coordinación con emergencias no se reemplaza por una llamada al Punto Focal. La atención urgente no espera trámites, la clasificación del nivel ni una investigación.',
};

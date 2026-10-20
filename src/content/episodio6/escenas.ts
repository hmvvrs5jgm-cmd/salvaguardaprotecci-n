// Módulo 6 — «Una imagen que no debió publicarse». Guion versión 1.0 para revisión institucional.
// Los diálogos marcados literal: true se copian sin parafrasear del guion.
// Los textos con literal: false convierten indicaciones de pantalla en narración; los textos redactados
// para el juego figuran en textosEditoriales. Ambos se registran en docs/cambios-editoriales.md.
// Todos los IDs llevan el prefijo M6_. La publicación es ficticia: los elementos sensibles se representan
// solo por su tipo y nunca se incluyen en el DOM, el texto alternativo ni los registros.
// Dos desenlaces protectores: no volver a publicar o preparar contenido general independiente.

import type { ChatSimulado, Episode, Line, Pose, Scene, SceneId, Speaker } from '../types';
import { configEvaluacion, notaUmbral, preguntas, textosResultado } from './evaluacion';

let seq = 0;
const l = (speaker: Speaker, text: Line['text'], literal = true, pose?: Pose): Line => ({
  id: `M6_L${++seq}`,
  speaker,
  text,
  literal,
  ...(pose ? { pose } : {}),
});

const PAUSA = 'Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.';
const SE_DETIENE = () => l('narracion', 'El ejercicio se detiene antes de ejecutar esta acción. No se publica ni se comparte nada.', false);

const D07_B_TEXT =
  'La comunicación pública debe evaluarse por los responsables con protección como prioridad. No publicamos nombre, imagen ni detalles del caso. Una explicación privada a Alma, adecuada a su edad y por un canal seguro, no se reemplaza por una campaña.';

// Textos redactados para el juego (el guion no los define): no se comparan con el guion.
const ED = {
  rolPregunta: '¿Desde qué rol actuarás?',
  postTitulo: 'SIMULACIÓN. Publicación ficticia, sin conexión con redes reales',
  postAutor: 'Cuenta institucional (ficticia)',
  postTexto: 'Publicación sobre el taller:',
  d03Prompt: 'Marca los elementos de la publicación ficticia que requieren valoración de identificación o exposición. Puedes marcar varios.',
  d03Missing: 'Revisa también los elementos de texto, etiquetas y comentarios que pueden identificar.',
  d03Extra: 'Uno de los elementos marcados no es, por sí solo, el factor relevante en esta simulación.',
  botonContinuar: 'Continuar',
};

const POST: ChatSimulado = {
  titulo: ED.postTitulo,
  mensajes: [
    {
      autor: ED.postAutor,
      partes: [
        ED.postTexto,
        { oculto: 'rostro identificable' },
        { oculto: 'nombre del centro' },
        { oculto: 'texto que vincula a una participante con una situación sensible' },
        { oculto: 'ubicación y fecha' },
        { oculto: 'comentario con etiqueta y parentesco' },
      ],
    },
  ],
};

const M6_E01: Scene = {
  id: 'M6_E01',
  title: '«Me reconocieron»',
  setting: 'Espacio de coordinación del programa comunitario ficticio «Encuentro».',
  characters: ['elena'],
  intro: [
    l(
      'elena',
      'Una cuidadora segura, mediante el contacto institucional, comunicó que Alma fue reconocida por una publicación y está preocupada. La foto muestra la actividad, pero el texto la relaciona con una situación de apoyo sensible.',
      true,
      'pensativa',
    ),
  ],
  chat: POST,
  designNote:
    'No se pide a Alma verificar el alcance ni buscar comentarios. El conocimiento recibido se distingue de lo desconocido.',
  decision: {
    kind: 'choice',
    id: 'M6_D01',
    prompt: '¿Qué criterio aplicas?',
    options: [
      {
        id: 'M6_D01-A',
        guionLetter: 'A',
        label: 'La foto no muestra nada explícito, así que no puede hacer daño.',
        consequence: [],
        feedback: 'El riesgo puede surgir de la identificación y del contexto, aunque la imagen sea cotidiana.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M6_D01-B',
        guionLetter: 'B',
        label:
          'Trato la comunicación como una preocupación que merece atención. No la comparto por chats y activo al Referente y al responsable de la publicación por la vía autorizada.',
        consequence: [l('elena', 'Voy a transmitir lo que se conoce y la necesidad de contacto seguro.')],
        feedback: 'No esperas prueba de daño para coordinar respuesta.',
        outcome: { type: 'avanza', next: 'M6_E02' },
      },
      {
        id: 'M6_D01-C',
        guionLetter: 'C',
        label: 'Pregunto al grupo de participantes quién reconoció a Alma.',
        consequence: [SE_DETIENE()],
        feedback: 'La consulta puede aumentar reconocimiento y exposición. La valoración se hace con acceso restringido.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M6_E02: Scene = {
  id: 'M6_E02',
  title: 'El permiso en la carpeta',
  setting: 'Mesa de coordinación con una carpeta ficticia de autorizaciones.',
  characters: ['valeria'],
  intro: [
    l(
      'valeria',
      'Tenemos una autorización general de imagen firmada cuando comenzó la participación. Pensé que eso cubría esta publicación.',
      true,
      'pensativa',
    ),
  ],
  designNote:
    'El equipo no contacta a la niña para convencerla de aceptar. El juego no declara inválida toda autorización general; enseña que nunca es una exención de cuidado.',
  decision: {
    kind: 'choice',
    id: 'M6_D02',
    prompt: '¿Qué respuesta corresponde?',
    options: [
      {
        id: 'M6_D02-A',
        guionLetter: 'A',
        label: 'La firma permite mantener cualquier publicación aunque ahora genere preocupación.',
        consequence: [SE_DETIENE()],
        feedback: 'La autorización no elimina riesgos ni vuelve irrelevantes la finalidad y la voz de la niña.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D02-B',
        guionLetter: 'B',
        label: 'Pedimos otra firma y dejamos la publicación visible mientras tanto.',
        consequence: [],
        feedback: 'Una nueva firma no es una respuesta a la exposición ni debe retrasar su reducción.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M6_D02-C',
        guionLetter: 'C',
        label:
          'Revisamos alcance, propósito y comprensión del permiso y atendemos el riesgo actual. Los responsables coordinan contención sin esperar una nueva autorización. La opinión de Alma debe ser escuchada.',
        consequence: [
          l('valeria', 'Revisemos también el texto, las etiquetas y dónde se ha compartido mediante los mecanismos autorizados.'),
        ],
        feedback: 'Distingues documentos de consentimiento y evaluación de seguridad.',
        sourceNote:
          'Antes de publicar se obtiene consentimiento informado y, cuando el sujeto principal es una niña o un niño, consentimiento escrito de su madre, padre o tutor. Las imágenes deben promover la dignidad y ocultar la identidad cuando sea necesario (Procedimiento 5.1.14.4 y 5.1.14.5).',
        outcome: { type: 'avanza', next: 'M6_E03' },
      },
    ],
  },
};

const M6_E03: Scene = {
  id: 'M6_E03',
  title: 'Lo que permite identificar',
  setting: 'Publicación ficticia con una figura ilustrada genérica y etiquetas por tipo de dato.',
  characters: [],
  intro: [],
  chat: POST,
  decision: {
    kind: 'cards',
    id: 'M6_D03',
    prompt: ED.d03Prompt,
    simulationLabel: 'SIMULACIÓN. Publicación ficticia: no se publica ni se solicita ninguna imagen real',
    includeLabel: 'Revisar',
    cards: [
      { id: 'M6_D03-T1', number: 1, include: true, text: 'Rostro reconocible.', explanation: 'Identificación directa.' },
      {
        id: 'M6_D03-T2',
        number: 2,
        include: true,
        text: 'Uniforme y nombre de una institución visible.',
        explanation: 'Identificación contextual.',
      },
      {
        id: 'M6_D03-T3',
        number: 3,
        include: true,
        text: 'Texto que vincula a una participante concreta con una situación sensible.',
        explanation: 'Revela o sugiere información aunque no dé el nombre.',
      },
      {
        id: 'M6_D03-T4',
        number: 4,
        include: true,
        text: 'Etiqueta de ubicación y fecha de la actividad.',
        explanation: 'Puede facilitar localización o reconocimiento junto con otros datos.',
      },
      {
        id: 'M6_D03-T5',
        number: 5,
        include: true,
        text: 'Comentario que etiqueta a una persona o menciona un parentesco.',
        explanation: 'Añade conexiones identificables.',
      },
      {
        id: 'M6_D03-T6',
        number: 6,
        include: false,
        text: 'Color genérico del marco de la publicación.',
        explanation: 'No se afirma que toda combinación contextual sea irrelevante.',
      },
    ],
    messages: { missing: ED.d03Missing, extra: ED.d03Extra },
    successText:
      'No basta con mirar el rostro. Imagen, pie de foto, etiquetas, audio, texto alternativo, archivos y comentarios pueden combinarse. En un grupo pequeño puede reconocerse a alguien con pocos datos.',
    next: 'M6_E04',
  },
};

const M6_E04: Scene = {
  id: 'M6_E04',
  title: 'Contener desde el rol correcto',
  setting: 'Espacio de coordinación con la interfaz genérica de una cuenta ficticia.',
  characters: ['valeria'],
  intro: [l('valeria', 'Tengo acceso autorizado para administrar esta publicación. ¿Qué coordinamos primero?')],
  designNote:
    'Si la persona jugadora no tiene permisos, su acción válida es avisar y solicitar intervención urgente del responsable; no se bloquea el módulo por no administrar la cuenta.',
  decision: {
    kind: 'choice',
    id: 'M6_D04',
    prompt: '¿Qué acción propones?',
    options: [
      {
        id: 'M6_D04-A',
        guionLetter: 'A',
        label:
          'Solicitar por los responsables restringir o retirar la publicación y detener su promoción o republicación donde corresponda, valorando si ocultar es suficiente. Coordinar el registro mínimo necesario por medios autorizados, sin mantener exposición para obtener pruebas.',
        consequence: [
          l(
            'narracion',
            'El responsable administra la publicación y sus accesos. La cuenta propia deja de mostrarla públicamente según las herramientas disponibles. No se da por hecho que una función de ocultar elimina el enlace o las copias.',
            false,
          ),
        ],
        feedback:
          'Protección, contención y registro se coordinan sin nuevas exposiciones. La persona técnica no accede a una cuenta ajena.',
        outcome: { type: 'avanza', next: 'M6_E05' },
      },
      {
        id: 'M6_D04-B',
        guionLetter: 'B',
        label: 'Descargo la fotografía completa y la envío al grupo para documentar el error.',
        consequence: [SE_DETIENE()],
        feedback: 'El registro no requiere circular copias. Los responsables preservan lo necesario por mecanismos restringidos.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D04-C',
        guionLetter: 'C',
        label: 'Borro por mi cuenta carpetas, permisos y formularios para eliminar todo rastro.',
        consequence: [SE_DETIENE()],
        feedback: 'No destruyas documentación ni alteres registros. Retirar exposición no es ocultar lo ocurrido.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D04-D',
        guionLetter: 'D',
        label: 'Espero a una reunión de comunicación para no afectar el calendario.',
        consequence: [],
        feedback: 'El calendario no justifica prolongar una posible exposición dañina.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
  outro: [
    l('narracion', 'Estado: contenido propio restringido o retirado; alcance externo pendiente de valoración.', false),
  ],
};

const M6_E05: Scene = {
  id: 'M6_E05',
  title: 'Escuchar sin volver a exponer',
  setting: 'Contacto seguro coordinado por el Referente, con una persona cuidadora que no aumenta el riesgo.',
  characters: ['referente', 'alma'],
  intro: [
    l(
      'narracion',
      'El Referente coordina un contacto seguro. Considera la participación de una persona cuidadora que no aumente el riesgo y explica los límites de confidencialidad. Tú apoyas solo si se te asigna esa función.',
    ),
    l(
      'alma',
      'No me gustó que apareciera así. Algunas personas me preguntaron cosas. Quiero seguir en el taller, pero no quiero que me graben.',
      true,
      'pensativa',
    ),
  ],
  designNote:
    'La respuesta sobre riesgos y contacto corresponde al Referente y roles competentes. Si aparece una amenaza inmediata, se activa protección urgente sin esperar la revisión de redes. No se contacta automáticamente a un familiar que pueda ponerla en peligro.',
  decision: {
    kind: 'choice',
    id: 'M6_D05',
    prompt: '¿Qué respuesta es adecuada?',
    options: [
      {
        id: 'M6_D05-A',
        guionLetter: 'A',
        label: 'Tú aceptaste las fotos; ahora tenemos que cumplir la campaña.',
        consequence: [SE_DETIENE()],
        feedback: 'La presión ignora la voz de la niña y el deber de cuidado.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D05-B',
        guionLetter: 'B',
        label:
          'Gracias por decirlo. Puedes seguir participando sin aceptar grabaciones o fotos. Los responsables están actuando para reducir la exposición y queremos saber qué necesitas para sentirte segura. No debes buscar comentarios ni explicar lo que pasó a otras personas.',
        consequence: [l('alma', 'Quiero que no manden mensajes sobre esto al grupo.')],
        feedback:
          'Escuchas una preferencia y un riesgo concreto. No haces repetir una historia íntima ni aseguras que todas las copias desaparecieron.',
        outcome: { type: 'avanza', next: 'M6_E06' },
      },
      {
        id: 'M6_D05-C',
        guionLetter: 'C',
        label: 'Para resolverlo, graba un video diciendo que ya no quieres la foto.',
        consequence: [SE_DETIENE()],
        feedback: 'No crees nuevo contenido identificable como condición de reparación.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M6_E06: Scene = {
  id: 'M6_E06',
  title: 'La publicación ya fue compartida',
  setting: 'Espacio de coordinación.',
  characters: ['valeria'],
  intro: [l('valeria', 'Una cuenta externa compartió el contenido. Retirarlo de nuestra cuenta no elimina esa copia.', true, 'pensativa')],
  ficha: {
    titulo: 'Estado de la exposición (simulación)',
    filas: [
      { aspecto: 'Preocupación recibida y comunicada al Referente', estado: 'comunicada' },
      { aspecto: 'Contenido propio', estado: 'contenido_restringido' },
      { aspecto: 'Copia compartida por una cuenta externa', estado: 'riesgo_en_evaluacion' },
    ],
  },
  designNote:
    'No dar instrucciones de una plataforma específica que no se haya verificado; las herramientas y tiempos de terceros varían. No pedir credenciales a familias, niñas o cuentas externas. No utilizar herramientas no autorizadas ni reconocimiento facial para localizar copias.',
  decision: {
    kind: 'choice',
    id: 'M6_D06',
    prompt: '¿Cómo contribuyes?',
    options: [
      {
        id: 'M6_D06-A',
        guionLetter: 'A',
        label: 'Pido a Alma y sus amigas buscar todas las copias y responder a los comentarios.',
        consequence: [SE_DETIENE()],
        feedback: 'No traslades a NNA una tarea que puede volver a exponerles.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D06-B',
        guionLetter: 'B',
        label: 'Reenvío públicamente la imagen para pedir que se elimine.',
        consequence: [SE_DETIENE()],
        feedback: 'La petición amplificaría el material que se intenta retirar.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D06-C',
        guionLetter: 'C',
        label:
          'Informo las referencias conocidas por el canal restringido. Los responsables coordinan solicitudes de retiro o restricción y mecanismos de plataforma cuando correspondan, sin afirmar que controlan todas las copias. Se mantiene la valoración de seguridad y apoyos.',
        consequence: [],
        feedback: 'Actúas sobre copias conocidas sin investigar por cuenta propia, exponer más ni prometer borrado universal.',
        outcome: { type: 'avanza', next: 'M6_E07' },
      },
    ],
  },
};

const M6_E07: Scene = {
  id: 'M6_E07',
  title: '«Publiquemos una disculpa con su nombre»',
  setting: 'Espacio de coordinación.',
  characters: ['elena'],
  intro: [
    l('elena', '¿Y si hacemos una publicación explicando lo ocurrido y pedimos disculpas a Alma públicamente?', true, 'pensativa'),
  ],
  designNote:
    'No se redacta una disculpa pública automáticamente ni se convierte a Alma en portavoz del incidente. Se distingue comunicación pública, información a la persona y notificaciones aplicables a cargo de responsables.',
  decision: {
    kind: 'choice',
    id: 'M6_D07',
    prompt: '¿Qué criterio aplicas?',
    options: [
      {
        id: 'M6_D07-A',
        guionLetter: 'A',
        label: 'La corrección debe mostrar la imagen para que se entienda el error.',
        consequence: [SE_DETIENE()],
        feedback: 'Puede volver a identificar y circular el contenido.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D07-B',
        guionLetter: 'B',
        label: D07_B_TEXT,
        consequence: [],
        feedback:
          'La rendición de cuentas no exige divulgar una identidad. El responsable valorará si hace falta algún mensaje público general, sin crear una publicación que revele a quién se refiere.',
        outcome: { type: 'avanza', next: 'M6_E08' },
      },
      {
        id: 'M6_D07-C',
        guionLetter: 'C',
        label: 'No se explica nada a nadie para evitar responsabilidad.',
        consequence: [],
        feedback:
          'Evitar exposición no justifica ocultar el error ni omitir comunicaciones debidas. Se informa por las vías y roles adecuados.',
        outcome: { type: 'repara_y_avanza', next: 'M6_E08', repair: [l('tu', D07_B_TEXT)] },
      },
    ],
  },
};

const M6_E08: Scene = {
  id: 'M6_E08',
  title: '¿Difuminar y volver a publicar?',
  setting: 'Espacio de coordinación con el calendario ficticio de la campaña.',
  characters: ['valeria'],
  intro: [
    l('valeria', 'La campaña necesita una pieza hoy. Podríamos difuminar el rostro y volver a usar el mismo texto.', true, 'pensativa'),
  ],
  decision: {
    kind: 'choice',
    id: 'M6_D08',
    prompt: '¿Qué alternativa es protectora?',
    options: [
      {
        id: 'M6_D08-A',
        guionLetter: 'A',
        label: 'Sí; difuminar garantiza que nadie podrá reconocerla.',
        consequence: [],
        feedback: 'Ropa, lugar, voz, historia, comentarios o publicaciones previas pueden permitir identificación.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M6_D08-B',
        guionLetter: 'B',
        label: 'No reutilizamos esa historia ni imagen. Reprogramamos la pieza si no hay contenido seguro y revisado.',
        consequence: [
          l('narracion', 'Se cancela la pieza vinculada a la experiencia individual, sin penalizar al equipo ni a Alma.', false),
        ],
        feedback: 'No publicar es una decisión válida cuando no se garantizan condiciones.',
        outcome: { type: 'avanza', next: 'M6_NO_REPUBLICAR' },
      },
      {
        id: 'M6_D08-C',
        guionLetter: 'C',
        label:
          'Preparamos una alternativa sin vínculo con el caso: por ejemplo, una ilustración general y orientaciones sobre participación segura. La revisan los responsables; no se presenta como testimonio de Alma ni se utilizan sus datos.',
        consequence: [
          l(
            'narracion',
            'La ilustración no utiliza la fotografía, el rostro o la historia de Alma como referencia, ni afirma resultados individuales.',
            false,
          ),
        ],
        feedback:
          'Una alternativa segura no consiste en reconstruir con IA a una persona que no desea exposición. La publicación nueva no se necesita para reparar el caso.',
        outcome: { type: 'avanza', next: 'M6_CONTENIDO_ALTERNATIVO' },
      },
      {
        id: 'M6_D08-D',
        guionLetter: 'D',
        label: 'Pedimos a Alma que firme otro permiso y continúe con la campaña.',
        consequence: [SE_DETIENE()],
        feedback:
          'No utilices una nueva firma ni el calendario para presionar. Una revisión de consentimiento no es una obligación de producir contenido.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M6_NO_REPUBLICAR: Scene = {
  id: 'M6_NO_REPUBLICAR',
  rama: 'desenlace:no-republicar',
  title: 'No volver a publicar',
  setting: 'Espacio de coordinación.',
  characters: ['elena'],
  variationLabel: 'Desenlace: no republicar',
  intro: [
    l(
      'elena',
      'No publicaremos una pieza sobre esa experiencia. Una campaña puede cambiar; la niña no tiene que aportar otro relato o imagen.',
    ),
  ],
  decision: { kind: 'continuar', id: 'M6_DNOR', label: ED.botonContinuar, next: 'M6_E09' },
};

const M6_CONTENIDO_ALTERNATIVO: Scene = {
  id: 'M6_CONTENIDO_ALTERNATIVO',
  rama: 'desenlace:contenido-alternativo',
  title: 'Contenido general e independiente',
  setting: 'Espacio de coordinación con el boceto de una ilustración general.',
  characters: ['valeria'],
  variationLabel: 'Desenlace: contenido alternativo',
  intro: [
    l(
      'valeria',
      'La pieza será general, independiente de la historia y revisada antes de publicarse. No usaremos detalles ni una imagen generada a partir de la foto retirada.',
    ),
  ],
  decision: { kind: 'continuar', id: 'M6_DALT', label: ED.botonContinuar, next: 'M6_E09' },
};

const M6_E09: Scene = {
  id: 'M6_E09',
  title: 'Revisar las copias de trabajo',
  setting: 'Interfaz genérica de una carpeta de campaña ficticia.',
  characters: [],
  intro: [l('narracion', 'El equipo detecta que la imagen figuraba también en una carpeta de campaña y en una pieza programada.')],
  designNote:
    'No afirmar que existe un mecanismo institucional concreto de etiquetado si no se ha confirmado. Se puede proponer una marca interna de no uso con acceso restringido, sin convertirla en una lista pública de personas afectadas.',
  decision: {
    kind: 'choice',
    id: 'M6_D09',
    prompt: '¿Qué corresponde?',
    options: [
      {
        id: 'M6_D09-A',
        guionLetter: 'A',
        label: 'Como ya se retiró el post, no revisamos otros usos.',
        consequence: [],
        feedback: 'Piezas programadas y copias de trabajo podrían volver a publicarlo.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M6_D09-B',
        guionLetter: 'B',
        label: 'Elimino todo, incluido el permiso original, para evitar dudas.',
        consequence: [SE_DETIENE()],
        feedback: 'No destruyas documentación ni registros necesarios. La conservación y eliminación tienen responsables y requisitos.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M6_D09-C',
        guionLetter: 'C',
        label:
          'Comunico a los responsables los usos conocidos para detener reutilizaciones, revisar acceso y separar contenido no publicable de registros que deban conservarse de forma restringida. No hago copias personales.',
        consequence: [],
        feedback:
          'Distingues impedir la reutilización de destruir todo rastro. Los responsables coordinan archivos, versiones y conservación conforme a reglas aplicables.',
        outcome: { type: 'avanza', next: 'M6_E10' },
      },
    ],
  },
};

const M6_E10: Scene = {
  id: 'M6_E10',
  title: '¿Ya está resuelto?',
  setting: 'Espacio de coordinación.',
  characters: ['valeria'],
  intro: [
    l(
      'valeria',
      'La publicación propia se retiró y enviamos solicitudes sobre las copias conocidas. ¿Marcamos que el caso está cerrado?',
      true,
      'pensativa',
    ),
  ],
  ficha: {
    titulo: 'Estado de la exposición (simulación)',
    filas: [
      { aspecto: 'Contenido propio', estado: 'contenido_restringido' },
      { aspecto: 'Copias conocidas', estado: 'copias_en_gestion' },
      { aspecto: 'Seguimiento y apoyos para Alma', estado: 'seguimiento_asignado' },
    ],
  },
  decision: {
    kind: 'choice',
    id: 'M6_D10',
    prompt: '¿Qué respuesta es adecuada?',
    options: [
      {
        id: 'M6_D10-A',
        guionLetter: 'A',
        label: 'Sí; retirar la imagen demuestra que no queda riesgo.',
        consequence: [],
        feedback: 'El retiro no demuestra ausencia de copias, afectaciones o riesgos. No equivale a cierre.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M6_D10-B',
        guionLetter: 'B',
        label:
          'Registro solo las acciones asignadas y confirmadas, con lo pendiente y lo desconocido. El Referente coordina seguimiento seguro, apoyos y valoración de cierre. Revisamos el proceso editorial para evitar repetición sin divulgar la historia.',
        consequence: [],
        feedback:
          'Distingues contención, seguimiento y cierre. Las medidas de aprendizaje pueden darse sin narrar el caso en espacios amplios.',
        outcome: { type: 'avanza', next: 'CIERRE' },
      },
      {
        id: 'M6_D10-C',
        guionLetter: 'C',
        label: 'Pido a Alma que diga públicamente que todo está bien para poder cerrar.',
        consequence: [SE_DETIENE()],
        feedback: 'La niña no tiene que certificar la reparación ni producir una declaración pública.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const scenes: Record<SceneId, Scene> = {
  M6_E01,
  M6_E02,
  M6_E03,
  M6_E04,
  M6_E05,
  M6_E06,
  M6_E07,
  M6_E08,
  M6_NO_REPUBLICAR,
  M6_CONTENIDO_ALTERNATIVO,
  M6_E09,
  M6_E10,
};

export const episodio6: Episode = {
  id: 'm6-una-imagen-que-no-debio-publicarse',
  ruta: 'm6',
  rotulo: 'Módulo 6',
  number: 6,
  title: 'Una imagen que no debió publicarse',
  subtitle: 'Uso seguro de imágenes, participación y respuesta ante exposición pública',
  version: '1.0',
  claveAlmacen: 'dqp:progreso:m6-una-imagen-que-no-debio-publicarse',
  guionArchivo: '^Guion_Modulo_6_.*\\.md$',
  start: 'M6_E01',
  scenes,
  order: [
    'M6_E01',
    'M6_E02',
    'M6_E03',
    'M6_E04',
    'M6_E05',
    'M6_E06',
    'M6_E07',
    'M6_E08',
    'M6_NO_REPUBLICAR',
    'M6_CONTENIDO_ALTERNATIVO',
    'M6_E09',
    'M6_E10',
  ],
  closing: {
    lines: [
      l(
        'alma',
        'Quiero seguir viniendo a las actividades. Me ayudó que escucharan lo que me preocupaba y que no me pidieran hacer otro video.',
      ),
      l('elena', 'Revisaremos cómo explicamos los permisos y cómo valoramos la seguridad antes de publicar.'),
      l(
        'narracion',
        'Se coordinó el retiro o restricción del contenido propio, se actuó sobre copias conocidas por los mecanismos disponibles, se escuchó a Alma y se mantienen las acciones de seguimiento. No se promete que todas las copias desaparecieron.',
      ),
    ],
    variantes: [
      {
        siVisitada: 'M6_NO_REPUBLICAR',
        lines: [l('narracion', 'La pieza vinculada a la experiencia individual no se vuelve a publicar.')],
      },
      {
        siVisitada: 'M6_CONTENIDO_ALTERNATIVO',
        lines: [
          l(
            'narracion',
            'Se prepara una pieza general independiente, con revisión, sin usar la imagen ni la historia de Alma.',
          ),
        ],
      },
    ],
    variantesAlFinal: true,
    contribution:
      'Poder publicar no significa que sea seguro hacerlo. La dignidad, la participación y la protección guían el uso de imágenes.',
    reflection: [
      '¿Qué podría revelar el contexto de una foto?',
      '¿Cómo escucharía una negativa?',
      '¿Sé detener una reutilización sin destruir registros?',
      '¿Qué alternativa permite comunicar sin exponer?',
    ],
  },
  badges: [
    {
      id: 'm6-mirada-protectora',
      name: 'Mirada protectora',
      description: 'Completaste D01 a D03 llegando a la respuesta adecuada o a su corrección.',
      decisions: ['M6_D01', 'M6_D02', 'M6_D03'],
    },
    {
      id: 'm6-contencion-cuidado',
      name: 'Contención con cuidado',
      description: 'Completaste D04 a D07 llegando a la respuesta adecuada o a su corrección.',
      decisions: ['M6_D04', 'M6_D05', 'M6_D06', 'M6_D07'],
    },
    {
      id: 'm6-comunicar-sin-exponer',
      name: 'Comunicar sin exponer',
      description: 'Completaste D08 a D10, en cualquiera de las dos rutas válidas.',
      decisions: ['M6_D08', 'M6_D09', 'M6_D10'],
    },
  ],
  portada: {
    lead: 'Una imagen cotidiana puede revelar más de lo que parece. Practica cómo proteger cuando una publicación ya está en circulación.',
    aviso:
      'Todas las personas y publicaciones son ficticias. No subas fotografías, capturas o relatos reales. Puedes pausar, salir o usar lectura equivalente.',
    rolPregunta: ED.rolPregunta,
    roles: {
      cf: 'Personal técnico de ChildFund Ecuador',
      socio: 'Personal técnico de una organización socia',
    },
    rolMensaje:
      'Puedes comunicar el riesgo y pedir contención. No necesitas identificar una infracción jurídica, demostrar daño ni resolver por tu cuenta una difusión en internet.',
    rolNotas: {
      cf: 'En ChildFund, activar Punto Focal y responsables de la cuenta conforme a la estructura aplicable.',
      socio: 'En socio, activar su mecanismo y articular con el Punto Focal de ChildFund.',
    },
  },
  herramientas: ['m6-decisiones', 'm6-revision', 'm6-preocupacion', 'm6-copias', 'm6-comunicacion', 'm6-alternativas', 'm6-archivo'],
  evaluacion: { config: configEvaluacion, preguntas, textos: textosResultado, notaUmbral },
  textosEditoriales: Object.values(ED),
};

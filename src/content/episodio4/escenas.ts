// Módulo 4 — «La información también protege». Guion versión 1.0 para revisión institucional.
// Los diálogos marcados literal: true se copian sin parafrasear del guion.
// Los textos con literal: false convierten indicaciones de pantalla en narración; los textos redactados
// para el juego figuran en textosEditoriales. Ambos se registran en docs/cambios-editoriales.md.
// Todos los IDs llevan el prefijo M4_. Los documentos y mensajes son ficticios: los datos sensibles del chat
// se representan solo por su tipo y nunca se incluyen en el DOM, el texto alternativo ni los registros.

import type { Episode, Line, Pose, Scene, SceneId, Speaker } from '../types';
import { configEvaluacion, notaUmbral, preguntas, textosResultado } from './evaluacion';

let seq = 0;
const l = (speaker: Speaker, text: Line['text'], literal = true, pose?: Pose): Line => ({
  id: `M4_L${++seq}`,
  speaker,
  text,
  literal,
  ...(pose ? { pose } : {}),
});

const PAUSA = 'Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.';
const SE_DETIENE = () => l('narracion', 'El ejercicio se detiene antes del envío. No se comparte ningún dato.', false);

const D01_B_TEXT =
  'Aclaramos qué necesita el informe, para qué y quién lo recibirá. Solicito al responsable una versión mínima y autorizada; no envío el expediente.';

// Textos redactados para el juego (el guion no los define): no se comparan con el guion.
const ED = {
  rolPregunta: '¿Desde qué rol actuarás?',
  d04Prompt: 'Para cada solicitud ficticia, elige la acción autorizable. Son propuestas que evalúa el responsable, no permisos que concedes.',
  d04Incorrecta:
    'Revisa la finalidad, el mínimo necesario y la autorización de las solicitudes marcadas. Puedes corregir y comprobar de nuevo.',
  botonContencion: 'Continuar',
  chatTitulo: 'SIMULACIÓN. Chat ficticio de coordinación',
  chatMensaje: 'Comparto el avance del informe:',
};

const M4_E01: Scene = {
  id: 'M4_E01',
  title: '«Mándame el expediente completo»',
  setting: 'Reunión de planificación con documentos ficticios sobre la mesa.',
  characters: ['elena'],
  intro: [
    l(
      'elena',
      'Estoy preparando un informe de avances. Para no pedirte varios datos, envíame el expediente completo y yo selecciono lo que sirve.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M4_D01',
    prompt: '¿Cómo respondes?',
    options: [
      {
        id: 'M4_D01-A',
        guionLetter: 'A',
        label: 'Lo envío, porque Elena trabaja en la misma organización.',
        consequence: [SE_DETIENE()],
        feedback:
          'La pertenencia institucional no sustituye una necesidad justificada ni autorización. Un expediente contiene información ajena al propósito de un informe general.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D01-B',
        guionLetter: 'B',
        label: D01_B_TEXT,
        consequence: [
          l('elena', 'Necesito describir medidas de mejora y seguimiento general, no identificar a las personas.'),
        ],
        feedback: 'Definir finalidad y destinatarios permite preparar información pertinente.',
        outcome: { type: 'avanza', next: 'M4_E02' },
      },
      {
        id: 'M4_D01-C',
        guionLetter: 'C',
        label: 'No compartimos información de salvaguarda con nadie, aunque deba actuar.',
        consequence: [],
        feedback:
          'La confidencialidad no significa paralizar la respuesta. Se comparte información necesaria con personas autorizadas para una finalidad concreta.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M4_E02',
          repair: [l('tu', D01_B_TEXT)],
          repairFollowUp: [
            l('elena', 'Necesito describir medidas de mejora y seguimiento general, no identificar a las personas.'),
          ],
        },
      },
    ],
  },
};

const M4_E02: Scene = {
  id: 'M4_E02',
  title: '«Formo parte del SIMT»',
  setting: 'Interfaz genérica de un repositorio ficticio, con la carpeta «SG-DEMO-04».',
  characters: ['referente'],
  intro: [
    l(
      'simt',
      'Como pertenezco al equipo de gestión de incidentes, necesito que me agregues a la carpeta completa.',
    ),
  ],
  designNote:
    'La persona jugadora no decide si la persona tiene o no una función necesaria; encauza esa valoración a quien autoriza. No se presenta la jerarquía como sustituto del proceso.',
  decision: {
    kind: 'choice',
    id: 'M4_D02',
    prompt: '¿Qué criterio aplicas?',
    options: [
      {
        id: 'M4_D02-A',
        guionLetter: 'A',
        label:
          'Solicito que se precise la intervención necesaria y remito al Punto Focal para definir acceso, alcance y registro según la función. No amplío permisos por mi cuenta.',
        consequence: [
          l('referente', 'La participación es selectiva. Si una tarea requiere información, se autoriza lo necesario para realizarla.'),
        ],
        feedback: 'Pertenecer al SIMT no concede acceso general. La necesidad se revisa por caso, tarea y finalidad.',
        sourceNote:
          'La pertenencia al SIMT no implica acceso automático a toda la información de los casos; cada integrante accede solo a lo estrictamente necesario para sus funciones (Plan de Salvaguarda FY2026, anexos 1 y 6). Todo acceso se justifica y se registra (Protocolo de asistencia y derivación, 10.2 y 10.5.1).',
        outcome: { type: 'avanza', next: 'M4_E03' },
      },
      {
        id: 'M4_D02-B',
        guionLetter: 'B',
        label: 'Le concedo acceso porque todas las personas del SIMT deben conocer todo.',
        consequence: [SE_DETIENE()],
        feedback: 'La fuente institucional establece expresamente lo contrario.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D02-C',
        guionLetter: 'C',
        label: 'Le doy acceso de lectura; así no podrá divulgar.',
        consequence: [],
        feedback:
          'El permiso de lectura también expone información y puede permitir copias, capturas o inferencias. Debe justificarse.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const M4_E03: Scene = {
  id: 'M4_E03',
  title: 'Quitar el nombre no siempre basta',
  setting: 'Mesa con un borrador ficticio del informe.',
  characters: ['elena'],
  intro: [
    l(
      'narracion',
      'Elena propone usar un breve ejemplo sin nombre. Debes identificar qué puede permitir reconocer a alguien.',
    ),
    l(
      'documento',
      'Una participante de 15 años, única integrante de su comunidad en el taller del martes, llegó acompañada por su tía y fue derivada a un servicio especializado.',
    ),
  ],
  designNote:
    'No presentar cifras pequeñas de casos o desgloses por comunidad como automáticamente seguros. No inventar resultados reales ni afirmar que esa mejora ocurrió en ChildFund; toda la escena es ficticia.',
  decision: {
    kind: 'choice',
    id: 'M4_D03',
    prompt: '¿Qué observas?',
    options: [
      {
        id: 'M4_D03-A',
        guionLetter: 'A',
        label: 'Es anónimo porque no tiene nombre.',
        consequence: [],
        feedback: 'La combinación de edad, lugar, fecha, singularidad y vínculo puede identificar a la persona.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M4_D03-B',
        guionLetter: 'B',
        label: 'Sustituyo el nombre por iniciales y dejo los demás detalles.',
        consequence: [],
        feedback: 'Iniciales o un código no eliminan la posibilidad de reconocimiento.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M4_D03-C',
        guionLetter: 'C',
        label:
          'Elimino o generalizo detalles innecesarios y reviso si el contexto aún identifica. Para este informe uso información sobre mejoras institucionales sin narrar una historia individual.',
        consequence: [
          l('narracion', 'Versión propuesta para revisión:', false),
          l('documento', 'Se revisaron barreras de acceso a servicios y se acordaron mejoras de coordinación y seguimiento.'),
        ],
        feedback:
          'Se conserva el aprendizaje sin convertir una experiencia individual en material de difusión. El responsable debe revisar la versión y su destinatario.',
        outcome: { type: 'avanza', next: 'M4_E04' },
      },
    ],
  },
};

const M4_E04: Scene = {
  id: 'M4_E04',
  title: 'Elegir qué necesita cada función',
  setting: 'Bandeja ficticia con tres solicitudes de información.',
  characters: [],
  intro: [],
  decision: {
    kind: 'solicitudes',
    id: 'M4_D04',
    prompt: ED.d04Prompt,
    simulationLabel: 'SIMULACIÓN. Solicitudes ficticias: no se envía ningún dato',
    solicitudes: [
      {
        id: 'M4_D04-S1',
        titulo: 'Solicitud 1: logística necesita apoyar un traslado.',
        opciones: [
          { id: 'M4_D04-S1-A', guionLetter: 'A', texto: 'Entregar la historia de violencia y los datos de toda la familia.', correcta: false },
          {
            id: 'M4_D04-S1-B',
            guionLetter: 'B',
            texto:
              'Coordinar con el responsable los datos operativos mínimos para la tarea autorizada, protegiendo motivos y detalles innecesarios.',
            correcta: true,
          },
        ],
        explicacion:
          'Puede ser necesaria información concreta de identificación o apoyo para un traslado seguro, pero no por eso todo el expediente. El contenido exacto lo define el responsable con finalidad y restricciones.',
      },
      {
        id: 'M4_D04-S2',
        titulo: 'Solicitud 2: dirección requiere información para una decisión institucional.',
        opciones: [
          {
            id: 'M4_D04-S2-A',
            guionLetter: 'A',
            texto:
              'Remitir por el responsable el resumen pertinente al propósito, con acceso y registro conforme a la función; ampliar solo si hay una necesidad específica autorizada.',
            correcta: true,
          },
          { id: 'M4_D04-S2-B', guionLetter: 'B', texto: 'Copiar siempre el expediente íntegro porque la jerarquía basta.', correcta: false },
        ],
        explicacion: 'Gobernanza y toma de decisiones no implican distribución indiscriminada.',
      },
      {
        id: 'M4_D04-S3',
        titulo: 'Solicitud 3: una persona externa solicita un caso «conmovedor» para una presentación.',
        opciones: [
          { id: 'M4_D04-S3-A', guionLetter: 'A', texto: 'Enviar un relato con iniciales.', correcta: false },
          {
            id: 'M4_D04-S3-B',
            guionLetter: 'B',
            texto:
              'Remitir la solicitud al canal responsable y ofrecer, si corresponde, contenido ficticio o aprendizaje agregado revisado, sin facilitar datos del caso.',
            correcta: true,
          },
        ],
        explicacion: 'El interés narrativo no crea una necesidad de acceso.',
      },
    ],
    incorrectMessage: ED.d04Incorrecta,
    successText:
      'Las funciones reciben información diferente; mínimo no significa siempre cero datos, ni autorización significa acceso ilimitado.',
    next: 'M4_E05',
  },
};

const M4_E05: Scene = {
  id: 'M4_E05',
  title: 'El canal también importa',
  setting: 'Interfaz genérica de un repositorio ficticio con opciones de permisos.',
  characters: ['elena'],
  intro: [
    l(
      'elena',
      'Necesito el resumen hoy. Envíamelo a mi correo personal, porque desde aquí no abro la carpeta institucional.',
      true,
      'pensativa',
    ),
  ],
  consultas: [
    {
      titulo: 'Tarjeta de contraste: herramientas externas',
      lines: [
        l(
          'narracion',
          'No copiar datos de un caso en herramientas públicas de IA, formularios externos o servicios no autorizados para resumirlos. Un texto sin nombre puede seguir siendo identificable.',
          false,
        ),
        l('narracion', 'Esta tarjeta aplica el criterio de canales aprobados; no describe la política de un producto concreto.', false),
      ],
    },
  ],
  decision: {
    kind: 'choice',
    id: 'M4_D05',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'M4_D05-A',
        guionLetter: 'A',
        label: 'Uso el correo personal para no retrasarnos.',
        consequence: [SE_DETIENE()],
        feedback: 'La urgencia de un informe no autoriza un canal personal para información sensible.',
        sourceNote:
          'No se usan correos personales, mensajería no institucional ni dispositivos no seguros para compartir información sensible (Protocolo de asistencia y derivación, 10.2 y 10.5, paso 4).',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D05-B',
        guionLetter: 'B',
        label: 'Comparto un enlace configurado como accesible para cualquiera que lo tenga.',
        consequence: [SE_DETIENE()],
        feedback:
          'Un enlace no es seguro solo por estar alojado en un repositorio institucional. Deben estar definidos los permisos y destinatarios.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D05-C',
        guionLetter: 'C',
        label:
          'Utilizo el mecanismo aprobado, verifico destinatarios y permisos y solicito soporte si hay un problema de acceso. No creo una copia personal ni amplío el acceso para resolverlo.',
        consequence: [],
        feedback:
          'Contenido, destinatario, canal y configuración deben ser apropiados. Si no se puede compartir de forma segura, se coordina una alternativa autorizada.',
        outcome: { type: 'avanza', next: 'M4_E06' },
      },
    ],
  },
};

const M4_E06: Scene = {
  id: 'M4_E06',
  title: 'Un fragmento aparece en el chat',
  setting: 'Chat amplio de coordinación, completamente ficticio, con el contenido sensible oculto.',
  characters: ['elena'],
  intro: [
    l(
      'narracion',
      'Mientras se resuelve el acceso, llega un mensaje al chat amplio de coordinación. Contiene un enlace de permisos demasiado abiertos y un fragmento que puede identificar a una persona. Lo publicó Elena por error. No sabes quién lo abrió o copió.',
    ),
    l('elena', 'Me equivoqué de chat. ¿Lo borro y seguimos?', true, 'pensativa'),
  ],
  chat: {
    titulo: ED.chatTitulo,
    mensajes: [
      {
        autor: 'Elena',
        partes: [
          ED.chatMensaje,
          { oculto: 'enlace con permisos abiertos' },
          { oculto: 'edad' },
          { oculto: 'comunidad' },
          { oculto: 'fecha' },
          { oculto: 'vínculo familiar' },
        ],
      },
    ],
  },
  decision: {
    kind: 'choice',
    id: 'M4_D06',
    prompt: '¿Cuál es la primera respuesta adecuada?',
    complementaryNote:
      'Si se detecta peligro inmediato para alguien, la coordinación de protección y la respuesta de emergencia no esperan concluir un análisis informático. No toda exposición se declara automáticamente como un determinado nivel de salvaguarda; se comunica y se valora por roles competentes.',
    options: [
      {
        id: 'M4_D06-A',
        guionLetter: 'A',
        label: 'Si se borra, no hace falta comunicarlo.',
        consequence: [],
        feedback:
          'La eliminación visible no demuestra que no existan accesos, copias o exposición. No ocultes el incidente.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M4_D06-B',
        guionLetter: 'B',
        label:
          'No reenvío, no amplío la exposición y aviso inmediatamente por el mecanismo autorizado al Punto Focal y al soporte competente según la ruta, para coordinar contención y valorar riesgos.',
        consequence: [
          l(
            'tu',
            'Podemos corregirlo sin seguir circulando la información. Comuniquemos lo que pasó y pidamos apoyo por el canal autorizado.',
          ),
        ],
        feedback:
          'Un error requiere respuesta y trazabilidad. Comunicar hechos no equivale a señalar culpabilidad ni imponer sanciones.',
        outcome: { type: 'avanza', next: 'M4_E07' },
      },
      {
        id: 'M4_D06-C',
        guionLetter: 'C',
        label: 'Hago una captura completa y la envío a todo el equipo para advertir.',
        consequence: [SE_DETIENE()],
        feedback: 'La advertencia volvería a divulgar el contenido. No crees ni circules copias innecesarias.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D06-D',
        guionLetter: 'D',
        label: 'Pregunto públicamente quién lo vio y si reconoció a la persona.',
        consequence: [SE_DETIENE()],
        feedback:
          'Puede aumentar la identificación y la difusión. La valoración técnica corresponde a responsables autorizados.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M4_E07: Scene = {
  id: 'M4_E07',
  title: 'Contener sin ocultar ni investigar',
  setting: 'Reunión breve con el soporte autorizado por un canal institucional.',
  characters: [],
  intro: [
    l(
      'soporte',
      'Necesitamos saber qué recurso se compartió, por qué canal y qué acceso estaba habilitado. Revisaremos las posibilidades de restricción y los registros conforme a nuestras atribuciones.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M4_D07',
    prompt: '¿Cómo colaboras?',
    options: [
      {
        id: 'M4_D07-A',
        guionLetter: 'A',
        label:
          'Identifico por la vía restringida el recurso y el mensaje, la hora conocida, el canal, los tipos de datos y las acciones ya realizadas. No descargo copias ni inspecciono cuentas ajenas. Ejecuto solo las medidas de contención que estoy autorizado a realizar.',
        consequence: [],
        feedback:
          'Aportas datos operativos y separas lo conocido de lo desconocido. Los responsables coordinan reducción de exposición y conservación autorizada de registros.',
        outcome: { type: 'avanza', next: 'M4_CONTENCION' },
      },
      {
        id: 'M4_D07-B',
        guionLetter: 'B',
        label: 'Descargo todo el expediente y los registros para guardarlos en mi computadora personal como prueba.',
        consequence: [SE_DETIENE()],
        feedback:
          'Genera nuevas copias y excede el rol. La preservación necesaria la coordinan las personas autorizadas por medios aprobados.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D07-C',
        guionLetter: 'C',
        label: 'Elimino mensajes, archivos e historial por mi cuenta para que no quede rastro.',
        consequence: [SE_DETIENE()],
        feedback:
          'Borrar para ocultar no es contención. No alteres registros ni destruyas información que deba conservarse.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M4_CONTENCION: Scene = {
  id: 'M4_CONTENCION',
  title: 'Acciones de los responsables',
  setting: 'Ficha ficticia del estado de la exposición.',
  characters: ['referente'],
  intro: [
    l(
      'narracion',
      'Los responsables coordinan restringir el enlace y revisar accesos. Deciden cómo retirar la publicación expuesta y conservar los registros necesarios por mecanismos autorizados, sin mantener abierto un enlace inseguro por esperar una investigación completa.',
    ),
    l('narracion', 'Aviso mínimo al grupo, solo porque lo indica el responsable:', false),
    l(
      'documento',
      'Se compartió un recurso por error. No lo abras, copies ni reenvíes. Sigue las indicaciones que recibirás por el canal institucional.',
    ),
    l(
      'narracion',
      'El aviso no declara que todas las copias fueron eliminadas ni repite nombres, contenido o detalles que permitan identificar. El tratamiento de las copias se coordina según el procedimiento y las necesidades de preservación.',
      false,
    ),
  ],
  ficha: {
    titulo: 'Estado de la exposición (simulación)',
    filas: [
      { aspecto: 'Comunicación al Punto Focal y al soporte autorizado', estado: 'comunicada' },
      { aspecto: 'Enlace y publicación expuestos: exposición contenida parcialmente', estado: 'contencion_en_curso' },
      { aspecto: 'Alcance: accesos y posibles copias', estado: 'riesgo_en_evaluacion' },
    ],
  },
  decision: {
    kind: 'continuar',
    id: 'M4_DCON',
    label: ED.botonContencion,
    note: 'Revocar un enlace no equivale a «todo resuelto»: el alcance sigue en evaluación.',
    next: 'M4_E08',
  },
};

const M4_E08: Scene = {
  id: 'M4_E08',
  title: '¿Hay que avisar a la persona?',
  setting: 'Sala de coordinación.',
  characters: ['elena', 'referente'],
  intro: [
    l(
      'elena',
      'Me preocupa que esa información permita reconocer a alguien. ¿Le escribo ahora para explicarlo todo?',
      true,
      'pensativa',
    ),
  ],
  designNote:
    'No se promete confidencialidad absoluta ni recuperación de todas las copias. No se afirma un deber legal o plazo de notificación específico sin validación. Los roles competentes documentan las decisiones y fundamentos.',
  decision: {
    kind: 'choice',
    id: 'M4_D08',
    prompt: '¿Qué corresponde desde tu rol?',
    options: [
      {
        id: 'M4_D08-A',
        guionLetter: 'A',
        label: 'Contactarla por el número que aparecía en el archivo y explicarle el incidente.',
        consequence: [SE_DETIENE()],
        feedback:
          'No conoces si ese canal es seguro ni tienes una función asignada para esa comunicación. Puede crear otra exposición.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D08-B',
        guionLetter: 'B',
        label: 'Decidir que no se le informará para no preocuparla.',
        consequence: [],
        feedback:
          'No corresponde ocultar ni decidir por cuenta propia sobre derechos, seguridad y obligaciones de información.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M4_D08-C',
        guionLetter: 'C',
        label:
          'Comunicar el riesgo al Punto Focal para que coordine con las funciones competentes la protección, la valoración de obligaciones y, cuando corresponda, una comunicación clara por un medio seguro.',
        consequence: [
          l(
            'referente',
            'Se valorarán riesgos de identificación, represalias y contacto, así como las medidas necesarias. La información a la persona y cualquier notificación externa se coordinarán conforme a las obligaciones aplicables. No esperaremos innecesariamente a cerrar la investigación técnica para atender seguridad.',
          ),
        ],
        feedback:
          'La persona afectada está en el centro de la respuesta, pero no se improvisa un contacto que pueda ponerla en peligro.',
        outcome: { type: 'avanza', next: 'M4_E09' },
      },
    ],
  },
};

const M4_E09: Scene = {
  id: 'M4_E09',
  title: '«Fui yo quien lo envió»',
  setting: 'Variación hipotética, sin escenario.',
  characters: [],
  variationLabel: 'Variación hipotética',
  intro: [l('narracion', 'Imagina que tú, y no Elena, hubieras enviado por error el enlace.')],
  designNote:
    'No se registra esta decisión de práctica como confesión o indicador de conducta real. La variación no cambia retroactivamente los hechos de la historia principal.',
  decision: {
    kind: 'choice',
    id: 'M4_D09',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'M4_D09-A',
        guionLetter: 'A',
        label: 'Espero a ver si alguien lo menciona; si no, no hubo problema.',
        consequence: [],
        feedback:
          'El silencio de destinatarios no demuestra ausencia de exposición. Esperar puede retrasar protección y contención.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M4_D09-B',
        guionLetter: 'B',
        label:
          'Comunico inmediatamente el error por el mecanismo autorizado, con hechos y acciones realizadas. No escondo, culpo a otra persona ni trato de investigar por mi cuenta.',
        consequence: [],
        feedback:
          'La transparencia permite actuar. La rendición de cuentas se aplica mediante procesos justos; el juego no promete ausencia de consecuencias ni presenta una sanción automática.',
        outcome: { type: 'avanza', next: 'M4_E10' },
      },
      {
        id: 'M4_D09-C',
        guionLetter: 'C',
        label: 'Pido a una colega que diga que ella lo envió para evitar problemas.',
        consequence: [SE_DETIENE()],
        feedback: 'Trasladar la responsabilidad u ocultar lo ocurrido impide una respuesta adecuada.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
  outro: [l('narracion', 'Termina la variación hipotética. En la historia principal, el mensaje lo envió Elena.', false)],
};

const M4_E10: Scene = {
  id: 'M4_E10',
  title: 'Cierre no significa borrado inmediato',
  setting: 'Mesa de trabajo con una tarea ficticia de aprendizaje general.',
  characters: [],
  intro: [
    l(
      'narracion',
      'Tiempo después, recibes una tarea autorizada de aprendizaje general. Alguien pregunta si ya puede borrarse todo lo relacionado con el caso y la exposición.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M4_D10',
    prompt: '¿Qué criterio aplicas?',
    options: [
      {
        id: 'M4_D10-A',
        guionLetter: 'A',
        label: 'Borrar todos los archivos inmediatamente porque el caso se cerró.',
        consequence: [SE_DETIENE()],
        feedback: 'El cierre no elimina requisitos de conservación ni posibles necesidades legales o investigativas.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D10-B',
        guionLetter: 'B',
        label: 'Conservar copias personales para protegerme si hay preguntas.',
        consequence: [SE_DETIENE()],
        feedback: 'Las copias personales no son un archivo autorizado y prolongan la exposición.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M4_D10-C',
        guionLetter: 'C',
        label:
          'Remitir a los responsables para aplicar conservación y eliminación autorizadas y documentadas, respetando obligaciones pendientes. Para aprendizaje, usar solo información mínima revisada que no permita identificar.',
        consequence: [],
        feedback:
          'La eliminación es un proceso, no una decisión improvisada. Debe considerar copias y respaldos según las capacidades y reglas del sistema; no se promete borrado total instantáneo.',
        sourceNote:
          'La eliminación tras el cierre se aplica cumplidos los plazos institucionales y la normativa nacional, autorizada por el PEP y registrada; solo se conserva información agregada sin datos identificables (Protocolo de asistencia y derivación, 10.4).',
        outcome: { type: 'avanza', next: 'CIERRE' },
      },
    ],
  },
};

const scenes: Record<SceneId, Scene> = {
  M4_E01,
  M4_E02,
  M4_E03,
  M4_E04,
  M4_E05,
  M4_E06,
  M4_E07,
  M4_CONTENCION,
  M4_E08,
  M4_E09,
  M4_E10,
};

export const episodio4: Episode = {
  id: 'm4-la-informacion-tambien-protege',
  ruta: 'm4',
  rotulo: 'Módulo 4',
  number: 4,
  title: 'La información también protege',
  subtitle: 'Confidencialidad, necesidad de conocimiento y respuesta ante una exposición',
  version: '1.0',
  claveAlmacen: 'dqp:progreso:m4-la-informacion-tambien-protege',
  guionArchivo: '^Guion_Modulo_4_.*\\.md$',
  start: 'M4_E01',
  scenes,
  order: [
    'M4_E01',
    'M4_E02',
    'M4_E03',
    'M4_E04',
    'M4_E05',
    'M4_E06',
    'M4_E07',
    'M4_CONTENCION',
    'M4_E08',
    'M4_E09',
    'M4_E10',
  ],
  closing: {
    lines: [
      l('elena', 'El informe podía hacerse sin un expediente. Ahora entiendo que incluso un enlace necesita permisos apropiados.'),
      l(
        'referente',
        'Se coordinó la contención, se mantiene la valoración de riesgos y se registraron las acciones. Solo las personas necesarias participan en el seguimiento.',
      ),
      l(
        'narracion',
        'No determinaste culpabilidad, revisaste dispositivos ni declaraste el caso resuelto. Contribuiste a evitar nuevas exposiciones y a activar una respuesta responsable.',
      ),
    ],
    contribution:
      'Antes de compartir: propósito, mínimo, destinatario, autorización y canal. Si ocurre un error: no lo amplifiques, comunícalo y colabora dentro de tu rol.',
    reflection: [
      '¿Estoy solicitando información que necesito o que me interesa?',
      '¿Podría reconocerse a alguien aunque quite su nombre?',
      '¿Sé qué hacer si el envío equivocado fuera mío?',
    ],
  },
  badges: [
    {
      id: 'm4-necesidad-conocimiento',
      name: 'Necesidad de conocimiento',
      description: 'Completaste D01 a D04 llegando a la respuesta adecuada o a su corrección.',
      decisions: ['M4_D01', 'M4_D02', 'M4_D03', 'M4_D04'],
    },
    {
      id: 'm4-compartir-cuidado',
      name: 'Compartir con cuidado',
      description: 'Completaste D05 a D07: canales, contención y roles.',
      decisions: ['M4_D05', 'M4_D06', 'M4_D07'],
    },
    {
      id: 'm4-respuesta-responsable',
      name: 'Respuesta responsable',
      description: 'Completaste D08 a D10 llegando a la respuesta adecuada o a su corrección.',
      decisions: ['M4_D08', 'M4_D09', 'M4_D10'],
    },
  ],
  portada: {
    lead: 'Un dato compartido sin necesidad puede afectar la seguridad de una persona. Practica cómo usar información para proteger.',
    aviso:
      'Este módulo utiliza documentos y mensajes completamente ficticios. No ingreses información real. Puedes pausar, salir o utilizar lectura equivalente.',
    rolPregunta: ED.rolPregunta,
    roles: {
      cf: 'Personal técnico de ChildFund Ecuador',
      socio: 'Personal técnico de una organización socia',
    },
    rolMensaje:
      'Recibir una comunicación no te autoriza a circularla. Una solicitud de alguien conocido tampoco concede acceso por sí sola.',
    rolNotas: {
      cf: 'En ChildFund se activa el Punto Focal y los responsables institucionales pertinentes.',
      socio: 'En el socio se activa el mecanismo propio y se informa/articula con el Punto Focal de ChildFund conforme a la ruta.',
    },
  },
  herramientas: ['m4-compartir', 'm4-identificacion', 'm4-accesos', 'm4-exposicion', 'm4-contener', 'm4-reportar', 'm4-aprendizaje'],
  evaluacion: { config: configEvaluacion, preguntas, textos: textosResultado, notaUmbral },
  textosEditoriales: Object.values(ED),
};

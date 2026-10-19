// Módulo 3 — «Antes de abrir las puertas». Guion versión 1.0 para revisión institucional.
// Los diálogos marcados literal: true se copian sin parafrasear del guion.
// Los textos con literal: false convierten indicaciones de pantalla en narración; los textos redactados
// para el juego figuran en textosEditoriales. Ambos se registran en docs/cambios-editoriales.md.
// Todos los IDs llevan el prefijo M3_. Hay dos ramas válidas: jornada adaptada y jornada suspendida.

import type { Episode, Line, Pose, Scene, SceneId, Speaker } from '../types';
import { configEvaluacion, notaUmbral, preguntas, textosResultado } from './evaluacion';

let seq = 0;
const l = (speaker: Speaker, text: Line['text'], literal = true, pose?: Pose): Line => ({
  id: `M3_L${++seq}`,
  speaker,
  text,
  literal,
  ...(pose ? { pose } : {}),
});

const PAUSA = 'Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.';
const SE_DETIENE = () => l('narracion', 'El ejercicio se detiene antes de ejecutar esta acción.', false);

const D06_B_TEXT =
  'Respetamos su decisión, revisamos permisos y alcance de uso, y organizamos una alternativa sin exposición ni identificación innecesaria. Antes de publicar se verifican riesgos y autorizaciones.';
const D07_B_TEXT =
  'La sustituimos por situaciones ficticias, acordamos cuidado, derecho a pasar y cómo pedir ayuda. No se solicitan relatos personales ni se promete secreto absoluto.';
const D09_C_FEEDBACK = 'El liderazgo adolescente no sustituye supervisión ni transfiere responsabilidad de cuidado.';

// Textos redactados para el juego (el guion no los define): no se comparan con el guion.
const ED = {
  rolPregunta: '¿Desde qué rol actuarás?',
  d03b: 'Consultas a Diego y adaptas con el equipo, sin exponerlo ni improvisar una asistencia física.',
  d08b: 'Respuesta proporcional: inicias solo lo que tiene condiciones verificadas y suspendes lo que no las tiene, con validación de la persona responsable y un plan seguro de salida.',
  d09b: 'Pausas lo afectado y mantienes el cuidado: las condiciones se comprueban durante toda la actividad, no solo al inicio.',
  d09sA: 'Reducimos la supervisión porque solo estamos esperando la salida.',
  d09sAFb: 'Las condiciones de cuidado se mantienen también durante la espera. Que no haya taller no autoriza a reducir la supervisión.',
  d09sB: 'Mantenemos condiciones seguras y coordinamos relevo o reorganización autorizada mientras se organiza la salida.',
  d09sBFb: 'Suspender no termina el deber de cuidado: la supervisión se mantiene hasta la entrega segura.',
  d09sC: 'Encargo a Camila cuidar al grupo hasta que regrese alguien.',
  botonAdaptacion: 'Continuar con la preparación',
  botonInicio: 'Comenzar el taller interior',
  botonSalida: 'Coordinar la salida',
  d10b: 'La actividad termina cuando la salida es segura: verificas por el mecanismo previsto, sin exponer datos y manteniendo el acompañamiento.',
};

const M3_E01: Scene = {
  id: 'M3_E01',
  title: 'La agenda no es el plan de seguridad',
  setting: 'Exterior del centro comunitario ficticio «Encuentro», con materiales preparados y una agenda sin confirmar.',
  characters: ['elena'],
  intro: [
    l(
      'elena',
      'Tenemos el salón, la lista de participantes y los materiales. ¿Qué debemos revisar antes de confirmar?',
      true,
      'pensativa',
    ),
  ],
  ficha: {
    titulo: 'Ficha de trabajo inicial (simulación)',
    filas: [
      { aspecto: 'Espacio: acceso, circulación, salidas y necesidades de apoyo (Elena y equipo)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Supervisión: personal preparado, presencia y distribución suficientes (Elena)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Traslados y salida: condiciones verificadas y entrega autorizada (Nicolás y personal designado)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Participación: información comprensible, voluntariedad y requisitos documentales (equipo facilitador)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Visitantes: autorización, controles, orientación y acompañamiento (responsable de visitas)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Imágenes y datos: alcance del permiso, necesidad y almacenamiento seguro (comunicaciones y responsables)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Respuesta: mecanismos de ayuda, emergencia y reporte conocidos (equipo y Referente según función)', estado: 'pendiente_de_verificar' },
    ],
  },
  designNote: 'No es necesario que una sola persona acumule todas las funciones. Las asignaciones son parte de la simulación.',
  decision: {
    kind: 'choice',
    id: 'M3_D01',
    prompt: '¿Por dónde comienzas?',
    options: [
      {
        id: 'M3_D01-A',
        guionLetter: 'A',
        label: 'La agenda está lista; revisemos los riesgos al final.',
        consequence: [
          l('narracion', 'La ficha muestra pendientes sin responsable: transporte, supervisión, acceso y salida.', false),
        ],
        feedback:
          'Los riesgos se consideran desde la preparación. Un documento de agenda no demuestra que las medidas estén implementadas.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M3_D01-B',
        guionLetter: 'B',
        label:
          'Revisamos riesgos del lugar, personas, actividades, traslados y datos; asignamos medidas, responsables y comprobación antes de iniciar.',
        consequence: [
          l('narracion', 'Se abre la ficha preventiva.', false),
          l('elena', 'Incluyamos qué hacer si cambian las condiciones.'),
        ],
        feedback: 'Conectas cada riesgo con una acción verificable.',
        outcome: { type: 'avanza', next: 'M3_E02' },
      },
      {
        id: 'M3_D01-C',
        guionLetter: 'C',
        label: 'Pedimos a las familias que asuman por escrito cualquier riesgo.',
        consequence: [SE_DETIENE()],
        feedback: 'Una autorización no traslada el deber de cuidado ni elimina condiciones inseguras.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M3_E02: Scene = {
  id: 'M3_E02',
  title: 'Cambió el equipo',
  setting: 'Mesa de coordinación del centro comunitario.',
  characters: ['nicolas', 'elena'],
  intro: [
    l(
      'nicolas',
      'Una facilitadora no puede llegar. Pensé dividir el grupo en dos salas para cumplir el horario. En una quedaría una persona adulta.',
    ),
  ],
  consultas: [
    {
      titulo: '¿Y si el relevo no llega?',
      lines: [
        l(
          'elena',
          'No abrimos una actividad que no podamos supervisar. Mantenemos condiciones seguras de espera y coordinamos reprogramación y salida, sin improvisar nuevas exposiciones.',
        ),
      ],
    },
  ],
  decision: {
    kind: 'choice',
    id: 'M3_D02',
    prompt: '¿Qué propones?',
    options: [
      {
        id: 'M3_D02-A',
        guionLetter: 'A',
        label: 'Dividimos las salas; dejamos las puertas abiertas.',
        consequence: [SE_DETIENE()],
        feedback:
          'La puerta abierta no reemplaza supervisión adecuada ni la regla institucional de dos adultos. Debe revisarse la distribución de personal y las necesidades del grupo.',
        sourceNote:
          'Regla de los «dos adultos»: dos o más personas adultas supervisan todas las actividades y están siempre visibles y presentes (Procedimiento 5.1.3, Protocolo de comportamiento). No fija una proporción para cualquier tamaño de grupo.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D02-B',
        guionLetter: 'B',
        label:
          'Reorganizamos en un espacio común con supervisión adecuada, si la valoración confirma que es seguro; o esperamos un relevo autorizado antes de abrir un segundo grupo.',
        consequence: [
          l(
            'elena',
            'Revisemos capacidad del espacio y funciones. Si no son suficientes, reducimos o reprogramamos esa parte sin dejar a nadie sin cuidado.',
          ),
        ],
        feedback: 'No das por hecho que dos personas bastan. Compruebas condiciones y ajustas el alcance.',
        outcome: { type: 'avanza', next: 'M3_E03' },
      },
      {
        id: 'M3_D02-C',
        guionLetter: 'C',
        label: 'Sumamos a cualquier persona que esté acompañando a su hija para completar el equipo.',
        consequence: [SE_DETIENE()],
        feedback:
          'Estar presente no convierte a alguien en personal autorizado, preparado y sujeto a los controles requeridos.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M3_E03: Scene = {
  id: 'M3_E03',
  title: 'Acceso y participación real',
  setting: 'Plano ilustrado y accesible del salón, con una planta baja y una planta alta.',
  characters: ['diego', 'elena'],
  intro: [
    l(
      'diego',
      'La actividad que propusieron arriba no me resulta accesible. ¿Puedo hacerla aquí con el grupo?',
      true,
      'pensativa',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M3_D03',
    prompt: '¿Cómo respondes?',
    options: [
      {
        id: 'M3_D03-A',
        guionLetter: 'A',
        label: 'Por hoy participas mirando; después lo arreglamos.',
        consequence: [],
        feedback: 'Traslada la barrera al participante y limita su participación.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M3_E03B',
          repair: [l('tu', 'Revisemos contigo qué adaptación permitiría participar con seguridad.')],
        },
      },
      {
        id: 'M3_D03-B',
        guionLetter: 'B',
        label:
          'Consultamos qué necesitas y adaptamos el espacio y la dinámica con el equipo, sin exponerte ni improvisar una asistencia física.',
        consequence: [l('diego', 'Si trabajamos abajo y hay espacio entre mesas, puedo participar.')],
        feedback: ED.d03b,
        feedbackEditorial: true,
        outcome: { type: 'avanza', next: 'M3_E03B' },
      },
      {
        id: 'M3_D03-C',
        guionLetter: 'C',
        label: 'Te cargamos para subir y no retrasar el programa.',
        consequence: [SE_DETIENE()],
        feedback:
          'No improvises movimientos o apoyos físicos. Valora la necesidad, las preferencias y las condiciones seguras con responsables preparados.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M3_E03B: Scene = {
  id: 'M3_E03B',
  title: 'Decisión de adaptación',
  setting: 'Planta baja del salón, con espacio entre mesas.',
  characters: ['elena', 'diego'],
  intro: [
    l(
      'narracion',
      'Elena confirma un espacio accesible y supervisable en la planta baja y modifica la actividad para todo el grupo.',
      false,
    ),
    l(
      'narracion',
      'Una adaptación se verifica con quienes participan. No se presume que todas las personas requieren el mismo apoyo.',
    ),
  ],
  consultas: [
    {
      titulo: '¿Y si no puede confirmarse una adaptación segura?',
      lines: [
        l(
          'narracion',
          'Si no puede confirmarse una adaptación segura, se reprograma ese componente con una alternativa inclusiva; no se excluye a Diego para salvar la agenda.',
          false,
        ),
      ],
    },
  ],
  decision: {
    kind: 'continuar',
    id: 'M3_DADA',
    label: ED.botonAdaptacion,
    next: 'M3_E04',
  },
};

const M3_E04: Scene = {
  id: 'M3_E04',
  title: 'Un vehículo diferente',
  setting: 'Mesa de coordinación con el registro ficticio de transporte y salida.',
  characters: ['nicolas'],
  intro: [
    l(
      'nicolas',
      'El transporte previsto no estará disponible para el regreso. Un conocido ofrece llevar a varios participantes en su vehículo.',
    ),
  ],
  designNote:
    'No fijar proporciones de acompañantes, requisitos legales ni capacidad vehicular sin la documentación aplicable. La historia confirma después una alternativa verificada. Si no se obtiene, se mantiene la coordinación segura sin declarar resuelto el regreso.',
  decision: {
    kind: 'choice',
    id: 'M3_D04',
    prompt: '¿Qué haces antes de aceptar?',
    options: [
      {
        id: 'M3_D04-A',
        guionLetter: 'A',
        label: 'Acepto; si alguien lo conoce es suficiente.',
        consequence: [SE_DETIENE()],
        feedback: 'La confianza personal no sustituye las verificaciones ni la autorización institucional.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D04-B',
        guionLetter: 'B',
        label:
          'Comunico el cambio y suspendemos la aceptación de ese traslado hasta verificar proveedor, conductor, vehículo, capacidad, acompañamiento, ruta, comunicación y autorización conforme a los requisitos aplicables.',
        consequence: [
          l(
            'nicolas',
            'Si no podemos comprobarlo, revisaremos una alternativa autorizada y segura. El grupo permanecerá acompañado durante la coordinación.',
          ),
        ],
        feedback: 'El cambio de transporte exige revisar condiciones; no se resuelve con una firma de último minuto.',
        outcome: { type: 'avanza', next: 'M3_E05' },
      },
      {
        id: 'M3_D04-C',
        guionLetter: 'C',
        label: 'Pido autorización verbal al grupo y hacemos varios viajes sin más revisión.',
        consequence: [SE_DETIENE()],
        feedback:
          'La aceptación de participantes no reemplaza medidas de transporte, permisos aplicables ni supervisión del grupo que espera.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M3_E05: Scene = {
  id: 'M3_E05',
  title: 'El visitante de última hora',
  setting: 'Entrada del centro con control de visitas.',
  characters: ['elena'],
  intro: [
    l(
      'visitante',
      'Vengo con una persona que apoya al programa. Quiero conversar unos minutos con los adolescentes y tomar fotografías.',
    ),
    l('elena', 'La visita no estaba prevista.', true, 'pensativa'),
  ],
  designNote:
    'La persona visitante no tiene retrato y no se caracteriza como agresora por su aspecto ni por su llegada. No se representan controles de antecedentes como si pudieran completarse con una búsqueda rápida en redes.',
  decision: {
    kind: 'choice',
    id: 'M3_D05',
    prompt: '¿Qué corresponde?',
    options: [
      {
        id: 'M3_D05-A',
        guionLetter: 'A',
        label: 'Lo dejo entrar y le pido que no se tarde.',
        consequence: [SE_DETIENE()],
        feedback: 'La brevedad no reemplaza autorización, controles y orientación.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D05-B',
        guionLetter: 'B',
        label:
          'No facilito contacto ni fotografías mientras se verifica la visita por el procedimiento. Solicito orientación del responsable y, si no se cumplen las condiciones, se reprograma.',
        consequence: [
          l(
            'tu',
            'Las visitas requieren coordinación previa y medidas de salvaguarda. Hoy no podemos improvisar ese contacto.',
          ),
        ],
        feedback: 'Se aplican controles sin acusar ni estigmatizar. Una relación con un donante no crea una excepción.',
        sourceNote:
          'ChildFund puede rechazar visitas no anunciadas. Una visita aprobada va siempre acompañada por personal autorizado, sin intercambio de información de contacto y siguiendo los procedimientos de consentimiento fotográfico (Procedimiento 5.1.10.7 y 5.1.10.12).',
        outcome: { type: 'avanza', next: 'M3_E06' },
      },
      {
        id: 'M3_D05-C',
        guionLetter: 'C',
        label: 'Una adolescente puede acompañarlo mientras terminamos de organizar.',
        consequence: [SE_DETIENE()],
        feedback: 'La supervisión de una visita corresponde a personal autorizado, no a NNA.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
  outro: [
    l(
      'narracion',
      'En esta historia, la visita se reprograma. Cualquier contacto posterior sigue autorización y acompañamiento. No se comparten datos personales ni contactos directos de NNA.',
      false,
    ),
  ],
};

const M3_E06: Scene = {
  id: 'M3_E06',
  title: 'Participar no significa aceptar fotografías',
  setting: 'Actividad interior del centro comunitario.',
  characters: ['camila'],
  intro: [
    l('comunicaciones', '¿Podemos publicar una foto grupal hoy?'),
    l('camila', 'Quiero participar, pero no quiero aparecer en fotos.', true, 'pensativa'),
  ],
  decision: {
    kind: 'choice',
    id: 'M3_D06',
    prompt: '¿Qué haces?',
    complementaryNote:
      'Si existe un permiso de imagen previo, se revisan su propósito, vigencia y alcance; no se usa para forzar a Camila. No se crean distintivos visibles de consentimiento que estigmaticen.',
    options: [
      {
        id: 'M3_D06-A',
        guionLetter: 'A',
        label: 'Le explico que la foto es parte de la actividad y debe aceptarla.',
        consequence: [SE_DETIENE()],
        feedback: 'La participación no se condiciona a aceptar imágenes.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D06-B',
        guionLetter: 'B',
        label: D06_B_TEXT,
        consequence: [
          l('camila', 'Gracias. Prefiero que fotografíen los materiales que hicimos.'),
          l(
            'narracion',
            'El equipo elige fotografiar materiales sin datos personales ni participantes identificables.',
            false,
          ),
        ],
        feedback:
          'Una alternativa puede cumplir el objetivo comunicacional sin excluir ni señalar a quien no desea aparecer.',
        sourceNote:
          'Antes de publicar se obtiene consentimiento informado y, cuando el sujeto principal es una niña o un niño, también el consentimiento escrito de su madre, padre o tutor. Las imágenes deben promover la dignidad y ocultar la identidad cuando sea necesario (Procedimiento 5.1.14.4 y 5.1.14.5).',
        outcome: { type: 'avanza', next: 'M3_E07' },
      },
      {
        id: 'M3_D06-C',
        guionLetter: 'C',
        label: 'Tomamos la foto y después difuminamos su rostro sin revisar nada más.',
        consequence: [],
        feedback:
          'Difuminar no sustituye consentimiento ni elimina toda posibilidad de identificación. También importan voz, uniforme, ubicación, nombres y contexto.',
        outcome: { type: 'repara_y_avanza', next: 'M3_E07', repair: [l('tu', D06_B_TEXT)] },
      },
    ],
  },
};

const M3_E07: Scene = {
  id: 'M3_E07',
  title: 'La actividad no debe pedir historias de violencia',
  setting: 'Mesa de coordinación con las tarjetas de la dinámica.',
  characters: ['elena'],
  intro: [
    l('narracion', 'Elena revisa una tarjeta de la dinámica.', false),
    l('elena', 'Para comenzar, cada participante contará una situación personal difícil que haya vivido.'),
    l('colega', 'Así tendremos testimonios más auténticos.'),
  ],
  consultas: [
    {
      titulo: 'Si alguien comunica una preocupación durante la actividad',
      lines: [
        l(
          'narracion',
          'Si alguien comunica espontáneamente una preocupación pese a trabajar con ficción: escuchar sin interrogar, atender necesidades inmediatas, explicar límites de confidencialidad y activar la ruta. No pedir que repita al grupo.',
          false,
        ),
        l(
          'narracion',
          'Estas orientaciones se practican en el módulo 2, «Gracias por escucharme». No necesitas haberlo aprobado para aplicarlas.',
          false,
        ),
      ],
    },
  ],
  panel: 'canales',
  decision: {
    kind: 'choice',
    id: 'M3_D07',
    prompt: '¿Qué propones?',
    options: [
      {
        id: 'M3_D07-A',
        guionLetter: 'A',
        label: 'Mantenemos la consigna, pero decimos que será confidencial.',
        consequence: [],
        feedback:
          'No se puede garantizar lo que otras personas harán con un relato grupal. La dinámica puede generar presión y exposición.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M3_D07-B',
        guionLetter: 'B',
        label: D07_B_TEXT,
        consequence: [l('elena', 'Podemos trabajar con un personaje inventado y preguntar qué apoyo necesitaría.')],
        feedback: 'Proteges la participación sin convertir la actividad en una entrevista de casos.',
        sourceNote:
          'Si una niña o un niño se angustia durante la actividad, la actividad se detiene o se interrumpe para prestarle apoyo; el apoyo psicosocial se planifica de antemano (Procedimiento 5.1.11.5).',
        outcome: { type: 'avanza', next: 'M3_E08' },
      },
      {
        id: 'M3_D07-C',
        guionLetter: 'C',
        label: 'Solo pedimos historias a quienes parecen tener confianza.',
        consequence: [],
        feedback: 'La apariencia de confianza no permite prever efectos ni elimina la presión.',
        outcome: { type: 'repara_y_avanza', next: 'M3_E08', repair: [l('tu', D07_B_TEXT)] },
      },
    ],
  },
};

const M3_E08: Scene = {
  id: 'M3_E08',
  title: 'No todas las condiciones están listas',
  setting: 'Mesa de coordinación con la lista de verificación de condiciones.',
  characters: ['elena'],
  intro: [
    l(
      'narracion',
      'Antes de iniciar, revisas la ficha. El visitante fue reprogramado y se eliminó la fotografía del grupo. Pero la persona que debía reforzar la supervisión del circuito exterior no ha llegado.',
    ),
    l('elena', 'La comunidad ya está aquí. ¿Hacemos todo como estaba previsto?', true, 'pensativa'),
  ],
  ficha: {
    titulo: 'Ficha de condiciones (simulación)',
    filas: [
      { aspecto: 'Espacio accesible y supervisable en la planta baja', estado: 'verificado' },
      { aspecto: 'Supervisión del taller interior', estado: 'verificado' },
      { aspecto: 'Supervisión del circuito exterior', estado: 'pendiente_de_verificar' },
      { aspecto: 'Transporte de regreso (alternativa en verificación)', estado: 'pendiente_de_verificar' },
      { aspecto: 'Visita no prevista (reprogramada)', estado: 'suspendido' },
      { aspecto: 'Fotografía del grupo (eliminada)', estado: 'no_viable' },
    ],
  },
  decision: {
    kind: 'choice',
    id: 'M3_D08',
    prompt: '¿Qué decisión propones?',
    options: [
      {
        id: 'M3_D08-A',
        guionLetter: 'A',
        label: 'Sí; explicaré a los participantes que deben cuidarse entre ellos.',
        consequence: [SE_DETIENE()],
        feedback: 'El autocuidado no reemplaza la responsabilidad adulta ni una supervisión insuficiente.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D08-B',
        guionLetter: 'B',
        label:
          'Iniciamos únicamente los componentes con condiciones verificadas. El circuito exterior queda suspendido; la persona responsable valida la adaptación, informa al equipo y participantes y mantiene un plan seguro de salida.',
        consequence: [l('narracion', 'Se habilita el taller interior adaptado; el circuito no se realiza.', false)],
        feedback: ED.d08b,
        feedbackEditorial: true,
        outcome: { type: 'avanza', next: 'M3_INICIO_ADAPTADO' },
      },
      {
        id: 'M3_D08-C',
        guionLetter: 'C',
        label:
          'Si tampoco podemos garantizar el taller interior, suspendemos o reprogramamos la jornada completa, coordinando acompañamiento y salida segura.',
        consequence: [
          l(
            'narracion',
            'Se abre la rama de suspensión para practicar esa decisión. No reduce la nota ni las insignias.',
            false,
          ),
        ],
        feedback:
          'Su uso depende de verificar que el formato interior tampoco es viable; no se enseña que suspender siempre sea la primera o única respuesta.',
        outcome: { type: 'avanza', next: 'M3_SUSPENSION' },
      },
    ],
  },
};

const M3_INICIO_ADAPTADO: Scene = {
  id: 'M3_INICIO_ADAPTADO',
  title: 'Inicio adaptado',
  setting: 'Actividad interior del centro comunitario, en la planta baja.',
  characters: ['camila', 'elena'],
  variationLabel: 'Jornada adaptada',
  intro: [
    l(
      'tu',
      'Hoy cambiaremos una parte de la jornada para mantener condiciones seguras. Pueden hacer preguntas, elegir no participar en una dinámica y pedir apoyo. Les explicaremos cualquier cambio del regreso.',
    ),
    l('camila', 'Podemos hacer el trabajo en equipos aquí.'),
    l('narracion', 'El equipo comprueba que la propuesta mantiene supervisión y accesibilidad.', false),
  ],
  decision: {
    kind: 'continuar',
    id: 'M3_DINI',
    label: ED.botonInicio,
    next: 'M3_E09',
  },
};

const M3_SUSPENSION: Scene = {
  id: 'M3_SUSPENSION',
  title: 'Suspender sin dejar de cuidar',
  setting: 'Actividad interior del centro comunitario. El grupo espera acompañado.',
  characters: ['elena'],
  variationLabel: 'Jornada suspendida',
  intro: [
    l(
      'elena',
      'No están confirmadas las condiciones necesarias para iniciar. La jornada se reprogramará. Mientras coordinamos el regreso, seguiremos acompañando al grupo de forma segura.',
    ),
    l(
      'narracion',
      'Suspender no equivale a dejar a NNA sin cuidado. La decisión incluye comunicar, mantener acompañamiento y coordinar entrega segura.',
    ),
  ],
  decision: {
    kind: 'continuar',
    id: 'M3_DSUS',
    label: ED.botonSalida,
    next: 'M3_E09S',
  },
};

const M3_E09: Scene = {
  id: 'M3_E09',
  title: 'Un cambio durante la jornada',
  setting: 'Taller interior en la planta baja.',
  characters: ['camila'],
  variationLabel: 'Jornada adaptada',
  intro: [
    l(
      'narracion',
      'El taller interior se desarrolla con el equipo previsto. Una persona adulta necesita retirarse del espacio, lo que dejaría incompleta la supervisión acordada.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M3_D09',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'M3_D09-A',
        guionLetter: 'A',
        label: 'Continuamos unos minutos porque el grupo ya conoce las instrucciones.',
        consequence: [SE_DETIENE()],
        feedback:
          'Las condiciones se mantienen durante toda la actividad. Haber iniciado de forma segura no autoriza ignorar un cambio.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D09-B',
        guionLetter: 'B',
        label:
          'Pausamos el componente afectado, mantenemos al grupo acompañado en condiciones seguras y coordinamos relevo o reorganización autorizada antes de reanudar.',
        consequence: [
          l(
            'narracion',
            'Se activa el relevo preparado o se ajusta el alcance; el grupo recibe una explicación breve y respetuosa.',
            false,
          ),
        ],
        feedback: ED.d09b,
        feedbackEditorial: true,
        outcome: { type: 'avanza', next: 'M3_E10' },
      },
      {
        id: 'M3_D09-C',
        guionLetter: 'C',
        label: 'Encargo a Camila controlar al grupo hasta que regrese alguien.',
        consequence: [SE_DETIENE()],
        feedback: D09_C_FEEDBACK,
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M3_E09S: Scene = {
  id: 'M3_E09S',
  title: 'Un cambio durante la espera',
  setting: 'Espacio de espera del centro comunitario. No hay taller.',
  characters: ['camila'],
  variationLabel: 'Jornada suspendida',
  intro: [
    l(
      'narracion',
      'Mientras se coordina la salida, una persona del equipo debe retirarse. Aunque no hay taller, el grupo continúa bajo cuidado.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M3_D09S',
    prompt: '¿Qué haces?',
    options: [
      {
        id: 'M3_D09S-A',
        guionLetter: 'A',
        label: ED.d09sA,
        consequence: [SE_DETIENE()],
        feedback: ED.d09sAFb,
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D09S-B',
        guionLetter: 'B',
        label: ED.d09sB,
        consequence: [],
        feedback: ED.d09sBFb,
        outcome: { type: 'avanza', next: 'M3_E10' },
      },
      {
        id: 'M3_D09S-C',
        guionLetter: 'C',
        label: ED.d09sC,
        consequence: [SE_DETIENE()],
        feedback: D09_C_FEEDBACK,
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M3_E10: Scene = {
  id: 'M3_E10',
  title: 'La actividad termina cuando la salida es segura',
  setting: 'Punto de salida del centro comunitario.',
  characters: ['nicolas'],
  intro: [
    l(
      'nicolas',
      'La alternativa de transporte ya fue verificada por los responsables. Una persona no incluida en el registro viene a recoger a un participante y dice que la familia la envió.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M3_D10',
    prompt: '¿Qué corresponde?',
    complementaryNote:
      'Si el niño expresa temor o existe conflicto con quien recogería, no se realiza un contacto automático que lo exponga. Se activa valoración por los responsables. No se decide custodia ni se utiliza coerción física.',
    options: [
      {
        id: 'M3_D10-A',
        guionLetter: 'A',
        label: 'Lo dejo salir porque reconoce a esa persona.',
        consequence: [SE_DETIENE()],
        feedback:
          'Reconocer a alguien no confirma autorización ni seguridad. Sigue el procedimiento de entrega aplicable.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M3_D10-B',
        guionLetter: 'B',
        label:
          'Mantengo acompañamiento seguro y solicito a los responsables verificar autorización e identidad mediante el mecanismo previsto. Si no se confirma o surge una preocupación, activo el apoyo correspondiente antes de la salida.',
        consequence: [
          l(
            'narracion',
            'La verificación se realiza con acceso restringido. Si se confirma, se registra la entrega; si no, se mantiene pendiente y se coordina alternativa segura.',
            false,
          ),
        ],
        feedback: ED.d10b,
        feedbackEditorial: true,
        outcome: { type: 'avanza', next: 'CIERRE' },
      },
      {
        id: 'M3_D10-C',
        guionLetter: 'C',
        label: 'Le hago una fotografía al documento y la envío al grupo completo para que alguien confirme.',
        consequence: [SE_DETIENE()],
        feedback:
          'No distribuyas documentos de identidad ni datos personales para resolver una verificación. Utiliza el canal y las personas autorizadas.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const scenes: Record<SceneId, Scene> = {
  M3_E01,
  M3_E02,
  M3_E03,
  M3_E03B,
  M3_E04,
  M3_E05,
  M3_E06,
  M3_E07,
  M3_E08,
  M3_INICIO_ADAPTADO,
  M3_SUSPENSION,
  M3_E09,
  M3_E09S,
  M3_E10,
};

export const episodio3: Episode = {
  id: 'm3-antes-de-abrir-las-puertas',
  ruta: 'm3',
  rotulo: 'Módulo 3',
  number: 3,
  title: 'Antes de abrir las puertas',
  subtitle: 'Planificar, adaptar y realizar actividades seguras con niñas, niños y adolescentes',
  version: '1.0',
  claveAlmacen: 'dqp:progreso:m3-antes-de-abrir-las-puertas',
  guionArchivo: '^Guion_Modulo_3_.*\\.md$',
  start: 'M3_E01',
  scenes,
  order: [
    'M3_E01',
    'M3_E02',
    'M3_E03',
    'M3_E03B',
    'M3_E04',
    'M3_E05',
    'M3_E06',
    'M3_E07',
    'M3_E08',
    'M3_INICIO_ADAPTADO',
    'M3_SUSPENSION',
    'M3_E09',
    'M3_E09S',
    'M3_E10',
  ],
  closing: {
    variantes: [
      {
        siVisitada: 'M3_INICIO_ADAPTADO',
        lines: [
          l(
            'elena',
            'Realizamos una actividad más pequeña, con condiciones verificadas. El circuito pendiente se reprogramará; la seguridad no dependía de completar toda la agenda.',
          ),
        ],
      },
      {
        siVisitada: 'M3_SUSPENSION',
        lines: [
          l(
            'elena',
            'Hoy protegimos al grupo al no iniciar sin condiciones suficientes. Registraremos qué faltó y qué debe resolverse antes de una nueva convocatoria.',
          ),
        ],
      },
    ],
    lines: [
      l(
        'narracion',
        'La salida se verificó según el procedimiento. Los pendientes y aprendizajes se registran con responsables. Cualquier preocupación o incidente identificado se comunica por el mecanismo institucional; no se oculta porque se haya corregido una condición.',
      ),
      l('camila', 'Me gustó que nos explicaran los cambios y que pudiéramos proponer ideas.'),
    ],
    contribution:
      'Prevenir es comprobar condiciones, escuchar y adaptar. Una actividad segura requiere revisión antes, durante y al finalizar.',
    reflection: [
      '¿Qué cambio de último minuto podría pasar por alto?',
      '¿Sé quién valida una adaptación?',
      '¿Qué condición impediría continuar?',
      '¿Cómo explicaría una suspensión sin culpar a NNA?',
    ],
  },
  badges: [
    {
      id: 'm3-planificacion-protectora',
      name: 'Planificación protectora',
      description: 'Completaste D01 a D04 llegando a la respuesta adecuada o a su reparación.',
      decisions: ['M3_D01', 'M3_D02', 'M3_D03', 'M3_D04'],
    },
    {
      id: 'm3-participacion-limites',
      name: 'Participación y límites',
      description: 'Completaste D05 a D07 llegando a la respuesta adecuada o a su reparación.',
      decisions: ['M3_D05', 'M3_D06', 'M3_D07'],
    },
    {
      id: 'm3-adaptacion-responsable',
      name: 'Adaptación responsable',
      description: 'Completaste D08 a D10, en la jornada adaptada o en la suspendida.',
      decisions: ['M3_D08', ['M3_D09', 'M3_D09S'], 'M3_D10'],
    },
  ],
  portada: {
    lead: 'La jornada está por comenzar. ¿Están listas las condiciones para participar con seguridad?',
    aviso:
      'Trabajarás con una actividad ficticia. No ingreses datos reales. Puedes pausar, salir o utilizar lectura equivalente. Adaptar o suspender una actividad insegura es una decisión válida.',
    rolPregunta: ED.rolPregunta,
    roles: {
      cf: 'Personal técnico de ChildFund Ecuador',
      socio: 'Personal técnico de una organización socia',
    },
    rolMensaje:
      'Puedes identificar riesgos, proponer medidas, detener una acción insegura y pedir apoyo. No necesitas resolver todo por tu cuenta.',
    rolNotas: {
      cf: 'En ChildFund se utiliza la estructura responsable y el mecanismo de salvaguarda de ChildFund.',
      socio: 'En el socio, su estructura y Punto Focal se articulan con ChildFund conforme a la ruta y acuerdos.',
    },
  },
  herramientas: [
    'm3-ficha',
    'm3-supervision',
    'm3-participacion',
    'm3-visitas',
    'm3-transporte',
    'm3-pausar',
    'm3-preocupacion',
    'm2-servicios',
    'ruta',
  ],
  evaluacion: { config: configEvaluacion, preguntas, textos: textosResultado, notaUmbral },
  textosEditoriales: Object.values(ED),
};

// Módulo 5 — «Es alguien importante». Guion versión 1.0 para revisión institucional.
// Los diálogos marcados literal: true se copian sin parafrasear del guion.
// Los textos con literal: false convierten indicaciones de pantalla en narración; los textos redactados
// para el juego figuran en textosEditoriales. Ambos se registran en docs/cambios-editoriales.md.
// Todos los IDs llevan el prefijo M5_. Hay dos rutas seguras: canal habitual y canal alternativo ante conflicto.

import type { Episode, Line, Pose, Scene, SceneId, Speaker } from '../types';
import { configEvaluacion, notaUmbral, preguntas, textosResultado } from './evaluacion';

let seq = 0;
const l = (speaker: Speaker, text: Line['text'], literal = true, pose?: Pose): Line => ({
  id: `M5_L${++seq}`,
  speaker,
  text,
  literal,
  ...(pose ? { pose } : {}),
});

const PAUSA = 'Pausa pedagógica: esta acción no se ejecuta. Elige otra alternativa.';
const SE_DETIENE = () => l('narracion', 'El ejercicio se detiene antes de ejecutar esta acción.', false);

const TRANSFERENCIA_ALTERNATIVAS = l(
  'narracion',
  'Si el canal habitual tuviera un posible conflicto de interés o no resultara seguro, se utiliza una alternativa institucional habilitada y se comunica el posible conflicto con los hechos disponibles. No se requiere autorización de la persona señalada ni avisarle previamente.',
  false,
);

// Textos redactados para el juego (el guion no los define): no se comparan con el guion.
const ED = {
  rolPregunta: '¿Desde qué rol actuarás?',
  e04Prompt: '¿Qué variación quieres practicar?',
  e04Habitual: 'Canal habitual.',
  e04HabitualDesc: 'No se identifica conflicto en el Punto Focal receptor.',
  e04Conflicto: 'Posible conflicto de interés.',
  e04ConflictoDesc: 'La persona que recibiría habitualmente el reporte tiene una relación estrecha con la persona señalada.',
  d04hPrompt: '¿Cómo comunicas la preocupación?',
  d04hA: 'Pido primero autorización a la persona señalada antes de reportar.',
  d04hAFb: 'No se requiere autorización de la persona señalada ni avisarle previamente. Esperarla puede aumentar la presión y retrasar la protección.',
  d04hB:
    'Comunico por el mecanismo del Punto Focal receptor la preocupación y los riesgos de represalia, sin esperar autorización de nadie.',
  d04hC: 'Lo comento en el grupo del programa para que todas las personas estén atentas.',
  d04hCFb: 'La difusión no sustituye el mecanismo y expone a Paula y a la adolescente.',
  d06Prompt: 'Selecciona qué incluirías en la comunicación inicial ficticia. Puedes marcar varias.',
  d06Missing: 'Incluye lo que se comunicó, lo que se desconoce y el contexto pertinente para valorar riesgos.',
  d06Extra: 'Excluye suposiciones, sanciones predeterminadas e información innecesaria sobre las personas.',
  d06Final:
    'Esta ficha simula el reporte de una preocupación, no un veredicto. La valoración y el registro oficial quedan en manos de los responsables.',
  botonMedidas: 'Continuar',
};

const M5_E01: Scene = {
  id: 'M5_E01',
  title: '«No sé si debería decirlo»',
  setting: 'Espacio discreto de conversación al finalizar una reunión técnica.',
  characters: ['paula'],
  intro: [
    l(
      'paula',
      'Una adolescente me comentó que una persona con mucha influencia en el programa le escribe en privado y le pide encuentros sin que el equipo se entere. Esa persona decide muchas cosas aquí. No sé si debería decirlo.',
      true,
      'pensativa',
    ),
  ],
  designNote:
    '«Qué información ya tienes» no se convierte en un interrogatorio. Se escucha lo comunicado espontáneamente y se distingue lo recibido de lo observado directamente. No se solicita nombre o datos de la adolescente dentro del videojuego.',
  decision: {
    kind: 'choice',
    id: 'M5_D01',
    prompt: '¿Cómo respondes?',
    options: [
      {
        id: 'M5_D01-A',
        guionLetter: 'A',
        label: 'Si es alguien tan importante, seguramente tiene una razón.',
        consequence: [],
        feedback: 'El prestigio no permite descartar una señal preocupante. Tampoco corresponde concluir culpabilidad.',
        outcome: {
          type: 'repara_y_avanza',
          next: 'M5_E02',
          repair: [l('tu', 'Gracias por comunicarlo. Lo que dices requiere atención por el mecanismo adecuado.')],
        },
      },
      {
        id: 'M5_D01-B',
        guionLetter: 'B',
        label:
          'Gracias por contármelo. No necesitas comprobar lo ocurrido. Escuchemos qué información ya tienes y si hay alguna necesidad inmediata de seguridad; después la comunicaremos por el mecanismo correspondiente.',
        consequence: [l('paula', 'No traje mensajes. Solo conozco lo que me dijo.')],
        feedback: 'Una preocupación puede comunicarse con información disponible; no pides que obtenga evidencia.',
        outcome: { type: 'avanza', next: 'M5_E02' },
      },
      {
        id: 'M5_D01-C',
        guionLetter: 'C',
        label: 'Consigue una copia de los mensajes para saber si vale la pena reportar.',
        consequence: [SE_DETIENE()],
        feedback:
          'No traslades a Paula ni a la adolescente una tarea de investigación. No se necesitan pruebas completas para activar el mecanismo.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M5_E02: Scene = {
  id: 'M5_E02',
  title: 'Seguridad antes que jerarquía',
  setting: 'Espacio discreto de conversación.',
  characters: ['paula'],
  intro: [
    l(
      'tu',
      '¿Sabes si existe un encuentro próximo o una situación que necesite atención ahora? ¿Hay algo que pueda poner en riesgo a la adolescente o a ti al comunicarlo?',
    ),
    l(
      'paula',
      'No conozco una cita concreta. Me preocupa que la busque de nuevo. También me asusta que sepan que fui yo, porque mi contrato termina pronto.',
      true,
      'pensativa',
    ),
  ],
  designNote:
    'No se promete que el contrato se renovará ni que no habrá ningún riesgo. Tampoco se supone que el vencimiento contractual es una represalia por sí mismo.',
  decision: {
    kind: 'choice',
    id: 'M5_D02',
    prompt: '¿Qué haces con esa incertidumbre?',
    options: [
      {
        id: 'M5_D02-A',
        guionLetter: 'A',
        label: 'Como no conocemos una cita, no hay riesgo y podemos esperar.',
        consequence: [],
        feedback:
          'No conocer un encuentro no descarta riesgo. La preocupación y el temor de represalias deben comunicarse oportunamente.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D02-B',
        guionLetter: 'B',
        label: 'Contacto a la adolescente para reconstruir la historia antes de informar.',
        consequence: [SE_DETIENE()],
        feedback:
          'No inicies otra entrevista ni hagas repetir el relato para completar vacíos. Corresponde activar la respuesta por los responsables.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D02-C',
        guionLetter: 'C',
        label:
          'Comunico la preocupación, la información desconocida y los riesgos expresados. Solicito valoración y apoyo por el mecanismo. Si se conociera peligro inmediato, activaría además la respuesta urgente correspondiente.',
        consequence: [],
        feedback:
          'La falta de certeza no retrasa el reporte. Distingues la preocupación inicial de las necesidades de protección de quienes comunican.',
        sourceNote:
          'La preocupación se comunica dentro de 24 horas desde que se conoce, con la información disponible; si hay peligro inmediato, la respuesta urgente no espera (Política 2.9; Procedimiento 5.2.4.3).',
        outcome: { type: 'avanza', next: 'M5_E03' },
      },
    ],
  },
};

const M5_E03: Scene = {
  id: 'M5_E03',
  title: '«Lo resolvemos hablando»',
  setting: 'Oficina comunitaria; conversación en la que no se difunden nombres ni detalles.',
  characters: ['elena'],
  intro: [
    l(
      'elena',
      'Tal vez sea mejor hablar primero con esa persona. Tiene mucha experiencia y podríamos evitar que esto afecte al programa.',
      true,
      'pensativa',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M5_D03',
    prompt: '¿Qué respondes?',
    options: [
      {
        id: 'M5_D03-A',
        guionLetter: 'A',
        label:
          'No nos corresponde confrontar ni negociar la preocupación. La comunicaré por el mecanismo con acceso restringido. La protección no depende de la importancia de una alianza.',
        consequence: [l('elena', 'Podemos pedir orientación sin exponer a quien comunicó.')],
        feedback: 'Mantienes el deber de reporte sin convertir la conversación en una disputa personal.',
        outcome: { type: 'avanza', next: 'M5_E04' },
      },
      {
        id: 'M5_D03-B',
        guionLetter: 'B',
        label: 'De acuerdo; organizamos una reunión con la adolescente y la persona señalada.',
        consequence: [SE_DETIENE()],
        feedback: 'La mediación o confrontación puede aumentar exposición y presión e interferir con el proceso.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D03-C',
        guionLetter: 'C',
        label: 'Lo discutimos con todo el equipo para decidir por mayoría.',
        consequence: [SE_DETIENE()],
        feedback: 'Un reporte no se somete a votación. La discusión amplia expone información sensible.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D03-D',
        guionLetter: 'D',
        label:
          'Solicito orientación a un referente habilitado usando solo lo necesario, sin posponer el reporte ni revelar información a personas ajenas a su gestión.',
        consequence: [],
        feedback: 'Buscar apoyo es válido si no se utiliza para aplazar ni reemplazar la comunicación debida.',
        outcome: { type: 'avanza', next: 'M5_E04' },
      },
    ],
  },
};

const M5_E04: Scene = {
  id: 'M5_E04',
  title: '¿El canal habitual es seguro?',
  setting: 'Interfaz ficticia de canales de reporte.',
  characters: ['paula'],
  intro: [
    l(
      'narracion',
      'Se presenta una variación elegible de la situación. No es una escala de dificultad ni modifica la evaluación.',
      false,
    ),
  ],
  decision: {
    kind: 'variante',
    id: 'M5_DVAR',
    prompt: ED.e04Prompt,
    opciones: [
      { id: 'M5_DVAR-H', label: ED.e04Habitual, descripcion: ED.e04HabitualDesc, next: 'M5_CANAL_HABITUAL' },
      { id: 'M5_DVAR-C', label: ED.e04Conflicto, descripcion: ED.e04ConflictoDesc, next: 'M5_CONFLICTO' },
    ],
  },
};

const M5_CANAL_HABITUAL: Scene = {
  id: 'M5_CANAL_HABITUAL',
  rama: 'canal:habitual',
  title: 'Canal habitual',
  setting: 'Interfaz ficticia de canales de reporte.',
  characters: [],
  variationLabel: 'Variación: canal habitual',
  intro: [l('narracion', 'No se identifica conflicto en el Punto Focal receptor.', false)],
  consultas: [{ titulo: 'Tarjeta de transferencia: si hubiera un conflicto', lines: [TRANSFERENCIA_ALTERNATIVAS] }],
  panel: 'canales',
  decision: {
    kind: 'choice',
    id: 'M5_D04H',
    prompt: ED.d04hPrompt,
    options: [
      {
        id: 'M5_D04H-A',
        guionLetter: 'A',
        label: ED.d04hA,
        consequence: [SE_DETIENE()],
        feedback: ED.d04hAFb,
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D04H-B',
        guionLetter: 'B',
        label: ED.d04hB,
        consequence: [],
        feedback:
          'Comunicar mediante ese mecanismo la preocupación y los riesgos de represalia. No es necesario utilizar todos los canales a la vez.',
        outcome: { type: 'avanza', next: 'M5_E05' },
      },
      {
        id: 'M5_D04H-C',
        guionLetter: 'C',
        label: ED.d04hC,
        consequence: [SE_DETIENE()],
        feedback: ED.d04hCFb,
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M5_CONFLICTO: Scene = {
  id: 'M5_CONFLICTO',
  rama: 'canal:conflicto',
  title: 'Un posible conflicto de interés',
  setting: 'Interfaz ficticia de canales de reporte.',
  characters: ['paula'],
  variationLabel: 'Variación: posible conflicto',
  intro: [
    l(
      'narracion',
      'Paula informa que la persona que recibiría habitualmente el reporte tiene una relación personal estrecha con la señalada y participa en decisiones que podrían verse afectadas.',
    ),
  ],
  panel: 'canales',
  designNote:
    'Las fuentes identifican Punto Focal, complaints@childfund.org y Speak Up, así como funciones globales señaladas en el mecanismo. No se inventa un superior local ni se dirige a un correo personal. El juego no envía el relato ficticio a una plataforma real.',
  decision: {
    kind: 'choice',
    id: 'M5_D04',
    prompt: '¿Cómo manejas el posible conflicto?',
    options: [
      {
        id: 'M5_D04-A',
        guionLetter: 'A',
        label: 'Difundo la relación entre esas personas para presionar públicamente.',
        consequence: [SE_DETIENE()],
        feedback: 'La exposición pública no sustituye el mecanismo y puede aumentar daños.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D04-B',
        guionLetter: 'B',
        label:
          'Utilizo una alternativa institucional habilitada, comunico el posible conflicto con los hechos disponibles y solicito que los responsables determinen recepción, acceso y participación sin ese impedimento.',
        consequence: [],
        feedback:
          'No necesitas probar parcialidad para informar un posible conflicto. Su valoración corresponde a las instancias competentes.',
        outcome: { type: 'avanza', next: 'M5_E05' },
      },
      {
        id: 'M5_D04-C',
        guionLetter: 'C',
        label: 'Reporto solo a la persona con posible conflicto porque es la jerarquía habitual.',
        consequence: [],
        feedback: 'La ruta contempla alternativas. La cadena jerárquica no debe bloquear un reporte seguro.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D04-D',
        guionLetter: 'D',
        label: 'Descarto el reporte porque no sé quién podría recibirlo.',
        consequence: [l('narracion', 'Abre el panel «Vías institucionales de referencia» de esta escena.', false)],
        feedback:
          'Consulta los mecanismos institucionales disponibles; la incertidumbre sobre la ruta local no elimina la responsabilidad.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const M5_E05: Scene = {
  id: 'M5_E05',
  title: '«¿Será anónimo de verdad?»',
  setting: 'Espacio discreto de conversación.',
  characters: ['paula'],
  intro: [
    l('paula', 'Si uso un canal anónimo, ¿me garantizas que nadie sabrá que fui yo?', true, 'pensativa'),
  ],
  designNote:
    'La persona jugadora comunica el deber y el uso restringido. No promete mantener secreto absoluto sobre la preocupación ni decide retener información necesaria para proteger. El receptor valora qué datos son necesarios y cómo manejarlos.',
  decision: {
    kind: 'choice',
    id: 'M5_D05',
    prompt: '¿Cómo explicas las opciones?',
    options: [
      {
        id: 'M5_D05-A',
        guionLetter: 'A',
        label: 'Sí; si no escribes tu nombre, nadie podrá reconocerte.',
        consequence: [],
        feedback: 'El contexto puede permitir inferir una identidad aunque el canal no pida nombre.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D05-B',
        guionLetter: 'B',
        label: 'Para protegerte, no reportaremos nada.',
        consequence: [],
        feedback: 'El temor exige medidas y un canal seguro, no silencio institucional.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D05-C',
        guionLetter: 'C',
        label:
          'Existen vías que permiten comunicar sin indicar el nombre. No puedo garantizar que nadie infiera tu identidad. Podemos explicar al receptor tu temor y acordar cómo reducir exposición y mantener un contacto seguro.',
        consequence: [l('paula', 'Prefiero que no me envíen mensajes al chat del equipo.')],
        feedback: 'Distingues anonimato de confidencialidad y no prometes resultados fuera de tu control.',
        outcome: { type: 'avanza', next: 'M5_E06' },
      },
    ],
  },
};

const M5_E06: Scene = {
  id: 'M5_E06',
  title: 'Hechos, señales y suposiciones',
  setting: 'Mesa de coordinación con una ficha ficticia de comunicación inicial.',
  characters: [],
  intro: [],
  decision: {
    kind: 'cards',
    id: 'M5_D06',
    prompt: ED.d06Prompt,
    simulationLabel: 'SIMULACIÓN. Esta ficha no envía un reporte ni es un veredicto',
    cards: [
      {
        id: 'M5_D06-T1',
        number: 1,
        include: true,
        text: 'Paula manifestó que una adolescente le comunicó contactos privados y solicitudes de encuentros sin conocimiento del equipo.',
        explanation: 'Atribuye correctamente la fuente; el jugador no lo presenta como observación propia.',
      },
      {
        id: 'M5_D06-T2',
        number: 2,
        include: true,
        text: 'No se conoce una cita concreta ni se dispone de mensajes; no se realizaron entrevistas adicionales.',
        explanation: 'Identifica vacíos sin investigarlos.',
      },
      {
        id: 'M5_D06-T3',
        number: 3,
        include: true,
        text: 'La persona señalada tiene influencia sobre decisiones del programa; Paula teme consecuencias sobre su vinculación y pide contacto fuera del chat del equipo.',
        explanation: 'Contexto pertinente y preferencias de seguridad.',
      },
      {
        id: 'M5_D06-T4',
        number: 4,
        include: true,
        soloSiVisitada: 'M5_CONFLICTO',
        text: 'Se ha comunicado una relación relevante del receptor habitual con la persona señalada; se solicita valoración del posible conflicto.',
        explanation: 'No se afirma parcialidad como hecho probado.',
      },
      {
        id: 'M5_D06-T5',
        number: 5,
        include: false,
        text: 'Por su posición, seguramente lleva años haciendo lo mismo.',
        explanation: 'Es una suposición.',
      },
      {
        id: 'M5_D06-T6',
        number: 6,
        include: false,
        text: 'Debemos lograr que la despidan.',
        explanation: 'Predetermina una sanción y excede el rol.',
      },
      {
        id: 'M5_D06-T7',
        number: 7,
        include: false,
        text: 'Opiniones de todo el equipo sobre la vida personal de la adolescente.',
        explanation: 'Información innecesaria y potencialmente dañina.',
      },
    ],
    messages: { missing: ED.d06Missing, extra: ED.d06Extra },
    successText: ED.d06Final,
    next: 'M5_E07',
  },
};

const M5_E07: Scene = {
  id: 'M5_E07',
  title: '«Me dijeron que no lo escale»',
  setting: 'Espacio discreto de conversación.',
  characters: ['paula'],
  intro: [
    l(
      'paula',
      'Después de decir que quería pedir orientación, alguien me comentó: “Piénsalo bien; puedes afectar tu continuidad y la relación del socio con ChildFund”.',
      true,
      'pensativa',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M5_D07',
    prompt: '¿Qué haces con esta información?',
    options: [
      {
        id: 'M5_D07-A',
        guionLetter: 'A',
        label:
          'La registro por el canal autorizado como una nueva preocupación de posible intimidación, diferenciando la frase comunicada de su interpretación. Solicito valoración de seguridad y prevención de represalias.',
        consequence: [],
        feedback:
          'Una presión para impedir el reporte merece atención. No necesitas demostrar primero una represalia consumada.',
        sourceNote:
          'ChildFund se compromete a proteger a sobrevivientes, denunciantes y testigos frente a represalias, y el SIMT debe comunicar las amenazas o actos de represalia que conozca (Plan de Salvaguarda FY2026, deber de cuidado y declaración de confidencialidad y no represalias).',
        outcome: { type: 'avanza', next: 'M5_MEDIDAS' },
      },
      {
        id: 'M5_D07-B',
        guionLetter: 'B',
        label: 'Le digo que es normal sentirse nerviosa y que no lo tome en serio.',
        consequence: [],
        feedback: 'Minimiza una señal de presión. El temor y la frase comunicada deben trasladarse a los responsables.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D07-C',
        guionLetter: 'C',
        label: 'Afirmo públicamente que ya se probó una represalia y señalo culpables.',
        consequence: [SE_DETIENE()],
        feedback: 'Comunica la señal sin determinar culpabilidad ni exponer a Paula.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M5_MEDIDAS: Scene = {
  id: 'M5_MEDIDAS',
  title: 'Protección sin promesas absolutas',
  setting: 'Mesa de coordinación.',
  characters: ['referente', 'paula'],
  intro: [
    l(
      'referente',
      'La preocupación y la posible intimidación se valorarán. Coordinaremos contacto seguro y las medidas preventivas necesarias con los responsables. La información no se comparte con quienes no necesitan conocerla.',
    ),
    l(
      'narracion',
      'Ejemplos de medidas que los responsables pueden valorar, no instrucciones automáticas: punto de contacto sin conflicto; seguimiento seguro; revisión autorizada de cambios adversos; protección de acceso al programa; ajustes de interacción o supervisión proporcionales al riesgo y a la seguridad de NNA.',
      false,
    ),
    l(
      'narracion',
      'No se impone una medida contractual, sanción, suspensión laboral o traslado desde el juego. Tampoco se presenta como protectora una medida que expulse a la adolescente, aísle a Paula o la obligue a confrontar a alguien.',
      false,
    ),
  ],
  decision: { kind: 'continuar', id: 'M5_DMED', label: ED.botonMedidas, next: 'M5_E08' },
};

const M5_E08: Scene = {
  id: 'M5_E08',
  title: 'Un cambio después del reporte',
  setting: 'Oficina comunitaria, días después.',
  characters: ['paula'],
  intro: [
    l(
      'narracion',
      'Días después, Paula comunica que dejó de ser convocada a una actividad que estaba a su cargo. No conoce la razón. En la historia no se sabe todavía si el cambio guarda relación con el reporte.',
    ),
    l('paula', 'No sé si es por lo que conté. Me preocupa, pero tampoco quiero acusar a nadie sin saber.', true, 'pensativa'),
  ],
  designNote:
    'No se promete renovación del contrato. El responsable evalúa si hay medidas para evitar trato adverso y cumplir las obligaciones aplicables; la valoración laboral no reemplaza la protección de la adolescente.',
  decision: {
    kind: 'choice',
    id: 'M5_D08',
    prompt: '¿Cómo contribuyes?',
    options: [
      {
        id: 'M5_D08-A',
        guionLetter: 'A',
        label: 'No lo comunico hasta estar seguro de que fue una represalia.',
        consequence: [],
        feedback:
          'Se puede comunicar un posible trato adverso sin afirmar una conclusión. Esperar certeza puede retrasar protección.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D08-B',
        guionLetter: 'B',
        label: 'Afirmo que cualquier cambio de tarea después de un reporte es una represalia.',
        consequence: [],
        feedback: 'La secuencia temporal es una señal a valorar, no prueba suficiente de causalidad.',
        outcome: { type: 'reintenta' },
      },
      {
        id: 'M5_D08-C',
        guionLetter: 'C',
        label:
          'Comunico de forma restringida el cambio conocido, cuándo se advirtió, la razón desconocida y el temor expresado. Solicito revisión por los roles competentes sin buscar documentos ajenos ni interrogar colegas.',
        consequence: [],
        feedback:
          'Distingues hechos, incertidumbre y necesidad de valoración. Se revisan posibles explicaciones legítimas sin descartar el riesgo.',
        outcome: { type: 'avanza', next: 'M5_E09' },
      },
    ],
  },
};

const M5_E09: Scene = {
  id: 'M5_E09',
  title: '«Yo sé cómo conseguir pruebas»',
  setting: 'Oficina comunitaria.',
  characters: [],
  intro: [
    l(
      'colega',
      'Podemos pedirle a la adolescente que mantenga la conversación y conseguir más mensajes. Así no podrán negar nada.',
    ),
  ],
  decision: {
    kind: 'choice',
    id: 'M5_D09',
    prompt: '¿Qué haces?',
    complementaryNote:
      'Si se reciben espontáneamente mensajes o documentos relevantes, no se ordena borrarlos ni reenviarlos a grupos. Se informa al mecanismo y los responsables indican conservación y tratamiento seguros conforme a la ruta. No se solicita crear material adicional.',
    options: [
      {
        id: 'M5_D09-A',
        guionLetter: 'A',
        label:
          'Rechazo la propuesta y evito involucrar a la adolescente en obtención de pruebas. Transmito la preocupación por esa iniciativa a los responsables si corresponde. Las actuaciones investigativas pertenecen a personal autorizado.',
        consequence: [],
        feedback:
          'La persona afectada no es un medio para obtener evidencia. La protección no espera ni depende de que se exponga otra vez.',
        outcome: { type: 'avanza', next: 'M5_E10' },
      },
      {
        id: 'M5_D09-B',
        guionLetter: 'B',
        label: 'Acepto si la adolescente está de acuerdo.',
        consequence: [SE_DETIENE()],
        feedback: 'La aceptación no vuelve seguro ni adecuado exponerla a nuevas interacciones para investigar.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D09-C',
        guionLetter: 'C',
        label: 'Le pido al colega que confronte a la persona señalada por nosotros.',
        consequence: [SE_DETIENE()],
        feedback: 'Delegar una confrontación no elimina sus riesgos ni la interferencia con el proceso.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
    ],
  },
};

const M5_E10: Scene = {
  id: 'M5_E10',
  title: 'Seguimiento sin exigir acceso a la investigación',
  setting: 'Mesa de coordinación.',
  characters: ['referente', 'paula'],
  intro: [
    l(
      'referente',
      'La preocupación fue recibida y se han asignado las actuaciones a los roles competentes. Por confidencialidad no podemos compartir todos los detalles del proceso.',
    ),
    l('paula', '¿Cómo sé si mi comunicación llegó? ¿Y si vuelve a pasar algo?', true, 'pensativa'),
  ],
  decision: {
    kind: 'choice',
    id: 'M5_D10',
    prompt: '¿Qué corresponde?',
    options: [
      {
        id: 'M5_D10-A',
        guionLetter: 'A',
        label: 'Si no conocemos todos los detalles, lo publicamos para presionar.',
        consequence: [SE_DETIENE()],
        feedback:
          'La ausencia de información completa no autoriza divulgar. Se utilizan seguimiento y escalamiento institucional.',
        outcome: { type: 'pausa_y_vuelve', pauseNote: PAUSA },
      },
      {
        id: 'M5_D10-B',
        guionLetter: 'B',
        label:
          'Coordinamos confirmación de recepción y un contacto seguro para comunicar riesgos nuevos. Si no hay respuesta por la vía utilizada, acudimos a la alternativa institucional sin asumir que el silencio demuestra culpabilidad o cierre.',
        consequence: [
          l(
            'referente',
            'Podrán comunicar preocupaciones nuevas por el canal acordado. No se les pedirá conseguir pruebas ni asumir la gestión del caso.',
          ),
        ],
        feedback:
          'El seguimiento busca respuesta y seguridad, no acceso indiscriminado al expediente. Una confirmación no equivale a conclusión de la investigación.',
        outcome: { type: 'avanza', next: 'CIERRE' },
      },
      {
        id: 'M5_D10-C',
        guionLetter: 'C',
        label: 'Ya reportamos; cualquier problema posterior deja de ser nuestra responsabilidad.',
        consequence: [],
        feedback:
          'Los riesgos nuevos y posibles represalias también se comunican. El seguimiento se realiza dentro del rol, sin asumir funciones especializadas.',
        outcome: { type: 'reintenta' },
      },
    ],
  },
};

const scenes: Record<SceneId, Scene> = {
  M5_E01,
  M5_E02,
  M5_E03,
  M5_E04,
  M5_CANAL_HABITUAL,
  M5_CONFLICTO,
  M5_E05,
  M5_E06,
  M5_E07,
  M5_MEDIDAS,
  M5_E08,
  M5_E09,
  M5_E10,
};

export const episodio5: Episode = {
  id: 'm5-es-alguien-importante',
  ruta: 'm5',
  rotulo: 'Módulo 5',
  number: 5,
  title: 'Es alguien importante',
  subtitle: 'Reporte seguro, conflictos de interés y prevención de represalias',
  version: '1.0',
  claveAlmacen: 'dqp:progreso:m5-es-alguien-importante',
  guionArchivo: '^Guion_Modulo_5_.*\\.md$',
  start: 'M5_E01',
  scenes,
  order: [
    'M5_E01',
    'M5_E02',
    'M5_E03',
    'M5_E04',
    'M5_CANAL_HABITUAL',
    'M5_CONFLICTO',
    'M5_E05',
    'M5_E06',
    'M5_E07',
    'M5_MEDIDAS',
    'M5_E08',
    'M5_E09',
    'M5_E10',
  ],
  closing: {
    lines: [
      l(
        'paula',
        'Me ayudó saber que podía comunicar la preocupación sin tener que probarla yo misma, y que mi temor también debía ser escuchado.',
      ),
      l('elena', 'Intentar resolverlo informalmente habría dejado la respuesta en manos de quienes no debían investigarlo.'),
      l(
        'narracion',
        'Se activó una vía institucional, se comunicó el posible conflicto y las señales de intimidación o trato adverso, y se asignó seguimiento seguro. El desenlace investigativo y laboral no forma parte de la misión.',
      ),
    ],
    contribution:
      'La importancia de una persona no modifica el deber de proteger. Reportar con responsabilidad implica comunicar hechos y riesgos, cuidar la información y utilizar los mecanismos establecidos.',
    reflection: [
      '¿Qué presión podría hacerme demorar?',
      '¿Sé qué alternativa usar ante un conflicto?',
      '¿Puedo distinguir una señal de represalia de una conclusión?',
      '¿Cómo evitaría quedarme a solas con esta responsabilidad?',
    ],
    reviewLabel: 'Ver aprendizajes',
  },
  badges: [
    {
      id: 'm5-criterio-presion',
      name: 'Criterio ante la presión',
      description: 'Completaste D01 a D03 llegando a la respuesta adecuada o a su corrección.',
      decisions: ['M5_D01', 'M5_D02', 'M5_D03'],
    },
    {
      id: 'm5-ruta-segura',
      name: 'Ruta segura',
      description: 'Completaste D04 a D06 en la variación elegida.',
      decisions: [['M5_D04', 'M5_D04H'], 'M5_D05', 'M5_D06'],
    },
    {
      id: 'm5-prevencion-represalias',
      name: 'Prevención de represalias',
      description: 'Completaste D07 a D10 llegando a la respuesta adecuada o a su corrección.',
      decisions: ['M5_D07', 'M5_D08', 'M5_D09', 'M5_D10'],
    },
  ],
  portada: {
    lead: 'A veces, reportar una preocupación resulta más difícil cuando involucra a alguien con poder. Practica cómo actuar sin quedarte a solas con esa responsabilidad.',
    aviso:
      'Este episodio aborda presión institucional y posibles represalias, sin contenido explícito. Todo es ficticio. Puedes pausar, salir o utilizar lectura equivalente. No ingreses nombres, relatos o documentos reales.',
    rolPregunta: ED.rolPregunta,
    roles: {
      cf: 'Personal técnico de ChildFund Ecuador',
      socio: 'Personal técnico de una organización socia',
    },
    rolMensaje:
      'Tu función es comunicar la preocupación y los riesgos por el mecanismo adecuado. No debes comprobar culpabilidad ni resolver un conflicto por cuenta propia.',
    rolNotas: {
      cf: 'Para ChildFund se muestran su Punto Focal y las alternativas institucionales aplicables.',
      socio: 'Para el socio, su mecanismo y articulación con ChildFund.',
    },
  },
  herramientas: ['m5-autoridad', 'm5-ruta', 'm5-confidencialidad', 'm5-reporte', 'm5-represalias', 'm5-limites', 'm5-apoyo'],
  evaluacion: { config: configEvaluacion, preguntas, textos: textosResultado, notaUmbral },
  textosEditoriales: Object.values(ED),
};
